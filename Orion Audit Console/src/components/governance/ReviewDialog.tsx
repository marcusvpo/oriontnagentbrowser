import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { Alert, Button, Checkbox, Field, Input, Select, Textarea } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import { SideDrawer } from "@/components/ui/SideDrawer";
import type { ReviewCategory, RoutineDetail } from "@/types/api";
import { useSolicitarRevisao } from "@/hooks/useRotinas";
import { toast } from "@/lib/toast";
import { useReviewer } from "./useReviewer";

const CATS: Array<[ReviewCategory, string]> = [
  ["divergencia_texto", "Divergência de texto"], ["print_incorreta", "Print incorreta"], ["tela_bloqueada", "Tela bloqueada"],
  ["hardware_driver", "Hardware / driver"], ["outro", "Outro"],
];

export interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  rotina: RoutineDetail;
  variant?: "modal" | "drawer";
  activeStepNumber?: number;
  reviewsCount?: number;
  onOpenReviews?: () => void;
}

export function ReviewDialog({
  open,
  onClose,
  rotina,
  variant = "modal",
  activeStepNumber,
  reviewsCount,
  onOpenReviews,
}: ReviewDialogProps) {
  const [revisor, setRevisor] = useReviewer();
  const [categoria, setCategoria] = useState<ReviewCategory>("divergencia_texto");
  const [passos, setPassos] = useState<number[]>([]);
  const [motivo, setMotivo] = useState("");
  const [touched, setTouched] = useState(false);
  const m = useSolicitarRevisao(rotina.summary.id);
  useEffect(() => { if (open) { setTouched(false); setMotivo(""); setPassos([]); m.reset(); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const motivoErr = touched && motivo.trim().length < 10 ? "O motivo precisa de pelo menos 10 caracteres." : undefined;
  const revisorErr = touched && !revisor.trim() ? "Informe o nome do revisor." : undefined;
  const toggleStep = (n: number) =>
    setPassos((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n].sort((a, b) => a - b)));

  const submit = () => {
    setTouched(true);
    if (motivo.trim().length < 10 || !revisor.trim()) return;
    m.mutate({ revisor: revisor.trim(), categoria, motivo: motivo.trim(), passos: passos.length ? passos : undefined }, {
      onSuccess: () => { toast("Revisão solicitada", `${rotina.summary.id} marcada para revisão.`); onClose(); },
    });
  };

  const title = `Marcar ${rotina.summary.id} para revisão`;
  const count = reviewsCount ?? rotina.revisoes?.length ?? 0;

  const content = (
    <div className="stack-4">
      {m.error && <Alert tone="error" title="Não foi possível registrar">{(m.error as Error).message}</Alert>}
      <Field label="Revisor" error={revisorErr}>{(p) => <Input {...p} value={revisor} onChange={(e) => setRevisor(e.target.value)} />}</Field>
      <Field label="Categoria">
        {(p) => <Select {...p} value={categoria} onChange={(e) => setCategoria(e.target.value as ReviewCategory)}>{CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select>}
      </Field>
      <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
        <div className="row-between">
          <legend className="ds-field__label" style={{ marginBottom: 0 }}>Passos afetados</legend>
          {activeStepNumber !== undefined && (
            <button
              type="button"
              className="chip"
              onClick={() => toggleStep(activeStepNumber)}
              title="Incluir ou remover o passo selecionado agora no Estúdio"
            >
              {passos.includes(activeStepNumber) ? `✓ Passo ${activeStepNumber} em tela` : `+ Passo ${activeStepNumber} em tela`}
            </button>
          )}
        </div>
        <div className="row-3">
          {rotina.steps.map((s) => (
            <Checkbox
              key={s.stepNumber}
              checked={passos.includes(s.stepNumber)}
              onChange={() => toggleStep(s.stepNumber)}
            >
              Passo {s.stepNumber}
            </Checkbox>
          ))}
        </div>
      </fieldset>
      <Field label="Motivo / Observações" error={motivoErr} hint={`${motivo.trim().length}/10 caracteres mínimos`}>
        {(p) => (
          <Textarea
            {...p}
            rows={variant === "drawer" ? 5 : undefined}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Descreva o que precisa ser corrigido enquanto acompanha os passos e prints"
          />
        )}
      </Field>
    </div>
  );

  const footer = (
    <>
      {variant === "drawer" && onOpenReviews && (
        <Button variant="ghost" size="sm" onClick={onOpenReviews} style={{ marginRight: "auto" }}>
          <History size={14} strokeWidth={1.5} /> Ver revisões ({count})
        </Button>
      )}
      <Button variant="ghost" onClick={onClose}>Cancelar</Button>
      <Button variant="primary" loading={m.isPending} onClick={submit}>Marcar para revisão</Button>
    </>
  );

  if (variant === "drawer") {
    return (
      <SideDrawer
        open={open}
        onClose={onClose}
        kicker="Marcar revisão · Painel acoplado"
        title={title}
        footer={footer}
      >
        {content}
      </SideDrawer>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={title} footer={footer}>
      {content}
    </Modal>
  );
}

export function ReviewDrawer(props: Omit<ReviewDialogProps, "variant">) {
  return <ReviewDialog {...props} variant="drawer" />;
}
