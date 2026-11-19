import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileCode2, FileText, Flag, PackageCheck, Sparkles } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  Skeleton,
  Tabs,
} from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { IngestedRoutineWarningModal } from "@/components/governance/IngestedRoutineWarningModal";
import { ExportReviewsModal } from "@/components/reviews/ExportReviewsModal";
import { EditReviewModal, REVIEW_CATEGORIES, ReviewCardList } from "@/components/reviews/ReviewLibrary";
import { useDownloadLoteRevisoes, useRevisoes } from "@/hooks/useRotinas";
import { triggerTextDownload } from "@/lib/download";
import { fmtDate } from "@/lib/format";
import { MODULO_LABEL } from "@/lib/status";
import { toast } from "@/lib/toast";
import type { Modulo, ReviewCategory, ReviewStatus, RoutineReviewItem } from "@/types/api";

export const Route = createFileRoute("/revisoes")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Revisões & Exportação · Orion Audit Console" },
      {
        name: "description",
        content:
          "Central de revisões humanas e exportação em massa para calibragem e geração de conhecimento do motor.",
      },
      { property: "og:title", content: "Revisões & Exportação · Orion Audit Console" },
      {
        property: "og:description",
        content: "Gerencie revisões humanas, exporte pacotes para o Antigravity e acompanhe rotinas ingeridas.",
      },
    ],
  }),
  component: RevisoesPage,
});

const MODULOS: Modulo[] = [
  "acesso",
  "caixa",
  "centrais",
  "certidoes",
  "comunicacao",
  "config",
  "firmas",
  "geral",
  "livros",
  "notas",
  "selos",
];

