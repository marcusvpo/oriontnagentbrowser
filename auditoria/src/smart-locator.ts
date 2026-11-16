import type { AgentBrowserClient } from './browser.js';
import { resolveAndNavigateMenuPath } from './menu-path.js';
import { forbiddenCandidateReason, forbiddenMeasuredReason, synonymMatchesNode } from './navigation-guard.js';
import { isGenericContainerMatch } from './evidence.js';
import { probePermissionBlockedTargets } from './rbac.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { resolveGridActions } from './icon-action-resolver.js';
import type {
  DOMCallout,
  DOMResolvedGeometry,
  RoutineStep,
  SmartLocatorDivergence,
  SmartLocatorResult,
  StepZonePolicy
} from './types.js';

export interface ParsedA11yNode {
  ref: string;
  role: string;
  name: string;
  rawLine: string;
  /** Texto exato do nó no DOM, quando difere do nome exibido (ex.: rótulo com marca de obrigatório "Descrição*") */
  domQuery?: string;
}

/**
 * Rótulos visíveis da tela (ADR-018): `label`, `legend`, cabeçalhos de grade e placeholders. A Árvore
 * de Acessibilidade interativa não os traz quando o rótulo não está associado ao campo, e é por eles
 * que um humano reconhece um campo renomeado (ex.: o manual diz "Pesquisar por descrição" e a tela,
 * "Descrição"). Entram como candidatos da Auto-Cura com o papel `label`; cada um ainda é validado no
 * DOM dentro da zona do passo antes de virar evidência.
 */
export async function collectVisibleLabelNodes(client: AgentBrowserClient): Promise<ParsedA11yNode[]> {
  const labels = await client.evalJson<Array<{ name: string; query: string }>>(`
    (() => {
      const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
      const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
      const vis = e => {
        const r = e.getBoundingClientRect();
        const s = window.getComputedStyle(e);
        return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      const out = [];
      const seen = new Set();
      const add = raw => {
        const query = clean(raw);
        // Nome exibido: sem a marca de obrigatório nem os dois-pontos finais
        const name = query.replace(/[\\s*:]+$/, '');
        const key = name.toLowerCase();
        if (name.length < 3 || name.length > 60 || seen.has(key)) return;
        seen.add(key);
        out.push({ name, query });
      };
      for (const el of document.querySelectorAll('label, legend, th')) {
        if (vis(el) && !el.closest(NAV)) add(el.innerText || el.textContent);
      }
      for (const el of document.querySelectorAll('input[placeholder], textarea[placeholder]')) {
        if (vis(el) && !el.closest(NAV)) add(el.getAttribute('placeholder'));
      }
      return JSON.stringify(out.slice(0, 80));
    })()
  `);
  return (labels || []).map(l => ({
    ref: '',
    role: 'label',
    name: l.name,
    rawLine: `label "${l.name}"`,
    domQuery: l.query !== l.name ? l.query : undefined
  }));
}

/**
 * Mapa Canônico de Equivalência Semântica do Ecossistema Orion TN (SPCM / Angular):
 * Mapeia termos legados de manuais (v4/v5) para a nomenclatura real da interface v6.0.4.
 */
const ORION_UI_SYNONYMS: Record<string, string[]> = {
  salvar: ['concluir', 'confirmar', 'gravar', 'salvar', 'aplicar', 'persistir'],
  concluir: ['salvar', 'confirmar', 'gravar', 'finalizar'],
  confirmar: ['concluir', 'salvar', 'ok', 'sim', 'aplicar'],
  novo: ['adicionar +', 'adicionar', 'novo', 'incluir', 'cadastrar', '+'],
  adicionar: ['adicionar +', 'novo', 'incluir', 'cadastrar'],
  incluir: ['adicionar +', 'adicionar', 'novo', 'cadastrar'],
  cadastrar: ['adicionar +', 'novo', 'incluir', 'salvar'],
  visualizar: ['consultar', 'visualizar', 'exibir', 'detalhes'],
  consultar: ['visualizar', 'consultar', 'exibir', 'pesquisar'],
  remover: ['excluir', 'remover', 'apagar', 'inativar'],
  editar: ['alterar', 'editar', 'modificar', 'detalhes'],
  alterar: ['editar', 'modificar', 'atualizar'],
  excluir: ['remover', 'inativar', 'apagar', 'excluir', 'desativar'],
  pesquisar: ['filtrar', 'localizar', 'buscar', 'consultar', 'pesquisa'],
  buscar: ['pesquisar', 'localizar', 'filtrar', 'consultar'],
  localizar: ['pesquisar', 'buscar', 'filtrar'],
  parametrizacoes: ['configurações', 'parâmetros', 'geral'],
  usuarios: ['colaboradores', 'operadores', 'prepostos', 'usuários']
};

