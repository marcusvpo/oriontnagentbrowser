import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Flag, History, PencilLine, ShieldCheck } from "lucide-react";
import { Button, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { RoutineDetail } from "@/types/api";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import { GovernanceBadge } from "@/components/badges/GovernanceBadge";
import { IngestionBadge } from "@/components/badges/IngestionBadge";
import { fmtDate } from "@/lib/format";
import { MODULO_LABEL, SECAO_LABEL, reviewPrefix, tagsOfSummary } from "@/lib/status";

interface Props {
  rotina: RoutineDetail;
  prevId?: string;
  nextId?: string;
  editing: boolean;
  activeDrawer?: "review" | "reviews" | null;
  onApprove: () => void;
  onEdit: () => void;
  onReview: () => void;
  onOpenReviews: () => void;
}

export function StudioHeader({
  rotina,
  prevId,
  nextId,
  editing,
  activeDrawer,
  onApprove,
  onEdit,
  onReview,
  onOpenReviews,
}: Props) {
  const s = rotina.summary;
  const reviewTags = tagsOfSummary(s);
  return (
    <div className="studio-head">
      <div className="row-between">
        <div className="stack-1 grow">
          <div className="row">
            <span className="t-mono crimson">
              {reviewPrefix(s.statusAuditoria, reviewTags)}
              {s.id}
            </span>
            <span className="chip">{MODULO_LABEL[s.modulo] ?? s.modulo}</span>
            <span className="chip">{s.fase ? `Fase ${s.fase}` : "Sem fase"}</span>
            <Tooltip content={SECAO_LABEL[s.secao]}>
              <span className="chip" tabIndex={0}>
                Seção {s.secao}
              </span>
            </Tooltip>
            {rotina.auditoriaUi?.versao_homologacao && (
              <span className="t-overline-xs">{rotina.auditoriaUi.versao_homologacao}</span>
            )}
          </div>
          <h1 className="t-h2">{s.titulo}</h1>
        </div>
        <div className="row">
          {prevId ? (
            <Link to="/rotinas/$id" params={{ id: prevId }} aria-label="Rotina anterior">
              <Button size="sm" iconOnly aria-label="Rotina anterior" tabIndex={-1}>
                <ChevronLeft size={14} strokeWidth={1.5} />
              </Button>
            </Link>
          ) : (
            <Button size="sm" iconOnly disabled aria-label="Rotina anterior">
              <ChevronLeft size={14} strokeWidth={1.5} />
            </Button>
          )}
          {nextId ? (
            <Link to="/rotinas/$id" params={{ id: nextId }} aria-label="Próxima rotina">
              <Button size="sm" iconOnly aria-label="Próxima rotina" tabIndex={-1}>
                <ChevronRight size={14} strokeWidth={1.5} />
              </Button>
            </Link>
          ) : (
            <Button size="sm" iconOnly disabled aria-label="Próxima rotina">
              <ChevronRight size={14} strokeWidth={1.5} />
            </Button>
          )}
        </div>
      </div>

      <div className="row-between">
        <div className="row">
          <AuditStatusBadge status={s.statusAuditoria} divergencias={s.divergenciasCount} reviewTags={reviewTags} />
          <GovernanceBadge status={s.statusGovernanca} />
          <IngestionBadge summary={s} />
          <span className="t-body-s dim">Última execução do motor: {fmtDate(s.dataExecucao)}</span>
        </div>
      </div>

      <div className="studio-actions" role="region" aria-label="Ações de curadoria da rotina">
        <div className="studio-actions-secondary">
          <Button
            size="lg"
            className={activeDrawer === "reviews" ? "btn-reviews-highlight btn-drawer-active" : "btn-reviews-highlight"}
            aria-pressed={activeDrawer === "reviews"}
            onClick={onOpenReviews}
          >
            <History size={14} strokeWidth={1.75} />
            Revisões
            <span className="btn-reviews-highlight-count">{rotina.revisoes?.length ?? 0}</span>
          </Button>
          <Button
            size="lg"
            className={activeDrawer === "review" ? "btn-drawer-active" : undefined}
            aria-pressed={activeDrawer === "review"}
            onClick={onReview}
          >
            <Flag size={14} strokeWidth={1.5} />
            Registrar revisão
          </Button>
          <Button size="lg" onClick={onEdit} disabled={editing}>
            <PencilLine size={14} strokeWidth={1.5} />
            Editar texto
          </Button>
        </div>
        {!editing && (
          <Button
            size="lg"
            variant="primary"
            onClick={onApprove}
            disabled={s.statusGovernanca === "aprovada"}
          >
            <ShieldCheck size={14} strokeWidth={1.5} />
            {s.statusGovernanca === "aprovada" ? "Aprovada p/ Base KB" : "Aprovar p/ Base KB"}
          </Button>
        )}
      </div>
    </div>
  );
}
