/**
 * Classificador de Revisão Humana (ADR-021): decide, para uma rotina bloqueada, qual das 3 tags
 * (`[ATT]`, `[DDD]`, `[XRX]`) se aplica — ou se a causa é falha técnica (sem tag, rotina não auditada).
 *
 * Árvore de decisão única (a ordem importa; `[DDD]` é o último recurso):
 *   1. falha técnica (`other`)                            -> sem tag
 *   2. bloqueio por privilégio (`rbac`)                   -> [ATT]  (o manual cita recurso que a conta não vê)
 *   3. tela inoperante / ambiente / hardware              -> [DDD]  (Dependência de Ambiente/Hardware)
 *   4. grade vazia (evidência de tela):
 *        4a. rotina provedora no grafo do KB              -> [XRX]  + pré-requisitos
 *        4b. nenhuma rotina gera o dado                   -> [DDD]
 *   5. passo com caminho de menu ausente                  -> [ATT]  (rota nunca é dependência de dado)
 *   6. objeto criado em outra rotina + provedor no KB     -> [XRX]
 *   7. alvo ausente com a exploração esgotada             -> [ATT]
 *   8. efeito de gravação omitido pela Trava de Mutação   -> [DDD]
 */
import { buildDependencyGraph, consumerEntity, detectExternalObject, entityTokens, findObjectProviders, findProviders, type ProviderMatch } from './kb-dependency-graph.js';
import { hasNoData, isEmptyMessage } from './empty-state.js';
import { ENVIRONMENT_BLOCK_TYPE, REVIEW_TAGS } from './review-taxonomy.js';
import { MANUAL_OUTDATED_BLOCK_TYPE } from './rbac.js';
import type { EmptyStateEvidence, ParsedRoutine, ReviewStatus, RoutineBlockInfo } from './types.js';

export const EMPTY_DATA_BLOCK_TYPE = 'Dependência de Dados no Banco de Homologação (Grade Vazia)';
export const CROSS_ROUTINE_BLOCK_TYPE = 'Dependência Cruzada de Rotina';
export const DRY_RUN_DATA_BLOCK_TYPE = 'Dependência do Efeito de Gravação (Trava de Mutação)';

export interface ClassifyInput {
  parsed: ParsedRoutine;
  block: RoutineBlockInfo;
  /** Passo onde a rotina bloqueou */
  blockedStep?: number;
  /** O passo bloqueado cita um caminho de menu (`A > B > C`) */
  blockedStepHasMenuPath?: boolean;
  /** Estado vazio da tela do bloqueio (leitura ao vivo + toasts capturados) */
  emptyState?: EmptyStateEvidence | null;
  /** Resultado do auto-seed na rotina, quando tentado */
  seed?: { attempted: boolean; reason?: string; disabled?: boolean };
}

export interface Classification {
  /** `null` = falha técnica: sem tag, sem pasta de revisão */
  status: ReviewStatus | null;
  block: RoutineBlockInfo;
}

const list = (providers: ProviderMatch[]) => providers.map(p => `${p.id} — ${p.titulo}`);

function describeEmpty(state: EmptyStateEvidence): string {
  const parts: string[] = [];
  if (state.emptyGrid) parts.push(`grade com ${state.headers.length} coluna(s) visível(is) (${state.headers.slice(0, 6).join(', ')}) e 0 linhas de dados`);
  if (state.toastText) parts.push(`mensagem da tela: "${state.toastText}"`);
  const blocked = state.disabledControls.filter(d => d.label).slice(0, 4);
  if (blocked.length > 0) {
    parts.push(`controles inativos: ${blocked.map(d => `"${d.label}"${d.hint ? ` (${d.hint})` : ''}`).join(', ')}`);
  }
  if (state.prefilter) {
    parts.push(`pré-filtro automático tentado antes de declarar a grade vazia: ${state.prefilter.reason}`);
  }
  return parts.join('; ');
}

