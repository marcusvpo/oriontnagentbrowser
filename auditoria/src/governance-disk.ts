import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';
import { stripReviewPrefix } from './review-taxonomy.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');
const rotinasDir = path.join(auditoriaRoot, 'rotinas');

export interface GovernanceDiskUpdate {
  statusGovernanca?: 'pendente_aprovacao' | 'aprovada' | 'revisao_solicitada';
  revisor?: string;
  comentario?: string;
  descricao?: string;
  edicoes?: Array<{ stepNumber: number; validatedText: string }>;
  updatedAt?: string;
}

export function findRevisedMarkdownById(routineId: string): string | null {
  if (!fs.existsSync(rotinasDir)) return null;
  let bestPath: string | null = null;
  let bestMtime = -1;

  for (const mod of fs.readdirSync(rotinasDir)) {
    const modDir = path.join(rotinasDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    for (const folder of fs.readdirSync(modDir)) {
      const bare = stripReviewPrefix(folder);
      if (!bare.startsWith(`${routineId}-`) && bare !== routineId) continue;
      const folderPath = path.join(modDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;
      const revFile = fs.readdirSync(folderPath).find(f => f.endsWith('-revisado.md'));
      if (!revFile) continue;

      const revPath = path.join(folderPath, revFile);
      try {
        const content = fs.readFileSync(revPath, 'utf8');
        const idMatch = content.match(/^id:\s*([^\r\n]+)/m);
        if (idMatch && idMatch[1].trim() === routineId) {
          const mtime = fs.statSync(revPath).mtimeMs;
          if (mtime > bestMtime) {
            bestMtime = mtime;
            bestPath = revPath;
          }
        }
      } catch {}
    }
  }
  return bestPath;
}

export function applyGovernanceUpdatesToMarkdown(
  rawContent: string,
  update: GovernanceDiskUpdate
): string {
  const normalized = rawContent.replace(/\r\n/g, '\n');
  const parts = normalized.split(/^---$/m);
  if (parts.length < 3) {
    throw new Error('Arquivo revisado não possui frontmatter YAML válido');
  }

  const fm = yaml.parse(parts[1].trim()) || {};
  fm.auditoria_ui = fm.auditoria_ui || {};
  if (update.statusGovernanca) {
    fm.auditoria_ui.status_governanca = update.statusGovernanca;
  }
  if (update.revisor?.trim()) {
    fm.auditoria_ui.governanca_revisor = update.revisor.trim();
  }
  fm.auditoria_ui.governanca_atualizado_em = update.updatedAt || new Date().toISOString();
  if (update.comentario !== undefined) {
    if (update.comentario.trim()) {
      fm.auditoria_ui.governanca_comentario = update.comentario.trim();
    } else {
      delete fm.auditoria_ui.governanca_comentario;
    }
  }

  let body = parts.slice(2).join('---').replace(/^\n+/, '');

  if (update.descricao !== undefined) {
    const newDesc = update.descricao.trim();
    body = body.replace(
      /(#### Descrição:\s*\n)([\s\S]*?)(?=\n#### |\n\*\s+\*\*|\n---\s*\n|$)/,
      (_all, head: string, content: string) => {
        const noteIdx = content.search(/\n\n> \[!(?:NOTE|TIP|WARNING|CAUTION)\]/);
        if (noteIdx !== -1) {
          const notes = content.slice(noteIdx);
          return `${head}${newDesc}${notes}`;
        }
        const trailingNewlines = content.match(/\n*$/)?.[0] || '\n';
        return `${head}${newDesc}${trailingNewlines}`;
      }
    );
  }

  if (Array.isArray(update.edicoes) && update.edicoes.length > 0) {
    body = body.replace(
      /(#### Passo a passo[^\n]*:\s*\n)([\s\S]*?)(?=\n#### |\n---\s*\n|$)/,
      (_all, head: string, sectionBody: string) => {
        let updatedSection = sectionBody;
        for (const ed of update.edicoes!) {
          const cleanText = String(ed.validatedText || '').replace(/\r?\n/g, ' ').trim();
          const stepRe = new RegExp(`(^\\s*${ed.stepNumber}\\.\\s*)(.+)$`, 'm');
          updatedSection = updatedSection.replace(stepRe, `$1${cleanText}`);
        }
        return `${head}${updatedSection}`;
      }
    );
  }

  const newYaml = yaml.stringify(fm, { lineWidth: 0 }).trim();
  return `---\n${newYaml}\n---\n\n${body}`;
}

export async function persistRoutineGovernanceToDisk(
  routineId: string,
  update: GovernanceDiskUpdate
): Promise<{ updated: boolean; filePath?: string; reason?: string }> {
  const revPath = findRevisedMarkdownById(routineId);
  if (!revPath) {
    return { updated: false, reason: 'no_revised_file' };
  }
  const raw = await fs.promises.readFile(revPath, 'utf8');
  const next = applyGovernanceUpdatesToMarkdown(raw, update);
  await fs.promises.writeFile(revPath, next, 'utf8');
  return { updated: true, filePath: revPath };
}
