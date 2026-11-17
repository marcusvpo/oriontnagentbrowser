import { describe, expect, it } from "vitest";
import { phaseSplit, reauditTimeline, similarityPct, stateLabel, tabLabel, toDiagnosisView } from "@/lib/attDiagnosis";
import type { PhaseStats } from "@/types/api";

describe("Raio-X [ATT] (diagnostico_tela_att)", () => {
  it("normaliza a visão da UI a partir do frontmatter", () => {
    const v = toDiagnosisView({
      passo: 4,
      rota: "#/ficha/cadastrar",
      titulo_painel: "OrionTN",
      secoes: ["Dados pessoais"],
      abas: ["Geral", { rotulo: "Contato", ativa: false }],
      campos: [{ rotulo: "Nome", tipo: "text" }, { rotulo: "CPF ou CIN", tipo: "text", obrigatorio: true }],
      botoes: ["Concluir"],
      alvos_do_passo: ["Nome completo"],
      correspondencias_sugeridas: [{ alvo: "Nome completo", elemento_real: "Nome", tipo: "campo", similaridade: 0.8 }],
      alvos_sem_correspondencia: ["RG/CNH"],
      sugestao_reescrita: "Sugestão de reescrita: ...",
      print_contexto: "passo-04-contexto-att.png",
    });
    expect(v).not.toBeNull();
    expect(v!.abas).toEqual(["Geral", "Contato"]);
    expect(v!.sugestoes[0]).toMatchObject({ alvo: "Nome completo", real: "Nome" });
    expect(v!.semCorrespondencia).toEqual(["RG/CNH"]);
    expect(v!.vazio).toBe(false);
    expect(v!.printContexto).toBe("passo-04-contexto-att.png");
  });

  it("rotina sem Raio-X não gera visão; tela sem conteúdo legível é marcada como vazia", () => {
    expect(toDiagnosisView(undefined)).toBeNull();
    expect(toDiagnosisView(null)).toBeNull();
    expect(toDiagnosisView({ passo: 1, rota: "#/inicio" })!.vazio).toBe(true);
  });

  it("formata rótulo de aba e afinidade", () => {
    expect(tabLabel("Geral")).toBe("Geral");
    expect(tabLabel({ rotulo: "Contato" })).toBe("Contato");
    expect(similarityPct(0.845)).toBe("85%");
    expect(similarityPct(undefined)).toBe("—");
  });
});

describe("Reauditoria · Antes × Depois", () => {
  const h = [
    {
      data: "2026-11-17",
      ambiente_anterior: "homologação 4tn SCS",
      ambiente_atual: "Produtos",
      status_anterior: "atualizacao_editorial",
      tags_anteriores: ["ATT"],
      status_atual: "validado_com_ajustes",
      tags_atuais: [],
      bloqueio_superado: true,
      bloqueio_anterior: { passo: 1 },
      bloqueio_atual: undefined,
      curas_reaproveitadas: [{ passo: 1, alvo: "x", real: "y", confirmada_ao_vivo: true }],
      notas_editoriais_reconfirmadas: 0,
      notas_editoriais_nao_reconfirmadas: 0,
    },
    {
      data: "2026-11-18",
      ambiente_anterior: "Produtos",
      ambiente_atual: "Produtos",
      status_anterior: "dependencia_cruzada_rotina",
      tags_anteriores: ["XRX"],
      status_atual: "dependencia_cruzada_rotina",
      tags_atuais: ["XRX"],
      bloqueio_superado: false,
      bloqueio_anterior: { passo: 2 },
      bloqueio_atual: { passo: 2 },
      notas_editoriais_reconfirmadas: 0,
      notas_editoriais_nao_reconfirmadas: 0,
    },
  ];

  it("ordena da mais nova para a mais antiga e resume o Antes × Depois", () => {
    const rows = reauditTimeline(h);
    expect(rows.map((r) => r.data)).toEqual(["2026-11-18", "2026-11-17"]);
    expect(rows[1]).toMatchObject({ antes: "[ATT]", depois: "Auto-curada", superado: true, curasReconfirmadas: 1 });
    expect(rows[1].resumo).toContain("Bloqueio superado");
    expect(rows[0]).toMatchObject({ antes: "[XRX]", depois: "[XRX]", superado: false });
    expect(reauditTimeline(undefined)).toEqual([]);
  });

  it("rotulo de estado usa as tags em ordem canônica", () => {
    expect(stateLabel("atualizacao_editorial", ["CCC", "ATT"])).toBe("[ATT][CCC]");
    expect(stateLabel("validado_inalterado", [])).toBe("Validado");
    expect(stateLabel(undefined)).toBe("—");
  });
});

describe("Recorte por fase (Fase 2 × Fase 3)", () => {
  const stats = (fase: number, total: number, porStatus: Partial<PhaseStats["porStatus"]>): PhaseStats => ({
    fase: fase as PhaseStats["fase"],
    titulo: `Fase ${fase}`,
    total,
    auditadas: total,
    porStatus: {
      validado_inalterado: 0,
      validado_com_ajustes: 0,
      atualizacao_editorial: 0,
      comunicacao_externa: 0,
      dependencia_dados_banco: 0,
      dependencia_cruzada_rotina: 0,
      nao_auditada: 0,
      ...porStatus,
    },
  });

  it("devolve só as fases 2 e 3, com contadores por status", () => {
    const split = phaseSplit([
      stats(1, 2, { validado_inalterado: 2 }),
      stats(2, 51, { validado_com_ajustes: 5, atualizacao_editorial: 20 }),
      stats(3, 119, { atualizacao_editorial: 83, dependencia_cruzada_rotina: 24, dependencia_dados_banco: 17 }),
    ]);
    expect(split.map((p) => p.fase)).toEqual([2, 3]);
    expect(split[0]).toMatchObject({ total: 51, ajustes: 5, att: 20 });
    expect(split[1]).toMatchObject({ total: 119, att: 83, xrx: 24, ddd: 17 });
    expect(phaseSplit(undefined)).toEqual([]);
  });
});
