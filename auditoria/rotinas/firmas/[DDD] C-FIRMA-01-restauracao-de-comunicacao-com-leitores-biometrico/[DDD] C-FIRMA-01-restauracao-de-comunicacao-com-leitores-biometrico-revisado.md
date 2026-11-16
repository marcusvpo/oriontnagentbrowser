---
id: C-FIRMA-01
titulo: 'Restauração de Comunicação com Leitores Biométricos e Câmeras via IntegradorSPCM'
modulo: firmas
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
> **Motivo Técnico:** Depende diretamente de hardware externo e serviço local Windows (IntegradorSPCM.exe, leitor biométrico Futronic/SecuGen via USB e webcam).

#### Descrição:
A comunicação entre o navegador web e os dispositivos físicos de balcão (leitores Futronic/SecuGen e webcams) é intermediada pelo aplicativo local IntegradorSPCM executado em Java. Travamentos no processo bloqueiam as leituras.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Na estação de atendimento, verifique a bandeja do sistema do Windows (Systray). Se o ícone do **IntegradorSPCM** estiver ausente ou congelado, encerre o processo via Gerenciador de Tarefas.
2. Desconecte o cabo USB do leitor biométrico e reconecte em uma porta USB traseira da placa-mãe.
3. Acesse o diretório `C:\Siplan\IntegradorSPCM\` e execute o arquivo `IntegradorSPCM.exe` como Administrador.
4. Aguarde a confirmação de inicialização do serviço na porta local.
5. No **Orion TN**, abra o balcão de firmas, vá em **Configurações > Periféricos de Balcão**.
6. Na aba **Biometria**, clique em **Testar Captura** e posicione o dedo no sensor.
7. Na aba **Câmera**, selecione o driver nativo e valide a imagem na tela.

* **Estabilidade: Não utilize hubs USB sem alimentação própria para conectar leitores biométricos; a oscilação de corrente desativa o sensor ótico.**
