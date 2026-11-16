---
id: M-9.1
titulo: 'Anexar Documentos, Biometria e Foto em um Cartão de Assinatura'
modulo: firmas
secao: M
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_dados_banco
  carga: mutation
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência de Ambiente/Hardware'
  prints_geradas: 0
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([DDD]):**  
> A auditoria automática foi interrompida: **Dependência de Ambiente/Hardware**.
>
> **Motivo Técnico:** Rotina dedicada exclusivamente à captura multimídia via hardware externo (webcam, leitor biométrico e scanner de mesa).

#### Descrição:
Procedimento de captura multimídia e biometria na abertura ou atualização do cartão de assinatura, englobando fotografia do titular via webcam, captura de impressões digitais e digitalização de documentos e espelho de assinaturas.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Dentro do cadastro do cartão de assinatura, acesse a aba **Fotos e Biometria**.
2. Na seção **Foto do titular**, clique em **Capturar foto** para acionar a webcam integrada, enquadre o rosto da pessoa e clique em **Salvar foto**.
3. Na seção **Biometria**, selecione o dedo a ser coletado (ex: polegar direito), posicione o dedo do cliente no leitor óptico e colete as amostras solicitadas pelo assistente até atingir a qualidade mínima exigida.
4. Na aba **Documentos / Anexos**, clique em **Digitalizar** para acionar o scanner de mesa ou em **Selecionar arquivo** para importar o PDF/JPEG da identidade e da ficha física assinada.
5. Ajuste a área de recorte da imagem da assinatura para que fique nítida para as futuras comparações no balcão.
6. Clique em **Salvar** para registrar as mídias no perfil do cartão.

* **Importante: Caso o titular possua impedimento físico para coleta biométrica, selecione a opção de exceção fundamentada no sistema.**
* **Observação: As imagens digitalizadas ficam salvas no servidor do cartório e são recuperadas instantaneamente a cada reconhecimento de firma.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
