import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Filter, Flag, LayoutDashboard, ListChecks, PanelLeftClose, PanelLeftOpen, Search, Settings, Telescope, Workflow } from "lucide-react";
import { Badge, Button, Header, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { USE_MOCK } from "@/services/api";
import { useRevisoes, useRotinas } from "@/hooks/useRotinas";
import { useRealtimeStatus } from "@/hooks/useSupabaseRealtime";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { PRESETS } from "@/lib/search";
import { isReviewState } from "@/lib/status";
import { ToastViewport } from "@/lib/toast";
import { CommandSearch } from "./CommandSearch";

export interface Crumb { label: string; to?: string }

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/rotinas", label: "Explorador", icon: ListChecks, exact: false },
  { to: "/revisoes", label: "Revisões", icon: Flag, exact: false },
  { to: "/fila", label: "Fila do Runner", icon: Workflow, exact: false },
  { to: "/configuracoes", label: "Configurações", icon: Settings, exact: false },
] as const;

function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { data } = useRotinas({ pageSize: 500 });
  const { data: reviewsData } = useRevisoes();
  const rows = data?.data ?? [];
  const openReviewsCount = (reviewsData?.data ?? []).filter((r) => r.status === "aberta" || r.status === "em_andamento").length;
  const counts: Record<string, number> = {
    triagem: rows.filter((r) => (r.statusAuditoria === "validado_com_ajustes" || isReviewState(r.statusAuditoria)) && r.statusGovernanca === "pendente_aprovacao").length,
    criticos: rows.filter((r) => isReviewState(r.statusAuditoria)).length,
    f6: rows.filter((r) => r.statusGovernanca === "aprovada").length,
  };
  return (
    <aside className="app-sidebar" data-collapsed={collapsed} aria-label="Navegação principal">
      <div className="row-between">
        <Link to="/" className="app-brand" aria-label="Orion Audit Console">
          <span className="app-brand-mark"><Telescope size={20} strokeWidth={1.5} /></span>
          <span className="app-hide-collapsed stack-1"><span>Orion Audit</span><span className="t-overline-xs">Console de auditoria</span></span>
        </Link>
      </div>
      <nav className="app-nav">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: n.exact, includeSearch: false }} className="app-nav-link" title={n.label}>
            <n.icon size={16} strokeWidth={1.5} aria-hidden />
            <span className="app-hide-collapsed">{n.label}</span>
            {n.to === "/revisoes" && openReviewsCount > 0 && <span className="app-nav-count app-hide-collapsed">{openReviewsCount}</span>}
          </Link>
        ))}
      </nav>
      <div className="stack-2 app-hide-collapsed">
        <span className="t-overline-xs">Presets rápidos</span>
        <nav className="app-nav" aria-label="Presets de filtro">
          {PRESETS.map((p) => (
            <Link key={p.key} to="/rotinas" search={p.search} activeOptions={{ includeSearch: true }} className="app-nav-link">
              <Filter size={14} strokeWidth={1.5} aria-hidden />
              <span>{p.label}</span>
              <span className="app-nav-count">{counts[p.key]}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="app-sidebar-footer">
        <span className="t-overline-xs app-hide-collapsed">Homologação — Cartório Fictício de Notas</span>
        <Button variant="ghost" size="sm" iconOnly={collapsed} onClick={onToggle} aria-label={collapsed ? "Expandir menu" : "Recolher menu"}>
          {collapsed ? <PanelLeftOpen size={14} strokeWidth={1.5} /> : <><PanelLeftClose size={14} strokeWidth={1.5} /> Recolher</>}
        </Button>
      </div>
    </aside>
  );
}

function Topbar({ crumbs, onSearch }: { crumbs: Crumb[]; onSearch: () => void }) {
  const realtime = useRealtimeStatus();
  return (
    <Header
      logo={
        <nav aria-label="Trilha" className="app-crumbs">
          {crumbs.map((c, i) => (
            <span key={i} className="row">
              {i > 0 && <ChevronRight size={14} strokeWidth={1.5} aria-hidden />}
              {c.to && i < crumbs.length - 1 ? <Link to={c.to}>{c.label}</Link> : <span aria-current={i === crumbs.length - 1 ? "page" : undefined}>{c.label}</span>}
            </span>
          ))}
        </nav>
      }
      actions={
        <>
          {USE_MOCK ? (
            <Tooltip content="Dados simulados localmente (VITE_USE_MOCK=true)">
              <Badge status="warning" tabIndex={0}>Mock</Badge>
            </Tooltip>
          ) : realtime === "connected" ? (
            <Tooltip content="Sincronização em tempo real via Supabase Realtime ativa">
              <Badge status="passed" tabIndex={0}>Ao vivo</Badge>
            </Tooltip>
          ) : realtime === "connecting" ? (
            <Tooltip content="Conectando ao canal Supabase Realtime">
              <Badge status="running" tabIndex={0}>Conectando</Badge>
            </Tooltip>
          ) : realtime === "error" ? (
            <Tooltip content="Oscilação no canal Supabase Realtime">
              <Badge status="warning" tabIndex={0}>Realtime offline</Badge>
            </Tooltip>
          ) : null}
          <Button variant="ghost" onClick={onSearch} aria-label="Buscar rotina (Ctrl+K)">
            <Search size={16} strokeWidth={1.5} /> <span className="app-search-label">Buscar rotina</span>
          </Button>
        </>
      }
    />
  );
}

export function AppShell({ crumbs, children, flush }: { crumbs: Crumb[]; children: ReactNode; flush?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => { setCollapsed(localStorage.getItem("orion.sidebar") === "1"); }, []);
  const toggle = () => setCollapsed((c) => { localStorage.setItem("orion.sidebar", c ? "0" : "1"); return !c; });
  useKeyboardShortcuts({ "mod+k": () => setSearchOpen(true) });
  return (
    <div className="app-shell">
      <AppSidebar collapsed={collapsed} onToggle={toggle} />
      <div className="app-main">
        <Topbar crumbs={crumbs} onSearch={() => setSearchOpen(true)} />
        <main className={flush ? "app-content app-content--flush" : "app-content"}>{children}</main>
      </div>
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ToastViewport />
    </div>
  );
}
