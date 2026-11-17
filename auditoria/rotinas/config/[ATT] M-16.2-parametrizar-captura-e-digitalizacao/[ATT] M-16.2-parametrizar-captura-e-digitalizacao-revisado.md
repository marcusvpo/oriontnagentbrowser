---
id: M-16.2
titulo: Parametrizar Captura e Digitalização
modulo: config
secao: M
auditoria_ui:
  data_execucao: 2026-11-17
  status: atualizacao_editorial
  review_tags:
    - ATT
  carga: mutation
  worker_id: worker-1
  versao_homologacao: WildFly 22 / Orion 06.04.01
  ambiente: Produtos (homologacao interna Siplan)
  tipo_bloqueio: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: marcus
  sessao_perfil_pleno: true
  historico_reauditoria:
    - data: 2026-11-17
      ambiente_anterior: não registrado (anterior ao ADR-025)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 1
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: No passo 1, o manual cita "Administração > Parâmetros > Captura e digitalização", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloque
      bloqueio_atual:
        passo: 1
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: 2026-11-17T05:29:50.556Z
    rota: "#/inicio"
    titulo_painel: OrionTN - Tabelionatos de Notas
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: "Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B"
        tipo: text
    botoes:
      - Clique aqui para ativar agora
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: passo-01.png
  status_governanca: revisao_solicitada
  governanca_revisor: Marcus (Revisor)
  governanca_atualizado_em: 2026-11-17T06:46:34.054Z
  governanca_comentario: No passo 2, demarcar apenas o item 'Captura e digitalização' no menu lateral esquerdo sem ocluir o texto. No passo 3, demarcar os campos reais do painel central ('Cor para digitalização do DUT', 'Dpi's para digitalização do DUT', 'Mostrar configurações do scanner'), nunca a coluna inteira da sidebar.
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Captura e digitalização" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escrituras para Registro", "Controle de Estoque", "Cadastro de Impedimentos", "Importações de arquivos", "Controle de Livros", "Mensalistas", "Intermediadores", "Cadastro de Pessoas Jurídicas", "Serviços internos realizados", "Certidões solicitadas", "Calendário"; "Parâmetros" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Parametriza a integração com scanners de mesa (drivers TWAIN/WIA) e define os diretórios de rede e armazenamento compartilhado para arquivamento digital dos documentos apresentados no cartório.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Captura e digitalização**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Administração > Parâmetros > Captura e digitalização
2. Na seção **Dispositivo de Captura**, selecione na lista o driver do scanner instalado na estação (TWAIN ou WIA).
3. Defina a resolução padrão de digitalização (ex: 200 ou 300 DPI) e o modo de cor (**Preto e Branco**, **Escala de Cinza** ou **Colorido**).
4. Na seção **Diretórios de Rede**, defina o caminho UNC (ex: `\\servidor\documentos\cartorio\`) onde os arquivos PDF/JPEG serão arquivados por tipo de documento.
5. Clique no botão **Testar Conexão** para assegurar permissão de gravação no diretório de rede.
6. Clique no botão **Salvar** para confirmar as configurações.

* **Importante: Os diretórios configurados devem ter permissão de leitura e gravação total concedida no Windows Server para todos os usuários do domínio.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Administração > Parâmetros > Captura e digitalização", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloque → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
