# Revisão Editorial em Lote × Árvore Canônica de Menus (06.05.02)

> **Gerado em:** 2026-11-24T19:15:01.318Z (análise 100% offline, sem execução de navegador ou geração de prints).
> **Escopo:** 100% das **141 rotinas com tag de revisão** em `auditoria/rotinas/**` (`[ATT]`, `[XRX]`, `[DDD]`, `[CCC]`, `[ATT][CCC]`, `[CCC][XRX]`), desconsiderando as 28 rotinas já validadas sem tag.
> **Fontes Soberanas:** `auditoria/mapeamento-menus/arvore-menus-orion-tn.md` (115 caminhos finais da versão `06.05.02`), `auditoria/data/orion-menu-tree-canonical.json`, `auditoria/reports/auditoria-caminhos-menus.md`, `auditoria/cache/orion-route-graph.json`, `auditoria/src/menu-canonical.ts`, `auditoria/src/route-synonyms.ts`, `auditoria/cache/curated-route-synonyms.json`, originais em `kb/` e rascunhos `*-revisado.md` (incluindo `diagnostico_tela_att` / Raio-X).
> **Trava de Aprovação:** Nenhum arquivo em `kb/`, `auditoria/rotinas/` ou `doc conhecimento final/OrionTN pos.md` foi alterado nesta etapa.

---

## 1. Resumo Executivo

### 1.1 Totais por Categoria

| Categoria | Descrição | Quantidade | % |
|---|---|---:|---:|
| **A** | Atualizável Integralmente (pronta para atualizar texto + fila de prints) | **4** | 2.8% |
| **B** | Atualizável Parcialmente (menu corrigido, passos internos com lacuna) | **63** | 44.7% |
| **C** | Defasagem Real / Recurso Removido, Externo ou Hardware/Ambiente (manter em revisão humana) | **54** | 38.3% |
| **D** | Dependência Cruzada (`[XRX]`) com texto já coerente (6) ou ajuste mínimo de grafia (14) | **20** | 14.2% |
| **Total** | **Todas as rotinas auditadas com tag** | **141** | **100.0%** |

### 1.2 Distribuição por Tag Original

| Tag Original | Total | A | B | C | D |
|---|---:|---:|---:|---:|---:|
| `[ATT]` | 92 | 3 | 51 | 38 | 0 |
| `[ATT][CCC]` | 2 | 0 | 2 | 0 | 0 |
| `[CCC]` | 1 | 1 | 0 | 0 | 0 |
| `[CCC][XRX]` | 1 | 0 | 0 | 0 | 1 |
| `[DDD]` | 18 | 0 | 2 | 16 | 0 |
| `[XRX]` | 27 | 0 | 8 | 0 | 19 |

### 1.3 Distribuição por Módulo

| Módulo | Total | A | B | C | D |
|---|---:|---:|---:|---:|---:|
| `acesso` | 9 | 0 | 2 | 7 | 0 |
| `centrais` | 21 | 1 | 9 | 5 | 6 |
| `certidoes` | 13 | 0 | 6 | 6 | 1 |
| `config` | 28 | 0 | 17 | 11 | 0 |
| `firmas` | 28 | 0 | 15 | 9 | 4 |
| `livros` | 20 | 2 | 7 | 10 | 1 |
| `selos` | 22 | 1 | 7 | 6 | 8 |

---

## 2. Categoria A — Atualizável Integralmente (4 rotinas)

Rotinas com correspondência **100% comprovada** na árvore `06.05.02`, no Raio-X (`diagnostico_tela_att`) e/ou no `orion-route-graph.json`, prontas para aplicação editorial e fila de captura de prints (`fila-prints-pos-revisao-editorial.json`).

