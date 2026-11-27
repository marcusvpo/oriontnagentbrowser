import { writePreTriagedDddReport } from './hardware-pretriage.js';
import { listHardwareRoutineIds } from './hardware-registry.js';
import { findRoutineFileById } from './phases.js';
import { parseRoutineMarkdown } from './parser.js';
import { classifyRoutineWorkload } from './worker-pool.js';
import type { AuditRoutineReport } from './types.js';

/**
 * Pré-triagem `[DDD]` da Fase 4 (`kb/rotinas/caixa/`, Grupo B1), sem navegador (ADR-021, regra 9).
 *
 * Só as 5 rotinas cujo passo a passo depende estritamente de hardware físico, de serviço local ou de
 * infraestrutura fora do navegador. As outras 99 rotinas de `caixa` são auditadas ao vivo no seu produto
 * do Portal Orion (`--product`). O relatório sai pelo gerador único do `-revisado.md` (texto 100% original,
 * `prints_geradas: 0`) com write-through Supabase, e a partir daí `listHardwareRoutineIds` passa a
 * protegê-las do `--reaudit-pending` automaticamente (relatório em disco com bloqueio de ambiente e 0 prints).
 *
 * Uso: `npx tsx src/phase4-hardware-pretriage.ts [--no-sync] [--list-only]`
 */
export const PHASE4_HARDWARE_PRETRIAGE: ReadonlyArray<{ id: string; reason: string }> = [
  {
    id: 'C-FIN-04',
    reason:
      'Os passos 1 a 4 são executados no terminal/console do Docker do servidor da serventia (docker ps -a, docker restart siplan-integrador): infraestrutura local fora do navegador, indisponível no ambiente web de homologação.'
  },
  {
    id: 'D-1.9',
    reason:
      'A configuração depende da lista de impressoras instaladas no Windows da estação de atendimento (Impressora Padrão de Recibos): periférico físico local que o ambiente web de homologação não supre.'
  },
  {
    id: 'D-3.5',
    reason:
      'A digitalização em lote por sequência de cartão exige as fichas físicas no alimentador (ADF) de um scanner homologado e o perfil de cores/resolução do dispositivo: hardware TWAIN indisponível no ambiente web de homologação.'
  },
  {
    id: 'D-3.7',
    reason:
      'A digitalização em lote de DUT exige os documentos físicos no alimentador de um scanner homologado (300 DPI) antes do envio à SEFAZ: hardware TWAIN indisponível no ambiente web de homologação.'
  },
  {
    id: 'D-3.72',
    reason:
      'A barra de atendimento do SGA depende do sistema de senhas instalado na serventia (painel/TV do salão, sinal sonoro e guichês físicos): serviço local e hardware externo indisponíveis no ambiente web de homologação.'
  }
];

async function main() {
  const args = process.argv.slice(2);
  const noSync = args.includes('--no-sync') || process.env.ORION_NO_SYNC === 'true';
  const listOnly = args.includes('--list-only');

  console.log(`[Fase 4 — Pré-triagem B1] ${PHASE4_HARDWARE_PRETRIAGE.length} rotinas [DDD] de hardware/Docker/scanner/SGA (sem navegador).`);
  console.log(`  Sync Supabase: ${noSync ? 'DESLIGADO (--no-sync)' : 'ATIVO (Write-Through por rotina)'}`);

  const reports: AuditRoutineReport[] = [];
  for (const { id, reason } of PHASE4_HARDWARE_PRETRIAGE) {
    const file = findRoutineFileById(id);
    if (!file) {
      console.error(`✕ ${id} sem arquivo em kb/rotinas/ (ignorada)`);
      continue;
    }
    const workloadType = classifyRoutineWorkload(parseRoutineMarkdown(file));
    if (listOnly) {
      console.log(`  ${id} (${workloadType}) — ${reason}`);
      continue;
    }
    reports.push(
      await writePreTriagedDddReport(
        { workloadType, hardwarePreTriage: { isHardwareDependent: true, tag: '[DDD]', reason } },
        file,
        { syncToSupabase: !noSync }
      )
    );
  }
  if (listOnly) return;

  const protectedIds = listHardwareRoutineIds();
  const unprotected = PHASE4_HARDWARE_PRETRIAGE.map(e => e.id).filter(id => !protectedIds.has(id));
  console.log(`\n✓ Pré-triagem [DDD] da Fase 4 concluída: ${reports.length} relatório(s) sem navegador.`);
  console.log(
    unprotected.length === 0
      ? '✓ Todas protegidas por listHardwareRoutineIds (fora do --reaudit-pending).'
      : `⚠ Não reconhecidas como hardware em disco: ${unprotected.join(', ')}`
  );
}

const invokedDirectly = process.argv[1] && /phase4-hardware-pretriage\.ts$/.test(process.argv[1].replace(/\\/g, '/'));
if (invokedDirectly) {
  main().catch(err => {
    console.error(`✕ Pré-triagem da Fase 4 falhou: ${err?.message || err}`);
    process.exit(1);
  });
}
