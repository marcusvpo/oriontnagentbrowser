// Helpers puros de ciclo de vida de revisões, estágios de curadoria e geração do pacote de exportação (ADR-036).

export type ReviewTag = 'ATT' | 'CCC' | 'DDD' | 'XRX';
export type ReviewIngestionState = 'sem_revisoes' | 'pendente_exportacao' | 'ingerida_pelo_agente';
export type CurationStage =
  | 'aprovadas_kb'
  | 'ingeridas_agente'
  | 'revisao_pendente'
  | 'apoio_humano'
  | 'prontas_conferencia'
  | 'nao_auditadas';

export const REVIEW_TAG_ORDER: readonly ReviewTag[] = ['ATT', 'CCC', 'DDD', 'XRX'];
export const REVIEW_STATUSES = [
  'atualizacao_editorial',
  'comunicacao_externa',
  'dependencia_dados_banco',
  'dependencia_cruzada_rotina',
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  divergencia_texto: 'Divergência de texto',
  print_incorreta: 'Print incorreta',
  tela_bloqueada: 'Tela bloqueada',
  hardware_driver: 'Hardware / driver',
  outro: 'Outro',
};

export const REVIEW_STATUS_LABELS: Record<string, string> = {
  aberta: 'Aberta',
  em_andamento: 'Em andamento',
  resolvida: 'Resolvida',
  arquivada: 'Arquivada',
};

export const AUDIT_STATUS_LABELS: Record<string, string> = {
  validado_inalterado: 'Validado sem alterações',
  validado_com_ajustes: 'Auto-ajustada pelo motor',
  atualizacao_editorial: '[ATT] Atualização editorial',
  comunicacao_externa: '[CCC] Comunicação externa',
  dependencia_dados_banco: '[DDD] Dependência de dados',
  dependencia_cruzada_rotina: '[XRX] Dependência cruzada',
  nao_auditada: 'Não auditada',
};

export const GOV_STATUS_LABELS: Record<string, string> = {
  pendente_aprovacao: 'Aguardando aprovação',
  aprovada: 'Aprovada p/ Base KB',
  revisao_solicitada: 'Em revisão humana',
};

export function isReviewAuditStatus(status: string | null | undefined): boolean {
  return Boolean(status && (REVIEW_STATUSES as readonly string[]).includes(status));
}

export function normalizeTags(raw: ReadonlyArray<string> | null | undefined): ReviewTag[] {
  const set = new Set(
    (raw ?? []).map((x) => String(x).replace(/[[\]\s]/g, '').toUpperCase()),
  );
  return REVIEW_TAG_ORDER.filter((t) => set.has(t));
}

export function tagsFromPrefix(folderOrName: string | null | undefined): ReviewTag[] {
  if (!folderOrName) return [];
  const head = String(folderOrName).match(/^(?:\[[A-Z!]{3}\])+/i)?.[0] ?? '';
  if (!head) return [];
  const found = Array.from(head.matchAll(/\[([A-Z]{3})\]/gi)).map((m) => m[1].toUpperCase());
  return normalizeTags(found);
}

export function reviewTagsForStatus(status: string | null | undefined): ReviewTag[] {
  switch (status) {
    case 'atualizacao_editorial':
      return ['ATT'];
    case 'comunicacao_externa':
      return ['CCC'];
    case 'dependencia_dados_banco':
      return ['DDD'];
    case 'dependencia_cruzada_rotina':
      return ['XRX'];
    default:
      return [];
  }
}

export interface ReviewIngestionFlags {
  consumidaPeloAgente: boolean;
  editadaPosIngestao: boolean;
  pendenteExportacao: boolean;
}

