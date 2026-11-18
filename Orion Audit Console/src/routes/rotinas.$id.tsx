import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useBlocker } from "@tanstack/react-router";
import { FileQuestion, Globe } from "lucide-react";
import { Alert, Button, EmptyState, Field, Skeleton, Tabs, Textarea } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { StepComparisonCard } from "@/components/studio/StepComparisonCard";
import { BlockedBanner } from "@/components/studio/BlockedBanner";
import { AttScreenDiagnosisCard } from "@/components/studio/AttScreenDiagnosisCard";
import { ReauditTimeline } from "@/components/studio/ReauditTimeline";
import { ExternalStepCard } from "@/components/studio/ExternalStepCard";
import { Filmstrip } from "@/components/studio/Filmstrip";
import { MarkdownPreview } from "@/components/studio/MarkdownPreview";
import { FrontmatterView } from "@/components/studio/FrontmatterView";
import { TelemetryView } from "@/components/studio/TelemetryView";
import { HistoryTimeline } from "@/components/studio/HistoryTimeline";
import { ScreenshotViewer } from "@/components/studio/ScreenshotViewer";
import { ApproveDialog } from "@/components/governance/ApproveDialog";
import { ReviewDrawer } from "@/components/governance/ReviewDialog";
import { ReexecuteDialog } from "@/components/governance/ReexecuteDialog";
import { EditModeToolbar } from "@/components/governance/EditModeToolbar";
import { RoutineReviewsDrawer } from "@/components/reviews/ReviewLibrary";
import { useRotina, useRotinas } from "@/hooks/useRotinas";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { tagsOfSummary } from "@/lib/status";
import { toListQuery, validateRotinasSearch } from "@/lib/search";
import { estimateTokens, lintText } from "@/lib/lint";
import { ApiError } from "@/services/api";

export const Route = createFileRoute("/rotinas/$id")({
  head: ({ params }) => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: `${params.id} · Estúdio de Inspeção · Orion Audit Console` },
      { name: "description", content: `Inspeção visual, comparação de texto e governança da rotina ${params.id}.` },
      { property: "og:title", content: `${params.id} · Estúdio de Inspeção` },
      { property: "og:description", content: `Inspeção e aprovação da rotina ${params.id}.` },
    ],
  }),
  component: Estudio,
});

const TABS = [
  { value: "passos", label: "Passo a passo" }, { value: "markdown", label: "Markdown revisado" },
  { value: "frontmatter", label: "Frontmatter" }, { value: "telemetria", label: "Telemetria" }, { value: "historico", label: "Histórico" },
];

function useExplorerOrder() {
  const [search, setSearch] = useState({});
  useEffect(() => { try { setSearch(validateRotinasSearch(JSON.parse(sessionStorage.getItem("orion.explorer.search") ?? "{}"))); } catch { /* ignora */ } }, []);
  const { data } = useRotinas({ ...toListQuery(search, 500), page: 1 });
  return data?.data.map((r) => r.id) ?? [];
}

