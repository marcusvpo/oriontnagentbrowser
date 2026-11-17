import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, test } from 'node:test';
import { executeStepAction } from '../executor.js';
import { pickPeriodPair, stepNeedsGridRows, widePeriod, type FilterInputInfo } from '../grid-prefilter.js';
import { canonStem, EXPLICIT_MENU_EQUIVALENCES, leafAlternatives, leafKey, resolveCanonicalMenuPath, type CanonicalMenuItem } from '../menu-canonical.js';
import { chooseMenuItem, extractMenuPaths, type DocumentedMenuPath, type MenuTreeItem } from '../menu-path.js';
import { mineClusters } from '../mine-att-clusters.js';
import { extractBoldTargets } from '../parser.js';
import { routeKey, routeSynonymsFor, ROUTE_LABEL_SYNONYMS } from '../route-synonyms.js';
import type { DOMResolvedGeometry, RoutineStep, SmartLocatorResult } from '../types.js';

/** Recorte da árvore de navegação REAL do Orion TN 6.0 (140 itens lidos ao vivo em Produtos). */
const REAL: CanonicalMenuItem[] = [
  { chain: ['Dashboard'], hasChildren: true },
  { chain: ['Firmas'], hasChildren: true },
  { chain: ['Firmas', 'Abertura de pedido'], hasChildren: false },
  { chain: ['Firmas', 'Reconhecimento de firmas'], hasChildren: false },
  { chain: ['Firmas', 'Consultas'], hasChildren: true },
  { chain: ['Firmas', 'Consultas', 'Reconhecimentos de firmas'], hasChildren: false },
  { chain: ['Firmas', 'Consultas', 'Serviços praticados'], hasChildren: false },
  { chain: ['Firmas', 'Cadastros'], hasChildren: true },
  { chain: ['Firmas', 'Cadastros', 'Cartão de assinatura'], hasChildren: false },
  { chain: ['Firmas', 'Cadastros', 'Sinal público'], hasChildren: false },
  { chain: ['Notas'], hasChildren: true },
  { chain: ['Notas', 'Protocolos'], hasChildren: false },
  { chain: ['Notas', 'Nova certidão e serviço'], hasChildren: false },
  { chain: ['Notas', 'Certidões e serviços'], hasChildren: false },
  { chain: ['Notas', 'Consultas'], hasChildren: true },
  { chain: ['Notas', 'Consultas', 'Protocolos'], hasChildren: false },
  { chain: ['Notas', 'Consultas', 'Certidões e serviços'], hasChildren: false },
  { chain: ['Administração'], hasChildren: true },
  { chain: ['Administração', 'Comunicações'], hasChildren: true },
  { chain: ['Administração', 'Comunicações', 'COAF'], hasChildren: false },
  { chain: ['Administração', 'Comunicações', 'Outras comunicações'], hasChildren: false },
  { chain: ['Administração', 'Controle de Estoque'], hasChildren: true },
  { chain: ['Administração', 'Controle de Estoque', 'Cadastros'], hasChildren: true },
  { chain: ['Administração', 'Controle de Estoque', 'Cadastros', 'Categoria'], hasChildren: false },
  { chain: ['Administração', 'Controle de Estoque', 'Cadastros', 'Produto'], hasChildren: false },
  { chain: ['Configurações'], hasChildren: true },
  { chain: ['Configurações', 'Modelos de impressão'], hasChildren: true },
  { chain: ['Configurações', 'Modelos de impressão', 'Etiquetas diversas'], hasChildren: false },
  { chain: ['Configurações', 'Cadastros auxiliares'], hasChildren: true },
  { chain: ['Configurações', 'Cadastros auxiliares', 'Natureza'], hasChildren: false },
  { chain: ['Configurações', 'Cadastros auxiliares', 'Participação'], hasChildren: false },
  { chain: ['Configurações', 'Cadastros auxiliares', 'Tipo de documento'], hasChildren: false },
  { chain: ['Configurações', 'Cadastros auxiliares', 'Tipo de e-mail'], hasChildren: false },
  { chain: ['Configurações', 'Usuários'], hasChildren: false },
  { chain: ['Configurações', 'Parametrizações'], hasChildren: false }
];
const asMenuItems = (items: CanonicalMenuItem[]): MenuTreeItem[] =>
  items.map(i => ({ ...i, selectors: i.chain.map((_, k) => `[m${k}]`), disabled: i.disabled ?? false }));

const doc = (text: string): string[] => text.split('>').map(s => s.trim());

