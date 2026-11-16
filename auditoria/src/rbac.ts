import type { AgentBrowserClient } from './browser.js';
import { normalizeText } from './smart-locator.js';
import type {
  ExploredTrigger,
  ParsedRoutine,
  PrivilegeGateResult,
  PrivilegeRequirement,
  RoutineBlockInfo,
  RoutineStep,
  SessionIdentity
} from './types.js';

/**
 * Detector de Perfil/Permissão — RBAC Gate (ADR-017, revisto pela ADR-018).
 *
 * Um botão que não aparece na tela tem duas explicações: o manual está errado, ou a conta logada não
 * tem privilégio para vê-lo. Este módulo dá ao agente os sinais que a aplicação oferece:
 *
 * 1. Antes do passo 1: o perfil exigido pelo manual é comparado com a identidade da sessão, lida do
 *    armazenamento de sessão da própria aplicação. O gate só bloqueia quando a sessão é
 *    comprovadamente restrita: identidade lida, sem perfil pleno reconhecido e sem correspondência
 *    de nome. Identidade ilegível é inconclusiva e não bloqueia (ADR-018).
 * 2. Durante os passos: um alvo que existe no DOM mas está marcado pela aplicação como bloqueado ou
 *    oculto para o perfil (`PERMISSION_MARK_SELECTOR`) é bloqueio por privilégio,
 *    nunca "elemento inexistente". É a única evidência que autoriza esse bloqueio numa sessão plena.
 * 3. Sessão plena (ADR-018, Golden Rule 13): a conta de homologação `4tabeliao.scs` (cargo
 *    `TABELIAO`, perfil "Gerência webFirmas") tem 100% das permissões. Sob ela, um recurso ausente
 *    e sem marca de bloqueio é defasagem do manual, não insuficiência de privilégio.
 */

export const RBAC_BLOCK_TYPE = 'Insuficiência de Privilégio na Conta de Homologação';
export const MANUAL_OUTDATED_BLOCK_TYPE = 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)';
export const MISSING_EVIDENCE_BLOCK_TYPE = 'Alvo do Manual sem Evidência na Tela';
export const DRY_RUN_DEPENDENT_BLOCK_TYPE = 'Validação Dependente de Gravação Real (Trava de Mutação Ativa)';

/**
 * Perfis de acesso e cargos reconhecidos como administrativos plenos (ADR-018), validados com a
 * área de Produtos da Siplan contra a árvore de permissões da conta de homologação
 * (`auditoria/reports/permiss_es_oriontn_4tabeliao_scs.md`). `ORION_SESSION_GRANTED_ROLES`
 * acrescenta entradas a esta lista.
 */
export const DEFAULT_FULL_ACCESS_MARKERS = ['Gerência webFirmas', 'TABELIAO'];

/**
 * Marca real de bloqueio por perfil no DOM do Orion TN 6.0 (ADR-018). A aplicação marca uma
 * funcionalidade negada com a classe `functionality` somada a `disabled` ou `ngx-orion-hide`, ou com
 * o `title` "Esta funcionalidade está bloqueada para o seu perfil".
 *
 * `.ngx-orion-hide` SOZINHA não é evidência de permissão: é a classe genérica de ocultação da
 * aplicação (asterisco de campo obrigatório, paginação vazia, contadores de alerta, o contêiner do
 * calendário). Medição ao vivo na tela inicial: 250 nós com a classe, 4 deles de funcionalidade.
 */
export const PERMISSION_MARK_SELECTOR =
  '.functionality.disabled, .functionality.ngx-orion-hide, [title*="bloqueada para o seu perfil"]';

// Papéis reconhecidos num requisito de privilégio (com variações de gênero e grafia)
const ROLE =
  String.raw`\*{0,2}(Administrador(?:a)?(?:\s+do\s+sistema)?|Admin|Tabeli[aã](?:o)?\s+Titular|Tabeli[aã](?:o)?\s+Substitut[oa]|Tabeli[aã](?:o)?|Oficial\s+Titular|Titular|Substitut[oa]|Gerente|Supervisor(?:a)?|Master)\*{0,2}`;
