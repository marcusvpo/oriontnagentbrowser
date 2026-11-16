# ADR-001: Implementação do Schema V3.0 e Formato Pirâmide Invertida

**Data:** 04/11/2026  
**Status:** APROVADO E IMPLEMENTADO  
**Contexto do Problema:**  
O assistente anterior (Versão 2.1) sofria de baixa aderência e usabilidade reportada pelos usuários:
- Respostas robóticas no formato URA ("Como posso ajudar hoje?").
- Vazamento de IDs técnicos internos (`R-1.3`, `V-7.2.1`) no diálogo direto com o usuário.
- Dúvidas práticas, gírias e dores do balcão não eram reconhecidas pelo motor semântico.
- Dúvidas fora do escopo eram respondidas com respostas inventadas (alucinações).
- Falta de destaque visual nos menus e botões da interface.

**Decisões Tomadas:**
1. **Adição do campo `sintomas_comuns`** no YAML frontmatter de todas as rotinas para capturar dores, travas e linguagem informal do balcão.
2. **Reestruturação obrigatória do corpo da rotina** com divisão clara entre `#### Descrição:` e `#### Passo a passo:`.
3. **Destaque obrigatório em negrito** (`**...**`) para todos os elementos visuais de interface (menus, telas, botões, abas e campos).
4. **Adoção do modelo de Pirâmide Invertida** nas respostas: Solução Imediata $\to$ Passo a passo guiado $\to$ Vídeo tutorial (se houver) $\to$ Dica de boas práticas.
5. **Auditoria e migração de 100% do acervo** legado (366 rotinas divididas nas seções R, V, M e D).

**Consequências:**
- Base consolidada em 366 rotinas no Schema V3.0.
- Aderência e compreensão imediata pelo assistente de termos leigos e ansiosos do usuário.
- Eliminação total de alucinações e respostas robóticas.
