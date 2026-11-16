# Especificação Técnica: Schema V3.0 de Rotinas (Orion TN)

**Status:** ATIVO / DEFINITIVO (Versão 3.1.0 — Orion TN 6.0 + Casos Reais 0800 Integrados)  
**Data de Aprovação:** 10/11/2026 (Atualizado conforme ADR-004)  
**Arquivo Mestre Aplicado:** `doc conhecimento final/OrionTN pos.md`  
**Total de Rotinas Homologadas:** 471 rotinas homologadas (373 pré-existentes nas Seções R, V, M, D + 98 rotinas canônicas da Seção 5 `C-`)  

---

## 1. Estrutura Canônica de cada Bloco de Rotina

Cada rotina é delimitada por marcadores triplos `---` no início e no fim do frontmatter YAML, seguido pelo corpo em Markdown e finalizado por `---`:

```markdown
---
id: [PREFIXO]-[NUMERO]
titulo: [Título Limpo e Autoexplicativo da Rotina]
tags:
- [Tag 1]
- [Tag 2]
objetivo: [Declaração direta em 1 a 2 linhas do que a rotina resolve ou viabiliza]
sinonimos:
- [termo alternativo 1]
- [termo alternativo 2]
perguntas_usuario:
- [Pergunta real em linguagem natural 1]
- [Pergunta real em linguagem natural 2]
- [Pergunta real em linguagem natural 3]
sintomas_comuns:
- [dor ou dúvida do usuário 1]
- [erro ou tela travada 2]
- [comportamento observado 3]
video:
  tem_video: [true | false]
  # Se tem_video for true, os campos abaixo são obrigatórios:
  bunny_library_id: '467408'
  bunny_video_id: '[UUID-DO-VIDEO-NA-BUNNY]'
  video_title: '[Título do Vídeo na Bunny]'
  video_url: '[URL-DE-EMBED-COM-TIMESTAMP-&t=SEG]'
  video_timestamp: '[MM:SS]'
  video_start_seconds: [SEGUNDOS_INTEIROS]
  thumbnail_url: '[URL-DA-THUMBNAIL]'
---
#### Descrição:
[Resumo conciso de 1 a 2 parágrafos contextualizando a funcionalidade na operação do cartório]

#### Passo a passo:
1. No menu **[Nome do Menu]**, acesse a opção **[Nome da Tela]**.
2. Clique no botão **[Ação em Negrito]** e preencha o campo **[Nome do Campo]**.
3. Selecione a opção **[Opção]** e clique em **[Salvar/Concluir]**.

* **Dica / Alerta / Observação:** [Informação prática sobre regras da Corregedoria, validação tributária ou comportamento do sistema].
---
```

---

## 2. Dicionário de Campos do YAML Frontmatter

| Campo | Tipo | Obrigatoriedade | Regra e Padrão Estrito |
| :--- | :---: | :---: | :--- |
| `id` | String | **Obrigatório** | Prefixo oficial seguido de numeração: `R-` (Rotinas gerais), `V-` (Videoaulas), `M-` (Manuais), `D-` (Demonstrações/Caixa) ou `C-` (Casos Reais 0800 com sigla temática: `C-FIN-xx`, `C-SELO-xx`, `C-ATOS-xx`, `C-FIRMA-xx`, `C-CENTRAL-xx`, `C-LIVRO-xx`, `C-MINUTA-xx`, `C-CERT-xx`, `C-ACESSO-xx`, `C-CONFIG-xx`, `C-GERAL-xx`). Deve ser estritamente único. |
| `titulo` | String | **Obrigatório** | Título claro, profissional, sem abreviações confusas. Ex.: *"Integração com Inteligência Artificial para Preenchimento de Partes e Atos Notariais"*. |
| `tags` | List[String] | **Obrigatório** | Lista de 3 a 8 tags temáticas para indexação semântica e busca por palavras-chave. |
| `objetivo` | String | **Obrigatório** | Resumo objetivo em 1 ou 2 períodos começando com verbo no infinitivo (ex.: *"Demonstrar como...", "Orientar o escrevente a..."*). |
| `sinonimos` | List[String] | **Obrigatório** | Expressões equivalentes e gírias de cartório (ex.: *"puxar do word", "ia de partes", "preencher automático"*). Mínimo de 3 itens. |
| `perguntas_usuario` | List[String] | **Obrigatório** | 3 a 5 perguntas reais em linguagem natural simulando como o escrevente pergunta no dia a dia. |
| `sintomas_comuns` | List[String] | **Obrigatório** | **Novo padrão V3.0**: Mapeia dores, erros, travas ou dúvidas práticas (ex.: *"cliente trazendo documento cortado", "erro ao ler CNH", "não sei onde clicar"*). Mínimo de 3 itens. |
| `video` | Object | **Obrigatório** | Objeto contendo o flag `tem_video` e metadados de streaming da Bunny.net. |

---

## 3. Regra de Ouro dos Metadados de Vídeo (Bunny.net)

> [!IMPORTANT]
> **PROIBIÇÃO DE `video_id`:** O campo `video_id` foi **definitivamente descontinuado** por ser uma redundância clone de `bunny_video_id`.
> 
> O padrão oficial e universal para todas as rotinas é usar **exclusivamente `bunny_video_id`**.

### Se `tem_video: true`
Todos os campos a seguir são obrigatórios:
- `bunny_library_id`: ID da biblioteca Bunny (ex.: `'467408'`).
- `bunny_video_id`: UUID do vídeo na Bunny (ex.: `'a0110cc2-af70-4994-9f28-0ef295c00858'`).
- `video_title`: Título limpo do vídeo ou webinar (ex.: `'Webinar Orion TN 6.0'`).
- `video_url`: URL de embed iframe da Bunny. Se possuir parâmetros de player (`autoplay=false...`), o timestamp deve ser concatenado com `&t=[segundos]`; se for limpa, com `?t=[segundos]`.
- `video_timestamp`: String no formato `MM:SS` (ex.: `'06:41'`).
- `video_start_seconds`: Inteiro representando o início exato em segundos (ex.: `401`).
- `thumbnail_url`: URL direta da imagem de thumbnail no CDN da Bunny.

### Se `tem_video: false`
```yaml
video:
  tem_video: false
```
*Não inclua campos vazios ou nulos quando `tem_video` for falso.*

---

## 4. Padrão Estrito do Corpo da Rotina (Markdown)

1. **Subtítulo de Descrição:** Iniciar obrigatoriamente com `#### Descrição:`. Texto explicativo sem jargões desnecessários.
2. **Subtítulo de Passo a Passo:** Conter obrigatoriamente `#### Passo a passo:` com lista numerada (`1.`, `2.`, `3.`).
3. **UI Elements em Negrito:** Todos os nomes de telas, menus, abas, botões, ícones, seleções e campos do sistema **DEVEM estar estritamente em negrito** (ex.: **Protocolo**, **Aba Documentos**, **Salvar e Avançar**, **Orion Caixa**).
4. **Fechamento:** Cada rotina fecha com `---` antes da próxima rotina.
