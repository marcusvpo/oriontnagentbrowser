import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AuditStatusBadge } from "@/components/badges/AuditStatusBadge";
import { BlockedBanner } from "@/components/studio/BlockedBanner";
import { ExternalStepCard } from "@/components/studio/ExternalStepCard";
import { Filmstrip } from "@/components/studio/Filmstrip";
import { StepComparisonCard } from "@/components/studio/StepComparisonCard";
import type { StepView } from "@/types/api";

const externalStep: StepView = {
  stepNumber: 1,
  actionType: "navigate",
  targets: ["SISCOAF"],
  originalText: "O Tabelião Titular deve acessar o portal oficial do **SISCOAF** utilizando seu certificado digital e-CPF.",
  validatedText: "O Tabelião Titular deve acessar o portal oficial do **SISCOAF** utilizando seu certificado digital e-CPF.",
  isModified: false,
  status: "ok",
  stepScope: "external_portal",
  portalExterno: "SISCOAF",
  media: null,
};

const internalStep: StepView = {
  stepNumber: 4,
  actionType: "click",
  targets: ["Configurações > Parâmetros Gerais > Comunicação COAF"],
  originalText: "No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.",
  validatedText: "No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.",
  isModified: false,
  status: "blocked",
  stepScope: "orion_tn",
  media: {
    pngUrl: "/media/passo-04.png",
    webpUrl: "/media/passo-04.webp",
    width: 1440,
    height: 900,
  },
};

describe("Exibição multi-tag [ATT][CCC] e destaque de etapa externa", () => {
  it("renderiza badges distintos lado a lado para todas as tags em AuditStatusBadge", () => {
    const html = renderToStaticMarkup(
      <AuditStatusBadge status="atualizacao_editorial" reviewTags={["CCC", "ATT"]} />,
    );
    expect(html).toContain('data-review-tag="ATT"');
    expect(html).toContain('data-review-tag="CCC"');
    expect(html).toContain("[ATT] Atualização editorial");
    expect(html).toContain("[CCC] Comunicação externa");
    expect(html).toContain("ds-badge--external");
    // Apenas badges completos, sem fallback para chip simples
    expect(html.match(/ds-badge/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it("exibe todas as tags no BlockedBanner", () => {
    const html = renderToStaticMarkup(
      <BlockedBanner
        statusAuditoria="atualizacao_editorial"
        reviewTags={["ATT", "CCC"]}
        bloqueio={{
          tipo: "Defasagem Editorial",
          motivo: "Menu ausente no Orion TN.",
          roteiroManual: ["Validar no SISCOAF."],
        }}
      />,
    );
    expect(html).toContain('data-review-tag="ATT"');
    expect(html).toContain('data-review-tag="CCC"');
  });

  it("exibe badge de destaque e portal no cabeçalho de StepComparisonCard para external_portal", () => {
    const html = renderToStaticMarkup(
      <StepComparisonCard step={externalStep} active onSelect={vi.fn()} />,
    );
    expect(html).toContain('data-scope="external_portal"');
    expect(html).toContain('data-testid="external-step-badge"');
    expect(html).toContain("Etapa Externa • Fora do Orion TN");
    expect(html).toContain("SISCOAF");
    expect(html).toContain("Sem print · Validação humana");
  });

  it("renderiza card informativo dedicado ExternalStepCard identificando portal e validação humana", () => {
    const html = renderToStaticMarkup(
      <ExternalStepCard step={externalStep} steps={[externalStep, internalStep]} onSelect={vi.fn()} />,
    );
    expect(html).toContain("Etapa Externa • Fora do Orion TN");
    expect(html).toContain("SISCOAF");
    expect(html).toContain("external_portal (fora do Orion TN)");
    expect(html).toContain("validação humana direta no ambiente externo");
    expect(html).toContain("Ir para o Passo 4 (Orion TN)");
    expect(html).not.toContain("A rotina ainda não foi executada");
  });

  it("diferencia etapa externa na Filmstrip sem ícone de imagem ausente", () => {
    const html = renderToStaticMarkup(
      <Filmstrip steps={[externalStep, internalStep]} active={1} onSelect={vi.fn()} />,
    );
    expect(html).toContain("film-external");
    expect(html).toContain("film-flag--external");
    expect(html).toContain("EXT");
    expect(html).toContain("Passo 1 · Etapa externa (SISCOAF)");
  });
});
