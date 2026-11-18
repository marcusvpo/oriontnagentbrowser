#!/usr/bin/env python3
"""
Curador em Lote de Set-of-Mark via Google Antigravity Python SDK (ADR-033).

Substitui o wrapper de subprocesso CLI (`agy.exe`) por inferência assíncrona nativa via
`google.antigravity` (v0.1.23) com Structured Outputs estritos em Pydantic (`SomTargetDecision`).

Fluxo de execução:
1. Lê a fila pendente em `auditoria/cache/pending-som-queue.json` (e espelho em `pending-som/pending-som-queue.json`).
2. Para cada entrada pendente, carrega a imagem demarcada com tags `[1]..[N]` em `auditoria/cache/pending-som/`.
3. Invoca o Antigravity SDK (`gemini-4-hydrogen-xhigh` com fallback para `gemini-4-hydrogen-high`) exigindo `SomTargetDecision`.
4. Aplica a trava da ADR-027 / ADR-033:
   - Rejeita decisões com `confidence < 0.70` ou `tag_id <= 0` / inexistente na lista de candidatos;
   - Rejeita candidatos que violem o Filtro de Zona Semântica (ADR-015), a Guarda de Navegação (ADR-024)
     ou a Matriz de Compatibilidade Semântica Intenção × Papel (ADR-027).
5. Para cada decisão aprovada (quando não estiver em `--dry-run`):
   - Atualiza o cache soberano da Camada 0.1 (`auditoria/cache/human-reviews-cache.json`) e sincroniza
     opcionalmente em `routine_reviews` via Pooler PostgreSQL IPv4;
   - Atualiza o dicionário contextual de sinônimos por rota da Camada 0.2 (`auditoria/cache/curated-route-synonyms.json`);
   - Remove o item processado de `pending-som-queue.json` para que execuções futuras resolvam em 2 ms via cache RAG.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from pydantic import BaseModel, Field

# Garante import local de config.py independentemente do diretório de trabalho
WORKER_DIR = Path(__file__).resolve().parent
if str(WORKER_DIR) not in sys.path:
    sys.path.insert(0, str(WORKER_DIR))

from config import (  # noqa: E402
    CURATED_ROUTE_SYNONYMS_FILE,
    HUMAN_REVIEWS_CACHE_FILE,
    PENDING_SOM_DIR,
    PENDING_SOM_QUEUE_NESTED,
    PENDING_SOM_QUEUE_PRIMARY,
    PROJECT_ROOT,
    OrionWorkerSettings,
    SdkTransportFn,
    create_postgres_connection,
    generate_structured_multimodal,
    load_worker_settings,
    set_sdk_transport_for_tests,
)

logger = logging.getLogger("orion.curate_som_sdk")

MIN_CONFIDENCE_THRESHOLD = 0.70

STOPWORDS = {
    "para",
    "com",
    "sem",
    "dos",
    "das",
    "que",
    "por",
    "uma",
    "uns",
    "umas",
    "como",
    "mais",
    "nao",
    "sim",
}
GEOGRAPHIC_NODE_RE = re.compile(r"\b(cidade|uf|municipio|estado|cep|endereco|logradouro|bairro|pais)\b")
GEOGRAPHIC_STEP_RE = re.compile(
    r"\b(cidade|uf|municipio|estado|cep|endereco|logradouro|bairro|localidade|ibge|comarca)\b"
)
NAV_MENTION_RE = re.compile(r"\b(menu|submenu|menus|navbar|barra superior|barra de navegacao)\b")
CARTAO_STEP_RE = re.compile(r"\bcartao\b")


class SomTargetDecision(BaseModel):
    """Schema Pydantic de saída estruturada para curadoria Set-of-Mark (ADR-033)."""

    tag_id: int = Field(description="O número da tag [N] identificada sobre o elemento correto")
    confidence: float = Field(ge=0.0, le=1.0, description="Nível de confiança da identificação")
    justification: str = Field(description="Breve explicação da escolha confrontando rótulo/ícone com o passo")
    actual_target_name: str = Field(description="Nome ou texto do elemento identificado")


def normalize_text(text: Optional[str]) -> str:
    """Normaliza string removendo acentos, marcações markdown e caracteres especiais."""
    raw = str(text or "")
    nfd = unicodedata.normalize("NFD", raw)
    without_accents = "".join(ch for ch in nfd if unicodedata.category(ch) != "Mn")
    cleaned = without_accents.replace("**", "")
    cleaned = re.sub(r"[^\w\s+>-]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().lower()
    return cleaned


def alpha_tokens(norm_str: str) -> list[str]:
    return [t.strip() for t in re.sub(r"[^a-z0-9\s]", " ", norm_str).split() if len(t.strip()) >= 2]


def has_intra_word_substring_collision(doc_target: str, candidate_name: str) -> bool:
    """
    Impede casamentos espúrios por substring intra-palavra (ex.: 'Autenticidade' vs 'Cidade' — ADR-027).
    Permite flexões normais no final da palavra com diferença <= 2 caracteres (ex.: 'aliquota' vs 'aliquotas').
    """
    doc_norm = normalize_text(doc_target)
    cand_norm = normalize_text(candidate_name)
    if not doc_norm or not cand_norm or doc_norm == cand_norm:
        return False

    doc_toks = [t for t in alpha_tokens(doc_norm) if len(t) >= 4 and t not in STOPWORDS]
    cand_toks = [t for t in alpha_tokens(cand_norm) if len(t) >= 4 and t not in STOPWORDS]
    if not doc_toks or not cand_toks:
        return False

    if any(d in cand_toks for d in doc_toks):
        return False

    hit_intra = False
    for d in doc_toks:
        for c in cand_toks:
            if d == c:
                continue
            shorter, longer = (d, c) if len(d) <= len(c) else (c, d)
            if shorter not in longer:
                continue
            is_minor_inflection = longer.startswith(shorter) and (len(longer) - len(shorter) <= 2)
            if not is_minor_inflection:
                hit_intra = True
    return hit_intra


def infer_step_intent(raw_text: str, targets: list[str], action_type: Optional[str] = None, doc_target: str = "") -> str:
    """Infere a intenção funcional do passo do manual conforme ADR-027."""
    joined = normalize_text(" ".join([raw_text, doc_target, *targets]))
    norm_target = normalize_text(doc_target)

    if (
        any(">" in t for t in targets)
        or re.search(r"\b(acesse|abra|navegue|entre)\b.{0,28}\b(menu|submenu|menus)\b", joined)
        or action_type == "navigate"
    ):
        return "navigate_menu"

    if re.search(r"\bnovo\s+cartao\b", joined) or re.search(r"\bcadastr(e|ar)\s+nov[ao]\b", joined):
        return "create_entity"

    if re.search(
        r"\b(adicionar servico|servicos realizados|efetuar servico|nome do servico|lancar ato|lancamentos?|tipo de ato|autenticidade|semelhanca|fotocopia)\b",
        joined,
    ) or (norm_target == "+" and re.search(r"\b(servico|servicos|ato|atos|pedido|lancamento)\b", joined)):
        return "launch_service_or_item"

    if re.search(r"\b(na grade|nomes encontrados|partes encontradas|registros localizados|selecionar linha)\b", joined):
        return "pick_grid_row"

    if re.search(r"\b(finalizar selecao|confirmar selecao|continuar)\b", joined) and not re.search(r"\bcaixa\b", joined):
        return "confirm_section"

    if re.search(r"\b(salvar|gravar|concluir|enviar ao caixa|transmitir|efetivar)\b", joined):
        return "submit_form"

    if re.search(r"\b(limpar|cancelar|descartar|fechar)\b", joined):
        return "cancel_or_clear"

    if re.search(r"\b(pesquis|busc|filt|localiz)\b", joined) and not re.search(
        r"\b(configur|habilit|assinale|marque|permiss|aliquota)\b", joined
    ):
        return "search_or_filter"

    if (
        re.search(
            r"\b(marqu[ae]|marcar|desmarqu[ae]|habilit|assinale|configur|parametriz|grupo|permiss|aliquota|impressora|margem|dpi|scanner)\b",
            joined,
        )
        or action_type in ("check", "select")
    ):
        return "configure_parameter"

    if re.search(r"\b(preench|digit|inform|insir)\b", joined) or action_type == "fill":
        return "fill_form_field"

    return "generic_action"


def infer_candidate_semantic_role(candidate: dict[str, Any]) -> str:
    """Infere o papel semântico do candidato caso não esteja explicitamente preenchido."""
    explicit = candidate.get("semanticRole")
    if explicit:
        return str(explicit)

    name_norm = normalize_text(candidate.get("name") or candidate.get("associatedLabel") or "")
    sec_norm = normalize_text(candidate.get("sectionTitle") or "")
    role = str(candidate.get("role") or "").lower()
    tag = str(candidate.get("tagName") or "").lower()

    if candidate.get("inNavbar"):
        return "navigation_leaf" if role == "menuitem" else "navigation_root"
    if re.search(r"\bnovo\s+(cartao|ficha|usuario|protocolo|orcamento)\b", name_norm):
        return "entity_creation_button"
    if re.search(r"ctrl\s*\+\s*b|pesquise aqui|nome da tela que deseja", name_norm):
        return "search_filter_input"
    if re.search(r"\befetuar servico\b", name_norm):
        return "service_execution_trigger"
    if candidate.get("rowContext") and (
        name_norm == "+" or re.search(r"\b(selecionar|escolher|alterar|consultar|excluir|adicionar)\b", name_norm)
    ):
        return "grid_row_picker"
    if re.match(r"^(finalizar|confirmar selecao|continuar)$", name_norm):
        return "section_confirm_button"
    if re.match(r"^(filtrar|pesquisar|buscar)$", name_norm) and (role == "button" or tag == "button"):
        return "search_trigger_button"
    if re.match(r"^(salvar|concluir|gravar|transmitir|cadastrar|confirmar)$", name_norm) and (
        role in ("button", "label") or tag == "button"
    ):
        return "form_submit"
    if re.match(r"^(limpar|cancelar|voltar|fechar)$", name_norm):
        return "form_cancel"
    if (role in ("textbox", "searchbox") or tag == "input") and (
        re.search(r"\b(busca|pesquisa|filtro)\b", sec_norm)
        or re.search(r"\b(filtrar|pesquisa|senha sga|pedido senha)\b", name_norm)
    ):
        return "search_filter_input"
    return "form_input"


def validate_som_candidate_semantics(
    item: dict[str, Any],
    candidate: dict[str, Any],
) -> tuple[bool, Optional[str]]:
    """
    Aplica a trava semântica da ADR-027 / ADR-015 / ADR-024 sobre o candidato escolhido:
    1. Filtro de Zona Semântica (`zonePolicy == 'content'` proíbe `inNavbar` / `navigation_*`);
    2. Guarda Anti-Busca Global (`CTRL + B`);
    3. Matriz de Compatibilidade Semântica Intenção × Papel (anti-'Novo cartão +', anti-'Cidade', anti-navbar).
    """
    raw_text = str(item.get("rawText") or "")
    targets: list[str] = [str(t) for t in (item.get("targets") or []) if str(t).strip()]
    if not targets and raw_text:
        targets = [raw_text]
    action_type = str(item.get("actionType") or "")
    zone_policy = str(item.get("zonePolicy") or "any")

    cand_name = str(candidate.get("name") or candidate.get("innerText") or candidate.get("associatedLabel") or "").strip()
    cand_norm = normalize_text(cand_name)
    cand_role = str(candidate.get("role") or "").lower()
    in_navbar = bool(candidate.get("inNavbar"))
    node_role = infer_candidate_semantic_role(candidate)

    # 1. Filtro de Zona Semântica (ADR-015)
    is_nav_node = in_navbar or node_role in ("navigation_root", "navigation_leaf")
    if zone_policy == "content" and is_nav_node:
        return (
            False,
            'Elemento pertence à zona de navegação lateral/superior, vedada em passo de zona "content" (ADR-015)',
        )

    # 2. Guarda Anti-Busca Global CTRL + B (ADR-024)
    if re.search(r"ctrl\s*\+\s*b|pesquise aqui o nome da tela", cand_norm):
        return False, "Busca global (CTRL + B) proibida como substituto de menu ou campo (ADR-024)"

    # 3. Matriz Intenção × Papel por alvo documentado (ADR-027)
    last_reason = "Incompatibilidade semântica Intenção × Papel (ADR-027)"
    for doc_target in targets:
        step_intent = infer_step_intent(raw_text, targets, action_type, doc_target)
        step_norm = normalize_text(" ".join([raw_text, doc_target, *targets]))
        target_norm = normalize_text(doc_target)

        if has_intra_word_substring_collision(doc_target, cand_name):
            last_reason = f'Colisão lexical intra-palavra proibida entre "{doc_target}" e "{cand_name}"'
            continue

        if (
            (re.search(r"\bnovo cartao\b", cand_norm) or node_role == "entity_creation_button")
            and not CARTAO_STEP_RE.search(step_norm)
            and (
                step_intent in ("launch_service_or_item", "search_or_filter", "configure_parameter")
                or target_norm == "+"
                or re.search(r"\badicionar\b|\bnovo pedido\b", target_norm)
            )
        ):
            last_reason = f'Papel entity_creation_button ("{cand_name}") incompatível com intenção {step_intent}'
            continue

        if (
            step_intent in ("configure_parameter", "launch_service_or_item", "fill_form_field", "generic_action")
            and GEOGRAPHIC_NODE_RE.search(cand_norm)
            and not GEOGRAPHIC_STEP_RE.search(step_norm)
        ):
            last_reason = f'Campo geográfico/endereço ("{cand_name}") incompatível com passo sem contexto geográfico'
            continue

        target_tokens = alpha_tokens(target_norm)
        cand_tokens = alpha_tokens(cand_norm)
        if (
            (in_navbar or node_role == "navigation_root")
            and step_intent != "navigate_menu"
            and not NAV_MENTION_RE.search(step_norm)
            and (len(target_tokens) >= 2 and (len(cand_tokens) < len(target_tokens) or target_norm != cand_norm))
        ):
            last_reason = f'Item raiz de navegação ("{cand_name}") incompatível com alvo composto de formulário "{doc_target}"'
            continue

        if step_intent == "navigate_menu" and (
            node_role in ("search_filter_input", "form_input")
            or cand_role in ("textbox", "searchbox", "combobox", "spinbutton", "input", "textarea")
        ):
            last_reason = f'Campo de entrada/busca ("{cand_name}") incompatível com passo de navegação'
            continue

        return True, None

    return False, last_reason


def route_key(route_hash: Optional[str]) -> str:
    """Normaliza rota hash removendo query string e IDs numéricos finais (`#/usuario/alterar/1` -> `#/usuario/alterar`)."""
    raw = str(route_hash or "").split("?")[0].rstrip("/")
    if not raw:
        return ""
    parts = raw.split("/")
    filtered = [seg for i, seg in enumerate(parts) if i < 2 or not (seg.isdigit() and i == len(parts) - 1)]
    return "/".join(filtered)


def infer_synonym_kind(role: Optional[str]) -> str:
    r = str(role or "").lower()
    if r == "tab":
        return "tab"
    if r in ("textbox", "combobox", "searchbox", "checkbox", "radio"):
        return "field"
    return "button"


def resolve_pending_queue_paths(custom_queue_path: Optional[Path] = None) -> list[Path]:
    """
    Retorna os caminhos de fila a ler/sincronizar.
    Suporta tanto `auditoria/cache/pending-som-queue.json` (ADR-033)
    quanto `auditoria/cache/pending-som/pending-som-queue.json` (ADR-031).
    """
    if custom_queue_path is not None:
        return [Path(custom_queue_path)]
    return [PENDING_SOM_QUEUE_PRIMARY, PENDING_SOM_QUEUE_NESTED]


def read_pending_som_queue(custom_queue_path: Optional[Path] = None) -> list[dict[str, Any]]:
    """Lê a fila de itens Set-of-Mark pendentes."""
    paths = resolve_pending_queue_paths(custom_queue_path)
    for p in paths:
        if p.exists():
            try:
                data = json.loads(p.read_text(encoding="utf-8"))
                if isinstance(data, list) and len(data) > 0:
                    return data
            except Exception:
                continue
    for p in paths:
        if p.exists():
            try:
                data = json.loads(p.read_text(encoding="utf-8"))
                if isinstance(data, list):
                    return data
            except Exception:
                continue
    return []


def write_pending_som_queue(items: list[dict[str, Any]], custom_queue_path: Optional[Path] = None) -> None:
    """Persiste a fila atualizada mantendo sincronizados o caminho primário e o espelho de `pending-som/`."""
    payload = json.dumps(items, indent=2, ensure_ascii=False)
    if custom_queue_path is not None:
        target = Path(custom_queue_path)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(payload, encoding="utf-8")
        return

    for target in (PENDING_SOM_QUEUE_PRIMARY, PENDING_SOM_QUEUE_NESTED):
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(payload, encoding="utf-8")


def resolve_som_image_path(som_image_path: str, project_root: Path = PROJECT_ROOT) -> Path:
    """Resolve o caminho da imagem SoM em `auditoria/cache/pending-som/`."""
    candidate = Path(som_image_path)
    if candidate.is_absolute() and candidate.exists():
        return candidate
    rel_from_root = (project_root / som_image_path).resolve()
    if rel_from_root.exists():
        return rel_from_root
    in_pending_dir = (PENDING_SOM_DIR / Path(som_image_path).name).resolve()
    return in_pending_dir


def upsert_human_review_cache(
    routine_id: str,
    step_number: int,
    documented_target: str,
    actual_target: str,
    preferred_zone: Optional[str],
    justification: str,
    cache_file: Path = HUMAN_REVIEWS_CACHE_FILE,
    sync_to_supabase: bool = False,
    settings: Optional[OrionWorkerSettings] = None,
) -> dict[str, Any]:
    """
    Atualiza `auditoria/cache/human-reviews-cache.json` (Camada 0.1 RAG) com a decisão aprovada
    pelo curador SDK, preservando a compatibilidade com `human-review-rag.ts`.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    if cache_file.exists():
        try:
            kb = json.loads(cache_file.read_text(encoding="utf-8"))
        except Exception:
            kb = {}
    else:
        kb = {}

    if not isinstance(kb, dict):
        kb = {}

    kb.setdefault("loadedAt", now_iso)
    kb.setdefault("source", "cache")
    reviews: list[dict[str, Any]] = kb.setdefault("reviews", [])
    by_routine: dict[str, Any] = kb.setdefault("byRoutine", {})
    kb.setdefault(
        "crossRoutine",
        {
            "globalMenuEquivalences": [],
            "globalAntiTargets": [],
            "globalGridIconAliases": {"visualizar": "Consultar", "editar": "Alterar", "remover": "Excluir"},
            "forbidRbacForFullAccess": True,
        },
    )

    safe_slug = re.sub(r"[^a-z0-9]", "-", routine_id.lower())
    rev_id = f"rev-som-{safe_slug}-p{step_number}"
    motivo = (
        f"Curadoria Visual Set-of-Mark (ADR-033 SDK) no passo {step_number}: "
        f"'{documented_target}' -> '{actual_target}' ({justification})."
    )

    existing_idx = next((i for i, r in enumerate(reviews) if r.get("id") == rev_id), -1)
    version = (int(reviews[existing_idx].get("versao", 1)) + 1) if existing_idx >= 0 else 1
    record = {
        "id": rev_id,
        "routineId": routine_id,
        "revisor": "Curadoria Visual SoM SDK (ADR-033)",
        "categoria": "atualizacao_editorial",
        "passos": [step_number],
        "motivo": motivo,
        "status": "aberta",
        "versao": version,
        "atualizadoEm": now_iso,
    }

    if existing_idx >= 0:
        reviews[existing_idx] = record
    else:
        reviews.append(record)

    guidance = by_routine.get(routine_id)
    if not isinstance(guidance, dict):
        guidance = {
            "routineId": routine_id,
            "reviews": [],
            "menuOverrides": [],
            "targetOverrides": [],
            "forbiddenTargets": [],
            "searchFlowSteps": [],
            "implicitTargetsByStep": {},
            "forbidFalseRbac": False,
        }
        by_routine[routine_id] = guidance

    guidance["reviews"] = [r for r in reviews if r.get("routineId") == routine_id]
    target_overrides: list[dict[str, Any]] = guidance.setdefault("targetOverrides", [])

    norm_doc = normalize_text(documented_target)
    norm_act = normalize_text(actual_target)
    already_exists = False
    for ov in target_overrides:
        ov_step = ov.get("stepNumber")
        if (ov_step is None or ov_step == step_number) and normalize_text(ov.get("documented")) == norm_doc:
            ov["actual"] = actual_target
            if preferred_zone:
                ov["preferredZone"] = preferred_zone
            already_exists = True
            break

    if not already_exists:
        new_ov: dict[str, Any] = {
            "stepNumber": step_number,
            "documented": documented_target,
            "actual": actual_target,
        }
        if preferred_zone:
            new_ov["preferredZone"] = preferred_zone
        target_overrides.append(new_ov)

    kb["loadedAt"] = now_iso
    cache_file.parent.mkdir(parents=True, exist_ok=True)
    cache_file.write_text(json.dumps(kb, indent=2, ensure_ascii=False), encoding="utf-8")

    if sync_to_supabase:
        cfg = settings or load_worker_settings()
        if cfg.is_postgres_pooler_configured:
            try:
                conn = create_postgres_connection(cfg)
                with conn:
                    with conn.cursor() as cur:
                        cur.execute(
                            """
                            INSERT INTO routine_reviews (id, routine_id, revisor, categoria, passos, motivo, status, versao, atualizado_em)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                            ON CONFLICT (id) DO UPDATE SET
                              revisor = EXCLUDED.revisor,
                              categoria = EXCLUDED.categoria,
                              passos = EXCLUDED.passos,
                              motivo = EXCLUDED.motivo,
                              status = EXCLUDED.status,
                              versao = EXCLUDED.versao,
                              atualizado_em = EXCLUDED.atualizado_em;
                            """,
                            (
                                record["id"],
                                record["routineId"],
                                record["revisor"],
                                record["categoria"],
                                json.dumps(record["passos"]),
                                record["motivo"],
                                record["status"],
                                record["versao"],
                                record["atualizadoEm"],
                            ),
                        )
                conn.close()
            except Exception as exc:
                logger.debug("Fallback offline ao sincronizar revisão com PostgreSQL pooler: %s", exc)

    return kb


