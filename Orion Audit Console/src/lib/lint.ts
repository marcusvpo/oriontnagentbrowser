export const TOKEN_LIMIT = 1800;

export interface LintIssue { level: "warning" | "error"; message: string }

const UI_TERM = /\b(Menu|Aba|Botão|Campo|Tela)\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*)*)/g;

/** Remove trechos já em **negrito** para não acusar termos marcados. */
const stripBold = (t: string) => t.replace(/\*\*[^*]+\*\*/g, (m) => " ".repeat(m.length));

export function lintText(text: string): LintIssue[] {
  const issues: LintIssue[] = [];
  for (const m of stripBold(text).matchAll(UI_TERM)) {
    issues.push({ level: "warning", message: `Termo de UI "${m[0]}" deveria estar em **negrito**.` });
  }
  if (/\bvideo_id\b/.test(text)) issues.push({ level: "error", message: "Campo proibido video_id — use apenas bunny_video_id." });
  return issues;
}

export const estimateTokens = (text: string) => Math.ceil(text.length / 4);
