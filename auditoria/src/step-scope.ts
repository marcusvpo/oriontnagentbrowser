import { normalizeText } from './smart-locator.js';
import type { ParsedRoutine, RoutineStep, StepScope } from './types.js';

/**
 * Pré-análise de escopo de passo (ADR-024). Antes de abrir o navegador, a rotina inteira é lida e cada
 * passo recebe `scope: 'external_portal' | 'orion_tn'`.
 *
 * Alguns manuais começam em portais/serviços externos ao Orion TN (SISCOAF, e-Notariado, CENSEC/SIGNO, CRC,
 * CNB, Receita Federal, Serasa/SPC, DOI, SINTER, SIRP...), com login por e-CPF, e só depois voltam ao sistema
 * ("No Orion TN, acesse..."). Fotografar a tela inicial do Orion TN como se fosse o portal seria uma
 * evidência falsa (Anti-Mock, ADR-010). A máquina de estados abaixo classifica:
 *
 *  - estado inicial `orion_tn`;
 *  - um passo que ACESSA um portal externo (verbo de acesso + nome do portal/URL) ou que cita uma ferramenta
 *    externa (programa validador da Receita, editor de arquivo local) muda o estado para `external_portal`;
 *  - um passo externo continua externo, passo a passo, até um passo que retorne EXPLICITAMENTE ao Orion TN
 *    ("No **Orion TN**, acesse...", "Retorne ao Orion TN"); esse passo volta ao estado `orion_tn`;
 *  - o passo de retorno e os seguintes são `orion_tn` (auditados no navegador).
 *
 * Citar o nome de uma central como módulo do Orion TN ("Comunicações > CENSEC CTP") NÃO é portal externo:
 * é preciso o verbo de acesso junto do portal.
 *
 * Todas as expressões regulares atuam sobre o texto normalizado (`normalizeText`: minúsculas, sem acento e
 * sem pontuação), por isso "e-CPF" vira "e cpf" e "signo.censec.org.br" vira "signo censec org br".
 */

export interface ExternalPortalDef {
  /** Nome exibido no relatório */
  name: string;
  /** Casa o texto já normalizado */
  pattern: RegExp;
}

export const EXTERNAL_PORTALS: ExternalPortalDef[] = [
  { name: 'SISCOAF', pattern: /\bsiscoaf\b/ },
  { name: 'COAF', pattern: /\bcoaf\b/ },
  { name: 'e-Notariado', pattern: /\be notariado\b|\benotariado\b/ },
  { name: 'SIGNO / CENSEC', pattern: /\bsigno\b|\bcensec\b/ },
  { name: 'CRC Nacional', pattern: /\bcrc nacional\b|\bcrc\b/ },
  { name: 'CNB', pattern: /\bcnb\b|\bcolegio notarial\b/ },
  { name: 'Receita Federal', pattern: /\breceita federal\b|\bsrf\b/ },
  { name: 'Serasa/SPC', pattern: /\bserasa\b|\bspc\b/ },
  { name: 'DOI', pattern: /\bdoi\b/ },
  { name: 'SINTER', pattern: /\bsinter\b/ },
  { name: 'SIRP', pattern: /\bsirp\b/ },
  { name: 'ONR / SAEC', pattern: /\bonr\b|\bsaec\b/ }
];

/** Verbos que levam o usuário a um ambiente externo ("acesse o portal...", "faça login", "autentique-se"). */
const ACCESS_VERB =
  /\b(acesse|acessar|acessando|entre|entrar|faca login|fazer login|login|logue|autentique|autenticar|navegue|abra|abrir|conecte se|conectar se|acesso)\b/;

/** Ambiente externo nomeado: portal, site, plataforma, e-CPF, certificado, endereço web. */
const EXTERNAL_ENV_CUE =
  /\b(portal|site|plataforma|pagina oficial|e ?cpf|certificado digital|navegador|www|https?|gov br|org br|com br)\b/;

/**
 * Ferramenta externa fora do navegador do Orion TN (programa validador da Receita, editor de arquivos locais).
 * Só conta em passo sem caminho de menu (`A > B`) e sem menção ao Orion TN: um passo que abre uma tela do
 * sistema e depois cita o programa oficial é do Orion TN.
 */
const EXTERNAL_TOOL_CUE = /\b(programa (validador|oficial|gerador)|programa da receita|notepad|bloco de notas)\b/;

/** Retorno explícito ao sistema: "No Orion TN, ...", "Retorne ao Orion TN", "Dentro do Orion TN". */
const ORION_RETURN =
  /\b(no|na|ao|retorne ao|volte ao|retorne para o|volte para o|de volta ao|dentro do|acesse o|abra o|entre no|volte para|retorne para)\s+orion\s*tn\b|^orion\s*tn\b/;

/** Caminho de menu no texto cru: `**A > B**` ou `**A** > **B**` (a tela é do Orion TN). */
const MENU_PATH_RE = /\*\*[^*]*>[^*]*\*\*|\*\*[^*]+\*\*\s*>\s*\*\*/;

export interface StepScopeResult {
  stepNumber: number;
  scope: StepScope;
  /** Portal externo (só em `external_portal`) */
  portal?: string;
  /** Motivo curto da classificação, para o log e o relatório */
  reason: string;
}

