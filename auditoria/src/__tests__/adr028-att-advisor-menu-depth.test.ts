import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import yaml from 'yaml';
import {
  attDiagnosisYamlLines,
  buildAttDiagnosis,
  buildScreenInventoryScript,
  captureAttScreenDiagnosis,
  contextPrintName,
  parseScreenInventory,
  renderAttDiagnosisTip,
  screenTokens,
  suggestScreenMatches,
  type ScreenStructuralInventory
} from '../att-screen-advisor.js';
import { chooseMenuItem, extractMenuPaths, type MenuTreeItem } from '../menu-path.js';
import { buildRevisedRoutineDocument } from '../report.js';
import type { ParsedRoutine, RoutineStep } from '../types.js';

const stepOf = (stepNumber: number, rawText: string, targets: string[]): RoutineStep => ({
  stepNumber,
  rawText,
  targets,
  actionType: 'click'
});

const inventory: ScreenStructuralInventory = {
  route: '#/configuracao/parametrizacao',
  title: 'Parâmetros Gerais',
  inModal: false,
  sections: ['Dados do Cartório', 'Certidões'],
  tabs: [
    { label: 'Geral', active: true },
    { label: 'Impressão', active: false }
  ],
  fields: [
    { label: 'Modelo de recibo', type: 'select', section: 'Impressão', required: false },
    { label: 'Cidade', type: 'text', section: 'Dados do Cartório', required: true },
    { label: 'Prazo de entrega (dias)', type: 'text', section: 'Certidões', required: false }
  ],
  buttons: [
    { label: 'Salvar', primary: true, section: 'Certidões' },
    { label: 'Cancelar', primary: false }
  ]
};

