# ADR-005: Migração para Arquitetura Granular RAG V3.2 (Dual-Layer Pipeline)

**Data:** 10/11/2026  
**Status:** APROVADO E IMPLEMENTADO  
**Contexto do Problema:**  
O assistente virtual do Orion TN utilizava um arquivo monolítico único (`doc conhecimento final/OrionTN pos.md`) com 1,39 MB, 25.803 linhas e 395.023 tokens inserido diretamente em um Vector Store do OpenAI Platform Responses API.  
A auditoria técnica empírica comprovou graves limitações operacionais desse formato:
1. **Quebra Cega de Chunks:** O chunker padrão da OpenAI (800 tokens com 400 de overlap) fatiou arbitrariamente 41,2% das rotinas (194 rotinas com mais de 800 tokens, e média de 1.150 tokens nas rotinas de vídeo). Metadados YAML, vídeos da Bunny.net e passos numerados caíam em blocos separados.
2. **Inviabilidade de Filtros por Atributos:** Os atributos (`attributes`) do Vector Store da OpenAI operam por arquivo, impossibilitando filtragem por módulo (`notas`, `caixa`, `firmas`).
3. **Reindexação Lenta e Ineficiente:** Qualquer alteração em um botão exigia reindexar 395 mil tokens.
4. **Impossibilidade de Full-Context Prompting:** A base excede a janela máxima de 128k tokens da OpenAI, tornando o RAG estritamente obrigatório.

---

## Decisões Tomadas:

1. **Adoção da Arquitetura Dual-Layer Pipeline:**
   - **Camada de Auditoria e Edição Local:** Mantém-se o arquivo mestre consolidado (`doc conhecimento final/OrionTN pos.md`) para leitura contínua, auditoria global e busca humana rápida.
   - **Camada Granular de Produção (`kb/`):** A base é compilada em arquivos Markdown atômicos individuais em `kb/rotinas/{modulo}/{id}-{slug}.md`.
   - **Documentos de Suporte:** Geração automática do catálogo `kb/_indice.md` (llms.txt pattern), glossário `kb/_glossario.md` e regras compartilhadas por módulo `kb/modulos/{modulo}/_contexto.md`.

2. **Calibração de Chunking Estático no Vector Store:**
   - Como a maior rotina da base possui 1.739 tokens (`V-CCA.1.1`), o chunking da OpenAI foi fixado em:
     - `max_chunk_size_tokens: 1800`
     - `chunk_overlap_tokens: 0`
   - **Regra de Ouro:** **1 rotina = 1 arquivo = 1 chunk atômico**. Zero fragmentação de contexto.

3. **Injeção de Metadados Filtráveis Nativos:**
   - Cada arquivo recebe atributos para filtros prévios na Responses API:
     `{"id": "...", "modulo": "...", "secao": "...", "tem_video": bool, "categoria": "..."}`.

4. **Automação via Scripts em Python (`scripts/`):**
   - `scripts/build_kb.py`: Valida 100% dos schemas YAML, classifica em 11 módulos funcionais e gera os 484 arquivos da pasta `kb/`.
   - `scripts/sync_openai_vector_store.py`: Sincroniza incrementalmente os arquivos com a OpenAI API via hashes SHA-256 e uploads em lote (`file_batches`).

5. **Busca Híbrida Calibrada para Balcão Notarial:**
   - Configuração de `file_search` com peso BM25 elevado (`rrf_text_weight: 1.3`, `rrf_embedding_weight: 1.0`) para correspondência exata de rótulos de botões e telas.

---

## Consequências:
- Precisão de recuperação semântica elevada drasticamente, eliminando rotinas cortadas pela metade.
- Redução de custos e tempo de reindexação para segundos via hashes incrementais.
- Preservação integral do histórico e conformidade estrita com as ADR-001 a ADR-004 e Bunny.net.
