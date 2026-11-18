#!/usr/bin/env python3
"""
Suíte de testes unitários para o orquestrador satélite Antigravity Python SDK (ADR-033).

Valida:
1. Schemas Pydantic (`SomTargetDecision` e `SemanticAuditResult`), limites de `confidence` (`0.0..1.0`) e coerção JSON.
2. Configuração (`config.py`), leitura de `auditoria/.env`, modelos `gemini-4-hydrogen-xhigh` / `gemini-4-hydrogen-high`
   e inicialização de `LocalAgentConfig` do `google-antigravity>=0.1.23`.
3. Tratamento de fila vazia em `curate_som_sdk.py`.
4. Fluxo completo de curadoria Set-of-Mark com mock do modelo:
   - Aprovação com `confidence >= 0.70`, atualização da Camada 0.1 (`human-reviews-cache.json`),
     atualização da Camada 0.2 (`curated-route-synonyms.json`) e remoção do item processado de `pending-som-queue.json`;
   - Rejeição automática quando `confidence < 0.70`;
   - Rejeição pelo Veto Semântico da ADR-027 (`Novo cartão +`, `Cidade` vs `Autenticidade`, `navbar` em zona `content`);
   - Suporte às flags `--limit`, `--dry-run` e `--verbose`.
5. Verificador Semântico Multimodal Pós-Lote (`semantic_visual_verifier.py`):
   - Descoberta de relatórios `*-revisado.md` com `status: validado_com_ajustes` e passos auto-curados;
   - Geração de `semantic-audit-report.json` e sinalização de revisão prioritária quando
     `visual_confidence < 0.85` ou `semantic_match == False`.
"""

from __future__ import annotations

import asyncio
import json
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Any, Optional, Type

from pydantic import ValidationError

WORKER_DIR = Path(__file__).resolve().parent
if str(WORKER_DIR) not in sys.path:
    sys.path.insert(0, str(WORKER_DIR))

import config as worker_config  # noqa: E402
from curate_som_sdk import (  # noqa: E402
    SomTargetDecision,
    curate_pending_som_batch,
    parse_cli_args as parse_curate_args,
    validate_som_candidate_semantics,
)
from semantic_visual_verifier import (  # noqa: E402
    VERIFIER_REVISOR,
    SemanticAuditResult,
    build_semantic_verification_prompt,
    find_sub_capture_images,
    lift_stale_semantic_flags,
    parse_cli_args as parse_verify_args,
    verify_healed_routines_batch,
)


