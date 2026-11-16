import fs from 'node:fs';
import path from 'node:path';

const auditoriaRoot = path.resolve(process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria'));
const rotinasDir = path.join(auditoriaRoot, 'rotinas');

function auditPhase2Integrity() {
  let totalDirs = 0;
  let totalPngs = 0;
  let totalWebps = 0;
  let totalMds = 0;
  let invalidFiles = 0;

  for (const mod of ['acesso', 'config']) {
    const modDir = path.join(rotinasDir, mod);
    if (!fs.existsSync(modDir)) continue;
    const dirs = fs.readdirSync(modDir);
    for (const d of dirs) {
      const fullDir = path.join(modDir, d);
      if (!fs.statSync(fullDir).isDirectory()) continue;
      totalDirs++;
      const files = fs.readdirSync(fullDir);
      for (const f of files) {
        if (f.endsWith('.png')) totalPngs++;
        else if (f.endsWith('.webp')) totalWebps++;
        else if (f.endsWith('-revisado.md')) totalMds++;
        else {
          console.warn(`[ALERTA] Arquivo indevido em ${d}: ${f}`);
          invalidFiles++;
        }
      }
    }
  }

  console.log('=== INTEGRIDADE DA FASE 2 ===');
  console.log(`Pastas de rotinas: ${totalDirs} (Esperado: 50)`);
  console.log(`Arquivos revisados .md: ${totalMds}`);
  console.log(`Screenshots PNG anotados: ${totalPngs}`);
  console.log(`Screenshots WebP anotados: ${totalWebps}`);
  console.log(`Arquivos indevidos: ${invalidFiles} (Esperado: 0)`);
}

auditPhase2Integrity();
