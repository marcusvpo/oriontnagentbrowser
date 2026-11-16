import { Fragment } from "react";
import { wordDiff } from "@/lib/diff";

/** Renderiza **negrito** como chip de elemento de UI. */
export function UiText({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <span key={i} className="ui-chip">{p.slice(2, -2)}</span> : <Fragment key={i}>{p}</Fragment>))}</>;
}

/** Diff por palavras: remoções riscadas, inserções em verde. */
export function DiffText({ from, to, side }: { from: string; to: string; side: "old" | "new" }) {
  const parts = wordDiff(from, to);
  return (
    <>
      {parts.map((p, i) => {
        if (side === "old" && p.added) return null;
        if (side === "new" && p.removed) return null;
        const cls = p.removed ? "diff-del" : p.added ? "diff-ins" : undefined;
        return <span key={i} className={cls}><UiText text={p.value} /></span>;
      })}
    </>
  );
}
