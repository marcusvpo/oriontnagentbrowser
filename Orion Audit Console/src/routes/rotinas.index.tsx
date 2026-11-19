import { useEffect, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDownUp, Download, FileSearch, SkipForward } from "lucide-react";
import { Alert, Button, EmptyState, Select, Skeleton } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { RoutineFilters } from "@/components/explorer/RoutineFilters";
import { ActiveFilterChips } from "@/components/explorer/ActiveFilterChips";
import { RoutinesTable } from "@/components/explorer/RoutinesTable";
import { useRotinas } from "@/hooks/useRotinas";
import { toListQuery, validateRotinasSearch, type RotinasSearch } from "@/lib/search";
import { tagsOfSummary } from "@/lib/status";
import { api } from "@/services/api";
import { triggerTextDownload } from "@/lib/download";
import { toast } from "@/lib/toast";

export const Route = createFileRoute("/rotinas/")({
  validateSearch: validateRotinasSearch,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Rotinas · Orion Audit Console" },
      {
        name: "description",
        content: "Filtre, valide e acompanhe a curadoria das 471 rotinas do Orion TN.",
      },
      { property: "og:title", content: "Rotinas · Orion Audit Console" },
      { property: "og:description", content: "Explorador de curadoria das rotinas do Orion TN." },
    ],
  }),
  component: Rotinas,
});

const PAGE_SIZE = 25;
export const EXPLORER_SEARCH_KEY = "orion.explorer.search";

