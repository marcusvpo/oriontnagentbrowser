import fs from 'node:fs';
import path from 'node:path';
import { AgentBrowserClient } from './browser.js';
import { loginOrion, ensureAuthenticated, authStats } from './auth.js';
import { executeRoutineAudit, type ExecutorOptions } from './executor.js';
import { parseRoutineMarkdown } from './parser.js';
import { BrowserWorkerPool } from './worker-pool.js';
import { getRoutinesForPhase, findRoutineFileById, PHASES } from './phases.js';
import { executePhase1 } from './execute-phase1.js';
import { executePhase2 } from './execute-phase2.js';
import { ROUTINES as PHASE2_MANIFEST } from './run-phase2-master.js';
import { config } from './config.js';
import { preflightOrionReachability, PreflightError } from './preflight.js';
import { selectPendingRoutineIds } from './hardware-registry.js';
import { PHASE3_MANIFEST } from './manifests/phase3-manifest.js';
import { writePreTriagedDddReport } from './hardware-pretriage.js';
import { REVIEW_TAGS, isReviewStatus, type ReviewTag } from './review-taxonomy.js';
import { seedHumanReviews } from './seed-human-reviews.js';
import type { AuditRoutineReport, WorkloadType } from './types.js';

const argValue = (args: string[], flag: string): string | null => {
  const inline = args.find(a => a.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1);
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--') ? args[idx + 1] : null;
};

