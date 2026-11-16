# ADR-018: Conexão Direta Supabase via Pooler PostgreSQL & REST/Storage (Vedado Uso do Supabase MCP)

**Status:** ATIVO / OBRIGATÓRIO  
**Data:** 13/11/2026  
**Projeto Supabase:** `zgnbdfibnjekmmzsfzzm` (Organização: *Orion Agents*)  

---

## 1. Contexto

O servidor MCP `supabase` configurado globalmente no Antigravity (`~/.gemini/antigravity/mcp_config.json`) está autenticado com token escopado para outra organização do Supabase, retornando erro de permissão ao tentar acessar o projeto `zgnbdfibnjekmmzsfzzm`.

Além disso, a conexão direta `db.zgnbdfibnjekmmzsfzzm.supabase.co:5432` utiliza IPv6 exclusivo, enquanto o Pooler IPv4 (`aws-1-us-east-1.pooler.supabase.com:5432`) e a API REST/Storage (`https://zgnbdfibnjekmmzsfzzm.supabase.co`) operam normalmente a partir do ambiente local.

---

## 2. Decisão Arquitetural

1. **PROIBIDO TENTAR USAR O SUPABASE MCP:**
   * Nenhum agente deve chamar ferramentas do servidor MCP `supabase` (`list_tables`, `execute_sql`, `apply_migration`, `list_projects`, etc.) para este projeto.
2. **CONEXÃO DIRETA OBRIGATÓRIA:**
   * Toda operação DDL, migração ou query SQL direta no PostgreSQL deve ser executada via cliente `pg` (`createPgClient()` em `auditoria/src/supabase.ts`) conectado ao Pooler IPv4 (`SUPABASE_DB_URL` em `auditoria/.env`).
   * Toda operação DML (CRUD de rotinas, passos, eventos, jobs) e gestão de arquivos (Storage bucket `audit-screenshots`) deve ser executada via `@supabase/supabase-js` (`getSupabaseAdmin()` em `auditoria/src/supabase.ts`).
3. **SEGURANÇA:**
   * `SUPABASE_SECRET_KEY` e `SUPABASE_DB_URL` ficam estritamente em `auditoria/.env` (backend) e nunca são expostos no frontend (`Orion Audit Console/.env`).