describe('ADR-029 — equivalências canônicas de caminho de menu', () => {
  test('chave de folha: plural, acento e palavras genéricas não distinguem rótulos', () => {
    assert.equal(canonStem('certidoes'), 'certidao');
    assert.deepEqual(leafKey('Tipos de Participação'), leafKey('Participação'));
    assert.deepEqual(leafKey('Consulta de Certidões e Serviços'), leafKey('Certidões e serviços'));
    assert.deepEqual(leafKey('Consulta de Reconhecimento de Firmas'), leafKey('Reconhecimentos de firmas'));
    // "Tipo de documento" mantém o radical distintivo: nunca casa com "Tipo de e-mail"
    assert.notDeepEqual(leafKey('Tipos de documentos'), leafKey('Tipo de e-mail'));
    assert.deepEqual(leafAlternatives('Fichas / Cartões de Assinatura'), ['Fichas', 'Cartões de Assinatura']);
  });

  test('irmão com a mesma chave de folha sob o prefixo REAL é o destino único', () => {
    const cases: Array<[string, string]> = [
      ['Notas > Consultas > Consulta de Certidões e Serviços', 'Notas > Consultas > Certidões e serviços'],
      ['Firmas > Consultas > Consulta de Reconhecimento de Firmas', 'Firmas > Consultas > Reconhecimentos de firmas'],
      ['Configurações > Cadastros Auxiliares > Tipos de Participação', 'Configurações > Cadastros auxiliares > Participação'],
      ['Configurações > Cadastros Auxiliares > Tipos de documentos', 'Configurações > Cadastros auxiliares > Tipo de documento']
    ];
    for (const [documented, real] of cases) {
      const r = resolveCanonicalMenuPath(doc(documented), REAL);
      assert.ok(r, `sem resolução para ${documented}`);
      assert.equal(r!.chain.join(' > '), real);
      assert.equal(r!.basis, 'generic_leaf_key');
      assert.deepEqual(r!.tail, []);
    }
  });

  test('tabela explícita: submenu legado vira a tela real e a cauda é aba', () => {
    const r = resolveCanonicalMenuPath(doc('Administração > Parâmetros > Captura e digitalização'), REAL);
    assert.ok(r);
    assert.equal(r!.chain.join(' > '), 'Configurações > Parametrizações');
    assert.deepEqual(r!.tail, ['Captura e digitalização']);
    assert.equal(r!.basis, 'explicit_equivalence');

    const etiqueta = resolveCanonicalMenuPath(doc('Administração > Parâmetros > Modelos de etiqueta'), REAL);
    assert.equal(etiqueta!.chain.join(' > '), 'Configurações > Modelos de impressão > Etiquetas diversas');
    assert.deepEqual(etiqueta!.tail, []);

    const certidao = resolveCanonicalMenuPath(doc('Certidões > Novo Pedido de Certidão'), REAL);
    assert.equal(certidao!.chain.join(' > '), 'Notas > Nova certidão e serviço');

    const balcao = resolveCanonicalMenuPath(['Balcão de Firmas', 'Fichas / Cartões de Assinatura'], REAL);
    assert.equal(balcao!.chain.join(' > '), 'Firmas > Cadastros > Cartão de assinatura');
  });

  test('folha sem filhos com segmentos sobrando: o resto é aba/seção da tela', () => {
    const r1 = resolveCanonicalMenuPath(doc('Configurações > Parametrizações > Consumo de Insumos'), REAL);
    assert.equal(r1!.chain.join(' > '), 'Configurações > Parametrizações');
    assert.deepEqual(r1!.tail, ['Consumo de Insumos']);
    assert.equal(r1!.basis, 'tail_as_screen_section');

    const r2 = resolveCanonicalMenuPath(doc('Administração > Comunicações > Outras Comunicações > E-Notariado'), REAL);
    assert.equal(r2!.chain.join(' > '), 'Administração > Comunicações > Outras comunicações');
    assert.deepEqual(r2!.tail, ['E-Notariado']);
  });

  test('sem prova não resolve: raiz inexistente, ambiguidade e destino ausente da árvore lida agora', () => {
    assert.equal(resolveCanonicalMenuPath(doc('Livros > Gestão e Controle de Folhas'), REAL), null);
    assert.equal(resolveCanonicalMenuPath(doc('Notas > Cadastros auxiliares > Tipos de anexo'), REAL), null);
    // Dois irmãos com a mesma chave: ambiguidade, nunca adivinha
    const ambiguous: CanonicalMenuItem[] = [
      { chain: ['Notas'], hasChildren: true },
      { chain: ['Notas', 'Certidões e serviços'], hasChildren: false },
      { chain: ['Notas', 'Certidão e serviço'], hasChildren: false }
    ];
    assert.equal(resolveCanonicalMenuPath(doc('Notas > Consulta de Certidões e Serviços'), ambiguous), null);
    // A tabela só vale se a cadeia real existe na árvore lida agora
    const semParametrizacoes = REAL.filter(i => i.chain[1] !== 'Parametrizações');
    assert.equal(resolveCanonicalMenuPath(doc('Administração > Parâmetros > E-mail'), semParametrizacoes), null);
    // Caminho idêntico ao real não é equivalência
    assert.equal(resolveCanonicalMenuPath(doc('Firmas > Cadastros > Cartão de assinatura'), REAL), null);
  });

  test('determinístico: independe da ordem dos itens', () => {
    const reversed = [...REAL].reverse();
    for (const path of ['Notas > Consultas > Consulta de Certidões e Serviços', 'Administração > Parâmetros > E-mail']) {
      assert.deepEqual(resolveCanonicalMenuPath(doc(path), REAL), resolveCanonicalMenuPath(doc(path), reversed));
    }
  });

  test('toda entrada da tabela explícita aponta para uma cadeia real distinta da documentada', () => {
    for (const eq of EXPLICIT_MENU_EQUIVALENCES) {
      assert.ok(eq.real.length >= 2);
      assert.notEqual(eq.documented.join('>'), eq.real.map(s => s.toLowerCase()).join('>'));
      assert.ok(eq.evidence.length > 20, `entrada sem prova: ${eq.documented.join(' > ')}`);
    }
  });

  test('chooseMenuItem aplica a equivalência canônica e carrega a cauda', () => {
    const paths: DocumentedMenuPath[] = [
      { segments: doc('Administração > Parâmetros > Captura e digitalização'), sourceText: '**Administração > Parâmetros > Captura e digitalização**' }
    ];
    const m = chooseMenuItem(paths, asMenuItems(REAL));
    assert.ok(m);
    assert.equal(m!.item.chain.join(' > '), 'Configurações > Parametrizações');
    assert.deepEqual(m!.tail, ['Captura e digitalização']);
    assert.equal(m!.canonicalBasis, 'explicit_equivalence');
    assert.equal(m!.exact, false);

    // Item bloqueado para o perfil nunca é o destino da equivalência
    const blocked = asMenuItems(REAL).map(i => (i.chain.join('>') === 'Configurações>Parametrizações' ? { ...i, disabled: true } : i));
    assert.notEqual(chooseMenuItem(paths, blocked)?.item.chain.join(' > '), 'Configurações > Parametrizações');
  });

  test('chooseMenuItem resolve a folha equivalente sob o prefixo real (as raízes entram no resolvedor)', () => {
    const paths: DocumentedMenuPath[] = [
      { segments: doc('Notas > Consultas > Consulta de Certidões e Serviços'), sourceText: '**Notas > Consultas > Consulta de Certidões e Serviços**' }
    ];
    const m = chooseMenuItem(paths, asMenuItems(REAL));
    assert.ok(m, 'o caminho legado deve resolver pelo irmão de mesma chave de folha');
    assert.equal(m!.item.chain.join(' > '), 'Notas > Consultas > Certidões e serviços');
    assert.equal(m!.canonicalBasis, 'generic_leaf_key');
    assert.equal(m!.tail, undefined);
  });

  test('a guarda da ADR-024 segue de pé: caminho sem equivalente continua sem cura', () => {
    const paths = extractMenuPaths({ stepNumber: 1, rawText: 'Acesse **Livros > Gestão de Livros Notariais**.', targets: ['Livros > Gestão de Livros Notariais'], actionType: 'click' });
    assert.equal(chooseMenuItem(paths, asMenuItems(REAL)), null);
  });
});

