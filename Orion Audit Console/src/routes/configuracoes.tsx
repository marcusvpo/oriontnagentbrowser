import { Cable, FileCheck2, Building2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge, Field, Input } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { API_BASE_URL, CONTRACTS_VERSION, USE_MOCK } from "@/services/api";
import { useRealtimeStatus } from "@/hooks/useSupabaseRealtime";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Configurações · Orion Audit Console" },
      { name: "description", content: "Endereço da API, modo mock ou real e versão dos contratos em uso (somente leitura)." },
      { property: "og:title", content: "Configurações · Orion Audit Console" },
      { property: "og:description", content: "Configuração de conexão do Orion Audit Console." },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const realtime = useRealtimeStatus();
  return (
    <AppShell crumbs={[{ label: "Dashboard", to: "/" }, { label: "Configurações" }]}>
      <div className="page-head">
        <div className="page-head-text">
        <span className="t-overline">Somente leitura</span>
        <h1 className="t-h1">Configurações</h1>
        <p className="t-body">Conexão, contratos e ambiente em uso.</p>
        </div>
        <Badge status="neutral">Somente leitura</Badge>
      </div>
      <div className="settings-layout">
        <section className="settings-section" aria-labelledby="connection-title">
          <div className="section-heading"><h2 id="connection-title" className="t-h3 icon-inline"><Cable size={20} strokeWidth={1.5} />Conexão</h2>{USE_MOCK ? <Badge status="warning">Dados simulados</Badge> : <Badge status="passed">Conexão real</Badge>}</div>
          <Field label="Endereço da API" hint={USE_MOCK ? "Ignorada enquanto o modo mock estiver ativo." : undefined}>
            {(p) => <Input {...p} font="mono" readOnly value={API_BASE_URL} />}
          </Field>
          <Field label="Supabase Realtime (postgres_changes)">
            {(p) => (
              <Input
                {...p}
                font="mono"
                readOnly
                value={
                  realtime === "connected"
                    ? "Conectado (routines, routine_steps, governance_events, runner_jobs, routine_reviews)"
                    : realtime === "connecting"
                      ? "Conectando..."
                      : realtime === "error"
                        ? "Erro de conexão no canal Realtime"
                        : "Desabilitado"
                }
              />
            )}
          </Field>
        </section>
        <section className="settings-section" aria-labelledby="contract-title">
          <h2 id="contract-title" className="t-h3 icon-inline"><FileCheck2 size={20} strokeWidth={1.5} />Contratos</h2>
          <Field label="Versão dos contratos">{(p) => <Input {...p} font="mono" readOnly value={CONTRACTS_VERSION} />}</Field>
        </section>
        <section className="settings-section" aria-labelledby="environment-title">
          <h2 id="environment-title" className="t-h3 icon-inline"><Building2 size={20} strokeWidth={1.5} />Ambiente</h2>
          <span className="t-body-l">Homologação — Cartório Fictício de Notas</span>
          <Badge status="neutral">Somente leitura</Badge>
        </section>
      </div>
    </AppShell>
  );
}