class TestAntigravitySdkWorker(unittest.TestCase):
    """Testes unitários offline para `config.py`, `curate_som_sdk.py` e `semantic_visual_verifier.py`."""

    def tearDown(self) -> None:
        worker_config.set_sdk_transport_for_tests(None)

    def test_pydantic_schemas_validation(self) -> None:
        """Valida restrições estritas dos schemas Pydantic `SomTargetDecision` e `SemanticAuditResult`."""
        valid_som = SomTargetDecision(
            tag_id=3,
            confidence=0.92,
            justification="Tag [3] aponta para o botão 'Efetuar Serviço' na seção Serviços realizados.",
            actual_target_name="Efetuar Serviço",
        )
        self.assertEqual(valid_som.tag_id, 3)
        self.assertAlmostEqual(valid_som.confidence, 0.92)
        self.assertEqual(valid_som.actual_target_name, "Efetuar Serviço")

        with self.assertRaises(ValidationError):
            SomTargetDecision(
                tag_id=1,
                confidence=1.25,  # fora do intervalo [0.0, 1.0]
                justification="Inválido",
                actual_target_name="Botão",
            )

        valid_sem = SemanticAuditResult(
            routine_id="M-16.6",
            step_number=6,
            semantic_match=True,
            visual_confidence=0.95,
            discrepancy_reason=None,
        )
        self.assertTrue(valid_sem.semantic_match)
        self.assertIsNone(valid_sem.discrepancy_reason)

        with self.assertRaises(ValidationError):
            SemanticAuditResult(
                routine_id="M-16.6",
                step_number=6,
                semantic_match=False,
                visual_confidence=-0.1,  # inválido
            )

    def test_config_models_and_agent_config_builder(self) -> None:
        """Garante modelos `gemini-4-hydrogen-xhigh` e `gemini-4-hydrogen-high` e integração com `LocalAgentConfig`."""
        settings = worker_config.load_worker_settings()
        self.assertEqual(settings.primary_model, "gemini-4-hydrogen-xhigh")
        self.assertEqual(settings.fallback_model, "gemini-4-hydrogen-high")

        agent_cfg = worker_config.build_agent_config(
            schema_cls=SomTargetDecision,
            model_name=settings.primary_model,
            settings=settings,
        )
        self.assertIsNotNone(agent_cfg.response_schema)
        schema_dict = json.loads(agent_cfg.response_schema)
        self.assertIn("tag_id", schema_dict.get("properties", {}))
        self.assertIn("actual_target_name", schema_dict.get("properties", {}))

    def test_agy_cli_args_and_stream_protocol(self) -> None:
        """O transporte real usa o CLI `agy` com NDJSON em STDIN, `--json-schema` e sem prompt na linha de comando."""
        args = worker_config.build_agy_cli_args(SomTargetDecision, "gemini-4-hydrogen-high", image_dir=Path("."))
        self.assertIn("--print=", args)
        self.assertEqual(args[args.index("--input-format") + 1], "stream-json")
        self.assertEqual(args[args.index("--output-format") + 1], "stream-json")
        self.assertEqual(args[args.index("--effort") + 1], "high")
        self.assertIn("--disable-slash-commands", args)
        self.assertIn("tag_id", json.loads(args[args.index("--json-schema") + 1])["properties"])
        self.assertIn("--add-dir", args)

        line = worker_config.build_agy_stream_input("Olá")
        self.assertTrue(line.endswith("\n"))
        self.assertEqual(json.loads(line), {"event": "user", "message": {"content": "Olá"}})

        stream = "\n".join(
            [
                '{"event":"assistant","message":{"content":"..."}}',
                "ruído",
                '{"event":"result","result":{"status":"SUCCESS","response":"{\\"tag_id\\":1}"}}',
            ]
        )
        parsed = worker_config.extract_agy_stream_result(stream)
        self.assertTrue(parsed and parsed["ok"])
        self.assertEqual(parsed["response"], '{"tag_id":1}')
        failed = worker_config.extract_agy_stream_result('{"event":"result","result":{"status":"ERROR","error":"x"}}')
        self.assertTrue(failed and not failed["ok"])
        self.assertIsNone(worker_config.extract_agy_stream_result("sem eventos"))

    def test_model_fallback_from_xhigh_to_high(self) -> None:
        """Verifica se `generate_structured_multimodal` faz fallback automático para `gemini-4-hydrogen-high`."""
        called_models: list[str] = []

        async def flaky_transport(
            prompt: str,
            image_path: Optional[Path],
            schema_cls: Type[Any],
            model_name: str,
        ) -> Any:
            called_models.append(model_name)
            if model_name == "gemini-4-hydrogen-xhigh":
                raise RuntimeError("Simulated quota exceeded on xhigh")
            return {
                "tag_id": 2,
                "confidence": 0.88,
                "justification": "Resolvido via modelo de fallback high",
                "actual_target_name": "Concluir",
            }

        worker_config.set_sdk_transport_for_tests(flaky_transport)
        result, model_used = asyncio.run(
            worker_config.generate_structured_multimodal(
                prompt="Teste fallback",
                image_path=None,
                schema_cls=SomTargetDecision,
            )
        )
        self.assertEqual(called_models, ["gemini-4-hydrogen-xhigh", "gemini-4-hydrogen-high"])
        self.assertEqual(model_used, "gemini-4-hydrogen-high")
        self.assertEqual(result.tag_id, 2)

    def test_empty_pending_som_queue(self) -> None:
        """Valida tratamento gracioso de fila vazia sem chamar o modelo."""
        with tempfile.TemporaryDirectory() as tmp:
            tmp_dir = Path(tmp)
            queue_file = tmp_dir / "pending-som-queue.json"
            queue_file.write_text("[]", encoding="utf-8")

            summary = asyncio.run(
                curate_pending_som_batch(
                    queue_path=queue_file,
                    human_reviews_cache_path=tmp_dir / "human-reviews-cache.json",
                    route_synonyms_path=tmp_dir / "curated-route-synonyms.json",
                    project_root=tmp_dir,
                )
            )
            self.assertEqual(summary["total_in_queue"], 0)
            self.assertEqual(summary["processed"], 0)
            self.assertEqual(summary["approved"], 0)
            self.assertEqual(summary["rejected"], 0)

    def test_curate_som_approval_rejection_and_adr027_veto(self) -> None:
        """
        Testa o fluxo completo de curadoria Set-of-Mark:
        - Item 1: aprovado (conf=0.91 >= 0.70), gravado no cache Camada 0.1 + 0.2 e removido da fila;
        - Item 2: rejeitado por confiança baixa (conf=0.62 < 0.70);
        - Item 3: rejeitado pelo Veto Semântico da ADR-027 ('Novo cartão +' em passo de adicionar serviço).
        """
        with tempfile.TemporaryDirectory() as tmp:
            tmp_dir = Path(tmp)
            som_dir = tmp_dir / "auditoria" / "cache" / "pending-som"
            som_dir.mkdir(parents=True, exist_ok=True)

            img1 = som_dir / "R-10-passo-02-som.png"
            img2 = som_dir / "R-11-passo-03-som.png"
            img3 = som_dir / "R-12-passo-04-som.png"
            for p in (img1, img2, img3):
                p.write_bytes(b"\x89PNG\r\n\x1a\nfake")

            queue_items = [
                {
                    "id": "R-10-passo-02",
                    "routineId": "R-10",
                    "stepNumber": 2,
                    "rawText": "Preencha o campo **CPF do Outorgante** e clique em **Pesquisar**.",
                    "targets": ["CPF do Outorgante"],
                    "actionType": "fill",
                    "zonePolicy": "content",
                    "routeHash": "#/protocolo/cadastrar/42",
                    "somImagePath": "auditoria/cache/pending-som/R-10-passo-02-som.png",
                    "candidates": [
                        {
                            "id": 1,
                            "box": {"x": 120, "y": 220, "width": 240, "height": 34},
                            "tagName": "input",
                            "role": "textbox",
                            "name": "CPF/CNPJ do Outorgante",
                            "innerText": "CPF/CNPJ do Outorgante",
                            "selector": '[data-orion-som-id="1"]',
                            "sectionTitle": "Outorgantes",
                            "inNavbar": False,
                        }
                    ],
                    "createdAt": "2026-11-17T18:00:00Z",
                    "status": "pending",
                },
                {
                    "id": "R-11-passo-03",
                    "routineId": "R-11",
                    "stepNumber": 3,
                    "rawText": "Clique no botão **Transmitir Lote**.",
                    "targets": ["Transmitir Lote"],
                    "actionType": "click",
                    "zonePolicy": "content",
                    "routeHash": "#/central/remessa",
                    "somImagePath": "auditoria/cache/pending-som/R-11-passo-03-som.png",
                    "candidates": [
                        {
                            "id": 1,
                            "box": {"x": 400, "y": 500, "width": 120, "height": 32},
                            "tagName": "button",
                            "role": "button",
                            "name": "Enviar Remessa",
                            "selector": '[data-orion-som-id="1"]',
                            "inNavbar": False,
                        }
                    ],
                    "createdAt": "2026-11-17T18:00:00Z",
                    "status": "pending",
                },
                {
                    "id": "R-12-passo-04",
                    "routineId": "R-12",
                    "stepNumber": 4,
                    "rawText": "Na seção **Serviços realizados**, clique em **Adicionar Serviço (+)**.",
                    "targets": ["Adicionar Serviço (+)"],
                    "actionType": "click",
                    "zonePolicy": "content",
                    "routeHash": "#/pedidoFirmas/cadastrar",
                    "somImagePath": "auditoria/cache/pending-som/R-12-passo-04-som.png",
                    "candidates": [
                        {
                            "id": 1,
                            "box": {"x": 980, "y": 140, "width": 130, "height": 32},
                            "tagName": "button",
                            "role": "button",
                            "name": "Novo cartão +",
                            "innerText": "Novo cartão +",
                            "selector": '[data-orion-som-id="1"]',
                            "semanticRole": "entity_creation_button",
                            "inNavbar": False,
                        }
                    ],
                    "createdAt": "2026-11-17T18:00:00Z",
                    "status": "pending",
                },
            ]

            queue_file = tmp_dir / "pending-som-queue.json"
            queue_file.write_text(json.dumps(queue_items, indent=2), encoding="utf-8")
            hr_cache_file = tmp_dir / "human-reviews-cache.json"
            synonyms_file = tmp_dir / "curated-route-synonyms.json"

            async def mock_som_transport(
                prompt: str,
                image_path: Optional[Path],
                schema_cls: Type[Any],
                model_name: str,
            ) -> Any:
                if "R-10" in prompt:
                    return SomTargetDecision(
                        tag_id=1,
                        confidence=0.91,
                        justification="Campo de texto 'CPF/CNPJ do Outorgante' na seção Outorgantes",
                        actual_target_name="CPF/CNPJ do Outorgante",
                    )
                if "R-11" in prompt:
                    return SomTargetDecision(
                        tag_id=1,
                        confidence=0.62,  # abaixo de 0.70 -> deve ser rejeitado
                        justification="Baixa certeza visual",
                        actual_target_name="Enviar Remessa",
                    )
                return SomTargetDecision(
                    tag_id=1,
                    confidence=0.95,  # confiança alta, porém 'Novo cartão +' deve sofrer veto ADR-027
                    justification="Botão com sinal +",
                    actual_target_name="Novo cartão +",
                )

            summary = asyncio.run(
                curate_pending_som_batch(
                    queue_path=queue_file,
                    human_reviews_cache_path=hr_cache_file,
                    route_synonyms_path=synonyms_file,
                    project_root=tmp_dir,
                    custom_transport=mock_som_transport,
                )
            )

            self.assertEqual(summary["total_in_queue"], 3)
            self.assertEqual(summary["processed"], 3)
            self.assertEqual(summary["approved"], 1)
            self.assertEqual(summary["rejected"], 2)
            # O item aprovado é removido da fila; os 2 rejeitados permanecem com status="rejected"
            self.assertEqual(summary["remaining_in_queue"], 2)

            remaining_queue = json.loads(queue_file.read_text(encoding="utf-8"))
            remaining_ids = [item["id"] for item in remaining_queue]
            self.assertNotIn("R-10-passo-02", remaining_ids)
            self.assertIn("R-11-passo-03", remaining_ids)
            self.assertIn("R-12-passo-04", remaining_ids)

            # Confere atualização na Camada 0.1 (human-reviews-cache.json)
            hr_data = json.loads(hr_cache_file.read_text(encoding="utf-8"))
            self.assertIn("R-10", hr_data["byRoutine"])
            overrides = hr_data["byRoutine"]["R-10"]["targetOverrides"]
            self.assertEqual(len(overrides), 1)
            self.assertEqual(overrides[0]["documented"], "CPF do Outorgante")
            self.assertEqual(overrides[0]["actual"], "CPF/CNPJ do Outorgante")

            # Confere atualização na Camada 0.2 (curated-route-synonyms.json com rota sem ID numérico)
            syn_data = json.loads(synonyms_file.read_text(encoding="utf-8"))
            self.assertEqual(len(syn_data), 1)
            self.assertEqual(syn_data[0]["route"], "#/protocolo/cadastrar")
            self.assertEqual(syn_data[0]["real"], ["CPF/CNPJ do Outorgante"])

    def test_semantic_visual_verifier_flags_discrepancies(self) -> None:
        """
        Valida o Verificador Semântico Multimodal Pós-Lote (`semantic_visual_verifier.py`):
        - Passo 1 (conf=0.96, semantic_match=True) -> aprovado;
        - Passo 6 (conf=0.78 < 0.85, semantic_match=False) -> sinalizado para revisão prioritária em
          `semantic-audit-report.json` e `governance.json`.
        """
        with tempfile.TemporaryDirectory() as tmp:
            tmp_dir = Path(tmp)
            rotinas_dir = tmp_dir / "auditoria" / "rotinas"
            routine_folder = rotinas_dir / "config" / "M-16.6-definir-campos-obrigatorios"
            routine_folder.mkdir(parents=True, exist_ok=True)

            (routine_folder / "passo-01.webp").write_bytes(b"RIFFfakeWEBP")
            (routine_folder / "passo-06.webp").write_bytes(b"RIFFfakeWEBP")

            md_content = """---
id: M-16.6
titulo: 'Definir Campos Obrigatórios por Tela'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-17'
  status: validado_com_ajustes
  carga: mutation
  prints_geradas: 2
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Campos obrigatórios'
        elemento_real: 'Configurações > Parametrizações'
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: true
      - passo: 6
        alvo_documentado: 'Salvar'
        elemento_real: 'Concluir'
        camada: dom_synonym_heuristic
        confianca: 0.96
        texto_alterado: true
---

#### Descrição:
Descrição de teste da rotina M-16.6.

#### Passo a passo revisado:
1. Acesse o menu **Configurações > Parametrizações > Campos obrigatórios**.
   [aqui vai a print "passo-01.png"]
6. Clique no botão **Concluir** para aplicar as validações.
   [aqui vai a print "passo-06.png"]
"""
            (routine_folder / "M-16.6-definir-campos-obrigatorios-revisado.md").write_text(
                md_content, encoding="utf-8"
            )

            report_file = tmp_dir / "auditoria" / "cache" / "semantic-audit-report.json"
            gov_file = tmp_dir / "auditoria" / "cache" / "governance.json"

            async def mock_verify_transport(
                prompt: str,
                image_path: Optional[Path],
                schema_cls: Type[Any],
                model_name: str,
            ) -> Any:
                if "Passo 1" in prompt:
                    return SemanticAuditResult(
                        routine_id="M-16.6",
                        step_number=1,
                        semantic_match=True,
                        visual_confidence=0.96,
                        discrepancy_reason=None,
                    )
                return SemanticAuditResult(
                    routine_id="M-16.6",
                    step_number=6,
                    semantic_match=False,
                    visual_confidence=0.78,
                    discrepancy_reason="A moldura carmesim está deslocada sobre o cabeçalho em vez do botão Concluir.",
                )

            report = asyncio.run(
                verify_healed_routines_batch(
                    rotinas_dir=rotinas_dir,
                    report_output_path=report_file,
                    governance_file=gov_file,
                    custom_transport=mock_verify_transport,
                )
            )

            self.assertEqual(report["total_discovered_steps"], 2)
            self.assertEqual(report["evaluated_steps"], 2)
            self.assertEqual(report["approved_steps"], 1)
            self.assertEqual(report["flagged_for_priority_review"], 1)
            self.assertTrue(report_file.exists())
            self.assertTrue(gov_file.exists())

            gov_data = json.loads(gov_file.read_text(encoding="utf-8"))
            self.assertIn("M-16.6", gov_data)
            self.assertEqual(gov_data["M-16.6"]["statusGovernanca"], "revisao_solicitada")
            self.assertEqual(gov_data["M-16.6"]["prioritySemanticFlag"]["stepNumber"], 6)

    def test_cli_flags_parsing_and_intra_word_veto(self) -> None:
        """Valida flags `--limit`, `--dry-run`, `--verbose` e colisão intra-palavra ('Autenticidade' vs 'Cidade')."""
        c_args = parse_curate_args(["--limit", "5", "--dry-run", "--verbose"])
        self.assertEqual(c_args.limit, 5)
        self.assertTrue(c_args.dry_run)
        self.assertTrue(c_args.verbose)

        v_args = parse_verify_args(["--routines", "M-16.6,R-1.1", "--limit", "10", "--dry-run", "--verbose"])
        self.assertEqual(v_args.routines, "M-16.6,R-1.1")
        self.assertEqual(v_args.limit, 10)
        self.assertTrue(v_args.dry_run)
        self.assertTrue(v_args.verbose)

        allowed, reason = validate_som_candidate_semantics(
            {
                "rawText": "Selecione a modalidade **Autenticidade**.",
                "targets": ["Autenticidade"],
                "actionType": "select",
                "zonePolicy": "content",
            },
            {
                "id": 4,
                "name": "Cidade",
                "role": "combobox",
                "inNavbar": False,
            },
        )
        self.assertFalse(allowed)
        self.assertIn("Autenticidade", str(reason))


