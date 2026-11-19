import { Link } from "@tanstack/react-router";
import { Download, Flag, Sparkles } from "lucide-react";
import { Badge, Button, Card, Divider } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { fmtDate } from "@/lib/format";
import type { CurationStats } from "@/types/api";

interface Props {
  curadoria: CurationStats;
  onOpenExport: () => void;
}

/**
 * Painel de calibragem e geração de contexto para o motor local (ADR-036).
 * Substitui os cards técnicos de carga/fila do runner por uma visão humana do ciclo de revisões.
 */
export function AgentKnowledgeCard({ curadoria, onOpenExport }: Props) {
  const hasPending = curadoria.totalRevisoesPendentes > 0;
  const last = curadoria.ultimoLote;

  return (
    <Card kicker="Calibragem do motor (manual)" data-testid="agent-knowledge-card">
      <div className="stack-4">
        <div className="stack-3">
          <div className="row-between">
            <span className="t-body-s">Revisões pendentes p/ exportar</span>
            <Badge status={hasPending ? "running" : "neutral"} className={hasPending ? "ds-badge--pending-export" : undefined} hideDot>
              {curadoria.totalRevisoesPendentes} revisão(ões)
            </Badge>
          </div>
          <div className="row-between">
            <span className="t-body-s">Rotinas aguardando exportação</span>
            <span className="t-mono">{curadoria.revisaoPendenteExportacao}</span>
          </div>
          <div className="row-between">
            <span className="t-body-s">Rotinas já ingeridas pelo agente</span>
            <Badge status="neutral" className="ds-badge--ingested" hideDot>
              <Sparkles size={11} strokeWidth={1.6} aria-hidden />
              {curadoria.rotinasComIngestao}
            </Badge>
          </div>
          <div className="row-between">
            <span className="t-body-s">Total de revisões consumidas</span>
            <span className="t-mono ingested">{curadoria.totalRevisoesConsumidas}</span>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        {last ? (
          <div className="stack-1">
            <span className="t-overline-xs">Último lote exportado</span>
            <span className="t-mono">{last.id}</span>
            <span className="t-body-s dim">
              {last.totalRevisoes} revisão(ões) em {last.totalRotinas} rotina(s) · {last.operador} em {fmtDate(last.criadoEm)}
            </span>
          </div>
        ) : (
          <span className="t-body-s dim">
            Nenhum lote exportado ainda. Quando houver revisões humanas, baixe o pacote em Markdown e anexe no Antigravity.
          </span>
        )}

        <div className="stack-2">
          <Button
            variant={hasPending ? "primary" : "secondary"}
            size="lg"
            onClick={onOpenExport}
            disabled={!hasPending && curadoria.totalRevisoesConsumidas === 0}
            style={{ width: "100%" }}
          >
            <Download size={14} strokeWidth={1.6} />
            {hasPending
              ? `Exportar ${curadoria.totalRevisoesPendentes} revisão(ões) p/ agente`
              : "Exportar revisões"}
          </Button>
          <Link to="/revisoes" className="t-link t-body-s icon-inline" style={{ justifyContent: "center" }}>
            <Flag size={13} strokeWidth={1.5} /> Abrir Central de Revisões & Lotes
          </Link>
        </div>
      </div>
    </Card>
  );
}
