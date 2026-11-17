import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';

/**
 * Sinônimos contextuais por rota (`location.hash`) descobertos pelo Raio-X das telas `[ATT]` (ADR-029, Cluster C)
 * e enriquecidos pela curadoria visual Set-of-Mark pós-lote (`visual:curate`, ADR-031).
 *
 * Módulo PURO na comparação, com leitura opcional de sinônimos curados em `auditoria/cache/curated-route-synonyms.json`.
 * Cada entrada diz: na tela de rota X, o rótulo que o manual cita (`documented`) é, por função
 * semântica, o controle/aba que a tela real chama de `real`. Evidência de cada entrada: o campo/aba reais foram
 * lidos ao vivo (`diagnostico_tela_att` ou sondagem de leitura) e o tipo do controle é compatível.
 *
 * NADA aqui é evidência de tela: o SmartLocator só aceita um sinônimo se o nó `real` for MEDIDO ao vivo no DOM
 * (`getBoundingClientRect()`) na zona do passo; o texto do manual nunca é reescrito por isso (Evidência Estrita)
 * e a divergência vai para o `-revisado.md` para que o manual seja corrigido.
 */

export type RouteSynonymKind = 'field' | 'tab' | 'button' | 'section';

export interface RouteLabelSynonym {
  /** Rota sem parâmetros numéricos (ver `routeKey`) */
  route: string;
  /** Rótulo citado pelo manual */
  documented: string;
  /** Rótulos reais equivalentes, todos exigidos na tela (`RG/CNH` -> RG e CNH) */
  real: string[];
  kind: RouteSynonymKind;
  /** Por que a equivalência é inequívoca dentro da tela */
  evidence: string;
}

const CURATED_ROUTE_SYNONYMS_FILE = () =>
  path.join(config.rootDir, 'auditoria', 'cache', 'curated-route-synonyms.json');

let curatedRouteSynonymsCache: RouteLabelSynonym[] | null = null;

export function getCuratedRouteSynonyms(): RouteLabelSynonym[] {
  if (curatedRouteSynonymsCache) return curatedRouteSynonymsCache;
  const file = CURATED_ROUTE_SYNONYMS_FILE();
  if (fs.existsSync(file)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(parsed)) {
        curatedRouteSynonymsCache = parsed;
        return curatedRouteSynonymsCache;
      }
    } catch {}
  }
  curatedRouteSynonymsCache = [];
  return curatedRouteSynonymsCache;
}

/**
 * Persiste idempotentemente um sinônimo contextual por rota aprovado pela curadoria visual (`visual:curate`, ADR-031).
 */
export function upsertCuratedRouteSynonym(entry: RouteLabelSynonym): RouteLabelSynonym[] {
  const normRoute = routeKey(entry.route);
  const normDoc = normalize(entry.documented);
  if (!normRoute || !normDoc || !Array.isArray(entry.real) || entry.real.length === 0) {
    return getCuratedRouteSynonyms();
  }
  const current = [...getCuratedRouteSynonyms()];
  const existingIdx = current.findIndex(
    s => routeKey(s.route) === normRoute && normalize(s.documented) === normDoc
  );
  const normalizedEntry: RouteLabelSynonym = {
    ...entry,
    route: normRoute
  };
  if (existingIdx >= 0) {
    current[existingIdx] = normalizedEntry;
  } else {
    current.push(normalizedEntry);
  }
  curatedRouteSynonymsCache = current;
  const file = CURATED_ROUTE_SYNONYMS_FILE();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(current, null, 2), 'utf8');
  return current;
}

export const ROUTE_LABEL_SYNONYMS: RouteLabelSynonym[] = [
  // Tela Configurações > Parametrizações: o submenu legado virou abas laterais com nomes abreviados
  { route: '#/configuracoes', documented: 'Parâmetros gerais', real: ['Geral'], kind: 'tab', evidence: 'aba "Geral" é a primeira aba de Parametrizações' },
  { route: '#/configuracoes', documented: 'Sequências automáticas', real: ['Sequência'], kind: 'tab', evidence: 'única aba de numeração/sequência da tela' },
  { route: '#/configuracoes', documented: 'Comunicações externas', real: ['Comunicações'], kind: 'tab', evidence: 'única aba de comunicações da tela' },
  { route: '#/configuracoes', documented: 'Atalhos do teclado', real: ['Painel de atalhos'], kind: 'tab', evidence: 'única aba de atalhos da tela' },
  { route: '#/configuracoes', documented: 'Pedido de firmas e Termo de comparecimento', real: ['Pedido de firmas'], kind: 'tab', evidence: 'única aba de pedido de firmas da tela' },
  { route: '#/configuracoes', documented: 'Pedido de certidão', real: ['Certidão'], kind: 'tab', evidence: 'única aba de certidão da tela' },
  // Cadastro de cartão de assinatura
  { route: '#/ficha/cadastrar', documented: 'Nome completo', real: ['Nome'], kind: 'field', evidence: 'campo "Nome" da seção Dados pessoais (o "Nome social" é outro campo)' },
  { route: '#/ficha/cadastrar', documented: 'CPF', real: ['CPF ou CIN'], kind: 'field', evidence: 'o campo de CPF passou a se chamar "CPF ou CIN"' },
  { route: '#/ficha/cadastrar', documented: 'RG/CNH', real: ['RG', 'CNH'], kind: 'field', evidence: 'o manual agrupa dois campos que a tela separa: "RG" e "CNH"' },
  // Cadastro de produto (Orion Estoque)
  { route: '#/produto/cadastrar', documented: 'Nome do Produto', real: ['Descrição'], kind: 'field', evidence: 'o nome do produto é o campo "Descrição" (único campo de texto de identificação da tela)' },
  // Cadastro de natureza: a busca por descrição é o campo de texto "Natureza" do filtro
  { route: '#/natureza', documented: 'Pesquisar por descrição', real: ['Natureza'], kind: 'field', evidence: 'único campo de texto do filtro; os demais são seleções e marcação' }
];

const normalize = (text: string): string =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** `#/usuario/alterar/1?x=1` -> `#/usuario/alterar`; `#/ficha/cadastrar` fica igual. */
export function routeKey(hash: string | undefined | null): string {
  const raw = String(hash ?? '').split('?')[0].replace(/\/+$/, '');
  return raw
    .split('/')
    .filter((seg, i, all) => i < 2 || !(/^\d+$/.test(seg) && i === all.length - 1))
    .join('/');
}

/** Sinônimos contextuais do rótulo documentado na rota atual (vazio se não há). */
export function routeSynonymsFor(hash: string | undefined | null, documented: string): RouteLabelSynonym[] {
  const key = routeKey(hash);
  if (!key) return [];
  const want = normalize(documented.replace(/\*\*/g, ''));
  const combined = [...ROUTE_LABEL_SYNONYMS, ...getCuratedRouteSynonyms()];
  return combined.filter(s => s.route === key && normalize(s.documented) === want);
}

/** Rótulos reais que a tabela espera numa rota (para a mineração conferir contra o Raio-X). */
export function routeSynonymRoutes(): string[] {
  const combined = [...ROUTE_LABEL_SYNONYMS, ...getCuratedRouteSynonyms()];
  return Array.from(new Set(combined.map(s => s.route)));
}
