import { describe, test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  config,
  DEFAULT_PORTAL_PRODUCT,
  PORTAL_PRODUCTS,
  appHomeFileFor,
  normalizePortalProduct,
  portalProductSlug,
  sessionFileFor,
  setActivePortalProduct,
  type PortalProductName
} from '../config.js';
import { maskUrlHost, moduleHomeFromLanding } from '../auth.js';

// Fase 4 (caixa): seleção do card do Portal Orion (`/webPortal/#/produtos`) por `--product`.
// Host de exemplo da faixa TEST-NET (RFC 5737): nenhum endereço interno real nos testes.
const ORIGIN = 'http://192.0.2.10:8601';
const realAuthDir = path.dirname(config.sessionFile);

describe('Portal Orion — padrão inalterado (Orion TN)', () => {
  test('o produto padrão é Orion TN com os mesmos arquivos de antes', () => {
    assert.equal(DEFAULT_PORTAL_PRODUCT, 'Orion TN', 'produto padrão');
    assert.equal(config.portalProduct, 'Orion TN', 'config.portalProduct sem --product');
    assert.equal(path.basename(config.appHomeFile), 'app-home.json', 'app-home do Orion TN');
    assert.equal(path.basename(config.sessionFile), 'session-homolog.json', 'sessão mestre do Orion TN');
  });

  test('os 3 cards do Portal estão listados', () => {
    assert.deepEqual([...PORTAL_PRODUCTS], ['Orion TN', 'Orion Caixa', 'Orion Estoque'], 'lista de produtos');
  });
});

describe('normalizePortalProduct (--product)', () => {
  const cases: Array<[string, PortalProductName]> = [
    ['Orion TN', 'Orion TN'],
    ['orion-tn', 'Orion TN'],
    ['TN', 'Orion TN'],
    ['Orion Caixa', 'Orion Caixa'],
    ['orion-caixa', 'Orion Caixa'],
    ['ORION_CAIXA', 'Orion Caixa'],
    ['caixa', 'Orion Caixa'],
    ['Orion Estoque', 'Orion Estoque'],
    ['orion-estoque', 'Orion Estoque'],
    ['  orion   estoque ', 'Orion Estoque'],
    ['estoque', 'Orion Estoque']
  ];
  for (const [input, expected] of cases) {
    test(`"${input}" -> ${expected}`, () => {
      assert.equal(normalizePortalProduct(input), expected, `normalização de "${input}"`);
    });
  }

  test('valores desconhecidos ou vazios são rejeitados', () => {
    for (const bad of ['', 'Orion', 'Orion Livros', 'webFirmas', 'caixa estoque', null, undefined]) {
      assert.equal(normalizePortalProduct(bad as any), null, `rejeição de "${String(bad)}"`);
    }
  });
});

describe('Isolamento dos arquivos por produto em auditoria/auth/', () => {
  test('cada produto tem app-home e sessão próprios, todos dentro de auth/', () => {
    const seen = new Set<string>();
    for (const p of PORTAL_PRODUCTS) {
      const home = appHomeFileFor(p);
      const session = sessionFileFor(p);
      assert.equal(path.dirname(home), realAuthDir, `app-home de ${p} dentro de auth/`);
      assert.equal(path.dirname(session), realAuthDir, `sessão de ${p} dentro de auth/`);
      assert.equal(seen.has(home), false, `app-home de ${p} não colide`);
      assert.equal(seen.has(session), false, `sessão de ${p} não colide`);
      seen.add(home);
      seen.add(session);
    }
    assert.equal(path.basename(appHomeFileFor('Orion Caixa')), 'app-home-orion-caixa.json', 'app-home do Caixa');
    assert.equal(path.basename(appHomeFileFor('Orion Estoque')), 'app-home-orion-estoque.json', 'app-home do Estoque');
    assert.equal(path.basename(sessionFileFor('Orion Caixa')), 'session-homolog-orion-caixa.json', 'sessão do Caixa');
    assert.equal(path.basename(sessionFileFor('Orion Estoque')), 'session-homolog-orion-estoque.json', 'sessão do Estoque');
    assert.equal(portalProductSlug('Orion TN'), 'orion-tn', 'slug do TN');
  });

  test('os nomes caem nos padrões ignorados pelo Git (auditoria/auth/ e session-*.json)', () => {
    const gitignore = fs.readFileSync(path.resolve(realAuthDir, '..', '..', '.gitignore'), 'utf-8');
    assert.equal(/auditoria\/auth\//.test(gitignore), true, '.gitignore cobre auditoria/auth/');
    for (const p of PORTAL_PRODUCTS) {
      assert.equal(/^session-.*\.json$/.test(path.basename(sessionFileFor(p))), true, `sessão de ${p} segue session-*.json`);
    }
  });
});

describe('setActivePortalProduct', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'portal-product-'));
  after(() => {
    setActivePortalProduct(DEFAULT_PORTAL_PRODUCT);
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  test('Orion Caixa sem URL descoberta fica vazia (nunca deriva /webFirmas)', () => {
    setActivePortalProduct('Orion Caixa', tmp);
    assert.equal(config.portalProduct, 'Orion Caixa', 'produto ativo');
    assert.equal(config.appHomeUrl, '', 'sem URL descoberta');
    assert.equal(path.basename(config.appHomeFile), 'app-home-orion-caixa.json', 'arquivo do Caixa');
    assert.equal(path.basename(config.sessionFile), 'session-homolog-orion-caixa.json', 'sessão do Caixa');
  });

  test('Orion Estoque lê a URL persistida no próprio arquivo', () => {
    const url = `${ORIGIN}/webEstoque/#/inicio`;
    fs.writeFileSync(path.join(tmp, 'app-home-orion-estoque.json'), JSON.stringify({ appHomeUrl: url }), 'utf-8');
    setActivePortalProduct('Orion Estoque', tmp);
    assert.equal(config.appHomeUrl, url, 'URL do Estoque');
  });

  test('a URL do Orion TN nunca vaza para outro produto', () => {
    fs.writeFileSync(path.join(tmp, 'app-home.json'), JSON.stringify({ appHomeUrl: `${ORIGIN}/webFirmas/#/inicio` }), 'utf-8');
    setActivePortalProduct('Orion Caixa', tmp);
    assert.equal(config.appHomeUrl, '', 'Caixa não herda app-home.json');
    setActivePortalProduct('Orion TN', tmp);
    assert.equal(config.appHomeUrl, `${ORIGIN}/webFirmas/#/inicio`, 'TN lê app-home.json');
    assert.equal(path.basename(config.sessionFile), 'session-homolog.json', 'TN volta à sessão original');
  });
});

