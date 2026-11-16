# ADR-002: Ingestão do Webinar Orion TN 6.0 e Expansão para 373 Rotinas

**Data:** 09/11/2026  
**Status:** APROVADO E IMPLEMENTADO  
**Contexto do Problema:**  
A Siplan realizou um webinar oficial de 1 hora apresentando inovações e novas funcionalidades da versão 6.0 do Orion TN. O acervo da base de conhecimento mestre precisava refletir essas novidades sem quebrar a estrutura e sem duplicar rotinas já existentes.

**Decisões Tomadas:**
1. **Purificação do texto bruto da transcrição** com o glossário notarial da Siplan, gerando `Webinar Orion TN 6.0_corrigido.md`.
2. **Reconciliação minuciosa contra o acervo:**
   - **7 Rotinas Atualizadas in-place:** `R-1.3` (IA no Protocolo), `V-4.3.1` (Conferência IA), `V-7.2.3` (Extenso 1 Clique), `V-7.2.1` (Prévia de Livro), `V-7.5.4` (Versionamento de Minutas), `V-7.6.1` (Importação Reversa de Word), `R-14.0` (Controle RI e ONR).
   - **7 Novas Rotinas Canônicas Criadas:** `R-14.1` (Dashboard de Validações Diárias), `R-14.2` (Notificações RI via WhatsApp), `V-7.2.4` (Envio de Prévia via WhatsApp), `R-15.0` (Vencimento de Procurações via WhatsApp), `R-37.0` (Cartflow Coleta), `R-37.1` (Cartflow Conferência), `R-38.0` (Mural Orion Connect).
3. **Expansão oficial da Base:** O total de rotinas homologadas subiu de 366 para **373 rotinas**.

**Consequências:**
- Base mestre atualizada para a Versão 3.0.0 (Orion TN 6.0 Integrado).
- Alinhamento pleno com os novos recursos de IA, WhatsApp, Cartflow e Orion Connect.