async function main() {
  const args = process.argv.slice(2);
  console.log('====================================================');
  console.log('  ORION TN — ORQUESTRADOR DE AUDITORIA VISUAL V2.4  ');
  console.log('  (Worker Pool Paralelo + SmartLocator Auto-Cura)   ');
  console.log('====================================================');

  const isDryRun = args.includes('--dry-run');
  const isHeaded = args.includes('--headed');
  const isHeadless = args.includes('--headless') || (!isHeaded && config.headless);
  const isLoginOnly = args.includes('--login');
  const isSeedReviews = args.includes('--seed-reviews');
  // Trava Segura de Mutação (ADR-018): comandos de gravação são demarcados, mas não acionados
  const dryRunMutations = args.includes('--dry-run-mutations') || process.env.ORION_DRY_RUN_MUTATIONS === 'true';
  // Auto-seed de registro mock (ADR-021): ligado por padrão; --no-auto-seed desliga
  // Write-through para o Supabase (ADR-022/023): ligado por padrão; --no-sync desliga em testes offline
  const noSync = args.includes('--no-sync') || process.env.ORION_NO_SYNC === 'true';
  const executorOptions: ExecutorOptions = {
    dryRunMutations,
    explore: !args.includes('--no-explore'),
    // ADR-025: `ORION_AUTO_SEED=false` desliga no ambiente compartilhado; a flag da CLI sobrepõe o .env
    autoSeed: args.includes('--auto-seed') ? true : args.includes('--no-auto-seed') ? false : config.autoSeedDefault,
    syncToSupabase: !noSync
  };

  const phaseArg = argValue(args, '--phase');
  const targetPhase: number | null = phaseArg ? parseInt(phaseArg, 10) : null;
  const targetRoutine = argValue(args, '--routine');
  const routineList = (argValue(args, '--routines') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  // Fase 2: `kb` (padrão) audita passo a passo pelo executor do KB; `manifest` é o runner declarativo antigo
  const engine = argValue(args, '--engine') || 'kb';
  const readConcurrency = parseInt(argValue(args, '--concurrency') || '', 10) || config.maxReadConcurrency;

  console.log(
    `  Trava Segura de Mutação: ${dryRunMutations ? 'ATIVA — Salvar/Gravar/Confirmar/Concluir/Excluir/Inativar não serão acionados' : 'DESLIGADA — comandos de gravação serão acionados'}`
  );
  console.log(
    `  Sync Supabase em Tempo Real: ${noSync ? 'DESLIGADO (--no-sync)' : 'ATIVO (Write-Through por rotina)'}`
  );

  /** Executa um lote de rotinas do KB no Worker Pool, com reinício de estado por rotina. */
  const runKbBatch = async (
    routineFiles: string[],
    label: string,
    extra: {
      /** Relatórios já gerados sem navegador (pré-triagem [DDD] de hardware) que entram no resumo */
      preTriaged?: AuditRoutineReport[];
      /** Carga declarada por ID (ex.: phase3-manifest.ts) */
      workloadOverrides?: Map<string, WorkloadType>;
      summaryFile?: string;
    } = {}
  ) => {
    const batchStart = Date.now();
    const preTriaged = extra.preTriaged ?? [];
    console.log(`Total de rotinas selecionadas (${label}): ${routineFiles.length + preTriaged.length} (${preTriaged.length} pré-triadas sem navegador + ${routineFiles.length} no Worker Pool)`);
    const pool = new BrowserWorkerPool({
      readConcurrency,
      mutationConcurrency: config.maxWriteConcurrency,
      headless: isHeadless
    });
    const failures: Array<{ file: string; error: string }> = [];

    const runOne = async (
      file: string,
      workerClient: AgentBrowserClient,
      workerSessionId: string,
      workload: WorkloadType
    ): Promise<AuditRoutineReport> => {
      let lastError = '';
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          return await executeRoutineAudit(file, workerClient, isDryRun, workerSessionId, workload, {
            ...executorOptions,
            resetToHome: true
          });
        } catch (err: any) {
          lastError = String(err?.message || err);
          console.error(`✕ [Lote] ${path.basename(file)} falhou na tentativa ${attempt}/2: ${lastError.slice(0, 700)}`);
        }
      }
      // A falha de uma rotina não derruba o lote: fica registrada para reexecução com --routines.
      // Falha técnica (ADR-021) não recebe tag: a rotina continua `nao_auditada`, sem pasta de revisão.
      failures.push({ file, error: lastError });
      const parsed = parseRoutineMarkdown(file);
      return {
        id: parsed.id,
        modulo: parsed.modulo,
        titulo: parsed.titulo,
        workloadType: workload,
        workerSessionId,
        status: 'falha_tecnica',
        steps: [],
        block: {
          kind: 'other',
          tipo: 'Falha Técnica na Execução da Auditoria',
          motivo: lastError.slice(0, 300),
          roteiro: ['Reexecutar a auditoria desta rotina.']
        },
        executedAt: new Date().toISOString(),
        durationSeconds: 0,
        changelogPath: ''
      };
    };

    const poolReports = await pool.executeBatch(routineFiles, parseRoutineMarkdown, runOne, extra.workloadOverrides);
    const reports = [...preTriaged, ...poolReports];
    const totalSeconds = Math.round((Date.now() - batchStart) / 1000);

    const summary = reports.map(r => ({
      id: r.id,
      status: r.status,
      carga: r.workloadType,
      tipo_bloqueio: r.block?.tipo,
      bloqueio_no_passo: r.steps.find(s => s.status === 'blocked')?.stepNumber,
      passos_auditados: r.steps.length,
      prints: r.steps.reduce((n, s) => n + (s.printFiles?.length || 0), 0),
      sub_capturas: r.steps.reduce((n, s) => n + Math.max(0, (s.printFiles?.length || 0) - 1), 0),
      comandos_nao_acionados: r.steps.filter(s => s.executedAction?.via === 'dry-run').map(s => `${s.stepNumber}:${s.executedAction?.commitLabel}`),
      gatilhos_testados: r.steps.reduce((n, s) => n + (s.exploration?.explored.length || 0), 0),
      alvos_revelados: r.steps.flatMap(s => s.exploration?.revealed || []),
      status_anterior: r.reaudit?.status_anterior,
      tags_anteriores: r.reaudit?.tags_anteriores,
      bloqueio_superado: r.reaudit?.bloqueio_superado,
      curas_reaproveitadas: r.reaudit?.curas_reaproveitadas.filter(c => c.confirmada_ao_vivo).length,
      tag_revisao: isReviewStatus(r.status) ? REVIEW_TAGS[r.status].tag : undefined,
      tags_revisao: r.reviewTags,
      passos_externos: r.externalSteps?.map(s => `${s.stepNumber}:${s.portal}`),
      rotinas_pre_requisito: r.block?.prerequisites,
      registros_mock_criados: r.seededRecords?.length || 0,
      duracao_s: r.durationSeconds,
      falha_tecnica: failures.some(f => path.basename(f.file).startsWith(`${r.id}-`)),
      relatorio: r.changelogPath
    }));
    const summaryPath = path.join(config.rootDir, 'auditoria', 'cache', extra.summaryFile || 'kb-batch-summary.json');
    await fs.promises.writeFile(
      summaryPath,
      JSON.stringify({ lote: label, executado_em: new Date().toISOString(), duracao_total_s: totalSeconds, dry_run_mutations: dryRunMutations, rotinas: summary }, null, 2),
      'utf-8'
    );

    const count = (status: AuditRoutineReport['status']) => reports.filter(r => r.status === status).length;
    // ADR-024: uma rotina pode ter várias tags; o contador por tag soma o status principal e as tags adicionais
    const countTag = (tag: ReviewTag) => reports.filter(r => (r.reviewTags || []).includes(tag)).length;
    console.log('\n====================================================');
    console.log(`  ${label} CONCLUÍDA: ${reports.length} ROTINAS AUDITADAS PELO EXECUTOR DO KB`);
    console.log(`  - Validadas sem alteração:        ${count('validado_inalterado')}`);
    console.log(`  - Validadas com ajustes:          ${count('validado_com_ajustes')}`);
    console.log(`  - [ATT] Atualização editorial:    ${countTag('ATT')}`);
    console.log(`  - [CCC] Comunicação externa:      ${countTag('CCC')}`);
    console.log(`  - [DDD] Dependência de dados:     ${countTag('DDD')}`);
    console.log(`  - [XRX] Dependência cruzada:      ${countTag('XRX')}`);
    const auth = authStats();
    console.log(`  - Autenticação (ADR-024):         ${auth.loginsPerformed} login(s) real(is) | ${auth.sessionsReused} sessão(ões) reaproveitada(s) | ${auth.lightResets} reset(s) leve(s) sem recarga`);
    console.log(`  - Registros mock criados:         ${reports.reduce((n, r) => n + (r.seededRecords?.length || 0), 0)}`);
    console.log(`  - Tempo total do lote:            ${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}min ${totalSeconds % 60}s`);
    console.log(`  - Falhas técnicas (reexecutar):   ${failures.length}${failures.length ? ` -> ${failures.map(f => path.basename(f.file).split('-').slice(0, 2).join('-')).join(', ')}` : ''}`);
    console.log(`  Resumo do lote: ${summaryPath}`);
    console.log('====================================================');
  };

  try {
    // Preflight de VPN (ADR-025): servidor interno inalcançável aborta antes de abrir qualquer worker.
    // A pré-triagem [DDD] de hardware (--pretriage-only) e o uso sem modo não tocam a rede.
    const pendingMode = args.includes('--reaudit-pending');
    const listOnly = args.includes('--list-only');
    const touchesNetwork =
      !isDryRun &&
      (isLoginOnly ||
        !!targetRoutine ||
        routineList.length > 0 ||
        (pendingMode && !listOnly) ||
        (targetPhase !== null && !args.includes('--pretriage-only')));
    if (touchesNetwork) await preflightOrionReachability();

    if (isSeedReviews) {
      await seedHumanReviews();
      return;
    }

    if (isLoginOnly) {
      if (isDryRun) throw new Error('Não é possível executar --login em modo --dry-run');
      const client = new AgentBrowserClient({ headless: isHeadless, sessionId: 'login-session' });
      try {
        await loginOrion(client);
      } finally {
        await client.close();
      }
      return;
    }

    if (targetRoutine) {
      const routineFile = findRoutineFileById(targetRoutine);
      if (!routineFile) {
        console.error(`✕ Rotina com ID "${targetRoutine}" não encontrada na pasta kb/rotinas/`);
        process.exit(1);
      }
      console.log(`[Modo Individual] Executando auditoria para a rotina: ${routineFile}`);
      const client = new AgentBrowserClient({
        headless: isHeadless,
        sessionId: 'worker-single',
        statePath: config.sessionFile
      });
      try {
        if (!isDryRun) {
          // O modo individual não passa pelo Worker Pool: autentica e trava o viewport aqui (ADR-009),
          // senão o primeiro passo é medido sobre uma página em branco.
          await client.setViewport(config.viewportWidth, config.viewportHeight);
          if (!(await ensureAuthenticated(client))) {
            throw new Error('Falha ao autenticar no Orion TN para a execução individual.');
          }
          await client.setViewport(config.viewportWidth, config.viewportHeight);
          await client.open(config.appHomeUrl);
          await client.wait(1800);
        }
        const report = await executeRoutineAudit(routineFile, client, isDryRun, 'worker-single', undefined, executorOptions);
        console.log(`\n✓ Relatório da Rotina: ${report.id} - Status: ${report.status}`);
        console.log(`  Arquivo revisado salvo: ${report.changelogPath}`);
      } finally {
        await client.close();
      }
    } else if (pendingMode) {
      // ADR-025: lote de reauditoria das rotinas pendentes/bloqueadas (última auditoria em disco `[ATT]`/`[DDD]`/
      // `[XRX]`/`[CCC]`), SEM as rotinas de hardware/ambiente, que só rodam se citadas em --routines.
      const { ids, excludedHardware } = selectPendingRoutineIds();
      console.log(`[Reauditoria] ${ids.length} rotina(s) pendentes selecionadas; ${excludedHardware.length} de hardware/ambiente protegidas (use --routines para forçar).`);
      if (listOnly) {
        console.log(`  Pendentes: ${ids.join(', ')}`);
        console.log(`  Hardware/ambiente (fora do lote): ${excludedHardware.join(', ')}`);
        return;
      }
      const pendingFiles = ids.map(id => findRoutineFileById(id)).filter((f): f is string => !!f);
      const manifestWorkload = new Map(PHASE3_MANIFEST.filter(e => ids.includes(e.id)).map(e => [e.id, e.workloadType] as const));
      await runKbBatch(pendingFiles, 'REAUDITORIA DAS PENDENTES', { workloadOverrides: manifestWorkload, summaryFile: 'kb-batch-summary-reauditoria.json' });
    } else if (routineList.length > 0) {
      const files: string[] = [];
      for (const id of routineList) {
        const file = findRoutineFileById(id);
        if (file) files.push(file);
        else console.error(`✕ Rotina com ID "${id}" não encontrada na pasta kb/rotinas/ (ignorada)`);
      }
      // Rotinas da Fase 3 mantêm a carga do manifesto (mutation segue serializada mesmo numa reexecução pontual)
      const manifestWorkload = new Map(PHASE3_MANIFEST.filter(e => routineList.includes(e.id)).map(e => [e.id, e.workloadType] as const));
      await runKbBatch(files, 'SELEÇÃO DE ROTINAS', { workloadOverrides: manifestWorkload });
    } else if (targetPhase !== null) {
      const phaseDef = PHASES.find(p => p.phase === targetPhase);
      if (!phaseDef) {
        console.error(`✕ Fase ${targetPhase} inválida. Escolha entre 1 e 6.`);
        process.exit(1);
      }

      if (targetPhase === 1 && !isDryRun) {
        await executePhase1();
        return;
      }
      if (targetPhase === 2 && !isDryRun && engine === 'manifest') {
        await executePhase2();
        return;
      }

      console.log(`\n>>> INICIANDO FASE ${phaseDef.phase}: ${phaseDef.title} <<<`);
      console.log(`    ${phaseDef.description}\n`);

      // Fase 2 (ADR-018): as 39 rotinas do escopo navegável, auditadas passo a passo pelo executor do
      // KB. As demais rotinas dos módulos acesso/config dependem de hardware ou serviço externo e já
      // estão sinalizadas ([ATT]/[DDD]); não são sobrescritas.
      const routineFiles =
        targetPhase === 2
          ? PHASE2_MANIFEST.map(r => findRoutineFileById(r.id)).filter((f): f is string => !!f)
          : getRoutinesForPhase(targetPhase);
      if (targetPhase === 3) {
        // Fase 3 (118 rotinas do manifesto): as pré-triadas [DDD] de hardware/serviço local saem direto,
        // sem navegador; as demais vão ao executor do KB com a carga (read_only/mutation) do manifesto.
        const fileOf = new Map(PHASE3_MANIFEST.map(e => [e.id, findRoutineFileById(e.id)] as const));
        const hardware = PHASE3_MANIFEST.filter(e => e.hardwarePreTriage.isHardwareDependent);
        const preTriaged: AuditRoutineReport[] = [];
        for (const entry of hardware) {
          const file = fileOf.get(entry.id);
          if (!file) {
            console.error(`✕ [Fase 3] Pré-triada ${entry.id} sem arquivo no KB (ignorada)`);
            continue;
          }
          preTriaged.push(await writePreTriagedDddReport(entry, file, { syncToSupabase: !noSync }));
        }
        if (args.includes('--pretriage-only')) {
          console.log(`\n✓ Pré-triagem [DDD] concluída: ${preTriaged.length} rotinas de hardware/serviço local (sem navegador).`);
          return;
        }
        const browserEntries = PHASE3_MANIFEST.filter(e => !e.hardwarePreTriage.isHardwareDependent && fileOf.get(e.id));
        await runKbBatch(
          browserEntries.map(e => fileOf.get(e.id)!),
          'FASE 3',
          {
            preTriaged,
            workloadOverrides: new Map(browserEntries.map(e => [e.id, e.workloadType] as const)),
            summaryFile: 'kb-batch-summary-fase3.json'
          }
        );
        return;
      }
      await runKbBatch(routineFiles, `FASE ${targetPhase}`);
    } else {
      console.log('Uso do orquestrador:');
      console.log('  npm run audit -- --phase 2 --concurrency 4 --dry-run-mutations   Fase 2 pelo executor do KB, sem gravar');
      console.log('  npm run audit -- --phase 3 --concurrency 4 --dry-run-mutations   Fase 3 (118 rotinas): 7 [DDD] de hardware sem navegador + 111 no Worker Pool');
      console.log('  npm run audit -- --routines M-16.2,M-43.0 --dry-run-mutations    Reaudita uma seleção de rotinas');
      console.log('  npm run audit -- --routine D-1.1                                 Executa uma rotina específica');
      console.log('  npm run audit -- --phase 2 --engine manifest                     Runner declarativo antigo da Fase 2');
      console.log('  npm run audit -- --login                                         Autentica e salva sessão mestre');
      console.log('  npm run audit -- --seed-reviews                                  Cadastra/atualiza as 9 revisões humanas no Supabase e em disco');
      console.log('  npm run audit -- --headed                                        Abre janela visível');
      console.log('  --dry-run-mutations  demarca comandos de gravação sem acioná-los | --no-explore  desliga a exploração pré-bloqueio');
      console.log('  --phase 3 --pretriage-only  gera apenas os 7 relatórios [DDD] de hardware (sem navegador)');
      console.log('  --no-auto-seed      não cria registro mock quando a grade está vazia (ADR-021); --auto-seed liga (sobrepõe ORION_AUTO_SEED)');
      console.log('  --reaudit-pending   reaudita as rotinas pendentes/bloqueadas das Fases 2 e 3, sem as de hardware (ADR-025); --list-only só lista');
      console.log('  --no-sync           desliga sincronização automática com o Supabase (apenas testes offline)');
    }
  } catch (err: any) {
    console.error(err instanceof PreflightError ? `✕ [Preflight] ${err.message}` : `✕ Erro na execução: ${err.message}`);
    process.exit(1);
  }
}

main();
