import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import { Badge, Input, Select, Skeleton } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { EditReviewModal, REVIEW_CATEGORIES, ReviewCardList } from "@/components/reviews/ReviewLibrary";
import { useRevisoes } from "@/hooks/useRotinas";
import { MODULO_LABEL } from "@/lib/status";
import type { Modulo, ReviewCategory, ReviewStatus, RoutineReviewItem } from "@/types/api";

export const Route = createFileRoute("/revisoes")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Revisões · Orion Audit Console" },
      { name: "description", content: "Biblioteca centralizada de revisões marcadas nas rotinas, com histórico de versões e edição." },
      { property: "og:title", content: "Revisões · Orion Audit Console" },
      { property: "og:description", content: "Gerencie e versione revisões de todas as rotinas." },
    ],
  }),
  component: RevisoesPage,
});

const MODULOS: Modulo[] = [
  "acesso", "caixa", "centrais", "certidoes", "comunicacao", "config", "firmas", "geral", "livros", "notas", "selos",
];

function RevisoesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ReviewStatus | "">("");
  const [categoria, setCategoria] = useState<ReviewCategory | "">("");
  const [modulo, setModulo] = useState<Modulo | "">("");
  const [editing, setEditing] = useState<RoutineReviewItem | null>(null);

  const { data, isLoading } = useRevisoes({
    q: q.trim() || undefined,
    status: status || undefined,
    categoria: categoria || undefined,
    modulo: modulo || undefined,
  });

  const meta = data?.meta;
  const items = data?.data ?? [];

  return (
    <AppShell crumbs={[{ label: "Dashboard", to: "/" }, { label: "Revisões" }]}>
      <div className="page-head">
        <div className="page-head-text">
          <span className="t-overline">Biblioteca de Governança</span>
          <h1 className="t-h1 icon-inline"><Flag size={26} strokeWidth={1.5} /> Biblioteca de Revisões</h1>
          <p className="t-body">
            Todas as revisões marcadas nas rotinas, com histórico completo de versões e edição contínua.
          </p>
        </div>
        {meta && (
          <div className="row" style={{ flexWrap: "wrap" }}>
            <Badge status="failed">{meta.abertas} abertas</Badge>
            <Badge status="warning">{meta.emAndamento} em andamento</Badge>
            <Badge status="passed">{meta.resolvidas} resolvidas</Badge>
            <Badge status="neutral">{meta.arquivadas} arquivadas</Badge>
          </div>
        )}
      </div>

      <div className="reviews-toolbar">
        <div style={{ flex: "1 1 260px" }}>
          <Input
            placeholder="Buscar por rotina (ID/título), motivo, revisor ou resolução..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar revisões"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value as ReviewStatus | "")} aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          <option value="aberta">Aberta</option>
          <option value="em_andamento">Em andamento</option>
          <option value="resolvida">Resolvida</option>
          <option value="arquivada">Arquivada</option>
        </Select>
        <Select value={categoria} onChange={(e) => setCategoria(e.target.value as ReviewCategory | "")} aria-label="Filtrar por categoria">
          <option value="">Todas as categorias</option>
          {REVIEW_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
        <Select value={modulo} onChange={(e) => setModulo(e.target.value as Modulo | "")} aria-label="Filtrar por módulo">
          <option value="">Todos os módulos</option>
          {MODULOS.map((m) => <option key={m} value={m}>{MODULO_LABEL[m]}</option>)}
        </Select>
      </div>

      {isLoading ? (
        <Skeleton height="calc(var(--space-32) * 2)" />
      ) : (
        <ReviewCardList items={items} showRoutineLink onEdit={setEditing} />
      )}

      <EditReviewModal review={editing} open={Boolean(editing)} onClose={() => setEditing(null)} />
    </AppShell>
  );
}
