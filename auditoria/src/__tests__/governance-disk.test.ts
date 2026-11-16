import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { applyGovernanceUpdatesToMarkdown } from '../governance-disk.js';

const SAMPLE_MD = `---
id: M-41.0
titulo: 'Cadastrar Área de Atuação'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: validado_com_ajustes
  carga: mutation
  prints_geradas: 2
---

#### Descrição:
Descrição original da rotina.

> [!NOTE] **Divergência Conceitual/Editorial (Evidência de Tela):** Diferença de unidade.

#### Passo a passo revisado:
1. Acesse o menu **Configurações > Cadastros auxiliares**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Cadastros auxiliares**
2. Clique em **Concluir**.
   [aqui vai a print "passo-02.png"]
   * Sub-item preservado

* **Observação: Mantenha os dados padronizados.**
`;

describe('Dupla via em disco (applyGovernanceUpdatesToMarkdown)', () => {
  test('atualiza status_governanca sem sobrescrever auditoria_ui.status nem prints_geradas', () => {
    const out = applyGovernanceUpdatesToMarkdown(SAMPLE_MD, {
      statusGovernanca: 'aprovada',
      revisor: 'Marcus',
      comentario: 'Validado no balcão',
      updatedAt: '2026-11-16T15:00:00.000Z',
    });

    assert.match(out, /^\s+status:\s+validado_com_ajustes/m);
    assert.match(out, /^\s+status_governanca:\s+aprovada/m);
    assert.match(out, /^\s+governanca_revisor:\s+Marcus/m);
    assert.match(out, /^\s+prints_geradas:\s+2/m);
  });

  test('edita descrição e passos específicos mantendo marcadores de print, notas e sub-itens', () => {
    const out = applyGovernanceUpdatesToMarkdown(SAMPLE_MD, {
      statusGovernanca: 'aprovada',
      revisor: 'Marcus',
      descricao: 'Descrição revisada pelo revisor.',
      edicoes: [{ stepNumber: 2, validatedText: 'Clique no botão **Salvar** para gravar.' }],
    });

    assert.ok(out.includes('Descrição revisada pelo revisor.'));
    assert.ok(out.includes('Divergência Conceitual/Editorial'));
    assert.ok(out.includes('1. Acesse o menu **Configurações > Cadastros auxiliares**.'));
    assert.ok(out.includes('2. Clique no botão **Salvar** para gravar.'));
    assert.ok(out.includes('[aqui vai a print "passo-01.png"]'));
    assert.ok(out.includes('[aqui vai a print "passo-02.png"]'));
    assert.ok(out.includes('* Sub-item preservado'));
    assert.ok(out.includes('* **Observação: Mantenha os dados padronizados.**'));
  });
});
