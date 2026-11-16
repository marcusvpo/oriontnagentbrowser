---
id: C-CONFIG-05
titulo: 'Instalação e Integração de Scanner de Cartão de Autógrafo via DocuVieware e TWAIN'
modulo: config
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
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **driver twain / periférico usb físico** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Requer scanner de mesa/alimentador USB conectado fisicamente (ex: Fujitsu fi-series, Canon) e driver TWAIN 32-bit ativo no Windows.

#### Descrição:
Instalação e Integração de Scanner de Cartão de Autógrafo via DocuVieware e TWAIN. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Conectar o scanner à porta USB 3.0 direta do computador.
2. Instalar o driver oficial TWAIN fornecido pelo fabricante.
3. Iniciar o serviço **IntegradorSPCM** na bandeja do sistema.
4. No Orion TN, acessar a captura de biometria/cartão e validar se a fonte de digitalização TWAIN é listada e responde ao comando de scan.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
