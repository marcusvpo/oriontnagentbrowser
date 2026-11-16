import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { parseRoutineMarkdown } from './parser.js';
import { annotateScreenshot } from './annotator.js';
import { AgentBrowserClient } from './browser.js';
import { ensureAuthenticated, isSessionActiveInPage, noteFullReset, noteLightReset } from './auth.js';
import { locateAndCaptureWithSelfHealing, hasNavigationIntent, buildCalloutsFromGroup, inferStepZone } from './smart-locator.js';
import { describeMenuPathMissing, extractMenuPaths } from './menu-path.js';
import { classifyRoutineWorkload } from './worker-pool.js';
import { generateMockPerson } from './mock-generator.js';
import { lockStepText, revealTextChange } from './evidence.js';
import { buildRevisedRoutineDocument } from './report.js';
import { detectCommitCommand } from './mutation-guard.js';
import { exploreRevealTriggers, type RevealSuccess } from './reveal-explorer.js';
import { collectHelpTooltips, type HelpTooltip } from './help-tooltips.js';
import { installToastObserver, readEmptyState, hasNoData } from './empty-state.js';
import { autoSeedMockRecord, routineNeedsExistingRows } from './auto-seed.js';
import { ACTIVE_MODAL_SELECTOR, closeActiveModals } from './modal-scope.js';
import { detectImplicitTargets } from './implicit-targets.js';
import { classifyBlock, describeStatus } from './review-classifier.js';
import { describeTags, reviewPrefix, reviewTagsFor, stripReviewPrefix, type ReviewTag } from './review-taxonomy.js';
import { stampStepScopes, stripProductNameTargets } from './step-scope.js';
import { isGlobalSearchName, isStrictNavigationStep } from './navigation-guard.js';
import {
  readScreenSnapshot,
  snapshotKey,
  compareManualWithScreens,
  type ScreenSnapshot,
  type EditorialDivergence
} from './screen-snapshot.js';
import {
  RBAC_BLOCK_TYPE,
  buildMissingTargetBlock,
  buildPermissionBlockedTargetBlock,
  buildPrivilegeGateBlock,
  probePermissionBlockedTargets,
  probeRelocationHints,
  runPrivilegeGate,
  stripPrerequisiteRoles
} from './rbac.js';
import { config } from './config.js';
import { syncSingleRoutineToSupabase } from './sync-supabase.js';
import type {
  AnnotationLayoutResult,
  AuditStepResult,
  AuditRoutineReport,
  AuditReportStatus,
  DOMCallout,
  EmptyStateEvidence,
  SeededRecord,
  SmartLocatorDivergence,
  SmartLocatorResult,
  DOMResolvedGeometry,
  ExecutedStepAction,
  PrivilegeGateResult,
  RevealExplorationLog,
  RevealTriggerInfo,
  RoutineBlockInfo,
  RoutineStep,
  StepZonePolicy,
  WorkloadType
} from './types.js';

/**
 * Telemetria de uma print gerada pelo executor do KB (ADR-017/ADR-018). Mesmo formato-base da
 * telemetria do manifesto da Fase 2, para que o validador geométrico audite as duas fontes.
 */
export interface KbStepTelemetry {
  routineId: string;
  slug: string;
  modulo: string;
  stepNum: number;
  /**
   * `a`: print principal do passo (`passo-NN.png`); `b`, `c`...: sub-capturas (`passo-NN-b.png`) do
   * estado seguinte à ação do passo ou a um gatilho revelador, com a numeração continuando.
   */
  frame: string;
  printName: string;
  label: string;
  /** Rótulo efetivamente desenhado na print de alvo único (o validador confere o layout com ele) */
  annotationLabel?: string;
  actionType: string;
  rawScreenshotPath: string;
  finalPngPath: string;
  finalWebpPath: string;
  domGeometry: DOMResolvedGeometry | null;
  callouts?: DOMCallout[];
  /** Layout efetivamente desenhado pelo motor gráfico (molduras, badges e rótulos) */
  layout?: AnnotationLayoutResult;
  captureMode: 'annotated' | 'clean';
  /**
   * Papel da print: `step` (alvo do passo), `post-action` (alvo visível após a ação do passo),
   * `trigger` (gatilho revelador, antes do clique) ou `reveal` (alvo revelado por um gatilho).
   */
  captureKind?: 'step' | 'post-action' | 'trigger' | 'reveal';
  /** Gatilho revelador demarcado ou que produziu esta print (ADR-018) */
  revealTrigger?: { kind: string; label: string; directed: boolean };
  zonePolicy?: StepZonePolicy;
  /** Ação pós-captura do passo (só na print principal) */
  executedAction?: ExecutedStepAction;
  /** A rotina rodou com a Trava Segura de Mutação (ADR-018) */
  dryRunMutations?: boolean;
  /** Balões de ajuda "i" lidos ao vivo na tela deste passo (ADR-020) */
  helpTooltips?: HelpTooltip[];
  /** Snapshots estruturais das telas visitadas e divergências editoriais (1ª entrada da rotina; ADR-020) */
  screenSnapshots?: ScreenSnapshot[];
  editorialDivergences?: EditorialDivergence[];
  /** Estado vazio da tela lido neste passo (ADR-021 §2) */
  emptyState?: EmptyStateEvidence;
  /** Registro mock de pré-requisito criado neste passo pelo auto-seed (ADR-021 §3) */
  seededRecord?: SeededRecord;
  /** Alvos implícitos demarcados neste passo sem negrito (ADR-021 §4) */
  implicitTargets?: string[];
  /** Tag de revisão final da rotina (só na 1ª entrada): `atualizacao_editorial`, `dependencia_dados_banco`... */
  reviewStatus?: string;
  /** Todas as tags da rotina em ordem canônica (só na 1ª entrada; ADR-024), ex.: `['ATT', 'CCC']` */
  reviewTags?: string[];
  /** Passos executados fora do Orion TN, sem print por desenho (só na 1ª entrada; ADR-024) */
  externalSteps?: Array<{ stepNumber: number; portal: string }>;
  status: 'ok' | 'blocked';
  /** `rbac`: bloqueio por privilégio — não é discrepância geométrica */
  blockKind?: RoutineBlockInfo['kind'];
  errorMessage?: string;
}

export const KB_TELEMETRY_DIR = path.join(config.rootDir, 'auditoria', 'cache', 'kb-telemetry');

export interface ExecutorOptions {
  /**
   * Trava Segura de Mutação (ADR-018): comandos finais de gravação/exclusão são localizados, medidos,
   * demarcados e fotografados, mas o clique é omitido. Default: `ORION_DRY_RUN_MUTATIONS=true`.
   */
  dryRunMutations?: boolean;
  /** Abre a tela inicial autenticada e descarta o estado da rotina anterior (execução em lote) */
  resetToHome?: boolean;
  /** Exploração Investigativa antes de um bloqueio `[ATT]`/`[DDD]`/`[XRX]` (ADR-018). Default: ligada */
  explore?: boolean;
  /**
   * Auto-seed de registro mock (ADR-021 §3): grade vazia + botão Adicionar ativo -> cria um registro de
   * pré-requisito (grava mesmo com `dryRunMutations`). Default: ligado; `--no-auto-seed` desliga.
   */
  autoSeed?: boolean;
  /**
   * Sincronização automática (Write-Through) da rotina concluída com o Supabase (ADR-022/023).
   * Default: ligado; `--no-sync` desliga apenas para testes offline.
   */
  syncToSupabase?: boolean;
}

const framePrintName = (padStep: string, letter: string) => (letter === 'a' ? `passo-${padStep}.png` : `passo-${padStep}-${letter}.png`);

/**
 * Reset leve entre rotinas (ADR-024): com a sessão já ativa na página (`isSessionActiveInPage`), só fecha os
 * modais abertos (`.orion-lightweight-modal` e Bootstrap) e volta ao início por hash. Não passa por
 * `about:blank`, não recarrega `/webFirmas` e não repete o login WildFly SSO. Se a página é o portal
 * (`/webPortal`), entra no módulo Orion TN com a mesma sessão (sem login). Devolve `false` quando o estado
 * não ficou limpo (modal persistente, rota diferente da inicial, tela com erro): o reset completo assume.
 */