describe('ADR-028 §1 — Consultor Propositivo de Tela [ATT]', () => {
  test('tokens: sem acento, sem stopword e com plural simples', () => {
    assert.deepEqual(screenTokens('Prazo de Entrega (dias)'), ['prazo', 'entrega', 'dia']);
  });

  test('sugere o elemento real de maior afinidade funcional, com a seção citada no passo', () => {
    const { suggestions, unmatched } = suggestScreenMatches(
      ['Prazo de entrega'],
      inventory,
      'No bloco **Certidões**, preencha o campo **Prazo de entrega**.'
    );
    assert.equal(unmatched.length, 0, 'o alvo tem correspondente');
    assert.equal(suggestions[0].actual, 'Prazo de entrega (dias)');
    assert.equal(suggestions[0].kind, 'field');
    assert.equal(suggestions[0].section, 'Certidões');
    assert.ok(suggestions[0].similarity >= 0.45, `similaridade ${suggestions[0].similarity}`);
  });

  test('guarda anti-substring: Autenticidade nunca sugere Cidade', () => {
    const { suggestions, unmatched } = suggestScreenMatches(['Autenticidade'], inventory, 'Informe a **Autenticidade**.');
    assert.equal(
      suggestions.some(s => s.actual === 'Cidade'),
      false,
      'Autenticidade não pode casar com Cidade'
    );
    assert.deepEqual(unmatched, ['Autenticidade']);
  });

  test('alvo sem afinidade fica em "sem correspondência" e gera a dica de revisão', () => {
    const d = buildAttDiagnosis({
      stepNumber: 4,
      stepText: 'Clique em **Redefinir Senha Manualmente**.',
      targets: ['Redefinir Senha Manualmente'],
      inventory,
      now: new Date('2026-11-17T03:00:00Z')
    });
    assert.deepEqual(d.unmatched, ['Redefinir Senha Manualmente']);
    assert.match(d.rewriteHint || '', /não tem correspondente funcional nesta tela/);
  });

  test('passo de caminho de menu não gera correspondências (a rota não é adivinhada)', () => {
    const d = buildAttDiagnosis({
      stepNumber: 1,
      stepText: 'Acesse **Notas > Protocolo**.',
      targets: ['Notas > Protocolo'],
      inventory,
      menuPath: true
    });
    assert.deepEqual(d.suggestions, []);
    assert.deepEqual(d.targets, []);
    assert.match(renderAttDiagnosisTip(d), /Caminho de menu/);
  });

  test('nome da print de contexto segue o padrão passo-NN-contexto-att.png (fora da paridade passo-NN[-x])', () => {
    assert.equal(contextPrintName(7), 'passo-07-contexto-att.png');
    assert.equal(/^passo-\d+(-[a-z])?\.png$/i.test(contextPrintName(7)), false);
  });

  test('script de inventário é somente leitura e exclui a navegação lateral', () => {
    const script = buildScreenInventoryScript();
    assert.match(script, /nav-stacked/);
    assert.equal(/\.click\(|\.submit\(|dispatchEvent|\.value\s*=/.test(script), false, 'o script não pode acionar nada');
  });

  test('parseScreenInventory descarta entradas sem rótulo e tolera lixo', () => {
    assert.equal(parseScreenInventory(null), null);
    const inv = parseScreenInventory({ route: '#/x', fields: [{ label: '' }, { label: 'CPF', type: 'text' }], buttons: [{ label: 'OK' }, {}] });
    assert.equal(inv?.fields.length, 1);
    assert.equal(inv?.buttons.length, 1);
  });

  test('captura: cliente fictício -> diagnóstico; print de contexto só quando o passo não tem imagem', async () => {
    let screenshots = 0;
    const client = { evalJson: async () => ({ ...inventory }) } as any;
    const withPrint = await captureAttScreenDiagnosis(client, {
      stepNumber: 3,
      stepText: 'Clique em **Salvar**.',
      targets: ['Salvar'],
      existingPrint: 'passo-03.png',
      ensureContextPrint: async () => {
        screenshots++;
        return contextPrintName(3);
      }
    });
    assert.equal(withPrint?.contextPrint, 'passo-03.png');
    assert.equal(screenshots, 0, 'passo já tem print: nada a fotografar');
    const without = await captureAttScreenDiagnosis(client, {
      stepNumber: 3,
      stepText: 'Clique em **Salvar**.',
      targets: ['Salvar'],
      ensureContextPrint: async () => {
        screenshots++;
        return contextPrintName(3);
      }
    });
    assert.equal(without?.contextPrint, 'passo-03-contexto-att.png');
    assert.equal(screenshots, 1);
  });

  test('falha de leitura devolve null (o bloqueio [ATT] segue sem o Raio-X)', async () => {
    const client = {
      evalJson: async () => {
        throw new Error('boom');
      }
    } as any;
    assert.equal(await captureAttScreenDiagnosis(client, { stepNumber: 1, stepText: '', targets: [] }), null);
  });

  test('YAML: diagnostico_tela_att é válido e vai no auditoria_ui', () => {
    const d = buildAttDiagnosis({ stepNumber: 2, stepText: 'Clique em **Salvar**.', targets: ['Salvar'], inventory, now: new Date('2026-11-17T03:00:00Z') });
    const doc = yaml.parse(`auditoria_ui:\n${attDiagnosisYamlLines(d).join('\n')}`);
    const diag = doc.auditoria_ui.diagnostico_tela_att;
    assert.equal(diag.rota, '#/configuracao/parametrizacao');
    assert.deepEqual(diag.secoes, ['Dados do Cartório', 'Certidões']);
    assert.equal(diag.campos.length, 3);
    assert.equal(diag.correspondencias_sugeridas[0].elemento_real, 'Salvar');
  });

  test('relatório [ATT]: TIP logo abaixo do CAUTION, frontmatter com diagnostico_tela_att e texto original intacto', () => {
    const steps = [stepOf(1, 'Clique em **Prazo de entrega**.', ['Prazo de entrega'])];
    const parsed: ParsedRoutine = {
      id: 'M-99.1',
      titulo: 'Teste',
      modulo: 'm',
      secao: 'M',
      tem_video: false,
      frontmatter: {},
      descricao: 'Descrição original.',
      steps,
      observacoes: [],
      rawContent: ''
    };
    const d = buildAttDiagnosis({ stepNumber: 1, stepText: steps[0].rawText, targets: steps[0].targets, inventory, contextPrint: 'passo-01.png' });
    const { content } = buildRevisedRoutineDocument({
      parsed,
      results: [{ stepNumber: 1, originalText: steps[0].rawText, validatedText: steps[0].rawText, isModified: false, screenshotRawPath: '', screenshotAnnotatedPath: '', printFiles: ['passo-01.png'], status: 'blocked', errorMessage: 'sem evidência' }],
      divergences: [],
      status: 'atualizacao_editorial',
      block: { kind: 'manual_outdated', tipo: 'Defasagem Editorial do Manual', motivo: 'm', roteiro: ['r'] },
      attDiagnosis: d
    });
    assert.match(content, /> \[!TIP\] \*\*Raio-X da Tela Atual \(Subsídio para Atualização do Manual\):\*\*/);
    assert.ok(content.indexOf('[!CAUTION]') < content.indexOf('[!TIP]'), 'TIP vem depois do CAUTION');
    assert.ok(content.indexOf('[!TIP]') < content.indexOf('#### Descrição:'), 'TIP vem antes da descrição');
    assert.match(content, /1\. Clique em \*\*Prazo de entrega\*\*\./);
    const fm = yaml.parse(content.split('---')[1]);
    assert.equal(fm.auditoria_ui.diagnostico_tela_att.passo, 1);
  });

  test('o Raio-X só é emitido em rotina com a tag ATT', () => {
    const steps = [stepOf(1, 'Clique em **Salvar**.', ['Salvar'])];
    const parsed: ParsedRoutine = { id: 'M-99.2', titulo: 'T', modulo: 'm', secao: 'M', tem_video: false, frontmatter: {}, descricao: 'D', steps, observacoes: [], rawContent: '' };
    const d = buildAttDiagnosis({ stepNumber: 1, stepText: steps[0].rawText, targets: steps[0].targets, inventory });
    const { content } = buildRevisedRoutineDocument({
      parsed,
      results: [],
      divergences: [],
      status: 'dependencia_dados_banco',
      block: { kind: 'empty_data', tipo: 'Dependência de Dados', motivo: 'm', roteiro: ['r'] },
      attDiagnosis: d
    });
    assert.equal(content.includes('Raio-X da Tela Atual'), false);
    assert.equal(content.includes('diagnostico_tela_att'), false);
  });
});

const item = (chain: string[], hasChildren = false): MenuTreeItem => ({
  chain,
  selectors: chain.map((_, i) => `[m-${chain.slice(0, i + 1).join('-')}]`),
  disabled: false,
  hasChildren
});

describe('ADR-028 §2 — desempate de menu por menor profundidade de cadeia', () => {
  const paths = extractMenuPaths(stepOf(1, 'Acesse **Notas > Protocolo**.', []));

  test('Notas > Protocolos (prof. 2) vence Notas > Consultas > Protocolos (prof. 3)', () => {
    const items = [
      item(['Notas']),
      item(['Notas', 'Protocolos']),
      item(['Notas', 'Consultas']),
      item(['Notas', 'Consultas', 'Protocolos'])
    ];
    const match = chooseMenuItem(paths, items);
    assert.ok(match, 'o empate de profundidades diferentes não pode bloquear');
    assert.deepEqual(match!.item.chain, ['Notas', 'Protocolos']);
    assert.deepEqual(match!.depthTieBreak?.discarded, ['Notas > Consultas > Protocolos']);
    assert.match(match!.reason, /menor profundidade de cadeia/);
  });

  test('a ordem da árvore não altera o resultado', () => {
    const items = [item(['Notas', 'Consultas', 'Protocolos']), item(['Notas', 'Protocolos']), item(['Notas']), item(['Notas', 'Consultas'])];
    assert.deepEqual(chooseMenuItem(paths, items)!.item.chain, ['Notas', 'Protocolos']);
  });

  test('empate na MESMA profundidade segue bloqueado por ambiguidade', () => {
    const amb = [
      item(['Notas']),
      item(['Notas', 'Cadastros', 'Protocolos']),
      item(['Notas', 'Consultas', 'Protocolos'])
    ];
    assert.equal(chooseMenuItem(paths, amb), null, 'mesma profundidade: sem desempate');
  });

  test('módulos raiz diferentes empatados não são desempatados por profundidade', () => {
    const items = [
      item(['Financeiro']),
      item(['Relatorios']),
      item(['Financeiro', 'Protocolos']),
      item(['Relatorios', 'Consultas', 'Protocolos'])
    ];
    assert.equal(chooseMenuItem(paths, items), null, 'raízes diferentes: ambiguidade preservada');
  });

  test('o ancestral citado no manual continua decidindo antes do desempate', () => {
    const items = [item(['Notas']), item(['Financeiro']), item(['Notas', 'Protocolos']), item(['Financeiro', 'Protocolos'])];
    assert.deepEqual(chooseMenuItem(paths, items)?.item.chain, ['Notas', 'Protocolos']);
  });
});
