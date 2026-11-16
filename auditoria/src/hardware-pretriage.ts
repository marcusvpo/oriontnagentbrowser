import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { removeTwinRoutineFolders } from './executor.js';
import { parseRoutineMarkdown } from './parser.js';
import { buildRevisedRoutineDocument } from './report.js';
import { ENVIRONMENT_BLOCK_TYPE, REVIEW_TAGS, stripReviewPrefix } from './review-taxonomy.js';
import type { Phase3RoutineEntry } from './manifests/phase3-types.js';
import type { AuditRoutineReport, RoutineBlockInfo } from './types.js';

/**
 * Pré-triagem `[DDD]` de rotinas que dependem de hardware ou serviço local (ADR-021, regra 9).
 *
 * A rotina é descrita no `phase3-manifest.ts` como dependente de periférico físico (leitor biométrico,
 * scanner TWAIN, impressora térmica, serviço Windows local...). Abrir o navegador não prova nada e
 * seguraria um worker esperando periférico: o relatório `[DDD]` é gerado direto, sem navegador, sem
 * print e sem telemetria (`prints_geradas: 0`).
 *
 * O texto dos passos é o do manual, 100% original (Regra da Evidência Estrita): o gerador único do
 * `-revisado.md` (`report.ts`) é o mesmo do executor do KB.
 */
export async function writePreTriagedDddReport(entry: Phase3RoutineEntry, routineFile: string): Promise<AuditRoutineReport> {
  const started = Date.now();
  const parsed = parseRoutineMarkdown(routineFile);
  parsed.workloadType = entry.workloadType;

  const fileName = path.basename(routineFile, '.md');
  const meta = REVIEW_TAGS.dependencia_dados_banco;
  const finalName = `${meta.prefix}${fileName}`;
  const moduleDir = path.join(config.outputDir, parsed.modulo);
  const finalDir = path.join(moduleDir, finalName);

  const block: RoutineBlockInfo = {
    kind: 'environment',
    tipo: ENVIRONMENT_BLOCK_TYPE,
    motivo: entry.hardwarePreTriage.reason || 'Depende de hardware externo ou serviço local que o ambiente de homologação web não supre.',
    roteiro: [
      'Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.',
      'Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.'
    ]
  };

  // Mesma higiene do executor: nenhuma pasta gêmea da rotina (outro slug, outra tag ou prefixo legado)
  await fs.promises.mkdir(moduleDir, { recursive: true });
  await removeTwinRoutineFolders(parsed.id, fileName);
  for (const folder of await fs.promises.readdir(moduleDir)) {
    if (folder !== finalName && stripReviewPrefix(folder) === fileName) {
      await fs.promises.rm(path.join(moduleDir, folder), { recursive: true, force: true });
    }
  }
  await fs.promises.rm(finalDir, { recursive: true, force: true });
  await fs.promises.mkdir(finalDir, { recursive: true });

  const { content } = buildRevisedRoutineDocument({
    parsed,
    results: [],
    divergences: [],
    status: 'dependencia_dados_banco',
    block,
    dryRunMutations: undefined
  });
  const revisedPath = path.join(finalDir, `${finalName}-revisado.md`);
  await fs.promises.writeFile(revisedPath, content, 'utf-8');
  // Telemetria antiga (execução anterior com prints) não pode sobreviver a um relatório sem prints
  await fs.promises.rm(path.join(config.rootDir, 'auditoria', 'cache', 'kb-telemetry', `${parsed.id}.json`), { force: true });
  console.log(`[Pré-triagem] ${parsed.id} -> [DDD] ${ENVIRONMENT_BLOCK_TYPE} (sem navegador): ${revisedPath}`);

  return {
    id: parsed.id,
    modulo: parsed.modulo,
    titulo: parsed.titulo,
    workloadType: entry.workloadType,
    workerSessionId: 'pre-triagem',
    status: 'dependencia_dados_banco',
    steps: [],
    block,
    executedAt: new Date().toISOString(),
    durationSeconds: Math.round((Date.now() - started) / 1000),
    changelogPath: revisedPath
  };
}