describe('moduleHomeFromLanding', () => {
  test('Orion TN mantém <path>/#/inicio (ADR-025)', () => {
    assert.equal(moduleHomeFromLanding(`${ORIGIN}/webFirmas/#/dashboard`, 'Orion TN'), `${ORIGIN}/webFirmas/#/inicio`, 'TN');
  });
  test('Orion Caixa/Estoque preservam o hash real de pouso', () => {
    assert.equal(moduleHomeFromLanding(`${ORIGIN}/webCaixa/#/home`, 'Orion Caixa'), `${ORIGIN}/webCaixa/#/home`, 'Caixa');
    assert.equal(moduleHomeFromLanding(`"${ORIGIN}/webEstoque/"`, 'Orion Estoque'), `${ORIGIN}/webEstoque/`, 'Estoque sem hash');
  });
  test('portal e URLs inválidas não são persistidos', () => {
    assert.equal(moduleHomeFromLanding(`${ORIGIN}/webPortal/#/produtos`, 'Orion Caixa'), '', 'portal');
    assert.equal(moduleHomeFromLanding('about:blank', 'Orion Estoque'), '', 'about:blank');
    assert.equal(moduleHomeFromLanding('lixo', 'Orion TN'), '', 'ilegível');
  });
  test('maskUrlHost mascara o último octeto', () => {
    assert.equal(maskUrlHost(`"${ORIGIN}/webCaixa/#/home"`), 'http://192.0.2.x:8601/webCaixa/#/home', 'máscara');
  });
});

import { stripProductNameTargets } from '../step-scope.js';
import type { RoutineStep } from '../types.js';

const kbStep = (stepNumber: number, rawText: string): RoutineStep => ({
  stepNumber,
  rawText,
  targets: Array.from(rawText.matchAll(/\*\*([^*]+)\*\*/g)).map(m => m[1].trim()),
  actionType: 'click',
  subItems: [],
  mainTargetCount: Array.from(rawText.matchAll(/\*\*([^*]+)\*\*/g)).length
});

describe('Nome do produto ativo do Portal não é alvo de tela (Fase 4)', () => {
  test('"Abra o **Orion Caixa**" com --product "Orion Caixa" vira passo sem alvo (C-FIN-03 passo 1)', () => {
    const r = stripProductNameTargets(kbStep(1, 'Abra o **Orion Caixa** com perfil gestor ou tabelião.'), 'Orion Caixa');
    assert.deepEqual(r.step.targets, [], 'o produto ativo não pode ser procurado na tela');
    assert.equal(r.step.mainTargetCount, 0, 'contagem de alvos principais');
    assert.deepEqual(r.removed, ['Orion Caixa'], 'removido');
    assert.equal(r.step.rawText, 'Abra o **Orion Caixa** com perfil gestor ou tabelião.', 'texto do manual intocado');
  });

  test('"No **Orion Caixa**, abra a tela de **Movimentações de Caixa**" mantém só o alvo real (C-FIN-10 passo 1)', () => {
    const r = stripProductNameTargets(kbStep(1, 'No **Orion Caixa**, abra a tela de **Movimentações de Caixa** do operador.'), 'Orion Caixa');
    assert.deepEqual(r.step.targets, ['Movimentações de Caixa'], 'só a tela continua alvo');
    assert.equal(r.step.mainTargetCount, 1, 'contagem de alvos principais');
  });

  test('nome de OUTRO produto continua alvo; Orion TN segue a regra da ADR-024', () => {
    const other = stripProductNameTargets(kbStep(1, 'No **Orion Caixa**, acesse **Recebimento**.'), 'Orion TN');
    assert.deepEqual(other.step.targets, ['Orion Caixa', 'Recebimento'], 'sessão no Orion TN: Orion Caixa não é o produto ativo');
    const estoque = stripProductNameTargets(kbStep(1, 'No **Orion Caixa**, acesse **Recebimento**.'), 'Orion Estoque');
    assert.deepEqual(estoque.step.targets, ['Orion Caixa', 'Recebimento'], 'sessão no Orion Estoque');
    const tn = stripProductNameTargets(kbStep(1, 'No **Orion TN**, acesse **Notas**.'), 'Orion TN');
    assert.deepEqual(tn.step.targets, ['Notas'], 'regra da ADR-024 preservada');
    const card = stripProductNameTargets(kbStep(1, 'Selecione o card **Orion Caixa** no portal.'), 'Orion Caixa');
    assert.deepEqual(card.step.targets, ['Orion Caixa'], 'sem verbo de contexto o negrito segue alvo (card do portal)');
  });
});
