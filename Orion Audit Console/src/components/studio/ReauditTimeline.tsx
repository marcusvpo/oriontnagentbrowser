import { ArrowRight, RotateCcw } from "lucide-react";
import { reauditTimeline } from "@/lib/attDiagnosis";
import type { AuditoriaUiFrontmatter } from "@/types/api";

/** Antes × Depois de cada reauditoria contextual (`historico_reauditoria`, ADR-025/029). */
export function ReauditTimeline({ historico }: { historico: AuditoriaUiFrontmatter["historico_reauditoria"] | undefined }) {
  const rows = reauditTimeline(historico);
  if (rows.length === 0) return null;
  return (
    <section className="stack-2" aria-label="Reauditorias (Antes × Depois)" data-testid="reaudit-timeline">
      <span className="t-overline-xs"><RotateCcw size={12} strokeWidth={1.5} aria-hidden /> Reauditorias · Antes × Depois</span>
      <ul className="timeline">
        {rows.map((r, i) => (
          <li key={`${r.data}-${i}`}>
            <span className="timeline-icon" data-superado={r.superado === true ? "true" : undefined}><RotateCcw size={16} strokeWidth={1.5} aria-hidden /></span>
            <div className="stack-1">
              <span className="t-label">
                {r.antes} <ArrowRight size={12} strokeWidth={1.5} aria-hidden /> {r.depois}
                {r.superado === true ? " · bloqueio superado" : r.superado === false ? " · bloqueio mantido" : ""}
              </span>
              <span className="t-body-s">
                {r.resumo}
                {r.passoAntes || r.passoDepois ? ` · passo ${r.passoAntes ?? "—"} → ${r.passoDepois ?? "—"}` : ""}
                {r.curasReconfirmadas > 0 ? ` · ${r.curasReconfirmadas} cura(s) reconfirmada(s) ao vivo` : ""}
              </span>
              <span className="t-overline-xs">{r.data} · {r.ambiente}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
