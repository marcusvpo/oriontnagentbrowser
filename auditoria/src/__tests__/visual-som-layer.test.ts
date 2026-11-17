import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  computeSetOfMarkTagPlacement,
  MAX_SOM_CANDIDATES,
  renderSetOfMarkOverlay
} from '../annotator.js';
import {
  AGY_EFFORT_LEVEL,
  AGY_MODEL_ID,
  AsyncSemaphore,
  buildAgyCliArgs,
  buildAgyStdinPayload,
  invokeAgyJson,
  parseStrictJsonFromAgyOutput,
  resolveVisualAuditMode,
  withEphemeralSomImage
} from '../agy-client.js';
import {
  buildAnchorVisualPointScript,
  buildCollectSomCandidatesScript,
  enqueuePendingSomForCuration,
  filterSomCandidatesForStep,
  normalizedPointToViewportPx,
   parseSomVlmResponse,
  parseVisualGroundingResponse,
  PENDING_SOM_DIR,
  PENDING_SOM_QUEUE_FILE,
  readPendingSomQueue,
  resolveViaLLMOnAccessibilityTree,
  resolveViaSetOfMark2C,
  resolveViaVisualGrounding2C,
  validateVisualCandidateSemantics,
  writePendingSomQueue,
  type ParsedA11yNode,
  type SomInteractiveCandidate
} from '../smart-locator.js';
import { curatePendingSomQueue } from '../curate-pending-som.js';
import { routeSynonymsFor } from '../route-synonyms.js';
import { getHumanTargetSuggestionsForStep } from '../human-review-rag.js';
import type { AgentBrowserClient } from '../browser.js';
import type { BoundingBox, DOMResolvedGeometry, RoutineStep } from '../types.js';

function stepOf(
  stepNumber: number,
  rawText: string,
  targets: string[],
  actionType: RoutineStep['actionType'] = 'click',
  routineId = 'TEST-SOM-01'
): RoutineStep {
  return {
    stepNumber,
    routineId,
    rawText,
    targets,
    actionType,
    mainTargetCount: targets.length
  };
}

async function createSolidPngBuffer(width = 1440, height = 900): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 245, g: 246, b: 248, alpha: 1 }
    }
  })
    .png()
    .toBuffer();
}

function makeGeometry(box: BoundingBox, innerText: string, matchedSelector: string): DOMResolvedGeometry {
  return {
    cssBox: box,
    viewport: { width: 1440, height: 900, devicePixelRatio: 1, scrollX: 0, scrollY: 0 },
    context: {
      tagName: 'button',
      role: 'button',
      innerText,
      isTopNav: false,
      isVerticalSidebar: false,
      semantic: {
        sectionTitle: 'Serviços realizados',
        semanticRole: 'service_execution_trigger'
      }
    },
    matchedSelector,
    url: 'http://orion.local/webFirmas/#/pedidoFirmas/cadastrar',
    capturedAt: new Date().toISOString(),
    zone: 'content',
    zonePolicy: 'content',
    contentRoot: {
      selector: 'main',
      strategy: 'container-principal:main',
      box: { x: 220, y: 60, width: 1200, height: 820 }
    },
    lateralNavBoxes: [{ x: 0, y: 60, width: 210, height: 820 }]
  };
}

