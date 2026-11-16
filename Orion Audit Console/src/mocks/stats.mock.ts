import type { DashboardStats, Modulo, PhaseStats } from "@/types/api";

// Agregados ilustrativos FIXOS do universo de 471 rotinas (independentes das linhas mock).
const z = { validado_inalterado: 0, validado_com_ajustes: 0, atualizacao_editorial: 0, comunicacao_externa: 0, dependencia_dados_banco: 0, dependencia_cruzada_rotina: 0, nao_auditada: 0 };

export const PHASE_TITLES: Record<string, string> = {
  "1": "Piloto", "2": "Cadastrais, segurança e parâmetros", "3": "Atos de balcão, insumos e livros",
  "4": "Financeiro e caixa", "5": "Notas, minutas e escrituras", "6": "Consolidação", null: "Sem fase atribuída",
};

const phase = (fase: PhaseStats["fase"], total: number, ok: number, adj: number, blk: number): PhaseStats => ({
  fase, titulo: PHASE_TITLES[String(fase)], total, auditadas: ok + adj + blk,
  porStatus: { ...z, validado_inalterado: ok, validado_com_ajustes: adj, atualizacao_editorial: blk, nao_auditada: total - ok - adj - blk },
});

const modulos: Array<[Modulo, number, number]> = [
  ["acesso", 10, 6], ["caixa", 105, 9], ["centrais", 23, 2], ["certidoes", 15, 3], ["comunicacao", 3, 0],
  ["config", 40, 14], ["firmas", 36, 11], ["geral", 29, 2], ["livros", 20, 5], ["notas", 166, 10], ["selos", 24, 2],
];

export const baseStats: Omit<DashboardStats, "atividadeRecente" | "filaRunner"> = {
  totalRotinas: 471, auditadas: 64, naoAuditadas: 407, aprovadas: 41, taxaAprovacao: 41 / 64, autoCuradas: 9, bloqueadas: 10,
  porTagRevisao: { ATT: 107, CCC: 4, DDD: 18, XRX: 24 },
  porFase: [
    phase(1, 2, 1, 1, 0),
    phase(2, 50, 27, 3, 4),
    phase(3, 118, 12, 3, 4),
    phase(4, 104, 3, 1, 1),
    phase(5, 165, 2, 1, 1),
    { ...phase(6, 471, 0, 0, 0), auditadas: 41, porStatus: { ...z, validado_inalterado: 41, nao_auditada: 430 } },
    phase(null, 32, 0, 0, 0),
  ],
  porCarga: { read_only: 268, mutation: 203 },
  porModulo: modulos.map(([modulo, total, auditadas]) => ({ modulo, total, auditadas })),
  porCamadaDivergencia: { dom_synonym_heuristic: 5, a11y_fuzzy_match: 7, llm_a11y_fallback: 3 },
};
