# Especificação Técnica: Arquitetura RAG Granular & Vector Store (Orion TN V3.2)

**Status:** ATIVO / HOMOLOGADO  
**Data:** 10/11/2026 (ADR-005)  
**Tecnologia:** OpenAI Platform Responses API (Vector Stores + `file_search`)  

---

## 1. Estrutura de Diretórios de Produção (`kb/`)

A base de conhecimento em produção reside no diretório `kb/`:
* `kb/rotinas/<modulo>/<id>-<slug>.md`: 471 arquivos atômicos de rotinas (1 arquivo = 1 chunk).
* `kb/modulos/<modulo>/_contexto.md`: 11 documentos de contexto com regras transversais e links de módulo.
* `kb/_indice.md`: Catálogo mestre de roteamento semântico de rotinas e sinônimos (padrão llms.txt).
* `kb/_glossario.md`: Glossário notarial e corporativo Siplan.
* `kb/.sync_state.json`: Controle de versão e hashes SHA-256 para deploy incremental.

---

## 2. Parâmetros Canônicos do Vector Store (OpenAI)

### 2.1. Estratégia de Chunking
```json
{
  "type": "static",
  "static": {
    "max_chunk_size_tokens": 1800,
    "chunk_overlap_tokens": 0
  }
}
```
*Justificativa:* O tamanho máximo de uma rotina na base é de 1.739 tokens (`V-CCA.1.1`). Com 1.800 tokens, 100% das rotinas são armazenadas em exatamente 1 chunk atômico, sem corte entre frontmatter YAML e passo a passo.

### 2.2. Atributos Nativos por Arquivo (`attributes`)
* `id`: Identificador canônico da rotina (ex: `V-7.6.1`, `C-FIN-01`).
* `modulo`: Módulo funcional (`notas`, `caixa`, `firmas`, `selos`, `centrais`, `livros`, `certidoes`, `acesso`, `config`, `comunicacao`, `geral`).
* `secao`: Seção de origem (`R`, `V`, `M`, `D`, `C`).
* `tem_video`: Booleano (`true` ou `false`).
* `categoria`: `procedimento_geral`, `videoaula_tutorial`, `manual_operacional`, `demonstracao_pratica`, `troubleshooting_0800`.

---

## 3. Configuração de Chamada na Responses API (`file_search`)

```python
tools = [{
    "type": "file_search",
    "vector_store_ids": [VECTOR_STORE_ID],
    "max_num_results": 5,
    "ranking_options": {
        "score_threshold": 0.30,
        "hybrid_search": {
            "rrf_text_weight": 1.3,
            "rrf_embedding_weight": 1.0
        }
    }
}]
```
*Justificativa:* O peso elevado no BM25 (`rrf_text_weight: 1.3`) garante correspondência exata para rótulos de botões em negrito e termos técnicos específicos do balcão notarial.

---

## 4. Pipeline de Automação e Manutenção

1. **Recompilar a Base:**
   ```bash
   python scripts/build_kb.py
   ```
2. **Sincronizar com OpenAI Vector Store (Incremental):**
   ```bash
   python scripts/sync_openai_vector_store.py
   ```
   *(Passe `--vector-store-id <ID>` se já possuir uma Vector Store existente ou `--force` para reindexação total).*
