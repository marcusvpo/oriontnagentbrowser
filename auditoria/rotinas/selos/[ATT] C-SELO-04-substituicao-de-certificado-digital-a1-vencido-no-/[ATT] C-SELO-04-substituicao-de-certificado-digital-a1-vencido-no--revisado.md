---
id: C-SELO-04
titulo: 'Substituição de Certificado Digital A1 Vencido no Servidor Daemon de Selos'
modulo: selos
secao: C
auditoria_ui:
  data_execucao: '2026-11-16'
  status: atualizacao_editorial
  carga: read_only
  worker_id: 'worker-1'
  versao_homologacao: 'WildFly 22 / Orion 06.04.01'
  tipo_bloqueio: 'Defasagem Editorial do Manual (Recurso Inexistente na Tela)'
  prints_geradas: 5
  dry_run_mutations: true
  sessao_usuario: '4tabeliao.scs'
  sessao_perfil_pleno: true
---

> [!CAUTION]
> **ROTINA QUE REQUER REVISÃO HUMANA ([ATT]):**  
> A auditoria automática foi interrompida: **Defasagem Editorial do Manual (Recurso Inexistente na Tela)**.
>
> **Motivo Técnico:** No passo 5, o manual cita "Orion TN", "Configurações > Parâmetros de Integração > Certificado Digital", que não foram localizados na tela auditada (nenhum dos elementos citados). A conta "4tabeliao.scs" é um perfil administrativo pleno (Perfil de acesso - Gerência webFirmas) e a aplicação não marca o elemento como bloqueado ou oculto para o perfil; não é insuficiência de privilégio. O passo cita um caminho de menu: a rota não é adivinhada por exploração (ADR-016). O recurso não existe nesta tela na versão atual do Orion TN: defasagem editorial do manual. Itens de nome relacionado existem em outro ponto da navegação: Relatórios > Auditoria Selos TJ - Orion; Administração > Comunicações > Selo digital; Configurações; Configurações > Tabela de custas > Parâmetros; Integração (apenas pista, não validados como equivalentes). Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.

#### Descrição:
A comunicação segura e a assinatura dos lotes de selos exigem certificado ICP-Brasil corporativo válido no servidor da serventia. Ao vencer a anuidade, o novo arquivo `.pfx` deve ser apontado no daemon.

#### Roteiro Técnico para Execução Manual:
1. Abrir a tela do passo 5 no ambiente de homologação e confirmar onde o recurso ficou na versão atual do Orion TN.
2. Reescrever o passo no manual com o caminho real e reexecutar a auditoria.

* **Regra da Evidência Estrita:** O passo a passo abaixo é o texto original do manual, preservado sem nenhuma alteração.

#### Passo a passo (texto original preservado):
1. Obtenha o novo arquivo `.pfx` emitido pela Autoridade Certificadora e sua respectiva senha.
   [aqui vai a print "passo-01.png"]
2. Acesse o servidor do cartório (via SSH no Linux ou Área de Trabalho Remota no Windows).
   [aqui vai a print "passo-02.png"]
3. Copie o arquivo para o diretório padrão `/etc/siplan/certificados/` (ou `C:\Siplan\Certificados\`).
   [aqui vai a print "passo-03.png"]
4. Ajuste as permissões de leitura no Linux: `chmod 644 /etc/siplan/certificados/novo_cert.pfx`.
   [aqui vai a print "passo-04.png"]
5. No **Orion TN**, acesse **Configurações > Parâmetros de Integração > Certificado Digital**.
   [aqui vai a print "passo-05.png"]
   > [!WARNING] **Bloqueio de auditoria neste passo:** Elemento visual [Orion TN, Configurações > Parâmetros de Integração > Certificado Digital] não localizado no DOM nem na Árvore de Acessibilidade
6. Aponte o novo caminho do arquivo, digite a nova senha e clique em **Testar Conexão**.
7. Reinicie o serviço de background executando `systemctl restart orionselos` (ou reinicie o serviço no Windows).
8. Gere um selo de teste em qualquer ato de balcão para validar a autorização pelo tribunal.

* **Prevenção: Agende a renovação do certificado A1 com 15 dias de antecedência do vencimento para evitar interrupções no atendimento da serventia.**
