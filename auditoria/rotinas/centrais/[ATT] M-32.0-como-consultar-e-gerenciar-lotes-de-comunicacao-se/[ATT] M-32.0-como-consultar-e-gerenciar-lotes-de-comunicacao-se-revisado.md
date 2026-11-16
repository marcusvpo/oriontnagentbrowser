---
id: M-32.0
titulo: 'Como Consultar e Gerenciar Lotes de Comunicação (SEFAZ / E-notariado)'
modulo: centrais
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
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
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Comunicações > Lotes de comunicação", "Firmas > Comunicações > Lotes SEFAZ", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Dashboard > Comunicações; Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Painel central para monitoramento, auditoria e manutenção dos lotes de comunicação digital transmitidos às centrais externas (SEFAZ-SP para atos veiculares e e-Notariado), permitindo inspecionar logs técnicos e estornar lotes inconsistentes.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Comunicações > Lotes de comunicação** (ou **Firmas > Comunicações > Lotes SEFAZ**).
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Comunicações > Lotes de comunicação, Firmas > Comunicações > Lotes SEFAZ] não localizado no DOM nem na Árvore de Acessibilidade
2. Na área de filtros, defina a busca: selecione o **Destino** (**SEFAZ** ou **e-Notariado**), o **Período de envio**, o **Número do Lote** ou o **Status** (**Processado**, **Pendente**, **Rejeitado**).
3. Clique em **Filtrar** para listar os lotes na tela.
4. Na linha do lote pretendido, utilize as ferramentas disponíveis:
   * **Visualizar logs**: abre a janela técnica com o XML de envio, XML de retorno e respostas do webservice.
   * **Itens do lote**: relaciona todos os termos de comparecimento ou cartões que integraram o envio.
   * **Estornar lote**: desfaz a remessa, retornando os termos para o status 'Pendente' para que possam ser corrigidos e reenviados.
5. Clique em **Fechar** ou **Voltar** ao concluir a análise.

* **Importante: Apenas lotes com status 'Rejeitado' ou com falha técnica devem ser estornados; lotes homologados e com recibo definitivo da SEFAZ não podem ser desfeitos.**
* **Dica / Caso Real do 0800: Evite o uso de aspas duplas, apóstrofos e quebras de linha manuais em campos de observações para comunicações com SISCOAF e CENSEC, prevenindo rejeições de schema XML.**
