import { createFileRoute, Link } from "@tanstack/react-router";
import { Workflow } from "lucide-react";
import { Badge, EmptyState, Skeleton, Table } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { RunnerBadge } from "@/components/badges/RunnerBadge";
import { useRotinas } from "@/hooks/useRotinas";
import { fmtDate } from "@/lib/format";
import type { RoutineSummary } from "@/types/api";
import type { WorkloadType } from "@/types/audit";

export const Route = createFileRoute("/fila")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Fila do Runner · Orion Audit Console" },
      { name: "description", content: "Jobs de auditoria enfileirados e em execução, separados por lane read_only e mutation." },
      { property: "og:title", content: "Fila do Runner · Orion Audit Console" },
      { property: "og:description", content: "Acompanhe os jobs do runner de auditoria." },
    ],
  }),
  component: Fila,
});

function Lane({ lane, rows }: { lane: WorkloadType; rows: RoutineSummary[] }) {
  return (
    <section className="queue-lane" aria-label={`Lane ${lane}`}>
      <div className="section-heading"><div className="stack-2"><h2 className="t-h3 icon-inline"><Workflow size={20} strokeWidth={1.5} />{lane}</h2><span className="t-overline-xs">{lane === "mutation" ? "Serializada" : lane === "read_only" ? "Paralela" : "Histórico de execuções"}</span></div><Badge status={rows.length ? "running" : "neutral"}>{rows.length} jobs</Badge></div>
      {rows.length === 0 ? (
        <EmptyState icon={<Workflow size={24} strokeWidth={1.5} />} title="Lane vazia" description="Nenhum job ativo nesta lane." />
      ) : (
        <Table rows={rows} rowKey={(r) => r.id} columns={[
          { key: "id", header: "Rotina", render: (r) => <Link to="/rotinas/$id" params={{ id: r.id }} className="link-plain t-mono nowrap">{r.id}</Link> },
          { key: "estado", header: "Estado", render: (r) => <RunnerBadge runner={r.runner} /> },
          { key: "job", header: "Job", render: (r) => <span className="t-mono nowrap">{r.runner.jobId}</span> },
          { key: "em", header: "Enfileirado em", render: (r) => <span className="t-mono nowrap">{fmtDate(r.runner.enfileiradoEm)}</span> },
        ]} />
      )}
    </section>
  );
}

function Fila() {
  const { data, isLoading } = useRotinas({ pageSize: 500 }, { refetchInterval: 4000 });
  const rows = data?.data ?? [];
  const ativos = rows.filter((r) => r.runner.estado === "na_fila" || r.runner.estado === "em_execucao").sort((a, b) => (a.runner.posicaoFila ?? 0) - (b.runner.posicaoFila ?? 0));
  const recentes = rows.filter((r) => r.runner.estado === "concluida" || r.runner.estado === "falhou");
  return (
    <AppShell crumbs={[{ label: "Dashboard", to: "/" }, { label: "Fila do Runner" }]}>
      <div className="page-head-text">
        <span className="t-overline">Monitor de execução</span>
        <h1 className="t-h1">Fila do Runner</h1>
        <p className="t-body">Execuções ativas e recentes, organizadas por carga.</p>
      </div>
      {isLoading ? <Skeleton height="calc(var(--space-32) * 2)" /> : (
        <>
          <div className="lane-grid">
            <Lane lane="read_only" rows={ativos.filter((r) => r.runner.lane === "read_only")} />
            <Lane lane="mutation" rows={ativos.filter((r) => r.runner.lane === "mutation")} />
          </div>
          {recentes.length > 0 && <Lane lane={"concluídas" as WorkloadType} rows={recentes} />}
        </>
      )}
    </AppShell>
  );
}