const ROLE_LIST = `${ROLE}(?:\\s*(?:,|/|ou|e/ou)\\s*${ROLE}){0,4}`;
const ROLE_ONLY = new RegExp(`^\\s*${ROLE}\\s*$`, 'i');

// A: "privilégios de X", "permissão de X" — inequívoco
const PRIVILEGE_NOUN = new RegExp(
  String.raw`(?:privil[eé]gios?|permiss(?:[aã]o|[oõ]es))\s+de\s+(?:acesso\s+de\s+)?(${ROLE_LIST})`,
  'i'
);
// B: "com perfil de X", "com usuário X", "utilizando uma conta X" — exige a preposição de posse
const ACCOUNT_CLAUSE = new RegExp(
  String.raw`(?:^|[\s,(])(?:com|como|utilizando|usando)\s+(?:(?:um|uma|o|a)\s+)?(?:perfil|usu[aá]rio|conta|login|acesso)\s+(?:(?:de|do|da|com)\s+)?(?:privil[eé]gios?\s+de\s+)?(${ROLE_LIST})`,
  'i'
);

const ROLE_CANON: Record<string, string> = {
  administradora: 'administrador',
  admin: 'administrador',
  'administrador do sistema': 'administrador',
  'administradora do sistema': 'administrador',
  tabelia: 'tabeliao',
  'tabelia titular': 'tabeliao titular',
  'tabelia substituta': 'tabeliao substituto',
  substituta: 'substituto',
  supervisora: 'supervisor'
};

function canonicalRole(role: string): string {
  const norm = normalizeText(role);
  return ROLE_CANON[norm] ?? norm;
}

function splitRoles(roleList: string): string[] {
  const roles: string[] = [];
  for (const m of roleList.matchAll(new RegExp(ROLE, 'gi'))) {
    const role = m[1].replace(/\s+/g, ' ').trim();
    if (role && !roles.some(r => canonicalRole(r) === canonicalRole(role))) roles.push(role);
  }
  return roles;
}

function matchRequirement(text: string): string[] | null {
  const m = text.match(PRIVILEGE_NOUN) || text.match(ACCOUNT_CLAUSE);
  if (!m) return null;
  const roles = splitRoles(m[1]);
  return roles.length > 0 ? roles : null;
}

/** O texto é apenas o nome de um papel (Administrador, Tabelião Titular...), não um elemento de tela. */
export function isRoleName(text: string): boolean {
  return ROLE_ONLY.test(text.replace(/\*\*/g, ''));
}

/**
 * Extrai o perfil exigido pela rotina. Fontes, em ordem: frontmatter (`perfil_requerido`,
 * `perfis_requeridos`, `pre_requisito_perfil`) e o texto dos passos. Vale o primeiro requisito
 * encontrado; os papéis de uma mesma frase são alternativos (basta um).
 */
export function extractPrivilegeRequirement(parsed: ParsedRoutine): PrivilegeRequirement | null {
  for (const key of ['perfil_requerido', 'perfis_requeridos', 'pre_requisito_perfil']) {
    const value = parsed.frontmatter?.[key];
    const roles = (Array.isArray(value) ? value : value ? [value] : []).map(v => String(v).trim()).filter(Boolean);
    if (roles.length > 0) {
      return { roles, sourceStep: 0, sourceText: `${key}: ${roles.join(', ')}` };
    }
  }
  for (const step of parsed.steps) {
    for (const text of [step.rawText, ...(step.subItems || [])]) {
      const roles = matchRequirement(text);
      if (roles) return { roles, sourceStep: step.stepNumber, sourceText: text };
    }
  }
  return null;
}

/**
 * Passo de pré-requisito de perfil (ADR-018): no passo de onde o requisito foi extraído, os papéis
 * em negrito ("**Administrador** ou **Tabelião Titular**") são nomes de perfil, não elementos de
 * tela. Eles saem da lista de alvos para que o executor não os procure no DOM. Devolve o passo
 * ajustado e os papéis retirados; os demais passos voltam intactos.
 */
