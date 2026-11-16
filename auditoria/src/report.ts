import { lockStepText } from './evidence.js';
import { config } from './config.js';
import type { ReauditHistoryEntry } from './prior-audit.js';
import type { EditorialDivergence } from './screen-snapshot.js';
import {
  EXTERNAL_PORTAL_BLOCK_TYPE,
  describeTags,
  isBlockingReviewStatus,
  isReviewStatus,
  reviewHeadline,
  reviewTagsFor,
  type ReviewTag
} from './review-taxonomy.js';
import { EXTERNAL_STEP_MARKER, externalStepCallout } from './step-scope.js';
import type {
  AuditStepResult,
  ParsedRoutine,
  PrivilegeGateResult,
  ReviewStatus,
  RoutineAuditStatus,
  RoutineBlockInfo,
  SeededRecord,
  SmartLocatorDivergence
} from './types.js';

/**
 * Gerador único do `-revisado.md` (ADR-017), usado pelo executor do KB e pelo runner do manifesto.
 *
 * O texto de cada passo parte SEMPRE do manual original e só recebe as substituições que passam pela
 * Trava de Evidência (`lockStepText`). Numa rotina `[ATT]`/`[DDD]`/`[XRX]` (ADR-021), nenhuma substituição é
 * aplicada: o texto sai intacto e as divergências comprovadas aparecem apenas como observações.
 */

export type { RoutineAuditStatus };

export interface EvidencePrint {
  print: string;
  label: string;
  blockedMessage?: string;
}

export interface RevisedReportInput {
  parsed: ParsedRoutine;
  /** Resultados por passo do manual (executor do KB). Vazio no modo manifesto. */
  results: AuditStepResult[];
  divergences: SmartLocatorDivergence[];
  status: RoutineAuditStatus;
  block?: RoutineBlockInfo;
  gate?: PrivilegeGateResult;
  workerId?: string;
  ambiente?: string;
  /**
   * Modo manifesto: capturas que não correspondem 1:1 aos passos do manual. São listadas como
   * evidências visuais, e o passo a passo é o do manual, sem alterações.
   */
  evidencePrints?: EvidencePrint[];
  /** Alvos em negrito do manual sem evidência em nenhuma tela capturada (modo manifesto) */
  unseenTargets?: string[];
  /** A rotina foi auditada com a Trava Segura de Mutação ativa (ADR-018) */
  dryRunMutations?: boolean;
  /** Divergências conceituais/editoriais comprovadas no DOM (ADR-020) */
  editorial?: EditorialDivergence[];
  /** Registros mock criados pelo auto-seed durante a rotina (ADR-021) */
  seededRecords?: SeededRecord[];
  /** Tags adicionais à do `status` (ADR-024), ex.: `['CCC']` junto de um bloqueio `[ATT]` */
  extraTags?: ReviewTag[];
  /**
   * Histórico de reauditoria (ADR-025): entradas anteriores mais a desta execução (a última). Ausente numa
   * primeira auditoria. Vai para `auditoria_ui.historico_reauditoria` (JSONB no Supabase, sem migration).
   */
  reauditHistory?: ReauditHistoryEntry[];
}

/** Todas as tags da rotina em ordem canônica: a do status principal mais as adicionais (ADR-024). */
export const tagsOfReport = (input: Pick<RevisedReportInput, 'status' | 'extraTags'>): ReviewTag[] =>
  reviewTagsFor(input.status, input.extraTags || []);

const EDITORIAL_TITLE = '**Divergência Conceitual/Editorial (Evidência de Tela):**';
const editorialNote = (e: EditorialDivergence) => `> [!NOTE] ${EDITORIAL_TITLE} ${e.message}`;

const TRIGGER_KIND_LABEL: Record<string, string> = {
  tab: 'aba',
  accordion: 'painel recolhido',
  button: 'botão',
  checkbox: 'caixa de seleção',
  radio: 'opção',
  subportal_link: 'link de sub-portal'
};
const TRIGGER_OUTCOME_LABEL: Record<string, string> = {
  subportal_opened: 'subportal_aberto',
  revealed: 'revelou_o_alvo',
  no_effect: 'sem_efeito',
  screen_error: 'tela_com_erro',
  not_actionable: 'nao_acionavel'
};

