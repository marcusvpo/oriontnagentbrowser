---
id: D-3.11
titulo: 'Fazer Reconhecimento de Firma'
modulo: firmas
secao: D
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-2'
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
> **Motivo Técnico:** No passo 1, o manual cita "Firmas > Reconhecimento de Firmas", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Rotina principal de atendimento de balcão do módulo de Firmas. Localiza o cartão de assinatura do signatário, compara os autógrafos, permite seleção do tipo de ato (Autenticidade ou Semelhança), preenche termos veiculares com IA, consome selos e gera etiquetas térmicas com QR Code.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Firmas > Reconhecimento de Firmas**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Firmas > Reconhecimento de Firmas] não localizado no DOM nem na Árvore de Acessibilidade
2. Localize o cliente pelo número do **Pedido**, senha do **SGA** ou pesquisando por **Nome/CPF/Cartão**.
3. Confira na tela os autógrafos cadastrados, documentos de identificação e a fotografia da ficha.
4. Clique no ícone **+** para adicionar o serviço, selecione a modalidade (**Autenticidade** ou **Semelhança**) e a quantidade de firmas.
5. Se for transferência de veículo (DUT), clique em **Preencher com IA** para ler a imagem do documento e gerar o termo de transferência automaticamente.
6. Clique em **Impressão/Confirmar** para emitir a etiqueta com selo digital, consumir o estoque e enviar a cobrança ao caixa.

* **Importante: Se for necessário cancelar no mesmo dia, use 'Reutilizar' para devolver o selo ao estoque; em dias posteriores, o selo deverá ser 'Inutilizado'.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
