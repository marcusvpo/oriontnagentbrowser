/**
 * Analisador de Grafo de Dependências do KB (ADR-021 §1): distingue `[XRX]` (a rotina depende de OUTRA
 * rotina que cria o registro/estado necessário) de `[DDD]` (nenhuma rotina do sistema gera o dado).
 *
 * O front-matter do KB não tem campo de pré-requisito (`pre_requisitos`, `depende`...): as dependências
 * vivem na prosa. O grafo é, portanto, heurístico e transparente:
 *   - PROVEDOR: rotina cujo título começa por verbo de criação (Adicionar/Cadastrar/Criar/Abrir/Fazer...)
 *     + a entidade que ela cria (tokens significativos do título);
 *   - CONSUMIDOR: a rotina bloqueada, pela entidade da sua grade/título ou por um objeto de negócio que
 *     o manual manda localizar (protocolo, orçamento, ato, pedido...);
 *   - ARESTA: consumidor -> provedor quando partilham token significativo da entidade, com prioridade ao
 *     mesmo módulo. Os provedores vão para o relatório para validação humana.
 */
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { normalizeText } from './smart-locator.js';
import type { ParsedRoutine } from './types.js';

export interface GraphNode {
  id: string;
  modulo: string;
  titulo: string;
  file: string;
  /** Tokens significativos do título (entidade tratada pela rotina) */
  entity: string[];
  /** A rotina cria registros (título começa por verbo de criação) */
  creates: boolean;
}

export interface ProviderMatch {
  id: string;
  titulo: string;
  modulo: string;
  /** Tokens da entidade partilhados com o consumidor */
  shared: string[];
  score: number;
}

export interface DependencyGraph {
  builtAt: string;
  nodes: Record<string, GraphNode>;
}

const CREATE_VERBS = new Set([
  'adicionar', 'adicao', 'cadastrar', 'cadastro', 'criar', 'criando', 'criacao', 'incluir', 'inclusao',
  'novo', 'nova', 'lancar', 'lancando', 'abrir', 'abertura', 'iniciar', 'gerar', 'emitir', 'lavrar', 'registrar', 'fazer'
]);

const STOPWORDS = new Set([
  'de', 'da', 'do', 'dos', 'das', 'e', 'em', 'um', 'uma', 'uns', 'umas', 'o', 'a', 'os', 'as', 'para', 'por', 'com', 'sem',
  'no', 'na', 'nos', 'nas', 'ao', 'aos', 'que', 'via', 'como', 'outro', 'outra', 'outros', 'outras', 'ou', 'seu', 'sua', 'seus', 'suas',
  'gerenciar', 'gerenciamento', 'gestao', 'gerencia', 'configurar', 'configuracao', 'configurando', 'parametrizar', 'parametros',
  'parametro', 'acessar', 'consultar', 'consulta', 'visualizar', 'alterar', 'editar', 'excluir', 'definir', 'realizar',
  'tela', 'sistema', 'orion', 'basica', 'existentes', 'existente', 'completo', 'completa'
]);

/** Tokens genéricos demais para ligar duas rotinas sozinhos. */
const WEAK_TOKENS = new Set(['tipo', 'item', 'valor', 'dados', 'campo', 'nota', 'lista']);

const singular = (t: string) => (t.length > 4 && t.endsWith('s') ? t.slice(0, -1) : t);

export function entityTokens(text: string): string[] {
  const out: string[] = [];
  for (const raw of normalizeText(text).split(' ')) {
    if (!raw || STOPWORDS.has(raw) || CREATE_VERBS.has(raw) || raw.length < 4 || /^\d/.test(raw)) continue;
    const t = singular(raw);
    if (!out.includes(t)) out.push(t);
  }
  return out;
}

function startsWithCreateVerb(titulo: string): boolean {
  const words = normalizeText(titulo).split(' ').filter(w => w && !['como', 'de', 'do', 'da', 'um', 'uma', 'o', 'a'].includes(w));
  return words.slice(0, 3).some(w => CREATE_VERBS.has(w));
}

let cached: DependencyGraph | null = null;

