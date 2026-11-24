# Auditoria de Caminhos de Menu — Passos 1 a 3 × Catálogo Canônico (ADR-037)

> Gerado por `auditoria/src/audit-menu-coherence.ts` em 2026-11-24T17:43:08.865Z (offline, somente leitura sobre `auditoria/rotinas/**` e `kb/**`). Catálogo canônico **06.05.02** (capturado em 2026-11-24T15:39:11.531Z).
>
> **Trava de Evidência:** toda cadeia "resolvida" abaixo é só um candidato do catálogo fechado. A reauditoria ao vivo precisa lê-la na árvore real, medir e acionar o nó antes de qualquer demarcação; nenhum texto de manual foi alterado.

## Resumo

| Indicador | Quantidade |
|---|---:|
| Rotinas auditadas lidas | 169 |
| ↳ [ATT] | 92 |
| ↳ [ATT][CCC] | 2 |
| ↳ [CCC] | 1 |
| ↳ [CCC][XRX] | 1 |
| ↳ [DDD] | 18 |
| ↳ [XRX] | 27 |
| ↳ sem tag (validadas) | 28 |
| **Fila A** — destravável por caminho canônico | **14** (read_only 4 · mutation 10 · confiança alta 0) |
| **Fila B** — bloqueio pós-navegação | **71** |
| **Fila C** — recurso/módulo sem equivalente na 06.05.02 | **37** (tela pressuposta 16) |
| `[DDD]`/`[CCC]` relatadas, fora das filas | 19 |
| Validadas com navegação 1–3 não exata | 24 de 28 (29 ocorrências) |
| Rotinas do KB lidas / ainda não auditadas | 471 / 302 |

**Navegações dos passos 1–3 por classe:**

| Classe | Auditadas | KB não auditado |
|---|---:|---:|
| Exato (`exact`) | 12 | 32 |
| Exato com deriva de grafia (`exact_with_spelling_drift`) | 21 | 22 |
| Equivalência canônica (`canonical_equivalence`) | 58 | 35 |
| Tela de segmento único (`single_segment`) | 28 | 76 |
| Semântica fechada (Camada 3) (`closed_semantic`) | 11 | 26 |
| Ambíguo (homônimo) (`ambiguous`) | 0 | 0 |
| Sem equivalente (`no_equivalent`) | 29 | 67 |

Critérios: **Fila A** = bloqueio `[ATT]`/`[XRX]` em passo 1–3 causado por navegação (caminho de menu ausente, alvo do próprio passo de navegação ou tela não alcançada) que agora tem destino único no catálogo (equivalência canônica, tela de segmento único, semântica fechada ou deriva de singular/plural). **Fila B** = caminho já exato, bloqueio após o passo 3, grade vazia, rótulo interno ausente ou dependência cruzada com a tela alcançada. **Fila C** = bloqueio de navegação sem destino único (sem equivalente ou homônimo indecidível), com os vizinhos mais próximos como laudo. Rotinas de hardware (`hardware-registry.ts`) nunca entram na Fila A.

## Fila A — Destravável por caminho canônico (14)

| Rotina | Tag | Carga | Confiança | Passo | Documentado | Cadeia do catálogo | Base | Ressalva |
|---|---|---|---|---:|---|---|---|---|
| C-CERT-04 | [ATT] | `read_only` | revisar | 2 | Remoção de URL e Cabeçalhos do Navegador na Impressão de Certidões pelo Chrome | **Configurações > Modelos de impressão > Configuração de impressão** | closed_semantic / closed_semantic | os passos 1–3 não citam tela: destino inferido só pelo título/passos (Camada 3) |
| C-SELO-02 | [XRX] | `read_only` | revisar | 1 | Custas / Selos | **Administração > Comunicações > Selo digital** | closed_semantic / closed_semantic | destino só por pontuação semântica (Camada 3), sem equivalência literal do caminho/tela documentados |
| C-SELO-09 | [ATT] | `read_only` | revisar | 1 | Orion Estoque | **Administração > Controle de Estoque** | single_segment / screen_alias | "Administração > Controle de Estoque" é submenu, não tela final: o passo seguinte precisa escolher a tela |
| M-12.0 | [ATT] | `read_only` | revisar | 1 | Balcão de Firmas | **Firmas > Reconhecimento de firmas** | single_segment / sinonimo_folha_adr026+exact_leaf | sinônimo de folha da ADR-026 espelhado do motor: confirmar que a navegação implícita (sem `>`) o aplica ao vivo |
| C-CENTRAL-06 | [XRX] | `mutation` | revisar | 2 | Imóveis | **Notas > Consultas > Protocolos** | closed_semantic / closed_semantic | destino só por pontuação semântica (Camada 3), sem equivalência literal do caminho/tela documentados |
| C-LIVRO-06 | [ATT] | `mutation` | revisar | 1 | Notas > Fechamento de Quinzena / Comunicações | **Administração > Comunicações** | single_segment / folha_exact_leaf | "Administração > Comunicações" é submenu, não tela final: o passo seguinte precisa escolher a tela |
| C-LIVRO-07 | [ATT] | `mutation` | revisar | 1 | Orion Estoque > Livros Notariais > Controle de Folhas Soltas | **Administração > Controle de Livros** | closed_semantic / closed_semantic | destino só por pontuação semântica (Camada 3), sem equivalência literal do caminho/tela documentados |
| D-3.41 | [ATT] | `mutation` | revisar | 1 | Gerar Livro a partir de Minuta | **Notas > Consultas > Editor** | closed_semantic / closed_semantic | os passos 1–3 não citam tela: destino inferido só pelo título/passos (Camada 3) |
| D-3.75 | [ATT] | `mutation` | revisar | 1 | Configurações > Parametrizações > Consumo de Insumos | **Configurações > Parametrizações (+ aba/seção "Consumo de Insumos")** | canonical_equivalence / tail_as_screen_section | a última auditoria já aplicou ao vivo a mesma cadeia "Configurações > Parametrizações" (passo 1); o bloqueio pode ser da aba/seção "Consumo de Insumos" |
| M-14.1 | [ATT] | `mutation` | revisar | 1 | Balcão de firmas | **Firmas > Reconhecimento de firmas** | single_segment / sinonimo_folha_adr026+exact_leaf | sinônimo de folha da ADR-026 espelhado do motor: confirmar que a navegação implícita (sem `>`) o aplica ao vivo |
| M-14.2 | [ATT] | `mutation` | revisar | 1 | Balcão de firmas | **Firmas > Reconhecimento de firmas** | single_segment / sinonimo_folha_adr026+exact_leaf | sinônimo de folha da ADR-026 espelhado do motor: confirmar que a navegação implícita (sem `>`) o aplica ao vivo |
| M-32.2 | [ATT] | `mutation` | revisar | 1 | Administração > Parâmetros > Certificados digitais | **Configurações > Parametrizações (+ aba/seção "Certificados digitais")** | canonical_equivalence / explicit_equivalence | a última auditoria já aplicou ao vivo a mesma cadeia "Configurações > Parametrizações" (passo 1); o bloqueio pode ser da aba/seção "Certificados digitais" |
| M-70.1 | [ATT] | `mutation` | revisar | 1 | Parâmetros Técnicos / Layout | **Configurações > Tabela de custas > Parâmetros** | closed_semantic / closed_semantic | destino só por pontuação semântica (Camada 3), sem equivalência literal do caminho/tela documentados |
| V-2.2.3 | [ATT] | `mutation` | revisar | 1 | Cálculo de ITBI e Detalhamento de Custas do Registro de Imóveis via Tabela Auxiliar | **Configurações > Tabela de custas > Cálculos** | closed_semantic / closed_semantic | os passos 1–3 não citam tela: destino inferido só pelo título/passos (Camada 3) |

