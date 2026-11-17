---
id: C-CENTRAL-03
titulo: 'Mapeamento de Qualidade CESDI em Inventários e Preenchimento Obrigatório'
modulo: centrais
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
  prints_geradas: 1
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
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita "Orion TN", "Configurações > Cadastros Auxiliares > Tipos de Participação", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o '
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-17T04:13:59.273Z'
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
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Cadastros Auxiliares > Tipos de Participação" não existe na árvore de navegação real do Orion TN. O menu **Configurações > Cadastros Auxiliares** existe na barra de navegação e contém: "Alíquotas", "Banco", "Cargo", "Documento apresentado", "Espécie", "Feriados", "Formas de pagamento", "Natureza", "Órgão expedidor", "Outros serviços", "Participação", "Perfil de partes", "Pessoa física", "Serviços Internos", "Situação do protocolo", "Tipo de movimentação financeira", "Tipo de documento", "Tipo de e-mail", "Tipo de endereço", "Tipo de telefone", "Tipo de representante"; "Tipos de Participação" não está entre eles. Nenhum item de nome igual ou parecido existe em outro ponto da árvore (140 itens lidos). Nenhum campo de texto nem a barra de pesquisa global (CTRL + B) foi usado como substituto. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **OrionTN - Tabelionatos de Notas**. Leitura ao vivo do DOM; nada foi acionado.
> * **Campos:** **Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B**.
> * **Botões:** **Clique aqui para ativar agora**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
O Provimento nº 18 do CNJ estabelece que todo inventário comunicado à CESDI deve possuir identificação explícita do falecido, herdeiros e advogado assistente, além de dados de filiação completa.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse **Configurações > Cadastros Auxiliares > Tipos de Participação**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Caminho de menu não encontrado na árvore de navegação real: Configurações > Cadastros Auxiliares > Tipos de Participação
2. Verifique se as participações estão mapeadas no quadro **Comunicações - Configurações**:
3. Falecido/Autor da Herança ➔ Qualidade CESDI: **De Cujus / Falecido**.
4. Herdeiro/Cônjuge Meiro ➔ Qualidade CESDI: **Herdeiro**.
5. Advogado/Assistente ➔ Qualidade CESDI: **Advogado**.
6. Abra o protocolo do inventário em **Notas > Protocolo**, aba **Partes**.
7. Confira cada participante, garantindo que os papéis acima foram selecionados.
8. Abra o cadastro das pessoas e preencha obrigatoriamente: **Filiação (Pai e Mãe)**, **Data de Nascimento** e **Município com Código IBGE**.
9. Salve o protocolo e retransmita a carga da CESDI.

* **Validação Estrutural: Em caso de genitor desconhecido, marque expressamente a opção "Pai Não Declarado" no cadastro para não gerar nó nulo no XML.**

#### Evolução da Reauditoria
* **Ambiente:** não registrado (anterior ao ADR-025) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo 1 — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita "Orion TN", "Configurações > Cadastros Auxiliares > Tipos de Participação", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o  → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