_ROUTINE_MD = """---
id: {rid}
titulo: 'Cadastrar Área de Atuação'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-18'
  status: validado_com_ajustes
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 5
        alvo_documentado: 'Concluir'
        elemento_real: 'Concluir'
        camada: investigative_reveal
        confianca: 1
        texto_alterado: true
---

#### Passo a passo revisado:
5. Clique no botão **Concluir** (exibido após clicar em **Adicionar**) para salvar a área no sistema.
   [aqui vai a print "passo-05.png"]
   [aqui vai a print "passo-05-b.png"]
"""


def _make_routine(rotinas_dir: Path, rid: str, slug: str, *, with_png: bool = True) -> Path:
    folder = rotinas_dir / "config" / f"{rid}-{slug}"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / f"{rid}-{slug}-revisado.md").write_text(_ROUTINE_MD.format(rid=rid), encoding="utf-8")
    names = ["passo-05.webp", "passo-05-b.webp", "passo-05-contexto-att.webp"]
    if with_png:
        names += ["passo-05.png", "passo-05-b.png"]
    for name in names:
        (folder / name).write_bytes(b"RIFFfakeWEBP")
    return folder


class TestSemanticVerifierSubCapturesAndFlags(unittest.TestCase):
    """ADR-035: o verificador vê o gatilho + o elemento revelado, mescla relatórios parciais e libera flags próprias."""

    def tearDown(self) -> None:
        worker_config.set_sdk_transport_for_tests(None)

    def test_find_sub_capture_images_ignores_context_print_and_other_steps(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            folder = Path(tmp)
            for name in (
                "passo-05.png",
                "passo-05-b.png",
                "passo-05-b.webp",
                "passo-05-c.webp",
                "passo-05-contexto-att.png",
                "passo-06-b.png",
            ):
                (folder / name).write_bytes(b"x")
            found = find_sub_capture_images(folder, 5)
            self.assertEqual([p.name for p in found], ["passo-05-b.png", "passo-05-c.webp"])
            self.assertEqual(find_sub_capture_images(folder, 6)[0].name, "passo-06-b.png")
            self.assertEqual(find_sub_capture_images(folder, 1), [])

    def test_prompt_lists_sub_captures_and_engine_conventions(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            sub = Path(tmp) / "passo-05-b.png"
            sub.write_bytes(b"x")
            prompt = build_semantic_verification_prompt(
                {
                    "routine_id": "M-41.0",
                    "titulo": "Cadastrar Área de Atuação",
                    "modulo": "config",
                    "step_number": 5,
                    "step_text": "Clique no botão **Concluir** (exibido após clicar em **Adicionar**).",
                    "divergences": [],
                    "sub_images": [sub],
                }
            )
            self.assertIn("passo-05-b.png", prompt)
            self.assertIn("Sub-captura do mesmo passo", prompt)
            self.assertIn("Gatilho + elemento revelado", prompt)
            self.assertIn("Valor de lista suspensa", prompt)
            without = build_semantic_verification_prompt(
                {"routine_id": "M-41.0", "step_number": 5, "step_text": "x", "divergences": []}
            )
            self.assertNotIn("Sub-captura do mesmo passo", without)

    def test_model_receives_trigger_and_revealed_frame(self) -> None:
        """Padrão B (M-41.0/M-66.0/M-68.0): sem `passo-05-b` o passo era reprovado; com o conjunto, aprova."""
        with tempfile.TemporaryDirectory() as tmp:
            tmp_dir = Path(tmp)
            rotinas_dir = tmp_dir / "auditoria" / "rotinas"
            _make_routine(rotinas_dir, "M-41.0", "cadastrar-area-de-atuacao")
            seen_prompts: list[str] = []

            async def transport(prompt: str, image_path: Optional[Path], schema_cls: Type[Any], model_name: str) -> Any:
                seen_prompts.append(prompt)
                revealed = "passo-05-b.png" in prompt
                return SemanticAuditResult(
                    routine_id="M-41.0",
                    step_number=5,
                    semantic_match=revealed,
                    visual_confidence=0.97,
                    discrepancy_reason=None if revealed else "Concluir não aparece",
                )

            report = asyncio.run(
                verify_healed_routines_batch(
                    rotinas_dir=rotinas_dir,
                    report_output_path=tmp_dir / "auditoria" / "cache" / "semantic-audit-report.json",
                    governance_file=tmp_dir / "auditoria" / "cache" / "governance.json",
                    custom_transport=transport,
                )
            )
            self.assertEqual(len(seen_prompts), 1)
            self.assertEqual(report["approved_steps"], 1)
            self.assertEqual(report["flagged_for_priority_review"], 0)
            self.assertNotIn("contexto-att", seen_prompts[0], "print de contexto do Raio-X não é sub-captura")

    def test_partial_run_merges_report_and_lifts_only_verifier_flags(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            tmp_dir = Path(tmp)
            rotinas_dir = tmp_dir / "auditoria" / "rotinas"
            _make_routine(rotinas_dir, "M-41.0", "cadastrar-area-de-atuacao")
            report_file = tmp_dir / "auditoria" / "cache" / "semantic-audit-report.json"
            gov_file = tmp_dir / "auditoria" / "cache" / "governance.json"
            report_file.parent.mkdir(parents=True, exist_ok=True)

            # Relatório consolidado anterior: M-41.0 reprovada + outra rotina (M-15.0) aprovada que NÃO será reexecutada
            report_file.write_text(
                json.dumps(
                    {
                        "results": [
                            {"routine_id": "M-15.0", "step_number": 1, "semantic_match": True, "visual_confidence": 0.99, "priority_review": False},
                            {"routine_id": "M-41.0", "step_number": 5, "semantic_match": False, "visual_confidence": 0.99, "priority_review": True},
                        ]
                    }
                ),
                encoding="utf-8",
            )
            gov_file.write_text(
                json.dumps(
                    {
                        "M-41.0": {
                            "statusGovernanca": "revisao_solicitada",
                            "revisor": VERIFIER_REVISOR,
                            "prioritySemanticFlag": {"stepNumber": 5},
                        },
                        "M-99.0": {"statusGovernanca": "revisao_solicitada", "revisor": "Revisor Humano"},
                    }
                ),
                encoding="utf-8",
            )

            async def transport(prompt: str, image_path: Optional[Path], schema_cls: Type[Any], model_name: str) -> Any:
                return SemanticAuditResult(routine_id="M-41.0", step_number=5, semantic_match=True, visual_confidence=0.98)

            report = asyncio.run(
                verify_healed_routines_batch(
                    rotinas_dir=rotinas_dir,
                    report_output_path=report_file,
                    governance_file=gov_file,
                    routine_ids=["M-41.0"],
                    custom_transport=transport,
                )
            )

            ids = sorted((r["routine_id"], r["step_number"]) for r in report["results"])
            self.assertEqual(ids, [("M-15.0", 1), ("M-41.0", 5)], "a rotina não reexecutada permanece no relatório")
            self.assertEqual(report["flagged_for_priority_review"], 0, "o item reprovado antigo foi substituído")
            self.assertEqual(report["approved_steps"], 2)
            self.assertEqual(report["last_run"]["lifted_semantic_flags"], ["M-41.0"])

            gov = json.loads(gov_file.read_text(encoding="utf-8"))
            self.assertEqual(gov["M-41.0"]["statusGovernanca"], "pendente_aprovacao")
            self.assertNotIn("prioritySemanticFlag", gov["M-41.0"])
            self.assertNotIn("revisor", gov["M-41.0"])
            self.assertEqual(gov["M-99.0"]["statusGovernanca"], "revisao_solicitada", "revisor humano nunca é alterado")
            self.assertEqual(gov["M-99.0"]["revisor"], "Revisor Humano")

    def test_lift_ignores_human_flags_and_missing_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            gov_file = Path(tmp) / "governance.json"
            self.assertEqual(lift_stale_semantic_flags({"M-1.0"}, governance_file=gov_file), [])
            gov_file.write_text(
                json.dumps({"M-1.0": {"statusGovernanca": "revisao_solicitada", "revisor": "Marcus"}}),
                encoding="utf-8",
            )
            self.assertEqual(lift_stale_semantic_flags({"M-1.0"}, governance_file=gov_file), [])
            self.assertEqual(
                json.loads(gov_file.read_text(encoding="utf-8"))["M-1.0"]["statusGovernanca"], "revisao_solicitada"
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
