import { forwardRef } from "react";
import { CheckSquare, Compass, ExternalLink, Globe, Keyboard, ListFilter, MousePointerClick, Search, ShieldCheck, TextCursorInput, type LucideIcon } from "lucide-react";
import { Alert, Badge, Card, Divider, Field, Textarea, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { StepView } from "@/types/api";
import type { ActionType } from "@/types/audit";
import { lintText } from "@/lib/lint";
import { DivergenceCallout } from "./DivergenceCallout";
import { InvariantsChecklist } from "./InvariantsChecklist";
import { DiffText, UiText } from "./RichText";

const ACTION_ICON: Record<ActionType, LucideIcon> = { click: MousePointerClick, fill: TextCursorInput, search: Search, select: ListFilter, check: CheckSquare, navigate: Compass, verify: ShieldCheck };

interface Props { step: StepView; active: boolean; onSelect: () => void; editing?: boolean; draft?: string; onDraft?: (v: string) => void }

export const StepComparisonCard = forwardRef<HTMLDivElement, Props>(function StepComparisonCard({ step, active, onSelect, editing, draft, onDraft }, ref) {
  const Icon = ACTION_ICON[step.actionType] ?? Keyboard;
  const isExternal = step.stepScope === "external_portal";
  const revised = editing ? draft ?? step.validatedText : step.validatedText;
  const issues = editing ? lintText(revised) : [];
  return (
    <div ref={ref} data-step={step.stepNumber}>
      <Card padding="compact" interactive className="step-card" data-active={active} data-scope={isExternal ? "external_portal" : "orion_tn"} onClick={onSelect}
        role="button" tabIndex={0} aria-pressed={active} aria-label={`Passo ${step.stepNumber}`} onKeyDown={(e) => { if (e.key === "Enter" && e.target === e.currentTarget) onSelect(); }}>
        <div className="stack-3">
          <div className="row-between">
            <div className="row">
              <span className="step-num">{step.stepNumber}</span>
              {isExternal && (
                <Badge status="neutral" className="ds-badge--external" hideDot data-testid="external-step-badge">
                  <ExternalLink size={12} strokeWidth={1.5} aria-hidden />
                  Etapa Externa • Fora do Orion TN
                </Badge>
              )}
              {isExternal && step.portalExterno && (
                <Badge status="neutral" className="ds-badge--external-portal" hideDot>
                  <Globe size={12} strokeWidth={1.5} aria-hidden />
                  {step.portalExterno}
                </Badge>
              )}
              <Tooltip content={`Ação: ${step.actionType}`}><span className="chip" tabIndex={0}><Icon size={12} strokeWidth={1.5} aria-hidden />{step.actionType}</span></Tooltip>
              {!isExternal && step.zonePolicy && <Tooltip content="Política de zona semântica"><span className="chip" tabIndex={0}>zona: {step.zonePolicy}</span></Tooltip>}
            </div>
            <span className="t-overline-xs">{isExternal ? "Sem print · Validação humana" : step.status === "modified" ? "Modificado" : step.status === "blocked" ? "Bloqueado" : step.status === "nao_executado" ? "Não executado" : "OK"}</span>
          </div>
          <div className="cols-2 comparison-columns">
            <div className="stack-1">
              <span className="t-overline-xs">Manual original</span>
              <p className="text-block" style={{ margin: 0 }}><DiffText from={step.originalText} to={revised} side="old" /></p>
            </div>
            <div className="stack-1">
              <span className="t-overline-xs">Texto revisado</span>
              {editing ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <Field label={`Editar passo ${step.stepNumber}`} error={issues.find((i) => i.level === "error")?.message}>
                    {(p) => <Textarea {...p} value={revised} onChange={(e) => onDraft?.(e.target.value)} />}
                  </Field>
                  <p className="text-block" style={{ margin: 0 }}><UiText text={revised} /></p>
                </div>
              ) : (
                <p className="text-block" style={{ margin: 0 }}><DiffText from={step.originalText} to={revised} side="new" /></p>
              )}
            </div>
          </div>
          {issues.filter((i) => i.level === "warning").map((i, k) => <Alert key={k} tone="accent">{i.message}</Alert>)}
          {step.divergence && <DivergenceCallout d={step.divergence} />}
          {isExternal && (
            <Alert className="ds-alert--external" title="Etapa Externa (Fora do Orion TN)">
              Este passo ocorre fora do Orion TN{step.portalExterno ? ` (${step.portalExterno})` : ""}. O agente não o executou nem o fotografou, por isso não há print: a validação é humana.
            </Alert>
          )}
          {step.status === "blocked" && step.errorMessage && <Alert tone="error" title="Passo bloqueado"><span className="t-mono">{step.errorMessage}</span></Alert>}
          {step.invariantes && (<><Divider style={{ margin: 0 }} /><div className="row-between"><span className="t-overline-xs">Invariantes geométricos</span><InvariantsChecklist items={step.invariantes} /></div></>)}
        </div>
      </Card>
    </div>
  );
});
