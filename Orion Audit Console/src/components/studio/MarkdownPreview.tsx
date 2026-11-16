import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { StepView } from "@/types/api";

const MARK = /\[aqui vai a print "passo-(\d+)\.png"\]/g;

/** Markdown revisado sem HTML cru; marcadores de print viram miniaturas clicáveis. */
export function MarkdownPreview({ markdown, steps, onSelect }: { markdown: string; steps: StepView[]; onSelect: (n: number) => void }) {
  const md = markdown.replace(MARK, (_m, n) => `[passo-${n}](#print-${Number(n)})`);
  return (
    <div className="md-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        a: ({ href, children }) => {
          const m = href?.match(/^#print-(\d+)$/);
          if (!m) return <a href={href} className="t-link" target="_blank" rel="noreferrer">{children}</a>;
          const n = Number(m[1]);
          const s = steps.find((x) => x.stepNumber === n);
          return (
            <button type="button" className="md-thumb" onClick={() => onSelect(n)} aria-label={`Abrir print do passo ${n}`}>
              {s?.media ? <img src={s.media.webpUrl ?? s.media.pngUrl} alt={`Print do passo ${n}`} /> : <span className="t-mono">passo-{n}</span>}
            </button>
          );
        },
      }}>{md}</ReactMarkdown>
    </div>
  );
}
