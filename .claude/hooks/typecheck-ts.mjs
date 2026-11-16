#!/usr/bin/env node
/**
 * Hook PostToolUse (Edit|Write|MultiEdit): após editar um .ts em auditoria/src/, roda `tsc --noEmit`.
 * Falha de tipagem -> exit 2 com os erros em stderr, que o Claude Code devolve ao modelo imediatamente.
 * Arquivos fora de auditoria/src/ ou que não sejam .ts são ignorados (exit 0, sem custo).
 * Sem git (ADR-010): nada aqui depende de controle de versão.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raw = readFileSync(0, 'utf8');
let input;
try {
  input = JSON.parse(raw);
} catch {
  process.exit(0);
}

const filePath = String(input?.tool_input?.file_path ?? '');
if (!/[\\/]auditoria[\\/]src[\\/].+\.ts$/i.test(filePath)) process.exit(0);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const auditoriaDir = path.join(root, 'auditoria');
const tscBin = path.join(auditoriaDir, 'node_modules', 'typescript', 'bin', 'tsc');
if (!existsSync(tscBin)) {
  console.error(`[typecheck-ts] tsc não encontrado em ${tscBin}; rode "npm --prefix auditoria install".`);
  process.exit(0);
}

const run = spawnSync(process.execPath, [tscBin, '--noEmit', '-p', 'tsconfig.json'], {
  cwd: auditoriaDir,
  encoding: 'utf8',
  timeout: 110_000
});

if (run.status === 0) process.exit(0);

const out = `${run.stdout || ''}${run.stderr || ''}`.trim().split('\n').slice(0, 40).join('\n');
console.error(`[typecheck-ts] tsc --noEmit falhou após editar ${path.basename(filePath)}:\n${out}`);
process.exit(2);
