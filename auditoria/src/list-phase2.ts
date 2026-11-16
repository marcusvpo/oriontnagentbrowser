import fs from 'node:fs';
import path from 'node:path';
import { parseRoutineMarkdown } from './parser.js';

const kbDir = path.resolve(process.cwd().endsWith('auditoria') ? path.join(process.cwd(), '..', 'kb', 'rotinas') : path.join(process.cwd(), 'kb', 'rotinas'));

const humanReviewIds = new Set([
  'C-ACESSO-05',
  'C-CONFIG-01', 'C-CONFIG-02', 'C-CONFIG-03', 'C-CONFIG-04',
  'C-CONFIG-05', 'C-CONFIG-06', 'C-CONFIG-07', 'C-CONFIG-08',
  'V-2.3.2'
]);

function getPhase2Routines() {
  const result: any[] = [];
  for (const mod of ['acesso', 'config']) {
    const modDir = path.join(kbDir, mod);
    const files = fs.readdirSync(modDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    for (const f of files) {
      const fullPath = path.join(modDir, f);
      const parsed = parseRoutineMarkdown(fullPath);
      if (humanReviewIds.has(parsed.id) || parsed.id === 'C-ACESSO-01') continue;
      const slug = f.replace(/\.md$/, '');
      result.push({
        id: parsed.id,
        titulo: parsed.titulo,
        modulo: mod,
        filename: f,
        slug,
        fullPath,
        stepsCount: parsed.steps.length
      });
    }
  }
  return result;
}

const list = getPhase2Routines();
console.log(`Total rotinas funcionais para executar: ${list.length}`);
console.log(JSON.stringify(list, null, 2));
