# ADR-006: Calibração de Profundidade Procedural e Garantia Mandatória de Vídeo RAG

**Data:** 11/11/2026  
**Status:** APROVADO E HOMOLOGADO  
**Contexto do Problema:**  
Nos testes de produção na interface do Siplan HUB (`pos-assistant-chat`), foram identificadas duas anomalias no comportamento do modelo `gpt-4o-mini-2024-07-18`:
1. **Compressão Excessiva de Passos:** O System Prompt continha a instrução rígida: *"Apresente de 3 a 5 passos objetivos"*. Como o `gpt-4o-mini` possui alta obediência a limites de brevidade, rotinas completas com 6 a 8 passos (como qualificação via scanner OCR ou lançamentos com múltiplas validações) tiveram etapas críticas suprimidas (ex.: diferenciação de scanner físico vs upload de arquivos, confirmações de substituição e botões de conferência).
2. **Omissão Ocasional de Links de Vídeo:** Mesmo quando o chunk da rotina continha `tem_video: true` (com URL da Bunny.net e timestamp), o modelo priorizava o encerramento da resposta logo após a dica prática, deixando de emitir o bloco de tutorial em vídeo ao final da mensagem.

---

## Decisões Tomadas:

1. **Eliminação do Limite Numérico Restritivo ("3 a 5 passos"):**
   - Substituição da regra por **"Passo a Passo Sequencial Completo"**: o assistente deve cobrir fielmente o fluxo recuperado da base de conhecimento (geralmente entre 4 a 8 passos), preservando caminhos de botões, abas, distinção entre scanner e arquivos digitais, e opções de confirmação.
   - Manutenção da obrigação de destacar em **negrito** todos os elementos visuais de tela (**Menus > Submenus > Abas > Botões > Campos**).

2. **Garantia Mandatória de Vídeo (Mandatory Video Anchor):**
   - A instrução de vídeo foi reformulada como uma **Regra de Ouro Inviolável**: se a rotina recuperada no `file_search` possuir `tem_video: true`, o assistente é **obrigado** a extrair os campos `video_title`, `video_url` e `video_timestamp` do YAML e anexar o bloco oficial Bunny.net:
     ```markdown
     🎬 **Prefere ver na prática?**  
     ▶️ **Assista ao tutorial:** [[Título do Vídeo]](URL_DO_VÍDEO) *(Início aos MM:SS)*
     ```
   - Se `tem_video: false`, a supressão total do bloco é mantida (sem mencionar a palavra "vídeo").

3. **Proibição Estrita de Títulos H2/H3 Internos:**
   - O assistente é proibido de criar subtítulos como `### Passo a Passo...` ou `### Observações`, garantindo texto limpo, direto e profissional em linguagem natural.

---

## Consequências e Validação Empírica:
- Em testes ao vivo na API da OpenAI (Responses API) com as mesmas perguntas de qualificação e depósito prévio:
  - 100% das etapas operacionais (scanner, upload, opções de sobrescrever/complementar) foram explicadas sem cortes.
  - O bloco de tutorial em vídeo Bunny.net com timestamp exato foi gerado com 100% de consistência.
  - Zero vazamento de nomes de arquivos, IDs internos ou metadados de sistema.