function RevisoesPage() {
  const [tab, setTab] = useState("revisoes");
  const [ingestao, setIngestao] = useState<"todas" | "pendentes" | "consumidas">("todas");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ReviewStatus | "">("");
  const [categoria, setCategoria] = useState<ReviewCategory | "">("");
  const [modulo, setModulo] = useState<Modulo | "">("");
  const [editing, setEditing] = useState<RoutineReviewItem | null>(null);
  const [warningReview, setWarningReview] = useState<RoutineReviewItem | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const { data: allData } = useRevisoes({});
  const { data, isLoading } = useRevisoes({
    q: q.trim() || undefined,
    status: status || undefined,
    categoria: categoria || undefined,
    modulo: modulo || undefined,
    ingestao: ingestao === "todas" ? undefined : ingestao,
  });

  const downloadBatch = useDownloadLoteRevisoes();

  const meta = data?.meta ?? allData?.meta;
  const items = data?.data ?? [];
  const allItems = allData?.data ?? items;
  const lotes = data?.lotes ?? allData?.lotes ?? [];
  const pendingCount = meta?.pendentesExportacao ?? 0;

  const handleRequestEdit = (rev: RoutineReviewItem) => {
    if (rev.consumidaPeloAgente) {
      setWarningReview(rev);
      return;
    }
    setEditing(rev);
  };

  const handleRedownload = (batchId: string, formato: "markdown" | "json") => {
    downloadBatch.mutate(
      { batchId, formato },
      {
        onSuccess: (res) => {
          triggerTextDownload(res.filename, res.content, res.mimeType);
          toast("Lote baixado", `${res.filename} (${res.totalRevisoes} revisões).`);
        },
        onError: (e) => toast.error("Erro ao baixar lote", (e as Error).message),
      },
    );
  };

  return (
    <AppShell crumbs={[{ label: "Painel", to: "/" }, { label: "Revisões & Exportação" }]}>
      <div className="page-head">
        <div className="page-head-text">
          <span className="t-overline">Calibragem & Geração de Conhecimento</span>
          <h1 className="t-h1 icon-inline">
            <Flag size={26} strokeWidth={1.5} /> Revisões & Exportação
          </h1>
          <p className="t-body">
            Todas as observações feitas pela equipe em cada rotina. Exporte os pacotes em massa para analisar no
            Antigravity e marque automaticamente as rotinas já ingeridas pelo agente.
          </p>
        </div>
        <div className="row">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setExportOpen(true)}
            data-testid="open-export-reviews"
          >
            <Download size={15} strokeWidth={1.6} />
            {pendingCount > 0
              ? `Exportar revisões p/ agente (${pendingCount})`
              : "Exportar revisões"}
          </Button>
        </div>
      </div>

      <div className="stage-pills" role="group" aria-label="Filtro por estado de ingestão">
        <button
          type="button"
          className="stage-pill"
          aria-pressed={ingestao === "todas"}
          onClick={() => setIngestao("todas")}
        >
          <span>Todas as revisões</span>
          <span className="stage-pill__count">{allItems.length}</span>
        </button>
        <button
          type="button"
          className="stage-pill"
          data-tone="pending"
          aria-pressed={ingestao === "pendentes"}
          onClick={() => setIngestao("pendentes")}
        >
          <span className="stage-pill__dot" style={{ background: "var(--color-crimson)" }} aria-hidden />
          <span>Pendentes p/ exportar ao agente</span>
          <span className="stage-pill__count">{meta?.pendentesExportacao ?? 0}</span>
        </button>
        <button
          type="button"
          className="stage-pill"
          data-tone="ingested"
          aria-pressed={ingestao === "consumidas"}
          onClick={() => setIngestao("consumidas")}
        >
          <span className="stage-pill__dot" style={{ background: "var(--color-ingested)" }} aria-hidden />
          <span>Já ingeridas pelo agente</span>
          <span className="stage-pill__count">{meta?.consumidas ?? 0}</span>
        </button>
      </div>

      <Tabs
        value={tab}
        onValueChange={setTab}
        items={[
          { value: "revisoes", label: `Revisões (${items.length})` },
          { value: "lotes", label: `Lotes exportados (${lotes.length})` },
        ]}
      />

      {tab === "revisoes" && (
        <>
          <div className="reviews-toolbar">
            <div style={{ flex: "1 1 260px" }}>
              <Input
                placeholder="Buscar por rotina (ID/título), motivo, revisor, resolução ou lote..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Buscar revisões"
              />
            </div>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as ReviewStatus | "")}
              aria-label="Filtrar por status"
            >
              <option value="">Todos os status</option>
              <option value="aberta">Aberta</option>
              <option value="em_andamento">Em andamento</option>
              <option value="resolvida">Resolvida</option>
              <option value="arquivada">Arquivada</option>
            </Select>
            <Select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as ReviewCategory | "")}
              aria-label="Filtrar por categoria"
            >
              <option value="">Todas as categorias</option>
              {REVIEW_CATEGORIES.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
            <Select
              value={modulo}
              onChange={(e) => setModulo(e.target.value as Modulo | "")}
              aria-label="Filtrar por módulo"
            >
              <option value="">Todos os módulos</option>
              {MODULOS.map((m) => (
                <option key={m} value={m}>
                  {MODULO_LABEL[m]}
                </option>
              ))}
            </Select>
          </div>

          {isLoading ? (
            <Skeleton height="calc(var(--space-32) * 2)" />
          ) : (
            <ReviewCardList items={items} showRoutineLink onEdit={handleRequestEdit} />
          )}
        </>
      )}

      {tab === "lotes" && (
        <div className="stack-3" data-testid="export-batches-list">
          {lotes.length === 0 ? (
            <EmptyState
              icon={<PackageCheck size={24} strokeWidth={1.5} />}
              title="Nenhum lote exportado ainda"
              description="Quando você exportar revisões marcando-as como ingeridas pelo agente, o histórico de lotes aparecerá aqui para re-download e rastreabilidade."
              action={
                <Button variant="primary" onClick={() => setExportOpen(true)}>
                  <Download size={14} strokeWidth={1.5} /> Exportar primeiro lote
                </Button>
              }
            />
          ) : (
            lotes.map((b) => (
              <Card key={b.id} className="review-card--ingested">
                <div className="stack-3">
                  <div className="row-between">
                    <div className="row">
                      <Badge status="neutral" className="ds-badge--ingested" hideDot>
                        <Sparkles size={11} strokeWidth={1.6} aria-hidden />
                        {b.id}
                      </Badge>
                      <span className="chip t-mono">{b.totalRevisoes} revisão(ões)</span>
                      <span className="chip t-mono">{b.totalRotinas} rotina(s)</span>
                      <span className="t-body-s dim">
                        {b.operador} · {fmtDate(b.criadoEm)}
                      </span>
                    </div>
                    <div className="row">
                      <Button
                        size="sm"
                        loading={downloadBatch.isPending}
                        onClick={() => handleRedownload(b.id, "markdown")}
                      >
                        <FileText size={13} strokeWidth={1.5} /> Baixar .md
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        loading={downloadBatch.isPending}
                        onClick={() => handleRedownload(b.id, "json")}
                      >
                        <FileCode2 size={13} strokeWidth={1.5} /> .json
                      </Button>
                    </div>
                  </div>
                  {b.nota && (
                    <p className="t-body-s" style={{ margin: 0, color: "var(--color-bone)" }}>
                      {b.nota}
                    </p>
                  )}
                  <div className="row">
                    {b.routineIds.map((rid) => (
                      <Link key={rid} to="/rotinas/$id" params={{ id: rid }} className="link-plain">
                        <span className="chip t-mono">{rid}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      <EditReviewModal
        review={editing}
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
      />

      {warningReview && (
        <IngestedRoutineWarningModal
          open
          routineId={warningReview.routineId}
          routineTitle={warningReview.rotinaTitulo}
          action="edit_review"
          ultimaIngestaoEm={warningReview.consumidaEm}
          ultimaIngestaoPor={warningReview.consumidaPor}
          ultimoLoteIngestaoId={warningReview.loteExportacaoId}
          onCancel={() => setWarningReview(null)}
          onConfirm={() => {
            const rev = warningReview;
            setWarningReview(null);
            setEditing(rev);
          }}
        />
      )}

      <ExportReviewsModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        allReviews={allItems}
        filteredReviews={items}
      />
    </AppShell>
  );
}
