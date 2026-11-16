import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { FileSearch, Hash } from "lucide-react";
import { EmptyState, Input } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import { useRotinas } from "@/hooks/useRotinas";
import { reviewPrefix } from "@/lib/status";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";

/** Busca global (Ctrl+K) por ID, título ou rota hash. */
export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const navigate = useNavigate();
  const { data } = useRotinas({ q: q || undefined, pageSize: 8 });
  const rows = useMemo(() => data?.data ?? [], [data]);
  useEffect(() => setSel(0), [q]);
  useEffect(() => { if (!open) setQ(""); }, [open]);

  const go = (id: string) => { onClose(); navigate({ to: "/rotinas/$id", params: { id } }); };

  return (
    <Modal open={open} onClose={onClose} title="Buscar rotina">
      <Input
        autoFocus font="mono" placeholder="ID, título ou #/rota…" value={q} aria-label="Buscar rotina"
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(rows.length - 1, s + 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
          if (e.key === "Enter" && rows[sel]) go(rows[sel].id);
        }}
      />
      {rows.length === 0 && data ? (
        <EmptyState icon={<FileSearch size={24} strokeWidth={1.5} />} title="Nenhuma rotina encontrada" description="Tente outro ID, título ou rota hash." />
      ) : (
        <ul className="cmd-list" role="listbox" aria-label="Resultados">
          {rows.map((r, i) => (
            <li key={r.id}>
              <button className="cmd-item" role="option" aria-selected={i === sel} onMouseEnter={() => setSel(i)} onClick={() => go(r.id)}>
                <span className="t-mono nowrap">{reviewPrefix(r.statusAuditoria)}{r.id}</span>
                <span className="grow">{r.titulo}</span>
                {q.startsWith("#/") && <span className="chip"><Hash size={12} strokeWidth={1.5} />{r.rotasHash[0]}</span>}
                <AuditStatusBadge status={r.statusAuditoria} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