export function stripPrerequisiteRoles(
  step: RoutineStep,
  requirement: PrivilegeRequirement | null
): { step: RoutineStep; removedRoles: string[] } {
  if (!requirement || requirement.sourceStep !== step.stepNumber) return { step, removedRoles: [] };
  const mainCount = step.mainTargetCount ?? step.targets.length;
  const removedRoles = step.targets.filter(isRoleName);
  if (removedRoles.length === 0) return { step, removedRoles };
  const removedFromMain = step.targets.slice(0, mainCount).filter(isRoleName).length;
  return {
    step: {
      ...step,
      targets: step.targets.filter(t => !isRoleName(t)),
      mainTargetCount: mainCount - removedFromMain
    },
    removedRoles
  };
}

/**
 * Lê a identidade da sessão autenticada do armazenamento de sessão da própria aplicação
 * (`localStorage.user_<produto>`): login, nome, cargo e os nomes dos perfis de acesso atribuídos.
 * Nenhum campo sensível (senha, token) é lido.
 */
export async function readSessionIdentity(client: AgentBrowserClient): Promise<SessionIdentity | null> {
  return client.evalJson<SessionIdentity>(`
    (() => {
      try {
        const keys = Object.keys(localStorage).filter(k => /^user_web[a-z]+$/i.test(k));
        if (keys.length === 0) return null;
        const product = (location.pathname.split('/').filter(Boolean)[0] || '').toLowerCase();
        const key = keys.find(k => k.toLowerCase() === 'user_' + product) || keys[0];
        const outer = JSON.parse(localStorage.getItem(key));
        const user = outer && typeof outer.data === 'string' ? JSON.parse(outer.data) : outer && outer.data ? outer.data : outer;
        if (!user || !user.login) return null;
        const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
        const profiles = Array.from(new Set((user.profileList || []).map(p => clean(p && p.name)).filter(Boolean)));
        return JSON.stringify({
          login: clean(user.login),
          name: clean(user.person && user.person.name),
          position: clean(user.position),
          profiles,
          source: 'localStorage.' + key
        });
      } catch (e) {
        return null;
      }
    })()
  `);
}

/**
 * Entradas declaradas por um humano em `ORION_SESSION_GRANTED_ROLES` (lista separada por vírgulas).
 * Cada entrada vale de duas formas: como papel que a conta comprovadamente possui (ex.:
 * "Administrador") e como nome de perfil/cargo reconhecido como administrativo pleno
 * (ex.: "Gerência webFirmas").
 */
function envEntries(): string[] {
  return (process.env.ORION_SESSION_GRANTED_ROLES || '')
    .split(',')
    .map(r => r.trim())
    .filter(Boolean);
}

const containsWords = (haystack: string, needle: string) => ` ${haystack} `.includes(` ${needle} `);

/**
 * Sessão plena (ADR-018): a identidade lida traz um perfil de acesso ou cargo reconhecido como
 * administrativo pleno. Devolve o que comprovou, como está na sessão, ou `null`.
 */
export function detectFullAccess(identity: SessionIdentity | null): { evidence: string; via: 'perfil' | 'cargo' } | null {
  if (!identity) return null;
  const markers = [...DEFAULT_FULL_ACCESS_MARKERS, ...envEntries()].map(normalizeText).filter(Boolean);
  for (const profile of identity.profiles) {
    const norm = normalizeText(profile);
    if (markers.some(m => containsWords(norm, m))) return { evidence: profile, via: 'perfil' };
  }
  const position = normalizeText(identity.position || '');
  if (position && markers.some(m => m === position)) return { evidence: identity.position, via: 'cargo' };
  return null;
}

/**
 * Decide se a sessão atende ao requisito (ADR-018). Em ordem: papel declarado no ambiente, sessão
 * plena reconhecida, correspondência por nome de perfil. Sem nenhuma delas, a sessão é `restricted`
 * (bloqueia) se a identidade foi lida, ou `inconclusive` (não bloqueia) se não foi.
 */
