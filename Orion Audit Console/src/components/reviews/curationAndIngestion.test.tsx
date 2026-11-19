import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  buildExportJson,
  buildExportMarkdown,
  computeCurationStage,
  computeReviewIngestionFlags,
  computeRoutineReviewRollup,
} from "../../../api/_lib/exportFormat";
import { IngestionBadge } from "@/components/badges/IngestionBadge";
import { CurationPipelineCard } from "@/components/dashboard/CurationPipelineCard";
import { AgentKnowledgeCard } from "@/components/dashboard/AgentKnowledgeCard";
import { RoutinesTable } from "@/components/explorer/RoutinesTable";
import { IngestedRoutineWarningModal } from "@/components/governance/IngestedRoutineWarningModal";
import { IngestedRoutineBanner } from "@/components/studio/IngestedRoutineBanner";
import { StudioHeader } from "@/components/studio/StudioHeader";
import { ReviewCardList } from "@/components/reviews/ReviewLibrary";
import type { CurationStats, RoutineDetail, RoutineReviewItem, RoutineSummary } from "@/types/api";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, className }: { children?: ReactNode; to?: string; className?: string }) => (
    <a href={to ?? "#"} className={className}>
      {children}
    </a>
  ),
}));

const baseSummary: RoutineSummary = {
  id: "M-16.2",
  titulo: "Parametrizar Captura e Digitalização",
  modulo: "config",
  secao: "M",
  fase: 2,
  temVideo: false,
  workloadType: "mutation",
  statusAuditoria: "atualizacao_editorial",
  reviewTags: ["ATT"],
  tagsRevisao: ["ATT"],
  statusGovernanca: "revisao_solicitada",
  pastaAuditoria: "[ATT] M-16.2-parametrizar-captura",
  totalPassos: 4,
  printsGeradas: 2,
  divergenciasCount: 0,
  rotasHash: ["#/configuracoes"],
  tags: ["config"],
  dataExecucao: "2026-11-18T12:00:00.000Z",
  updatedAt: "2026-11-19T10:00:00.000Z",
  revisoesCount: 1,
  revisoesPendentesExportacao: 0,
  revisoesConsumidasCount: 1,
  reviewIngestionState: "ingerida_pelo_agente",
  ultimaIngestaoEm: "2026-11-19T11:30:00.000Z",
  ultimoLoteIngestaoId: "lote-2026-11-19-a1b2",
  ultimaIngestaoPor: "Marcus",
  temNovaRevisaoPosIngestao: false,
  curationStage: "ingeridas_agente",
};

const baseDetail: RoutineDetail = {
  summary: baseSummary,
  original: {
    id: "M-16.2",
    titulo: baseSummary.titulo,
    modulo: "config",
    secao: "M",
    tem_video: false,
    workloadType: "mutation",
    frontmatter: {},
    descricao: "Descrição da rotina.",
    steps: [],
    observacoes: [],
    rawContent: "",
  },
  report: null,
  auditoriaUi: null,
  steps: [],
  frontmatterOriginalYaml: "",
  frontmatterRevisadoYaml: "",
  markdownRevisado: "",
  historico: [],
  revisoes: [],
};