export interface RoutineScopeAnalysis {
  steps: StepScopeResult[];
  /** Primeiro passo que roda no Orion TN (`null` = rotina inteira externa: nenhum navegador é aberto) */
  firstInternalStep: number | null;
  externalSteps: Array<{ stepNumber: number; portal: string }>;
  portals: string[];
  hasExternal: boolean;
}

const fullStepText = (s: RoutineStep) => normalizeText([s.rawText, ...(s.subItems || [])].join(' '));

function detectPortal(text: string): string | undefined {
  return EXTERNAL_PORTALS.find(p => p.pattern.test(text))?.name;
}

/** Classifica cada passo da rotina. Função pura (sem navegador), usada antes de qualquer `open`. */
export function analyzeRoutineScope(steps: RoutineStep[]): RoutineScopeAnalysis {
  const out: StepScopeResult[] = [];
  let state: StepScope = 'orion_tn';
  let currentPortal: string | undefined;

  for (const step of steps) {
    const text = fullStepText(step);
    const returnsToOrion = ORION_RETURN.test(text);
    const portal = detectPortal(text);
    const viaPortal = !!portal && ACCESS_VERB.test(text) && EXTERNAL_ENV_CUE.test(text);
    const viaTool = EXTERNAL_TOOL_CUE.test(text) && !MENU_PATH_RE.test(step.rawText) && !/\borion\b/.test(text);
    const entersExternal = viaPortal || viaTool;

    if (returnsToOrion) {
      state = 'orion_tn';
      currentPortal = undefined;
      out.push({ stepNumber: step.stepNumber, scope: 'orion_tn', reason: 'Retorno explícito ao Orion TN' });
      continue;
    }
    if (state === 'orion_tn' && entersExternal) {
      state = 'external_portal';
      currentPortal = viaPortal ? portal : 'Receita Federal';
    }

    if (state === 'external_portal') {
      out.push({
        stepNumber: step.stepNumber,
        scope: 'external_portal',
        portal: currentPortal ?? 'portal externo',
        reason: entersExternal
          ? `Acesso ao ambiente externo ${currentPortal}`
          : `Continuação da etapa externa (${currentPortal ?? 'portal externo'}) sem retorno explícito ao Orion TN`
      });
    } else {
      out.push({ stepNumber: step.stepNumber, scope: 'orion_tn', reason: 'Passo executado no Orion TN' });
    }
  }

  const externalSteps = out.filter(s => s.scope === 'external_portal').map(s => ({ stepNumber: s.stepNumber, portal: s.portal! }));
  return {
    steps: out,
    firstInternalStep: out.find(s => s.scope === 'orion_tn')?.stepNumber ?? null,
    externalSteps,
    portals: Array.from(new Set(externalSteps.map(s => s.portal))),
    hasExternal: externalSteps.length > 0
  };
}

/** Grava `scope`/`externalPortal` em cada passo da rotina (mutação intencional do `ParsedRoutine`). */
export function stampStepScopes(parsed: ParsedRoutine): RoutineScopeAnalysis {
  const analysis = analyzeRoutineScope(parsed.steps);
  for (const r of analysis.steps) {
    const step = parsed.steps.find(s => s.stepNumber === r.stepNumber);
    if (!step) continue;
    step.scope = r.scope;
    step.externalPortal = r.portal;
  }
  return analysis;
}

export const isExternalStep = (step: Pick<RoutineStep, 'scope'>): boolean => step.scope === 'external_portal';

const isProductName = (t: string): boolean => normalizeText(t) === 'orion tn';

/**
 * O nome do produto em negrito num passo de retorno ("No **Orion TN**, acesse...") não é um elemento de tela:
 * procurá-lo na home bloqueava a rotina ("o manual cita Orion TN, que não foi localizado") antes mesmo do
 * primeiro alvo real (C-CENTRAL-08, passo 1). Só sai da lista de alvos quando o passo de fato retorna ao
 * sistema; o texto do passo (`rawText`) nunca muda. Sem alvo restante, o passo vira captura limpa da tela.
 */
export function stripProductNameTargets(step: RoutineStep): { step: RoutineStep; removed: string[] } {
  if (!ORION_RETURN.test(normalizeText(step.rawText))) return { step, removed: [] };
  const removed = step.targets.filter(isProductName);
  if (removed.length === 0) return { step, removed };
  const mainCount = step.mainTargetCount ?? step.targets.length;
  const removedFromMain = step.targets.slice(0, mainCount).filter(isProductName).length;
  return {
    step: { ...step, targets: step.targets.filter(t => !isProductName(t)), mainTargetCount: mainCount - removedFromMain },
    removed
  };
}

/** Marcador usado pelo validador e pelo servidor para reconhecer um passo externo já documentado no relatório. */
export const EXTERNAL_STEP_MARKER = 'Etapa Externa (Fora do Orion TN)';

/** Texto do callout `> [!IMPORTANT]` de um passo externo no `-revisado.md` (o texto do passo fica intacto). */
export function externalStepCallout(portal: string): string {
  return `> [!IMPORTANT] **${EXTERNAL_STEP_MARKER}:** este passo ocorre em ambiente externo ao Orion TN (**${portal}**). O agente não executou a ação nem fotografou a tela, para não gerar evidência falsa; o texto original do manual foi preservado e a validação desta etapa é humana.`;
}