export function classifyBlock(input: ClassifyInput): Classification {
  const { parsed, block } = input;
  const step = input.blockedStep ?? 0;
  const state = input.emptyState ?? undefined;

  // 1. Falha técnica: nenhuma tag
  if (block.kind === 'other') return { status: null, block };

  // 2. Privilégio: o manual cita um recurso que o perfil da conta não enxerga
  if (block.kind === 'rbac') return { status: 'atualizacao_editorial', block };

  // 3. Ambiente/hardware (tela inoperante, hardware externo)
  if (block.kind === 'screen_error' || block.kind === 'environment') {
    return {
      status: 'dependencia_dados_banco',
      block: { ...block, kind: block.kind, tipo: block.kind === 'environment' ? ENVIRONMENT_BLOCK_TYPE : block.tipo }
    };
  }

  // 4. Grade vazia. Rotina que CRIA registros (título de criação) não depende dos que já existem: a grade vazia
  //    não é a causa do bloqueio; o alvo ausente segue para as regras 5-7.
  const isCreator = !!buildDependencyGraph().nodes[parsed.id]?.creates;
  if (!isCreator && state && hasNoData(state) && state.emptyGrid) {
    const evidence = describeEmpty(state);
    const entity = consumerEntity(parsed, [...state.headers, state.toastText || '']);
    const sameModule = findProviders(parsed.id, entity, { sameModuleOnly: true });
    const providers = sameModule.length > 0 ? sameModule : findProviders(parsed.id, entity);
    const seedNote = input.seed?.attempted
      ? ` O auto-seed foi tentado e não concluiu: ${input.seed.reason || 'motivo não informado'}.`
      : state.addButton
        ? input.seed?.disabled
          ? ` Há botão "${state.addButton.label}" na tela, mas o auto-seed estava desligado nesta execução.`
          : ` Há botão "${state.addButton.label}" na tela, mas a rotina não consulta registros e o seed não foi necessário.`
        : ' Não existe botão Adicionar/Novo na tela.';

    if (providers.length > 0) {
      return {
        status: 'dependencia_cruzada_rotina',
        block: {
          kind: 'cross_routine',
          tipo: CROSS_ROUTINE_BLOCK_TYPE,
          motivo: `No passo ${step}, a tela está sem dados (${evidence}).${seedNote} Outra rotina do sistema gera esses registros: ${list(providers).join('; ')}.`,
          roteiro: [
            ...providers.map(p => `Executar antes a rotina ${p.id} (${p.titulo}) para criar o registro necessário.`),
            `Reexecutar a auditoria da rotina ${parsed.id}.`
          ],
          prerequisites: providers.map(p => p.id),
          emptyState: state
        }
      };
    }
    return {
      status: 'dependencia_dados_banco',
      block: {
        kind: 'empty_data',
        tipo: EMPTY_DATA_BLOCK_TYPE,
        motivo: `No passo ${step}, a validação não pôde prosseguir: ${evidence}.${seedNote} Nenhuma rotina do KB cria esses registros.`,
        roteiro: [
          'Equipe de Produtos: popular o banco de homologação com ao menos um registro nesta tela.',
          `Reexecutar a auditoria da rotina ${parsed.id}.`
        ],
        emptyState: state
      }
    };
  }

  // 5. Caminho de menu ausente: rota desatualizada, nunca dependência
  if (input.blockedStepHasMenuPath) return { status: 'atualizacao_editorial', block };

  // 8. Gravação omitida pela Trava de Mutação: se a grade já tem registros, não é dependência de banco ([DDD]),
  //    mas sim validação editorial parcial / ajuste de UI sob dry-run ([ATT], ex.: M-40.0).
  if (block.kind === 'dry_run_dependent') {
    if (state && !state.emptyGrid && state.headers.length > 0) {
      return {
        status: 'atualizacao_editorial',
        block: {
          ...block,
          tipo: MANUAL_OUTDATED_BLOCK_TYPE,
          motivo:
            `${block.motivo} Como a grade já possui registros carregados, o comportamento observado após o dry-run decorre de diferença editorial/UI e não de falta de dados.`
        }
      };
    }
    return { status: 'dependencia_dados_banco', block: { ...block, tipo: block.tipo || DRY_RUN_DATA_BLOCK_TYPE } };
  }

  // 6. Objeto criado por outra rotina
  const object = step > 0 ? detectExternalObject(parsed, step) : null;
  if (object) {
    const providers = findObjectProviders(parsed.id, object);
    if (providers.length > 0) {
      return {
        status: 'dependencia_cruzada_rotina',
        block: {
          kind: 'cross_routine',
          tipo: CROSS_ROUTINE_BLOCK_TYPE,
          motivo: `O manual trabalha sobre ${object === 'orcamento' ? 'um orçamento' : `um ${object}`} que precisa existir antes (criado em outra rotina) e o alvo do passo ${step} não estava na tela. Rotinas que o criam: ${list(providers).join('; ')}.`,
          roteiro: [
            ...providers.map(p => `Executar antes a rotina ${p.id} (${p.titulo}).`),
            `Com o ${object} aberto, reexecutar a auditoria da rotina ${parsed.id}.`
          ],
          prerequisites: providers.map(p => p.id)
        }
      };
    }
  }

  // 7. Alvo ausente com a exploração esgotada
  return { status: 'atualizacao_editorial', block };
}

/** Tag e rótulo para logs. */
export const describeStatus = (s: ReviewStatus) => `[${REVIEW_TAGS[s].tag}] ${REVIEW_TAGS[s].label}`;

/** Re-exportado para o relatório: a mensagem de tela é "de vazio"? */
export { isEmptyMessage, entityTokens };
