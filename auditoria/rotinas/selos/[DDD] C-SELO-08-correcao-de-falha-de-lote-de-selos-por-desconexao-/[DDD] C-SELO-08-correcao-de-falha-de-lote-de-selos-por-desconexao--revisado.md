---
id: C-SELO-08
titulo: 'Correção de Falha de Lote de Selos por Desconexão de Token e Assinador Local'
modulo: selos
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
> **Motivo Técnico:** Depende diretamente de hardware externo (token físico A3 USB / leitora de cartão) e serviço local Assinador Orion.

#### Descrição:
Quando a serventia utiliza certificado padrão A3 (token USB ou cartão com leitora) em vez de A1, o serviço assinador local pode perder o handle criptográfico após suspensão do Windows ou oscilação de porta USB.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Feche o navegador e os módulos do **Orion TN** abertos na estação.
2. Desconecte o token ou leitora de cartão da porta USB e conecte em uma porta traseira estável.
3. Abra o aplicativo **Gerenciador de Certificados / Token** (ex.: SafeNet / SafeSign) e valide se o certificado está visível.
4. Na barra de tarefas do Windows (Systray), clique com botão direito no ícone do **Assinador Orion** e acione **Reiniciar Serviço**.
5. Abra o **Orion TN**, acesse **Módulos > Selo Digital > Transmissão de Lote**.
6. Selecione o lote pendente, insira o código PIN do token quando solicitado e conclua o envio.

* **Recomendação de TI: Serventias com grande volume de selagem devem preferir certificados padrão A1 instalados em servidor para evitar travamentos por hardware de token.**
