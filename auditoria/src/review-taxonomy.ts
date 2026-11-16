/**
 * Taxonomia de Revisão Humana (ADR-021, ampliada pela ADR-024): fonte única das tags que substituem o
 * `[!!!]` genérico. Todo módulo que precise do prefixo de pasta, do rótulo ou do status usa este arquivo.
 *
 * ADR-024: entra a tag `[CCC]` (comunicação/portal externo) e uma rotina passa a poder carregar VÁRIAS tags
 * (`[ATT][CCC]`), sempre na ordem canônica `ATT, CCC, DDD, XRX` e sem espaço entre os colchetes.
 */
import type { ReviewStatus, RoutineAuditStatus } from './types.js';

export type ReviewTag = 'ATT' | 'CCC' | 'DDD' | 'XRX';

export interface ReviewTagMeta {
  tag: ReviewTag;
  /** Prefixo de pasta/arquivo de tag única, com o espaço final: `[ATT] ` */
  prefix: string;
  label: string;
  /** Quem age sobre a rotina */
  owner: string;
  description: string;
  /** `true`: a rotina não pôde ser validada até o fim (texto original preservado, sem notas de tela) */
  blocking: boolean;
}

export const REVIEW_TAGS: Record<ReviewStatus, ReviewTagMeta> = {
  atualizacao_editorial: {
    tag: 'ATT',
    prefix: '[ATT] ',
    label: 'Atualização editorial',
    owner: 'Equipe editorial (manual)',
    description:
      'O passo a passo cita tela, caminho, botão ou campo que não existe mais na versão atual; as rotas e os gatilhos reveladores foram esgotados.',
    blocking: true
  },
  comunicacao_externa: {
    tag: 'CCC',
    prefix: '[CCC] ',
    label: 'Comunicação externa',
    owner: 'Equipe de Produtos / validação humana do portal externo',
    description:
      'Parte do passo a passo ocorre em portal ou serviço externo ao Orion TN (SISCOAF, e-Notariado, CENSEC, CRC, CNB, Receita Federal...). Essas etapas não são executadas nem fotografadas; as etapas do Orion TN são auditadas normalmente.',
    blocking: false
  },
  dependencia_dados_banco: {
    tag: 'DDD',
    prefix: '[DDD] ',
    label: 'Dependência de dados',
    owner: 'Equipe de Produtos (banco de homologação)',
    description:
      'A validação está bloqueada por falta de registros no banco de homologação (ou por dependência de ambiente/hardware) e nenhuma rotina do sistema gera esses dados.',
    blocking: true
  },
  dependencia_cruzada_rotina: {
    tag: 'XRX',
    prefix: '[XRX] ',
    label: 'Dependência cruzada',
    owner: 'Auditoria (ordem de execução)',
    description: 'A rotina depende da execução prévia de outra rotina que cria os registros ou estados necessários.',
    blocking: true
  }
};

export const REVIEW_STATUSES = Object.keys(REVIEW_TAGS) as ReviewStatus[];

/** Ordem canônica das tags no nome da pasta/arquivo e em `review_tags`. */
export const REVIEW_TAG_ORDER: readonly ReviewTag[] = ['ATT', 'CCC', 'DDD', 'XRX'];

/** Precedência para eleger o status principal: tags bloqueantes primeiro, `[CCC]` (informativa) por último. */
const PRIMARY_PRECEDENCE: readonly ReviewTag[] = ['ATT', 'DDD', 'XRX', 'CCC'];

const TAG_TO_STATUS = Object.fromEntries(REVIEW_STATUSES.map(s => [REVIEW_TAGS[s].tag, s])) as Record<ReviewTag, ReviewStatus>;

/** Casa o grupo de prefixos `[ATT] `, `[ATT][CCC] `, `[ATT] [CCC] ` etc. de uma pasta/arquivo de auditoria. */
export const REVIEW_PREFIX_RE = /^(?:\[(?:ATT|CCC|DDD|XRX)\]\s*)+/;

/** Prefixo legado, aposentado pela ADR-021: não pode mais existir no acervo. */
export const LEGACY_PREFIX_RE = /^\[!!!\]\s*/;

/** Remove qualquer prefixo de revisão (novo, multi-tag ou legado) de um nome de pasta. */
export function stripReviewPrefix(name: string): string {
  return name.replace(LEGACY_PREFIX_RE, '').replace(REVIEW_PREFIX_RE, '');
}

export function isReviewStatus(status: string | undefined | null): status is ReviewStatus {
  return !!status && Object.prototype.hasOwnProperty.call(REVIEW_TAGS, status);
}

