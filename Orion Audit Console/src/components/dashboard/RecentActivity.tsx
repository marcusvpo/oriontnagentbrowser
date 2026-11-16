import { Link } from "@tanstack/react-router";
import { CheckCircle2, Flag, PencilLine, PlayCircle, RotateCw, ShieldCheck, XCircle, type LucideIcon } from "lucide-react";
import { Card, EmptyState } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { GovernanceEvent } from "@/types/api";
import { fmtDate } from "@/lib/format";

export const EVENT_ICON: Record<GovernanceEvent["tipo"], { icon: LucideIcon; cls: string; label: string }> = {
  auditoria_executada: { icon: PlayCircle, cls: "muted", label: "Auditoria executada" },
  aprovada: { icon: ShieldCheck, cls: "ok", label: "Aprovada" },
  texto_editado: { icon: PencilLine, cls: "muted", label: "Texto editado" },
  revisao_solicitada: { icon: Flag, cls: "warn", label: "Revisão solicitada" },
  reexecucao_enfileirada: { icon: RotateCw, cls: "crimson", label: "Reexecução enfileirada" },
  reexecucao_concluida: { icon: CheckCircle2, cls: "ok", label: "Reexecução concluída" },
  reexecucao_falhou: { icon: XCircle, cls: "err", label: "Reexecução falhou" },
};

export function RecentActivity({ events }: { events: Array<GovernanceEvent & { rotinaId: string }> }) {
  return (
    <Card kicker="Atividade recente">
      {events.length === 0 ? (
        <EmptyState icon={<PlayCircle size={24} strokeWidth={1.5} />} title="Sem atividade" description="Nenhum evento de governança registrado." />
      ) : (
        <ul className="timeline">
          {events.map((e) => {
            const m = EVENT_ICON[e.tipo];
            return (
              <li key={e.id}>
                <span className={`timeline-icon ${m.cls}`}><m.icon size={16} strokeWidth={1.5} aria-label={m.label} /></span>
                <div className="stack-1">
                  <div className="row"><Link to="/rotinas/$id" params={{ id: e.rotinaId }} className="link-plain t-mono">{e.rotinaId}</Link><span className="t-body-s">{m.label}</span></div>
                  <span className="t-body-s">{e.descricao}</span>
                  <span className="t-overline-xs">{e.autor} · {fmtDate(e.em)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
