import type { ComponentPropsWithRef } from "react";
import { cn } from "../cn";

export interface TabItem { value: string; label: string }

export interface TabsProps extends Omit<ComponentPropsWithRef<"div">, "onChange"> {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
}

/** Underline sub-navigation tabs. Arrow keys move between tabs. */
export function Tabs({ items, value, onValueChange, className, ...props }: TabsProps) {
  const move = (dir: number) => {
    const i = items.findIndex((t) => t.value === value);
    const next = items[(i + dir + items.length) % items.length];
    onValueChange(next.value);
  };
  return (
    <div role="tablist" className={cn("ds-tabs", className)} {...props}>
      {items.map((t) => (
        <button
          key={t.value}
          role="tab"
          type="button"
          aria-selected={t.value === value}
          tabIndex={t.value === value ? 0 : -1}
          className="ds-tab"
          onClick={() => onValueChange(t.value)}
          onKeyDown={(e) => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
