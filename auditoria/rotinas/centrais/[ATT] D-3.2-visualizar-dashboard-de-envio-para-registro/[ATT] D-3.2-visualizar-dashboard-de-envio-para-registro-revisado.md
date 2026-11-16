---
id: D-3.2
titulo: 'Visualizar Dashboard de Envio para Registro'
modulo: centrais
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-4'
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
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Dashboard de Envio para Registro", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard; Dashboard > Envio para Registro; Notas; Administração > Envio de escrituras para Registro (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O Dashboard de Envio para Registro gerencia as escrituras públicas que foram despachadas aos Cartórios de Registro de Imóveis para prenotação e registro. Permite acompanhar status de remessa, recebimento de exigências (notas devolutivas) e conclusão do ato.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Dashboard de Envio para Registro**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Notas > Dashboard de Envio para Registro] não localizado no DOM nem na Árvore de Acessibilidade
2. Analise os blocos operacionais: **Aguardando Envio**, **Prenotados no RI**, **Com Exigência** e **Registrados**.
3. Filtre por **Cartório de Imóveis de Destino**, **Número do Protocolo** ou **Período**.
4. Ao clicar em um card em exigência, visualize o teor da nota devolutiva e o prazo limite para reapresentação.
5. Clique em **Atualizar Status** após anexar a certidão ou comprovação do registro imobiliário concluído.

* **Importante: Registrar o número de prenotação fornecido pelo Registro de Imóveis facilita a busca integrada em caso de questionamento das partes.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**
