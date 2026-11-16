/**
 * Trava Segura de Mutação (ADR-018).
 *
 * Com `--dry-run-mutations`, o executor do KB localiza, mede, demarca e fotografa os comandos finais
 * de gravação/exclusão, mas não os aciona: o banco de homologação não é alterado pela auditoria.
 * Este módulo é o único lugar que decide o que é um comando de gravação. A Exploração Investigativa
 * usa a mesma decisão para nunca acionar um desses comandos como "gatilho revelador".
 */

const strip = (t: string) =>
  String(t || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

/** Comandos de gravação/exclusão citados nos manuais (ADR-016). */
export const DOCUMENTED_COMMIT_PATTERN = /\b(salvar|gravar|confirmar|concluir|excluir|inativar)\b/;

/**
 * Texto real de um controle que grava, exclui ou transmite dados. É mais amplo que a lista dos
 * manuais porque a Auto-Cura pode ter resolvido "Salvar" para um sinônimo da tela (ex.: "Aplicar").
 * Fonte única: o script injetado da Exploração Investigativa recebe `RESOLVED_COMMIT_SOURCE`.
 */
export const RESOLVED_COMMIT_SOURCE =
  '\\b(salvar|gravar|confirmar|concluir|excluir|inativar|remover|apagar|deletar|desativar|reativar|ativar|aplicar|finalizar|efetivar|enviar|transmitir|lavrar|estornar|encerrar)\\b';
const RESOLVED_COMMIT_PATTERN = new RegExp(RESOLVED_COMMIT_SOURCE);
/** Botões de confirmação de diálogo: só contam quando são o texto inteiro do controle. */
const CONFIRM_EXACT = new Set(['sim', 'ok']);

/** O nome citado no manual é um comando de gravação/exclusão? */
export function isDocumentedCommit(text: string | undefined): boolean {
  return !!text && DOCUMENTED_COMMIT_PATTERN.test(strip(text));
}

/** O texto real de um controle da tela é um comando de gravação/exclusão? */
export function isCommitLabel(text: string | undefined): boolean {
  const norm = strip(text || '');
  if (!norm) return false;
  return RESOLVED_COMMIT_PATTERN.test(norm) || CONFIRM_EXACT.has(norm);
}

export interface CommitProbe {
  /** Texto real do nó que receberia o clique */
  nodeText?: string;
  /** Rótulo alternativo do nó (`title`, `aria-label`, `value`) */
  nodeHint?: string;
  /** Alvo do manual que a Auto-Cura resolveu para este nó, quando houve cura */
  healedFrom?: string;
  /** Alvos da linha principal do passo (usados só quando o nó não tem texto próprio) */
  mainTargets?: string[];
}

/**
 * Decide se o clique prestes a ser dado é um comando de gravação. Em ordem:
 * 1. o texto real do nó (ou o seu rótulo alternativo) é um comando de gravação;
 * 2. o nó foi curado a partir de um alvo que o manual chama de Salvar/Concluir/Excluir...;
 * 3. o nó não tem texto próprio (botão de ícone) e o passo cita um comando de gravação.
 * Devolve o nome do comando para o relatório, ou `null` se o clique é seguro.
 */
export function detectCommitCommand(probe: CommitProbe): string | null {
  const clean = (t: string | undefined) => (t || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  if (isCommitLabel(probe.nodeText)) return clean(probe.nodeText).slice(0, 60);
  if (isCommitLabel(probe.nodeHint)) return clean(probe.nodeHint).slice(0, 60);
  if (isDocumentedCommit(probe.healedFrom)) return clean(probe.healedFrom);
  if (!clean(probe.nodeText) && !clean(probe.nodeHint)) {
    const cited = (probe.mainTargets || []).find(t => isDocumentedCommit(t) || isCommitLabel(t));
    if (cited) return clean(cited);
  }
  return null;
}
