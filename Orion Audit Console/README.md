# Orion Audit Console — Central de Curadoria, Auditoria e Calibragem

Plataforma web minimalista para avaliação humana, documentação visual e geração de conhecimento para calibragem do motor do ecossistema **Orion TN** (471 rotinas).

---

## 🎯 Arquitetura Operacional (Desacoplada do Motor Local)

O **Orion Audit Console** é 100% desacoplado do motor local (`agent-browser` / VPN):
1. **Motor Local (PC + VPN):** executa auditorias manualmente via Antigravity / Claude Code e envia textos, diagnósticos e prints `.webp` ao **Supabase** (`sync-supabase` / write-through).
2. **Curadoria Web (`https://orionaudit.vercel.app`):** SD e equipe de Produtos validam prints e passo a passo (*Original × Revisado*), aprovam rotinas prontas para a **Base KB do assistente** ou registram revisões detalhadas.
3. **Exportação em Massa & Ingestão:** na tela **Revisões & Exportação**, baixe o pacote consolidado em Markdown (`.md`) ou JSON (`.json`) e marque as revisões/rotinas como **Ingeridas pelo agente** (destaque violeta + popup de proteção contra reedição acidental).
4. **Calibragem Manual:** anexe o `.md` baixado no Antigravity para análise profunda e evolução do motor antes da próxima rodada local.

---

## 🚀 Deploy na Vercel (`orionaudit.vercel.app`)

1. Importe o repositório `marcusvpo/oriontnagentbrowser` (branch `main`).
2. **Project Name:** `orionaudit` *(gera `https://orionaudit.vercel.app`, se disponível)*.
3. **Root Directory:** deixe **vazio (`./` — raiz do repositório)** e **Application Preset:** `Other` *(o [`vercel.json`](../vercel.json) e a pasta [`api/`](../api/) ficam na raiz para evitar espaços no nome da Serverless Function na Vercel, apontando `outputDirectory: "Orion Audit Console/dist/client"` e `buildCommand: "npm run build --prefix \"Orion Audit Console\""`)*.
4. **Environment Variables:**
   * `VITE_USE_MOCK` = `false`
   * `VITE_SUPABASE_URL` = `https://<PROJECT_REF>.supabase.co`
   * `VITE_SUPABASE_PUBLISHABLE_KEY` = `<chave publishable/anon>`
   * `SUPABASE_URL` = `https://<PROJECT_REF>.supabase.co`
   * `SUPABASE_SECRET_KEY` = `<service_role / secret key>` *(sem prefixo `VITE_`!)*
   * `SUPABASE_STORAGE_BUCKET` = `audit-screenshots`
   *(Não é necessário preencher `VITE_API_BASE_URL` na Vercel — em produção o app chama `/api/*` no mesmo domínio automaticamente.)*

---

## 💻 Execução Local

### Full-Stack (na raiz do repositório)
```bash
npm run dev
```
* **Frontend:** http://localhost:8080
* **API Local:** http://localhost:3333/api/health

### Somente Frontend (dentro de `Orion Audit Console`)
```bash
# Modo conectado à API local (http://localhost:3333)
npm run dev

# Modo simulado (mock em memória, sem backend)
npm run dev:mock

# Testes unitários, lint e build de produção (Vercel SPA)
npm test
npm run lint
npm run build
```
