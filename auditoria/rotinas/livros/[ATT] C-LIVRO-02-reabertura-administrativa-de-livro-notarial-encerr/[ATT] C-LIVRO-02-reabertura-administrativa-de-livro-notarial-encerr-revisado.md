---
id: C-LIVRO-02
titulo: 'Reabertura Administrativa de Livro Notarial Encerrado Prematuramente com Termos Vagos'
modulo: livros
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-2'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 1
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  rbac:
    perfil_exigido: ['administrador', 'substituto']
    origem_requisito: 'passo 1'
    estado: satisfied
    atendido: true
    perfil_pleno_comprovado_por: 'Perfil de acesso - Gerência webFirmas'
    sessao_usuario: '4tabeliao.scs'
    sessao_cargo: 'TABELIAO'
    sessao_perfis: ['Perfil de acesso - Gerência webCaixa', 'Perfil de acesso - Gerência webEstoque', 'Perfil de acesso - Gerência webGed', 'Perfil de acesso - Gerência webLivros', 'Perfil de acesso - Gerência webPro', 'Perfil de acesso - Gerência webFirmas']
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 1, o manual cita "Configurações > Livros Notariais > Cadastro e Encerramento", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Administração > Cadastro de Impedimentos; Administração > Controle de Livros; Administração > Cadastro de Pessoas Jurídicas; Configurações (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
Quando o operador aciona a rotina de encerramento de livro sem atentar para o saldo de folhas vagas, o sistema bloqueia novos atos. O administrador pode cancelar a operação e reabrir o livro.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Com login de administrador ou substituto, acesse **Configurações > Livros Notariais > Cadastro e Encerramento**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Configurações > Livros Notariais > Cadastro e Encerramento] não localizado no DOM nem na Árvore de Acessibilidade
2. Localize o livro que consta com status `ENCERRADO`.
3. Selecione o livro e clique no botão **Ações > Reabrir Livro Notarial / Cancelar Encerramento**.
4. Informe a justificativa formal (ex.: *"Cancelamento de encerramento precoce para consumo dos termos restantes"*).
5. Confirme a operação. O livro retornará ao status de `Aberto / Em Uso`.
6. No balcão, utilize as posições remanescentes até o encerramento da numeração física real.
7. Concluído o lote, acione novamente a rotina formal de encerramento emitindo o respectivo termo.

* **Auditoria: Sempre confira a numeração do último termo impresso fisicamente antes de homologar o encerramento no sistema.**
