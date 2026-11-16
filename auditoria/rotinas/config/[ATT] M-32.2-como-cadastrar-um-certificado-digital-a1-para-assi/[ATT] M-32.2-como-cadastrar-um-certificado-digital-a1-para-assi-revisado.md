---
id: M-32.2
titulo: 'Como Cadastrar um Certificado Digital A1 para Assinatura de Lotes'
modulo: config
secao: M
auditoria_ui:
  data_execucao: '2026-11-15'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Administração > Parâmetros > Certificados digitais", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Demonstrativo financeiro dos selos digitais; Administração; Configurações > Tabela de custas > Parâmetros (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Instrui a importação e parametrização do Certificado Digital padrão ICP-Brasil (tipo A1 - arquivo em software .pfx/.p12) no repositório do Orion TN, habilitando a assinatura digital automatizada de lotes SEFAZ e e-Notariado.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Administração > Parâmetros > Certificados digitais**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Administração > Parâmetros > Certificados digitais] não localizado no DOM nem na Árvore de Acessibilidade
2. Clique no botão **Adicionar**.
3. No campo **Descrição / Titular**, insira o nome do tabelião ou escrevente titular do certificado.
4. Clique no botão **Selecionar arquivo** e localize o arquivo do certificado digital no formato `.pfx` ou `.p12` no computador.
5. No campo **Senha**, digite a senha privativa de proteção da chave privada do certificado.
6. Clique no botão **Validar / Testar Certificado**: o sistema lerá o arquivo, validará a cadeia ICP-Brasil e exibirá a data de validade inicial e final.
7. Clique no botão **Salvar** para registrar o certificado no sistema.

* **Importante: Mantenha controle sobre a data de expiração do certificado A1; certificados vencidos paralisam imediatamente o envio de comunicações obrigatórias.**
* **Dica / Caso Real do 0800: Para falhas em leitores biométricos (Futronic/SecuGen), reinicie o processo do **IntegradorSPCM** na bandeja do Windows e certifique-se de conectar o cabo em portas USB 3.0 diretas.**