Comandos sugeridos (o Worker Pool separa sozinho as filas `read_only`/`mutation`):

```powershell
# Fila A completa (14), incluindo as que pedem revisão do destino
npx --prefix auditoria tsx auditoria/src/cli.ts --routines C-CERT-04,C-SELO-02,C-SELO-09,M-12.0,C-CENTRAL-06,C-LIVRO-06,C-LIVRO-07,D-3.41,D-3.75,M-14.1,M-14.2,M-32.2,M-70.1,V-2.2.3 --dry-run-mutations
```

## Fila B — Bloqueio pós-navegação (71)

| Rotina | Tag | Passo | Causa | Motivo da fila |
|---|---|---:|---|---|
| C-ACESSO-02 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/usuario/alterar/1) |
| C-ACESSO-03 | [ATT] | 4 | `missing_target` | bloqueio no passo 4 (> 3): pós-navegação (missing_target) |
| C-ACESSO-04 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/usuario/alterar/1) |
| C-ACESSO-08 | [ATT] | 4 | `missing_target` | bloqueio no passo 4 (> 3): pós-navegação (missing_target) |
| C-CENTRAL-03 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/participacaoNotas) |
| C-CENTRAL-04 | [ATT][CCC] | 4 | `menu_path` | bloqueio no passo 4 (> 3): pós-navegação (menu_path) |
| C-CENTRAL-05 | [XRX] | 3 | `cross_routine` | bloqueio no passo 3 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| C-CENTRAL-08 | [ATT][CCC] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/comunicacoes) |
| C-CENTRAL-09 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/protocolo/cadastrar) |
| C-CENTRAL-10 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| C-CENTRAL-11 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| C-CENTRAL-12 | [CCC][XRX] | 7 | `cross_routine` | bloqueio no passo 7 (> 3): pós-navegação (cross_routine) |
| C-CERT-01 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/certidoesServicos/cadastrar) |
| C-CERT-03 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/certidoesServicos/cadastrar) |
| C-FIRMA-02 | [ATT] | 1 | `missing_target` | caminho(s) dos passos 1–1 já exato(s) no catálogo: o bloqueio é posterior à navegação (missing_target) |
| C-FIRMA-03 | [ATT] | 4 | `missing_target` | bloqueio no passo 4 (> 3): pós-navegação (missing_target) |
| C-FIRMA-04 | [XRX] | 3 | `cross_routine` | bloqueio no passo 3 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| C-LIVRO-01 | [XRX] | 1 | `empty_grid` | bloqueio no passo 1 por grade vazia (tela alcançada) |
| C-LIVRO-02 | [XRX] | 1 | `empty_grid` | bloqueio no passo 1 por grade vazia (tela alcançada) |
| C-LIVRO-03 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| C-SELO-03 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/seloDigital) |
| C-SELO-04 | [ATT] | 5 | `menu_path` | bloqueio no passo 5 (> 3): pós-navegação (menu_path) |
| C-SELO-05 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| C-SELO-06 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| C-SELO-07 | [XRX] | 1 | `cross_routine` | bloqueio no passo 1 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| C-SELO-10 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/natureza) |
| D-2.4 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/categoria/cadastrar) |
| D-2.7 | [ATT] | 6 | `missing_target` | bloqueio no passo 6 (> 3): pós-navegação (missing_target) |
| D-3.2 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/dashboard/envioRegistro) |
| D-3.3 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/ficha/cadastrar) |
| D-3.14 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/certidoesServicos/cadastrar) |
| D-3.35 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| D-9.0 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| M-9.0 | [ATT] | 4 | `missing_target` | bloqueio no passo 4 (> 3): pós-navegação (missing_target) |
| M-9.2 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| M-9.3 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| M-13.0 | [ATT] | 5 | `missing_target` | bloqueio no passo 5 (> 3): pós-navegação (missing_target) |
| M-16.1 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/configuracoes) |
| M-16.2 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/configuracoes) |
| M-16.4 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/configuracoes) |
| M-16.5 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/configuracoes) |
| M-16.8 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/configuracoes) |
| M-16.10 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/configuracoes) |
| M-16.13 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/configuracoes) |
| M-22.0 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/livro/cadastrar) |
| M-24.0 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/tipoDocumento/cadastrar) |
| M-26.0 | [ATT] | 5 | `missing_target` | bloqueio no passo 5 (> 3): pós-navegação (missing_target) |
| M-42.0 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/modeloEtiqueta) |
| M-61.0 | [ATT] | 4 | `missing_target` | bloqueio no passo 4 (> 3): pós-navegação (missing_target) |
| M-63.0 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/grupoItem/cadastrar) |
| M-69.0 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/modeloEtiqueta) |
| M-70.0 | [ATT] | 4 | `missing_target` | bloqueio no passo 4 (> 3): pós-navegação (missing_target) |
| R-1.6 | [ATT] | 1 | `missing_target` | caminho(s) dos passos 1–1 já exato(s) no catálogo: o bloqueio é posterior à navegação (missing_target) |
| R-3.0 | [XRX] | 5 | `cross_routine` | bloqueio no passo 5 (> 3): pós-navegação (cross_routine) |
| R-10.0 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/pedidoFirmas/cadastrar) |
| R-11.0 | [ATT] | 2 | `missing_target` | bloqueio no passo 2 por missing_target sem navegação no próprio passo; tela alcançada (#/comunicacoes/cadastrar) |
| R-17.0 | [XRX] | 3 | `empty_grid` | bloqueio no passo 3 por grade vazia (tela alcançada) |
| R-23.0 | [XRX] | 4 | `empty_grid` | bloqueio no passo 4 (> 3): pós-navegação (empty_grid) |
| R-26.0 | [ATT] | 2 | `missing_target` | caminho(s) dos passos 1–2 já exato(s) no catálogo: o bloqueio é posterior à navegação (missing_target) |
| R-30.0 | [XRX] | 3 | `cross_routine` | bloqueio no passo 3 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| R-36.0 | [ATT] | 3 | `missing_target` | caminho(s) dos passos 1–3 já exato(s) no catálogo: o bloqueio é posterior à navegação (missing_target) |
| V-1.0 | [ATT] | 3 | `missing_target` | bloqueio no passo 3 por missing_target sem navegação no próprio passo; tela alcançada (#/sinalPublico/cadastrar) |
| V-3.0 | [XRX] | 2 | `empty_grid` | bloqueio no passo 2 por grade vazia (tela alcançada) |
| V-6.2.3 | [ATT] | 5 | `missing_target` | bloqueio no passo 5 (> 3): pós-navegação (missing_target) |
| V-7.0.4 | [ATT] | 5 | `missing_target` | bloqueio no passo 5 (> 3): pós-navegação (missing_target) |
| V-7.3.2 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| V-CCA.1.1 | [ATT] | 5 | `missing_target` | bloqueio no passo 5 (> 3): pós-navegação (missing_target) |
| V-CCA.2.2 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |
| V-CCA.2.3 | [XRX] | 4 | `cross_routine` | bloqueio no passo 4 (> 3): pós-navegação (cross_routine) |
| V-CCA.3.1 | [XRX] | 4 | `cross_routine` | bloqueio no passo 4 (> 3): pós-navegação (cross_routine) |
| V-CCA.3.2 | [XRX] | 2 | `cross_routine` | bloqueio no passo 2 por cross_routine sem navegação no próprio passo; rota do bloqueio não registrada (sem indício de tela não alcançada) |

## Fila C — Recurso/módulo sem equivalente na 06.05.02 (37)

### C1 — Caminho/tela citado sem equivalente ou homônimo indecidível (11)

| Rotina | Tag | Passo | Documentado | Classe | Laudo: candidatos mais próximos no catálogo |
|---|---|---:|---|---|---|
| C-CENTRAL-01 | [XRX] | 2 | Informações Adicionais | `no_equivalent` | Administração > Comunicações > COAF ; Dashboard > Comunicações ; Administração > Comunicações > Outras comunicações ; Dashboard > Envio para Registro ; Administração > Envio de escrituras para Registro |
| C-CENTRAL-13 | [ATT] | 2 | Administração > Comunicações > SIRC / Comunicações Previdenciárias | `no_equivalent` | Administração > Comunicações > Outras comunicações |
| C-CENTRAL-14 | [ATT] | 2 | Integração Externa / ONR - SAEC | `no_equivalent` | Administração > Envio de escrituras para Registro ; Dashboard > Envio para Registro ; Notas > Consultas > Protocolos ; Dashboard > Agenda de protocolos ; Relatórios > Transferência de imóveis |
| C-FIRMA-05 | [ATT] | 1 | Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV) | `no_equivalent` | Firmas > Cadastros > Tipo de documento - Termo de comparecimento ; Firmas > Consultas > Reconhecimentos de firmas ; Firmas > Consultas > Serviços praticados ; Firmas > Reconhecimento de firmas |
| C-LIVRO-08 | [ATT] | 1 | Administração > Rotinas Especiais > Consolidação de Movimentações | `no_equivalent` | Administração > Controle de Livros ; Administração > Mensalistas > Lançamentos manuais |
| D-3.60 | [ATT] | 1 | Notas > Cadastros > Livro para Consumo | `no_equivalent` | Notas > Consultas > Índice de escrituras e procurações ; Notas > Novo protocolo |
| M-29.1 | [ATT] | 1 | Firmas > Consultas > Termos de comparecimento | `no_equivalent` | Firmas > Consultas > Reconhecimentos de firmas |
| M-32.0 | [ATT] | 1 | Administração > Comunicações > Lotes de comunicação | `no_equivalent` | Administração > Comunicações > Outras comunicações |
| M-34.0 | [ATT] | 1 | Notas > Cadastros auxiliares > Tipos de anexo | `no_equivalent` | Notas > Consultas > Movimentação financeira por protocolo |
| M-35.0 | [ATT] | 1 | Notas > Cadastros auxiliares > Tipos de anexo | `no_equivalent` | Notas > Novo protocolo ; Notas > Consultas > Certidões e serviços ; Notas > Certidões e serviços em aberto ; Notas > Nova certidão e serviço |
| V-2.0 | [ATT] | 1 | Orion Stock | `no_equivalent` | Administração > Controle de Estoque > Aquisição ; Administração > Controle de Estoque > Cadastros > Produto ; Relatórios > Auditoria Selos TJ - Orion |

### C2 — Tela pressuposta: os passos 1–3 não citam tela e o título não aponta destino único (documentado = título da rotina) (16)

| Rotina | Tag | Passo | Documentado | Classe | Laudo: candidatos mais próximos no catálogo |
|---|---|---:|---|---|---|
| C-CERT-05 | [ATT] | 1 | Resolução de Conflito de Cache de Navegador no Módulo de Nova Certidão | `no_equivalent` | Notas > Nova certidão e serviço ; Administração > Certidões solicitadas ; Notas > Consultas > Certidões e serviços ; Notas > Certidões e serviços em aberto ; Configurações > Dados do cartório |
| C-LIVRO-04 | [ATT] | 2 | Reinício dos Microsserviços de Renderização e Conversão Documental (Docker) | `no_equivalent` | Configurações > Dados do cartório |
| D-3.16 | [ATT] | 1 | Gerar Certidão no Editor de texto | `no_equivalent` | Notas > Consultas > Editor ; Administração > Certidões solicitadas ; Notas > Consultas > Certidões e serviços ; Firmas > Abertura de pedido ; Notas > Certidões e serviços em aberto |
| D-3.27 | [ATT] | 1 | Consultar Central de Indisponibilidade no Livro (CENIB) | `no_equivalent` | Administração > Comissões > Consulta ; Administração > Controle de Estoque > Consultas ; Administração > Controle de Livros ; Relatórios > Livro Protocolo ; Relatórios > Índice por livro |
| D-3.29 | [ATT] | 1 | Solicitar Certidão Dentro de Protocolo | `no_equivalent` | Notas > Consultas > Protocolos ; Administração > Certidões solicitadas ; Notas > Protocolos em aberto ; Relatórios > Livro Protocolo ; Notas > Certidões e serviços em aberto |
| M-51.3 | [ATT] | 1 | Como Realizar a Qualificação de Partes em um Protocolo | `no_equivalent` | Notas > Consultas > Protocolos ; Administração > Cadastro de Pessoas Jurídicas ; Configurações > Cadastros auxiliares > Tipo de documento ; Firmas > Consultas > Reconhecimentos de firmas ; Firmas > Reconhecimento de firmas |
| M-54.2 | [ATT] | 1 | Como Realizar a Busca do Ato Original em um Pedido de Certidão | `no_equivalent` | Administração > Certidões solicitadas ; Notas > Consultas > Certidões e serviços ; Dashboard > Atos Protocolares ; Firmas > Abertura de pedido ; Relatórios > Atos Incompletos |
| M-54.3 | [ATT] | 1 | Como Lançar as Custas em um Pedido de Certidão | `no_equivalent` | Configurações > Tabela de custas > Itens ; Notas > Consultas > Certidões e serviços ; Administração > Certidões solicitadas ; Notas > Certidões e serviços em aberto ; Notas > Nova certidão e serviço |
| R-1.4 | [ATT] | 1 | Funcionalidades da Barra Superior (Selo Digital, Alertas e Calendário) | `no_equivalent` | Administração > Comunicações > Selo digital ; Administração > Calendário ; Dashboard > Comunicações ; Administração > Comunicações > Auditoria de Selos ; Relatórios > Demonstrativo financeiro dos selos digitais |
| V-2.2.2 | [ATT] | 1 | Configuração de Atos Notariais, Quantidade e Base de Cálculo no Orçamento Completo | `no_equivalent` | Configurações > Tabela de custas > Cálculos ; Configurações > Tabela de custas > Itens ; Configurações > Cadastros auxiliares > Natureza ; Notas > Orçamento completo ; Notas > Consultas > Orçamentos |
| V-2.3.1 | [ATT] | 1 | Edição de Custas do Registro de Imóveis e Adição de Múltiplos Atos no Orçamento Completo | `no_equivalent` | Configurações > Tabela de custas > Cálculos ; Notas > Orçamento completo ; Notas > Consultas > Orçamentos ; Administração > Envio de escrituras para Registro ; Dashboard > Atos Protocolares |
| V-3.1.3 | [ATT] | 1 | Identificação e Reaproveitamento de Dados do Solicitante para Recibo de Protocolo | `no_equivalent` | Notas > Consultas > Protocolos ; Configurações > Cadastros auxiliares > Tipo de documento ; Configurações > Cadastros auxiliares > Situação do protocolo ; Configurações > Dados do cartório ; Dashboard > Agenda de protocolos |
| V-3.4.6 | [ATT] | 1 | Gestão de Protocolos com Assinaturas Pendentes e Estorno de Recolhimento | `no_equivalent` | Administração > Comunicações > Recolhimento ; Notas > Consultas > Protocolos ; Configurações > Cadastros auxiliares > Situação do protocolo ; Dashboard > Agenda de protocolos ; Firmas > Cadastros > Cartão de assinatura |
| V-7.4.2 | [ATT] | 1 | Consulta e Inserção de Hashes da CNIB (Central de Indisponibilidade) no Livro | `no_equivalent` | Administração > Comissões > Consulta ; Administração > Controle de Estoque > Consultas ; Relatórios > Livro Protocolo ; Notas > Consultas > Editor ; Notas > Consultas > Protocolos |
| V-7.5.3 | [ATT] | 1 | Desbloqueio e Controle de Acesso para Edição de Livros e Atos Já Impressos | `no_equivalent` | Configurações > Cadastros auxiliares > Tipo de documento ; Administração > Controle de Livros ; Notas > Consultas > Editor ; Configurações > Modelos de impressão > Configuração de impressão ; Configurações > Cadastros auxiliares > Documento apresentado |
| V-CCA.1.2 | [ATT] | 1 | Gerenciamento de Profissões, Contatos, Endereços e Representação de Pessoa Jurídica no Cartão de Assinatura | `no_equivalent` | Firmas > Cadastros > Cartão de assinatura ; Administração > Cadastro de Pessoas Jurídicas ; Configurações > Cadastros auxiliares > Pessoa física > Profissão ; Configurações > Cadastros auxiliares > Tipo de endereço ; Configurações > Cadastros auxiliares > Tipo de e-mail |

### C3 — Conteúdo defasado pós-pouso: a rota foi resolvida e clicada ao vivo, mas a Camada 4 (ADR-037) provou que a tela real não tem os elementos dos passos seguintes (10)

| Rotina | Tag | Passo | Documentado | Classe | Laudo: candidatos mais próximos no catálogo |
|---|---|---:|---|---|---|
| C-ACESSO-06 | [ATT] | 1 | Configurações > Grupos e Perfis de Acesso \| Notas > Protocolo > Operações Básicas | `—` | nenhum radical em comum |
| C-ACESSO-07 | [ATT] | 1 | Configurações > Grupos e Perfis de Acesso \| Balcão de Firmas > Consultas e Relatórios | `—` | nenhum radical em comum |
| C-FIRMA-06 | [ATT] | 1 | Configurações > Parâmetros de NFS-e > Regras de Balcão | `—` | nenhum radical em comum |
| C-FIRMA-07 | [ATT] | 1 | Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas | `—` | nenhum radical em comum |
| C-FIRMA-08 | [ATT] | 2 | Configurações > Parâmetros Gerais > Armazenamento e GED | `—` | nenhum radical em comum |
| C-LIVRO-05 | [ATT] | 1 | Livros > Gestão de Livros Notariais | `—` | nenhum radical em comum |
| C-SELO-01 | [ATT] | 1 | Módulos > Selo Digital > Auditoria / Conferência Semanal | `—` | nenhum radical em comum |
| D-3.15 | [ATT] | 1 | Notas > Certidões > Consulta de Certidões | `—` | nenhum radical em comum |
| M-54.1 | [ATT] | 1 | Notas > Pedido de certidão | `—` | nenhum radical em comum |
| V-7.2.1 | [ATT] | 1 | Editor | `—` | nenhum radical em comum |


## `[DDD]` e `[CCC]` relatadas (fora das filas de menu) (19)

| Rotina | Tag | Navegação 1–3 |
|---|---|---|
| C-ACESSO-05 | [DDD] | P2 no_equivalent: Docker Desktop |
| C-CENTRAL-02 | [CCC] | P2 closed_semantic: Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos |
| C-CENTRAL-07 | [DDD] | sem navegação citada |
| C-CONFIG-01 | [DDD] | sem navegação citada |
| C-CONFIG-02 | [DDD] | P1 closed_semantic: Painel de Controle > Dispositivos e Impressoras |
| C-CONFIG-03 | [DDD] | P1 no_equivalent: Configurações > Impressão de Etiquetas |
| C-CONFIG-04 | [DDD] | sem navegação citada |
| C-CONFIG-05 | [DDD] | sem navegação citada |
| C-CONFIG-06 | [DDD] | P2 no_equivalent: Gerenciador de Tarefas ; P3 no_equivalent: Opções de Energia > Alterar configurações do plano > Alterar configurações de energia avançadas > Configurações USB > Configuração de suspensão seletiva USB |
| C-CONFIG-07 | [DDD] | P1 no_equivalent: Gerenciador de Tarefas |
| C-CONFIG-08 | [DDD] | P2 closed_semantic: Administrador de Fonte de Dados ODBC (32 bits) |
| C-FIRMA-01 | [DDD] | sem navegação citada |
| C-SELO-08 | [DDD] | sem navegação citada |
| D-3.6 | [DDD] | P2 canonical_equivalence: Firmas > Cadastros > Digitalização em Lote > Por Código de Barras do Papel |
| M-9.1 | [DDD] | P1 closed_semantic: Fotos e Biometria |
| M-16.7 | [DDD] | P1 canonical_equivalence: Administração > Parâmetros > Atalhos do teclado |
| R-32.1 | [DDD] | sem navegação citada |
| V-2.3.2 | [DDD] | sem navegação citada |
| V-CCA.1.3 | [DDD] | sem navegação citada |

## Rotinas validadas com navegação 1–3 não exata (29 ocorrências em 24 rotinas)

Rotinas sem tag cujo manual cita, nos passos 1–3, caminho/tela que não é literalmente idêntico ao catálogo. A auditoria ao vivo as validou (a navegação normalizada ou a cura absorveu a diferença), mas o manual deve ser alinhado à grafia real.

| Rotina | Passo | Tipo | Documentado | Classe | Catálogo | Diferença literal |
|---|---:|---|---|---|---|---|
| C-CERT-02 | 1 | caminho | Notas > Protocolo | `single_segment` | Notas > Consultas > Protocolos | — |
| D-3.9 | 1 | caminho | Firmas > Consultas > Consulta de Reconhecimento de Firmas | `canonical_equivalence` | Firmas > Consultas > Reconhecimentos de firmas | — |
| D-3.11 | 1 | caminho | Firmas > Reconhecimento de Firmas | `exact_with_spelling_drift` | Firmas > Reconhecimento de firmas | "Reconhecimento de Firmas" × "Reconhecimento de firmas" (caixa) |
| D-4.0 | 1 | caminho | Firmas > Reconhecimento de Firmas | `exact_with_spelling_drift` | Firmas > Reconhecimento de firmas | "Reconhecimento de Firmas" × "Reconhecimento de firmas" (caixa) |
| M-8.0 | 1 | caminho | Firmas > Cadastro > Cartão de assinatura | `exact_with_spelling_drift` | Firmas > Cadastros > Cartão de assinatura | "Cadastro" × "Cadastros" (plural_flexao) |
| M-15.0 | 1 | caminho | Administração > Selo Digital | `single_segment` | Administração > Comunicações > Selo digital | — |
| M-16.6 | 1 | caminho | Administração > Parâmetros > Campos obrigatórios | `canonical_equivalence` | Configurações > Parametrizações + "Campos obrigatórios" | — |
| M-25.0 | 1 | caminho | Administração > Parâmetros > Configurações de impressão | `canonical_equivalence` | Configurações > Parametrizações + "Configurações de impressão" | — |
| M-36.0 | 1 | caminho | Notas > Cadastros auxiliares > Documento apresentado | `canonical_equivalence` | Configurações > Cadastros auxiliares > Documento apresentado | — |
| M-40.0 | 1 | caminho | Notas > Cadastros auxiliares > Alíquota | `canonical_equivalence` | Configurações > Cadastros auxiliares > Alíquotas | — |
| M-40.0 | 1 | caminho | Administração > Parâmetros > Alíquotas | `canonical_equivalence` | Configurações > Parametrizações + "Alíquotas" | — |
| M-41.0 | 1 | caminho | Administração > Cadastros auxiliares > Área de atuação | `canonical_equivalence` | Configurações > Cadastros auxiliares > Pessoa física > Área de Atuação | — |
| M-41.0 | 1 | caminho | Firmas > Cadastros auxiliares > Área de atuação | `single_segment` | Configurações > Cadastros auxiliares > Pessoa física > Área de Atuação | — |
| M-43.0 | 1 | caminho | Notas > Cadastros auxiliares > Perfil de partes | `canonical_equivalence` | Configurações > Cadastros auxiliares > Perfil de partes | — |
| M-54.0 | 1 | caminho | Notas > Pedido de certidão | `canonical_equivalence` | Notas > Nova certidão e serviço | — |
| M-60.0 | 1 | caminho | Notas > Cadastros auxiliares > Naturezas | `canonical_equivalence` | Configurações > Cadastros auxiliares > Natureza | — |
| M-62.0 | 1 | caminho | Administração > Tabela de custas > Grupos de itens | `single_segment` | Configurações > Tabela de custas > Grupo de item | — |
| M-62.0 | 1 | caminho | Notas > Cadastros auxiliares > Grupo de itens | `canonical_equivalence` | Configurações > Tabela de custas > Grupo de item | — |
| M-66.0 | 1 | caminho | Administração > Tabela de custas > Outros serviços | `single_segment` | Configurações > Cadastros auxiliares > Outros serviços | — |
| M-66.0 | 1 | caminho | Caixa > Cadastros auxiliares > Outros serviços | `single_segment` | Configurações > Cadastros auxiliares > Outros serviços | — |
| M-67.0 | 1 | caminho | Administração > Cadastros auxiliares > Área de atuação | `canonical_equivalence` | Configurações > Cadastros auxiliares > Pessoa física > Área de Atuação | — |
| M-68.0 | 1 | caminho | Administração > Cadastros auxiliares > Área de atuação | `canonical_equivalence` | Configurações > Cadastros auxiliares > Pessoa física > Área de Atuação | — |
| R-1.1 | 1 | caminho | Firmas > Reconhecimento de Firmas | `exact_with_spelling_drift` | Firmas > Reconhecimento de firmas | "Reconhecimento de Firmas" × "Reconhecimento de firmas" (caixa) |
| R-1.1 | 1 | caminho | Firmas > Balcão de Firmas | `canonical_equivalence` | Firmas > Reconhecimento de firmas | — |
| R-2.0 | 1 | caminho | Firmas > Balcão de Firmas | `canonical_equivalence` | Firmas > Reconhecimento de firmas | — |
| R-4.0 | 1 | caminho | Configurações > Geral > Cadastros Auxiliares > Participação | `single_segment` | Configurações > Cadastros auxiliares > Participação | — |
| R-18.0 | 1 | caminho | Configurações > Geral > Cadastros Auxiliares > Outros Serviços | `single_segment` | Configurações > Cadastros auxiliares > Outros serviços | — |
| V-CCA.2.1 | 1 | caminho | Firmas > Cadastros > Cartão de Assinatura | `exact_with_spelling_drift` | Firmas > Cadastros > Cartão de assinatura | "Cartão de Assinatura" × "Cartão de assinatura" (caixa) |
| V-CCA.3.3 | 1 | caminho | Firmas > Reconhecimento de Firmas | `exact_with_spelling_drift` | Firmas > Reconhecimento de firmas | "Reconhecimento de Firmas" × "Reconhecimento de firmas" (caixa) |

## Mapa preventivo do KB — rotinas ainda não auditadas (302)

| Situação dos passos 1–3 | Rotinas |
|---|---:|
| Toda navegação exata no catálogo | 26 |
| Precisa de equivalência/deriva/segmento único/semântica fechada (sem pendência) | 138 |
| Com navegação sem equivalente ou ambígua | 63 |
| Sem navegação citada nos passos 1–3 | 75 |

| Rotina | Módulo | Exato | Deriva | Equiv. | Seg. único | Sem. fechada | Ambíguo | Sem equiv. | Destaque |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| C-ATOS-01 | notas | 0 | 0 | 1 | 1 | 0 | 0 | 0 | P1: Configurações > Cadastros Auxiliares > Naturezas de Atos → Configurações > Cadastros auxiliares > Natureza |
| C-ATOS-02 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| C-ATOS-03 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 2 | P1: Notas > Pesquisa de Atos / Procurações |
| C-ATOS-04 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Configurações > Custas e Emolumentos > Itens da Tabela |
| C-ATOS-05 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 1 | P3: Participações Permitidas / Papéis de Partes |
| C-ATOS-06 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Cadastros > Pessoas Físicas → Configurações > Cadastros auxiliares > Pessoa física |
| C-ATOS-07 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Configurações > Custas e Emolumentos > Itens da Tabela → Configurações > Tabela de custas > Itens |
| C-ATOS-08 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P2: Administração > Sessões Ativas e Bloqueios |
| C-FIN-01 | caixa | 0 | 0 | 0 | 0 | 2 | 0 | 0 | P1: Guias > Guias de Recolhimento Definitivas (PEX) → Administração > Comunicações > Recolhimento |
| C-FIN-02 | caixa | 0 | 0 | 1 | 1 | 0 | 0 | 0 | P1: Configurações > Perfis de Acesso / Usuários → Configurações > Usuários |
| C-FIN-03 | caixa | 0 | 0 | 0 | 1 | 1 | 0 | 0 | P1: Orion Caixa → Relatórios > Fechamento de caixa |
| C-FIN-04 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Administração > Mensalistas > Mensalistas |
| C-FIN-05 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Relatórios > Notas Fiscais / Listagem de RPS → Administração > Comunicações > RPS |
| C-FIN-06 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 1 | P3: Controle de Caixa > Recebimento de Protocolo |
| C-FIN-07 | caixa | 0 | 0 | 0 | 0 | 2 | 0 | 0 | P1: Relatórios > Pedidos Pendentes → Relatórios > Fechamento de caixa |
| C-FIN-08 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P2: Movimentação > Sangria / Retirada de Caixa |
| C-FIN-09 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| C-FIN-10 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Movimentações de Caixa |
| C-FIN-11 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P2: Faturamento > Mensalistas > Conta Corrente |
| C-FIN-12 | caixa | 0 | 0 | 1 | 1 | 0 | 0 | 0 | P1: Administração > Parâmetros > Tipos de Movimentação → Configurações > Parametrizações |
| C-FIN-13 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Usuários / Perfis de Acesso → Configurações > Usuários |
| C-FIN-14 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Configurações > Parâmetros de Faturamento > Comissões / Convênios → Administração > Comissões |
| C-GERAL-01 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| C-GERAL-02 | geral | 0 | 0 | 0 | 1 | 1 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| C-GERAL-03 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| C-GERAL-04 | geral | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Balcão de Firmas > Fichas / Cartões de Assinatura → Firmas > Cadastros > Cartão de assinatura |
| C-GERAL-05 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Tabelas > Custas e Emolumentos |
| C-GERAL-06 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| C-GERAL-07 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 1 | P2: Bens / Imóveis |
| C-GERAL-08 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| C-GERAL-09 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| C-MINUTA-01 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| C-MINUTA-02 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 2 | P1: Partes |
| C-MINUTA-03 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Notas > Consultas > Editor |
| C-MINUTA-04 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Configurações > Modelos de Minutas > Cadastro de Modelos |
| C-MINUTA-05 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P2: Notas > Protocolo → Notas > Consultas > Protocolos |
| C-MINUTA-06 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Configurações > Modelos de Minutas > Cadastro de Modelos → Configurações > Usuários |
| D-1.2 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Dados de Cartório → Configurações > Dados do cartório |
| D-1.3 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Configurações > Modelo de Impressão → Configurações > Modelos de impressão |
| D-1.4 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Configurações > Cadastros Auxiliares > Forma de Pagamento → Configurações > Cadastros auxiliares > Formas de pagamento |
| D-1.5 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Configurações > Cadastros Auxiliares > Tipos de Saída |
| D-1.6 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Configurações > Cadastros Auxiliares > Outros Serviços → Configurações > Cadastros auxiliares > Outros serviços |
| D-1.7 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| D-1.8 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Parametrizações > Integrações → Configurações > Parametrizações |
| D-1.9 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Configurações > Impressora e Modelos Padrão |
| D-1.10 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Configurações > Painel de Atalhos |
| D-1.11 | caixa | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Configurações > Cadastros Auxiliares > Conta Bancária → Configurações > Cadastros auxiliares > Banco |
| D-1.12 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Parametrizações > Integração SGA → Configurações > Parametrizações |
| D-1.13 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Parametrizações > Inteligência Artificial → Configurações > Parametrizações |
| D-1.14 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Histórico de Ações |
| D-1.15 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Relatórios > Relatório de Caixa |
| D-1.16 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Relatórios > Fechamento de Caixa → Relatórios > Fechamento de caixa |
| D-1.17 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Relatórios > Controle de Cheques |
| D-1.18 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Relatórios > Provedor de Pagamentos |
| D-1.19 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Controle de Caixa > Abertura de Caixa |
| D-1.20 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Controle de Caixa > Suprimento e Sangria |
| D-1.21 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Controle de Caixa > Suprimento e Sangria |
| D-1.22 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 2 | P1: Administração > Controle de Caixa > Suprimento e Sangria |
| D-1.23 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Administração > Menu de Pagamentos > Certidões e Serviços → Notas > Consultas > Certidões e serviços |
| D-1.24 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Menu de Pagamentos > Notas |
| D-2.1 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-2.2 | caixa | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Configurações > Usuários e Permissões > Grupos de Permissões → Configurações > Usuários |
| D-2.3 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Configurações > Usuários e Permissões > Usuários → Configurações > Usuários |
| D-2.5 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Configurações > Cadastros Auxiliares > Fornecedor |
| D-2.6 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Configurações > Cadastros Auxiliares > Grupos de Distribuição → Administração > Controle de Estoque > Cadastros > Grupos de distribuição |
| D-2.8 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Configurações > Cadastros Auxiliares > Tipo de Documento → Configurações > Cadastros auxiliares > Tipo de documento |
| D-2.9 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Configurações > Cadastros Auxiliares > Unidade de Medida → Administração > Controle de Estoque > Cadastros > Unidade de medida |
| D-2.10 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Dados de Cartório → Configurações > Dados do cartório |
| D-2.11 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Configurações > Modelos de Impressão → Configurações > Modelos de impressão |
| D-2.12 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| D-2.13 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Consultas > Histórico de Aquisição |
| D-2.14 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Administração > Distribuição → Administração > Controle de Estoque > Distribuição |
| D-3.1 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Notas > Dashboard de Protocolos → Notas > Consultas > Protocolos |
| D-3.4 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Firmas > Cadastros > Termo de Comparecimento |
| D-3.5 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P2: Firmas > Cadastros > Digitalização em Lote > Por Sequência de Cartão → Firmas > Cadastros > Digitalização em lote |
| D-3.7 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P2: Firmas > Reconhecimento de Firmas > Digitalização de DUT → Firmas > Reconhecimento de firmas |
| D-3.8 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Cadastros > Digitalização em Lote > Livros → Administração > Controle de Livros |
| D-3.10 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Firmas > Consultas > Serviços Praticados → Firmas > Consultas > Serviços praticados |
| D-3.12 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Orçamento > Orçamento Rápido → Notas > Orçamento rápido |
| D-3.13 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Orçamento > Orçamento Completo → Notas > Orçamento completo |
| D-3.17 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Consultas > Consulta de Certidões e Serviços → Notas > Consultas > Certidões e serviços |
| D-3.18 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Consultas > Consulta de Certidões e Serviços → Notas > Consultas > Certidões e serviços |
| D-3.19 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo > Novo Protocolo → Notas > Novo protocolo |
| D-3.20 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.21 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.22 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Notas > Consultas > Protocolos |
| D-3.23 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.24 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Notas > Consultas > Consulta Avançada de Protocolos → Notas > Consultas > Protocolos |
| D-3.25 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Notas > Consultas > Protocolos |
| D-3.26 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Notas > Consultas > Protocolos |
| D-3.28 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.30 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.31 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.32 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Parametrizações > Trâmites do Protocolo → Configurações > Parametrizações |
| D-3.33 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.34 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.36 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.37 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.38 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Editor de Minutas |
| D-3.39 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.40 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.42 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| D-3.43 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Notas > Consultas > Consulta Avançada de Protocolos → Notas > Consultas > Protocolos |
| D-3.44 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Notas > Consultas > Índices de Protocolos → Notas > Consultas > Protocolos |
| D-3.45 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Notas > Consultas > Saldos e Pendências Financeiras → Notas > Consultas > Protocolos |
| D-3.46 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Notas > Consultas > Consultar Editor e Documentos Gerados → Notas > Consultas > Editor |
| D-3.47 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Parametrizações > Natureza de Ato → Configurações > Parametrizações |
| D-3.48 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Configurações > Modelos de Minuta/Livro/Traslado |
| D-3.49 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Parametrizações > Tabela de Custas → Configurações > Parametrizações |
| D-3.50 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Ajuda > Change Log |
| D-3.51 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.52 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Menu de Pagamentos > Notas → Notas > Consultas > Protocolos |
| D-3.53 | caixa | 1 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Consultas > Consulta de Selos Digitais → Administração > Comunicações > Selo digital |
| D-3.54 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Administração > Comunicar Selos ao TJ |
| D-3.55 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Administração > Gerenciar Comissões de Escreventes |
| D-3.56 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.57 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Relatórios > PEX |
| D-3.58 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Relatórios > Recolhimento Diário → Relatórios > Recolhimento diário |
| D-3.59 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Relatórios > Recolhimento Resumido → Relatórios > Recolhimento resumido |
| D-3.61 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Mensalistas > Cadastros de Mensalistas → Administração > Mensalistas > Mensalistas |
| D-3.62 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Mensalistas > Gerar Fatura de Mensalista |
| D-3.63 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P2: Notas > Mensalistas > Importar Arquivo de Retorno |
| D-3.64 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Mensalistas > Manutenção de Fatura |
| D-3.65 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Mensalistas > Visualizar Extrato de Saldo |
| D-3.66 | caixa | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Notas > Administração > Registrar Serviço Interno → Notas > Consultas > Certidões e serviços |
| D-3.67 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Certidões > Consultar Certidões Solicitadas |
| D-3.68 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Administração > Cadastrar Impedimento de Pessoa/Documento |
| D-3.69 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Administração > Importar Arquivo de Protesto ou RC |
| D-3.70 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.71 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.72 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-3.73 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Consultas > Consultar Selos Digitais Gerados |
| D-3.74 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Notas > Relatórios > Livro de Depósito Prévio |
| D-3.76 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Configurações > Parametrizações > Comunicação com TJ → Configurações > Parametrizações |
| D-5.0 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Protocolo → Notas > Consultas > Protocolos |
| D-6.0 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| D-7.0 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| D-8.0 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-1.0 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-2.0 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-3.0 | caixa | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Administração > Mensalistas > Extrato → Administração > Mensalistas > Mensalistas |
| M-4.0 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-5.0 | caixa | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Administração > Comissões > Planos → Administração > Comissões > Planos de comissão |
| M-6.0 | caixa | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Administração > Comissões > Planos → Administração > Comissões > Planos de comissão |
| M-7.0 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Administração > Comissões > Consultas → Administração > Comissões > Consulta |
| M-14.0 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Firmas > Atendimento > Balcão de firmas → Firmas > Reconhecimento de firmas |
| M-14.3 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Balcão de firmas → Firmas > Reconhecimento de firmas |
| M-14.4 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Balcão de firmas → Firmas > Reconhecimento de firmas |
| M-16.3 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Administração > Parâmetros > Parâmetros por estação → Configurações > Parametrizações |
| M-16.9 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Administração > Parâmetros > Comissões e mensalistas → Configurações > Parametrizações |
| M-16.11 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Administração > Parâmetros > Faturamento → Configurações > Parametrizações |
| M-16.12 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Administração > Parâmetros > Protocolo de notas → Configurações > Parametrizações |
| M-17.0 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Firmas > Consultas > Pedidos de firmas |
| M-18.0 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-19.0 | geral | 0 | 0 | 0 | 2 | 0 | 0 | 0 | P1: Firmas > Cadastro > Pessoa jurídica → Administração > Cadastro de Pessoas Jurídicas |
| M-20.0 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Firmas > Cadastro > Pessoa jurídica → Administração > Cadastro de Pessoas Jurídicas |
| M-21.0 | geral | 0 | 0 | 1 | 1 | 0 | 0 | 0 | P1: Firmas > Livros → Administração > Controle de Livros |
| M-23.0 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Firmas > Termo de comparecimento > Tipos de documentos → Configurações > Cadastros auxiliares > Tipo de documento |
| M-27.0 | geral | 0 | 0 | 0 | 2 | 0 | 0 | 0 | P1: Firmas > Cadastro > Impedimentos → Administração > Cadastro de Impedimentos |
| M-29.0 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Firmas > Atendimento > Termo de comparecimento |
| M-29.2 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Gerar Termos em Lote |
| M-30.0 | caixa | 0 | 0 | 0 | 2 | 0 | 0 | 0 | P1: Administração > Financeiro > Formas de pagamento → Configurações > Cadastros auxiliares > Formas de pagamento |
| M-31.0 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Administração > Financeiro > Formas de pagamento → Configurações > Cadastros auxiliares > Formas de pagamento |
| M-32.1 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Firmas > Comunicações > Gerar lote SEFAZ |
| M-32.3 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Firmas > Comunicações > Gerar lote SEFAZ |
| M-33.1 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Faturamento > Extrato de mensalistas |
| M-33.2 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Faturamento > Emissão de faturas |
| M-33.3 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Faturamento > Faturas emitidas |
| M-37.0 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Cadastros auxiliares > Documento apresentado → Configurações > Cadastros auxiliares > Documento apresentado |
| M-38.0 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Cadastros auxiliares > Situação do protocolo → Configurações > Cadastros auxiliares > Situação do protocolo |
| M-39.0 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Cadastros auxiliares > Situação do protocolo → Configurações > Cadastros auxiliares > Situação do protocolo |
| M-44.0 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Cadastros auxiliares > Perfil de partes → Configurações > Cadastros auxiliares > Perfil de partes |
| M-45.0 | notas | 0 | 0 | 0 | 2 | 0 | 0 | 0 | P1: Notas > Orçamentos → Notas > Consultas > Orçamentos |
| M-46.0 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Orçamentos → Notas > Consultas > Orçamentos |
| M-47.0 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Orçamentos → Notas > Consultas > Orçamentos |
| M-48.0 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-49.0 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-51.0 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| M-51.1 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| M-51.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| M-51.4 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| M-51.5 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| M-52.0 | notas | 1 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Notas > Consultas > Consultar protocolos → Notas > Consultas > Protocolos |
| M-53.0 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 2 | P1: Notas > Pedido de certidão > Consultar pedidos de certidão |
| M-56.0 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-57.0 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| M-58.0 | geral | 0 | 0 | 1 | 1 | 0 | 0 | 0 | P1: Administração > Parâmetros > Importação de arquivos → Configurações > Parametrizações |
| M-59.0 | notas | 0 | 0 | 2 | 0 | 0 | 0 | 0 | P1: Notas > Cadastros auxiliares > Espécies → Configurações > Cadastros auxiliares > Espécie |
| M-64.0 | caixa | 0 | 0 | 0 | 1 | 1 | 0 | 0 | P1: Administração > Financeiro > Tipos de movimentação financeira → Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| M-65.0 | caixa | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Administração > Financeiro > Tipos de movimentação financeira → Configurações > Cadastros auxiliares > Tipo de movimentação financeira |
| R-1.0 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| R-1.2 | notas | 1 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| R-1.3 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| R-1.5 | geral | 0 | 0 | 0 | 1 | 1 | 0 | 0 | P1: Administração > Auditoria de Selos → Administração > Comunicações > Auditoria de Selos |
| R-1.7 | geral | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| R-5.0 | notas | 0 | 1 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Consultas > Movimentação Financeira por Protocolo → Notas > Consultas > Movimentação financeira por protocolo |
| R-6.0 | geral | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| R-7.0 | notas | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Orçamento Rápido → Notas > Orçamento rápido |
| R-8.0 | notas | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Orçamento Completo → Notas > Orçamento completo |
| R-9.0 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| R-12.0 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| R-13.0 | notas | 1 | 1 | 0 | 0 | 0 | 0 | 1 | P2: Lançamento de Depósito Prévio |
| R-14.0 | notas | 1 | 0 | 0 | 0 | 1 | 0 | 0 | P2: Notas > Escrituras para Registro → Notas > Consultas > Protocolos |
| R-14.1 | notas | 0 | 0 | 0 | 0 | 1 | 0 | 0 | P1: Dashboard > Comunicações e Obrigações Legais → Dashboard > Comunicações |
| R-14.2 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| R-15.0 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Consultas > Procurações a Vencer |
| R-19.0 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Administração > Comissões > Planos de Comissões → Administração > Comissões > Planos de comissão |
| R-24.0 | geral | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Estoque > Administração > Consumo Manual → Administração > Controle de Estoque > Consumo manual |
| R-28.0 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Orion Caixa > Administração > Pagamentos |
| R-29.0 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Orion Caixa > Administração > Consultas > Recibos |
| R-31.0 | caixa | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Administração > Importação de Arquivos > Novo Arquivo → Administração > Importações de arquivos |
| R-33.0 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| R-34.0 | notas | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Consultas > Índice de Escrituras e Procurações → Notas > Consultas > Índice de escrituras e procurações |
| R-35.0 | caixa | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| R-37.0 | comunicacao | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Cartflow > Pedidos |
| R-37.1 | comunicacao | 1 | 0 | 0 | 1 | 0 | 0 | 0 | P2: Documentos / Anexos → Configurações > Cadastros auxiliares > Tipo de documento |
| R-38.0 | comunicacao | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Administração > Mural de Comunicados |
| V-1.1.1 | notas | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Orçamento Rápido → Notas > Orçamento rápido |
| V-1.1.2 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Orçamento Rápido → Notas > Orçamento rápido |
| V-1.1.3 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Orçamento Rápido → Notas > Orçamento rápido |
| V-2.2.1 | geral | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Orçamento Completo → Notas > Orçamento completo |
| V-2.3.3 | caixa | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-2.4.1 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P2: Gerar Protocolo |
| V-2.4.2 | geral | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Consulta > Orçamentos → Notas > Consultas > Orçamentos |
| V-2.4.3 | caixa | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Consulta > Orçamentos → Notas > Consultas > Orçamentos |
| V-2.4.4 | geral | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Consulta > Orçamentos → Notas > Consultas > Orçamentos |
| V-3.1.1 | notas | 0 | 1 | 0 | 0 | 0 | 0 | 0 | P1: Notas > Novo Protocolo → Notas > Novo protocolo |
| V-3.1.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-3.1.4 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-3.2.1 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Protocolo → Notas > Consultas > Protocolos |
| V-3.2.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-3.2.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-3.2.4 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-3.2.5 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Configurações > Tabela de custas > Cálculos |
| V-3.2.6 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-3.2.7 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P2: Cadastro de Outros Serviços → Configurações > Cadastros auxiliares > Outros serviços |
| V-3.4.1 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Protocolo → Notas > Consultas > Protocolos |
| V-3.4.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P3: Cadastro do Tomador |
| V-3.4.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-3.4.4 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-3.4.5 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.1.1 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Protocolo → Notas > Consultas > Protocolos |
| V-4.1.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.1.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.1.5 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.2.1 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.2.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.2.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.2.4 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.2.5 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.3.1 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Protocolo de Notas |
| V-4.3.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Notas > Consultas > Protocolos |
| V-4.3.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.3.4 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.3.5 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.3.6 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.4.1 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Protocolo → Notas > Consultas > Protocolos |
| V-4.4.2 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Protocolo → Notas > Consultas > Protocolos |
| V-4.4.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-4.4.4 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Notas > Consultas > Protocolos |
| V-4.4.5 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Protocolo → Notas > Consultas > Protocolos |
| V-5.1.1 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Protocolo → Notas > Consultas > Protocolos |
| V-5.1.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-5.1.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-5.1.4 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-5.1.5 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-5.1.6 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-5.2.1 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-5.2.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-6.1.1 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| V-6.1.2 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| V-6.1.3 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| V-6.1.4 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Consultas > Consulta de protocolos → Notas > Consultas > Protocolos |
| V-6.1.5 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Consultas > Consulta de protocolos → Notas > Consultas > Protocolos |
| V-6.2.1 | notas | 0 | 0 | 1 | 0 | 0 | 0 | 0 | P1: Notas > Consultas > Consulta de protocolos → Notas > Consultas > Protocolos |
| V-6.2.2 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| V-6.2.4 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Novo Protocolo → Notas > Novo protocolo |
| V-7.0.1 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| V-7.0.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-7.0.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Notas > Consultas > Editor |
| V-7.0.5 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-7.1.1 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P2: Notas > Protocolo → Notas > Consultas > Protocolos |
| V-7.1.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-7.1.3 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| V-7.2.2 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| V-7.2.3 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| V-7.2.4 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| V-7.3.1 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: Notas > Consultas > Editor |
| V-7.3.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-7.4.1 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-7.4.3 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Notas > Protocolo → Notas > Consultas > Protocolos |
| V-7.5.1 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Editor → Notas > Consultas > Editor |
| V-7.5.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-7.5.4 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Editor → Notas > Consultas > Editor |
| V-7.6.1 | notas | 1 | 0 | 0 | 0 | 0 | 0 | 0 | — |
| V-7.6.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Partes |
| V-7.7.1 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Partes |
| V-7.7.2 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-7.7.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 1 | P1: Imóvel |
| V-7.8.1 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
| V-7.8.2 | notas | 0 | 0 | 0 | 1 | 0 | 0 | 0 | P1: Editor → Notas > Consultas > Editor |
| V-7.8.3 | notas | 0 | 0 | 0 | 0 | 0 | 0 | 0 | sem navegação; Camada 3: sem equivalente |
