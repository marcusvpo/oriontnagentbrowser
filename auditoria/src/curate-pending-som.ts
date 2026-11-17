import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { invokeAgyJson, AGY_MODEL_LABEL, type AgyTransportFn } from './agy-client.js';
import {
  parseSomVlmResponse,
  readPendingSomQueue,
  validateVisualCandidateSemantics,
  writePendingSomQueue,
  type PendingSomQueueItem
} from './smart-locator.js';
import { upsertVisualCuratedTargetOverride } from './human-review-rag.js';
import { routeKey, upsertCuratedRouteSynonym, type RouteSynonymKind } from './route-synonyms.js';
import type { RoutineStep } from './types.js';

export interface CuratePendingSomResult {
  totalInQueue: number;
  processed: number;
  approved: number;
  rejected: number;
  items: PendingSomQueueItem[];
}

function inferSynonymKind(role: string): RouteSynonymKind {
  const r = String(role || '').toLowerCase();
  if (r === 'tab') return 'tab';
  if (r === 'textbox' || r === 'combobox' || r === 'searchbox' || r === 'checkbox' || r === 'radio') return 'field';
  return 'button';
}

/**
 * Processa a fila `auditoria/cache/pending-som/pending-som-queue.json` em bloco via `agy`
 * (`Gemini 4 Hydrogen Extra`), aplicando o veto semântico pós-VLM (ADR-027) e persistindo
 * os mapeamentos aprovados em `human-reviews-cache.json` / `routine_reviews` (Camada 0.1 RAG)
 * e no dicionário contextual por rota (`curated-route-synonyms.json`, Camada 0.2 — ADR-029/ADR-031).
 */