export function evaluatePrivilege(
  requirement: PrivilegeRequirement | null,
  identity: SessionIdentity | null
): PrivilegeGateResult {
  const full = detectFullAccess(identity);
  const base = { identity, fullAccess: !!full, fullAccessEvidence: full?.evidence };
  if (!requirement) {
    return { ...base, satisfied: true, requirement: null, state: 'not_required', reason: 'A rotina não declara requisito de perfil.' };
  }
  const wanted = requirement.roles.map(canonicalRole);
  const granted = envEntries().map(canonicalRole);
  const viaEnv = requirement.roles.find((_, i) => granted.includes(wanted[i]));
  if (viaEnv) {
    return {
      ...base,
      satisfied: true,
      requirement,
      state: 'satisfied',
      matchedRole: viaEnv,
      reason: `Papel "${viaEnv}" declarado para a conta em ORION_SESSION_GRANTED_ROLES.`
    };
  }
  if (!identity) {
    return {
      ...base,
      satisfied: true,
      requirement,
      state: 'inconclusive',
      reason: `A rotina exige perfil ${requirement.roles.join(' ou ')}, e a identidade da sessão não pôde ser lida. Sem prova de restrição, a auditoria prossegue; bloqueio por privilégio só com marca de bloqueio no DOM.`
    };
  }
  if (full) {
    return {
      ...base,
      satisfied: true,
      requirement,
      state: 'satisfied',
      matchedRole: requirement.roles[0],
      reason: `A conta "${identity.login}" é um perfil administrativo pleno reconhecido (${full.via} "${full.evidence}"), que atende ao requisito ${requirement.roles.join(' ou ')}.`
    };
  }
  const profiles = identity.profiles.map(normalizeText);
  const viaProfile = requirement.roles.find((_, i) => profiles.some(p => containsWords(p, wanted[i])));
  if (viaProfile) {
    return {
      ...base,
      satisfied: true,
      requirement,
      state: 'satisfied',
      matchedRole: viaProfile,
      reason: `Perfil de acesso da sessão corresponde a "${viaProfile}".`
    };
  }
  return {
    ...base,
    satisfied: false,
    requirement,
    state: 'restricted',
    reason: `A rotina exige perfil ${requirement.roles.join(' ou ')}; a conta "${identity.login}" possui ${
      identity.profiles.length ? identity.profiles.map(p => `"${p}"`).join(', ') : 'nenhum perfil identificável'
    } (cargo "${identity.position || 'não informado'}"), que não é um perfil administrativo pleno reconhecido.`
  };
}

/**
 * Executa o RBAC Gate completo: requisito do manual x identidade real da sessão. A identidade é lida
 * sempre, mesmo sem requisito: a classificação de um recurso ausente (privilégio x defasagem do
 * manual) depende de saber se a sessão é plena.
 */
export async function runPrivilegeGate(client: AgentBrowserClient, parsed: ParsedRoutine): Promise<PrivilegeGateResult> {
  const requirement = extractPrivilegeRequirement(parsed);
  const identity = await readSessionIdentity(client);
  return evaluatePrivilege(requirement, identity);
}

/** Bloqueio estruturado para um RBAC Gate reprovado (antes do passo 1). */
export function buildPrivilegeGateBlock(gate: PrivilegeGateResult): RoutineBlockInfo {
  const roles = gate.requirement?.roles.join(' ou ') || 'perfil privilegiado';
  const origin = gate.requirement?.sourceStep ? `no passo ${gate.requirement.sourceStep}` : 'nos metadados da rotina';
  return {
    kind: 'rbac',
    tipo: RBAC_BLOCK_TYPE,
    motivo: `${gate.reason} O requisito está ${origin} do manual. Com uma conta sem esse privilégio, controles administrativos podem não aparecer na tela, e a ausência deles não prova que o manual esteja errado. Nenhum passo foi auditado e o texto original foi preservado.`,
    roteiro: [
      `Autenticar no ambiente de homologação com uma conta de perfil ${roles}.`,
      'Reexecutar a auditoria desta rotina com essa conta e revisar as prints geradas.',
      'Se a conta atual já tiver esse privilégio sob outro nome de perfil, declarar o perfil ou o papel em ORION_SESSION_GRANTED_ROLES e reexecutar.'
    ]
  };
}

