---
id: D-3.5
titulo: 'Fazer Digitalização em Lote por Sequência de Cartão'
modulo: caixa
secao: D
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: mutation
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** A digitalização em lote por sequência de cartão exige as fichas físicas no alimentador (ADF) de um scanner homologado e o perfil de cores/resolução do dispositivo: hardware TWAIN indisponível no ambiente web de homologação.

#### Descrição:
Esta funcionalidade otimiza o arquivamento digital de cartões de firma recém-cadastrados. O operador coloca uma pilha de fichas no alimentador do scanner e o sistema vincula cada imagem ao seu respectivo cadastro seguindo rigorosamente a ordem sequencial dos números informados.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Organize as fichas de firma físicas em rigorosa ordem numérica crescente no alimentador (ADF) do scanner.
2. Acesse o menu **Firmas > Cadastros > Digitalização em Lote > Por Sequência de Cartão**.
3. Preencha o **Cartão Inicial** e o **Cartão Final** correspondentes ao lote físico inserido no scanner.
4. Selecione o perfil de cores e resolução do scanner homologado.
5. Clique no botão **Iniciar Digitalização** e aguarde a alimentação contínua das folhas.
6. Na tela de auditoria, faça a conferência visual das miniaturas e clique em **Confirmar Gravação**.

* **Importante: Se o scanner puxar duas folhas juntas (dupla alimentação), cancele a sessão e restrinja o lote a partir do número da falha.**
* **Dica / Caso Real do 0800: Para impressoras de cupom travadas no caixa, acesse os serviços do Windows e reinicie o **Spooler de Impressão**, atualizando em seguida o driver nas configurações do Orion Caixa.**
