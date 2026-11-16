import { X } from "lucide-react";
import { Button } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AUDIT_STATUS, GOV_STATUS } from "@/lib/status";
import type { RotinasSearch } from "@/lib/search";

const LABELS: Record<string, string> = { fase: "Fase", modulo: "Módulo", secao: "Seção", status: "Status", gov: "Governança", carga: "Carga", tag: "Tag", video: "Vídeo", div: "Divergências", q: "Busca" };

function valueLabel(k: string, v: string) {
  if (k === "status") return v.split(",").map((s) => AUDIT_STATUS[s as keyof typeof AUDIT_STATUS]?.label ?? s).join(", ");
  if (k === "gov") return v.split(",").map((s) => GOV_STATUS[s as keyof typeof GOV_STATUS]?.label ?? s).join(", ");
  if (k === "fase") return v === "sem_fase" ? "Sem fase" : v;
  if (k === "video" || k === "div") return v === "true" ? "Sim" : "Não";
  return v.replace(/,/g, ", ");
}

export function ActiveFilterChips({ search, onChange, onClear }: { search: RotinasSearch; onChange: (p: Partial<RotinasSearch>) => void; onClear: () => void }) {
  const active = Object.entries(search).filter(([k, v]) => k in LABELS && v !== undefined) as Array<[string, string]>;
  if (!active.length) return null;
  return (
    <div className="row" aria-label="Filtros ativos">
      {active.map(([k, v]) => (
        <button key={k} className="chip" onClick={() => onChange({ [k]: undefined })} aria-label={`Remover filtro ${LABELS[k]}`}>
          {LABELS[k]}: {valueLabel(k, v)} <X size={12} strokeWidth={1.5} aria-hidden />
        </button>
      ))}
      <Button variant="ghost" size="sm" onClick={onClear}>Limpar tudo</Button>
    </div>
  );
}
