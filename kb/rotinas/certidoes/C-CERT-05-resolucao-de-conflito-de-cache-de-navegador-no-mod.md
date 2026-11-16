---
id: C-CERT-05
titulo: Resolução de Conflito de Cache de Navegador no Módulo de Nova Certidão
tags:
- Certidões
- Cache do Navegador
- Conflito Temporário
- Carregamento de Tela
objetivo: Eliminar arquivos temporários e conflitos de cache no navegador que impedem o carregamento da tela de cadastro de novas certidões.
sinonimos:
- tela de certidão não carrega
- módulo de certidões em branco
- erro ao abrir nova certidão
- limpar cache tela de certidão
perguntas_usuario:
- O módulo de certidões não abre na minha máquina, fica uma tela cinza e não lista nada, como resolver?
- Por que a tela de nova certidão funciona no computador do colega mas não no meu?
- Como limpar o cache do Orion TN no navegador para destravar a tela de certidões?
sintomas_comuns:
- botão Nova Certidão não executa nenhuma ação ao ser clicado
- grid de pedidos de certidão aparece totalmente vazia apesar de existirem pedidos abertos
- ocorrência imediata após atualização de versão do Orion TN no servidor
video:
  tem_video: false
modulo: certidoes
modulo_nome: Certidões e Buscas
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Quando o Orion TN recebe atualizações de componentes, arquivos JavaScript e folhas de estilo anteriores armazenados na memória do navegador criam conflitos de renderização, travando formulários dinâmicos.

#### Passo a passo:
1. Com a janela do **Orion TN** aberta, pressione simultaneamente as teclas `Ctrl + Shift + R` (ou `Ctrl + F5`) para forçar o recarregamento do código fonte da página.
2. Caso persista:
3. Pressione `Ctrl + Shift + Delete` para abrir a janela **Limpar Dados de Navegação** do Chrome/Edge.
4. Selecione o intervalo de tempo **Todo o Período**.
5. Marque obrigatoriamente a opção **Imagens e Ficheiros em Cache** (não é necessário apagar senhas ou histórico).
6. Clique no botão **Limpar Dados**.
7. Feche completamente todas as abas do navegador e reabra o sistema.
8. Acesse **Certidões > Novo Pedido de Certidão** e confirme que o formulário é carregado com perfeição.

* **Manutenção Preventiva:** Realizar a limpeza forçada de cache (`Ctrl + F5`) deve ser o primeiro passo preventivo de qualquer operador após atualizações de versão.
---
