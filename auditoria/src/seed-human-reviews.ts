import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase.js';
import { persistRoutineGovernanceToDisk } from './governance-disk.js';
import { syncSingleRoutineToSupabase } from './sync-supabase.js';

export type ReviewPriority = 'alta' | 'media' | 'baixa';
export type ReviewCategory = 'divergencia_texto' | 'print_incorreta' | 'tela_bloqueada' | 'hardware_driver' | 'outro';

export interface HumanReviewSeed {
  routineId: string;
  prioridade: ReviewPriority;
  categoria: ReviewCategory;
  passos: number[];
  motivo: string;
}

export const REVIEW_AUTHOR = 'Marcus (Revisor)';

export const HUMAN_REVIEWS: readonly HumanReviewSeed[] = [
  {
    routineId: 'C-FIRMA-03',
    prioridade: 'alta',
    categoria: 'divergencia_texto',
    passos: [3, 4],
    motivo:
      "Passos 1 e 2 estão corretos. Nos passos 3 e 4 o agente destacou erroneamente o menu superior 'Firmas' (navbar) como se fosse 'Grupo de Trabalho > Grupo Firmas' (que não existe nesta tela) e acusou falso bloqueio de permissão em 'Balcão de Firmas'. A conta marcus (Perfil de acesso - Gerência webFirmas) possui 100% de permissão liberada. A rotina está desatualizada: o caminho real na tela atual é assinalar a opção 'Escrevente de Firmas' nos checkboxes do lado esquerdo da tela."
  },
  {
    routineId: 'R-1.1',
    prioridade: 'alta',
    categoria: 'divergencia_texto',
    passos: [1, 2, 3, 4],
    motivo:
      "Passo 1: remover a alternativa inexistente 'ou Firmas > Balcão de Firmas' do texto revisado; o único caminho real é 'Firmas > Reconhecimento de Firmas' (nenhuma rotina revisada deve manter 'X ou Y' quando X foi provado correto e Y não existe). Passos 2 e 3: o agente precisa executar de fato a busca no passo 2 digitando 'teste' no campo Nome e pressionando Enter para abrir a seção 'Nomes encontrados' à direita, clicar no '+' da linha do nome (enviando-o para 'Nomes para reconhecimento' à esquerda) e clicar em 'Finalizar' para carregar o cartão de assinatura e documentos no passo 3. Passo 4: a auto-cura '+' (Adicionar Serviço) -> 'Novo cartão +' está completamente errada; 'Novo cartão +' serve exclusivamente para cadastrar novo cartão de assinatura quando o cliente não possui cadastro. Manter R-1.1 focada na visão geral e atendimento resumido."
  },
  {
    routineId: 'R-2.0',
    prioridade: 'alta',
    categoria: 'divergencia_texto',
    passos: [1, 2, 3, 4],
    motivo:
      "Passo 1: falso positivo grave de 'Insuficiência de Privilégio na Conta de Homologação' em 'Firmas > Balcão de Firmas'. O perfil 'Gerência webFirmas' (usuário marcus) tem 100% de acesso liberado e o caminho real é 'Firmas > Reconhecimento de Firmas'. Passos 2 a 4: os passos originais estão invertidos/desatualizados. O fluxo real inicia pesquisando o cliente por Nome ou CPF ('teste' + Enter) -> na grade 'Nomes encontrados' (lado direito), clicar no botão '+' na linha do nome (ou selecionar e teclar Enter) para movê-lo à seção 'Nomes para reconhecimento' (lado esquerdo) -> clicar no botão 'Finalizar' abaixo de 'Nomes encontrados' -> na seção 'Serviços realizados' que reaparece à direita, preencher 'Nome do serviço' (ex: Autenticação, Fotocópia, Reconhecimento), 'Escrevente', 'Cálculo', 'QTD', 'Impressora' (quando aplicável) e 'Observação' -> clicar na setinha para baixo 'Efetuar Serviço' ao lado do campo QTD para lançar o ato na grade inferior (exibindo valor total e habilitando os botões 'Tomador', 'Pagamento', 'Termo', 'Cancelar' e 'Concluir'). O botão 'Adicionar Serviço (+)' não existe."
  },
  {
    routineId: 'C-CENTRAL-02',
    prioridade: 'alta',
    categoria: 'divergencia_texto',
    passos: [1, 2, 3, 4, 5, 6],
    motivo:
      "Passos 1 a 3 ocorrem fora do Orion TN (diretamente no portal oficial do SISCOAF com e-CPF) e devem ser sinalizados como Etapa Externa [CCC] sem print falsa da home. No Orion TN (a partir do passo 4), o caminho atualizado é 'Configurações > Parametrizações > Comunicações' (menu lateral) > bloco 'Coaf' > clicar em 'Clique aqui para acessar a tela de configuração no Orion Coaf', que abre em nova guia a tela com os campos 'CPF/CNPJ', 'E-mail', 'Tipo do certificado' e botão 'Cadastrar'."
  },
  {
    routineId: 'D-3.14',
    prioridade: 'alta',
    categoria: 'divergencia_texto',
    passos: [1, 2],
    motivo:
      "No passo 1 ('Notas > Certidões > Novo Pedido de Certidão'), o agente curou erroneamente para o campo de busca global ('Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B') em vez de abrir o menu 'Notas' no cabeçalho, o que quebrou o passo 2 ('Identificação do Solicitante'). No menu Notas atual, as opções reais são 'Certidões e serviços' e 'Certidões e serviços em aberto'."
  },
  {
    routineId: 'M-40.0',
    prioridade: 'media',
    categoria: 'divergencia_texto',
    passos: [2, 5, 6],
    motivo:
      'Na tela Gerenciar Alíquotas (colunas UF, Cidade, ITBI %, ISS % e Padrão), demarcar os campos implícitos UF e Cidade no passo 2. Quando a grade possui dados, omitir o clique em Salvar por dry-run e a ausência do botão Limpar no formulário aberto são ajustes editoriais/UI, nunca bloqueio [DDD].'
  },
  {
    routineId: 'M-25.0',
    prioridade: 'media',
    categoria: 'divergencia_texto',
    passos: [4, 5],
    motivo:
      "Na tela Configuração da Impressão (registros Não Fiscal, Reconhecimento e Termo), os botões de ação à direita da grade são ícones com títulos 'Consultar' (olho, em vez de Visualizar), 'Alterar' (lápis, em vez de Editar) e 'Excluir' (X, em vez de Remover). A unidade da tela é cm (não mm) e o ícone 'i' vermelho ao lado de 'Margem mínima' contém tooltip essencial que deve ser lido via hover."
  },
  {
    routineId: 'C-ACESSO-03',
    prioridade: 'media',
    categoria: 'divergencia_texto',
    passos: [3, 4, 5],
    motivo:
      "A ausência dos botões de redefinição de senha e reset de 2FA na tela 'Alteração de usuário' não é falta de permissão da conta, mas atualização do sistema: 'Alterar senha', 'Autenticação em dois fatores' e 'Cadastrar biometria' ficam no menu superior direito 'Olá, [username]'."
  },
  {
    routineId: 'M-16.2',
    prioridade: 'baixa',
    categoria: 'print_incorreta',
    passos: [2, 3],
    motivo:
      "No passo 2, demarcar apenas o item 'Captura e digitalização' no menu lateral esquerdo sem ocluir o texto. No passo 3, demarcar os campos reais do painel central ('Cor para digitalização do DUT', 'Dpi's para digitalização do DUT', 'Mostrar configurações do scanner'), nunca a coluna inteira da sidebar."
  }
];

