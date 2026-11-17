---
id: C-SELO-04
titulo: 'Substituição de Certificado Digital A1 Vencido no Servidor Daemon de Selos'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-17'
  status: atualizacao_editorial
  review_tags: ['ATT']
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: 'Produtos (homologacao interna Siplan)'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: 'marcus'
  sessao_perfil_pleno: true
  historico_reauditoria:
    - data: '2026-11-17'
      ambiente_anterior: 'não registrado (anterior ao ADR-025)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 5, o manual cita "Orion TN", "Configurações > Parâmetros de Integração > Certificado Digital", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca '
      bloqueio_atual:
        passo: 5
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 5
    capturado_em: '2026-11-17T04:56:37.271Z'
    rota: '#/inicio'
    titulo_painel: 'OrionTN - Tabelionatos de Notas'
    em_modal: false
    secoes: []
    abas: []
    campos:
      - rotulo: 'Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B'
        tipo: 'text'
    botoes: ['Clique aqui para ativar agora']
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    print_contexto: 'passo-05.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros de Integração > Certificado Digital" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de custas", "Cadastros auxiliares", "Perfis e permissões de acesso", "Usuários", "Parametrizações"; "Parâmetros de Integração" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 5: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-05.png (tela exata no momento do bloqueio).

#### Descrição:
A comunicação segura e a assinatura dos lotes de selos exigem certificado ICP-Brasil corporativo válido no servidor da serventia. Ao vencer a anuidade, o novo arquivo `.pfx` deve ser apontado no daemon.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 5 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Obtenha o novo arquivo `.pfx` emitido pela Autoridade Certificadora e sua respectiva senha.
   [aqui vai a print "passo-01.png"]
2. Acesse o servidor do cartório (via SSH no Linux ou Área de Trabalho Remota no Windows).
   [aqui vai a print "passo-02.png"]
3. Copie o arquivo para o diretório padrão `/etc/siplan/certificados/` (ou `C:\Siplan\Certificados\`).
   [aqui vai a print "passo-03.png"]
4. Ajuste as permissões de leitura no Linux: `chmod 644 /etc/siplan/certificados/novo_cert.pfx`.
   [aqui vai a print "passo-04.png"]
5. No **Orion TN**, acesse **Configurações > Parâmetros de Integração > Certificado Digital**.
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Configurações > Parâmetros de Integração > Certificado Digital
6. Aponte o novo caminho do arquivo, digite a nova senha e clique em **Testar Conexão**.
7. Reinicie o serviço de background executando `systemctl restart orionselos` (ou reinicie o serviço no Windows).
8. Gere um selo de teste em qualquer ato de balcão para validar a autorização pelo tribunal.

* **Prevenção: Agende a renovação do certificado A1 com 15 dias de antecedência do vencimento para evitar interrupções no atendimento da serventia.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 5 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 5, o manual cita "Orion TN", "Configurações > Parâmetros de Integração > Certificado Digital", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca  → **mantido** (agora: passo 5, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
