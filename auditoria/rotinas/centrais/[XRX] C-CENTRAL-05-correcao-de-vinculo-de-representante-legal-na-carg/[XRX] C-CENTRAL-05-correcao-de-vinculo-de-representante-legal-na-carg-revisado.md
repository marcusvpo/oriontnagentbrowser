---
id: C-CENTRAL-05
titulo: 'Correção de Vínculo de Representante Legal na Carga CENSEC CTP / RCTO'
modulo: centrais
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: dependencia_cruzada_rotina
  carga: mutation
  worker_id: 'worker-4'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Dependência Cruzada de Rotina'
  rotinas_pre_requisito: ['D-3.19', 'D-3.23', 'D-3.22']
  prints_geradas: 2
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
  exploracao_investigativa:
    - passo: 2
      alvos_ausentes: ['Partes']
      alvos_revelados: []
      resultado: gatilhos_esgotados
      gatilhos_na_tela: 0
      seletores_sem_afinidade_descartados: 0
      estado_restaurado: true
  auto_cura:
    acionada: true
    divergencias_detectadas:
      - passo: 1
        alvo_documentado: 'Notas > Protocolo'
        elemento_real: 'Notas'
        camada: a11y_fuzzy_match
        confianca: 0.68
        texto_alterado: false
        evidencia: 'dom-measured | text:notas | x=573, y=1, 67x50'
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([XRX]):**  
> A auditoria automática foi interrompida: **Dependência Cruzada de Rotina**.
>
> **Motivo Técnico:** O manual trabalha sobre um protocolo que precisa existir antes (criado em outra rotina) e o alvo do passo 2 não estava na tela. Rotinas que o criam: D-3.19 — Criar Protocolo de Nota; D-3.23 — Gerar Recibo de Protocolo; D-3.22 — Registrar Custas do Protocolo.

#### Descrição:
Na Central de Testamentos e Procurações (CTP), outorgantes pessoas jurídicas não podem outorgar poderes diretamente sem a indicação da pessoa física que as representa (sócio, administrador ou procurador).

#### Roteiro Técnico para Execução Manual:
1. Executar antes a rotina D-3.19 (Criar Protocolo de Nota).
2. Executar antes a rotina D-3.23 (Gerar Recibo de Protocolo).
3. Executar antes a rotina D-3.22 (Registrar Custas do Protocolo).
4. Com o protocolo aberto, reexecutar a auditoria da rotina C-CENTRAL-05.

* **Rotinas pré-requisito (executar antes):** **D-3.19**, **D-3.23**, **D-3.22**.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Abra o protocolo da procuração no menu **Notas > Protocolo**.
   [aqui vai a print "passo-01.png"]
   > [!NOTE] **Divergência de rótulo (Auto-Cura SmartLocator, a11y_fuzzy_match):** O manual cita **"Notas > Protocolo"**, porém na tela atual do Orion TN o elemento se chama **"Notas"** (confiança: 68% — Similaridade semântica na árvore de acessibilidade (64%)). O texto do manual não foi alterado.
2. Acesse a aba **Partes** e localize a Pessoa Jurídica outorgante.
   [aqui vai a print "passo-02.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Partes] não localizado no DOM nem na Árvore de Acessibilidade; a tela não tem gatilho revelador seguro a testar
3. Selecione a empresa e clique na sub-aba **Representantes Legais**.
4. Caso o sócio já esteja listado mas o sistema não valide: exclua o vínculo e adicione novamente.
5. Selecione a pessoa física representante, marque o checkbox **Representante Ativo no Ato** e indique o título de representação (ex.: Administrador / Diretor).
6. Clique em **Salvar Vínculo** e, em seguida, em **Salvar Protocolo**.
7. Retorne ao módulo **Comunicações > CENSEC CTP**, recalcule a carga quinzenal e faça a transmissão.

* **Boas Práticas: Sempre cadastre primeiro a pessoa física do administrador e vincule-a à pessoa jurídica antes de puxar a empresa para a minuta.**
