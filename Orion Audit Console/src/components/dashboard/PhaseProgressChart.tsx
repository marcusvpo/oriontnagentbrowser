import { useNavigate } from "@tanstack/react-router";
import { Card } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { PhaseStats } from "@/types/api";

export function PhaseProgressChart({ phases, total }: { phases: PhaseStats[]; total: number }) {
  const navigate = useNavigate();
  return (
    <Card kicker="Progresso por fase">
      <div className="legend" style={{ marginBottom: "var(--space-4)" }}>
        <span className="legend-item"><span className="legend-swatch seg-ok" />Validado</span>
        <span className="legend-item"><span className="legend-swatch seg-adj" />Auto-curada</span>
        <span className="legend-item"><span className="legend-swatch seg-att" />[ATT] Atualização</span>
        <span className="legend-item"><span className="legend-swatch seg-ddd" />[DDD] Dados</span>
        <span className="legend-item"><span className="legend-swatch seg-xrx" />[XRX] Cruzada</span>
        <span className="legend-item"><span className="legend-swatch stackbar" />Não auditada</span>
      </div>
      <div className="stack-1">
        {phases.map((p) => {
          const isF6 = p.fase === 6;
          const pct = (n: number) => `${(n / p.total) * 100}%`;
          const fase = p.fase === null ? "sem_fase" : String(p.fase);
          return (
            <button key={fase} className="phase-row" onClick={() => navigate({ to: "/rotinas", search: isF6 ? { gov: "aprovada" } : { fase } })}
              aria-label={`${p.fase ? `Fase ${p.fase}` : "Sem fase"}: ${p.auditadas} de ${p.total}. Filtrar Explorador`}>
              <span className="stack-1">
                <span className="t-label">{p.fase ? `Fase ${p.fase}` : "Sem fase"}</span>
                <span className="t-body-s dim">{p.titulo}</span>
              </span>
              <span className="stackbar">
                <span className="seg-ok" style={{ width: pct(p.porStatus.validado_inalterado) }} />
                <span className="seg-adj" style={{ width: pct(p.porStatus.validado_com_ajustes) }} />
                <span className="seg-att" style={{ width: pct(p.porStatus.atualizacao_editorial) }} />
                <span className="seg-ddd" style={{ width: pct(p.porStatus.dependencia_dados_banco) }} />
                <span className="seg-xrx" style={{ width: pct(p.porStatus.dependencia_cruzada_rotina) }} />
              </span>
              <span className="t-mono muted" style={{ textAlign: "right" }}>{p.auditadas}/{isF6 ? total : p.total}</span>
            </button>
          );
        })}
      </div>
      <p className="t-body-s dim" style={{ marginTop: "var(--space-3)" }}>Fase 6 = rotinas consolidadas e sincronizadas sobre o total de {total}.</p>
    </Card>
  );
}