export interface SeedReviewResult {
  routineId: string;
  action: 'inserted' | 'updated' | 'unchanged';
  reviewId: string;
  versao: number;
  diskUpdated: boolean;
  supabaseSynced: boolean;
}

function deterministicReviewId(routineId: string): string {
  return `rev-marcus-${routineId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
}

function samePassos(a: unknown, b: number[]): boolean {
  const arr = Array.isArray(a) ? a.map(Number).filter(Number.isFinite) : [];
  return arr.length === b.length && arr.every((v, i) => v === b[i]);
}

export async function seedHumanReviews(opts: { quiet?: boolean; only?: string[] } = {}): Promise<SeedReviewResult[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_URL e SUPABASE_SECRET_KEY não configurados em auditoria/.env');
  }

  const supabase = getSupabaseAdmin();
  const targets = opts.only && opts.only.length > 0
    ? HUMAN_REVIEWS.filter(r => opts.only!.includes(r.routineId))
    : HUMAN_REVIEWS;

  const results: SeedReviewResult[] = [];

  for (const item of targets) {
    const { data: routineRow, error: rLookupErr } = await supabase
      .from('routines')
      .select('id, status_governanca')
      .eq('id', item.routineId)
      .maybeSingle();

    if (rLookupErr) throw new Error(`Erro ao consultar rotina ${item.routineId}: ${rLookupErr.message}`);
    if (!routineRow) {
      throw new Error(`Rotina ${item.routineId} não encontrada no Supabase (public.routines). Execute supabase:sync antes.`);
    }

    const { data: existingList, error: revLookupErr } = await supabase
      .from('routine_reviews')
      .select('*')
      .eq('routine_id', item.routineId)
      .in('status', ['aberta', 'em_andamento'])
      .order('atualizado_em', { ascending: false });

    if (revLookupErr) throw new Error(`Erro ao consultar revisões de ${item.routineId}: ${revLookupErr.message}`);

    const existing = (existingList || []).find(
      (r: any) =>
        String(r.id || '').startsWith('rev-marcus-') ||
        /^marcus\b/i.test(String(r.revisor || '').trim())
    );

    const now = new Date().toISOString();
    let reviewId: string;
    let versao: number;
    let action: SeedReviewResult['action'];

    if (existing) {
      reviewId = String(existing.id);
      const alreadyMatching =
        String(existing.motivo || '').trim() === item.motivo.trim() &&
        String(existing.revisor || '').trim() === REVIEW_AUTHOR &&
        String(existing.categoria || '') === item.categoria &&
        samePassos(existing.passos, item.passos);

      if (alreadyMatching) {
        versao = Number(existing.versao || 1);
        action = 'unchanged';
      } else {
        versao = Number(existing.versao || 1) + 1;
        action = 'updated';

        const { error: updErr } = await supabase
          .from('routine_reviews')
          .update({
            revisor: REVIEW_AUTHOR,
            categoria: item.categoria,
            passos: item.passos,
            motivo: item.motivo,
            status: 'aberta',
            versao,
            atualizado_em: now,
            atualizado_por: REVIEW_AUTHOR
          })
          .eq('id', reviewId);
        if (updErr) throw new Error(`Erro ao atualizar revisão ${reviewId}: ${updErr.message}`);

        const { error: verErr } = await supabase.from('routine_review_versions').upsert(
          [
            {
              review_id: reviewId,
              versao,
              revisor: REVIEW_AUTHOR,
              categoria: item.categoria,
              passos: item.passos,
              motivo: item.motivo,
              resolucao: existing.resolucao ?? null,
              status: 'aberta',
              alterado_por: REVIEW_AUTHOR,
              nota_atualizacao: `Revisão humana consolidada (prioridade: ${item.prioridade})`,
              criado_em: now
            }
          ],
          { onConflict: 'review_id,versao' }
        );
        if (verErr) throw new Error(`Erro ao inserir versão ${versao} de ${reviewId}: ${verErr.message}`);

        const { error: evtErr } = await supabase.from('governance_events').insert({
          id: `ev-rev-seed-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          routine_id: item.routineId,
          tipo: 'revisao_solicitada',
          autor: REVIEW_AUTHOR,
          em: now,
          descricao: `${item.motivo}${item.passos.length ? ` (passos ${item.passos.join(', ')})` : ''}`,
          meta: { categoria: item.categoria, prioridade: item.prioridade, reviewId, versao }
        });
        if (evtErr) throw new Error(`Erro ao registrar evento de revisão de ${item.routineId}: ${evtErr.message}`);
      }
    } else {
      reviewId = deterministicReviewId(item.routineId);
      versao = 1;
      action = 'inserted';

      const { error: insErr } = await supabase.from('routine_reviews').insert({
        id: reviewId,
        routine_id: item.routineId,
        revisor: REVIEW_AUTHOR,
        categoria: item.categoria,
        passos: item.passos,
        motivo: item.motivo,
        status: 'aberta',
        versao,
        criado_em: now,
        atualizado_em: now,
        atualizado_por: REVIEW_AUTHOR
      });
      if (insErr) throw new Error(`Erro ao inserir revisão ${reviewId}: ${insErr.message}`);

      const { error: verErr } = await supabase.from('routine_review_versions').upsert(
        [
          {
            review_id: reviewId,
            versao,
            revisor: REVIEW_AUTHOR,
            categoria: item.categoria,
            passos: item.passos,
            motivo: item.motivo,
            status: 'aberta',
            alterado_por: REVIEW_AUTHOR,
            nota_atualizacao: `Revisão criada (prioridade: ${item.prioridade})`,
            criado_em: now
          }
        ],
        { onConflict: 'review_id,versao' }
      );
      if (verErr) throw new Error(`Erro ao inserir v1 de ${reviewId}: ${verErr.message}`);

      const { error: evtErr } = await supabase.from('governance_events').insert({
        id: `ev-rev-seed-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        routine_id: item.routineId,
        tipo: 'revisao_solicitada',
        autor: REVIEW_AUTHOR,
        em: now,
        descricao: `${item.motivo}${item.passos.length ? ` (passos ${item.passos.join(', ')})` : ''}`,
        meta: { categoria: item.categoria, prioridade: item.prioridade, reviewId, versao }
      });
      if (evtErr) throw new Error(`Erro ao registrar evento inicial de ${item.routineId}: ${evtErr.message}`);
    }

    const diskRes = await persistRoutineGovernanceToDisk(item.routineId, {
      statusGovernanca: 'revisao_solicitada',
      revisor: REVIEW_AUTHOR,
      comentario: item.motivo,
      updatedAt: now
    });

    const syncRes = await syncSingleRoutineToSupabase(item.routineId, {
      skipMedia: true,
      preserveExistingGovernance: true,
      statusGovernancaOverride: 'revisao_solicitada',
      quiet: true
    });

    if (routineRow.status_governanca !== 'revisao_solicitada') {
      await supabase
        .from('routines')
        .update({ status_governanca: 'revisao_solicitada', updated_at: now })
        .eq('id', item.routineId);
    }

    if (!opts.quiet) {
      console.log(
        `✓ [Seed Revisão] ${item.routineId} (${item.prioridade}) -> ${action} (${reviewId} v${versao}) | disco: ${diskRes.updated ? 'ok' : diskRes.reason} | supabase: ${syncRes.ok ? 'ok' : syncRes.reason}`
      );
    }

    results.push({
      routineId: item.routineId,
      action,
      reviewId,
      versao,
      diskUpdated: diskRes.updated,
      supabaseSynced: syncRes.ok
    });
  }

  try {
    const { refreshHumanReviewsCache } = await import('./human-review-rag.js');
    await refreshHumanReviewsCache();
  } catch {
    // opcional offline
  }

  return results;
}

const isDirectExecution =
  !!process.argv[1] && path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (isDirectExecution) {
  const onlyArg = process.argv.find(a => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.slice('--only='.length).split(',').map(s => s.trim()).filter(Boolean) : undefined;
  seedHumanReviews({ only })
    .then(res => {
      console.log(`\n✓ Seed concluído: ${res.length} revisão(ões) processada(s).`);
    })
    .catch(err => {
      console.error('✕ Erro ao cadastrar revisões humanas:', err);
      process.exit(1);
    });
}
