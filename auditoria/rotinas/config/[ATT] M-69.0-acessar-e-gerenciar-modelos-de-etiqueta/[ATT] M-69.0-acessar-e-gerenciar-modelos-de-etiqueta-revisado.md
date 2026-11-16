---
id: M-69.0
titulo: 'Acessar e Gerenciar Modelos de Etiqueta'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Parâmetros > Modelos de etiqueta", "Firmas > Parâmetros > Modelos de etiqueta", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas; Administração (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite consultar, filtrar, editar e auditar a listagem geral de modelos de etiquetas adesivas térmicas (reconhecimentos, autenticações e apostilamentos), garantindo conformidade visual e técnica.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Modelos de etiqueta** (ou **Firmas > Parâmetros > Modelos de etiqueta**).
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Parâmetros > Modelos de etiqueta, Firmas > Parâmetros > Modelos de etiqueta] não localizado no DOM nem na Árvore de Acessibilidade
2. Na listagem de modelos, visualize os títulos, serviços aos quais estão vinculados e situação de cada registro.
3. No campo **Pesquisar por modelo**, digite o nome do ato ou modelo e clique no botão **Filtrar**.
4. Na linha do modelo localizado, execute a ação desejada:
   * **Visualizar**: exibe os parâmetros técnicos, dimensões e variáveis inseridas no modelo.
   * **Editar**: abre o editor técnico para ajustar posicionamento de textos, QR Code e fontes.
   * **Inativar**: desabilita o modelo para que deixe de aparecer como opção no balcão.
5. Para construir um layout novo de etiqueta, clique no botão **Adicionar**.

* **Observação: O modelo ativo e marcado como 'Padrão' é acionado automaticamente a cada clique em 'Lançar e Imprimir' no balcão de atendimento.**
* **Dica / Caso Real do 0800: Sempre utilize **Ctrl + Shift + V** para colar textos copiados de fontes externas, garantindo que estilos de fonte estranhos (como fonte tamanho 2) não corrompam a estrutura do documento.**