async function tryLightReset(client: AgentBrowserClient): Promise<boolean> {
  try {
    const probe = await isSessionActiveInPage(client);
    if (!probe.active) return false;
    const homeHash = (() => {
      try {
        return new URL(config.appHomeUrl).hash || '#/inicio';
      } catch {
        return '#/inicio';
      }
    })();

    const modals = await closeActiveModals(client);
    if (modals.remaining > 0) return false;

    if (probe.where === 'orion_tn') {
      await client.eval(`window.location.hash = ${JSON.stringify(homeHash)}; true`);
    } else {
      await client.open(config.appHomeUrl);
    }
    await client.wait(probe.where === 'orion_tn' ? 1200 : 2500);
    if (await client.ensureViewport(config.viewportWidth, config.viewportHeight)) await client.wait(800);

    const screen = await client.probeScreenLoaded();
    if (!screen.ok || screen.hash !== homeHash) {
      console.log(`[Auditoria] Reset leve não deixou o início limpo (${screen.reason || `rota ${screen.hash}`}); usando o reset completo.`);
      return false;
    }
    noteLightReset();
    console.log(
      `[Auditoria] Reset leve: sessão ativa reaproveitada (${probe.where}); ${modals.closed} modal(is) fechado(s) e navegação por hash ${homeHash}, sem recarga nem login.`
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Leva o worker à tela inicial autenticada com a página recarregada: a rotina anterior do lote pode
 * ter deixado um modal, um formulário ou um menu aberto. Reautentica se a sessão caiu.
 * Com a sessão já ativa, o reset é leve (ADR-024) e só o recurso de recarga completa recorre a `about:blank`.
 */
async function resetToHome(client: AgentBrowserClient): Promise<void> {
  // Rotina anterior que falhou no meio de um formulário pode ter deixado um diálogo nativo
  // (`beforeunload`/alert) pendente: ele travaria o `open`/`reload` seguinte.
  await client.dismissPendingDialog();
  if (await tryLightReset(client)) return;
  noteFullReset();

  /**
   * Reinicia o daemon do worker (a sessão e o estado de login voltam do arquivo `--state`). Último
   * recurso para um renderer que parou de responder: após uma rotina falhar com um modal de calendário
   * aberto, até `eval` e `open` para a mesma URL estouravam o timeout de 30 s (reproduzido com V-6.2.3).
   */
  const restartWorker = async () => {
    console.warn('[Auditoria] Worker sem resposta; reiniciando o daemon do navegador...');
    try {
      await client.close();
    } catch {}
    await client.setViewport(config.viewportWidth, config.viewportHeight);
  };

  // 1) Sai da página da rotina anterior: about:blank descarta modal, formulário sujo e `beforeunload`
  //    sem depender de a página responder a `eval`. Se nem isso funcionar, o renderer está travado.
  try {
    await client.open('about:blank');
  } catch {
    await restartWorker();
  }

  const load = async () => {
    try {
      await client.open(config.appHomeUrl);
    } catch {
      await restartWorker();
      await client.open(config.appHomeUrl);
    }
    try {
      // `open` para a mesma página só troca o hash; o recarregamento descarta o estado do SPA
      await client.eval('window.location.reload()');
    } catch {}
    await client.dismissPendingDialog();
    await client.wait(2500);
  };
  await load();
  // Modal/backdrop remanescente (ex.: modal de formulário aberto quando o passo falhou) é descartado:
  // 1) Esc; 2) segunda recarga; 3) remoção dos nós do Bootstrap/ngx. Confirma que nada ficou visível.
  const modalProbe = `(() => {
    const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
    return Array.from(document.querySelectorAll(${JSON.stringify(ACTIVE_MODAL_SELECTOR)} +', .modal-backdrop, .cdk-overlay-backdrop-showing, .swal2-container, [role="alertdialog"]')).filter(vis).length;
  })()`;
  const openModals = async (): Promise<number> => {
    try {
      const raw = await client.eval(modalProbe);
      const n = Number(String(raw).replace(/"/g, ''));
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  };
  if ((await openModals()) > 0) {
    console.log('[Auditoria] Modal remanescente após o reset; descartando...');
    try {
      await client.pressKey('Escape');
    } catch {}
    if ((await openModals()) > 0) await load();
    if ((await openModals()) > 0) {
      await client
        .eval(
          `document.querySelectorAll('.modal-backdrop, .cdk-overlay-backdrop, .swal2-container').forEach(e => e.remove()); document.querySelectorAll('.modal.show, .modal.in').forEach(e => { e.classList.remove('show','in'); e.style.display = 'none'; }); document.body.classList.remove('modal-open'); true`
        )
        .catch(() => undefined);
    }
    if ((await openModals()) > 0) console.warn('[Auditoria] Reset: ainda há diálogo/modal visível após todas as tentativas.');
  }
  // A aba ativa pode ser uma aba aberta pela rotina anterior (sem a emulação de viewport)
  if (await client.ensureViewport(config.viewportWidth, config.viewportHeight)) await client.wait(1200);
  let screen = await client.probeScreenLoaded();
  if (!screen.ok && /login|portal/i.test(screen.reason || '')) {
    console.log('[Auditoria] Sessão fora do Orion TN; reautenticando o worker...');
    await ensureAuthenticated(client);
    await client.setViewport(config.viewportWidth, config.viewportHeight);
    await load();
    screen = await client.probeScreenLoaded();
  }
  if (!screen.ok) console.warn(`[Auditoria] Tela inicial com ressalva: ${screen.reason}`);
}

/**
 * Remove as pastas de auditoria da MESMA rotina gravadas sob outro nome (ADR-018). O manifesto da
 * Fase 2 usava slugs próprios, diferentes do nome do arquivo no KB; sem a limpeza, o relatório antigo
 * conviveria com o novo. Só apaga pasta cujo `-revisado.md` declare o mesmo `id`.
 */
export async function removeTwinRoutineFolders(routineId: string, keepSlug: string): Promise<string[]> {
  const removed: string[] = [];
  if (!fs.existsSync(config.outputDir)) return removed;
  for (const mod of await fs.promises.readdir(config.outputDir)) {
    const modDir = path.join(config.outputDir, mod);
    if (!(await fs.promises.stat(modDir)).isDirectory()) continue;
    for (const folder of await fs.promises.readdir(modDir)) {
      const bare = stripReviewPrefix(folder);
      if (!bare.startsWith(`${routineId}-`) || bare === keepSlug) continue;
      const dir = path.join(modDir, folder);
      if (!(await fs.promises.stat(dir)).isDirectory()) continue;
      const revised = (await fs.promises.readdir(dir)).find(f => f.endsWith('-revisado.md'));
      if (!revised) continue;
      const head = (await fs.promises.readFile(path.join(dir, revised), 'utf8')).slice(0, 400);
      if (head.match(/^id:\s*(.+?)\s*$/m)?.[1] !== routineId) continue;
      await fs.promises.rm(dir, { recursive: true, force: true });
      removed.push(path.join(mod, folder));
    }
  }
  return removed;
}

export async function executeRoutineAudit(
  routineFilePath: string,
  client?: AgentBrowserClient,
  isDryRun = false,
  workerSessionId?: string,
  explicitWorkload?: WorkloadType,
  options: ExecutorOptions = {}
): Promise<AuditRoutineReport> {
  const parsed = parseRoutineMarkdown(routineFilePath);
  const workloadType = explicitWorkload ?? classifyRoutineWorkload(parsed);
  parsed.workloadType = workloadType;
  const startTime = Date.now();
  const dryRunMutations = options.dryRunMutations ?? process.env.ORION_DRY_RUN_MUTATIONS === 'true';
  const exploreEnabled = options.explore !== false;

  console.log(`\n==================================================`);
  console.log(`[Auditoria] Iniciando Rotina: ${parsed.id} - ${parsed.titulo}`);
  console.log(
    `[Auditoria] Módulo: ${parsed.modulo} | Carga: ${workloadType.toUpperCase()} | Sessão: ${workerSessionId || 'default'} | Trava de Mutação: ${dryRunMutations ? 'ATIVA (dry-run)' : 'desligada'}`
  );
  console.log(`==================================================`);

  if (isDryRun || !client) {
    throw new Error(
      `[Anti-Mock ADR-010] Execução offline/mock desativada. A auditoria requer conexão ativa com o navegador real para extração determinística do DOM.`
    );
  }

  // ADR-024: pré-análise da rotina completa ANTES de abrir o navegador. Passos em portal externo ao Orion TN
  // (SISCOAF, e-Notariado, CENSEC...) não são executados nem fotografados; a execução ao vivo começa no
  // primeiro passo `orion_tn`.
  const scope = stampStepScopes(parsed);
  if (scope.hasExternal) {
    console.log(
      `[Escopo de Passos] ${scope.externalSteps.length} passo(s) externo(s) ao Orion TN (${scope.portals.join(', ')}): ${scope.externalSteps.map(s => s.stepNumber).join(', ')}. ` +
        (scope.firstInternalStep != null
          ? `A execução no navegador começa no passo ${scope.firstInternalStep}.`
          : 'Nenhum passo roda no Orion TN: o navegador não é aberto.')
    );
  }
  const internalSteps = parsed.steps.filter(s => s.scope !== 'external_portal');

  const fileName = path.basename(routineFilePath, '.md');
  const baseModuleDir = path.join(config.outputDir, parsed.modulo);
  let routineDir = path.join(baseModuleDir, fileName);

  await fs.promises.mkdir(routineDir, { recursive: true });
  // Artefatos de execuções anteriores desta mesma rotina não podem conviver com o relatório novo
  // (ex.: prints de passos que agora nem chegam a ser auditados por causa do RBAC Gate).
  for (const stale of await fs.promises.readdir(routineDir)) {
    if (/^passo-\d+(-[a-z])?\.(png|webp)$/i.test(stale) || /-revisado\.md$/i.test(stale)) {
      await fs.promises.rm(path.join(routineDir, stale), { force: true });
    }
  }
  for (const twin of await removeTwinRoutineFolders(parsed.id, fileName)) {
    console.log(`[Auditoria] Pasta de execução anterior da mesma rotina removida: ${twin}`);
  }

  const cacheDir = path.join(config.rootDir, 'auditoria', 'cache', 'raw');
  await fs.promises.mkdir(cacheDir, { recursive: true });

  // ADR-024: rotina inteira externa não toca o navegador (nada a navegar, medir ou fotografar)
  const usesBrowser = internalSteps.length > 0;
  if (usesBrowser && options.resetToHome) await resetToHome(client);
  // ADR-021 §2: observador de toasts instalado antes de qualquer navegação (o toast some em poucos segundos)
  if (usesBrowser) await installToastObserver(client).catch(() => undefined);

  const stepResults: AuditStepResult[] = [];
  const divergences: SmartLocatorDivergence[] = [];
  const generatedPrints: string[] = [];
  const telemetry: KbStepTelemetry[] = [];
  // ADR-020: contexto da tela real (snapshot estrutural + balões de ajuda) para o confronto semântico
  const seenHelp = new Set<string>();
  const helpByStep = new Map<number, HelpTooltip[]>();
  const screenSnaps: ScreenSnapshot[] = [];
  const snapKeys = new Set<string>();
  const adjustedSteps = new Set<number>();
  const collectScreenContext = async (stepNumber: number, withHelp: boolean): Promise<void> => {
    try {
      const snap = await readScreenSnapshot(client);
      if (snap) {
        const key = snapshotKey(snap);
        if (!snapKeys.has(key)) {
          snapKeys.add(key);
          screenSnaps.push(snap);
        }
      }
      if (withHelp) {
        const found = await collectHelpTooltips(client, seenHelp);
        if (found.length > 0) {
          helpByStep.set(stepNumber, [...(helpByStep.get(stepNumber) || []), ...found]);
          console.log(`   [Ajuda da Tela] ${found.map(h => `"${h.anchorLabel}"`).join(', ')}`);
        }
      }
    } catch {
      // contexto é informativo: nunca derruba a auditoria
    }
  };
  /** Comandos de gravação que a Trava Segura de Mutação deixou de acionar */
  const skippedCommits: Array<{ stepNumber: number; label: string }> = [];
  let block: RoutineBlockInfo | undefined;

  // ADR-021: estado vazio da tela, registros mock criados e alvos implícitos, por passo
  const autoSeedEnabled = options.autoSeed !== false;
  const emptyByHash = new Map<string, EmptyStateEvidence>();
  const emptyByStep = new Map<number, EmptyStateEvidence>();
  const seededByStep = new Map<number, SeededRecord>();
  const implicitByStep = new Map<number, string[]>();
  const seededRecords: SeededRecord[] = [];
  const seededHashes = new Set<string>();
  let seedAttempted = false;
  let seedFailureReason: string | undefined;
  const needsRows = routineNeedsExistingRows(parsed.steps.map(s => `${s.rawText} ${(s.subItems || []).join(' ')}`));

  /** Lê o estado vazio da tela atual e o guarda por rota (o toast transitório é preservado entre leituras). */
  const observeEmptyState = async (stepNumber: number): Promise<EmptyStateEvidence | null> => {
    try {
      const state = await readEmptyState(client);
      if (!state) return null;
      const key = state.hash || '';
      const prev = emptyByHash.get(key);
      const merged: EmptyStateEvidence = { ...state, toastText: state.toastText ?? prev?.toastText };
      emptyByHash.set(key, merged);
      emptyByStep.set(stepNumber, merged);
      if (hasNoData(merged)) console.log(`   [Estado Vazio] ${merged.emptyGrid ? `grade sem linhas (${merged.headers.slice(0, 5).join(', ')})` : 'sem dados'}${merged.toastText ? ` | tela: "${merged.toastText}"` : ''}${merged.addButton ? ` | "${merged.addButton.label}" ativo` : ''}`);
      return merged;
    } catch {
      return null;
    }
  };

  /**
   * Auto-seed (ADR-021 §3): grade vazia + Adicionar ativo na mesma tela, e a rotina consulta/altera linhas.
   * Grade com registros: nada é gravado. Um ciclo por rota e por rotina.
   */
  const maybeSeed = async (stepNumber: number): Promise<void> => {
    const state = await observeEmptyState(stepNumber);
    if (!autoSeedEnabled || !needsRows) return;
    if (!state || !state.emptyGrid || !state.addButton) return;
    const key = state.hash || '';
    if (seededHashes.has(key)) return;
    seededHashes.add(key);
    seedAttempted = true;
    const outcome = await autoSeedMockRecord(client, state, stepNumber);
    if (outcome.seeded && outcome.record) {
      seededRecords.push(outcome.record);
      seededByStep.set(stepNumber, outcome.record);
      adjustedSteps.add(stepNumber);
      seedFailureReason = undefined;
      await observeEmptyState(stepNumber);
    } else {
      seedFailureReason = outcome.reason;
      console.warn(`   ⚠ [Auto-Seed] Ciclo não concluído: ${outcome.reason}`);
      // Ciclo abortado: o formulário de cadastro não pode ficar aberto por trás dos passos seguintes
      try {
        const left = await closeActiveModals(client);
        if (left.closed > 0) console.log(`   [Auto-Seed] Formulário de cadastro fechado sem gravar (${left.closed} modal).`);
        if (left.remaining > 0) console.warn(`   ⚠ [Auto-Seed] ${left.remaining} modal(is) ainda visível(is) após fechar.`);
      } catch {}
    }
  };

  const pushTelemetry = (
    step: RoutineStep,
    frame: string,
    printName: string,
    rawPath: string,
    geometry: DOMResolvedGeometry | null,
    extra: Partial<KbStepTelemetry> = {}
  ) => {
    const png = path.join(routineDir, printName);
    telemetry.push({
      routineId: parsed.id,
      slug: fileName,
      modulo: parsed.modulo,
      stepNum: step.stepNumber,
      frame,
      printName,
      label: step.targets.join(' | ') || step.rawText.slice(0, 80),
      actionType: step.actionType,
      rawScreenshotPath: rawPath,
      finalPngPath: png,
      finalWebpPath: png.replace(/\.png$/i, '.webp'),
      domGeometry: geometry,
      callouts: geometry?.callouts,
      captureMode: geometry ? 'annotated' : 'clean',
      zonePolicy: geometry?.zonePolicy,
      dryRunMutations,
      status: 'ok',
      ...extra
    });
  };

  // Copia o frame bruto como print limpa (sem moldura, badge ou rótulo) do passo
  const saveCleanPrint = async (rawPath: string, finalPath: string): Promise<string> => {
    await fs.promises.copyFile(rawPath, finalPath);
    const webp = finalPath.replace(/\.png$/i, '.webp');
    await sharp(rawPath).webp({ quality: 85 }).toFile(webp);
    return webp;
  };

  // =========================================================================
  // RBAC GATE (ADR-017/ADR-018): o perfil exigido pelo manual é conferido contra a identidade real da
  // sessão ANTES de qualquer passo. Só uma sessão comprovadamente restrita bloqueia aqui.
  // =========================================================================
  // ADR-024: o requisito de perfil só vale para os passos do Orion TN ("o Tabelião Titular acessa o portal
  // SISCOAF" é privilégio do portal, não da conta de homologação do Orion TN).
  const gate: PrivilegeGateResult = usesBrowser
    ? await runPrivilegeGate(client, { ...parsed, steps: internalSteps })
    : {
        satisfied: true,
        requirement: null,
        identity: null,
        reason: 'Nenhum passo da rotina roda no Orion TN; o RBAC Gate não se aplica.',
        state: 'not_required',
        fullAccess: false
      };
  const sessionLabel = gate.identity
    ? `${gate.identity.login} (cargo ${gate.identity.position || '-'}; ${gate.identity.profiles.join(', ') || 'sem perfil'})`
    : 'não identificada';
  console.log(
    `[RBAC Gate] Sessão: ${sessionLabel} | Perfil pleno: ${gate.fullAccess ? `sim (${gate.fullAccessEvidence})` : 'não comprovado'}${
      gate.requirement ? ` | Requisito do manual: ${gate.requirement.roles.join(' ou ')} -> ${gate.state}` : ''
    }`
  );
  if (!gate.satisfied) {
    block = buildPrivilegeGateBlock(gate);
    console.warn(`⛔ [RBAC Gate] ${RBAC_BLOCK_TYPE}: ${gate.reason}`);
    // O 1º passo do Orion TN (ADR-024): um passo externo nunca recebe a print da tela do sistema
    const first = internalSteps[0];
    if (first) {
      const firstPad = String(first.stepNumber).padStart(2, '0');
      const printFileName = `passo-${firstPad}.png`;
      const finalPrintPath = path.join(routineDir, printFileName);
      const rawStepPath = path.join(cacheDir, `${fileName}-passo-${firstPad}-raw.png`);
      await client.screenshot(rawStepPath);
      const webp = await saveCleanPrint(rawStepPath, finalPrintPath);
      generatedPrints.push(printFileName);
      stepResults.push({
        stepNumber: first.stepNumber,
        originalText: first.rawText,
        validatedText: first.rawText,
        isModified: false,
        screenshotRawPath: rawStepPath,
        screenshotAnnotatedPath: finalPrintPath,
        screenshotWebpPath: webp,
        captureMode: 'clean',
        printFiles: [printFileName],
        status: 'blocked',
        errorMessage: `${RBAC_BLOCK_TYPE}. ${gate.reason} A auditoria foi interrompida antes de executar os passos.`
      });
      pushTelemetry(first, 'a', printFileName, rawStepPath, null, {
        status: 'blocked',
        blockKind: 'rbac',
        errorMessage: gate.reason
      });
    }
  }

  for (const originalStep of gate.satisfied ? parsed.steps : []) {
    // ADR-024: passo em portal externo — sem ação no navegador e sem print. O resultado fica registrado (por
    // número do passo) para o relatório, que preserva o texto original e acrescenta o callout informativo.
    if (originalStep.scope === 'external_portal') {
      console.log(`\n-> Passo ${originalStep.stepNumber} [externo: ${originalStep.externalPortal}] não executado: ${originalStep.rawText}`);
      stepResults.push({
        stepNumber: originalStep.stepNumber,
        originalText: originalStep.rawText,
        validatedText: originalStep.rawText,
        isModified: false,
        screenshotRawPath: '',
        screenshotAnnotatedPath: '',
        printFiles: [],
        stepScope: 'external_portal',
        externalPortal: originalStep.externalPortal,
        status: 'ok'
      });
      continue;
    }

    // Passo de pré-requisito de perfil (ADR-018): os papéis em negrito não são elementos de tela
    const { step: roleStrippedStep, removedRoles } = stripPrerequisiteRoles(originalStep, gate.requirement);
    // ADR-024: "No **Orion TN**, ..." cita o produto, não um elemento de tela
    const { step: manualStep, removed: removedProduct } = stripProductNameTargets(roleStrippedStep);
    if (removedProduct.length > 0) {
      console.log(`   [Retorno ao Orion TN] "${removedProduct.join('", "')}" é o nome do produto, não um alvo de tela; removido da lista de alvos.`);
    }
    await installToastObserver(client).catch(() => undefined);

    // ADR-021 §4: passo sem negrito com verbo de ação + substantivo de controle ("localize a cidade pelo
    // campo de município ou estado") tem alvos implícitos: os campos reais da tela. Só a print é demarcada;
    // o texto do manual não muda e nenhuma ação é executada (`verify`).
    let implicit: Awaited<ReturnType<typeof detectImplicitTargets>> = null;
    if (manualStep.targets.length === 0) {
      try {
        implicit = await detectImplicitTargets(client, manualStep);
      } catch {
        implicit = null;
      }
    }
    const step: RoutineStep = implicit
      ? { ...manualStep, targets: implicit.targets, mainTargetCount: implicit.targets.length, actionType: 'verify', zone: 'content' }
      : manualStep;
    if (implicit) {
      implicitByStep.set(step.stepNumber, implicit.targets);
      console.log(`   [Alvos Implícitos] Passo sem negrito: campos da tela deduzidos de "${implicit.nouns.join(', ')}" -> ${implicit.targets.join(', ')}`);
    }
    const prerequisiteNote =
      removedRoles.length > 0
        ? gate.state === 'inconclusive'
          ? `Pré-requisito de perfil (${removedRoles.join(' ou ')}): a identidade da sessão não pôde ser lida; a auditoria prosseguiu sem bloqueio por privilégio.`
          : `Pré-requisito de perfil (${removedRoles.join(' ou ')}) conferido na sessão real: ${gate.reason}`
        : undefined;

    const padStep = String(step.stepNumber).padStart(2, '0');
    const printFileName = framePrintName(padStep, 'a');
    const finalPrintPath = path.join(routineDir, printFileName);
    const rawStepPath = path.join(cacheDir, `${fileName}-passo-${padStep}-raw.png`);
    const rawPathFor = (suffix: string) => path.join(cacheDir, `${fileName}-passo-${padStep}-${suffix}-raw.png`);
    const mainTargets = step.targets.slice(0, step.mainTargetCount ?? step.targets.length);

    console.log(`\n-> Executando Passo ${step.stepNumber}: ${step.rawText}`);
    console.log(`   Alvos esperados: ${step.targets.join(', ') || '(ação genérica)'}`);
    // Trava de Viewport antes de medir: o passo anterior pode ter aberto uma aba sem a emulação 1440x900
    await client.ensureViewport(config.viewportWidth, config.viewportHeight);

    // ADR-016: screenshot limpo da tela atual — sem moldura, badge ou rótulo (Anti-Mock: nada é demarcado
    // quando não há alvo). Mantém apenas a verificação de que a tela carregou sem erros.
    const captureCleanStep = async (note?: string): Promise<boolean> => {
      await client.wait(800);
      const screen = await client.probeScreenLoaded();
      await client.screenshot(rawStepPath);
      const webpClean = await saveCleanPrint(rawStepPath, finalPrintPath);
      generatedPrints.push(printFileName);

      const base = {
        stepNumber: step.stepNumber,
        originalText: step.rawText,
        validatedText: step.rawText,
        isModified: false,
        screenshotRawPath: rawStepPath,
        screenshotAnnotatedPath: finalPrintPath,
        screenshotWebpPath: webpClean,
        captureMode: 'clean' as const,
        printFiles: [printFileName]
      };
      if (!screen.ok) {
        console.warn(`   ⚠ Tela não carregou corretamente: ${screen.reason}`);
        const errorMessage = `Tela não carregou corretamente: ${screen.reason}`;
        stepResults.push({ ...base, status: 'blocked', errorMessage });
        pushTelemetry(step, 'a', printFileName, rawStepPath, null, { status: 'blocked', blockKind: 'screen_error', errorMessage });
        block = {
          kind: 'screen_error',
          tipo: 'Tela Inoperante no Ambiente de Homologação',
          motivo: `No passo ${step.stepNumber}, a tela não carregou corretamente: ${screen.reason}. O texto original foi preservado.`,
          roteiro: ['Verificar a disponibilidade da tela no ambiente de homologação.', 'Reexecutar a auditoria desta rotina.']
        };
        return false;
      }
      console.log(`   [Captura Limpa] Tela íntegra em ${screen.hash || '(sem rota)'}; print sem demarcação.`);
      await collectScreenContext(step.stepNumber, true);
      stepResults.push({
        ...base,
        note,
        executedAction: { kind: 'none', via: 'skipped', reason: 'Passo sem alvo acionável' },
        status: 'ok'
      });
      pushTelemetry(step, 'a', printFileName, rawStepPath, null);
      await maybeSeed(step.stepNumber);
      return true;
    };

    // Passo descritivo: nenhum elemento em negrito em todo o passo
    const isDescriptive = step.targets.length === 0;
    // Passo que só lista opções alternativas nos sub-itens ("execute a ação desejada: ...")
    const isOptionsOnly = !isDescriptive && step.mainTargetCount === 0;
    const hasMenuPath = extractMenuPaths(step).length > 0;

    // ---------------------------------------------------------------------
    // Estado das prints do passo: a principal (`a`) e as sub-capturas (`b`, `c`...), com a numeração
    // das demarcações continuando de uma para a outra (ADR-017/ADR-018).
    // ---------------------------------------------------------------------
    const printFiles: string[] = [];
    let stepCallouts: DOMCallout[] = [];
    let lastIndex = 0;
    let nextLetter = 'b';

    /** Demarcações numeradas de uma medição, a partir de `firstIndex` (um membro = uma demarcação). */
    const calloutsFrom = (geometry: DOMResolvedGeometry, firstIndex: number): DOMCallout[] => {
      const multi = buildCalloutsFromGroup(geometry, firstIndex);
      if (multi) return multi;
      const member = geometry.groupMembers?.[0];
      return [
        {
          index: firstIndex,
          label: (member?.query || geometry.context.innerText || '').replace(/\*\*/g, '').trim(),
          cssBox: geometry.cssBox,
          matchedSelector: member?.matchedSelector ?? geometry.matchedSelector,
          innerText: member?.innerText ?? geometry.context.innerText
        }
      ];
    };

    /** Grava uma sub-captura (`passo-NN-b`...) com demarcações numeradas e a registra na telemetria. */
    const addSubFrame = async (
      rawPath: string,
      geometry: DOMResolvedGeometry,
      frameCallouts: DOMCallout[],
      captureKind: NonNullable<KbStepTelemetry['captureKind']>,
      revealTrigger?: KbStepTelemetry['revealTrigger']
    ): Promise<string> => {
      const letter = nextLetter;
      nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
      const printName = framePrintName(padStep, letter);
      geometry.callouts = frameCallouts;
      const res = await annotateScreenshot({
        inputPath: rawPath,
        outputPath: path.join(routineDir, printName),
        box: geometry.cssBox,
        viewport: geometry.viewport,
        stepNumber: step.stepNumber,
        actionType: step.actionType,
        callouts: frameCallouts.map(c => ({ index: c.index, box: c.cssBox, label: c.label })),
        softObstacles: geometry.context.neighborBoxes,
        exportWebp: true
      });
      generatedPrints.push(printName);
      printFiles.push(printName);
      pushTelemetry(step, letter, printName, rawPath, geometry, { captureKind, revealTrigger, layout: res.layout });
      stepCallouts.push(...frameCallouts);
      lastIndex = frameCallouts[frameCallouts.length - 1].index;
      return printName;
    };

    /**
     * Converte o sucesso da Exploração Investigativa em prints e divergências com evidência (ADR-018).
     * `mainFrame`: nada do passo estava na tela, então a print principal é a do gatilho.
     */
    const emitReveal = async (success: RevealSuccess, mainFrame: boolean): Promise<SmartLocatorDivergence[]> => {
      const { trigger, triggerGeometry, geometry } = success;
      const triggerMeta = { kind: trigger.kind, label: trigger.label, directed: trigger.directed };
      let triggerPrint: string;

      if (mainFrame) {
        // Print principal: o gatilho, medido antes do clique
        const res = await annotateScreenshot({
          inputPath: success.triggerRawPath,
          outputPath: finalPrintPath,
          box: triggerGeometry.cssBox,
          viewport: triggerGeometry.viewport,
          domContext: triggerGeometry.context,
          stepNumber: step.stepNumber,
          actionType: 'click',
          label: trigger.label,
          enableZoomCallout: triggerGeometry.cssBox.width <= 44 && triggerGeometry.cssBox.height <= 44,
          zoomFactor: 2.5,
          exportWebp: true
        });
        generatedPrints.push(printFileName);
        printFiles.push(printFileName);
        pushTelemetry(step, 'a', printFileName, success.triggerRawPath, triggerGeometry, {
          captureKind: 'trigger',
          revealTrigger: triggerMeta,
          annotationLabel: trigger.label,
          layout: res.layout,
          callouts: undefined
        });
        stepCallouts = [{ index: 1, label: trigger.label, cssBox: triggerGeometry.cssBox, matchedSelector: triggerGeometry.matchedSelector }];
        lastIndex = 1;
        triggerPrint = printFileName;
        await addSubFrame(success.revealedRawPath, geometry, calloutsFrom(geometry, lastIndex + 1), 'reveal', triggerMeta);
      } else if (success.triggerBoxAfter) {
        // O gatilho continua visível no estado revelado: uma só sub-captura com gatilho e alvo(s)
        const triggerCallout: DOMCallout = { index: lastIndex + 1, label: trigger.label, cssBox: success.triggerBoxAfter };
        triggerPrint = await addSubFrame(
          success.revealedRawPath,
          geometry,
          [triggerCallout, ...calloutsFrom(geometry, lastIndex + 2)],
          'reveal',
          triggerMeta
        );
      } else {
        // O gatilho some após o clique (ex.: abriu um modal): uma sub-captura para ele, outra para o alvo
        triggerPrint = await addSubFrame(
          success.triggerRawPath,
          triggerGeometry,
          [{ index: lastIndex + 1, label: trigger.label, cssBox: triggerGeometry.cssBox, matchedSelector: triggerGeometry.matchedSelector }],
          'trigger',
          triggerMeta
        );
        await addSubFrame(success.revealedRawPath, geometry, calloutsFrom(geometry, lastIndex + 1), 'reveal', triggerMeta);
      }

      const reveal: RevealTriggerInfo = {
        kind: trigger.kind,
        label: trigger.label,
        directed: trigger.directed,
        printFile: triggerPrint,
        evidence: {
          source: 'dom-measured',
          matchedSelector: triggerGeometry.matchedSelector,
          elementText: triggerGeometry.context.innerText || trigger.label,
          box: triggerGeometry.cssBox
        }
      };
      return success.revealed.map(name => {
        const member = (geometry.groupMembers || []).find(m => m.query === name);
        const elementText = member?.innerText || name;
        return {
          stepNumber: step.stepNumber,
          documentedTarget: name,
          actualElementText: elementText,
          resolutionLayer: 'investigative_reveal' as const,
          confidence: 1,
          reason: `Elemento ausente na tela inicial do passo; exibido após acionar ${trigger.kind === 'tab' ? 'a aba' : 'o gatilho'} "${trigger.label}"${trigger.directed ? ' (gatilho deduzido do DOM)' : ''}`,
          detectedAt: new Date().toISOString(),
          evidence: {
            source: 'dom-measured' as const,
            matchedSelector: member?.matchedSelector ?? geometry.matchedSelector,
            elementText,
            box: member?.cssBox ?? geometry.cssBox
          },
          reveal,
          // A substituição só existe se o negrito está na linha principal do passo
          textChange: step.rawText.includes(`**${name}**`) ? revealTextChange(name, trigger.kind, trigger.label) : undefined
        };
      });
    };

    /** Bloqueio por alvo sem evidência, classificado pelo que foi comprovado (ADR-018). */
    const missingBlock = async (
      names: string[],
      partial: boolean,
      exploration: RevealExplorationLog | undefined,
      skippedReason?: string,
      menuEvidence?: string
    ): Promise<RoutineBlockInfo> =>
      buildMissingTargetBlock({
        menuEvidence,
        stepNumber: step.stepNumber,
        targets: names,
        partial,
        gate,
        explored: exploration?.explored || [],
        candidates: exploration?.candidates || 0,
        selectorsWithoutAffinity: exploration?.selectorsWithoutAffinity || 0,
        explorationSkippedReason: skippedReason,
        relocationHints: await probeRelocationHints(client, names),
        skippedCommits
      });

    const explorationSkippedReason = !exploreEnabled
      ? 'A Exploração Investigativa estava desligada nesta execução.'
      : hasMenuPath
        ? 'O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016).'
        : undefined;

    try {
      if (isDescriptive) {
        if (!(await captureCleanStep(prerequisiteNote))) break;
        continue;
      }

      // 1. Resolução em Camadas via SmartLocator (Camada 0: Rota de Menu | Camada 1: DOM Direto | Camada 2: Auto-Cura A11y + LLM Fallback)
      //    Lista de opções: as opções pertencem à tela, não à navegação nem ao rodapé. A busca fica restrita
      //    à zona de conteúdo e sem Auto-Cura, para que uma opção ausente nunca vire demarcação fantasma.
      const locStep: RoutineStep =
        isOptionsOnly && !step.zone && !hasNavigationIntent(step.rawText) ? { ...step, zone: 'content' } : step;
      const locResult = await locateAndCaptureWithSelfHealing(client, locStep, rawStepPath, {
        // Alvo implícito vem de um rótulo real da tela: nunca é curado para outro nome (Evidência Estrita)
        allowHealing: !isOptionsOnly && !implicit
      });
      const zonePolicy: StepZonePolicy = locStep.zone ?? inferStepZone(step.rawText, step.actionType);

      if (locResult.found && locResult.geometry) {
        const domGeometry = locResult.geometry;
        const matchedLabel = locResult.matchedTargetName;
        const multi = domGeometry.callouts && domGeometry.callouts.length > 1 ? domGeometry.callouts : undefined;
        let targetDivergences = locResult.targetDivergences ? [...locResult.targetDivergences] : [];
        // Alvo implícito não localizado nunca bloqueia nem vira divergência: o campo só deixa de ser demarcado
        if (implicit) targetDivergences = [];
        let exploration: RevealExplorationLog | undefined;
        let revealApplied = false;

        // ADR-015: rastreabilidade da Zona Semântica e da União Geométrica de Múltiplos Alvos
        if (domGeometry.zone === 'content' && domGeometry.contentRoot) {
          console.log(
            `   [Zona Semântica] Alvo medido dentro de ${domGeometry.contentRoot.selector} (${domGeometry.contentRoot.strategy})`
          );
        }
        if (multi) {
          console.log(`   [Multi-Demarcação] ${multi.length} alvos na mesma print: ${multi.map(c => `(${c.index}) ${c.label}`).join(' · ')}`);
        }

        // 2. Anotar usando coordenadas reais do DOM, viewport DPR e contexto estrutural.
        //    Multi-demarcação (ADR-017): cada alvo medido no mesmo frame recebe moldura e número.
        const isTiny = domGeometry.cssBox.width <= 44 && domGeometry.cssBox.height <= 44;
        const res = await annotateScreenshot({
          inputPath: rawStepPath,
          outputPath: finalPrintPath,
          box: domGeometry.cssBox,
          viewport: domGeometry.viewport,
          domContext: domGeometry.context,
          stepNumber: step.stepNumber,
          actionType: step.actionType,
          label: matchedLabel,
          callouts: multi ? multi.map(c => ({ index: c.index, box: c.cssBox, label: c.label })) : undefined,
          softObstacles: domGeometry.context.neighborBoxes,
          enableZoomCallout: isTiny,
          zoomFactor: 2.5,
          exportWebp: true
        });
        generatedPrints.push(printFileName);
        printFiles.push(printFileName);
        stepCallouts = multi
          ? [...multi]
          : [{ index: 1, label: matchedLabel, cssBox: domGeometry.cssBox, matchedSelector: domGeometry.matchedSelector }];
        lastIndex = multi ? multi.length : 1;

        // ADR-020: snapshot estrutural da tela exatamente como foi fotografada (antes da ação)
        await collectScreenContext(step.stepNumber, false);
        if (
          locResult.gridActions?.status === 'resolved' &&
          (locResult.targetDivergences || []).some(d => d.resolutionLayer === 'dom_synonym_heuristic')
        ) {
          adjustedSteps.add(step.stepNumber);
        }

        // 3. Executar a ação no navegador para avançar o fluxo
        //    (ADR-015 §2.4: a ação recai sobre o MESMO nó validado na zona durante a medição)
        //    Uma lista de opções alternativas é demarcada, mas nenhuma opção é escolhida pelo executor.
        if (isOptionsOnly) {
          console.log(`   [Ação] nenhuma: o passo lista opções alternativas (${matchedLabel}); nada é acionado.`);
        }
        const executedAction: ExecutedStepAction = isOptionsOnly
          ? { kind: 'none', via: 'skipped', zone: domGeometry.zone, reason: 'Passo lista opções alternativas: nenhuma é acionada' }
          : await executeStepAction(client, step, locResult, domGeometry, { dryRunMutations });
        if (executedAction.via === 'dry-run' && executedAction.commitLabel) {
          skippedCommits.push({ stepNumber: step.stepNumber, label: executedAction.commitLabel });
        }
        pushTelemetry(step, 'a', printFileName, rawStepPath, domGeometry, {
          captureKind: 'step',
          annotationLabel: multi ? undefined : matchedLabel,
          layout: res.layout,
          callouts: multi,
          executedAction
        });

        const notFound = () => targetDivergences.filter(d => d.resolutionLayer === 'target_not_found');
        const dropFound = (seen: Set<string>) => {
          targetDivergences = targetDivergences.filter(d => !(d.resolutionLayer === 'target_not_found' && seen.has(d.documentedTarget)));
        };

        // 4. Alvos do passo que não estavam na tela no instante da captura (ADR-017): são aceitos se
        //    aparecerem como efeito da ação do próprio passo, medidos e demarcados numa sub-captura
        //    (`passo-NN-b`), continuando a numeração.
        if (notFound().length > 0 && executedAction.kind !== 'none') {
          const names = notFound().map(d => d.documentedTarget);
          const after = await client.getDOMGeometry(names, {
            scrollIntoView: true,
            zone: domGeometry.zonePolicy ?? 'any',
            groupTargets: names
          });
          const seen = new Set((after?.groupMembers || []).map(m => m.query));
          if (after && seen.size > 0) {
            const rawB = rawPathFor(nextLetter);
            await client.screenshot(rawB);
            const calloutsB = calloutsFrom(after, lastIndex + 1);
            const printB = await addSubFrame(rawB, after, calloutsB, 'post-action');
            dropFound(seen);
            console.log(
              `   [Multi-Demarcação] Alvo(s) visíveis após a ação do passo, demarcados em ${printB}: ${calloutsB.map(c => `(${c.index}) ${c.label}`).join(' · ')}`
            );
          }
        }

        // ADR-020: tela resultante da ação (ex.: formulário aberto por Adicionar): snapshot + balões "i"
        await collectScreenContext(step.stepNumber, true);

        // 5. Alvo ainda ausente (ADR-018): primeiro a marca de bloqueio por perfil no DOM, depois a
        //    Exploração Investigativa dos gatilhos reveladores seguros. o bloqueio é o último recurso.
        let permissionBlocked: SmartLocatorResult['permissionBlocked'];
        if (notFound().length > 0 && !isOptionsOnly) {
          const names = notFound().map(d => d.documentedTarget);
          const hit = await probePermissionBlockedTargets(client, names);
          if (hit) {
            permissionBlocked = { target: hit.target, detail: hit.detail, domEvidence: hit.domEvidence };
          } else if (!explorationSkippedReason) {
            const outcome = await exploreRevealTriggers(client, { step, missing: names, zonePolicy, rawPathFor });
            exploration = outcome.log;
            if (outcome.success) {
              const revealDivs = await emitReveal(outcome.success, false);
              dropFound(new Set(outcome.success.revealed));
              targetDivergences.push(...revealDivs);
              revealApplied = true;
            }
          }
        }

        // 6. Trava de Evidência (ADR-017): o texto do passo é reconstruído a partir do original,
        //    aplicando só as substituições com elemento real medido e demarcado.
        const stepDivs = implicit ? [] : [...(locResult.divergence ? [locResult.divergence] : []), ...targetDivergences];
        const locked = lockStepText(step.rawText, revealApplied || implicit ? undefined : locResult.validatedText, stepDivs);
        for (const r of locked.rejected) {
          console.warn(`   🔒 [Trava de Evidência] Passo ${step.stepNumber}: ${r.reason}.`);
        }
        divergences.push(...stepDivs);

        const missing = notFound().map(d => d.documentedTarget);
        const unproven = locked.rejected.filter(r => r.divergence).map(r => r.divergence!.documentedTarget);
        const withoutEvidence = [...missing, ...unproven];
        const base: AuditStepResult = {
          stepNumber: step.stepNumber,
          originalText: step.rawText,
          validatedText: locked.text,
          isModified: locked.text !== step.rawText,
          screenshotRawPath: rawStepPath,
          screenshotAnnotatedPath: finalPrintPath,
          screenshotWebpPath: res.webpPath,
          boundingBox: res.layout.targetBox,
          domGeometry,
          layoutResult: res.layout,
          divergence: implicit ? undefined : locResult.divergence,
          targetDivergences: targetDivergences.length > 0 ? targetDivergences : undefined,
          executedAction,
          callouts: stepCallouts.length > 1 ? stepCallouts : undefined,
          printFiles,
          exploration,
          implicitTargets: implicit ? implicit.targets : undefined,
          note: prerequisiteNote,
          status: locked.text !== step.rawText ? 'modified' : 'ok'
        };

        // ADR-021 §3: grade vazia + Adicionar ativo => registro mock de pré-requisito (antes do próximo passo)
        await maybeSeed(step.stepNumber);

        if (permissionBlocked) {
          const { target, detail, domEvidence } = permissionBlocked;
          console.warn(`   ⛔ [RBAC] "${target}" existe na tela, mas está bloqueado para o perfil logado: ${detail}`);
          block = buildPermissionBlockedTargetBlock(step.stepNumber, target, detail, gate.identity, domEvidence);
          const blockedDiv: SmartLocatorDivergence = {
            stepNumber: step.stepNumber,
            documentedTarget: target,
            actualElementText: '',
            resolutionLayer: 'permission_blocked',
            confidence: 0,
            reason: domEvidence ? `${detail} — ${domEvidence}` : detail,
            detectedAt: new Date().toISOString()
          };
          divergences.push(blockedDiv);
          stepResults.push({
            ...base,
            validatedText: step.rawText,
            isModified: false,
            targetDivergences: [...targetDivergences.filter(d => d.documentedTarget !== target), blockedDiv],
            status: 'blocked',
            errorMessage: `${RBAC_BLOCK_TYPE}: "${target}" está bloqueado para o perfil logado (${detail})`
          });
          break;
        }

        if (withoutEvidence.length > 0) {
          const list = withoutEvidence.map(t => `"${t}"`).join(', ');
          console.warn(`   ⚠ Alvo(s) do passo sem evidência na tela: ${list}. Texto original preservado; rotina segue para revisão humana.`);
          block = await missingBlock(withoutEvidence, true, exploration, isOptionsOnly ? undefined : explorationSkippedReason);
          stepResults.push({
            ...base,
            validatedText: step.rawText,
            isModified: false,
            status: 'blocked',
            errorMessage: `Alvo(s) citados no manual sem evidência na tela auditada: ${list}`
          });
          break;
        }
        stepResults.push(base);
      } else if (locResult.permissionBlocked) {
        // ADR-017: o alvo existe, mas a aplicação o bloqueia para o perfil logado. Não é "inexistente".
        const { target, detail, domEvidence } = locResult.permissionBlocked;
        const webpBlocked = await saveCleanPrint(rawStepPath, finalPrintPath);
        generatedPrints.push(printFileName);
        block = buildPermissionBlockedTargetBlock(step.stepNumber, target, detail, gate.identity, domEvidence);
        const divergence: SmartLocatorDivergence = {
          stepNumber: step.stepNumber,
          documentedTarget: target,
          actualElementText: '',
          resolutionLayer: 'permission_blocked',
          confidence: 0,
          reason: domEvidence ? `${detail} — ${domEvidence}` : detail,
          detectedAt: new Date().toISOString()
        };
        divergences.push(divergence);
        stepResults.push({
          stepNumber: step.stepNumber,
          originalText: step.rawText,
          validatedText: step.rawText,
          isModified: false,
          screenshotRawPath: rawStepPath,
          screenshotAnnotatedPath: finalPrintPath,
          screenshotWebpPath: webpBlocked,
          captureMode: 'clean',
          printFiles: [printFileName],
          targetDivergences: [divergence],
          status: 'blocked',
          errorMessage: `${RBAC_BLOCK_TYPE}: "${target}" está bloqueado para o perfil logado (${detail})`
        });
        pushTelemetry(step, 'a', printFileName, rawStepPath, null, { status: 'blocked', blockKind: 'rbac', errorMessage: detail });
        break;
      } else if (implicit) {
        // ADR-021 §4: o rótulo existia na leitura de campos, mas a medição ao vivo não o confirmou na zona
        // de conteúdo. Nada é forjado: print limpa e observação; o passo não bloqueia a rotina.
        const note = `Passo sem negrito: os campos ${implicit.targets.map(t => `**${t}**`).join(', ')} não foram confirmados na medição ao vivo. Print sem demarcação.`;
        implicitByStep.delete(step.stepNumber);
        if (!(await captureCleanStep(note))) break;
      } else if (isOptionsOnly) {
        // ADR-016: as opções dependem de um registro que não está na tela (ex.: grade vazia). Não há o que
        // demarcar e nada é forjado; o passo segue com o screenshot limpo e a observação no relatório.
        const optionList = `**${step.targets.join('**, **')}**`;
        const gridStatus = locResult.gridActions?.status;
        const note =
          gridStatus === 'empty-grid'
            ? `As opções ${optionList} são ações de linha da grade, mas a grade não tinha nenhum registro durante a auditoria. Print sem demarcação.`
            : gridStatus === 'no-actions'
              ? `A grade tinha registros, mas a primeira linha não expôs botões de ação identificáveis (por nome, ícone ou tooltip) para ${optionList}. Print sem demarcação.`
              : `As opções ${optionList} não estavam visíveis na tela durante a auditoria (dependem de um registro selecionado na listagem). Print sem demarcação.`;
        if (!(await captureCleanStep(note))) break;
      } else {
        // =====================================================================
        // Nenhum alvo do passo na tela (ADR-018): antes do bloqueio, a Exploração Investigativa testa os
        // gatilhos reveladores seguros. Se um deles revelar o alvo, o passo é validado com o sub-passo
        // real: print principal no gatilho e sub-captura no alvo.
        // =====================================================================
        // ADR-024: o caminho existe na árvore, mas a cascata não abriu — falha técnica (retentável), não [ATT]
        if (locResult.menuPathOpenFailed) {
          throw new Error(`Rota de menu não verificável no passo ${step.stepNumber}: ${locResult.menuPathOpenFailed}`);
        }
        const menuEvidence = locResult.menuPathMissing ? describeMenuPathMissing(locResult.menuPathMissing) : undefined;
        const wanted = mainTargets.length > 0 ? mainTargets : step.targets;
        let exploration: RevealExplorationLog | undefined;
        let success: RevealSuccess | undefined;
        if (!explorationSkippedReason) {
          console.log(`   [Exploração] Alvo(s) [${wanted.join(', ')}] ausentes na tela inicial; investigando gatilhos reveladores antes do bloqueio.`);
          const outcome = await exploreRevealTriggers(client, { step, missing: wanted, zonePolicy, rawPathFor });
          exploration = outcome.log;
          success = outcome.success;
        }

        if (success) {
          const revealDivs = await emitReveal(success, true);
          const revealedGeometry = success.geometry;
          const executedAction = await executeStepAction(
            client,
            step,
            { found: true, healed: false, geometry: revealedGeometry, matchedTargetName: success.revealed[0] },
            revealedGeometry,
            { dryRunMutations }
          );
          if (executedAction.via === 'dry-run' && executedAction.commitLabel) {
            skippedCommits.push({ stepNumber: step.stepNumber, label: executedAction.commitLabel });
          }
          const mainEntry = telemetry.find(t => t.stepNum === step.stepNumber && t.frame === 'a');
          if (mainEntry) mainEntry.executedAction = executedAction;

          const locked = lockStepText(step.rawText, undefined, revealDivs);
          for (const r of locked.rejected) {
            console.warn(`   🔒 [Trava de Evidência] Passo ${step.stepNumber}: ${r.reason}.`);
          }
          divergences.push(...revealDivs);
          const stillMissing = wanted.filter(t => !success!.revealed.includes(t));
          const unproven = locked.rejected.filter(r => r.divergence).map(r => r.divergence!.documentedTarget);
          const withoutEvidence = [...stillMissing, ...unproven];
          const base: AuditStepResult = {
            stepNumber: step.stepNumber,
            originalText: step.rawText,
            validatedText: locked.text,
            isModified: locked.text !== step.rawText,
            screenshotRawPath: success.triggerRawPath,
            screenshotAnnotatedPath: finalPrintPath,
            screenshotWebpPath: finalPrintPath.replace(/\.png$/i, '.webp'),
            boundingBox: success.triggerGeometry.cssBox,
            domGeometry: success.triggerGeometry,
            targetDivergences: revealDivs,
            executedAction,
            callouts: stepCallouts.length > 1 ? stepCallouts : undefined,
            printFiles,
            exploration,
            note: prerequisiteNote,
            status: locked.text !== step.rawText ? 'modified' : 'ok'
          };
          if (withoutEvidence.length > 0) {
            const list = withoutEvidence.map(t => `"${t}"`).join(', ');
            console.warn(`   ⚠ Alvo(s) do passo sem evidência mesmo após a exploração: ${list}.`);
            block = await missingBlock(withoutEvidence, true, exploration);
            stepResults.push({
              ...base,
              validatedText: step.rawText,
              isModified: false,
              status: 'blocked',
              errorMessage: `Alvo(s) citados no manual sem evidência na tela auditada: ${list}`
            });
            break;
          }
          stepResults.push(base);
          continue;
        }

        // ADR-010: sem evidência após esgotar a tela, salva o frame de bloqueio limpo
        console.warn(
          `   ⚠ Elemento não localizado após Auto-Cura${exploration ? ` e ${exploration.explored.length} gatilho(s) revelador(es)` : ''}: ${step.targets.join(', ')}. Salvando frame de bloqueio limpo.`
        );
        // A exploração pode ter rolado a tela: o frame de bloqueio é o do estado restaurado
        if (exploration && exploration.explored.length > 0) await client.screenshot(rawStepPath);
        const webpBlocked = await saveCleanPrint(rawStepPath, finalPrintPath);
        generatedPrints.push(printFileName);
        block = await missingBlock(wanted, false, exploration, explorationSkippedReason, menuEvidence);
        const errorMessage = menuEvidence
          ? `Caminho de menu não encontrado na árvore de navegação real: ${locResult.menuPathMissing!.documented}`
          : `Elemento visual [${step.targets.join(', ')}] não localizado no DOM nem na Árvore de Acessibilidade${
          !exploration
            ? ''
            : exploration.explored.length > 0
              ? `, nem após ${exploration.explored.length} gatilho(s) revelador(es) seguro(s)`
              : '; a tela não tem gatilho revelador seguro a testar'
        }`;

        stepResults.push({
          stepNumber: step.stepNumber,
          originalText: step.rawText,
          validatedText: step.rawText,
          isModified: false,
          screenshotRawPath: rawStepPath,
          screenshotAnnotatedPath: finalPrintPath,
          screenshotWebpPath: webpBlocked,
          captureMode: 'clean',
          printFiles: [printFileName],
          exploration,
          status: 'blocked',
          errorMessage
        });
        pushTelemetry(step, 'a', printFileName, rawStepPath, null, { status: 'blocked', blockKind: block.kind, errorMessage });
        break;
      }
    } catch (stepErr: any) {
      console.error(`   ✕ Erro no passo ${step.stepNumber}: ${stepErr.message}`);
      stepResults.push({
        stepNumber: step.stepNumber,
        originalText: step.rawText,
        validatedText: step.rawText,
        isModified: false,
        screenshotRawPath: rawStepPath,
        screenshotAnnotatedPath: finalPrintPath,
        // As prints já gravadas do passo continuam referenciadas no relatório
        printFiles: printFiles.length > 0 ? printFiles : undefined,
        status: 'blocked',
        errorMessage: stepErr.message
      });
      block = {
        kind: 'other',
        tipo: 'Falha Técnica na Execução da Auditoria',
        motivo: `Erro no passo ${step.stepNumber}: ${String(stepErr.message).slice(0, 300)}. O texto original foi preservado.`,
        roteiro: ['Reexecutar a auditoria desta rotina.', 'Persistindo o erro, revisar a rotina manualmente no ambiente de homologação.']
      };
      break;
    }
  }

  const hasBlocks = stepResults.some(r => r.status === 'blocked');

  // ADR-021: classificação do bloqueio em [ATT] / [DDD] / [XRX] (ou falha técnica, sem tag)
  let reviewStatus: ReturnType<typeof classifyBlock>['status'] = null;
  if (hasBlocks) {
    const blockedResult = stepResults.find(r => r.status === 'blocked');
    const blockedStep = blockedResult?.stepNumber;
    const manualBlockedStep = parsed.steps.find(s => s.stepNumber === blockedStep);
    // A tela do bloqueio ainda está aberta: leitura ao vivo do estado vazio, com o toast capturado antes
    let liveEmpty: EmptyStateEvidence | null = null;
    if (gate.satisfied && block && block.kind !== 'other') {
      liveEmpty = await observeEmptyState(blockedStep ?? 0);
    }
    const emptyForBlock = liveEmpty ?? (blockedStep != null ? emptyByStep.get(blockedStep) : undefined) ?? null;
    const cls = classifyBlock({
      parsed,
      block: block ?? {
        kind: 'other',
        tipo: 'Falha Técnica na Execução da Auditoria',
        motivo: 'Bloqueio sem causa estruturada.',
        roteiro: ['Reexecutar a auditoria desta rotina.']
      },
      blockedStep,
      blockedStepHasMenuPath: manualBlockedStep ? extractMenuPaths(manualBlockedStep).length > 0 : false,
      emptyState: emptyForBlock,
      seed: { attempted: seedAttempted, reason: seedFailureReason, disabled: !autoSeedEnabled }
    });
    reviewStatus = cls.status;
    block = cls.block;
    if (reviewStatus) {
      console.log(`   [Revisão Humana] ${describeStatus(reviewStatus)} — ${block.tipo}${block.prerequisites?.length ? ` | pré-requisitos: ${block.prerequisites.join(', ')}` : ''}`);
    }
  }

  // Falha técnica (ADR-021): sem tag, sem pasta de revisão. A rotina segue `nao_auditada`; o lote registra a falha
  if (hasBlocks && reviewStatus === null) {
    await fs.promises.rm(routineDir, { recursive: true, force: true });
    throw new Error(`Falha técnica na rotina ${parsed.id}: ${block?.motivo ?? 'erro não classificado'}`);
  }

  // ADR-020: rotina bloqueada sai com o texto 100% original e sem notas de ajuda/confronto
  const editorial: EditorialDivergence[] = hasBlocks ? [] : compareManualWithScreens(parsed, screenSnaps);
  for (const r of stepResults) {
    const es = emptyByStep.get(r.stepNumber);
    if (es) r.emptyState = es;
    const seededRec = seededByStep.get(r.stepNumber);
    if (seededRec) r.seededRecord = seededRec;
    const implicitList = implicitByStep.get(r.stepNumber);
    if (implicitList && !r.implicitTargets) r.implicitTargets = implicitList;
    if (adjustedSteps.has(r.stepNumber)) r.adjusted = true;
    const help = helpByStep.get(r.stepNumber);
    if (help && help.length > 0) {
      r.helpTooltips = help;
      const first = telemetry.find(t => t.stepNum === r.stepNumber && t.frame === 'a');
      if (first) first.helpTooltips = help;
    }
  }
  if (telemetry.length > 0) {
    telemetry[0].screenSnapshots = screenSnaps;
    telemetry[0].editorialDivergences = editorial;
  }
  for (const e of editorial) console.log(`   [Confronto Semântico] ${e.kind}: ${e.message}`);
  const hasMods = stepResults.some(r => r.isModified || r.adjusted) || editorial.length > 0;
  // ADR-024: `[CCC]` acompanha a rotina que tem etapas em portal externo, sozinha (sem bloqueio no Orion TN)
  // ou junto de um bloqueio (`[ATT][CCC]`). O status principal é o do bloqueio, se houver.
  const extraTags: ReviewTag[] = scope.hasExternal ? ['CCC'] : [];
  const overallStatus: AuditReportStatus = hasBlocks
    ? (reviewStatus as NonNullable<typeof reviewStatus>)
    : scope.hasExternal
      ? 'comunicacao_externa'
      : hasMods
        ? 'validado_com_ajustes'
        : 'validado_inalterado';
  const reviewTags = reviewTagsFor(overallStatus, extraTags);

  // ADR-021/ADR-024: sinalização obrigatória no nome da pasta e do arquivo, em ordem canônica e sem espaço
  // entre os colchetes (`[ATT][CCC] C-CENTRAL-02-...`). Substitui o [!!!].
  const tagPrefix = reviewPrefix(overallStatus, extraTags);
  const finalFileName = `${tagPrefix}${fileName}`;
  const finalDir = path.join(baseModuleDir, finalFileName);
  if (routineDir !== finalDir) {
    if (fs.existsSync(finalDir)) {
      await fs.promises.rm(finalDir, { recursive: true, force: true });
    }
    await fs.promises.rename(routineDir, finalDir);
    routineDir = finalDir;
  }
  // Variantes antigas da mesma rotina (prefixo legado [!!!], outra tag ou outra combinação de tags) ficariam duplicadas
  for (const variant of await fs.promises.readdir(baseModuleDir)) {
    if (variant === finalFileName || stripReviewPrefix(variant) !== fileName) continue;
    await fs.promises.rm(path.join(baseModuleDir, variant), { recursive: true, force: true });
  }

  const revisedDocPath = path.join(routineDir, `${finalFileName}-revisado.md`);
  const { content: revisedDocContent, lockViolations } = buildRevisedRoutineDocument({
    parsed,
    results: stepResults,
    divergences,
    status: overallStatus,
    block: hasBlocks ? block : undefined,
    gate,
    workerId: workerSessionId,
    dryRunMutations,
    editorial,
    seededRecords,
    extraTags
  });
  for (const v of lockViolations) console.warn(`🔒 [Trava de Evidência] ${v}`);
  await fs.promises.writeFile(revisedDocPath, revisedDocContent, 'utf-8');
  console.log(`✓ [Auditoria] Esboço revisado salvo em: ${revisedDocPath}`);

  // Telemetria do executor do KB (ADR-017): fonte do validador geométrico para estas prints
  for (const t of telemetry) {
    t.slug = finalFileName;
    t.finalPngPath = path.join(routineDir, t.printName);
    t.finalWebpPath = t.finalPngPath.replace(/\.png$/i, '.webp');
    // A classificação final (ex.: missing_target -> empty_data/cross_routine) vale para toda print bloqueada
    if (hasBlocks && block && t.status === 'blocked' && t.blockKind !== 'rbac') t.blockKind = block.kind;
    if (t.frame === 'a') {
      const es = emptyByStep.get(t.stepNum);
      if (es) t.emptyState = es;
      const sr = seededByStep.get(t.stepNum);
      if (sr) t.seededRecord = sr;
      const im = implicitByStep.get(t.stepNum);
      if (im) t.implicitTargets = im;
    }
  }
  if (telemetry.length > 0 && hasBlocks) telemetry[0].reviewStatus = String(reviewStatus);
  if (telemetry.length > 0) {
    if (reviewTags.length > 0) telemetry[0].reviewTags = reviewTags;
    if (scope.hasExternal) telemetry[0].externalSteps = scope.externalSteps;
  }
  if (reviewTags.length > 0) console.log(`   [Taxonomia] Tags da rotina: ${describeTags(reviewTags)} -> pasta "${finalFileName}"`);
  await fs.promises.mkdir(KB_TELEMETRY_DIR, { recursive: true });
  await fs.promises.writeFile(
    path.join(KB_TELEMETRY_DIR, `${parsed.id}.json`),
    JSON.stringify(telemetry, null, 2),
    'utf-8'
  );

  // Sincronização em tempo real (Write-Through) com o Supabase sem derrubar lotes em oscilações de rede
  if (options.syncToSupabase !== false) {
    try {
      await syncSingleRoutineToSupabase(parsed.id, {
        onlyWebp: true,
        preserveExistingGovernance: false
      });
    } catch (syncErr: any) {
      console.warn(`⚠ [Supabase Write-Through] Falha ao sincronizar ${parsed.id} (execução continua): ${syncErr?.message || syncErr}`);
    }
  }

  const durationSeconds = Math.round((Date.now() - startTime) / 1000);

  return {
    id: parsed.id,
    modulo: parsed.modulo,
    titulo: parsed.titulo,
    workloadType,
    workerSessionId,
    status: overallStatus,
    steps: stepResults,
    divergences,
    block: hasBlocks ? block : undefined,
    reviewTags: reviewTags.length > 0 ? reviewTags : undefined,
    externalSteps: scope.hasExternal ? scope.externalSteps : undefined,
    seededRecords: seededRecords.length > 0 ? seededRecords : undefined,
    privilegeGate: gate,
    dryRunMutations,
    executedAt: new Date().toISOString(),
    durationSeconds,
    changelogPath: revisedDocPath
  };
}

/**
 * Ação pós-captura com o Filtro de Zona Semântica propagado (ADR-015 §2.4).
 *
 * 1. Caminho normal: o clique/preenchimento usa o carimbo gravado pelo script de medição no próprio nó
 *    validado na zona — é o mesmo nó que foi medido e demarcado, sem nova busca por nome.
 * 2. Antes de agir, o carimbo é conferido ao vivo: exatamente um nó, visível e, se a medição foi em
 *    zona de conteúdo, fora de qualquer zona de navegação.
 * 3. Sem carimbo válido, a busca legada por nome na Árvore de Acessibilidade só é permitida quando o
 *    alvo foi medido SEM filtro de zona. Em zona de conteúdo a ação é omitida: não clicar é a falha
 *    segura; clicar num item homônimo do menu lateral não é.
 * 4. Trava Segura de Mutação (ADR-018): com `dryRunMutations`, o clique num comando de gravação ou
 *    exclusão é omitido. O alvo já foi medido, demarcado e fotografado; só a gravação não acontece.
 */
export async function executeStepAction(
  client: AgentBrowserClient,
  step: RoutineStep,
  locResult: SmartLocatorResult,
  geometry: DOMResolvedGeometry,
  opts: { dryRunMutations?: boolean } = {}
): Promise<ExecutedStepAction> {
  if (step.actionType === 'verify') {
    return { kind: 'none', via: 'skipped', zone: geometry.zone, reason: 'Passo de conferência: nada a acionar' };
  }

  const wantsFill = step.actionType === 'fill';
  const kind: ExecutedStepAction['kind'] = wantsFill ? 'fill' : 'click';
  const fillValue = () => {
    const mockData = generateMockPerson();
    return step.targets.some(t => t.toLowerCase().includes('cpf')) ? mockData.cpf : mockData.nome;
  };
  const mainTargets = step.targets.slice(0, step.mainTargetCount ?? step.targets.length);
  const healedFrom =
    locResult.divergence && locResult.divergence.resolutionLayer !== 'menu_path_resolution'
      ? locResult.divergence.documentedTarget
      : undefined;
  const dryRunSkip = (commitLabel: string, extra: Partial<ExecutedStepAction>): ExecutedStepAction => {
    console.log(
      `   🛡 [Trava de Mutação] Comando "${commitLabel}" localizado, medido e demarcado; clique final omitido (dry-run).`
    );
    return {
      kind: 'none',
      via: 'dry-run',
      zone: geometry.zone,
      commitLabel,
      reason: 'Trava Segura de Mutação: comando de gravação validado visualmente, sem efetivar a gravação',
      ...extra
    };
  };

  // Rótulo de bloco ("Para busca imediata por número:") é título de parágrafo, não controle: nem ele nem
  // um substituto curado pelo SmartLocator pode ser clicado (evitava abrir telas alheias, ex.: agenda).
  if (!wantsFill && healedFrom && /:\s*$/.test(healedFrom.trim())) {
    const reason = `O alvo documentado "${healedFrom.trim()}" é um título de bloco, não um controle; o substituto curado não é acionado`;
    console.warn(`   ⚠ [Ação] ${kind} omitido: ${reason}.`);
    return { kind: 'none', via: 'skipped', zone: geometry.zone, reason };
  }

  const stamped = geometry.actionTarget;
  const selector = stamped ? (wantsFill ? stamped.fillSelector : stamped.clickSelector) : undefined;

  if (selector) {
    const node = await client.probeActionNode(selector);
    if (node && node.disabled) {
      const reason = `Controle <${node.tagName}> "${node.text}" está desabilitado na tela (aguarda pré-requisito, ex.: campo obrigatório)`;
      console.warn(`   ⚠ [Ação] ${kind} omitido: ${reason}.`);
      return { kind: 'none', via: 'skipped', selector, node, zone: geometry.zone, reason };
    }
    // Passo com vários alvos: o nó medido só é clicado se o seu texto É um dos alvos citados. Um casamento
    // parcial ("Protocolo" -> botão "Agenda de protocolos") é outro controle e pode abrir uma tela alheia.
    if (node && !wantsFill && !healedFrom && step.targets.length >= 2) {
      const flat = (t: string) =>
        String(t || '')
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^\w\s]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();
      const nodeText = flat(node.text);
      const exact = step.targets.some(t => flat(t.split('>').pop() || t) === nodeText);
      if (nodeText && !exact) {
        const reason = `O nó medido <${node.tagName}> "${flat(node.text)}" não é nenhum dos alvos citados (casamento parcial); clique omitido para não abrir outro controle`;
        console.warn(`   ⚠ [Ação] click omitido: ${reason}.`);
        return { kind: 'none', via: 'skipped', selector, node, zone: geometry.zone, reason };
      }
    }
    if (node && !(geometry.zone === 'content' && node.insideNavZone)) {
      if (wantsFill) {
        await client.fill(selector, fillValue());
      } else {
        if (opts.dryRunMutations) {
          const commit = detectCommitCommand({ nodeText: node.text, nodeHint: node.hint, healedFrom, mainTargets });
          if (commit) return dryRunSkip(commit, { selector, node });
        }
        await client.click(selector);
      }
      await client.wait(1500);
      const b = node.box;
      console.log(
        `   [Ação] ${kind} no mesmo nó medido: <${node.tagName}> "${node.text}" em x=${b.x}, y=${b.y}, ${b.width}x${b.height} (zona ${geometry.zone ?? 'any'})`
      );
      return { kind, via: 'measured-node', selector, node, zone: geometry.zone };
    }
  }

  if (geometry.zone === 'content') {
    const reason = wantsFill && stamped && !stamped.fillSelector
      ? 'O alvo medido não possui controle de formulário preenchível'
      : 'O nó medido na zona de conteúdo não está mais disponível para a ação';
    console.warn(`   ⚠ [Ação] ${kind} omitido: ${reason}. Busca por nome fora da zona não é permitida.`);
    return { kind: 'none', via: 'skipped', zone: geometry.zone, reason };
  }

  // Legado, apenas para alvos medidos sem filtro de zona (navegação) ou curados por `ref`
  let targetRef = locResult.matchedRef || null;
  let refName = locResult.matchedRef ? locResult.matchedTargetName : '';
  if (!targetRef) {
    const snapshot = await client.snapshotInteractive();
    for (const t of [locResult.matchedTargetName, ...step.targets]) {
      const refMatch = findRefByNameInSnapshot(snapshot, t, isStrictNavigationStep(step));
      if (refMatch) {
        targetRef = refMatch;
        refName = t;
        break;
      }
    }
  }
  if (!targetRef) {
    return { kind: 'none', via: 'skipped', zone: geometry.zone, reason: 'Nenhum nó acionável localizado' };
  }
  if (wantsFill) {
    await client.fill(targetRef, fillValue());
  } else {
    if (opts.dryRunMutations) {
      const commit = detectCommitCommand({ nodeText: refName, healedFrom, mainTargets });
      if (commit) return dryRunSkip(commit, { selector: targetRef });
    }
    await client.click(targetRef);
  }
  await client.wait(1500);
  console.log(`   [Ação] ${kind} via Árvore de Acessibilidade (${targetRef}) — alvo medido sem filtro de zona`);
  return { kind, via: 'a11y-ref', selector: targetRef, zone: geometry.zone };
}

function findRefByNameInSnapshot(snapshotText: string, targetName: string, skipInputs = false): string | null {
  const cleanTarget = targetName.toLowerCase().trim();
  const lines = snapshotText.split('\n');

  for (const line of lines) {
    // ADR-024: passo de navegação estrita nunca aciona campo de texto nem a busca global (CTRL + B)
    if (skipInputs && (/^\s*-?\s*(textbox|searchbox|combobox|spinbutton)\b/i.test(line) || isGlobalSearchName(line))) continue;
    if (line.toLowerCase().includes(cleanTarget)) {
      const match = line.match(/\[ref=(e\d+)\]/) || line.match(/@(e\d+)/);
      if (match) {
        return '@' + match[1];
      }
    }
  }
  return null;
}

