import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowDownUp, Download, FileSearch, RotateCw, SkipForward } from "lucide-react";
import { Alert, Button, EmptyState, Select, Skeleton } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { RoutineFilters } from "@/components/explorer/RoutineFilters";
import { ActiveFilterChips } from "@/components/explorer/ActiveFilterChips";
import { RoutinesTable } from "@/components/explorer/RoutinesTable";
import { ReexecuteDialog } from "@/components/governance/ReexecuteDialog";
import { useRotinas } from "@/hooks/useRotinas";
import { toListQuery, validateRotinasSearch, type RotinasSearch } from "@/lib/search";
import { tagsOfSummary } from "@/lib/status";
import { api } from "@/services/api";
import { toast } from "@/lib/toast";

export const Route = createFileRoute("/rotinas/")({
  validateSearch: validateRotinasSearch,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Explorador e Triagem · Orion Audit Console" },
      { name: "description", content: "Filtre, ordene e faça a triagem das rotinas auditadas por fase, módulo, status e rota." },
      { property: "og:title", content: "Explorador e Triagem · Orion Audit Console" },
      { property: "og:description", content: "Triagem das rotinas auditadas do ERP notarial." },
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchOpen, setBatchOpen] = useState(false);

  useEffect(() => { sessionStorage.setItem(EXPLORER_SEARCH_KEY, JSON.stringify(search)); }, [search]);

  const patch = (p: Partial<RotinasSearch>) => navigate({ search: (prev) => ({ ...prev, ...p, page: undefined }) });
  const rows = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const page = search.page ?? 1;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected((s) => (rows.every((r) => s.has(r.id)) ? new Set() : new Set(rows.map((r) => r.id))));

  const nextPending = async () => {
    const all = await api.listRotinas({ ...query, page: 1, pageSize: 500 });
    const next = all.data.find((r) => r.statusGovernanca === "pendente_aprovacao");
    if (next) navigate({ to: "/rotinas/$id", params: { id: next.id } });
    else toast.error("Nenhuma pendente", "Não há rotinas pendentes de aprovação neste filtro.");
  };

  const exportCsv = async () => {
    const all = await api.listRotinas({ ...query, page: 1, pageSize: 500 });
    const list = selected.size ? all.data.filter((r) => selected.has(r.id)) : all.data;
    const head = ["id", "titulo", "modulo", "secao", "fase", "statusAuditoria", "reviewTags", "statusGovernanca", "carga", "passos", "prints", "divergencias", "menorConfianca", "rotasHash", "dataExecucao", "worker"];
    const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [head.join(";"), ...list.map((r) => [r.id, r.titulo, r.modulo, r.secao, r.fase, r.statusAuditoria, tagsOfSummary(r).join(","), r.statusGovernanca, r.workloadType, r.totalPassos, r.printsGeradas, r.divergenciasCount, r.menorConfianca, r.rotasHash.join(" "), r.dataExecucao, r.workerId].map(q).join(";"))].join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "rotinas-orion.csv"; a.click(); URL.revokeObjectURL(url);
    toast("CSV exportado", `${list.length} rotina(s).`);
  };

  return (
    <AppShell crumbs={[{ label: "Dashboard", to: "/" }, { label: "Explorador" }]}>
      <div className="page-head">
        <div className="page-head-text">
          <span className="t-overline">Explorador e triagem</span>
          <h1 className="t-h1">Rotinas</h1>
          <p className="t-body">{isLoading ? "Carregando…" : `${total} rotina(s) neste filtro.`}</p>
        </div>
        <div className="row">
          <Button size="lg" onClick={exportCsv}><Download size={14} strokeWidth={1.5} />Exportar CSV</Button>
          <Button size="lg" variant="primary" onClick={nextPending}><SkipForward size={14} strokeWidth={1.5} />Próxima pendente</Button>
        </div>
      </div>

      <div className="filter-band stack-3">
        <RoutineFilters search={search} onChange={patch} phases={data?.meta.stats.porFase} />
        <ActiveFilterChips search={search} onChange={patch} onClear={() => navigate({ search: {} })} />
      </div>

      {selected.size > 0 && (
        <div className="bulkbar" role="region" aria-label="Ações em lote">
          <span className="t-label">{selected.size} selecionada(s)</span>
          <Button size="sm" onClick={() => setBatchOpen(true)}><RotateCw size={14} strokeWidth={1.5} />Reexecutar selecionadas</Button>
          <Button size="sm" variant="ghost" onClick={exportCsv}>Exportar seleção</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Limpar seleção</Button>
        </div>
      )}

      {error ? (
        <Alert tone="error" title="Erro ao carregar rotinas">{(error as Error).message}</Alert>
      ) : isLoading ? (
        <div className="stack-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} height="var(--space-10)" />)}</div>
      ) : rows.length === 0 ? (
        <EmptyState icon={<FileSearch size={24} strokeWidth={1.5} />} title="Nenhuma rotina encontrada" description="Nenhum resultado para os filtros atuais." action={<Button onClick={() => navigate({ search: {} })}>Limpar filtros</Button>} />
      ) : (
        <>
          <div className="explorer-sort row-between">
            <div className="row">
              <ArrowDownUp size={14} strokeWidth={1.5} className="muted" aria-hidden />
              <Select aria-label="Ordenar por" value={search.sort ?? "id"} onChange={(e) => patch({ sort: e.target.value })}>
                <option value="id">ID</option><option value="titulo">Título</option><option value="dataExecucao">Executada em</option>
                <option value="divergenciasCount">Divergências</option><option value="menorConfianca">Menor confiança</option>
              </Select>
              <Button size="sm" variant="ghost" onClick={() => patch({ order: search.order === "desc" ? undefined : "desc" })}>{search.order === "desc" ? "Decrescente" : "Crescente"}</Button>
            </div>
            {isFetching && <span className="t-overline-xs">Atualizando…</span>}
          </div>
          <RoutinesTable rows={rows} selected={selected} onToggle={toggle} onToggleAll={toggleAll} />
          <div className="pager">
            <span className="t-body-s">Página {page} de {pages}</span>
            <div className="row">
              <Button size="sm" disabled={page <= 1} onClick={() => navigate({ search: (p) => ({ ...p, page: page - 1 > 1 ? page - 1 : undefined }) })}>Anterior</Button>
              <Button size="sm" disabled={page >= pages} onClick={() => navigate({ search: (p) => ({ ...p, page: page + 1 }) })}>Próxima</Button>
            </div>
          </div>
        </>
      )}
      <ReexecuteDialog open={batchOpen} onClose={() => { setBatchOpen(false); setSelected(new Set()); }} ids={[...selected]} />
    </AppShell>
  );
}
