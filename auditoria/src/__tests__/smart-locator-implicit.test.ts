/**
 * Testes offline da heurística de Alvos Implícitos (ADR-021 §4). Nenhum navegador é aberto:
 * o AgentBrowserClient é substituído por um stub que devolve rótulos fixos de tela.
 *
 * Execução: npm --prefix auditoria test
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  inferImplicitTerms,
  matchImplicitLabels,
  detectImplicitTargets,
  type FormLabel
} from '../implicit-targets.js';
import type { AgentBrowserClient } from '../browser.js';
import type { RoutineStep } from '../types.js';

const label = (name: string, kind: FormLabel['kind'] = 'label'): FormLabel => ({ name, kind });

/** Stub do cliente: evalJson devolve os rótulos fixos e conta as chamadas. */
function fakeClient(labels: FormLabel[]): { client: AgentBrowserClient; calls: () => number } {
  let calls = 0;
  const client = {
    evalJson: async () => {
      calls++;
      return labels;
    }
  } as unknown as AgentBrowserClient;
  return { client, calls: () => calls };
}

const step = (rawText: string, targets: string[] = []): RoutineStep => ({ rawText, targets } as unknown as RoutineStep);

/** Resolve de ponta a ponta: texto do passo + rótulos da tela -> nomes reais a demarcar. */
function resolve(text: string, screen: FormLabel[]): string[] {
  return matchImplicitLabels(inferImplicitTerms(text), screen);
}

describe('Busca geográfica / filtro combinado', () => {
  const text = 'localize a cidade pelo campo de pesquisa de município ou estado';

  test('extrai um grupo para cidade/município e outro para estado/UF', () => {
    const groups = inferImplicitTerms(text);
    assert.equal(groups.length, 2);
    assert.deepEqual(groups[0].labels, ['cidade', 'municipio']);
    assert.deepEqual(groups[1].labels, ['uf', 'estado']);
  });

  test('casa com UF e Cidade reais da tela, na ordem do DOM', () => {
    const screen = [label('UF'), label('Cidade'), label('CEP')];
    assert.deepEqual(resolve(text, screen), ['UF', 'Cidade']);
  });

  test('casa Município e Estado quando a tela usa esses nomes', () => {
    const screen = [label('Descrição da obra'), label('Estado'), label('Município')];
    assert.deepEqual(resolve(text, screen), ['Estado', 'Município']);
  });

  test('só demarca o que existe: sem UF na tela, devolve apenas Cidade', () => {
    assert.deepEqual(resolve(text, [label('Cidade'), label('CEP')]), ['Cidade']);
  });

  test('placeholder também vale como rótulo real', () => {
    const screen = [label('Pesquisar cidade', 'placeholder')];
    assert.deepEqual(resolve(text, screen), ['Pesquisar cidade']);
  });
});

describe('Intervalo temporal', () => {
  const text = 'informe o período inicial e final desejado e clique em pesquisar';

  test('extrai grupos de início e fim', () => {
    const groups = inferImplicitTerms(text);
    assert.equal(groups.length, 2);
    assert.ok(groups[0].labels.includes('data inicial') && groups[0].labels.includes('periodo inicial'));
    assert.ok(groups[1].labels.includes('data final') && groups[1].labels.includes('periodo final'));
  });

  test('resolve Data Inicial / Data Final', () => {
    const screen = [label('Data Inicial'), label('Data Final'), label('Situação')];
    assert.deepEqual(resolve(text, screen), ['Data Inicial', 'Data Final']);
  });

  test('resolve Período Inicial / Período Final', () => {
    const screen = [label('Período Inicial'), label('Período Final')];
    assert.deepEqual(resolve(text, screen), ['Período Inicial', 'Período Final']);
  });

  test('"data inicial e final" não arrasta o campo genérico "Data de nascimento"', () => {
    const screen = [label('Data de nascimento'), label('Data Inicial'), label('Data Final')];
    assert.deepEqual(resolve('Informe a data inicial e final do intervalo', screen), ['Data Inicial', 'Data Final']);
  });

  test('"inicial" sem contexto de período/data não identifica campo', () => {
    assert.deepEqual(inferImplicitTerms('informe a letra inicial do nome'), []);
  });
});

describe('Identificador único', () => {
  const text = 'digite o número do documento ou CPF da parte no campo correspondente';

  test('extrai CPF e documento', () => {
    const groups = inferImplicitTerms(text);
    assert.deepEqual(groups.map(g => g.noun).sort(), ['cpf', 'documento']);
  });

  test('resolve CPF quando a tela tem CPF', () => {
    assert.deepEqual(resolve(text, [label('Nome'), label('CPF')]), ['CPF']);
  });

  test('resolve Documento quando a tela tem Documento', () => {
    assert.deepEqual(resolve(text, [label('Nome'), label('Documento')]), ['Documento']);
  });

  test('CPF/CNPJ combinado é demarcado uma única vez', () => {
    assert.deepEqual(resolve(text, [label('CPF/CNPJ')]), ['CPF/CNPJ']);
  });

  test('CPF e Documento distintos na tela: ambos demarcados', () => {
    assert.deepEqual(resolve(text, [label('Nº Documento'), label('CPF')]), ['Nº Documento', 'CPF']);
  });
});

describe('Passivo / contemplativo (guarda de não-demarcação)', () => {
  const passive = [
    'Na listagem principal, observe os registros ativos e suas respectivas colunas',
    'A data de cadastro é exibida na grade',
    'Visualize o estado atual do protocolo'
  ];

  for (const text of passive) {
    test(`sem verbo de ação: "${text}"`, () => {
      assert.deepEqual(inferImplicitTerms(text), []);
    });
  }

  test('só substantivo genérico ("campo de pesquisa") não adivinha o campo', () => {
    assert.deepEqual(inferImplicitTerms('Pesquise utilizando o campo de pesquisa'), []);
  });

  test('passo de navegação (menu/aba) nunca vira alvo implícito', () => {
    assert.deepEqual(inferImplicitTerms('Selecione no menu lateral a opção de município'), []);
    assert.deepEqual(inferImplicitTerms('Escolha a aba de estado'), []);
  });

  test('detectImplicitTargets devolve null sem consultar o DOM', async () => {
    const { client, calls } = fakeClient([label('Cidade')]);
    const result = await detectImplicitTargets(client, step(passive[0]));
    assert.equal(result, null);
    assert.equal(calls(), 0, 'passo contemplativo não deve tocar no navegador');
  });
});

describe('detectImplicitTargets (integração com stub)', () => {
  test('passo com negrito explícito nunca usa alvos implícitos', async () => {
    const { client, calls } = fakeClient([label('Cidade')]);
    const result = await detectImplicitTargets(client, step('Localize a cidade', ['Cidade']));
    assert.equal(result, null);
    assert.equal(calls(), 0);
  });

  test('operável + rótulos reais -> alvos e substantivos', async () => {
    const { client } = fakeClient([label('UF'), label('Cidade')]);
    const result = await detectImplicitTargets(client, step('localize a cidade pelo campo de pesquisa de município ou estado'));
    assert.ok(result);
    assert.deepEqual(result.targets, ['UF', 'Cidade']);
    assert.deepEqual(result.nouns, ['municipio', 'estado']);
  });

  test('operável mas nenhum rótulo casa -> null (print limpa, sem caixa fantasma)', async () => {
    const { client } = fakeClient([label('Observações'), label('Situação')]);
    const result = await detectImplicitTargets(client, step('informe o período inicial e final desejado e clique em pesquisar'));
    assert.equal(result, null);
  });
});
