import { Link } from "@tanstack/react-router";
import { Film, Flag } from "lucide-react";
import { Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { RoutineSummary } from "@/types/api";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import { GovernanceBadge } from "@/components/badges/GovernanceBadge";
import { IngestionBadge } from "@/components/badges/IngestionBadge";
import { ConfidenceBar } from "@/components/badges/ConfidenceBar";
import { fmtDate } from "@/lib/format";
import { MODULO_LABEL, SECAO_LABEL, hasIngestedReview, reviewPrefix, tagsOfSummary } from "@/lib/status";

interface Props {
  rows: RoutineSummary[];
}

function rowCurationAttr(r: RoutineSummary): "ingested" | "approved" | "pending-export" | undefined {
  if (hasIngestedReview(r)) return "ingested";
  if (r.statusGovernanca === "aprovada") return "approved";
  if ((r.revisoesPendentesExportacao ?? 0) > 0 || r.reviewIngestionState === "pendente_exportacao") {
    return "pending-export";
  }
  return undefined;
}

export function RoutinesTable({ rows }: Props) {
  return (
    <div className="routines-table-region" role="region" aria-label="Tabela de rotinas" tabIndex={0}>
      <div className="ds-table-wrap">
        <table className="ds-table routines-table">
          <thead>
            <tr>
              <th>Rotina / Título</th>
              <th>Módulo & Fase</th>
              <th>Auditoria & Calibragem</th>
              <th>Governança</th>
              <th>Evidências</th>
              <th>Atualizada</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const reviewTags = tagsOfSummary(r);
              const curationAttr = rowCurationAttr(r);
              const revCount = r.revisoesCount ?? 0;

              return (
                <tr key={r.id} data-curation={curationAttr}>
                  <td>
                    <div className="stack-2 routine-title">
                      <Link to="/rotinas/$id" params={{ id: r.id }} className="link-plain t-mono nowrap">
                        {reviewTags.length > 0 && (
                          <span className="err">{reviewPrefix(r.statusAuditoria, reviewTags)}</span>
                        )}
                        {r.id}
                      </Link>
                      <Link to="/rotinas/$id" params={{ id: r.id }} className="link-plain routine-title-link">
                        {r.titulo}
                      </Link>
                      {(r.temVideo || revCount > 0) && (
                        <div className="row">
                          {r.temVideo && (
                            <span className="chip">
                              <Film size={12} strokeWidth={1.5} aria-hidden />
                              vídeo
                            </span>
                          )}
                          {revCount > 0 && (
                            <span className="chip">
                              <Flag size={11} strokeWidth={1.5} aria-hidden />
                              {revCount} revisão(ões)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="stack-2">
                      <span className="t-label">{MODULO_LABEL[r.modulo] ?? r.modulo}</span>
                      <div className="row">
                        <span className="t-body-s nowrap">{r.fase ? `Fase ${r.fase}` : "Sem fase"}</span>
                        <Tooltip content={SECAO_LABEL[r.secao]}>
                          <span className="chip" tabIndex={0}>
                            Seção {r.secao}
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="stack-2 routine-routes">
                      <AuditStatusBadge
                        status={r.statusAuditoria}
                        divergencias={r.divergenciasCount}
                        reviewTags={reviewTags}
                      />
                      <IngestionBadge summary={r} />
                    </div>
                  </td>

                  <td>
                    <div className="stack-2 routine-routes">
                      <GovernanceBadge status={r.statusGovernanca} />
                      {r.divergenciasCount > 0 && (
                        <div className="stack-1">
                          <span className="t-overline-xs">{r.divergenciasCount} ajuste(s) auto</span>
                          {r.menorConfianca !== undefined && (
                            <ConfidenceBar value={r.menorConfianca} showWarning={false} />
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="stack-1 nowrap">
                      <span className="t-mono">{r.totalPassos} passos</span>
                      <span className="t-body-s dim">{r.printsGeradas} prints</span>
                    </div>
                  </td>

                  <td>
                    <div className="stack-1">
                      <span className="t-mono nowrap">{fmtDate(r.dataExecucao)}</span>
                      {r.ultimoLoteIngestaoId && (
                        <span className="t-overline-xs ingested" title="Último lote ingerido pelo agente">
                          {r.ultimoLoteIngestaoId}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