const q = (s: string) => `'${String(s).replace(/'/g, "''")}'`;
const qList = (items: string[]) => `[${items.map(q).join(', ')}]`;

/** `auditoria_ui.historico_reauditoria` (ADR-025): uma entrada por reauditoria, da mais antiga à mais nova. */
function historyYamlLines(history: ReauditHistoryEntry[]): string[] {
  const lines = ['  historico_reauditoria:'];
  for (const e of history) {
    lines.push(`    - data: ${q(e.data)}`);
    lines.push(`      ambiente_anterior: ${q(e.ambiente_anterior)}`);
    lines.push(`      ambiente_atual: ${q(e.ambiente_atual)}`);
    lines.push(`      status_anterior: ${q(e.status_anterior)}`);
    lines.push(`      tags_anteriores: ${qList(e.tags_anteriores)}`);
    lines.push(`      status_atual: ${q(e.status_atual)}`);
    lines.push(`      tags_atuais: ${qList(e.tags_atuais)}`);
    lines.push(`      bloqueio_superado: ${e.bloqueio_superado === null ? 'null' : e.bloqueio_superado}`);
    if (e.bloqueio_anterior) {
      lines.push(`      bloqueio_anterior:`);
      if (e.bloqueio_anterior.passo !== undefined) lines.push(`        passo: ${e.bloqueio_anterior.passo}`);
      if (e.bloqueio_anterior.tipo) lines.push(`        tipo: ${q(e.bloqueio_anterior.tipo)}`);
      if (e.bloqueio_anterior.motivo) lines.push(`        motivo: ${q(e.bloqueio_anterior.motivo)}`);
    }
    if (e.bloqueio_atual) {
      lines.push(`      bloqueio_atual:`);
      if (e.bloqueio_atual.passo !== undefined) lines.push(`        passo: ${e.bloqueio_atual.passo}`);
      if (e.bloqueio_atual.tipo) lines.push(`        tipo: ${q(e.bloqueio_atual.tipo)}`);
    }
    if (e.curas_reaproveitadas.length > 0) {
      lines.push(`      curas_reaproveitadas:`);
      for (const c of e.curas_reaproveitadas) {
        lines.push(`        - passo: ${c.passo}`);
        lines.push(`          alvo: ${q(c.alvo)}`);
        lines.push(`          real: ${q(c.real)}`);
        lines.push(`          confirmada_ao_vivo: ${c.confirmada_ao_vivo}`);
        lines.push(`          usada_como_dica: ${c.usada_como_dica}`);
      }
    }
    lines.push(`      notas_editoriais_reconfirmadas: ${e.notas_editoriais_reconfirmadas}`);
    lines.push(`      notas_editoriais_nao_reconfirmadas: ${e.notas_editoriais_nao_reconfirmadas}`);
  }
  return lines;
}