def upsert_curated_route_synonym(
    route_hash: Optional[str],
    documented_target: str,
    actual_target: str,
    role: Optional[str],
    routine_id: str,
    step_number: int,
    confidence: float,
    justification: str,
    synonyms_file: Path = CURATED_ROUTE_SYNONYMS_FILE,
) -> list[dict[str, Any]]:
    """Persiste idempotentemente o sinônimo contextual por rota (Camada 0.2 — `curated-route-synonyms.json`)."""
    norm_route = route_key(route_hash)
    norm_doc = normalize_text(documented_target)
    if not norm_route or not norm_doc or not actual_target.strip():
        return []

    current: list[dict[str, Any]] = []
    if synonyms_file.exists():
        try:
            parsed = json.loads(synonyms_file.read_text(encoding="utf-8"))
            if isinstance(parsed, list):
                current = parsed
        except Exception:
            current = []

    entry = {
        "route": norm_route,
        "documented": documented_target,
        "real": [actual_target.strip()],
        "kind": infer_synonym_kind(role),
        "evidence": (
            f"Curadoria visual SoM SDK ({routine_id} passo {step_number}, "
            f"conf {round(confidence * 100)}%): {justification}"
        ),
    }

    existing_idx = next(
        (
            i
            for i, s in enumerate(current)
            if route_key(s.get("route")) == norm_route and normalize_text(s.get("documented")) == norm_doc
        ),
        -1,
    )
    if existing_idx >= 0:
        current[existing_idx] = entry
    else:
        current.append(entry)

    synonyms_file.parent.mkdir(parents=True, exist_ok=True)
    synonyms_file.write_text(json.dumps(current, indent=2, ensure_ascii=False), encoding="utf-8")
    return current