/**
 * Normaliza texto removendo acentos, pontuação e caixa alta para comparação semântica.
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\*\*/g, '')
    .replace(/[^\w\s+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Coeficiente de similaridade de Sørensen–Dice por bigramas (0.0 a 1.0).
 */
export function computeDiceSimilarity(a: string, b: string): number {
  const s1 = normalizeText(a);
  const s2 = normalizeText(b);
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return s1 === s2 ? 1.0 : 0;

  const bigrams1 = new Map<string, number>();
  for (let i = 0; i < s1.length - 1; i++) {
    const bg = s1.slice(i, i + 2);
    bigrams1.set(bg, (bigrams1.get(bg) || 0) + 1);
  }

  let intersection = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bg = s2.slice(i, i + 2);
    const count = bigrams1.get(bg) || 0;
    if (count > 0) {
      bigrams1.set(bg, count - 1);
      intersection++;
    }
  }

  return (2.0 * intersection) / (s1.length - 1 + (s2.length - 1));
}

// Intenção de navegação explícita: o alvo legítimo ESTÁ numa zona de navegação.
const NAV_INTENT_PATTERN =
  /\b(menu|menus|submenu|aba|abas|barra superior|barra de navegacao|painel lateral|menu lateral|navbar|sidebar)\b/;
// Verbos inequívocos de parametrização/preenchimento de formulário.
const STRICT_FORM_VERB_PATTERN =
  /\b(defina|preencha|configure|informe|digite|ajuste|parametrize|marque|desmarque|insira|vincule|associe)\b/;
// Verbos que tanto operam um campo quanto escolhem um item de navegação.
const AMBIGUOUS_FORM_VERB_PATTERN = /\b(selecione|escolha|localize|consulte|filtre|pesquise)\b/;

/** O passo cita explicitamente menu, aba, barra ou painel lateral (o alvo é navegação). */
export function hasNavigationIntent(text: string): boolean {
  return NAV_INTENT_PATTERN.test(normalizeText(text));
}

/**
 * Filtro de Zona Semântica (ADR-015) — decide, a partir do texto do passo, onde o alvo pode estar:
 * - Menção explícita a menu/aba/barra/painel lateral -> `any` (o alvo é navegação).
 * - Verbos de parametrização ("Defina", "Preencha", "Configure"...) ou ação `fill`/`search` -> `content`
 *   (estrito: `aside`, `.sidebar`, `nav` e abas ficam fora da busca).
 * - Verbos ambíguos ("Selecione", "Escolha"...) ou ação `select`/`check` -> `content-preferred`.
 * - Demais passos (cliques genéricos) -> `any`.
 */
export function inferStepZone(text: string, actionType?: string): StepZonePolicy {
  const norm = normalizeText(text);
  if (NAV_INTENT_PATTERN.test(norm)) return 'any';
  if (STRICT_FORM_VERB_PATTERN.test(norm)) return 'content';
  if (actionType === 'fill' || actionType === 'search') return 'content';
  if (AMBIGUOUS_FORM_VERB_PATTERN.test(norm)) return 'content-preferred';
  if (actionType === 'select' || actionType === 'check') return 'content-preferred';
  return 'any';
}

/**
 * Rótulo compacto para a anotação de um Group Bounding Box: primeiro parâmetro + contagem dos demais.
 */
export function describeGroupLabel(geometry: DOMResolvedGeometry, fallback: string): string {
  const members = geometry.groupMembers || [];
  if (members.length === 0) return fallback;
  const first = members[0].query.replace(/\*\*/g, '').trim() || members[0].innerText || fallback;
  // Vários alvos podem resolver para o mesmo campo (ex.: opções de um mesmo select): conta campos distintos
  const distinctFields = new Set(members.map(m => `${m.cssBox.x},${m.cssBox.y},${m.cssBox.width},${m.cssBox.height}`));
  if (distinctFields.size === 1) return first;
  const extra = distinctFields.size - 1;
  return `${first} (+${extra} ${extra === 1 ? 'campo' : 'campos'})`;
}

/**
 * Multi-demarcação (ADR-017): converte os membros de um grupo medido no mesmo frame em demarcações
 * numeradas (1, 2, 3...), na ordem em que os alvos aparecem no passo. Alvos que resolvem para a
 * mesma caixa (ex.: opções de um mesmo campo) compartilham uma demarcação. Com um único campo
 * distinto não há multi-demarcação: vale a moldura única.
 */
export function buildCalloutsFromGroup(geometry: DOMResolvedGeometry, firstIndex = 1): DOMCallout[] | undefined {
  const members = geometry.groupMembers || [];
  const vp = geometry.viewport;
  const merged: DOMCallout[] = [];
  for (const m of members) {
    // Só entra o que está visível na print
    const x1 = Math.max(0, m.cssBox.x);
    const y1 = Math.max(0, m.cssBox.y);
    const x2 = Math.min(vp.width, m.cssBox.x + m.cssBox.width);
    const y2 = Math.min(vp.height, m.cssBox.y + m.cssBox.height);
    if (x2 - x1 <= 0 || y2 - y1 <= 0) continue;
    const box = { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
    const label = m.query.replace(/\*\*/g, '').trim() || m.innerText;
    const same = merged.find(
      c => c.cssBox.x === box.x && c.cssBox.y === box.y && c.cssBox.width === box.width && c.cssBox.height === box.height
    );
    if (same) {
      if (!same.label.split(' / ').includes(label)) same.label += ` / ${label}`;
      continue;
    }
    merged.push({ index: 0, label, cssBox: box, matchedSelector: m.matchedSelector, innerText: m.innerText });
  }
  if (merged.length < 2) return undefined;
  merged.forEach((c, i) => (c.index = firstIndex + i));
  return merged;
}

/**
 * Extrai os nós interativos da Árvore de Acessibilidade compacta (`agent-browser snapshot -i`).
 */
export function parseAccessibilitySnapshot(snapshotText: string): ParsedA11yNode[] {
  const nodes: ParsedA11yNode[] = [];
  const lines = snapshotText.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Formatos suportados: `button "Concluir" [ref=e12]` ou `@e12 button "Concluir"`
    const refMatch = line.match(/\[ref=(e\d+)\]/) || line.match(/@(e\d+)/);
    if (!refMatch) continue;

    const ref = `@${refMatch[1]}`;
    const roleMatch = line.match(/^(?:-\s*)?([a-zA-Z]+)\s+"/);
    const nameMatch = line.match(/"([^"]+)"/);

    const role = roleMatch ? roleMatch[1].toLowerCase() : 'generic';
    const name = nameMatch ? nameMatch[1].trim() : line.replace(/\[ref=e\d+\]|@e\d+/g, '').trim();

    if (name) {
      nodes.push({ ref, role, name, rawLine: line });
    }
  }

  return nodes;
}

interface A11ySemanticCandidate {
  node: ParsedA11yNode;
  documentedTarget: string;
  confidence: number;
  reason: string;
}

/**
 * Avalia equivalência semântica na Árvore de Acessibilidade (Sub-camada 2A — 0 Tokens).
 * Retorna TODOS os candidatos com confiança >= 0.68, do melhor para o pior (um por nó), para que a
 * camada de zona possa descartar um item de navegação e seguir para o próximo candidato de conteúdo.
 */
export function rankSemanticCandidatesInA11y(
  targets: string[],
  nodes: ParsedA11yNode[],
  step?: Pick<RoutineStep, 'rawText' | 'targets'>
): A11ySemanticCandidate[] {
  const bestByRef = new Map<string, A11ySemanticCandidate>();

  for (const docTarget of targets) {
    const normDoc = normalizeText(docTarget);
    if (!normDoc) continue;

    // Coletar sinônimos conhecidos do dicionário Orion TN
    const synonyms = new Set<string>();
    for (const [key, synList] of Object.entries(ORION_UI_SYNONYMS)) {
      if (normDoc === key || normDoc.includes(key)) {
        for (const s of synList) synonyms.add(normalizeText(s));
      }
    }

    for (const node of nodes) {
      const normNode = normalizeText(node.name);
      if (!normNode) continue;
      // ADR-024: campo de texto nunca é item de menu e a barra de pesquisa global (CTRL + B) só é alvo se o passo a cita
      if (step && forbiddenCandidateReason(step, { name: node.name, role: node.role })) continue;

      let score = 0;
      let reason = '';

      if (node.role === 'label') {
        // Rótulo visível (ADR-018): o dicionário de sinônimos é de comandos e não vale aqui. Um rótulo
        // só é candidato se um nome contiver o outro por palavras inteiras (campo renomeado).
        const whole = (hay: string, needle: string) => ` ${hay} `.includes(` ${needle} `);
        if (!whole(normDoc, normNode) && !whole(normNode, normDoc)) continue;
        score = Math.min(0.95, computeDiceSimilarity(normDoc, normNode) + 0.2);
        reason = `Rótulo visível na tela equivalente por inclusão de nome (${Math.round(score * 100)}%)`;
      } else if (Array.from(synonyms).some(s => synonymMatchesNode(s, normNode))) {
        // ADR-024: palavra inteira ou igualdade exata; o símbolo `+` não casa por substring ("CTRL + B")
        // 1. Equivalência direta via Dicionário de Sinônimos Orion TN
        score = 0.92;
        reason = `Sinônimo canônico Orion TN ('${docTarget}' -> '${node.name}')`;
      } else {
        // 2. Similaridade léxica Sørensen–Dice + inclusão de radicais
        const dice = computeDiceSimilarity(normDoc, normNode);
        const tokenOverlap = normNode.includes(normDoc) || normDoc.includes(normNode) ? 0.2 : 0;
        score = Math.min(0.95, dice + tokenOverlap);
        reason = `Similaridade semântica na árvore de acessibilidade (${Math.round(score * 100)}%)`;
      }

      // Bônus se o role for um controle interativo primário (button, link, tab, menuitem)
      if (['button', 'link', 'tab', 'menuitem', 'textbox', 'combobox'].includes(node.role)) {
        score = Math.min(0.98, score + 0.04);
      }

      // Rótulos visíveis não têm `ref`: a chave é o próprio nome
      const key = node.ref || `label:${normNode}`;
      const previous = bestByRef.get(key);
      if (score >= 0.68 && (!previous || score > previous.confidence)) {
        bestByRef.set(key, {
          node,
          documentedTarget: docTarget,
          confidence: Number(score.toFixed(2)),
          reason
        });
      }
    }
  }

  // Ordenação estável: em empate de confiança, mantém a ordem de descoberta na árvore
  return Array.from(bestByRef.values()).sort((a, b) => b.confidence - a.confidence);
}

/** Máximo de candidatos da árvore de acessibilidade testados contra a zona de conteúdo. */
const MAX_ZONE_HEAL_ATTEMPTS = 5;

/**
 * Extrai a geometria determinística de um nó curado respeitando a política de zona do passo.
 * Em zona estrita (`content`) não há fallback por `ref`: uma caixa obtida fora do DOM introspectado
 * não pode ser auditada contra a navegação lateral e seria uma demarcação não verificável.
 */
async function resolveHealedGeometry(
  client: AgentBrowserClient,
  node: ParsedA11yNode,
  zonePolicy: StepZonePolicy
): Promise<DOMResolvedGeometry | null> {
  const viaDom = await client.getDOMGeometry([node.domQuery ?? node.name], { scrollIntoView: true, zone: zonePolicy });
  if (viaDom || zonePolicy === 'content' || !node.ref) return viaDom;

  try {
    const refBox = await client.getBox(node.ref);
    if (refBox.width > 0 && refBox.height > 0) {
      return {
        cssBox: refBox,
        viewport: { width: 1440, height: 900, devicePixelRatio: 1, scrollX: 0, scrollY: 0 },
        context: {
          tagName: node.role,
          role: node.role,
          innerText: node.name,
          isTopNav: refBox.y < 52,
          isVerticalSidebar: refBox.x < 140 && refBox.width < 240 && refBox.y >= 60
        },
        matchedSelector: node.ref,
        url: 'healed://a11y-snapshot',
        capturedAt: new Date().toISOString(),
        zone: 'any',
        zonePolicy
      };
    }
  } catch {}
  return null;
}

/**
 * Reconciliação de alvos não localizados num passo de múltiplos alvos (ADR-016).
 *
 * O passo foi demarcado porque parte dos alvos existe, mas um ou mais rótulos citados no manual não
 * estão na zona de conteúdo. Para cada um:
 * 1. tenta a Auto-Cura na Árvore de Acessibilidade (sinônimos + Sørensen–Dice), descartando candidatos
 *    que já são outro membro do grupo e validando o candidato no DOM dentro da zona de conteúdo;
 * 2. se curado, o rótulo real entra no grupo e a união é medida de novo (a moldura passa a cobri-lo);
 * 3. se não, registra a divergência `target_not_found`.
 * Em ambos os casos a divergência vai para o relatório: o passo deixa de passar como `ok` silencioso.
 */
async function reconcileUnresolvedGroupTargets(
  client: AgentBrowserClient,
  step: RoutineStep,
  geometry: DOMResolvedGeometry,
  ctx: { candidates: string[]; groupTargets: string[]; zonePolicy: StepZonePolicy; allowHealing: boolean }
): Promise<{ geometry: DOMResolvedGeometry; divergences: SmartLocatorDivergence[]; validatedText?: string }> {
  const unresolved = geometry.unresolvedGroupTargets || [];
  const divergences: SmartLocatorDivergence[] = [];
  const replacements = new Map<string, string>();
  /** Texto exato usado para medir o rótulo curado no DOM (pode trazer a marca de obrigatório) */
  const domQueries = new Map<string, string>();
  const healedByTarget = new Map<string, SmartLocatorDivergence>();
  const healZone = ctx.zonePolicy === 'any' ? 'any' : 'content';
  let remeasure = false;

  if (ctx.allowHealing) {
    let nodes: ParsedA11yNode[] = [];
    try {
      nodes = parseAccessibilitySnapshot(await client.snapshotInteractive());
    } catch {
      nodes = [];
    }
    nodes.push(...(await collectVisibleLabelNodes(client)));
    // Nomes já ocupados por outros alvos do passo: um rótulo ausente não pode ser "curado" para eles
    const taken = new Set<string>();
    for (const m of geometry.groupMembers || []) {
      taken.add(normalizeText(m.query));
      if (m.innerText) taken.add(normalizeText(m.innerText));
    }
    for (const t of step.targets) taken.add(normalizeText(t));

    for (const target of unresolved) {
      const ranked = rankSemanticCandidatesInA11y([target], nodes, step)
        .filter(c => !taken.has(normalizeText(c.node.name)))
        .slice(0, MAX_ZONE_HEAL_ATTEMPTS);
      for (const candidate of ranked) {
        remeasure = true;
        const domQuery = candidate.node.domQuery ?? candidate.node.name;
        const probe = await client.getDOMGeometry([domQuery], { scrollIntoView: false, zone: healZone });
        if (!probe || isGenericContainerMatch(probe)) continue;
        replacements.set(target, candidate.node.name);
        domQueries.set(target, domQuery);
        taken.add(normalizeText(candidate.node.name));
        const healed: SmartLocatorDivergence = {
          stepNumber: step.stepNumber,
          documentedTarget: target,
          actualElementText: candidate.node.name,
          actualRole: candidate.node.role,
          matchedRef: candidate.node.ref,
          resolutionLayer: candidate.reason.includes('Sinônimo') ? 'dom_synonym_heuristic' : 'a11y_fuzzy_match',
          confidence: candidate.confidence,
          reason: candidate.reason,
          detectedAt: new Date().toISOString(),
          textChange: { from: `**${target}**`, to: `**${candidate.node.name}**` }
        };
        divergences.push(healed);
        healedByTarget.set(target, healed);
        console.log(
          `   ⚡ [SmartLocator Auto-Cura] Rótulo curado na zona de conteúdo: "${target}" -> "${candidate.node.name}" (conf: ${Math.round(candidate.confidence * 100)}%)`
        );
        break;
      }
    }
  }

  for (const target of unresolved) {
    if (replacements.has(target)) continue;
    divergences.push({
      stepNumber: step.stepNumber,
      documentedTarget: target,
      actualElementText: '',
      resolutionLayer: 'target_not_found',
      confidence: 0,
      reason: 'Alvo citado no manual não localizado na zona de conteúdo da tela auditada',
      detectedAt: new Date().toISOString()
    });
    console.log(`   ⚠ [Divergência] Alvo "${target}" não existe na zona de conteúdo; registrado para o relatório.`);
  }

  // As medições de validação trocam o carimbo de ação de lugar: a última medição antes da captura
  // precisa ser a do grupo, já com os rótulos curados no lugar dos documentados.
  let finalGeometry = geometry;
  if (remeasure) {
    const healedGroup = ctx.groupTargets.map(t => domQueries.get(t) ?? t);
    const again = await client.getDOMGeometry(ctx.candidates, {
      scrollIntoView: true,
      zone: ctx.zonePolicy,
      groupTargets: healedGroup
    });
    if (again) finalGeometry = again;
  }

  // Evidência (ADR-017): o rótulo curado só altera o texto se o seu nó foi medido na união final
  for (const [target, healed] of healedByTarget) {
    const name = replacements.get(target)!;
    const member = (finalGeometry.groupMembers || []).find(m => m.query === domQueries.get(target));
    if (member) {
      healed.evidence = {
        source: 'dom-measured',
        matchedSelector: member.matchedSelector,
        elementText: member.innerText || name,
        box: member.cssBox
      };
    }
  }

  let validatedText: string | undefined;
  if (replacements.size > 0) {
    validatedText = step.rawText;
    for (const [from, to] of replacements) {
      validatedText = validatedText.replace(`**${from}**`, `**${to}**`);
    }
  }
  return { geometry: finalGeometry, divergences, validatedText };
}

/**
 * Sub-camada 2B: Fallback estruturado de chamada única ao LLM sobre a Árvore de Acessibilidade compacta.
 * Só é acionado se a Sub-camada 2A não atingir confiança >= 0.68 e houver chave de API configurada.
 */
async function resolveViaLLMOnAccessibilityTree(
  step: RoutineStep,
  nodes: ParsedA11yNode[]
): Promise<{ node: ParsedA11yNode; documentedTarget: string; confidence: number; reason: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  // ADR-024: o LLM nunca vê (e portanto nunca escolhe) campo de texto em passo de navegação nem a busca global
  nodes = nodes.filter(n => !forbiddenCandidateReason(step, { name: n.name, role: n.role }));
  if (!apiKey || nodes.length === 0) return null;

  const compactTree = nodes
    .slice(0, 40)
    .map(n => `${n.ref} [${n.role}] "${n.name}"`)
    .join('\n');

  const prompt = [
    `Você é o módulo SmartLocator de auto-cura de seletores do ERP Orion TN.`,
    `Passo documentado no manual: "${step.rawText}"`,
    `Alvos procurados: ${JSON.stringify(step.targets)}`,
    `Elementos interativos presentes na tela atual (Accessibility Tree):`,
    compactTree,
    `Responda APENAS um objeto JSON válido no formato:`,
    `{"ref":"@eXX","confidence":0.0,"reason":"motivo curto"} (use confidence=0 se nenhum elemento corresponder).`
  ].join('\n');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0,
        max_tokens: 120,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) return null;
    const data = (await response.json()) as any;
    const rawJson = data?.choices?.[0]?.message?.content;
    if (!rawJson) return null;

    const parsed = JSON.parse(rawJson);
    if (!parsed.ref || typeof parsed.confidence !== 'number' || parsed.confidence < 0.65) {
      return null;
    }

    const matchedNode = nodes.find(n => n.ref === parsed.ref || n.ref === `@${parsed.ref.replace(/^@/, '')}`);
    if (!matchedNode) return null;

    return {
      node: matchedNode,
      documentedTarget: step.targets[0] || step.rawText,
      confidence: Number(parsed.confidence.toFixed(2)),
      reason: String(parsed.reason || 'Equivalência semântica identificada via LLM na Árvore de Acessibilidade')
    };
  } catch {
    return null;
  }
}

