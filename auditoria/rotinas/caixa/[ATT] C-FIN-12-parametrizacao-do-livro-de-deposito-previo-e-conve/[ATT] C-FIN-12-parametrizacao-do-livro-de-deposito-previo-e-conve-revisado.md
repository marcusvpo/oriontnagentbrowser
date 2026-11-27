---
id: C-FIN-12
titulo: 'Parametrização do Livro de Depósito Prévio e Conversão em Emolumento Definitivo'
modulo: caixa
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
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
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Administração > Parâmetros > Tipos de Movimentação'
        elemento_real: '(não localizado na tela)'
        camada: target_not_found
        confianca: 0
        texto_alterado: false
  historico_reauditoria:
    - data: '2026-11-26'
      ambiente_anterior: 'Produtos (homologacao interna Siplan)'
      ambiente_atual: 'Produtos (homologacao interna Siplan)'
      status_anterior: 'atualizacao_editorial'
      tags_anteriores: ['ATT']
      status_atual: 'atualizacao_editorial'
      tags_atuais: ['ATT']
      bloqueio_superado: false
      bloqueio_anterior:
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
        motivo: 'No passo 1, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por equivalência canônica explícita (Camada 1) ("Administração > Parâmetros > Tipos de Movimentação" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Depósito Prévio", citado(s) nos passo'
      bloqueio_atual:
        passo: 1
        tipo: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
      notas_editoriais_reconfirmadas: 0
      notas_editoriais_nao_reconfirmadas: 0
  diagnostico_tela_att:
    passo: 1
    capturado_em: '2026-11-26T22:17:39.922Z'
    rota: '#/inicio'
    titulo_painel: 'Caixa'
    em_modal: false
    secoes: ['Vencidas']
    abas: []
    campos: []
    botoes: []
    alvos_do_passo: []
    correspondencias_sugeridas: []
    alvos_sem_correspondencia: []
    contexto_catalogo_nivel1:
      id_tela: '016'
      menu: 'Notas > Orçamento rápido'
      rota: '#/inicio'
      nivel: 2
      estado_nivel2: 'explored'
      abas: []
      secoes: ['Orçamento rápido Vigência 08/01/2026 02/01/2026 08/01/2025 08/01/2024 11/02/2023 07/01/2022', 'Orçamento rápido', 'Dados do solicitante', 'Custas', 'R$ 362,98', 'Outros serviços']
      tabelas: ['Item', 'Descrição', 'Qtd. Adicional', 'Cálculo', 'Base de cálculo', 'UF', 'Cidade', '%ITBI', 'ITBI', 'Registro de Imóveis', 'Tabelião', 'Estado', 'SEFAZ', 'ISS', 'M. Público', 'Reg. Civil', 'T.J', 'Sta. Casa', 'Total', 'Serviço', 'Quantidade', 'Valor un.', 'Valor total']
    print_contexto: 'passo-01.png'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por equivalência canônica explícita (Camada 1) ("Administração > Parâmetros > Tipos de Movimentação" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Depósito Prévio", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "Caixa", "Configurações", "Contas bancárias", "Controle de caixa", "Ativar rotina - Firmas", "Ativar rotina - Notas", "Abertura sem troco", "Balcão de firmas - Estornar pagamentos com autorização", "Tesouraria", "Ativar rotina", "Adicionar conta", "Concluir", "Voltar", "Saiba as novidades dessa versão!", "Ativar rotina Atenção! Necessário fazer um novo login". Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

> [!TIP] **Raio-X da Tela Atual (Subsídio para Atualização do Manual):**
> Tela alcançada no passo 1: rota **#/inicio**, título **Caixa**. Leitura ao vivo do DOM; nada foi acionado.
> * **Seções visíveis:** **Vencidas**.
> * **Caminho de menu:** o passo cita um caminho de navegação; a evidência lida da árvore de menus consta no motivo do bloqueio e a rota não foi adivinhada.
> * **Contexto do Catálogo Nível 2 (`016`, consultivo):** tela **Notas > Orçamento rápido** | tabelas: **Item**, **Descrição**, **Qtd. Adicional**, **Cálculo**, **Base de cálculo**.
> * **Referência visual:** passo-01.png (tela exata no momento do bloqueio).

#### Descrição:
Os valores recebidos antecipadamente para despesas e certidões devem ser escriturados no Livro de Depósito Prévio sob estrito regime de custódia. Após a conclusão do ato, a quantia consumida deve ser convertida e o saldo restante restituído à parte.

#### Roteiro Técnico para Execução Manual:
1. Abrir a barra de menus do Orion TN no ambiente de homologação e localizar onde a tela do passo 1 fica na versão atual.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion Caixa**, acesse **Administração > Parâmetros > Tipos de Movimentação**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Demarcações na print:** (1) **Configurações** · (2) **Parametrizações**
   > [!WARNING] **Alvo sem evidência na tela:** O manual cita **"Administração > Parâmetros > Tipos de Movimentação"**, que não foi localizado na tela auditada do Orion TN. O texto do manual não foi alterado; revisar o nome do elemento.
   > [!WARNING] **Bloqueio de auditoria neste passo:** Cura de navegação descartada pela coerência pós-pouso: A tela alcançada por equivalência canônica explícita (Camada 1) ("Administração > Parâmetros > Tipos de Movimentação" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Depósito Prévio", citado(s) nos passos seguintes: a equivalência foi descartada e a tela restaurada (Camada 4, coerência pós-pouso). Elementos lidos na tela alcançada: "Caixa", "Configurações", "Contas bancárias", "Controle de caixa", "Ativar rotina - Firmas", "Ativar rotina - Notas", "Abertura sem troco", "Balcão de firmas - Estornar pagamentos com autorização", "Tesouraria", "Ativar rotina", "Adicionar conta", "Concluir", "Voltar", "Saiba as novidades dessa versão!", "Ativar rotina Atenção! Necessário fazer um novo login".
2. Assegure que a rubrica de adiantamento esteja associada ao tipo **Depósito Prévio**.
3. No **Orion TN**, abra o ato em **Notas > Protocolo**, aba **Financeiro / Custas**.
4. Ao finalizar a escritura e apurar o custo total real, clique no botão **Converter Depósito em Emolumento Definitivo**.
5. O sistema baixará o crédito do Livro de Depósito Prévio e lançará a receita definitiva de emolumentos.
6. Se houver resíduo, clique em **Emitir Recibo de Devolução de Saldo** para respaldar a entrega do troco ao apresentante.

* **Corregedoria: Manter o Livro de Depósito Prévio atualizado diariamente é exigência expressa do Provimento CNJ nº 149/2023.**

#### Evolução da Reauditoria
* **Ambiente:** Produtos (homologacao interna Siplan) → Produtos (homologacao interna Siplan)
* **Status:** [ATT] atualizacao_editorial → [ATT] atualizacao_editorial
* **Bloqueio anterior:** passo não registrado — Defasagem Editorial do Manual (Recurso Inexistente na Tela): No passo 1, o manual cita um caminho de menu que não existe na versão atual. A tela alcançada por equivalência canônica explícita (Camada 1) ("Administração > Parâmetros > Tipos de Movimentação" -> "Configurações > Parametrizações" (#/configuracoes)) não contém "Depósito Prévio", citado(s) nos passo → **mantido** (agora: passo 1, Defasagem Editorial do Manual (Recurso Inexistente na Tela))
