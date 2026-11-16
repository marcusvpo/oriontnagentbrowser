---
id: C-LIVRO-01
titulo: 'Procedimento de Inutilização e Declaração de Folha Sem Efeito em Livro Notarial'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-3'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 4
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Livros'
        elemento_real: 'Notas'
        camada: a11y_fuzzy_match
        confianca: 0.77
        texto_alterado: false
        evidencia: 'dom-measured | text:notas | x=573, y=1, 67x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 4, o manual cita "Ações > Inutilizar Folha / Declarar Sem Efeito", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A continuidade cronológica dos livros notariais é princípio basilar. Havendo salto ou avaria física de folha, o Orion TN permite registrar a inutilização com certidão circunstanciada, preservando a trilha contábil e fiscal.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 4 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Livros > Gestão e Controle de Folhas** (ou **Notas > Livros**).
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Notas > Livros"**, porém na tela atual do Orion TN o elemento se chama **"Notas"** (confiança: 77% — Similaridade semântica na árvore de acessibilidade (73%)). O texto do manual não foi alterado.
2. Selecione o Livro Notarial ativo no qual ocorreu o salto.
   [aqui vai a print "passo-02.png"]
3. Na grade de controle de páginas, localize as folhas que ficaram em branco (ex.: Folha 089 V e Folha 090 F).
   [aqui vai a print "passo-03.png"]
4. Selecione as páginas correspondentes e clique no botão **Ações > Inutilizar Folha / Declarar Sem Efeito**.
   [aqui vai a print "passo-04.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Ações > Inutilizar Folha / Declarar Sem Efeito] não localizado no DOM nem na Árvore de Acessibilidade
5. No campo **Justificativa Legal**, digite a certidão (ex.: *"Folha inutilizada por erro material de alimentação mecânica da impressora"*).
6. Confirme a operação. O status da página passará para `INUTILIZADA`.
7. No protocolo da escritura seguinte, confirme que o sistema assumiu automaticamente a primeira folha útil posterior.

* **Corregedoria: Imprima o termo de inutilização do sistema e arquive-o junto ao livro encadernado para exibição ao Juiz Corregedor Permanente.**
