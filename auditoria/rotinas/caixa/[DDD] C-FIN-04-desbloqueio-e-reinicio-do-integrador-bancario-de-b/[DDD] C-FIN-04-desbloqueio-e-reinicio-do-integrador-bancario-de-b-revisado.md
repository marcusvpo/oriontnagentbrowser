---
id: C-FIN-04
titulo: 'Desbloqueio e Reinício do Integrador Bancário de Boletos de Mensalistas'
modulo: caixa
secao: C
auditoria_ui:
  data_execucao: '2026-11-26'
  status: dependencia_dados_banco
  review_tags: ['DDD']
  carga: read_only
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** Os passos 1 a 4 são executados no terminal/console do Docker do servidor da serventia (docker ps -a, docker restart siplan-integrador): infraestrutura local fora do navegador, indisponível no ambiente web de homologação.

#### Descrição:
A remessa e o registro síncrono de boletos bancários dependem do microsserviço Integrador executado em container Docker no servidor local da serventia. Quedas de conexão ou reinicializações do servidor podem pausar o serviço.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No servidor da serventia (ou através da equipe de TI/Suporte Siplan), abra o terminal ou console do **Docker**.
2. Verifique o estado dos containers executando `docker ps -a`.
3. Reinicie o container do integrador bancário através do comando: `docker restart siplan-integrador`.
4. Aguarde 60 segundos para restabelecimento das rotas de rede.
5. No **Orion TN / Orion Caixa**, acesse **Faturamento > Mensalistas > Emissão de Boletos**.
6. Selecione a fatura pendente e acione o botão **Gerar / Transmitir Boletos** novamente.

* **Suporte Siplan: Se após o restart o erro persistir, valide se o certificado digital da conta bancária da serventia (A1) não expirou nas configurações do convênio bancário.**
