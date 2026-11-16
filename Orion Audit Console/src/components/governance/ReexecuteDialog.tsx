import { useEffect, useState } from "react";
import { Alert, Button, Checkbox, Field, Input, Radio, Select } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import type { RoutineDetail } from "@/types/api";
import type { WorkloadType } from "@/types/audit";
import { useReexecutarLote, useReexecutarRotina } from "@/hooks/useRotinas";
import { ApiError } from "@/services/api";
import { toast } from "@/lib/toast";
import { useReviewer } from "./useReviewer";

type Props = { open: boolean; onClose: () => void } & ({ rotina: RoutineDetail; ids?: undefined } | { rotina?: undefined; ids: string[] });

export function ReexecuteDialog(props: Props) {
  const { open, onClose, rotina, ids } = props;
  const batch = !rotina;
  const [solicitante, setSolicitante] = useReviewer();
  const [passos, setPassos] = useState<number[]>([]);
  const [modo, setModo] = useState<"headless" | "headed">("headless");
  const [prioridade, setPrioridade] = useState<"normal" | "alta">("normal");
  const [lane, setLane] = useState<WorkloadType>(rotina?.summary.workloadType ?? "read_only");
  const [motivo, setMotivo] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const single = useReexecutarRotina(rotina?.summary.id ?? "");
  const lote = useReexecutarLote();
  useEffect(() => { if (open) { setErr(null); setPassos([]); setLane(rotina?.summary.workloadType ?? "read_only"); } }, [open, rotina]);

  const submit = () => {
    setErr(null);
    if (batch) {
      lote.mutate({ ids, modo, prioridade }, {
        onSuccess: (r) => {
          toast(`${r.jobs.length} rotina(s) enfileirada(s)`, r.rejeitadas.length ? `${r.rejeitadas.length} ignorada(s): já estavam na fila.` : "Acompanhe na Fila do Runner.");
          onClose();
        },
        onError: (e) => setErr((e as Error).message),
      });
      return;
    }
    single.mutate({ solicitante: solicitante || "revisor", motivo: motivo || undefined, passos: passos.length ? passos : undefined, modo, prioridade, lane }, {
      onSuccess: (r) => { toast("Reexecução enfileirada", `Lane ${r.lane} · posição ${r.posicaoFila} na fila.`); onClose(); },
      onError: (e) => setErr(e instanceof ApiError && e.status === 409 ? "Rotina já está na fila." : (e as Error).message),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={batch ? `Reexecutar ${ids.length} rotina(s)` : `Reexecutar ${rotina.summary.id}`}
      footer={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button loading={single.isPending || lote.isPending} onClick={submit}>Enfileirar no runner</Button></>}>
      <div className="stack-4">
        {err && <Alert tone="error" title="Não foi possível enfileirar">{err}</Alert>}
        {batch && <p className="t-body-s">Envio único para o runner: <span className="t-mono">{ids.join(", ")}</span></p>}
        {!batch && (
          <>
            <Field label="Solicitante">{(p) => <Input {...p} value={solicitante} onChange={(e) => setSolicitante(e.target.value)} />}</Field>
            <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
              <legend className="ds-field__label">Passos (nenhum marcado = todos)</legend>
              <div className="row-3">
                {rotina.steps.map((s) => (
                  <Checkbox key={s.stepNumber} checked={passos.includes(s.stepNumber)}
                    onChange={() => setPassos((p) => (p.includes(s.stepNumber) ? p.filter((x) => x !== s.stepNumber) : [...p, s.stepNumber]))}>
                    {s.stepNumber}
                  </Checkbox>
                ))}
              </div>
            </fieldset>
          </>
        )}
        <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="ds-field__label">Modo</legend>
          <div className="row-3">
            <Radio name="modo" checked={modo === "headless"} onChange={() => setModo("headless")}>headless</Radio>
            <Radio name="modo" checked={modo === "headed"} onChange={() => setModo("headed")}>headed</Radio>
          </div>
        </fieldset>
        <Field label="Prioridade">
          {(p) => <Select {...p} value={prioridade} onChange={(e) => setPrioridade(e.target.value as "normal" | "alta")}><option value="normal">Normal</option><option value="alta">Alta</option></Select>}
        </Field>
        {!batch && (
          <>
            <Field label="Lane" hint={lane === "mutation" ? "Lane mutation roda serializada: pode demorar mais." : "Lane read_only roda em paralelo."}>
              {(p) => <Select {...p} font="mono" value={lane} onChange={(e) => setLane(e.target.value as WorkloadType)}><option value="read_only">read_only</option><option value="mutation">mutation</option></Select>}
            </Field>
            <Field label="Motivo (opcional)">{(p) => <Input {...p} value={motivo} onChange={(e) => setMotivo(e.target.value)} />}</Field>
          </>
        )}
      </div>
    </Modal>
  );
}
