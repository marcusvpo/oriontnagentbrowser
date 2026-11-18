import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/design-system/orion-audit-console---design-system-bdbb01";

export interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  kicker?: ReactNode;
  headerAction?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * Painel lateral direito não bloqueante (drawer dockado). Integra-se ao layout flex/grid para que
 * os painéis principais (passo a passo e visualizador de prints) continuem visíveis e roláveis.
 */
export function SideDrawer({
  open,
  onClose,
  title,
  kicker,
  headerAction,
  footer,
  children,
  className,
  "aria-label": ariaLabel,
}: SideDrawerProps) {
  if (!open) return null;

  return (
    <aside
      className={["studio-drawer", className].filter(Boolean).join(" ")}
      aria-label={ariaLabel ?? (typeof title === "string" ? title : "Painel lateral")}
      data-testid="studio-drawer"
    >
      <header className="studio-drawer__header">
        <div className="stack-1 grow" style={{ minWidth: 0 }}>
          {kicker && <span className="t-overline-xs">{kicker}</span>}
          <div className="row" style={{ gap: "var(--space-2)" }}>
            {headerAction}
            <h2 className="t-h3 studio-drawer__title">{title}</h2>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          onClick={onClose}
          aria-label="Fechar painel lateral"
          title="Fechar painel"
        >
          <X size={16} strokeWidth={1.5} />
        </Button>
      </header>
      <div className="studio-drawer__body">{children}</div>
      {footer && <footer className="studio-drawer__footer">{footer}</footer>}
    </aside>
  );
}
