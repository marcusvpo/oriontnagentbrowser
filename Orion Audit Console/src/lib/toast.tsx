import { useSyncExternalStore } from "react";
import { Alert, Toast } from "@/design-system/orion-audit-console---design-system-bdbb01";

interface Item { id: number; kind: "success" | "error"; title: string; text?: string }
let items: Item[] = [];
let seq = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((s) => s());

export function toast(title: string, text?: string, kind: Item["kind"] = "success") {
  const id = ++seq;
  items = [...items, { id, kind, title, text }];
  emit();
  setTimeout(() => { items = items.filter((i) => i.id !== id); emit(); }, 5000);
}
toast.error = (title: string, text?: string) => toast(title, text, "error");

const EMPTY: Item[] = [];

/** Pilha de toasts usando o Toast (sucesso) e o Alert error (falhas) do Design System. */
export function ToastViewport() {
  const list = useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => items, () => EMPTY);
  return (
    <div className="app-toasts" aria-live="polite">
      {list.map((i) => i.kind === "success"
        ? <Toast key={i.id}><div><strong>{i.title}</strong>{i.text && <div className="t-body-s">{i.text}</div>}</div></Toast>
        : <Alert key={i.id} tone="error" title={i.title} className="app-toast-error">{i.text}</Alert>)}
    </div>
  );
}
