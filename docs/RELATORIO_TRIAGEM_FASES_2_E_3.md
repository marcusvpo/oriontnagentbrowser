# Relatório de Triagem — Fases 2 e 3 (Orion TN 6.0)

> Gerado em 2026-11-18 23:24 (UTC) por `node scripts/generate-triage-report.mjs` — **somente leitura**: nenhum relatório de rotina, print ou cache foi alterado. Fonte: `auditoria/rotinas/**/*-revisado.md` (frontmatter `auditoria_ui`) e, para o comparativo "Antes", o commit `HEAD`.
> Escopo: **168 rotinas** — Fase 2 (`acesso` + `config`, 50) e Fase 3 (`firmas`, `selos`, `livros`, `certidoes`, `centrais`, 118). Fora do escopo: D-1.1 (módulo `caixa`).
> Uma rotina pode ter várias tags (`[ATT][CCC]`): ela conta em cada categoria, por isso a soma das colunas pode exceder o total.

## 1. Quadro atualizado das rotinas

### 1.1 Por fase e categoria

| Categoria | Fase 2 | Fase 3 | Total |
|---|---:|---:|---:|
| **Rotinas no escopo** | 50 | 118 | 168 |
| Validadas (sem tag) | 13 | 13 | 26 |
| `[ATT]` — atualização editorial (inclui multi-tag) | 26 | 71 | 97 |
| `[XRX]` — dependência cruzada (inclui multi-tag) | 0 | 26 | 26 |
| `[DDD]` — dados/ambiente/hardware | 11 | 7 | 18 |
| `[CCC]` — etapa externa (inclui multi-tag) | 0 | 4 | 4 |

Só uma tag (sem combinações): `[ATT]` 95 · `[XRX]` 25 · `[DDD]` 18 · `[CCC]` 1.

### 1.2 Por módulo

| Módulo | Fase | Total | Validadas | `[ATT]` | `[XRX]` | `[DDD]` | `[CCC]` |
|---|---:|---:|---:|---:|---:|---:|---:|
| acesso | 2 | 10 | 1 | 8 | 0 | 1 | 0 |
| config | 2 | 40 | 12 | 18 | 0 | 10 | 0 |
| firmas | 3 | 36 | 8 | 17 | 8 | 3 | 0 |
| selos | 3 | 24 | 2 | 12 | 8 | 2 | 0 |
| livros | 3 | 20 | 0 | 17 | 3 | 0 | 0 |
| certidoes | 3 | 15 | 1 | 13 | 1 | 0 | 0 |
| centrais | 3 | 23 | 2 | 12 | 6 | 2 | 4 |

### 1.3 Efeito da reauditoria das 13 rotinas calibradas (Antes × Depois)

"Antes" = relatório no commit `HEAD`; "Depois" = relatório atual em disco.

"Divergências do verificador" = passos que o verificador semântico multimodal (ADR-033) reprovou (`semantic_match = false` ou confiança visual < 0.85): lote de 17 divergência(s) antes → 3 depois (relatório consolidado). Rotina que passou a `[ATT]`/`[XRX]` não é reavaliada pelo verificador (só inspeciona `validado_com_ajustes`).