export interface SmartLocateOptions {
  /**
   * `false` restringe a busca à medição direta no DOM (sem Auto-Cura por similaridade). Usado em
   * passos que apenas listam opções alternativas: uma opção ausente não deve ser "curada" para
   * outro elemento da tela (ADR-016).
   */
  allowHealing?: boolean;
  /**
   * Curas já comprovadas numa auditoria anterior para ESTE passo (ADR-025). Entram como Camada 0.5, depois da
   * medição direta do alvo documentado: se o manual está certo, a dica nem é usada. Só valem se o nó for
   * medido ao vivo de novo; a dica acelera e estabiliza, nunca comprova.
   */
  priorHints?: Array<{ documented: string; actual: string; layer: SmartLocatorDivergence['resolutionLayer']; confidence: number }>;
  /** Rotas de menu reais já comprovadas para este passo (ADR-025), repassadas à Camada 0 */
  priorMenuChains?: string[][];
}

/**
 * SmartLocator (Motor de Resiliência e Auto-Cura em Camadas):
 * - Camada 0: Caminho de menu `A > B > C` percorrido na árvore de navegação real, com Auto-Cura de Rota (`menu-path.ts`).
 * - Camada 1: Geometria direta e determinística no DOM (`dom-geometry.ts`) -> 2ms, 0 tokens.
 * - Camada 2A: Árvore de Acessibilidade Compacta (`snapshot -i`) + Dicionário Canônico Orion TN & Sørensen–Dice -> 0 tokens.
 * - Camada 2B: Chamada única estruturada ao LLM sobre a Árvore de Acessibilidade compacta.
 * - Emite telemetria `SmartLocatorDivergence` sempre que curar uma divergência entre o manual e a tela real.
 * - Todas as camadas obedecem ao Filtro de Zona Semântica (ADR-015): passos de parametrização/formulário
 *   nunca resolvem para `aside`, `.sidebar`, `nav` ou abas, e múltiplos parâmetros viram um Group Bounding Box.
 */