/** Bloqueio estruturado para um alvo que a aplicação marca como bloqueado/oculto para o perfil. */
export function buildPermissionBlockedTargetBlock(
  stepNumber: number,
  target: string,
  detail: string,
  identity: SessionIdentity | null,
  domEvidence?: string
): RoutineBlockInfo {
  const who = identity
    ? `A conta "${identity.login}" (${identity.profiles.map(p => `"${p}"`).join(', ') || 'sem perfil identificável'})`
    : 'A conta de homologação';
  const proof = domEvidence ? ` Evidência no DOM: ${domEvidence}.` : '';
  return {
    kind: 'rbac',
    tipo: RBAC_BLOCK_TYPE,
    motivo: `${who} não tem acesso a "${target}", citado no passo ${stepNumber}: a aplicação o marca como bloqueado para o perfil (${detail}).${proof} O elemento existe no sistema; o texto original foi preservado.`,
    roteiro: [
      `Liberar a funcionalidade "${target}" para o perfil da conta de homologação, ou autenticar com uma conta que a possua.`,
      'Reexecutar a auditoria desta rotina e revisar as prints geradas.'
    ]
  };
}

const describeTriggers = (explored: ExploredTrigger[]) => {
  const kind: Record<ExploredTrigger['kind'], string> = {
    tab: 'aba',
    accordion: 'painel',
    button: 'botão',
    checkbox: 'caixa de seleção',
    radio: 'opção',
    subportal_link: 'link de sub-portal'
  };
  return explored.map(t => `${kind[t.kind]} "${t.label}"`).join(', ');
};

export interface MissingTargetBlockInput {
  stepNumber: number;
  /** Alvos do manual sem evidência, como citados */
  targets: string[];
  /** Algum alvo do passo foi localizado (o bloqueio é parcial) */
  partial: boolean;
  gate: PrivilegeGateResult;
  explored: ExploredTrigger[];
  /** Total de gatilhos candidatos na tela */
  candidates: number;
  /** Checkboxes/radios descartados por falta de afinidade com o alvo */
  selectorsWithoutAffinity: number;
  /** A exploração não se aplica a este passo (ex.: caminho de menu) */
  explorationSkippedReason?: string;
  /** Itens de nome relacionado encontrados na navegação (observação, não equivalência) */
  relocationHints: string[];
  /** Comandos de gravação que a Trava Segura de Mutação deixou de acionar antes deste passo */
  skippedCommits: Array<{ stepNumber: number; label: string }>;
  /**
   * Evidência lida da árvore de navegação real de que o caminho de menu documentado não existe (ADR-024).
   * Quando presente, a causa é a defasagem do manual com prova de DOM, sem depender do perfil da sessão.
   */
  menuEvidence?: string;
}

/**
 * Bloqueio estruturado para alvo sem evidência depois de esgotada a Exploração Investigativa
 * (ADR-018). A causa é classificada pelo que foi comprovado:
 * - comando de gravação omitido antes do passo -> o alvo pode depender da gravação (`dry_run_dependent`);
 * - sessão plena e nenhuma marca de bloqueio no DOM -> defasagem editorial do manual (`manual_outdated`);
 * - sessão não comprovadamente plena -> alvo sem evidência (`missing_target`), causa em aberto.
 */
