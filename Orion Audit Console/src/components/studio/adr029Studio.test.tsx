import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AttScreenDiagnosisCard } from "@/components/studio/AttScreenDiagnosisCard";
import { ReauditTimeline } from "@/components/studio/ReauditTimeline";

// O Link do roteador precisa de contexto; o teste de marcação só inspeciona o texto dos contadores.
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...p }: { children?: unknown; "aria-label"?: string }) => <a aria-label={p["aria-label"]}>{children as never}</a>,
  useNavigate: () => () => undefined,
}));

describe("Card do Raio-X da Tela Atual", () => {
  it("renderiza rota, seções, campos reais, botões e sugestões", () => {
    const html = renderToStaticMarkup(
      <AttScreenDiagnosisCard
        diagnostico={{
          passo: 4,
          rota: "#/ficha/cadastrar",
          titulo_painel: "OrionTN - Tabelionatos de Notas",
          secoes: ["Dados pessoais"],
          campos: [{ rotulo: "Nome" }, { rotulo: "CPF ou CIN", obrigatorio: true }],
          botoes: ["Concluir"],
          correspondencias_sugeridas: [{ alvo: "Nome completo", elemento_real: "Nome", tipo: "campo", similaridade: 0.8 }],
          alvos_sem_correspondencia: ["RG/CNH"],
          sugestao_reescrita: "Avaliar a reescrita do trecho.",
          print_contexto: "passo-04-contexto-att.png",
        }}
      />,
    );
    expect(html).toContain("Raio-X da Tela Atual");
    expect(html).toContain("#/ficha/cadastrar");
    expect(html).toContain("Dados pessoais");
    expect(html).toContain("CPF ou CIN *");
    expect(html).toContain("Concluir");
    expect(html).toContain("Nome completo");
    expect(html).toContain("afinidade 80%");
    expect(html).toContain("RG/CNH");
    expect(html).toContain("passo-04-contexto-att.png");
  });

  it("não renderiza nada quando a rotina não tem Raio-X", () => {
    expect(renderToStaticMarkup(<AttScreenDiagnosisCard diagnostico={undefined} />)).toBe("");
  });
});

describe("Linha do tempo Antes × Depois", () => {
  it("mostra a transição de estado e o bloqueio superado", () => {
    const html = renderToStaticMarkup(
      <ReauditTimeline
        historico={[
          {
            data: "2026-11-17",
            ambiente_anterior: "4tn SCS",
            ambiente_atual: "Produtos",
            status_anterior: "atualizacao_editorial",
            tags_anteriores: ["ATT"],
            status_atual: "validado_com_ajustes",
            tags_atuais: [],
            bloqueio_superado: true,
            bloqueio_anterior: { passo: 1 },
            notas_editoriais_reconfirmadas: 0,
            notas_editoriais_nao_reconfirmadas: 0,
          },
        ]}
      />,
    );
    expect(html).toContain("[ATT]");
    expect(html).toContain("Auto-curada");
    expect(html).toContain("bloqueio superado");
    expect(html).toContain("Produtos");
  });

  it("sem histórico não renderiza", () => {
    expect(renderToStaticMarkup(<ReauditTimeline historico={undefined} />)).toBe("");
  });
});
