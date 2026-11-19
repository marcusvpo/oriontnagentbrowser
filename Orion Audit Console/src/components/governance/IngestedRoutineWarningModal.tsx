import { AlertTriangle, Sparkles } from "lucide-react";
import { Alert, Badge, Button } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import { fmtDate } from "@/lib/format";

export type IngestedProtectedAction = "edit_text" | "new_review" | "edit_review";

interface Props {
  open: boolean;
  routineId: string;
  routineTitle?: string;
  action: IngestedProtectedAction;
  ultimaIngestaoEm?: string;
  ultimaIngestaoPor?: string;
  ultimoLoteIngestaoId?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ACTION_COPY: Record<IngestedProtectedAction, { verb: string; confirmLabel: string }> = {
  edit_text: {
    verb: "editar o texto desta rotina",
    confirmLabel: "Continuar e editar texto",
  },
  new_review: {
    verb: "registrar uma nova revisão",
    confirmLabel: "Continuar e registrar revisão",
  },
  edit_review: {
    verb: "alterar uma revisão já ingerida",
    confirmLabel: "Continuar e editar revisão",
  },
};

/**
 * Popup obrigatório de proteção quando alguém tenta editar ou revisar uma rotina
 * cujas revisões já foram exportadas e ingeridas pelo motor/agente (ADR-036).
 */
export function IngestedRoutineWarningModal({
  open,
  routineId,
  routineTitle,
  action,
  ultimaIngestaoEm,
  ultimaIngestaoPor,
  ultimoLoteIngestaoId,
  onCancel,
  onConfirm,
}: Props) {
  const copy = ACTION_COPY[action];
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={`Atenção · ${routineId} já foi ingerida pelo agente`}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} data-testid="confirm-ingested-warning">
            {copy.confirmLabel}
          </Button>
        </>
      }
    >
      <div className="stack-4" data-testid="ingested-warning-modal">
        <div className="row">
          <Badge status="neutral" className="ds-badge--ingested" hideDot>
            <Sparkles size={12} strokeWidth={1.6} aria-hidden />
            Revisão já consumida pelo motor
          </Badge>
          {ultimoLoteIngestaoId && <span className="chip t-mono">{ultimoLoteIngestaoId}</span>}
        </div>

        {routineTitle && <span className="t-label">{routineTitle}</span>}

        <Alert tone="accent" title="Contexto já enviado para calibragem">
          As revisões anteriores desta rotina já foram exportadas e ingeridas como conhecimento para o motor
          {ultimaIngestaoEm ? ` em ${fmtDate(ultimaIngestaoEm)}` : ""}
          {ultimaIngestaoPor ? ` por ${ultimaIngestaoPor}` : ""}.
        </Alert>

        <div className="stack-2">
          <p className="t-body-s" style={{ margin: 0, color: "var(--color-bone)" }}>
            Se você optar por <strong>{copy.verb}</strong> agora, as novas observações ou ajustes{" "}
            <strong>ainda não estarão no conhecimento do agente</strong> e precisarão entrar em um próximo lote de exportação.
          </p>
          <p className="t-body-s dim icon-inline" style={{ margin: 0, alignItems: "flex-start" }}>
            <AlertTriangle size={14} strokeWidth={1.5} style={{ flex: "none", marginTop: 2 }} aria-hidden />
            <span>
              Dica: se você só quer conferir o que já foi enviado ao motor, clique em Cancelar e consulte o painel
              &ldquo;Revisões&rdquo; em modo leitura.
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
}