function Rotinas() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/rotinas/" });
  const query = useMemo(() => toListQuery(search, PAGE_SIZE), [search]);
  const { data, isLoading, isFetching, error } = useRotinas(query);

  useEffect(() => {
    sessionStorage.setItem(EXPLORER_SEARCH_KEY, JSON.stringify(search));
  }, [search]);

  const patch = (p: Partial<RotinasSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...p, page: undefined }) });

  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const page = search.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const c = data?.meta.stats.curadoria;

  const nextPending = async () => {
    const all = await api.listRotinas({ ...query, page: 1, pageSize: 500 });
    const next = all.data.find((r) => r.statusGovernanca !== "aprovada");
    if (next) navigate({ to: "/rotinas/$id", params: { id: next.id } });
    else toast.error("Tudo aprovado", "Todas as rotinas neste filtro já estão aprovadas para a Base KB.");
  };

  const exportCsv = async () => {
    const all = await api.listRotinas({ ...query, page: 1, pageSize: 500 });
    const list = all.data;
    const head = [
      "id",
      "titulo",
      "modulo",
      "secao",
      "fase",
      "estagioCuradoria",
      "statusAuditoria",
      "reviewTags",
      "statusGovernanca",
      "ingestaoAgente",
      "revisoesCount",
      "ultimoLoteIngestao",
      "passos",
      "prints",
      "divergencias",
      "dataExecucao",
    ];
    const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      head.join(";"),
      ...list.map((r) =>
        [
          r.id,
          r.titulo,
          r.modulo,
          r.secao,
          r.fase,
          r.curationStage,
          r.statusAuditoria,
          tagsOfSummary(r).join(","),
          r.statusGovernanca,
          r.reviewIngestionState ?? "sem_revisoes",
          r.revisoesCount ?? 0,
          r.ultimoLoteIngestaoId ?? "",
          r.totalPassos,
          r.printsGeradas,
          r.divergenciasCount,
          r.dataExecucao,
        ]
          .map(q)
          .join(";"),
      ),
    ].join("\n");
    triggerTextDownload("rotinas-orion-curadoria.csv", "\uFEFF" + csv, "text/csv;charset=utf-8");
    toast("CSV exportado", `${list.length} rotina(s).`);
  };

  const stagePills: Array<{
    key: string;
    label: string;
    count?: number;
    dotColor?: string;
    tone?: "ingested" | "approved" | "pending";
    active: boolean;
    onClick: () => void;
  }> = [
    {
      key: "all",
      label: "Todas",
      count: data?.meta.stats.totalRotinas,
      active: !search.estagio && !search.ingestao,
      onClick: () => patch({ estagio: undefined, ingestao: undefined }),
    },
    {
      key: "apoio_humano",
      label: "Apoio humano",
      count: c?.precisamApoioHumano,
      dotColor: "var(--color-warning)",
      active: search.estagio === "apoio_humano",
      onClick: () =>
        patch({
          estagio: search.estagio === "apoio_humano" ? undefined : "apoio_humano",
          ingestao: undefined,
        }),
    },
    {
      key: "prontas_conferencia",
      label: "Prontas p/ conferir",
      count: c?.prontasConferencia,
      dotColor: "var(--color-bone)",
      active: search.estagio === "prontas_conferencia",
      onClick: () =>
        patch({
          estagio: search.estagio === "prontas_conferencia" ? undefined : "prontas_conferencia",
          ingestao: undefined,
        }),
    },
    {
      key: "revisao_pendente",
      label: "Revisão pendente p/ agente",
      count: c?.revisaoPendenteExportacao,
      dotColor: "var(--color-crimson)",
      tone: "pending",
      active: search.estagio === "revisao_pendente",
      onClick: () =>
        patch({
          estagio: search.estagio === "revisao_pendente" ? undefined : "revisao_pendente",
          ingestao: undefined,
        }),
    },
    {
      key: "ingeridas_agente",
      label: "Ingeridas pelo agente",
      count: c?.rotinasComIngestao,
      dotColor: "var(--color-ingested)",
      tone: "ingested",
      active: search.ingestao === "ingerida_pelo_agente" || search.estagio === "ingeridas_agente",
      onClick: () =>
        patch({
          estagio: undefined,
          ingestao:
            search.ingestao === "ingerida_pelo_agente" ? undefined : "ingerida_pelo_agente",
        }),
    },
    {
      key: "aprovadas_kb",
      label: "Aprovadas p/ Base KB",
      count: c?.aprovadasKb ?? data?.meta.stats.aprovadas,
      dotColor: "var(--color-success)",
      tone: "approved",
      active: search.estagio === "aprovadas_kb",
      onClick: () =>
        patch({
          estagio: search.estagio === "aprovadas_kb" ? undefined : "aprovadas_kb",
          ingestao: undefined,
        }),
    },
    {
      key: "nao_auditadas",
      label: "Não auditadas",
      count: c?.naoAuditadas ?? data?.meta.stats.naoAuditadas,
      dotColor: "var(--color-ash-dim)",
      active: search.estagio === "nao_auditadas",
      onClick: () =>
        patch({
          estagio: search.estagio === "nao_auditadas" ? undefined : "nao_auditadas",
          ingestao: undefined,
        }),
    },
  ];

  return (
    <AppShell crumbs={[{ label: "Painel", to: "/" }, { label: "Rotinas" }]}>
      <div className="page-head">
        <div className="page-head-text">
          <span className="t-overline">Explorador de curadoria</span>
          <h1 className="t-h1">Rotinas</h1>
          <p className="t-body">{isLoading ? "Carregando…" : `${total} rotina(s) neste recorte.`}</p>
        </div>
        <div className="row">
          <Button size="lg" onClick={exportCsv}>
            <Download size={14} strokeWidth={1.5} />
            Exportar CSV
          </Button>
          <Button size="lg" variant="primary" onClick={nextPending}>
            <SkipForward size={14} strokeWidth={1.5} />
            Próxima p/ validar
          </Button>
        </div>
      </div>

      <div className="stage-pills" role="group" aria-label="Estágio de curadoria" data-testid="stage-pills">
        {stagePills.map((pill) => (
          <button
            key={pill.key}
            type="button"
            className="stage-pill"
            data-tone={pill.tone}
            aria-pressed={pill.active}
            onClick={pill.onClick}
          >
            {pill.dotColor && (
              <span className="stage-pill__dot" style={{ background: pill.dotColor }} aria-hidden />
            )}
            <span>{pill.label}</span>
            {pill.count !== undefined && <span className="stage-pill__count">{pill.count}</span>}
          </button>
        ))}
      </div>

      <div className="filter-band stack-3">
        <RoutineFilters search={search} onChange={patch} phases={data?.meta.stats.porFase} />
        <ActiveFilterChips
          search={search}
          onChange={patch}
          onClear={() => navigate({ search: {} })}
        />
      </div>

      {error ? (
        <Alert tone="error" title="Erro ao carregar rotinas">
          {(error as Error).message}
        </Alert>
      ) : isLoading ? (
        <div className="stack-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="var(--space-10)" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<FileSearch size={24} strokeWidth={1.5} />}
          title="Nenhuma rotina encontrada"
          description="Nenhum resultado para os filtros atuais."
          action={<Button onClick={() => navigate({ search: {} })}>Limpar filtros</Button>}
        />
      ) : (
        <>
          <div className="explorer-sort row-between">
            <div className="row">
              <ArrowDownUp size={14} strokeWidth={1.5} className="muted" aria-hidden />
              <Select
                aria-label="Ordenar por"
                value={search.sort ?? "id"}
                onChange={(e) => patch({ sort: e.target.value })}
              >
                <option value="id">ID</option>
                <option value="titulo">Título</option>
                <option value="dataExecucao">Atualizada em</option>
                <option value="divergenciasCount">Ajustes automáticos</option>
                <option value="menorConfianca">Menor confiança</option>
              </Select>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => patch({ order: search.order === "desc" ? undefined : "desc" })}
              >
                {search.order === "desc" ? "Decrescente" : "Crescente"}
              </Button>
            </div>
            {isFetching && <span className="t-overline-xs">Atualizando…</span>}
          </div>
          <RoutinesTable rows={rows} />
          <div className="pager">
            <span className="t-body-s">
              Página {page} de {pages}
            </span>
            <div className="row">
              <Button
                size="sm"
                disabled={page <= 1}
                onClick={() =>
                  navigate({ search: (p) => ({ ...p, page: page - 1 > 1 ? page - 1 : undefined }) })
                }
              >
                Anterior
              </Button>
              <Button
                size="sm"
                disabled={page >= pages}
                onClick={() => navigate({ search: (p) => ({ ...p, page: page + 1 }) })}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
