/**
 * Testes offline do escopo de modal ativo. Nenhum navegador é aberto: o script de medição é só texto.
 *
 * Execução: npm --prefix auditoria test
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVE_MODAL_SELECTOR } from '../modal-scope.js';
import { buildDOMIntrospectionScript } from '../dom-geometry.js';

describe('Escopo de modal ativo', () => {
  test('o seletor reconhece o modal Bootstrap e o modal leve do Orion TN', () => {
    assert.match(ACTIVE_MODAL_SELECTOR, /\.modal\.in/);
    assert.match(ACTIVE_MODAL_SELECTOR, /\.modal\.show/);
    assert.match(ACTIVE_MODAL_SELECTOR, /\.orion-lightweight-modal\.in/);
    assert.match(ACTIVE_MODAL_SELECTOR, /\[role="dialog"\]/);
  });

  test('o script de medição restringe ao modal ativo e confere elementFromPoint', () => {
    const script = buildDOMIntrospectionScript(['Nome'], { zone: 'content' });
    assert.ok(script.includes('orion-lightweight-modal.in'), 'modal leve ausente do MODAL_SEL');
    assert.ok(script.includes('elementFromPoint'), 'checagem de oclusão ausente');
    assert.ok(script.includes('isBehindModal'), 'filtro de nó por trás do modal ausente');
  });
});