describe('ADR-031 Etapa 1 — Renderizador Set-of-Mark (SoM) Efêmero em Memória com Sharp', () => {
  it('renderSetOfMarkOverlay gera buffer PNG 1440x900 em memória sem gravar em disco e limita a 45 candidatos', async () => {
    const baseBuf = await createSolidPngBuffer(1440, 900);
    const candidates = Array.from({ length: 52 }, (_, i) => ({
      id: i + 1,
      box: {
        x: 240 + (i % 8) * 140,
        y: 80 + Math.floor(i / 8) * 95,
        width: 90,
        height: 34
      }
    }));

    assert.equal(MAX_SOM_CANDIDATES, 45);
    const overlayBuf = await renderSetOfMarkOverlay(baseBuf, candidates);
    assert.ok(Buffer.isBuffer(overlayBuf));
    assert.ok(overlayBuf.length > 0);
    assert.notEqual(Buffer.compare(baseBuf, overlayBuf), 0, 'O buffer anotado com SoM deve diferir da imagem limpa');

    const meta = await sharp(overlayBuf).metadata();
    assert.equal(meta.format, 'png');
    assert.equal(meta.width, 1440);
    assert.equal(meta.height, 900);
  });

  it('computeSetOfMarkTagPlacement nunca cobre o centro (cx, cy) do próprio alvo', () => {
    const testBoxes: BoundingBox[] = [
      { x: 300, y: 200, width: 32, height: 32 }, // micro-ícone
      { x: 4, y: 4, width: 28, height: 24 }, // canto superior esquerdo extremo
      { x: 1405, y: 868, width: 30, height: 26 }, // canto inferior direito extremo
      { x: 500, y: 12, width: 110, height: 34 } // barra superior
    ];
    const occupied: BoundingBox[] = [];

    for (const box of testBoxes) {
      const tagBox = computeSetOfMarkTagPlacement(box, { width: 30, height: 20 }, 1440, 900, occupied);
      occupied.push(tagBox);

      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      const coversCenter =
        cx >= tagBox.x &&
        cx <= tagBox.x + tagBox.width &&
        cy >= tagBox.y &&
        cy <= tagBox.y + tagBox.height;

      assert.equal(coversCenter, false, `Tag SoM não pode cobrir o centro (${cx}, ${cy}) do alvo ${JSON.stringify(box)}`);
      assert.ok(tagBox.x >= 2 && tagBox.x + tagBox.width <= 1438, 'Tag dentro dos limites horizontais do canvas');
      assert.ok(tagBox.y >= 2 && tagBox.y + tagBox.height <= 898, 'Tag dentro dos limites verticais do canvas');
    }
  });
});

describe('ADR-031 Etapa 2A — Protocolo Antigravity CLI (agy-client.ts), Semáforo e Parse JSON', () => {
  it('buildAgyCliArgs e buildAgyStdinPayload configuram Gemini 4 Hydrogen Extra via STDIN', () => {
    const argsText = buildAgyCliArgs({ prompt: 'teste simples', timeoutMs: 45_000 });
    assert.ok(argsText.includes('--print'));
    assert.ok(argsText.includes('--model'));
    assert.ok(argsText.includes(AGY_MODEL_ID));
    assert.ok(argsText.includes('--effort'));
    assert.ok(argsText.includes(AGY_EFFORT_LEVEL));
    assert.ok(argsText.includes('--disable-slash-commands'));
    assert.equal(argsText.includes('teste simples'), false, 'Prompt nunca deve ir na linha de comando');

    const imgPath = path.join(process.cwd(), 'auditoria', 'cache', 'som-worker-1-999.png');
    const argsImg = buildAgyCliArgs({ prompt: 'inspecionar', imagePath: imgPath });
    assert.ok(argsImg.includes('--dangerously-skip-permissions'));
    assert.ok(argsImg.includes('--add-dir'));

    const stdinPayload = buildAgyStdinPayload('Analise os candidatos', imgPath);
    assert.match(stdinPayload, /@.*som-worker-1-999\.png/);
    assert.match(stdinPayload, /Analise os candidatos/);
  });

  it('AsyncSemaphore(1) serializa chamadas concorrentes de múltiplos workers', async () => {
    const sem = new AsyncSemaphore(1);
    let active = 0;
    let maxObserved = 0;
    const order: number[] = [];

    await Promise.all(
      [1, 2, 3, 4].map(id =>
        sem.runExclusive(async () => {
          active++;
          maxObserved = Math.max(maxObserved, active);
          await new Promise(r => setTimeout(r, 15));
          order.push(id);
          active--;
        })
      )
    );

    assert.equal(maxObserved, 1, 'Nunca deve haver mais de 1 inferência simultânea no agy');
    assert.deepEqual(order, [1, 2, 3, 4]);
  });

  it('withEphemeralSomImage grava som-worker-${workerId}-${ts}.png e remove o arquivo no bloco finally', async () => {
    const buf = await createSolidPngBuffer(64, 64);
    let capturedPath = '';

    await withEphemeralSomImage(buf, 'worker-3', async tempPath => {
      capturedPath = tempPath;
      assert.match(path.basename(tempPath), /^som-worker-worker-3-\d+/);
      assert.equal(fs.existsSync(tempPath), true, 'Arquivo temporário deve existir durante a chamada ao agy');
    });

    assert.ok(capturedPath);
    assert.equal(fs.existsSync(capturedPath), false, 'Arquivo temporário deve ser removido no finally');
  });

  it('parseStrictJsonFromAgyOutput e parseSomVlmResponse / parseVisualGroundingResponse tratam envelopes e erros', () => {
    assert.deepEqual(
      parseSomVlmResponse('```json\n{"tagId": 12, "confidence": 0.91, "reason": "Botão icônico de impressão"}\n```'),
      { tagId: 12, confidence: 0.91, reason: 'Botão icônico de impressão' }
    );

    assert.deepEqual(
      parseSomVlmResponse({ result: '{"tag_id": "[7]", "confidence": 0.84, "reason": "Envelope agy json"}' }),
      { tagId: 7, confidence: 0.84, reason: 'Envelope agy json' }
    );

    assert.equal(parseSomVlmResponse('resposta inválida sem json'), null);

    assert.deepEqual(
      parseVisualGroundingResponse('{"x": 500, "y": 250, "confidence": 0.88, "reason": "Centro do ícone"}'),
      { x: 500, y: 250, confidence: 0.88, reason: 'Centro do ícone' }
    );

    assert.equal(
      parseVisualGroundingResponse('{"x": 1400, "y": 250, "confidence": 0.9, "reason": "Fora da escala 0..1000"}'),
      null
    );

    assert.deepEqual(normalizedPointToViewportPx(500, 500, 1440, 900), { x: 720, y: 450 });
  });

  it('resolveVisualAuditMode aplica live em --routines/--routine e defer em --phase/--reaudit-pending', () => {
    assert.equal(resolveVisualAuditMode(['--routines', 'R-1.1,R-2.0']), 'live');
    assert.equal(resolveVisualAuditMode(['--routine', 'M-16.2']), 'live');
    assert.equal(resolveVisualAuditMode(['--phase', '2']), 'defer');
    assert.equal(resolveVisualAuditMode(['--reaudit-pending']), 'defer');
    assert.equal(resolveVisualAuditMode(['--phase', '2', '--visual-mode', 'live']), 'live');
    assert.equal(resolveVisualAuditMode(['--routines', 'R-1.1', '--visual-mode=defer']), 'defer');
  });
});

