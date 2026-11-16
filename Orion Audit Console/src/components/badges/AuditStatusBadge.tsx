import { Badge, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AUDIT_STATUS, REVIEW_TAG, REVIEW_TAG_LABEL, isReviewState, normalizeAudit, tagsOf } from "@/lib/status";
import type { RoutineAuditState } from "@/types/api";

/**
 * Badge do status principal da auditoria. Rotina multi-tag (ADR-024, ex.: `[ATT][CCC]`) mostra o badge do
 * status principal e um chip para cada tag adicional, na ordem canônica.
 */
export function AuditStatusBadge({ status, divergencias, tags }: { status: RoutineAuditState | string; divergencias?: number; tags?: ReadonlyArray<string> }) {
  const normalized = normalizeAudit(status);
  const meta = AUDIT_STATUS[normalized];
  const Icon = meta.icon;
  const tip = normalized === "validado_com_ajustes" && divergencias !== undefined
    ? `${divergencias} divergência(s) auto-curada(s)` : meta.description;
  const mainTag = isReviewState(normalized) ? REVIEW_TAG[normalized] : undefined;
  const extra = tagsOf(normalized, tags).filter((t) => t !== mainTag);
  return (
    <span className="row">
      <Tooltip content={tip}>
        <Badge status={meta.tone} hideDot tabIndex={0}><Icon size={12} strokeWidth={1.5} aria-hidden />{meta.label}</Badge>
      </Tooltip>
      {extra.map((t) => (
        <Tooltip key={t} content={`[${t}] ${REVIEW_TAG_LABEL[t]}`}>
          <span className="chip" tabIndex={0} aria-label={`Tag adicional ${t}: ${REVIEW_TAG_LABEL[t]}`}>[{t}]</span>
        </Tooltip>
      ))}
    </span>
  );
}