export function computeReviewIngestionFlags(row: {
  status?: string | null;
  versao?: number | null;
  consumida_pelo_agente?: boolean | null;
  consumidaPeloAgente?: boolean | null;
  versao_consumida?: number | null;
  versaoConsumida?: number | null;
}): ReviewIngestionFlags {
  const status = String(row.status || 'aberta');
  const isActive = status === 'aberta' || status === 'em_andamento';
  const consumidaPeloAgente = Boolean(row.consumida_pelo_agente ?? row.consumidaPeloAgente);
  const versao = Number(row.versao ?? 1);
  const versaoConsumidaRaw = row.versao_consumida ?? row.versaoConsumida;
  const versaoConsumida =
    versaoConsumidaRaw !== null && versaoConsumidaRaw !== undefined ? Number(versaoConsumidaRaw) : undefined;
  const editadaPosIngestao =
    consumidaPeloAgente && versaoConsumida !== undefined && versao > versaoConsumida;
  const pendenteExportacao = isActive && (!consumidaPeloAgente || editadaPosIngestao);
  return { consumidaPeloAgente, editadaPosIngestao, pendenteExportacao };
}

export interface RoutineReviewRollup {
  revisoesCount: number;
  revisoesPendentesExportacao: number;
  revisoesConsumidasCount: number;
  reviewIngestionState: ReviewIngestionState;
  ultimaIngestaoEm?: string;
  ultimoLoteIngestaoId?: string;
  ultimaIngestaoPor?: string;
  temNovaRevisaoPosIngestao: boolean;
}

export function computeRoutineReviewRollup(
  reviews: Array<{
    status?: string | null;
    versao?: number | null;
    consumida_pelo_agente?: boolean | null;
    consumidaPeloAgente?: boolean | null;
    consumida_em?: string | null;
    consumidaEm?: string | null;
    consumida_por?: string | null;
    consumidaPor?: string | null;
    lote_exportacao_id?: string | null;
    loteExportacaoId?: string | null;
    versao_consumida?: number | null;
    versaoConsumida?: number | null;
  }>,
): RoutineReviewRollup {
  if (!reviews || reviews.length === 0) {
    return {
      revisoesCount: 0,
      revisoesPendentesExportacao: 0,
      revisoesConsumidasCount: 0,
      reviewIngestionState: 'sem_revisoes',
      temNovaRevisaoPosIngestao: false,
    };
  }

  let pendentes = 0;
  let consumidas = 0;
  let ultimaIngestaoEm: string | undefined;
  let ultimoLoteIngestaoId: string | undefined;
  let ultimaIngestaoPor: string | undefined;

  for (const r of reviews) {
    const flags = computeReviewIngestionFlags(r);
    if (flags.pendenteExportacao) pendentes++;
    if (flags.consumidaPeloAgente) {
      consumidas++;
      const em = r.consumida_em ?? r.consumidaEm ?? undefined;
      if (em && (!ultimaIngestaoEm || em > ultimaIngestaoEm)) {
        ultimaIngestaoEm = em;
        ultimoLoteIngestaoId = (r.lote_exportacao_id ?? r.loteExportacaoId) || undefined;
        ultimaIngestaoPor = (r.consumida_por ?? r.consumidaPor) || undefined;
      }
    }
  }

  const temNovaRevisaoPosIngestao = consumidas > 0 && pendentes > 0;
  const reviewIngestionState: ReviewIngestionState =
    pendentes > 0
      ? 'pendente_exportacao'
      : consumidas > 0
        ? 'ingerida_pelo_agente'
        : 'sem_revisoes';

  return {
    revisoesCount: reviews.length,
    revisoesPendentesExportacao: pendentes,
    revisoesConsumidasCount: consumidas,
    reviewIngestionState,
    ultimaIngestaoEm,
    ultimoLoteIngestaoId,
    ultimaIngestaoPor,
    temNovaRevisaoPosIngestao,
  };
}

