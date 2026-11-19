import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock, Flag, History, PencilLine, Plus, Send, Sparkles } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  EmptyState,
  Field,
  Input,
  Select,
  Tabs,
  Textarea,
  Tooltip,
} from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import { IngestedRoutineWarningModal } from "@/components/governance/IngestedRoutineWarningModal";
import { useReviewer } from "@/components/governance/useReviewer";
import { useRevisoesRotina, useUpdateRevisao } from "@/hooks/useRotinas";
import { fmtDate } from "@/lib/format";
import { MODULO_LABEL } from "@/lib/status";
import { toast } from "@/lib/toast";
import type { ReviewCategory, ReviewStatus, RoutineReviewItem } from "@/types/api";

export const REVIEW_CATEGORIES: Array<[ReviewCategory, string]> = [
  ["divergencia_texto", "Divergência de texto"],
  ["print_incorreta", "Print incorreta"],
  ["tela_bloqueada", "Tela bloqueada"],
  ["hardware_driver", "Hardware / driver"],
  ["outro", "Outro"],
];

export const REVIEW_CATEGORY_LABEL: Record<ReviewCategory, string> = {
  divergencia_texto: "Divergência de texto",
  print_incorreta: "Print incorreta",
  tela_bloqueada: "Tela bloqueada",
  hardware_driver: "Hardware / driver",
  outro: "Outro",
};

export const REVIEW_STATUS_META: Record<
  ReviewStatus,
  { label: string; badge: "failed" | "warning" | "passed" | "neutral" }
> = {
  aberta: { label: "Aberta", badge: "failed" },
  em_andamento: { label: "Em andamento", badge: "warning" },
  resolvida: { label: "Resolvida", badge: "passed" },
  arquivada: { label: "Arquivada", badge: "neutral" },
};

