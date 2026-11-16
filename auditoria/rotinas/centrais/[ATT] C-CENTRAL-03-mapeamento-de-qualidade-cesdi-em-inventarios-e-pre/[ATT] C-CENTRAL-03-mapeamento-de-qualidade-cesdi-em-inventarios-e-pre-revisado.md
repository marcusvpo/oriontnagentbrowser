---
id: C-CENTRAL-03
titulo: 'Mapeamento de Qualidade CESDI em Inventários e Preenchimento Obrigatório'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
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
> **Motivo Técnico:** No passo 1, o manual cita "Orion TN", "Configurações > Cadastros Auxiliares > Tipos de Participação", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Firmas > Cadastros; Relatórios > Auditoria Selos TJ - Orion; Administração > Controle de Estoque > Cadastros; Configurações; Configurações > Cadastros auxiliares (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
O Provimento nº 18 do CNJ estabelece que todo inventário comunicado à CESDI deve possuir identificação explícita do falecido, herdeiros e advogado assistente, além de dados de filiação completa.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 1 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. No **Orion TN**, acesse **Configurações > Cadastros Auxiliares > Tipos de Participação**.
   [aqui vai a print "passo-01.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN, Configurações > Cadastros Auxiliares > Tipos de Participação] não localizado no DOM nem na Árvore de Acessibilidade
2. Verifique se as participações estão mapeadas no quadro **Comunicações - Configurações**:
3. Falecido/Autor da Herança ➔ Qualidade CESDI: **De Cujus / Falecido**.
4. Herdeiro/Cônjuge Meiro ➔ Qualidade CESDI: **Herdeiro**.
5. Advogado/Assistente ➔ Qualidade CESDI: **Advogado**.
6. Abra o protocolo do inventário em **Notas > Protocolo**, aba **Partes**.
7. Confira cada participante, garantindo que os papéis acima foram selecionados.
8. Abra o cadastro das pessoas e preencha obrigatoriamente: **Filiação (Pai e Mãe)**, **Data de Nascimento** e **Município com Código IBGE**.
9. Salve o protocolo e retransmita a carga da CESDI.

* **Validação Estrutural: Em caso de genitor desconhecido, marque expressamente a opção "Pai Não Declarado" no cadastro para não gerar nó nulo no XML.**
