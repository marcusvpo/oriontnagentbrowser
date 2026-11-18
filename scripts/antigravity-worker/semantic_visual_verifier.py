#!/usr/bin/env python3
"""
Verificador Semântico Multimodal Pós-Lote via Google Antigravity Python SDK (ADR-033).

Inspeciona os relatórios `*-revisado.md` de rotinas com status `validado_com_ajustes` e passos
que sofreram Auto-Cura (`auditoria_ui.auto_cura.divergencias_detectadas`), confrontando a imagem
final demarcada (`passo-NN.webp` ou `passo-NN.png`) com a intenção do texto do passo.

Regras:
- Define o schema estruturado `SemanticAuditResult` (Pydantic).
- Gera o relatório consolidado em `auditoria/cache/semantic-audit-report.json`.
- Caso `visual_confidence < 0.85` ou `semantic_match == False`, sinaliza o passo para revisão
  prioritária no Orion Audit Console (e atualiza opcionalmente `governance.json` / `routine_reviews`
  quando solicitado), prevenindo falsos-positivos semânticos.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import yaml
from pydantic import BaseModel, Field

WORKER_DIR = Path(__file__).resolve().parent
if str(WORKER_DIR) not in sys.path:
    sys.path.insert(0, str(WORKER_DIR))

from config import (  # noqa: E402
    CACHE_DIR,
    PROJECT_ROOT,
    ROTINAS_DIR,
    SEMANTIC_AUDIT_REPORT_FILE,
    OrionWorkerSettings,
    SdkTransportFn,
    create_postgres_connection,
    generate_structured_multimodal,
    load_worker_settings,
    prepare_agy_image,
    set_sdk_transport_for_tests,
)

logger = logging.getLogger("orion.semantic_visual_verifier")

MIN_VISUAL_CONFIDENCE_THRESHOLD = 0.85
GOVERNANCE_CACHE_FILE = CACHE_DIR / "governance.json"

# Assinatura gravada em `governance.json` / `routines.revisor` pelo próprio verificador. Só sinalizações com
# esta assinatura podem ser liberadas por ele (nunca a governança feita por um revisor humano).
VERIFIER_REVISOR = "Verificador Semântico SDK (ADR-033)"
VERIFIER_PENDING_STATUS = "pendente_aprovacao"

# Sub-captura do mesmo passo: `passo-05-b.png` (elemento revelado após a ação), `passo-05-c.png`...
# Fora do padrão de propósito: `passo-NN-contexto-att` (print de contexto do Raio-X) não é sub-captura.
_SUB_CAPTURE_RE = re.compile(r"^passo-(\d{2})-([a-z])\.(png|webp)$", re.IGNORECASE)


class SemanticAuditResult(BaseModel):
    """Schema Pydantic de verificação semântica multimodal pós-lote (ADR-033)."""

    routine_id: str
    step_number: int
    semantic_match: bool = Field(description="True se a caixa demarcada corresponde ao que o passo solicita")
    visual_confidence: float = Field(ge=0.0, le=1.0)
    discrepancy_reason: Optional[str] = Field(
        default=None, description="Motivo caso haja divergência visual ou semântica"
    )


def parse_revised_markdown_file(md_path: Path) -> Optional[dict[str, Any]]:
    """
    Lê um arquivo `*-revisado.md`, extrai o frontmatter YAML e mapeia o texto de cada passo
    da seção `#### Passo a passo...`.
    """
    if not md_path.exists():
        return None
    try:
        raw_content = md_path.read_text(encoding="utf-8").replace("\r\n", "\n")
    except Exception:
        return None

    parts = re.split(r"^---$", raw_content, maxsplit=2, flags=re.MULTILINE)
    if len(parts) < 3:
        return None

    try:
        frontmatter = yaml.safe_load(parts[1].strip()) or {}
    except Exception:
        return None

    if not isinstance(frontmatter, dict) or not frontmatter.get("id"):
        return None

    body = parts[2]
    steps_map: dict[int, str] = {}
    section_match = re.search(
        r"#### Passo a passo[^\n]*:\s*\n([\s\S]*?)(?=\n#### |\n---\s*\n|$)",
        body,
    )
    section_text = section_match.group(1) if section_match else body
    for m in re.finditer(r"^\s*(\d+)\.\s*(.+)$", section_text, flags=re.MULTILINE):
        step_num = int(m.group(1))
        step_text = m.group(2).strip()
        steps_map[step_num] = step_text

    return {
        "file_path": md_path,
        "folder_path": md_path.parent,
        "routine_id": str(frontmatter.get("id")),
        "titulo": str(frontmatter.get("titulo") or ""),
        "modulo": str(frontmatter.get("modulo") or md_path.parent.parent.name),
        "frontmatter": frontmatter,
        "steps_map": steps_map,
        "mtime": md_path.stat().st_mtime,
    }


def find_sub_capture_images(folder: Path, step_num: int) -> list[Path]:
    """
    Sub-capturas do passo (`passo-NN-b`, `-c`...), em ordem alfabética. Quando o motor revela um alvo que só
    aparece após a ação do passo (ex.: **Concluir** depois de **Adicionar**, ADR-017/019), o gatilho fica em
    `passo-NN` e o elemento revelado em `passo-NN-b`. O verificador precisa ver o conjunto, não só a primeira.
    Prefere `.png` (legível pelo `agy`); só usa `.webp` quando não há `.png` pareado.
    """
    if not folder.exists():
        return []
    pad = f"{step_num:02d}"
    by_letter: dict[str, Path] = {}
    for entry in sorted(folder.iterdir()):
        m = _SUB_CAPTURE_RE.match(entry.name)
        if not m or m.group(1) != pad:
            continue
        letter = m.group(2).lower()
        current = by_letter.get(letter)
        if current is None or (current.suffix.lower() == ".webp" and entry.suffix.lower() == ".png"):
            by_letter[letter] = entry
    return [by_letter[k] for k in sorted(by_letter)]


def discover_healed_steps_in_routines(
    rotinas_dir: Path = ROTINAS_DIR,
    routine_filter: Optional[set[str]] = None,
) -> list[dict[str, Any]]:
    """
    Varre `auditoria/rotinas/` em busca de relatórios `*-revisado.md` com
    `auditoria_ui.status == 'validado_com_ajustes'` e passos auto-curados em
    `auditoria_ui.auto_cura.divergencias_detectadas`.
    """
    if not rotinas_dir.exists():
        return []

    latest_by_routine: dict[str, dict[str, Any]] = {}
    for md_path in rotinas_dir.rglob("*-revisado.md"):
        parsed = parse_revised_markdown_file(md_path)
        if not parsed:
            continue
        rid = parsed["routine_id"]
        if routine_filter and rid not in routine_filter:
            continue
        existing = latest_by_routine.get(rid)
        if existing is None or parsed["mtime"] > existing["mtime"]:
            latest_by_routine[rid] = parsed

    candidates: list[dict[str, Any]] = []
    for rid, info in sorted(latest_by_routine.items(), key=lambda kv: kv[0]):
        fm = info["frontmatter"]
        audit_ui = fm.get("auditoria_ui") or {}
        if str(audit_ui.get("status") or "") != "validado_com_ajustes":
            continue

        auto_cura = audit_ui.get("auto_cura") or {}
        divergences = auto_cura.get("divergencias_detectadas") or []
        if not isinstance(divergences, list) or not divergences:
            continue

        # Agrupa divergências por número de passo
        by_step: dict[int, list[dict[str, Any]]] = {}
        for d in divergences:
            if not isinstance(d, dict):
                continue
            step_num = int(d.get("passo") or 0)
            if step_num <= 0:
                continue
            by_step.setdefault(step_num, []).append(d)

        for step_num, step_divs in sorted(by_step.items()):
            folder: Path = info["folder_path"]
            pad = f"{step_num:02d}"
            webp_path = folder / f"passo-{pad}.webp"
            png_path = folder / f"passo-{pad}.png"
            image_path = webp_path if webp_path.exists() else (png_path if png_path.exists() else None)
            if image_path is None:
                continue

            step_text = info["steps_map"].get(step_num, "")
            candidates.append(
                {
                    "routine_id": rid,
                    "titulo": info["titulo"],
                    "modulo": info["modulo"],
                    "step_number": step_num,
                    "step_text": step_text,
                    "divergences": step_divs,
                    "image_path": image_path,
                    "sub_images": find_sub_capture_images(folder, step_num),
                    "report_path": info["file_path"],
                }
            )

    return candidates


def build_semantic_verification_prompt(candidate: dict[str, Any]) -> str:
    """Constrói o prompt de auditoria cruzada multimodal para um passo auto-curado."""
    divs_summary = []
    for d in candidate.get("divergences") or []:
        divs_summary.append(
            f"- Alvo original do manual: \"{d.get('alvo_documentado')}\" -> "
            f"Elemento auto-curado na tela: \"{d.get('elemento_real')}\" "
            f"(camada: {d.get('camada')}, confiança: {d.get('confianca')})"
        )

    lines = [
        "Você é o Auditor Semântico Multimodal Pós-Lote (ADR-033) do sistema Orion TN (Siplan).",
        f"Rotina: {candidate['routine_id']} ({candidate.get('titulo', '')}) | Módulo: {candidate.get('modulo', '')}",
        f"Passo auditado: Passo {candidate['step_number']}",
        f"Texto do passo: \"{candidate.get('step_text', '')}\"",
        "Histórico de Auto-Cura aplicada neste passo:",
        "\n".join(divs_summary),
        "",
    ]

    sub_images: list[Path] = [Path(p) for p in (candidate.get("sub_images") or [])]
    if sub_images:
        lines.append(
            "Imagens do passo: a imagem principal anexa é `passo-NN` e as sub-capturas abaixo pertencem ao MESMO passo "
            "(estado da tela depois da ação do passo, com os elementos que só aparecem após ela):"
        )
        for sub in sub_images:
            lines.append(f"[Sub-captura do mesmo passo: {_image_mention(sub)}]")
        lines.append("")

    lines.extend(
        [
            "Auditoria Cruzada Estrita:",
            "1. Inspecione na(s) imagem(ns) a moldura em Carmesim Siplan (#ad0505) e o badge numérico.",
            "2. Verifique se o controle, campo, aba ou menu focalizado pela demarcação carmesim corresponde "
            "de fato à intenção funcional descrita no texto do passo.",
            "3. Se a moldura estiver destacando um elemento incorreto (ex.: barra superior genérica quando o passo "
            "pede um campo de formulário, botão 'Novo cartão +' em vez de '+' da grade, cabeçalho de coluna da grade "
            "quando o passo pede o campo de digitação, ou campo 'Cidade' em vez de 'Autenticidade'), "
            "defina semantic_match=False e explique detalhadamente em discrepancy_reason.",
            "",
            "Convenções do motor de auditoria (NÃO são falhas; não reprove por elas):",
            "a) Gatilho + elemento revelado (ADR-017/019): quando o passo cita um botão que só aparece depois de acionar "
            "outro (ex.: **Concluir** \"exibido após clicar em **Adicionar**\"), a imagem principal demarca o GATILHO "
            "(**Adicionar**) e a sub-captura `passo-NN-b` demarca o elemento revelado (**Concluir**), continuando a "
            "numeração. Julgue o CONJUNTO das imagens: se a união das demarcações cobre o que o passo pede, "
            "semantic_match=True.",
            "b) Valor de lista suspensa (ADR-018): quando o passo cita um valor de lista (ex.: \"Reconhecimento AEDO\"), "
            "a moldura envolve o campo <select> que contém exatamente esse valor e o rótulo do badge repete o texto do "
            "manual. Aprove se o campo demarcado de fato oferece o valor citado.",
            "c) A lupa \"LUPA DE DETALHE (2.5x)\" é um recurso visual do anotador para alvos pequenos, não parte da tela.",
            "d) Badge/rótulo que cobre um campo VIZINHO não invalida a demarcação; avalie somente se o elemento "
            "enquadrado é o correto.",
            "",
            f"4. Retorne routine_id=\"{candidate['routine_id']}\" e step_number={candidate['step_number']}.",
        ]
    )
    return "\n".join(lines)


def prepare_sub_images(sub_images: list[Path]) -> tuple[list[Path], list[Path]]:
    """
    Devolve `(imagens_legiveis_pelo_agy, temporarios_a_remover)`. Sub-captura `.webp` usa o `.png` pareado quando
    existe; sem par é convertida para PNG temporário. Sub-captura ausente/ilegível é ignorada (o passo ainda é
    avaliado pela imagem principal).
    """
    prepared: list[Path] = []
    temps: list[Path] = []
    for sub in sub_images:
        try:
            ready, temp = prepare_agy_image(sub)
        except Exception as exc:  # arquivo removido/corrompido: não derruba o lote
            logger.warning("Sub-captura %s ignorada: %s", sub, exc)
            continue
        prepared.append(ready)
        if temp is not None:
            temps.append(temp)
    return prepared, temps


def _image_mention(path: Path) -> str:
    """Menção `@caminho-relativo (caminho-absoluto)` no formato lido pelo `agy` (igual à imagem principal)."""
    abs_path = Path(path).resolve()
    try:
        mention = abs_path.relative_to(PROJECT_ROOT).as_posix()
    except ValueError:
        mention = abs_path.as_posix()
    return f"@{mention} ({abs_path.as_posix()})"


def flag_step_for_priority_review(
    result: SemanticAuditResult,
    candidate: dict[str, Any],
    *,
    governance_file: Path = GOVERNANCE_CACHE_FILE,
    sync_to_supabase: bool = False,
    settings: Optional[OrionWorkerSettings] = None,
) -> None:
    """
    Sinaliza a rotina/passo com suspeita de falso-positivo semântico para revisão prioritária
    no Orion Audit Console (`governance.json` local e opcionalmente no Supabase via Pooler IPv4).
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    gov_data: dict[str, Any] = {}
    if governance_file.exists():
        try:
            loaded = json.loads(governance_file.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                gov_data = loaded
        except Exception:
            gov_data = {}

    reason_msg = (
        result.discrepancy_reason
        or f"Confiança visual abaixo do limiar ({result.visual_confidence:.2f} < {MIN_VISUAL_CONFIDENCE_THRESHOLD:.2f})"
    )
    comment = (
        f"[ALERTA SEMÂNTICO MULTIMODAL ADR-033 — Passo {result.step_number}] "
        f"Possível falso-positivo de auto-cura (conf={result.visual_confidence:.2f}, match={result.semantic_match}): {reason_msg}"
    )

    entry = gov_data.get(result.routine_id)
    if not isinstance(entry, dict):
        entry = {}
    entry["statusGovernanca"] = "revisao_solicitada"
    entry["revisor"] = VERIFIER_REVISOR
    entry["comentario"] = comment
    entry["updatedAt"] = now_iso
    entry["prioritySemanticFlag"] = {
        "stepNumber": result.step_number,
        "semanticMatch": result.semantic_match,
        "visualConfidence": result.visual_confidence,
        "discrepancyReason": reason_msg,
        "flaggedAt": now_iso,
    }
    gov_data[result.routine_id] = entry

    governance_file.parent.mkdir(parents=True, exist_ok=True)
    governance_file.write_text(json.dumps(gov_data, indent=2, ensure_ascii=False), encoding="utf-8")

    if sync_to_supabase:
        cfg = settings or load_worker_settings()
        if cfg.is_postgres_pooler_configured:
            try:
                conn = create_postgres_connection(cfg)
                with conn:
                    with conn.cursor() as cur:
                        cur.execute(
                            """
                            UPDATE routines
                            SET status_governanca = 'revisao_solicitada',
                                revisor = %s,
                                comentario_governanca = %s,
                                atualizado_em = %s
                            WHERE id = %s;
                            """,
                            (VERIFIER_REVISOR, comment, now_iso, result.routine_id),
                        )
                conn.close()
            except Exception as exc:
                logger.debug("Fallback offline ao sinalizar revisão prioritária no PostgreSQL: %s", exc)


async def verify_healed_routines_batch(
    *,
    rotinas_dir: Path = ROTINAS_DIR,
    report_output_path: Path = SEMANTIC_AUDIT_REPORT_FILE,
    governance_file: Path = GOVERNANCE_CACHE_FILE,
    routine_ids: Optional[list[str]] = None,
    limit: Optional[int] = None,
    dry_run: bool = False,
    verbose: bool = False,
    sync_to_supabase: bool = False,
    custom_transport: Optional[SdkTransportFn] = None,
    settings: Optional[OrionWorkerSettings] = None,
) -> dict[str, Any]:
    """
    Executa a verificação semântica multimodal pós-lote sobre passos auto-curados e gera
    `auditoria/cache/semantic-audit-report.json`.
    """
    if custom_transport is not None:
        set_sdk_transport_for_tests(custom_transport)

    routine_filter = {r.strip() for r in routine_ids if r.strip()} if routine_ids else None
    all_candidates = discover_healed_steps_in_routines(rotinas_dir=rotinas_dir, routine_filter=routine_filter)

    if limit is not None and limit >= 0:
        candidates = all_candidates[:limit]
    else:
        candidates = all_candidates

    results_list: list[dict[str, Any]] = []
    flagged_priority_list: list[dict[str, Any]] = []
    approved_count = 0
    flagged_count = 0

    for cand in candidates:
        rid = cand["routine_id"]
        step_num = cand["step_number"]
        img_path: Path = cand["image_path"]
        # ADR-035: o gatilho fica em `passo-NN` e o elemento revelado em `passo-NN-b`; o modelo vê o conjunto
        sub_ready, sub_temps = prepare_sub_images(list(cand.get("sub_images") or []))
        prompt = build_semantic_verification_prompt({**cand, "sub_images": sub_ready})

        try:
            audit_res, model_used = await generate_structured_multimodal(
                prompt=prompt,
                image_path=img_path,
                schema_cls=SemanticAuditResult,
                settings=settings,
            )
            # Garante consistência do identificador do passo
            audit_res = SemanticAuditResult(
                routine_id=rid,
                step_number=step_num,
                semantic_match=audit_res.semantic_match,
                visual_confidence=audit_res.visual_confidence,
                discrepancy_reason=audit_res.discrepancy_reason,
            )
        except Exception as exc:
            audit_res = SemanticAuditResult(
                routine_id=rid,
                step_number=step_num,
                semantic_match=False,
                visual_confidence=0.0,
                discrepancy_reason=f"Erro na verificação multimodal SDK: {exc}",
            )
            model_used = "error"
        finally:
            for temp in sub_temps:
                try:
                    temp.unlink()
                except OSError:
                    pass

        needs_priority_review = (
            not audit_res.semantic_match or audit_res.visual_confidence < MIN_VISUAL_CONFIDENCE_THRESHOLD
        )

        if verbose:
            logger.info(
                "[%s P%d] match=%s | conf=%.2f | priority_review=%s | reason=%s",
                rid,
                step_num,
                audit_res.semantic_match,
                audit_res.visual_confidence,
                needs_priority_review,
                audit_res.discrepancy_reason,
            )

        item_payload = {
            **audit_res.model_dump(),
            "priority_review": needs_priority_review,
            "image_path": str(img_path.relative_to(rotinas_dir.parent.parent)).replace("\\", "/")
            if img_path.is_relative_to(rotinas_dir.parent.parent)
            else str(img_path),
            "step_text": cand.get("step_text", ""),
            "model": model_used,
            "evaluated_at": datetime.now(timezone.utc).isoformat(),
        }
        results_list.append(item_payload)

        if needs_priority_review:
            flagged_count += 1
            flagged_priority_list.append(item_payload)
            if not dry_run:
                flag_step_for_priority_review(
                    audit_res,
                    cand,
                    governance_file=governance_file,
                    sync_to_supabase=sync_to_supabase,
                    settings=settings,
                )
        else:
            approved_count += 1

    # ADR-035: execução parcial (`--routines`) mescla no relatório consolidado em vez de apagar as demais rotinas
    consolidated = results_list
    if routine_filter and limit is None and not dry_run:
        kept = [
            r for r in _load_previous_results(report_output_path) if r.get("routine_id") not in routine_filter
        ]
        consolidated = sorted(
            kept + results_list, key=lambda r: (str(r.get("routine_id")), int(r.get("step_number") or 0))
        )
    merged_mode = consolidated is not results_list
    consolidated_flagged = [r for r in consolidated if r.get("priority_review")]

    # ADR-035: libera só as sinalizações do PRÓPRIO verificador das rotinas reavaliadas que agora passam
    lifted: list[str] = []
    if not dry_run:
        checked = set(routine_filter) if routine_filter else {c["routine_id"] for c in candidates}
        flagged_now = {str(r["routine_id"]) for r in flagged_priority_list}
        lifted = lift_stale_semantic_flags(
            checked - flagged_now,
            governance_file=governance_file,
            sync_to_supabase=sync_to_supabase,
            settings=settings,
        )

    report_payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "confidence_threshold": MIN_VISUAL_CONFIDENCE_THRESHOLD,
        "total_discovered_steps": len(consolidated) if merged_mode else len(all_candidates),
        "evaluated_steps": len(consolidated) if merged_mode else len(candidates),
        "approved_steps": len(consolidated) - len(consolidated_flagged) if merged_mode else approved_count,
        "flagged_for_priority_review": len(consolidated_flagged) if merged_mode else flagged_count,
        "dry_run": dry_run,
        "last_run": {
            "routines": sorted(routine_filter) if routine_filter else None,
            "evaluated_steps": len(candidates),
            "approved_steps": approved_count,
            "flagged_for_priority_review": flagged_count,
            "lifted_semantic_flags": lifted,
        },
        "priority_review_items": consolidated_flagged if merged_mode else flagged_priority_list,
        "results": consolidated,
    }

    if not dry_run:
        report_output_path.parent.mkdir(parents=True, exist_ok=True)
        report_output_path.write_text(json.dumps(report_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    return report_payload


def _load_previous_results(report_path: Path) -> list[dict[str, Any]]:
    """Resultados do relatório consolidado anterior (vazio se ausente ou ilegível)."""
    if not report_path.exists():
        return []
    try:
        previous = json.loads(report_path.read_text(encoding="utf-8"))
    except Exception:
        return []
    results = previous.get("results") if isinstance(previous, dict) else None
    return [r for r in results if isinstance(r, dict)] if isinstance(results, list) else []


def lift_stale_semantic_flags(
    routine_ids: set[str],
    *,
    governance_file: Path = GOVERNANCE_CACHE_FILE,
    sync_to_supabase: bool = False,
    settings: Optional[OrionWorkerSettings] = None,
) -> list[str]:
    """
    Libera a sinalização `revisao_solicitada` das rotinas que o verificador reavaliou e agora aprova.
    Só toca em entradas ASSINADAS PELO PRÓPRIO VERIFICADOR (`revisor == VERIFIER_REVISOR`); a governança feita
    por um revisor humano nunca é alterada. A rotina volta a `pendente_aprovacao` (a aprovação é humana).
    Devolve os IDs liberados.
    """
    if not routine_ids or not governance_file.exists():
        return []
    try:
        gov_data = json.loads(governance_file.read_text(encoding="utf-8"))
    except Exception:
        return []
    if not isinstance(gov_data, dict):
        return []

    now_iso = datetime.now(timezone.utc).isoformat()
    lifted: list[str] = []
    for rid in sorted(routine_ids):
        entry = gov_data.get(rid)
        if not isinstance(entry, dict) or entry.get("revisor") != VERIFIER_REVISOR:
            continue
        if entry.get("statusGovernanca") != "revisao_solicitada":
            continue
        entry["statusGovernanca"] = VERIFIER_PENDING_STATUS
        entry.pop("prioritySemanticFlag", None)
        entry.pop("revisor", None)
        entry["comentario"] = (
            "[VERIFICADOR SEMÂNTICO ADR-033/035] Sinalização liberada: a reavaliação multimodal aprovou todos os "
            "passos auto-curados da rotina."
        )
        entry["updatedAt"] = now_iso
        lifted.append(rid)

    if not lifted:
        return []

    governance_file.write_text(json.dumps(gov_data, indent=2, ensure_ascii=False), encoding="utf-8")

    if sync_to_supabase:
        cfg = settings or load_worker_settings()
        if cfg.is_postgres_pooler_configured:
            try:
                conn = create_postgres_connection(cfg)
                with conn:
                    with conn.cursor() as cur:
                        for rid in lifted:
                            cur.execute(
                                """
                                UPDATE routines
                                SET status_governanca = %s,
                                    revisor = NULL,
                                    comentario_governanca = %s,
                                    atualizado_em = %s
                                WHERE id = %s AND revisor = %s AND status_governanca = 'revisao_solicitada';
                                """,
                                (
                                    VERIFIER_PENDING_STATUS,
                                    gov_data[rid]["comentario"],
                                    now_iso,
                                    rid,
                                    VERIFIER_REVISOR,
                                ),
                            )
                conn.close()
            except Exception as exc:
                logger.debug("Fallback offline ao liberar sinalização no PostgreSQL: %s", exc)
    return lifted


def parse_cli_args(argv: Optional[list[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Verificador Semântico Multimodal Pós-Lote via Antigravity Python SDK (ADR-033)"
    )
    parser.add_argument(
        "--routines",
        type=str,
        default=None,
        help="Lista opcional de IDs de rotinas separados por vírgula (ex.: M-16.6,R-1.1)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Número máximo de passos auto-curados a verificar nesta execução",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Apenas exibe os resultados sem gravar o relatório ou sinalizar governança",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Exibe logs detalhados de cada passo inspecionado",
    )
    parser.add_argument(
        "--sync-supabase",
        action="store_true",
        help="Sinaliza rotinas reprovadas diretamente no Supabase (status_governanca = revisao_solicitada)",
    )
    return parser.parse_args(argv)


async def async_main(argv: Optional[list[str]] = None) -> int:
    args = parse_cli_args(argv)
    logging.basicConfig(
        level=logging.INFO if args.verbose else logging.WARNING,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )

    routine_ids = [r.strip() for r in args.routines.split(",") if r.strip()] if args.routines else None
    cfg = load_worker_settings()

    print("====================================================")
    print("  ORION TN — VERIFICADOR SEMÂNTICO SDK (ADR-033)    ")
    print(f"  Modelo Primário: {cfg.primary_model}              ")
    print(f"  Limiar Conf.:    {MIN_VISUAL_CONFIDENCE_THRESHOLD:.2f}")
    print("====================================================")

    report = await verify_healed_routines_batch(
        routine_ids=routine_ids,
        limit=args.limit,
        dry_run=args.dry_run,
        verbose=args.verbose,
        sync_to_supabase=args.sync_supabase and not args.dry_run,
        settings=cfg,
    )

    print(f"  Passos auto-curados encontrados: {report['total_discovered_steps']}")
    print(f"  Passos verificados neste lote:   {report['evaluated_steps']}")
    print(f"  Confirmados semanticamente:      {report['approved_steps']}")
    print(f"  Sinalizados para revisão:        {report['flagged_for_priority_review']}")
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
