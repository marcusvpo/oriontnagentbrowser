/**
 * Detector PURO de navegação implícita por nome de tela (ADR-037, Camada 2).
 *
 * Nos passos 1 a 3, o manual frequentemente cita a tela/menu de destino SEM separador `>`
 * (ex.: "Acesse **Grupos e Perfis de Acesso**", "No menu **Cartão de Assinatura**, ..."). Antes da ADR-037 o
 * `menu-path.ts` só consultava a árvore com `segments.length >= 2` e o passo caía na busca textual da Home.
 *
 * Este módulo só RECONHECE o padrão no texto (sem navegador, sem catálogo). A resolução contra a árvore canônica é
 * `resolveSingleSegmentScreen` (`menu-catalog.ts`), e a navegação só vale se a cadeia existir na árvore lida ao vivo
 * (Trava de Evidência, ADR-017/029). Compartilhado pelo executor (`menu-path.ts`) e pelo auditor offline
 * (`audit-menu-coherence.ts`), para que a triagem offline e a execução ao vivo usem a MESMA regra.
 */
import type { RoutineStep } from './types.js';

/** Só os primeiros passos navegam até a tela da rotina. */
export const IMPLICIT_NAV_MAX_STEP = 3;

export interface ImplicitScreenNavigation {
  /** Rótulo da tela/menu citado em negrito (sem asteriscos, sem aspas) */
  label: string;
  /** Trecho do passo que contém o negrito (para o relatório) */
  sourceText: string;
  /** Gatilho textual reconhecido (verbo/locução de abertura) */
  trigger: string;
}

const strip = (s: string) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/**
 * Locuções de abertura/acesso imediatamente antes do negrito (texto sem acento, minúsculo).
 * O negrito deve vir logo depois, admitindo só artigos/qualificadores de tela ("a tela", "o menu", "a opção"...).
 */
const TRIGGER_RE =
  /(?:^|[\s.;:,(])(acesse|acessar|abra|abrir|va|ir|entre|navegue|no menu|na tela|no modulo|na opcao|pelo menu|atraves do menu|clique no menu|selecione o menu)\s+(?:(?:em|no|na|para|ate|ao|a|o|pelo|pela|de|do|da)\s+)?(?:(?:tela|menu|modulo|opcao|rotina|funcionalidade|area|aba)\s+(?:de\s+|do\s+|da\s+)?)?$/;

/** Rótulos que nunca são telas (botões de ação, símbolos, teclas). */
const NON_SCREEN = new Set([
  'salvar', 'gravar', 'confirmar', 'concluir', 'excluir', 'inativar', 'cancelar', 'voltar', 'fechar', 'ok', 'sim', 'nao',
  'adicionar', 'novo', 'nova', 'editar', 'alterar', 'pesquisar', 'filtrar', 'buscar', 'consultar', 'limpar', 'imprimir',
  'enter', 'esc', 'tab', 'ctrl + b', 'orion tn'
]);

function cleanLabel(raw: string): string {
  return raw.replace(/^["'“”]+|["'“”]+$/g, '').replace(/\s+/g, ' ').trim().replace(/[:.]$/, '').trim();
}

/**
 * Reconhece "Acesse **X**" / "No menu **X**" / "Na tela **X**" num passo <= 3, quando o passo NÃO traz caminho com `>`.
 * Devolve `null` se o passo já tem caminho de menu, se o negrito não é precedido de gatilho de navegação ou se o
 * rótulo é um botão/símbolo.
 */
export function detectImplicitScreenNavigation(step: Pick<RoutineStep, 'stepNumber' | 'rawText'>): ImplicitScreenNavigation | null {
  if (!step || step.stepNumber > IMPLICIT_NAV_MAX_STEP) return null;
  const text = String(step.rawText ?? '');
  const bolds = Array.from(text.matchAll(/\*\*([^*]+)\*\*/g));
  if (bolds.length === 0) return null;
  // Caminho explícito (`**A > B**` ou `**A** > **B**`) é tratado pela navegação encadeada da ADR-016
  if (bolds.some(b => b[1].includes('>'))) return null;
  for (let i = 1; i < bolds.length; i++) {
    const prevEnd = (bolds[i - 1].index ?? 0) + bolds[i - 1][0].length;
    if (text.slice(prevEnd, bolds[i].index ?? 0).includes('>')) return null;
  }

  for (const m of bolds) {
    const start = m.index ?? 0;
    const before = strip(text.slice(Math.max(0, start - 60), start));
    const trig = before.match(TRIGGER_RE);
    if (!trig) continue;
    const label = cleanLabel(m[1]);
    if (!/[a-zA-ZÀ-ÿ]/.test(label) || label.length < 3) continue;
    if (NON_SCREEN.has(strip(label))) continue;
    // Endereço/login do sistema (ex.: "link de acesso do ORION TN") não é tela da árvore de menus
    if (/\b(link|url|endereco|navegador)\b/.test(strip(label)) || /\borion\s*tn\b/.test(strip(label))) continue;
    return { label, sourceText: m[0], trigger: trig[1] };
  }
  return null;
}
