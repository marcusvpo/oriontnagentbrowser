import { format } from "date-fns";

export const fmtDate = (iso?: string) => (iso ? format(new Date(iso), "dd/MM/yyyy HH:mm") : "—");
export const fmtPct = (v: number, digits = 1) => `${(v * 100).toLocaleString("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: digits })}%`;
export const fmtKb = (b?: number) => (b ? `${Math.round(b / 1024).toLocaleString("pt-BR")} KB` : "");
export const fmtDuration = (s?: number) => (s === undefined ? "—" : s >= 60 ? `${Math.floor(s / 60)}min ${s % 60}s` : `${s}s`);
export const rotinaHref = (id: string) => `/rotinas/${encodeURIComponent(id)}`;
