import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Filter,
  Flag,
  LayoutDashboard,
  ListChecks,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Telescope,
} from "lucide-react";
import { Badge, Button, Header, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { USE_MOCK } from "@/services/api";
import { useRevisoes, useRotinas } from "@/hooks/useRotinas";
import { useRealtimeStatus } from "@/hooks/useSupabaseRealtime";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { PRESETS } from "@/lib/search";
import { computeSidebarAutoCollapse } from "@/lib/sidebar";
import { ToastViewport } from "@/lib/toast";
import { CommandSearch } from "./CommandSearch";

export interface Crumb {
  label: string;
  to?: string;
}

const NAV = [
  { to: "/", label: "Painel", icon: LayoutDashboard, exact: true },
  { to: "/rotinas", label: "Rotinas", icon: ListChecks, exact: false },
  { to: "/revisoes", label: "Revisões", icon: Flag, exact: false },
  { to: "/configuracoes", label: "Configurações", icon: Settings, exact: false },
] as const;

function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { data, isLoading: loadingRotinas } = useRotinas({ pageSize: 1 });
  const { data: reviewsData } = useRevisoes();
  const c = data?.meta.stats.curadoria;
  const pendingExportReviews = reviewsData?.meta.pendentesExportacao ?? c?.totalRevisoesPendentes ?? 0;

  const counts: Record<string, number | undefined> = {
    apoio_humano: c?.precisamApoioHumano,
    prontas_conferencia: c?.prontasConferencia,
    revisao_pendente: c?.revisaoPendenteExportacao,
    ingeridas_agente: c?.rotinasComIngestao,
    aprovadas_kb: c?.aprovadasKb ?? data?.meta.stats.aprovadas,
  };

  return (
    <aside className="app-sidebar" data-collapsed={collapsed} aria-label="Navegação principal">
      <div className="row-between">
        <Link to="/" className="app-brand" aria-label="Orion Audit Console">
          <span className="app-brand-mark">
            <Telescope size={20} strokeWidth={1.5} />
          </span>
          <span className="app-hide-collapsed stack-1">
            <span>Orion Audit</span>
            <span className="t-overline-xs">Central de curadoria</span>
          </span>
        </Link>
      </div>
      <nav className="app-nav">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.exact, includeSearch: false }}
            className="app-nav-link"
            title={n.label}
          >
            <n.icon size={16} strokeWidth={1.5} aria-hidden />
            <span className="app-hide-collapsed">{n.label}</span>
            {n.to === "/revisoes" && pendingExportReviews > 0 && (
              <span
                className="app-nav-count app-hide-collapsed crimson"
                title={`${pendingExportReviews} revisão(ões) pendente(s) de exportação para o agente`}
              >
                {pendingExportReviews}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="stack-2 app-hide-collapsed">
        <span className="t-overline-xs">Estágios de curadoria</span>
        <nav className="app-nav" aria-label="Filtros rápidos de curadoria">
          {PRESETS.map((p) => (
            <Link
              key={p.key}
              to="/rotinas"
              search={p.search}
              activeOptions={{ includeSearch: true }}
              className="app-nav-link"
            >
              {p.accent ? (
                <span className={`preset-dot preset-dot--${p.accent}`} aria-hidden />
              ) : (
                <Filter size={14} strokeWidth={1.5} aria-hidden />
              )}
              <span>{p.label}</span>
              <span className="app-nav-count">
                {loadingRotinas && counts[p.key] === undefined ? "…" : (counts[p.key] ?? 0)}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="app-sidebar-footer">
        <span className="t-overline-xs app-hide-collapsed">Orion TN · Auditoria & Calibragem</span>
        <Button
          variant="ghost"
          size="sm"
          iconOnly={collapsed}
          onClick={onToggle}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <PanelLeftOpen size={14} strokeWidth={1.5} />
          ) : (
            <>
              <PanelLeftClose size={14} strokeWidth={1.5} /> Recolher
            </>
          )}
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
              {c.to && i < crumbs.length - 1 ? (
                <Link to={c.to}>{c.label}</Link>
              ) : (
                <span aria-current={i === crumbs.length - 1 ? "page" : undefined}>{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      }
      actions={
        <>
          {USE_MOCK ? (
            <Tooltip content="Dados simulados localmente (VITE_USE_MOCK=true)">
              <Badge status="warning" tabIndex={0}>
                Mock
              </Badge>
            </Tooltip>
          ) : realtime === "connected" ? (
            <Tooltip content="Sincronização ao vivo via Supabase Realtime ativa">
              <Badge status="passed" tabIndex={0}>
                Ao vivo
              </Badge>
            </Tooltip>
          ) : realtime === "connecting" ? (
            <Tooltip content="Conectando à sincronização em tempo real">
              <Badge status="running" tabIndex={0}>
                Conectando
              </Badge>
            </Tooltip>
          ) : realtime === "error" ? (
            <Tooltip content="Oscilação na sincronização em tempo real">
              <Badge status="warning" tabIndex={0}>
                Offline
              </Badge>
            </Tooltip>
          ) : null}
          <Button variant="ghost" onClick={onSearch} aria-label="Buscar rotina (Ctrl+K)">
            <Search size={16} strokeWidth={1.5} />{" "}
            <span className="app-search-label">Buscar rotina</span>
          </Button>
        </>
      }
    />
  );
}

export function AppShell({
  crumbs,
  children,
  flush,
  autoCollapseSidebar = false,
}: {
  crumbs: Crumb[];
  children: ReactNode;
  flush?: boolean;
  autoCollapseSidebar?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const restoredAfterAutoRef = useRef<boolean | null>(null);
  const prevAutoRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCollapsed(localStorage.getItem("orion.sidebar") === "1");
  }, []);

  useEffect(() => {
    const wasAuto = prevAutoRef.current;
    prevAutoRef.current = autoCollapseSidebar;
    if (wasAuto === autoCollapseSidebar) return;

    setCollapsed((curr) => {
      const next = computeSidebarAutoCollapse({
        wasAuto,
        isAuto: autoCollapseSidebar,
        collapsed: curr,
        wasAutoCollapsed: restoredAfterAutoRef.current,
      });
      restoredAfterAutoRef.current = next.wasAutoCollapsed;
      return next.collapsed;
    });
  }, [autoCollapseSidebar]);

  const toggle = () => {
    restoredAfterAutoRef.current = null;
    setCollapsed((c) => {
      const next = !c;
      if (typeof window !== "undefined") localStorage.setItem("orion.sidebar", next ? "1" : "0");
      return next;
    });
  };
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
