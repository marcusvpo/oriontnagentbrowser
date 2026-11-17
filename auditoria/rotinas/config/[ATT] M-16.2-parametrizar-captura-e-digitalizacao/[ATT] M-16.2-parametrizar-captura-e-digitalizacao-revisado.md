---
id: M-16.2
titulo: Parametrizar Captura e Digitalização
modulo: config
secao: M
auditoria_ui:
  data_execucao: 2026-11-15
  status: atualizacao_editorial
  carga: mutation
  worker_id: worker-1
  versao_homologacao: WildFly 22 / Orion 06.04.01
  tipo_bloqueio: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: 4tabeliao.scs
  sessao_perfil_pleno: true
  status_governanca: revisao_solicitada
  governanca_revisor: Marcus (Revisor)
  governanca_atualizado_em: 2026-11-17T02:13:55.647Z
  governanca_comentario: No passo 2, demarcar apenas o item 'Captura e digitalização' no menu lateral esquerdo sem ocluir o texto. No passo 3, demarcar os campos reais do painel central ('Cor para digitalização do DUT', 'Dpi's para digitalização do DUT', 'Mostrar configurações do scanner'), nunca a coluna inteira da sidebar.
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Parâmetros > Captura e digitalização", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros > Digitalização em lote; Administração; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Parametriza a integração com scanners de mesa (drivers TWAIN/WIA) e define os diretórios de rede e armazenamento compartilhado para arquivamento digital dos documentos apresentados no cartório.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Captura e digitalização**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Parâmetros > Captura e digitalização] não localizado no DOM nem na Árvore de Acessibilidade
2. Na seção **Dispositivo de Captura**, selecione na lista o driver do scanner instalado na estação (TWAIN ou WIA).
3. Defina a resolução padrão de digitalização (ex: 200 ou 300 DPI) e o modo de cor (**Preto e Branco**, **Escala de Cinza** ou **Colorido**).
4. Na seção **Diretórios de Rede**, defina o caminho UNC (ex: `\\servidor\documentos\cartorio\`) onde os arquivos PDF/JPEG serão arquivados por tipo de documento.
5. Clique no botão **Testar Conexão** para assegurar permissão de gravação no diretório de rede.
6. Clique no botão **Salvar** para confirmar as configurações.

* **Importante: Os diretórios configurados devem ter permissão de leitura e gravação total concedida no Windows Server para todos os usuários do domínio.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**
