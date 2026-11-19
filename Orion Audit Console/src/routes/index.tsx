import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { Alert, Button, Skeleton } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { CurationPipelineCard } from "@/components/dashboard/CurationPipelineCard";
import { AgentKnowledgeCard } from "@/components/dashboard/AgentKnowledgeCard";
import { PhaseProgressChart } from "@/components/dashboard/PhaseProgressChart";
import { PhaseSplitCards } from "@/components/dashboard/PhaseSplitCards";
import { ModuleBarChart } from "@/components/dashboard/ModuleBarChart";
import { DivergenceLayers } from "@/components/dashboard/DivergenceLayers";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ExportReviewsModal } from "@/components/reviews/ExportReviewsModal";
import { useRevisoes, useRotinas } from "@/hooks/useRotinas";
import { isRealtimeConfigured } from "@/lib/supabase";
import type { CurationStats } from "@/types/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Central de Curadoria · Orion Audit Console" },
      {
        name: "description",
        content:
          "Plataforma de avaliação visual, revisão humana e calibragem de conhecimento das 471 rotinas do Orion TN.",
      },
      { property: "og:title", content: "Central de Curadoria · Orion Audit Console" },
      {
        property: "og:description",
        content: "Validação de manuais, prints e exportação de revisões para calibragem do motor.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [exportOpen, setExportOpen] = useState(false);
  const { data, isLoading, error } = useRotinas(
    { pageSize: 1 },
    { refetchInterval: isRealtimeConfigured() ? 60000 : 15000 },
  );
  const { data: reviewsData } = useRevisoes();
  const s = data?.meta.stats;

  const curadoria: CurationStats | undefined = s
    ? s.curadoria ?? {
        aprovadasKb: s.aprovadas,
        ingeridasAgente: 0,
        revisaoPendenteExportacao: 0,
        precisamApoioHumano: s.bloqueadas,
        prontasConferencia: Math.max(0, s.auditadas - s.aprovadas - s.bloqueadas),
        naoAuditadas: s.naoAuditadas,
        totalRevisoesPendentes: reviewsData?.meta.pendentesExportacao ?? 0,
        totalRevisoesConsumidas: reviewsData?.meta.consumidas ?? 0,
        rotinasComIngestao: reviewsData?.meta.rotinasConsumidas ?? 0,
        ultimoLote: reviewsData?.lotes?.[0] ?? null,
      }
    : undefined;

  const pendingReviews = curadoria?.totalRevisoesPendentes ?? 0;

  return (
    <AppShell crumbs={[{ label: "Painel" }]}>
      <div className="page-head">
        <div className="page-head-text">
          <span className="t-overline">Central de Curadoria & Calibragem · Orion TN</span>
          <h1 className="t-display-l">Orion Audit</h1>
          <p className="t-body">
            Confronte os manuais originais com as telas reais capturadas pelo motor, aprove rotinas prontas para a base
            do assistente e exporte revisões humanas para evoluir o agente.
          </p>
        </div>
        <div className="row">
          <Button size="lg" onClick={() => setExportOpen(true)}>
            <Download size={15} strokeWidth={1.6} />
            {pendingReviews > 0 ? `Exportar revisões (${pendingReviews})` : "Exportar revisões"}
          </Button>
          <Link to="/rotinas" search={{ estagio: "apoio_humano" }}>
            <Button variant="primary" size="lg">
              Iniciar validação <ArrowRight size={16} strokeWidth={1.5} />
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert tone="error" title="Não foi possível carregar o painel">
          {(error as Error).message}
        </Alert>
      )}

      {isLoading || !s || !curadoria ? (
        <div className="stack-4">
          <Skeleton height="calc(var(--space-32) * 2)" />
          <div className="cols-2">
            <Skeleton height="calc(var(--space-32) * 2)" />
            <Skeleton height="calc(var(--space-32) * 2)" />
          </div>
        </div>
      ) : (
        <>
          <CurationPipelineCard curadoria={curadoria} totalRotinas={s.totalRotinas} />

          <div className="section-heading">
            <h2 className="t-h2">Andamento por fase e calibragem</h2>
            <span className="t-overline-xs">Fases · Revisões · Módulos</span>
          </div>

          <PhaseSplitCards phases={s.porFase} />

          <div className="dash-grid">
            <div className="span-8">
              <PhaseProgressChart
                phases={s.porFase}
                total={s.totalRotinas}
                tagCounts={s.porTagRevisao}
              />
            </div>
            <div className="span-4">
              <AgentKnowledgeCard
                curadoria={curadoria}
                onOpenExport={() => setExportOpen(true)}
              />
            </div>
            <div className="span-8">
              <ModuleBarChart data={s.porModulo} />
            </div>
            <div className="span-4">
              <DivergenceLayers data={s.porCamadaDivergencia} />
            </div>
            <div className="span-12">
              <RecentActivity events={s.atividadeRecente} />
            </div>
          </div>
        </>
      )}

      <ExportReviewsModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        allReviews={reviewsData?.data ?? []}
      />
    </AppShell>
  );
}
