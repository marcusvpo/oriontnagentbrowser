"""
Configuração compartilhada para o orquestrador satélite Antigravity Python SDK (ADR-033).

Regras de conformidade:
- Isolamento estrito de credenciais Supabase: carrega exclusivamente de `auditoria/.env`
  (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`/`SUPABASE_SECRET_KEY`, `DATABASE_URL`/`SUPABASE_DB_URL`).
- Inicializa o cliente oficial do Google Antigravity Python SDK (`google.antigravity` v0.1.23)
  usando EXCLUSIVAMENTE a sessão local autenticada do Antigravity (mesma conta do CLI `agy`),
  sem chave de API e sem cobrança por uso de API, e Structured Outputs via Pydantic.
  `GEMINI_API_KEY`/`GOOGLE_API_KEY` NÃO são lidas por este worker (ADR-033, emenda de 2026-11-18).
- Modelo multimodal padrão: `gemini-4-hydrogen-xhigh` (Gemini 4 Hydrogen Extra) com fallback
  automático para `gemini-4-hydrogen-high`.
"""

from __future__ import annotations

import json
import logging
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Awaitable, Callable, Optional, Type, TypeVar

from dotenv import load_dotenv
from pydantic import BaseModel

try:
    import google.antigravity as agy
    from google.antigravity import Agent, CapabilitiesConfig, LocalAgentConfig, from_file
except ImportError:  # pragma: no cover
    agy = None  # type: ignore
    Agent = None  # type: ignore
    CapabilitiesConfig = None  # type: ignore
    LocalAgentConfig = None  # type: ignore
    from_file = None  # type: ignore

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
        # O SDK lê essas variáveis por conta própria e passaria a cobrar por uso de API.
        logger.warning(
            "GEMINI_API_KEY/GOOGLE_API_KEY detectada no ambiente: o SDK pode usá-la e gerar custo de API. "
            "A ADR-033 prevê somente a sessão local autenticada do Antigravity; remova a variável."
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
    # Sem `api_key`: a autenticação é a sessão local do Antigravity (ADR-033).
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

    if Agent is None or from_file is None:
        raise RuntimeError("Google Antigravity SDK (`google-antigravity`) indisponível.")

    agent_cfg = build_agent_config(
        schema_cls=schema_cls,
        model_name=model_name,
        system_instructions=system_instructions,
        settings=settings,
    )

    content_parts: list[Any] = []
    if image_path is not None:
        resolved_img = Path(image_path).resolve()
        if not resolved_img.exists():
            raise FileNotFoundError(f"Imagem não encontrada para inferência multimodal: {resolved_img}")
        content_parts.append(from_file(resolved_img, description="Captura de tela do Orion TN"))
    content_parts.append(prompt)

    try:
        async with Agent(agent_cfg) as agent:
            response = await agent.chat(content_parts if len(content_parts) > 1 else prompt)
            structured = await response.structured_output()
            if structured is not None:
                return coerce_to_pydantic(structured, schema_cls)
            raw_text = await response.text()
            return coerce_to_pydantic(raw_text, schema_cls)
    except Exception as exc:
        if "API key is required" in str(exc):
            raise RuntimeError(
                "Sessão local do Antigravity SDK não autenticada. Autentique a sessão local "
                "(mesma conta do CLI `agy`); este worker não usa chave de API (ADR-033)."
            ) from exc
        raise


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