describe('ADR-029 — sinônimos contextuais por rota (Cluster C)', () => {
  test('routeKey remove o identificador numérico final', () => {
    assert.equal(routeKey('#/usuario/alterar/1'), '#/usuario/alterar');
    assert.equal(routeKey('#/ficha/cadastrar'), '#/ficha/cadastrar');
    assert.equal(routeKey('#/configuracoes?x=1'), '#/configuracoes');
  });

  test('lookup por rota e rótulo documentado', () => {
    assert.deepEqual(routeSynonymsFor('#/ficha/cadastrar', 'Nome completo')[0].real, ['Nome']);
    assert.deepEqual(routeSynonymsFor('#/ficha/cadastrar', '**RG/CNH**')[0].real, ['RG', 'CNH']);
    assert.deepEqual(routeSynonymsFor('#/produto/cadastrar', 'Nome do Produto')[0].real, ['Descrição']);
    assert.equal(routeSynonymsFor('#/produto/cadastrar', 'Nome completo').length, 0);
    assert.equal(routeSynonymsFor('#/outra/rota', 'Nome completo').length, 0);
  });

  test('toda entrada tem prova textual e rótulos reais', () => {
    for (const s of ROUTE_LABEL_SYNONYMS) {
      assert.ok(s.real.length > 0 && s.evidence.length > 15, `${s.route}:${s.documented}`);
      assert.match(s.route, /^#\//);
    }
  });
});

describe('ADR-029 — pré-filtro de grade vazia', () => {
  const st = (rawText: string, targets: string[]) => ({ rawText, targets });

  test('passo que escolhe/abre item da listagem ou aciona botão de linha precisa de linhas', () => {
    assert.equal(stepNeedsGridRows(st('Filtre e abra o cartão clicando no ícone da **Caneta** (**Alteração**).', ['Caneta', 'Alteração'])), true);
    assert.equal(stepNeedsGridRows(st('Clique em **Consultar** na primeira linha.', ['Consultar'])), true);
    assert.equal(stepNeedsGridRows(st('Selecione o registro desejado na grade.', [])), true);
    assert.equal(stepNeedsGridRows(st('Clique em **Excluir**.', ['Excluir'])), true);
  });

  test('passos de formulário, menu e cadastro não disparam o pré-filtro', () => {
    assert.equal(stepNeedsGridRows(st('Preencha a **Descrição** do modelo.', ['Descrição'])), false);
    assert.equal(stepNeedsGridRows(st('Acesse o menu **Notas > Protocolos**.', ['Notas > Protocolos'])), false);
    assert.equal(stepNeedsGridRows(st('Clique em **Salvar**.', ['Salvar'])), false);
  });

  test('período amplo e escolha do par De/Até', () => {
    const w = widePeriod(new Date(2026, 10, 17));
    assert.deepEqual(w, { from: '01/01/2000', to: '17/11/2026' });
    const mk = (id: string, label: string, over: Partial<FilterInputInfo> = {}): FilterInputInfo => ({
      id,
      type: 'text',
      placeholder: '__/__/____',
      label,
      disabled: false,
      value: '',
      ...over
    });
    const pair = pickPeriodPair([
      mk('inputNome', 'Pesquisar por nome', { placeholder: '' }),
      mk('dataDigitacaoInicial', 'Período de digitação'),
      mk('dataDigitacaoFinal', '')
    ]);
    assert.equal(pair!.from.id, 'dataDigitacaoInicial');
    assert.equal(pair!.to.id, 'dataDigitacaoFinal');
    assert.equal(pickPeriodPair([mk('inputNome', 'Nome', { placeholder: '' })]), null);
    // campo de data desabilitado não entra
    assert.equal(pickPeriodPair([mk('a', 'x', { disabled: true }), mk('b', '')]), null);
  });
});

describe('ADR-029 — parser sem alvos espúrios', () => {
  test('negrito de pontuação (asterisco de campo obrigatório escapado) não é alvo', () => {
    assert.deepEqual(extractBoldTargets('Os campos marcados com asterisco (**\\***) são obrigatórios: **Nome** e **CPF**.'), ['Nome', 'CPF']);
    assert.deepEqual(extractBoldTargets('Clique em **+** ou em **Salvar**.'), ['Salvar']);
  });
});

describe('ADR-029 — clique da folha de rota curada (Cluster A2)', () => {
  const geometry = { zone: 'any', actionTarget: { clickSelector: '[leaf]' } } as unknown as DOMResolvedGeometry;
  const step: RoutineStep = {
    stepNumber: 1,
    rawText: 'Acesse o menu **Firmas > Termo de comparecimento > Tipos de documentos** e clique em **Adicionar**.',
    targets: ['Firmas > Termo de comparecimento > Tipos de documentos', 'Adicionar'],
    actionType: 'click'
  };
  const makeClient = () => {
    const clicks: string[] = [];
    const client: any = {
      probeActionNode: async () => ({ tagName: 'a', text: 'tipo de documento', box: { x: 1, y: 1, width: 80, height: 20 }, insideNavZone: true, disabled: false }),
      click: async (sel: string) => void clicks.push(sel),
      fill: async () => '',
      wait: async () => '',
      evalJson: async () => null,
      eval: async () => ''
    };
    return { client, clicks };
  };
  const resolved = (layer: string, source: string): SmartLocatorResult =>
    ({
      found: true,
      healed: true,
      geometry,
      matchedTargetName: 'Configurações > Cadastros auxiliares > Tipo de documento',
      divergence: { stepNumber: 1, documentedTarget: 'x', actualElementText: 'y', resolutionLayer: layer, confidence: 0.9, reason: 'r', detectedAt: '', evidence: { source, elementText: 'y', matchedSelector: '[leaf]', box: { x: 0, y: 0, width: 1, height: 1 } } }
    }) as unknown as SmartLocatorResult;

  test('a folha de um caminho de menu resolvido na árvore real é clicada (antes era omitida)', async () => {
    const { client, clicks } = makeClient();
    const res = await executeStepAction(client, step, resolved('menu_path_resolution', 'menu-tree'), geometry);
    assert.equal(res.via, 'measured-node');
    assert.deepEqual(clicks, ['[leaf]']);
  });

  test('casamento parcial fora de caminho de menu continua omitido (guarda da ADR-016 intacta)', async () => {
    const { client, clicks } = makeClient();
    const res = await executeStepAction(client, step, { found: true, healed: false, geometry, matchedTargetName: 'tipo de documento' } as SmartLocatorResult, geometry);
    assert.equal(res.via, 'skipped');
    assert.deepEqual(clicks, []);
  });
});

describe('ADR-029 — higiene dos fontes', () => {
  test('nenhum fonte do motor contém caractere de controle (um "\\b" mal escapado virava backspace num regex)', () => {
    const srcDir = path.resolve(import.meta.dirname, '..');
    const offenders: string[] = [];
    for (const f of fs.readdirSync(srcDir).filter(n => n.endsWith('.ts'))) {
      const text = fs.readFileSync(path.join(srcDir, f), 'utf-8');
      // tab (9), LF (10) e CR (13) são legítimos; qualquer outro controle < 0x20 não é
      if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) offenders.push(f);
    }
    assert.deepEqual(offenders, [], `fontes com caractere de controle: ${offenders.join(', ')}`);
  });
});

