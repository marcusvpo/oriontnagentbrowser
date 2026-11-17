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
  worker_id: worker-4
  versao_homologacao: WildFly 22 / Orion 06.04.01
  ambiente: Produtos (homologacao interna Siplan)
  tipo_bloqueio: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
  prints_geradas: 3
  dry_run_mutations: true
  sessao_usuario: marcus
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes:
        - Dispositivo de Captura
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 17
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
      gatilhos_testados:
        - tipo: tab
          rotulo: Parâmetros por estação
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: Pedido de firmas
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: Painel de atalhos
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: Faturamento
          deduzido_do_dom: false
          resultado: tela_com_erro
        - tipo: tab
          rotulo: Campos obrigatórios
          deduzido_do_dom: false
          resultado: sem_efeito
        - tipo: tab
          rotulo: Editor
          deduzido_do_dom: false
          resultado: sem_efeito
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: Administração > Parâmetros > Captura e digitalização
        elemento_real: Configurações > Parametrizações
        camada: menu_path_resolution
        confianca: 0.9
        texto_alterado: false
        evidencia: menu-tree | [data-orion-audit-menu-mmwku4coa7cqmgl-130] | x=850, y=171, 175x20
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
    - data: 2026-11-17
      ambiente_anterior: Produtos (homologacao interna Siplan)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
      bloqueio_superado: true
      bloqueio_anterior:
        passo: 1
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Parâmetros > Captura e digitalização" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de esc'
      bloqueio_atual:
        passo: 2
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
    - data: 2026-11-17
      ambiente_anterior: Produtos (homologacao interna Siplan)
      ambiente_atual: Produtos (homologacao interna Siplan)
      status_anterior: atualizacao_editorial
      tags_anteriores:
        - ATT
      status_atual: atualizacao_editorial
      tags_atuais:
        - ATT
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 2
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
        motivo: No passo 2, o manual cita "Dispositivo de Captura", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Ante
      bloqueio_atual:
        passo: 2
        tipo: Defasagem Editorial do Manual (Recurso Inexistente na Tela)
      curas_reaproveitadas:
        - passo: 1
          alvo: Administração > Parâmetros > Captura e digitalização
          real: Configurações > Parametrizações
          confirmada_ao_vivo: true
          usada_como_dica: false
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 2
    capturado_em: 2026-11-17T15:20:35.662Z
    rota: "#/configuracoes"
    titulo_painel: OrionTN - Tabelionatos de Notas
    em_modal: false
    secoes:
      - Configurações
      - Digitalização
      - Diretório
    abas: []
    campos:
      - rotulo: tipoDigitalizador
        tipo: select
      - rotulo: inputTextUrlConexaoDocuvieware
        tipo: text
      - rotulo: Documento
        tipo: select
        secao: Digitalização
      - rotulo: Caminho
        tipo: text
        secao: Digitalização
      - rotulo: Cor para digitalização do DUT
        tipo: select
        secao: Digitalização
      - rotulo: Dpi's para digitalização do DUT
        tipo: select
        secao: Digitalização
      - rotulo: Mostrar configurações do scanner
        tipo: checkbox
        secao: Digitalização
      - rotulo: Cor para digitalização do ITCMD
        tipo: select
        secao: Digitalização
      - rotulo: Dpi's para digitalização do ITCMD
        tipo: select
        secao: Digitalização
    botoes:
      - Excluir
      - Adicionar
      - Concluir
      - Voltar
    alvos_do_passo:
      - Dispositivo de Captura
    correspondencias_sugeridas: []
    alvos_sem_correspondencia:
      - Dispositivo de Captura
    sugestao_reescrita: "Sugestão de reescrita: Dispositivo de Captura não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida."
    print_contexto: passo-02.png
  status_governanca: revisao_solicitada
  governanca_revisor: Marcus (Revisor)
  governanca_atualizado_em: 2026-11-17T18:11:14.586Z
  governanca_comentario: No passo 2, demarcar apenas o item 'Captura e digitalização' no menu lateral esquerdo sem ocluir o texto. No passo 3, demarcar os campos reais do painel central ('Cor para digitalização do DUT', 'Dpi's para digitalização do DUT', 'Mostrar configurações do scanner'), nunca a coluna inteira da sidebar.
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Dispositivo de Captura", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Antes do bloqueio, a Exploração Investigativa acionou 6 de 17 gatilho(s) revelador(es) seguro(s) da tela (aba "Parâmetros por estação", aba "Pedido de firmas", aba "Painel de atalhos", aba "Faturamento", aba "Campos obrigatórios", aba "Editor"); nenhum revelou o elemento, e o estado da tela foi restaurado. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 2: rota **#/configuracoes**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Configurações**, **Digitalização**, **Diretório**.
> * **Campos:** **tipoDigitalizador**, **inputTextUrlConexaoDocuvieware**, **Documento** (Digitalização), **Caminho** (Digitalização), **Cor para digitalização do DUT** (Digitalização), **Dpi's para digitalização do DUT** (Digitalização), **Mostrar configurações do scanner** (Digitalização), **Cor para digitalização do ITCMD** (Digitalização), **Dpi's para digitalização do ITCMD** (Digitalização).
> * **Botões:** **Excluir**, **Adicionar**, **Concluir**, **Voltar**.
> * **Sem correspondência funcional na tela:** **Dispositivo de Captura**.
> * Sugestão de reescrita: **Dispositivo de Captura** não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida. O texto original do manual foi preservado nesta rotina.
> * **Referência visual:** passo-02.png (tela exata no momento do bloqueio).

#### Descrição:
Parametriza a integração com scanners de mesa (drivers TWAIN/WIA) e define os diretórios de rede e armazenamento compartilhado para arquivamento digital dos documentos apresentados no cartório.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Captura e digitalização**.
   [aqui vai a print "passo-01.png"]
   [aqui vai a print "passo-01-b.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações** · (3) **Captura e digitalização**
   > [!NOTE] **Divergência de caminho de menu (Auto-Cura de Rota):** O manual documentava o caminho **"Administração > Parâmetros > Captura e digitalização"**, porém na versão atual do Orion TN a tela fica em **"Configurações > Parametrizações"** (confiança: 90% — Equivalência canônica "Administração > Parâmetros" -> "Configurações > Parametrizações": o submenu legado "Administração > Parâmetros" virou a tela única "Configurações > Parametrizações" (abas laterais Geral, Captura e digitalização, E-mail, Protocolo, Certidão, Impressão...)). O texto do manual não foi alterado.
   > [!NOTE] Rota real: **Configurações > Parametrizações**; a aba/seção **Captura e digitalização** foi medida ao vivo (mesmo nome do manual) e acionada.
2. Na seção **Dispositivo de Captura**, selecione na lista o driver do scanner instalado na estação (TWAIN ou WIA).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Dispositivo de Captura] não localizado no DOM nem na Árvore de Acessibilidade, nem após 6 gatilho(s) revelador(es) seguro(s)
3. Defina a resolução padrão de digitalização (ex: 200 ou 300 DPI) e o modo de cor (**Preto e Branco**, **Escala de Cinza** ou **Colorido**).
4. Na seção **Diretórios de Rede**, defina o caminho UNC (ex: `\\servidor\documentos\cartorio\`) onde os arquivos PDF/JPEG serão arquivados por tipo de documento.
5. Clique no botão **Testar Conexão** para assegurar permissão de gravação no diretório de rede.
6. Clique no botão **Salvar** para confirmar as configurações.

* **Importante: Os diretórios configurados devem ter permissão de leitura e gravação total concedida no Windows Server para todos os usuários do domínio.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 2 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 2, o manual cita "Dispositivo de Captura", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. Ante → **mantido** (agora: passo 2, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
* **Cura reaproveitada (passo 1):** "Administração > Parâmetros > Captura e digitalização" → "Configurações > Parametrizações" — reconfirmada ao vivo nesta execução (medida de novo pelo próprio motor, sem depender da dica)
