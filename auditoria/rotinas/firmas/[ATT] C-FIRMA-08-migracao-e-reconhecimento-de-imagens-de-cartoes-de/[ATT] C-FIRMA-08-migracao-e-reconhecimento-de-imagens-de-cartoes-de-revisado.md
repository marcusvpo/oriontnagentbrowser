---
id: C-FIRMA-08
titulo: 'Migração e Reconhecimento de Imagens de Cartões de Assinatura em Novo Caminho de Rede'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Orion TN", "Configurações > Parâmetros Gerais > Armazenamento e GED", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Auditoria Selos TJ - Orion; Configurações; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
As imagens digitalizadas de assinaturas não ficam armazenadas dentro do banco relacional, mas sim em diretório estruturado no servidor de arquivos (GED). Quando o servidor é renomeado ou migrado, o ponteiro de rede deve ser atualizado.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Assegure que a pasta compartilhada no novo servidor possui permissões completas de leitura/escrita para todos os usuários do cartório.
   [aqui vai a print "passo-01.png"]
2. No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Armazenamento e GED**.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN, Configurações > Parâmetros Gerais > Armazenamento e GED] não localizado no DOM nem na Árvore de Acessibilidade
3. Localize o campo **Caminho das Imagens do Balcão de Firmas / Assinaturas**.
4. Informe o novo caminho UNC (ex.: `\\novo_servidor\OrionTN_Imagens\Firmas\`).
5. Clique no botão **Testar Leitura de Diretório** e valide a mensagem de confirmação.
6. Clique em **Gravar**.
7. Abra uma ficha de firma de teste e certifique-se de que a imagem da assinatura é exibida instantaneamente na tela.

* **Infraestrutura: Utilize caminhos UNC padrão de rede em vez de letras de unidades mapeadas (como `Z:\`) para evitar perda de vínculo ao trocar de usuário no Windows.**
