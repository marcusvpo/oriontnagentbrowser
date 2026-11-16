---
id: D-3.6
titulo: 'Fazer Digitalização em Lote por Código de Barras do Papel'
modulo: selos
secao: D
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
> **Motivo Técnico:** Depende diretamente de scanner físico com alimentador e leitura óptica de código de barras em lote.

#### Descrição:
Permite digitalizar lotes de fichas de firma mesmo fora de ordem numérica. O software do Orion TN realiza o reconhecimento óptico do código de barras presente na folha de segurança física, localiza o cadastro correspondente e associa a imagem de forma automatizada.

#### Roteiro Técnico para Execução Manual:
1. Reproduzir o passo a passo original desta rotina na estação de atendimento, com o periférico ou o serviço local disponível.
2. Conferir o resultado com a equipe de Produtos e, se persistir, abrir chamado no Suporte Siplan informando módulo, código da rotina e comportamento observado.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Posicione a pilha de cartões de firma no alimentador do scanner (sem necessidade de ordenação numérica).
2. Acesse o menu **Firmas > Cadastros > Digitalização em Lote > Por Código de Barras do Papel**.
3. Clique no botão **Iniciar Leitura**.
4. O sistema processará as páginas e identificará o código de barras de cada folha, exibindo o número do cartão correspondente.
5. Verifique a lista de imagens processadas; cartões não identificados ficarão com alerta amarelo para conferência manual.
6. Clique em **Concluir e Salvar** para gravar as imagens em seus respectivos cadastros.

* **Observação: Garanta que a área do código de barras do papel físico esteja limpa e sem carimbos sobrepostos para assegurar 100% de leitura.**
* **Dica / Caso Real do 0800: Ao realizar a carga de selos ou papéis no **Orion Estoque**, confira sempre os dígitos verificadores e a série física antes de confirmar para evitar desalinhamento na sequência mecânica de lavratura.**
