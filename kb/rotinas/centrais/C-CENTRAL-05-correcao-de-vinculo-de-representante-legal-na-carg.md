---
id: C-CENTRAL-05
titulo: Correção de Vínculo de Representante Legal na Carga CENSEC CTP / RCTO
tags:
- CENSEC
- CTP
- RCTO
- Procurações
- Representante Legal
- Pessoa Jurídica
objetivo: Corrigir falhas de validação em procurações e testamentos decorrentes de ausência de representante ativo para pessoas jurídicas.
sinonimos:
- erro censec ctp ausência de representante
- procuração rejeitada ctp
- representante legal inativo censec
- lote ctp não envia
perguntas_usuario:
- A CENSEC rejeitou a carga da CTP acusando ausência de representante para os outorgantes, mas preenchi a empresa, o que falta?
- Como vincular o sócio que assina pela empresa para passar no validador da CTP?
- Por que a procuração com outorgante pessoa jurídica dá erro de envio na quinzena?
sintomas_comuns:
- 'rejeição CTP: Ausência de representante ativo para os outorgantes/alienantes'
- empresa outorgante cadastrada sem o relacionamento da pessoa física interveniente
- lote quinzenal de procurações travado impedindo o fechamento regulamentar
video:
  tem_video: false
modulo: centrais
modulo_nome: Centrais Notariais (CENSEC, DOI, COAF)
secao: C
categoria: troubleshooting_0800
versao_sistema: Orion TN 6.0
---

#### Descrição:
Na Central de Testamentos e Procurações (CTP), outorgantes pessoas jurídicas não podem outorgar poderes diretamente sem a indicação da pessoa física que as representa (sócio, administrador ou procurador).

#### Passo a passo:
1. Abra o protocolo da procuração no menu **Notas > Consultas > Protocolos**.
2. Acesse a aba **Partes** e localize a Pessoa Jurídica outorgante.
3. Selecione a empresa e clique na sub-aba **Representantes Legais**.
4. Caso o sócio já esteja listado mas o sistema não valide: exclua o vínculo e adicione novamente.
5. Selecione a pessoa física representante, marque o checkbox **Representante Ativo no Ato** e indique o título de representação (ex.: Administrador / Diretor).
6. Clique em **Salvar Vínculo** e, em seguida, em **Salvar Protocolo**.
7. Retorne ao módulo **Comunicações > CENSEC CTP**, recalcule a carga quinzenal e faça a transmissão.

* **Boas Práticas:** Sempre cadastre primeiro a pessoa física do administrador e vincule-a à pessoa jurídica antes de puxar a empresa para a minuta.
---
