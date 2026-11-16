# Arquitetura de Memória Viva & Conhecimento Contínuo (Orion TN)

Este diretório implementa o **Sistema de Conhecimento Contínuo & Memória Viva** do projeto Orion TN no Google Antigravity. Ele atua como a espinha dorsal de memória compartilhada e persistente entre sessões e conversas, impedindo a perda de decisões arquiteturais, padrões de metadados e regras de negócio.

---

## 1. Estrutura de Camadas

```
d:\marcu\Videos\OrionTN\OrionTN/
│
├── GEMINI.md                                  <- CAMADA 1: Regras Mestre do Workspace (Carregamento Automático)
│
└── .agents/memory/
    ├── README.md                              <- Este documento explicativo da arquitetura
    │
    ├── standards/                             <- CAMADA 2: Padrões Técnicos e Normas Vigentes
    │   ├── schema_rotinas_v3.md               <- Especificação canônica do YAML e corpo Markdown
    │   ├── diretrizes_assistente.md           <- Tom de voz, Pirâmide Invertida e anti-padrões
    │   └── glossario_siplan.md                <- Terminologia notarial, produtos e grafias oficiais
    │
    └── decisions/                             <- CAMADA 3: Histórico de Decisões Arquiteturais (ADRs)
        ├── ADR-001-schema-v3-e-piramide-invertida.md
        ├── ADR-002-integracao-webinar-orion-6.md
        └── ADR-003-padronizacao-bunny-video-id.md
```

---

## 2. Como Funciona o Carregamento no Antigravity

1. **Descoberta Automática:** O arquivo `GEMINI.md` localizado na raiz do workspace é descoberto e carregado nativamente pelo Antigravity em **todas** as conversas iniciadas neste projeto.
2. **Autoridade Normativa:** `GEMINI.md` contém os mandamentos inegociáveis, o índice de padrões e a versão ativa do projeto.
3. **Consulta Modular sob Demanda:** Caso o agente precise detalhar uma regra específica, ele navega para as especificações profundas dentro de `.agents/memory/standards/` ou consulta o histórico em `.agents/memory/decisions/`.

---

## 3. Protocolo de Atualização Contínua (Living Memory Protocol)

Sempre que em uma nova conversa o usuário e o agente chegarem a um alinhamento que modifique, aprimore ou revogue uma convenção anterior:

1. **NÃO CONFIE APENAS NO CONTEXTO TEMPORÁRIO:** O contexto da conversa atual será arquivado após a sessão; a memória viva reside nos arquivos persistentes.
2. **REGISTRE UM NOVO ADR:** Crie um novo arquivo numerado em `.agents/memory/decisions/ADR-XXX-[assunto].md` detalhando o contexto, a decisão e as consequências.
3. **ATUALIZE O PADRÃO VIGENTE:** Modifique o arquivo de especificação técnica correspondente em `.agents/memory/standards/`.
4. **SINCRONIZE O `GEMINI.md`:** Se a alteração impactar uma diretriz mestre (como o schema de metadados, regra de vídeo ou formatação), atualize o `GEMINI.md` na raiz imediatamente.
5. **AUDITE O ARQUIVO MESTRE:** Se a decisão demandar alteração no acervo (`doc conhecimento final/OrionTN pos.md`), execute o script de migração para manter 100% da base em conformidade.
6. **CONFIRME AO USUÁRIO:** Informe que a decisão foi perpetuada na memória viva do Antigravity para as próximas conversas.
