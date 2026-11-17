// ADR-029: helpers puros do Raio-X `[ATT]`, da linha do tempo da reauditoria (Antes × Depois) e do recorte por fase.
import type { AuditoriaUiFrontmatter, DiagnosticoTelaAtt, PhaseStats, RoutineAuditState } from "@/types/api";
import { AUDIT_STATUS, normalizeAudit, sortTags } from "@/lib/status";

/** Rótulo da aba, que o frontmatter grava como texto ou como `{ rotulo, ativa }`. */
export const tabLabel = (a: string | { rotulo: string; ativa?: boolean }): string => (typeof a === "string" ? a : a.rotulo);

export interface DiagnosisView {
  passo: number;
  rota: string;
  titulo?: string;
  emModal: boolean;
  secoes: string[];
  abas: string[];
  campos: Array<{ rotulo: string; tipo?: string; secao?: string; obrigatorio?: boolean }>;
  botoes: string[];
  alvosDoPasso: string[];
  sugestoes: Array<{ alvo: string; real: string; tipo?: string; secao?: string; similaridade?: number }>;
  semCorrespondencia: string[];
  reescrita?: string;
  printContexto?: string;
  /** A tela foi lida mas não tem nada a mostrar (ex.: página em branco) */
  vazio: boolean;
}

/** Normaliza o `diagnostico_tela_att` do frontmatter para a visão da UI; `null` se a rotina não tem Raio-X. */
export function toDiagnosisView(d: DiagnosticoTelaAtt | null | undefined): DiagnosisView | null {
  if (!d || typeof d.passo !== "number") return null;
  const campos = d.campos ?? [];
  const botoes = d.botoes ?? [];
  const secoes = d.secoes ?? [];
  const abas = (d.abas ?? []).map(tabLabel);
  return {
    passo: d.passo,
    rota: d.rota || "(sem rota)",
    titulo: d.titulo_painel,
    emModal: !!d.em_modal,
    secoes,
    abas,
    campos,
    botoes,
    alvosDoPasso: d.alvos_do_passo ?? [],
    sugestoes: (d.correspondencias_sugeridas ?? []).map((c) => ({ alvo: c.alvo, real: c.elemento_real, tipo: c.tipo, secao: c.secao, similaridade: c.similaridade })),
    semCorrespondencia: d.alvos_sem_correspondencia ?? [],
    reescrita: d.sugestao_reescrita,
    printContexto: d.print_contexto,
    vazio: campos.length === 0 && botoes.length === 0 && secoes.length === 0 && abas.length === 0,
  };
}

export const similarityPct = (n?: number): string => (typeof n === "number" ? `${Math.round(n * 100)}%` : "—");

/** `[ATT]`, `[ATT][CCC]` ou o rótulo do status quando não há tag. */
export function stateLabel(status: string | undefined, tags?: ReadonlyArray<string>): string {
  const sorted = sortTags(tags ?? []);
  if (sorted.length > 0) return sorted.map((t) => `[${t}]`).join("");
  if (!status) return "—";
  const n = normalizeAudit(status);
  return AUDIT_STATUS[n]?.label ?? status;
}

export interface ReauditRow {
  data: string;
  ambiente: string;
  antes: string;
  depois: string;
  /** `true`: saiu de bloqueio; `false`: bloqueio mantido; `null`: não havia bloqueio antes */
  superado: boolean | null;
  passoAntes?: number;
  passoDepois?: number;
  curasReconfirmadas: number;
  resumo: string;
}

type Hist = NonNullable<AuditoriaUiFrontmatter["historico_reauditoria"]>[number];

export function reauditRow(h: Hist): ReauditRow {
  const antes = stateLabel(h.status_anterior, h.tags_anteriores);
  const depois = stateLabel(h.status_atual, h.tags_atuais);
  const curas = (h.curas_reaproveitadas ?? []).filter((c) => c.confirmada_ao_vivo).length;
  const resumo =
    h.bloqueio_superado === true
      ? `Bloqueio superado: ${antes} → ${depois}`
      : h.bloqueio_superado === false
        ? `Bloqueio mantido (${depois})`
        : `Sem bloqueio anterior (${antes} → ${depois})`;
  return {
    data: h.data,
    ambiente: h.ambiente_atual,
    antes,
    depois,
    superado: h.bloqueio_superado,
    passoAntes: h.bloqueio_anterior?.passo,
    passoDepois: h.bloqueio_atual?.passo,
    curasReconfirmadas: curas,
    resumo,
  };
}

/** Linha do tempo da reauditoria, da mais nova para a mais antiga. */
export const reauditTimeline = (h: AuditoriaUiFrontmatter["historico_reauditoria"] | undefined): ReauditRow[] =>
  [...(h ?? [])].map(reauditRow).reverse();

export interface PhaseSplit {
  fase: number;
  titulo: string;
  total: number;
  auditadas: number;
  validadas: number;
  ajustes: number;
  att: number;
  ccc: number;
  ddd: number;
  xrx: number;
  naoAuditadas: number;
}

/** Fases separadas no Dashboard e no Explorador (ADR-029): Fase 2 (cadastrais/parâmetros) e Fase 3 (atos de balcão). */
export const PHASE_SPLIT_PHASES = [2, 3] as const;

export function phaseSplit(porFase: PhaseStats[] | undefined, fases: ReadonlyArray<number> = PHASE_SPLIT_PHASES): PhaseSplit[] {
  const get = (p: PhaseStats, s: RoutineAuditState) => p.porStatus?.[s] ?? 0;
  return fases
    .map((f) => porFase?.find((p) => p.fase === f))
    .filter((p): p is PhaseStats => !!p)
    .map((p) => ({
      fase: p.fase as number,
      titulo: p.titulo,
      total: p.total,
      auditadas: p.auditadas,
      validadas: get(p, "validado_inalterado"),
      ajustes: get(p, "validado_com_ajustes"),
      att: get(p, "atualizacao_editorial"),
      ccc: get(p, "comunicacao_externa"),
      ddd: get(p, "dependencia_dados_banco"),
      xrx: get(p, "dependencia_cruzada_rotina"),
      naoAuditadas: get(p, "nao_auditada"),
    }));
}
