# ADR-003: Padronização Exclusiva de `bunny_video_id` e Deprecação de `video_id`

**Data:** 09/11/2026  
**Status:** APROVADO E IMPLEMENTADO  
**Contexto do Problema:**  
Na etapa inicial de cadastro dos metadados de vídeo do Webinar Orion TN 6.0, as 14 rotinas afetadas receberam tanto `bunny_video_id` quanto `video_id`, contendo o mesmo UUID do vídeo da Bunny.net (`a0110cc2-af70-4994-9f28-0ef295c00858`).
O usuário identificou a redundância e determinou a unificação em um padrão único e limpo.

**Decisões Tomadas:**
1. **Deprecação total do campo `video_id`**: O campo foi permanentemente removido de todas as rotinas em que figurava como duplicata.
2. **Consolidação no padrão `bunny_video_id`**: O campo `bunny_video_id` tornou-se o padrão único e canônico em todo o projeto.
3. **Auditoria de 100% da Base:**
   - 211 rotinas pré-existentes com vídeo já utilizavam exclusivamente `bunny_video_id`.
   - As 14 rotinas do Webinar tiveram o campo redundante `video_id` removido.
   - Total: 225 rotinas com vídeo 100% padronizadas com `bunny_video_id`.

**Consequências:**
- Nenhuma rotina da base contém `video_id`.
- Eliminação de duplicidade de dados no YAML frontmatter.
- Integração perfeita e previsível com o painel web de edição de rotinas.
