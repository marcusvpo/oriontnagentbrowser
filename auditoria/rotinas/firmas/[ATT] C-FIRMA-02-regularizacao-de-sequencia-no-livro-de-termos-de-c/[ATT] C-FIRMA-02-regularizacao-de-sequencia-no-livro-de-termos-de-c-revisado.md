---
id: C-FIRMA-02
titulo: 'Regularização de Sequência no Livro de Termos de Comparecimento e Etiquetas de Ressalva'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 1
      alvos_ausentes: ['Erro de Grafia no Termo Já Impresso']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Erro de Grafia no Termo Já Impresso", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros > Tipo de documento - Termo de comparecimento (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Em livros encadernados de termos de comparecimento (DUT/CRV e autenticidade), não é permitido rasgar folhas. O Orion TN dispõe de rotina nativa de ressalva com reutilização da folha do termo.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No caso de **Erro de Grafia no Termo Já Impresso**:
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Erro de Grafia no Termo Já Impresso] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
2. Acesse **Firmas > Fichas de Firmas**, localize o cliente e corrija os dados cadastrais.
3. Acesse **Firmas > Livros > Livro de Termos de Comparecimento** e selecione o termo emitido.
4. Clique no botão **Imprimir Etiqueta de Ressalva** com a opção **Reutilização da Folha do Termo** ativada.
5. Cole a etiqueta retificadora sobre a folha física do livro.
6. No caso de **Salto de Numeração**:
7. Na tela de gestão de livros de termos, acesse **Ajuste de Sequência de Termos**.
8. Informe a numeração que deve ser restabelecida como próximo termo e confirme.

* **Corregedoria: A emissão de etiqueta de ressalva preserva a integridade numérica e atende integralmente às exigências das Normas de Serviço.**
