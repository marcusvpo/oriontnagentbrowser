/**
 * Reauditoria ao vivo da Fila A da auditoria de caminhos de menu (ADR-037, Fase 4).
 *
 * Lê `auditoria/cache/menu-reaudit-queue.json` (gerado por `audit-menu-coherence.ts`), seleciona as rotinas da
 * **Fila A** (bloqueio `[ATT]`/`[XRX]` destravável por caminho canônico) e dispara o executor do KB:
 *
 *   tsx src/cli.ts --routines <ids> --concurrency 4 --dry-run-mutations --headless   (cwd: auditoria/)
 *
 * Padrão: só as de confiança `alta`. Flags:
 *   --all        toda a Fila A (inclui as de confiança `revisar`)
 *   --list-only  só imprime a seleção e o comando (não abre navegador, não toca a rede)
 *
 *   npm --prefix auditoria run reaudit:menu-queue -- --list-only
 *
 * A fila é só triagem offline: a cadeia do catálogo continua candidata até ser lida na árvore real, percorrida e
 * medida ao vivo (Trava de Evidência, ADR-017/029/037). Este script não grava nada além do que o `cli.ts` grava.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const auditoriaRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const MENU_REAUDIT_QUEUE_FILE = path.join(auditoriaRoot, 'cache', 'menu-reaudit-queue.json');

interface QueueItemLite {
  id: string;
  load?: string;
  confidence?: 'alta' | 'revisar';
}

/** Seleção da Fila A: confiança `alta` por padrão; `all` devolve a fila inteira. Ordem e ids únicos preservados. */
export function selectFilaA(queue: { filaA?: QueueItemLite[] }, opts: { all?: boolean } = {}): QueueItemLite[] {
  const fila = Array.isArray(queue?.filaA) ? queue.filaA : [];
  const picked = opts.all ? fila : fila.filter(i => i.confidence === 'alta');
  const seen = new Set<string>();
  return picked.filter(i => i?.id && !seen.has(i.id) && (seen.add(i.id), true));
}

/** Argumentos do `cli.ts` para a reauditoria (sem gravações reais: `--dry-run-mutations`). */
export function buildReauditArgs(ids: string[]): string[] {
  return ['src/cli.ts', '--routines', ids.join(','), '--concurrency', '4', '--dry-run-mutations', '--headless'];
}

function main(): void {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const listOnly = args.includes('--list-only');
  if (!fs.existsSync(MENU_REAUDIT_QUEUE_FILE)) {
    console.error(
      `✗ [Fila de Menus] ${path.relative(process.cwd(), MENU_REAUDIT_QUEUE_FILE)} ausente: rode antes ` +
        '`npm --prefix auditoria run menu:audit-coherence`.'
    );
    process.exit(1);
  }
  const queue = JSON.parse(fs.readFileSync(MENU_REAUDIT_QUEUE_FILE, 'utf-8'));
  const selected = selectFilaA(queue, { all });
  const scope = all ? 'Fila A completa' : 'Fila A (confiança alta)';
  if (selected.length === 0) {
    console.log(`· [Fila de Menus] ${scope}: nenhuma rotina selecionada.`);
    return;
  }
  console.log(`· [Fila de Menus] ${scope}: ${selected.length} rotina(s) (catálogo ${queue.catalogVersion ?? '?'}, fila de ${queue.generatedAt ?? '?'})`);
  for (const i of selected) console.log(`   - ${i.id} (${i.load ?? '?'}, confiança ${i.confidence ?? '—'})`);
  const cliArgs = buildReauditArgs(selected.map(i => i.id));
  console.log(`· Comando: tsx ${cliArgs.join(' ')}  (cwd: auditoria)`);
  if (listOnly) return;

  const tsxCli = path.join(auditoriaRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
  const child = spawn(process.execPath, [tsxCli, ...cliArgs], { cwd: auditoriaRoot, shell: false, stdio: 'inherit' });
  child.on('error', err => {
    console.error(`✗ [Fila de Menus] falha ao iniciar o cli.ts: ${err.message}`);
    process.exit(1);
  });
  child.on('close', code => process.exit(code ?? 1));
}

if (process.argv[1] && /reaudit-menu-queue\.[tj]s$/.test(process.argv[1].replace(/\\/g, '/'))) {
  main();
}
