import { useEffect, useRef } from "react";

export type ShortcutMap = Record<string, (e: KeyboardEvent) => void>;

/** Atalhos de teclado globais. Ignora digitação em campos de texto. Chaves: "ArrowLeft", "j", "+", "mod+k"… */
export function useKeyboardShortcuts(map: ShortcutMap, enabled = true) {
  const ref = useRef(map);
  ref.current = map;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      const key = (e.ctrlKey || e.metaKey ? "mod+" : "") + (e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (typing && !key.startsWith("mod+")) return;
      if (document.querySelector("dialog[open]") && !key.startsWith("mod+")) return;
      const fn = ref.current[key];
      if (fn) { e.preventDefault(); fn(e); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}
