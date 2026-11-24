import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, test } from 'node:test';
import { CATALOG_MARKDOWN_FILE } from '../build-menu-catalog.js';
import { EXPLICIT_MENU_EQUIVALENCES, resolveCanonicalMenuPath, USER_MENU_ROOT, type CanonicalMenuItem } from '../menu-canonical.js';
import {
  buildClosedSemanticPrompt,
  catalogAsCanonicalItems,
  findByLeaf,
  findExactPath,
  isHomonym,
  leafExists,
  loadMenuCatalog,
  parseClosedSemanticAnswer,
  resolveClosedSemantic,
  resolveSingleSegmentScreen,
  SCREEN_ALIASES,
  SEM_EQUIVALENTE_NA_ARVORE
} from '../menu-catalog.js';
import { chooseMenuItem, type DocumentedMenuPath, type MenuTreeItem } from '../menu-path.js';

const catalog = loadMenuCatalog();
const ITEMS = catalogAsCanonicalItems(catalog);
const doc = (text: string): string[] => text.split('>').map(s => s.trim());
const txt = (chain: string[] | undefined) => (chain ? chain.join(' > ') : '(nulo)');

/** Leitura independente das tabelas da seção 4 do markdown (a fonte de verdade). */
function markdownChains(): string[] {
  const md = fs.readFileSync(CATALOG_MARKDOWN_FILE, 'utf-8');
  const section = md.slice(md.search(/^## 4\./m), md.search(/^## 5\./m));
  return section
    .split(/\r?\n/)
    .filter(l => /^\|\s*\d+\s*\|/.test(l))
    .map(l => (l.match(/\*\*([^*]+)\*\*/) || ['', ''])[1].trim());
}

describe('ADR-037 — catálogo canônico de menus 06.05.02', () => {
  test('115 caminhos finais, idênticos 1:1 às tabelas da seção 4', () => {
    assert.equal(catalog.version, '06.05.02', 'versão do catálogo');
    assert.equal(catalog.paths.length, 115, 'total de caminhos finais');
    assert.deepEqual(catalog.paths.map(p => txt(p.chain)), markdownChains(), 'catálogo x markdown');
    assert.equal(new Set(catalog.paths.map(p => txt(p.chain))).size, 115, 'sem cadeias duplicadas');
    assert.equal(catalog.paths.filter(p => p.chain[0] === USER_MENU_ROOT).length, 5, 'cinco opções no menu do usuário');
    assert.equal(catalog.crossCheck.mismatches.length, 0, `divergências com o manifest: ${catalog.crossCheck.mismatches.join('; ')}`);
    for (const p of catalog.paths) assert.equal(p.depth, p.chain.length, `profundidade de ${txt(p.chain)}`);
  });

  test('nós intermediários entram no formato do resolvedor', () => {
    assert.equal(ITEMS.length, catalog.nodes.length, 'um item por nó');
    assert.equal(ITEMS.filter(i => i.hasChildren).length, 7 + 12, '6 raízes com submenu + Olá + 12 submenus intermediários');
    const sub = ITEMS.find(i => txt(i.chain) === 'Configurações > Cadastros auxiliares > Pessoa física');
    assert.equal(sub?.hasChildren, true, 'Pessoa física é submenu');
    assert.equal(findExactPath(['Históricos'])?.isLeaf, true, 'Históricos é tela final de profundidade 1');
  });

  test('4 homônimos exatos, sem o fantasma "0" nem o painel "9+"', () => {
    assert.deepEqual(catalog.homonyms.map(h => h.label), ['Consultas', 'Cadastros', 'Comunicações', 'Mensalistas'], 'rótulos homônimos');
    const consultas = catalog.homonyms.find(h => h.label === 'Consultas');
    assert.deepEqual(
      consultas?.occurrences.map(o => `${txt(o.chain)}:${o.role}`),
      ['Firmas > Consultas:submenu', 'Notas > Consultas:submenu', 'Administração > Controle de Estoque > Consultas:leaf'],
      'papéis de Consultas'
    );
    assert.equal(catalog.nearHomonymFamilies.length, 14, 'famílias de quase-homônimos');
    for (const n of catalog.nodes) {
      assert.equal(n.chain.some(s => s === '0' || s === '9+'), false, `nó proibido ${txt(n.chain)}`);
    }
    assert.equal(isHomonym('consultas'), true, 'Consultas é homônimo');
    assert.equal(isHomonym('Cartão de assinatura'), false, 'Cartão de assinatura não é homônimo');
  });

  test('consultas por cadeia e por folha (acento/caixa, chave de folha)', () => {
    assert.equal(findExactPath(['configuracoes', 'PARAMETRIZACOES'])?.isLeaf, true, 'cadeia sem acento e em caixa alta');
    assert.equal(txt(findExactPath(['Olá, Fulano', 'Alterar senha'])?.chain), 'Olá, [usuário] > Alterar senha', 'Olá, <nome> casa com o marcador');
    assert.equal(findExactPath(['Olá Fulano , seja bem-vindo!', 'Alterar senha']), null, 'saudação fantasma não é o menu do usuário');
    assert.deepEqual(findByLeaf('Tipos de Participação').map(h => `${txt(h.node.chain)}:${h.basis}`), ['Configurações > Cadastros auxiliares > Participação:leaf_key'], 'chave de folha');
    assert.equal(leafExists('Feriados'), true, 'Feriados existe');
    assert.equal(leafExists('Cidade'), false, 'Cidade não existe');
  });
});

describe('ADR-037 — novas equivalências explícitas contra o catálogo', () => {
  const cases: Array<[string, string, string[]]> = [
    ['Configurações > Parâmetros Gerais > Armazenamento e GED', 'Configurações > Parametrizações', ['Armazenamento e GED']],
    ['Configurações > Parâmetros de NFS-e > Regras de Balcão', 'Configurações > Parametrizações', ['Regras de Balcão']],
    ['Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas', 'Configurações > Parametrizações', ['Valores e Tarifas']],
    ['Configurações > Parâmetros de Integração > Certificado Digital', 'Configurações > Parametrizações', ['Certificado Digital']],
    ['Configurações > Grupos e Perfis de Acesso', 'Configurações > Perfis e permissões de acesso', []],
    ['Notas > Cadastros auxiliares > Grupo de itens','Configurações > Tabela de custas > Grupo de item', []],
    ['Notas > Cadastros auxiliares > Naturezas', 'Configurações > Cadastros auxiliares > Natureza', []],
    ['Administração > Cadastros auxiliares > Área de atuação', 'Configurações > Cadastros auxiliares > Pessoa física > Área de Atuação', []],
    ['Notas > Certidões > Consulta de Certidões', 'Notas > Consultas > Certidões e serviços', []],
    ['Notas > Certidões > Novo Pedido de Certidão', 'Notas > Nova certidão e serviço', []],
    ['Notas > Pedido de certidão', 'Notas > Nova certidão e serviço', []],
    ['Firmas > Atendimento > Abertura de pedido com senha', 'Firmas > Abertura de pedido', []],
    ['Livros > Gestão e Controle de Folhas', 'Administração > Controle de Livros', ['Gestão e Controle de Folhas']],
    ['Configurações > Livros Notariais > Cadastro e Encerramento', 'Administração > Controle de Livros', ['Cadastro e Encerramento']],
    ['Firmas > Livros', 'Administração > Controle de Livros', []],
    ['Orion Estoque > Cadastros > Produto', 'Administração > Controle de Estoque > Cadastros > Produto', []],
    ['Orion Estoque > Produto', 'Administração > Controle de Estoque > Cadastros > Produto', []],
    ['Administração > Consultas > Estoque', 'Administração > Controle de Estoque > Consultas', []],
    ['Módulos > Selo Digital > Auditoria / Conferência Semanal', 'Administração > Comunicações > Auditoria de Selos', []],
    ['Configurações > Alterar senha', 'Olá, [usuário] > Alterar senha', []],
    ['Configurações > Usuários > Autenticação em dois fatores', 'Olá, [usuário] > Autenticação em dois fatores', []],
    ['Usuários > Cadastrar biometria', 'Olá, [usuário] > Cadastrar biometria', []],
    ['Configurações > Fale conosco', 'Olá, [usuário] > Fale conosco', []]
  ];

  test('cada caminho legado documentado resolve para a cadeia do catálogo', () => {
    for (const [documented, real, tail] of cases) {
      const r = resolveCanonicalMenuPath(doc(documented), ITEMS);
      assert.equal(txt(r?.chain), real, `cadeia de ${documented}`);
      assert.deepEqual(r?.tail, tail, `cauda de ${documented}`);
      assert.equal(r?.basis, 'explicit_equivalence', `base de ${documented}`);
    }
  });

  test('sem destino único não resolve (nada é adivinhado)', () => {
    for (const documented of [
      'Notas > Cadastros auxiliares > Tipos de anexo',
      'Orion Estoque > Livros Notariais > Controle de Folhas Soltas',
      'Módulos > Selo Digital > Transmissão de Lote',
      'Notas > Dashboard de Envio para Registro'
    ]) {
      assert.equal(resolveCanonicalMenuPath(doc(documented), ITEMS), null, `não deveria resolver: ${documented}`);
    }
  });

  test('toda entrada da tabela aponta para um nó existente no catálogo', () => {
    for (const eq of EXPLICIT_MENU_EQUIVALENCES) {
      assert.notEqual(findExactPath(eq.real), null, `destino ausente do catálogo: ${txt(eq.real)}`);
      assert.equal(eq.userMenu === true, eq.real[0] === USER_MENU_ROOT, `marca userMenu coerente em ${txt(eq.documented)}`);
    }
  });

  test('menu do usuário na árvore AO VIVO: devolve "Olá, <nome>" e ignora a saudação fantasma', () => {
    const live: CanonicalMenuItem[] = [
      { chain: ['Configurações'], hasChildren: true },
      { chain: ['Configurações', 'Usuários'], hasChildren: false },
      { chain: ['Olá, Fulano'], hasChildren: true },
      { chain: ['Olá Fulano , seja bem-vindo!'], hasChildren: true },
      { chain: ['Olá, Fulano', 'Alterar senha'], hasChildren: false },
      { chain: ['Olá, Fulano', 'Autenticação em dois fatores'], hasChildren: false }
    ];
    const r = resolveCanonicalMenuPath(doc('Configurações > Alterar senha'), live);
    assert.equal(txt(r?.chain), 'Olá, Fulano > Alterar senha', 'cadeia real com o nome do usuário');

    const asMenu: MenuTreeItem[] = live.map(i => ({ ...i, selectors: i.chain.map((_, k) => `[m${k}]`), disabled: false }));
    const paths: DocumentedMenuPath[] = [{ segments: doc('Configurações > Usuários > Autenticação em dois fatores'), sourceText: '**x**' }];
    const m = chooseMenuItem(paths, asMenu);
    assert.equal(txt(m?.item.chain), 'Olá, Fulano > Autenticação em dois fatores', 'chooseMenuItem acha o item real');
    assert.equal(m?.canonicalBasis, 'explicit_equivalence', 'base explícita');
  });
});

describe('ADR-037 — Camada 2: tela citada sem ">"', () => {
  test('apelido curado e folha idêntica', () => {
    const grupos = resolveSingleSegmentScreen('Grupos e Perfis de Acesso');
    assert.equal(grupos.status, 'resolved', 'Grupos e Perfis de Acesso resolve');
    if (grupos.status === 'resolved') {
      assert.equal(txt(grupos.chain), 'Configurações > Perfis e permissões de acesso', 'destino de grupos');
      assert.equal(grupos.basis, 'screen_alias', 'base apelido');
    }
    const cartao = resolveSingleSegmentScreen('**Cartão de Assinatura**');
    assert.equal(cartao.status === 'resolved' && txt(cartao.chain), 'Firmas > Cadastros > Cartão de assinatura', 'cartão de assinatura');
    assert.equal(cartao.status === 'resolved' && cartao.basis, 'exact_leaf', 'base folha idêntica');
    const fichas = resolveSingleSegmentScreen('Fichas / Cartões de Assinatura');
    assert.equal(fichas.status === 'resolved' && txt(fichas.chain), 'Firmas > Cadastros > Cartão de assinatura', 'alternativa com barra');
  });

  test('homônimo: ambíguo sem módulo, resolvido pelo módulo ou pelo contexto', () => {
    const semModulo = resolveSingleSegmentScreen('Consultas');
    assert.equal(semModulo.status, 'ambiguous', 'Consultas sem módulo é ambíguo');
    assert.equal(semModulo.status === 'ambiguous' && semModulo.candidates.length, 3, 'três candidatos');

    const firmas = resolveSingleSegmentScreen('Consultas', { modulo: 'firmas' });
    assert.equal(firmas.status === 'resolved' && txt(firmas.chain), 'Firmas > Consultas', 'módulo firmas');
    assert.equal(firmas.status === 'resolved' && firmas.disambiguatedBy, 'modulo', 'desempate por módulo');
    assert.equal(firmas.status === 'resolved' && firmas.isLeaf, false, 'destino é submenu');

    const estoque = resolveSingleSegmentScreen('Consultas', { modulo: 'geral', routineTitle: 'Consultar o controle de estoque de produtos' });
    assert.equal(estoque.status === 'resolved' && txt(estoque.chain), 'Administração > Controle de Estoque > Consultas', 'contexto de estoque');

    const mensalistas = resolveSingleSegmentScreen('Mensalistas');
    assert.equal(mensalistas.status === 'resolved' && txt(mensalistas.chain), 'Administração > Mensalistas > Mensalistas', 'auto-homônimo');
    assert.equal(mensalistas.status === 'resolved' && mensalistas.disambiguatedBy, 'ancestor_collapse', 'colapso do ancestral');
  });

  test('não encontrado e nunca por substring intra-palavra', () => {
    for (const label of ['Tipos de anexo', 'Cidade', 'Autenticidade', 'Selo', 'Livro']) {
      assert.equal(resolveSingleSegmentScreen(label).status, 'not_found', `não deveria resolver: ${label}`);
    }
    assert.equal(resolveSingleSegmentScreen('Configurações > Usuários').status, 'not_found', 'caminho com ">" não é segmento único');
  });

  test('todo apelido curado aponta para um nó do catálogo', () => {
    for (const a of SCREEN_ALIASES) assert.notEqual(findExactPath(a.chain), null, `apelido sem destino: ${txt(a.chain)}`);
  });
});

describe('ADR-037 — Camada 3: semântica fechada', () => {
  test('texto sem relação com a árvore: SEM_EQUIVALENTE_NA_ARVORE', () => {
    const r = resolveClosedSemantic({ stepTexts: ['Prepare um café coado com açúcar mascavo.', 'Sirva na xícara.'], routineTitle: 'Receita de café' });
    assert.equal(r.status, SEM_EQUIVALENTE_NA_ARVORE, 'sem equivalente');
  });

  test('radicais inteiros da folha + título + módulo resolvem um destino único', () => {
    const r = resolveClosedSemantic({
      stepTexts: ['Acesse a tela de feriados.', 'Clique em Adicionar e informe a data.'],
      routineTitle: 'Cadastrar feriados municipais',
      modulo: 'config'
    });
    assert.equal(r.status === 'resolved' && txt(r.chain), 'Configurações > Cadastros auxiliares > Feriados', 'feriados');
  });

  test('prompt fechado e parser estrito', () => {
    const prompt = buildClosedSemanticPrompt({ stepTexts: ['Acesse a tela.'], routineTitle: 'Teste' });
    for (const p of catalog.paths) assert.equal(prompt.includes(txt(p.chain)), true, `prompt sem ${txt(p.chain)}`);
    assert.equal(prompt.includes(SEM_EQUIVALENTE_NA_ARVORE), true, 'prompt com o token');

    const ok = parseClosedSemanticAnswer('Notas > Consultas > Protocolos', catalog);
    assert.equal(ok?.status === 'resolved' && txt(ok.chain), 'Notas > Consultas > Protocolos', 'cadeia literal');
    assert.deepEqual(parseClosedSemanticAnswer('  SEM_EQUIVALENTE_NA_ARVORE \n', catalog), { status: SEM_EQUIVALENTE_NA_ARVORE }, 'token');
    for (const raw of [
      'Acho que é Notas > Novo protocolo',
      '12. Notas > Novo protocolo',
      'Notas > Livros',
      'Notas Consultas Protocolos',
      'Notas > Novo protocolo\nporque abre protocolo',
      ''
    ]) {
      assert.equal(parseClosedSemanticAnswer(raw, catalog), null, `deveria rejeitar: ${JSON.stringify(raw)}`);
    }
  });
});