def build_som_curation_prompt(item: dict[str, Any]) -> str:
    """Constrói o prompt multimodal para o modelo selecionar a tag `[N]` Set-of-Mark."""
    candidates = item.get("candidates") or []
    legend_lines = []
    for c in candidates:
        sec = f" {{seção: {c.get('sectionTitle')}}}" if c.get("sectionTitle") else ""
        hint = (
            f" (hint: {c.get('associatedLabel')})"
            if c.get("associatedLabel") and c.get("associatedLabel") != c.get("name")
            else ""
        )
        legend_lines.append(
            f"[{c.get('id')}] <{c.get('tagName', 'div')} role=\"{c.get('role', 'button')}\"> "
            f"\"{c.get('name', '')}\"{sec}{hint}"
        )

    return "\n".join(
        [
            "Você é o Curador Visual Set-of-Mark pós-lote (ADR-031 / ADR-033) do ERP Orion TN (Siplan).",
            f"Rotina: {item.get('routineId')} | Passo: {item.get('stepNumber')} | Rota: {item.get('routeHash') or '(raiz)'}",
            f"Texto do passo no manual: \"{item.get('rawText')}\"",
            f"Alvos procurados: {json.dumps(item.get('targets') or [], ensure_ascii=False)}",
            f"Política de zona semântica: {item.get('zonePolicy', 'any')}",
            "Candidatos interativos numerados na imagem Set-of-Mark [1..N]:",
            "\n".join(legend_lines),
            "",
            "Instruções obrigatórias:",
            "1. Identifique a tag [N] que corresponde exatamente à intenção funcional do passo.",
            "2. Caso nenhum candidato corresponda com segurança, retorne tag_id=0 e confidence=0.0.",
            "3. Preencha actual_target_name com o nome/rótulo real do elemento selecionado.",
        ]
    )


