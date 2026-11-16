import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button, CodeBlock } from "@/design-system/orion-audit-console---design-system-bdbb01";

export function CopyCode({ title, code }: { title: string; code: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="stack-2">
      <div className="row-between">
        <span className="t-overline-xs">{title}</span>
        <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(code); setOk(true); setTimeout(() => setOk(false), 1500); }}>
          {ok ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}{ok ? "Copiado" : "Copiar"}
        </Button>
      </div>
      <CodeBlock code={code} />
    </div>
  );
}
