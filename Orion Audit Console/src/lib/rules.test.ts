import { describe, expect, it } from "vitest";
import { confidenceTone, isReviewState, normalizeAudit, REVIEW_TAG_META, reviewPrefix, sortTags, tagsOf, tagsOfSummary } from "./status";
import { estimateTokens, lintText, TOKEN_LIMIT } from "./lint";

describe("regras do Orion", () => {
  it("confiança ≥ 0.85 é verde", () => expect(confidenceTone(0.85)).toBe("passed"));
  it("confiança 0.70–0.85 é âmbar", () => expect(confidenceTone(0.72)).toBe("warning"));
  it("confiança < 0.70 é vermelha", () => expect(confidenceTone(0.69)).toBe("failed"));
  it("status legado vira validado_inalterado", () => expect(normalizeAudit("validado_com_sucesso")).toBe("validado_inalterado"));
  it("[!!!] legado (requer_revisao_humana) vira [ATT]", () => expect(normalizeAudit("requer_revisao_humana")).toBe("atualizacao_editorial"));
  it("prefixo de revisão humana por status (ADR-021)", () => {
    expect(reviewPrefix("atualizacao_editorial")).toBe("[ATT] ");
    expect(reviewPrefix("dependencia_dados_banco")).toBe("[DDD] ");
    expect(reviewPrefix("dependencia_cruzada_rotina")).toBe("[XRX] ");
    expect(reviewPrefix("validado_inalterado")).toBe("");
    expect(isReviewState("nao_auditada")).toBe(false);
  });
  it("[CCC] é um status de revisão humana (ADR-024)", () => {
    expect(reviewPrefix("comunicacao_externa")).toBe("[CCC] ");
    expect(isReviewState("comunicacao_externa")).toBe(true);
  });
  it("multi-tags: ordem canônica ATT, CCC, DDD, XRX e sem espaço entre colchetes (ADR-024)", () => {
    expect(reviewPrefix("atualizacao_editorial", ["CCC", "ATT"])).toBe("[ATT][CCC] ");
    expect(reviewPrefix("dependencia_dados_banco", ["XRX", "DDD", "CCC"])).toBe("[CCC][DDD][XRX] ");
    expect(sortTags(["xrx", "[ATT]", "ATT", "lixo"])).toEqual(["ATT", "XRX"]);
    // sem a lista completa (API antiga), vale a tag do status principal
    expect(tagsOf("comunicacao_externa")).toEqual(["CCC"]);
    expect(tagsOf("validado_inalterado", [])).toEqual([]);
    expect(tagsOfSummary({ statusAuditoria: "atualizacao_editorial", reviewTags: ["CCC", "ATT"] })).toEqual(["ATT", "CCC"]);
    expect(tagsOfSummary({ statusAuditoria: "atualizacao_editorial", tagsRevisao: ["ATT", "CCC"] })).toEqual(["ATT", "CCC"]);
    expect(REVIEW_TAG_META.CCC.extraClass).toBe("ds-badge--external");
  });
  it("video_id é bloqueado", () => expect(lintText("use video_id aqui").some((i) => i.level === "error")).toBe(true));
  it("bunny_video_id é permitido", () => expect(lintText("bunny_video_id").length).toBe(0));
  it("termo de UI sem negrito gera aviso", () => expect(lintText("Clique no Botão Salvar").length).toBe(1));
  it("termo de UI em negrito não gera aviso", () => expect(lintText("Clique no **Botão Salvar**").length).toBe(0));
  it("tokens = caracteres ÷ 4 e limite 1800", () => { expect(estimateTokens("a".repeat(400))).toBe(100); expect(TOKEN_LIMIT).toBe(1800); });
});
