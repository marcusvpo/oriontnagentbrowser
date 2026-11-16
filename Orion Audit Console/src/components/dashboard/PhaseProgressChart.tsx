import { Link, useNavigate } from "@tanstack/react-router";
import { Badge, Card, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { REVIEW_TAG_META, REVIEW_TAG_ORDER } from "@/lib/status";
import type { PhaseStats, ReviewTagCode } from "@/types/api";

export function PhaseProgressChart({
  phases,
  total,
  tagCounts,
}: {
  phases: PhaseStats[];
  total: number;
  tagCounts?: Partial<Record<ReviewTagCode, number>>;
}) {
  const navigate = useNavigate();
  const hasTagCounts = tagCounts && REVIEW_TAG_ORDER.some((t) => (tagCounts[t] ?? 0) > 0);
  return (
    <Card kicker="Progresso por fase">
      <div className="legend" style={{ marginBottom: hasTagCounts ? "var(--space-3)" : "var(--space-4)" }}>
        <span className="legend-item"><span className="legend-swatch seg-ok" />Validado</span>
        <span className="legend-item"><span className="legend-swatch seg-adj" />Auto-curada</span>
        <span className="legend-item"><span className="legend-swatch seg-att" />[ATT] Atualização</span>
        <span className="legend-item"><span className="legend-swatch seg-ccc" />[CCC] Portal externo</span>
        <span className="legend-item"><span className="legend-swatch seg-ddd" />[DDD] Dados</span>
        <span className="legend-item"><span className="legend-swatch seg-xrx" />[XRX] Cruzada</span>
        <span className="legend-item"><span className="legend-swatch stackbar" />Não auditada</span>
      </div>
      {hasTagCounts && (
        <div className="row" style={{ marginBottom: "var(--space-4)" }} aria-label="Filtrar por tag de revisão">
          {REVIEW_TAG_ORDER.map((t) => {
            const meta = REVIEW_TAG_META[t];
            const Icon = meta.icon;
            const count = tagCounts?.[t] ?? 0;
            return (
              <Tooltip key={t} content={`${meta.label} (${count} rotinas, inclui multi-tag)`}>
                <Link to="/rotinas" search={{ tag: t }} className="tag-filter-link" aria-label={`Filtrar por tag ${t}: ${count} rotinas`}>
                  <Badge status={meta.tone} className={meta.extraClass} hideDot>
                    <Icon size={12} strokeWidth={1.5} aria-hidden />
                    {meta.shortLabel} {count}
                  </Badge>
                </Link>
              </Tooltip>
            );
          })}
        </div>
      )}
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
                <span className="seg-ccc" style={{ width: pct(p.porStatus.comunicacao_externa ?? 0) }} />
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
