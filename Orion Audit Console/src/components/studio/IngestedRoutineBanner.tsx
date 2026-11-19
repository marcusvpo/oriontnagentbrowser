import { History, Send, Sparkles } from "lucide-react";
import { Badge, Button } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { fmtDate } from "@/lib/format";
import type { RoutineSummary } from "@/types/api";

interface Props {
  summary: RoutineSummary;
  onOpenReviews: () => void;
}

/** Faixa de destaque violeta no Estúdio quando a rotina já teve revisões consumidas pelo motor. */
export function IngestedRoutineBanner({ summary, onOpenReviews }: Props) {
  const consumed = summary.revisoesConsumidasCount ?? 0;
  if (consumed <= 0 && summary.reviewIngestionState !== "ingerida_pelo_agente") return null;

  return (
    <div className="ingested-banner" role="status" data-testid="ingested-routine-banner">
      <div className="row" style={{ alignItems: "flex-start", gap: "var(--space-3)", flex: 1, minWidth: 240 }}>
        <span className="ingested-banner__icon" aria-hidden>
          <Sparkles size={16} strokeWidth={1.7} />
        </span>
        <div className="stack-1 grow">
          <div className="row">
            <strong className="t-label" style={{ color: "var(--color-ingested-bright)" }}>
              Revisão já ingerida pelo agente
            </strong>
            {summary.ultimoLoteIngestaoId && (
              <span className="chip t-mono">{summary.ultimoLoteIngestaoId}</span>
            )}
            {summary.temNovaRevisaoPosIngestao && (
              <Badge status="running" className="ds-badge--pending-export" hideDot>
                <Send size={11} strokeWidth={1.6} aria-hidden />
                +{summary.revisoesPendentesExportacao} nova(s) pós-ingestão
              </Badge>
            )}
          </div>
          <p className="t-body-s" style={{ margin: 0 }}>
            {consumed} revisão(ões) desta rotina já foram exportadas para calibragem do motor
            {summary.ultimaIngestaoEm ? ` em ${fmtDate(summary.ultimaIngestaoEm)}` : ""}
            {summary.ultimaIngestaoPor ? ` por ${summary.ultimaIngestaoPor}` : ""}.
            {summary.temNovaRevisaoPosIngestao
              ? " Há novas observações registradas depois desse lote aguardando a próxima exportação."
              : " Aguarde a próxima rodada local do motor ou consulte o histórico antes de editar novamente."}
          </p>
        </div>
      </div>
      <Button size="sm" onClick={onOpenReviews}>
        <History size={13} strokeWidth={1.5} /> Ver revisões
      </Button>
    </div>
  );
}
