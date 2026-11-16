---
id: C-CONFIG-01
titulo: 'Substituição e Configuração de Novo Certificado Digital A1 no Orion TN, SEFAZ e SIGNO'
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
> Esta rotina não pôde ser validada automaticamente pelo navegador web porque envolve **arquivo físico privado (.pfx) / senha de cartório** (Dependência de Ambiente/Hardware).
>
> **Motivo Técnico:** Requer upload de arquivo .pfx criptografado real e digitação da senha privada do titular/serventia, impossível de simular com dados fictícios.

#### Descrição:
Substituição e Configuração de Novo Certificado Digital A1 no Orion TN, SEFAZ e SIGNO. Esta operação atua fora do escopo estrito da interface gráfica web do Orion TN, exigindo intervenção no ambiente operacional da serventia, periféricos de balcão ou banco de dados.

#### Roteiro Técnico para Execução Manual:
1. Obter o arquivo criptográfico `.pfx` ou `.p12` emitido por Autoridade Certificadora ICP-Brasil.
2. Acessar **Configurações > Certificados Digitais**.
3. Fazer o upload manual do arquivo e informar a senha privada de instalação.
4. Validar o status do certificado (Válido até DD/MM/AAAA) e testar a comunicação com a SEFAZ estadual e o portal SIGNO.

* **Diretriz de Suporte N2 / 0800:** Caso a falha persista após a execução dos passos acima, abrir chamado no Suporte Siplan informando o módulo afetado (config), o código da rotina e o comportamento observado no ambiente de produção.