describe("ADR-036 — Ciclo de Ingestão, Exportação em Massa e UX de Curadoria", () => {
  it("calcula flags de ingestão e detecta edição posterior à ingestão (v2 > v1)", () => {
    const pendente = computeReviewIngestionFlags({
      status: "aberta",
      versao: 1,
      consumida_pelo_agente: false,
    });
    expect(pendente).toEqual({
      consumidaPeloAgente: false,
      editadaPosIngestao: false,
      pendenteExportacao: true,
    });

    const ingerida = computeReviewIngestionFlags({
      status: "aberta",
      versao: 1,
      consumida_pelo_agente: true,
      versao_consumida: 1,
    });
    expect(ingerida).toEqual({
      consumidaPeloAgente: true,
      editadaPosIngestao: false,
      pendenteExportacao: false,
    });

    const editadaPos = computeReviewIngestionFlags({
      status: "aberta",
      versao: 2,
      consumida_pelo_agente: true,
      versao_consumida: 1,
    });
    expect(editadaPos).toEqual({
      consumidaPeloAgente: true,
      editadaPosIngestao: true,
      pendenteExportacao: true,
    });
  });

  it("agrega rollup de revisões e classifica estágios de curadoria sem sobreposição", () => {
    const rollup = computeRoutineReviewRollup([
      {
        status: "aberta",
        versao: 1,
        consumida_pelo_agente: true,
        consumida_em: "2026-11-19T11:30:00.000Z",
        consumida_por: "Marcus",
        lote_exportacao_id: "lote-2026-11-19-a1b2",
        versao_consumida: 1,
      },
    ]);
    expect(rollup.reviewIngestionState).toBe("ingerida_pelo_agente");
    expect(rollup.revisoesConsumidasCount).toBe(1);
    expect(rollup.revisoesPendentesExportacao).toBe(0);
    expect(rollup.ultimoLoteIngestaoId).toBe("lote-2026-11-19-a1b2");

    expect(
      computeCurationStage({
        statusGovernanca: "aprovada",
        statusAuditoria: "validado_inalterado",
        revisoesPendentesExportacao: 0,
        revisoesConsumidasCount: 1,
      }),
    ).toBe("aprovadas_kb");

    expect(
      computeCurationStage({
        statusGovernanca: "revisao_solicitada",
        statusAuditoria: "atualizacao_editorial",
        revisoesPendentesExportacao: 0,
        revisoesConsumidasCount: 1,
      }),
    ).toBe("ingeridas_agente");

    expect(
      computeCurationStage({
        statusGovernanca: "revisao_solicitada",
        statusAuditoria: "atualizacao_editorial",
        revisoesPendentesExportacao: 1,
        revisoesConsumidasCount: 1,
      }),
    ).toBe("revisao_pendente");

    expect(
      computeCurationStage({
        statusGovernanca: "pendente_aprovacao",
        statusAuditoria: "atualizacao_editorial",
        revisoesPendentesExportacao: 0,
        revisoesConsumidasCount: 0,
      }),
    ).toBe("apoio_humano");

    expect(
      computeCurationStage({
        statusGovernanca: "pendente_aprovacao",
        statusAuditoria: "validado_com_ajustes",
        revisoesPendentesExportacao: 0,
        revisoesConsumidasCount: 0,
      }),
    ).toBe("prontas_conferencia");
  });

  it("gera pacote Markdown e JSON completos para análise manual no Antigravity", () => {
    const routines = [
      {
        id: "M-16.2",
        titulo: "Parametrizar Captura",
        modulo: "config",
        secao: "M",
        fase: 2,
        statusAuditoria: "atualizacao_editorial",
        reviewTags: ["ATT" as const],
        statusGovernanca: "revisao_solicitada",
        dataExecucao: "2026-11-18T12:00:00.000Z",
        rotasHash: ["#/configuracoes"],
        bloqueio: { tipo: "Defasagem Editorial", motivo: "Botão renomeado." },
        diagnosticoTelaAtt: { passo: 2, rota: "#/configuracoes", botoes: ["Gravar"] },
        steps: [
          {
            stepNumber: 1,
            status: "ok",
            originalText: "Acesse **Configurações**.",
            validatedText: "Acesse **Configurações**.",
            isModified: false,
          },
          {
            stepNumber: 2,
            status: "blocked",
            originalText: "Clique em **Salvar**.",
            validatedText: "Clique em **Gravar**.",
            isModified: true,
          },
        ],
        revisoes: [
          {
            id: "rev-1",
            versao: 1,
            status: "aberta",
            categoria: "divergencia_texto",
            revisor: "Ana (Produtos)",
            atualizadoPor: "Ana (Produtos)",
            criadoEm: "2026-11-19T10:00:00.000Z",
            atualizadoEm: "2026-11-19T10:00:00.000Z",
            passos: [2],
            motivo: "Na tela real o botão chama Gravar e fica no rodapé.",
          },
        ],
      },
    ];

    const md = buildExportMarkdown({
      batchId: "lote-2026-11-19-a1b2",
      operador: "Marcus",
      nota: "Triagem SD",
      marcarComoIngeridas: true,
      exportedAt: "2026-11-19T12:00:00.000Z",
      routines,
    });
    expect(md).toContain("lote-2026-11-19-a1b2");
    expect(md).toContain("M-16.2");
    expect(md).toContain("Na tela real o botão chama Gravar e fica no rodapé.");
    expect(md).toContain("Passo 2");
    expect(md).toContain("Raio-X da Tela Atual");

    const jsonStr = buildExportJson({
      batchId: "lote-2026-11-19-a1b2",
      operador: "Marcus",
      nota: "Triagem SD",
      marcarComoIngeridas: true,
      exportedAt: "2026-11-19T12:00:00.000Z",
      routines,
    });
    const parsed = JSON.parse(jsonStr);
    expect(parsed.schema).toBe("orion-audit-review-export/v1");
    expect(parsed.resumo).toEqual({ totalRotinas: 1, totalRevisoes: 1 });
  });

  it("renderiza IngestionBadge, IngestedRoutineBanner e popup IngestedRoutineWarningModal", () => {
    const badgeHtml = renderToStaticMarkup(<IngestionBadge summary={baseSummary} />);
    expect(badgeHtml).toContain("Ingerida pelo agente");
    expect(badgeHtml).toContain("ds-badge--ingested");

    const bannerHtml = renderToStaticMarkup(
      <IngestedRoutineBanner summary={baseSummary} onOpenReviews={vi.fn()} />,
    );
    expect(bannerHtml).toContain('data-testid="ingested-routine-banner"');
    expect(bannerHtml).toContain("lote-2026-11-19-a1b2");
    expect(bannerHtml).toContain("Marcus");

    const modalHtml = renderToStaticMarkup(
      <IngestedRoutineWarningModal
        open
        routineId="M-16.2"
        routineTitle={baseSummary.titulo}
        action="edit_text"
        ultimaIngestaoEm={baseSummary.ultimaIngestaoEm}
        ultimaIngestaoPor="Marcus"
        ultimoLoteIngestaoId="lote-2026-11-19-a1b2"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(modalHtml).toContain("M-16.2 já foi ingerida pelo agente");
    expect(modalHtml).toContain("Continuar e editar texto");
    expect(modalHtml).toContain("lote-2026-11-19-a1b2");
  });

  it("StudioHeader não expõe Reexecutar/Runner e exibe selos humanos + Aprovar p/ Base KB", () => {
    const html = renderToStaticMarkup(
      <StudioHeader
        rotina={baseDetail}
        editing={false}
        onApprove={vi.fn()}
        onEdit={vi.fn()}
        onReview={vi.fn()}
        onOpenReviews={vi.fn()}
      />,
    );
    expect(html).not.toContain("Reexecutar");
    expect(html).not.toContain("READ_ONLY");
    expect(html).not.toContain("MUTATION");
    expect(html).toContain("Ingerida pelo agente");
    expect(html).toContain("Aprovar p/ Base KB");
  });

  it("RoutinesTable destaca visualmente rotinas ingeridas, aprovadas e pendentes", () => {
    const approvedRow: RoutineSummary = {
      ...baseSummary,
      id: "R-1.1",
      statusGovernanca: "aprovada",
      revisoesConsumidasCount: 0,
      revisoesPendentesExportacao: 0,
      reviewIngestionState: "sem_revisoes",
      curationStage: "aprovadas_kb",
    };
    const pendingRow: RoutineSummary = {
      ...baseSummary,
      id: "D-1.1",
      revisoesConsumidasCount: 0,
      revisoesPendentesExportacao: 2,
      reviewIngestionState: "pendente_exportacao",
      curationStage: "revisao_pendente",
    };
    const html = renderToStaticMarkup(<RoutinesTable rows={[baseSummary, approvedRow, pendingRow]} />);
    expect(html).toContain('data-curation="ingested"');
    expect(html).toContain('data-curation="approved"');
    expect(html).toContain('data-curation="pending-export"');
    expect(html).not.toContain("READ_ONLY");
    expect(html).not.toContain("worker-1");
  });

  it("Dashboard (CurationPipelineCard + AgentKnowledgeCard) e ReviewCardList destacam ingestão", () => {
    const curadoria: CurationStats = {
      aprovadasKb: 45,
      ingeridasAgente: 12,
      revisaoPendenteExportacao: 5,
      precisamApoioHumano: 80,
      prontasConferencia: 29,
      naoAuditadas: 300,
      totalRevisoesPendentes: 7,
      totalRevisoesConsumidas: 18,
      rotinasComIngestao: 14,
      ultimoLote: {
        id: "lote-2026-11-19-a1b2",
        operador: "Marcus",
        formato: "markdown",
        reviewIds: ["rev-1"],
        routineIds: ["M-16.2"],
        totalRevisoes: 1,
        totalRotinas: 1,
        criadoEm: "2026-11-19T11:30:00.000Z",
      },
    };
    const funnelHtml = renderToStaticMarkup(
      <CurationPipelineCard curadoria={curadoria} totalRotinas={471} />,
    );
    expect(funnelHtml).toContain("Aprovadas p/ KB");
    expect(funnelHtml).toContain("Ingeridas p/ agente");
    expect(funnelHtml).toContain("Pendente exportar");

    const knowHtml = renderToStaticMarkup(
      <AgentKnowledgeCard curadoria={curadoria} onOpenExport={vi.fn()} />,
    );
    expect(knowHtml).toContain("Exportar 7 revisão(ões) p/ agente");
    expect(knowHtml).toContain("lote-2026-11-19-a1b2");

    const revItem: RoutineReviewItem = {
      id: "rev-1",
      routineId: "M-16.2",
      rotinaTitulo: baseSummary.titulo,
      rotinaModulo: "config",
      rotinaFase: 2,
      rotinaStatusAuditoria: "atualizacao_editorial",
      rotinaReviewTags: ["ATT"],
      rotinaTotalPassos: 4,
      revisor: "Ana",
      categoria: "divergencia_texto",
      passos: [2],
      motivo: "Botão correto é Gravar no rodapé.",
      status: "aberta",
      versao: 1,
      criadoEm: "2026-11-19T10:00:00.000Z",
      atualizadoEm: "2026-11-19T10:00:00.000Z",
      atualizadoPor: "Ana",
      consumidaPeloAgente: true,
      consumidaEm: "2026-11-19T11:30:00.000Z",
      consumidaPor: "Marcus",
      loteExportacaoId: "lote-2026-11-19-a1b2",
      versaoConsumida: 1,
      editadaPosIngestao: false,
      pendenteExportacao: false,
      versoes: [],
    };
    const cardsHtml = renderToStaticMarkup(<ReviewCardList items={[revItem]} onEdit={vi.fn()} />);
    expect(cardsHtml).toContain("review-card--ingested");
    expect(cardsHtml).toContain("Ingerida pelo agente");
    expect(cardsHtml).toContain("Lote lote-2026-11-19-a1b2");
  });
});
