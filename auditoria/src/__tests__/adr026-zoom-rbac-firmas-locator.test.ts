import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { config } from '../config.js';
import {
  PERMISSION_MARK_SELECTOR,
  detectFullAccess,
  evaluatePrivilege,
  isFullAccessSession,
  probePermissionBlockedTargets
} from '../rbac.js';
import { buildMenuTreeScript, chooseMenuItem, expandMenuOrAlternativeSpan, extractMenuPaths } from '../menu-path.js';
import { forbiddenCandidateReason, isNavbarOnlyTargetForbidden } from '../navigation-guard.js';
import { inferStepZone, rankSemanticCandidatesInA11y, type ParsedA11yNode } from '../smart-locator.js';
import { classifyBlock } from '../review-classifier.js';
import { classifyFirmasStep } from '../firmas-interactive.js';
import type { ParsedRoutine, RoutineStep } from '../types.js';

const stepOf = (stepNumber: number, rawText: string, targets: string[], actionType: RoutineStep['actionType'] = 'click'): RoutineStep => ({
  stepNumber,
  rawText,
  targets,
  actionType
});

describe('ADR-026: RBAC Full Access e Fim do Falso Bloqueio .ngx-orion-hide', () => {
  it('reconhece marcus e Perfil de acesso - Gerência webFirmas como 100% acesso pleno', () => {
    const id = {
      login: 'marcus',
      name: 'Marcus',
      position: 'TABELIAO',
      profiles: ['Perfil de acesso - Gerência webFirmas'],
      source: 'localStorage.user_webfirmas'
    };
    const full = detectFullAccess(id);
    assert.ok(full);
    assert.equal(isFullAccessSession(id), true);

    const gate = evaluatePrivilege({ roles: ['Administrador'], sourceStep: 1, sourceText: 'Perfil Administrador' }, id);
    assert.equal(gate.satisfied, true);
    assert.equal(gate.fullAccess, true);
  });

  it('remove .ngx-orion-hide do seletor de bloqueio de permissão RBAC', () => {
    assert.equal(PERMISSION_MARK_SELECTOR.includes('ngx-orion-hide'), false);
    assert.equal(PERMISSION_MARK_SELECTOR.includes('.functionality.disabled'), true);
  });

  it('probePermissionBlockedTargets nunca retorna bloqueio RBAC para sessão plena (marcus)', async () => {
    const fakeClient = {
      evalJson: async (code: string) => {
        if (code.includes('localStorage')) {
          return {
            login: 'marcus',
            name: 'Marcus',
            position: '',
            profiles: ['Perfil de acesso - Gerência webFirmas'],
            source: 'localStorage.user_webfirmas'
          };
        }
        return { target: 'Balcão de Firmas', detail: 'Item bloqueado', domEvidence: '.disabled' };
      }
    } as any;

    const hit = await probePermissionBlockedTargets(fakeClient, ['Balcão de Firmas']);
    assert.equal(hit, null);
  });

  it('mantém zoom padrão em 0.8 (80%) com viewport 1440x900 DPR 1', () => {
    assert.equal(config.browserZoom, 0.8);
    assert.equal(config.viewportWidth, 1440);
    assert.equal(config.viewportHeight, 900);
  });
});

