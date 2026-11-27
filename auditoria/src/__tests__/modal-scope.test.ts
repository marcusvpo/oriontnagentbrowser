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

import { shouldDismissInheritedModal, buildInheritedModalProbeScript } from '../modal-scope.js';

describe('Modal herdado do passo anterior (Fase 4, M-7.0)', () => {
  test('fecha quando nenhum alvo está no modal e todos estão na tela de trás (Imprimir -> Limpar)', () => {
    assert.equal(
      shouldDismissInheritedModal(['Limpar'], { modalCount: 1, insideModal: [], outsideModal: ['Limpar'] }),
      true,
      'o modal de seleção de modelo devia ser fechado antes de medir Limpar'
    );
  });

  test('mantém o modal quando o alvo do passo está dentro dele', () => {
    assert.equal(
      shouldDismissInheritedModal(['Confirmar'], { modalCount: 1, insideModal: ['Confirmar'], outsideModal: ['Confirmar'] }),
      false,
      'alvo citado dentro do modal: o passo é sobre o modal'
    );
  });

  test('mantém o modal quando algum alvo não existe fora dele, sem modal ou sem alvos', () => {
    assert.equal(shouldDismissInheritedModal(['Limpar', 'Novo'], { modalCount: 1, insideModal: [], outsideModal: ['Limpar'] }), false, 'alvo parcial');
    assert.equal(shouldDismissInheritedModal(['Limpar'], { modalCount: 0, insideModal: [], outsideModal: ['Limpar'] }), false, 'sem modal');
    assert.equal(shouldDismissInheritedModal([], { modalCount: 1, insideModal: [], outsideModal: [] }), false, 'sem alvos');
    assert.equal(shouldDismissInheritedModal(['Limpar'], null), false, 'leitura falhou');
  });

  test('o script de leitura usa o seletor único de modal e não aciona nada', () => {
    const script = buildInheritedModalProbeScript(['Limpar']);
    assert.ok(script.includes(JSON.stringify(ACTIVE_MODAL_SELECTOR)), 'seletor de modal ausente');
    assert.ok(!/\.click\(/.test(script), 'o script de leitura não pode clicar');
    assert.ok(script.includes('"Limpar"'), 'alvo ausente do script');
  });
});

describe('Script de leitura do modal herdado compila no navegador', () => {
  test('o script gerado é JavaScript válido (regex com escape duplo no template literal)', () => {
    const script = buildInheritedModalProbeScript(['Limpar']);
    assert.doesNotThrow(() => new Function(script), 'o script de leitura tem erro de sintaxe');
    const norm = new Function(`return ${script.match(/const norm = (t => [^;]+);/)![1]}`)() as (t: string) => string;
    assert.equal(norm('  Ação   Limpar '), 'acao limpar', 'normalização sem acento e sem espaço extra');
  });
});