/** Seção `#### Evolução da Reauditoria` (Antes → Depois) com a entrada MAIS RECENTE do histórico. */
function reauditSection(history: ReauditHistoryEntry[] | undefined): string {
  const e = history && history.length > 0 ? history[history.length - 1] : undefined;
  if (!e) return '';
  const tagText = (tags: string[]) => (tags.length > 0 ? tags.map(t => `[${t}]`).join('') : '(sem tag)');
  const out = [
    `#### Evolução da Reauditoria`,
    `* **Ambiente:** ${e.ambiente_anterior} → ${e.ambiente_atual}`,
    `* **Status:** ${tagText(e.tags_anteriores)} ${e.status_anterior} → ${tagText(e.tags_atuais)} ${e.status_atual}`
  ];
  if (e.bloqueio_anterior) {
    const b = e.bloqueio_anterior;
    const where = b.passo !== undefined ? `passo ${b.passo}` : 'passo não registrado';
    const outcome = e.bloqueio_superado ? '**superado**' : '**mantido**';
    const now = e.bloqueio_atual ? ` (agora: ${e.bloqueio_atual.passo !== undefined ? `passo ${e.bloqueio_atual.passo}` : 'passo não registrado'}${e.bloqueio_atual.tipo ? `, ${e.bloqueio_atual.tipo}` : ''})` : '';
    out.push(`* **Bloqueio anterior:** ${where}${b.tipo ? ` — ${b.tipo}` : ''}${b.motivo ? `: ${b.motivo}` : ''} → ${outcome}${now}`);
  }
  for (const c of e.curas_reaproveitadas) {
    const how = c.confirmada_ao_vivo
      ? `reconfirmada ao vivo nesta execução ${c.usada_como_dica ? '(a dica anterior localizou o nó)' : '(medida de novo pelo próprio motor, sem depender da dica)'}`
      : 'não reconfirmada nesta execução (a dica não foi usada)';
    out.push(`* **Cura reaproveitada (passo ${c.passo}):** "${c.alvo}" → "${c.real}" — ${how}`);
  }
  if (e.notas_editoriais_reconfirmadas + e.notas_editoriais_nao_reconfirmadas > 0) {
    out.push(`* **Notas editoriais anteriores:** ${e.notas_editoriais_reconfirmadas} reconfirmada(s) ao vivo; ${e.notas_editoriais_nao_reconfirmadas} não reproduzida(s) nesta tela e, por isso, não mantida(s) no relatório.`);
  }
  return `\n${out.join('\n')}\n`;
}

function divergenceNote(d: SmartLocatorDivergence, applied: boolean): string {
  const conf = `${Math.round(d.confidence * 100)}% — ${d.reason}`;
  const tail = applied ? '' : ' O texto do manual não foi alterado.';
  switch (d.resolutionLayer) {
    case 'menu_path_resolution':
      return `> [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"${d.documentedTarget}"**, porém na versão atual do Orion TN a tela fica em **"${d.actualElementText}"** (confiança: ${conf}).${tail}`;
    case 'target_not_found':
      return `> [!WARNING] **Alvo sem evidência na tela:** O manual cita **"${d.documentedTarget}"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.`;
    case 'permission_blocked':
      return `> [!WARNING] **Alvo bloqueado para o perfil logado:** **"${d.documentedTarget}"** existe no sistema, mas a aplicação o bloqueia para a conta de homologação (${d.reason}).`;
    case 'investigative_reveal': {
      const kind = TRIGGER_KIND_LABEL[d.reveal?.kind || ''] || 'gatilho';
      const where = d.reveal?.printFile ? ` O gatilho está demarcado em "${d.reveal.printFile}" e o elemento revelado, na sub-captura seguinte.` : '';
      return `> [!NOTE] **Sub-passo descoberto (Exploração Investigativa):** **"${d.documentedTarget}"** não estava visível na tela inicial do passo; passou a ser exibido após acionar ${kind === 'aba' ? 'a' : 'o(a)'} ${kind} **"${d.reveal?.label || ''}"**, medido ao vivo na tela.${where}${tail}`;
    }
    default:
      return `> [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, ${d.resolutionLayer}):** O manual cita **"${d.documentedTarget}"**, porém na tela atual do Orion TN o elemento se chama **"${d.actualElementText}"** (confiança: ${conf}).${tail}`;
  }
}

