---
id: C-ACESSO-05
titulo: 'Falha de Conexão com o Serviço Docker do Módulo SGA'
modulo: acesso
secao: C
auditoria_ui:
  data_execucao: '2026-11-11'
  status: dependencia_dados_banco
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **serviço de infraestrutura / container docker** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Demanda acesso ao host Linux/Windows onde o container do SGA roda, verificação de portas 8080/8443 e comando docker restart sga-service.

#### Descrição:
Falha de Conexão com o Serviço Docker do Módulo SGA. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Acessar o terminal do servidor de aplicação via SSH ou PowerShell administrativo.
2. Executar `docker ps -a | grep sga` para inspecionar o status do container.
3. Checar logs com `docker logs --tail 100 sga-service` identificando possíveis falhas de memória ou lock de porta.
4. Reiniciar o container com `docker restart sga-service` e validar se a API interna responde HTTP 200.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (acesso), o código da rotina e o comportamento observado no ambiente de produção.
