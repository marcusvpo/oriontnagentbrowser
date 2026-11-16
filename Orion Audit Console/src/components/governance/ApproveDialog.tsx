import { useEffect, useState } from "react";
import { Alert, Button, Checkbox, Divider, Field, Input, Textarea } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import type { RoutineDetail } from "@/types/api";
import { useAprovarRotina } from "@/hooks/useRotinas";
import { ApiError } from "@/services/api";
import { toast } from "@/lib/toast";
import { lintText } from "@/lib/lint";
import { isReviewState, reviewPrefix, tagsOfSummary } from "@/lib/status";
import { useReviewer } from "./useReviewer";

interface Props {
  open: boolean; onClose: () => void; rotina: RoutineDetail;
  edicoes?: Array<{ stepNumber: number; validatedText: string }>; descricao?: string; onApproved?: () => void;
}

export function ApproveDialog({ open, onClose, rotina, edicoes, descricao, onApproved }: Props) {
  const [revisor, setRevisor] = useReviewer();
  const [comentario, setComentario] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [touched, setTouched] = useState(false);
  const [apiErr, setApiErr] = useState<string | null>(null);
  const m = useAprovarRotina(rotina.summary.id);
  const blocked = isReviewState(rotina.summary.statusAuditoria);
  useEffect(() => { if (open) { setApiErr(null); setTouched(false); setConfirm(false); } }, [open]);

  const editedCount = (edicoes ?? []).filter((e) => rotina.steps.find((s) => s.stepNumber === e.stepNumber)?.validatedText !== e.validatedText).length + (descricao && descricao !== rotina.original.descricao ? 1 : 0);
  const lintWarnings = [...(edicoes ?? rotina.steps.map((s) => ({ validatedText: s.validatedText }))).flatMap((e) => lintText(e.validatedText)), ...(descricao ? lintText(descricao) : [])];
  const revisorErr = touched && !revisor.trim() ? "Informe o nome do revisor." : undefined;
  const confirmErr = touched && blocked && !confirm ? "Confirme a validação manual." : undefined;

  const submit = () => {
    setTouched(true);
    if (!revisor.trim() || (blocked && !confirm)) return;
    setApiErr(null);
    m.mutate(
      { revisor: revisor.trim(), comentario: comentario || undefined, edicoes: edicoes?.length ? edicoes : undefined, descricao, confirmacaoManual: blocked ? confirm : undefined, baseUpdatedAt: rotina.summary.updatedAt },
      {
        onSuccess: () => { toast("Rotina aprovada", `${rotina.summary.id} aprovada por ${revisor}.`); onApproved?.(); onClose(); },
        onError: (e) => setApiErr(e instanceof ApiError && e.status === 409 ? `Conflito (409): ${e.message}` : (e as Error).message),
      },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={`Aprovar ${rotina.summary.id}`}
      footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button variant="primary" loading={m.isPending} onClick={submit}>{edicoes?.length ? "Salvar e aprovar" : "Aprovar rotina"}</Button></>}>
      <div className="stack-4">
        <dl className="kv">
          <dt>Passos editados</dt><dd className="t-mono">{editedCount}</dd>
          <dt>Divergências aceitas</dt><dd className="t-mono">{rotina.summary.divergenciasCount}</dd>
          <dt>Avisos de lint</dt><dd className={`t-mono ${lintWarnings.length ? "warn" : ""}`}>{lintWarnings.length}</dd>
        </dl>
        {apiErr && <Alert tone="error" title="Não foi possível aprovar">{apiErr}</Alert>}
        {blocked && <Alert tone="error" title={`Rotina em revisão humana ${reviewPrefix(rotina.summary.statusAuditoria, tagsOfSummary(rotina.summary)).trim()}`}>A execução automática não foi concluída. Aprove somente após validar manualmente.</Alert>}
        <Divider style={{ margin: 0 }} />
        <Field label="Revisor" error={revisorErr} hint="Guardado neste navegador apenas como nome de exibição.">
          {(p) => <Input {...p} value={revisor} onChange={(e) => setRevisor(e.target.value)} placeholder="Seu nome" />}
        </Field>
        <Field label="Comentário (opcional)">
          {(p) => <Textarea {...p} value={comentario} onChange={(e) => setComentario(e.target.value)} />}
        </Field>
        {blocked && (
          <div className="stack-1">
            <Checkbox checked={confirm} onChange={(e) => setConfirm(e.target.checked)}>Confirmo que validei manualmente</Checkbox>
            {confirmErr && <p className="ds-field__error">{confirmErr}</p>}
          </div>
        )}
      </div>
    </Modal>
  );
}