function buildYaml(input: RevisedReportInput, printsCount: number, appliedDivergences: Set<SmartLocatorDivergence>): string {
  const { parsed, status, block, gate, divergences } = input;
  const lines = [
    `id: ${parsed.id}`,
    `titulo: ${q(parsed.titulo)}`,
    `modulo: ${parsed.modulo}`,
    `secao: ${parsed.secao}`,
    `auditoria_ui:`,
    `  data_execucao: '${new Date().toISOString().split('T')[0]}'`,
    `  status: ${status}`
  ];
  // ADR-024: todas as tags da rotina, na ordem canônica (o prefixo da pasta repete exatamente esta lista)
  const tags = tagsOfReport(input);
  if (tags.length > 0) lines.push(`  review_tags: ${qList(tags)}`);
  lines.push(`  carga: ${parsed.workloadType || 'read_only'}`);
  if (input.workerId) lines.push(`  worker_id: ${q(input.workerId)}`);
  lines.push(`  versao_homologacao: ${q(config.envVersion)}`);
  if (input.ambiente) lines.push(`  ambiente: ${q(input.ambiente)}`);
  if (block) lines.push(`  tipo_bloqueio: ${q(block.tipo)}`);
  const externalSteps = parsed.steps.filter(s => s.scope === 'external_portal');
  if (externalSteps.length > 0) {
    if (!block) lines.push(`  tipo_bloqueio: ${q(EXTERNAL_PORTAL_BLOCK_TYPE)}`);
    // ADR-024: passos fora do Orion TN, sem print por desenho (o validador não os cobra)
    lines.push(`  etapas_externas:`);
    for (const s of externalSteps) {
      lines.push(`    - passo: ${s.stepNumber}`);
      lines.push(`      portal: ${q(s.externalPortal || 'portal externo')}`);
    }
  }
  if (block?.prerequisites && block.prerequisites.length > 0) lines.push(`  rotinas_pre_requisito: ${qList(block.prerequisites)}`);
  if (input.seededRecords && input.seededRecords.length > 0) {
    lines.push(`  registros_mock_criados:`);
    for (const r of input.seededRecords) {
      lines.push(`    - passo: ${r.stepNumber}`);
      lines.push(`      rota: ${q(r.route)}`);
      lines.push(`      botao_cadastro: ${q(r.addButton)}`);
      lines.push(`      botao_gravacao: ${q(r.commitButton)}`);
      lines.push(`      linhas_na_grade_apos: ${r.rowsAfter}`);
      lines.push(`      campos: ${qList(r.fields.map(f => `${f.label}=${f.value}`))}`);
    }
  }
  lines.push(`  prints_geradas: ${printsCount}`);

  // Trava Segura de Mutação (ADR-018)
  if (input.dryRunMutations !== undefined) {
    lines.push(`  dry_run_mutations: ${input.dryRunMutations}`);
    const skipped = input.results.filter(r => r.executedAction?.via === 'dry-run');
    if (skipped.length > 0) {
      lines.push(`  comandos_de_gravacao_nao_acionados:`);
      for (const r of skipped) {
        lines.push(`    - passo: ${r.stepNumber}`);
        lines.push(`      comando: ${q(r.executedAction?.commitLabel || '')}`);
      }
    }
  }

  // Identidade da sessão e RBAC Gate (ADR-017/ADR-018)
  if (gate?.identity) {
    lines.push(`  sessao_usuario: ${q(gate.identity.login)}`);
    lines.push(`  sessao_perfil_pleno: ${gate.fullAccess}`);
  }
  if (gate?.requirement) {
    lines.push(`  rbac:`);
    lines.push(`    perfil_exigido: ${qList(gate.requirement.roles)}`);
    lines.push(`    origem_requisito: ${q(gate.requirement.sourceStep ? `passo ${gate.requirement.sourceStep}` : 'metadados')}`);
    lines.push(`    estado: ${gate.state}`);
    lines.push(`    atendido: ${gate.state === 'inconclusive' ? 'inconclusivo' : gate.satisfied}`);
    if (gate.fullAccessEvidence) lines.push(`    perfil_pleno_comprovado_por: ${q(gate.fullAccessEvidence)}`);
    if (gate.identity) {
      lines.push(`    sessao_usuario: ${q(gate.identity.login)}`);
      lines.push(`    sessao_cargo: ${q(gate.identity.position)}`);
      lines.push(`    sessao_perfis: ${qList(gate.identity.profiles)}`);
    }
  }

  // Exploração Investigativa pré-bloqueio (ADR-018)
  const explorations = input.results.filter(r => r.exploration);
  if (explorations.length > 0) {
    lines.push(`  exploracao_investigativa:`);
    for (const r of explorations) {
      const e = r.exploration!;
      lines.push(`    - passo: ${r.stepNumber}`);
      lines.push(`      alvos_ausentes: ${qList(e.missing)}`);
      lines.push(`      alvos_revelados: ${qList(e.revealed)}`);
      const openedSubportal = e.explored.some(t => t.outcome === 'subportal_opened');
      lines.push(`      resultado: ${e.revealed.length > 0 ? 'alvo_revelado' : openedSubportal ? 'subportal_aberto' : 'gatilhos_esgotados'}`);
      lines.push(`      gatilhos_na_tela: ${e.candidates}`);
      lines.push(`      seletores_sem_afinidade_descartados: ${e.selectorsWithoutAffinity}`);
      lines.push(`      estado_restaurado: ${e.stateRestored}`);
      if (e.explored.length > 0) {
        lines.push(`      gatilhos_testados:`);
        for (const t of e.explored) {
          lines.push(`        - tipo: ${t.kind}`);
          lines.push(`          rotulo: ${q(t.label)}`);
          lines.push(`          deduzido_do_dom: ${t.directed}`);
          lines.push(`          resultado: ${TRIGGER_OUTCOME_LABEL[t.outcome] || t.outcome}`);
        }
      }
    }
  }
  if (input.editorial && input.editorial.length > 0 && !isBlockingReviewStatus(status)) {
    lines.push(`  divergencias_editoriais:`);
    for (const e of input.editorial) {
      lines.push(`    - tipo: ${e.kind}`);
      if (e.stepNumber) lines.push(`      passo: ${e.stepNumber}`);
      lines.push(`      trecho_manual: ${q(e.manualExcerpt)}`);
      lines.push(`      evidencia_dom: ${q(e.domEvidence)}`);
    }
  }
  if (input.unseenTargets && input.unseenTargets.length > 0) {
    lines.push(`  alvos_sem_evidencia: ${qList(input.unseenTargets)}`);
  }
  if (divergences.length > 0) {
    lines.push(`  auto_cura:`);
    lines.push(`    acionada: true`);
    lines.push(`    divergencias_detectadas:`);
    for (const d of divergences) {
      lines.push(`      - passo: ${d.stepNumber}`);
      lines.push(`        alvo_documentado: ${q(d.documentedTarget)}`);
      lines.push(`        elemento_real: ${q(d.actualElementText || '(não localizado na tela)')}`);
      lines.push(`        camada: ${d.resolutionLayer}`);
      lines.push(`        confianca: ${d.confidence}`);
      lines.push(`        texto_alterado: ${appliedDivergences.has(d)}`);
      if (d.reveal) {
        const tb = d.reveal.evidence.box;
        lines.push(`        gatilho_revelador: ${q(`${d.reveal.kind} | ${d.reveal.label} | x=${tb.x}, y=${tb.y}, ${tb.width}x${tb.height}`)}`);
      }
      if (d.evidence) {
        const b = d.evidence.box;
        lines.push(`        evidencia: ${q(`${d.evidence.source} | ${d.evidence.matchedSelector} | x=${b.x}, y=${b.y}, ${b.width}x${b.height}`)}`);
      }
    }
  }
  if (input.reauditHistory && input.reauditHistory.length > 0) lines.push(...historyYamlLines(input.reauditHistory));
  return lines.join('\n');
}