export async function locateAndCaptureWithSelfHealing(
  client: AgentBrowserClient,
  step: RoutineStep,
  rawScreenshotPath: string,
  options: SmartLocateOptions = {}
): Promise<SmartLocatorResult> {
  // =========================================================================
  // CAMADA 0: Navegação Encadeada por Segmentos com Auto-Cura de Rota (ADR-016)
  // Um caminho de menu `A > B > C` é percorrido na árvore de navegação real antes de qualquer busca textual.
  // =========================================================================
  const viaMenuPath = await resolveAndNavigateMenuPath(client, step, rawScreenshotPath, options.priorMenuChains);
  if (viaMenuPath && (viaMenuPath.found || viaMenuPath.permissionBlocked)) return viaMenuPath;
  // ADR-024: caminho de menu inexistente na árvore real (ou cascata que não abriu). O passo ainda pode ser
  // medido por correspondência EXATA no DOM (Camada 1), mas nunca é "curado" por similaridade/sinônimo.
  const menuGuard: Pick<SmartLocatorResult, 'menuPathMissing' | 'menuPathOpenFailed'> = viaMenuPath
    ? { menuPathMissing: viaMenuPath.menuPathMissing, menuPathOpenFailed: viaMenuPath.menuPathOpenFailed }
    : {};
  const healingForbiddenByMenu = !!(menuGuard.menuPathMissing || menuGuard.menuPathOpenFailed);

  const candidates = step.targets.length > 0 ? step.targets : [step.rawText];

  // =========================================================================
  // FILTRO DE ZONA SEMÂNTICA (ADR-015): decide onde o alvo pode estar antes de tocar o DOM
  // =========================================================================
  const zonePolicy: StepZonePolicy = step.zone ?? inferStepZone(step.rawText, step.actionType);
  // Passo de formulário que cita vários parâmetros -> União Geométrica de Múltiplos Alvos
  //  (ADR-015). Em passo de navegação/clique, os negritos da linha principal deixam de ser
  //  alternativas: cada um é medido e demarcado na mesma print (multi-demarcação, ADR-017).
  const mainTargets = step.targets.slice(0, step.mainTargetCount ?? step.targets.length);
  const groupTargets =
    zonePolicy !== 'any'
      ? step.targets.length >= 2
        ? step.targets
        : undefined
      : mainTargets.length >= 2
        ? mainTargets
        : undefined;
  if (zonePolicy !== 'any') {
    console.log(
      `   [Zona Semântica] Política "${zonePolicy}": navegação lateral/abas fora da busca${groupTargets ? ` | união de ${groupTargets.length} alvos` : ''}`
    );
  }

  // =========================================================================
  // CAMADA 1: Resolução Direta via Geometria Determinística do DOM (0 tokens)
  // =========================================================================
  let directGeometry = await client.getDOMGeometry(candidates, {
    scrollIntoView: true,
    zone: zonePolicy,
    groupTargets
  });
  if (directGeometry && isGenericContainerMatch(directGeometry)) {
    console.log(
      `   [Evidência] "${directGeometry.matchedSelector}" casou com um contêiner genérico (${directGeometry.cssBox.width}x${directGeometry.cssBox.height}); não serve de demarcação.`
    );
    directGeometry = null;
  }
  if (directGeometry) {
    const forbidden = forbiddenMeasuredReason(step, directGeometry.context);
    if (forbidden) {
      console.log(`   [Guarda de Navegação] Medição direta descartada (${directGeometry.matchedSelector}): ${forbidden}.`);
      directGeometry = null;
    }
  }
  if (directGeometry) {
    let geometry = directGeometry;
    let targetDivergences: SmartLocatorDivergence[] = [];
    let validatedText: string | undefined;

    if (groupTargets && geometry.groupMembers && geometry.unresolvedGroupTargets?.length) {
      console.log(
        `   [Group Bounding Box] ${geometry.groupMembers.length} alvo(s) unidos; não localizados no conteúdo: ${geometry.unresolvedGroupTargets.join(', ')}`
      );
      const reconciled = await reconcileUnresolvedGroupTargets(client, step, geometry, {
        candidates,
        groupTargets,
        zonePolicy,
        allowHealing: options.allowHealing !== false
      });
      geometry = reconciled.geometry;
      targetDivergences = reconciled.divergences;
      validatedText = reconciled.validatedText;
    }

    geometry.callouts = buildCalloutsFromGroup(geometry);
    await client.screenshot(rawScreenshotPath);
    const fallbackName = step.targets[0] || geometry.context.innerText || 'Elemento Validado';
    return {
      found: true,
      healed: targetDivergences.length > 0,
      geometry,
      matchedTargetName: describeGroupLabel(geometry, fallbackName),
      targetDivergences: targetDivergences.length > 0 ? targetDivergences : undefined,
      validatedText
    };
  }

  // RBAC (ADR-017): o alvo pode existir e estar bloqueado/oculto pela aplicação para o perfil logado
  const blockedHit = await probePermissionBlockedTargets(client, candidates);
  if (blockedHit) {
    console.warn(`   ⛔ [RBAC] "${blockedHit.target}" existe na tela, mas está bloqueado para o perfil logado: ${blockedHit.detail}`);
    await client.screenshot(rawScreenshotPath);
    return {
      found: false,
      healed: false,
      geometry: null,
      matchedTargetName: blockedHit.target,
      permissionBlocked: { target: blockedHit.target, detail: blockedHit.detail, domEvidence: blockedHit.domEvidence }
    };
  }

  // =========================================================================
  // CAMADA 1.5 (ADR-020): ações icônicas de grade (olho/lápis/X). O nome real vive no `title`, que
  // difere do manual (Visualizar→Consultar, Editar→Alterar, Remover→Excluir). Não clica nem cura por similaridade.
  // =========================================================================
  const gridOutcome = await resolveGridActions(client, step.stepNumber, candidates, {
    allowActionTarget: step.mainTargetCount !== 0
  });
  let gridScanStatus: SmartLocatorResult['gridActions'];
  if (gridOutcome) {
    if (gridOutcome.status === 'resolved') {
      const g = gridOutcome.resolution;
      console.log(
        `   [Ações de Grade] 1ª linha "${g.firstRowText}": ${g.matches.map(m => `${m.target}→${m.realLabel} (${m.via})`).join(' · ')}`
      );
      await client.screenshot(rawScreenshotPath);
      const now = new Date().toISOString();
      const missingDivs: SmartLocatorDivergence[] = g.unmatched.map(t => ({
        stepNumber: step.stepNumber,
        documentedTarget: t,
        actualElementText: '',
        resolutionLayer: 'target_not_found',
        confidence: 0,
        reason: `nenhum botão de ação da primeira linha da grade corresponde a "${t}" (ações reais: ${g.rowActions.map(a => a.label || '(sem nome)').join(', ')})`,
        detectedAt: now
      }));
      const allDivs = [...g.divergences, ...missingDivs];
      return {
        found: true,
        healed: g.divergences.length > 0,
        geometry: g.geometry,
        matchedTargetName: describeGroupLabel(g.geometry, g.matches[0].realLabel),
        targetDivergences: allDivs.length > 0 ? allDivs : undefined,
        gridActions: {
          status: 'resolved',
          firstRowText: g.firstRowText,
          rowActions: g.rowActions,
          matches: g.matches.map(m => ({ target: m.target, realLabel: m.realLabel, via: m.via, source: m.source }))
        }
      };
    }
    gridScanStatus = { status: gridOutcome.status };
    console.log(
      `   [Ações de Grade] ${gridOutcome.status === 'empty-grid' ? 'a grade não tem registros' : 'a 1ª linha não expõe botões de ação identificáveis'}; nada a demarcar para [${candidates.join(', ')}].`
    );
  }

  if (options.allowHealing === false || healingForbiddenByMenu) {
    if (healingForbiddenByMenu) {
      console.log('   [Guarda de Navegação] Caminho de menu sem correspondência na árvore real: a Auto-Cura por similaridade/sinônimo está proibida para este passo.');
    }
    await client.screenshot(rawScreenshotPath);
    return {
      found: false,
      healed: false,
      geometry: null,
      matchedTargetName: step.targets[0] || 'Elemento não localizado',
      gridActions: gridScanStatus,
      ...menuGuard
    };
  }

  // =========================================================================
  // CAMADA 0.5 (ADR-025): cura já comprovada numa auditoria anterior. Roda só depois de a medição direta do
  // alvo documentado falhar e só em passo de alvo único; a dica é medida ao vivo e passa pelas mesmas guardas
  // (contêiner genérico, navegação estrita, zona semântica). Sem acerto, segue para a Camada 2 sem penalidade.
  // =========================================================================
  if (options.priorHints && options.priorHints.length > 0 && step.targets.length === 1 && !groupTargets) {
    const documentedTarget = step.targets[0];
    const hint = options.priorHints.find(h => normalizeText(h.documented) === normalizeText(documentedTarget));
    if (hint) {
      const geometry = await client.getDOMGeometry([hint.actual], { scrollIntoView: true, zone: zonePolicy });
      const forbidden = geometry ? forbiddenMeasuredReason(step, geometry.context) : null;
      if (geometry && !isGenericContainerMatch(geometry) && !forbidden) {
        console.log(
          `   ↺ [Reauditoria] Cura anterior reconfirmada ao vivo: "${documentedTarget}" -> "${hint.actual}" (${hint.layer}, conf anterior ${Math.round(hint.confidence * 100)}%)`
        );
        await client.screenshot(rawScreenshotPath);
        const divergence: SmartLocatorDivergence = {
          stepNumber: step.stepNumber,
          documentedTarget,
          actualElementText: hint.actual,
          resolutionLayer: hint.layer,
          confidence: hint.confidence,
          reason: `Cura comprovada numa auditoria anterior (${hint.layer}) e reconfirmada ao vivo: o elemento "${hint.actual}" foi medido na tela desta execução`,
          detectedAt: new Date().toISOString(),
          evidence: {
            source: 'dom-measured',
            matchedSelector: geometry.matchedSelector,
            elementText: geometry.context.innerText || hint.actual,
            box: geometry.cssBox
          },
          textChange: { from: `**${documentedTarget}**`, to: `**${hint.actual}**` }
        };
        return {
          found: true,
          healed: true,
          geometry,
          matchedTargetName: hint.actual,
          divergence,
          priorHint: { documented: documentedTarget, actual: hint.actual, layer: hint.layer }
        };
      }
      console.log(`   [Reauditoria] A cura anterior "${hint.actual}" não foi reconfirmada nesta tela; seguindo para a Auto-Cura.`);
    }
  }

  // =========================================================================
  // CAMADA 2: Auto-Cura via Árvore de Acessibilidade Compacta (`snapshot -i`)
  // =========================================================================
  console.log(
    `   [SmartLocator] Alvo exato [${candidates.join(', ')}] ausente no DOM. Iniciando Auto-Cura na Árvore de Acessibilidade...`
  );

  let snapshotText = '';
  try {
    snapshotText = await client.snapshotInteractive();
  } catch {
    snapshotText = '';
  }

  const a11yNodes = [...parseAccessibilitySnapshot(snapshotText), ...(await collectVisibleLabelNodes(client))];

  // Sub-camada 2A: Equivalência Semântica / Sinônimos Orion TN + Fuzzy Matching.
  // A árvore de acessibilidade não carrega zona; por isso cada candidato é validado contra o DOM
  // com a política do passo. Em zona de conteúdo, um item de menu lateral homônimo é descartado
  // e o próximo candidato do ranking é testado.
  const ranked = rankSemanticCandidatesInA11y(candidates, a11yNodes, step);
  const attempts = ranked.slice(0, zonePolicy === 'any' ? 1 : MAX_ZONE_HEAL_ATTEMPTS);

  let healedCandidate: A11ySemanticCandidate | null = null;
  let healedGeometry: DOMResolvedGeometry | null = null;
  let resolutionLayer: SmartLocatorDivergence['resolutionLayer'] = 'dom_synonym_heuristic';

  for (const candidate of attempts) {
    const geometry = await resolveHealedGeometry(client, candidate.node, zonePolicy);
    // ADR-024: o que foi MEDIDO também passa pela guarda (o nó medido pode ser um <input> com o mesmo texto)
    const measuredForbidden = geometry ? forbiddenMeasuredReason(step, geometry.context) : null;
    if (measuredForbidden) {
      console.log(`   [Guarda de Navegação] Candidato "${candidate.node.name}" descartado após a medição: ${measuredForbidden}.`);
      continue;
    }
    if (geometry && !isGenericContainerMatch(geometry)) {
      healedCandidate = candidate;
      healedGeometry = geometry;
      resolutionLayer = candidate.reason.includes('Sinônimo') ? 'dom_synonym_heuristic' : 'a11y_fuzzy_match';
      break;
    }
    if (zonePolicy !== 'any') {
      console.log(
        `   [Zona Semântica] Candidato "${candidate.node.name}" (${candidate.node.ref}) descartado: fora do contêiner de conteúdo.`
      );
    }
  }

  // Sub-camada 2B: Fallback LLM Estruturado de Chamada Única (se 2A não produzir candidatos)
  if (!healedCandidate && ranked.length === 0 && a11yNodes.length > 0) {
    const llmCandidate = await resolveViaLLMOnAccessibilityTree(step, a11yNodes);
    if (llmCandidate) {
      const geometry = await resolveHealedGeometry(client, llmCandidate.node, zonePolicy);
      if (geometry && !forbiddenMeasuredReason(step, geometry.context)) {
        healedCandidate = llmCandidate;
        healedGeometry = geometry;
        resolutionLayer = 'llm_a11y_fallback';
      }
    }
  }

  if (healedCandidate && healedGeometry) {
    const { node, documentedTarget, confidence, reason } = healedCandidate;
    console.log(
      `   ⚡ [SmartLocator Auto-Cura] Divergência curada: "${documentedTarget}" -> "${node.name}" (${node.ref}, conf: ${Math.round(confidence * 100)}%)`
    );

    await client.screenshot(rawScreenshotPath);

    const divergence: SmartLocatorDivergence = {
      stepNumber: step.stepNumber,
      documentedTarget,
      actualElementText: node.name,
      actualRole: node.role,
      matchedRef: node.ref,
      resolutionLayer,
      confidence,
      reason,
      detectedAt: new Date().toISOString(),
      // Evidência (ADR-017): o nó curado foi medido ao vivo e é o que a print demarca
      evidence: {
        source: 'dom-measured',
        matchedSelector: healedGeometry.matchedSelector,
        elementText: healedGeometry.context.innerText || node.name,
        box: healedGeometry.cssBox
      },
      textChange: { from: `**${documentedTarget}**`, to: `**${node.name}**` }
    };

    return {
      found: true,
      healed: true,
      geometry: healedGeometry,
      matchedTargetName: node.name,
      matchedRef: node.ref,
      divergence
    };
  }

  // Caso não encontrado em nenhuma camada: captura frame real do bloqueio (ADR-010)
  await client.screenshot(rawScreenshotPath);
  return {
    found: false,
    healed: false,
    geometry: null,
    matchedTargetName: step.targets[0] || 'Elemento não localizado'
  };
}