| Rotina | Antes | Depois | Divergências do verificador (antes → depois) | Observação |
|---|---|---|---|---|
| C-CERT-02 | validada | validada | 2 (passos 1, 5) → 1 (passo 1) | Permanece(m) 1 divergência(s) para adjudicação humana (ver ADR-035 §2.6). |
| D-3.11 | validada | validada | 1 (passo 4) → 1 (passo 2) | Permanece(m) 1 divergência(s) para adjudicação humana (ver ADR-035 §2.6). |
| D-3.9 | validada | validada | 1 (passo 3) → 0 | Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador. |
| M-36.0 | validada | validada | 1 (passo 3) → 0 | Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador. |
| M-41.0 | validada | validada | 1 (passo 5) → 0 | Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador. |
| M-43.0 | validada | validada | 1 (passo 3) → 0 | Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador. |
| M-60.0 | validada | validada | 1 (passo 3) → 0 | Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador. |
| M-66.0 | validada | validada | 2 (passos 3, 5) → 0 | Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador. |
| M-68.0 | validada | validada | 1 (passo 5) → 0 | Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador. |
| R-1.1 | validada | validada | 1 (passo 4) → 1 (passo 4) | Permanece(m) 1 divergência(s) para adjudicação humana (ver ADR-035 §2.6). |
| R-10.0 | validada | [ATT] | 2 (passos 2, 3) → não reavaliada (bloqueio com tag) | No passo 2, o manual cita ""+" (Adicionar Novo Pedido)", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "marcus" é um perfil administ… |
| R-18.0 | validada | validada | 1 (passo 3) → 0 | Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador. |
| R-3.0 | validada | [XRX] | 2 (passos 3, 5) → não reavaliada (bloqueio com tag) | No passo 5, a tela está sem dados (grade com 11 coluna(s) visível(is) (Pedido, RPS, Status, Usuário, Escrevente, Mensalista) e 0 linhas de dados; controles inativos: "Fi… |

## 2. Mapa de ação das rotinas `[ATT]` (97)

Bloqueio `[ATT]` = **manual desatualizado**: o auditor esgotou menu, auto-cura, exploração investigativa e máquina de estado, e **não adivinhou** a tela (Evidência Estrita). O texto de cada manual permanece 100% original; as sugestões abaixo vêm do Raio-X lido ao vivo (`diagnostico_tela_att`) e são apenas subsídio de reescrita.

### 2.1 Resumo por módulo e tipo de bloqueio

| Módulo | Total `[ATT]` | Falha no menu (passo 1) | Falha no menu (passo ≥ 2) | Campo/botão ausente na tela |
|---|---:|---:|---:|---:|
| acesso | 8 | 2 | 0 | 6 |
| config | 18 | 4 | 0 | 14 |
| firmas | 17 | 3 | 1 | 13 |
| selos | 12 | 2 | 1 | 9 |
| livros | 17 | 8 | 0 | 9 |
| certidoes | 13 | 3 | 0 | 10 |
| centrais | 12 | 2 | 2 | 8 |
| **Total** | **97** | **24** | **4** | **69** |

### 2.2 Falha no caminho de menu (28)

O caminho citado no manual não existe na árvore de navegação real (leitura ao vivo, sem cliques). Ação editorial: trocar pelo caminho real (ver "Evidência") ou confirmar com Produtos onde a tela foi movida.

<details><summary><b>acesso</b> — 2 rotina(s)</summary>

| Rotina | Título | Passo | Evidência lida da árvore real |
|---|---|---:|---|
| C-ACESSO-06 | Habilitação de Permissões para Edição de Partes e Imóveis em Protocol… | 1 | No passo 1, o manual cita "Grupos e Perfis de Acesso", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exp… |
| C-ACESSO-07 | Liberação de Acesso e Impressão de Consulta de Serviços Praticados pa… | 1 | No passo 1, o manual cita "Grupos e Perfis de Acesso", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exp… |

</details>

<details><summary><b>config</b> — 4 rotina(s)</summary>

| Rotina | Título | Passo | Evidência lida da árvore real |
|---|---|---:|---|
| M-22.0 | Criar um Novo Livro e Configurar seus Parâmetros | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Livros" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas", "Consultas", "Cadastros"; "Livros" não está entre eles. Nenhum it… |
| M-32.2 | Como Cadastrar um Certificado Digital A1 para Assinatura de Lotes | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Certificados digitais" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura e digitalização", "Parâmetro… |
| M-34.0 | Gerenciar Tipos de Anexo | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Cadastros auxiliares > Tipos de anexo" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamen… |
| M-35.0 | Cadastrar Novo Tipo de Anexo | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Cadastros auxiliares > Tipos de anexo" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamen… |

</details>

<details><summary><b>firmas</b> — 4 rotina(s)</summary>

| Rotina | Título | Passo | Evidência lida da árvore real |
|---|---|---:|---|
| C-FIRMA-05 | Emissão de Termo de Comparecimento com Representação por Procuração (… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas", "Consultas", "Cad… |
| C-FIRMA-06 | Tratamento de RPS Rejeitado no Balcão de Firmas por Falta de Tomador… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros de NFS-e > Regras de Balcão" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de custas", "Cad… |
| C-FIRMA-07 | Atualização de Valores da Tabela de Emolumentos para Materialização e… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de cust… |
| C-FIRMA-08 | Migração e Reconhecimento de Imagens de Cartões de Assinatura em Novo… | 2 | No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Armazenamento e GED" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de custas", "Ca… |

</details>

<details><summary><b>selos</b> — 3 rotina(s)</summary>

| Rotina | Título | Passo | Evidência lida da árvore real |
|---|---|---:|---|
| C-SELO-01 | Resolução de Divergência no Recolhimento Semanal de Selos com o Porta… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Módulos > Selo Digital > Auditoria / Conferência Semanal" não existe na árvore de navegação real do Orion TN. O menu raiz "Módulos" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Administração",… |
| C-SELO-04 | Substituição de Certificado Digital A1 Vencido no Servidor Daemon de… | 5 | No passo 5, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros de Integração > Certificado Digital" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de custa… |
| D-3.75 | Ativar Consumo Automático de Papel e Selos | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho de menu real **Configurações > Parametrizações** foi aberto (rota #/configuracoes), mas a tela não tem a aba/seção "Consumo de Insumos" citada pelo manual. Abas e seções lidas ao vivo na tela: "Geral", "Captura e digitalização", "Parâmetros p… |

</details>

<details><summary><b>livros</b> — 8 rotina(s)</summary>

| Rotina | Título | Passo | Evidência lida da árvore real |
|---|---|---:|---|
| C-LIVRO-01 | Procedimento de Inutilização e Declaração de Folha Sem Efeito em Livr… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Livros > Gestão e Controle de Folhas" não existe na árvore de navegação real do Orion TN. O menu raiz "Livros" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Administração", "Históricos", "Confi… |
| C-LIVRO-02 | Reabertura Administrativa de Livro Notarial Encerrado Prematuramente… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Livros Notariais > Cadastro e Encerramento" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de custas",… |
| C-LIVRO-05 | Geração de Termos de Abertura e Encerramento de Livros Notariais | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Livros > Gestão de Livros Notariais" não existe na árvore de navegação real do Orion TN. O menu raiz "Livros" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Administração", "Históricos", "Config… |
| C-LIVRO-06 | Correção de Duplicidade de Complementos de Livro e Folha em Lotes de… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Fechamento de Quinzena / Comunicações" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamen… |
| C-LIVRO-07 | Controle Sequencial e Auditoria de Folhas Soltas para Impressão de Es… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Orion Estoque > Livros Notariais > Controle de Folhas Soltas" não existe na árvore de navegação real do Orion TN. O menu raiz "Orion Estoque" não existe na barra de navegação (menus lidos: "Dashboard", "Firmas", "Notas", "Relatórios", "Admin… |
| C-LIVRO-08 | Consolidação Financeira e Recálculo de Subtotais do Livro Caixa / LCW… | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Rotinas Especiais > Consolidação de Movimentações" não existe na árvore de navegação real do Orion TN. O menu **Administração** existe na barra de navegação e contém: "Comissões", "Comunicações", "Envio de escrituras para Reg… |
| D-3.60 | Cadastrar Livro para Consumo | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Cadastros > Livro para Consumo" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamentos", "… |
| M-29.1 | Como Gerenciar Termos Salvos (Reimprimir, Inutilizar, Digitalizar) | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Consultas > Termos de comparecimento" não existe na árvore de navegação real do Orion TN. O menu **Firmas > Consultas** existe na barra de navegação e contém: "Reconhecimentos de firmas", "Serviços praticados"; "Termos de comparecim… |

</details>

<details><summary><b>certidoes</b> — 3 rotina(s)</summary>

| Rotina | Título | Passo | Evidência lida da árvore real |
|---|---|---:|---|
| D-3.15 | Vincular Ato a Certidão para Reprografia | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Certidões > Consulta de Certidões" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamentos"… |
| M-54.0 | Funcionalidades da Tela de Pedido de Certidão | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Pedido de certidão" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamentos", "Orçamento rá… |
| M-54.1 | Como Criar um Novo Pedido de Certidão (Dados do Solicitante) | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Notas > Pedido de certidão" não existe na árvore de navegação real do Orion TN. O menu **Notas** existe na barra de navegação e contém: "Protocolos em aberto", "Novo protocolo", "Protocolos", "Orçamento completo", "Orçamentos", "Orçamento rá… |

</details>

<details><summary><b>centrais</b> — 4 rotina(s)</summary>

| Rotina | Título | Passo | Evidência lida da árvore real |
|---|---|---:|---|
| C-CENTRAL-04 | Renovação de Token de Autenticação Expirado na Plataforma SIGNO / CEN… | 4 | No passo 4, o manual cita um caminho de menu que não existe na versão atual. O caminho "Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC" não existe na árvore de navegação real do Orion TN. O menu **Configurações** existe na barra de navegação e contém: "Dados do cartório", "Modelos de impressão", "Tabela de custas… |
| C-CENTRAL-13 | Transmissão de Comunicações ao SIRC decorrentes de Inventários e Test… | 2 | No passo 2, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > SIRC / Comunicações Previdenciárias" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações** existe na barra de navegação e contém: "COAF", "Outras comunicações", "Auditoria… |
| M-13.0 | Abertura de Pedido de Firmas com Senha (Pré-Atendimento) | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Firmas > Atendimento > Abertura de pedido com senha" não existe na árvore de navegação real do Orion TN. O menu **Firmas** existe na barra de navegação e contém: "Abertura de pedido", "Reconhecimento de firmas", "Consultas", "Cadastros"; "At… |
| M-32.0 | Como Consultar e Gerenciar Lotes de Comunicação (SEFAZ / E-notariado) | 1 | No passo 1, o manual cita um caminho de menu que não existe na versão atual. O caminho "Administração > Comunicações > Lotes de comunicação" não existe na árvore de navegação real do Orion TN. O menu **Administração > Comunicações** existe na barra de navegação e contém: "COAF", "Outras comunicações", "Auditoria de Selos", "Sel… |

</details>

### 2.3 Campo/botão ausente na tela (69)

A tela abriu, mas o elemento citado não existe nela. A tabela lista o que **existe de fato** na tela do bloqueio, para orientar a reescrita.

<details><summary><b>acesso</b> — 6 rotina(s)</summary>

**C-ACESSO-02** — Inativação Segura de Colaborador Desligado com Preservação de Histórico e Auditoria · bloqueio no passo 3

- **Ausente(s) na tela:** **Ativo**, **Inativo / Bloqueado**
- **Tela real:** #/usuario/alterar/1 · Alteração de usuário
- **Abas:** — · **Botões:** Salvar, Excluir, Voltar
- **Campos:** Usuário, Nome, CPF ou CIN, Cargo, E-mail, Telefone principal, Telefone, Perfil de Usuário (+7)
- **Subsídio de reescrita:** Sugestão de reescrita: Ativo, Inativo / Bloqueado não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-ACESSO-03** — Redefinição de Senha e Reset de Autenticação em Dois Fatores (2FA) por Perda de Dispositi… · bloqueio no passo 4

- **Ausente(s) na tela:** **Geral**, **Redefinir Senha Manualmente**, **Exigir troca no próximo logon**
- **Tela real:** #/usuario/alterar/1 · Alteração de usuário
- **Abas:** — · **Botões:** Salvar, Excluir, Voltar
- **Campos:** Usuário, Nome, CPF ou CIN, Cargo, E-mail, Telefone principal, Telefone, Perfil de Usuário (+7)
- **Subsídio de reescrita:** Sugestão de reescrita: Geral, Redefinir Senha Manualmente, Exigir troca no próximo logon não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-ACESSO-04** — Descompasso de Credenciais entre Orion TN e Módulo SGA com Divergência de Regras de Senha · bloqueio no passo 3

- **Ausente(s) na tela:** **Senha**
- **Tela real:** #/usuario/alterar/1 · Alteração de usuário
- **Abas:** — · **Botões:** Salvar, Excluir, Voltar
- **Campos:** Usuário, Nome, CPF ou CIN, Cargo, E-mail, Telefone principal, Telefone, Perfil de Usuário (+7)
- **Subsídio de reescrita:** Sugestão de reescrita: Senha não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-ACESSO-08** — Promoção de Colaborador de Auxiliar para Escrevente com Habilitação de Lavratura e Estoque · bloqueio no passo 4

- **Ausente(s) na tela:** **Parâmetros Notariais**, **[x] Autorizado a Lavrar Escrituras, Procurações e Atas**
- **Tela real:** #/usuario/alterar/1 · Alteração de usuário
- **Abas:** — · **Botões:** Salvar, Excluir, Voltar
- **Campos:** Usuário, Nome, CPF ou CIN, Cargo, E-mail, Telefone principal, Telefone, Perfil de Usuário (+7)
- **Subsídio de reescrita:** Sugestão de reescrita: Parâmetros Notariais, [x] Autorizado a Lavrar Escrituras, Procurações e Atas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-3.4.6** — Gestão de Protocolos com Assinaturas Pendentes e Estorno de Recolhimento · bloqueio no passo 1

- **Ausente(s) na tela:** **Para emitir recibo com pendência de assinaturas:**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Para emitir recibo com pendência de assinaturas: não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-7.5.3** — Desbloqueio e Controle de Acesso para Edição de Livros e Atos Já Impressos · bloqueio no passo 1

- **Ausente(s) na tela:** **Canetinha**, **Livro**, **Impressão Definitiva**, **Impresso**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Canetinha, Livro, Impressão Definitiva, Impresso não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

</details>

<details><summary><b>config</b> — 14 rotina(s)</summary>

**M-12.0** — Gerenciamento de Serviços Lançados (Visualizar, Reutilizar/Inutilizar Selo) · bloqueio no passo 1

- **Ausente(s) na tela:** **Balcão de Firmas**, **Últimos serviços realizados**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Balcão de Firmas, Últimos serviços realizados não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-14.2** — Balcão de Firmas: Lançando Serviços e Imprimindo Etiquetas · bloqueio no passo 1

- **Ausente(s) na tela:** **Balcão de firmas**, **Lançamento de Serviços**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Balcão de firmas, Lançamento de Serviços não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-16.2** — Parametrizar Captura e Digitalização · bloqueio no passo 2

- **Ausente(s) na tela:** **Dispositivo de Captura**
- **Tela real:** #/configuracoes · Configurações / Digitalização
- **Abas:** — · **Botões:** Excluir, Adicionar, Concluir, Voltar
- **Campos:** tipoDigitalizador, inputTextUrlConexaoDocuvieware, Documento, Caminho, Cor para digitalização do DUT, Dpi's para digitalização do DUT, Mostrar configurações do scanner, Cor para digitalização do ITCMD (+1)
- **Subsídio de reescrita:** Sugestão de reescrita: Dispositivo de Captura não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-16.10** — Parametrizar E-mail · bloqueio no passo 2

- **Ausente(s) na tela:** **Configuração do Servidor (SMTP)**, **Porta**, **TLS/SSL**
- **Tela real:** #/configuracoes · Configurações
- **Abas:** — · **Botões:** Concluir, Voltar
- **Campos:** Diariamente, Semanalmente, Mensalmente, E-mail
- **Subsídio de reescrita:** Sugestão de reescrita: Configuração do Servidor (SMTP), Porta, TLS/SSL não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-24.0** — Cadastro de Novo Tipo de Documento para Termo de Comparecimento · bloqueio no passo 3

- **Ausente(s) na tela:** **CRV - SEFAZ SP**
- **Tela real:** #/tipoDocumento/cadastrar · Cadastro de tipo de documento
- **Abas:** — · **Botões:** Concluir, Voltar
- **Campos:** Sigla do tipo de documento, Descrição do tipo de documento, Tipo de documento (Cadastro Único de Clientes do Notariado), Tipo de documento para comunicação CEP:, Tipo de documento para comunicação CESDI:, Pessoa física, Pessoa jurídica, Observações
- **Subsídio de reescrita:** Sugestão de reescrita: CRV - SEFAZ SP não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-26.0** — Cadastro de Nova Configuração de Impressão de Etiquetas · bloqueio no passo 5

- **Ausente(s) na tela:** **Salto (Gap)**
- **Tela real:** #/configuracaoImpressaoModelo/cadastrar · Cadastro de configuração de impressão / Margem mínima
- **Abas:** — · **Botões:** Salvar, Voltar
- **Campos:** Descrição, Largura da etiqueta (cm), Altura da etiqueta (cm), Salto de etiquetas (cm), Margem superior (cm), Margem esquerda (cm), Margem inferior (cm), Margem direita (cm)
- **Correspondências sugeridas:** Salto (Gap) → Salto de etiquetas (cm) (campo, 48%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 5, substituir Salto (Gap) por Salto de etiquetas (cm) (campo da seção Margem mínima).

**M-42.0** — Gerenciar Modelos de Etiqueta · bloqueio no passo 3

- **Ausente(s) na tela:** **Pesquisar por modelo**, **Filtrar**
- **Tela real:** #/modeloEtiqueta · Modelos de etiquetas
- **Abas:** — · **Botões:** Filtrar, Limpar, Adicionar, Voltar
- **Campos:** Título, Descrição, Tipo modelo, totalPerPage
- **Correspondências sugeridas:** Pesquisar por modelo → Tipo modelo (campo, 51%); Filtrar → Filtrar (botão, 85%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 3, substituir Pesquisar por modelo por Tipo modelo (campo). Filtrar existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.

**M-63.0** — Adicionar Novo Grupo de Itens · bloqueio no passo 3

- **Ausente(s) na tela:** **Notas**, **Firmas**
- **Tela real:** #/grupoItem/cadastrar · Cadastro de grupo de item
- **Abas:** — · **Botões:** Concluir, Voltar
- **Campos:** Descrição, Especialidade
- **Correspondências sugeridas:** Especialidade → Especialidade (campo, 100%)
- **Subsídio de reescrita:** Sugestão de reescrita: Especialidade existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Notas, Firmas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi mov…

**M-69.0** — Acessar e Gerenciar Modelos de Etiqueta · bloqueio no passo 3

- **Ausente(s) na tela:** **Pesquisar por modelo**, **Filtrar**
- **Tela real:** #/modeloEtiqueta · Modelos de etiquetas
- **Abas:** — · **Botões:** Filtrar, Limpar, Adicionar, Voltar
- **Campos:** Título, Descrição, Tipo modelo, totalPerPage
- **Correspondências sugeridas:** Pesquisar por modelo → Tipo modelo (campo, 51%); Filtrar → Filtrar (botão, 85%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 3, substituir Pesquisar por modelo por Tipo modelo (campo). Filtrar existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.

**M-70.0** — Criando um Novo Modelo de Etiqueta (Configuração Básica) · bloqueio no passo 4

- **Ausente(s) na tela:** **Reconhecimento de firma por semelhança sem valor econômico**
- **Tela real:** #/modeloEtiqueta/cadastrar · Cadastro de modelo de etiqueta
- **Abas:** — · **Botões:** Negrito, Alinhar Esquerda, Centralizar, Alinhar Direita, Justificado, Concluir, Voltar
- **Campos:** Tipo modelo, Título, Descrição, Item, Serviço, Configuração, Linguagem, Fonte (+3)
- **Correspondências sugeridas:** Serviço → Serviço (campo, 100%)
- **Subsídio de reescrita:** Sugestão de reescrita: Serviço existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Reconhecimento de firma por semelhança sem valor econômico não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confi…

**M-70.1** — Configurando os Parâmetros Técnicos de um Modelo de Etiqueta · bloqueio no passo 1

- **Ausente(s) na tela:** **Editar**, **Parâmetros Técnicos / Layout**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Editar, Parâmetros Técnicos / Layout não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-2.2.2** — Configuração de Atos Notariais, Quantidade e Base de Cálculo no Orçamento Completo · bloqueio no passo 1

- **Ausente(s) na tela:** **Natureza**, **Item**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Natureza, Item não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-2.2.3** — Cálculo de ITBI e Detalhamento de Custas do Registro de Imóveis via Tabela Auxiliar · bloqueio no passo 1

- **Ausente(s) na tela:** **ITBI**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: ITBI não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-2.3.1** — Edição de Custas do Registro de Imóveis e Adição de Múltiplos Atos no Orçamento Completo · bloqueio no passo 1

- **Ausente(s) na tela:** **Registro de Imóveis**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Registro de Imóveis não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

</details>

<details><summary><b>firmas</b> — 13 rotina(s)</summary>

**C-FIRMA-02** — Regularização de Sequência no Livro de Termos de Comparecimento e Etiquetas de Ressalva · bloqueio no passo 1

- **Ausente(s) na tela:** **Erro de Grafia no Termo Já Impresso**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Erro de Grafia no Termo Já Impresso não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-FIRMA-03** — Habilitação de Permissões para Retificação e Inclusão de Alertas em Fichas de Firma · bloqueio no passo 4

- **Ausente(s) na tela:** **Permissões Específicas**
- **Tela real:** #/usuario/alterar/1 · Alteração de usuário
- **Abas:** — · **Botões:** Salvar, Excluir, Voltar
- **Campos:** Usuário, Nome, CPF ou CIN, Cargo, E-mail, Telefone principal, Telefone, Perfil de Usuário (+7)
- **Correspondências sugeridas:** Balcão de Firmas → Escrevente de Firmas (campo, 45%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 4, substituir Balcão de Firmas por Escrevente de Firmas (campo). Permissões Específicas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**D-3.3** — Cadastrar Cartão de Assinatura · bloqueio no passo 2

- **Ausente(s) na tela:** **Preencher com IA**
- **Tela real:** #/ficha/cadastrar · Cadastro de cartão de assinatura / Papel de segurança
- **Abas:** — · **Botões:** Preencher cartão usando I.A., Consumir, Gerar, Consulta Central de notificações de suspeitos (CNS)., Excluir, Adicionar, Selecionar, Capturar (+3)
- **Campos:** Filtro, Nome, Nome social, Sexo, Nascimento, CPF ou CIN, RG, Orgão emissor (+39)
- **Correspondências sugeridas:** Preencher com IA → Preencher cartão usando I.A. (botão, 56%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 2, substituir Preencher com IA por Preencher cartão usando I.A. (botão).

**M-9.0** — Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais) · bloqueio no passo 4

- **Ausente(s) na tela:** **Contato e Endereço**, **CEP**
- **Tela real:** #/ficha/cadastrar · Cadastro de cartão de assinatura / Papel de segurança
- **Abas:** — · **Botões:** Preencher cartão usando I.A., Consumir, Gerar, Consulta Central de notificações de suspeitos (CNS)., Excluir, Adicionar, Selecionar, Capturar (+3)
- **Campos:** Filtro, Nome, Nome social, Sexo, Nascimento, CPF ou CIN, RG, Orgão emissor (+39)
- **Correspondências sugeridas:** Contato e Endereço → Endereço (seção, 61%); Contato e Endereço → Contato (seção, 55%); Contato e Endereço → Tipo de endereço (campo, 53%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 4, substituir Contato e Endereço por Endereço (seção). CEP existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.

**M-14.1** — Balcão de Firmas: Como Buscar e Selecionar Partes para o Reconhecimento · bloqueio no passo 1

- **Ausente(s) na tela:** **Balcão de firmas**, **Partes / Cartão de assinatura**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Balcão de firmas, Partes / Cartão de assinatura não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-16.4** — Gerenciar Sequências Automáticas do Sistema · bloqueio no passo 3

- **Ausente(s) na tela:** **Último número gerado**, **Próximo número**
- **Tela real:** #/configuracoes · Configurações
- **Abas:** — · **Botões:** Concluir, Voltar
- **Campos:** Cartão de assinatura, Sinal público, inputUltimaSequenciaPedidoFirmas, __/__/____, Requisição mensalista, Termo, Recibo caixa, Nosso número (+13)
- **Correspondências sugeridas:** Último número gerado → Nosso número (campo, 47%); Próximo número → Nosso número (campo, 58%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 3, substituir Último número gerado por Nosso número (campo); substituir Próximo número por Nosso número (campo).

**M-16.8** — Parametrizar Pedido de Firmas e Termo de Comparecimento · bloqueio no passo 2

- **Ausente(s) na tela:** **Pedido de Firmas**
- **Tela real:** #/configuracoes · Configurações / Termo de comparecimento
- **Abas:** — · **Botões:** Concluir, Voltar
- **Campos:** Todos os dedos, Um dedo, Por comparação, Por pesquisa, Automática, Manual, Sequência única, Diário (+23)
- **Subsídio de reescrita:** Sugestão de reescrita: Pedido de Firmas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-51.3** — Como Realizar a Qualificação de Partes em um Protocolo · bloqueio no passo 1

- **Ausente(s) na tela:** **Qualificação de Partes**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Qualificação de Partes não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**R-10.0** — Abrir Pedido de Firmas no Balcão de Atendimento · bloqueio no passo 2

- **Ausente(s) na tela:** **"+" (Adicionar Novo Pedido)**
- **Tela real:** #/pedidoFirmas/cadastrar · Reconhecimento de firmas / Serviços solicitados
- **Abas:** — · **Botões:** Preencha o número do pedido, Preencha a senha SGA, Buscar biometria, Novo cartão, Limpar, Filtrar, Tomador, Pagamento (+1)
- **Campos:** Pedido/Senha, Senha SGA, Data, Status, Tipo de pedido, Solicitante, CPF ou CIN/CNPJ, Filtro (+16)
- **Subsídio de reescrita:** Sugestão de reescrita: "+" (Adicionar Novo Pedido) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-1.0** — Como Cadastrar e Gerenciar o Sinal Público · bloqueio no passo 3

- **Ausente(s) na tela:** No passo 3, o manual cita "data de recebimento/envio", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloq…
- **Tela real:** #/sinalPublico/cadastrar · Cadastro de sinal público / Pessoas
- **Abas:** — · **Botões:** Adicionar, Selecionar, Capturar, Digitalizar , Concluir, Voltar
- **Campos:** Cartório, Recebido, Enviado, Data recebimento, E-mail, Site, Digitador, Digitado em (+11)

**V-3.1.3** — Identificação e Reaproveitamento de Dados do Solicitante para Recibo de Protocolo · bloqueio no passo 1

- **Ausente(s) na tela:** **Gerar Recibo**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Gerar Recibo não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-CCA.1.1** — Abertura e Preenchimento Básico do Cartão de Assinatura com Busca e Reaproveitamento de D… · bloqueio no passo 5

- **Ausente(s) na tela:** No passo 5, o manual cita "Lupa", que não foi localizado na tela auditada. A conta "marcus" é um perfil administrativo pleno (marcus) e a aplicação não marca o elemento como bloqueado ou oculto para…
- **Tela real:** #/ficha/cadastrar · Cadastro de cartão de assinatura / Papel de segurança
- **Abas:** — · **Botões:** Preencher cartão usando I.A., Consumir, Gerar, Consulta Central de notificações de suspeitos (CNS)., Adicionar, Selecionar, Capturar, Digitalizar  (+2)
- **Campos:** Filtro, Nome, Nome social, Sexo, Nascimento, CPF ou CIN, RG, Orgão emissor (+39)

**V-CCA.1.2** — Gerenciamento de Profissões, Contatos, Endereços e Representação de Pessoa Jurídica no Ca… · bloqueio no passo 1

- **Ausente(s) na tela:** **Cartão de Assinatura**, **Profissão**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Cartão de Assinatura, Profissão não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

</details>

<details><summary><b>selos</b> — 9 rotina(s)</summary>

**C-SELO-03** — Chaveamento Emergencial para Modo Offline (Contingência de Selos) por Queda do TJ · bloqueio no passo 3

- **Ausente(s) na tela:** **Online**, **Modo de Selagem Offline (Contingência)**
- **Tela real:** #/seloDigital · Selo digital TJ-SP
- **Abas:** — · **Botões:** Filtrar, Limpar, Comunicar, Totalizadores, Auditoria
- **Campos:** Status, Data do ato, Produto, Série, Sequência, Selo digital, Período de geração, Serviço
- **Subsídio de reescrita:** Sugestão de reescrita: Online, Modo de Selagem Offline (Contingência) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-SELO-09** — Estorno e Reatribuição de Sequência de Selos Distribuídos Incorretamente · bloqueio no passo 1

- **Ausente(s) na tela:** **Orion Estoque**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Orion Estoque não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-SELO-10** — Desativação de Campos Obrigatórios de ITCMD em Recibos e Protocolos · bloqueio no passo 2

- **Ausente(s) na tela:** **Compra e Venda Pura**, **Procuração**
- **Tela real:** #/natureza · Natureza
- **Abas:** — · **Botões:** Filtrar, Limpar, Adicionar, Voltar
- **Campos:** Espécie, Natureza, Comunicação, Informa livro e folhas, Repetir livro e folhas, Inativos, totalPorPagina
- **Subsídio de reescrita:** Sugestão de reescrita: Compra e Venda Pura, Procuração não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**D-2.4** — Cadastrar Categoria de Produto · bloqueio no passo 3

- **Ausente(s) na tela:** **Nome da Categoria**
- **Tela real:** #/categoria/cadastrar · Cadastro de categoria
- **Abas:** — · **Botões:** Concluir, Voltar
- **Campos:** Descrição, Responsável, Utiliza sequência inicial e sequência final, Enviar alerta de estoque mínimo, Informar quantidade de atos, Utiliza série, E-mail (s) para envio de alerta
- **Correspondências sugeridas:** Nome da Categoria → Cadastro de categoria (seção, 57%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 3, substituir Nome da Categoria por Cadastro de categoria (seção).

**D-2.7** — Cadastrar Produto · bloqueio no passo 6

- **Ausente(s) na tela:** **Salvar**
- **Tela real:** #/produto/cadastrar · Cadastro de produto
- **Abas:** — · **Botões:** Concluir, Voltar
- **Campos:** Categoria, Descrição, Unidade, Responsável, Estoque mínimo, Distribuição, Quantidade de atos, Código de barras (+3)
- **Subsídio de reescrita:** Sugestão de reescrita: Salvar não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-16.1** — Parametrizações Gerais do Sistema · bloqueio no passo 2

- **Ausente(s) na tela:** **Papel de Segurança (NFS)**
- **Tela real:** #/configuracoes · Configurações / Cartão de assinatura
- **Abas:** — · **Botões:** Concluir, Voltar
- **Campos:** Tipo, Qtd. na busca, Produto, Ativar rotina de bloqueio automático de cartões de assinatura, Horário de execução, Para menos, Para mais, Truncado (+6)
- **Correspondências sugeridas:** Geral → Geral (seção, 85%)
- **Subsídio de reescrita:** Sugestão de reescrita: Geral existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece. Papel de Segurança (NFS) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi…

**R-1.4** — Funcionalidades da Barra Superior (Selo Digital, Alertas e Calendário) · bloqueio no passo 1

- **Ausente(s) na tela:** **Barra Superior**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Barra Superior não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**R-1.6** — Módulos Integrados: Orion Stock, Orion Caixa e Orion GED · bloqueio no passo 1

- **Ausente(s) na tela:** **Stock (Estoque)**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Stock (Estoque) não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-2.0** — Como Realizar a Aquisição de Produtos (Entrada no Estoque) · bloqueio no passo 1

- **Ausente(s) na tela:** **Orion Stock**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Orion Stock não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

</details>

<details><summary><b>livros</b> — 9 rotina(s)</summary>

**C-LIVRO-04** — Reinício dos Microsserviços de Renderização e Conversão Documental (Docker) · bloqueio no passo 2

- **Ausente(s) na tela:** **PowerShell**, **Docker Desktop**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: PowerShell, Docker Desktop não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**D-3.16** — Gerar Certidão no Editor de texto · bloqueio no passo 1

- **Ausente(s) na tela:** **Gerar no Editor**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Gerar no Editor não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**D-3.27** — Consultar Central de Indisponibilidade no Livro (CENIB) · bloqueio no passo 1

- **Ausente(s) na tela:** **Gerar Livro Definitivo**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Gerar Livro Definitivo não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**D-3.41** — Gerar Livro a partir de Minuta · bloqueio no passo 1

- **Ausente(s) na tela:** **Gerar Livro Definitivo**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Gerar Livro Definitivo não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**R-26.0** — Imprimir Relatório de Índice por Livro · bloqueio no passo 2

- **Ausente(s) na tela:** **Período**, **Livro Inicial**, **Livro Final**
- **Tela real:** #/inicio · Relatório - Índice por livros
- **Abas:** — · **Botões:** Imprimir, Fechar
- **Campos:** Período, Livro, inputNumeroLivroFinal, Nome, Natureza, Livro e folha, PDF, Excel
- **Correspondências sugeridas:** Período → Período (campo, 100%); Livro Inicial → Livro (campo, 53%); Livro Inicial → Livro e folha (campo, 48%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 2, substituir Livro Inicial por Livro (campo); substituir Livro Final por Livro (campo). Período existe na tela com o mesmo nome; o passo deve indicar a seção/aba correta onde aparece.

**R-36.0** — Imprimir Relatório do Livro de Protocolo · bloqueio no passo 3

- **Ausente(s) na tela:** No passo 3, o manual cita "Para Rascunho / Conferência:", ""Rascunho"", "Para Impressão Definitiva:", "Folha Inicial", que não foi localizado na tela auditada. A conta "marcus" é um perfil administra…
- **Tela real:** #/inicio · Livro Protocolo
- **Abas:** — · **Botões:** Imprimir, Fechar
- **Campos:** Período, Livro atual, Página atual, Rascunho (não exibe livro e página)

**V-7.0.4** — Geração, Configuração de Margem Espelho e Impressão do Livro Oficial com Consulta CNIB In… · bloqueio no passo 5

- **Ausente(s) na tela:** **CNIB**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: CNIB não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-7.2.1** — Pré-Visualização Direta do Livro de Notas e Traslado com Marca d'Água Antifraude · bloqueio no passo 1

- **Ausente(s) na tela:** **Editor**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Editor não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-7.4.2** — Consulta e Inserção de Hashes da CNIB (Central de Indisponibilidade) no Livro · bloqueio no passo 1

- **Ausente(s) na tela:** **Livro**, **Canetinha**, **Editor**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Livro, Canetinha, Editor não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

</details>

<details><summary><b>certidoes</b> — 10 rotina(s)</summary>

**C-CERT-01** — Emissão de Certidão com Custas Zeradas e Enquadramento de Selagem Isenta · bloqueio no passo 2

- **Ausente(s) na tela:** **Modalidade de Cobrança**, **Isenta / Gratuita**
- **Tela real:** #/certidoesServicos/cadastrar · Certidões e serviços
- **Abas:** — · **Botões:** —
- **Campos:** Pedido, Data pedido, Recibo, Data recibo, Previsão de entrega, Status, Situação, Escrevente (+38)
- **Subsídio de reescrita:** Sugestão de reescrita: Modalidade de Cobrança, Isenta / Gratuita não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-CERT-03** — Emissão de Certidão de Ato Legado não Digitalizado com Anexo do Livro Físico · bloqueio no passo 2

- **Ausente(s) na tela:** **Certidão de Ato Antigo / Não Digitalizado**
- **Tela real:** #/certidoesServicos/cadastrar · Certidões e serviços
- **Abas:** — · **Botões:** —
- **Campos:** Pedido, Data pedido, Recibo, Data recibo, Previsão de entrega, Status, Situação, Escrevente (+38)
- **Subsídio de reescrita:** Sugestão de reescrita: Certidão de Ato Antigo / Não Digitalizado não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-CERT-04** — Remoção de URL e Cabeçalhos do Navegador na Impressão de Certidões pelo Chrome · bloqueio no passo 2

- **Ausente(s) na tela:** **Mais Definições**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Mais Definições não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-CERT-05** — Resolução de Conflito de Cache de Navegador no Módulo de Nova Certidão · bloqueio no passo 1

- **Ausente(s) na tela:** **Orion TN**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Orion TN não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**D-3.14** — Criar Certidão · bloqueio no passo 2

- **Ausente(s) na tela:** **Identificação do Solicitante**
- **Tela real:** #/certidoesServicos/cadastrar · Certidões e serviços
- **Abas:** — · **Botões:** —
- **Campos:** Pedido, Data pedido, Recibo, Data recibo, Previsão de entrega, Status, Situação, Escrevente (+38)
- **Subsídio de reescrita:** Sugestão de reescrita: Identificação do Solicitante não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**D-3.29** — Solicitar Certidão Dentro de Protocolo · bloqueio no passo 1

- **Ausente(s) na tela:** **Certidões Solicitadas**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Certidões Solicitadas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-16.13** — Parametrizar Pedido de Certidão · bloqueio no passo 2

- **Ausente(s) na tela:** **Prazo de entrega padrão (dias)**
- **Tela real:** #/configuracoes · Configurações
- **Abas:** — · **Botões:** Excluir, Adicionar, Concluir, Voltar
- **Campos:** Utiliza pedidos de certidão, Utiliza controle de estoque em notas, Previsão de entrega, Consumo do papel de segurança, Qtd. na busca, Categoria, Produto, Padrão
- **Correspondências sugeridas:** Prazo de entrega padrão (dias) → Previsão de entrega (campo, 61%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 2, substituir Prazo de entrega padrão (dias) por Previsão de entrega (campo).

**M-54.2** — Como Realizar a Busca do Ato Original em um Pedido de Certidão · bloqueio no passo 1

- **Ausente(s) na tela:** **Busca**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Busca não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-54.3** — Como Lançar as Custas em um Pedido de Certidão · bloqueio no passo 1

- **Ausente(s) na tela:** **Custas**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Custas não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**V-6.2.3** — Pesquisa Rápida na Barra Superior da Tela de Protocolos em Aberto (Busca de Atos Abertos… · bloqueio no passo 5

- **Ausente(s) na tela:** **Filtrar**
- **Tela real:** #/protocolo/aberto · Protocolos em aberto
- **Abas:** — · **Botões:** —
- **Campos:** totalPorPagina
- **Subsídio de reescrita:** Sugestão de reescrita: Filtrar não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

</details>

<details><summary><b>centrais</b> — 8 rotina(s)</summary>

**C-CENTRAL-03** — Mapeamento de Qualidade CESDI em Inventários e Preenchimento Obrigatório · bloqueio no passo 2

- **Ausente(s) na tela:** **Comunicações - Configurações**
- **Tela real:** #/participacaoNotas · Participação
- **Abas:** — · **Botões:** Filtrar, Limpar, Adicionar, Voltar
- **Campos:** Pesquisar por descrição, Inativos, totalPorPagina
- **Subsídio de reescrita:** Sugestão de reescrita: Comunicações - Configurações não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-CENTRAL-08** — Disparo Forçado Síncrono de Fichas de Firma para o e-Notariado / CNN · bloqueio no passo 3

- **Ausente(s) na tela:** **Cartões de Autógrafo / Fichas de Firma**
- **Tela real:** #/comunicacoes · Comunicações
- **Abas:** — · **Botões:** Filtrar, Limpar, Imprimir, Gerar, Voltar
- **Campos:** Tipo, Data de processamento, Período, Mês de referência, Status, Lote, totalPorPagina
- **Subsídio de reescrita:** Sugestão de reescrita: Cartões de Autógrafo / Fichas de Firma não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-CENTRAL-09** — Correção de Rejeição da Carga CENSEC CEP por Ausência de Código IBGE · bloqueio no passo 2

- **Ausente(s) na tela:** **Partes**, **Município**
- **Tela real:** #/protocolo/cadastrar · Protocolo
- **Abas:** — · **Botões:** —
- **Campos:** ckbToggleDadosProtocolo, Data recepção, Status, Situação, Recibo, Data recibo, Data 1ª lavratura, Escrevente (+28)
- **Subsídio de reescrita:** Sugestão de reescrita: Partes, Município não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**C-CENTRAL-14** — Acompanhamento e Envio Eletrônico de Escrituras ao Registro de Imóveis (ONR / SAEC) · bloqueio no passo 2

- **Ausente(s) na tela:** **Integração Externa / ONR - SAEC**
- **Tela real:** #/inicio
- **Abas:** — · **Botões:** Clique aqui para ativar agora
- **Campos:** Pesquise aqui o nome da tela que deseja acessar. Atalho: CTRL + B
- **Subsídio de reescrita:** Sugestão de reescrita: Integração Externa / ONR - SAEC não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**D-3.2** — Visualizar Dashboard de Envio para Registro · bloqueio no passo 2

- **Ausente(s) na tela:** **Prenotados no RI**
- **Tela real:** #/dashboard/envioRegistro · Dashboard de envio para registro / Sem status definido
- **Abas:** — · **Botões:** + Filtros
- **Campos:** —
- **Correspondências sugeridas:** Aguardando Envio → Dashboard de envio para registro (seção, 46%); Com Exigência → Devolvido - Exigência (seção, 92%); Registrados → Registrado (seção, 95%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 2, substituir Aguardando Envio por Dashboard de envio para registro (seção); substituir Com Exigência por Devolvido - Exigência (seção); substituir Registrados por Registrado (seção). Prenotados no RI não tem correspondente fun…

**M-16.5** — Configurar Comunicações Externas (Selo Digital, E-notariado, COAF) · bloqueio no passo 3

- **Ausente(s) na tela:** **Produção**, **Homologação**
- **Tela real:** #/configuracoes · Configurações / Clique aqui para acessar a tela de configuração no Orion Selo Digital.
- **Abas:** — · **Botões:** Iniciar serviço do E-notariado, Parar serviço do E-notariado, Iniciar serviço do Signo, Parar serviço do Signo, Concluir, Voltar
- **Campos:** Automática, Manual, Online, Offline, Notificar por e-mail, E-mail, Enviar dados da parte em selos de reconhecimento, Diário (+43)
- **Correspondências sugeridas:** e-Notariado → Iniciar serviço do E-notariado (botão, 78%); e-Notariado → Parar serviço do E-notariado (botão, 78%); e-Notariado → Clique aqui para acessar a tela de configuração no Orion e-Notariado. (seção, 78%)
- **Subsídio de reescrita:** Sugestão de reescrita: no passo 3, substituir e-Notariado por Iniciar serviço do E-notariado (botão). Produção, Homologação não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**M-61.0** — Adicionar Nova Natureza · bloqueio no passo 4

- **Ausente(s) na tela:** **Sigla**
- **Tela real:** #/natureza/cadastrar · Cadastro de natureza / Selecione um perfil de partes, uma parte ou um documento apresentado que deseja
- **Abas:** — · **Botões:** Perfil de Partes, Partes, Documentos apresentados, Usuários, Limpar, Filtrar, Concluir, Voltar
- **Campos:** Descrição, Espécie, CEP, CESDI, RCTO, ITCMD, Não informar livro e folhas, Permitir a repetição do livro e folhas (+4)
- **Subsídio de reescrita:** Sugestão de reescrita: Sigla não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

**R-11.0** — Comunicação de Fichas de Firma com o e-Notariado · bloqueio no passo 2

- **Ausente(s) na tela:** **Gerar**, **"E-notariado"**
- **Tela real:** #/comunicacoes/cadastrar · Comunicações
- **Abas:** — · **Botões:** —
- **Campos:** Tipo
- **Subsídio de reescrita:** Sugestão de reescrita: Gerar, "E-notariado" não tem correspondente funcional nesta tela; avaliar a remoção do trecho ou confirmar com Produtos onde a função foi movida.

</details>

## 3. Mapa de encadeamento das rotinas `[XRX]` (26)

Cada rotina depende de outra que **cria o registro/estado** de que ela precisa. Execute a produtora antes e reaudite a consumidora. A coluna "Situação da produtora" mostra se a cadeia já está destravada.

| Consumidora (`[XRX]`) | Título | Produtora(s) a executar antes | Situação da produtora | Por que está bloqueada |
|---|---|---|---|---|
| C-CENTRAL-01 | Sanitização de Caracteres Especiais no Envio de Comunicaçõe… | **M-61.0** (Adicionar Nova Natureza) | M-61.0: [ATT] (cadeia bloqueada) | No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência) e 0 linhas de dados; contro… |
| C-CENTRAL-05 | Correção de Vínculo de Representante Legal na Carga CENSEC… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 3 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| C-CENTRAL-06 | Adequação de Frações Ideais e Titularidade de Imóveis para… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| C-CENTRAL-10 | Emissão e Transmissão de Comunicação de Inocorrência Periód… | **M-61.0** (Adicionar Nova Natureza) | M-61.0: [ATT] (cadeia bloqueada) | No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Protocolo, Natureza, Data de lavratura, Data comunicação, Data cancelamento, Nº Ocorrência) e 0 linhas de dados; contro… |
| C-CENTRAL-11 | Apontamento de Ato Primitivo em Retificações e Aditamentos… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| C-CENTRAL-12 | Localização e Rastreamento de Erros Estruturais no Arquivo… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 7 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| C-FIRMA-04 | Unificação e Bloqueio de Cartões de Assinatura Abertos em D… | **D-3.3** (Cadastrar Cartão de Assinatura); **M-9.0** (Abertura Rápida de Cartão de Assinatura no Balcão…); **V-CCA.3.3** (Cadastro Rápido e Edição de Cartão de Assinatura…) | D-3.3: [ATT] (cadeia bloqueada); M-9.0: [ATT] (cadeia bloqueada); V-CCA.3.3: validada (pronta para executar) | No passo 3, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Perí… |
| C-LIVRO-03 | Otimização de Paginação do Traslado e Redução de Laudas Res… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| C-SELO-02 | Tratamento de Duplicidade de Selos Digitais por Instabilida… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 1 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| C-SELO-05 | Fluxo Obrigatório para Cancelamento de Protocolo com Selo D… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| C-SELO-06 | Emissão de Selo de Retificação (Tipo XA) para Metadados de… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| C-SELO-07 | Enquadramento e Parametrização de Selos Sem Valor Econômico… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 1 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| D-3.35 | Gerar Selo de Cancelamento | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| D-9.0 | Excluir Movimentação Financeira em Pedido de Certidão | **M-54.3** (Como Lançar as Custas em um Pedido de Certidão); **M-54.1** (Como Criar um Novo Pedido de Certidão (Dados do S…); **D-3.14** (Criar Certidão) | M-54.3: [ATT] (cadeia bloqueada); M-54.1: [ATT] (cadeia bloqueada); D-3.14: [ATT] (cadeia bloqueada) | No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Data pedido, Previsão, Recibo, Pedido, Tipo de certidão, Escrevente) e 0 linhas de dados; controles inativos: "Filtrar"… |
| M-9.2 | Como Vincular uma Pessoa Jurídica a um Cartão de Assinatura | **D-3.3** (Cadastrar Cartão de Assinatura); **M-9.0** (Abertura Rápida de Cartão de Assinatura no Balcão…); **V-CCA.3.3** (Cadastro Rápido e Edição de Cartão de Assinatura…) | D-3.3: [ATT] (cadeia bloqueada); M-9.0: [ATT] (cadeia bloqueada); V-CCA.3.3: validada (pronta para executar) | No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Perí… |
| M-9.3 | Gerenciar Consumo de Papel de Segurança e Selo Digital no C… | **D-3.3** (Cadastrar Cartão de Assinatura); **M-9.0** (Abertura Rápida de Cartão de Assinatura no Balcão…); **V-CCA.3.3** (Cadastro Rápido e Edição de Cartão de Assinatura…) | D-3.3: [ATT] (cadeia bloqueada); M-9.0: [ATT] (cadeia bloqueada); V-CCA.3.3: validada (pronta para executar) | No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Perí… |
| R-3.0 | Consultar Pedidos de Firmas em Aberto Sem Pagamento no Caixa | **R-10.0** (Abrir Pedido de Firmas no Balcão de Atendimento); **D-3.11** (Fazer Reconhecimento de Firma); **V-CCA.3.3** (Cadastro Rápido e Edição de Cartão de Assinatura…) | R-10.0: [ATT] (cadeia bloqueada); D-3.11: validada (pronta para executar); V-CCA.3.3: validada (pronta para executar) | No passo 5, a tela está sem dados (grade com 11 coluna(s) visível(is) (Pedido, RPS, Status, Usuário, Escrevente, Mensalista) e 0 linhas de dados; controles inativos: "Filtrar" (Período de p… |
| R-17.0 | Comunicar Selos Digitais Pendentes ao Tribunal de Justiça | **D-2.7** (Cadastrar Produto); **D-2.4** (Cadastrar Categoria de Produto) | D-2.7: [ATT] (cadeia bloqueada); D-2.4: [ATT] (cadeia bloqueada) | No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Produto, Série, Sequência, Selo digital, Geração, Comunicação) e 0 linhas de dados; controles inativos: "Comunicar" (Ne… |
| R-23.0 | Como Realizar a Distribuição de Produtos e Selos no Estoque | **D-2.7** (Cadastrar Produto); **D-2.4** (Cadastrar Categoria de Produto) | D-2.7: [ATT] (cadeia bloqueada); D-2.4: [ATT] (cadeia bloqueada) | No passo 4, a tela está sem dados (grade com 3 coluna(s) visível(is) (Série, Sequência inicial, Sequência final) e 0 linhas de dados; controles inativos: "Concluir" (Preencha os campos obri… |
| R-30.0 | Reutilizar Posição de Livro Inutilizada | **D-3.60** (Cadastrar Livro para Consumo); **D-3.41** (Gerar Livro a partir de Minuta) | D-3.60: [ATT] (cadeia bloqueada); D-3.41: [ATT] (cadeia bloqueada) | No passo 3, a tela está sem dados (grade com 9 coluna(s) visível(is) (Tipo, Sigla, Nº Livro, Página atual, Lado atual, Posiçao atual) e 0 linhas de dados; controles inativos: "Filtrar" (Pre… |
| V-3.0 | Como Consultar o Estoque de Produtos | **D-2.4** (Cadastrar Categoria de Produto); **D-2.7** (Cadastrar Produto) | D-2.4: [ATT] (cadeia bloqueada); D-2.7: [ATT] (cadeia bloqueada) | No passo 2, a tela está sem dados (grade com 7 coluna(s) visível(is) (Produto, Categoria, Série, Seq. Inicial, Seq. Final, Quantidade) e 0 linhas de dados; controles inativos: "Filtrar" (Pr… |
| V-7.3.2 | Geração de Recibo, Lavratura do Ato e Tramitação de Selo Di… | **D-3.19** (Criar Protocolo de Nota); **D-3.23** (Gerar Recibo de Protocolo); **D-3.22** (Registrar Custas do Protocolo) | D-3.19: ainda não auditada (módulo notas, Fase 5); D-3.23: ainda não auditada (módulo notas, Fase 5); D-3.22: ainda não auditada (módulo notas, Fase 5) | O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23… |
| V-CCA.2.2 | Consulta Rápida de Anexos, Histórico de Andamentos e Bloque… | **M-9.0** (Abertura Rápida de Cartão de Assinatura no Balcão…); **D-3.3** (Cadastrar Cartão de Assinatura); **V-CCA.3.3** (Cadastro Rápido e Edição de Cartão de Assinatura…) | M-9.0: [ATT] (cadeia bloqueada); D-3.3: [ATT] (cadeia bloqueada); V-CCA.3.3: validada (pronta para executar) | No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Perí… |
| V-CCA.2.3 | Edição com Liberação de Supervisor e Gestão de Papel de Seg… | **V-CCA.3.3** (Cadastro Rápido e Edição de Cartão de Assinatura…); **D-3.3** (Cadastrar Cartão de Assinatura); **M-9.0** (Abertura Rápida de Cartão de Assinatura no Balcão…) | V-CCA.3.3: validada (pronta para executar); D-3.3: [ATT] (cadeia bloqueada); M-9.0: [ATT] (cadeia bloqueada) | No passo 4, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Perí… |
| V-CCA.3.1 | Geração e Gerenciamento de Selo Digital (Automático e Manua… | **D-3.3** (Cadastrar Cartão de Assinatura); **M-9.0** (Abertura Rápida de Cartão de Assinatura no Balcão…); **V-CCA.3.3** (Cadastro Rápido e Edição de Cartão de Assinatura…) | D-3.3: [ATT] (cadeia bloqueada); M-9.0: [ATT] (cadeia bloqueada); V-CCA.3.3: validada (pronta para executar) | No passo 4, a tela está sem dados (grade com 4 coluna(s) visível(is) (Arquivo, Data, Tipo, Tamanho) e 0 linhas de dados; controles inativos: "Consumir" (Consumir), "Gerar" (É necessário con… |
| V-CCA.3.2 | Impressão da Ficha do Cartão de Assinatura e Destinação de… | **D-3.3** (Cadastrar Cartão de Assinatura); **M-9.0** (Abertura Rápida de Cartão de Assinatura no Balcão…); **V-CCA.3.3** (Cadastro Rápido e Edição de Cartão de Assinatura…) | D-3.3: [ATT] (cadeia bloqueada); M-9.0: [ATT] (cadeia bloqueada); V-CCA.3.3: validada (pronta para executar) | No passo 2, a tela está sem dados (grade com 8 coluna(s) visível(is) (Nº Cartão, Nome, Nome Social, CPF ou CIN, NFS, Data digitação) e 0 linhas de dados; controles inativos: "Filtrar" (Perí… |

Resumo: **0** consumidora(s) com todas as produtoras validadas (podem ser reauditadas após executar a produtora); **15** com produtora também sinalizada (resolver a produtora primeiro); **11** dependem de rotina de fase futura (ex.: criação de protocolo no módulo Notas, Fase 5) — só destravam quando essa fase for auditada ou o registro for criado manualmente; **0** sem produtora identificada.

## 4. Rotinas `[DDD]` (18)

### 4.1 Periféricos físicos / ambiente (17) — fora do alcance do agente

Dependem de hardware (scanner TWAIN, biometria, impressora térmica), serviço local ou Docker. São derivadas por `hardware-registry.ts` e ficam **protegidas** da reauditoria em lote (`--reaudit-pending` as ignora; só `--routines` as força). Validação: manual, com o periférico.

| Rotina | Título | Dependência |
|---|---|---|
| C-ACESSO-05 | Falha de Conexão com o Serviço Docker do Módulo SGA | Demanda acesso ao host Linux/Windows onde o container do SGA roda, verificação de portas 8080/8443 e comando docker restart sga-service. |
| C-CENTRAL-07 | Inicialização do Integrador Local para Geração e Exportação de Lotes… | Depende do aplicativo binário local Integrador Orion (C:\Siplan\Integrador\Integrador.exe) na bandeja do Windows para compilação e exportação de lotes DOI. |
| C-CONFIG-01 | Substituição e Configuração de Novo Certificado Digital A1 no Orion T… | Requer upload de arquivo .pfx criptografado real e digitação da senha privada do titular/serventia, impossível de simular com dados fictícios. |
| C-CONFIG-02 | Calibração de Sensor Gap e Ajuste de Mídia em Impressoras Térmicas (Z… | Envolve procedimentos mecânicos no painel da impressora (Pause + Feed) e alinhamento do sensor de espaçamento (GAP) entre etiquetas físicas. |
| C-CONFIG-03 | Ajuste Fino de Margens e Deslocamento X e Y na Impressão de Etiquetas | Necessita medição manual milimétrica do papel impresso na serventia e calibração de offsets X e Y no driver ZDesigner ou Generic Text. |
| C-CONFIG-04 | Desbloqueio de Spooler do Windows e Configuração de Porta RAW para Im… | Demanda intervenção direta no Windows da estação local: parar serviço `spooler`, limpar arquivos temporários em `System32\spool\PRINTERS` e reiniciar. |
| C-CONFIG-05 | Instalação e Integração de Scanner de Cartão de Autógrafo via DocuVie… | Requer scanner de mesa/alimentador USB conectado fisicamente (ex: Fujitsu fi-series, Canon) e driver TWAIN 32-bit ativo no Windows. |
| C-CONFIG-06 | Resolução de Falha no Scanner com Mensagem de Dispositivo Ocupado ou… | Processo de escaneamento em segundo plano retém a porta USB; requer matar o processo via Gerenciador de Tarefas ou reiniciar o serviço TWAIN. |
| C-CONFIG-07 | Desbloqueio de Processos Órfãos Retendo Locks de Dados no Banco Postg… | Demanda acesso ao PostgreSQL com usuário postgres para rodar `pg_terminate_backend()` em transações travadas que geram erro de timeout na tela. |
| C-CONFIG-08 | Parametrização e Configuração de Nova Estação de Trabalho com Driver… | Requer instalação local do driver PostgreSQL ODBC 64-bit, configuração de DSN no Windows e instalação dos arquivos de fontes tipográficas (Oswald, Lato). |
| C-FIRMA-01 | Restauração de Comunicação com Leitores Biométricos e Câmeras via Int… | Depende diretamente de hardware externo e serviço local Windows (IntegradorSPCM.exe, leitor biométrico Futronic/SecuGen via USB e webcam). |
| C-SELO-08 | Correção de Falha de Lote de Selos por Desconexão de Token e Assinado… | Depende diretamente de hardware externo (token físico A3 USB / leitora de cartão) e serviço local Assinador Orion. |
| D-3.6 | Fazer Digitalização em Lote por Código de Barras do Papel | Depende diretamente de scanner físico com alimentador e leitura óptica de código de barras em lote. |
| M-9.1 | Anexar Documentos, Biometria e Foto em um Cartão de Assinatura | Rotina dedicada exclusivamente à captura multimídia via hardware externo (webcam, leitor biométrico e scanner de mesa). |
| R-32.1 | Solução para o Erro 'O serviço local não foi encontrado' nas Comunica… | Depende do aplicativo local Integrador Local na estação Windows e leitura de certificado digital A3 para comunicação com órgãos externos. |
| V-2.3.2 | Gestão de Valores Extranotariais e Cadastro de Novos Serviços de Desp… | Configuração com impacto direto na prestação de contas do cartório, livro caixa e emissão de notas fiscais; requer parametrização contábil assistida. |
| V-CCA.1.3 | Captura de Foto Facial, Biometria e Imagem/Digitalização do Cartão de… | Rotina dedicada exclusivamente à captura de foto facial (webcam), coleta biométrica (leitor digital) e digitalização (scanner/webcam). |

### 4.2 Parâmetro/dados no banco (1)

| Rotina | Título | Tipo de bloqueio | Detalhe |
|---|---|---|---|
| M-16.7 | Configurar Atalhos do Teclado | Dependência de Dados no Banco de Homologação (Grade Vazia) | No passo 4, a validação não pôde prosseguir: grade com 4 coluna(s) visível(is) (Função, Base, Atalho, Complemento) e 0 linhas de dados. Não existe botão Adicionar/Novo na tela. Nenhuma rotina do KB cria esses registros. |

## 5. Rotinas com etapa externa `[CCC]` (4)

`[CCC]` não bloqueia: as etapas do Orion TN foram auditadas e fotografadas; as etapas em portal externo (SISCOAF, e-Notariado, CENSEC...) ficam documentadas como "Etapa Externa" e só podem ser validadas no próprio portal.

| Rotina | Título | Tags |
|---|---|---|
| C-CENTRAL-02 | Habilitação de Pessoa Obrigada Ativa no Portal SISCOAF para Envio de Comunicaçõ… | `[CCC]` |
| C-CENTRAL-04 | Renovação de Token de Autenticação Expirado na Plataforma SIGNO / CENSEC | `[ATT]``[CCC]` |
| C-CENTRAL-08 | Disparo Forçado Síncrono de Fichas de Firma para o e-Notariado / CNN | `[ATT]``[CCC]` |
| C-CENTRAL-12 | Localização e Rastreamento de Erros Estruturais no Arquivo da DOI pelo Editor d… | `[CCC]``[XRX]` |

## Como regenerar

```powershell
node scripts/generate-triage-report.mjs
```

O gerador lê o estado atual de `auditoria/rotinas/` e compara as 13 rotinas calibradas com o commit indicado em `--before-ref`.
