import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { config } from '../config.js';
import {
  applySomCuration,
  createOrionAuditMcpServer,
  inspectRoutine,
  listHumanReviews,
  listPendingSom,
  MCP_TOOL_DEFINITIONS,
  queryClusters,
  searchOrionTree,
  triggerSingleReaudit
} from '../mcp-server.js';
import {
  buildSafeDaemonCliArgs,
  OrionRealtimeWorkerDaemon
} from '../worker-daemon.js';
import {
  cleanRevisedMarkdownForDocs,
  exportManualDocs,
  exportPlaywrightSpecs,
  generatePlaywrightSpecForRoutine
} from '../exporters.js';
import { setRouteGraphForTesting } from '../route-crawler.js';
import { readPendingSomQueue, writePendingSomQueue, type PendingSomQueueItem } from '../smart-locator.js';
import { getRoutineHumanGuidance } from '../human-review-rag.js';

describe('ADR-032 — Servidor MCP Local (orion-audit + chrome-devtools), Worker Daemon Realtime e Exportadores', () => {
  it('1. .mcp.json configura playwright, chrome-devtools e orion-audit sem instalar @supabase/mcp-server-supabase', () => {
    const mcpPath = path.join(config.rootDir, '.mcp.json');
    assert.equal(fs.existsSync(mcpPath), true);
    const raw = fs.readFileSync(mcpPath, 'utf8');
    const parsed = JSON.parse(raw);

    assert.ok(parsed.mcpServers.playwright);
    assert.ok(parsed.mcpServers['chrome-devtools']);
    assert.deepEqual(parsed.mcpServers['chrome-devtools'], {
      command: 'npx',
      args: ['-y', 'chrome-devtools-mcp@latest']
    });
    assert.deepEqual(parsed.mcpServers['orion-audit'], {
      command: 'npx',
      args: ['--prefix', 'auditoria', 'tsx', 'auditoria/src/mcp-server.ts']
    });
    assert.equal(raw.includes('@supabase/mcp-server-supabase'), false);
  });

  it('2. createOrionAuditMcpServer inicializa com as 7 tools otimizadas e inspect_routine retorna metadados e .webp', () => {
    const server = createOrionAuditMcpServer();
    assert.ok(server);
    const toolNames = MCP_TOOL_DEFINITIONS.map(t => t.name);
    assert.deepEqual(toolNames, [
      'inspect_routine',
      'query_clusters',
      'search_orion_tree',
      'list_human_reviews',
      'trigger_single_reaudit',
      'list_pending_som',
      'apply_som_curation'
    ]);

    const r11 = inspectRoutine({ routineId: 'R-1.1' });
    assert.equal(r11.found, true);
    assert.equal(r11.audited, true);
    assert.equal(r11.routineId, 'R-1.1');
    assert.equal(r11.modulo, 'firmas');
    assert.ok(r11.frontmatterYaml.includes('id: R-1.1'));
    assert.ok(r11.webpImages.length > 0);
    assert.ok(r11.webpImages.every(p => p.endsWith('.webp')));

    const missing = inspectRoutine({ routineId: 'INEXISTENTE-999' });
    assert.equal(missing.found, false);
    assert.equal(missing.statusAuditoria, 'nao_encontrada');
  });

  it('3. query_clusters e search_orion_tree retornam agregações por tag/módulo/fase e buscam no grafo e glossário', () => {
    const clustersAll = queryClusters({ phase: 3, modulo: 'firmas' });
    assert.ok(clustersAll.totalMatching > 0);
    assert.ok(clustersAll.routines.every(r => r.modulo === 'firmas' && r.phase === 3));

    setRouteGraphForTesting({
      capturedAt: '2026-11-17T00:00:00.000Z',
      environment: 'Produtos',
      totalMenus: 10,
      totalRoutes: 1,
      entries: [
        {
          modulo: 'Firmas',
          chain: ['Firmas', 'Reconhecimento de firmas'],
          hash: '#/pedidoFirmas/cadastrar',
          title: 'Reconhecimento de firmas',
          tabs: ['Atendimento'],
          sections: ['Nomes para reconhecimento', 'Serviços realizados']
        }
      ]
    });

    try {
      const searchRes = searchOrionTree({ query: 'Reconhecimento de firmas' });
      assert.ok(searchRes.routeGraphMatches.length >= 1);
      assert.equal(searchRes.routeGraphMatches[0].hash, '#/pedidoFirmas/cadastrar');
      assert.ok(searchRes.glossarioMatches.length >= 1);
    } finally {
      setRouteGraphForTesting(undefined);
    }
  });

  it('4. list_human_reviews consulta via Pooler PostgreSQL IPv4 (pg) e trigger_single_reaudit dispara --dry-run-mutations', async () => {
    const executedQueries: string[] = [];
    const pgResult = await listHumanReviews({
      customPgQuery: async (sql: string) => {
        executedQueries.push(sql);
        if (sql.includes('FROM routine_reviews')) {
          return {
            rows: [
              {
                id: 'rev-test-r11',
                routine_id: 'R-1.1',
                revisor: 'Marcus (Revisor)',
                categoria: 'atualizacao_editorial',
                passos: [1, 2],
                motivo: 'Remover alternativa obsoleta',
                resolucao: null,
                status: 'aberta',
                versao: 2,
                atualizado_em: '2026-11-17T12:00:00.000Z',
                rotina_titulo: 'Módulo ORION TN: Firmas',
                rotina_modulo: 'firmas',
                status_auditoria: 'validado_com_ajustes',
                status_governanca: 'revisao_solicitada'
              }
            ]
          };
        }
        return {
          rows: [
            { status_governanca: 'aprovada', total: 12 },
            { status_governanca: 'revisao_solicitada', total: 9 }
          ]
        };
      }
    });

    assert.equal(pgResult.source, 'pg_pooler');
    assert.equal(pgResult.totalReviews, 1);
    assert.equal(pgResult.reviews[0].routineId, 'R-1.1');
    assert.equal(pgResult.governanceCounts.aprovada, 12);
    assert.equal(executedQueries.length, 2);

    let spawnedArgs: string[] = [];
    const reauditRes = await triggerSingleReaudit(
      { routineId: 'R-1.1', headless: true },
      {
        customSpawn: async args => {
          spawnedArgs = args;
          return { exitCode: 0, stdout: 'OK R-1.1', stderr: '' };
        }
      }
    );
    assert.equal(reauditRes.ok, true);
    assert.ok(spawnedArgs.includes('--routines'));
    assert.ok(spawnedArgs.includes('R-1.1'));
    assert.ok(spawnedArgs.includes('--dry-run-mutations'));
    assert.ok(spawnedArgs.includes('--headless'));
  });

  it('5. list_pending_som e apply_som_curation atualizam Camada 0.1, gravam via pg Pooler e removem da fila SoM', async () => {
    const prevQueue = readPendingSomQueue();
    const testItem: PendingSomQueueItem = {
      id: 'TEST-SOM-01-passo-03',
      routineId: 'TEST-SOM-01',
      stepNumber: 3,
      rawText: 'Clique no botão **Confirmar Lançamento**.',
      targets: ['Confirmar Lançamento'],
      actionType: 'click',
      zonePolicy: 'content',
      routeHash: '#/testeSom/55',
      somImagePath: 'auditoria/cache/pending-som/TEST-SOM-01-passo-03-som.png',
      candidates: [
        {
          id: 1,
          box: { x: 100, y: 200, width: 120, height: 32 },
          tagName: 'button',
          role: 'button',
          name: 'Efetivar Lançamento',
          innerText: 'Efetivar Lançamento',
          selector: '[data-orion-som-id="1"]'
        }
      ],
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    try {
      await writePendingSomQueue([...prevQueue.filter(i => i.routineId !== 'TEST-SOM-01'), testItem]);
      const listed = listPendingSom();
      assert.ok(listed.items.some(i => i.routineId === 'TEST-SOM-01' && i.stepNumber === 3));

      let pgInsertCalled = false;
      const curRes = await applySomCuration(
        {
          routineId: 'TEST-SOM-01',
          stepNumber: 3,
          tagId: 1,
          actualTarget: 'Efetivar Lançamento',
          note: 'Botão confirmado visualmente no painel inferior'
        },
        {
          syncToSupabaseRest: false,
          customPgQuery: async sql => {
            if (sql.includes('INSERT INTO routine_reviews')) {
              pgInsertCalled = true;
            }
            return { rows: [] };
          }
        }
      );

      assert.equal(curRes.ok, true);
      assert.equal(curRes.persistedPgPooler, true);
      assert.equal(curRes.removedFromQueue, true);
      assert.equal(pgInsertCalled, true);

      const afterQueue = readPendingSomQueue();
      assert.equal(
        afterQueue.some(i => i.routineId === 'TEST-SOM-01' && i.stepNumber === 3),
        false
      );

      const guidance = getRoutineHumanGuidance('TEST-SOM-01');
      assert.ok(
        guidance?.targetOverrides.some(
          ov => ov.documented === 'Confirmar Lançamento' && ov.actual === 'Efetivar Lançamento'
        )
      );
    } finally {
      await writePendingSomQueue(prevQueue);
    }
  });

  it('6. OrionRealtimeWorkerDaemon aplica debounce por rotina e trava de concorrência (1 job por vez)', async () => {
    const executedOrder: string[] = [];
    const syncedRoutines: string[] = [];
    let refreshCalls = 0;

    const daemon = new OrionRealtimeWorkerDaemon({
      debounceMs: 30,
      quiet: true,
      refreshCacheFn: async () => {
        refreshCalls++;
      },
      runRoutineCliFn: async (routineId, args) => {
        assert.deepEqual(args, buildSafeDaemonCliArgs(routineId, 'headless'));
        await new Promise(r => setTimeout(r, 40));
        executedOrder.push(routineId);
        return { ok: true };
      },
      syncRoutineFn: async routineId => {
        syncedRoutines.push(routineId);
      }
    });

    // Dispara 3 eventos rápidos para M-16.2 (devem coalescer em 1 execução) + 1 evento para R-1.1
    const p1 = daemon.handleRoutineReviewChange({
      eventType: 'INSERT',
      new: { routine_id: 'M-16.2', status: 'aberta' }
    });
    const p2 = daemon.handleRoutineReviewChange({
      eventType: 'UPDATE',
      new: { routine_id: 'M-16.2', status: 'aberta' }
    });
    const p3 = daemon.handleJobChange(
      {
        eventType: 'INSERT',
        new: { routine_id: 'R-1.1', job_id: 'job-test-1', estado: 'na_fila', modo: 'headless' }
      },
      'runner_jobs'
    );

    assert.ok(p1 && p2 && p3);
    const [resM16, resR11] = await Promise.all([p2!, p3!]);

    assert.equal(resM16.ok, true);
    assert.equal(resR11.ok, true);
    assert.deepEqual(executedOrder.sort(), ['M-16.2', 'R-1.1']);
    assert.deepEqual(syncedRoutines.sort(), ['M-16.2', 'R-1.1']);
    assert.equal(refreshCalls, 2);

    const stats = daemon.getStats();
    assert.equal(stats.maxObservedConcurrency, 1);
    assert.equal(stats.completedCount, 2);
    await daemon.stop();
  });

  it('7. Exporters (--export-docs e --export-playwright) geram Markdown limpo sem metadados técnicos e specs @playwright/test executáveis', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orion-exporters-test-'));
    const fakeRotinasDir = path.join(tmpDir, 'rotinas');
    const fakeModDir = path.join(fakeRotinasDir, 'firmas', 'R-1.1-abertura-ficha');
    const docsOutDir = path.join(tmpDir, 'exports', 'manual-publicado');
    const pwOutDir = path.join(tmpDir, 'exports', 'playwright-e2e');

    try {
      fs.mkdirSync(fakeModDir, { recursive: true });
      const sampleRevisedMd = [
        '---',
        'id: R-1.1',
        'titulo: "Módulo ORION TN: Firmas (Visão Geral)"',
        'modulo: firmas',
        'secao: R',
        'auditoria_ui:',
        '  status: validado_com_ajustes',
        '  status_governanca: aprovada',
        '  worker_id: worker-1',
        '  auto_cura:',
        '    acionada: true',
        '    divergencias_detectadas:',
        '      - passo: 1',
        '        alvo_documentado: Firmas > Balcão de Firmas',
        '        elemento_real: Firmas > Reconhecimento de firmas',
        '        camada: menu_path_resolution',
        '        confianca: 1',
        '---',
        '',
        '#### Descrição:',
        'O módulo de **Firmas** centraliza o atendimento de balcão.',
        '',
        '#### Passo a passo revisado:',
        '1. Acesse o menu **Firmas > Reconhecimento de firmas**.',
        '   [aqui vai a print "passo-01.png"]',
        '   > [!NOTE] **Demarcações na print:** (1) **Firmas** · (2) **Reconhecimento de firmas**',
        '   > [!NOTE] **Divergência de caminho de menu:** Caminho atualizado.',
        '2. Pesquise pelo **Nome** e clique em **Salvar**.',
        '   [aqui vai a print "passo-02.png"]',
        '   > [!NOTE] **Trava Segura de Mutação (dry-run):** o comando **Salvar** foi omitido.',
        '',
        '* **Observação: Confira o cartão antes de concluir.**',
        '',
        '#### Evolução da Reauditoria',
        '* **Status:** [ATT] -> validado_com_ajustes',
        ''
      ].join('\n');

      fs.writeFileSync(
        path.join(fakeModDir, 'R-1.1-abertura-ficha-revisado.md'),
        sampleRevisedMd,
        'utf8'
      );
      fs.writeFileSync(path.join(fakeModDir, 'passo-01.webp'), 'fake-webp-1');
      fs.writeFileSync(path.join(fakeModDir, 'passo-02.webp'), 'fake-webp-2');

      const cleaned = cleanRevisedMarkdownForDocs(sampleRevisedMd, {
        imageRelativePrefix: '../../rotinas/firmas/R-1.1-abertura-ficha'
      });
      assert.equal(cleaned.includes('auditoria_ui:'), false);
      assert.equal(cleaned.includes('[!NOTE]'), false);
      assert.equal(cleaned.includes('Evolução da Reauditoria'), false);
      assert.equal(cleaned.includes('#### Passo a passo:'), true);
      assert.equal(
        cleaned.includes('![Passo 1](../../rotinas/firmas/R-1.1-abertura-ficha/passo-01.webp)'),
        true
      );

      const docsRes = await exportManualDocs({
        rotinasDir: fakeRotinasDir,
        outputDir: docsOutDir,
        includeUnapproved: false
      });
      assert.equal(docsRes.exportedCount, 1);
      assert.equal(fs.existsSync(path.join(docsOutDir, '_indice.md')), true);

      const pwRes = await exportPlaywrightSpecs({
        rotinasDir: fakeRotinasDir,
        outputDir: pwOutDir,
        includeUnapproved: true
      });
      assert.equal(pwRes.exportedCount, 1);
      const specContent = fs.readFileSync(pwRes.files[0].specPath, 'utf8');
      assert.ok(specContent.includes("import { test, expect } from '@playwright/test';"));
      assert.ok(specContent.includes('viewport: { width: 1440, height: 900 }'));
      assert.ok(specContent.includes('Reconhecimento de firmas'));
      assert.ok(specContent.includes("process.env.ORION_E2E_ALLOW_MUTATIONS === 'true'"));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
