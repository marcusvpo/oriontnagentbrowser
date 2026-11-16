import { CheckCircle2, XCircle } from "lucide-react";
import { Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { GeometryInvariantResult } from "@/types/api";

export function InvariantsChecklist({ items }: { items: GeometryInvariantResult[] }) {
  return (
    <div className="inv-list" aria-label="Invariantes geométricos">
      {items.map((i) => (
        <Tooltip key={i.id} content={`${i.nome}: ${i.detalhe ?? ""}`}>
          <span className={`inv-dot ${i.aprovado ? "" : "err"}`} tabIndex={0}>
            {i.aprovado ? <CheckCircle2 size={12} strokeWidth={1.5} className="ok" aria-label="aprovado" /> : <XCircle size={12} strokeWidth={1.5} aria-label="reprovado" />}
            {i.id}
          </span>
        </Tooltip>
      ))}
    </div>
  );
}
