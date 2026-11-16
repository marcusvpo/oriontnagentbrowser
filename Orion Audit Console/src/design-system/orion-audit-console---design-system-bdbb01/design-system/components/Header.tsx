import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../cn";

export interface HeaderProps extends ComponentPropsWithRef<"header"> {
  /** Text wordmark or logo node. */
  logo: ReactNode;
  /** Nav links (use className "ds-header__link"). */
  nav?: ReactNode;
  /** Right side: search, CTA. */
  actions?: ReactNode;
}

/** 64px sticky top bar with hairline bottom border. */
export function Header({ logo, nav, actions, className, ...props }: HeaderProps) {
  return (
    <header className={cn("ds-header", className)} {...props}>
      <div className="ds-header__logo">{logo}</div>
      <nav className="ds-header__nav" aria-label="Main">{nav}</nav>
      {actions && <div className="ds-header__actions">{actions}</div>}
    </header>
  );
}
