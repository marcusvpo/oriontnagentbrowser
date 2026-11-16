import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Flag, History, PencilLine, RotateCw, ShieldCheck } from "lucide-react";
import { Button, Spinner, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { RoutineDetail } from "@/types/api";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import { GovernanceBadge } from "@/components/badges/GovernanceBadge";
import { RunnerBadge } from "@/components/badges/RunnerBadge";
import { WorkloadChip } from "@/components/badges/WorkloadChip";
import { fmtDate, fmtDuration } from "@/lib/format";
import { SECAO_LABEL, reviewPrefix, tagsOfSummary } from "@/lib/status";

interface Props {
  rotina: RoutineDetail; prevId?: string; nextId?: string; editing: boolean;
  onApprove: () => void; onEdit: () => void; onReview: () => void; onOpenReviews: () => void; onReexecute: () => void;
}

export function StudioHeader({ rotina, prevId, nextId, editing, onApprove, onEdit, onReview, onOpenReviews, onReexecute }: Props) {
  const s = rotina.summary;
  const reviewTags = tagsOfSummary(s);
  const running = s.runner.estado === "na_fila" || s.runner.estado === "em_execucao";
  return (
    <div className="studio-head">
      <div className="row-between">
        <div className="stack-1 grow">
          <div className="row">
            <span className="t-mono crimson">{reviewPrefix(s.statusAuditoria, reviewTags)}{s.id}</span>
            <span className="t-overline-xs">{rotina.auditoriaUi?.versao_homologacao ?? "—"}</span>
          </div>
          <h1 className="t-h2">{s.titulo}</h1>
        </div>
        <div className="row">
          {prevId ? <Link to="/rotinas/$id" params={{ id: prevId }} aria-label="Rotina anterior"><Button size="sm" iconOnly aria-label="Rotina anterior" tabIndex={-1}><ChevronLeft size={14} strokeWidth={1.5} /></Button></Link>
            : <Button size="sm" iconOnly disabled aria-label="Rotina anterior"><ChevronLeft size={14} strokeWidth={1.5} /></Button>}
          {nextId ? <Link to="/rotinas/$id" params={{ id: nextId }} aria-label="Próxima rotina"><Button size="sm" iconOnly aria-label="Próxima rotina" tabIndex={-1}><ChevronRight size={14} strokeWidth={1.5} /></Button></Link>
            : <Button size="sm" iconOnly disabled aria-label="Próxima rotina"><ChevronRight size={14} strokeWidth={1.5} /></Button>}
        </div>
      </div>
      <div className="row-between">
        <div className="row">
          <AuditStatusBadge status={s.statusAuditoria} divergencias={s.divergenciasCount} reviewTags={reviewTags} />
          <GovernanceBadge status={s.statusGovernanca} />
          <RunnerBadge runner={s.runner} />
          <WorkloadChip type={s.workloadType} />
          <Tooltip content={SECAO_LABEL[s.secao]}><span className="chip" tabIndex={0}>Seção {s.secao}</span></Tooltip>
          <span className="chip">{s.fase ? `Fase ${s.fase}` : "Sem fase"}</span>
          <span className="t-body-s dim">Executada {fmtDate(s.dataExecucao)} · {s.workerId ?? "—"} · {fmtDuration(s.durationSeconds)}</span>
        </div>
        </div>
      <div className="studio-actions" role="region" aria-label="Ações da rotina">
        <div className="studio-actions-secondary">
          <Button size="lg" className="btn-reviews-highlight" onClick={onOpenReviews}>
            <History size={14} strokeWidth={1.75} />
            Últimas Revisões
            <span className="btn-reviews-highlight-count">{rotina.revisoes?.length ?? 0}</span>
          </Button>
          <Button size="lg" onClick={onReexecute} disabled={running} aria-busy={running}>
            {running ? <Spinner label="Reexecução em andamento" /> : <RotateCw size={14} strokeWidth={1.5} />}{running ? "Na fila…" : "Reexecutar"}
          </Button>
          <Button size="lg" onClick={onReview}><Flag size={14} strokeWidth={1.5} />Marcar revisão</Button>
          <Button size="lg" onClick={onEdit} disabled={editing}><PencilLine size={14} strokeWidth={1.5} />Editar texto</Button>
        </div>
          {!editing && <Button size="lg" variant="primary" onClick={onApprove} disabled={s.statusGovernanca === "aprovada"}><ShieldCheck size={14} strokeWidth={1.5} />{s.statusGovernanca === "aprovada" ? "Aprovada" : "Aprovar rotina"}</Button>}
      </div>
    </div>
  );
}