describe('ADR-029 — minerador de clusters', () => {
  test('classifica A1 (equivalente na árvore real) e D (tela pressuposta) a partir de relatórios em disco', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mine-'));
    try {
      const rot = path.join(tmp, 'rotinas');
      const tel = path.join(tmp, 'telemetria');
      fs.mkdirSync(path.join(rot, 'config', '[ATT] M-16.2-teste'), { recursive: true });
      fs.mkdirSync(path.join(rot, 'config', '[ATT] M-99.9-teste'), { recursive: true });
      fs.mkdirSync(tel, { recursive: true });
      const report = (id: string, passo: number, stepLine: string, motivo: string) =>
        [
          '---',
          `id: ${id}`,
          'auditoria_ui:',
          '  status: atualizacao_editorial',
          '  review_tags:',
          '    - ATT',
          '  tipo_bloqueio: Defasagem Editorial do Manual (Recurso Inexistente na Tela)',
          '  historico_reauditoria:',
          '    - bloqueio_atual:',
          `        passo: ${passo}`,
          '---',
          '',
          `> **Motivo Técnico:** ${motivo}`,
          '',
          '#### Passo a passo (texto original preservado):',
          `${passo}. ${stepLine}`,
          '',
          '* **Dica**'
        ].join('\n');
      fs.writeFileSync(path.join(rot, 'config', '[ATT] M-16.2-teste', '[ATT] M-16.2-teste-revisado.md'), report('M-16.2', 1, 'Acesse o menu **Administração > Parâmetros > E-mail**.', 'No passo 1, o manual cita um caminho de menu que não existe na versão atual.'));
      fs.writeFileSync(path.join(rot, 'config', '[ATT] M-99.9-teste', '[ATT] M-99.9-teste-revisado.md'), report('M-99.9', 1, 'Na tela do protocolo, clique em **Gerar Recibo**.', 'No passo 1, o manual cita "Gerar Recibo", que não foi localizado.'));
      const treeFile = path.join(tmp, 'tree.json');
      fs.writeFileSync(treeFile, JSON.stringify({ items: REAL }));
      const out = mineClusters({ rotinasDir: rot, telemetryDir: tel, menuTreeFile: treeFile });
      const byId = Object.fromEntries(out.routines.map(r => [r.id, r]));
      assert.equal(byId['M-16.2'].cluster, 'A');
      assert.equal(byId['M-16.2'].subcausa, 'A1_equivalente_canonico_inequivoco');
      assert.equal(byId['M-16.2'].destravavel, true);
      assert.equal(byId['M-99.9'].cluster, 'D');
      assert.equal(byId['M-99.9'].destravavel, false);
      assert.equal(out.totals.analisadas, 2);
      assert.equal(out.canonicalTableCheck.every(c => c.existsInRealTree || c.real.length > 0), true);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});
