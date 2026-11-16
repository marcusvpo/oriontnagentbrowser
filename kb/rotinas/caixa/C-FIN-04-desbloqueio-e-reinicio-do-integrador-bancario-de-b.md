---
id: C-FIN-04
titulo: Desbloqueio e Reinício do Integrador Bancário de Boletos de Mensalistas
tags:
- Mensalistas
- Boletos
- Integrador
- Docker
- Faturamento Bancário
objetivo: Restabelecer a comunicação entre o Orion TN e as APIs bancárias para geração e transmissão de boletos de clientes mensalistas.
sinonimos:
- não gera boleto mensalista
- erro ao emitir boletos faturamento
- integrador docker travado
- falha comunicação bancária
perguntas_usuario:
- O sistema fica carregando e não gera os boletos dos mensalistas faturados, como resolver?
- Como reiniciar o serviço de integração bancária do Orion TN?
- Erro de timeout bancário ao transmitir boletos de clientes conveniados, o que fazer?
sintomas_comuns:
- tela de emissão de boletos congela na barra de progresso
- 'mensagem: Falha na comunicação com o gateway bancário / Integrador offline'
- faturamento concluído mas botão de imprimir boletos não gera o PDF
video:
  tem_video: false
modulo: caixa
modulo_nome: Orion Caixa e Financeiro
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
A remessa e o registro síncrono de boletos bancários dependem do microsserviço Integrador executado em container Docker no servidor local da serventia. Quedas de conexão ou reinicializações do servidor podem pausar o serviço.

#### Passo a passo:
1. No servidor da serventia (ou através da equipe de TI/Suporte Siplan), abra o terminal ou console do **Docker**.
2. Verifique o estado dos containers executando `docker ps -a`.
3. Reinicie o container do integrador bancário através do comando: `docker restart siplan-integrador`.
4. Aguarde 60 segundos para restabelecimento das rotas de rede.
5. No **Orion TN / Orion Caixa**, acesse **Faturamento > Mensalistas > Emissão de Boletos**.
6. Selecione a fatura pendente e acione o botão **Gerar / Transmitir Boletos** novamente.

* **Suporte Siplan:** Se após o restart o erro persistir, valide se o certificado digital da conta bancária da serventia (A1) não expirou nas configurações do convênio bancário.
---
