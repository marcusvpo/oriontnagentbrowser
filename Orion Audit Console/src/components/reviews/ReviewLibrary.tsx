import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Flag, History, PencilLine, Plus } from "lucide-react";
import {
  Alert, Badge, Button, Card, Checkbox, Divider, EmptyState, Field, Input, Select, Tabs, Textarea,
} from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import { useReviewer } from "@/components/governance/useReviewer";
import { useRevisoesRotina, useUpdateRevisao } from "@/hooks/useRotinas";
import { fmtDate } from "@/lib/format";
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

export const REVIEW_STATUS_META: Record<ReviewStatus, { label: string; badge: "failed" | "warning" | "passed" | "neutral" }> = {
  aberta: { label: "Aberta", badge: "failed" },
  em_andamento: { label: "Em andamento", badge: "warning" },
  resolvida: { label: "Resolvida", badge: "passed" },
  arquivada: { label: "Arquivada", badge: "neutral" },
};

export function EditReviewModal({
  review,
  open,
  onClose,
}: {
  review: RoutineReviewItem | null;
  open: boolean;
  onClose: () => void;
}) {
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
    if (open && review) {
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
  }, [open, review]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!review) return null;

  const totalSteps = Math.max(review.rotinaTotalPassos || 0, ...(review.passos || [0]));
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const motivoErr = touched && motivo.trim().length < 10 ? "O motivo precisa de pelo menos 10 caracteres." : undefined;
  const reviewerErr = touched && !reviewer.trim() ? "Informe quem está atualizando." : undefined;

  const save = () => {
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
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Revisão ${review.routineId} · v${review.versao}`}
      footer={
        tab === "editar" ? (
          <>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" loading={m.isPending} onClick={save}>
              Salvar nova versão (v{review.versao + 1})
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Fechar</Button>
        )
      }
    >
      <div className="stack-4">
        <div className="row-between">
          <span className="t-body-s dim">{review.rotinaTitulo}</span>
          <Badge status={REVIEW_STATUS_META[review.status].badge}>{REVIEW_STATUS_META[review.status].label}</Badge>
        </div>

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
            {m.error && <Alert tone="error" title="Erro ao atualizar">{(m.error as Error).message}</Alert>}
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
                    {REVIEW_CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
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
                      onChange={() => setPassos((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b)))}
                    >
                      Passo {n}
                    </Checkbox>
                  ))}
                </div>
              </fieldset>
            )}

            <Field label="Motivo / Descrição da revisão" error={motivoErr} hint={`${motivo.trim().length}/10 caracteres mínimos`}>
              {(p) => <Textarea {...p} value={motivo} onChange={(e) => setMotivo(e.target.value)} />}
            </Field>

            <Field label="Resolução / Tratativa aplicada" hint="Opcional — registre o que foi corrigido ou decidido.">
              {(p) => <Textarea {...p} value={resolucao} onChange={(e) => setResolucao(e.target.value)} placeholder="Ex.: Print recapturada em 1440x900 e texto do passo 3 ajustado..." />}
            </Field>

            <div className="cols-2">
              <Field label="Atualizado por" error={reviewerErr}>
                {(p) => <Input {...p} value={reviewer} onChange={(e) => setReviewer(e.target.value)} />}
              </Field>
              <Field label="Nota desta atualização (changelog)">
                {(p) => <Input {...p} value={notaAtualizacao} onChange={(e) => setNotaAtualizacao(e.target.value)} placeholder={`Atualizada para v${review.versao + 1}`} />}
              </Field>
            </div>
          </div>
        )}

        {tab === "versoes" && (
          <div className="stack-3" style={{ maxHeight: "50vh", overflowY: "auto" }}>
            {(review.versoes.length > 0 ? review.versoes : []).map((v) => (
              <Card key={v.versao}>
                <div className="stack-2">
                  <div className="row-between">
                    <div className="row">
                      <span className="t-mono crimson">v{v.versao}</span>
                      <Badge status={REVIEW_STATUS_META[v.status].badge}>{REVIEW_STATUS_META[v.status].label}</Badge>
                      <span className="chip">{REVIEW_CATEGORY_LABEL[v.categoria]}</span>
                    </div>
                    <span className="t-body-s dim">{fmtDate(v.criadoEm)} · {v.alteradoPor}</span>
                  </div>
                  {v.notaAtualizacao && (
                    <span className="t-body-s" style={{ color: "var(--color-bone)" }}>
                      <strong>Nota:</strong> {v.notaAtualizacao}
                    </span>
                  )}
                  <p className="t-body-s" style={{ margin: 0 }}>{v.motivo}</p>
                  {v.resolucao && (
                    <p className="t-body-s" style={{ margin: 0, color: "var(--color-success)" }}>
                      <strong>Resolução:</strong> {v.resolucao}
                    </p>
                  )}
                  {v.passos.length > 0 && (
                    <div className="row">
                      {v.passos.map((p) => <span key={p} className="chip t-mono">Passo {p}</span>)}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
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
        title="Nenhuma revisão registrada"
        description="As revisões marcadas pelo botão 'Marcar revisão' aparecerão aqui com histórico de versões."
      />
    );
  }

  return (
    <div className="stack-3">
      {items.map((rev) => {
        const meta = REVIEW_STATUS_META[rev.status];
        return (
          <Card key={rev.id}>
            <div className="stack-3">
              <div className="row-between">
                <div className="row" style={{ flexWrap: "wrap" }}>
                  {showRoutineLink && (
                    <Link to="/rotinas/$id" params={{ id: rev.routineId }} className="link-plain t-mono crimson">
                      {rev.routineId}
                    </Link>
                  )}
                  <AuditStatusBadge status={rev.rotinaStatusAuditoria} reviewTags={rev.rotinaReviewTags} compact />
                  <Badge status={meta.badge}>{meta.label}</Badge>
                  <span className="chip">{REVIEW_CATEGORY_LABEL[rev.categoria]}</span>
                  <span className="chip t-mono"><History size={12} strokeWidth={1.5} /> v{rev.versao}</span>
                  <span className="chip">{rev.rotinaModulo}</span>
                </div>
                <Button size="sm" onClick={() => onEdit(rev)}>
                  <PencilLine size={14} strokeWidth={1.5} /> Editar / Versões
                </Button>
              </div>

              {showRoutineLink && (
                <Link to="/rotinas/$id" params={{ id: rev.routineId }} className="link-plain t-h3" style={{ fontSize: "var(--text-body)" }}>
                  {rev.rotinaTitulo}
                </Link>
              )}

              <p className="t-body-s" style={{ margin: 0, color: "var(--color-bone)" }}>{rev.motivo}</p>

              {rev.resolucao && (
                <div className="review-resolution-box">
                  <span className="t-overline-xs" style={{ color: "var(--color-success)" }}>Resolução</span>
                  <p className="t-body-s" style={{ margin: 0 }}>{rev.resolucao}</p>
                </div>
              )}

              <Divider style={{ margin: 0 }} />

              <div className="row-between" style={{ flexWrap: "wrap", gap: "var(--space-2)" }}>
                <div className="row" style={{ flexWrap: "wrap" }}>
                  {rev.passos.length > 0 ? (
                    rev.passos.map((p) => <span key={p} className="chip t-mono">Passo {p}</span>)
                  ) : (
                    <span className="t-body-s dim">Rotina inteira</span>
                  )}
                </div>
                <span className="t-body-s dim icon-inline">
                  <Clock size={12} strokeWidth={1.5} />
                  Criada por <strong>{rev.revisor}</strong> em {fmtDate(rev.criadoEm)} · Atualizada em {fmtDate(rev.atualizadoEm)} ({rev.atualizadoPor})
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function RoutineReviewsModal({
  routineId,
  routineTitle,
  open,
  onClose,
  onNewReview,
}: {
  routineId: string;
  routineTitle: string;
  open: boolean;
  onClose: () => void;
  onNewReview: () => void;
}) {
  const { data, isLoading } = useRevisoesRotina(routineId);
  const [editingReview, setEditingReview] = useState<RoutineReviewItem | null>(null);
  const items = data?.data ?? [];

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={`Últimas Revisões · ${routineId}`}
        footer={
          <>
            <Link to="/revisoes" className="link-plain">
              <Button variant="ghost">Abrir biblioteca geral</Button>
            </Link>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onNewReview();
              }}
            >
              <Plus size={14} strokeWidth={1.5} /> Nova revisão
            </Button>
          </>
        }
      >
        <div className="stack-4" style={{ maxHeight: "65vh", overflowY: "auto" }}>
          <div className="row-between">
            <span className="t-body-s dim">{routineTitle}</span>
            <Badge status={items.some((i) => i.status === "aberta" || i.status === "em_andamento") ? "warning" : "neutral"}>
              <Flag size={12} strokeWidth={1.5} /> {items.length} revisão(ões)
            </Badge>
          </div>
          {isLoading ? (
            <p className="t-body-s dim">Carregando revisões...</p>
          ) : (
            <ReviewCardList items={items} showRoutineLink={false} onEdit={setEditingReview} />
          )}
        </div>
      </Modal>
      <EditReviewModal review={editingReview} open={Boolean(editingReview)} onClose={() => setEditingReview(null)} />
    </>
  );
}
