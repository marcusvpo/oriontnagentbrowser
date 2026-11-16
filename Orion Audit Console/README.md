# Orion Audit Console — Painel de Gestão e Auditoria Operacional

Console web de alta fidelidade para revisão, triagem de divergências, inspeção geométrica e governança das 471 rotinas do ecossistema Orion TN.

---

## 🚀 Como Executar

### Opção 1: Execução Full-Stack (Recomendado — Na Raiz do Projeto)
Abre o backend API Node.js (porta `3333`) conectado aos 471 manuais reais + 64 rotinas auditadas e o Frontend Vite (porta `8080`):

```bash
npm run dev
```

Acesse no navegador:
* **Frontend:** [http://localhost:8080](http://localhost:8080)
* **Backend API:** [http://localhost:3333/api/rotinas](http://localhost:3333/api/rotinas)

---

### Opção 2: Executar dentro da pasta `Orion Audit Console`

Se você estiver com o terminal aberto dentro desta pasta:

```bash
# Modo Conectado ao Backend Real (usa http://localhost:3333)
npm run dev

# Modo Simulado (Mock isolado sem backend)
npm run dev:mock

# Rodar Suíte de Testes Unitários
npm test
```

---

## ⚙️ Variáveis de Ambiente (`.env`)

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `VITE_USE_MOCK` | `false` | `false` conecta à API local; `true` ativa o banco de dados simulado em memória |
| `VITE_API_BASE_URL` | `http://localhost:3333` | Endereço do servidor API local Node.js |

---

## 📐 Estrutura e Recursos

1. **Dashboard Executivo:** Métricas das 471 rotinas, gráficos de progresso por Fase (1 a 6), divisão por carga (`read_only` vs. `mutation`), módulos e camadas do SmartLocator.
2. **Explorador e Triagem:** Filtros avançados com busca semântica e suporte a rotas hash (ex: `#/configuracoes`).
3. **Estúdio de Inspeção Visual:** Visualização lado a lado do texto original vs. revisado (com diff por palavras), alertas de divergência da auto-cura e visualizador interativo de screenshots (.webp e .png) com zoom/pan e checklist dos 7 invariantes geométricos.
4. **Governança:** Aprovação de rotinas, edição de manuais, solicitação de revisão técnica e disparo de reexecução no Worker Pool.