export async function curatePendingSomQueue(
  options: {
    customTransport?: AgyTransportFn;
    syncToSupabase?: boolean;
  } = {}
): Promise<CuratePendingSomResult> {
  const queue = readPendingSomQueue();
  const pending = queue.filter(item => item.status === 'pending');

  if (pending.length === 0) {
    return {
      totalInQueue: queue.length,
      processed: 0,
      approved: 0,
      rejected: 0,
      items: queue
    };
  }

  let approved = 0;
  let rejected = 0;

  for (const item of pending) {
    const absSomPath = path.isAbsolute(item.somImagePath)
      ? item.somImagePath
      : path.join(config.rootDir, item.somImagePath);

    if (!fs.existsSync(absSomPath) || item.candidates.length === 0) {
      item.status = 'rejected';
      item.curationDecision = {
        tagId: null,
        confidence: 0,
        reason: 'Imagem SoM ausente em disco ou lista de candidatos vazia',
        curatedAt: new Date().toISOString()
      };
      rejected++;
      continue;
    }

    const step: RoutineStep = {
      stepNumber: item.stepNumber,
      routineId: item.routineId,
      rawText: item.rawText,
      targets: item.targets,
      actionType: item.actionType,
      zone: item.zonePolicy
    };

    const legend = item.candidates
      .map(
        c =>
          `[${c.id}] <${c.tagName} role="${c.role}"> "${c.name}"${c.sectionTitle ? ` {seção: ${c.sectionTitle}}` : ''}`
      )
      .join('\n');

    const prompt = [
      `Você é o Curador Visual Set-of-Mark pós-lote (ADR-031) do ERP Orion TN.`,
      `Rotina: ${item.routineId} | Passo ${item.stepNumber} | Rota: ${item.routeHash || '(raiz)'}`,
      `Texto do passo: "${item.rawText}"`,
      `Alvos documentados: ${JSON.stringify(item.targets)}`,
      `Candidatos numerados na imagem Set-of-Mark:`,
      legend,
      `Responda ESTRITAMENTE um objeto JSON válido no formato:`,
      `{"tagId": number | null, "confidence": 0.0, "reason": "justificativa técnica"}`
    ].join('\n');

    const rawResponse = await invokeAgyJson<Record<string, unknown>>(
      {
        prompt,
        imagePath: absSomPath
      },
      options.customTransport
    );

    const decision = parseSomVlmResponse(rawResponse);
    if (!decision || decision.tagId === null || decision.confidence < 0.68) {
      item.status = 'rejected';
      item.curationDecision = {
        tagId: decision?.tagId ?? null,
        confidence: decision?.confidence ?? 0,
        reason: decision?.reason || 'Confiança insuficiente ou nenhum candidato selecionado pelo agy',
        curatedAt: new Date().toISOString()
      };
      rejected++;
      continue;
    }

    const chosen = item.candidates.find(c => c.id === decision.tagId);
    if (!chosen) {
      item.status = 'rejected';
      item.curationDecision = {
        tagId: decision.tagId,
        confidence: decision.confidence,
        reason: `Tag [${decision.tagId}] inexistente na lista de candidatos do passo`,
        curatedAt: new Date().toISOString()
      };
      rejected++;
      continue;
    }

    const semanticCheck = validateVisualCandidateSemantics(step, chosen, item.zonePolicy);
    if (!semanticCheck.allowed) {
      item.status = 'rejected';
      item.curationDecision = {
        tagId: chosen.id,
        matchedName: chosen.name,
        confidence: decision.confidence,
        reason: `Veto semântico pós-VLM: ${semanticCheck.reason}`,
        curatedAt: new Date().toISOString()
      };
      rejected++;
      continue;
    }

    const documentedTarget = item.targets[0] || item.rawText;
    const actualName = (chosen.innerText || chosen.name).trim();

    await upsertVisualCuratedTargetOverride({
      routineId: item.routineId,
      stepNumber: item.stepNumber,
      documented: documentedTarget,
      actual: actualName,
      preferredZone: item.zonePolicy,
      reason: decision.reason,
      syncToSupabase: options.syncToSupabase
    });

    const normalizedRoute = routeKey(item.routeHash);
    if (normalizedRoute && actualName) {
      upsertCuratedRouteSynonym({
        route: normalizedRoute,
        documented: documentedTarget,
        real: [actualName],
        kind: inferSynonymKind(chosen.role),
        evidence: `Curadoria visual SoM (${item.routineId} passo ${item.stepNumber}, conf ${Math.round(decision.confidence * 100)}%): ${decision.reason}`
      });
    }

    item.status = 'curated';
    item.curationDecision = {
      tagId: chosen.id,
      matchedName: actualName,
      confidence: decision.confidence,
      reason: decision.reason,
      curatedAt: new Date().toISOString()
    };
    approved++;
  }

  await writePendingSomQueue(queue);

  return {
    totalInQueue: queue.length,
    processed: pending.length,
    approved,
    rejected,
    items: queue
  };
}

async function runCli(): Promise<void> {
  const args = process.argv.slice(2);
  const noSync = args.includes('--no-sync') || process.env.ORION_NO_SYNC === 'true';
  console.log('====================================================');
  console.log('  ORION TN — CURADORIA VISUAL PÓS-LOTE (ADR-031)    ');
  console.log(`  Provedor: Antigravity CLI (agy) [${AGY_MODEL_LABEL}]`);
  console.log('====================================================');

  const res = await curatePendingSomQueue({ syncToSupabase: !noSync });
  console.log(`  Total na fila (pending-som-queue.json): ${res.totalInQueue}`);
  console.log(`  Processados nesta execução:             ${res.processed}`);
  console.log(`  Aprovados (RAG 0.1 + Rota 0.2):         ${res.approved}`);
  console.log(`  Rejeitados / Vetados:                   ${res.rejected}`);
  console.log('====================================================');
}

const isMain = (() => {
  try {
    return path.resolve(process.argv[1] || '') === path.resolve(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
})();

if (isMain) {
  runCli().catch(err => {
    console.error(`✕ Erro em visual:curate: ${err?.message || err}`);
    process.exit(1);
  });
}
