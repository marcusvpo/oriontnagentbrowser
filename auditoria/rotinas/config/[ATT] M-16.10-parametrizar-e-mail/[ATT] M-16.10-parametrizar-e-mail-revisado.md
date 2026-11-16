---
id: M-16.10
titulo: 'Parametrizar E-mail'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Configuração do Servidor (SMTP)', 'Porta', 'TLS/SSL']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > E-mail'
        elemento_real: 'Administração'
        camada: a11y_fuzzy_match
        confianca: 0.81
        texto_alterado: false
        evidencia: 'dom-measured | text:administração | x=733, y=1, 119x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 2, o manual cita "Configuração do Servidor (SMTP)", "Porta", "TLS/SSL", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. A Exploração Investigativa varreu a tela e não encontrou gatilho revelador seguro a testar: nenhuma aba interna inativa, nenhum painel recolhido, nenhum botão de abertura (Alterar, Editar, Adicionar, Novo, Avançado, Filtros) e nenhum seletor condicional com afinidade ao elemento. O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Configurações > Modelos de impressão > Configuração de impressão (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Configura as credenciais do servidor SMTP da serventia e parametriza os gatilhos para disparo automático de correspondências eletrônicas (faturas, extratos de mensalistas, notificações de selos e andamento de protocolos).

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 2 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > E-mail**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Administração > Parâmetros > E-mail"**, porém na tela atual do Orion TN o elemento se chama **"Administração"** (confiança: 81% — Similaridade semântica na árvore de acessibilidade (77%)). O texto do manual não foi alterado.
2. Na seção **Configuração do Servidor (SMTP)**, informe o endereço do servidor (ex: `smtp.seuprovedor.com.br`), a **Porta** (ex: 587 ou 465) e marque o protocolo de segurança (**TLS/SSL**).
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Configuração do Servidor (SMTP), Porta, TLS/SSL] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Preencha o **Usuário** (e-mail institucional), a **Senha** de aplicação e o **Nome do Remetente** a ser exibido aos clientes.
4. Na seção **Notificações Automáticas**, marque os eventos desejados:
   * Envio automático de fatura/extrato ao mensalista no fechamento.
   * Notificação de protocolo disponível para retirada.
   * Alerta diário de processamento da Central de Selos.
5. Clique no botão **Enviar E-mail de Teste** para certificar-se da comunicação com o servidor de correio.
6. Clique no botão **Salvar** para gravar as configurações.

* **Importante: Provedores de e-mail modernos (como Google Workspace, Microsoft 365) exigem a geração de uma 'Senha de Aplicativo' específica para uso em sistemas terceiros.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**
