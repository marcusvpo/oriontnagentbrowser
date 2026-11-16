import { useEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../cn";

export interface ModalProps extends Omit<ComponentPropsWithRef<"dialog">, "title"> {
  open: boolean;
  onClose: () => void;
  title: string;
  footer?: ReactNode;
}

/** Native <dialog> modal: focus trap, Esc to close, backdrop scrim. */
export function Modal({ open, onClose, title, footer, className, children, ...props }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={cn("ds-modal", className)} onClose={onClose} aria-label={title} {...props}>
      <div className="ds-modal__header">
        <h2 className="t-h3">{title}</h2>
        <Button variant="ghost" size="sm" iconOnly aria-label="Close" onClick={onClose}><X size={14} strokeWidth={1.5} /></Button>
      </div>
      <div className="ds-modal__body">{children}</div>
      {footer && <div className="ds-modal__footer">{footer}</div>}
    </dialog>
  );
}

export interface DropdownOption { value: string; label: string }

export interface DropdownProps extends Omit<ComponentPropsWithRef<"div">, "onChange"> {
  /** Trigger button label. */
  label: ReactNode;
  options: DropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
}

/** Single-select dropdown menu with crimson check on the active item. */
export function Dropdown({ label, options, value, onValueChange, className, ...props }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", off);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div ref={root} className={cn("ds-menu", className)} {...props}>
      <Button aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{label}</Button>
      {open && (
        <ul role="menu" className="ds-menu__list">
          {options.map((o) => (
            <li key={o.value} role="none">
              <button role="menuitemradio" aria-checked={o.value === value} className="ds-menu__item" onClick={() => { onValueChange(o.value); setOpen(false); }}>
                {o.label}{o.value === value && <Check size={14} strokeWidth={1.5} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export interface TooltipProps extends Omit<ComponentPropsWithRef<"span">, "content"> {
  content: string;
}

/** Hover/focus tooltip. Wrap a focusable element. */
export function Tooltip({ content, className, children, ...props }: TooltipProps) {
  return (
    <span className={cn("ds-tooltip", className)} {...props}>
      {children}
      <span role="tooltip" className="ds-tooltip__content">{content}</span>
    </span>
  );
}
