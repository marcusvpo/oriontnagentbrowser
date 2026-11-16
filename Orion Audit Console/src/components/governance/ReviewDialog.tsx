import { useEffect, useState } from "react";
import { Alert, Button, Checkbox, Field, Input, Select, Textarea } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import type { ReviewCategory, RoutineDetail } from "@/types/api";
import { useSolicitarRevisao } from "@/hooks/useRotinas";
import { toast } from "@/lib/toast";
import { useReviewer } from "./useReviewer";

const CATS: Array<[ReviewCategory, string]> = [
  ["divergencia_texto", "Divergência de texto"], ["print_incorreta", "Print incorreta"], ["tela_bloqueada", "Tela bloqueada"],
  ["hardware_driver", "Hardware / driver"], ["outro", "Outro"],
];

export function ReviewDialog({ open, onClose, rotina }: { open: boolean; onClose: () => void; rotina: RoutineDetail }) {
  const [revisor, setRevisor] = useReviewer();
  const [categoria, setCategoria] = useState<ReviewCategory>("divergencia_texto");
  const [passos, setPassos] = useState<number[]>([]);
  const [motivo, setMotivo] = useState("");
  const [touched, setTouched] = useState(false);
  const m = useSolicitarRevisao(rotina.summary.id);
  useEffect(() => { if (open) { setTouched(false); setMotivo(""); setPassos([]); m.reset(); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const motivoErr = touched && motivo.trim().length < 10 ? "O motivo precisa de pelo menos 10 caracteres." : undefined;
  const revisorErr = touched && !revisor.trim() ? "Informe o nome do revisor." : undefined;
  const submit = () => {
    setTouched(true);
    if (motivo.trim().length < 10 || !revisor.trim()) return;
    m.mutate({ revisor: revisor.trim(), categoria, motivo: motivo.trim(), passos: passos.length ? passos : undefined }, {
      onSuccess: () => { toast("Revisão solicitada", `${rotina.summary.id} marcada para revisão.`); onClose(); },
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={`Marcar ${rotina.summary.id} para revisão`}
      footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button loading={m.isPending} onClick={submit}>Marcar para revisão</Button></>}>
      <div className="stack-4">
        {m.error && <Alert tone="error" title="Não foi possível registrar">{(m.error as Error).message}</Alert>}
        <Field label="Revisor" error={revisorErr}>{(p) => <Input {...p} value={revisor} onChange={(e) => setRevisor(e.target.value)} />}</Field>
        <Field label="Categoria">
          {(p) => <Select {...p} value={categoria} onChange={(e) => setCategoria(e.target.value as ReviewCategory)}>{CATS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select>}
        </Field>
        <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="ds-field__label">Passos afetados</legend>
          <div className="row-3">
            {rotina.steps.map((s) => (
              <Checkbox key={s.stepNumber} checked={passos.includes(s.stepNumber)}
                onChange={() => setPassos((p) => (p.includes(s.stepNumber) ? p.filter((x) => x !== s.stepNumber) : [...p, s.stepNumber].sort((a, b) => a - b)))}>
                Passo {s.stepNumber}
              </Checkbox>
            ))}
          </div>
        </fieldset>
        <Field label="Motivo" error={motivoErr} hint={`${motivo.trim().length}/10 caracteres mínimos`}>
          {(p) => <Textarea {...p} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Descreva o que precisa ser corrigido" />}
        </Field>
      </div>
    </Modal>
  );
}