export function buildMissingTargetBlock(input: MissingTargetBlockInput): RoutineBlockInfo {
  const list = input.targets.map(t => `"${t}"`).join(', ');
  const scope = input.partial ? 'não foi localizado na tela auditada' : 'não foram localizados na tela auditada (nenhum dos elementos citados)';
  const explored = input.explorationSkippedReason
    ? ` ${input.explorationSkippedReason}`
    : input.explored.length > 0
      ? ` Antes do bloqueio, a Exploração Investigativa acionou ${input.explored.length} de ${input.candidates} gatilho(s) revelador(es) seguro(s) da tela (${describeTriggers(input.explored)}); nenhum revelou o elemento, e o estado da tela foi restaurado.`
      : ` A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento${
          input.selectorsWithoutAffinity > 0 ? ` (${input.selectorsWithoutAffinity} caixa(s) de seleção sem relação com o elemento não foram acionadas)` : ''
        }.`;
  const hints =
    input.relocationHints.length > 0
      ? ` Itens de nome relacionado existem em outro ponto da navegação: ${input.relocationHints.join('; ')} (apenas pista, não validados como equivalentes).`
      : '';
  const preserved = ' Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.';
  const head = `No passo ${input.stepNumber}, o manual cita ${list}, que ${scope}.`;

  // ADR-024: caminho de menu inexistente na árvore real. A prova é a própria árvore lida ao vivo: o item
  // não existe nem marcado como bloqueado/oculto (esses casos viram bloqueio por privilégio antes).
  if (input.menuEvidence) {
    return {
      kind: 'manual_outdated',
      tipo: MANUAL_OUTDATED_BLOCK_TYPE,
      motivo: `No passo ${input.stepNumber}, o manual cita um caminho de menu que não existe na versão atual. ${input.menuEvidence}${preserved}`,
      roteiro: [
        `Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo ${input.stepNumber} fica na versão atual.`,
        'Reescrever o passo no manual com o caminho real e reexecutar a auditoria.'
      ]
    };
  }

  if (input.skippedCommits.length > 0) {
    const cmds = input.skippedCommits.map(c => `"${c.label}" (passo ${c.stepNumber})`).join(', ');
    return {
      kind: 'dry_run_dependent',
      tipo: DRY_RUN_DEPENDENT_BLOCK_TYPE,
      motivo: `${head} A auditoria rodou com a Trava Segura de Mutação: o comando ${cmds} foi localizado e demarcado, mas não foi acionado, para não gravar no banco de homologação. O elemento ausente pode depender do efeito dessa gravação.${explored}${hints}${preserved}`,
      roteiro: [
        `Executar a rotina manualmente no ambiente de homologação até o passo ${input.stepNumber}, efetivando a gravação, e conferir se ${list} aparece.`,
        'Se o elemento existir após a gravação, aprovar a rotina manualmente; se não existir, corrigir o manual.'
      ]
    };
  }

  if (input.gate.fullAccess) {
    const who = input.gate.identity ? `"${input.gate.identity.login}"` : 'de homologação';
    return {
      kind: 'manual_outdated',
      tipo: MANUAL_OUTDATED_BLOCK_TYPE,
      motivo: `${head} A conta ${who} é um perfil administrativo pleno (${input.gate.fullAccessEvidence}) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio.${explored} O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual.${hints}${preserved}`,
      roteiro: [
        `Abrir a tela do passo ${input.stepNumber} no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.`,
        'Reescrever o passo no manual com o caminho real e reexecutar a auditoria.'
      ]
    };
  }

  return {
    kind: 'missing_target',
    tipo: MISSING_EVIDENCE_BLOCK_TYPE,
    motivo: `${head}${explored}${hints} A sessão não é comprovadamente plena, então a causa (manual desatualizado ou permissão) fica para o revisor.${preserved}`,
    roteiro: [
      `Abrir a tela do passo ${input.stepNumber} no ambiente de homologação e conferir se o elemento existe com outro nome, em outra tela ou sob outro perfil.`,
      'Corrigir o manual manualmente, se necessário, e reexecutar a auditoria.'
    ]
  };
}

export interface PermissionBlockedHit {
  target: string;
  text: string;
  detail: string;
  /** Nó e marca que comprovam o bloqueio (ex.: `li.functionality.disabled [title="..."]`) */
  domEvidence: string;
}

/**
 * Procura, entre os alvos não localizados de um passo, algum que exista no DOM mas esteja marcado
 * pela aplicação como bloqueado ou oculto para o perfil logado. É a evidência real de bloqueio
 * exigida pela ADR-018: sem ela, numa sessão plena, a ausência do alvo não é privilégio.
 */
