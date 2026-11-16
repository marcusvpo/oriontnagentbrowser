import { ArrowRight, ExternalLink, Globe, ShieldCheck } from "lucide-react";
import { Alert, Badge, Button, Divider } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { StepView } from "@/types/api";
import { UiText } from "./RichText";

interface Props {
  step: StepView;
  steps?: StepView[];
  onSelect?: (stepNumber: number) => void;
}

/**
 * Card informativo exibido na área direita do Estúdio quando o passo ativo ocorre em portal externo
 * (`stepScope === 'external_portal'`), diferenciando etapa externa de captura ausente ou falha.
 */
export function ExternalStepCard({ step, steps, onSelect }: Props) {
  const portalName = step.portalExterno?.trim() || "Ambiente externo ao Orion TN";
  const nextInternal = steps?.find((s) => s.stepScope !== "external_portal" && s.media)
    ?? steps?.find((s) => s.stepScope !== "external_portal");

  return (
    <div className="external-step-card" role="region" aria-label={`Etapa externa · Passo ${step.stepNumber}`}>
      <div className="row" style={{ alignItems: "flex-start", gap: "var(--space-3)" }}>
        <div className="external-step-emblem" aria-hidden>
          <Globe size={22} strokeWidth={1.5} />
        </div>
        <div className="stack-2 grow">
          <div className="row" style={{ gap: "var(--space-1-5)" }}>
            <Badge status="neutral" className="ds-badge--external" hideDot>
              <ExternalLink size={12} strokeWidth={1.5} aria-hidden />
              Etapa Externa • Fora do Orion TN
            </Badge>
            {step.portalExterno && (
              <Badge status="neutral" className="ds-badge--external-portal" hideDot>
                {step.portalExterno}
              </Badge>
            )}
          </div>
          <h3 className="t-h3" style={{ margin: 0 }}>
            Passo {step.stepNumber} executado em portal externo ({portalName})
          </h3>
        </div>
      </div>

      <Alert className="ds-alert--external" title="Sem captura de tela por desenho (Anti-Mock)">
        Esta etapa ocorre fora da interface web do Orion TN. O agente não navega em sistemas ou portais externos e não gera print para evitar evidência falsa. A conformidade deste passo exige validação humana direta no ambiente externo.
      </Alert>

      <blockquote className="external-step-quote">
        <span className="t-overline-xs" style={{ display: "block", marginBottom: "var(--space-1)" }}>
          Instrução do manual
        </span>
        <p className="text-block" style={{ margin: 0 }}>
          <UiText text={step.validatedText || step.originalText} />
        </p>
      </blockquote>

      <Divider style={{ margin: 0 }} />

      <dl className="kv">
        <dt>Portal / Sistema</dt>
        <dd className="t-mono">{portalName}</dd>
        <dt>Escopo do passo</dt>
        <dd className="t-mono">external_portal (fora do Orion TN)</dd>
        <dt>Captura de tela</dt>
        <dd>Não aplicável — etapa externa sem screenshot esperado</dd>
        <dt>Validação</dt>
        <dd className="icon-inline">
          <ShieldCheck size={14} strokeWidth={1.5} aria-hidden />
          Validação humana no ambiente externo
        </dd>
      </dl>

      {nextInternal && onSelect && nextInternal.stepNumber !== step.stepNumber && (
        <div className="row-between" style={{ paddingTop: "var(--space-1)" }}>
          <span className="t-body-s dim">Etapas do Orion TN desta rotina começam no passo {nextInternal.stepNumber}.</span>
          <Button size="md" onClick={() => onSelect(nextInternal.stepNumber)}>
            Ir para o Passo {nextInternal.stepNumber} (Orion TN)
            <ArrowRight size={14} strokeWidth={1.5} />
          </Button>
        </div>
      )}
    </div>
  );
}
