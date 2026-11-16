import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import { config } from './config.js';
import { PHASE3_MANIFEST } from './manifests/phase3-manifest.js';
import { ENVIRONMENT_BLOCK_TYPE, isBlockingReviewStatus, stripReviewPrefix } from './review-taxonomy.js';

/**
 * Seleção de rotinas para a reauditoria em lote (ADR-025) e proteção das rotinas de hardware/ambiente.
 *
 * As rotinas que dependem de hardware físico ou de serviço local (leitor biométrico, scanner TWAIN, impressora
 * térmica, Docker, spooler...) saem como `[DDD]` SEM abrir o navegador (`prints_geradas: 0`) e NÃO mudam num
 * ambiente de homologação novo: reexecutá-las só repetiria o mesmo `[DDD]`. Por isso ficam fora do lote
 * (`--reaudit-pending`) e só rodam se citadas explicitamente em `--routines`.
 *
 * Fonte única, sem lista duplicada: a flag `hardwarePreTriage.isHardwareDependent` do manifesto da Fase 3
 * (7 rotinas) mais os relatórios da Fase 2 em disco com `tipo_bloqueio` de ambiente/hardware e nenhuma print (10).
 */

export interface DiskReportSummary {
  id: string;
  status: string;
  tipoBloqueio?: string;
  printsGeradas: number;
  folder: string;
}

/** Lê o resumo (`auditoria_ui`) de todos os `-revisado.md` em `auditoria/rotinas/`. Nunca lança. */
export function readDiskReports(outputDir: string = config.outputDir): DiskReportSummary[] {
  const out: DiskReportSummary[] = [];
  if (!fs.existsSync(outputDir)) return out;
  for (const mod of fs.readdirSync(outputDir)) {
    const modDir = path.join(outputDir, mod);
    try {
      if (!fs.statSync(modDir).isDirectory()) continue;
      for (const folder of fs.readdirSync(modDir)) {
        const dir = path.join(modDir, folder);
        if (!fs.statSync(dir).isDirectory()) continue;
        const revised = fs.readdirSync(dir).find(f => f.endsWith('-revisado.md'));
        if (!revised) continue;
        const raw = fs.readFileSync(path.join(dir, revised), 'utf8').replace(/\r\n/g, '\n');
        const m = raw.match(/^---\n([\s\S]*?)\n---/);
        if (!m) continue;
        const fm = yaml.parse(m[1]);
        const id = String(fm?.id ?? '').trim();
        const ui = fm?.auditoria_ui;
        if (!id || !ui) continue;
        out.push({
          id,
          status: String(ui.status ?? ''),
          tipoBloqueio: ui.tipo_bloqueio ? String(ui.tipo_bloqueio) : undefined,
          printsGeradas: Number(ui.prints_geradas ?? 0),
          folder: stripReviewPrefix(folder)
        });
      }
    } catch {
      // pasta ilegível não derruba a seleção
    }
  }
  return out;
}

/** IDs das rotinas de hardware/ambiente: manifesto da Fase 3 + relatórios da Fase 2 sem navegador. */
export function listHardwareRoutineIds(reports: DiskReportSummary[] = readDiskReports()): Set<string> {
  const ids = new Set<string>();
  for (const e of PHASE3_MANIFEST) if (e.hardwarePreTriage.isHardwareDependent) ids.add(e.id);
  for (const r of reports) {
    if (r.tipoBloqueio === ENVIRONMENT_BLOCK_TYPE && r.printsGeradas === 0) ids.add(r.id);
  }
  return ids;
}

export interface PendingSelection {
  /** Rotinas a reauditar: bloqueadas (`[ATT]`/`[DDD]`/`[XRX]`) ou com etapa externa (`[CCC]`), sem as de hardware */
  ids: string[];
  /** Rotinas de hardware/ambiente excluídas da seleção (só rodam via `--routines`) */
  excludedHardware: string[];
}

/**
 * Rotinas pendentes para o lote de reauditoria: a última auditoria em disco ficou bloqueada ou `[CCC]`.
 * Pura em relação aos `reports` recebidos (testes offline).
 */
export function selectPendingRoutineIds(reports: DiskReportSummary[] = readDiskReports()): PendingSelection {
  const hardware = listHardwareRoutineIds(reports);
  const pending = new Set<string>();
  const excluded = new Set<string>();
  for (const r of reports) {
    const isPending = isBlockingReviewStatus(r.status) || r.status === 'comunicacao_externa';
    if (!isPending) continue;
    if (hardware.has(r.id)) excluded.add(r.id);
    else pending.add(r.id);
  }
  return { ids: Array.from(pending).sort(), excludedHardware: Array.from(excluded).sort() };
}
