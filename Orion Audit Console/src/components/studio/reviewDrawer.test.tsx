import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { ReviewDrawer } from "@/components/governance/ReviewDialog";
import { RoutineReviewsDrawer } from "@/components/reviews/ReviewLibrary";
import { computeSidebarAutoCollapse } from "@/lib/sidebar";
import type { RoutineDetail } from "@/types/api";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, className }: { children: ReactNode; to?: string; className?: string }) => (
    <a href={to ?? "#"} className={className}>
      {children}
    </a>
  ),
}));

const rotinaFixture: RoutineDetail = {
  summary: {
    id: "M-16.2",
    titulo: "Parametrizar Captura e Digitalização",
    modulo: "config",
    secao: "M",
    fase: 2,
    temVideo: false,
    workloadType: "mutation",
    statusAuditoria: "validado_inalterado",
    reviewTags: [],
    tagsRevisao: [],
    statusGovernanca: "pendente_aprovacao",
    runner: { estado: "idle" },
    pastaAuditoria: "M-16.2-parametrizar-captura",
    totalPassos: 2,
    printsGeradas: 2,
    divergenciasCount: 0,
    rotasHash: ["#/configuracoes"],
    tags: ["config"],
    updatedAt: "2026-11-17T10:00:00.000Z",
  },
  original: {
    id: "M-16.2",
    titulo: "Parametrizar Captura e Digitalização",
    modulo: "config",
    secao: "M",
    tem_video: false,
    workloadType: "mutation",
    frontmatter: {},
    descricao: "Descrição da rotina.",
    steps: [
      { stepNumber: 1, rawText: "Acesse **Configurações**.", targets: ["Configurações"], actionType: "click" },
      { stepNumber: 2, rawText: "Clique em **Salvar**.", targets: ["Salvar"], actionType: "click" },
    ],
    observacoes: [],
    rawContent: "",
  },
  report: null,
  auditoriaUi: null,
  steps: [
    {
      stepNumber: 1,
      actionType: "click",
      targets: ["Configurações"],
      originalText: "Acesse **Configurações**.",
      validatedText: "Acesse **Configurações**.",
      isModified: false,
      status: "ok",
      stepScope: "orion_tn",
      media: null,
    },
    {
      stepNumber: 2,
      actionType: "click",
      targets: ["Salvar"],
      originalText: "Clique em **Salvar**.",
      validatedText: "Clique em **Salvar**.",
      isModified: false,
      status: "ok",
      stepScope: "orion_tn",
      media: null,
    },
  ],
  frontmatterOriginalYaml: "",
  frontmatterRevisadoYaml: "",
  markdownRevisado: "",
  historico: [],
  revisoes: [],
};

describe("Drawer lateral de revisão e recolhimento automático da sidebar", () => {
  it("SideDrawer renderiza como painel lateral (<aside>) não bloqueante apenas quando aberto", () => {
    expect(
      renderToStaticMarkup(
        <SideDrawer open={false} onClose={vi.fn()} title="Fechado">
          <p>Conteúdo</p>
        </SideDrawer>,
      ),
    ).toBe("");

    const html = renderToStaticMarkup(
      <SideDrawer open onClose={vi.fn()} kicker="Painel" title="Últimas Revisões">
        <p>Corpo do drawer</p>
      </SideDrawer>,
    );
    expect(html).toContain('data-testid="studio-drawer"');
    expect(html).toContain("studio-drawer");
    expect(html).not.toContain("<dialog");
    expect(html).toContain("Últimas Revisões");
    expect(html).toContain("Corpo do drawer");
  });

  it("ReviewDrawer renderiza Marcar revisão como drawer lateral direito (sem dialog) com atalho do passo ativo", () => {
    const qc = new QueryClient();
    const html = renderToStaticMarkup(
      <QueryClientProvider client={qc}>
        <ReviewDrawer
          open
          onClose={vi.fn()}
          rotina={rotinaFixture}
          activeStepNumber={2}
          reviewsCount={3}
          onOpenReviews={vi.fn()}
        />
      </QueryClientProvider>,
    );
    expect(html).toContain('data-testid="studio-drawer"');
    expect(html).not.toContain("<dialog");
    expect(html).toContain("Marcar M-16.2 para revisão");
    expect(html).toContain("+ Passo 2 em tela");
    expect(html).toContain("Ver revisões (3)");
  });

  it("RoutineReviewsDrawer renderiza Últimas Revisões como drawer lateral sem modal central", () => {
    const qc = new QueryClient();
    const html = renderToStaticMarkup(
      <QueryClientProvider client={qc}>
        <RoutineReviewsDrawer
          open
          onClose={vi.fn()}
          routineId="M-16.2"
          routineTitle="Parametrizar Captura e Digitalização"
          onNewReview={vi.fn()}
        />
      </QueryClientProvider>,
    );
    expect(html).toContain('data-testid="studio-drawer"');
    expect(html).not.toContain("<dialog");
    expect(html).toContain("Últimas Revisões · M-16.2");
    expect(html).toContain("Nova revisão");
  });

  it("computeSidebarAutoCollapse recolhe sidebar expandida ao abrir o drawer e restaura ao fechar", () => {
    // Expandida -> abre drawer: recolhe automaticamente e marca para restaurar
    const opened = computeSidebarAutoCollapse({
      wasAuto: false,
      isAuto: true,
      collapsed: false,
      wasAutoCollapsed: null,
    });
    expect(opened).toEqual({ collapsed: true, wasAutoCollapsed: true });

    // Fecha drawer após recolhimento automático: restaura expansão
    const closed = computeSidebarAutoCollapse({
      wasAuto: true,
      isAuto: false,
      collapsed: true,
      wasAutoCollapsed: opened.wasAutoCollapsed,
    });
    expect(closed).toEqual({ collapsed: false, wasAutoCollapsed: null });

    // Já recolhida antes -> abre drawer: permanece recolhida e não reexpande ao fechar
    const alreadyCollapsed = computeSidebarAutoCollapse({
      wasAuto: false,
      isAuto: true,
      collapsed: true,
      wasAutoCollapsed: null,
    });
    expect(alreadyCollapsed).toEqual({ collapsed: true, wasAutoCollapsed: false });

    const closedFromPreCollapsed = computeSidebarAutoCollapse({
      wasAuto: true,
      isAuto: false,
      collapsed: true,
      wasAutoCollapsed: alreadyCollapsed.wasAutoCollapsed,
    });
    expect(closedFromPreCollapsed).toEqual({ collapsed: true, wasAutoCollapsed: null });

    // Usuário expandiu manualmente enquanto o drawer estava aberto (wasAutoCollapsed = null): respeita
    const manualOverrideClose = computeSidebarAutoCollapse({
      wasAuto: true,
      isAuto: false,
      collapsed: false,
      wasAutoCollapsed: null,
    });
    expect(manualOverrideClose).toEqual({ collapsed: false, wasAutoCollapsed: null });
  });
});
