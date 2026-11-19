import { Link } from "@tanstack/react-router";
import { Card } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { fmtPct } from "@/lib/format";
import { CURATION_STAGES, CURATION_STAGE_ORDER } from "@/lib/status";
import type { CurationStage, CurationStats } from "@/types/api";

interface Props {
  curadoria: CurationStats;
  totalRotinas: number;
}

function stageCount(c: CurationStats, stage: CurationStage): number {
  switch (stage) {
    case "aprovadas_kb":
      return c.aprovadasKb;
    case "ingeridas_agente":
      return c.ingeridasAgente;
    case "revisao_pendente":
      return c.revisaoPendenteExportacao;
    case "apoio_humano":
      return c.precisamApoioHumano;
    case "prontas_conferencia":
      return c.prontasConferencia;
    case "nao_auditadas":
      return c.naoAuditadas;
  }
}

/**
 * Funil visual proporcional das 471 rotinas pelos estágios humanos de curadoria (ADR-036).
 * Cada bloco é clicável e leva direto ao Explorador filtrado exatamente naquele estágio.
 */
export function CurationPipelineCard({ curadoria, totalRotinas }: Props) {
  const safeTotal = Math.max(1, totalRotinas);

  return (
    <Card kicker="Mapa humano das 471 rotinas · Clique em qualquer estágio para filtrar" data-testid="curation-pipeline">
      <div className="stack-4">
        <div className="curation-bar" aria-label="Distribuição das rotinas por estágio de curadoria">
          {CURATION_STAGE_ORDER.map((stage) => {
            const count = stageCount(curadoria, stage);
            if (count <= 0) return null;
            const meta = CURATION_STAGES[stage];
            return (
              <span
                key={stage}
                className={meta.segmentClass}
                style={{ width: `${(count / safeTotal) * 100}%` }}
                title={`${meta.label}: ${count} (${fmtPct(count / safeTotal)})`}
              />
            );
          })}
        </div>

        <div className="curation-stages-grid">
          {CURATION_STAGE_ORDER.map((stage) => {
            const meta = CURATION_STAGES[stage];
            const Icon = meta.icon;
            const count = stageCount(curadoria, stage);
            const search =
              stage === "ingeridas_agente"
                ? { ingestao: "ingerida_pelo_agente" }
                : { estagio: stage };

            return (
              <Link
                key={stage}
                to="/rotinas"
                search={search}
                className={`curation-stage-card ${meta.toneClass}`}
                data-stage={stage}
              >
                <div className="row-between">
                  <span className="t-overline-xs icon-inline">
                    <Icon size={13} strokeWidth={1.6} aria-hidden />
                    {meta.shortLabel}
                  </span>
                  <span className="t-overline-xs dim">{fmtPct(count / safeTotal)}</span>
                </div>
                <span className="t-mono-metric">{count}</span>
                <span className="t-body-s dim">{meta.description}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