function Estudio() {
  const { id } = Route.useParams();
  const { data: rotina, isLoading, error } = useRotina(id);
  const order = useExplorerOrder();
  const [tab, setTab] = useState("passos");
  const [active, setActive] = useState(1);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [descDraft, setDescDraft] = useState<string | undefined>();
  const [dialog, setDialog] = useState<null | "approve" | "reexec">(null);
  const [drawer, setDrawer] = useState<null | "review" | "reviews">(null);
  const [leftPct, setLeftPct] = useState(45);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setActive(1); setEditing(false); setDrafts({}); setDescDraft(undefined); setDrawer(null); }, [id]);

  const dirty = editing && rotina ? Object.entries(drafts).some(([n, v]) => rotina.steps.find((s) => s.stepNumber === Number(n))?.validatedText !== v) || (descDraft !== undefined && descDraft !== rotina.original.descricao) : false;
  useBlocker({ shouldBlockFn: () => !window.confirm("Há edições não salvas. Deseja sair mesmo assim?"), disabled: !dirty });

  const select = (n: number, scroll = true) => {
    setActive(n);
    if (scroll && tab === "passos") cardRefs.current[n]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const activeStep = rotina?.steps.find((s) => s.stepNumber === active);
  const isExternalActive = activeStep?.stepScope === "external_portal";
  const stepIdx = rotina ? rotina.steps.findIndex((s) => s.stepNumber === active) : -1;
  const goExternalStep = (d: number) => {
    if (!rotina) return;
    const next = rotina.steps[stepIdx + d];
    if (next) select(next.stepNumber);
  };
  useKeyboardShortcuts(
    {
      ArrowRight: () => goExternalStep(1),
      ArrowLeft: () => goExternalStep(-1),
      j: () => goExternalStep(1),
      k: () => goExternalStep(-1),
    },
    isExternalActive,
  );

  const idx = order.indexOf(id);
  const allText = useMemo(() => {
    if (!rotina) return "";
    return [descDraft ?? rotina.original.descricao, ...rotina.steps.map((s) => drafts[s.stepNumber] ?? s.validatedText)].join("\n");
  }, [rotina, drafts, descDraft]);
  const issues = lintText(allText);
  const edicoes = rotina ? Object.entries(drafts).map(([n, v]) => ({ stepNumber: Number(n), validatedText: v })) : [];

  const startResize = (e: React.PointerEvent) => {
    const box = bodyRef.current?.getBoundingClientRect(); if (!box) return;
    const move = (ev: PointerEvent) => setLeftPct(Math.min(70, Math.max(25, ((ev.clientX - box.left) / box.width) * 100)));
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    e.preventDefault();
  };

  const crumbs = [{ label: "Dashboard", to: "/" }, { label: "Explorador", to: "/rotinas" }, { label: id }];

  if (error) {
    const nf = error instanceof ApiError && error.status === 404;
    return (
      <AppShell crumbs={crumbs}>
        {nf ? <EmptyState icon={<FileQuestion size={24} strokeWidth={1.5} />} title="Rotina não encontrada" description={`Não existe rotina com o ID ${id}.`} action={<Link to="/rotinas"><Button>Voltar ao Explorador</Button></Link>} />
          : <Alert tone="error" title="Erro ao carregar a rotina">{(error as Error).message}</Alert>}
      </AppShell>
    );
  }

  if (isLoading || !rotina) {
    return (
      <AppShell crumbs={crumbs}>
        <Skeleton height="var(--space-24)" />
        <div className="cols-2"><Skeleton height="calc(var(--space-32) * 3)" /><Skeleton height="calc(var(--space-32) * 3)" /></div>
      </AppShell>
    );
  }

  return (
    <AppShell crumbs={crumbs} flush autoCollapseSidebar={Boolean(drawer)}>
      <div className="studio">
        <StudioHeader rotina={rotina} prevId={idx > 0 ? order[idx - 1] : undefined} nextId={idx >= 0 && idx < order.length - 1 ? order[idx + 1] : undefined}
          editing={editing} activeDrawer={drawer}
          onApprove={() => setDialog("approve")}
          onEdit={() => { setEditing(true); setTab("passos"); }}
          onReview={() => setDrawer((d) => (d === "review" ? null : "review"))}
          onOpenReviews={() => setDrawer((d) => (d === "reviews" ? null : "reviews"))}
          onReexecute={() => setDialog("reexec")} />
        <div className="studio-workspace" data-drawer-open={Boolean(drawer)}>
          <div className="studio-body" ref={bodyRef} style={{ ["--studio-left" as string]: `${leftPct}%` }}>
          <section className="studio-pane" aria-label="Texto">
            <div className="stack-4">
              {rotina.bloqueio && (
                <BlockedBanner
                  bloqueio={rotina.bloqueio}
                  statusAuditoria={rotina.summary.statusAuditoria}
                  reviewTags={tagsOfSummary(rotina.summary)}
                />
              )}
              <AttScreenDiagnosisCard diagnostico={rotina.auditoriaUi?.diagnostico_tela_att} />
              {editing && (
                <EditModeToolbar tokens={estimateTokens(allText)} errors={issues.filter((i) => i.level === "error").length} warnings={issues.filter((i) => i.level === "warning").length}
                  dirty={dirty} onDiscard={() => { setEditing(false); setDrafts({}); setDescDraft(undefined); }} onSaveApprove={() => setDialog("approve")} />
              )}
              <Tabs items={TABS} value={tab} onValueChange={setTab} />
              {tab === "passos" && (
                <div className="stack-3">
                  {editing && (
                    <Field label="Descrição">
                      {(p) => <Textarea {...p} value={descDraft ?? rotina.original.descricao} onChange={(e) => setDescDraft(e.target.value)} />}
                    </Field>
                  )}
                  {rotina.steps.map((s) => (
                    <StepComparisonCard key={s.stepNumber} ref={(el) => { cardRefs.current[s.stepNumber] = el; }} step={s} active={s.stepNumber === active}
                      onSelect={() => select(s.stepNumber, false)} editing={editing} draft={drafts[s.stepNumber]}
                      onDraft={(v) => setDrafts((d) => ({ ...d, [s.stepNumber]: v }))} />
                  ))}
                </div>
              )}
              {tab === "markdown" && <MarkdownPreview markdown={rotina.markdownRevisado} steps={rotina.steps} onSelect={(n) => select(n, false)} />}
              {tab === "frontmatter" && <FrontmatterView original={rotina.frontmatterOriginalYaml} revisado={rotina.frontmatterRevisadoYaml} />}
              {tab === "telemetria" && <TelemetryView step={activeStep} />}
              {tab === "historico" && (
                <div className="stack-4">
                  <ReauditTimeline historico={rotina.auditoriaUi?.historico_reauditoria} />
                  <HistoryTimeline events={rotina.historico} />
                </div>
              )}
            </div>
          </section>
          <div className="studio-resizer" role="separator" aria-orientation="vertical" aria-label="Redimensionar painéis" tabIndex={0} onPointerDown={startResize}
            onKeyDown={(e) => { if (e.key === "ArrowLeft") setLeftPct((p) => Math.max(25, p - 2)); if (e.key === "ArrowRight") setLeftPct((p) => Math.min(70, p + 2)); }} />
          <section className="studio-pane studio-pane--right" aria-label="Visualizador de prints">
            {isExternalActive && activeStep ? (
              <>
                <div className="row-between">
                  <span className="t-overline-xs">
                    <Globe size={12} strokeWidth={1.5} aria-hidden /> Passo {activeStep.stepNumber} de {rotina.steps.length} · Etapa Externa
                  </span>
                </div>
                <div className="viewer viewer--external">
                  <ExternalStepCard step={activeStep} steps={rotina.steps} onSelect={(n) => select(n)} />
                </div>
                <Filmstrip steps={rotina.steps} active={active} onSelect={(n) => select(n)} />
              </>
            ) : (
              <ScreenshotViewer steps={rotina.steps} active={active} onSelect={(n) => select(n)} bloqueioTipo={rotina.steps.every((s) => !s.media) ? rotina.bloqueio?.tipo : undefined} />
            )}
          </section>
          </div>
          <ReviewDrawer
            open={drawer === "review"}
            onClose={() => setDrawer(null)}
            rotina={rotina}
            activeStepNumber={active}
            reviewsCount={rotina.revisoes?.length ?? 0}
            onOpenReviews={() => setDrawer("reviews")}
          />
          <RoutineReviewsDrawer
            open={drawer === "reviews"}
            onClose={() => setDrawer(null)}
            routineId={rotina.summary.id}
            routineTitle={rotina.summary.titulo}
            onNewReview={() => setDrawer("review")}
          />
        </div>
      </div>
      <ApproveDialog open={dialog === "approve"} onClose={() => setDialog(null)} rotina={rotina} edicoes={editing ? edicoes : undefined} descricao={editing ? descDraft : undefined}
        onApproved={() => { setEditing(false); setDrafts({}); setDescDraft(undefined); }} />
      <ReexecuteDialog open={dialog === "reexec"} onClose={() => setDialog(null)} rotina={rotina} />
    </AppShell>
  );
}
