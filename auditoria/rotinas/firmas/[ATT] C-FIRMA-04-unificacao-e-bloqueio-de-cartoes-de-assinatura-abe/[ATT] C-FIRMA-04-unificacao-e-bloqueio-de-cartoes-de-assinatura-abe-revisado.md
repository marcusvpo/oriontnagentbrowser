---
id: C-FIRMA-04
titulo: 'Unificação e Bloqueio de Cartões de Assinatura Abertos em Duplicidade'
modulo: firmas
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: mutation
  worker_id: 'worker-4'
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
> **Motivo Técnico:** No passo 1, o manual cita "Balcão de Firmas > Fichas / Cartões de Assinatura", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas; Firmas > Balcão de firmas; Firmas > Reconhecimento de firmas; Firmas > Consultas > Reconhecimentos de firmas; Firmas > Cadastros > Cartão de assinatura (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A legislação veda a exclusão física de fichas numeradas. A duplicidade deve ser tratada elegendo-se a ficha primitiva como principal e inativando a ficha secundária com nota de remissão recíproca.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Acesse o menu **Balcão de Firmas > Fichas / Cartões de Assinatura**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Balcão de Firmas > Fichas / Cartões de Assinatura] não localizado no DOM nem na Árvore de Acessibilidade
2. Localize ambas as fichas buscando pelo CPF da parte.
3. Identifique a ficha mais antiga (ou que possui o maior acervo de imagens e atos) para ser a **Ficha Principal**.
4. Abra a ficha secundária (duplicada) e clique em **Editar**.
5. Altere o status para **Inativo / Bloqueado** e, no campo de observações, registre: *"Ficha aberta em duplicidade; atos unificados na Ficha nº [NUMERO_PRINCIPAL]"*.
6. Na Ficha Principal, registre no histórico a anotação da existência do cartão correlato inativado.
7. Clique em **Salvar** em ambas as fichas.

* **Auditoria Notarial: A inativação formal impede que novas firmas sejam reconhecidas no cartão excedente sem quebrar a rastreabilidade histórica.**