export function buildRevisedRoutineDocument(input: RevisedReportInput): { content: string; lockViolations: string[] } {
  const { parsed, results, status, block } = input;
  // `[CCC]` sozinha não interrompe a auditoria: as etapas do Orion TN seguem validadas e com prints (ADR-024)
  const blocked = isBlockingReviewStatus(status);
  const tags = tagsOfReport(input);
  const manifestMode = !!input.evidencePrints;
  const appliedDivergences = new Set<SmartLocatorDivergence>();
  const lockViolations: string[] = [];
  let printsCount = input.evidencePrints?.length ?? 0;

  const stepsLines = parsed.steps
    .map((s, idx) => {
      // Por número do passo (não por posição): passos externos e bloqueios deixam lacunas na lista de resultados
      const stepRes = manifestMode ? undefined : results.find(r => r.stepNumber === s.stepNumber);
      const stepDivs = [
        ...(stepRes?.divergence ? [stepRes.divergence] : []),
        ...(stepRes?.targetDivergences || [])
      ];

      // Trava de Evidência: rotina bloqueada ou modo manifesto -> texto original intacto
      let text = s.rawText;
      if (stepRes && !blocked) {
        const locked = lockStepText(s.rawText, stepRes.validatedText, stepDivs);
        text = locked.text;
        locked.applied.forEach(d => appliedDivergences.add(d));
        for (const r of locked.rejected) {
          lockViolations.push(`Passo ${s.stepNumber}: ${r.reason}`);
        }
      }

      let out = `${s.stepNumber}. ${text}`;
      // ADR-024: passo em portal externo — texto original intacto, sem print, com o callout informativo
      if (s.scope === 'external_portal') out += `\n   ${externalStepCallout(s.externalPortal || 'portal externo')}`;
      const prints = stepRes?.printFiles || [];
      for (const p of prints) out += `\n   [aqui vai a print "${p}"]`;
      printsCount += prints.length;

      if (stepRes?.callouts && stepRes.callouts.length > 1) {
        out += `\n   > [!NOTE] **Demarcações na print:** ${stepRes.callouts.map(c => `(${c.index}) **${c.label}**`).join(' · ')}`;
      }
      for (const d of stepDivs) {
        out += `\n   ${divergenceNote(d, appliedDivergences.has(d))}`;
      }
      if (stepRes?.note) out += `\n   > [!NOTE] ${stepRes.note}`;
      if (stepRes?.implicitTargets && stepRes.implicitTargets.length > 0) {
        out += `\n   > [!NOTE] **Alvos implícitos demarcados (passo sem negrito):** ${stepRes.implicitTargets.map(t => `**${t}**`).join(', ')}. O texto do manual não foi alterado.`;
      }
      if (stepRes?.emptyState && (stepRes.emptyState.toastText || stepRes.emptyState.emptyGrid)) {
        const es = stepRes.emptyState;
        const bits = [
          es.toastText ? `mensagem da tela: "${es.toastText}"` : '',
          es.emptyGrid ? `grade vazia (${es.headers.slice(0, 6).join(', ')})` : ''
        ].filter(Boolean);
        out += `\n   > [!NOTE] **Tela sem dados (Evidência de Tela):** ${bits.join('; ')}.`;
      }
      if (stepRes?.seededRecord) {
        const sr = stepRes.seededRecord;
        out += `\n   > [!NOTE] **Registro mock de pré-requisito criado (AUDIT-MOCK):** a grade estava vazia; o agente usou **${sr.addButton}**, preencheu ${sr.fields.length} campo(s) e gravou com **${sr.commitButton}**. Linhas na grade depois: ${sr.rowsAfter < 0 ? 'sem grade' : sr.rowsAfter}.`;
      }
      if (!blocked) {
        for (const e of (input.editorial || []).filter(x => x.stepNumber === s.stepNumber)) {
          out += `\n   ${editorialNote(e)}`;
        }
        for (const h of stepRes?.helpTooltips || []) {
          const title = h.title && h.title !== h.anchorLabel ? `${h.title}: ` : '';
          out += `\n   > [!TIP] **Ajuda da tela — "${h.anchorLabel}":** ${title}"${h.text}"`;
        }
      }
      if (stepRes?.executedAction?.via === 'dry-run') {
        out += `\n   > [!NOTE] **Trava Segura de Mutação (dry-run):** o comando **${stepRes.executedAction.commitLabel}** foi localizado, medido e demarcado na print, mas o clique final foi omitido para não gravar no banco de homologação. A ação foi validada visualmente, sem efetivar a gravação.`;
      }
      if (stepRes?.status === 'blocked' && stepRes.errorMessage) {
        out += `\n   > [!WARNING] **Bloqueio de auditoria neste passo:** ${stepRes.errorMessage}`;
      }
      for (const sub of s.subItems || []) out += `\n   * ${sub}`;
      return out;
    })
    .join('\n');

  const obsText = parsed.observacoes.length > 0 ? '\n\n' + parsed.observacoes.map(o => `* **${o}**`).join('\n') : '';

  // ADR-024: resumo das etapas externas (fora do Orion TN) no topo do relatório
  const externalSteps = parsed.steps.filter(s => s.scope === 'external_portal');
  const externalSummary =
    externalSteps.length > 0
      ? `${externalSteps.length === 1 ? 'O passo' : 'Os passos'} ${externalSteps.map(s => s.stepNumber).join(', ')} ${externalSteps.length === 1 ? 'ocorre' : 'ocorrem'} fora do Orion TN (${Array.from(new Set(externalSteps.map(s => s.externalPortal || 'portal externo'))).join(', ')}); ${externalSteps.length === 1 ? 'não foi executado nem fotografado' : 'não foram executados nem fotografados'}. As demais etapas ${blocked ? 'foram auditadas até o ponto de bloqueio' : 'foram auditadas no Orion TN'}.`
      : '';

  let body = '';
  if (!blocked && externalSummary) {
    body += `> [!IMPORTANT]\n> **ROTINA COM ETAPAS EM AMBIENTE EXTERNO (${describeTags(tags)}):**  \n> ${externalSummary}\n\n`;
  }
  if (blocked) {
    const info: RoutineBlockInfo = block || {
      kind: 'other',
      tipo: 'Revisão Técnica Necessária',
      motivo: 'A auditoria automática não conseguiu validar esta rotina com evidência na tela.',
      roteiro: ['Revisar a rotina manualmente no ambiente de homologação.']
    };
    body += `> [!CAUTION]\n> **${reviewHeadline(status as ReviewStatus, tags)}:**  \n> A auditoria automática foi interrompida: **${info.tipo}**.\n>\n> **Motivo Técnico:** ${info.motivo}\n`;
    if (externalSummary) body += `>\n> **Etapas externas ([CCC]):** ${externalSummary}\n`;
    body += `\n`;
    body += `#### Descrição:\n${parsed.descricao}\n\n`;
    body += `#### Roteiro Técnico para Execução Manual:\n${info.roteiro.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n`;
    if (info.prerequisites && info.prerequisites.length > 0) {
      body += `* **Rotinas pré-requisito (executar antes):** ${info.prerequisites.map(p => `**${p}**`).join(', ')}.\n\n`;
    }
    body += `* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.\n\n`;
    body += `#### Passo a passo (texto original preservado):\n${stepsLines}${obsText}\n`;
  } else if (manifestMode) {
    body += `#### Descrição:\n${parsed.descricao}\n\n`;
    body += `* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, sem alterações. Todos os elementos em negrito foram localizados ao vivo nas telas capturadas.\n\n`;
    body += `#### Passo a passo (texto original preservado):\n${stepsLines}${obsText}\n`;
  } else {
    const descNotes = (input.editorial || []).map(e => `\n\n${editorialNote(e)}`).join('');
    body += `#### Descrição:\n${parsed.descricao}${descNotes}\n\n#### Passo a passo revisado:\n${stepsLines}${obsText}\n`;
  }

  if (input.evidencePrints && input.evidencePrints.length > 0) {
    body += `\n#### Evidências visuais da auditoria:\n`;
    input.evidencePrints.forEach((e, i) => {
      body += `* **Captura ${i + 1}:** ${e.label}\n  [aqui vai a print "${e.print}"]\n`;
      if (e.blockedMessage) body += `  > [!WARNING] **Bloqueio de auditoria ao vivo:** ${e.blockedMessage}\n`;
    });
  }
  if (input.unseenTargets && input.unseenTargets.length > 0) {
    body += `\n* **Alvos do manual sem evidência nas telas capturadas:** ${input.unseenTargets.map(t => `**${t}**`).join(', ')}.\n`;
  }
  body += reauditSection(input.reauditHistory);

  const yaml = buildYaml(input, printsCount, appliedDivergences);
  return { content: `---\n${yaml}\n---\n\n${body}`, lockViolations };
}
