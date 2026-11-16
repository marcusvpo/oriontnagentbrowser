---
id: C-FIRMA-06
titulo: Tratamento de RPS Rejeitado no Balcão de Firmas por Falta de Tomador Identificado
tags:
- Firmas
- RPS
- NFS-e
- Emissor Nacional
- Tomador Não Identificado
objetivo: Adequar a configuração do lote de NFS-e de balcão de firmas para serviços de pequeno valor sem identificação de CPF/CNPJ do tomador.
sinonimos:
- rejeição rps firmas
- nota fiscal balcão rejeitada
- emissor nacional exige tomador
- nfs-e de reconhecimento de firma
perguntas_usuario:
- A nota fiscal dos reconhecimentos de firma do balcão foi rejeitada pelo Emissor Nacional, como resolver?
- Como emitir NFS-e de atos de balcão quando o cliente não quis informar o CPF?
- O que colocar no tomador da nota fiscal global de firmas do final do dia?
sintomas_comuns:
- 'rejeição no lote de NFS-e: Campo CPF/CNPJ do Tomador obrigatório para o serviço selecionado'
- notas fiscais de balcão ficam presas impedindo o encerramento diário
- serviços rápidos de cópia e autenticação rejeitados no envio ao provedor municipal
video:
  tem_video: false
modulo: firmas
modulo_nome: Reconhecimento de Firmas e Cartões
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Na migração para o Emissor Nacional, certos municípios passaram a exigir parametrização tributária especial para "Tomador Não Identificado" (Consumidor Final) em serviços de balcão.

#### Passo a passo:
1. Acesse **Configurações > Parâmetros de NFS-e > Regras de Balcão**.
2. Na seção **Tomador Padrão para Atos Não Identificados**, selecione a modalidade **Consumidor Final / Não Identificado**.
3. Caso o provedor exija cadastro específico: informe os dados da Serventia ou a inscrição padrão autorizada pelo fisco municipal.
4. No campo **Classificação Tributária / CST**, informe o código de operação notarial sem retenção na fonte.
5. Acesse o lote de RPS rejeitado em **Orion Caixa > Notas Fiscais > Listagem de RPS**.
6. Clique no botão **Reprocessar Lote de Firmas** para reenviar as notas com o novo layout parametrizado.

* **Legislação Fiscal:** Sempre ofereça a inclusão do CPF do apresentante no recibo para agilizar a emissão individualizada quando solicitada.
---
