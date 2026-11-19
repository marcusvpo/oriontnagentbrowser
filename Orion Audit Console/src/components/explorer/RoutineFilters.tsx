import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button, Checkbox, Field, Input, Select } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import {
  AUDIT_STATUS,
  GOV_STATUS,
  INGESTION_META,
  MODULO_LABEL,
  MODULOS,
  REVIEW_TAG_LABEL,
  REVIEW_TAG_ORDER,
  SECAO_LABEL,
  SECOES,
} from "@/lib/status";
import type { RotinasSearch } from "@/lib/search";
import { phaseSplit } from "@/lib/attDiagnosis";
import type { PhaseStats } from "@/types/api";

type Patch = (p: Partial<RotinasSearch>) => void;

const toggleIn = (csv: string | undefined, v: string) => {
  const set = new Set((csv ?? "").split(",").filter(Boolean));
  if (set.has(v)) set.delete(v);
  else set.add(v);
  return set.size ? [...set].join(",") : undefined;
};
const has = (csv: string | undefined, v: string) => (csv ?? "").split(",").includes(v);

export function RoutineFilters({
  search,
  onChange,
  phases,
}: {
  search: RotinasSearch;
  onChange: Patch;
  phases?: PhaseStats[];
}) {
  const split = phaseSplit(phases);
  const [q, setQ] = useState(search.q ?? "");
  const [more, setMore] = useState(false);
  useEffect(() => setQ(search.q ?? ""), [search.q]);
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? "") !== q) onChange({ q: q || undefined });
    }, 300);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const single = (csv?: string) => (csv && !csv.includes(",") ? csv : "");

  return (
    <div className="filters">
      <Field
        label="Busca"
        className="filters-search"
        hint={q.startsWith("#/") ? "Buscando apenas em rotas hash" : undefined}
      >
        {(p) => (
          <Input
            {...p}
            font="mono"
            type="search"
            placeholder="ID, título, lote, tag ou #/rota"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        )}
      </Field>
      <Field label="Módulo">
        {(p) => (
          <Select
            {...p}
            value={single(search.modulo)}
            onChange={(e) => onChange({ modulo: e.target.value || undefined })}
          >
            <option value="">{search.modulo?.includes(",") ? "Vários" : "Todos"}</option>
            {MODULOS.map((m) => (
              <option key={m} value={m}>
                {MODULO_LABEL[m] ?? m}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Fase">
        {(p) => (
          <Select
            {...p}
            value={search.fase ?? ""}
            onChange={(e) => onChange({ fase: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {[1, 2, 3, 4, 5, 6].map((f) => (
              <option key={f} value={f}>
                Fase {f}
              </option>
            ))}
            <option value="sem_fase">Sem fase</option>
          </Select>
        )}
      </Field>
      <Field label="Status auditoria">
        {(p) => (
          <Select
            {...p}
            value={single(search.status)}
            onChange={(e) => onChange({ status: e.target.value || undefined })}
          >
            <option value="">{search.status?.includes(",") ? "Vários" : "Todos"}</option>
            {Object.entries(AUDIT_STATUS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Tag de atenção">
        {(p) => (
          <Select
            {...p}
            value={single(search.tag)}
            onChange={(e) => onChange({ tag: e.target.value || undefined })}
          >
            <option value="">{search.tag?.includes(",") ? "Várias" : "Todas"}</option>
            {REVIEW_TAG_ORDER.map((t) => (
              <option key={t} value={t}>
                [{t}] {REVIEW_TAG_LABEL[t]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field label="Revisão / Agente">
        {(p) => (
          <Select
            {...p}
            value={single(search.ingestao)}
            onChange={(e) => onChange({ ingestao: e.target.value || undefined })}
          >
            <option value="">{search.ingestao?.includes(",") ? "Vários" : "Todas"}</option>
            {Object.entries(INGESTION_META).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Button onClick={() => setMore(true)}>
        <SlidersHorizontal size={14} strokeWidth={1.5} />
        Mais filtros
      </Button>

      {split.length > 0 && (
        <div
          className="row"
          role="group"
          aria-label="Filtro rápido por fase"
          data-testid="phase-quick-filter"
          style={{ gridColumn: "1 / -1" }}
        >
          <span className="t-overline-xs">Fases</span>
          {split.map((p) => {
            const active = search.fase === String(p.fase);
            return (
              <Button
                key={p.fase}
                size="sm"
                variant={active ? undefined : "ghost"}
                aria-pressed={active}
                onClick={() => onChange({ fase: active ? undefined : String(p.fase) })}
              >
                Fase {p.fase} · {p.total} rotinas ({p.att + p.ddd + p.xrx} em revisão)
              </Button>
            );
          })}
        </div>
      )}

      <Modal
        open={more}
        onClose={() => setMore(false)}
        title="Mais filtros"
        footer={<Button onClick={() => setMore(false)}>Fechar</Button>}
      >
        <div className="stack-6">
          <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="ds-field__label">Status de auditoria</legend>
            {Object.entries(AUDIT_STATUS).map(([k, v]) => (
              <Checkbox
                key={k}
                checked={has(search.status, k)}
                onChange={() => onChange({ status: toggleIn(search.status, k) })}
              >
                {v.label}
              </Checkbox>
            ))}
          </fieldset>
          <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="ds-field__label">Tags de atenção (uma rotina pode ter várias)</legend>
            {REVIEW_TAG_ORDER.map((t) => (
              <Checkbox
                key={t}
                checked={has(search.tag, t)}
                onChange={() => onChange({ tag: toggleIn(search.tag, t) })}
              >
                [{t}] {REVIEW_TAG_LABEL[t]}
              </Checkbox>
            ))}
          </fieldset>
          <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="ds-field__label">Governança</legend>
            {Object.entries(GOV_STATUS).map(([k, v]) => (
              <Checkbox
                key={k}
                checked={has(search.gov, k)}
                onChange={() => onChange({ gov: toggleIn(search.gov, k) })}
              >
                {v.label}
              </Checkbox>
            ))}
          </fieldset>
          <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="ds-field__label">Calibragem / Ingestão pelo agente</legend>
            {Object.entries(INGESTION_META).map(([k, v]) => (
              <Checkbox
                key={k}
                checked={has(search.ingestao, k)}
                onChange={() => onChange({ ingestao: toggleIn(search.ingestao, k) })}
              >
                {v.label}
              </Checkbox>
            ))}
          </fieldset>
          <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="ds-field__label">Seção</legend>
            <div className="row-3">
              {SECOES.map((s) => (
                <Checkbox
                  key={s}
                  checked={has(search.secao, s)}
                  onChange={() => onChange({ secao: toggleIn(search.secao, s) })}
                >
                  {s} · {SECAO_LABEL[s]}
                </Checkbox>
              ))}
            </div>
          </fieldset>
          <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="ds-field__label">Módulos</legend>
            <div className="row-3">
              {MODULOS.map((m) => (
                <Checkbox
                  key={m}
                  checked={has(search.modulo, m)}
                  onChange={() => onChange({ modulo: toggleIn(search.modulo, m) })}
                >
                  {MODULO_LABEL[m] ?? m}
                </Checkbox>
              ))}
            </div>
          </fieldset>
          <div className="row-3">
            <Checkbox
              checked={search.video === "true"}
              onChange={(e) => onChange({ video: e.target.checked ? "true" : undefined })}
            >
              Tem vídeo
            </Checkbox>
            <Checkbox
              checked={search.div === "true"}
              onChange={(e) => onChange({ div: e.target.checked ? "true" : undefined })}
            >
              Com ajustes automáticos
            </Checkbox>
          </div>
        </div>
      </Modal>
    </div>
  );
}
