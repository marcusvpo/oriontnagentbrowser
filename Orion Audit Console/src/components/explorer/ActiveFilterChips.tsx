import { X } from "lucide-react";
import { Button } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AUDIT_STATUS, CURATION_STAGES, GOV_STATUS, INGESTION_META, MODULO_LABEL } from "@/lib/status";
import type { RotinasSearch } from "@/lib/search";

const LABELS: Record<string, string> = {
  estagio: "Estágio",
  ingestao: "Calibragem",
  fase: "Fase",
  modulo: "Módulo",
  secao: "Seção",
  status: "Status",
  gov: "Governança",
  tag: "Tag",
  video: "Vídeo",
  div: "Ajustes auto",
  q: "Busca",
};

function valueLabel(k: string, v: string) {
  if (k === "estagio") return CURATION_STAGES[v as keyof typeof CURATION_STAGES]?.label ?? v;
  if (k === "ingestao") {
    return v
      .split(",")
      .map((s) => INGESTION_META[s as keyof typeof INGESTION_META]?.label ?? s)
      .join(", ");
  }
  if (k === "status") {
    return v
      .split(",")
      .map((s) => AUDIT_STATUS[s as keyof typeof AUDIT_STATUS]?.label ?? s)
      .join(", ");
  }
  if (k === "gov") {
    return v
      .split(",")
      .map((s) => GOV_STATUS[s as keyof typeof GOV_STATUS]?.label ?? s)
      .join(", ");
  }
  if (k === "modulo") {
    return v
      .split(",")
      .map((m) => MODULO_LABEL[m] ?? m)
      .join(", ");
  }
  if (k === "tag") {
    return v
      .split(",")
      .map((t) => `[${t}]`)
      .join(", ");
  }
  if (k === "fase") return v === "sem_fase" ? "Sem fase" : `Fase ${v}`;
  if (k === "video" || k === "div") return v === "true" ? "Sim" : "Não";
  return v.replace(/,/g, ", ");
}

export function ActiveFilterChips({
  search,
  onChange,
  onClear,
}: {
  search: RotinasSearch;
  onChange: (p: Partial<RotinasSearch>) => void;
  onClear: () => void;
}) {
  const active = Object.entries(search).filter(
    ([k, v]) => k in LABELS && v !== undefined,
  ) as Array<[string, string]>;
  if (!active.length) return null;
  return (
    <div className="row" aria-label="Filtros ativos">
      {active.map(([k, v]) => (
        <button
          key={k}
          className="chip"
          onClick={() => onChange({ [k]: undefined })}
          aria-label={`Remover filtro ${LABELS[k]}`}
        >
          {LABELS[k]}: {valueLabel(k, v)} <X size={12} strokeWidth={1.5} aria-hidden />
        </button>
      ))}
      <Button variant="ghost" size="sm" onClick={onClear}>
        Limpar tudo
      </Button>
    </div>
  );
}
