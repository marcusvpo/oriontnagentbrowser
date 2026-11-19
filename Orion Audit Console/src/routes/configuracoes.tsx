import { Cable, FileCheck2, Compass } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Badge, Card, Field, Input } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { AppShell } from "@/components/layout/AppShell";
import { API_BASE_URL, CONTRACTS_VERSION, USE_MOCK } from "@/services/api";
import { useRealtimeStatus } from "@/hooks/useSupabaseRealtime";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Configurações · Orion Audit Console" },
      {
        name: "description",
        content: "Conexão, sincronização em tempo real e arquitetura operacional do Orion Audit Console.",
      },
      { property: "og:title", content: "Configurações · Orion Audit Console" },
      { property: "og:description", content: "Configuração e arquitetura do Orion Audit Console." },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const realtime = useRealtimeStatus();
  const apiDisplay = API_BASE_URL ? API_BASE_URL : "Mesmo domínio (/api · Vercel Serverless)";

  return (
    <AppShell crumbs={[{ label: "Painel", to: "/" }, { label: "Configurações" }]}>
      <div className="page-head">
        <div className="page-head-text">
          <span className="t-overline">Somente leitura</span>
          <h1 className="t-h1">Configurações</h1>
          <p className="t-body">Conexão com o Supabase, contratos ativos e fluxo operacional da plataforma.</p>
        </div>
        <Badge status="neutral">Central de Curadoria</Badge>
      </div>

      <Card kicker="Como o Orion Audit opera (sem acionamento remoto do motor)">
        <div className="workflow-steps">
          <div className="workflow-step">
            <span className="t-mono crimson">01 · Motor local</span>
            <strong className="t-label">Auditoria na VPN</strong>
            <span className="t-body-s dim">
              O motor roda exclusivamente no ambiente local e envia prints, textos e diagnósticos para o Supabase.
            </span>
          </div>
          <div className="workflow-step">
            <span className="t-mono ok">02 · Curadoria web</span>
            <strong className="t-label">Validação humana</strong>
            <span className="t-body-s dim">
              SD e Produtos conferem prints e passo a passo, aprovam para a Base KB ou registram revisões detalhadas.
            </span>
          </div>
          <div className="workflow-step">
            <span className="t-mono ingested">03 · Exportação em massa</span>
            <strong className="t-label">Pacote de revisões</strong>
            <span className="t-body-s dim">
              Baixe o pacote consolidado em Markdown e marque automaticamente as rotinas como ingeridas pelo agente.
            </span>
          </div>
          <div className="workflow-step">
            <span className="t-mono">04 · Calibragem</span>
            <strong className="t-label">Evolução do agente</strong>
            <span className="t-body-s dim">
              O pacote é analisado manualmente no Antigravity para enriquecer o conhecimento antes da próxima execução.
            </span>
          </div>
        </div>
      </Card>

      <div className="settings-layout">
        <section className="settings-section" aria-labelledby="connection-title">
          <div className="section-heading">
            <h2 id="connection-title" className="t-h3 icon-inline">
              <Cable size={20} strokeWidth={1.5} />
              Conexão
            </h2>
            {USE_MOCK ? (
              <Badge status="warning">Dados simulados</Badge>
            ) : (
              <Badge status="passed">Conexão real (Supabase)</Badge>
            )}
          </div>
          <Field
            label="Endereço da API"
            hint={USE_MOCK ? "Ignorado enquanto o modo mock estiver ativo." : undefined}
          >
            {(p) => <Input {...p} font="mono" readOnly value={apiDisplay} />}
          </Field>
          <Field
            label="Sincronização em Tempo Real (Supabase Realtime)"
            hint="Tabelas monitoradas: routines, routine_steps, governance_events, routine_reviews, review_export_batches"
          >
            {(p) => (
              <Input
                {...p}
                font="mono"
                readOnly
                value={
                  realtime === "connected"
                    ? "Conectado · 5 tabelas sincronizadas ao vivo"
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
          <h2 id="contract-title" className="t-h3 icon-inline">
            <FileCheck2 size={20} strokeWidth={1.5} />
            Contratos
          </h2>
          <Field label="Versão da plataforma">
            {(p) => <Input {...p} font="mono" readOnly value={CONTRACTS_VERSION} />}
          </Field>
        </section>

        <section className="settings-section" aria-labelledby="environment-title">
          <h2 id="environment-title" className="t-h3 icon-inline">
            <Compass size={20} strokeWidth={1.5} />
            Escopo
          </h2>
          <span className="t-body-l">Orion TN · Avaliação, Documentação & Calibragem</span>
          <Badge status="neutral">Desacoplado do motor local</Badge>
        </section>
      </div>
    </AppShell>
  );
}
