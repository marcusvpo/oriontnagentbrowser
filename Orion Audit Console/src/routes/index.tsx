import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Workflow } from "lucide-react";
import { Alert, Badge, Button, Card, Skeleton } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { PhaseProgressChart } from "@/components/dashboard/PhaseProgressChart";
import { PhaseSplitCards } from "@/components/dashboard/PhaseSplitCards";
import { WorkloadDonut } from "@/components/dashboard/WorkloadDonut";
import { ModuleBarChart } from "@/components/dashboard/ModuleBarChart";
import { DivergenceLayers } from "@/components/dashboard/DivergenceLayers";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useRotinas } from "@/hooks/useRotinas";
import { isRealtimeConfigured } from "@/lib/supabase";
import { fmtPct } from "@/lib/format";
import { REVIEW_FILTER, REVIEW_TAG_META, REVIEW_TAG_ORDER } from "@/lib/status";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Dashboard Executivo · Orion Audit Console" },
      { name: "description", content: "Visão executiva da auditoria das 471 rotinas: KPIs, progresso por fase, carga e módulos." },
      { property: "og:title", content: "Dashboard Executivo · Orion Audit Console" },
      { property: "og:description", content: "Visão executiva da auditoria das rotinas do ERP notarial." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading, error } = useRotinas(
    { pageSize: 1 },
    { refetchInterval: isRealtimeConfigured() ? 60000 : 10000 },
  );
  const s = data?.meta.stats;
  return (
    <AppShell crumbs={[{ label: "Dashboard" }]}>
      <div className="page-head">
        <div className="page-head-text">
          <span className="t-overline">Homologação — Cartório Fictício de Notas</span>
          <h1 className="t-display-l">Dashboard Executivo</h1>
          <p className="t-body">Andamento da auditoria visual dos manuais do ERP: o que já foi validado pela máquina, o que um revisor aprovou e o que está travado.</p>
        </div>
        <Link to="/rotinas" search={{ status: `validado_com_ajustes,${REVIEW_FILTER}`, gov: "pendente_aprovacao" }}>
          <Button variant="primary" size="lg">Iniciar triagem <ArrowRight size={16} strokeWidth={1.5} /></Button>
        </Link>
      </div>

      {error && <Alert tone="error" title="Não foi possível carregar o painel">{(error as Error).message}</Alert>}

      {isLoading || !s ? (
        <div className="kpi-grid">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height="calc(var(--space-24) + var(--space-6))" />)}</div>
      ) : (
        <>
          <div className="kpi-grid">
            <KpiCard className="kpi-hero" label="Total de rotinas" value={String(s.totalRotinas)} delta="Universo da base de conhecimento" search={{}} />
            <KpiCard label="Auditadas" value={String(s.auditadas)} delta={`${fmtPct(s.auditadas / s.totalRotinas)} do total`} trend="up" search={{ status: `validado_inalterado,validado_com_ajustes,${REVIEW_FILTER}` }} />
            <KpiCard label="Taxa de aprovação" value={fmtPct(s.taxaAprovacao)} delta={`${s.aprovadas} aprovadas ÷ ${s.auditadas} auditadas`} trend="up" search={{ gov: "aprovada" }} />
            <KpiCard label="Auto-curadas" value={String(s.autoCuradas)} delta="Divergências corrigidas" search={{ status: "validado_com_ajustes" }} />
            <KpiCard
              label="Em revisão humana"
              value={String(s.bloqueadas)}
              delta="Exigem validação manual (multi-tag incluso)"
              trend="down"
              search={{ status: REVIEW_FILTER }}
              footer={
                <div className="row" style={{ gap: "var(--space-1)" }}>
                  {REVIEW_TAG_ORDER.map((t) => {
                    const meta = REVIEW_TAG_META[t];
                    const count = s.porTagRevisao?.[t] ?? 0;
                    return (
                      <Badge key={t} status={meta.tone} className={meta.extraClass} hideDot>
                        [{t}] {count}
                      </Badge>
                    );
                  })}
                </div>
              }
            />
            <KpiCard label="Não auditadas" value={String(s.naoAuditadas)} delta={`${fmtPct(s.naoAuditadas / s.totalRotinas)} restantes`} search={{ status: "nao_auditada" }} />
          </div>

          <div className="section-heading"><h2 className="t-h2">Panorama da auditoria</h2><span className="t-overline-xs">Fases · Carga · Módulos</span></div>
          <PhaseSplitCards phases={s.porFase} />
          <div className="dash-grid">
            <div className="span-8"><PhaseProgressChart phases={s.porFase} total={s.totalRotinas} tagCounts={s.porTagRevisao} /></div>
            <div className="span-4 stack-4">
              <WorkloadDonut readOnly={s.porCarga.read_only} mutation={s.porCarga.mutation} />
              <Card kicker="Fila do runner">
                <div className="stack-3">
                  <div className="row-between"><span className="chip">READ_ONLY</span><span className="t-mono-metric">{s.filaRunner.read_only}</span></div>
                  <div className="row-between"><span className="chip">MUTATION</span><span className="t-mono-metric">{s.filaRunner.mutation}</span></div>
                  <div className="row-between">
                    <Badge status={s.filaRunner.emExecucao ? "running" : "neutral"}>{s.filaRunner.emExecucao} em execução</Badge>
                    <Link to="/fila" className="t-link t-body-s icon-inline"><Workflow size={14} strokeWidth={1.5} />Abrir fila</Link>
                  </div>
                </div>
              </Card>
            </div>
            <div className="span-8"><ModuleBarChart data={s.porModulo} /></div>
            <div className="span-4"><DivergenceLayers data={s.porCamadaDivergencia} /></div>
            <div className="span-12"><RecentActivity events={s.atividadeRecente} /></div>
          </div>
        </>
      )}
    </AppShell>
  );
}