export function computeCurationStage(params: {
  statusGovernanca: string;
  statusAuditoria: string;
  revisoesPendentesExportacao: number;
  revisoesConsumidasCount: number;
}): CurationStage {
  if (params.statusGovernanca === 'aprovada') return 'aprovadas_kb';
  if (params.statusAuditoria === 'nao_auditada') return 'nao_auditadas';
  if (params.revisoesPendentesExportacao > 0) return 'revisao_pendente';
  if (params.revisoesConsumidasCount > 0) return 'ingeridas_agente';
  if (isReviewAuditStatus(params.statusAuditoria)) return 'apoio_humano';
  return 'prontas_conferencia';
}

export interface ExportBundleRoutine {
  id: string;
  titulo: string;
  modulo: string;
  secao: string;
  fase: number | null;
  statusAuditoria: string;
  reviewTags: ReviewTag[];
  statusGovernanca: string;
  dataExecucao?: string;
  rotasHash: string[];
  bloqueio?: { tipo?: string; motivo?: string; roteiroManual?: string[] } | null;
  diagnosticoTelaAtt?: {
    passo?: number;
    rota?: string;
    titulo_painel?: string;
    secoes?: string[];
    abas?: Array<string | { rotulo: string; ativa?: boolean }>;
    campos?: Array<{ rotulo: string; tipo?: string; secao?: string; obrigatorio?: boolean }>;
    botoes?: string[];
    correspondencias_sugeridas?: Array<{ alvo: string; elemento_real: string; similaridade?: number }>;
    alvos_sem_correspondencia?: string[];
    sugestao_reescrita?: string;
  } | null;
  steps: Array<{
    stepNumber: number;
    status: string;
    stepScope?: string;
    portalExterno?: string;
    originalText: string;
    validatedText: string;
    isModified: boolean;
    errorMessage?: string;
  }>;
  revisoes: Array<{
    id: string;
    versao: number;
    status: string;
    categoria: string;
    revisor: string;
    atualizadoPor: string;
    criadoEm: string;
    atualizadoEm: string;
    passos: number[];
    motivo: string;
    resolucao?: string;
    consumidaAnteriormente?: boolean;
    versaoConsumidaAnterior?: number;
  }>;
}

function fmtPtBr(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(d);
}

