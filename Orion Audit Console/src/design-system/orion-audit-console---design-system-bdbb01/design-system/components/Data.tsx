import type { ComponentPropsWithRef, ReactNode } from "react";
import { cn } from "../cn";

export interface TableColumn<T> {
  key: string;
  header: string;
  /** Right-aligned mono tabular numbers. */
  numeric?: boolean;
  render: (row: T) => ReactNode;
}

export interface TableProps<T> extends Omit<ComponentPropsWithRef<"table">, "children"> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
}

/** Dense bordered table. No zebra stripes. */
export function Table<T>({ columns, rows, rowKey, className, ...props }: TableProps<T>) {
  return (
    <div className="ds-table-wrap">
      <table className={cn("ds-table", className)} {...props}>
        <thead><tr>{columns.map((c) => <th key={c.key} className={c.numeric ? "is-numeric" : undefined}>{c.header}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={rowKey(r)}>{columns.map((c) => <td key={c.key} className={c.numeric ? "is-numeric" : undefined}>{c.render(r)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CodeBlockProps extends ComponentPropsWithRef<"pre"> {
  /** Plain code string. Use children with `tok-*` spans for 3-tone highlighting instead. */
  code?: string;
}

/** Monochrome code block (comment / prop / accent tones only). */
export function CodeBlock({ code, className, children, ...props }: CodeBlockProps) {
  return <pre className={cn("ds-code", className)} {...props}><code>{code ?? children}</code></pre>;
}

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends ComponentPropsWithRef<"span"> {
  /** Full name; used for initials and accessible label. */
  name: string;
  src?: string;
  /** sm 28px, md 32px, lg 40px. */
  size?: AvatarSize;
}

/** Circular avatar with mono initials fallback. */
export function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  const initials = name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span role="img" aria-label={name} className={cn("ds-avatar", size !== "md" && `ds-avatar--${size}`, className)} {...props}>
      {src ? <img src={src} alt="" /> : initials}
    </span>
  );
}

export interface ProgressProps extends ComponentPropsWithRef<"div"> {
  /** 0–100. */
  value: number;
  label: string;
}

/** 4px crimson progress bar. */
export function Progress({ value, label, className, ...props }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} className={cn("ds-progress", className)} {...props}>
      <div className="ds-progress__bar" style={{ width: `${v}%` }} />
    </div>
  );
}

export type DividerProps = ComponentPropsWithRef<"hr">;

/** 1px hairline divider with 24px vertical margin. */
export function Divider({ className, ...props }: DividerProps) {
  return <hr className={cn("ds-divider", className)} {...props} />;
}

export interface SkeletonProps extends ComponentPropsWithRef<"div"> {
  width?: number | string;
  height?: number | string;
}

/** Loading placeholder with subtle shimmer. */
export function Skeleton({ width = "100%", height = 16, className, style, ...props }: SkeletonProps) {
  return <div aria-hidden className={cn("ds-skeleton", className)} style={{ width, height, ...style }} {...props} />;
}
