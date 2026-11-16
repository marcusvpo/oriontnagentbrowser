---
id: M-35.0
titulo: 'Cadastrar Novo Tipo de Anexo'
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
> **Motivo Técnico:** No passo 1, o manual cita "Notas > Cadastros auxiliares > Tipos de anexo", "Adicionar", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros; Notas; Administração > Controle de Estoque > Cadastros; Configurações > Cadastros auxiliares (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Permite criar um novo classificador documental para categorizar arquivos digitalizados e anexados em protocolos notariais, fichas de firma e pedidos de certidão.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Notas > Cadastros auxiliares > Tipos de anexo** e clique em **Adicionar**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Notas > Cadastros auxiliares > Tipos de anexo, Adicionar] não localizado no DOM nem na Árvore de Acessibilidade
2. No campo **Descrição**, digite a nomenclatura clara da categoria documental (ex: 'Certidão Negativa de Débitos Tributários', 'Pacto Antenupcial').
3. No campo **Sigla**, insira um código abreviado de identificação rápida (ex: `CND`, `PACTO`, `RG`).
4. Se disponível, marque a opção para definir se o classificador será de uso obrigatório em determinados tipos de ato.
5. Clique no botão **Concluir** para registrar a nova categoria.

* **Importante: A sigla é utilizada internamente pelo Orion TN para indexar e nomear os arquivos no diretório seguro do servidor.**
* **Dica / Caso Real do 0800: Mantenha o Orion TN atualizado e limpe periodicamente o cache do navegador (%temp%) para evitar congelamento de telas e conflito de bibliotecas em rede.**
