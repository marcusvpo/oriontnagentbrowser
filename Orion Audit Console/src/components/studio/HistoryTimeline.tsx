import { EmptyState } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { History } from "lucide-react";
import type { GovernanceEvent } from "@/types/api";
import { EVENT_ICON } from "@/components/dashboard/RecentActivity";
import { fmtDate } from "@/lib/format";

export function HistoryTimeline({ events }: { events: GovernanceEvent[] }) {
  if (!events.length) return <EmptyState icon={<History size={24} strokeWidth={1.5} />} title="Sem histórico" description="Nenhuma ação registrada para esta rotina." />;
  return (
    <ul className="timeline">
      {events.map((e) => {
        const m = EVENT_ICON[e.tipo];
        return (
          <li key={e.id}>
            <span className={`timeline-icon ${m.cls}`}><m.icon size={16} strokeWidth={1.5} aria-hidden /></span>
            <div className="stack-1">
              <span className="t-label">{m.label}</span>
              <span className="t-body-s">{e.descricao}</span>
              <span className="t-overline-xs">{e.autor} · {fmtDate(e.em)}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