describe('ADR-026: Menu Path .ngx-orion-hide, Sinônimo Canônico e Limpeza X ou Y', () => {
  it('buildMenuTreeScript ignora nós .ngx-orion-hide como obsoletos em vez de bloqueio RBAC', () => {
    const script = buildMenuTreeScript();
    assert.ok(script.includes('hiddenByApp'));
    assert.ok(script.includes('if (hiddenByApp(li)) continue;'));
    assert.equal(script.includes('Item oculto pela aplicação para o perfil logado'), false);
  });

  it('cura Firmas > Balcão de Firmas para Firmas > Reconhecimento de firmas e não bloqueia quando ignoreDisabledBlocks=true', () => {
    const step = stepOf(1, 'Acesse o menu **Firmas > Balcão de Firmas**.', ['Firmas > Balcão de Firmas'], 'navigate');
    const paths = extractMenuPaths(step);
    const items = [
      { chain: ['Firmas', 'Reconhecimento de firmas'], selectors: ['[m1]', '[m2]'], disabled: false, hasChildren: false }
    ];
    const match = chooseMenuItem(paths, items, [], { ignoreDisabledBlocks: true });
    assert.ok(match);
    assert.deepEqual(match.item.chain, ['Firmas', 'Reconhecimento de firmas']);
    assert.equal(match.blocked, undefined);
  });

  it('remove alternativa inexistente "ou **Firmas > Balcão de Firmas**" quando X existe e Y não existe', () => {
    const step = stepOf(
      1,
      'Acesse o menu: **Firmas > Reconhecimento de Firmas** ou **Firmas > Balcão de Firmas**.',
      ['Firmas > Reconhecimento de Firmas', 'Firmas > Balcão de Firmas'],
      'navigate'
    );
    const paths = extractMenuPaths(step);
    const items = [
      { chain: ['Firmas', 'Reconhecimento de firmas'], selectors: ['[m1]', '[m2]'], disabled: false, hasChildren: false }
    ];
    const match = chooseMenuItem(paths, items);
    assert.ok(match);
    assert.equal(match.exact, true);
    const { span, removedAlternatives } = expandMenuOrAlternativeSpan(step.rawText, paths, match.documented, items);
    assert.equal(span, '**Firmas > Reconhecimento de Firmas** ou **Firmas > Balcão de Firmas**');
    assert.deepEqual(removedAlternatives, ['Firmas > Balcão de Firmas']);
    const cleaned = step.rawText.replace(span, `**${match.item.chain.join(' > ')}**`);
    assert.equal(cleaned, 'Acesse o menu: **Firmas > Reconhecimento de firmas**.');
  });
});

describe('ADR-026: Guardas Anti-Alucinação do SmartLocator e Zonas Semânticas', () => {
  it('proíbe casar "+" / "Adicionar Serviço" com "Novo cartão +" quando o passo não cita cartão', () => {
    const step = stepOf(4, 'No painel **Serviços realizados**, clique no ícone **+** (**Adicionar Serviço**).', ['Serviços realizados', '+', 'Adicionar Serviço']);
    assert.ok(forbiddenCandidateReason(step, { name: 'Novo cartão +', role: 'button' }));

    const nodes: ParsedA11yNode[] = [
      { ref: '@e1', role: 'button', name: 'Novo cartão +', rawLine: 'button "Novo cartão +"' },
      { ref: '@e2', role: 'textbox', name: 'Cidade', rawLine: 'textbox "Cidade"' }
    ];
    const ranked = rankSemanticCandidatesInA11y(['+', 'Adicionar Serviço'], nodes, step);
    assert.equal(ranked.some(c => c.node.name.includes('Novo cartão')), false);
  });

  it('permite "Novo cartão +" apenas quando o passo cita explicitamente cartão', () => {
    const step = stepOf(2, 'Clique em **Novo cartão +** para cadastrar nova ficha.', ['Novo cartão +']);
    assert.equal(forbiddenCandidateReason(step, { name: 'Novo cartão +', role: 'button' }), null);
  });

  it('nunca casa "Autenticidade" com "Cidade" por substring intra-palavra', () => {
    const step = stepOf(5, 'Selecione o tipo de ato (**Autenticidade** ou **Semelhança**).', ['Autenticidade', 'Semelhança'], 'select');
    const nodes: ParsedA11yNode[] = [
      { ref: '@e10', role: 'combobox', name: 'Cidade', rawLine: 'combobox "Cidade"' },
      { ref: '@e11', role: 'button', name: 'Imprimir', rawLine: 'button "Imprimir"' }
    ];
    const ranked = rankSemanticCandidatesInA11y(['Autenticidade'], nodes, step);
    assert.equal(ranked.some(c => c.node.name === 'Cidade'), false);
  });

  it('impede colapso de "Grupo Firmas" para item "Firmas" da navbar e resolve para checkbox "Escrevente de Firmas"', () => {
    const step = stepOf(
      3,
      'Na aba **Grupos de Trabalho**, certifique-se de marcar a opção **Grupo Firmas**.',
      ['Grupos de Trabalho', 'Grupo Firmas'],
      'check'
    );
    assert.equal(inferStepZone(step.rawText, step.actionType), 'content-preferred');
    assert.ok(isNavbarOnlyTargetForbidden(step, { name: 'Firmas', role: 'link', inNavbar: true }));

    const nodes: ParsedA11yNode[] = [
      { ref: '', role: 'label', name: 'Escrevente de Firmas', rawLine: 'label "Escrevente de Firmas"' }
    ];
    const ranked = rankSemanticCandidatesInA11y(step.targets, nodes, step);
    assert.equal(ranked.length, 1);
    assert.equal(ranked[0].node.name, 'Escrevente de Firmas');
    assert.equal(ranked[0].documentedTarget, 'Grupo Firmas');
  });

  it('mantém zona "any" quando o passo seleciona apenas uma aba sem verbo de formulário', () => {
    assert.equal(inferStepZone('Selecione a aba **Configurações**.', 'select'), 'any');
  });
});