export function buildExportMarkdown(params: {
  batchId: string;
  operador: string;
  nota?: string;
  marcarComoIngeridas: boolean;
  exportedAt: string;
  routines: ExportBundleRoutine[];
}): string {
  const { batchId, operador, nota, marcarComoIngeridas, exportedAt, routines } = params;
  const totalRevisoes = routines.reduce((acc, r) => acc + r.revisoes.length, 0);
  const lines: string[] = [];

  lines.push('# Pacote de Revisões Humanas — Orion Audit Console');
  lines.push('');
  lines.push(`- **Lote:** \`${batchId}\``);
  lines.push(`- **Exportado em:** ${fmtPtBr(exportedAt)} (\`${exportedAt}\`)`);
  lines.push(`- **Operador:** ${operador}`);
  lines.push(
    `- **Carimbado como ingerido pelo agente:** ${
      marcarComoIngeridas ? 'Sim (rotinas marcadas no Orion Audit)' : 'Não (apenas cópia de leitura)'
    }`,
  );
  if (nota?.trim()) lines.push(`- **Nota do lote:** ${nota.trim()}`);
  lines.push(`- **Abrangência:** ${totalRevisoes} revisão(ões) distribuída(s) em ${routines.length} rotina(s)`);
  lines.push('');
  lines.push('> **Como usar este arquivo no Antigravity / Claude Code:**');
  lines.push(
    '> Analise criticamente cada rotina abaixo confrontando as orientações humanas (SD / Produtos) com o manual original, o texto revisado e o diagnóstico da última execução do motor. Antes de reexecutar o motor localmente, extraia: (1) equivalências de menu/tela, (2) correções de alvos ou anti-alvos semânticos, (3) ajustes editoriais no manual e (4) pré-condições de dados/ambiente.',
  );
  lines.push('');
  lines.push('## Índice de Rotinas no Lote');
  lines.push('');
  lines.push('| # | Rotina | Título | Módulo | Status Atual | Tags | Revisões | Passos Citados | Revisores |');
  lines.push('| :-: | :--- | :--- | :--- | :--- | :--- | :-: | :--- | :--- |');

  routines.forEach((r, idx) => {
    const tags = r.reviewTags.length > 0 ? r.reviewTags.map((t) => `\`[${t}]\``).join(' ') : '—';
    const citedSteps = Array.from(new Set(r.revisoes.flatMap((rev) => rev.passos))).sort((a, b) => a - b);
    const stepsText = citedSteps.length > 0 ? citedSteps.map((n) => `P${n}`).join(', ') : 'Rotina inteira';
    const reviewers = Array.from(new Set(r.revisoes.map((rev) => rev.revisor))).join(', ');
    const safeTitle = r.titulo.replace(/\|/g, '\\|');
    lines.push(
      `| ${idx + 1} | \`${r.id}\` | ${safeTitle} | ${r.modulo} | ${AUDIT_STATUS_LABELS[r.statusAuditoria] ?? r.statusAuditoria} | ${tags} | ${r.revisoes.length} | ${stepsText} | ${reviewers} |`,
    );
  });

  lines.push('');
  lines.push('---');

  routines.forEach((r, idx) => {
    const tagsPrefix = r.reviewTags.length > 0 ? `${r.reviewTags.map((t) => `[${t}]`).join('')} ` : '';
    lines.push('');
    lines.push(`## ${idx + 1}. ${tagsPrefix}\`${r.id}\` — ${r.titulo}`);
    lines.push('');
    lines.push(
      `- **Módulo:** \`${r.modulo}\` · **Fase:** ${r.fase ?? 'Sem fase'} · **Seção:** \`${r.secao}\``,
    );
    lines.push(
      `- **Status da Auditoria:** ${AUDIT_STATUS_LABELS[r.statusAuditoria] ?? r.statusAuditoria} · **Governança:** ${GOV_STATUS_LABELS[r.statusGovernanca] ?? r.statusGovernanca}`,
    );
    lines.push(
      `- **Última execução do motor:** ${fmtPtBr(r.dataExecucao)}${
        r.rotasHash.length > 0 ? ` · **Rotas hash:** ${r.rotasHash.map((h) => `\`${h}\``).join(', ')}` : ''
      }`,
    );

    if (r.bloqueio) {
      lines.push('');
      lines.push('### Diagnóstico de Bloqueio do Motor');
      if (r.bloqueio.tipo) lines.push(`- **Tipo:** ${r.bloqueio.tipo}`);
      if (r.bloqueio.motivo) lines.push(`- **Motivo técnico:** ${r.bloqueio.motivo}`);
      if (Array.isArray(r.bloqueio.roteiroManual) && r.bloqueio.roteiroManual.length > 0) {
        lines.push('- **Roteiro manual sugerido:**');
        r.bloqueio.roteiroManual.forEach((item, i) => lines.push(`  ${i + 1}. ${item}`));
      }
    }

    if (r.diagnosticoTelaAtt) {
      const d = r.diagnosticoTelaAtt;
      lines.push('');
      lines.push(`### Raio-X da Tela Atual (Passo ${d.passo ?? '—'})`);
      if (d.rota) lines.push(`- **Rota:** \`${d.rota}\`${d.titulo_painel ? ` · **Painel:** ${d.titulo_painel}` : ''}`);
      if (d.abas && d.abas.length > 0) {
        const abasStr = d.abas.map((a) => (typeof a === 'string' ? a : a.rotulo)).join(', ');
        lines.push(`- **Abas visíveis:** ${abasStr}`);
      }
      if (d.campos && d.campos.length > 0) {
        lines.push(`- **Campos na tela:** ${d.campos.map((c) => c.rotulo).slice(0, 20).join(', ')}`);
      }
      if (d.botoes && d.botoes.length > 0) {
        lines.push(`- **Botões visíveis:** ${d.botoes.slice(0, 20).join(', ')}`);
      }
      if (d.correspondencias_sugeridas && d.correspondencias_sugeridas.length > 0) {
        lines.push(
          `- **Sugestões de correspondência:** ${d.correspondencias_sugeridas
            .map((c) => `"${c.alvo}" → "${c.elemento_real}"`)
            .join('; ')}`,
        );
      }
      if (d.alvos_sem_correspondencia && d.alvos_sem_correspondencia.length > 0) {
        lines.push(`- **Alvos sem correspondência:** ${d.alvos_sem_correspondencia.join(', ')}`);
      }
    }

    lines.push('');
    lines.push(`### Revisões Humanas (${r.revisoes.length})`);
    r.revisoes.forEach((rev, rIdx) => {
      const cat = CATEGORY_LABELS[rev.categoria] ?? rev.categoria;
      const st = REVIEW_STATUS_LABELS[rev.status] ?? rev.status;
      const deltaNote =
        rev.consumidaAnteriormente && rev.versaoConsumidaAnterior
          ? ` · *Atualizada após ingestão anterior (v${rev.versaoConsumidaAnterior} → v${rev.versao})*`
          : '';
      lines.push('');
      lines.push(`#### Revisão ${rIdx + 1} — \`${rev.id}\` (v${rev.versao} · ${st} · ${cat})${deltaNote}`);
      lines.push(
        `- **Revisor:** ${rev.revisor} (atualizado por ${rev.atualizadoPor} em ${fmtPtBr(rev.atualizadoEm)})`,
      );
      lines.push(
        `- **Passos afetados:** ${rev.passos.length > 0 ? rev.passos.map((p) => `Passo ${p}`).join(', ') : 'Rotina inteira'}`,
      );
      lines.push('- **Observação / Orientação para o motor:**');
      for (const line of rev.motivo.split(/\r?\n/)) {
        lines.push(`  > ${line}`);
      }
      if (rev.resolucao) {
        lines.push(`- **Resolução / Tratativa registrada:** ${rev.resolucao}`);
      }
    });

    if (r.steps.length > 0) {
      lines.push('');
      lines.push('### Passo a Passo Atual (Manual Original × Texto Revisado)');
      lines.push('');
      for (const st of r.steps) {
        const tagScope =
          st.stepScope === 'external_portal'
            ? ` · Etapa Externa${st.portalExterno ? ` (${st.portalExterno})` : ''}`
            : '';
        lines.push(`- **Passo ${st.stepNumber}** *(${st.status}${tagScope})*:`);
        lines.push(`  - **Original:** ${st.originalText}`);
        if (st.validatedText && st.validatedText !== st.originalText) {
          lines.push(`  - **Revisado:** ${st.validatedText}`);
        } else {
          lines.push('  - **Revisado:** *(inalterado)*');
        }
        if (st.errorMessage) {
          lines.push(`  - **Erro/Bloqueio no passo:** \`${st.errorMessage}\``);
        }
      }
    }

    lines.push('');
    lines.push('---');
  });

  return lines.join('\n');
}

export function buildExportJson(params: {
  batchId: string;
  operador: string;
  nota?: string;
  marcarComoIngeridas: boolean;
  exportedAt: string;
  routines: ExportBundleRoutine[];
}): string {
  const totalRevisoes = params.routines.reduce((acc, r) => acc + r.revisoes.length, 0);
  return JSON.stringify(
    {
      schema: 'orion-audit-review-export/v1',
      batchId: params.batchId,
      exportedAt: params.exportedAt,
      operador: params.operador,
      marcarComoIngeridas: params.marcarComoIngeridas,
      nota: params.nota?.trim() || null,
      resumo: {
        totalRotinas: params.routines.length,
        totalRevisoes,
      },
      rotinas: params.routines,
    },
    null,
    2,
  );
}
