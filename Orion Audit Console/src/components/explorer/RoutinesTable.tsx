import { Link } from "@tanstack/react-router";
import { Film, Hash } from "lucide-react";
import { Checkbox, Table, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { TableColumn } from "@/design-system/orion-audit-console---design-system-bdbb01/design-system/components/Data";
import type { RoutineSummary } from "@/types/api";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import { GovernanceBadge } from "@/components/badges/GovernanceBadge";
import { RunnerBadge } from "@/components/badges/RunnerBadge";
import { WorkloadChip } from "@/components/badges/WorkloadChip";
import { ConfidenceBar } from "@/components/badges/ConfidenceBar";
import { fmtDate } from "@/lib/format";
import { SECAO_LABEL, reviewPrefix, tagsOfSummary } from "@/lib/status";

interface Props {
  rows: RoutineSummary[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}

export function RoutinesTable({ rows, selected, onToggle, onToggleAll }: Props) {
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const columns: TableColumn<RoutineSummary>[] = [
    { key: "sel", header: "", render: (r) => <Checkbox checked={selected.has(r.id)} onChange={() => onToggle(r.id)} aria-label={`Selecionar ${r.id}`} /> },
    {
      key: "titulo", header: "Rotina / Título", render: (r) => {
        const reviewTags = tagsOfSummary(r);
        return (
          <div className="stack-2 routine-title">
            <Link to="/rotinas/$id" params={{ id: r.id }} className="link-plain t-mono nowrap">{reviewTags.length > 0 && <span className="err">{reviewPrefix(r.statusAuditoria, reviewTags)}</span>}{r.id}</Link>
            <Link to="/rotinas/$id" params={{ id: r.id }} className="link-plain routine-title-link">{r.titulo}</Link>
            <div className="row">
              <RunnerBadge runner={r.runner} />
              {r.temVideo && <span className="chip"><Film size={12} strokeWidth={1.5} aria-hidden />vídeo</span>}
            </div>
          </div>
        );
      },
    },
    { key: "contexto", header: "Contexto", render: (r) => <div className="stack-2"><span className="t-mono">{r.modulo}</span><div className="row"><Tooltip content={SECAO_LABEL[r.secao]}><span className="chip" tabIndex={0}>Seção {r.secao}</span></Tooltip><span className="t-body-s nowrap">{r.fase ? `Fase ${r.fase}` : "Sem fase"}</span></div><WorkloadChip type={r.workloadType} /></div> },
    { key: "status", header: "Auditoria / Governança", render: (r) => <div className="stack-2 routine-routes"><AuditStatusBadge status={r.statusAuditoria} divergencias={r.divergenciasCount} reviewTags={tagsOfSummary(r)} /><GovernanceBadge status={r.statusGovernanca} /></div> },
    { key: "passos", header: "Evidências", render: (r) => <div className="stack-2 nowrap"><span className="t-mono">{r.totalPassos} passos</span><span className="t-body-s">{r.printsGeradas} prints</span></div> },
    {
      key: "div", header: "Divergências", render: (r) => r.divergenciasCount ? (
        <div className="stack-1"><span className="t-mono">{r.divergenciasCount}</span>{r.menorConfianca !== undefined && <ConfidenceBar value={r.menorConfianca} showWarning={false} />}</div>
      ) : <span className="dim">—</span>,
    },
    { key: "rotas", header: "Rotas hash", render: (r) => <div className="stack-1 routine-routes">{r.rotasHash.map((h) => <span key={h} className="chip"><Hash size={12} strokeWidth={1.5} aria-hidden />{h.replace(/^#/, "")}</span>)}</div> },
    { key: "exec", header: "Última execução", render: (r) => <div className="stack-2"><span className="t-mono nowrap">{fmtDate(r.dataExecucao)}</span><span className="t-body-s">{r.workerId ?? "—"}</span></div> },
  ];
  return (
    <div className="stack-2">
      <Checkbox checked={allChecked} onChange={onToggleAll}>Selecionar todas desta página</Checkbox>
      <div className="routines-table-region" role="region" aria-label="Tabela de rotinas" tabIndex={0}>
      <Table className="routines-table" columns={columns} rows={rows} rowKey={(r) => r.id} />
      </div>
    </div>
  );
}