async def curate_pending_som_batch(
    *,
    limit: Optional[int] = None,
    dry_run: bool = False,
    verbose: bool = False,
    sync_to_supabase: bool = False,
    queue_path: Optional[Path] = None,
    human_reviews_cache_path: Path = HUMAN_REVIEWS_CACHE_FILE,
    route_synonyms_path: Path = CURATED_ROUTE_SYNONYMS_FILE,
    project_root: Path = PROJECT_ROOT,
    custom_transport: Optional[SdkTransportFn] = None,
    settings: Optional[OrionWorkerSettings] = None,
) -> dict[str, Any]:
    """
    Processa os itens pendentes em `pending-som-queue.json` via Antigravity Python SDK (`SomTargetDecision`).
    """
    if custom_transport is not None:
        set_sdk_transport_for_tests(custom_transport)

    queue = read_pending_som_queue(queue_path)
    pending_items = [item for item in queue if item.get("status", "pending") == "pending"]

    if limit is not None and limit >= 0:
        pending_to_process = pending_items[:limit]
    else:
        pending_to_process = pending_items

    if not pending_to_process:
        if verbose:
            logger.info("Nenhum item pendente na fila Set-of-Mark.")
        return {
            "total_in_queue": len(queue),
            "processed": 0,
            "approved": 0,
            "rejected": 0,
            "remaining_in_queue": len(queue),
            "decisions": [],
        }

    approved_count = 0
    rejected_count = 0
    error_count = 0
    decisions_log: list[dict[str, Any]] = []
    approved_ids: set[str] = set()

    for item in pending_to_process:
        item_id = str(item.get("id") or f"{item.get('routineId')}-passo-{item.get('stepNumber')}")
        routine_id = str(item.get("routineId") or "UNKNOWN")
        step_number = int(item.get("stepNumber") or 1)
        candidates: list[dict[str, Any]] = list(item.get("candidates") or [])
        som_img_path = resolve_som_image_path(str(item.get("somImagePath") or ""), project_root=project_root)

        if not som_img_path.exists() or not candidates:
            reason = "Imagem SoM ausente em disco ou lista de candidatos vazia"
            item["status"] = "rejected"
            item["curationDecision"] = {
                "tagId": None,
                "confidence": 0.0,
                "reason": reason,
                "curatedAt": datetime.now(timezone.utc).isoformat(),
            }
            rejected_count += 1
            decisions_log.append(
                {
                    "id": item_id,
                    "routineId": routine_id,
                    "stepNumber": step_number,
                    "Outcome": "rejected",
                    "reason": reason,
                }
            )
            continue

        prompt = build_som_curation_prompt(item)
        try:
            decision, model_used = await generate_structured_multimodal(
                prompt=prompt,
                image_path=som_img_path,
                schema_cls=SomTargetDecision,
                settings=settings,
            )
        except Exception as exc:
            # Falha de infraestrutura (sessão/cota/timeout) NÃO é decisão de curadoria:
            # o item permanece `pending` na fila para a próxima execução.
            reason = f"Falha na inferência SDK (item mantido pendente): {exc}"
            error_count += 1
            decisions_log.append(
                {
                    "id": item_id,
                    "routineId": routine_id,
                    "stepNumber": step_number,
                    "Outcome": "pending_error",
                    "reason": reason,
                }
            )
            continue

        if verbose:
            logger.info(
                "[%s P%d] Modelo=%s | tag_id=%d | conf=%.2f | target='%s' | just='%s'",
                routine_id,
                step_number,
                model_used,
                decision.tag_id,
                decision.confidence,
                decision.actual_target_name,
                decision.justification,
            )

        # Trava de confiança mínima (ADR-027 / ADR-033: confidence >= 0.70)
        if decision.tag_id <= 0 or decision.confidence < MIN_CONFIDENCE_THRESHOLD:
            reason = (
                f"Confiança insuficiente ({decision.confidence:.2f} < {MIN_CONFIDENCE_THRESHOLD:.2f}) "
                f"ou tag_id inválido ({decision.tag_id}): {decision.justification}"
            )
            item["status"] = "rejected"
            item["curationDecision"] = {
                "tagId": decision.tag_id if decision.tag_id > 0 else None,
                "confidence": decision.confidence,
                "reason": reason,
                "curatedAt": datetime.now(timezone.utc).isoformat(),
            }
            rejected_count += 1
            decisions_log.append(
                {
                    "id": item_id,
                    "routineId": routine_id,
                    "stepNumber": step_number,
                    "Outcome": "rejected",
                    "confidence": decision.confidence,
                    "reason": reason,
                }
            )
            continue

        chosen = next((c for c in candidates if int(c.get("id", -1)) == decision.tag_id), None)
        if chosen is None:
            reason = f"Tag [{decision.tag_id}] inexistente na lista de candidatos do passo"
            item["status"] = "rejected"
            item["curationDecision"] = {
                "tagId": decision.tag_id,
                "confidence": decision.confidence,
                "reason": reason,
                "curatedAt": datetime.now(timezone.utc).isoformat(),
            }
            rejected_count += 1
            decisions_log.append(
                {
                    "id": item_id,
                    "routineId": routine_id,
                    "stepNumber": step_number,
                    "Outcome": "rejected",
                    "confidence": decision.confidence,
                    "reason": reason,
                }
            )
            continue

        # Trava semântica pós-VLM (ADR-027)
        allowed, veto_reason = validate_som_candidate_semantics(item, chosen)
        if not allowed:
            reason = f"Veto semântico pós-VLM (ADR-027): {veto_reason}"
            item["status"] = "rejected"
            item["curationDecision"] = {
                "tagId": decision.tag_id,
                "matchedName": chosen.get("name"),
                "confidence": decision.confidence,
                "reason": reason,
                "curatedAt": datetime.now(timezone.utc).isoformat(),
            }
            rejected_count += 1
            decisions_log.append(
                {
                    "id": item_id,
                    "routineId": routine_id,
                    "stepNumber": step_number,
                    "Outcome": "rejected",
                    "confidence": decision.confidence,
                    "reason": reason,
                }
            )
            continue

        targets_list = item.get("targets") or []
        documented_target = str(targets_list[0] if targets_list else item.get("rawText") or "").strip()
        actual_name = str(
            chosen.get("innerText") or chosen.get("name") or decision.actual_target_name or ""
        ).strip()

        if not dry_run:
            upsert_human_review_cache(
                routine_id=routine_id,
                step_number=step_number,
                documented_target=documented_target,
                actual_target=actual_name,
                preferred_zone=item.get("zonePolicy"),
                justification=decision.justification,
                cache_file=human_reviews_cache_path,
                sync_to_supabase=sync_to_supabase,
                settings=settings,
            )
            upsert_curated_route_synonym(
                route_hash=item.get("routeHash"),
                documented_target=documented_target,
                actual_target=actual_name,
                role=chosen.get("role"),
                routine_id=routine_id,
                step_number=step_number,
                confidence=decision.confidence,
                justification=decision.justification,
                synonyms_file=route_synonyms_path,
            )

        approved_count += 1
        approved_ids.add(item_id)
        decisions_log.append(
            {
                "id": item_id,
                "routineId": routine_id,
                "stepNumber": step_number,
                "Outcome": "approved",
                "tagId": decision.tag_id,
                "documentedTarget": documented_target,
                "actualTarget": actual_name,
                "confidence": decision.confidence,
                "justification": decision.justification,
                "model": model_used,
            }
        )

    # Remove os itens aprovados da fila pendente quando não estiver em --dry-run
    if not dry_run:
        updated_queue = [q for q in queue if str(q.get("id") or "") not in approved_ids]
        write_pending_som_queue(updated_queue, queue_path)
    else:
        updated_queue = queue

    return {
        "total_in_queue": len(queue),
        "processed": len(pending_to_process),
        "approved": approved_count,
        "rejected": rejected_count,
        "inference_errors": error_count,
        "remaining_in_queue": len(updated_queue),
        "dry_run": dry_run,
        "decisions": decisions_log,
    }


