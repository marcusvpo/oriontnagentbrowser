import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildExportJson,
  buildExportMarkdown,
  computeCurationStage,
  computeReviewIngestionFlags,
  computeRoutineReviewRollup,
} from '../review-export.js';
import { filterRoutineSummaries, mapRoutineSummary } from '../server.js';

describe('ADR-036 — Ciclo de Ingestão, Estágios de Curadoria e Exportação em Massa', () => {
  test('computeReviewIngestionFlags distingue pendente, ingerida e editada pós-ingestão', () => {
    const pendente = computeReviewIngestionFlags({
      status: 'aberta',
      versao: 1,
      consumida_pelo_agente: false,
    });
    assert.deepEqual(pendente, {
      consumidaPeloAgente: false,
      editadaPosIngestao: false,
      pendenteExportacao: true,
    });

    const ingerida = computeReviewIngestionFlags({
      status: 'aberta',
      versao: 2,
      consumida_pelo_agente: true,
      versao_consumida: 2,
    });
    assert.deepEqual(ingerida, {
      consumidaPeloAgente: true,
      editadaPosIngestao: false,
      pendenteExportacao: false,
    });

    const reeditada = computeReviewIngestionFlags({
      status: 'em_andamento',
      versao: 3,
      consumida_pelo_agente: true,
      versao_consumida: 2,
    });
    assert.deepEqual(reeditada, {
      consumidaPeloAgente: true,
      editadaPosIngestao: true,
      pendenteExportacao: true,
    });
  });

  test('mapRoutineSummary e filterRoutineSummaries filtram por ingestao e estagio', () => {
    const baseRow = {
      titulo: 'Rotina Teste',
      modulo: 'config',
      secao: 'M',
      fase: 2,
      tem_video: false,
      workload_type: 'mutation',
      tags_revisao: ['ATT'],
      pasta_auditoria: '[ATT] M-16.2-teste',
      total_passos: 3,
      prints_geradas: 2,
      divergencias_count: 0,
      rotas_hash: ['#/configuracoes'],
      tags: ['config'],
      updated_at: '2026-11-19T10:00:00.000Z',
    };

    const ingerida = mapRoutineSummary(
      { ...baseRow, id: 'M-16.2', status_auditoria: 'atualizacao_editorial', status_governanca: 'revisao_solicitada' },
      undefined,
      undefined,
      [
        {
          status: 'aberta',
          versao: 1,
          consumida_pelo_agente: true,
          consumida_em: '2026-11-19T11:00:00.000Z',
          consumida_por: 'Marcus',
          lote_exportacao_id: 'lote-2026-11-19-abcd',
          versao_consumida: 1,
        },
      ],
    );

    const pendente = mapRoutineSummary(
      { ...baseRow, id: 'M-16.3', status_auditoria: 'atualizacao_editorial', status_governanca: 'revisao_solicitada' },
      undefined,
      undefined,
      [{ status: 'aberta', versao: 1, consumida_pelo_agente: false }],
    );

    const aprovada = mapRoutineSummary({
      ...baseRow,
      id: 'R-1.1',
      status_auditoria: 'validado_inalterado',
      tags_revisao: [],
      pasta_auditoria: 'R-1.1-ok',
      status_governanca: 'aprovada',
    });

    const list = [ingerida, pendente, aprovada];

    assert.equal(ingerida.reviewIngestionState, 'ingerida_pelo_agente');
    assert.equal(ingerida.curationStage, 'ingeridas_agente');
    assert.equal(pendente.reviewIngestionState, 'pendente_exportacao');
    assert.equal(pendente.curationStage, 'revisao_pendente');
    assert.equal(aprovada.curationStage, 'aprovadas_kb');

    assert.deepEqual(
      filterRoutineSummaries(list, { ingestao: ['ingerida_pelo_agente'] }).map(r => r.id),
      ['M-16.2'],
    );
    assert.deepEqual(
      filterRoutineSummaries(list, { estagio: 'revisao_pendente' }).map(r => r.id),
      ['M-16.3'],
    );
    assert.deepEqual(
      filterRoutineSummaries(list, { estagio: 'aprovadas_kb' }).map(r => r.id),
      ['R-1.1'],
    );
    assert.deepEqual(
      filterRoutineSummaries(list, { q: 'lote-2026-11-19-abcd' }).map(r => r.id),
      ['M-16.2'],
    );
  });

  test('computeRoutineReviewRollup + computeCurationStage + buildExportMarkdown/Json funcionam ponta a ponta', () => {
    const rollup = computeRoutineReviewRollup([
      {
        status: 'aberta',
        versao: 2,
        consumida_pelo_agente: true,
        consumida_em: '2026-11-19T10:00:00.000Z',
        consumida_por: 'Marcus',
        lote_exportacao_id: 'lote-1',
        versao_consumida: 1,
      },
    ]);
    assert.equal(rollup.temNovaRevisaoPosIngestao, true);
    assert.equal(rollup.reviewIngestionState, 'pendente_exportacao');
    assert.equal(
      computeCurationStage({
        statusGovernanca: 'revisao_solicitada',
        statusAuditoria: 'atualizacao_editorial',
        revisoesPendentesExportacao: rollup.revisoesPendentesExportacao,
        revisoesConsumidasCount: rollup.revisoesConsumidasCount,
      }),
      'revisao_pendente',
    );

    const md = buildExportMarkdown({
      batchId: 'lote-2026-11-19-0001',
      operador: 'Marcus',
      nota: 'Lote teste',
      marcarComoIngeridas: true,
      exportedAt: '2026-11-19T12:00:00.000Z',
      routines: [
        {
          id: 'M-16.2',
          titulo: 'Teste',
          modulo: 'config',
          secao: 'M',
          fase: 2,
          statusAuditoria: 'atualizacao_editorial',
          reviewTags: ['ATT'],
          statusGovernanca: 'revisao_solicitada',
          rotasHash: [],
          steps: [
            {
              stepNumber: 1,
              status: 'ok',
              originalText: 'Passo original',
              validatedText: 'Passo revisado',
              isModified: true,
            },
          ],
          revisoes: [
            {
              id: 'rev-1',
              versao: 2,
              status: 'aberta',
              categoria: 'divergencia_texto',
              revisor: 'SD',
              atualizadoPor: 'SD',
              criadoEm: '2026-11-19T10:00:00.000Z',
              atualizadoEm: '2026-11-19T11:00:00.000Z',
              passos: [1],
              motivo: 'Orientação detalhada para o agente.',
              consumidaAnteriormente: true,
              versaoConsumidaAnterior: 1,
            },
          ],
        },
      ],
    });
    assert.match(md, /lote-2026-11-19-0001/);
    assert.match(md, /Atualizada após ingestão anterior \(v1 → v2\)/);
    assert.match(md, /Orientação detalhada para o agente/);

    const json = JSON.parse(
      buildExportJson({
        batchId: 'lote-2026-11-19-0001',
        operador: 'Marcus',
        marcarComoIngeridas: true,
        exportedAt: '2026-11-19T12:00:00.000Z',
        routines: [],
      }),
    );
    assert.equal(json.schema, 'orion-audit-review-export/v1');
  });
});
