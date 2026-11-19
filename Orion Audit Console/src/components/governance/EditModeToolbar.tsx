import { AlertTriangle, Coins, Save } from "lucide-react";
import { Alert, Button, Progress } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { TOKEN_LIMIT } from "@/lib/lint";

export function EditModeToolbar({
  tokens,
  errors,
  warnings,
  dirty,
  savingDraft,
  onDiscard,
  onSaveDraft,
  onSaveApprove,
}: {
  tokens: number;
  errors: number;
  warnings: number;
  dirty: boolean;
  savingDraft?: boolean;
  onDiscard: () => void;
  onSaveDraft?: () => void;
  onSaveApprove: () => void;
}) {
  const over = tokens > TOKEN_LIMIT;
  return (
    <div className="stack-3">
      <Alert tone="accent" title="Modo edição ativo">
        Edite a descrição ou os passos revisados. A conferência de regras (negritos de UI e limite de tokens) roda em tempo real.
      </Alert>
      <div className="row-between">
        <div className="row-3">
          <span className="icon-inline t-body-s">
            <Coins size={14} strokeWidth={1.5} aria-hidden />
            <span className={`t-mono ${over ? "err" : ""}`}>{tokens}</span> / {TOKEN_LIMIT} tokens
          </span>
          {warnings > 0 && (
            <span className="icon-inline t-body-s warn">
              <AlertTriangle size={14} strokeWidth={1.5} aria-hidden />
              {warnings} aviso(s)
            </span>
          )}
          {errors > 0 && (
            <span className="icon-inline t-body-s err">
              <AlertTriangle size={14} strokeWidth={1.5} aria-hidden />
              {errors} erro(s) bloqueante(s)
            </span>
          )}
        </div>
        <div className="row">
          <Button variant="ghost" onClick={onDiscard}>
            Descartar
          </Button>
          {onSaveDraft && (
            <Button
              variant="secondary"
              disabled={errors > 0 || !dirty}
              loading={savingDraft}
              onClick={onSaveDraft}
            >
              <Save size={13} strokeWidth={1.5} /> Salvar rascunho
            </Button>
          )}
          <Button variant="primary" disabled={errors > 0 || !dirty} onClick={onSaveApprove}>
            Salvar e aprovar p/ KB
          </Button>
        </div>
      </div>
      <Progress value={Math.min(100, (tokens / TOKEN_LIMIT) * 100)} label="Uso do limite de tokens" />
      {over && (
        <Alert tone="error" title="Acima do limite">
          A rotina passa de {TOKEN_LIMIT} tokens, o limite por rotina na base de conhecimento do assistente.
        </Alert>
      )}
    </div>
  );
}