def parse_cli_args(argv: Optional[list[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Curador em lote Set-of-Mark via Google Antigravity Python SDK (ADR-033)"
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Número máximo de itens pendentes a processar nesta execução",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Executa a inferência e validação sem gravar alterações em disco ou banco",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Exibe logs detalhados de cada decisão do modelo",
    )
    parser.add_argument(
        "--sync-supabase",
        action="store_true",
        help="Sincroniza as revisões aprovadas diretamente na tabela routine_reviews via Pooler IPv4",
    )
    return parser.parse_args(argv)


async def async_main(argv: Optional[list[str]] = None) -> int:
    args = parse_cli_args(argv)
    logging.basicConfig(
        level=logging.INFO if args.verbose else logging.WARNING,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )

    cfg = load_worker_settings()
    print("====================================================")
    print("  ORION TN — CURADORIA VISUAL SDK (ADR-033)         ")
    print(f"  Modelo Primário: {cfg.primary_model}              ")
    print(f"  Fallback:        {cfg.fallback_model}             ")
    print(f"  Modo:            {'DRY-RUN (Simulação)' if args.dry_run else 'WRITE (Camadas 0.1 + 0.2)'}")
    print("====================================================")

    summary = await curate_pending_som_batch(
        limit=args.limit,
        dry_run=args.dry_run,
        verbose=args.verbose,
        sync_to_supabase=args.sync_supabase and not args.dry_run,
        settings=cfg,
    )

    print(f"  Total na fila inicial:     {summary['total_in_queue']}")
    print(f"  Processados neste lote:    {summary['processed']}")
    print(f"  Aprovados (RAG 0.1 / 0.2): {summary['approved']}")
    print(f"  Rejeitados / Vetados:      {summary['rejected']}")
    print(f"  Erros de inferência (mantidos pendentes): {summary.get('inference_errors', 0)}")
    print(f"  Restantes na fila:         {summary['remaining_in_queue']}")
    print("====================================================")
    return 0


def main() -> None:
    try:
        exit_code = asyncio.run(async_main())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        sys.exit(130)


if __name__ == "__main__":
    main()
