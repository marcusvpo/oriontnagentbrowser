/**
 * Taxonomia de Revisão Humana (ADR-021): fonte única das 3 tags que substituem o `[!!!]` genérico.
 * Todo módulo que precise do prefixo de pasta, do rótulo ou do status usa este arquivo.
 */
import type { ReviewStatus, RoutineAuditStatus } from './types.js';

export type ReviewTag = 'ATT' | 'DDD' | 'XRX';

export interface ReviewTagMeta {
  tag: ReviewTag;
  /** Prefixo de pasta/arquivo, com o espaço final: `[ATT] ` */
  prefix: string;
  label: string;
  /** Quem age sobre a rotina */
  owner: string;
  description: string;
}

export const REVIEW_TAGS: Record<ReviewStatus, ReviewTagMeta> = {
  atualizacao_editorial: {
    tag: 'ATT',
    prefix: '[ATT] ',
    label: 'Atualização editorial',
    owner: 'Equipe editorial (manual)',
    description:
      'O passo a passo cita tela, caminho, botão ou campo que não existe mais na versão atual; as rotas e os gatilhos reveladores foram esgotados.'
  },
  dependencia_dados_banco: {
    tag: 'DDD',
    prefix: '[DDD] ',
    label: 'Dependência de dados',
    owner: 'Equipe de Produtos (banco de homologação)',
    description:
      'A validação está bloqueada por falta de registros no banco de homologação (ou por dependência de ambiente/hardware) e nenhuma rotina do sistema gera esses dados.'
  },
  dependencia_cruzada_rotina: {
    tag: 'XRX',
    prefix: '[XRX] ',
    label: 'Dependência cruzada',
    owner: 'Auditoria (ordem de execução)',
    description: 'A rotina depende da execução prévia de outra rotina que cria os registros ou estados necessários.'
  }
};

export const REVIEW_STATUSES = Object.keys(REVIEW_TAGS) as ReviewStatus[];

/** Casa o prefixo `[ATT] `, `[DDD] ` ou `[XRX] ` de uma pasta/arquivo de auditoria. */
export const REVIEW_PREFIX_RE = /^\[(ATT|DDD|XRX)\]\s*/;

/** Prefixo legado, aposentado pela ADR-021: não pode mais existir no acervo. */
export const LEGACY_PREFIX_RE = /^\[!!!\]\s*/;

/** Remove qualquer prefixo de revisão (novo ou legado) de um nome de pasta. */
export function stripReviewPrefix(name: string): string {
  return name.replace(REVIEW_PREFIX_RE, '').replace(LEGACY_PREFIX_RE, '');
}

export function isReviewStatus(status: string | undefined | null): status is ReviewStatus {
  return !!status && Object.prototype.hasOwnProperty.call(REVIEW_TAGS, status);
}

export function reviewPrefix(status: RoutineAuditStatus | string | undefined | null): string {
  return isReviewStatus(status) ? REVIEW_TAGS[status].prefix : '';
}

/** Status correspondente à tag da pasta (`[DDD] M-40.0-...` -> `dependencia_dados_banco`), se houver. */
export function statusFromPrefix(name: string): ReviewStatus | null {
  const tag = name.match(REVIEW_PREFIX_RE)?.[1];
  if (!tag) return null;
  return REVIEW_STATUSES.find(s => REVIEW_TAGS[s].tag === tag) ?? null;
}

/** Texto do cabeçalho do bloco de alerta do `-revisado.md` (o sync lê só as linhas abaixo dele). */
export function reviewHeadline(status: ReviewStatus): string {
  return `ROTINA QUE REQUER REVISÃO HUMANA ([${REVIEW_TAGS[status].tag}])`;
}

/** Tipos de bloqueio por ambiente/hardware: viram `[DDD]` (ADR-021). */
export const ENVIRONMENT_BLOCK_TYPE = 'Dependência de Ambiente/Hardware';
