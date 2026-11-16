# ADR-004: Incorporação de Casos Reais do Service Desk 0800 e Expansão da Base para Versão 3.1.0

**Data:** 10/11/2026  
**Status:** APROVADO E IMPLEMENTADO  
**Contexto do Problema:**  
A base de conhecimento consolidada contava com 373 rotinas homologadas (Versão 3.0.0), contemplando rotinas gerais (`R-`), transcrições de vídeo (`V-`), manuais (`M-`) e demonstrações/caixa (`D-`). Apesar da amplitude teórica, o suporte registrava milhares de atendimentos com dores práticas de balcão, erros de validação em centrais governamentais (COAF, CENSEC, DOI), divergências de conciliação fiscal e travas de periféricos que não estavam documentadas formalmente nos manuais.  
Para resolver essa lacuna de usabilidade, foram analisados e sanitizados **9.384 chamados reais de suporte** registrados no sistema Ellevo / 0800 da SiplanControl-M (cobrindo 2023 a 2026, com mais de 2.274 soluções técnicas detalhadas).

---

## Decisões Tomadas:

1. **Abordagem Arquitetural Híbrida:**
   - Criação da **Seção Principal 5** no arquivo mestre [`doc conhecimento final/OrionTN pos.md`](file:///d:/marcu/Videos/OrionTN/OrionTN/doc%20conhecimento%20final/OrionTN%20pos.md) sob o título `SEÇÃO PRINCIPAL 5: CASOS REAIS DE SUPORTE E TROUBLESHOOTING 0800 - Orion TN`.
   - **Enriquecimento Amplo** das 373 rotinas já existentes, injetando novos `sintomas_comuns:` e `sinonimos:` no YAML frontmatter e notas práticas de "Casos Reais do 0800" no corpo de passos e dicas.

2. **Padrão Canônico de Nomenclatura e Prefixos (`C-`):**
   - As novas rotinas de troubleshooting utilizam obrigatoriamente o prefixo `C-` seguido da sigla temática do módulo funcional correspondente:
     - `C-FIN-xx`: Financeiro, Caixa, Guias de Recolhimento, Recibos e Mensalistas (Módulo 01)
     - `C-SELO-xx`: Selo Digital e Integrações com Tribunais TJ (Módulo 02)
     - `C-ATOS-xx`: Lavratura de Atos, Escrituras, Procurações e Testamentos (Módulo 03)
     - `C-FIRMA-xx`: Reconhecimento de Firmas, Autenticações e Biometria (Módulo 04)
     - `C-CENTRAL-xx`: Centrais Notariais Obrigatórias (COAF, CENSEC, DOI, e-Notariado) (Módulo 05)
     - `C-LIVRO-xx`: Livros Notariais, Termos de Abertura/Encerramento e Folhas (Módulo 06)
     - `C-MINUTA-xx`: Modelos, Minutas e Editor Integrado Orion TN (Módulo 07)
     - `C-CERT-xx`: Certidões, Buscas de Atos e Fichas (Módulo 08)
     - `C-ACESSO-xx`: Usuários, Perfis, Permissões, Senhas e 2FA (Módulo 09)
     - `C-CONFIG-xx`: Configurações Gerais, Impressão, Scanners e Certificado Digital (Módulo 10)
     - `C-GERAL-xx`: Dúvidas Operacionais Gerais, ITCMD e Rotinas Administrativas (Módulo 11)

3. **Curadoria e Densidade Canônica:**
   - Para evitar redundâncias e manter a máxima qualidade técnica, os 9.384 chamados foram minerados por 4 clusters de subagentes e consolidados em **58 Playbooks Canônicos de Resolução**, que desdobram em aproximadamente 98 rotinas canônicas da Seção 5.

4. **Metadados de Vídeo Estritamente Limpos:**
   - Em conformidade com a ADR-003, todas as rotinas da Seção 5 possuem `tem_video: false` com estrutura enxuta no YAML frontmatter, sem campos nulos ou legados.

5. **Tratamento de Chamados N2 / Banco de Dados (Triagem Inteligente):**
   - Quando o incidente histórico exigiu intervenção técnica interna da Siplan (banco de dados ou infraestrutura), o assistente:
     1. Explica a causa raiz técnica de forma transparente ao usuário;
     2. Instrui as verificações e desbloqueios possíveis pela interface web;
     3. Fornece o texto e checklist exato dos dados necessários para abertura do ticket no 0800, reduzindo o tempo de triagem.

6. **Persona do Assistente para Balcão Travado:**
   - O assistente adota tom de acolhimento calmo de colega escrevente sênior em momentos de tensão, seguido imediatamente pelo desbloqueio prático com elementos de interface estritamente em **negrito**.

---

## Consequências:
- A Base de Conhecimento evolui formalmente para a **Versão 3.1.0** (Orion TN 6.0 + Casos Reais 0800 Integrados).
- Cobertura total das principais dores reais enfrentadas pelos cartórios nos últimos 3 anos.
- Eliminação de alucinações técnicas em erros de webservice, contingência de selos e rejeições de centrais.
