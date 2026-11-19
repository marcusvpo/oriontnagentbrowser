import { Send, Sparkles } from "lucide-react";
import { Badge, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { fmtDate } from "@/lib/format";
import type { RoutineSummary } from "@/types/api";

interface Props {
  summary: Pick<
    RoutineSummary,
    | "reviewIngestionState"
    | "revisoesConsumidasCount"
    | "revisoesPendentesExportacao"
    | "ultimaIngestaoEm"
    | "ultimoLoteIngestaoId"
    | "ultimaIngestaoPor"
    | "temNovaRevisaoPosIngestao"
  >;
  compact?: boolean;
}

/**
 * Selo visual de ciclo de ingestão pelo agente (ADR-036):
 * - Violeta (`Ingerida pelo agente`) quando revisões já foram exportadas e consumidas pelo motor.
 * - Carmesim (`Revisão pendente p/ agente`) quando há observações novas aguardando exportação em lote.
 * - Quando já foi ingerida e recebeu nova revisão depois, exibe os dois sinais com clareza.
 */
export function IngestionBadge({ summary, compact = false }: Props) {
  const consumed = summary.revisoesConsumidasCount ?? 0;
  const pending = summary.revisoesPendentesExportacao ?? 0;
  const isIngested = consumed > 0 || summary.reviewIngestionState === "ingerida_pelo_agente";
  const hasPending = pending > 0 || summary.reviewIngestionState === "pendente_exportacao";

  if (!isIngested && !hasPending) return null;

  const ingestedTip = [
    `${consumed || 1} revisão(ões) já exportada(s) e ingerida(s) pelo agente.`,
    summary.ultimaIngestaoEm ? `Última ingestão: ${fmtDate(summary.ultimaIngestaoEm)}` : null,
    summary.ultimaIngestaoPor ? `por ${summary.ultimaIngestaoPor}` : null,
    summary.ultimoLoteIngestaoId ? `(lote ${summary.ultimoLoteIngestaoId})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const pendingTip = summary.temNovaRevisaoPosIngestao
    ? `Há ${pending} revisão(ões) nova(s) ou editada(s) após a última ingestão — aguardando novo lote de exportação.`
    : `${pending || 1} revisão(ões) aguardando exportação em lote para o agente.`;

  return (
    <span className="row audit-badges" data-testid="ingestion-badges">
      {isIngested && (
        <Tooltip content={ingestedTip}>
          <Badge
            status="neutral"
            className="ds-badge--ingested"
            hideDot
            tabIndex={0}
            data-testid="badge-ingested"
          >
            <Sparkles size={12} strokeWidth={1.6} aria-hidden />
            {compact ? "Ingerida" : "Ingerida pelo agente"}
          </Badge>
        </Tooltip>
      )}
      {hasPending && (
        <Tooltip content={pendingTip}>
          <Badge
            status="running"
            className="ds-badge--pending-export"
            hideDot
            tabIndex={0}
            data-testid="badge-pending-export"
          >
            <Send size={11} strokeWidth={1.6} aria-hidden />
            {compact
              ? `+${pending || 1} p/ agente`
              : summary.temNovaRevisaoPosIngestao
                ? `Nova revisão pós-ingestão (${pending})`
                : `Pendente exportar (${pending || 1})`}
          </Badge>
        </Tooltip>
      )}
    </span>
  );
}