/** Status que interrompe a auditoria (`[ATT]`/`[DDD]`/`[XRX]`): texto 100% original, sem notas de tela. `[CCC]` não bloqueia. */
export function isBlockingReviewStatus(status: string | undefined | null): status is ReviewStatus {
  return isReviewStatus(status) && REVIEW_TAGS[status].blocking;
}

export function tagOfStatus(status: ReviewStatus): ReviewTag {
  return REVIEW_TAGS[status].tag;
}

export function statusOfTag(tag: ReviewTag): ReviewStatus {
  return TAG_TO_STATUS[tag];
}

/** Normaliza uma lista de tags: remove duplicatas e desconhecidas e põe na ordem canônica. */
export function normalizeReviewTags(tags: ReadonlyArray<string | undefined | null> | undefined | null): ReviewTag[] {
  const wanted = new Set((tags || []).map(t => String(t ?? '').replace(/[\[\]\s]/g, '').toUpperCase()));
  return REVIEW_TAG_ORDER.filter(t => wanted.has(t));
}

/** Tags de uma rotina a partir do status principal e das tags adicionais (ex.: `[CCC]` junto de um bloqueio). */
export function reviewTagsFor(status: RoutineAuditStatus | string | undefined | null, extra: ReadonlyArray<ReviewTag> = []): ReviewTag[] {
  return normalizeReviewTags([...(isReviewStatus(status) ? [REVIEW_TAGS[status].tag] : []), ...extra]);
}

/** Prefixo canônico de pasta/arquivo para um conjunto de tags: `[ATT][CCC] ` (vazio sem tags). */
export function reviewTagsPrefix(tags: ReadonlyArray<string | undefined | null>): string {
  const ordered = normalizeReviewTags(tags);
  return ordered.length > 0 ? `${ordered.map(t => `[${t}]`).join('')} ` : '';
}

/** Prefixo de pasta de uma rotina: status principal + tags adicionais (ADR-024). */
export function reviewPrefix(status: RoutineAuditStatus | string | undefined | null, extra: ReadonlyArray<ReviewTag> = []): string {
  return reviewTagsPrefix(reviewTagsFor(status, extra));
}

/** Tags presentes no prefixo de uma pasta (`[ATT][CCC] C-...` -> `['ATT', 'CCC']`), na ordem canônica. */
export function tagsFromPrefix(name: string): ReviewTag[] {
  const prefix = name.match(REVIEW_PREFIX_RE)?.[0] ?? '';
  return normalizeReviewTags(Array.from(prefix.matchAll(/\[(ATT|CCC|DDD|XRX)\]/g)).map(m => m[1]));
}

/** Status principal de um conjunto de tags: bloqueantes primeiro (`ATT`, `DDD`, `XRX`), `CCC` só quando sozinha. */
export function primaryStatusOf(tags: ReadonlyArray<string | undefined | null>): ReviewStatus | null {
  const set = new Set(normalizeReviewTags(tags));
  const first = PRIMARY_PRECEDENCE.find(t => set.has(t));
  return first ? statusOfTag(first) : null;
}

/** Status principal correspondente às tags da pasta (`[ATT][CCC] C-...` -> `atualizacao_editorial`), se houver. */
export function statusFromPrefix(name: string): ReviewStatus | null {
  return primaryStatusOf(tagsFromPrefix(name));
}

/** Rótulo legível das tags: `[ATT][CCC]`. */
export function describeTags(tags: ReadonlyArray<string | undefined | null>): string {
  return normalizeReviewTags(tags)
    .map(t => `[${t}]`)
    .join('');
}

/** Texto do cabeçalho do bloco de alerta do `-revisado.md` (o sync lê só as linhas abaixo dele). */
export function reviewHeadline(status: ReviewStatus, tags?: ReadonlyArray<string>): string {
  return `ROTINA QUE REQUER REVISÃO HUMANA (${describeTags(tags && tags.length > 0 ? tags : [REVIEW_TAGS[status].tag])})`;
}

/** Tipos de bloqueio por ambiente/hardware: viram `[DDD]` (ADR-021). */
export const ENVIRONMENT_BLOCK_TYPE = 'Dependência de Ambiente/Hardware';

/** `auditoria_ui.tipo_bloqueio` informativo de uma rotina `[CCC]` sem bloqueio no Orion TN (ADR-024). */
export const EXTERNAL_PORTAL_BLOCK_TYPE = 'Dependência de Comunicação/Portal Externo';