export async function probePermissionBlockedTargets(
  client: AgentBrowserClient,
  targets: string[]
): Promise<PermissionBlockedHit | null> {
  const wanted = targets.map(t => ({ raw: t, norm: normalizeText(t) })).filter(t => t.norm.length >= 3);
  if (wanted.length === 0) return null;
  return client.evalJson<PermissionBlockedHit>(`
    (() => {
      const wanted = ${JSON.stringify(wanted)};
      const norm = t => String(t || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^\\w\\s+]/g, ' ').replace(/\\s+/g, ' ').trim().toLowerCase();
      const marked = Array.from(document.querySelectorAll(${JSON.stringify(PERMISSION_MARK_SELECTOR)}));
      for (const el of marked) {
        const text = norm(el.textContent);
        if (!text || text.length > 80) continue;
        for (const w of wanted) {
          // Igualdade exata: "Firmas" não é "Balcão de firmas" (palavra contida não prova nada)
          if (text === w.norm) {
            const cls = typeof el.className === 'string' ? el.className.trim().split(/\\s+/).filter(Boolean) : [];
            const title = (el.getAttribute('title') || '').trim();
            const detail = title ||
              (cls.includes('ngx-orion-hide') ? 'item oculto pela aplicação para o perfil logado' : 'item desabilitado pela aplicação');
            const marks = cls.filter(c => c === 'ngx-orion-hide' || c === 'functionality' || c === 'disabled');
            const domEvidence = el.tagName.toLowerCase() + (marks.length ? '.' + marks.join('.') : '') + (title ? ' [title="' + title.slice(0, 80) + '"]' : '');
            return JSON.stringify({ target: w.raw, text: (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 80), detail, domEvidence });
          }
        }
      }
      return null;
    })()
  `);
}

/**
 * Pista de realocação (ADR-018): itens da navegação (menus, inclusive o menu do usuário) cujo nome
 * compartilha uma palavra significativa com um alvo ausente. Serve só de observação para o revisor
 * humano; nunca altera texto nem substitui o alvo.
 */
export async function probeRelocationHints(client: AgentBrowserClient, targets: string[]): Promise<string[]> {
  const stop = new Set(['para', 'como', 'pelo', 'pela', 'entre', 'sobre', 'manualmente', 'novo', 'nova', 'campo', 'botao', 'tela', 'aba']);
  const words = Array.from(
    new Set(
      targets
        .flatMap(t => normalizeText(t).split(' '))
        // palavras significativas: 5+ letras, ou siglas com dígito (ex.: "2fa")
        .filter(w => (w.length >= 5 || (w.length >= 3 && /\d/.test(w))) && !stop.has(w))
    )
  );
  if (words.length === 0) return [];
  const found = await client.evalJson<string[]>(`
    (() => {
      const words = ${JSON.stringify(words)};
      const norm = t => String(t || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^\\w\\s+]/g, ' ').replace(/\\s+/g, ' ').trim().toLowerCase();
      const clean = t => String(t || '').replace(/\\s+/g, ' ').trim();
      const out = [];
      for (const a of document.querySelectorAll('.navbar a, nav a, #navbar a, .dropdown-menu a')) {
        const text = clean(a.textContent);
        if (!text || text.length > 60) continue;
        const tokens = norm(text).split(' ');
        if (!words.some(w => tokens.includes(w))) continue;
        const chain = [text];
        let li = a.closest('li');
        while (li) {
          const parentLi = li.parentElement ? li.parentElement.closest('li') : null;
          if (!parentLi) break;
          const pa = Array.from(parentLi.children).find(c => c.tagName === 'A');
          const pt = pa ? clean(pa.textContent) : '';
          if (pt) chain.unshift(pt);
          li = parentLi;
        }
        const path = chain.join(' > ');
        if (!out.includes(path)) out.push(path);
        if (out.length >= 5) break;
      }
      return JSON.stringify(out);
    })()
  `);
  return found || [];
}
