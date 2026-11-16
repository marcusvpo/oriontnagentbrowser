import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractRoutineReviewTags,
  filterRoutineSummaries,
  mapRoutineSummary,
  mapStepRowsWithScope,
  resolveExternalStepMap,
} from '../server.js';

describe('Server API — multi-tags ([ATT][CCC]) e stepScope (external_portal)', () => {
  test('extractRoutineReviewTags e mapRoutineSummary expõem reviewTags combinadas em ordem canônica', () => {
    const row = {
      id: 'C-CENTRAL-02',
      titulo: 'Habilitação no SISCOAF',
      modulo: 'centrais',
      secao: 'C',
      fase: 3,
      tem_video: false,
      workload_type: 'mutation',
      status_auditoria: 'atualizacao_editorial',
      // Simula coluna com backfill parcial apenas com ATT, mas pasta e frontmatter trazem [ATT][CCC]
      tags_revisao: ['ATT'],
      status_governanca: 'pendente_aprovacao',
      pasta_auditoria: '[ATT][CCC] C-CENTRAL-02-habilitacao-siscoaf',
      auditoria_ui: {
        status: 'atualizacao_editorial',
        review_tags: ['CCC', 'ATT'],
      },
      total_passos: 7,
      prints_geradas: 1,
      divergencias_count: 0,
      rotas_hash: [],
      tags: ['centrais', 'coaf'],
      updated_at: '2026-11-16T14:00:00.000Z',
    };

    assert.deepEqual(extractRoutineReviewTags(row), ['ATT', 'CCC']);
    const summary = mapRoutineSummary(row);
    assert.deepEqual(summary.reviewTags, ['ATT', 'CCC']);
    assert.deepEqual(summary.tagsRevisao, ['ATT', 'CCC']);

    const cleanRow = {
      ...row,
      id: 'D-1.1',
      status_auditoria: 'validado_inalterado',
      tags_revisao: [],
      pasta_auditoria: 'D-1.1-acessar-caixa',
      auditoria_ui: { status: 'validado_inalterado' },
    };
    assert.deepEqual(extractRoutineReviewTags(cleanRow), []);
  });

  test('filterRoutineSummaries encontra [ATT][CCC] filtrando por ATT ou por CCC', () => {
    const combined = mapRoutineSummary({
      id: 'C-CENTRAL-02',
      titulo: 'Habilitação no SISCOAF',
      modulo: 'centrais',
      secao: 'C',
      fase: 3,
      tem_video: false,
      workload_type: 'mutation',
      status_auditoria: 'atualizacao_editorial',
      tags_revisao: ['ATT', 'CCC'],
      status_governanca: 'pendente_aprovacao',
      pasta_auditoria: '[ATT][CCC] C-CENTRAL-02-siscoaf',
      total_passos: 7,
      prints_geradas: 1,
      divergencias_count: 0,
      rotas_hash: [],
      tags: ['coaf'],
      updated_at: '2026-11-16T14:00:00.000Z',
    });
    const onlyAtt = mapRoutineSummary({
      id: 'D-3.14',
      titulo: 'Criar certidão',
      modulo: 'certidoes',
      secao: 'D',
      fase: 3,
      tem_video: false,
      workload_type: 'mutation',
      status_auditoria: 'atualizacao_editorial',
      tags_revisao: ['ATT'],
      status_governanca: 'pendente_aprovacao',
      pasta_auditoria: '[ATT] D-3.14-criar-certidao',
      total_passos: 6,
      prints_geradas: 1,
      divergencias_count: 0,
      rotas_hash: [],
      tags: ['certidao'],
      updated_at: '2026-11-16T14:00:00.000Z',
    });

    const list = [combined, onlyAtt];

    assert.deepEqual(
      filterRoutineSummaries(list, { tagsRevisao: ['ATT'] }).map(r => r.id),
      ['C-CENTRAL-02', 'D-3.14']
    );
    assert.deepEqual(
      filterRoutineSummaries(list, { tagsRevisao: ['CCC'] }).map(r => r.id),
      ['C-CENTRAL-02']
    );
    assert.deepEqual(
      filterRoutineSummaries(list, { tagsRevisao: ['ATT,CCC'] }).map(r => r.id),
      ['C-CENTRAL-02', 'D-3.14']
    );
    assert.deepEqual(
      filterRoutineSummaries(list, { q: 'ccc' }).map(r => r.id),
      ['C-CENTRAL-02']
    );
  });

  test('mapStepRowsWithScope expõe stepScope e portalExterno via banco, frontmatter, markdown ou análise fallback', () => {
    const rRow = {
      id: 'C-CENTRAL-02',
      auditoria_ui: {
        etapas_externas: [{ passo: 1, portal: 'SISCOAF' }],
      },
    };
    const effectiveMd = [
      '1. Acesse o portal **SISCOAF**.',
      '   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SISCOAF**).',
      '2. Cadastre o CPF no **SISCOAF**.',
      '   > [!IMPORTANT] **Etapa Externa (Fora do Orion TN):** este passo ocorre em ambiente externo ao Orion TN (**SISCOAF**).',
      '4. No **Orion TN**, acesse **Configurações**.',
    ].join('\n');

    const sRows = [
      {
        step_number: 1,
        action_type: 'navigate',
        zone_policy: 'any',
        targets: ['SISCOAF'],
        original_text: 'Acesse o portal **SISCOAF**.',
        validated_text: 'Acesse o portal **SISCOAF**.',
        is_modified: false,
        status: 'ok',
        step_scope: 'external_portal',
        portal_externo: 'SISCOAF',
        media: null,
      },
      {
        step_number: 2,
        action_type: 'fill',
        zone_policy: 'content',
        targets: [],
        original_text: 'Cadastre o CPF.',
        validated_text: 'Cadastre o CPF.',
        is_modified: false,
        status: 'ok',
        // Simula linha do banco com step_scope ainda não preenchido, mas markdown tem o callout externo
        step_scope: null,
        portal_externo: null,
        media: null,
      },
      {
        step_number: 4,
        action_type: 'click',
        zone_policy: 'any',
        targets: ['Configurações'],
        original_text: 'No **Orion TN**, acesse **Configurações**.',
        validated_text: 'No **Orion TN**, acesse **Configurações**.',
        is_modified: false,
        status: 'blocked',
        step_scope: 'orion_tn',
        portal_externo: null,
        media: { pngUrl: '/p4.png', width: 1440, height: 900 },
      },
    ];

    const mapped = mapStepRowsWithScope({ rRow, sRows, effectiveMd });
    assert.equal(mapped[0].stepScope, 'external_portal');
    assert.equal(mapped[0].portalExterno, 'SISCOAF');
    assert.equal(mapped[1].stepScope, 'external_portal');
    assert.equal(mapped[1].portalExterno, 'SISCOAF');
    assert.equal(mapped[2].stepScope, 'orion_tn');
    assert.equal(mapped[2].portalExterno, undefined);

    // Mesmo sem frontmatter nem markdown (apenas texto original + step_scope null no DB), o fallback detecta
    const fallbackMap = resolveExternalStepMap({
      rRow: { id: 'C-TEST', auditoria_ui: null },
      sRows: [
        {
          step_number: 1,
          action_type: 'navigate',
          targets: ['SISCOAF'],
          original_text: 'Acesse o portal oficial do **SISCOAF** com e-CPF.',
          validated_text: 'Acesse o portal oficial do **SISCOAF** com e-CPF.',
          step_scope: null,
        },
        {
          step_number: 2,
          action_type: 'click',
          targets: ['Configurações'],
          original_text: 'No **Orion TN**, acesse **Configurações**.',
          validated_text: 'No **Orion TN**, acesse **Configurações**.',
          step_scope: null,
        },
      ],
    });
    assert.equal(fallbackMap.get(1), 'SISCOAF');
    assert.equal(fallbackMap.has(2), false);
  });
});
