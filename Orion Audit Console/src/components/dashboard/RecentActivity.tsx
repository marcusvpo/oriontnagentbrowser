import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Flag,
  PencilLine,
  PlayCircle,
  RotateCw,
  ShieldCheck,
  Sparkles,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Card, EmptyState } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { GovernanceEvent } from "@/types/api";
import { fmtDate } from "@/lib/format";

export const EVENT_ICON: Record<GovernanceEvent["tipo"], { icon: LucideIcon; cls: string; label: string }> = {
  auditoria_executada: { icon: PlayCircle, cls: "muted", label: "Auditoria sincronizada" },
  aprovada: { icon: ShieldCheck, cls: "ok", label: "Aprovada p/ Base KB" },
  texto_editado: { icon: PencilLine, cls: "muted", label: "Texto / revisão editada" },
  revisao_solicitada: { icon: Flag, cls: "warn", label: "Revisão registrada" },
  revisao_ingerida_agente: { icon: Sparkles, cls: "ingested", label: "Revisão ingerida pelo agente" },
  reexecucao_enfileirada: { icon: RotateCw, cls: "muted", label: "Registro histórico" },
  reexecucao_concluida: { icon: CheckCircle2, cls: "ok", label: "Auditoria concluída" },
  reexecucao_falhou: { icon: XCircle, cls: "err", label: "Auditoria com falha" },
};

export function RecentActivity({ events }: { events: Array<GovernanceEvent & { rotinaId: string }> }) {
  return (
    <Card kicker="Atividade recente">
      {events.length === 0 ? (
        <EmptyState
          icon={<PlayCircle size={24} strokeWidth={1.5} />}
          title="Sem atividade"
          description="Nenhum evento de curadoria registrado ainda."
        />
      ) : (
        <ul className="timeline">
          {events.map((e) => {
            const m = EVENT_ICON[e.tipo] ?? EVENT_ICON.auditoria_executada;
            return (
              <li key={e.id}>
                <span className={`timeline-icon ${m.cls}`}>
                  <m.icon size={16} strokeWidth={1.5} aria-label={m.label} />
                </span>
                <div className="stack-1">
                  <div className="row">
                    <Link to="/rotinas/$id" params={{ id: e.rotinaId }} className="link-plain t-mono">
                      {e.rotinaId}
                    </Link>
                    <span className="t-body-s">{m.label}</span>
                  </div>
                  <span className="t-body-s">{e.descricao}</span>
                  <span className="t-overline-xs">
                    {e.autor} · {fmtDate(e.em)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
