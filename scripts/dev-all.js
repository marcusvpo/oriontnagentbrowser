import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('====================================================');
console.log('  ORION AUDIT CONSOLE — AMBIENTE FULL-STACK CONECTADO');
console.log('====================================================');
console.log('1. Backend API: http://localhost:3333');
console.log('2. Frontend Web: http://localhost:8080');
console.log('====================================================\n');

const server = spawn(npmCmd, ['run', 'server'], {
  cwd: path.join(rootDir, 'auditoria'),
  stdio: 'inherit',
  shell: true,
});

const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'Orion Audit Console'),
  stdio: 'inherit',
  shell: true,
});

function cleanup() {
  console.log('\nEncerrando servidores...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