/** Lê o front-matter mínimo (id, titulo, modulo) sem o custo de parsear os 471 YAMLs completos. */
function readHead(file: string): { id: string; titulo: string; modulo: string } | null {
  const parts = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split(/^---$/m);
  const head = parts.length >= 3 ? parts[1] : '';
  const id = head.match(/^id:\s*['"]?(.+?)['"]?\s*$/m)?.[1];
  const titulo = head.match(/^titulo:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
  const modulo = head.match(/^modulo:\s*['"]?(.+?)['"]?\s*$/m)?.[1];
  return id && titulo && modulo ? { id, titulo, modulo } : null;
}

export function buildDependencyGraph(force = false): DependencyGraph {
  if (cached && !force) return cached;
  const nodes: Record<string, GraphNode> = {};
  if (fs.existsSync(config.kbDir)) {
    for (const mod of fs.readdirSync(config.kbDir)) {
      const dir = path.join(config.kbDir, mod);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith('.md') || f.startsWith('_')) continue;
        const file = path.join(dir, f);
        const head = readHead(file);
        if (!head) continue;
        nodes[head.id] = {
          id: head.id,
          modulo: head.modulo,
          titulo: head.titulo,
          file,
          entity: entityTokens(head.titulo),
          creates: startsWithCreateVerb(head.titulo)
        };
      }
    }
  }
  cached = { builtAt: new Date().toISOString(), nodes };
  return cached;
}

/**
 * Provedores de uma entidade: rotinas de criação que partilham tokens significativos com ela.
 * Mesmo módulo ganha prioridade; outro módulo exige 2 tokens em comum.
 */
export function findProviders(consumerId: string, entity: string[], opts: { sameModuleOnly?: boolean } = {}): ProviderMatch[] {
  const graph = buildDependencyGraph();
  const consumer = graph.nodes[consumerId];
  const wanted = entity.filter(t => !WEAK_TOKENS.has(t));
  if (wanted.length === 0) return [];
  const matches: ProviderMatch[] = [];
  for (const node of Object.values(graph.nodes)) {
    if (!node.creates || node.id === consumerId) continue;
    const sameModule = !!consumer && node.modulo === consumer.modulo;
    if (opts.sameModuleOnly && !sameModule) continue;
    const shared = node.entity.filter(t => wanted.includes(t) && t.length >= 5);
    if (shared.length === 0) continue;
    if (!sameModule && shared.length < 2) continue;
    matches.push({ id: node.id, titulo: node.titulo, modulo: node.modulo, shared, score: shared.length * 2 + (sameModule ? 1 : 0) });
  }
  return matches.sort((a, b) => b.score - a.score || a.titulo.length - b.titulo.length).slice(0, 3);
}

/** Entidade da grade da rotina: título + cabeçalhos/toast lidos na tela (quando houver). */
export function consumerEntity(parsed: ParsedRoutine, extraText: string[] = []): string[] {
  return entityTokens([parsed.titulo, ...extraText].join(' '));
}

/** Objetos de negócio que existem fora da tela da rotina e são criados por outra rotina. */
const EXTERNAL_OBJECTS: Array<{ key: string; token: string }> = [
  { key: 'protocolo', token: 'protocolo' },
  { key: 'orcamento', token: 'orcamento' },
  { key: 'pedido', token: 'pedido' },
  { key: 'ato', token: 'ato' },
  { key: 'escritura', token: 'escritura' },
  { key: 'certidao', token: 'certidao' }
];

const PICK_VERB = '(acesse|acessar|localize|localizar|abra|abrir|selecione|escolha|reabra|estorne|estornar|cancele|cancelar|fature|faturar|consulte|pesquise|desbloqueie)';

/**
 * O manual manda trabalhar sobre um objeto criado em outra rotina ("localize o protocolo", "no Orçamento
 * Completo aberto")? Devolve a chave do objeto. Passo com caminho de menu nunca conta: rota ausente é ATT.
 */
export function detectExternalObject(parsed: ParsedRoutine, uptoStep: number): string | null {
  const texts = parsed.steps.filter(s => s.stepNumber <= uptoStep).map(s => `${s.rawText} ${(s.subItems || []).join(' ')}`);
  texts.push(parsed.descricao || '');
  const norm = normalizeText(texts.join(' . '));
  for (const obj of EXTERNAL_OBJECTS) {
    // Verbo + artigo + (até 1 palavra) + objeto: "localize o protocolo", "abra o orçamento completo". Citar o nome
    // de uma função ("Novo Pedido de Firmas") não é depender do objeto.
    const verbRe = new RegExp(`\\b${PICK_VERB}\\s+(o|a|os|as|um|uma)\\s+(\\w+\\s+)?${obj.token}s?\\b`);
    const ctxRe = obj.key === 'orcamento' ? /\b(no|na|do|da)\s+orcamento completo\b/ : null;
    if (verbRe.test(norm) || (ctxRe && ctxRe.test(norm))) {
      // A rotina que CRIA o próprio objeto (título de criação desse objeto) não depende dele
      if (startsWithCreateVerb(parsed.titulo) && normalizeText(parsed.titulo).includes(obj.token)) continue;
      return obj.key;
    }
  }
  return null;
}

/** Provedores (de qualquer módulo) de um objeto de negócio externo. */
export function findObjectProviders(consumerId: string, objectKey: string): ProviderMatch[] {
  const graph = buildDependencyGraph();
  const matches: ProviderMatch[] = [];
  for (const node of Object.values(graph.nodes)) {
    if (!node.creates || node.id === consumerId) continue;
    if (!node.entity.includes(objectKey)) continue;
    const verbFirst = startsWithCreateVerb(node.titulo) ? 1 : 0;
    matches.push({ id: node.id, titulo: node.titulo, modulo: node.modulo, shared: [objectKey], score: 2 + verbFirst });
  }
  return matches.sort((a, b) => b.score - a.score || a.titulo.length - b.titulo.length).slice(0, 3);
}

export function writeGraphCache(): string {
  const graph = buildDependencyGraph(true);
  const out = path.join(config.rootDir, 'auditoria', 'cache', 'kb-dependency-graph.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(graph, null, 2), 'utf8');
  return out;
}

// `npx tsx src/kb-dependency-graph.ts [ID...]`: regenera o cache e imprime os provedores dos IDs dados
if (process.argv[1]?.endsWith('kb-dependency-graph.ts')) {
  const out = writeGraphCache();
  const g = buildDependencyGraph();
  const creators = Object.values(g.nodes).filter(n => n.creates).length;
  console.log(`[Grafo KB] ${Object.keys(g.nodes).length} rotinas, ${creators} de criação. Cache: ${out}`);
  for (const id of process.argv.slice(2)) {
    const n = g.nodes[id];
    if (!n) { console.log(`  ${id}: não encontrada`); continue; }
    const prov = findProviders(id, n.entity);
    console.log(`  ${id} (${n.titulo}) entidade=[${n.entity.join(', ')}] -> ${prov.map(p => `${p.id} (${p.shared.join('/')})`).join('; ') || 'sem provedor'}`);
  }
}
