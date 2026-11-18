"""
Configuração compartilhada para o orquestrador satélite Antigravity Python SDK (ADR-033).

Regras de conformidade:
- Isolamento estrito de credenciais Supabase: carrega exclusivamente de `auditoria/.env`
  (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`/`SUPABASE_SECRET_KEY`, `DATABASE_URL`/`SUPABASE_DB_URL`).
- A inferência multimodal é feita pelo CLI local `agy` (`agy.exe` no Windows): prompt em STDIN como
  NDJSON (`--input-format stream-json`), resposta no evento final `result`, `--json-schema` gerado
  do modelo Pydantic e validação final por `coerce_to_pydantic`. Sem chave de API e sem cobrança por uso
  (o SDK `google.antigravity` v0.1.23 só monta o `LocalAgentConfig`/schema). `GEMINI_API_KEY`/`GOOGLE_API_KEY`
  NÃO são lidas por este worker (ADR-033, emendas de 2026-11-18).
- Modelo multimodal padrão: `gemini-4-hydrogen-xhigh` (Gemini 4 Hydrogen Extra) com fallback
  automático para `gemini-4-hydrogen-high`.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import re
import sys
import time
import weakref
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Awaitable, Callable, Optional, Type, TypeVar

from dotenv import load_dotenv
from pydantic import BaseModel

try:
    import google.antigravity as agy
    # O SDK só monta `LocalAgentConfig` (schema/Structured Outputs, sem rede). A inferência real
    # é feita pelo CLI local `agy` (`_run_agy_cli_inference`), sem chave de API.
    from google.antigravity import CapabilitiesConfig, LocalAgentConfig
except ImportError:  # pragma: no cover
    agy = None  # type: ignore
    CapabilitiesConfig = None  # type: ignore
    LocalAgentConfig = None  # type: ignore

logger = logging.getLogger("orion.antigravity_worker")

# Caminhos estruturais do repositório
WORKER_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = WORKER_DIR.parent.parent
AUDITORIA_DIR = PROJECT_ROOT / "auditoria"
ENV_FILE_PATH = AUDITORIA_DIR / ".env"

# Carrega exclusivamente de `auditoria/.env` sem sobrescrever variáveis já injetadas em testes
if ENV_FILE_PATH.exists():
    load_dotenv(dotenv_path=ENV_FILE_PATH, override=False)

# Modelos de inferência multimodal (ADR-033)
DEFAULT_MULTIMODAL_MODEL = "gemini-4-hydrogen-xhigh"
FALLBACK_MULTIMODAL_MODEL = "gemini-4-hydrogen-high"
DEFAULT_MULTIMODAL_LABEL = "Gemini 4 Hydrogen Extra"

# Caminhos de cache e artefatos de auditoria
CACHE_DIR = AUDITORIA_DIR / "cache"
PENDING_SOM_DIR = CACHE_DIR / "pending-som"
PENDING_SOM_QUEUE_PRIMARY = CACHE_DIR / "pending-som-queue.json"
PENDING_SOM_QUEUE_NESTED = PENDING_SOM_DIR / "pending-som-queue.json"
HUMAN_REVIEWS_CACHE_FILE = CACHE_DIR / "human-reviews-cache.json"
CURATED_ROUTE_SYNONYMS_FILE = CACHE_DIR / "curated-route-synonyms.json"
SEMANTIC_AUDIT_REPORT_FILE = CACHE_DIR / "semantic-audit-report.json"
ROTINAS_DIR = AUDITORIA_DIR / "rotinas"

TModel = TypeVar("TModel", bound=BaseModel)
SdkTransportFn = Callable[[str, Optional[Path], Type[TModel], str], Awaitable[Any]]

_test_transport_override: Optional[SdkTransportFn] = None


def set_sdk_transport_for_tests(transport: Optional[SdkTransportFn]) -> None:
    """Permite injetar um transporte mockado para testes unitários 100% offline."""
    global _test_transport_override
    _test_transport_override = transport


def get_sdk_transport_for_tests() -> Optional[SdkTransportFn]:
    """Retorna o transporte mockado ativo, se houver."""
    return _test_transport_override


@dataclass(frozen=True)
class OrionWorkerSettings:
    """Configurações carregadas de `auditoria/.env` para os workers satélites em Python."""

    project_root: Path
    auditoria_dir: Path
    env_file: Path
    supabase_url: str
    supabase_service_role_key: str
    database_url: str
    primary_model: str = DEFAULT_MULTIMODAL_MODEL
    fallback_model: str = FALLBACK_MULTIMODAL_MODEL

    @property
    def is_supabase_rest_configured(self) -> bool:
        return bool(self.supabase_url and self.supabase_service_role_key)

    @property
    def is_postgres_pooler_configured(self) -> bool:
        return bool(self.database_url)


def load_worker_settings(env_path: Optional[Path] = None) -> OrionWorkerSettings:
    """Lê e consolida as variáveis de ambiente de `auditoria/.env`."""
    target_env = env_path or ENV_FILE_PATH
    if target_env.exists():
        load_dotenv(dotenv_path=target_env, override=False)

    supabase_url = os.environ.get("SUPABASE_URL", "").strip()
    # Suporta SUPABASE_SERVICE_ROLE_KEY e SUPABASE_SECRET_KEY (padrão em auditoria/.env)
    supabase_key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("SUPABASE_SECRET_KEY")
        or ""
    ).strip()
    # Suporta DATABASE_URL e SUPABASE_DB_URL (IPv4 Pooler)
    database_url = (
        os.environ.get("DATABASE_URL")
        or os.environ.get("SUPABASE_DB_URL")
        or ""
    ).strip()
    if os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"):
        # O worker não usa chave de API (inferência só pelo CLI `agy`); a variável é ignorada.
        logger.warning(
            "GEMINI_API_KEY/GOOGLE_API_KEY detectada no ambiente e IGNORADA: a ADR-033 prevê inferência "
            "somente pelo CLI local `agy` (sessão autenticada, sem custo de API); remova a variável."
        )
    primary_model = os.environ.get("ORION_AGY_PRIMARY_MODEL", DEFAULT_MULTIMODAL_MODEL).strip()
    fallback_model = os.environ.get("ORION_AGY_FALLBACK_MODEL", FALLBACK_MULTIMODAL_MODEL).strip()

    return OrionWorkerSettings(
        project_root=PROJECT_ROOT,
        auditoria_dir=AUDITORIA_DIR,
        env_file=target_env,
        supabase_url=supabase_url,
        supabase_service_role_key=supabase_key,
        database_url=database_url,
        primary_model=primary_model or DEFAULT_MULTIMODAL_MODEL,
        fallback_model=fallback_model or FALLBACK_MULTIMODAL_MODEL,
    )


def create_postgres_connection(settings: Optional[OrionWorkerSettings] = None):
    """Abre conexão direta via Pooler PostgreSQL IPv4 (`psycopg2`) usando `auditoria/.env`."""
    import psycopg2

    cfg = settings or load_worker_settings()
    if not cfg.database_url:
        raise RuntimeError("DATABASE_URL / SUPABASE_DB_URL não configurado em auditoria/.env")
    return psycopg2.connect(cfg.database_url, sslmode="require")


def build_agent_config(
    schema_cls: Type[BaseModel],
    model_name: str = DEFAULT_MULTIMODAL_MODEL,
    system_instructions: Optional[str] = None,
    settings: Optional[OrionWorkerSettings] = None,
) -> "LocalAgentConfig":
    """
    Constrói `LocalAgentConfig` do Google Antigravity SDK v0.1.23 com `response_schema`
    vinculado diretamente à classe Pydantic (`Structured Outputs`) e modo read-only seguro.
    """
    if LocalAgentConfig is None or CapabilitiesConfig is None:
        raise RuntimeError(
            "O pacote `google-antigravity>=0.1.23` não está instalado no ambiente Python."
        )

    cfg = settings or load_worker_settings()
    instructions = system_instructions or (
        "Você é o auditor multimodal especialista do ERP notarial e registral Orion TN (Siplan). "
        "Analise rigorosamente a imagem fornecida e os metadados do passo e retorne estritamente "
        "o schema estruturado solicitado."
    )

    kwargs: dict[str, Any] = {
        "model": model_name,
        "system_instructions": instructions,
        "response_schema": schema_cls,
        "capabilities": CapabilitiesConfig(
            enabled_tools=agy.BuiltinTools.read_only() if agy else []
        ),
        "workspaces": [str(cfg.project_root)],
    }
    # Sem `api_key`: o config só descreve o schema; a inferência real usa o CLI `agy` (ADR-033).
    return LocalAgentConfig(**kwargs)


def _extract_first_json_object(raw_text: str) -> Optional[dict[str, Any]]:
    """Extrai o primeiro objeto JSON balanceado `{ ... }` caso o retorno venha como string."""
    text = (raw_text or "").strip()
    if not text:
        return None
    # Remove blocos markdown ```json ... ```
    fenced = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", text, re.IGNORECASE)
    if fenced:
        try:
            parsed = json.loads(fenced.group(1))
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            pass

    start = text.find("{")
    if start == -1:
        return None

    depth = 0
    in_str = False
    escape = False
    for idx in range(start, len(text)):
        ch = text[idx]
        if escape:
            escape = False
            continue
        if ch == "\\":
            escape = True
            continue
        if ch == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                candidate = text[start : idx + 1]
                try:
                    parsed = json.loads(candidate)
                    if isinstance(parsed, dict):
                        return parsed
                except Exception:
                    return None
    return None


def coerce_to_pydantic(payload: Any, schema_cls: Type[TModel]) -> TModel:
    """Valida e converte qualquer payload (instância, dict ou JSON string) no modelo Pydantic."""
    if isinstance(payload, schema_cls):
        return payload
    if isinstance(payload, BaseModel):
        return schema_cls.model_validate(payload.model_dump())
    if isinstance(payload, dict):
        return schema_cls.model_validate(payload)
    if isinstance(payload, str):
        try:
            return schema_cls.model_validate_json(payload)
        except Exception:
            extracted = _extract_first_json_object(payload)
            if extracted is not None:
                return schema_cls.model_validate(extracted)
    raise ValueError(f"Não foi possível converter a resposta para {schema_cls.__name__}: {payload!r}")


async def _run_single_model_inference(
    prompt: str,
    image_path: Optional[Path],
    schema_cls: Type[TModel],
    model_name: str,
    system_instructions: Optional[str] = None,
    settings: Optional[OrionWorkerSettings] = None,
) -> TModel:
    """Executa uma chamada multimodal via Antigravity Python SDK (`Agent`) ou transporte de teste."""
    custom_transport = get_sdk_transport_for_tests()
    if custom_transport is not None:
        raw_res = await custom_transport(prompt, image_path, schema_cls, model_name)
        return coerce_to_pydantic(raw_res, schema_cls)

    return await _run_agy_cli_inference(
        prompt=prompt,
        image_path=image_path,
        schema_cls=schema_cls,
        model_name=model_name,
        system_instructions=system_instructions,
    )


# ---------------------------------------------------------------------------
# Transporte real: CLI local `agy` (ADR-033, emenda 2026-11-18 "worker via agy").
# Espelha o protocolo de `auditoria/src/agy-client.ts`: prompt em STDIN como NDJSON,
# resposta no evento final `result` de `--output-format stream-json`.
# ---------------------------------------------------------------------------

AGY_BINARY = "agy.exe" if sys.platform == "win32" else "agy"
AGY_CLI_TIMEOUT_SEC = 180
_QUOTA_PATTERN = re.compile(r"quota|rate[_\s-]?limit|resource_exhausted|\b429\b|too many requests|capacity", re.IGNORECASE)
_agy_semaphores: "weakref.WeakKeyDictionary[asyncio.AbstractEventLoop, asyncio.Semaphore]" = weakref.WeakKeyDictionary()


def _agy_semaphore() -> asyncio.Semaphore:
    """`asyncio.Semaphore(1)` por event loop: serializa as chamadas ao `agy` (uma por vez)."""
    loop = asyncio.get_running_loop()
    sem = _agy_semaphores.get(loop)
    if sem is None:
        sem = asyncio.Semaphore(1)
        _agy_semaphores[loop] = sem
    return sem


def _effort_for_model(model_name: str) -> str:
    return "high" if model_name.strip().lower().endswith("-high") else "xhigh"


def build_agy_cli_args(
    schema_cls: Type[BaseModel],
    model_name: str,
    image_dir: Optional[Path] = None,
    timeout_sec: int = AGY_CLI_TIMEOUT_SEC,
) -> list[str]:
    """Argumentos do `agy` em modo não interativo; o prompt NUNCA vai na linha de comando (ADR-014)."""
    args: list[str] = [
        "--print=",
        "--input-format",
        "stream-json",
        "--model",
        model_name,
        "--effort",
        _effort_for_model(model_name),
        "--output-format",
        "stream-json",
        "--print-timeout",
        f"{max(5, int(timeout_sec))}s",
        "--disable-slash-commands",
        "--json-schema",
        json.dumps(schema_cls.model_json_schema(), ensure_ascii=False),
    ]
    if image_dir is not None:
        args.extend(["--dangerously-skip-permissions", "--add-dir", str(image_dir)])
    return args


def build_agy_stream_input(payload: str) -> str:
    """Mensagem NDJSON de entrada do `agy --input-format stream-json`."""
    return json.dumps({"event": "user", "message": {"content": payload}}, ensure_ascii=False) + "\n"


def extract_agy_stream_result(stdout: str) -> Optional[dict[str, Any]]:
    """Lê o último evento `result` do stream; devolve `{ok, response, error}` ou `None`."""
    last: Optional[dict[str, Any]] = None
    for line in (stdout or "").splitlines():
        text = line.strip()
        if not text.startswith("{"):
            continue
        try:
            evt = json.loads(text)
        except Exception:
            continue
        if isinstance(evt, dict) and evt.get("event") == "result" and isinstance(evt.get("result"), dict):
            last = evt["result"]
    if last is None:
        return None
    ok = str(last.get("status", "")).upper() == "SUCCESS"
    response = last.get("response", "")
    if not isinstance(response, str):
        response = json.dumps(response, ensure_ascii=False)
    return {"ok": ok, "response": response, "error": None if ok else str(last.get("error") or last.get("status") or "erro")}


def _prepare_agy_image(image_path: Path) -> tuple[Path, Optional[Path]]:
    """
    Devolve `(imagem_para_o_agy, temporario_a_remover)`. `.webp` usa o `.png` pareado da pasta da rotina
    quando existe; sem par, converte para PNG temporário em `auditoria/cache/` (removido no `finally`).
    """
    resolved = Path(image_path).resolve()
    if not resolved.exists():
        raise FileNotFoundError(f"Imagem não encontrada para inferência multimodal: {resolved}")
    if resolved.suffix.lower() != ".webp":
        return resolved, None
    paired_png = resolved.with_suffix(".png")
    if paired_png.exists():
        return paired_png, None
    from PIL import Image  # Pillow: só necessário quando não há `.png` pareado

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    tmp_png = CACHE_DIR / f"agy-worker-{os.getpid()}-{int(time.time() * 1000)}.png"
    with Image.open(resolved) as img:
        img.convert("RGB").save(tmp_png, format="PNG")
    return tmp_png, tmp_png


def prepare_agy_image(image_path: Path) -> tuple[Path, Optional[Path]]:
    """API pública de `_prepare_agy_image` (ADR-035): o verificador também converte sub-capturas `.webp` sem `.png` pareado."""
    return _prepare_agy_image(image_path)


def _build_agy_payload(prompt: str, image_path: Optional[Path], system_instructions: Optional[str]) -> str:
    parts: list[str] = []
    if image_path is not None:
        abs_path = Path(image_path).resolve()
        try:
            mention = abs_path.relative_to(PROJECT_ROOT).as_posix()
        except ValueError:
            mention = abs_path.as_posix()
        parts.append(f"[Imagem Anexa para Inspeção Visual: @{mention} ({abs_path.as_posix()})]")
    if system_instructions:
        parts.append(system_instructions)
    parts.append(prompt)
    return "\n\n".join(parts)


async def _run_agy_cli_inference(
    prompt: str,
    image_path: Optional[Path],
    schema_cls: Type[TModel],
    model_name: str,
    system_instructions: Optional[str] = None,
) -> TModel:
    """Executa uma inferência multimodal estruturada via CLI local `agy` e valida com Pydantic."""
    instructions = system_instructions or (
        "Você é o auditor multimodal especialista do ERP notarial e registral Orion TN (Siplan). "
        "Analise rigorosamente a imagem fornecida e os metadados do passo e retorne estritamente "
        "o JSON do schema solicitado, sem texto adicional."
    )
    img_for_agy: Optional[Path] = None
    temp_img: Optional[Path] = None
    if image_path is not None:
        img_for_agy, temp_img = _prepare_agy_image(image_path)

    try:
        args = build_agy_cli_args(
            schema_cls,
            model_name,
            image_dir=img_for_agy.parent if img_for_agy is not None else None,
        )
        payload = build_agy_stream_input(_build_agy_payload(prompt, img_for_agy, instructions))
        async with _agy_semaphore():
            try:
                proc = await asyncio.create_subprocess_exec(
                    AGY_BINARY,
                    *args,
                    stdin=asyncio.subprocess.PIPE,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    cwd=str(PROJECT_ROOT),
                )
            except FileNotFoundError as exc:
                raise RuntimeError(f"CLI `{AGY_BINARY}` não encontrado no PATH (ADR-033).") from exc
            try:
                out_b, err_b = await asyncio.wait_for(
                    proc.communicate(payload.encode("utf-8")), timeout=AGY_CLI_TIMEOUT_SEC + 15
                )
            except asyncio.TimeoutError as exc:
                proc.kill()
                await proc.wait()
                raise RuntimeError(f"`agy` excedeu o timeout de {AGY_CLI_TIMEOUT_SEC}s ({model_name}).") from exc

        stdout = out_b.decode("utf-8", errors="replace")
        stderr = err_b.decode("utf-8", errors="replace")
        parsed = extract_agy_stream_result(stdout)
        if parsed is None or not parsed["ok"]:
            reason = (parsed or {}).get("error") or f"exit_code_{proc.returncode}"
            if _QUOTA_PATTERN.search(f"{reason}\n{stderr}"):
                reason = f"quota_exceeded ({reason})"
            raise RuntimeError(f"`agy` sem resultado válido ({model_name}): {reason}")
        return coerce_to_pydantic(parsed["response"], schema_cls)
    finally:
        if temp_img is not None:
            try:
                temp_img.unlink()
            except OSError:
                pass


async def generate_structured_multimodal(
    prompt: str,
    image_path: Optional[Path],
    schema_cls: Type[TModel],
    system_instructions: Optional[str] = None,
    settings: Optional[OrionWorkerSettings] = None,
) -> tuple[TModel, str]:
    """
    Executa inferência multimodal estruturada via Antigravity SDK tentando primeiro o modelo
    primário (`gemini-4-hydrogen-xhigh`) e realizando fallback automático para
    `gemini-4-hydrogen-high` em caso de falha, indisponibilidade ou erro de validação.

    Retorna `(instancia_pydantic, modelo_utilizado)`.
    """
    cfg = settings or load_worker_settings()
    models_to_try = [cfg.primary_model]
    if cfg.fallback_model and cfg.fallback_model not in models_to_try:
        models_to_try.append(cfg.fallback_model)

    last_error: Optional[Exception] = None
    for idx, model_name in enumerate(models_to_try):
        try:
            result = await _run_single_model_inference(
                prompt=prompt,
                image_path=image_path,
                schema_cls=schema_cls,
                model_name=model_name,
                system_instructions=system_instructions,
                settings=cfg,
            )
            return result, model_name
        except FileNotFoundError:
            raise
        except Exception as exc:
            last_error = exc
            if idx + 1 < len(models_to_try):
                logger.warning(
                    "Falha no modelo primário '%s' (%s). Acionando fallback '%s'...",
                    model_name,
                    exc,
                    models_to_try[idx + 1],
                )
            else:
                logger.error("Falha definitiva na inferência multimodal (%s): %s", model_name, exc)

    assert last_error is not None
    raise last_error