describe('ADR-031 Etapa 2B/2C — Veto Semântico Pós-VLM e Execução 100% Offline (Mock API)', () => {
  it('scripts injetáveis buildCollectSomCandidatesScript e buildAnchorVisualPointScript têm sintaxe JS válida', () => {
    assert.doesNotThrow(() => new Function(buildCollectSomCandidatesScript('content', 45)));
    assert.doesNotThrow(() => new Function(buildAnchorVisualPointScript(720, 450)));
  });

  it('resolveViaLLMOnAccessibilityTree (Camada 2B via agy) funciona sem OPENAI_API_KEY com mock offline', async () => {
    const step = stepOf(3, 'Clique no botão **Incluir Serviço**.', ['Incluir Serviço'], 'click');
    const nodes: ParsedA11yNode[] = [
      {
        ref: '@e21',
        role: 'button',
        name: 'Adicionar Serviço',
        rawLine: 'button "Adicionar Serviço"',
        sectionTitle: 'Serviços realizados'
      }
    ];

    const mockFetch = (async () =>
      new Response(
        JSON.stringify({
          choices: [{ message: { content: JSON.stringify({ ref: '@e21', confidence: 0.89, reason: 'Sinônimo funcional' }) } }]
        }),
        { status: 200 }
      )) as unknown as typeof fetch;

    const resolved = await resolveViaLLMOnAccessibilityTree(step, nodes, mockFetch);
    assert.ok(resolved);
    assert.equal(resolved!.node.ref, '@e21');
    assert.equal(resolved!.confidence, 0.89);
  });

  it('resolveViaSetOfMark2C aplica veto semântico pós-VLM em colisões proibidas (Novo cartão +, Cidade, Navbar) e aprova candidato válido', async () => {
    const screenshotBuf = await createSolidPngBuffer(1440, 900);
    const serviceStep = stepOf(4, 'Na seção de serviços, acione **Efetuar Serviço**.', ['Efetuar Serviço'], 'click');

    const candidates: SomInteractiveCandidate[] = [
      {
        id: 1,
        box: { x: 1120, y: 120, width: 130, height: 34 },
        tagName: 'button',
        role: 'button',
        name: 'Novo cartão +',
        innerText: 'Novo cartão +',
        selector: '[data-orion-som-id="1"]',
        sectionTitle: 'Cartões',
        semanticRole: 'entity_creation_button'
      },
      {
        id: 2,
        box: { x: 860, y: 420, width: 38, height: 34 },
        tagName: 'button',
        role: 'button',
        name: 'Executar lançamento',
        innerText: 'Executar lançamento',
        selector: '[data-orion-som-id="2"]',
        sectionTitle: 'Serviços realizados',
        semanticRole: 'service_execution_trigger'
      }
    ];

    let domGeometryCalls = 0;
    const fakeClient = {
      getDOMGeometry: async (queries: string[]) => {
        domGeometryCalls++;
        if (queries.includes('[data-orion-som-id="2"]')) {
          return makeGeometry(candidates[1].box, 'Executar lançamento', '[data-orion-som-id="2"]');
        }
        return null;
      }
    } as unknown as AgentBrowserClient;

    // 1. VLM alucina tagId=1 ("Novo cartão +"): deve sofrer VETO semântico antes de medir no DOM!
    const vetoedMockFetch = (async () =>
      new Response(
        JSON.stringify({
          result: JSON.stringify({ tagId: 1, confidence: 0.97, reason: 'Alucinação para Novo cartão +' })
        }),
        { status: 200 }
      )) as unknown as typeof fetch;

    const vetoedResult = await resolveViaSetOfMark2C(fakeClient, serviceStep, screenshotBuf, candidates, {
      zonePolicy: 'content',
      workerId: 'test-veto',
      customVlmRunner: vetoedMockFetch
    });
    assert.equal(vetoedResult, null, 'Novo cartão + deve ser vetado semanticamente pós-VLM');
    assert.equal(domGeometryCalls, 0, 'Não deve medir no DOM candidato vetado semanticamente');

    // 2. Veto de "Cidade" quando o passo pede "Autenticidade"
    const authStep = stepOf(5, 'Selecione a modalidade **Autenticidade**.', ['Autenticidade'], 'select');
    const cityCheck = validateVisualCandidateSemantics(
      authStep,
      {
        name: 'Cidade',
        role: 'combobox',
        sectionTitle: 'Endereço',
        semanticRole: 'form_input'
      },
      'content'
    );
    assert.equal(cityCheck.allowed, false, 'Cidade deve ser vetada para Autenticidade');

    // 3. VLM seleciona tagId=2 válido: passa pelo filtro semântico e mede getBoundingClientRect() real
    const validMockFetch = (async () =>
      new Response(
        JSON.stringify({
          result: JSON.stringify({ tagId: 2, confidence: 0.91, reason: 'Botão de execução na seção Serviços realizados' })
        }),
        { status: 200 }
      )) as unknown as typeof fetch;

    const validResult = await resolveViaSetOfMark2C(fakeClient, serviceStep, screenshotBuf, candidates, {
      zonePolicy: 'content',
      workerId: 'test-ok',
      customVlmRunner: validMockFetch
    });
    assert.ok(validResult);
    assert.equal(validResult!.candidate.id, 2);
    assert.equal(validResult!.geometry.matchedSelector, '[data-orion-som-id="2"]');
    assert.equal(domGeometryCalls, 1);
  });

  it('resolveViaVisualGrounding2C converte [0..1000] -> px, ancora via elementFromPoint e aplica veto semântico', async () => {
    const screenshotBuf = await createSolidPngBuffer(1440, 900);
    const step = stepOf(2, 'Acione o botão **Imprimir** na barra de ferramentas.', ['Imprimir'], 'click');

    let anchoredCandidate: SomInteractiveCandidate | null = {
      id: 1,
      box: { x: 720, y: 180, width: 36, height: 34 },
      tagName: 'button',
      role: 'button',
      name: 'Novo cartão +',
      selector: '[data-orion-grounding-target="1"]',
      semanticRole: 'entity_creation_button'
    };

    const fakeClient = {
      evalJson: async () => anchoredCandidate,
      getDOMGeometry: async () =>
        makeGeometry({ x: 720, y: 180, width: 36, height: 34 }, 'Imprimir Relatório', '[data-orion-grounding-target="1"]')
    } as unknown as AgentBrowserClient;

    const groundingMock = (async () =>
      new Response(
        JSON.stringify({
          result: JSON.stringify({ x: 500, y: 200, confidence: 0.88, reason: 'Ícone de impressora no topo da seção' })
        }),
        { status: 200 }
      )) as unknown as typeof fetch;

    // 1. Quando o ponto cai sobre "Novo cartão +", o veto semântico bloqueia
    const rejected = await resolveViaVisualGrounding2C(fakeClient, step, screenshotBuf, {
      zonePolicy: 'content',
      workerId: 'test-grounding',
      customVlmRunner: groundingMock
    });
    assert.equal(rejected, null);

    // 2. Quando o ponto cai sobre o botão compatível, retorna a geometria real do DOM
    anchoredCandidate = {
      id: 1,
      box: { x: 720, y: 180, width: 36, height: 34 },
      tagName: 'button',
      role: 'button',
      name: 'Imprimir Relatório',
      innerText: 'Imprimir Relatório',
      selector: '[data-orion-grounding-target="1"]',
      sectionTitle: 'Serviços realizados',
      semanticRole: 'service_execution_trigger'
    };

    const accepted = await resolveViaVisualGrounding2C(fakeClient, step, screenshotBuf, {
      zonePolicy: 'content',
      workerId: 'test-grounding',
      customVlmRunner: groundingMock
    });
    assert.ok(accepted);
    assert.deepEqual(accepted!.pointPx, { x: 720, y: 180 });
    assert.equal(accepted!.geometry.matchedSelector, '[data-orion-grounding-target="1"]');
  });

  it('modo defer + visual:curate processa pending-som-queue.json e alimenta RAG 0.1 e sinônimos de rota 0.2', async () => {
    const queueFile = PENDING_SOM_QUEUE_FILE();
    const prevQueue = fs.existsSync(queueFile) ? fs.readFileSync(queueFile, 'utf8') : null;
    const hrCacheFile = path.join(process.cwd(), 'auditoria', 'cache', 'human-reviews-cache.json');
    const prevHrCache = fs.existsSync(hrCacheFile) ? fs.readFileSync(hrCacheFile, 'utf8') : null;
    const routeSynFile = path.join(process.cwd(), 'auditoria', 'cache', 'curated-route-synonyms.json');
    const prevRouteSyn = fs.existsSync(routeSynFile) ? fs.readFileSync(routeSynFile, 'utf8') : null;
    const somDir = PENDING_SOM_DIR();
    const testRoutineId = 'TEST-CURATE-ADR031';
    const expectedSomFile = path.join(somDir, `${testRoutineId}-passo-02-som.png`);

    try {
      await writePendingSomQueue([]);
      const screenshotBuf = await createSolidPngBuffer(1440, 900);
      const step = stepOf(2, 'No formulário, preencha o campo **Identificador Fiscal**.', ['Identificador Fiscal'], 'fill', testRoutineId);
      const candidates: SomInteractiveCandidate[] = [
        {
          id: 1,
          box: { x: 320, y: 240, width: 220, height: 34 },
          tagName: 'input',
          role: 'textbox',
          name: 'CPF/CNPJ do Contribuinte',
          innerText: 'CPF/CNPJ do Contribuinte',
          selector: '[data-orion-som-id="1"]',
          sectionTitle: 'Dados Fiscais',
          semanticRole: 'form_input'
        }
      ];

      const queuedItem = await enqueuePendingSomForCuration({
        routineId: testRoutineId,
        step,
        zonePolicy: 'content',
        routeHash: '#/fiscal/cadastro/99',
        screenshotBuffer: screenshotBuf,
        candidates
      });

      assert.equal(queuedItem.status, 'pending');
      assert.equal(fs.existsSync(expectedSomFile), true);

      const summary = await curatePendingSomQueue({
        syncToSupabase: false,
        customTransport: async () => ({
          tagId: 1,
          confidence: 0.93,
          reason: 'Campo equivalente na seção Dados Fiscais'
        })
      });

      assert.equal(summary.processed, 1);
      assert.equal(summary.approved, 1);
      assert.equal(readPendingSomQueue()[0]?.status, 'curated');

      // Verifica injeção na Camada 0.1 (RAG de Revisões Humanas) e Camada 0.2 (Sinônimos por Rota)
      const ragHits = getHumanTargetSuggestionsForStep(step);
      assert.ok(ragHits.some(h => h.actual === 'CPF/CNPJ do Contribuinte'));

      const routeHits = routeSynonymsFor('#/fiscal/cadastro/123', 'Identificador Fiscal');
      assert.ok(routeHits.some(s => s.real.includes('CPF/CNPJ do Contribuinte')));
    } finally {
      if (fs.existsSync(expectedSomFile)) {
        fs.unlinkSync(expectedSomFile);
      }
      if (prevQueue !== null) {
        fs.writeFileSync(queueFile, prevQueue, 'utf8');
      } else if (fs.existsSync(queueFile)) {
        fs.unlinkSync(queueFile);
      }
      if (prevHrCache !== null) {
        fs.writeFileSync(hrCacheFile, prevHrCache, 'utf8');
      } else if (fs.existsSync(hrCacheFile)) {
        fs.unlinkSync(hrCacheFile);
      }
      if (prevRouteSyn !== null) {
        fs.writeFileSync(routeSynFile, prevRouteSyn, 'utf8');
      } else if (fs.existsSync(routeSynFile)) {
        fs.unlinkSync(routeSynFile);
      }
    }
  });
});
