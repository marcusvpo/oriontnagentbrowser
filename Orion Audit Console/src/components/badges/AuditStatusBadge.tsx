import { Badge, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AUDIT_STATUS, REVIEW_TAG_META, normalizeAudit, tagsOf } from "@/lib/status";
import type { RoutineAuditState } from "@/types/api";

/**
 * Badge de auditoria. Quando a rotina possui tags de revisão (`ATT`, `CCC`, `DDD`, `XRX`),
 * incluindo combinações multi-tag (ex.: `[ATT][CCC]`), renderiza TODAS as tags lado a lado
 * como badges distintos na ordem canônica.
 */
export function AuditStatusBadge({
  status,
  divergencias,
  tags,
  reviewTags,
  compact = false,
}: {
  status: RoutineAuditState | string;
  divergencias?: number;
  tags?: ReadonlyArray<string>;
  reviewTags?: ReadonlyArray<string>;
  compact?: boolean;
}) {
  const normalized = normalizeAudit(status);
  const allTags = tagsOf(normalized, [...(reviewTags ?? []), ...(tags ?? [])]);

  if (allTags.length > 0) {
    return (
      <span className="row audit-badges" data-testid="audit-status-badges">
        {allTags.map((t) => {
          const tagMeta = REVIEW_TAG_META[t];
          const TagIcon = tagMeta.icon;
          return (
            <Tooltip key={t} content={tagMeta.description}>
              <Badge
                status={tagMeta.tone}
                className={tagMeta.extraClass}
                hideDot
                tabIndex={0}
                data-review-tag={t}
                aria-label={`${tagMeta.label}`}
              >
                <TagIcon size={12} strokeWidth={1.5} aria-hidden />
                {compact ? tagMeta.shortLabel : tagMeta.label}
              </Badge>
            </Tooltip>
          );
        })}
      </span>
    );
  }

  const meta = AUDIT_STATUS[normalized];
  const Icon = meta.icon;
  const tip = normalized === "validado_com_ajustes" && divergencias !== undefined
    ? `${divergencias} divergência(s) auto-curada(s)` : meta.description;
  return (
    <span className="row audit-badges" data-testid="audit-status-badges">
      <Tooltip content={tip}>
        <Badge status={meta.tone} hideDot tabIndex={0}><Icon size={12} strokeWidth={1.5} aria-hidden />{meta.label}</Badge>
      </Tooltip>
    </span>
  );
}