### C-CENTRAL-02 — Habilitação de Pessoa Obrigada Ativa no Portal SISCOAF para Envio de Comunicações
- **Módulo:** `centrais` · **Tag:** `[CCC]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/centrais/C-CENTRAL-02-habilitacao-de-pessoa-obrigada-ativa-no-portal-sis.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[CCC] C-CENTRAL-02-habilitacao-de-pessoa-obrigada-ativa-no-portal-sis/[CCC] C-CENTRAL-02-habilitacao-de-pessoa-obrigada-ativa-no-portal-sis-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.7, item 40: Configurações > Parametrizações) + auditoria/src/menu-canonical.ts (['configuracoes', 'parametros gerais'] -> ['Configurações', 'Parametrizações']) + Raio-X de M-16.5 (#/configuracoes, seção Comunicações: 'Clique aqui para acessar a tela de configuração no Orion Coaf') + auto_cura/curas_reaproveitadas ao vivo no revisado de C-CENTRAL-02 (passos 4, 5 e 6).
- **Justificativa:** Passos 1–3 ocorrem em portal externo (SISCOAF, tag [CCC], preservados). Todas as etapas dentro do Orion TN (passos 4–7) já foram validadas ao vivo no revisado (status comunicacao_externa, sem [ATT]), com correspondência 100% comprovada para os passos 4, 5 e 6.

| Passo | Texto Original (`kb/`) | Texto Atualizado Proposto (`06.05.02` + Raio-X) |
|---:|---|---|
| 4 | No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**. | No **Orion TN**, acesse **Configurações > Parametrizações**, selecione **Comunicações** e clique em **Clique aqui para acessar a tela de configuração no Orion Coaf**. |
| 5 | No campo **CPF do Responsável pelo Envio**, informe com exatidão o CPF que foi habilitado no portal. | No campo **CPF/CNPJ**, informe com exatidão o CPF que foi habilitado no portal. |
| 6 | Clique em **Gravar**. | Clique em **Cadastrar**. |

### R-26.0 — Imprimir Relatório de Índice por Livro
- **Módulo:** `livros` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/livros/R-26.0-imprimir-relatorio-de-indice-por-livro.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[ATT] R-26.0-imprimir-relatorio-de-indice-por-livro/[ATT] R-26.0-imprimir-relatorio-de-indice-por-livro-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.4, item 8: 'Relatórios > Índice por livro'); orion-route-graph.json (Relatórios > Índice por livro: campos 'Período', 'Livro', 'inputNumeroLivroFinal', 'Nome', 'Natureza', 'Livro e folha', 'PDF', 'Excel'; botões 'Imprimir', 'Fechar'); revisado R-26.0 (diagnostico_tela_att e auto_cura passo 2: 'Livro Inicial' -> 'Livro').
- **Justificativa:** Todos os passos têm correspondência 100% comprovada na 06.05.02, no diagnostico_tela_att de R-26.0 e no orion-route-graph.json: ajuste de caixa em 'Relatórios > Índice por livro' (passo 1), uso do campo real 'Livro' para os números inicial e final no lugar de 'Livro Inicial' e 'Livro Final' (passo 2) e ajuste de caixa em 'Livro e folha' (passo 3).

| Passo | Texto Original (`kb/`) | Texto Atualizado Proposto (`06.05.02` + Raio-X) |
|---:|---|---|
| 1 | 1. Acesse o menu principal do sistema em **Relatórios > Índice por Livro**. | 1. Acesse o menu principal do sistema em **Relatórios > Índice por livro**. |
| 2 | 2. Na tela de parâmetros, informe o **Período** de referência e defina os campos **Livro Inicial** e **Livro Final**. | 2. Na tela de parâmetros, informe o **Período** de referência e preencha os números inicial e final no campo **Livro**. |
| 3 | 3. No campo de ordenação, selecione o critério desejado: **Nome** (ordem alfabética das partes), **Natureza** ou **Livro e Folha** (ordem sequencial). | 3. No campo de ordenação, selecione o critério desejado: **Nome** (ordem alfabética das partes), **Natureza** ou **Livro e folha** (ordem sequencial). |

### R-36.0 — Imprimir Relatório do Livro de Protocolo
- **Módulo:** `livros` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/livros/R-36.0-imprimir-relatorio-do-livro-de-protocolo.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[ATT] R-36.0-imprimir-relatorio-do-livro-de-protocolo/[ATT] R-36.0-imprimir-relatorio-do-livro-de-protocolo-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.4, item 11: 'Relatórios > Livro Protocolo'); orion-route-graph.json (Relatórios > Livro Protocolo: campos 'Período', 'Livro atual', 'Página atual', 'Rascunho (não exibe livro e página)'; botões 'Imprimir', 'Fechar'); revisado R-36.0 (diagnostico_tela_att do passo 3).
- **Justificativa:** Caminho do passo 1 ('Relatórios > Livro Protocolo') e campos dos passos 2 e 4 já exatos; no passo 3, o diagnostico_tela_att e o orion-route-graph.json comprovam os rótulos literais 'Rascunho (não exibe livro e página)', 'Livro atual' e 'Página atual', além da remoção de negrito das frases descritivas que não são elementos de interface.

| Passo | Texto Original (`kb/`) | Texto Atualizado Proposto (`06.05.02` + Raio-X) |
|---:|---|---|
| 3 | 3. Defina a modalidade de impressão:    * **Para Rascunho / Conferência:** Marque a caixa de seleção **"Rascunho"** para emitir listagem de trabalho sem numeração definitiva de livro físico.    * **Para Impressão Definitiva:** Desmarque a opção de rascunho e preencha os campos **Livro** e **Folha Inicial** correspondentes à encadernação oficial. | 3. Defina a modalidade de impressão:    * Para Rascunho / Conferência: marque a caixa de seleção **Rascunho (não exibe livro e página)** para emitir listagem de trabalho sem numeração definitiva de livro físico.    * Para Impressão Definitiva: desmarque a opção **Rascunho (não exibe livro e página)** e preencha os campos **Livro atual** e **Página atual** correspondentes à encadernação oficial. |

### D-2.4 — Cadastrar Categoria de Produto
- **Módulo:** `selos` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/selos/D-2.4-cadastrar-categoria-de-produto.md`
- **Rascunho Auditado:** `auditoria/rotinas/selos/[ATT] D-2.4-cadastrar-categoria-de-produto/[ATT] D-2.4-cadastrar-categoria-de-produto-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Administração > Controle de Estoque > Cadastros > Categoria'); auditoria/src/menu-canonical.ts; revPath diagnostico_tela_att (#/categoria/cadastrar: campos 'Descrição', 'Responsável', 'Utiliza sequência inicial e sequência final', 'Enviar alerta de estoque mínimo', 'Informar quantidade de atos', 'Utiliza série', 'E-mail (s) para envio de alerta'; botões 'Concluir', 'Voltar')
- **Justificativa:** Caminho de menu do passo 1 comprovado pela 06.05.02 e menu-canonical.ts; passo 2 ('Adicionar') validado ao vivo; e todos os campos/botões da tela #/categoria/cadastrar (passos 3 a 5) foram lidos integralmente ao vivo no diagnostico_tela_att do revPath.

| Passo | Texto Original (`kb/`) | Texto Atualizado Proposto (`06.05.02` + Raio-X) |
|---:|---|---|
| 1 | 1. Acesse o menu **Configurações > Cadastros Auxiliares > Categoria de Produto**. | 1. Acesse o menu **Administração > Controle de Estoque > Cadastros > Categoria**. |
| 3 | 3. Digite o **Nome da Categoria** (ex: Papel de Segurança para Traslados ou Selos de Fiscalização). | 3. Digite a **Descrição** da categoria (ex.: Papel de Segurança para Traslados ou Selos de Fiscalização). |
| 4 | 4. Informe uma **Sigla** ou código de referência e uma breve descrição do grupo. | 4. Selecione o **Responsável**, marque conforme a necessidade as opções **Utiliza sequência inicial e sequência final**, **Enviar alerta de estoque mínimo**, **Informar quantidade de atos** e **Utiliza série**, e informe **E-mail (s) para envio de alerta**, se aplicável. |
| 5 | 5. Clique em **Salvar** para disponibilizar a categoria nos cadastros de produtos. | 5. Clique em **Concluir** para disponibilizar a categoria nos cadastros de produtos. |

---

## 3. Categoria B — Atualizável Parcialmente (63 rotinas)

Rotinas cujos passos de navegação (1–3) têm correção ou confirmação 100% comprovada pela árvore `06.05.02`, mas que apresentam lacuna em passos internos dependente de confirmação de tela ou Produtos.

### C-ACESSO-06 — Habilitação de Permissões para Edição de Partes e Imóveis em Protocolos em Andamento
- **Módulo:** `acesso` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/acesso/C-ACESSO-06-habilitacao-de-permissoes-para-edicao-de-partes-e-.md`
- **Rascunho Auditado:** `auditoria/rotinas/acesso/[ATT] C-ACESSO-06-habilitacao-de-permissoes-para-edicao-de-partes-e-/[ATT] C-ACESSO-06-habilitacao-de-permissoes-para-edicao-de-partes-e--revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (4.7 #38: Configurações > Perfis e permissões de acesso); menu-canonical.ts (explicit_equivalence: configuracoes > grupos e perfis de acesso -> Configurações > Perfis e permissões de acesso); orion-route-graph.json (#/perfil)
- **Justificativa:** O passo 1 tem equivalência 100% comprovada para Configurações > Perfis e permissões de acesso (#/perfil), mas o Raio-X não detalha os nomes internos da árvore de permissões na tela de alteração do perfil (além de inexistir Escreventes de Notas na listagem inicial).
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos/em tela os perfis reais exibidos em Configurações > Perfis e permissões de acesso (#/perfil), pois 'Escreventes de Notas' não foi encontrado na listagem.
  - Confirmar na tela de edição de perfil os nomes exatos dos nós e checkboxes correspondentes a 'Notas > Protocolo > Operações Básicas', 'Permitir Alteração de Protocolo em Andamento', 'Editar Partes, Qualificações e Representantes', 'Adicionar / Modificar Bens e Imóveis' e 'Alterar Protocolos Criados por Outros Usuários do Mesmo Setor'.
  - Confirmar o rótulo exato do botão de gravação na tela de alteração do perfil (ex.: Salvar ou Concluir) e se 'Logoff' no passo 7 deve apontar para Olá, [usuário] > Sair.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Configurações** > submenu **Grupos e Perfis de Acesso**. | Acesse o menu **Configurações** > submenu **Perfis e permissões de acesso**. |

### C-ACESSO-07 — Liberação de Acesso e Impressão de Consulta de Serviços Praticados para Auxiliares
- **Módulo:** `acesso` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/acesso/C-ACESSO-07-liberacao-de-acesso-e-impressao-de-consulta-de-ser.md`
- **Rascunho Auditado:** `auditoria/rotinas/acesso/[ATT] C-ACESSO-07-liberacao-de-acesso-e-impressao-de-consulta-de-ser/[ATT] C-ACESSO-07-liberacao-de-acesso-e-impressao-de-consulta-de-ser-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (4.7 #38 Configurações > Perfis e permissões de acesso; 4.7 #39 Configurações > Usuários; 4.2 #4 Firmas > Consultas > Serviços praticados); menu-canonical.ts (Grupos e Perfis de Acesso -> Perfis e permissões de acesso; Balcão de Firmas -> Firmas); orion-route-graph.json (#/perfil, #/servicoPraticado)
- **Justificativa:** Os caminhos de menu dos passos 1 (Configurações > Perfis e permissões de acesso / Usuários) e 7 (Firmas > Consultas > Serviços praticados) são 100% comprovados pela 06.05.02, mas os passos internos 2–6 dependem da árvore de permissões dentro da edição de #/perfil, sem Raio-X capturado.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar na tela Configurações > Perfis e permissões de acesso (#/perfil) se existe perfil equivalente a 'Auxiliares de Cartório'.
  - Confirmar na tela de edição de perfil os nomes reais dos nós e opções correspondentes a 'Balcão de Firmas > Consultas e Relatórios', 'Consulta de Serviços Praticados', 'Permitir Impressão de Extrato Operacional' e 'Exibir Valores de Emolumentos e Caixa Líquido'.
  - Confirmar o rótulo exato do botão de gravação na tela de alteração do perfil (Salvar vs Concluir).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | No Orion TN, acesse o menu **Configurações** > **Grupos e Perfis de Acesso** (ou **Usuários** para ajuste individual). | No Orion TN, acesse o menu **Configurações** > **Perfis e permissões de acesso** (ou **Usuários** para ajuste individual). |
| 7 | Oriente o colaborador a fechar o módulo e reabri-lo; o menu **Balcão de Firmas** > **Relatórios** > **Serviços Praticados** estará imediatamente disponível. | Oriente o colaborador a fechar o módulo e reabri-lo; o menu **Firmas** > **Consultas** > **Serviços praticados** estará imediatamente disponível. |

### C-CENTRAL-03 — Mapeamento de Qualidade CESDI em Inventários e Preenchimento Obrigatório
- **Módulo:** `centrais` · **Tag:** `[ATT]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/centrais/C-CENTRAL-03-mapeamento-de-qualidade-cesdi-em-inventarios-e-pre.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT] C-CENTRAL-03-mapeamento-de-qualidade-cesdi-em-inventarios-e-pre/[ATT] C-CENTRAL-03-mapeamento-de-qualidade-cesdi-em-inventarios-e-pre-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.7, item 22: Configurações > Cadastros auxiliares > Participação) + auditoria/cache/orion-route-graph.json (#/participacaoNotas) + auto_cura ao vivo no revisado de C-CENTRAL-03 (passo 1).
- **Justificativa:** O passo 1 tem caminho 100% comprovado na 06.05.02 (Configurações > Cadastros auxiliares > Participação). Porém, em #/participacaoNotas (Raio-X) não aparece o quadro Comunicações - Configurações nem os campos dos passos 2–5, e os passos 6–9 dependem de confirmação de tela interna de protocolo aberto.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos onde fica o quadro Comunicações - Configurações (e as opções De Cujus / Falecido, Herdeiro, Advogado da Qualidade CESDI) na tela #/participacaoNotas (ex.: ao editar um registro existente da grade).
  - Confirmar no passo 6 o caminho atualizado Notas > Consultas > Protocolos e a visibilidade da aba Partes ao abrir um protocolo de inventário salvo, bem como os campos do passo 8 (Filiação (Pai e Mãe), Data de Nascimento, Município com Código IBGE vs Cód. IBGE) e o destino de retransmissão da CESDI (passo 9).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | No **Orion TN**, acesse **Configurações > Cadastros Auxiliares > Tipos de Participação**. | No **Orion TN**, acesse **Configurações > Cadastros auxiliares > Participação**. |

### C-CENTRAL-04 — Renovação de Token de Autenticação Expirado na Plataforma SIGNO / CENSEC
- **Módulo:** `centrais` · **Tag:** `[ATT][CCC]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/centrais/C-CENTRAL-04-renovacao-de-token-de-autenticacao-expirado-na-pla.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT][CCC] C-CENTRAL-04-renovacao-de-token-de-autenticacao-expirado-na-pla/[ATT][CCC] C-CENTRAL-04-renovacao-de-token-de-autenticacao-expirado-na-pla-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.7, item 40: Configurações > Parametrizações) + auditoria/src/menu-canonical.ts (['configuracoes', 'parametros gerais'] -> ['Configurações', 'Parametrizações']) + auditoria/src/route-synonyms.ts (#/configuracoes -> aba Comunicações) + Raio-X de M-16.5 (#/configuracoes, seção Comunicações).
- **Justificativa:** Passos 1–3 são externos (portal SIGNO / CENSEC, tag [CCC]). O passo 4 tem caminho de menu comprovado na 06.05.02 (Configurações > Parametrizações, aba Comunicações), mas não há Raio-X da tela auxiliar Orion SIGNO nem confirmação se os passos 5–8 usam API Key CNB / Iniciar serviço do Signo / Concluir na própria tela #/configuracoes ou na guia externa Orion SIGNO.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos se o Token de Acesso (API Key) do passo 5 é preenchido no campo API Key CNB da aba Comunicações em #/configuracoes ou na tela aberta por 'Clique aqui para acessar a tela de configuração no Orion SIGNO'.
  - Confirmar os equivalentes reais dos botões Validar Conexão com SIGNO (passo 6) e Salvar (passo 7; em #/configuracoes os botões visíveis são Iniciar serviço do Signo, Parar serviço do Signo e Concluir).
  - Confirmar no passo 8 qual caminho do catálogo 06.05.02 corresponde à 'tela de envio da CENSEC' (ex.: Administração > Comunicações > Outras comunicações).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 4 | No **Orion TN**, acesse com perfil de administrador: **Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC**. | No **Orion TN**, acesse com perfil de administrador: **Configurações > Parametrizações**, na aba **Comunicações**. |

### C-CENTRAL-08 — Disparo Forçado Síncrono de Fichas de Firma para o e-Notariado / CNN
- **Módulo:** `centrais` · **Tag:** `[ATT][CCC]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/centrais/C-CENTRAL-08-disparo-forcado-sincrono-de-fichas-de-firma-para-o.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT][CCC] C-CENTRAL-08-disparo-forcado-sincrono-de-fichas-de-firma-para-o/[ATT][CCC] C-CENTRAL-08-disparo-forcado-sincrono-de-fichas-de-firma-para-o-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.5, item 7: Administração > Comunicações > Outras comunicações) + auditoria/cache/orion-route-graph.json (#/comunicacoes) + auto_cura ao vivo no revisado de C-CENTRAL-08 (passo 2).
- **Justificativa:** O passo 2 tem caminho canônico 100% comprovado na 06.05.02 (Administração > Comunicações > Outras comunicações, sem o segmento inexistente E-Notariado). Porém, a tela #/comunicacoes não possui a aba Cartões de Autógrafo / Fichas de Firma nem os botões/campos dos passos 3–4 (apenas o botão Gerar, que abre #/comunicacoes/cadastrar), e o passo 7 é externo (portal CCN / e-Notariado, [CCC]).
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos o fluxo real em #/comunicacoes e #/comunicacoes/cadastrar (botão Gerar -> campo Tipo) para disparo síncrono de fichas de firma ao e-Notariado / CNN e os rótulos dos passos 3–6.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 2 | Acesse o menu **Administração > Comunicações > Outras Comunicações > E-Notariado**. | Acesse o menu **Administração > Comunicações > Outras comunicações**. |

### C-CENTRAL-09 — Correção de Rejeição da Carga CENSEC CEP por Ausência de Código IBGE
- **Módulo:** `centrais` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/centrais/C-CENTRAL-09-correcao-de-rejeicao-da-carga-censec-cep-por-ausen.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT] C-CENTRAL-09-correcao-de-rejeicao-da-carga-censec-cep-por-ausen/[ATT] C-CENTRAL-09-correcao-de-rejeicao-da-carga-censec-cep-por-ausen-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.3, item 9: Notas > Consultas > Protocolos) + auditoria/reports/auditoria-caminhos-menus.md (linha 227: Notas > Protocolo -> Notas > Consultas > Protocolos) + auditoria/cache/orion-route-graph.json (#/protocolo e #/protocolo/cadastrar).
- **Justificativa:** O passo 1 tem caminho comprovado na 06.05.02 (Notas > Consultas > Protocolos). Porém, em #/protocolo/cadastrar (Raio-X), os campos de município chamam-se Cidade e Cód. IBGE (não Município), não há abas Partes e Imóveis visíveis sem protocolo salvo aberto, e o caminho Comunicações > CENSEC CEP (passo 5) não consta na 06.05.02.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com um protocolo salvo aberto se existem as abas Partes e Imóveis (passos 2–3), se o campo Município equivale a Cidade / Cód. IBGE e qual é o rótulo do botão Salvar (passo 4).
  - Confirmar no passo 5 o caminho real de Comunicações > CENSEC CEP e do botão Reprocessar Carga na árvore 06.05.02 (candidato próximo: Administração > Comunicações > Outras comunicações).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse **Notas > Protocolo** e abra o ato apontado com pendência no log da CEP. | Acesse **Notas > Consultas > Protocolos** e abra o ato apontado com pendência no log da CEP. |

### D-3.2 — Visualizar Dashboard de Envio para Registro
- **Módulo:** `centrais` · **Tag:** `[ATT]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/centrais/D-3.2-visualizar-dashboard-de-envio-para-registro.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT] D-3.2-visualizar-dashboard-de-envio-para-registro/[ATT] D-3.2-visualizar-dashboard-de-envio-para-registro-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.1, item 2: Dashboard > Envio para Registro) + auditoria/cache/orion-route-graph.json (#/dashboard/envioRegistro) + diagnostico_tela_att e auto_cura ao vivo no revisado de D-3.2.
- **Justificativa:** O passo 1 tem caminho 100% comprovado na 06.05.02 (Dashboard > Envio para Registro). No passo 2, os blocos reais da tela #/dashboard/envioRegistro (Sem status definido, Não encaminhado, Encaminhado, Devolvido - Exigência, Registrado, Entregue) diferem estruturalmente dos 4 citados no manual (Aguardando Envio, Prenotados no RI, Com Exigência, Registrados), e os passos 3–5 exigem verificação dos campos de + Filtros e das ações ao clicar no card.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos a correspondência editorial no passo 2 para os 6 blocos reais de #/dashboard/envioRegistro: Sem status definido, Não encaminhado, Encaminhado, Devolvido - Exigência, Registrado e Entregue.
  - Confirmar no passo 3 os nomes exatos dos campos dentro de + Filtros (no manual: Cartório de Imóveis de Destino, Número do Protocolo, Período).
  - Confirmar nos passos 4–5 o comportamento ao clicar em um card de Devolvido - Exigência e a existência do botão Atualizar Status.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Notas > Dashboard de Envio para Registro**. | Acesse o menu **Dashboard > Envio para Registro**. |

### M-13.0 — Abertura de Pedido de Firmas com Senha (Pré-Atendimento)
- **Módulo:** `centrais` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/centrais/M-13.0-abertura-de-pedido-de-firmas-com-senha-pre-atendim.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT] M-13.0-abertura-de-pedido-de-firmas-com-senha-pre-atendim/[ATT] M-13.0-abertura-de-pedido-de-firmas-com-senha-pre-atendim-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2, item 1: Firmas > Abertura de pedido) + auditoria/src/menu-canonical.ts (['firmas', 'atendimento', 'abertura de pedido com senha'] -> ['Firmas', 'Abertura de pedido']) + auditoria/cache/orion-route-graph.json (#/aberturaPedidos: botão Nova senha) + auto_cura ao vivo no revisado de M-13.0 (passos 1 e 2).
- **Justificativa:** Passos 1 e 2 têm correção 100% comprovada (Firmas > Abertura de pedido e botão Nova senha). No passo 5, o botão Concluir o pedido não existe na tela #/aberturaPedidos (onde há Limpar, Filtrar, Nova senha, Buscar, Finalizar, Cancelar, Voltar), exigindo confirmação editorial se corresponde ao botão Finalizar (que estava desabilitado no bloqueio).
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos/auditoria após preencher partes e serviços se o botão Finalizar em #/aberturaPedidos substitui Concluir o pedido no passo 5.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Firmas > Atendimento > Abertura de pedido com senha**. | Acesse o menu **Firmas > Abertura de pedido**. |
| 2 | Clique no botão **Novo** para gerar a senha sequencial de fila conforme a prioridade (Normal ou Preferencial). | Clique no botão **Nova senha** para gerar a senha sequencial de fila conforme a prioridade (Normal ou Preferencial). |

### M-16.5 — Configurar Comunicações Externas (Selo Digital, E-notariado, COAF)
- **Módulo:** `centrais` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/centrais/M-16.5-configurar-comunicacoes-externas-selo-digital-e-no.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT] M-16.5-configurar-comunicacoes-externas-selo-digital-e-no/[ATT] M-16.5-configurar-comunicacoes-externas-selo-digital-e-no-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.7, item 40: Configurações > Parametrizações) + auditoria/src/menu-canonical.ts (['administracao', 'parametros'] -> ['Configurações', 'Parametrizações']) + auditoria/src/route-synonyms.ts (#/configuracoes: Comunicações externas -> Comunicações) + auto_cura ao vivo no revisado de M-16.5 (passo 1).
- **Justificativa:** O passo 1 tem navegação 100% comprovada (Configurações > Parametrizações, aba Comunicações). Nos passos 2–6, há lacunas relevantes no Raio-X de #/configuracoes: existem links para telas externas (Orion Selo Digital, Orion e-Notariado, Orion Coaf, Orion SIGNO), faltam os controles Produção/Homologação (passo 3), aba Livro Caixa Web (passo 5) e botão Testar Conexão (passo 6), e o botão de gravação é Concluir.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos os campos de URL do WebService/usuário/senha/código na tela externa 'Clique aqui para acessar a tela de configuração no Orion Selo Digital.' (passo 2, além do bloco Selo digital em #/configuracoes).
  - Confirmar no passo 3 a ausência das opções Produção/Homologação e quais campos pertencem à integração e-Notariado (Token do cartório, Subscription, API Key CNB, tela externa Orion e-Notariado).
  - Confirmar no passo 4 o fluxo do bloco COAF ('Clique aqui para acessar a tela de configuração no Orion Coaf'), no passo 5 se a configuração do Livro Caixa Web foi removida ou movida para outra tela, e no passo 6 a substituição de Testar Conexão e Salvar (em #/configuracoes existe Concluir).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Comunicações externas**. | Acesse o menu **Configurações > Parametrizações** e selecione a aba **Comunicações**. |

### M-61.0 — Adicionar Nova Natureza
- **Módulo:** `centrais` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/centrais/M-61.0-adicionar-nova-natureza.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT] M-61.0-adicionar-nova-natureza/[ATT] M-61.0-adicionar-nova-natureza-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.7, item 19: Configurações > Cadastros auxiliares > Natureza) + auditoria/src/menu-canonical.ts (['notas', 'cadastros auxiliares'] -> ['Configurações', 'Cadastros auxiliares'] com keepRestAsPath) + auditoria/cache/orion-route-graph.json (#/natureza) + diagnostico_tela_att de M-61.0 (#/natureza/cadastrar).
- **Justificativa:** O passo 1 tem correção 100% comprovada (Configurações > Cadastros auxiliares > Natureza e botão Adicionar) e os passos 2, 3 e 7 (Espécie, Descrição, Concluir) existem no Raio-X de #/natureza/cadastrar. Porém, o campo Sigla (passo 4) não existe na tela, a seção Comunicações com Centrais Notariais (passo 5) não aparece (CEP, CESDI, RCTO e ITCMD são campos diretos) e a aba Custas (passo 6) não consta entre os controles lidos.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos a remoção do passo 4 (campo Sigla ausente em #/natureza/cadastrar).
  - Confirmar no passo 5 que os selects CEP, CESDI e RCTO ficam diretamente no formulário principal (sem seção Comunicações com Centrais Notariais).
  - Confirmar no passo 6 se a aba Custas foi removida ou substituída (os botões/abas visíveis em #/natureza/cadastrar são Perfil de Partes, Partes, Documentos apresentados e Usuários).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Notas > Cadastros auxiliares > Naturezas** e clique no botão **Adicionar**. | Acesse o menu **Configurações > Cadastros auxiliares > Natureza** e clique no botão **Adicionar**. |

### R-11.0 — Comunicação de Fichas de Firma com o e-Notariado
- **Módulo:** `centrais` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/centrais/R-11.0-comunicacao-de-fichas-de-firma-com-o-e-notariado.md`
- **Rascunho Auditado:** `auditoria/rotinas/centrais/[ATT] R-11.0-comunicacao-de-fichas-de-firma-com-o-e-notariado/[ATT] R-11.0-comunicacao-de-fichas-de-firma-com-o-e-notariado-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.5, item 7: Administração > Comunicações > Outras comunicações; seção 4.7, item 40: Configurações > Parametrizações) + auditoria/src/route-synonyms.ts (#/configuracoes: Comunicações) + Raio-X de M-16.5 (#/configuracoes > Comunicações) + diagnostico_tela_att de R-11.0 (#/comunicacoes/cadastrar).
- **Justificativa:** Os passos de navegação 1 (Administração > Comunicações > Outras comunicações) e 4 (Configurações > Parametrizações, aba Comunicações) têm correção comprovada pela 06.05.02 e Raio-X. Porém, no passo 2 a tela #/comunicacoes/cadastrar exibiu apenas o select Tipo sem a opção literal "E-notariado" e sem comprovação de Processar/Finalizar (passo 3), e no passo 5 o Raio-X de #/configuracoes mostra Automática e Token do cartório sem comprovar a opção "Ativo".
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar em #/comunicacoes/cadastrar (após acionar o botão Gerar em #/comunicacoes) quais opções existem no campo Tipo para e-Notariado e os rótulos reais dos passos 2–3 (período, Processar, Finalizar).
  - Confirmar no passo 5 da aba Comunicações em #/configuracoes os rótulos exatos (Automática vs Automático, Diário/Semanal, Token do cartório e existência da opção "Ativo").

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | **Para Envio Manual:** Acesse **Administração > Comunicações > Outras Comunicações**. | **Para Envio Manual:** Acesse **Administração > Comunicações > Outras comunicações**. |
| 4 | **Para Configurar o Envio Automático:** Acesse **Configurações > Parametrizações > Comunicações**. | **Para Configurar o Envio Automático:** Acesse **Configurações > Parametrizações** e selecione a aba **Comunicações**. |

### C-CERT-01 — Emissão de Certidão com Custas Zeradas e Enquadramento de Selagem Isenta
- **Módulo:** `certidoes` · **Tag:** `[ATT]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/certidoes/C-CERT-01-emissao-de-certidao-com-custas-zeradas-e-enquadram.md`
- **Rascunho Auditado:** `auditoria/rotinas/certidoes/[ATT] C-CERT-01-emissao-de-certidao-com-custas-zeradas-e-enquadram/[ATT] C-CERT-01-emissao-de-certidao-com-custas-zeradas-e-enquadram-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (4.3 #5: Notas > Nova certidão e serviço); menu-canonical.ts (explicit_equivalence: certidoes > novo pedido de certidao -> Notas > Nova certidão e serviço); diagnostico_tela_att (#/certidoesServicos/cadastrar)
- **Justificativa:** O caminho do passo 1 (Notas > Nova certidão e serviço) é 100% comprovado pela 06.05.02, mas o Raio-X da tela #/certidoesServicos/cadastrar não apresenta Modalidade de Cobrança, Isenta / Gratuita, Motivo Legal da Gratuidade, aba Cálculo de Custas nem botão Finalizar e Emitir Selo Digital.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos em #/certidoesServicos/cadastrar onde se configura a gratuidade/isenção da certidão (se via seleção em 'Certidões e serviços', 'ckbToggleCustasProtocolo' com item isento ou outro controle condicional).
  - Confirmar os rótulos reais correspondentes a 'Motivo Legal da Gratuidade', 'Cálculo de Custas', 'editor da certidão' (ex.: ckbToggleEditor) e ao botão final de conclusão/emissão de selo.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | No **Orion TN**, acesse o menu **Certidões > Novo Pedido de Certidão** (ou **Notas > Certidões**). | No Orion TN, acesse o menu **Notas** > **Nova certidão e serviço**. |

### C-CERT-03 — Emissão de Certidão de Ato Legado não Digitalizado com Anexo do Livro Físico
- **Módulo:** `certidoes` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/certidoes/C-CERT-03-emissao-de-certidao-de-ato-legado-nao-digitalizado.md`
- **Rascunho Auditado:** `auditoria/rotinas/certidoes/[ATT] C-CERT-03-emissao-de-certidao-de-ato-legado-nao-digitalizado/[ATT] C-CERT-03-emissao-de-certidao-de-ato-legado-nao-digitalizado-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (4.3 #5: Notas > Nova certidão e serviço); menu-canonical.ts (explicit_equivalence: certidoes > novo pedido de certidao -> Notas > Nova certidão e serviço); diagnostico_tela_att (#/certidoesServicos/cadastrar)
- **Justificativa:** O passo 1 tem destino único comprovado na 06.05.02 (Notas > Nova certidão e serviço), porém o Raio-X de #/certidoesServicos/cadastrar não traz Certidão de Ato Antigo / Não Digitalizado, Número do Livro, Folhas Inicial/Final, aba Editor da Certidão, Anexar Imagem Escaneada do Livro (GED) nem Finalizar e Emitir Selo Digital.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar em #/certidoesServicos/cadastrar se há opção equivalente a 'Certidão de Ato Antigo / Não Digitalizado' (ex.: via campo select 'Certidões e serviços') e quais campos condicionais surgem para Livro/Folhas/Data.
  - Confirmar o funcionamento dos checkboxes reais 'ckbToggleEditor' e 'Documentos e anexos' no fluxo de reprografia/breve relato e qual o botão exato de finalização/emissão de selo.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | No **Orion TN**, acesse o menu **Certidões > Novo Pedido de Certidão**. | No Orion TN, acesse o menu **Notas** > **Nova certidão e serviço**. |

### D-3.14 — Criar Certidão
- **Módulo:** `certidoes` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/certidoes/D-3.14-criar-certidao.md`
- **Rascunho Auditado:** `auditoria/rotinas/certidoes/[ATT] D-3.14-criar-certidao/[ATT] D-3.14-criar-certidao-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (4.3 #5: Notas > Nova certidão e serviço); menu-canonical.ts (explicit_equivalence: notas > certidoes > novo pedido de certidao -> Notas > Nova certidão e serviço); diagnostico_tela_att (#/certidoesServicos/cadastrar)
- **Justificativa:** O passo 1 tem correção 100% comprovada pela 06.05.02 (Notas > Nova certidão e serviço), porém o Raio-X de #/certidoesServicos/cadastrar não exibe seção Identificação do Solicitante, campo Tipo de Certidão (Inteiro Teor, Breve Relatório, Reprográfica), campos Tipo de Livro/Número do Livro/Folha/Ato nem botão Concluir Pedido.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar se o passo 2 deve citar diretamente os campos reais da seção Certidões e serviços (Pessoa física/Pessoa jurídica/Mensalista, CPF ou CIN, Nome, Telefone).
  - Confirmar no campo select 'Certidões e serviços' e nos toggles da tela #/certidoesServicos/cadastrar onde se seleciona a modalidade (Inteiro Teor, Breve Relatório, Reprográfica) e onde se informa Livro/Folha/Ato.
  - Confirmar o rótulo exato do botão final de gravação do pedido na barra inferior/superior de #/certidoesServicos/cadastrar.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**. | Acesse o menu **Notas** > **Nova certidão e serviço**. |

### D-3.15 — Vincular Ato a Certidão para Reprografia
- **Módulo:** `certidoes` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/certidoes/D-3.15-vincular-ato-a-certidao-para-reprografia.md`
- **Rascunho Auditado:** `auditoria/rotinas/certidoes/[ATT] D-3.15-vincular-ato-a-certidao-para-reprografia/[ATT] D-3.15-vincular-ato-a-certidao-para-reprografia-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (4.3 #11: Notas > Consultas > Certidões e serviços); menu-canonical.ts (explicit_equivalence: notas > certidoes > consulta de certidoes -> Notas > Consultas > Certidões e serviços); orion-route-graph.json (#/certidoesServicos)
- **Justificativa:** O passo 1 tem equivalência 100% comprovada pela 06.05.02 (Notas > Consultas > Certidões e serviços), mas a tela #/certidoesServicos é apenas a consulta/listagem; não há comprovação no Raio-X da tela interna de edição do pedido sobre a aba Reprografia / Imagens do Livro, Adicionar Imagem e Confirmar Vinculação.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar na tela de edição de um pedido existente (aberto por Notas > Consultas > Certidões e serviços) se existe a aba 'Reprografia / Imagens do Livro' com 'Adicionar Imagem' e 'Confirmar Vinculação', ou se a vinculação de folhas digitalizadas foi incorporada ao bloco 'Documentos e anexos' / 'ckbToggleEditor' de #/certidoesServicos/cadastrar.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Abra o pedido de certidão desejado em **Notas > Certidões > Consulta de Certidões**. | Abra o pedido de certidão desejado em **Notas** > **Consultas** > **Certidões e serviços**. |

### M-16.13 — Parametrizar Pedido de Certidão
- **Módulo:** `certidoes` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/certidoes/M-16.13-parametrizar-pedido-de-certidao.md`
- **Rascunho Auditado:** `auditoria/rotinas/certidoes/[ATT] M-16.13-parametrizar-pedido-de-certidao/[ATT] M-16.13-parametrizar-pedido-de-certidao-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (4.7 #40: Configurações > Parametrizações); menu-canonical.ts (administracao > parametros -> Configurações > Parametrizações); route-synonyms.ts (#/configuracoes: Pedido de certidão -> Certidão); diagnostico_tela_att (#/configuracoes aba Certidão: campo Previsão de entrega, botões Excluir/Adicionar/Concluir/Voltar)
- **Justificativa:** Os passos 1 (Configurações > Parametrizações > aba Certidão), 2 (campo Previsão de entrega) e 5 (botão Concluir) são 100% comprovados pela 06.05.02 e pelo Raio-X ao vivo, mas os passos 3 e 4 têm lacunas na correspondência exata dos controles.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar no passo 3 se 'Estoque e Insumos' e 'Controlar estoque de papel de segurança' correspondem aos campos reais 'Utiliza controle de estoque em notas' (checkbox) e 'Consumo do papel de segurança' (select), além de 'Categoria' e 'Produto'.
  - Confirmar com Produtos se o passo 4 (exigir assinatura ou identificação do recebedor na entrega no balcão) existe em outra aba de Configurações > Parametrizações ou foi removido, pois não aparece no Raio-X da aba Certidão.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Pedido de certidão**. | Acesse o menu **Configurações** > **Parametrizações** e selecione a aba **Certidão**. |
| 2 | No campo **Prazo de entrega padrão (dias)**, informe a quantidade de dias úteis fixada para expedição de certidões comuns (ex: 5 dias úteis, ou prazo menor conforme a rotina do cartório). | No campo **Previsão de entrega**, informe a quantidade de dias úteis fixada para expedição de certidões comuns (ex: 5 dias úteis, ou prazo menor conforme a rotina do cartório). |
| 5 | Clique no botão **Salvar** para registrar os parâmetros do setor de certidões. | Clique no botão **Concluir** para registrar os parâmetros do setor de certidões. |

### M-54.1 — Como Criar um Novo Pedido de Certidão (Dados do Solicitante)
- **Módulo:** `certidoes` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/certidoes/M-54.1-como-criar-um-novo-pedido-de-certidao-dados-do-sol.md`
- **Rascunho Auditado:** `auditoria/rotinas/certidoes/[ATT] M-54.1-como-criar-um-novo-pedido-de-certidao-dados-do-sol/[ATT] M-54.1-como-criar-um-novo-pedido-de-certidao-dados-do-sol-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (4.3 #5: Notas > Nova certidão e serviço; 4.3 #11: Notas > Consultas > Certidões e serviços); menu-canonical.ts (notas > pedido de certidao -> Notas > Nova certidão e serviço); orion-route-graph.json (#/certidoesServicos/cadastrar e #/certidoesServicos com botão Adicionar)
- **Justificativa:** O caminho do passo 1 tem equivalência 100% comprovada pela 06.05.02 (Notas > Nova certidão e serviço, ou Notas > Consultas > Certidões e serviços > Adicionar), mas os passos 2–6 apresentam lacunas em #/certidoesServicos/cadastrar (seção Certidões e serviços, campo select Certidões e serviços vs Tipo de Certidão, Interessado vs Solicitante e botão final não capturado).
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar em #/certidoesServicos/cadastrar as opções do campo select 'Certidões e serviços' em relação a 'Tipo de Certidão' (Inteiro Teor, Breve Relato, Traslado / 2ª Via).
  - Confirmar os rótulos exatos dos campos de solicitante/interessado (seção 'Interessado', rádio 'Pessoa física'/'Pessoa jurídica'/'Mensalista', 'CPF ou CIN', 'Nome', 'Telefone', 'E-mail'), as opções de 'Situação' e o rótulo do botão de conclusão do pedido.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Na tela **Notas > Pedido de certidão**, clique no botão **Novo**. | Acesse o menu **Notas** > **Nova certidão e serviço** (ou **Notas** > **Consultas** > **Certidões e serviços** e clique em **Adicionar**). |

### M-12.0 — Gerenciamento de Serviços Lançados (Visualizar, Reutilizar/Inutilizar Selo)
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/config/M-12.0-gerenciamento-de-servicos-lancados-visualizar-reut.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-12.0-gerenciamento-de-servicos-lancados-visualizar-reut/[ATT] M-12.0-gerenciamento-de-servicos-lancados-visualizar-reut-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (Firmas > Reconhecimento de firmas); auditoria/reports/auditoria-caminhos-menus.md (Fila A: Balcão de Firmas -> Firmas > Reconhecimento de firmas); auditoria/cache/orion-route-graph.json (#/pedidoFirmas/cadastrar)
- **Justificativa:** A navegação do passo 1 ('Balcão de Firmas' -> 'Firmas > Reconhecimento de firmas') é comprovada pela árvore 06.05.02 e pela Fila A, mas a auditoria parou em #/inicio por ausência de '>'; a nomenclatura exata da grade de serviços lançados e das ações por linha (passo 2) e confirmação (passo 3) exige verificação ao vivo na tela após lançamento de um serviço.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar na tela #/pedidoFirmas/cadastrar se a grade citada como 'Últimos serviços realizados' corresponde à seção 'Serviços realizados' (listada no orion-route-graph.json) ou se o gerenciamento de serviços lançados ocorre em 'Firmas > Consultas > Reconhecimentos de firmas' / 'Firmas > Consultas > Serviços praticados'.
  - Confirmar ao vivo, com um serviço já lançado na grade, os rótulos/ícones exatos das ações 'Visualizar etiqueta', 'Visualizar termo', 'Reutilizar selo' e 'Inutilizar selo' (passo 2) e o texto/botão da caixa de confirmação (passo 3).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Na tela do **Balcão de Firmas**, localize o serviço na grade **Últimos serviços realizados** ou abra a tela de detalhes do pedido. | Acesse o menu **Firmas > Reconhecimento de firmas** e localize o serviço na grade **Últimos serviços realizados** ou abra a tela de detalhes do pedido. |

### M-14.2 — Balcão de Firmas: Lançando Serviços e Imprimindo Etiquetas
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-14.2-balcao-de-firmas-lancando-servicos-e-imprimindo-et.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-14.2-balcao-de-firmas-lancando-servicos-e-imprimindo-et/[ATT] M-14.2-balcao-de-firmas-lancando-servicos-e-imprimindo-et-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (Firmas > Reconhecimento de firmas); auditoria/reports/auditoria-caminhos-menus.md (Fila A: Balcão de firmas -> Firmas > Reconhecimento de firmas); auditoria/cache/orion-route-graph.json (#/pedidoFirmas/cadastrar: seção 'Serviços realizados')
- **Justificativa:** A tela e a seção do passo 1 ('Firmas > Reconhecimento de firmas' e 'Serviços realizados') são comprovadas na 06.05.02 e no orion-route-graph.json, porém a auditoria de M-14.2 travou em #/inicio e os controles dos passos 2–5 ('Modelo de etiqueta', campo de valor econômico e botão 'Lançar e Imprimir') não constam com esses nomes no orion-route-graph.json de #/pedidoFirmas/cadastrar.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar os nomes literais das opções de serviço em 'Nome do serviço' / 'Cálculo' no passo 2 ('Reconhecimento de firma por semelhança', 'Reconhecimento por autenticidade', 'Autenticação de cópia').
  - Confirmar o nome exato do campo condicional para valor econômico quando o ato possui valor declarado (passo 3).
  - Confirmar se existe campo 'Modelo de etiqueta' ou apenas 'Impressora' na seção 'Serviços realizados' de #/pedidoFirmas/cadastrar (passo 4).
  - Confirmar com Produtos a atualização do passo 5: o orion-route-graph.json e rotinas irmãs apontam que o lançamento ocorre via 'Efetuar Serviço' e a emissão/fechamento via 'Imprimir' / 'Concluir' (não há botão 'Lançar e Imprimir').

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Com a parte selecionada na tela **Balcão de firmas**, acesse o painel **Lançamento de Serviços**. | Com a parte selecionada na tela **Firmas > Reconhecimento de firmas**, acesse o painel **Serviços realizados**. |

### M-16.10 — Parametrizar E-mail
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-16.10-parametrizar-e-mail.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-16.10-parametrizar-e-mail/[ATT] M-16.10-parametrizar-e-mail-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (Configurações > Parametrizações); auditoria/src/menu-canonical.ts (administracao > parametros -> Configurações > Parametrizações); auditoria/rotinas/config/[ATT] M-16.10-parametrizar-e-mail/[ATT] M-16.10-parametrizar-e-mail-revisado.md (diagnostico_tela_att em #/configuracoes, aba E-mail, botões Concluir e Voltar)
- **Justificativa:** O passo 1 ('Configurações > Parametrizações', aba 'E-mail') e o botão de gravação do passo 6 ('Concluir') foram comprovados ao vivo no Raio-X de #/configuracoes; porém, a aba 'E-mail' exibiu apenas os campos 'Diariamente', 'Semanalmente', 'Mensalmente' e 'E-mail', sem nenhum dos campos de SMTP/notificações/teste dos passos 2 a 5.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos onde passaram a ficar as configurações de servidor SMTP ('Configuração do Servidor (SMTP)', 'Porta', 'TLS/SSL', 'Usuário', 'Senha', 'Nome do Remetente'), 'Notificações Automáticas' e 'Enviar E-mail de Teste' (passos 2 a 5), ausentes na aba 'E-mail' de #/configuracoes.
  - Confirmar com Produtos a finalidade exata dos campos atuais da aba 'E-mail' exibidos no Raio-X ('Diariamente', 'Semanalmente', 'Mensalmente' e 'E-mail') para reescrever os passos 2 a 5.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > E-mail**. | Acesse o menu **Configurações > Parametrizações** e selecione a aba **E-mail**. |
| 6 | Clique no botão **Salvar** para gravar as configurações. | Clique no botão **Concluir** para gravar as configurações. |

### M-16.2 — Parametrizar Captura e Digitalização
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-16.2-parametrizar-captura-e-digitalizacao.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-16.2-parametrizar-captura-e-digitalizacao/[ATT] M-16.2-parametrizar-captura-e-digitalizacao-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (Configurações > Parametrizações); auditoria/src/menu-canonical.ts (administracao > parametros -> Configurações > Parametrizações); auditoria/rotinas/config/[ATT] M-16.2-parametrizar-captura-e-digitalizacao/[ATT] M-16.2-parametrizar-captura-e-digitalizacao-revisado.md (diagnostico_tela_att em #/configuracoes, aba Captura e digitalização, botões Excluir/Adicionar/Concluir/Voltar)
- **Justificativa:** O passo 1 ('Configurações > Parametrizações', aba 'Captura e digitalização') e o botão do passo 6 ('Concluir') são comprovados ao vivo no Raio-X; porém, a tela real em #/configuracoes não exibe a seção 'Dispositivo de Captura' nem o botão 'Testar Conexão', e traz campos específicos de DUT/ITCMD além de seletores identificados apenas por ID interno no Raio-X.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar o rótulo visual na tela dos campos capturados apenas por identificador DOM no Raio-X ('tipoDigitalizador' e 'inputTextUrlConexaoDocuvieware') para substituir a menção a 'Dispositivo de Captura' no passo 2.
  - Confirmar as opções exatas de resolução e modo de cor nos campos reais da seção 'Digitalização' ('Cor para digitalização do DUT', 'Dpi's para digitalização do DUT', 'Mostrar configurações do scanner', 'Cor para digitalização do ITCMD', 'Dpi's para digitalização do ITCMD') no passo 3.
  - Confirmar a organização visual das seções 'Digitalização' e 'Diretório' com os campos 'Documento', 'Caminho' e os botões 'Adicionar' / 'Excluir' no passo 4 (em substituição a 'Diretórios de Rede').
  - Confirmar com Produtos se o botão 'Testar Conexão' (passo 5) foi removido da aba 'Captura e digitalização'.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Captura e digitalização**. | Acesse o menu **Configurações > Parametrizações** e selecione a aba **Captura e digitalização**. |
| 6 | Clique no botão **Salvar** para confirmar as configurações. | Clique no botão **Concluir** para confirmar as configurações. |

### M-16.7 — Configurar Atalhos do Teclado
- **Módulo:** `config` · **Tag:** `[DDD]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-16.7-configurar-atalhos-do-teclado.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[DDD] M-16.7-configurar-atalhos-do-teclado/[DDD] M-16.7-configurar-atalhos-do-teclado-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (Configurações > Parametrizações); auditoria/src/menu-canonical.ts (administracao > parametros -> Configurações > Parametrizações); auditoria/src/route-synonyms.ts (#/configuracoes: Atalhos do teclado -> Painel de atalhos); auditoria/cache/orion-route-graph.json (#/configuracoes: botões Concluir e Voltar); auditoria/rotinas/config/[DDD] M-16.7-configurar-atalhos-do-teclado/[DDD] M-16.7-configurar-atalhos-do-teclado-revisado.md
- **Justificativa:** A navegação do passo 1 ('Configurações > Parametrizações', aba 'Painel de atalhos') e o botão final do passo 6 ('Concluir') são 100% comprovados pela árvore 06.05.02, route-synonyms.ts e orion-route-graph.json; porém a grade ('Função', 'Base', 'Atalho', 'Complemento') está vazia no banco de homologação ([DDD]), deixando os passos 2 a 5 sem evidência ao vivo.
- **Dúvidas / Lacunas Internas Restantes:**
  - Popular a grade da aba 'Painel de atalhos' em homologação (ou confirmar com Produtos) para validar as linhas disponíveis e verificar se os exemplos citados no passo 2 ('Novo Pedido de Firmas', 'Lançar e Imprimir', 'Localizar Parte', 'Finalizar Pedido') existem na coluna 'Função'.
  - Confirmar o comportamento de edição nas colunas 'Atalho' e 'Complemento' da grade (passos 3 e 4) e a validação de conflitos descrita no passo 5.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Atalhos do teclado**. | Acesse o menu **Configurações > Parametrizações** e selecione a aba **Painel de atalhos**. |
| 6 | Clique no botão **Salvar** para registrar os atalhos. | Clique no botão **Concluir** para registrar os atalhos. |

### M-22.0 — Criar um Novo Livro e Configurar seus Parâmetros
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-22.0-criar-um-novo-livro-e-configurar-seus-parametros.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-22.0-criar-um-novo-livro-e-configurar-seus-parametros/[ATT] M-22.0-criar-um-novo-livro-e-configurar-seus-parametros-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (Administração > Controle de Livros); auditoria/src/menu-canonical.ts (Firmas > Livros -> Administração > Controle de Livros); auditoria/src/route-synonyms.ts (#/livro/cadastrar: Tipo de Livro -> Tipo livro); auditoria/rotinas/config/[ATT] M-22.0-criar-um-novo-livro-e-configurar-seus-parametros/[ATT] M-22.0-criar-um-novo-livro-e-configurar-seus-parametros-revisado.md (diagnostico_tela_att em #/livro/cadastrar)
- **Justificativa:** O passo 1 ('Administração > Controle de Livros' + 'Adicionar'), o campo 'Tipo livro' (passo 2), 'Número do livro' (passo 3) e o botão 'Concluir' (passo 6) estão comprovados no Raio-X de #/livro/cadastrar e em route-synonyms.ts; porém há lacunas internas nos passos 2, 4, 5 e 6 em relação às opções de tipologia, nomes dos campos de folhas/páginas, permissão/responsável e local do 'Termo de Abertura'.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar os valores exatos da lista suspensa do campo 'Tipo livro' no passo 2 (o manual cita 'Termo de Comparecimento', 'Livro de Notas' e 'Livro de Procurações', não listados no Raio-X).
  - Confirmar com Produtos a correspondência dos campos do passo 4 ('Folha Inicial', 'Folha Final', 'Folha Atual') com os campos reais presentes no Raio-X de #/livro/cadastrar ('Utiliza frente e verso', 'Total de folhas', 'Página inicial', 'Lado inicial', 'Posição inicial', 'N° termo', 'Data de abertura').
  - Confirmar se 'Proprietário / Permissão', 'Todos' e 'Escrevente' (passo 5) correspondem atualmente ao campo select 'Responsável' do Raio-X.
  - Confirmar onde é definido ou editado o 'Termo de Abertura' (passo 6), pois o Raio-X de #/livro/cadastrar exibe apenas a seção 'Controle de livro' e nenhuma aba/seção 'Termo de Abertura'.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Firmas > Livros** e clique no botão **Adicionar**. | Acesse o menu **Administração > Controle de Livros** e clique no botão **Adicionar**. |
| 2 | No campo **Tipo de Livro**, selecione a categoria desejada (ex: **Termo de Comparecimento**, **Livro de Notas**, **Livro de Procurações**). | No campo **Tipo livro**, selecione a categoria desejada (ex: **Termo de Comparecimento**, **Livro de Notas**, **Livro de Procurações**). |
| 3 | Informe o **Número do Livro** (ex: `46`). | Informe o **Número do livro** (ex: `46`). |
| 6 | Na seção **Termo de Abertura**, digite ou selecione o modelo do texto padrão de abertura e clique no botão **Salvar**. | Na seção **Termo de Abertura**, digite ou selecione o modelo do texto padrão de abertura e clique no botão **Concluir**. |

### M-24.0 — Cadastro de Novo Tipo de Documento para Termo de Comparecimento
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-24.0-cadastro-de-novo-tipo-de-documento-para-termo-de-c.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-24.0-cadastro-de-novo-tipo-de-documento-para-termo-de-c/[ATT] M-24.0-cadastro-de-novo-tipo-de-documento-para-termo-de-c-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 04-firmas__cadastros.png) + auditoria/cache/orion-route-graph.json (#/tipoTermo: campos "Descrição", "CRV - SEFAZ SP", botão "Adicionar")
- **Justificativa:** O caminho de menu legado "Firmas > Termo de comparecimento > Tipos de documentos" equivale comprovadamente a "Firmas > Cadastros > Tipo de documento - Termo de comparecimento" (#/tipoTermo) na árvore 06.05.02, que possui os campos "Descrição" e "CRV - SEFAZ SP" e o botão "Adicionar". A auditoria anterior desviou por engano para "Configurações > Cadastros auxiliares > Tipo de documento" (#/tipoDocumento/cadastrar), faltando o Raio-X interno de #/tipoTermo/cadastrar.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar ao vivo na tela #/tipoTermo/cadastrar (após clicar em Adicionar em Firmas > Cadastros > Tipo de documento - Termo de comparecimento) os rótulos exatos dos passos 2–6: **Descrição**, **CRV - SEFAZ SP**, abas **Campos Personalizados** e **Layout de Impressão**, e botão **Salvar** (ou **Concluir**).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Firmas > Termo de comparecimento > Tipos de documentos** e clique em **Adicionar**. | Acesse o menu **Firmas > Cadastros > Tipo de documento - Termo de comparecimento** e clique em **Adicionar**. |

### M-26.0 — Cadastro de Nova Configuração de Impressão de Etiquetas
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-26.0-cadastro-de-nova-configuracao-de-impressao-de-etiq.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-26.0-cadastro-de-nova-configuracao-de-impressao-de-etiq/[ATT] M-26.0-cadastro-de-nova-configuracao-de-impressao-de-etiq-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 15-configuracoes__modelos-de-impressao.png) + auditoria/src/menu-canonical.ts + diagnostico_tela_att de M-26.0 (#/configuracaoImpressaoModelo/cadastrar) + auditoria/cache/curated-route-synonyms.json
- **Justificativa:** O passo 1 tem equivalência 100% comprovada para "Configurações > Modelos de impressão > Configuração de impressão" com botão "Adicionar". No Raio-X de #/configuracaoImpressaoModelo/cadastrar, os campos reais estão em centímetros (**Largura da etiqueta (cm)**, **Altura da etiqueta (cm)**, **Salto de etiquetas (cm)**, **Margem superior (cm)**, **Margem esquerda (cm)**, **Margem inferior (cm)**, **Margem direita (cm)**) e o campo **Orientação** (**Retrato** ou **Paisagem**) do passo 6 não existe.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passos 3, 4 e 5: os rótulos reais no Raio-X são **Largura da etiqueta (cm)**, **Altura da etiqueta (cm)** e **Salto de etiquetas (cm)** (em centímetros, não em milímetros como no manual); confirmar com Produtos os novos valores de exemplo em cm e o separador decimal aceito.
  - Passo 6: os campos reais no Raio-X são **Margem superior (cm)**, **Margem esquerda (cm)**, **Margem inferior (cm)** e **Margem direita (cm)**, e o campo **Orientação** (**Retrato** ou **Paisagem**) está ausente da tela (sem abas ou gatilhos); confirmar remoção com Produtos.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Configurações de impressão** e clique em **Adicionar**. | Acesse o menu **Configurações > Modelos de impressão > Configuração de impressão** e clique em **Adicionar**. |

### M-42.0 — Gerenciar Modelos de Etiqueta
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/config/M-42.0-gerenciar-modelos-de-etiqueta.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-42.0-gerenciar-modelos-de-etiqueta/[ATT] M-42.0-gerenciar-modelos-de-etiqueta-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 15-configuracoes__modelos-de-impressao.png) + auditoria/src/menu-canonical.ts + diagnostico_tela_att de M-42.0 (#/modeloEtiqueta)
- **Justificativa:** O caminho de menu do passo 1 equivale comprovadamente a "Configurações > Modelos de impressão > Etiquetas diversas" (#/modeloEtiqueta). Porém, no passo 3, o campo "Pesquisar por modelo" não existe no Raio-X (os filtros reais são "Título", "Descrição" e "Tipo modelo"), e o passo 4 não foi alcançado.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 3: o campo **Pesquisar por modelo** não existe em #/modeloEtiqueta; os filtros reais no Raio-X são **Título**, **Descrição** e **Tipo modelo** (confirmar qual ou quais campos indicar antes de clicar em **Filtrar**).
  - Passo 4: confirmar os rótulos ou ícones exatos das ações na grade (**Visualizar**, **Editar**, **Inativar**), pois o fluxo foi interrompido no passo 3.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Modelos de etiqueta** (ou **Firmas > Parâmetros > Modelos de etiqueta**). | Acesse o menu **Configurações > Modelos de impressão > Etiquetas diversas**. |

### M-63.0 — Adicionar Novo Grupo de Itens
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-63.0-adicionar-novo-grupo-de-itens.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-63.0-adicionar-novo-grupo-de-itens/[ATT] M-63.0-adicionar-novo-grupo-de-itens-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 16-configuracoes__tabela-de-custas.png) + auditoria/src/menu-canonical.ts + auditoria/cache/orion-route-graph.json (#/grupoItem) + diagnostico_tela_att de M-63.0 (#/grupoItem/cadastrar)
- **Justificativa:** O passo 1 equivale comprovadamente a "Configurações > Tabela de custas > Grupo de item" (#/grupoItem) com o botão "Adicionar". No Raio-X de #/grupoItem/cadastrar, o campo "Especialidade" existe, mas o passo 3 bloqueou por não confirmar as opções internas "Notas" / "Firmas", e o passo 4 cita código numérico de ordenação ausente no Raio-X.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 3: confirmar as opções reais disponíveis dentro do campo select **Especialidade** em #/grupoItem/cadastrar (o Raio-X não lista as opções internas do seletor e o auditor não localizou **Notas** e **Firmas** no DOM visível).
  - Passo 4: confirmar com Produtos se o campo de código numérico de ordenação foi removido de #/grupoItem/cadastrar (o Raio-X exibe apenas os campos **Descrição** e **Especialidade**).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Notas > Cadastros auxiliares > Grupo de itens** e clique no botão **Adicionar**. | Acesse o menu **Configurações > Tabela de custas > Grupo de item** e clique no botão **Adicionar**. |

### M-69.0 — Acessar e Gerenciar Modelos de Etiqueta
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/config/M-69.0-acessar-e-gerenciar-modelos-de-etiqueta.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-69.0-acessar-e-gerenciar-modelos-de-etiqueta/[ATT] M-69.0-acessar-e-gerenciar-modelos-de-etiqueta-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 15-configuracoes__modelos-de-impressao.png) + auditoria/src/menu-canonical.ts + diagnostico_tela_att de M-69.0 (#/modeloEtiqueta)
- **Justificativa:** O caminho de menu do passo 1 equivale comprovadamente a "Configurações > Modelos de impressão > Etiquetas diversas" (#/modeloEtiqueta). Contudo, o campo "Pesquisar por modelo" do passo 3 não existe no Raio-X (os filtros reais são "Título", "Descrição" e "Tipo modelo"), e o passo 4 não foi alcançado.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 3: o campo **Pesquisar por modelo** não existe em #/modeloEtiqueta; os filtros reais no Raio-X são **Título**, **Descrição** e **Tipo modelo** (confirmar qual ou quais campos indicar antes de clicar em **Filtrar**).
  - Passo 4: confirmar os rótulos ou ícones exatos das ações na grade (**Visualizar**, **Editar**, **Inativar**), pois o fluxo foi interrompido no passo 3.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Modelos de etiqueta** (ou **Firmas > Parâmetros > Modelos de etiqueta**). | Acesse o menu **Configurações > Modelos de impressão > Etiquetas diversas**. |

### M-70.0 — Criando um Novo Modelo de Etiqueta (Configuração Básica)
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-70.0-criando-um-novo-modelo-de-etiqueta-configuracao-ba.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-70.0-criando-um-novo-modelo-de-etiqueta-configuracao-ba/[ATT] M-70.0-criando-um-novo-modelo-de-etiqueta-configuracao-ba-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 15-configuracoes__modelos-de-impressao.png) + auditoria/src/menu-canonical.ts + diagnostico_tela_att de M-70.0 (#/modeloEtiqueta/cadastrar)
- **Justificativa:** O passo 1 equivale comprovadamente a "Configurações > Modelos de impressão > Etiquetas diversas" com o botão "Adicionar". No Raio-X de #/modeloEtiqueta/cadastrar, o campo "Serviço" existe, mas a opção de exemplo do passo 4 não foi localizada no DOM; além disso, o botão "Avançar" do passo 6 não existe (há apenas botões de formatação e "Concluir" / "Voltar", pois todos os parâmetros ficam na mesma tela).
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 4: confirmar as opções reais do campo **Serviço** em #/modeloEtiqueta/cadastrar (o exemplo **Reconhecimento de firma por semelhança sem valor econômico** não foi localizado no DOM e pode depender da seleção prévia de **Tipo modelo** ou **Item**).
  - Passo 6: confirmar a substituição do botão **Avançar** (ausente no Raio-X de #/modeloEtiqueta/cadastrar) pela continuação na mesma tela ou pelo botão **Concluir**.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Modelos de etiqueta** e clique no botão **Adicionar**. | Acesse o menu **Configurações > Modelos de impressão > Etiquetas diversas** e clique no botão **Adicionar**. |

### M-70.1 — Configurando os Parâmetros Técnicos de um Modelo de Etiqueta
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/M-70.1-configurando-os-parametros-tecnicos-de-um-modelo-d.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] M-70.1-configurando-os-parametros-tecnicos-de-um-modelo-d/[ATT] M-70.1-configurando-os-parametros-tecnicos-de-um-modelo-d-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 15-configuracoes__modelos-de-impressao.png) + auditoria/cache/orion-route-graph.json (#/modeloEtiqueta) + diagnostico_tela_att de M-70.0 (#/modeloEtiqueta/cadastrar)
- **Justificativa:** O passo 1 não citava o caminho de menu (mantendo a auditoria em #/inicio). Na árvore 06.05.02 e no Raio-X de #/modeloEtiqueta/cadastrar (obtido em M-70.0), o cadastro de modelos de etiqueta fica em "Configurações > Modelos de impressão > Etiquetas diversas" e não possui a aba "Parâmetros Técnicos / Layout" (todos os campos, incluindo "Linguagem" e "Fonte", ficam na mesma tela com botão "Concluir" no lugar de "Salvar"). Observa-se que a sugestão automática de "Configurações > Tabela de custas > Parâmetros" em auditoria-caminhos-menus.md é falso positivo semântico.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 1: confirmar na grade de #/modeloEtiqueta o rótulo ou ícone exato da ação para editar um modelo já cadastrado (o Raio-X estático de #/modeloEtiqueta lista apenas os botões de rodapé/filtro).
  - Passos 1–7: em #/modeloEtiqueta/cadastrar (Raio-X de M-70.0), não existe a aba **Parâmetros Técnicos / Layout** (`abas: []`), o campo chama-se **Linguagem** (em vez de **Linguagem da Impressora**) e o botão de gravação é **Concluir** (em vez de **Salvar**); confirmar com Produtos se **Variáveis**, **Validar Script** e **Imprimir Teste** aparecem condicionalmente ao selecionar **Tipo modelo**/**Linguagem** ou se foram removidos.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | No cadastro do modelo de etiqueta (ou em **Editar**), acesse a aba **Parâmetros Técnicos / Layout**. | Acesse o menu **Configurações > Modelos de impressão > Etiquetas diversas** e abra o cadastro do modelo de etiqueta. |

### V-2.2.2 — Configuração de Atos Notariais, Quantidade e Base de Cálculo no Orçamento Completo
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/V-2.2.2-configuracao-de-atos-notariais-quantidade-e-base-d.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] V-2.2.2-configuracao-de-atos-notariais-quantidade-e-base-d/[ATT] V-2.2.2-configuracao-de-atos-notariais-quantidade-e-base-d-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 05-notas.png) + auditoria/cache/orion-route-graph.json (#/orcamento/cadastrar: campos "Natureza", "Item")
- **Justificativa:** O passo 1 omitia o caminho de menu "Notas > Orçamento completo", fazendo a auditoria permanecer em #/inicio. Na 06.05.02 e em orion-route-graph.json, a tela corresponde a "Notas > Orçamento completo" (#/orcamento/cadastrar), onde os campos **Natureza** e **Item** existem; porém, os campos dos passos 2–6 não constam no dump estático de #/orcamento/cadastrar por dependerem da seleção prévia do ato/item.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar ao vivo em #/orcamento/cadastrar (após selecionar **Espécie**/**Natureza**/**Item**) os rótulos exatos dos passos 2–6: **Quantidade**, **Tipo de Cálculo** (**Integral**, **Diligência**, **Um Terço (1/3)**), **Valor Venal**, **Valor do Instrumento** e **Base de Cálculo**.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | No campo **Natureza** (ou **Item**), selecione o ato notarial desejado utilizando uma das seguintes formas:    * **Digitação com autocompletar**: digite o nome do ato (ex.: "Escritura com valor declarado") e selecione o item correspondente sugerido na barra de rolagem suspensa; ou    * **Listagem completa por Tab**: deixe o campo do item em branco e pressione a tecla **Tab** no teclado. O sistema abrirá uma janela com a relação completa de naturezas disponíveis; localize o item desejado e dê um **duplo clique** sobre ele. | Acesse o menu **Notas > Orçamento completo** e, no campo **Natureza** (ou **Item**), selecione o ato notarial desejado utilizando uma das seguintes formas:    * **Digitação com autocompletar**: digite o nome do ato (ex.: "Escritura com valor declarado") e selecione o item correspondente sugerido na barra de rolagem suspensa; ou    * **Listagem completa por Tab**: deixe o campo do item em branco e pressione a tecla **Tab** no teclado. O sistema abrirá uma janela com a relação completa de naturezas disponíveis; localize o item desejado e dê um **duplo clique** sobre ele. |

### V-2.2.3 — Cálculo de ITBI e Detalhamento de Custas do Registro de Imóveis via Tabela Auxiliar
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/V-2.2.3-calculo-de-itbi-e-detalhamento-de-custas-do-regist.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] V-2.2.3-calculo-de-itbi-e-detalhamento-de-custas-do-regist/[ATT] V-2.2.3-calculo-de-itbi-e-detalhamento-de-custas-do-regist-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 05-notas.png) + auditoria/cache/orion-route-graph.json (#/orcamento/cadastrar)
- **Justificativa:** O passo 1 omitia o caminho de menu "Notas > Orçamento completo", fazendo a auditoria permanecer em #/inicio. A rotina pertence ao fluxo de Orçamento Completo (06.05.02: "Notas > Orçamento completo", #/orcamento/cadastrar), e não a "Configurações > Tabela de custas > Cálculos" (falso positivo da Camada 3 em auditoria-caminhos-menus.md). Os controles internos de ITBI e Registro de Imóveis dependem de abertura da tela com ato selecionado para confirmação ao vivo.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar ao vivo em #/orcamento/cadastrar (após selecionar ato/item) os rótulos exatos dos passos 1–8: seção **ITBI**, campo **Alíquota**, seção **Registro de Imóveis**, ícone **Cifrão ($)**, janela **Tabela do Registro de Imóveis** (**Certidões**, **Quantidade**, **ISS**, botão **+** e **Concluir**) e confirmação **Sim**.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Na seção de **ITBI**, confira o cálculo apresentado:    * O sistema sugere a cidade e a alíquota padrão configuradas no cartório.    * Para alterar, digite o nome de outra cidade cadastrada (para carregar a alíquota vinculada) ou digite diretamente o percentual no campo **Alíquota** para que o sistema refaça o cálculo do ITBI instantaneamente. | Acesse o menu **Notas > Orçamento completo** e, na seção de **ITBI**, confira o cálculo apresentado:    * O sistema sugere a cidade e a alíquota padrão configuradas no cartório.    * Para alterar, digite o nome de outra cidade cadastrada (para carregar a alíquota vinculada) ou digite diretamente o percentual no campo **Alíquota** para que o sistema refaça o cálculo do ITBI instantaneamente. |

### V-2.3.1 — Edição de Custas do Registro de Imóveis e Adição de Múltiplos Atos no Orçamento Completo
- **Módulo:** `config` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/config/V-2.3.1-edicao-de-custas-do-registro-de-imoveis-e-adicao-d.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[ATT] V-2.3.1-edicao-de-custas-do-registro-de-imoveis-e-adicao-d/[ATT] V-2.3.1-edicao-de-custas-do-registro-de-imoveis-e-adicao-d-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 05-notas.png) + auditoria/cache/orion-route-graph.json (#/orcamento/cadastrar)
- **Justificativa:** O passo 1 omitia o caminho de menu "Notas > Orçamento completo", mantendo a auditoria em #/inicio. Na árvore 06.05.02, o Orçamento Completo fica em "Notas > Orçamento completo" (#/orcamento/cadastrar); os controles internos de Registro de Imóveis e múltiplos atos exigem verificação ao vivo com ato selecionado.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar ao vivo em #/orcamento/cadastrar (após selecionar ato/item) os rótulos exatos de **Registro de Imóveis**, ícone **Cifrão ($)**, **Tabela do Registro de Imóveis**, **Concluir**, botão **+** (Mais), **Natureza**, **Tipo de Cálculo** e botão **X**.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Para alterar o valor do **Registro de Imóveis** calculado pela tabela auxiliar:    * Observe que o campo na tela principal permanece bloqueado para edição direta.    * Clique novamente no ícone de **Cifrão ($)** ao lado do campo para reabrir a janela da **Tabela do Registro de Imóveis**.    * Realize as modificações necessárias: altere valores, quantidades ou remova atos desnecessários.    * Clique em **Concluir** para recalcular e atualizar automaticamente o total na tela principal. | Acesse o menu **Notas > Orçamento completo**. Para alterar o valor do **Registro de Imóveis** calculado pela tabela auxiliar:    * Observe que o campo na tela principal permanece bloqueado para edição direta.    * Clique novamente no ícone de **Cifrão ($)** ao lado do campo para reabrir a janela da **Tabela do Registro de Imóveis**.    * Realize as modificações necessárias: altere valores, quantidades ou remova atos desnecessários.    * Clique em **Concluir** para recalcular e atualizar automaticamente o total na tela principal. |

### V-2.3.2 — Gestão de Valores Extranotariais e Cadastro de Novos Serviços de Despesas
- **Módulo:** `config` · **Tag:** `[DDD]` · **Carga:** `unknown`
- **KB Original:** `kb/rotinas/config/V-2.3.2-gestao-de-valores-extranotariais-e-cadastro-de-nov.md`
- **Rascunho Auditado:** `auditoria/rotinas/config/[DDD] V-2.3.2-gestao-de-valores-extranotariais-e-cadastro-de-novos-servicos-de-despesas/[DDD] V-2.3.2-gestao-de-valores-extranotariais-e-cadastro-de-novos-servicos-de-despesas-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (06.05.02, 05-notas.png) + auditoria/cache/orion-route-graph.json (#/orcamento/cadastrar: campos inputNomeOutrosServicos0831e, quantidadeOutrosServicos0831e, inputValorOutrosServicos0831e)
- **Justificativa:** Embora o rascunho de 2026-11-11 (anterior ao ADR-025, com 0 prints e referência inválida a "Configurações > Tabela de Custas > Extranotariais") tenha marcado a rotina como [DDD], o manual original descreve exclusivamente interface web no Orçamento Completo ("Notas > Orçamento completo", #/orcamento/cadastrar, onde orion-route-graph.json comprova os campos de Outros Serviços). O passo 1 omitia o menu e os rótulos internos da seção e do modal de cadastro precisam de inspeção ao vivo.
- **Dúvidas / Lacunas Internas Restantes:**
  - Reauditar no ambiente Produtos (a tag [DDD] de 2026-11-11 foi aplicada sem abrir o navegador) acessando **Notas > Orçamento completo** (#/orcamento/cadastrar) para confirmar os rótulos exatos dos passos 1–9: seção **Outros Valores / Valores Extranotariais**, campos **Serviço**, **Valor** e **Quantidade**, botão **+**, modal **Cadastro de Outros Serviços** (**Descrição**, **Valor Fixo**, **Concluir**), botão **X** e totalizadores de rodapé.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Na seção inferior de **Outros Valores / Valores Extranotariais**, clique no campo **Serviço**. | Acesse o menu **Notas > Orçamento completo** e, na seção inferior de **Outros Valores / Valores Extranotariais**, clique no campo **Serviço**. |

### C-FIRMA-02 — Regularização de Sequência no Livro de Termos de Comparecimento e Etiquetas de Ressalva
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/C-FIRMA-02-regularizacao-de-sequencia-no-livro-de-termos-de-c.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] C-FIRMA-02-regularizacao-de-sequencia-no-livro-de-termos-de-c/[ATT] C-FIRMA-02-regularizacao-de-sequencia-no-livro-de-termos-de-c-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (06.05.02: 'Firmas > Cadastros > Cartão de assinatura' é a única tela de fichas em Firmas) + auditoria/src/menu-canonical.ts (equivalência explícita ['firmas', 'livros'] -> ['Administração', 'Controle de Livros'], evidenciando C-FIRMA-02)
- **Justificativa:** Os caminhos de menu dos passos 2 e 3 têm correspondência comprovada na árvore 06.05.02 e em menu-canonical.ts, porém o bloqueio ocorreu no passo 1 por cabeçalho condicional em negrito ('Erro de Grafia no Termo Já Impresso') antes da inspeção das telas internas e controles dos passos 4, 7 e 8.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passos 1 e 6: remover negrito dos títulos condicionais ('Erro de Grafia no Termo Já Impresso' e 'Salto de Numeração') para não serem confundidos com elementos de UI.
  - Passo 3 e 4: confirmar em **Administração > Controle de Livros** (#/livro) se a tela permite selecionar termos individuais emitidos e se existem os controles **Imprimir Etiqueta de Ressalva** e **Reutilização da Folha do Termo** (orion-route-graph.json lista apenas filtros de livros e botões Filtrar, Limpar, Adicionar, Voltar).
  - Passos 7 e 8: confirmar com Produtos se o **Ajuste de Sequência de Termos** ocorre em **Administração > Controle de Livros** ou em **Configurações > Parametrizações** > aba **Sequência** (campo **Termo** lido no Raio-X de #/configuracoes).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 2 | Acesse **Firmas > Fichas de Firmas**, localize o cliente e corrija os dados cadastrais. | Acesse **Firmas > Cadastros > Cartão de assinatura**, localize o cliente e corrija os dados cadastrais. |
| 3 | Acesse **Firmas > Livros > Livro de Termos de Comparecimento** e selecione o termo emitido. | Acesse **Administração > Controle de Livros** (para o livro de termos de comparecimento) e selecione o termo emitido. |

### C-FIRMA-03 — Habilitação de Permissões para Retificação e Inclusão de Alertas em Fichas de Firma
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/C-FIRMA-03-habilitacao-de-permissoes-para-retificacao-e-inclu.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] C-FIRMA-03-habilitacao-de-permissoes-para-retificacao-e-inclu/[ATT] C-FIRMA-03-habilitacao-de-permissoes-para-retificacao-e-inclu-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (06.05.02: 'Configurações > Usuários' e 'Configurações > Perfis e permissões de acesso') + diagnostico_tela_att (#/usuario/alterar/1: campo checkbox 'Escrevente de Firmas', botão 'Salvar') + auditoria_ui.auto_cura ('Editar' -> 'Alterar') + governanca_comentario
- **Justificativa:** Passos 1, 2 e 3 estão 100% comprovados pela árvore 06.05.02, auto-cura, Raio-X de #/usuario/alterar/1 e comentário de governança (o checkbox real é 'Escrevente de Firmas', sem aba 'Grupos de Trabalho'). Contudo, a aba 'Permissões Específicas' e o módulo 'Balcão de Firmas' (passos 4–6) não existem em #/usuario/alterar/1 e o Raio-X detalhado das permissões dentro de #/perfil não foi capturado.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passos 4, 5 e 6: confirmar com Produtos na tela **Configurações > Perfis e permissões de acesso** (#/perfil) quais são os nomes exatos dos módulos e caixas de seleção correspondentes a **Permissões Específicas**, **Balcão de Firmas**, **Alterar Dados da Ficha de Firma** e **Inserir Observações / Alertas no Cartão de Assinatura**.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Com perfil de administrador, acesse no **Orion TN** o menu **Configurações > Segurança > Usuários**. | Com perfil de administrador, acesse no **Orion TN** o menu **Configurações > Usuários**. |
| 2 | Selecione o operador e clique em **Editar**. | Selecione o operador e clique em **Alterar**. |
| 3 | Na aba **Grupos de Trabalho**, certifique-se de marcar a opção **Grupo Firmas**. | Na tela **Alteração de usuário**, marque a opção **Escrevente de Firmas**. |

### C-FIRMA-04 — Unificação e Bloqueio de Cartões de Assinatura Abertos em Duplicidade
- **Módulo:** `firmas` · **Tag:** `[XRX]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/C-FIRMA-04-unificacao-e-bloqueio-de-cartoes-de-assinatura-abe.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[XRX] C-FIRMA-04-unificacao-e-bloqueio-de-cartoes-de-assinatura-abe/[XRX] C-FIRMA-04-unificacao-e-bloqueio-de-cartoes-de-assinatura-abe-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (06.05.02: 'Firmas > Cadastros > Cartão de assinatura') + auditoria/src/menu-canonical.ts (equivalência explícita ['balcao de firmas', 'fichas / cartoes de assinatura'] -> ['Firmas', 'Cadastros', 'Cartão de assinatura']) + auditoria_ui.auto_cura
- **Justificativa:** O passo 1 tem equivalência 100% comprovada para 'Firmas > Cadastros > Cartão de assinatura', mas a execução parou no passo 3 por dependência cruzada [XRX] (grade vazia em #/ficha), impedindo comprovar os botões e campos internos dos passos 4–7 (além de #/ficha/cadastrar usar 'Concluir' em vez de 'Salvar' nos Raio-X de outras rotinas).
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 3: o termo **Ficha Principal** está em negrito no manual, mas é conceito operacional e não rótulo de tela.
  - Passos 4, 5 e 7: após popular cartões de assinatura na base de homologação, confirmar na grade de **Firmas > Cadastros > Cartão de assinatura** (#/ficha) e na tela de edição se a ação de edição se chama **Alterar** (em vez de **Editar**), qual o rótulo exato de **Inativo / Bloqueado** e se o botão de gravação é **Concluir** (como em #/ficha/cadastrar) ou **Salvar**.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Balcão de Firmas > Fichas / Cartões de Assinatura**. | Acesse o menu **Firmas > Cadastros > Cartão de assinatura**. |

### D-3.3 — Cadastrar Cartão de Assinatura
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/D-3.3-cadastrar-cartao-de-assinatura.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] D-3.3-cadastrar-cartao-de-assinatura/[ATT] D-3.3-cadastrar-cartao-de-assinatura-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (06.05.02: 'Firmas > Cadastros > Cartão de assinatura') + curated-route-synonyms.json ('Preencher com IA' -> 'Preencher cartão usando I.A.') + auditoria/src/route-synonyms.ts ('CPF' -> 'CPF ou CIN') + diagnostico_tela_att (#/ficha/cadastrar: campos 'Nome', 'CPF ou CIN', 'RG', 'Pai', 'Mãe', 'Profissão', seção 'Endereço', botões 'Preencher cartão usando I.A.', 'Concluir')
- **Justificativa:** Passos 1, 2, 3 e 6 têm correspondência 100% comprovada pela árvore 06.05.02, curated-route-synonyms.json, route-synonyms.ts e Raio-X de #/ficha/cadastrar; contudo, os passos 4 e 5 citam botões ('Webcam', 'Capturar Biometria' e 'Impressão') ausentes literalmente do Raio-X de #/ficha/cadastrar.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 4: no Raio-X de #/ficha/cadastrar constam apenas os botões **Capturar**, **Digitalizar** e **Selecionar** (não há botões com texto literal **Webcam** nem **Capturar Biometria**); confirmar com Produtos quais botões/ícones realizam a foto facial e a leitura biométrica.
  - Passo 5: o botão **Impressão** não consta nos botões de #/ficha/cadastrar no Raio-X (apenas **Concluir** e **Voltar**); confirmar se a impressão ocorre após **Concluir** ou na listagem **Firmas > Cadastros > Cartão de assinatura** (#/ficha).
  - Nota Importante: confirmar em qual tela/momento fica disponível o botão **Bloquear Cartão** (ausente em #/ficha/cadastrar).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse **Firmas > Cadastros > Cartão de Assinatura** e clique no botão **Adicionar**. | Acesse **Firmas > Cadastros > Cartão de assinatura** e clique no botão **Adicionar**. |
| 2 | Para agilizar o preenchimento, clique em **Preencher com IA** e digitalize ou importe a CNH/RG do cliente. | Para agilizar o preenchimento, clique em **Preencher cartão usando I.A.** e digitalize ou importe a CNH/RG do cliente. |
| 3 | Revise os dados extraídos pelo OCR (**Nome**, **CPF**, **RG**, **Filiação**, **Endereço** e **Profissão**). | Revise os dados extraídos pelo OCR (**Nome**, **CPF ou CIN**, **RG**, **Pai**, **Mãe**, **Endereço** e **Profissão**). |
| 6 | Clique em **Salvar** para registrar o cartão; se ativado, o sistema consumirá automaticamente o selo e papel de segurança. | Clique em **Concluir** para registrar o cartão; se ativado, o sistema consumirá automaticamente o selo e papel de segurança. |

### M-14.1 — Balcão de Firmas: Como Buscar e Selecionar Partes para o Reconhecimento
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/M-14.1-balcao-de-firmas-como-buscar-e-selecionar-partes-p.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] M-14.1-balcao-de-firmas-como-buscar-e-selecionar-partes-p/[ATT] M-14.1-balcao-de-firmas-como-buscar-e-selecionar-partes-p-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (06.05.02: 'Firmas > Reconhecimento de firmas') + auditoria-caminhos-menus.md (Fila A: 'Balcão de firmas' -> 'Firmas > Reconhecimento de firmas') + orion-route-graph.json (#/pedidoFirmas/cadastrar)
- **Justificativa:** A tela de navegação do passo 1 ('Balcão de firmas' -> 'Firmas > Reconhecimento de firmas', #/pedidoFirmas/cadastrar) é comprovada pela 06.05.02, Fila A e orion-route-graph.json; porém o passo 1 bloqueou na Home antes da inspeção ao vivo da tela e há controles sem correspondência literal em orion-route-graph.json ('Partes / Cartão de assinatura', 'Sinal Público' vs 'Sinal', 'Adicionar Parte').
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 1: em #/pedidoFirmas/cadastrar (orion-route-graph.json), não há campo literal **Partes / Cartão de assinatura** — os campos de busca visíveis são a opção **Cartão** (ao lado de **Sinal**), **Nome**, **Nº cartão**, **CPF ou CIN**, **RG** e **Pessoa jurídica**; confirmar o fluxo exato ao vivo.
  - Passo 4: confirmar se a opção documentada como **Sinal Público** corresponde literalmente à opção **Sinal** em #/pedidoFirmas/cadastrar.
  - Passo 6: o botão **Adicionar Parte** não consta na lista inicial de botões de #/pedidoFirmas/cadastrar em orion-route-graph.json; confirmar se surge após **Filtrar** ou se a seleção na lista já vincula a parte.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Com o pedido aberto na tela **Balcão de firmas**, clique no campo **Partes / Cartão de assinatura**. | Com o pedido aberto na tela **Reconhecimento de firmas** (menu **Firmas > Reconhecimento de firmas**), clique no campo **Partes / Cartão de assinatura**. |

### M-16.4 — Gerenciar Sequências Automáticas do Sistema
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/M-16.4-gerenciar-sequencias-automaticas-do-sistema.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] M-16.4-gerenciar-sequencias-automaticas-do-sistema/[ATT] M-16.4-gerenciar-sequencias-automaticas-do-sistema-revisado.md`
- **Fonte da Prova:** auditoria/src/menu-canonical.ts ('Administração > Parâmetros' -> 'Configurações > Parametrizações') + auditoria/src/route-synonyms.ts ('Sequências automáticas' -> aba 'Sequência' em #/configuracoes) + diagnostico_tela_att (#/configuracoes: botão 'Concluir')
- **Justificativa:** O caminho do passo 1 ('Configurações > Parametrizações' > aba 'Sequência') e o botão final do passo 6 ('Concluir') estão 100% comprovados, mas os passos 2–5 descrevem uma grade com colunas 'Último número gerado', 'Próximo número' e botão 'Editar', enquanto o Raio-X da aba 'Sequência' mostra campos numéricos diretos sem grade nem botão 'Editar'.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passos 2–5: confirmar com Produtos os rótulos visíveis dos campos da aba **Sequência** que apareceram com ID técnico no Raio-X (ex.: inputUltimaSequenciaPedidoFirmas, inputUltimaSequenciaGuia, inputUltimaSequenciaRps, inputSerieRps, inputSequenciaSeloDigital, inputSequenciaCoaf) e se os valores informados representam o último número gerado ou o próximo.
  - Passo 5: confirmar onde fica a opção de reinício anual da sequência na tela atual (em orion-route-graph.json consta **Zera anualmente** em #/configuracoes, sem confirmação de seção/aba no Raio-X).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Sequências automáticas**. | Acesse o menu **Configurações > Parametrizações** e selecione a aba **Sequência**. |
| 6 | Clique no botão **Salvar** para gravar o novo valor do contador. | Clique no botão **Concluir** para gravar o novo valor do contador. |

### M-16.8 — Parametrizar Pedido de Firmas e Termo de Comparecimento
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/M-16.8-parametrizar-pedido-de-firmas-e-termo-de-compareci.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] M-16.8-parametrizar-pedido-de-firmas-e-termo-de-compareci/[ATT] M-16.8-parametrizar-pedido-de-firmas-e-termo-de-compareci-revisado.md`
- **Fonte da Prova:** auditoria/src/menu-canonical.ts ('Administração > Parâmetros' -> 'Configurações > Parametrizações') + auditoria/src/route-synonyms.ts ('Pedido de firmas e Termo de comparecimento' -> aba 'Pedido de firmas' em #/configuracoes) + diagnostico_tela_att (#/configuracoes: botão 'Concluir')
- **Justificativa:** O passo 1 ('Configurações > Parametrizações' > aba 'Pedido de firmas') e o passo 6 ('Concluir') estão 100% comprovados, porém os passos 2–4 citam rótulos que não aparecem no Raio-X da aba ('Pedido de Firmas' como seção, 'Exigir captura de biometria', 'Tipo de captura' e 'Livros Notariais').
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 2: não há seção chamada **Pedido de Firmas** no Raio-X; os controles de senha e numeração aparecem diretamente na aba **Pedido de firmas** (**Gerar pedido utilizando senha**, **Sequência única**, **Diário**, **Anual**). Confirmar redação com Produtos.
  - Passo 3: o Raio-X registra a seção **Termo de comparecimento** e as opções **Um dedo** e **Todos os dedos**, mas não constam os rótulos **Exigir captura de biometria** nem **Tipo de captura**; confirmar se houve remoção/reagrupamento.
  - Passo 4: no Raio-X constam as opções **Automática**, **Manual**, **Abrir livro automaticamente** e **Sequência de termo automática**, mas não o rótulo **Livros Notariais**; confirmar o nome exato do grupo na tela.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Administração > Parâmetros > Pedido de firmas e Termo de comparecimento**. | Acesse o menu **Configurações > Parametrizações** e selecione a aba **Pedido de firmas**. |
| 6 | Clique no botão **Salvar** para registrar os parâmetros. | Clique no botão **Concluir** para registrar os parâmetros. |

### M-9.0 — Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/M-9.0-abertura-rapida-de-cartao-de-assinatura-no-balcao-.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] M-9.0-abertura-rapida-de-cartao-de-assinatura-no-balcao-/[ATT] M-9.0-abertura-rapida-de-cartao-de-assinatura-no-balcao--revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (06.05.02: 'Firmas > Cadastros > Cartão de assinatura') + auditoria/src/route-synonyms.ts ('Nome completo' -> 'Nome'; 'CPF' -> 'CPF ou CIN'; 'RG/CNH' -> 'RG' e 'CNH') + diagnostico_tela_att (#/ficha/cadastrar: seções 'Dados pessoais', 'Contato', 'Endereço'; campos 'Nome', 'CPF ou CIN', 'RG', 'CNH', 'Nascimento', 'Nacionalidade', 'Estado civil', 'Profissão', 'CEP') + auditoria_ui.auto_cura
- **Justificativa:** Os passos 1, 2, 3 e 4 têm correspondência 100% comprovada pela árvore 06.05.02, route-synonyms.ts, auto-cura e Raio-X de #/ficha/cadastrar; contudo, o passo 5 cita o botão 'Avançar', que não existe na tela #/ficha/cadastrar (formulário único rolável com botões 'Concluir' e 'Voltar').
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 5: não há botão **Avançar** em #/ficha/cadastrar (os botões lidos no Raio-X são **Preencher cartão usando I.A.**, **Consumir**, **Gerar**, **Capturar**, **Digitalizar**, **Concluir** e **Voltar** na mesma tela); confirmar com Produtos se o passo deve orientar a seguir para as seções de captura/selo na mesma página e finalizar em **Concluir**.
  - Passo 4: no Raio-X de #/ficha/cadastrar constam os campos **CEP**, **Logradouro**, **Complemento**, **Bairro**, **País**, **Cidade**, **Telefone** e **E-mail**, sem campo **Número** listado na seção Endereço; confirmar se existe campo número em tela.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Firmas > Cadastro > Cartão de assinatura** e clique em **Adicionar** (ou utilize o atalho de novo cartão diretamente na tela do balcão de atendimento). | Acesse o menu **Firmas > Cadastros > Cartão de assinatura** e clique em **Adicionar** (ou utilize o atalho de novo cartão diretamente na tela do balcão de atendimento). |
| 2 | Na aba **Dados pessoais**, insira o **Nome completo** do cliente, **CPF**, documento de identificação (**RG/CNH**, órgão emissor e UF). | Na seção **Dados pessoais**, insira o **Nome** do cliente, **CPF ou CIN**, documento de identificação (**RG** e **CNH**, órgão emissor e UF). |
| 3 | Preencha **Data de nascimento**, **Nacionalidade**, **Estado civil**, **Profissão** e nome dos genitores (filiação). | Preencha **Nascimento**, **Nacionalidade**, **Estado civil**, **Profissão** e nome dos genitores (filiação). |
| 4 | Na seção **Contato e Endereço**, digite o **CEP** para preenchimento automático do logradouro e complemente com número, bairro, telefone celular e e-mail. | Nas seções **Contato** e **Endereço**, digite o **CEP** para preenchimento automático do logradouro e complemente com número, bairro, telefone celular e e-mail. |

### M-9.2 — Como Vincular uma Pessoa Jurídica a um Cartão de Assinatura
- **Módulo:** `firmas` · **Tag:** `[XRX]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/M-9.2-como-vincular-uma-pessoa-juridica-a-um-cartao-de-a.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[XRX] M-9.2-como-vincular-uma-pessoa-juridica-a-um-cartao-de-a/[XRX] M-9.2-como-vincular-uma-pessoa-juridica-a-um-cartao-de-a-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Cartão de assinatura); auto_cura passo 1 em [XRX] M-9.2-como-vincular-uma-pessoa-juridica-a-um-cartao-de-a-revisado.md; diagnostico_tela_att de #/ficha/cadastrar em V-CCA.1.1-revisado.md
- **Justificativa:** O caminho de menu do passo 1 tem correção 100% comprovada pela árvore 06.05.02 (Cadastros no plural), mas a rotina bloqueou no passo 2 por grade vazia ([XRX]) em #/ficha e os passos 2 a 6 citam aba Representante PJ, campo Pessoa Jurídica e botão Salvar que divergem do Raio-X de #/ficha/cadastrar (seção Pessoa Jurídica - Representante, campos Razão social e CNPJ, botão Concluir).
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 1: confirmar na grade populada de #/ficha o rótulo/ícone exato da ação Editar e se o filtro é feito pelos campos Pesquisar por nome e Documento/Número (orion-route-graph.json).
  - Passo 2: confirmar na tela de edição (#/ficha/alterar) se não há aba Representante PJ e se o bloco corresponde à seção Pessoa Jurídica - Representante (como em #/ficha/cadastrar).
  - Passos 3 a 5: confirmar se os campos Razão social e CNPJ substituem o campo único Pessoa Jurídica e se os seletores de cargo/condição e Padrão aparecem condicionalmente após informar/adicionar a PJ.
  - Passo 6: confirmar se a gravação final da edição usa o botão Concluir (como em #/ficha/cadastrar) em vez de Salvar.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Firmas > Cadastro > Cartão de assinatura**, filtre pelo nome ou CPF da pessoa física e clique em **Editar**. | Acesse o menu **Firmas > Cadastros > Cartão de assinatura**, filtre pelo nome ou CPF da pessoa física e clique em **Editar**. |

### M-9.3 — Gerenciar Consumo de Papel de Segurança e Selo Digital no Cartão de Assinatura
- **Módulo:** `firmas` · **Tag:** `[XRX]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/M-9.3-gerenciar-consumo-de-papel-de-seguranca-e-selo-dig.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[XRX] M-9.3-gerenciar-consumo-de-papel-de-seguranca-e-selo-dig/[XRX] M-9.3-gerenciar-consumo-de-papel-de-seguranca-e-selo-dig-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Cartão de assinatura); auto_cura passo 1 em [XRX] M-9.3-gerenciar-consumo-de-papel-de-seguranca-e-selo-dig-revisado.md; diagnostico_tela_att de #/ficha/cadastrar em V-CCA.1.1-revisado.md
- **Justificativa:** O caminho de menu do passo 1 tem correção comprovada pela 06.05.02 (Firmas > Cadastros > Cartão de assinatura), porém a rotina bloqueou no passo 2 por grade vazia ([XRX]) e os passos seguintes citam aba Consumo de Papel / Selo, campo NFS (Papel de Segurança), Inutilizar Papel, Reutilizar/Estornar e botão Salvar que divergem do Raio-X de #/ficha/cadastrar (seções Papel de segurança e Selo digital, botões Consumir, Gerar e Concluir).
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 1: confirmar se a aba Consumo de Papel / Selo foi substituída pelas seções Papel de segurança e Selo digital exibidas em #/ficha/cadastrar.
  - Passos 2 e 3: confirmar se o campo NFS (Papel de Segurança) ainda existe na edição ou se o fluxo atual usa exclusivamente o botão Consumir na seção Papel de segurança.
  - Passo 4: confirmar com dados reais (cartão com papel reservado/consumido) os rótulos exatos dos botões/ícones de descarte e devolução (Inutilizar Papel vs Inutilizar; Reutilizar/Estornar vs Reutilizar).
  - Passo 5: confirmar se a consolidação usa o botão Concluir (como em #/ficha/cadastrar) em vez de Salvar.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Durante a abertura ou edição do cartão em **Firmas > Cadastro > Cartão de assinatura**, acesse a aba **Consumo de Papel / Selo**. | Durante a abertura ou edição do cartão em **Firmas > Cadastros > Cartão de assinatura**, acesse a aba **Consumo de Papel / Selo**. |

### R-10.0 — Abrir Pedido de Firmas no Balcão de Atendimento
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/R-10.0-abrir-pedido-de-firmas-no-balcao-de-atendimento.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] R-10.0-abrir-pedido-de-firmas-no-balcao-de-atendimento/[ATT] R-10.0-abrir-pedido-de-firmas-no-balcao-de-atendimento-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Reconhecimento de firmas); auto_cura passo 1 e diagnostico_tela_att (#/pedidoFirmas/cadastrar) em [ATT] R-10.0-abrir-pedido-de-firmas-no-balcao-de-atendimento-revisado.md; auditoria/cache/orion-route-graph.json (#/aberturaPedidos e #/pedidoFirmas/cadastrar)
- **Justificativa:** O passo 1 tem correção 100% comprovada pela árvore 06.05.02 (remoção do caminho inexistente Firmas > Balcão de Firmas e ajuste de caixa para Firmas > Reconhecimento de firmas), mas o passo 2 bloqueou em #/pedidoFirmas/cadastrar por inexistência do botão "+" (Adicionar Novo Pedido), deixando em aberto o fluxo real de abertura/confirmação da comanda.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passos 2 e 3: confirmar com Produtos onde fica a abertura do pedido sem o botão "+" (Adicionar Novo Pedido) e sem o botão Confirmar em #/pedidoFirmas/cadastrar (se o fluxo atual usa Firmas > Abertura de pedido com o botão Nova senha / Finalizar, ou preenchimento direto em #/pedidoFirmas/cadastrar).
  - Passo 4: confirmar se os campos liberados após gerar o pedido correspondem a Nome e CPF ou CIN já visíveis em #/pedidoFirmas/cadastrar.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Firmas > Reconhecimento de Firmas** ou **Firmas > Balcão de Firmas**. | Acesse o menu **Firmas > Reconhecimento de firmas**. |

### R-3.0 — Consultar Pedidos de Firmas em Aberto Sem Pagamento no Caixa
- **Módulo:** `firmas` · **Tag:** `[XRX]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/firmas/R-3.0-consultar-pedidos-de-firmas-em-aberto-sem-pagament.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[XRX] R-3.0-consultar-pedidos-de-firmas-em-aberto-sem-pagament/[XRX] R-3.0-consultar-pedidos-de-firmas-em-aberto-sem-pagament-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Consultas > Reconhecimentos de firmas); auto_cura passo 1 em [XRX] R-3.0-consultar-pedidos-de-firmas-em-aberto-sem-pagament-revisado.md; auditoria/cache/orion-route-graph.json (#/pedidoFirmas)
- **Justificativa:** O passo 1 tem correção 100% comprovada pela árvore 06.05.02 (Firmas > Consultas > Reconhecimentos de firmas), porém a rotina bloqueou por grade vazia ([XRX]) e o passo 5 cita o caminho Caixa > Administração > Pagamentos, inexistente nos 115 caminhos do catálogo 06.05.02.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 3: confirmar na lista de opções do campo Status em #/pedidoFirmas os rótulos atuais equivalentes a "Aguardando Pagamento" e "Iniciado" (o histórico de reauditoria apontou pistas não confirmadas como Aguardando atendimento e Iniciado em).
  - Passo 5: confirmar com Produtos qual o fluxo/módulo equivalente ao caminho inexistente Caixa > Administração > Pagamentos (se pertence ao sistema externo Orion Caixa ou a outra tela do Orion TN).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Firmas > Consultas > Reconhecimento de Firmas**. | Acesse o menu **Firmas > Consultas > Reconhecimentos de firmas**. |

### V-1.0 — Como Cadastrar e Gerenciar o Sinal Público
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/V-1.0-como-cadastrar-e-gerenciar-o-sinal-publico.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] V-1.0-como-cadastrar-e-gerenciar-o-sinal-publico/[ATT] V-1.0-como-cadastrar-e-gerenciar-o-sinal-publico-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Sinal público); diagnostico_tela_att (#/sinalPublico/cadastrar) em [ATT] V-1.0-como-cadastrar-e-gerenciar-o-sinal-publico-revisado.md; auditoria/cache/orion-route-graph.json (#/sinalPublico)
- **Justificativa:** A navegação para Firmas > Cadastros > Sinal público, as seções Pessoas e Arquivos anexos em #/sinalPublico/cadastrar e os filtros Cartório, Nº Sinal, Data digitação e Inativos em #/sinalPublico são comprovados pela 06.05.02, pelo Raio-X e pelo orion-route-graph.json; porém o passo 3 bloqueou em data de recebimento/envio (Data recebimento visível para Recebido, comportamento condicional de Enviado não verificado), o botão + de Pessoas aparece como Adicionar no Raio-X e os ícones de linha da Parte 2 exigem grade populada.
- **Dúvidas / Lacunas Internas Restantes:**
  - Parte 1, Passo 3: confirmar se o campo Data recebimento muda dinamicamente de rótulo para Data envio ao selecionar a opção Enviado (ou se permanece Data recebimento).
  - Parte 1, Passo 4: confirmar se a inclusão de mais de um escrevente na seção Pessoas usa o botão Adicionar (listado no Raio-X) ou um ícone +.
  - Parte 2, Passo 4: confirmar na grade populada de #/sinalPublico a presença e os rótulos exatos dos atalhos de linha Andamentos, Anexos, Visualizar, Editar e Inativar.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu **Firmas > Cadastros > Sinal Público**. | Acesse o menu **Firmas > Cadastros > Sinal público**. |
| 4 | Na aba **Pessoas**, preencha o nome e o cargo do escrevente. Para adicionar mais de um, clique no botão **+**. | Na seção **Pessoas**, preencha o **Nome** e o **Cargo** do escrevente. Para adicionar mais de um, clique no botão **+**. |
| 5 | Na aba **Arquivos Anexos**, você pode: | Na seção **Arquivos anexos**, você pode: |
| 2 | Utilize os campos de filtro na parte superior da tela para buscar o registro desejado. As opções de busca incluem:    * **Pesquisar por cartório**;    * **Pesquisar por nº sinal público**;    * **Pesquisar por data de digitação**;    * **Inativos**. | Utilize os campos de filtro na parte superior da tela para buscar o registro desejado. As opções de busca incluem:    * **Cartório**;    * **Nº Sinal**;    * **Data digitação**;    * **Inativos**. |

### V-CCA.1.1 — Abertura e Preenchimento Básico do Cartão de Assinatura com Busca e Reaproveitamento de Dados
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/V-CCA.1.1-abertura-e-preenchimento-basico-do-cartao-de-assin.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] V-CCA.1.1-abertura-e-preenchimento-basico-do-cartao-de-assin/[ATT] V-CCA.1.1-abertura-e-preenchimento-basico-do-cartao-de-assin-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Cartão de assinatura); diagnostico_tela_att (#/ficha/cadastrar) em [ATT] V-CCA.1.1-abertura-e-preenchimento-basico-do-cartao-de-assin-revisado.md; auditoria/src/route-synonyms.ts (#/ficha/cadastrar: CPF -> CPF ou CIN, RG/CNH -> RG e CNH)
- **Justificativa:** O caminho do passo 1 (Firmas > Cadastros > Cartão de assinatura) e o rótulo CPF ou CIN no passo 4 são 100% comprovados pela 06.05.02, pelo Raio-X de #/ficha/cadastrar e por route-synonyms.ts; porém o passo 5 bloqueou por ausência do ícone Lupa ao lado de Nome e CPF ou CIN, impedindo a verificação ao vivo dos passos 5 a 10.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 5: confirmar com Produtos como é acionada a busca/reaproveitamento de dados nos campos Nome (tipo search no DOM) e CPF ou CIN em #/ficha/cadastrar sem o ícone Lupa (ex.: Enter, preenchimento automático ou botão Preencher cartão usando I.A.).
  - Passos 6 a 8: confirmar a listagem de origem ((Protocolo) e (Cartão de Assinatura)) e o diálogo Confirmar/Sim após a busca.
  - Passo 9: confirmar a exibição condicional dos campos de cônjuge ao selecionar Casado em Estado civil e o funcionamento do ícone informativo (i), além da separação dos campos RG e CNH (route-synonyms.ts).
  - Passo 10: confirmar se o alerta de validação do botão Concluir exibe o ícone Triângulo de Alerta ao passar o mouse.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Acesse o menu principal **Firmas > Cadastros > Cartão de Assinatura**. | Acesse o menu principal **Firmas > Cadastros > Cartão de assinatura**. |
| 4 | Identifique os campos com asterisco (**\***), que indicam preenchimento obrigatório pelo sistema (por padrão: **Nome** e **CPF**, além de eventuais campos customizados pela serventia). | Identifique os campos com asterisco (**\***), que indicam preenchimento obrigatório pelo sistema (por padrão: **Nome** e **CPF ou CIN**, além de eventuais campos customizados pela serventia). |

### V-CCA.1.2 — Gerenciamento de Profissões, Contatos, Endereços e Representação de Pessoa Jurídica no Cartão de Assinatura
- **Módulo:** `firmas` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/firmas/V-CCA.1.2-gerenciamento-de-profissoes-contatos-enderecos-e-r.md`
- **Rascunho Auditado:** `auditoria/rotinas/firmas/[ATT] V-CCA.1.2-gerenciamento-de-profissoes-contatos-enderecos-e-r/[ATT] V-CCA.1.2-gerenciamento-de-profissoes-contatos-enderecos-e-r-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Cartão de assinatura); auditoria/cache/orion-route-graph.json (#/ficha, botão Adicionar); diagnostico_tela_att de #/ficha/cadastrar em V-CCA.1.1-revisado.md (seções Contato, Endereço, Pessoa Jurídica - Representante; campos Profissão, Razão social, CNPJ)
- **Justificativa:** A rota inicial comprovada pela 06.05.02 e pelo Raio-X de #/ficha/cadastrar (V-CCA.1.1) é Firmas > Cadastros > Cartão de assinatura > Adicionar, com as seções Contato, Endereço e Pessoa Jurídica - Representante e o campo Profissão; porém a auditoria parou em #/inicio por falta de navegação explícita no passo 1 e o Raio-X estático de #/ficha/cadastrar não comprova os botões Lupa, +, - nem as caixas Principal em Endereço e Padrão em PJ.
- **Dúvidas / Lacunas Internas Restantes:**
  - Passo 1: confirmar em #/ficha/cadastrar se o campo Profissão possui ícones de Lupa e + (com modal Concluir) ou se utiliza lista suspensa/autocompletar.
  - Passos 2 e 3: confirmar os botões de adição (+) e remoção (-) nas seções Contato e Endereço e se há caixa Principal na seção Endereço.
  - Passo 4: confirmar se a seção Pessoa Jurídica - Representante possui botão + e caixa de seleção Padrão após informar Razão social e CNPJ.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | Na tela de cadastro do **Cartão de Assinatura**, localize o campo **Profissão**: | Acesse **Firmas > Cadastros > Cartão de assinatura**, clique em **Adicionar** e localize o campo **Profissão**: |
| 2 | Na seção de **Contatos (E-mails e Telefones)**: | Na seção **Contato**: |
| 3 | Na seção de **Endereços**: | Na seção **Endereço**: |
| 4 | Na seção de **Representação de Pessoa Jurídica (Empresas)**: | Na seção **Pessoa Jurídica - Representante**: |

### C-LIVRO-01 — Procedimento de Inutilização e Declaração de Folha Sem Efeito em Livro Notarial
- **Módulo:** `livros` · **Tag:** `[XRX]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/livros/C-LIVRO-01-procedimento-de-inutilizacao-e-declaracao-de-folha.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[XRX] C-LIVRO-01-procedimento-de-inutilizacao-e-declaracao-de-folha/[XRX] C-LIVRO-01-procedimento-de-inutilizacao-e-declaracao-de-folha-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.5, item 24: 'Administração > Controle de Livros'); menu-canonical.ts (EXPLICIT_MENU_EQUIVALENCES: ['livros'] -> ['Administração', 'Controle de Livros']); orion-route-graph.json (#/livro); revisado C-LIVRO-01 (auto_cura passo 1 -> 'Administração > Controle de Livros' e grade vazia em #/livro).
- **Justificativa:** O caminho de menu do passo 1 está comprovadamente desatualizado e corresponde a Administração > Controle de Livros na 06.05.02. Os passos seguintes (seleção de livro, grade de páginas, botão Ações > Inutilizar Folha / Declarar Sem Efeito e campo Justificativa Legal) não puderam ser comprovados porque a grade de #/livro está vazia ([XRX], depende de cadastro/uso prévio de livro).
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar na tela #/livro com livro cadastrado e selecionado o nome real da grade de páginas (passo 3).
  - Confirmar o nome exato do botão/ação de inutilização de folha (citado como 'Ações > Inutilizar Folha / Declarar Sem Efeito' no passo 4).
  - Confirmar o nome exato do campo de justificativa (citado como 'Justificativa Legal' no passo 5).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o menu **Livros > Gestão e Controle de Folhas** (ou **Notas > Livros**). | 1. Acesse o menu **Administração > Controle de Livros**. |

### C-LIVRO-02 — Reabertura Administrativa de Livro Notarial Encerrado Prematuramente com Termos Vagos
- **Módulo:** `livros` · **Tag:** `[XRX]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/livros/C-LIVRO-02-reabertura-administrativa-de-livro-notarial-encerr.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[XRX] C-LIVRO-02-reabertura-administrativa-de-livro-notarial-encerr/[XRX] C-LIVRO-02-reabertura-administrativa-de-livro-notarial-encerr-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.5, item 24: 'Administração > Controle de Livros'); menu-canonical.ts (EXPLICIT_MENU_EQUIVALENCES: ['configuracoes', 'livros notariais'] -> ['Administração', 'Controle de Livros']); orion-route-graph.json (#/livro); revisado C-LIVRO-02 (auto_cura passo 1 -> 'Administração > Controle de Livros' e grade vazia em #/livro).
- **Justificativa:** O caminho de menu do passo 1 corresponde comprovadamente a Administração > Controle de Livros na 06.05.02. Os passos internos (status ENCERRADO, botão Ações > Reabrir Livro Notarial / Cancelar Encerramento e status Aberto / Em Uso) exigem confirmação na tela com livro encerrado cadastrado ([XRX]).
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar o rótulo exato do status de livro encerrado na grade/filtro de #/livro (passo 2).
  - Confirmar o nome exato da ação/botão para reabrir livro (citado como 'Ações > Reabrir Livro Notarial / Cancelar Encerramento' no passo 3).
  - Confirmar o rótulo do status após reabertura (citado como 'Aberto / Em Uso' no passo 5).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Com login de administrador ou substituto, acesse **Configurações > Livros Notariais > Cadastro e Encerramento**. | 1. Com login de administrador ou substituto, acesse **Administração > Controle de Livros**. |

### C-LIVRO-03 — Otimização de Paginação do Traslado e Redução de Laudas Residuais
- **Módulo:** `livros` · **Tag:** `[XRX]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/livros/C-LIVRO-03-otimizacao-de-paginacao-do-traslado-e-reducao-de-l.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[XRX] C-LIVRO-03-otimizacao-de-paginacao-do-traslado-e-reducao-de-l/[XRX] C-LIVRO-03-otimizacao-de-paginacao-do-traslado-e-reducao-de-l-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.3, item 9: 'Notas > Consultas > Protocolos'); auditoria-caminhos-menus.md ('Notas > Protocolo -> Notas > Consultas > Protocolos'); orion-route-graph.json (#/protocolo).
- **Justificativa:** O caminho de menu do passo 1 ('Notas > Protocolo') está comprovado na 06.05.02 como 'Notas > Consultas > Protocolos'. A aba 'Traslado' (passo 1) e os comandos internos do editor nos passos 2 a 8 exigem confirmação ao vivo com um protocolo aberto ([XRX]).
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar em protocolo aberto em #/protocolo se existe a aba 'Traslado' (passo 1).
  - Confirmar o nome exato dos comandos do editor nos passos 2 a 8: 'Editar Traslado / Diagramação', 'Espaçamento Entrelinhas', 'Formatar > Parágrafo', 'Espaçamento Antes e Depois', 'Layout da Página > Margens', 'Visualizar Impressão' e 'Gravar Diagramação'.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Abra o protocolo do ato através de **Notas > Protocolo** e selecione a aba **Traslado**. | 1. Abra o protocolo do ato através de **Notas > Consultas > Protocolos** e selecione a aba **Traslado**. |

### C-LIVRO-05 — Geração de Termos de Abertura e Encerramento de Livros Notariais
- **Módulo:** `livros` · **Tag:** `[ATT]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/livros/C-LIVRO-05-geracao-de-termos-de-abertura-e-encerramento-de-li.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[ATT] C-LIVRO-05-geracao-de-termos-de-abertura-e-encerramento-de-li/[ATT] C-LIVRO-05-geracao-de-termos-de-abertura-e-encerramento-de-li-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.5, item 24: 'Administração > Controle de Livros'); menu-canonical.ts (EXPLICIT_MENU_EQUIVALENCES: ['livros'] -> ['Administração', 'Controle de Livros']); orion-route-graph.json (#/livro); revisado C-LIVRO-05 (Camada 4 em #/livro leu 'Tipo livro', 'Filtrar', 'Limpar', sem os rótulos dos passos 2-8).
- **Justificativa:** O caminho do passo 1 ('Livros > Gestão de Livros Notariais') corresponde na 06.05.02 a 'Administração > Controle de Livros' (#/livro), onde existem os controles de consulta e o botão 'Adicionar'. Entretanto, os passos 2 a 8 citam opções e botões não presentes na tela inicial #/livro ('Escrituras', 'Procurações', 'Testamentos', 'Cadastrar Novo Livro', 'Emitir Termo de Abertura', 'Encerrar Livro', 'Visualizar e Imprimir Termo de Encerramento'), exigindo confirmação com Produtos nas telas de cadastro/edição de livro.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos os valores do campo 'Tipo livro' em #/livro e #/livro/cadastrar (citados como 'Escrituras', 'Procurações', 'Testamentos' no passo 2).
  - Confirmar na tela aberta pelo botão 'Adicionar' (#/livro/cadastrar) como é feita a emissão do Termo de Abertura (citado como 'Cadastrar Novo Livro' e 'Emitir Termo de Abertura' no passo 4).
  - Confirmar onde ficam os comandos de encerramento e impressão do termo (citados como 'Encerrar Livro' no passo 6 e 'Visualizar e Imprimir Termo de Encerramento' no passo 8).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o menu **Livros > Gestão de Livros Notariais**. | 1. Acesse o menu **Administração > Controle de Livros**. |

### C-LIVRO-06 — Correção de Duplicidade de Complementos de Livro e Folha em Lotes de Quinzena
- **Módulo:** `livros` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/livros/C-LIVRO-06-correcao-de-duplicidade-de-complementos-de-livro-e.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[ATT] C-LIVRO-06-correcao-de-duplicidade-de-complementos-de-livro-e/[ATT] C-LIVRO-06-correcao-de-duplicidade-de-complementos-de-livro-e-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.3, item 9: 'Notas > Consultas > Protocolos'; seção 4.5, itens 6-12: submenu 'Administração > Comunicações'); auditoria-caminhos-menus.md (Fila A: C-LIVRO-06 -> 'Administração > Comunicações' é submenu; 'Notas > Protocolo' -> 'Notas > Consultas > Protocolos').
- **Justificativa:** O passo 3 ('Notas > Protocolo') tem correspondência 100% comprovada na 06.05.02 como 'Notas > Consultas > Protocolos'. Já o passo 1 ('Notas > Fechamento de Quinzena / Comunicações') aponta para o submenu 'Administração > Comunicações', que possui 7 telas finais na 06.05.02 sem destino único comprovado, além de lacunas nos passos internos 3, 4 e 7.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos qual tela final da 06.05.02 substituiu 'Notas > Fechamento de Quinzena / Comunicações' (ex.: 'Administração > Comunicações > Outras comunicações' ou 'Administração > Envio de escrituras para Registro').
  - Confirmar em protocolo aberto em #/protocolo os nomes exatos da aba 'Dados do Ato' (passo 3) e do campo 'Complemento de Folha' (passo 4).
  - Confirmar o nome do botão de revalidação citado no passo 7 ('Revalidar Numerações').

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 3 | 3. Abra o protocolo correspondente em **Notas > Protocolo**, aba **Dados do Ato**. | 3. Abra o protocolo correspondente em **Notas > Consultas > Protocolos**, aba **Dados do Ato**. |

### D-3.60 — Cadastrar Livro para Consumo
- **Módulo:** `livros` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/livros/D-3.60-cadastrar-livro-para-consumo.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[ATT] D-3.60-cadastrar-livro-para-consumo/[ATT] D-3.60-cadastrar-livro-para-consumo-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.5, item 24: 'Administração > Controle de Livros'); menu-canonical.ts (evidência de que a única tela de gestão de livros na 06.05.02 é 'Administração > Controle de Livros'); orion-route-graph.json (#/livro: botão 'Adicionar', campos 'Número', 'Tipo livro'); route-synonyms.ts (#/livro/cadastrar: campo 'Tipo livro').
- **Justificativa:** O caminho de menu legado 'Notas > Cadastros > Livro para Consumo' tem único equivalente funcional de gestão e cadastro de livros na 06.05.02 em 'Administração > Controle de Livros' (#/livro), com o botão 'Adicionar' levando a #/livro/cadastrar (comprovado em orion-route-graph.json e route-synonyms.ts). Os campos específicos do formulário de cadastro nos passos 3 a 6 exigem confirmação ao vivo na tela #/livro/cadastrar.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar na tela #/livro/cadastrar os rótulos exatos equivalentes a 'Espécie de Livro' (route-synonyms.ts registra 'Tipo livro' em #/livro/cadastrar), 'Número do Livro', 'Folha Inicial', 'Capacidade Total de Folhas', 'Termo de Abertura' (passos 3 a 5).
  - Confirmar o nome exato do botão de conclusão e impressão do termo na tela #/livro/cadastrar (citado como 'Salvar e Imprimir Termo de Abertura' no passo 6).

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o menu **Notas > Cadastros > Livro para Consumo**. | 1. Acesse o menu **Administração > Controle de Livros**. |
| 2 | 2. Clique no botão **Adicionar Novo Livro**. | 2. Clique no botão **Adicionar**. |

### V-7.3.2 — Geração de Recibo, Lavratura do Ato e Tramitação de Selo Digital para o Livro
- **Módulo:** `livros` · **Tag:** `[XRX]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/livros/V-7.3.2-geracao-de-recibo-lavratura-do-ato-e-tramitacao-de.md`
- **Rascunho Auditado:** `auditoria/rotinas/livros/[XRX] V-7.3.2-geracao-de-recibo-lavratura-do-ato-e-tramitacao-de/[XRX] V-7.3.2-geracao-de-recibo-lavratura-do-ato-e-tramitacao-de-revisado.md`
- **Fonte da Prova:** arvore-menus-orion-tn.md (seção 4.3, item 9: 'Notas > Consultas > Protocolos'); auditoria-caminhos-menus.md ('Notas > Protocolo -> Notas > Consultas > Protocolos'); orion-route-graph.json (#/protocolo).
- **Justificativa:** O caminho de menu do passo 1 ('Notas > Protocolo') está comprovado na 06.05.02 como 'Notas > Consultas > Protocolos'. Os passos internos 2 a 7 (campo Livro, Folha Inicial, Folha Final, Mesmo do solicitante, Gerar Recibo e janelas de recibo/selo) dependem de um protocolo pré-existente aberto ([XRX]) e não constam no Raio-X nem no orion-route-graph.json.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com protocolo existente aberto em #/protocolo a ação 'Editar' na listagem (passo 1).
  - Confirmar no protocolo aberto os rótulos exatos dos passos 2 a 7: 'Livro', 'Folha Inicial', 'Folha Final', 'Tomador do Recibo', 'Mesmo do solicitante' e 'Gerar Recibo'.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. No dia agendado para o comparecimento das partes e assinatura do ato, acesse o protocolo em **Notas > Protocolo** e clique em **Editar**. | 1. No dia agendado para o comparecimento das partes e assinatura do ato, acesse o protocolo em **Notas > Consultas > Protocolos** e clique em **Editar**. |

### C-SELO-03 — Chaveamento Emergencial para Modo Offline (Contingência de Selos) por Queda do TJ
- **Módulo:** `selos` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/selos/C-SELO-03-chaveamento-emergencial-para-modo-offline-continge.md`
- **Rascunho Auditado:** `auditoria/rotinas/selos/[ATT] C-SELO-03-chaveamento-emergencial-para-modo-offline-continge/[ATT] C-SELO-03-chaveamento-emergencial-para-modo-offline-continge-revisado.md`
- **Fonte da Prova:** auditoria/src/menu-canonical.ts (EXPLICIT_MENU_EQUIVALENCES: 'Configurações > Parâmetros Gerais' -> 'Configurações > Parametrizações'); auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Configurações > Parametrizações', 'Configurações > Perfis e permissões de acesso'); auditoria/cache/orion-route-graph.json (#/configuracoes)
- **Justificativa:** O caminho raiz de parâmetros no passo 1 é comprovadamente 'Configurações > Parametrizações' (#/configuracoes), mas a tela #/seloDigital auditada por engano pela auto-cura não contém parâmetros de modo offline/contingência, e no Raio-X inicial de #/configuracoes não há aba literal 'Selo Digital' nem 'Integração TJ' (apenas 'Comunicações', entre 21 abas), nem confirmação dos controles internos dos passos 2–5 e 7.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos em qual aba de 'Configurações > Parametrizações' (#/configuracoes) — possivelmente 'Comunicações' — residem os parâmetros de modo de envio do selo digital (passos 2 e 3: 'Modo de Envio do Selo Digital', 'Online', 'Modo de Selagem Offline (Contingência)'), ou se o chaveamento foi removido.
  - Confirmar se o botão de gravação na tela é 'Concluir' (como em #/configuracoes) em vez de 'Salvar' (passo 4).
  - Confirmar em 'Configurações > Perfis e permissões de acesso' o nome exato da permissão correspondente a 'Módulo Selos > Alternar Contingência' (passo 5).
  - Confirmar onde fica e qual o rótulo real da ação 'Transmitir Lote de Contingência Acumulado' (passo 7; ex.: 'Comunicar' em 'Administração > Comunicações > Selo digital').

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Com login de administrador ou substituto, acesse no **Orion TN** o menu **Configurações > Parâmetros Gerais > Selo Digital** (ou aba **Integração TJ**). | 1. Com login de administrador ou substituto, acesse no **Orion TN** o menu **Configurações > Parametrizações**. |

### C-SELO-09 — Estorno e Reatribuição de Sequência de Selos Distribuídos Incorretamente
- **Módulo:** `selos` · **Tag:** `[ATT]` · **Carga:** `read_only`
- **KB Original:** `kb/rotinas/selos/C-SELO-09-estorno-e-reatribuicao-de-sequencia-de-selos-distr.md`
- **Rascunho Auditado:** `auditoria/rotinas/selos/[ATT] C-SELO-09-estorno-e-reatribuicao-de-sequencia-de-selos-distr/[ATT] C-SELO-09-estorno-e-reatribuicao-de-sequencia-de-selos-distr-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Administração > Controle de Estoque > Distribuição'); auditoria/src/menu-canonical.ts ('orion estoque' -> 'Administração > Controle de Estoque'); auditoria/cache/orion-route-graph.json (#/distribuicao: tabs ['Distribuição', 'Consulta'])
- **Justificativa:** O módulo legado 'Orion Estoque' e o caminho 'Distribuição > Histórico de Distribuição' equivalem comprovadamente a 'Administração > Controle de Estoque > Distribuição' (#/distribuicao), abas 'Consulta' e 'Distribuição'. Porém, #/distribuicao no orion-route-graph.json exibe apenas o botão 'Excluir' (sem registro na grade), havendo lacuna sobre o rótulo exato da ação de estorno na aba 'Consulta'.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos ou em tela populada da aba 'Consulta' de 'Administração > Controle de Estoque > Distribuição' (#/distribuicao) o rótulo exato do botão de estorno no passo 5 ('Estornar Distribuição', 'Estornar' ou 'Excluir').

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o módulo **Orion Estoque** com perfil de administrador. | 1. No **Orion TN**, acesse o menu **Administração > Controle de Estoque > Distribuição** com perfil de administrador. |
| 2 | 2. Navegue até **Distribuição > Histórico de Distribuição**. | 2. Acesse a aba **Consulta**. |
| 6 | 6. Acesse a tela de **Nova Distribuição**, selecione a sequência numérica rigorosamente correta e atribua novamente ao operador. | 6. Acesse a aba **Distribuição**, selecione a sequência numérica rigorosamente correta e atribua novamente ao operador. |

### C-SELO-10 — Desativação de Campos Obrigatórios de ITCMD em Recibos e Protocolos
- **Módulo:** `selos` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/selos/C-SELO-10-desativacao-de-campos-obrigatorios-de-itcmd-em-rec.md`
- **Rascunho Auditado:** `auditoria/rotinas/selos/[ATT] C-SELO-10-desativacao-de-campos-obrigatorios-de-itcmd-em-rec/[ATT] C-SELO-10-desativacao-de-campos-obrigatorios-de-itcmd-em-rec-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Configurações > Cadastros auxiliares > Natureza'); auditoria/src/menu-canonical.ts ('Configurações > Cadastros auxiliares > Natureza'); revPath auto_cura passo 1
- **Justificativa:** O passo 1 tem caminho 100% comprovado na 06.05.02 e na auto-cura ao vivo ('Configurações > Cadastros auxiliares > Natureza', #/natureza). Porém, o formulário interno de edição da natureza (passos 3–4) não consta no Raio-X, e o caminho do passo 5 ('Configurações > Parâmetros do Caixa > Emissão de Recibos') não existe na 06.05.02.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar no passo 2 que 'Compra e Venda Pura' / 'Procuração' são apenas exemplos pesquisáveis no campo 'Natureza' e clicar em 'Filtrar' na tela #/natureza.
  - Confirmar ao vivo na edição de uma natureza em #/natureza se existem a ação/ícone de edição, a aba 'Obrigações e Parâmetros Fiscais' e o checkbox 'Exigir Comprovante de ITCMD na Conclusão do Protocolo' (passos 3 e 4).
  - Confirmar com Produtos onde fica o equivalente de 'Configurações > Parâmetros do Caixa > Emissão de Recibos' (passo 5) dentro de 'Configurações > Parametrizações' (#/configuracoes; ex.: aba 'Protocolo' ou 'Faturamento') e confirmar o botão 'Concluir' no passo 6.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o menu **Configurações > Cadastros Auxiliares > Naturezas de Atos**. | 1. Acesse o menu **Configurações > Cadastros auxiliares > Natureza**. |

### D-2.7 — Cadastrar Produto
- **Módulo:** `selos` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/selos/D-2.7-cadastrar-produto.md`
- **Rascunho Auditado:** `auditoria/rotinas/selos/[ATT] D-2.7-cadastrar-produto/[ATT] D-2.7-cadastrar-produto-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Administração > Controle de Estoque > Cadastros > Produto'); auditoria/src/route-synonyms.ts (#/produto/cadastrar: 'Nome do Produto' -> 'Descrição'); auditoria/cache/curated-route-synonyms.json (#/produto/cadastrar: 'Salvar' -> 'Concluir'); revPath diagnostico_tela_att (#/produto/cadastrar)
- **Justificativa:** Os passos 1, 3, 4 e 6 têm correspondência 100% comprovada na 06.05.02, route-synonyms.ts, curated-route-synonyms.json e diagnostico_tela_att de #/produto/cadastrar. Contudo, o passo 5 cita 'Controlar por Sequência Numérica/Série' e 'Critério Padrão de Distribuição', que não constam literalmente no Raio-X de #/produto/cadastrar (onde aparecem 'Distribuição', 'Quantidade de atos', 'Código de barras', 'Prefixo', 'Cod. Referencia', 'Observações').
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos se no passo 5 'Critério Padrão de Distribuição' equivale ao campo select 'Distribuição' em #/produto/cadastrar e se 'Controlar por Sequência Numérica/Série' foi absorvido pelas opções da Categoria ('Utiliza sequência inicial e sequência final' / 'Utiliza série' em #/categoria/cadastrar) ou pelos campos 'Código de barras' e 'Prefixo'.

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o menu **Configurações > Cadastros Auxiliares > Produto**. | 1. Acesse o menu **Administração > Controle de Estoque > Cadastros > Produto**. |
| 3 | 3. Preencha o **Nome do Produto** (ex: Papel de Segurança A4 - Escrituras) e a **Categoria**. | 3. Preencha a **Descrição** (ex.: Papel de Segurança A4 - Escrituras) e selecione a **Categoria**. |
| 4 | 4. Selecione a **Unidade de Medida** (Folha, Unidade, Milhar) e informe o **Estoque Mínimo**. | 4. Selecione a **Unidade** (Folha, Unidade, Milhar) e informe o **Estoque mínimo**. |
| 6 | 6. Clique em **Salvar** para registrar o produto no catálogo da serventia. | 6. Clique em **Concluir** para registrar o produto no catálogo da serventia. |

### D-3.75 — Ativar Consumo Automático de Papel e Selos
- **Módulo:** `selos` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/selos/D-3.75-ativar-consumo-automatico-de-papel-e-selos.md`
- **Rascunho Auditado:** `auditoria/rotinas/selos/[ATT] D-3.75-ativar-consumo-automatico-de-papel-e-selos/[ATT] D-3.75-ativar-consumo-automatico-de-papel-e-selos-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Configurações > Parametrizações'); auditoria/cache/orion-route-graph.json (#/configuracoes: botões 'Concluir', 'Voltar'); revPath Motivo Técnico (21 abas/seções lidas ao vivo em #/configuracoes)
- **Justificativa:** O menu real do passo 1 é comprovadamente 'Configurações > Parametrizações' (#/configuracoes) e o botão de gravação (passo 6) é 'Concluir'. Contudo, não existe aba/seção chamada 'Consumo de Insumos' entre as 21 lidas em #/configuracoes, exigindo confirmação de qual aba abriga os parâmetros dos passos 2 a 5.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos em qual aba de 'Configurações > Parametrizações' (#/configuracoes) — ex.: 'Produtos Orion', 'Geral', 'Protocolo' ou 'Certidão' — ficam as opções dos passos 2 a 5 ('Ativar Consumo Automático de Papel de Segurança', 'Ativar Consumo Automático de Selos Digitais / Físicos', 'Ao Converter em Livro Definitivo', 'Ao Concluir Pedido' e 'Bloquear Impressão caso o Estoque do Usuário esteja Zerado').

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o menu **Configurações > Parametrizações > Consumo de Insumos**. | 1. Acesse o menu **Configurações > Parametrizações**. |
| 6 | 6. Clique em **Salvar Alterações** para aplicar a regra em toda a rede do cartório. | 6. Clique em **Concluir** para aplicar a regra em toda a rede do cartório. |

### M-16.1 — Parametrizações Gerais do Sistema
- **Módulo:** `selos` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/selos/M-16.1-parametrizacoes-gerais-do-sistema.md`
- **Rascunho Auditado:** `auditoria/rotinas/selos/[ATT] M-16.1-parametrizacoes-gerais-do-sistema/[ATT] M-16.1-parametrizacoes-gerais-do-sistema-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Configurações > Parametrizações'); auditoria/src/menu-canonical.ts ('Administração > Parâmetros' -> 'Configurações > Parametrizações'); auditoria/src/route-synonyms.ts (#/configuracoes: 'Parâmetros gerais' -> 'Geral'); revPath diagnostico_tela_att (#/configuracoes)
- **Justificativa:** O caminho do passo 1 ('Configurações > Parametrizações'), a aba 'Geral' (passo 2), as seções 'Cálculo de custas' e 'Controle de guia' e o botão 'Concluir' (passo 6) estão comprovados em #/configuracoes. Todavia, 'Papel de Segurança (NFS)' (passo 2) e a seção 'Selo Digital' com 'Online'/'Offline' (passo 3) não aparecem na aba 'Geral' nem nas abas inspecionadas no Raio-X.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar com Produtos se a exigência de 'Papel de Segurança (NFS)' na aba 'Geral' corresponde ao campo 'Produto' (visível no Raio-X) ou se foi movida para a aba 'Produtos Orion'.
  - Confirmar em qual aba de 'Configurações > Parametrizações' fica a configuração de modo 'Online'/'Offline' do 'Selo Digital' (passo 3, possivelmente aba 'Comunicações').
  - Confirmar os rótulos exatos dos passos 4 e 5 na aba 'Geral' ('Cálculo de custas': 'Para menos', 'Para mais', 'Truncado'; e 'Controle de guia': 'Contábil', 'Diário', 'Semanal', 'Mensal', 'Zera anualmente').

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o menu **Administração > Parâmetros > Parâmetros gerais**. | 1. Acesse o menu **Configurações > Parametrizações**. |
| 6 | 6. Clique no botão **Salvar** para aplicar as diretrizes globais do cartório. | 6. Clique no botão **Concluir** para aplicar as diretrizes globais do cartório. |

### V-2.0 — Como Realizar a Aquisição de Produtos (Entrada no Estoque)
- **Módulo:** `selos` · **Tag:** `[ATT]` · **Carga:** `mutation`
- **KB Original:** `kb/rotinas/selos/V-2.0-como-realizar-a-aquisicao-de-produtos-entrada-no-e.md`
- **Rascunho Auditado:** `auditoria/rotinas/selos/[ATT] V-2.0-como-realizar-a-aquisicao-de-produtos-entrada-no-e/[ATT] V-2.0-como-realizar-a-aquisicao-de-produtos-entrada-no-e-revisado.md`
- **Fonte da Prova:** auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Administração > Controle de Estoque > Aquisição'); auditoria/src/menu-canonical.ts ('orion estoque' -> 'Administração > Controle de Estoque'); auditoria/cache/orion-route-graph.json (#/aquisicao: buttons ['Filtrar', 'Limpar', 'Adicionar', 'Voltar'])
- **Justificativa:** Os passos 1 e 2 têm destino 100% comprovado na 06.05.02 e no orion-route-graph.json ('Administração > Controle de Estoque > Aquisição', #/aquisicao, com botão 'Adicionar' para iniciar uma nova aquisição). Porém, os campos e botões do formulário interno de cadastro da aquisição (passos 3 a 10) não constam no Raio-X nem no orion-route-graph.json.
- **Dúvidas / Lacunas Internas Restantes:**
  - Confirmar ao vivo, após clicar em 'Adicionar' em 'Administração > Controle de Estoque > Aquisição' (#/aquisicao), os rótulos exatos do formulário nos passos 3 a 10 ('Data de aquisição', 'Categoria', 'Produto', 'Série', 'Sequência inicial', 'Sequência final', 'Quantidade (Qtd)', 'Valor Unitário', '+', '-' e 'Concluir').

| Passo | Texto Original (`kb/`) | Navegação / Trecho Comprovado Proposto |
|---:|---|---|
| 1 | 1. Acesse o módulo **Orion Stock**. | 1. No **Orion TN**, acesse o menu **Administração > Controle de Estoque**. |
| 2 | 2. Navegue até o menu **Administração > Aquisição**. | 2. Acesse **Aquisição** (caminho completo **Administração > Controle de Estoque > Aquisição**) e clique no botão **Adicionar**. |

---

## 4. Categoria C — Defasagem Real / Recurso Removido, Externo ou Hardware/Ambiente (54 rotinas)

Rotinas mantidas intactas para revisão humana (funcionalidade ausente dos 115 caminhos da `06.05.02`, procedimento externo ou dependência de hardware/ambiente `[DDD]`/`[CCC]`).

| ID | Módulo | Tag | Carga | Justificativa Factual |
|---|---|---|---|---|
| C-ACESSO-02 | `acesso` | `[ATT]` | `mutation` | O caminho Configurações > Usuários já é exato na 06.05.02, porém o Raio-X de #/usuario/alterar/1 comprova que não existem a caixa Ativo (Inativo / Bloqueado), a aba Sessões Ativas / Conexões, o botão Derrubar Sessões Conectadas nem a aba Observações. |
| C-ACESSO-03 | `acesso` | `[ATT]` | `mutation` | Na 06.05.02, a tela Alteração de usuário (#/usuario/alterar/1) não possui aba Geral, Redefinir Senha Manualmente, Exigir troca no próximo logon, aba Segurança / Autenticação nem Resetar 2FA; Alterar senha e Autenticação em dois fatores ficam apenas no menu pessoal Olá, [usuário] (troca própria com Senha atual). |
| C-ACESSO-04 | `acesso` | `[ATT]` | `mutation` | Não existe campo Senha na tela #/usuario/alterar/1 (a troca de senha fica em Olá, [usuário] > Alterar senha), e o menu Atendimento > Configurações do SGA > Operadores de Guichê e atalho Chamar Senha pertencem a módulo externo ausente da 06.05.02. |
| C-ACESSO-05 | `acesso` | `[DDD]` | `unknown` | Rotina de infraestrutura/hardware ([DDD]) executada fora do Orion TN (servidor Windows, Docker Desktop/PowerShell e módulo externo SGA). |
| C-ACESSO-08 | `acesso` | `[ATT]` | `mutation` | Embora Configurações > Usuários exista e Cargo corresponda a Cargo / Função, o Raio-X de #/usuario/alterar/1 comprova inexistência da aba Parâmetros Notariais, da caixa Autorizado a Lavrar Escrituras, Procurações e Atas e do campo Referência de Homologação / Portaria Corregedoria, e a 06.05.02 não possui Habilitação de Operadores em Administração > Controle de Estoque. |
| V-3.4.6 | `acesso` | `[ATT]` | `read_only` | Os passos 1–3 não citam caminho de menu nem há destino único na 06.05.02 (Fila C2), permanecendo o Raio-X em #/inicio sem comprovação da aba Custas, da flag Assinaturas Pendentes, do botão Gerar Recibo nem do procedimento de Estorno de Recolhimento dentro do protocolo. |
| V-7.5.3 | `acesso` | `[ATT]` | `mutation` | Os passos 1–3 não citam caminho de menu nem há destino único na 06.05.02 (Fila C2), e o Raio-X permaneceu em #/inicio sem comprovação de Canetinha, Impressão Definitiva, modal de credenciais de supervisor ou alteração de status Impresso para Editando. |
| C-CENTRAL-07 | `centrais` | `[DDD]` | `read_only` | Rotina dependente de ambiente/hardware local ([DDD]): passos 1–5 e observação final ocorrem no Windows/bandeja do sistema com o executável local Integrador.exe (C:\Siplan\Integrador\Integrador.exe), e o caminho citado no passo 6 (Administração > Comunicações > DOI) não existe na árvore canônica 06.05.02. |
| C-CENTRAL-13 | `centrais` | `[ATT]` | `read_only` | O menu Administração > Comunicações > SIRC / Comunicações Previdenciárias (passo 2) não existe em nenhum dos 115 caminhos da 06.05.02 (o submenu Administração > Comunicações contém apenas COAF, Outras comunicações, Auditoria de Selos, Selo digital, RPS, Recolhimento e Auditoria de RPS), e o orion-route-graph.json não possui os botões Compilar Registros de Óbito de Inventários nem Transmitir / Exportar para o SIRC. |
| C-CENTRAL-14 | `centrais` | `[ATT]` | `read_only` | Os passos 1–3 não citam caminho de menu e a aba Integração Externa / ONR - SAEC (passo 2), bem como os botões Transmitir Escritura para o ONR (passo 5) e Consultar Andamento no SAEC (passo 7), não existem em nenhuma tela mapeada da 06.05.02 nem em #/escritura (Administração > Envio de escrituras para Registro) ou #/dashboard/envioRegistro no orion-route-graph.json. |
| M-32.0 | `centrais` | `[ATT]` | `mutation` | Nenhum dos caminhos citados no passo 1 (Administração > Comunicações > Lotes de comunicação e Firmas > Comunicações > Lotes SEFAZ) existe na árvore 06.05.02, não há equivalência comprovada em menu-canonical.ts e o candidato próximo Administração > Comunicações > Outras comunicações (#/comunicacoes) não comprova os campos Destino/SEFAZ/Período de envio nem as ações Visualizar logs, Itens do lote e Estornar lote. |
| R-32.1 | `centrais` | `[DDD]` | `read_only` | Rotina dependente de ambiente/hardware local ([DDD]): envolve exclusivamente a verificação/execução do aplicativo Integrador Local na barra de tarefas do Windows, leitura de certificado digital A3 e atualização da página do navegador (F5), sem navegação em menus do Orion TN. |
| C-CERT-04 | `certidoes` | `[ATT]` | `read_only` | Procedimento 100% externo ao Orion TN, executado na janela nativa de impressão do navegador Google Chrome (Ctrl + P > Mais Definições > Cabeçalhos e Rodapés). |
| C-CERT-05 | `certidoes` | `[ATT]` | `read_only` | Os passos 1–7 executam procedimento externo no navegador Chrome/Edge (recarregamento forçado e Limpar Dados de Navegação); apenas o passo 8 de verificação final menciona o menu legado Certidões > Novo Pedido de Certidão (atual Notas > Nova certidão e serviço). |
| D-3.29 | `certidoes` | `[ATT]` | `mutation` | Os passos 1–3 não citam caminho de menu único (Fila C2) e o Raio-X parou em #/inicio; no orion-route-graph.json, #/protocolo/cadastrar não possui card Certidões Solicitadas, Nova Requisição de Certidão nem Incorporar Custas ao Protocolo Principal, enquanto Administração > Certidões solicitadas (#/certidoesSolicitadas) é apenas tela de consulta. |
| M-54.2 | `certidoes` | `[ATT]` | `mutation` | Os passos 1–3 não citam caminho de menu (Fila C2), o Raio-X parou em #/inicio e o orion-route-graph.json não registra card Busca, botão Buscar Ato nem botão Salvar em #/certidoesServicos/cadastrar. |
| M-54.3 | `certidoes` | `[ATT]` | `mutation` | Os passos 1–3 não citam caminho de menu (Fila C2), o Raio-X parou em #/inicio e o orion-route-graph.json não comprova o card Custas nem os botões Adicionar Item, Salvar e Gerar recibo em #/certidoesServicos/cadastrar. |
| V-6.2.3 | `certidoes` | `[ATT]` | `read_only` | O caminho Notas > Protocolos em aberto já é exato, mas o Raio-X e o orion-route-graph.json de #/protocolo/aberto comprovam que a tela não possui o botão Filtrar nem os campos de pesquisa rápida descritos (filtros de busca ficam em Notas > Consultas > Protocolos ou Índice de escrituras e procurações). |
| C-CONFIG-01 | `config` | `[DDD]` | `unknown` | Procedimento externo no Windows (instalação de arquivo .pfx no Repositório Pessoal) com dependência de certificado real e senha privada ([DDD]); os caminhos citados para o Orion TN ('Configurações > Certificados Digitais / Assinador' e 'Comunicações > Parâmetros de Integração') não existem nos 115 caminhos da árvore 06.05.02. |
| C-CONFIG-02 | `config` | `[DDD]` | `unknown` | Rotina [DDD] dependente de hardware periférico físico (botão Feed e sensor ótico de impressora térmica Zebra/Argox/Elgin) e procedimento externo no Windows (Painel de Controle > Dispositivos e Impressoras), sem telas específicas do Orion TN 06.05.02. |
| C-CONFIG-03 | `config` | `[DDD]` | `unknown` | Rotina [DDD] dependente de hardware periférico (impressora térmica e medição física com régua); além disso, o caminho 'Configurações > Impressão de Etiquetas' é classificado como no_equivalent na 06.05.02 (sem destino único entre 'Etiquetas diversas' e 'Configuração de impressão') e não há comprovação dos campos de deslocamento X/Y. |
| C-CONFIG-04 | `config` | `[DDD]` | `unknown` | Procedimento externo no Windows (services.msc, Spooler de Impressão e Painel de Controle) com dependência de hardware/ambiente ([DDD]); o menu 'Configurações > Configurações do Caixa / Recibos' citado no passo 5 não existe nos 115 caminhos da árvore 06.05.02. |
| C-CONFIG-05 | `config` | `[DDD]` | `unknown` | Rotina [DDD] dependente de hardware físico (scanner USB) e instalação externa no Windows (driver TWAIN e DocuViewareServiceSetup.msi); além disso, o caminho 'Balcão de Firmas > Configurações de Captura e Imagens' não existe na árvore 06.05.02. |
| C-CONFIG-06 | `config` | `[DDD]` | `unknown` | Rotina [DDD] dependente de hardware físico (cabo USB de scanner) e procedimentos no Windows (Gerenciador de Tarefas e Opções de Energia > Suspensão seletiva USB); o caminho 'Balcão de Firmas (ou Livros) > Configurações de Captura' não existe na árvore 06.05.02. |
| C-CONFIG-07 | `config` | `[DDD]` | `unknown` | Procedimento externo de sistema operacional e banco de dados ([DDD]): o manual original descreve finalização de executáveis desktop legados (OrionTN.exe) e limpeza de %temp% no Windows, enquanto o roteiro técnico trata de encerramento de locks no PostgreSQL (pgAdmin/psql), sem telas do Orion TN 06.05.02. |
| C-CONFIG-08 | `config` | `[DDD]` | `unknown` | Procedimento externo de infraestrutura no Windows ([DDD]) envolvendo instalação de Visual C++ Redistributable, driver ODBC PostgreSQL via odbcad32.exe, edição de siplan.ini e atalho de cliente desktop legado (OrionTN.exe), sem interface web 06.05.02. |
| M-32.2 | `config` | `[ATT]` | `mutation` | O caminho "Administração > Parâmetros > Certificados digitais" não existe em nenhum dos 115 caminhos da 06.05.02. A tela equivalente "Configurações > Parametrizações" (#/configuracoes) não possui a aba "Certificados digitais" e não há tela de CRUD com botões "Adicionar", "Selecionar arquivo" ou "Validar / Testar Certificado" (na aba Comunicações existem apenas os campos "Tipo de certificado", "Caminho certificado A1" e "Senha", além de links para módulos externos). |
| M-34.0 | `config` | `[ATT]` | `read_only` | Os caminhos "Notas > Cadastros auxiliares > Tipos de anexo" e "Administração > Cadastros auxiliares > Tipos de anexo" não existem na versão 06.05.02, e nenhum item equivalente a "Tipos de anexo" consta entre os 115 caminhos finais da árvore canônica (inclusive sob "Configurações > Cadastros auxiliares"). |
| M-35.0 | `config` | `[ATT]` | `mutation` | O caminho "Notas > Cadastros auxiliares > Tipos de anexo" não existe na versão 06.05.02, e nenhum item equivalente a "Tipos de anexo" consta entre os 115 caminhos finais da árvore canônica (inclusive sob "Configurações > Cadastros auxiliares"). |
| C-FIRMA-01 | `firmas` | `[DDD]` | `read_only` | Rotina [DDD] dependente de hardware físico (leitor biométrico Futronic/SecuGen via USB e webcam) e serviço local Windows (IntegradorSPCM.exe); além disso, o caminho 'Configurações > Periféricos de Balcão' (passo 5) e as abas 'Biometria' e 'Câmera' (passos 6–7) não constam na árvore canônica 06.05.02 nem em orion-route-graph.json. |
| C-FIRMA-05 | `firmas` | `[ATT]` | `mutation` | O caminho 'Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)' não existe nos 115 caminhos da árvore 06.05.02 (Fila C1, no_equivalent). Embora exista o botão 'Termo' em 'Firmas > Reconhecimento de firmas' (#/pedidoFirmas/cadastrar) e o cadastro auxiliar 'Firmas > Cadastros > Tipo de documento - Termo de comparecimento' (#/tipoTermo), não há comprovação em nenhuma fonte sobre os campos 'Proprietário / Vendedor', 'Assinado por Representante / Procurador' ou dados de procuração citados nos passos 2–7. |
| C-FIRMA-06 | `firmas` | `[ATT]` | `mutation` | A equivalência 'Configurações > Parâmetros de NFS-e > Regras de Balcão' -> 'Configurações > Parametrizações' (#/configuracoes) foi descartada na Camada 4 (ADR-037) porque a tela real não contém 'Tomador Padrão para Atos Não Identificados', 'Consumidor Final / Não Identificado' nem 'Classificação Tributária / CST'; além disso, 'Orion Caixa > Notas Fiscais > Listagem de RPS' e o botão 'Reprocessar Lote de Firmas' (passos 5–6) não existem na 06.05.02 nem em #/comunicacaoRps. |
| C-FIRMA-07 | `firmas` | `[ATT]` | `mutation` | A equivalência 'Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas' -> 'Configurações > Parametrizações' (#/configuracoes) foi descartada na Camada 4 (ADR-037) porque a tela real não contém 'Materialização de Documento Eletrônico', 'Valor dos Emolumentos' nem 'Gravar Parâmetros' (passos 2–5). Nenhum dos itens citados consta em #/configuracoes ou nas telas de Tabela de custas em orion-route-graph.json. |
| C-FIRMA-08 | `firmas` | `[ATT]` | `mutation` | A equivalência 'Configurações > Parâmetros Gerais > Armazenamento e GED' -> 'Configurações > Parametrizações' (#/configuracoes) foi descartada na Camada 4 (ADR-037) porque a tela real não contém 'Caminho das Imagens do Balcão de Firmas / Assinaturas', 'Testar Leitura de Diretório' nem 'Gravar' (passos 3–6). |
| M-51.3 | `firmas` | `[ATT]` | `mutation` | Os passos 1–3 não citam caminho de menu e o título não aponta destino único na árvore 06.05.02 (Fila C2, no_equivalent: há múltiplas telas de protocolo em Notas, como 'Notas > Novo protocolo', 'Notas > Protocolos em aberto' e 'Notas > Consultas > Protocolos'). Além disso, nenhum dos elementos citados ('Qualificação de Partes', 'Adicionar Parte', 'Participação', 'Representado por Procurador', 'Consultar Indisponibilidade', 'Salvar') consta em orion-route-graph.json para #/protocolo/cadastrar ou #/protocolo. |
| M-9.1 | `firmas` | `[DDD]` | `mutation` | Rotina [DDD] dedicada exclusivamente à captura multimídia e biométrica com periféricos externos (webcam, leitor biométrico e scanner de mesa), fora do escopo de verificação puramente em tela. |
| V-3.1.3 | `firmas` | `[ATT]` | `read_only` | O passo 1 não informa caminho de menu ("Na tela do protocolo", família com 7 caminhos em 06.05.02 e classificada na Fila C2 como tela pressuposta sem destino único) e o elemento Gerar Recibo não consta no orion-route-graph.json de Notas > Novo protocolo (#/protocolo/cadastrar) nem de Notas > Consultas > Protocolos (#/protocolo), exigindo validação de Produtos sobre onde a função reside. |
| V-CCA.1.3 | `firmas` | `[DDD]` | `mutation` | Rotina [DDD] dedicada exclusivamente à captura de foto facial via webcam, coleta biométrica em leitor digital e digitalização via scanner TWAIN/webcam, dependente de hardware externo. |
| C-LIVRO-04 | `livros` | `[ATT]` | `read_only` | Procedimento externo de infraestrutura em servidor Windows/Docker (PowerShell, Docker Desktop, comandos 'docker restart' e 'docker ps'), fora da interface web do Orion TN (06.05.02). |
| C-LIVRO-07 | `livros` | `[ATT]` | `mutation` | O caminho 'Orion Estoque > Livros Notariais > Controle de Folhas Soltas' não existe na 06.05.02 (o submenu 'Administração > Controle de Estoque' contém apenas Aquisição, Distribuição, Consumo manual, Consultas e Cadastros), e nenhum dos recursos descritos ('Auditoria de Sequência', 'Baixa por Avaria Mecânica', 'Próxima Folha a Alimentar', 'Gravar e Sincronizar Contador') consta no orion-route-graph.json ou na 06.05.02. |
| C-LIVRO-08 | `livros` | `[ATT]` | `mutation` | Rotina referente a módulos externos ao Orion TN web ('Orion Caixa' e 'LCW - Livro Caixa Web'), e o caminho 'Administração > Rotinas Especiais > Consolidação de Movimentações' não existe em nenhum dos 115 caminhos da 06.05.02. |
| D-3.16 | `livros` | `[ATT]` | `mutation` | Os passos 1 a 3 não citam caminho de menu (pressupõem estar em um pedido de certidão ativo), e os comandos citados ('Gerar no Editor', 'Inserir Selo Digital', 'Imprimir Definitivo', 'Salvar e Concluir') não têm correspondência comprovada na 06.05.02, no orion-route-graph.json nem no diagnostico_tela_att. |
| D-3.27 | `livros` | `[ATT]` | `mutation` | Os passos 1 a 3 não citam caminho de menu (pressupõem estar no editor da minuta), e nenhum dos comandos citados ('Gerar Livro Definitivo', 'Revalidar Consulta CENIB', 'Executar Nova Consulta em Lote', 'Confirmar e Gerar Livro') consta na 06.05.02, no orion-route-graph.json ou no diagnostico_tela_att. |
| D-3.41 | `livros` | `[ATT]` | `mutation` | Os passos 1 a 3 não citam caminho de menu, e o candidato inferido pela Camada 3 ('Notas > Consultas > Editor', #/protocolo/consultaTexto) é apenas a tela de consulta de protocolos do editor, não contendo os comandos citados ('Gerar Livro Definitivo', 'Livro de Notas Ativo', 'CENIB', 'Confirmar e Gerar Livro'). |
| M-29.1 | `livros` | `[ATT]` | `mutation` | O caminho 'Firmas > Consultas > Termos de comparecimento' não existe na 06.05.02 (Firmas > Consultas contém apenas 'Reconhecimentos de firmas' e 'Serviços praticados'), e a tela de gerenciamento com as ações 'Reimprimir', 'Digitalizar / Anexar', 'Inutilizar Termo' e 'Reutilizar Folha do Livro' não consta em nenhum dos 115 caminhos nem no orion-route-graph.json. |
| V-7.0.4 | `livros` | `[ATT]` | `read_only` | Os passos 1 a 3 não citam caminho de menu (pressupõem retorno ao card do editor de texto dentro de um protocolo aberto), e nenhum dos elementos citados ('Prévia do Livro', 'Gerar Livro Oficial', 'Gerar Livro', 'Margem espelho', 'Central de Indisponibilidade', 'Lupa', 'Consulta CNIB') consta na 06.05.02, no orion-route-graph.json ou no diagnostico_tela_att. |
| V-7.2.1 | `livros` | `[ATT]` | `read_only` | O passo 1 pressupõe estar na aba 'Editor' dentro de um protocolo aberto (sem caminho de menu); a tela 'Notas > Consultas > Editor' (#/protocolo/consultaTexto) é apenas filtro de consulta e não contém 'Prévia do Livro', 'Prévia de Traslado' ou 'Baixar Prévia em PDF', que também não constam no orion-route-graph.json. |
| V-7.4.2 | `livros` | `[ATT]` | `mutation` | O passo 1 não cita caminho de menu (pressupõe a aba 'Editor' dentro de um protocolo aberto), e os elementos citados ('Canetinha', 'Central de Indisponibilidade', 'Inserir', 'Lupa', 'Consulta CNIB', 'Olho', 'Abrir Detalhe do Texto', 'Concluir') não constam na 06.05.02, no orion-route-graph.json nem no diagnostico_tela_att. |
| C-SELO-01 | `selos` | `[ATT]` | `read_only` | O caminho documentado 'Módulos > Selo Digital > Auditoria / Conferência Semanal' não existe na árvore 06.05.02, e a Camada 4 descartou a equivalência para 'Administração > Comunicações > Auditoria de Selos' (#/auditoriaSelos) porque a tela real não possui as grades/botões descritos nos passos 3 a 5 ('Selos com Envio Pendente', 'Aguardando Retorno', 'Transmitir Fila de Selos Pendentes' e 'Exportar Arquivo de Remessa Manual'), além de o passo 6 ocorrer em portal externo do TJSP. |
| C-SELO-04 | `selos` | `[ATT]` | `read_only` | Rotina majoritariamente de infraestrutura externa em servidor Linux/Windows (SSH/RDP, diretórios '/etc/siplan/certificados/' e 'C:\Siplan\Certificados\', 'chmod 644', serviço daemon 'orionselos' via 'systemctl restart orionselos'), e o caminho do passo 5 ('Configurações > Parâmetros de Integração > Certificado Digital') bem como o botão 'Testar Conexão' (passo 6) não constam na árvore 06.05.02 nem nas 21 abas lidas ao vivo em 'Configurações > Parametrizações' (#/configuracoes). |
| C-SELO-08 | `selos` | `[DDD]` | `read_only` | Rotina dependente de hardware físico e ambiente local ([DDD]: token A3 USB/leitora de cartão, Gerenciador de Certificados SafeNet/SafeSign e serviço local Assinador Orion na bandeja do Windows), além de o passo 5 citar caminho inexistente na 06.05.02 ('Módulos > Selo Digital > Transmissão de Lote'). |
| D-3.6 | `selos` | `[DDD]` | `mutation` | Rotina dependente de hardware físico ([DDD]: scanner com alimentador automático e leitura óptica de código de barras em papel físico). Ademais, o subnível 'Por Código de Barras do Papel' não existe na 06.05.02 (o menu para digitalização em lote termina em 'Firmas > Cadastros > Digitalização em lote'). |
| R-1.4 | `selos` | `[ATT]` | `read_only` | Não corresponde a nenhum dos 115 caminhos finais da 06.05.02 (Fila C2). Na barra superior da 06.05.02 há 8 ícones utilitários à direita de 'Configurações' (câmera fotográfica, QR Code verde, ícone adicional, sino de 'Notificações', robô, calendário, megafone e grade 3×3), sem identificação comprovada de atalhos chamados 'Barra Superior', 'Selo Digital' ou 'Siplan SGA' (o acesso ao Selo digital ocorre via 'Administração > Comunicações > Selo digital'). |
| R-1.6 | `selos` | `[ATT]` | `read_only` | Os módulos e menus superiores citados nos passos 1 a 4 ('Stock (Estoque)', 'Caixa' e 'GED' como módulos independentes em guias separadas) foram descontinuados como menus principais na barra superior da versão 06.05.02 (que possui apenas 'Dashboard', 'Firmas', 'Notas', 'Relatórios', 'Administração', 'Históricos' e 'Configurações'); apenas o controle de estoque foi incorporado em 'Administração > Controle de Estoque'. |

---

## 5. Categoria D — Dependência Cruzada `[XRX]` (20 rotinas: 14 com ajuste mínimo de grafia, 6 já coerentes)

Rotinas bloqueadas exclusivamente por pré-requisito de dados/massa em outra rotina (`[XRX]`). As que possuem `ajuste_grafia: true` constam na fila opcional de captura de prints após aplicação do ajuste de grafia.

| ID | Módulo | Tag | Ajuste de Grafia | Comparativo / Situação |
|---|---|---|---|---|
| C-CENTRAL-01 | `centrais` | `[XRX]` | Não | Bloqueio [XRX] (Dependência Cruzada de Rotina) no passo 2 devido à grade vazia em #/comunicacaoCoaf (sem comunicações geradas; pré-requisito M-61.0). O caminho de menu do passo 1 (Administração > Comunicações > COAF) já está 100% aderente ao catálogo 06.05.02. |
| C-CENTRAL-05 | `centrais` | `[XRX]` | Sim | P1: Abra o protocolo da procuração no menu **Notas > Protocolo**. → Abra o protocolo da procuração no menu **Notas > Consultas > Protocolos**. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.3, item 9: Notas > Consultas > Protocolos) + auditoria/reports/auditoria-caminhos-menus.md (linha 227: Notas > Protocolo -> Notas > Consultas > Protocolos).) |
| C-CENTRAL-06 | `centrais` | `[XRX]` | Sim | P1: No **Orion TN**, abra o protocolo da escritura através de **Notas > Protocolo**. → No **Orion TN**, abra o protocolo da escritura através de **Notas > Consultas > Protocolos**. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.3, item 9: Notas > Consultas > Protocolos) + auditoria/reports/auditoria-caminhos-menus.md (linha 227: Notas > Protocolo -> Notas > Consultas > Protocolos).) |
| C-CENTRAL-10 | `centrais` | `[XRX]` | Não | Bloqueio [XRX] (Dependência Cruzada de Rotina) no passo 2 devido à grade vazia em #/comunicacaoCoaf (pré-requisito M-61.0). O caminho de menu do passo 1 (Administração > Comunicações > COAF) já está 100% aderente ao catálogo 06.05.02. |
| C-CENTRAL-11 | `centrais` | `[XRX]` | Sim | P1: Abra o protocolo da escritura de rerratificação no menu **Notas > Protocolo**. → Abra o protocolo da escritura de rerratificação no menu **Notas > Consultas > Protocolos**. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.3, item 9: Notas > Consultas > Protocolos) + auditoria/reports/auditoria-caminhos-menus.md (linha 227: Notas > Protocolo -> Notas > Consultas > Protocolos).) |
| C-CENTRAL-12 | `centrais` | `[CCC][XRX]` | Sim | P6: Com o número em mãos, abra o protocolo no **Orion TN** em **Notas > Protocolo**. → Com o número em mãos, abra o protocolo no **Orion TN** em **Notas > Consultas > Protocolos**. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.3, item 9: Notas > Consultas > Protocolos) + auditoria/reports/auditoria-caminhos-menus.md (linha 227: Notas > Protocolo -> Notas > Consultas > Protocolos).) |
| D-9.0 | `certidoes` | `[XRX]` | Sim | P1: No menu principal do Orion TN, acesse **Notas > Consultas > Consulta de Certidões e Serviços**. → No menu principal do Orion TN, acesse **Notas** > **Consultas** > **Certidões e serviços**. (arvore-menus-orion-tn.md (4.3 #11: Notas > Consultas > Certidões e serviços); revPath auto_cura passo 1 (Notas > Consultas > Consulta de Certidões e Serviços -> Notas > Consultas > Certidões e serviços)) |
| V-CCA.2.2 | `firmas` | `[XRX]` | Sim | P1: Acesse **Firmas > Cadastros > Cartão de Assinatura** e realize o filtro do registro desejado. → Acesse **Firmas > Cadastros > Cartão de assinatura** e realize o filtro do registro desejado. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Cartão de assinatura); [XRX] V-CCA.2.2-consulta-rapida-de-anexos-historico-de-andamentos--revisado.md) |
| V-CCA.2.3 | `firmas` | `[XRX]` | Sim | P1: Acesse **Firmas > Cadastros > Cartão de Assinatura**, filtre o registro e clique no ícone da **Caneta** (**Alteração**). → Acesse **Firmas > Cadastros > Cartão de assinatura**, filtre o registro e clique no ícone da **Caneta** (**Alteração**). (auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Cartão de assinatura); [XRX] V-CCA.2.3-edicao-com-liberacao-de-supervisor-e-gestao-de-pap-revisado.md; diagnostico_tela_att de #/ficha/cadastrar em V-CCA.1.1-revisado.md (botões Consumir e Concluir)) |
| V-CCA.3.1 | `firmas` | `[XRX]` | Sim | P1: Acesse **Firmas > Cadastros > Cartão de Assinatura** e abra a ficha desejada pelo ícone da **Caneta** (**Alteração**) ou realize um novo cadastro. → Acesse **Firmas > Cadastros > Cartão de assinatura** e abra a ficha desejada pelo ícone da **Caneta** (**Alteração**) ou realize um novo cadastro. ; P2: Identifique o fluxo de geração de **Selo Digital** configurado na sua serventia: → Identifique o fluxo de geração de **Selo digital** configurado na sua serventia: (auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Cartão de assinatura); auto_cura passo 2 (Selo Digital -> Selo digital) em [XRX] V-CCA.3.1-geracao-e-gerenciamento-de-selo-digital-automatico-revisado.md) |
| V-CCA.3.2 | `firmas` | `[XRX]` | Sim | P1: Acesse **Firmas > Cadastros > Cartão de Assinatura**. → Acesse **Firmas > Cadastros > Cartão de assinatura**. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md (seção 4.2: Firmas > Cadastros > Cartão de assinatura); [XRX] V-CCA.3.2-impressao-da-ficha-do-cartao-de-assinatura-e-desti-revisado.md) |
| R-30.0 | `livros` | `[XRX]` | Sim | P2: 2. No campo **Número do Livro**, informe o livro desejado e clique no ícone do **Livro Pequeno** para carregar suas informações detalhadas. → 2. No campo **Número**, informe o livro desejado e clique no ícone do **Livro Pequeno** para carregar suas informações detalhadas. (arvore-menus-orion-tn.md (seção 4.5, item 24: 'Administração > Controle de Livros'); orion-route-graph.json (#/livro: campo 'Número'); revisado R-30.0 (passo 1 validado; auto_cura passo 2: 'Número do Livro' -> 'Número'; bloqueio [XRX] no passo 3 por grade vazia em #/livro).) |
| C-SELO-02 | `selos` | `[XRX]` | Não | Bloqueio [XRX] por dependência cruzada de um protocolo pré-existente (D-3.19, D-3.23, D-3.22) para exibir a aba 'Custas / Selos'. Os passos não citam caminho de menu da árvore 06.05.02 com deriva de grafia (a sugestão de Camada 3 para #/seloDigital em auditoria-caminhos-menus.md possui ressalva e não corresponde ao contexto de protocolo aberto). |
| C-SELO-05 | `selos` | `[XRX]` | Não | Bloqueio [XRX] por dependência cruzada de protocolo pré-existente (D-3.19, D-3.23, D-3.22) para exibir a aba 'Custas / Selos' no passo 2. O passo 1 apenas instrui localizar o protocolo no menu 'Notas' sem citar um caminho composto com erro de grafia/caixa. |
| C-SELO-06 | `selos` | `[XRX]` | Não | Bloqueio [XRX] por dependência cruzada de protocolo pré-existente (D-3.19, D-3.23, D-3.22) para exibir a ação 'Retificação de Selo Digital' no passo 2. Os passos não citam caminho de menu da árvore 06.05.02. |
| C-SELO-07 | `selos` | `[XRX]` | Não | Bloqueio [XRX] por dependência cruzada de protocolo pré-existente (D-3.19, D-3.23, D-3.22) para exibir a aba 'Custas / Emolumentos' no passo 1. Os passos não citam caminho de menu da árvore 06.05.02. |
| D-3.35 | `selos` | `[XRX]` | Sim | P1: 1. Acesse o protocolo notarial que teve o ato cancelado em **Notas > Protocolo**. → 1. Acesse o protocolo notarial que teve o ato cancelado em **Notas > Consultas > Protocolos**. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Notas > Consultas > Protocolos'); auditoria/reports/auditoria-caminhos-menus.md (tabela de navegação: 'Notas > Protocolo' -> 'Notas > Consultas > Protocolos'); revPath auditoria_ui (rotinas_pre_requisito: D-3.19, D-3.23, D-3.22)) |
| R-17.0 | `selos` | `[XRX]` | Sim | P1: 1. Acesse o menu **Administração > Comunicações > Selo Digital** (ou utilize o atalho de **Selo Digital** na barra superior). → 1. Acesse o menu **Administração > Comunicações > Selo digital** (ou utilize o atalho de **Selo Digital** na barra superior). ; P2: 2. No campo **Data do Ato**, informe o período desejado da pesquisa. → 2. No campo **Data do ato**, informe o período desejado da pesquisa. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Administração > Comunicações > Selo digital'); auditoria/cache/orion-route-graph.json (#/seloDigital: field 'Data do ato', buttons 'Filtrar', 'Comunicar'); revPath auditoria_ui (rotinas_pre_requisito: D-2.7, D-2.4)) |
| R-23.0 | `selos` | `[XRX]` | Sim | P1: 1. No módulo **Orion Estoque**, acesse o menu **Administração > Distribuição**. → 1. No **Orion TN**, acesse o menu **Administração > Controle de Estoque > Distribuição**. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Administração > Controle de Estoque > Distribuição'); auditoria/src/menu-canonical.ts ('orion estoque' -> 'Administração > Controle de Estoque'); auditoria/cache/orion-route-graph.json (#/distribuicao); revPath auto_cura passo 1 e rotinas_pre_requisito (D-2.7, D-2.4)) |
| V-3.0 | `selos` | `[XRX]` | Sim | P1: 1. No módulo **Orion Stock**, acesse o menu **Administração > Consultas > Estoque**. → 1. No **Orion TN**, acesse o menu **Administração > Controle de Estoque > Consultas**. (auditoria/mapeamento-menus/arvore-menus-orion-tn.md ('Administração > Controle de Estoque > Consultas'); auditoria/src/menu-canonical.ts ('Administração > Consultas > Estoque' -> 'Administração > Controle de Estoque > Consultas'); auditoria/cache/orion-route-graph.json (#/consultaEstoque); revPath auto_cura passo 1 e rotinas_pre_requisito (D-2.4, D-2.7)) |