function useEditReviewState(review: RoutineReviewItem | null, active: boolean, onDone: () => void) {
  const [reviewer, setReviewer] = useReviewer();
  const [tab, setTab] = useState("editar");
  const [status, setStatus] = useState<ReviewStatus>("aberta");
  const [categoria, setCategoria] = useState<ReviewCategory>("divergencia_texto");
  const [passos, setPassos] = useState<number[]>([]);
  const [motivo, setMotivo] = useState("");
  const [resolucao, setResolucao] = useState("");
  const [notaAtualizacao, setNotaAtualizacao] = useState("");
  const [touched, setTouched] = useState(false);

  const m = useUpdateRevisao(review?.routineId);

  useEffect(() => {
    if (active && review) {
      setTab("editar");
      setStatus(review.status);
      setCategoria(review.categoria);
      setPassos(review.passos || []);
      setMotivo(review.motivo);
      setResolucao(review.resolucao ?? "");
      setNotaAtualizacao("");
      setTouched(false);
      m.reset();
    }
  }, [active, review]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalSteps = review ? Math.max(review.rotinaTotalPassos || 0, ...(review.passos || [0])) : 0;
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const motivoErr =
    touched && motivo.trim().length < 10 ? "O motivo precisa de pelo menos 10 caracteres." : undefined;
  const reviewerErr = touched && !reviewer.trim() ? "Informe quem está atualizando." : undefined;

  const save = () => {
    if (!review) return;
    setTouched(true);
    if (motivo.trim().length < 10 || !reviewer.trim()) return;
    m.mutate(
      {
        reviewId: review.id,
        payload: {
          status,
          categoria,
          passos,
          motivo: motivo.trim(),
          resolucao: resolucao.trim() || undefined,
          alteradoPor: reviewer.trim(),
          notaAtualizacao: notaAtualizacao.trim() || undefined,
        },
      },
      {
        onSuccess: (res) => {
          toast("Revisão atualizada", `${review.routineId} salva na versão v${res.revisao.versao}.`);
          onDone();
        },
      },
    );
  };

  return {
    reviewer,
    setReviewer,
    tab,
    setTab,
    status,
    setStatus,
    categoria,
    setCategoria,
    passos,
    setPassos,
    motivo,
    setMotivo,
    resolucao,
    setResolucao,
    notaAtualizacao,
    setNotaAtualizacao,
    stepNumbers,
    motivoErr,
    reviewerErr,
    save,
    isPending: m.isPending,
    error: m.error,
  };
}

function EditReviewContent({
  review,
  state,
  inDrawer = false,
}: {
  review: RoutineReviewItem;
  state: ReturnType<typeof useEditReviewState>;
  inDrawer?: boolean;
}) {
  const {
    reviewer,
    setReviewer,
    tab,
    setTab,
    status,
    setStatus,
    categoria,
    setCategoria,
    passos,
    setPassos,
    motivo,
    setMotivo,
    resolucao,
    setResolucao,
    notaAtualizacao,
    setNotaAtualizacao,
    stepNumbers,
    motivoErr,
    reviewerErr,
    error,
  } = state;

  return (
    <div className="stack-4">
      <div className="row-between">
        <span className="t-body-s dim">{review.rotinaTitulo}</span>
        <div className="row">
          {review.consumidaPeloAgente && (
            <Badge status="neutral" className="ds-badge--ingested" hideDot>
              <Sparkles size={11} strokeWidth={1.6} aria-hidden /> Ingerida (v{review.versaoConsumida ?? review.versao})
            </Badge>
          )}
          <Badge status={REVIEW_STATUS_META[review.status].badge}>
            {REVIEW_STATUS_META[review.status].label}
          </Badge>
        </div>
      </div>

      {review.consumidaPeloAgente && (
        <Alert tone="accent" title="Revisão já consumida anteriormente pelo motor">
          Exportada em {fmtDate(review.consumidaEm)}
          {review.loteExportacaoId ? ` (lote ${review.loteExportacaoId})` : ""}. Salvar uma nova versão marcará esta revisão
          como pendente para entrar no próximo pacote de exportação.
        </Alert>
      )}

      <Tabs
        value={tab}
        onValueChange={setTab}
        items={[
          { value: "editar", label: "Editar revisão" },
          { value: "versoes", label: `Versões (${review.versoes.length || review.versao})` },
        ]}
      />

      {tab === "editar" && (
        <div className="stack-3">
          {error && (
            <Alert tone="error" title="Erro ao atualizar">
              {(error as Error).message}
            </Alert>
          )}
          <div className="cols-2">
            <Field label="Status">
              {(p) => (
                <Select {...p} value={status} onChange={(e) => setStatus(e.target.value as ReviewStatus)}>
                  <option value="aberta">Aberta</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="resolvida">Resolvida</option>
                  <option value="arquivada">Arquivada</option>
                </Select>
              )}
            </Field>
            <Field label="Categoria">
              {(p) => (
                <Select {...p} value={categoria} onChange={(e) => setCategoria(e.target.value as ReviewCategory)}>
                  {REVIEW_CATEGORIES.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>

          {stepNumbers.length > 0 && (
            <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="ds-field__label">Passos afetados</legend>
              <div className="row-3">
                {stepNumbers.map((n) => (
                  <Checkbox
                    key={n}
                    checked={passos.includes(n)}
                    onChange={() =>
                      setPassos((prev) =>
                        prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b),
                      )
                    }
                  >
                    Passo {n}
                  </Checkbox>
                ))}
              </div>
            </fieldset>
          )}

          <Field
            label="Motivo / Orientação para o motor"
            error={motivoErr}
            hint={`${motivo.trim().length}/10 caracteres mínimos`}
          >
            {(p) => (
              <Textarea
                {...p}
                rows={inDrawer ? 4 : undefined}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            )}
          </Field>

          <Field
            label="Resolução / Tratativa aplicada"
            hint="Opcional — registre o que foi corrigido ou decidido após análise."
          >
            {(p) => (
              <Textarea
                {...p}
                rows={inDrawer ? 3 : undefined}
                value={resolucao}
                onChange={(e) => setResolucao(e.target.value)}
                placeholder="Ex.: Regra incorporada no motor e print revalidada na rodada local..."
              />
            )}
          </Field>

          <div className="cols-2">
            <Field label="Atualizado por" error={reviewerErr}>
              {(p) => <Input {...p} value={reviewer} onChange={(e) => setReviewer(e.target.value)} />}
            </Field>
            <Field label="Nota desta atualização (changelog)">
              {(p) => (
                <Input
                  {...p}
                  value={notaAtualizacao}
                  onChange={(e) => setNotaAtualizacao(e.target.value)}
                  placeholder={`Atualizada para v${review.versao + 1}`}
                />
              )}
            </Field>
          </div>
        </div>
      )}

      {tab === "versoes" && (
        <div className="stack-3" style={inDrawer ? undefined : { maxHeight: "50vh", overflowY: "auto" }}>
          {(review.versoes.length > 0 ? review.versoes : []).map((v) => (
            <Card key={v.versao}>
              <div className="stack-2">
                <div className="row-between">
                  <div className="row">
                    <span className="t-mono crimson">v{v.versao}</span>
                    {review.versaoConsumida === v.versao && (
                      <Badge status="neutral" className="ds-badge--ingested" hideDot>
                        <Sparkles size={11} strokeWidth={1.6} aria-hidden /> Versão ingerida
                      </Badge>
                    )}
                    <Badge status={REVIEW_STATUS_META[v.status].badge}>
                      {REVIEW_STATUS_META[v.status].label}
                    </Badge>
                    <span className="chip">{REVIEW_CATEGORY_LABEL[v.categoria]}</span>
                  </div>
                  <span className="t-body-s dim">
                    {fmtDate(v.criadoEm)} · {v.alteradoPor}
                  </span>
                </div>
                {v.notaAtualizacao && (
                  <span className="t-body-s" style={{ color: "var(--color-bone)" }}>
                    <strong>Nota:</strong> {v.notaAtualizacao}
                  </span>
                )}
                <p className="t-body-s" style={{ margin: 0 }}>
                  {v.motivo}
                </p>
                {v.resolucao && (
                  <p className="t-body-s" style={{ margin: 0, color: "var(--color-success)" }}>
                    <strong>Resolução:</strong> {v.resolucao}
                  </p>
                )}
                {v.passos.length > 0 && (
                  <div className="row">
                    {v.passos.map((p) => (
                      <span key={p} className="chip t-mono">
                        Passo {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function EditReviewModal({
  review,
  open,
  onClose,
}: {
  review: RoutineReviewItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const state = useEditReviewState(review, open, onClose);
  if (!review) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Revisão ${review.routineId} · v${review.versao}`}
      footer={
        state.tab === "editar" ? (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" loading={state.isPending} onClick={state.save}>
              Salvar nova versão (v{review.versao + 1})
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Fechar</Button>
        )
      }
    >
      <EditReviewContent review={review} state={state} />
    </Modal>
  );
}

export function ReviewCardList({
  items,
  showRoutineLink = true,
  onEdit,
}: {
  items: RoutineReviewItem[];
  showRoutineLink?: boolean;
  onEdit: (item: RoutineReviewItem) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle2 size={24} strokeWidth={1.5} />}
        title="Nenhuma revisão encontrada"
        description="As revisões registradas pelos colaboradores aparecerão aqui organizadas por status e prontas para exportação."
      />
    );
  }

  return (
    <div className="stack-3">
      {items.map((rev) => {
        const meta = REVIEW_STATUS_META[rev.status];
        const cardClass = rev.editadaPosIngestao
          ? "review-card--ingested-edited"
          : rev.consumidaPeloAgente
            ? "review-card--ingested"
            : rev.pendenteExportacao
              ? "review-card--pending"
              : undefined;

        return (
          <Card key={rev.id} className={cardClass} data-ingested={rev.consumidaPeloAgente ? "true" : "false"}>
            <div className="stack-3">
              <div className="row-between">
                <div className="row" style={{ flexWrap: "wrap" }}>
                  {showRoutineLink && (
                    <Link
                      to="/rotinas/$id"
                      params={{ id: rev.routineId }}
                      className="link-plain t-mono crimson"
                    >
                      {rev.routineId}
                    </Link>
                  )}
                  <AuditStatusBadge
                    status={rev.rotinaStatusAuditoria}
                    reviewTags={rev.rotinaReviewTags}
                    compact
                  />
                  {rev.consumidaPeloAgente && (
                    <Tooltip
                      content={`Exportada e ingerida pelo agente em ${fmtDate(rev.consumidaEm)}${
                        rev.consumidaPor ? ` por ${rev.consumidaPor}` : ""
                      }${rev.loteExportacaoId ? ` (lote ${rev.loteExportacaoId})` : ""}`}
                    >
                      <Badge status="neutral" className="ds-badge--ingested" hideDot tabIndex={0}>
                        <Sparkles size={11} strokeWidth={1.6} aria-hidden />
                        Ingerida pelo agente
                      </Badge>
                    </Tooltip>
                  )}
                  {rev.editadaPosIngestao ? (
                    <Badge status="warning" className="ds-badge--ingested-edited" hideDot>
                      <Send size={11} strokeWidth={1.6} aria-hidden />
                      Editada pós-ingestão (v{rev.versaoConsumida} → v{rev.versao})
                    </Badge>
                  ) : rev.pendenteExportacao ? (
                    <Badge status="running" className="ds-badge--pending-export" hideDot>
                      <Send size={11} strokeWidth={1.6} aria-hidden />
                      Pendente exportar p/ agente
                    </Badge>
                  ) : null}
                  <Badge status={meta.badge}>{meta.label}</Badge>
                  <span className="chip">{REVIEW_CATEGORY_LABEL[rev.categoria]}</span>
                  <span className="chip t-mono">
                    <History size={12} strokeWidth={1.5} /> v{rev.versao}
                  </span>
                  <span className="chip">{MODULO_LABEL[rev.rotinaModulo] ?? rev.rotinaModulo}</span>
                </div>
                <Button size="sm" onClick={() => onEdit(rev)}>
                  <PencilLine size={14} strokeWidth={1.5} /> Editar / Versões
                </Button>
              </div>

              {showRoutineLink && (
                <Link
                  to="/rotinas/$id"
                  params={{ id: rev.routineId }}
                  className="link-plain t-h3"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {rev.rotinaTitulo}
                </Link>
              )}

              <p className="t-body-s" style={{ margin: 0, color: "var(--color-bone)" }}>
                {rev.motivo}
              </p>

              {rev.resolucao && (
                <div className="review-resolution-box">
                  <span className="t-overline-xs" style={{ color: "var(--color-success)" }}>
                    Resolução
                  </span>
                  <p className="t-body-s" style={{ margin: 0 }}>
                    {rev.resolucao}
                  </p>
                </div>
              )}

              <Divider style={{ margin: 0 }} />

              <div className="row-between" style={{ flexWrap: "wrap", gap: "var(--space-2)" }}>
                <div className="row" style={{ flexWrap: "wrap" }}>
                  {rev.passos.length > 0 ? (
                    rev.passos.map((p) => (
                      <span key={p} className="chip t-mono">
                        Passo {p}
                      </span>
                    ))
                  ) : (
                    <span className="t-body-s dim">Rotina inteira</span>
                  )}
                  {rev.loteExportacaoId && (
                    <span className="chip t-mono ingested">Lote {rev.loteExportacaoId}</span>
                  )}
                </div>
                <span className="t-body-s dim icon-inline">
                  <Clock size={12} strokeWidth={1.5} />
                  {rev.revisor} em {fmtDate(rev.criadoEm)} · Atualizada {fmtDate(rev.atualizadoEm)} (
                  {rev.atualizadoPor})
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function InlineEditReviewDrawer({
  open,
  review,
  onBack,
  onClose,
}: {
  open: boolean;
  review: RoutineReviewItem;
  onBack: () => void;
  onClose: () => void;
}) {
  const state = useEditReviewState(review, open, onBack);

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      kicker="Editando revisão · Painel acoplado"
      title={`Revisão ${review.routineId} · v${review.versao}`}
      headerAction={
        <Button variant="ghost" size="sm" onClick={onBack} aria-label="Voltar para revisões">
          <ArrowLeft size={14} strokeWidth={1.5} /> Voltar
        </Button>
      }
      footer={
        state.tab === "editar" ? (
          <>
            <Button variant="ghost" onClick={onBack}>
              Cancelar
            </Button>
            <Button variant="primary" loading={state.isPending} onClick={state.save}>
              Salvar nova versão (v{review.versao + 1})
            </Button>
          </>
        ) : (
          <Button onClick={onBack}>Voltar à lista</Button>
        )
      }
    >
      <EditReviewContent review={review} state={state} inDrawer />
    </SideDrawer>
  );
}

export interface RoutineReviewsProps {
  routineId: string;
  routineTitle: string;
  open: boolean;
  onClose: () => void;
  onNewReview: () => void;
  variant?: "modal" | "drawer";
}

export function RoutineReviewsModal({
  routineId,
  routineTitle,
  open,
  onClose,
  onNewReview,
  variant = "modal",
}: RoutineReviewsProps) {
  const { data, isLoading } = useRevisoesRotina(routineId);
  const [editingReview, setEditingReview] = useState<RoutineReviewItem | null>(null);
  const [pendingWarningReview, setPendingWarningReview] = useState<RoutineReviewItem | null>(null);
  const items = data?.data ?? [];

  useEffect(() => {
    if (!open) {
      setEditingReview(null);
      setPendingWarningReview(null);
    }
  }, [open, routineId]);

  const requestEditReview = (item: RoutineReviewItem) => {
    if (item.consumidaPeloAgente) {
      setPendingWarningReview(item);
      return;
    }
    setEditingReview(item);
  };

  const listBody = (
    <div
      className="stack-4"
      style={variant === "drawer" ? undefined : { maxHeight: "65vh", overflowY: "auto" }}
    >
      <div className="row-between">
        <span className="t-body-s dim">{routineTitle}</span>
        <Badge
          status={
            items.some((i) => i.status === "aberta" || i.status === "em_andamento")
              ? "warning"
              : "neutral"
          }
        >
          <Flag size={12} strokeWidth={1.5} /> {items.length} revisão(ões)
        </Badge>
      </div>
      {isLoading ? (
        <p className="t-body-s dim">Carregando revisões...</p>
      ) : (
        <ReviewCardList items={items} showRoutineLink={false} onEdit={requestEditReview} />
      )}
    </div>
  );

  const footer = (
    <>
      <Link to="/revisoes" className="link-plain">
        <Button variant="ghost">Abrir biblioteca geral</Button>
      </Link>
      <Button
        variant="primary"
        onClick={() => {
          if (variant === "modal") onClose();
          onNewReview();
        }}
      >
        <Plus size={14} strokeWidth={1.5} /> Nova revisão
      </Button>
    </>
  );

  const warningModal = pendingWarningReview ? (
    <IngestedRoutineWarningModal
      open
      routineId={pendingWarningReview.routineId}
      routineTitle={pendingWarningReview.rotinaTitulo}
      action="edit_review"
      ultimaIngestaoEm={pendingWarningReview.consumidaEm}
      ultimaIngestaoPor={pendingWarningReview.consumidaPor}
      ultimoLoteIngestaoId={pendingWarningReview.loteExportacaoId}
      onCancel={() => setPendingWarningReview(null)}
      onConfirm={() => {
        const rev = pendingWarningReview;
        setPendingWarningReview(null);
        setEditingReview(rev);
      }}
    />
  ) : null;

  if (variant === "drawer") {
    if (editingReview) {
      return (
        <InlineEditReviewDrawer
          open={open}
          review={editingReview}
          onBack={() => setEditingReview(null)}
          onClose={onClose}
        />
      );
    }
    return (
      <>
        <SideDrawer
          open={open}
          onClose={onClose}
          kicker="Últimas revisões · Painel acoplado"
          title={`Últimas Revisões · ${routineId}`}
          footer={footer}
        >
          {listBody}
        </SideDrawer>
        {warningModal}
      </>
    );
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={`Últimas Revisões · ${routineId}`}
        footer={footer}
      >
        {listBody}
      </Modal>
      <EditReviewModal
        review={editingReview}
        open={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
      />
      {warningModal}
    </>
  );
}

export function RoutineReviewsDrawer(props: Omit<RoutineReviewsProps, "variant">) {
  return <RoutineReviewsModal {...props} variant="drawer" />;
}