describe('ADR-026: Classificador M-40.0 e Classificador Interativo Firmas', () => {
  it('não classifica dry_run_dependent em grade populada como [DDD] (emite atualizacao_editorial)', () => {
    const parsed: ParsedRoutine = {
      id: 'M-40.0',
      titulo: 'Gerenciar Alíquotas',
      modulo: 'config',
      secao: 'Manuais',
      tem_video: false,
      descricao: 'Alíquotas municipais',
      frontmatter: {},
      observacoes: [],
      rawContent: '',
      steps: [stepOf(6, 'Clique em **Limpar**.', ['Limpar'])]
    };
    const cls = classifyBlock({
      parsed,
      block: {
        kind: 'dry_run_dependent',
        tipo: 'Validação Dependente de Gravação Real (Trava de Mutação Ativa)',
        motivo: 'O botão Limpar não apareceu após Salvar omitido por dry-run.',
        roteiro: ['Executar em massa']
      },
      blockedStep: 6,
      blockedStepHasMenuPath: false,
      emptyState: {
        hash: '#/aliquota',
        emptyGrid: false,
        headers: ['UF', 'Cidade', 'ITBI %', 'ISS %'],
        disabledControls: []
      },
      seed: { attempted: false, disabled: false }
    });
    assert.equal(cls.status, 'atualizacao_editorial');
  });

  it('classifica corretamente etapas interativas de Reconhecimento de Firmas (R-1.1 / R-2.0)', () => {
    assert.equal(classifyFirmasStep(stepOf(1, 'Acesse o menu **Firmas > Reconhecimento de Firmas**.', ['Firmas > Reconhecimento de Firmas'])), null);
    assert.equal(classifyFirmasStep(stepOf(2, 'Pesquise o cliente por **Nome** ou **CPF**.', ['Nome', 'CPF'], 'fill')), 'search_person');
    assert.equal(
      classifyFirmasStep(
        stepOf(3, 'No campo de busca do pedido, pesquise o cliente por **Nome** ou **CPF** para carregar a ficha de assinatura e documentos.', ['Nome', 'CPF'], 'search')
      ),
      'search_person'
    );
    assert.equal(
      classifyFirmasStep(stepOf(3, 'O sistema exibirá o cadastro do cliente com a foto da assinatura digitalizada e documentos anexados.', [])),
      'review_card'
    );
    assert.equal(classifyFirmasStep(stepOf(2, 'Clique em **Novo Pedido** ou informe a **Senha SGA**.', ['Novo Pedido', 'Senha SGA'])), 'sga_order');
    assert.equal(classifyFirmasStep(stepOf(4, 'Clique em **Adicionar Serviço** (**+**) para incluir o ato.', ['Adicionar Serviço', '+'])), 'add_service');
    assert.equal(classifyFirmasStep(stepOf(5, 'Escolha **Autenticidade** e clique em **Impressão**.', ['Autenticidade', 'Impressão'])), 'act_and_print');
    assert.equal(classifyFirmasStep(stepOf(5, 'Finalize e envie ao **Caixa** clicando em **Concluir**.', ['Caixa', 'Concluir'])), 'finish_order');
  });
});
