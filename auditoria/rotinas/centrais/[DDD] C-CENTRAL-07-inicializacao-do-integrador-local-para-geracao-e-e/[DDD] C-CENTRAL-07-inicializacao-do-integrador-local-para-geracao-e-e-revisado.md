---
id: C-CENTRAL-07
titulo: 'Inicialização do Integrador Local para Geração e Exportação de Lotes da DOI'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_dados_banco
  carga: read_only
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** Depende do aplicativo binário local Integrador Orion (C:\Siplan\Integrador\Integrador.exe) na bandeja do Windows para compilação e exportação de lotes DOI.

#### Descrição:
A compilação do arquivo de remessa da DOI no formato oficial exigido pelo software validador da Receita Federal é executada por um binário local na estação do usuário. Se o processo estiver inativo, o lote não é salvo.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Verifique a bandeja do sistema do Windows (Systray ao lado do relógio).
2. Caso o ícone do **Integrador Orion** não esteja visível:
3. Acesse o menu Iniciar do Windows e digite **Integrador Orion** (ou acesse `C:\Siplan\Integrador\Integrador.exe`).
4. Execute o aplicativo como Administrador.
5. Confirme que o ícone passou a ser exibido na bandeja com status conectado.
6. No navegador, retorne ao **Orion TN** em **Administração > Comunicações > DOI**.
7. Selecione o mês de apuração e clique no botão **Gerar e Exportar Lote DOI**.
8. O sistema salvará o arquivo gerado diretamente na pasta de downloads ou diretório parametrizado.

* **Configuração de Inicialização: Coloque um atalho do Integrador Orion na pasta Inicializar do Windows (`shell:startup`) para que ele suba automaticamente com o computador.**
