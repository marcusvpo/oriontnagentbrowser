---
id: M-16.5
titulo: 'Configurar Comunicações Externas (Selo Digital, E-notariado, COAF)'
modulo: centrais
secao: M
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
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Parâmetros > Comunicações externas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Comunicações; Administração; Administração > Comunicações; Administração > Comunicações > Outras comunicações; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Centraliza os parâmetros de conexão técnica, endpoints, chaves de API, usuários e certificados necessários para integrar o Orion TN às plataformas governamentais e notariais externas (TJSP, e-Notariado, COAF e Livro Caixa Web).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Comunicações externas**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Parâmetros > Comunicações externas] não localizado no DOM nem na Árvore de Acessibilidade
2. Na aba **Selo Digital TJSP**, preencha a URL do WebService, o usuário, senha e código da serventia fornecidos pelo tribunal.
3. Na aba **e-Notariado**, insira a chave de integração (API Token) e configure o modo de ambiente (**Produção** ou **Homologação**).
4. Na aba **COAF / SISCOAF**, defina o código de habilitação da serventia e o prazo de alerta de atos suspeitos para comunicação.
5. Na aba **Livro Caixa Web**, configure o token de exportação financeira diária.
6. Clique no botão **Testar Conexão** em cada aba para validar os acessos e clique em **Salvar**.

* **Importante: Sempre que houver troca de senhas no portal do tribunal ou atualização de tokens de segurança, os novos dados devem ser atualizados imediatamente nesta tela.**
* **Dica / Caso Real do 0800: Caso o protocolo não seja localizado no Caixa, certifique-se de que o status do ato na triagem foi marcado como **Aguardando Pagamento** e verifique se o operador possui privilégios de movimentação financeira.**
