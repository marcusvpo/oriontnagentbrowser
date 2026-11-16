import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, HeadContent, Scripts, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { FileQuestion } from "lucide-react";
import { Button, EmptyState } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";

import appCss from "../styles.css?url";
import themeCss from "../design-system/orion-audit-console---design-system-bdbb01/design-system/theme.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Orion Audit Console" },
      { name: "description", content: "Painel interno de revisão e aprovação de auditorias das rotinas do ERP notarial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: themeCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <EmptyState
      icon={<FileQuestion size={24} strokeWidth={1.5} />}
      title="Página não encontrada"
      description="O endereço acessado não existe no Orion Audit Console."
      action={<Link to="/"><Button>Voltar ao Dashboard</Button></Link>}
    />
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RealtimeBridge() {
  useSupabaseRealtime();
  return null;
}

// Keep this root providers-only: canvas preview routes (/__mockup,
// /__component) render inside it, so any chrome leaks into every frame.
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeBridge />
      <Outlet />
    </QueryClientProvider>
  );
}
