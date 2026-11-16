import type { Phase3RoutineEntry } from './phase3-types.js';

/**
 * Manifesto consolidado da Fase 3 (Firmas, Selos, Livros, Certidões e Centrais).
 * Total de 118 rotinas reais mapeadas de kb/rotinas/{firmas,selos,livros,certidoes,centrais}.
 * Zero coordenadas estáticas (ADR-012): toda geometria é extraída via DOM ao vivo.
 */
export const PHASE3_MANIFEST: Phase3RoutineEntry[] = [
  {
    "id": "C-FIRMA-01",
    "slug": "restauracao-de-comunicacao-com-leitores-biometrico",
    "titulo": "Restauração de Comunicação com Leitores Biométricos e Câmeras via IntegradorSPCM",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/C-FIRMA-01-restauracao-de-comunicacao-com-leitores-biometrico.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Periféricos de Balcão"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": true,
      "tag": "[DDD]",
      "reason": "Depende diretamente de hardware externo e serviço local Windows (IntegradorSPCM.exe, leitor biométrico Futronic/SecuGen via USB e webcam)."
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Na estação de atendimento, verifique a bandeja do sistema do Windows (Systray). Se o ícone do **IntegradorSPCM** estiver ausente ou congelado, encerre o processo via Gerenciador de Tarefas.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "IntegradorSPCM"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Desconecte o cabo USB do leitor biométrico e reconecte em uma porta USB traseira da placa-mãe.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Acesse o diretório `C:\\Siplan\\IntegradorSPCM\\` e execute o arquivo `IntegradorSPCM.exe` como Administrador.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Aguarde a confirmação de inicialização do serviço na porta local.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "No **Orion TN**, abra o balcão de firmas, vá em **Configurações > Periféricos de Balcão**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Configurações > Periféricos de Balcão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Configurações > Periféricos de Balcão"
      },
      {
        "stepNumber": 6,
        "rawText": "Na aba **Biometria**, clique em **Testar Captura** e posicione o dedo no sensor.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Biometria",
          "Testar Captura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 7,
        "rawText": "Na aba **Câmera**, selecione o driver nativo e valide a imagem na tela.",
        "actionType": "select",
        "zone": "any",
        "targets": [
          "Câmera"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-FIRMA-02",
    "slug": "regularizacao-de-sequencia-no-livro-de-termos-de-c",
    "titulo": "Regularização de Sequência no Livro de Termos de Comparecimento e Etiquetas de Ressalva",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/C-FIRMA-02-regularizacao-de-sequencia-no-livro-de-termos-de-c.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Fichas de Firmas",
      "Firmas > Livros > Livro de Termos de Comparecimento"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No caso de **Erro de Grafia no Termo Já Impresso**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Erro de Grafia no Termo Já Impresso"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse **Firmas > Fichas de Firmas**, localize o cliente e corrija os dados cadastrais.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Firmas > Fichas de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Fichas de Firmas"
      },
      {
        "stepNumber": 3,
        "rawText": "Acesse **Firmas > Livros > Livro de Termos de Comparecimento** e selecione o termo emitido.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Firmas > Livros > Livro de Termos de Comparecimento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Livros > Livro de Termos de Comparecimento"
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Imprimir Etiqueta de Ressalva** com a opção **Reutilização da Folha do Termo** ativada.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Imprimir Etiqueta de Ressalva",
          "Reutilização da Folha do Termo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Cole a etiqueta retificadora sobre a folha física do livro.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "No caso de **Salto de Numeração**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salto de Numeração"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Na tela de gestão de livros de termos, acesse **Ajuste de Sequência de Termos**.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Ajuste de Sequência de Termos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 8,
        "rawText": "Informe a numeração que deve ser restabelecida como próximo termo e confirme.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-FIRMA-03",
    "slug": "habilitacao-de-permissoes-para-retificacao-e-inclu",
    "titulo": "Habilitação de Permissões para Retificação e Inclusão de Alertas em Fichas de Firma",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/C-FIRMA-03-habilitacao-de-permissoes-para-retificacao-e-inclu.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Segurança > Usuários"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Com perfil de administrador, acesse no **Orion TN** o menu **Configurações > Segurança > Usuários**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Configurações > Segurança > Usuários"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Configurações > Segurança > Usuários"
      },
      {
        "stepNumber": 2,
        "rawText": "Selecione o operador e clique em **Editar**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Editar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Na aba **Grupos de Trabalho**, certifique-se de marcar a opção **Grupo Firmas**.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Grupos de Trabalho",
          "Grupo Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Na aba **Permissões Específicas**, expanda o módulo **Balcão de Firmas** e habilite:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Permissões Específicas",
          "Balcão de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "**[x] Alterar Dados da Ficha de Firma**",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "[x] Alterar Dados da Ficha de Firma"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "**[x] Inserir Observações / Alertas no Cartão de Assinatura**",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "[x] Inserir Observações / Alertas no Cartão de Assinatura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Clique em **Salvar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 8,
        "rawText": "Solicite que o operador faça logoff e login no sistema para atualizar os privilégios.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-FIRMA-04",
    "slug": "unificacao-e-bloqueio-de-cartoes-de-assinatura-abe",
    "titulo": "Unificação e Bloqueio de Cartões de Assinatura Abertos em Duplicidade",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/C-FIRMA-04-unificacao-e-bloqueio-de-cartoes-de-assinatura-abe.md",
    "routeHash": null,
    "menuPaths": [
      "Balcão de Firmas > Fichas / Cartões de Assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Balcão de Firmas > Fichas / Cartões de Assinatura**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Balcão de Firmas > Fichas / Cartões de Assinatura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Balcão de Firmas > Fichas / Cartões de Assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Localize ambas as fichas buscando pelo CPF da parte.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Identifique a ficha mais antiga (ou que possui o maior acervo de imagens e atos) para ser a **Ficha Principal**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Ficha Principal"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Abra a ficha secundária (duplicada) e clique em **Editar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Editar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Altere o status para **Inativo / Bloqueado** e, no campo de observações, registre: *\"Ficha aberta em duplicidade; atos unificados na Ficha nº [NUMERO_PRINCIPAL]\"*.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Inativo / Bloqueado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Na Ficha Principal, registre no histórico a anotação da existência do cartão correlato inativado.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Clique em **Salvar** em ambas as fichas.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-FIRMA-05",
    "slug": "emissao-de-termo-de-comparecimento-com-representac",
    "titulo": "Emissão de Termo de Comparecimento com Representação por Procuração (DUT / CRV)",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/C-FIRMA-05-emissao-de-termo-de-comparecimento-com-representac.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, acesse **Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Firmas > Serviços de Balcão > Termo de Comparecimento (DUT/CRV)"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **Proprietário / Vendedor**, informe o CPF do titular do veículo.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Proprietário / Vendedor"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Marque a opção **Assinado por Representante / Procurador**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Assinado por Representante / Procurador"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Selecione ou busque o cadastro do procurador que está fisicamente no balcão.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Nos campos de identificação do instrumento, informe os dados da procuração (Livro, Folha, Cartório e Data da Lavratura).",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [
          "data"
        ],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Capture a assinatura/biometria do procurador no dispositivo.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Gere e imprima o termo de comparecimento, conferindo o texto de outorga antes da coleta manual da assinatura.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-FIRMA-06",
    "slug": "tratamento-de-rps-rejeitado-no-balcao-de-firmas-po",
    "titulo": "Tratamento de RPS Rejeitado no Balcão de Firmas por Falta de Tomador Identificado",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/C-FIRMA-06-tratamento-de-rps-rejeitado-no-balcao-de-firmas-po.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Parâmetros de NFS-e > Regras de Balcão",
      "Orion Caixa > Notas Fiscais > Listagem de RPS"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse **Configurações > Parâmetros de NFS-e > Regras de Balcão**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Parâmetros de NFS-e > Regras de Balcão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Parâmetros de NFS-e > Regras de Balcão"
      },
      {
        "stepNumber": 2,
        "rawText": "Na seção **Tomador Padrão para Atos Não Identificados**, selecione a modalidade **Consumidor Final / Não Identificado**.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Tomador Padrão para Atos Não Identificados",
          "Consumidor Final / Não Identificado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Caso o provedor exija cadastro específico: informe os dados da Serventia ou a inscrição padrão autorizada pelo fisco municipal.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "No campo **Classificação Tributária / CST**, informe o código de operação notarial sem retenção na fonte.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Classificação Tributária / CST"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Acesse o lote de RPS rejeitado em **Orion Caixa > Notas Fiscais > Listagem de RPS**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Caixa > Notas Fiscais > Listagem de RPS"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Orion Caixa > Notas Fiscais > Listagem de RPS"
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Reprocessar Lote de Firmas** para reenviar as notas com o novo layout parametrizado.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Reprocessar Lote de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-FIRMA-07",
    "slug": "atualizacao-de-valores-da-tabela-de-emolumentos-pa",
    "titulo": "Atualização de Valores da Tabela de Emolumentos para Materialização e Cópias",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/C-FIRMA-07-atualizacao-de-valores-da-tabela-de-emolumentos-pa.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse **Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Parâmetros do Módulo Firmas > Valores e Tarifas"
      },
      {
        "stepNumber": 2,
        "rawText": "Localize a linha do serviço correspondente (ex.: **Materialização de Documento Eletrônico**).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Materialização de Documento Eletrônico"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Atualize o campo **Valor dos Emolumentos** com o valor fixado no provimento anual do estado.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Valor dos Emolumentos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Confira os campos de repasses legais (Fundo do Tribunal, Carteira de Previdência e ISS) para garantir o fechamento exato da soma.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Gravar Parâmetros**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gravar Parâmetros"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Abra um novo pedido no balcão e valide que o sistema puxa o valor oficial automaticamente.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-FIRMA-08",
    "slug": "migracao-e-reconhecimento-de-imagens-de-cartoes-de",
    "titulo": "Migração e Reconhecimento de Imagens de Cartões de Assinatura em Novo Caminho de Rede",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/C-FIRMA-08-migracao-e-reconhecimento-de-imagens-de-cartoes-de.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Parâmetros Gerais > Armazenamento e GED"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Assegure que a pasta compartilhada no novo servidor possui permissões completas de leitura/escrita para todos os usuários do cartório.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Armazenamento e GED**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Configurações > Parâmetros Gerais > Armazenamento e GED"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Configurações > Parâmetros Gerais > Armazenamento e GED"
      },
      {
        "stepNumber": 3,
        "rawText": "Localize o campo **Caminho das Imagens do Balcão de Firmas / Assinaturas**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Caminho das Imagens do Balcão de Firmas / Assinaturas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Informe o novo caminho UNC (ex.: `\\\\novo_servidor\\OrionTN_Imagens\\Firmas\\`).",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Testar Leitura de Diretório** e valide a mensagem de confirmação.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Testar Leitura de Diretório"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Gravar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gravar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Abra uma ficha de firma de teste e certifique-se de que a imagem da assinatura é exibida instantaneamente na tela.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "D-3.11",
    "slug": "fazer-reconhecimento-de-firma",
    "titulo": "Fazer Reconhecimento de Firma",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/D-3.11-fazer-reconhecimento-de-firma.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Reconhecimento de Firmas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Reconhecimento de Firmas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Reconhecimento de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Reconhecimento de Firmas"
      },
      {
        "stepNumber": 2,
        "rawText": "Localize o cliente pelo número do **Pedido**, senha do **SGA** ou pesquisando por **Nome/CPF/Cartão**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Pedido",
          "SGA",
          "Nome/CPF/Cartão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 3,
        "rawText": "Confira na tela os autógrafos cadastrados, documentos de identificação e a fotografia da ficha.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no ícone **+** para adicionar o serviço, selecione a modalidade (**Autenticidade** ou **Semelhança**) e a quantidade de firmas.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "+",
          "Autenticidade",
          "Semelhança"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 5,
        "rawText": "Se for transferência de veículo (DUT), clique em **Preencher com IA** para ler a imagem do documento e gerar o termo de transferência automaticamente.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Preencher com IA"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Impressão/Confirmar** para emitir a etiqueta com selo digital, consumir o estoque e enviar a cobrança ao caixa.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Impressão/Confirmar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.3",
    "slug": "cadastrar-cartao-de-assinatura",
    "titulo": "Cadastrar Cartão de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/D-3.3-cadastrar-cartao-de-assinatura.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Cartão de Assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse **Firmas > Cadastros > Cartão de Assinatura** e clique no botão **Adicionar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastros > Cartão de Assinatura",
          "Adicionar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Firmas > Cadastros > Cartão de Assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Para agilizar o preenchimento, clique em **Preencher com IA** e digitalize ou importe a CNH/RG do cliente.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Preencher com IA"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Revise os dados extraídos pelo OCR (**Nome**, **CPF**, **RG**, **Filiação**, **Endereço** e **Profissão**).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Nome",
          "CPF",
          "RG",
          "Filiação",
          "Endereço",
          "Profissão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 6
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no ícone de **Webcam** para capturar a fotografia da face e em **Capturar Biometria** para ler o leitor digital.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Webcam",
          "Capturar Biometria"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Imprima o cartão de autógrafo físico clicando em **Impressão** para recolher as assinaturas físicas do apresentante.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Impressão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Salvar** para registrar o cartão; se ativado, o sistema consumirá automaticamente o selo e papel de segurança.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.9",
    "slug": "consultar-reconhecimento-de-firmas",
    "titulo": "Consultar Reconhecimento de Firmas",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/D-3.9-consultar-reconhecimento-de-firmas.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Consultas > Consulta de Reconhecimento de Firmas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Consultas > Consulta de Reconhecimento de Firmas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Consultas > Consulta de Reconhecimento de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Consultas > Consulta de Reconhecimento de Firmas"
      },
      {
        "stepNumber": 2,
        "rawText": "Preencha os critérios de pesquisa: **Nome da Parte**, **CPF**, **Número do Pedido**, **Selo Digital** ou **Período**.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Nome da Parte",
          "CPF",
          "Número do Pedido",
          "Selo Digital",
          "Período"
        ],
        "implicitTargets": [],
        "mainTargetCount": 5
      },
      {
        "stepNumber": 3,
        "rawText": "Se desejar refinar, filtre por **Tipo de Reconhecimento** (Autenticidade ou Semelhança) e **Escrevente**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Tipo de Reconhecimento",
          "Escrevente"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Clique em **Filtrar** para carregar os registros na tabela.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Dê um duplo clique na linha do ato para inspecionar os detalhes, selos utilizados, valores e comprovantes de baixa.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "M-14.1",
    "slug": "balcao-de-firmas-como-buscar-e-selecionar-partes-p",
    "titulo": "Balcão de Firmas: Como Buscar e Selecionar Partes para o Reconhecimento",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-14.1-balcao-de-firmas-como-buscar-e-selecionar-partes-p.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Com o pedido aberto na tela **Balcão de firmas**, clique no campo **Partes / Cartão de assinatura**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Balcão de firmas",
          "Partes / Cartão de assinatura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 2,
        "rawText": "Digite o nome da pessoa, número do CPF ou número da ficha e aguarde a exibição da listagem de autocompletar.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Em caso de homônimos, confira na lista o número do CPF, filiação e data de nascimento antes de clicar no registro.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Para sinais públicos de outras serventias, marque a opção **Sinal Público** para filtrar a tabela de tabeliães e prepostos credenciados.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Sinal Público"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Ao selecionar a parte, analise na janela lateral a imagem da assinatura cadastrada, a biometria e a foto do titular para confronto minucioso com a assinatura constante no documento físico apresentado.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Adicionar Parte** para fixar a pessoa no pedido.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar Parte"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-16.4",
    "slug": "gerenciar-sequencias-automaticas-do-sistema",
    "titulo": "Gerenciar Sequências Automáticas do Sistema",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-16.4-gerenciar-sequencias-automaticas-do-sistema.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Parâmetros > Sequências automáticas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Parâmetros > Sequências automáticas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Parâmetros > Sequências automáticas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Parâmetros > Sequências automáticas"
      },
      {
        "stepNumber": 2,
        "rawText": "Na listagem de contadores do sistema, identifique o registro desejado (ex: 'Protocolo de Notas', 'Recibo de Caixa', 'Cartão de Assinatura', 'Pedido de Balcão').",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Verifique o valor exibido na coluna **Último número gerado** e **Próximo número**.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Último número gerado",
          "Próximo número"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Caso seja necessário ajustar a numeração por determinação judicial, correição ou virada de exercício, clique no botão **Editar** do registro.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Editar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Atualize o campo **Próximo número** com o valor correto e selecione se a sequência deve reiniciar anualmente.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Próximo número"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Salvar** para gravar o novo valor do contador.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-16.8",
    "slug": "parametrizar-pedido-de-firmas-e-termo-de-compareci",
    "titulo": "Parametrizar Pedido de Firmas e Termo de Comparecimento",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-16.8-parametrizar-pedido-de-firmas-e-termo-de-compareci.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Parâmetros > Pedido de firmas e Termo de comparecimento**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Parâmetros > Pedido de firmas e Termo de comparecimento"
      },
      {
        "stepNumber": 2,
        "rawText": "Na seção **Pedido de Firmas**, selecione se o cartório utiliza módulo de senhas de atendimento e defina o formato da numeração de pedidos.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Pedido de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Na seção **Termo de Comparecimento**, configure as exigências biométricas: marque a opção para **Exigir captura de biometria** e defina o **Tipo de captura** (**Apenas um dedo** ou **Todos os dedos**).",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Termo de Comparecimento",
          "Exigir captura de biometria",
          "Tipo de captura",
          "Apenas um dedo",
          "Todos os dedos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 5
      },
      {
        "stepNumber": 4,
        "rawText": "Defina as regras de vinculação a **Livros Notariais**, selecionando se a escolha do livro deve ser automática por escrevente ou manual pelo operador.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Livros Notariais"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Marque se o sistema deve gerar automaticamente o espelho de impressão ao concluir o termo.",
        "actionType": "select",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Salvar** para registrar os parâmetros.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-51.3",
    "slug": "como-realizar-a-qualificacao-de-partes-em-um-proto",
    "titulo": "Como Realizar a Qualificação de Partes em um Protocolo",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-51.3-como-realizar-a-qualificacao-de-partes-em-um-proto.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No protocolo em elaboração, clique no card **Qualificação de Partes**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Qualificação de Partes"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Adicionar Parte**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar Parte"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Busque a pessoa física ou jurídica pelo CPF/CNPJ (se já possuir ficha de firma, os dados e documentos serão importados automaticamente).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Defina a **Participação** contratual da pessoa no ato (ex: Outorgante Vendedor, Outorgado Comprador, Doador, Donatário).",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Participação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Se a parte for representada, marque a opção **Representado por Procurador** e selecione a ficha do procurador indicando o livro, folha e cartório da procuração.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Representado por Procurador"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Consultar Indisponibilidade**: o Orion TN conectará à CNIB e emitirá a certidão circunstanciada negativa (ou apontamento de indisponibilidade com respectivo protocolo/hash).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Consultar Indisponibilidade"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Clique no botão **Salvar** para registrar os participantes.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-8.0",
    "slug": "consulta-e-gerenciamento-de-cartao-de-assinatura",
    "titulo": "Consulta e Gerenciamento de Cartão de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-8.0-consulta-e-gerenciamento-de-cartao-de-assinatura.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastro > Cartão de assinatura"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Cadastro > Cartão de assinatura**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastro > Cartão de assinatura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Cadastro > Cartão de assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Na área de filtros, localize o registro utilizando um dos campos: **Pesquisar por nome**, **Documento** (CPF ou RG), **Nº Cartão**, **NFS** (Papel de Segurança), **Pessoa jurídica** representada ou **Rótulo**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Pesquisar por nome",
          "Documento",
          "Nº Cartão",
          "NFS",
          "Pessoa jurídica",
          "Rótulo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 6
      },
      {
        "stepNumber": 3,
        "rawText": "Clique no botão **Filtrar** (ou pressione **Enter**) para carregar os resultados na tabela.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar",
          "Enter"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Na linha do cartão localizado, execute a ação desejada:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Visualizar",
          "Editar",
          "Histórico de atos",
          "Andamentos",
          "Bloquear"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Para registrar um novo cadastro de ficha do zero, clique no botão **Adicionar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-9.0",
    "slug": "abertura-rapida-de-cartao-de-assinatura-no-balcao-",
    "titulo": "Abertura Rápida de Cartão de Assinatura no Balcão (Dados Pessoais)",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-9.0-abertura-rapida-de-cartao-de-assinatura-no-balcao-.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastro > Cartão de assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Cadastro > Cartão de assinatura** e clique em **Adicionar** (ou utilize o atalho de novo cartão diretamente na tela do balcão de atendimento).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastro > Cartão de assinatura",
          "Adicionar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Firmas > Cadastro > Cartão de assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Na aba **Dados pessoais**, insira o **Nome completo** do cliente, **CPF**, documento de identificação (**RG/CNH**, órgão emissor e UF).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Dados pessoais",
          "Nome completo",
          "CPF",
          "RG/CNH"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 3,
        "rawText": "Preencha **Data de nascimento**, **Nacionalidade**, **Estado civil**, **Profissão** e nome dos genitores (filiação).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Data de nascimento",
          "Nacionalidade",
          "Estado civil",
          "Profissão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 4,
        "rawText": "Na seção **Contato e Endereço**, digite o **CEP** para preenchimento automático do logradouro e complemente com número, bairro, telefone celular e e-mail.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Contato e Endereço",
          "CEP"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Clique em **Avançar** para seguir para as etapas de captura biométrica, fotográfica e consumo de selos.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Avançar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-9.1",
    "slug": "anexar-documentos-biometria-e-foto-em-um-cartao-de",
    "titulo": "Anexar Documentos, Biometria e Foto em um Cartão de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-9.1-anexar-documentos-biometria-e-foto-em-um-cartao-de.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": true,
      "tag": "[DDD]",
      "reason": "Rotina dedicada exclusivamente à captura multimídia via hardware externo (webcam, leitor biométrico e scanner de mesa)."
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Dentro do cadastro do cartão de assinatura, acesse a aba **Fotos e Biometria**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Fotos e Biometria"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Na seção **Foto do titular**, clique em **Capturar foto** para acionar a webcam integrada, enquadre o rosto da pessoa e clique em **Salvar foto**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Foto do titular",
          "Capturar foto",
          "Salvar foto"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 3,
        "rawText": "Na seção **Biometria**, selecione o dedo a ser coletado (ex: polegar direito), posicione o dedo do cliente no leitor óptico e colete as amostras solicitadas pelo assistente até atingir a qualidade mínima exigida.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Biometria"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Na aba **Documentos / Anexos**, clique em **Digitalizar** para acionar o scanner de mesa ou em **Selecionar arquivo** para importar o PDF/JPEG da identidade e da ficha física assinada.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Documentos / Anexos",
          "Digitalizar",
          "Selecionar arquivo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 5,
        "rawText": "Ajuste a área de recorte da imagem da assinatura para que fique nítida para as futuras comparações no balcão.",
        "actionType": "click",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Salvar** para registrar as mídias no perfil do cartão.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-9.2",
    "slug": "como-vincular-uma-pessoa-juridica-a-um-cartao-de-a",
    "titulo": "Como Vincular uma Pessoa Jurídica a um Cartão de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-9.2-como-vincular-uma-pessoa-juridica-a-um-cartao-de-a.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastro > Cartão de assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Cadastro > Cartão de assinatura**, filtre pelo nome ou CPF da pessoa física e clique em **Editar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastro > Cartão de assinatura",
          "Editar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Firmas > Cadastro > Cartão de assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "No formulário do cartão, clique na aba **Representante PJ**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Representante PJ"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "No campo **Pessoa Jurídica**, digite a Razão Social ou CNPJ da empresa cadastrada (o campo conta com recurso de busca inteligente).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Pessoa Jurídica"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Selecione o cargo ou condição de representação (ex: Administrador, Procurador, Sócio-Gerente).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Marque a opção **Padrão** se esta for a principal empresa pela qual a pessoa assina no cartório.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Padrão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Adicionar** para incluir o vínculo na listagem do cartão e, em seguida, clique em **Salvar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar",
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      }
    ]
  },
  {
    "id": "M-9.3",
    "slug": "gerenciar-consumo-de-papel-de-seguranca-e-selo-dig",
    "titulo": "Gerenciar Consumo de Papel de Segurança e Selo Digital no Cartão de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/M-9.3-gerenciar-consumo-de-papel-de-seguranca-e-selo-dig.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastro > Cartão de assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Durante a abertura ou edição do cartão em **Firmas > Cadastro > Cartão de assinatura**, acesse a aba **Consumo de Papel / Selo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastro > Cartão de assinatura",
          "Consumo de Papel / Selo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Firmas > Cadastro > Cartão de assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **NFS (Papel de Segurança)**, selecione a série e informe o número do formulário físico utilizado na impressão da ficha de firma.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "NFS (Papel de Segurança)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Se o sistema estiver parametrizado para controle automático de estoque, o número sequencial do lote do escrevente será sugerido automaticamente.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Caso ocorra rasura física durante a coleta da assinatura:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Inutilizar Papel",
          "Reutilizar/Estornar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Salvar** para gerar o selo digital de abertura e consolidar o consumo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "R-1.1",
    "slug": "modulo-orion-tn-firmas-visao-geral-e-atendimento-d",
    "titulo": "Módulo ORION TN: Firmas (Visão Geral e Atendimento de Balcão)",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/R-1.1-modulo-orion-tn-firmas-visao-geral-e-atendimento-d.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Reconhecimento de Firmas",
      "Firmas > Balcão de Firmas"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Reconhecimento de Firmas** ou **Firmas > Balcão de Firmas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Reconhecimento de Firmas",
          "Firmas > Balcão de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Firmas > Reconhecimento de Firmas"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo de busca, pesquise pelo **Nome** ou **CPF** do signatário.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Nome",
          "CPF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "O sistema exibirá o cadastro do cliente com a foto da assinatura digitalizada e documentos anexados.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Para iniciar o atendimento, clique no botão de **\"+\" (Adicionar Serviço)**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "\"+\" (Adicionar Serviço)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Selecione o tipo de ato (ex: **Autenticidade** ou **Semelhança**), confirme os dados e clique em **Impressão** para gerar a etiqueta com selo e finalizar.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Autenticidade",
          "Semelhança",
          "Impressão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      }
    ]
  },
  {
    "id": "R-10.0",
    "slug": "abrir-pedido-de-firmas-no-balcao-de-atendimento",
    "titulo": "Abrir Pedido de Firmas no Balcão de Atendimento",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/R-10.0-abrir-pedido-de-firmas-no-balcao-de-atendimento.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Reconhecimento de Firmas",
      "Firmas > Balcão de Firmas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Reconhecimento de Firmas** ou **Firmas > Balcão de Firmas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Reconhecimento de Firmas",
          "Firmas > Balcão de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Firmas > Reconhecimento de Firmas"
      },
      {
        "stepNumber": 2,
        "rawText": "Na parte superior da tela de atendimento, clique no botão de **\"+\" (Adicionar Novo Pedido)**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "\"+\" (Adicionar Novo Pedido)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Uma mensagem de confirmação será exibida na tela; clique em **Confirmar** para inicializar a comanda.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Confirmar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "O sistema gerará o número sequencial do pedido e liberará os campos de pesquisa de ficha por **Nome** ou **CPF**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Nome",
          "CPF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Localize as partes e prossiga com o lançamento dos reconhecimentos e autenticações necessários.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "R-2.0",
    "slug": "fluxo-de-atendimento-de-firmas-pedidos-e-reconheci",
    "titulo": "Fluxo de Atendimento de Firmas: Pedidos e Reconhecimentos",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/R-2.0-fluxo-de-atendimento-de-firmas-pedidos-e-reconheci.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Balcão de Firmas"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Balcão de Firmas** para abrir a interface central de atendimento.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Balcão de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Balcão de Firmas"
      },
      {
        "stepNumber": 2,
        "rawText": "Inicie um **Novo Pedido** clicando no botão **\"+\"** ou importando a senha do pré-atendimento (Siplan SGA).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Novo Pedido",
          "\"+\""
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "No campo de busca do pedido, pesquise o cliente por **Nome** ou **CPF** para carregar a ficha de assinatura e documentos.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Nome",
          "CPF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Clique em **Adicionar Serviço (+)** e lance os atos solicitados (ex: 2 reconhecimentos por autenticidade e 3 autenticações de cópias) vinculados ao mesmo pedido.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar Serviço (+)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Após concluir os lançamentos e conferências, clique no botão **Finalizar Pedido / Enviar ao Caixa** para emitir as etiquetas com selos e liberar a cobrança.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Finalizar Pedido / Enviar ao Caixa"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "R-3.0",
    "slug": "consultar-pedidos-de-firmas-em-aberto-sem-pagament",
    "titulo": "Consultar Pedidos de Firmas em Aberto Sem Pagamento no Caixa",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/R-3.0-consultar-pedidos-de-firmas-em-aberto-sem-pagament.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Consultas > Reconhecimento de Firmas",
      "Caixa > Administração > Pagamentos"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Consultas > Reconhecimento de Firmas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Consultas > Reconhecimento de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Consultas > Reconhecimento de Firmas"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo de filtro **Período**, defina a data inicial e final do atendimento.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Período"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "No campo **Status**, selecione os filtros **\"Aguardando Pagamento\"** e **\"Iniciado\"**.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Status",
          "\"Aguardando Pagamento\"",
          "\"Iniciado\""
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Filtrar** para listar todas as comandas pendentes de liquidação.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Na lista retornada, clique sobre o número do pedido desejado para conferir os itens ou acesse o módulo **Caixa > Administração > Pagamentos** para efetuar a baixa financeira.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Caixa > Administração > Pagamentos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Caixa > Administração > Pagamentos"
      }
    ]
  },
  {
    "id": "V-1.0",
    "slug": "como-cadastrar-e-gerenciar-o-sinal-publico",
    "titulo": "Como Cadastrar e Gerenciar o Sinal Público",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-1.0-como-cadastrar-e-gerenciar-o-sinal-publico.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Sinal Público"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Cadastros > Sinal Público**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastros > Sinal Público"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Cadastros > Sinal Público"
      },
      {
        "stepNumber": 2,
        "rawText": "Na tela de consulta, clique no botão **Adicionar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Preencha as informações do cartório de origem. Os campos marcados com asterisco (**\\***) são de preenchimento obrigatório:",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "\\",
          "recebido",
          "enviado",
          "data de recebimento/envio",
          "CEP"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Na aba **Pessoas**, preencha o nome e o cargo do escrevente. Para adicionar mais de um, clique no botão **+**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Pessoas",
          "+"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Na aba **Arquivos Anexos**, você pode:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Arquivos Anexos",
          "Selecionar",
          "Capturar",
          "Digitalizar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Após preencher todas as informações, clique em **Concluir**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-3.1.3",
    "slug": "identificacao-e-reaproveitamento-de-dados-do-solic",
    "titulo": "Identificação e Reaproveitamento de Dados do Solicitante para Recibo de Protocolo",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-3.1.3-identificacao-e-reaproveitamento-de-dados-do-solic.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Na tela do protocolo, posicione o cursor sobre a opção **Gerar Recibo** para inspecionar as pendências (o sistema indicará a necessidade de preenchimento do documento e do nome do solicitante).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerar Recibo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Na seção de **Solicitante**, localize os campos **CPF / CNPJ** e **Nome**:",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Solicitante",
          "CPF / CNPJ",
          "Nome",
          "Lupa"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 3,
        "rawText": "Na lista de registros encontrados exibida na tela, selecione a fonte cadastral desejada:",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "(Protocolo)",
          "(Solicitante)",
          "(Tomador)",
          "(Cartão)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Após clicar sobre o registro desejado, o sistema importará e preencherá automaticamente os dados do solicitante, incluindo documento, nome completo, telefone, e-mail e endereço.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Caso necessário, realize ajustes diretamente nos campos de endereço e contato exibidos na tela para este ato específico.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "V-4.1.4",
    "slug": "busca-e-reaproveitamento-de-dados-cadastrais-por-c",
    "titulo": "Busca e Reaproveitamento de Dados Cadastrais por CPF, CNPJ ou Nome (Lupa)",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-4.1.4-busca-e-reaproveitamento-de-dados-cadastrais-por-c.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No card expandido e desbloqueado da parte, escolha o método de pesquisa:",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Busca por CPF (Pessoa Física - Recomendado):",
          "CPF",
          "Lupa",
          "Busca por CNPJ (Pessoa Jurídica):",
          "Pessoa Jurídica",
          "CNPJ",
          "Busca por Nome:",
          "Nome / Razão Social"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "O sistema abrirá uma janela listando as ocorrências encontradas nos bancos de dados, identificando a fonte do cadastro mais recente entre parênteses:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "(cartão):",
          "(número do protocolo):",
          "Solicitante:",
          "Tomador:"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Clique sobre a opção mais completa e atualizada (ex.: a opção identificada como *cartão*).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Observe que o sistema preencherá automaticamente todos os campos de qualificação disponíveis (nome, estado civil, RG, órgão emissor, endereço, filiação, etc.).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Se necessário, complemente ou altere qualquer campo diretamente na tela do protocolo.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "V-CCA.1.1",
    "slug": "abertura-e-preenchimento-basico-do-cartao-de-assin",
    "titulo": "Abertura e Preenchimento Básico do Cartão de Assinatura com Busca e Reaproveitamento de Dados",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.1.1-abertura-e-preenchimento-basico-do-cartao-de-assin.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Cartão de Assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu principal **Firmas > Cadastros > Cartão de Assinatura**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastros > Cartão de Assinatura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Cadastros > Cartão de Assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Na tela de gerenciamento de cartões de assinatura, clique no botão **Adicionar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "O sistema abrirá o formulário de cadastro dinâmico com os campos disponíveis para preenchimento.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Identifique os campos com asterisco (**\\***), que indicam preenchimento obrigatório pelo sistema (por padrão: **Nome** e **CPF**, além de eventuais campos customizados pela serventia).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "\\",
          "Nome",
          "CPF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 5,
        "rawText": "Para reaproveitar dados já cadastrados e agilizar o atendimento:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Nome",
          "Lupa",
          "CPF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Na lista de resultados apresentada pelo sistema:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "(Protocolo)",
          "(Cartão de Assinatura)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Selecione o registro desejado; o sistema exibirá uma mensagem de confirmação para a importação dos dados; clique em **Confirmar** (ou **Sim**).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Confirmar",
          "Sim"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 8,
        "rawText": "Os campos da ficha serão automaticamente populados, permanecendo todos abertos para edição, correção ou complementação.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 9,
        "rawText": "Preencha ou confira os dados pessoais e civis:",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Estado Civil",
          "Dados do Cônjuge",
          "Casado",
          "Solteiro",
          "Divorciado",
          "Documento de Identidade (RG / CNH)",
          "i"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 10,
        "rawText": "Valide o preenchimento:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir",
          "Triângulo de Alerta"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 11,
        "rawText": "Clique no botão **Concluir** para salvar a ficha (caso não vá inserir mídias ou anexos neste momento).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-CCA.1.2",
    "slug": "gerenciamento-de-profissoes-contatos-enderecos-e-r",
    "titulo": "Gerenciamento de Profissões, Contatos, Endereços e Representação de Pessoa Jurídica no Cartão de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.1.2-gerenciamento-de-profissoes-contatos-enderecos-e-r.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Na tela de cadastro do **Cartão de Assinatura**, localize o campo **Profissão**:",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Cartão de Assinatura",
          "Profissão",
          "Atenção:",
          "NÃO",
          "Lupa",
          "Ctrl+C",
          "+",
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 2,
        "rawText": "Na seção de **Contatos (E-mails e Telefones)**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Contatos (E-mails e Telefones)",
          "E-mails",
          "+",
          "-",
          "Telefones",
          "Principal"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Na seção de **Endereços**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Endereços",
          "+",
          "Principal"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Na seção de **Representação de Pessoa Jurídica (Empresas)**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Representação de Pessoa Jurídica (Empresas)",
          "+",
          "Nome / Razão Social",
          "CNPJ",
          "Padrão",
          "Termo de Comparecimento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Após preencher todas as seções e verificar as informações, clique no botão **Concluir** para gravar o cartão de assinatura.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-CCA.1.3",
    "slug": "captura-de-foto-facial-biometria-e-imagemdigitaliz",
    "titulo": "Captura de Foto Facial, Biometria e Imagem/Digitalização do Cartão de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.1.3-captura-de-foto-facial-biometria-e-imagemdigitaliz.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": true,
      "tag": "[DDD]",
      "reason": "Rotina dedicada exclusivamente à captura de foto facial (webcam), coleta biométrica (leitor digital) e digitalização (scanner/webcam)."
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Com o cadastro do **Cartão de Assinatura** aberto na tela, direcione a atenção ao **Painel Lateral Direito**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Cartão de Assinatura",
          "Painel Lateral Direito"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 2,
        "rawText": "Para realizar a **Captura de Foto Facial da Pessoa**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Captura de Foto Facial da Pessoa",
          "Capturar",
          "Tirar Foto",
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Para realizar a **Coleta Biométrica (Impressão Digital)**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Coleta Biométrica (Impressão Digital)",
          "Coleta Biométrica",
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Para realizar a **Inclusão da Imagem do Cartão de Assinatura Físico**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Inclusão da Imagem do Cartão de Assinatura Físico",
          "Opção A - Importar de Pasta (Arquivo)",
          "Abrir",
          "Opção B - Captura Direta via Scanner",
          "Scanner",
          "Opção C - Captura via Foto (Webcam)",
          "ATENÇÃO (Passo Obrigatório):",
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Após registrar as fotos, biometrias e imagens do cartão, clique no botão **Concluir** na parte inferior do cadastro do cartão de assinatura para finalizar e gravar todas as mídias no banco de dados.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-CCA.2.1",
    "slug": "consulta-avancada-filtros-e-relatorios-de-cartoes-",
    "titulo": "Consulta Avançada, Filtros e Relatórios de Cartões de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.2.1-consulta-avancada-filtros-e-relatorios-de-cartoes-.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Cartão de Assinatura"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu principal **Firmas > Cadastros > Cartão de Assinatura**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastros > Cartão de Assinatura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Cadastros > Cartão de Assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Na barra de pesquisa superior, observe que o botão **Filtrar** só é habilitado após o preenchimento de pelo menos um dos critérios obrigatórios (marcados com asterisco **\\***).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar",
          "\\"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Para pesquisar por **Nome**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Nome",
          "Enter",
          "Busca Fonética",
          "Contém"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Para pesquisar por **Documento**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Documento",
          "CPF",
          "Filtrar",
          "Enter"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Para pesquisar por **Período de Cadastro**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Período de Cadastro",
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Manipulando a **Tabela de Resultados**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Tabela de Resultados",
          "Número do Cartão",
          "Data de Cadastro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Para gerar o **Relatório em PDF**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Relatório em PDF",
          "Imprimir",
          "PDF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-CCA.2.2",
    "slug": "consulta-rapida-de-anexos-historico-de-andamentos-",
    "titulo": "Consulta Rápida de Anexos, Histórico de Andamentos e Bloqueio de Ficha",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.2.2-consulta-rapida-de-anexos-historico-de-andamentos-.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Cartão de Assinatura"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse **Firmas > Cadastros > Cartão de Assinatura** e realize o filtro do registro desejado.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastros > Cartão de Assinatura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Cadastros > Cartão de Assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Observe os **Indicadores Visuais Rápidos** na linha do registro:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Indicadores Visuais Rápidos",
          "Ícone de Imagem do Cartão",
          "Verde",
          "Indicador de Foto",
          "Atalho de Biometria"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Para **Visualizar Anexos e Imagens da Ficha**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Visualizar Anexos e Imagens da Ficha",
          "Anexos",
          "Visualização em Tela Cheia",
          "Esc",
          "Fechar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Para auditar o **Histórico de Andamentos**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Histórico de Andamentos",
          "Andamentos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Para **Bloquear uma Ficha de Assinatura**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Bloquear uma Ficha de Assinatura",
          "Bloquear Ficha"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Para consultar os dados da ficha sem risco de alteração acidental, clique no botão **Visualizar** (modo somente leitura).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Visualizar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-CCA.2.3",
    "slug": "edicao-com-liberacao-de-supervisor-e-gestao-de-pap",
    "titulo": "Edição com Liberação de Supervisor e Gestão de Papel de Segurança (Consumo, Estorno e Inutilização)",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.2.3-edicao-com-liberacao-de-supervisor-e-gestao-de-pap.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Cartão de Assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse **Firmas > Cadastros > Cartão de Assinatura**, filtre o registro e clique no ícone da **Caneta** (**Alteração**).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Firmas > Cadastros > Cartão de Assinatura",
          "Caneta",
          "Alteração"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3,
        "menuPath": "Firmas > Cadastros > Cartão de Assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Para **Editar Campos Sensíveis Bloqueados (Nome / Documentos)**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Editar Campos Sensíveis Bloqueados (Nome / Documentos)",
          "Editar",
          "Login",
          "Senha",
          "Supervisor"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Para **Consumir o Papel de Segurança (Formulário)**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Consumir o Papel de Segurança (Formulário)",
          "Consumir",
          "Concluir",
          "Reservado",
          "Consumido"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Para **Estornar o Papel de Segurança de Volta ao Estoque (Reutilizar)**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Estornar o Papel de Segurança de Volta ao Estoque (Reutilizar)",
          "Reutilizar",
          "Estoque"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Para **Inutilizar Definitivamente o Papel de Segurança**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Inutilizar Definitivamente o Papel de Segurança",
          "X",
          "Inutilizar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Concluir** para salvar a edição do cartão de assinatura.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-CCA.3.1",
    "slug": "geracao-e-gerenciamento-de-selo-digital-automatico",
    "titulo": "Geração e Gerenciamento de Selo Digital (Automático e Manual) no Cartão de Assinatura",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.3.1-geracao-e-gerenciamento-de-selo-digital-automatico.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Cartão de Assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse **Firmas > Cadastros > Cartão de Assinatura** e abra a ficha desejada pelo ícone da **Caneta** (**Alteração**) ou realize um novo cadastro.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastros > Cartão de Assinatura",
          "Caneta",
          "Alteração"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3,
        "menuPath": "Firmas > Cadastros > Cartão de Assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Identifique o fluxo de geração de **Selo Digital** configurado na sua serventia:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Selo Digital",
          "Fluxo A - Geração Automática",
          "Concluir",
          "QR Code",
          "Fluxo B - Geração Manual",
          "Gerar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Tratando o status de comunicação:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Homologação",
          "Comunicação pendente"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Para **Gerenciar o Selo Gerado**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerenciar o Selo Gerado",
          "Visualizar QR Code",
          "QR Code",
          "Reutilizar Selo",
          "Cancelar Selo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Clique em **Concluir** para salvar as alterações na ficha.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-CCA.3.2",
    "slug": "impressao-da-ficha-do-cartao-de-assinatura-e-desti",
    "titulo": "Impressão da Ficha do Cartão de Assinatura e Destinação de Impressora",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.3.2-impressao-da-ficha-do-cartao-de-assinatura-e-desti.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Cartão de Assinatura"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse **Firmas > Cadastros > Cartão de Assinatura**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastros > Cartão de Assinatura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Cadastros > Cartão de Assinatura"
      },
      {
        "stepNumber": 2,
        "rawText": "Filtre e abra o cartão de assinatura gravado clicando no ícone da **Caneta** (**Alteração**).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Caneta",
          "Alteração",
          "Atenção:"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Verifique se os dados cadastrais, o número do papel de segurança e o selo digital (se aplicável) estão devidamente preenchidos.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Na barra de ações do formulário, clique no botão **Imprimir**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Imprimir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "O sistema exibirá a tela de parâmetros de impressão:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Modelo",
          "Impressora"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Confirmar** (ou **Imprimir**) para enviar o documento para a impressora.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Confirmar",
          "Imprimir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 7,
        "rawText": "Solicite que o titular aponha suas assinaturas físicas e rubricas nos campos delimitados do cartão impresso.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 8,
        "rawText": "Retorne à tela do sistema e clique no botão **Concluir** para finalizar a manutenção do cartão de assinatura.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-CCA.3.3",
    "slug": "cadastro-rapido-e-edicao-de-cartao-de-assinatura-i",
    "titulo": "Cadastro Rápido e Edição de Cartão de Assinatura Integrados ao Reconhecimento de Firmas",
    "modulo": "firmas",
    "filePath": "kb/rotinas/firmas/V-CCA.3.3-cadastro-rapido-e-edicao-de-cartao-de-assinatura-i.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Reconhecimento de Firmas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu principal **Firmas > Reconhecimento de Firmas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Reconhecimento de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Reconhecimento de Firmas"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo de pesquisa do reconhecimento, informe o **Nome** ou **CPF** do comparecente para conferir se há ficha cadastrada.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Nome",
          "CPF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Se a pesquisa **NÃO** retornar registro cadastrado para a parte:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "NÃO",
          "Novo Cadastro",
          "+",
          "Nome",
          "CPF",
          "Concluir",
          "Diferencial de Balcão:"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Se a pesquisa **LOCALIZAR** um registro existente que necessite de atualização cadastral:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "LOCALIZAR",
          "Cadastro Completo",
          "Alterar",
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Prossiga normalmente com o lançamento do ato de reconhecimento de firma (selecionando o tipo de reconhecimento: por autenticidade, por semelhança com valor ou sem valor) e finalize o atendimento.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-SELO-01",
    "slug": "resolucao-de-divergencia-no-recolhimento-semanal-d",
    "titulo": "Resolução de Divergência no Recolhimento Semanal de Selos com o Portal do TJSP",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-01-resolucao-de-divergencia-no-recolhimento-semanal-d.md",
    "routeHash": null,
    "menuPaths": [
      "Módulos > Selo Digital > Auditoria / Conferência Semanal"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, acesse o menu **Módulos > Selo Digital > Auditoria / Conferência Semanal**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Módulos > Selo Digital > Auditoria / Conferência Semanal"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Módulos > Selo Digital > Auditoria / Conferência Semanal"
      },
      {
        "stepNumber": 2,
        "rawText": "Filtre o período fiscal exato da semana em apuração (segunda a domingo).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Verifique a grade de **Selos com Envio Pendente** ou **Aguardando Retorno**.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Selos com Envio Pendente",
          "Aguardando Retorno"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Transmitir Fila de Selos Pendentes** para forçar a comunicação síncrona com o webservice do TJ.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Transmitir Fila de Selos Pendentes"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Caso o portal do TJSP continue desatualizado: acione a rotina **Exportar Arquivo de Remessa Manual** no Orion TN.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Exportar Arquivo de Remessa Manual"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Acesse o portal do TJSP com certificado digital e efetue a **Reimportação Manual de Lote**, confirmando o aceite.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Reimportação Manual de Lote"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-SELO-02",
    "slug": "tratamento-de-duplicidade-de-selos-digitais-por-in",
    "titulo": "Tratamento de Duplicidade de Selos Digitais por Instabilidade ou Timeout de Webservice",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-02-tratamento-de-duplicidade-de-selos-digitais-por-in.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Abra o protocolo no **Orion TN** e acesse a aba **Custas / Selos**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Custas / Selos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 2,
        "rawText": "Identifique qual dos selos foi impresso no documento físico e qual ficou excedente (espúrio).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "No selo excedente, clique em **Estornar Selo** e justifique: *\"Duplicidade sistêmica decorrente de timeout de conexão\"*.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Estornar Selo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Na grade de custas, remova o lançamento excedente para que o valor não seja cobrado da parte.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "**Ação de Suporte Siplan N2 (se o lote ainda não fechou no TJ):**",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Ação de Suporte Siplan N2 (se o lote ainda não fechou no TJ):"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "O suporte técnico executará a chamada de cancelamento via API de retaguarda para registrar a anulação do selo órfão diretamente no webservice do tribunal antes do fechamento semanal.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-SELO-03",
    "slug": "chaveamento-emergencial-para-modo-offline-continge",
    "titulo": "Chaveamento Emergencial para Modo Offline (Contingência de Selos) por Queda do TJ",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-03-chaveamento-emergencial-para-modo-offline-continge.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Parâmetros Gerais > Selo Digital",
      "Usuários e Perfis > Módulo Selos > Alternar Contingência"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Com login de administrador ou substituto, acesse no **Orion TN** o menu **Configurações > Parâmetros Gerais > Selo Digital** (ou aba **Integração TJ**).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Configurações > Parâmetros Gerais > Selo Digital",
          "Integração TJ"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3,
        "menuPath": "Configurações > Parâmetros Gerais > Selo Digital"
      },
      {
        "stepNumber": 2,
        "rawText": "Localize a opção **Modo de Envio do Selo Digital**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Modo de Envio do Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Altere o parâmetro de **Online** para **Modo de Selagem Offline (Contingência)**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Online",
          "Modo de Selagem Offline (Contingência)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Salvar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Caso o usuário receba alerta de acesso negado: libere a permissão em **Usuários e Perfis > Módulo Selos > Alternar Contingência**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Usuários e Perfis > Módulo Selos > Alternar Contingência"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Usuários e Perfis > Módulo Selos > Alternar Contingência"
      },
      {
        "stepNumber": 6,
        "rawText": "Prossiga com os atendimentos e lavraturas normalmente (os selos serão numerados pela base local).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Assim que o tribunal restabelecer a operação: retorne o parâmetro para **Online** e acione **Transmitir Lote de Contingência Acumulado**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Online",
          "Transmitir Lote de Contingência Acumulado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      }
    ]
  },
  {
    "id": "C-SELO-04",
    "slug": "substituicao-de-certificado-digital-a1-vencido-no-",
    "titulo": "Substituição de Certificado Digital A1 Vencido no Servidor Daemon de Selos",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-04-substituicao-de-certificado-digital-a1-vencido-no-.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Parâmetros de Integração > Certificado Digital"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Obtenha o novo arquivo `.pfx` emitido pela Autoridade Certificadora e sua respectiva senha.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse o servidor do cartório (via SSH no Linux ou Área de Trabalho Remota no Windows).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Copie o arquivo para o diretório padrão `/etc/siplan/certificados/` (ou `C:\\Siplan\\Certificados\\`).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Ajuste as permissões de leitura no Linux: `chmod 644 /etc/siplan/certificados/novo_cert.pfx`.",
        "actionType": "click",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "No **Orion TN**, acesse **Configurações > Parâmetros de Integração > Certificado Digital**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Configurações > Parâmetros de Integração > Certificado Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Configurações > Parâmetros de Integração > Certificado Digital"
      },
      {
        "stepNumber": 6,
        "rawText": "Aponte o novo caminho do arquivo, digite a nova senha e clique em **Testar Conexão**.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Testar Conexão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Reinicie o serviço de background executando `systemctl restart orionselos` (ou reinicie o serviço no Windows).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 8,
        "rawText": "Gere um selo de teste em qualquer ato de balcão para validar a autorização pelo tribunal.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-SELO-05",
    "slug": "fluxo-obrigatorio-para-cancelamento-de-protocolo-c",
    "titulo": "Fluxo Obrigatório para Cancelamento de Protocolo com Selo Digital já Gerado",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-05-fluxo-obrigatorio-para-cancelamento-de-protocolo-c.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No menu **Notas**, localize e abra o **Protocolo** que será cancelado.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas",
          "Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 2,
        "rawText": "Navegue até a aba **Custas / Selos**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Custas / Selos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Na grade de selos emitidos, selecione o selo e acione o botão **Estornar Selo** (justifique a desistência da parte).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Estornar Selo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Ainda na aba de custas, clique sobre a linha dos emolumentos e acione **Excluir Lançamento de Custas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Excluir Lançamento de Custas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Após o selo e as custas estarem estornados, retorne à aba principal de **Dados do Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Dados do Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Altere o campo **Status do Ato** para **Cancelado / Desistido** e clique em **Salvar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Status do Ato",
          "Cancelado / Desistido",
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 7,
        "rawText": "O sistema registrará a inutilização do selo e transmitirá o evento de cancelamento no fechamento do lote.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-SELO-06",
    "slug": "emissao-de-selo-de-retificacao-tipo-xa-para-metada",
    "titulo": "Emissão de Selo de Retificação (Tipo XA) para Metadados de Selo já Transmitido",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-06-emissao-de-selo-de-retificacao-tipo-xa-para-metada.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, localize o protocolo ou cartão de autógrafo afetado.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Orion TN"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse o menu de ações do ato e selecione **Retificação de Selo Digital**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Retificação de Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "O sistema exibirá a janela de evento retificador.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "No campo **Justificativa Legal**, digite a motivação (ex.: *\"Correção material de iniciais da parte outorgante\"*).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Justificativa Legal"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Preencha os novos dados retificados nos campos correspondentes.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Confirmar e Gerar Selo de Retificação**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Confirmar e Gerar Selo de Retificação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "O Orion TN gerará automaticamente o selo **Tipo XA**, vinculando-o ao selo original e transmitindo a atualização ao tribunal.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Tipo XA"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-SELO-07",
    "slug": "enquadramento-e-parametrizacao-de-selos-sem-valor-",
    "titulo": "Enquadramento e Parametrização de Selos Sem Valor Econômico (Sem Valor 1 e 2)",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-07-enquadramento-e-parametrizacao-de-selos-sem-valor-.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Abra o protocolo no **Orion TN** e vá até a aba **Custas / Emolumentos**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Custas / Emolumentos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **Enquadramento Tributário / Tabela do TJ**, selecione a rubrica exata:",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Enquadramento Tributário / Tabela do TJ"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Utilize **Sem Valor Econômico 1** para escrituras declaratórias, emancipações e atas sem patrimônio.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Sem Valor Econômico 1"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Utilize **Sem Valor Econômico 2** para atos com gratuidade decorrente de assistência judiciária ou determinação legal.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Sem Valor Econômico 2"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Zere todos os valores lançados em campos não compatíveis com a isenção.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Se houver recibo financeiro estornado associado: gere um novo recibo definitivo no **Orion Caixa** para que o ato e o selo se correlacionem.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Caixa"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Clique em **Salvar** e retransmita o selo digital.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-SELO-08",
    "slug": "correcao-de-falha-de-lote-de-selos-por-desconexao-",
    "titulo": "Correção de Falha de Lote de Selos por Desconexão de Token e Assinador Local",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-08-correcao-de-falha-de-lote-de-selos-por-desconexao-.md",
    "routeHash": null,
    "menuPaths": [
      "Módulos > Selo Digital > Transmissão de Lote"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": true,
      "tag": "[DDD]",
      "reason": "Depende diretamente de hardware externo (token físico A3 USB / leitora de cartão) e serviço local Assinador Orion."
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Feche o navegador e os módulos do **Orion TN** abertos na estação.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Desconecte o token ou leitora de cartão da porta USB e conecte em uma porta traseira estável.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Abra o aplicativo **Gerenciador de Certificados / Token** (ex.: SafeNet / SafeSign) e valide se o certificado está visível.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerenciador de Certificados / Token"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Na barra de tarefas do Windows (Systray), clique com botão direito no ícone do **Assinador Orion** e acione **Reiniciar Serviço**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Assinador Orion",
          "Reiniciar Serviço"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Abra o **Orion TN**, acesse **Módulos > Selo Digital > Transmissão de Lote**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Módulos > Selo Digital > Transmissão de Lote"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Módulos > Selo Digital > Transmissão de Lote"
      },
      {
        "stepNumber": 6,
        "rawText": "Selecione o lote pendente, insira o código PIN do token quando solicitado e conclua o envio.",
        "actionType": "select",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-SELO-09",
    "slug": "estorno-e-reatribuicao-de-sequencia-de-selos-distr",
    "titulo": "Estorno e Reatribuição de Sequência de Selos Distribuídos Incorretamente",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-09-estorno-e-reatribuicao-de-sequencia-de-selos-distr.md",
    "routeHash": null,
    "menuPaths": [
      "Distribuição > Histórico de Distribuição"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o módulo **Orion Estoque** com perfil de administrador.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Estoque"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Navegue até **Distribuição > Histórico de Distribuição**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Distribuição > Histórico de Distribuição"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Distribuição > Histórico de Distribuição"
      },
      {
        "stepNumber": 3,
        "rawText": "Localize a distribuição equivocada entregue ao operador.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Verifique se nenhum selo daquele lote já foi consumido em atos lavrados.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Estornar Distribuição** e confirme o cancelamento.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Estornar Distribuição"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Acesse a tela de **Nova Distribuição**, selecione a sequência numérica rigorosamente correta e atribua novamente ao operador.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Nova Distribuição"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Solicite ao escrevente que atualize a tela de lavratura para carregar o novo numerador.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-SELO-10",
    "slug": "desativacao-de-campos-obrigatorios-de-itcmd-em-rec",
    "titulo": "Desativação de Campos Obrigatórios de ITCMD em Recibos e Protocolos",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/C-SELO-10-desativacao-de-campos-obrigatorios-de-itcmd-em-rec.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Cadastros Auxiliares > Naturezas de Atos",
      "Configurações > Parâmetros do Caixa > Emissão de Recibos"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Configurações > Cadastros Auxiliares > Naturezas de Atos**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Cadastros Auxiliares > Naturezas de Atos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Cadastros Auxiliares > Naturezas de Atos"
      },
      {
        "stepNumber": 2,
        "rawText": "Localize a natureza jurídica do ato que está bloqueado (ex.: **Compra e Venda Pura** ou **Procuração**).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Compra e Venda Pura",
          "Procuração"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Clique em **Editar** e acesse a aba **Obrigações e Parâmetros Fiscais**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Editar",
          "Obrigações e Parâmetros Fiscais"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Desmarque o checkbox **Exigir Comprovante de ITCMD na Conclusão do Protocolo**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Exigir Comprovante de ITCMD na Conclusão do Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Acesse também **Configurações > Parâmetros do Caixa > Emissão de Recibos** e assegure que a validação de ITCMD esteja restrita às naturezas de inventário e doação.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Parâmetros do Caixa > Emissão de Recibos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Parâmetros do Caixa > Emissão de Recibos"
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Salvar Parâmetros**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar Parâmetros"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Retorne ao protocolo, clique em **Salvar** e gere o recibo financeiro com sucesso.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-2.4",
    "slug": "cadastrar-categoria-de-produto",
    "titulo": "Cadastrar Categoria de Produto",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/D-2.4-cadastrar-categoria-de-produto.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Cadastros Auxiliares > Categoria de Produto"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Configurações > Cadastros Auxiliares > Categoria de Produto**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Cadastros Auxiliares > Categoria de Produto"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Cadastros Auxiliares > Categoria de Produto"
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Adicionar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Digite o **Nome da Categoria** (ex: Papel de Segurança para Traslados ou Selos de Fiscalização).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Nome da Categoria"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Informe uma **Sigla** ou código de referência e uma breve descrição do grupo.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Sigla"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Clique em **Salvar** para disponibilizar a categoria nos cadastros de produtos.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-2.7",
    "slug": "cadastrar-produto",
    "titulo": "Cadastrar Produto",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/D-2.7-cadastrar-produto.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Cadastros Auxiliares > Produto"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Configurações > Cadastros Auxiliares > Produto**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Cadastros Auxiliares > Produto"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Cadastros Auxiliares > Produto"
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Adicionar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Preencha o **Nome do Produto** (ex: Papel de Segurança A4 - Escrituras) e a **Categoria**.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Nome do Produto",
          "Categoria"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Selecione a **Unidade de Medida** (Folha, Unidade, Milhar) e informe o **Estoque Mínimo**.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Unidade de Medida",
          "Estoque Mínimo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Configure as opções de rastreabilidade:",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Controlar por Sequência Numérica/Série",
          "Critério Padrão de Distribuição"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Salvar** para registrar o produto no catálogo da serventia.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.35",
    "slug": "gerar-selo-de-cancelamento",
    "titulo": "Gerar Selo de Cancelamento",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/D-3.35-gerar-selo-de-cancelamento.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o protocolo notarial que teve o ato cancelado em **Notas > Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "Na barra de ações do livro, selecione a opção **Cancelar Ato / Lavrar Cancelamento**.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Cancelar Ato / Lavrar Cancelamento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "No formulário de cancelamento, selecione o **Motivo Legal** (ex: Não comparecimento das partes no prazo legal ou Distrato antes das assinaturas).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Motivo Legal"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Gerar Selo de Cancelamento**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerar Selo de Cancelamento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "O sistema requisitará o selo digital específico de cancelamento junto ao TJ e formatará o termo de cancelamento na página do livro.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Imprimir Termo de Cancelamento** e transmita a comunicação obrigatória à Corregedoria.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Imprimir Termo de Cancelamento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.6",
    "slug": "fazer-digitalizacao-em-lote-por-codigo-de-barras-d",
    "titulo": "Fazer Digitalização em Lote por Código de Barras do Papel",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/D-3.6-fazer-digitalizacao-em-lote-por-codigo-de-barras-d.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Cadastros > Digitalização em Lote > Por Código de Barras do Papel"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": true,
      "tag": "[DDD]",
      "reason": "Depende diretamente de scanner físico com alimentador e leitura óptica de código de barras em lote."
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Posicione a pilha de cartões de firma no alimentador do scanner (sem necessidade de ordenação numérica).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse o menu **Firmas > Cadastros > Digitalização em Lote > Por Código de Barras do Papel**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Cadastros > Digitalização em Lote > Por Código de Barras do Papel"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Cadastros > Digitalização em Lote > Por Código de Barras do Papel"
      },
      {
        "stepNumber": 3,
        "rawText": "Clique no botão **Iniciar Leitura**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Iniciar Leitura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "O sistema processará as páginas e identificará o código de barras de cada folha, exibindo o número do cartão correspondente.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Verifique a lista de imagens processadas; cartões não identificados ficarão com alerta amarelo para conferência manual.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Concluir e Salvar** para gravar as imagens em seus respectivos cadastros.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir e Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.75",
    "slug": "ativar-consumo-automatico-de-papel-e-selos",
    "titulo": "Ativar Consumo Automático de Papel e Selos",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/D-3.75-ativar-consumo-automatico-de-papel-e-selos.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Parametrizações > Consumo de Insumos"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Configurações > Parametrizações > Consumo de Insumos**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Parametrizações > Consumo de Insumos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Parametrizações > Consumo de Insumos"
      },
      {
        "stepNumber": 2,
        "rawText": "Marque a opção **Ativar Consumo Automático de Papel de Segurança**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Ativar Consumo Automático de Papel de Segurança"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Marque a opção **Ativar Consumo Automático de Selos Digitais / Físicos**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Ativar Consumo Automático de Selos Digitais / Físicos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Defina o gatilho da baixa: marque **Ao Converter em Livro Definitivo** (para escrituras) e **Ao Concluir Pedido** (para certidões e balcão).",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Ao Converter em Livro Definitivo",
          "Ao Concluir Pedido"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Configure a regra de contingência: se o sistema deve **Bloquear Impressão caso o Estoque do Usuário esteja Zerado**.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Bloquear Impressão caso o Estoque do Usuário esteja Zerado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Salvar Alterações** para aplicar a regra em toda a rede do cartório.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar Alterações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-4.0",
    "slug": "cancelamento-e-inutilizacao-de-selos-com-selo-digi",
    "titulo": "Cancelamento e Inutilização de Selos com Selo Digital Gerado (Firmas)",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/D-4.0-cancelamento-e-inutilizacao-de-selos-com-selo-digi.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Reconhecimento de Firmas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Reconhecimento de Firmas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Reconhecimento de Firmas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Reconhecimento de Firmas"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **Pedido** (canto superior esquerdo), digite o número do pedido onde o selo foi consumido.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Pedido"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Verifique o status do pedido: se constar 'Pago', estorne o recebimento no caixa e clique no botão **Reabrir Pedido**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Reabrir Pedido"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "No card **Serviços Realizados**, clique no ícone de **Detalhes** (quatro traços) ao lado do serviço para listar os selos utilizados.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Serviços Realizados",
          "Detalhes"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Marque a caixa de seleção do selo específico e selecione a ação adequada:",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "X",
          "Inutilizar",
          "Seta/Flexinha",
          "Reutilizar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Confirme a operação para concluir a remoção do selo do pedido e atualizar o inventário.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "M-15.0",
    "slug": "central-selo-digital-tj-sp",
    "titulo": "Central Selo Digital TJ-SP",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/M-15.0-central-selo-digital-tj-sp.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Selo Digital"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Selo Digital**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Selo Digital"
      },
      {
        "stepNumber": 2,
        "rawText": "Ao abrir a tela, o sistema filtra automaticamente os selos com status **Comunicação pendente** referentes à data atual.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Comunicação pendente"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Para refinar a pesquisa, utilize os filtros: **Status** (**Comunicado**, **Comunicação pendente**, **Aguardando retificação**, **Falha**, **Retificado**), **Data do ato**, **Produto**, **Série**, **Sequência** ou número do **Selo Digital** (25 dígitos).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Status",
          "Comunicado",
          "Comunicação pendente",
          "Aguardando retificação",
          "Falha",
          "Retificado",
          "Data do ato",
          "Produto",
          "Série",
          "Sequência",
          "Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 11
      },
      {
        "stepNumber": 4,
        "rawText": "Clique em **Filtrar** para listar as ocorrências.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Para transmitir os selos pendentes ou retificados, clique no botão **Comunicar** e aguarde a barra de progresso.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Comunicar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Na listagem de resultados, utilize os botões auxiliares em cada registro:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Detalhes",
          "QrCode",
          "Andamentos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "M-16.1",
    "slug": "parametrizacoes-gerais-do-sistema",
    "titulo": "Parametrizações Gerais do Sistema",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/M-16.1-parametrizacoes-gerais-do-sistema.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Parâmetros > Parâmetros gerais"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Parâmetros > Parâmetros gerais**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Parâmetros > Parâmetros gerais"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Parâmetros > Parâmetros gerais"
      },
      {
        "stepNumber": 2,
        "rawText": "Na aba **Geral**, configure o comportamento de insumos: marque se o sistema deve exigir o consumo de **Papel de Segurança (NFS)** na emissão de atos.",
        "actionType": "select",
        "zone": "any",
        "targets": [
          "Geral",
          "Papel de Segurança (NFS)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Na seção **Selo Digital**, defina o modo de geração preferencial (**Online** para envio em tempo real ou **Offline** para envio agrupado).",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Selo Digital",
          "Online",
          "Offline"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 4,
        "rawText": "No campo **Arredondamento de custas**, selecione o critério homologado para frações de centavos (Arredondamento ABNT, Truncamento ou Superior).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Arredondamento de custas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Na seção **Guias**, ative o controle de numeração automática e regras de controle fiscal se aplicável.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Guias"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Salvar** para aplicar as diretrizes globais do cartório.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "R-1.4",
    "slug": "funcionalidades-da-barra-superior-selo-digital-ale",
    "titulo": "Funcionalidades da Barra Superior (Selo Digital, Alertas e Calendário)",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/R-1.4-funcionalidades-da-barra-superior-selo-digital-ale.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Localize a **Barra Superior** fixa no cabeçalho do sistema, acessível a partir de qualquer módulo de trabalho.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Barra Superior"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no ícone de **Selo Digital** para abrir instantaneamente o painel de comunicação e conferência de selos pendentes com a Corregedoria/TJ.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Clique no ícone do **Siplan SGA** para acionar o próximo cliente da fila de espera do balcão diretamente do seu terminal.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Siplan SGA"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Acesse o ícone do **Sino de Notificações** para acompanhar em tempo real alertas de pedidos iniciados, pendências financeiras e recados da equipe.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Sino de Notificações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no ícone do **Calendário** para visualizar feriados forenses, dias não úteis e prazos de cumprimento dos atos notariais.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Calendário"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "R-1.6",
    "slug": "modulos-integrados-orion-stock-orion-caixa-e-orion",
    "titulo": "Módulos Integrados: Orion Stock, Orion Caixa e Orion GED",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/R-1.6-modulos-integrados-orion-stock-orion-caixa-e-orion.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No menu superior principal, clique em **Stock (Estoque)** para controlar aquisição, distribuição e saldo de selos físicos, papéis de segurança e certidões.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Stock (Estoque)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse o módulo **Caixa** para realizar abertura/fechamento de operadores, recebimentos de balcão, conciliação bancária e emissão de recibos e Livro Caixa.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Caixa"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Acesse o módulo **GED** diretamente ou através da aba **Anexos** nos protocolos e cartões de assinatura para consultar ou digitalizar certidões, procurações e documentos de identidade.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "GED",
          "Anexos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Navegue entre os módulos mantendo guias independentes abertas no navegador, assegurando que o atendimento financeiro não interrompa a qualificação de atos.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "R-17.0",
    "slug": "comunicar-selos-digitais-pendentes-ao-tribunal-de-",
    "titulo": "Comunicar Selos Digitais Pendentes ao Tribunal de Justiça",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/R-17.0-comunicar-selos-digitais-pendentes-ao-tribunal-de-.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > Selo Digital"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Comunicações > Selo Digital** (ou utilize o atalho de **Selo Digital** na barra superior).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Comunicações > Selo Digital",
          "Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Comunicações > Selo Digital"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **Data do Ato**, informe o período desejado da pesquisa.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Data do Ato"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "No campo **Status**, selecione os filtros **\"Não comunicado\"** e **\"Comunicação pendente\"**.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Status",
          "\"Não comunicado\"",
          "\"Comunicação pendente\""
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Filtrar** para listar todos os selos que aguardam transmissão.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Confira a listagem na tela e clique no botão **Comunicar** para sincronizar o lote com a Corregedoria Geral da Justiça.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Comunicar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "R-23.0",
    "slug": "como-realizar-a-distribuicao-de-produtos-e-selos-n",
    "titulo": "Como Realizar a Distribuição de Produtos e Selos no Estoque",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/R-23.0-como-realizar-a-distribuicao-de-produtos-e-selos-n.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Distribuição"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No módulo **Orion Estoque**, acesse o menu **Administração > Distribuição**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Estoque",
          "Administração > Distribuição"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Distribuição"
      },
      {
        "stepNumber": 2,
        "rawText": "Na aba **Distribuição**, selecione a **Categoria** e o **Produto** desejado para que o sistema relacione os lotes disponíveis.",
        "actionType": "select",
        "zone": "any",
        "targets": [
          "Distribuição",
          "Categoria",
          "Produto"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 3,
        "rawText": "Escolha a série e sequência que deseja distribuir clicando na seta de transferência para a direita ou use o botão **\"+\"** para inclusão manual.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "\"+\""
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "No campo **Portador**, defina o destinatário do lote, selecionando entre **Usuários Individuais**, **Grupos de Usuários** ou **Máquinas (estações)**.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Portador",
          "Usuários Individuais",
          "Grupos de Usuários",
          "Máquinas (estações)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 5,
        "rawText": "Revise as quantidades e numerações atribuídas e clique no botão **Concluir** para registrar a entrega.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "**Para consultar ou estornar:** Na mesma tela, clique na aba **Consulta**, localize a entrega pelos filtros e clique em **Estornar** (caso o produto ainda não tenha sido consumido).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Para consultar ou estornar:",
          "Consulta",
          "Estornar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      }
    ]
  },
  {
    "id": "V-2.0",
    "slug": "como-realizar-a-aquisicao-de-produtos-entrada-no-e",
    "titulo": "Como Realizar a Aquisição de Produtos (Entrada no Estoque)",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/V-2.0-como-realizar-a-aquisicao-de-produtos-entrada-no-e.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Aquisição"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o módulo **Orion Stock**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Stock"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Navegue até o menu **Administração > Aquisição**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Aquisição"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Aquisição"
      },
      {
        "stepNumber": 3,
        "rawText": "Preencha os campos da aquisição. Apenas os campos com asterisco (**\\***) são obrigatórios. A **Data de aquisição** pode ser alterada.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "\\",
          "Data de aquisição"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Selecione a **Categoria** do produto (ex.: \"Selos\" ou \"Papel de Segurança\").",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Categoria"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Selecione o **Produto** específico (ex.: \"Reconhecimento por autenticidade\").",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Produto"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Preencha o campo **Série**:",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Série",
          "Para Selos:",
          "Para Papel de Segurança:"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Informe a **Sequência inicial** e a **Sequência final** do lote. O sistema calculará a **Quantidade (Qtd)** total automaticamente.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Sequência inicial",
          "Sequência final",
          "Quantidade (Qtd)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 8,
        "rawText": "Informe o **Valor Unitário** do produto, se aplicável.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Valor Unitário"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 9,
        "rawText": "Para registrar a entrada de mais de um tipo de produto na mesma operação, clique no botão **+** (inserir). Utilize o botão **-** para remover uma linha.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "+",
          "-"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 10,
        "rawText": "Clique em **Concluir** para registrar a entrada dos produtos no estoque.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-3.0",
    "slug": "como-consultar-o-estoque-de-produtos",
    "titulo": "Como Consultar o Estoque de Produtos",
    "modulo": "selos",
    "filePath": "kb/rotinas/selos/V-3.0-como-consultar-o-estoque-de-produtos.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Consultas > Estoque"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No módulo **Orion Stock**, acesse o menu **Administração > Consultas > Estoque**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Stock",
          "Administração > Consultas > Estoque"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Consultas > Estoque"
      },
      {
        "stepNumber": 2,
        "rawText": "Utilize os filtros disponíveis, como **Categoria**, **Produto**, **Data**, entre outros, para refinar a pesquisa.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Categoria",
          "Produto",
          "Data"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 3,
        "rawText": "Selecione o **Tipo de Consulta**:",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Tipo de Consulta",
          "Resumida:",
          "Detalhada:"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Clique em **Filtrar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Na consulta **Detalhada**, a linha de cada item apresentará opções adicionais, como:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Detalhada",
          "Cancelamento",
          "Inutilização",
          "Andamentos (Logs)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "É possível também estornar um produto específico que já foi utilizado, tornando-o disponível para reutilização.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-LIVRO-01",
    "slug": "C-LIVRO-01-procedimento-de-inutilizacao-e-declaracao-de-folha",
    "titulo": "Procedimento de Inutilização e Declaração de Folha Sem Efeito em Livro Notarial",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/C-LIVRO-01-procedimento-de-inutilizacao-e-declaracao-de-folha.md",
    "routeHash": null,
    "menuPaths": [
      "Livros > Gestão e Controle de Folhas",
      "Notas > Livros",
      "Ações > Inutilizar Folha / Declarar Sem Efeito"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Livros > Gestão e Controle de Folhas** (ou **Notas > Livros**).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Livros > Gestão e Controle de Folhas",
          "Notas > Livros"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Livros > Gestão e Controle de Folhas"
      },
      {
        "stepNumber": 2,
        "rawText": "Selecione o Livro Notarial ativo no qual ocorreu o salto.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Na grade de controle de páginas, localize as folhas que ficaram em branco (ex.: Folha 089 V e Folha 090 F).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Selecione as páginas correspondentes e clique no botão **Ações > Inutilizar Folha / Declarar Sem Efeito**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Ações > Inutilizar Folha / Declarar Sem Efeito"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Ações > Inutilizar Folha / Declarar Sem Efeito"
      },
      {
        "stepNumber": 5,
        "rawText": "No campo **Justificativa Legal**, digite a certidão (ex.: *\"Folha inutilizada por erro material de alimentação mecânica da impressora\"*).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Justificativa Legal"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Confirme a operação. O status da página passará para `INUTILIZADA`.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "No protocolo da escritura seguinte, confirme que o sistema assumiu automaticamente a primeira folha útil posterior.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-LIVRO-02",
    "slug": "C-LIVRO-02-reabertura-administrativa-de-livro-notarial-encerr",
    "titulo": "Reabertura Administrativa de Livro Notarial Encerrado Prematuramente com Termos Vagos",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/C-LIVRO-02-reabertura-administrativa-de-livro-notarial-encerr.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Livros Notariais > Cadastro e Encerramento",
      "Ações > Reabrir Livro Notarial / Cancelar Encerramento"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Com login de administrador ou substituto, acesse **Configurações > Livros Notariais > Cadastro e Encerramento**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Livros Notariais > Cadastro e Encerramento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Livros Notariais > Cadastro e Encerramento"
      },
      {
        "stepNumber": 2,
        "rawText": "Localize o livro que consta com status `ENCERRADO`.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Selecione o livro e clique no botão **Ações > Reabrir Livro Notarial / Cancelar Encerramento**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Ações > Reabrir Livro Notarial / Cancelar Encerramento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Ações > Reabrir Livro Notarial / Cancelar Encerramento"
      },
      {
        "stepNumber": 4,
        "rawText": "Informe a justificativa formal (ex.: *\"Cancelamento de encerramento precoce para consumo dos termos restantes\"*).",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Confirme a operação. O livro retornará ao status de `Aberto / Em Uso`.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "No balcão, utilize as posições remanescentes até o encerramento da numeração física real.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Concluído o lote, acione novamente a rotina formal de encerramento emitindo o respectivo termo.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-LIVRO-03",
    "slug": "C-LIVRO-03-otimizacao-de-paginacao-do-traslado-e-reducao-de-l",
    "titulo": "Otimização de Paginação do Traslado e Redução de Laudas Residuais",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/C-LIVRO-03-otimizacao-de-paginacao-do-traslado-e-reducao-de-l.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo",
      "Formatar > Parágrafo",
      "Layout da Página > Margens"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Abra o protocolo do ato através de **Notas > Protocolo** e selecione a aba **Traslado**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo",
          "Traslado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Editar Traslado / Diagramação**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Editar Traslado / Diagramação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Pressione `Ctrl + A` para selecionar todo o texto do documento.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Na barra de formatação, altere o campo **Espaçamento Entrelinhas** para `1.15` (ou `Simples`).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Espaçamento Entrelinhas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Acesse o menu **Formatar > Parágrafo** e zere os valores de **Espaçamento Antes e Depois** (defina como `0 pt`).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Formatar > Parágrafo",
          "Espaçamento Antes e Depois"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Formatar > Parágrafo"
      },
      {
        "stepNumber": 6,
        "rawText": "No menu **Layout da Página > Margens**, confira se as margens superior e inferior estão padronizadas em `2,0 cm`.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Layout da Página > Margens"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Layout da Página > Margens"
      },
      {
        "stepNumber": 7,
        "rawText": "Clique no botão **Visualizar Impressão** e confira a diminuição da contagem total de páginas.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Visualizar Impressão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 8,
        "rawText": "Clique em **Gravar Diagramação** e imprima o documento definitivo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gravar Diagramação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-LIVRO-04",
    "slug": "C-LIVRO-04-reinicio-dos-microsservicos-de-renderizacao-e-conv",
    "titulo": "Reinício dos Microsserviços de Renderização e Conversão Documental (Docker)",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/C-LIVRO-04-reinicio-dos-microsservicos-de-renderizacao-e-conv.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o servidor central do cartório com credenciais administrativas.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "Abra o terminal do **PowerShell** ou aplicativo **Docker Desktop**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "PowerShell",
          "Docker Desktop"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Execute o comando de reinício dos microsserviços documentais:",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "`docker restart orion-document-service orion-conversion`",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Aguarde cerca de 30 a 45 segundos para que as portas internas sejam reestabelecidas.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Execute `docker ps` e valide se ambos os containers exibem o status `Up (healthy)`.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Nas estações de trabalho, feche e reabra o navegador.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 8,
        "rawText": "Acesse qualquer protocolo em **Notas > Protocolo**, abra a aba **Livro** e confirme a renderização imediata do documento.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo",
          "Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Protocolo"
      }
    ]
  },
  {
    "id": "C-LIVRO-05",
    "slug": "C-LIVRO-05-geracao-de-termos-de-abertura-e-encerramento-de-li",
    "titulo": "Geração de Termos de Abertura e Encerramento de Livros Notariais",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/C-LIVRO-05-geracao-de-termos-de-abertura-e-encerramento-de-li.md",
    "routeHash": null,
    "menuPaths": [
      "Livros > Gestão de Livros Notariais"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Livros > Gestão de Livros Notariais**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Livros > Gestão de Livros Notariais"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Livros > Gestão de Livros Notariais"
      },
      {
        "stepNumber": 2,
        "rawText": "Selecione o tipo de livro (ex.: **Escrituras**, **Procurações** ou **Testamentos**).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Escrituras",
          "Procurações",
          "Testamentos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 3,
        "rawText": "Para **Novo Livro (Abertura)**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Novo Livro (Abertura)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Clique em **Cadastrar Novo Livro**, informe o número, total de folhas e selecione **Emitir Termo de Abertura**.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Cadastrar Novo Livro",
          "Emitir Termo de Abertura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Para **Livro Concluído (Encerramento)**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Livro Concluído (Encerramento)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Localize o livro que atingiu a última folha útil e clique no botão **Encerrar Livro**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Encerrar Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "O sistema compilará a quantidade exata de atos lavrados e eventuais folhas inutilizadas.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 8,
        "rawText": "Clique em **Visualizar e Imprimir Termo de Encerramento**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Visualizar e Imprimir Termo de Encerramento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 9,
        "rawText": "Colete a assinatura do Tabelião ou Substituto e encaminhe o volume para a encadernação oficial.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-LIVRO-06",
    "slug": "C-LIVRO-06-correcao-de-duplicidade-de-complementos-de-livro-e",
    "titulo": "Correção de Duplicidade de Complementos de Livro e Folha em Lotes de Quinzena",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/C-LIVRO-06-correcao-de-duplicidade-de-complementos-de-livro-e.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Fechamento de Quinzena / Comunicações",
      "Notas > Protocolo"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse a tela de fechamento em **Notas > Fechamento de Quinzena / Comunicações**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Fechamento de Quinzena / Comunicações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Fechamento de Quinzena / Comunicações"
      },
      {
        "stepNumber": 2,
        "rawText": "Identifique na mensagem de alerta o número exato do Livro e da Folha em conflito.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Abra o protocolo correspondente em **Notas > Protocolo**, aba **Dados do Ato**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo",
          "Dados do Ato"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 4,
        "rawText": "No campo **Complemento de Folha**, informe a distinção formal (ex.: `V` para Verso, ou `A` / `B` para subdivisões autorizadas).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Complemento de Folha"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Salve o protocolo.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "No ato correlato, assegure que o campo de complemento esteja devidamente preenchido com a especificação recíproca (ex.: `F` para Frente).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Retorne à tela de fechamento de quinzena e clique em **Revalidar Numerações**, liberando o lote.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Revalidar Numerações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-LIVRO-07",
    "slug": "C-LIVRO-07-controle-sequencial-e-auditoria-de-folhas-soltas-p",
    "titulo": "Controle Sequencial e Auditoria de Folhas Soltas para Impressão de Escrituras",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/C-LIVRO-07-controle-sequencial-e-auditoria-de-folhas-soltas-p.md",
    "routeHash": null,
    "menuPaths": [
      "Orion Estoque > Livros Notariais > Controle de Folhas Soltas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o módulo **Orion Estoque > Livros Notariais > Controle de Folhas Soltas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Estoque > Livros Notariais > Controle de Folhas Soltas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Orion Estoque > Livros Notariais > Controle de Folhas Soltas"
      },
      {
        "stepNumber": 2,
        "rawText": "Selecione o livro ativo e clique no botão **Auditoria de Sequência**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Auditoria de Sequência"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "O sistema listará todas as folhas: Utilizadas, Disponíveis e Inutilizadas.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Para registrar folhas que encravaram e foram danificadas fisicamente:",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique sobre a numeração e acione **Baixa por Avaria Mecânica** (anexe a justificativa).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Baixa por Avaria Mecânica"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "No campo **Próxima Folha a Alimentar**, informe o número que está efetivamente na gaveta da impressora.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Próxima Folha a Alimentar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Clique em **Gravar e Sincronizar Contador**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gravar e Sincronizar Contador"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-LIVRO-08",
    "slug": "C-LIVRO-08-consolidacao-financeira-e-recalculo-de-subtotais-d",
    "titulo": "Consolidação Financeira e Recálculo de Subtotais do Livro Caixa / LCW após Encerramento",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/C-LIVRO-08-consolidacao-financeira-e-recalculo-de-subtotais-d.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Rotinas Especiais > Consolidação de Movimentações"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion Caixa**, acesse o menu **Administração > Rotinas Especiais > Consolidação de Movimentações**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Caixa",
          "Administração > Rotinas Especiais > Consolidação de Movimentações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Rotinas Especiais > Consolidação de Movimentações"
      },
      {
        "stepNumber": 2,
        "rawText": "Informe a data inicial a partir da qual houve a alteração do lançamento extemporâneo.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [
          "data"
        ],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Marque a opção **Recalcular Saldos Diários e Subtotais Progressivos**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Recalcular Saldos Diários e Subtotais Progressivos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Executar Consolidação** e aguarde o processamento completo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Executar Consolidação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Acesse o módulo **LCW (Livro Caixa Web)** ou a rotina de emissão do Livro Diário.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "LCW (Livro Caixa Web)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Gere novamente o relatório contábil do período.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Confirme que todos os subtotais e transportes de página passaram a refletir a soma exata.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "D-3.16",
    "slug": "D-3.16-gerar-certidao-no-editor-de-texto",
    "titulo": "Gerar Certidão no Editor de texto",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/D-3.16-gerar-certidao-no-editor-de-texto.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No pedido de certidão ativo, clique no botão **Gerar no Editor**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerar no Editor"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "O sistema abrirá o editor com o modelo carregado e as tags de qualificação já preenchidas.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Revise a redação, aplicando correções ortográficas e ajustes de diagramação necessários.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Inserir Selo Digital** para reservar e carregar o código de validação do TJ.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Inserir Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Selecione a opção **Imprimir Definitivo** utilizando a impressora padrão de certidões.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Imprimir Definitivo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Salvar e Concluir** para registrar o ato emitido no livro fiscal.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar e Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.27",
    "slug": "D-3.27-consultar-central-de-indisponibilidade-no-livro-ce",
    "titulo": "Consultar Central de Indisponibilidade no Livro (CENIB)",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/D-3.27-consultar-central-de-indisponibilidade-no-livro-ce.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Na etapa de finalização da minuta, clique no comando **Gerar Livro Definitivo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerar Livro Definitivo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "O sistema abrirá a janela de validação prévia com o botão **Revalidar Consulta CENIB**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Revalidar Consulta CENIB"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Clique em **Executar Nova Consulta em Lote** para pesquisar novamente todos os outorgantes.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Executar Nova Consulta em Lote"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "O sistema atualizará os códigos HASH de cada parte com o timestamp exato do momento do fechamento.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Caso persista o resultado 'Nada Consta', o botão de geração de livro será liberado.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Confirmar e Gerar Livro** para lavrar o ato com as certidões revalidadas.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Confirmar e Gerar Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.41",
    "slug": "D-3.41-gerar-livro-a-partir-de-minuta",
    "titulo": "Gerar Livro a partir de Minuta",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/D-3.41-gerar-livro-a-partir-de-minuta.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No editor da minuta conferida e aprovada, clique no comando **Gerar Livro Definitivo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerar Livro Definitivo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Selecione o **Livro de Notas Ativo** (o sistema sugerirá a próxima folha disponível na sequência).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Livro de Notas Ativo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Confira a numeração inicial e final de folhas que a escritura consumirá.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Execute a revalidação da consulta à **CENIB** para todas as partes.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "CENIB"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Clique em **Confirmar e Gerar Livro**; o sistema emitirá o selo digital do ato e montará a diagramação oficial.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Confirmar e Gerar Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Imprima as folhas oficiais no livro de folhas soltas e colha as assinaturas das partes e do tabelião/escrevente.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "D-3.60",
    "slug": "D-3.60-cadastrar-livro-para-consumo",
    "titulo": "Cadastrar Livro para Consumo",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/D-3.60-cadastrar-livro-para-consumo.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Cadastros > Livro para Consumo"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Notas > Cadastros > Livro para Consumo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Cadastros > Livro para Consumo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Cadastros > Livro para Consumo"
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Adicionar Novo Livro**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar Novo Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Selecione a **Espécie de Livro** (Escrituras, Procurações, Testamentos ou Atas Notariais).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Espécie de Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Informe o **Número do Livro** (em algarismos arábicos ou romanos), a **Folha Inicial** (geralmente 001) e a **Capacidade Total de Folhas** (ex: 200 folhas).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Número do Livro",
          "Folha Inicial",
          "Capacidade Total de Folhas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 5,
        "rawText": "Preencha os dados do **Termo de Abertura** com a data oficial e o nome do tabelião/substituto.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Termo de Abertura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Salvar e Imprimir Termo de Abertura** para arquivar a primeira folha no livro físico.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar e Imprimir Termo de Abertura"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-29.1",
    "slug": "M-29.1-como-gerenciar-termos-salvos-reimprimir-inutilizar",
    "titulo": "Como Gerenciar Termos Salvos (Reimprimir, Inutilizar, Digitalizar)",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/M-29.1-como-gerenciar-termos-salvos-reimprimir-inutilizar.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Consultas > Termos de comparecimento"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No pedido de atendimento ou em **Firmas > Consultas > Termos de comparecimento**, localize o termo desejado e abra a tela de gerenciamento.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Firmas > Consultas > Termos de comparecimento"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Consultas > Termos de comparecimento"
      },
      {
        "stepNumber": 2,
        "rawText": "Na listagem de termos registrados, utilize uma das opções de controle:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Reimprimir",
          "Digitalizar / Anexar",
          "Inutilizar Termo",
          "Reutilizar Folha do Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Confirme as ações na caixa de diálogo e informe a justificativa exigida pelo sistema.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "R-26.0",
    "slug": "R-26.0-imprimir-relatorio-de-indice-por-livro",
    "titulo": "Imprimir Relatório de Índice por Livro",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/R-26.0-imprimir-relatorio-de-indice-por-livro.md",
    "routeHash": null,
    "menuPaths": [
      "Relatórios > Índice por Livro"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu principal do sistema em **Relatórios > Índice por Livro**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Relatórios > Índice por Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Relatórios > Índice por Livro"
      },
      {
        "stepNumber": 2,
        "rawText": "Na tela de parâmetros, informe o **Período** de referência e defina os campos **Livro Inicial** e **Livro Final**.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Período",
          "Livro Inicial",
          "Livro Final"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 3,
        "rawText": "No campo de ordenação, selecione o critério desejado: **Nome** (ordem alfabética das partes), **Natureza** ou **Livro e Folha** (ordem sequencial).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Nome",
          "Natureza",
          "Livro e Folha"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Imprimir**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Imprimir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Uma nova guia será aberta no navegador com o relatório formatado para conferência e impressão definitiva.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "R-30.0",
    "slug": "R-30.0-reutilizar-posicao-de-livro-inutilizada",
    "titulo": "Reutilizar Posição de Livro Inutilizada",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/R-30.0-reutilizar-posicao-de-livro-inutilizada.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Controle de Livros"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Controle de Livros**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Controle de Livros"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Controle de Livros"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **Número do Livro**, informe o livro desejado e clique no ícone do **Livro Pequeno** para carregar suas informações detalhadas.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Número do Livro",
          "Livro Pequeno"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Na janela de controle exibida, clique sobre a aba **Inutilizados**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Inutilizados"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Localize e selecione a posição numérica ou folha que deseja resgatar.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique nas **Setas de Movimentação** para transferir a posição selecionada de volta para o status ativo de uso.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Setas de Movimentação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "A posição retornará ao controle do sistema e ficará disponível para conferência na aba **Reutilizadas**, pronta para ser atribuída a um novo ato.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Reutilizadas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "R-36.0",
    "slug": "R-36.0-imprimir-relatorio-do-livro-de-protocolo",
    "titulo": "Imprimir Relatório do Livro de Protocolo",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/R-36.0-imprimir-relatorio-do-livro-de-protocolo.md",
    "routeHash": null,
    "menuPaths": [
      "Relatórios > Livro Protocolo"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu principal do sistema em **Relatórios > Livro Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Relatórios > Livro Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Relatórios > Livro Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "Na tela de parâmetros, informe o **Período** de apuração no qual deseja visualizar os protocolos recepcionados.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Período"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Defina a modalidade de impressão:",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Para Rascunho / Conferência:",
          "\"Rascunho\"",
          "Para Impressão Definitiva:",
          "Livro",
          "Folha Inicial"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Imprimir**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Imprimir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "O sistema gerará o documento formatado em uma nova guia do navegador, pronto para conferência interna ou arquivamento permanente.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "V-7.0.4",
    "slug": "V-7.0.4-geracao-configuracao-de-margem-espelho-e-impressao",
    "titulo": "Geração, Configuração de Margem Espelho e Impressão do Livro Oficial com Consulta CNIB Integrada",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/V-7.0.4-geracao-configuracao-de-margem-espelho-e-impressao.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Após finalizar e salvar a minuta no editor, fechar a tela de edição para retornar ao card do editor de texto no protocolo.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "Selecionar o documento de referência da minuta e definir o tipo de livro a ser gerado:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Prévia do Livro:",
          "Gerar Livro Oficial:"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Para gerar o Livro Oficial definitivo:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Livro",
          "Folha",
          "Gerar Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Configuração de Margem Espelho para Papéis de Segurança:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Margem espelho"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Consulta à Central de Indisponibilidade (**CNIB**) no Livro:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "CNIB",
          "Central de Indisponibilidade",
          "Lupa",
          "Consulta CNIB"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Impressão do Livro Oficial:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Impressão prévia:",
          "Impressão definitiva:"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "V-7.2.1",
    "slug": "V-7.2.1-pre-visualizacao-direta-do-livro-de-notas-e-trasla",
    "titulo": "Pré-Visualização Direta do Livro de Notas e Traslado com Marca d'Água Antifraude",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/V-7.2.1-pre-visualizacao-direta-do-livro-de-notas-e-trasla.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No protocolo notarial, acesse a aba **Editor** com a minuta aberta em edição.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Editor"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Na barra de ferramentas do editor, clique no botão **Prévia do Livro** (ou **Prévia de Traslado**).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Prévia do Livro",
          "Prévia de Traslado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "O sistema processa o layout configurado para o livro oficial da serventia (margens espelho, cabeçalho, rodapé e numeração de folhas) e abre a visualização em tela.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Analise a paginação, a distribuição das linhas de assinatura das partes e do tabelião/escrevente, observando eventuais campos destacados em **vermelho** (indicadores de dados pendentes no protocolo, como livro/folha ou selo não lavrado).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "vermelho"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Para disponibilizar a conferência às partes ou advogados, clique em **Baixar Prévia em PDF** ou no ícone de compartilhamento direto.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Baixar Prévia em PDF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-7.3.2",
    "slug": "V-7.3.2-geracao-de-recibo-lavratura-do-ato-e-tramitacao-de",
    "titulo": "Geração de Recibo, Lavratura do Ato e Tramitação de Selo Digital para o Livro",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/V-7.3.2-geracao-de-recibo-lavratura-do-ato-e-tramitacao-de.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No dia agendado para o comparecimento das partes e assinatura do ato, acesse o protocolo em **Notas > Protocolo** e clique em **Editar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo",
          "Editar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **Livro**, selecione ou informe o número do livro de notas que será utilizado.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Pressione a tecla **Tab** no campo do livro. O sistema calculará e preencherá automaticamente:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Tab",
          "Folha Inicial:",
          "Folha Final:",
          "ORION TN"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Realize as validações financeiras e cadastrais obrigatórias:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Tomador do Recibo:",
          "Mesmo do solicitante",
          "Salvar",
          "Custas e Emolumentos:",
          "verde"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão para **Gerar Recibo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerar Recibo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "O sistema processará a solicitação:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Selo Digital",
          "TJ (Tribunal de Justiça)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Ao término da emissão, o sistema abrirá automaticamente duas janelas/guias:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Guia do Recibo:",
          "Atenção:",
          "Tela do Selo Digital:",
          "QR Code",
          "Voltar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "V-7.4.2",
    "slug": "V-7.4.2-consulta-e-insercao-de-hashes-da-cnib-central-de-i",
    "titulo": "Consulta e Inserção de Hashes da CNIB (Central de Indisponibilidade) no Livro",
    "modulo": "livros",
    "filePath": "kb/rotinas/livros/V-7.4.2-consulta-e-insercao-de-hashes-da-cnib-central-de-i.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Abra a versão de impressão do **Livro** clicando no ícone da **Canetinha** na aba **Editor** do protocolo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Livro",
          "Canetinha",
          "Editor"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 2,
        "rawText": "Posicione o cursor do mouse exatamente no parágrafo do texto onde a cláusula de certidão de indisponibilidade deve ser inserida.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Na barra de ferramentas inferior do editor, clique no botão **Central de Indisponibilidade**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Central de Indisponibilidade",
          "ORION TN",
          "CNIB"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Na janela suspensa exibida com o modelo de certidão homologado para o cartório:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Inserir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "**Método Alternativo (Caso a consulta tenha sido gerada sem posicionamento prévio do cursor):**",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Método Alternativo (Caso a consulta tenha sido gerada sem posicionamento prévio do cursor):",
          "Lupa",
          "Consulta CNIB",
          "Olho",
          "Abrir Detalhe do Texto"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Na barra inferior do editor, clique no botão **Concluir** para salvar a certidão no livro e feche a guia do editor.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Ao retornar à tela do protocolo, o sistema exibirá notificações na tela confirmando a emissão dos hashes.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 8,
        "rawText": "Pressione o atalho de teclado `Ctrl + Shift + R` para recarregar a tela do protocolo sem sair da sessão.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 9,
        "rawText": "Acesse a aba **Partes** para auditar e conferir os números de hash da **CNIB** gravados individualmente no cadastro de cada parte.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Partes",
          "CNIB"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      }
    ]
  },
  {
    "id": "C-CERT-01",
    "slug": "C-CERT-01-emissao-de-certidao-com-custas-zeradas-e-enquadram",
    "titulo": "Emissão de Certidão com Custas Zeradas e Enquadramento de Selagem Isenta",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/C-CERT-01-emissao-de-certidao-com-custas-zeradas-e-enquadram.md",
    "routeHash": null,
    "menuPaths": [
      "Certidões > Novo Pedido de Certidão",
      "Notas > Certidões"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, acesse o menu **Certidões > Novo Pedido de Certidão** (ou **Notas > Certidões**).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Certidões > Novo Pedido de Certidão",
          "Notas > Certidões"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3,
        "menuPath": "Certidões > Novo Pedido de Certidão"
      },
      {
        "stepNumber": 2,
        "rawText": "No formulário inicial do pedido, altere o campo **Modalidade de Cobrança** de `Normal / Paga` para **Isenta / Gratuita**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Modalidade de Cobrança",
          "Isenta / Gratuita"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "No campo **Motivo Legal da Gratuidade**, selecione o dispositivo correspondente (ex.: **Assistência Judiciária Gratuita**, **Requisição Judicial**, **Defensoria Pública** ou **Poder Público**).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Motivo Legal da Gratuidade",
          "Assistência Judiciária Gratuita",
          "Requisição Judicial",
          "Defensoria Pública",
          "Poder Público"
        ],
        "implicitTargets": [],
        "mainTargetCount": 5
      },
      {
        "stepNumber": 4,
        "rawText": "Na aba **Cálculo de Custas**, certifique-se de que todas as linhas de emolumentos exibam `R$ 0,00`.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Cálculo de Custas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "No editor da certidão, carregue o texto de breve relato ou inteiro teor.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Finalizar e Emitir Selo Digital**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Finalizar e Emitir Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "O Orion TN transmitirá o selo ao tribunal sob a tipologia isenta homologada e emitirá o recibo zerado.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CERT-02",
    "slug": "C-CERT-02-desbloqueio-para-emissao-de-certidao-sobre-protoco",
    "titulo": "Desbloqueio para Emissão de Certidão sobre Protocolo com Status de Ato Retificado",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/C-CERT-02-desbloqueio-para-emissao-de-certidao-sobre-protoco.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo",
      "Certidões > Novo Pedido de Certidão"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Notas > Protocolo** e localize o protocolo da escritura retificadora.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "Verifique se a escritura de rerratificação já foi assinada e encadernada no livro.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Altere o status do protocolo retificador para `Lavrado / Concluído` e salve.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "No protocolo da escritura primitiva, confirme que a anotação marginal da rerratificação está vinculada.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Acesse **Certidões > Novo Pedido de Certidão** e informe o Livro e Folha da escritura primitiva.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Certidões > Novo Pedido de Certidão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Certidões > Novo Pedido de Certidão"
      },
      {
        "stepNumber": 6,
        "rawText": "O sistema liberará o pedido e, na geração do inteiro teor, incluirá automaticamente a nota de rerratificação no rodapé.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Conclua a emissão e a selagem da certidão.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CERT-03",
    "slug": "C-CERT-03-emissao-de-certidao-de-ato-legado-nao-digitalizado",
    "titulo": "Emissão de Certidão de Ato Legado não Digitalizado com Anexo do Livro Físico",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/C-CERT-03-emissao-de-certidao-de-ato-legado-nao-digitalizado.md",
    "routeHash": null,
    "menuPaths": [
      "Certidões > Novo Pedido de Certidão"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, acesse o menu **Certidões > Novo Pedido de Certidão**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Certidões > Novo Pedido de Certidão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Certidões > Novo Pedido de Certidão"
      },
      {
        "stepNumber": 2,
        "rawText": "Marque a opção **Certidão de Ato Antigo / Não Digitalizado**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Certidão de Ato Antigo / Não Digitalizado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Informe os dados manuais da busca: **Número do Livro**, **Folhas Inicial/Final** e **Data da Lavratura Original**.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Número do Livro",
          "Folhas Inicial/Final",
          "Data da Lavratura Original"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 4,
        "rawText": "Informe os nomes das partes principais para constarem no recibo e no índice de buscas.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "No **Orion Caixa**, efetue o recebimento dos emolumentos e gere o recibo financeiro.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion Caixa"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Na aba **Editor da Certidão**:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Editor da Certidão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Se for inteiro teor reprográfico: clique em **Anexar Imagem Escaneada do Livro (GED)** e selecione o PDF do livro físico.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Anexar Imagem Escaneada do Livro (GED)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 8,
        "rawText": "Se for em breve relato: digite o teor certificatório no modelo padrão.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 9,
        "rawText": "Clique em **Finalizar e Emitir Selo Digital**. O selo será vinculado à remessa do tribunal normalmente.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Finalizar e Emitir Selo Digital"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-CERT-04",
    "slug": "C-CERT-04-remocao-de-url-e-cabecalhos-do-navegador-na-impres",
    "titulo": "Remoção de URL e Cabeçalhos do Navegador na Impressão de Certidões pelo Chrome",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/C-CERT-04-remocao-de-url-e-cabecalhos-do-navegador-na-impres.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Na tela de visualização da certidão, acione o comando de impressão (`Ctrl + P`).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "No painel lateral de configurações de impressão do Google Chrome, clique em **Mais Definições**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Mais Definições"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Localize o grupo de opções e **DESMARQUE** a caixa de seleção **Cabeçalhos e Rodapés**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "DESMARQUE",
          "Cabeçalhos e Rodapés"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Certifique-se de que a opção **Ajustar à Área de Impressão** ou **Escala** esteja definida como `Padrão` (100%).",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Ajustar à Área de Impressão",
          "Escala"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 5,
        "rawText": "Envie a impressão para a impressora oficial de papel de segurança.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "O Chrome salvará essa preferência permanentemente para os próximos documentos impressos naquela estação.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CERT-05",
    "slug": "C-CERT-05-resolucao-de-conflito-de-cache-de-navegador-no-mod",
    "titulo": "Resolução de Conflito de Cache de Navegador no Módulo de Nova Certidão",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/C-CERT-05-resolucao-de-conflito-de-cache-de-navegador-no-mod.md",
    "routeHash": null,
    "menuPaths": [
      "Certidões > Novo Pedido de Certidão"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Com a janela do **Orion TN** aberta, pressione simultaneamente as teclas `Ctrl + Shift + R` (ou `Ctrl + F5`) para forçar o recarregamento do código fonte da página.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Caso persista:",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Pressione `Ctrl + Shift + Delete` para abrir a janela **Limpar Dados de Navegação** do Chrome/Edge.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Limpar Dados de Navegação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Selecione o intervalo de tempo **Todo o Período**.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Todo o Período"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Marque obrigatoriamente a opção **Imagens e Ficheiros em Cache** (não é necessário apagar senhas ou histórico).",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Imagens e Ficheiros em Cache"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Limpar Dados**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Limpar Dados"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Feche completamente todas as abas do navegador e reabra o sistema.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 8,
        "rawText": "Acesse **Certidões > Novo Pedido de Certidão** e confirme que o formulário é carregado com perfeição.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Certidões > Novo Pedido de Certidão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Certidões > Novo Pedido de Certidão"
      }
    ]
  },
  {
    "id": "D-3.14",
    "slug": "D-3.14-criar-certidao",
    "titulo": "Criar Certidão",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/D-3.14-criar-certidao.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Certidões > Novo Pedido de Certidão"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Notas > Certidões > Novo Pedido de Certidão**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Certidões > Novo Pedido de Certidão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Certidões > Novo Pedido de Certidão"
      },
      {
        "stepNumber": 2,
        "rawText": "Preencha a **Identificação do Solicitante** (Nome, CPF e telefone de contato).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Identificação do Solicitante"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Selecione o **Tipo de Certidão**: **Inteiro Teor**, **Breve Relatório** ou **Reprográfica**.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Tipo de Certidão",
          "Inteiro Teor",
          "Breve Relatório",
          "Reprográfica"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 4,
        "rawText": "Localize o ato original informando o **Tipo de Livro**, **Número do Livro**, **Folha** e **Ato**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Tipo de Livro",
          "Número do Livro",
          "Folha",
          "Ato"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 5,
        "rawText": "O sistema importará os dados do ato e calculará os emolumentos correspondentes.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Concluir Pedido** para salvar e disponibilizar o pagamento no caixa.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir Pedido"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.15",
    "slug": "D-3.15-vincular-ato-a-certidao-para-reprografia",
    "titulo": "Vincular Ato a Certidão para Reprografia",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/D-3.15-vincular-ato-a-certidao-para-reprografia.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Certidões > Consulta de Certidões"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Abra o pedido de certidão desejado em **Notas > Certidões > Consulta de Certidões**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Certidões > Consulta de Certidões"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Certidões > Consulta de Certidões"
      },
      {
        "stepNumber": 2,
        "rawText": "Clique na aba **Reprografia / Imagens do Livro**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Reprografia / Imagens do Livro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "O sistema listará as imagens disponíveis para o Livro e intervalo de folhas do ato.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Caso falte alguma página, clique em **Adicionar Imagem** para digitalizar diretamente pelo scanner.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Adicionar Imagem"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Ordene a sequência das folhas clicando nas setas de posicionamento.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Confirmar Vinculação** para enviar o conjunto ao editor de certidões.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Confirmar Vinculação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.29",
    "slug": "D-3.29-solicitar-certidao-dentro-de-protocolo",
    "titulo": "Solicitar Certidão Dentro de Protocolo",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/D-3.29-solicitar-certidao-dentro-de-protocolo.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Na tela do Protocolo aberto, acesse o card **Certidões Solicitadas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Certidões Solicitadas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Nova Requisição de Certidão**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Nova Requisição de Certidão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Indique o **Tipo de Livro** (Procurações, Escrituras, Testamentos) e informe o **Número do Livro** e **Folha**.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Tipo de Livro",
          "Número do Livro",
          "Folha"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 4,
        "rawText": "Defina a modalidade da certidão (**Breve Relatório**, **Inteiro Teor** ou **Reprográfica**).",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Breve Relatório",
          "Inteiro Teor",
          "Reprográfica"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 5,
        "rawText": "Marque a opção **Incorporar Custas ao Protocolo Principal** para cobrança unificada.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Incorporar Custas ao Protocolo Principal"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Solicitar**; o setor de certidões receberá a demanda na fila de trabalho interna.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Solicitar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-9.0",
    "slug": "D-9.0-excluir-movimentacao-financeira-em-pedido-de-certi",
    "titulo": "Excluir Movimentação Financeira em Pedido de Certidão",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/D-9.0-excluir-movimentacao-financeira-em-pedido-de-certi.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Consultas > Consulta de Certidões e Serviços"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No menu principal do Orion TN, acesse **Notas > Consultas > Consulta de Certidões e Serviços**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Consultas > Consulta de Certidões e Serviços"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Consultas > Consulta de Certidões e Serviços"
      },
      {
        "stepNumber": 2,
        "rawText": "Utilize os filtros de busca para localizar a certidão específica e clique no botão **Editar** (ícone de lápis).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Editar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Dentro da certidão, clique no ícone de **Cifrão ($)** na barra superior para acessar a movimentação de caixa.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Cifrão ($)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Role a tela até o quadro de **Lançamentos Financeiros Vinculados**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Lançamentos Financeiros Vinculados"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Identifique o lançamento que deseja remover e clique no botão **Excluir (ícone X)**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Excluir (ícone X)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "O sistema exibirá aviso de confirmação; clique em **Confirmar** para finalizar o estorno da movimentação.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Confirmar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-16.13",
    "slug": "M-16.13-parametrizar-pedido-de-certidao",
    "titulo": "Parametrizar Pedido de Certidão",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/M-16.13-parametrizar-pedido-de-certidao.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Parâmetros > Pedido de certidão"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Parâmetros > Pedido de certidão**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Parâmetros > Pedido de certidão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Parâmetros > Pedido de certidão"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **Prazo de entrega padrão (dias)**, informe a quantidade de dias úteis fixada para expedição de certidões comuns (ex: 5 dias úteis, ou prazo menor conforme a rotina do cartório).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Prazo de entrega padrão (dias)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Na seção **Estoque e Insumos**, marque a opção **Controlar estoque de papel de segurança** para impedir que a certidão seja concluída sem o apontamento do número da folha utilizada.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Estoque e Insumos",
          "Controlar estoque de papel de segurança"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Configure se o sistema deve exigir a assinatura ou identificação do recebedor no momento da entrega do documento no balcão.",
        "actionType": "click",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Salvar** para registrar os parâmetros do setor de certidões.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-54.0",
    "slug": "M-54.0-funcionalidades-da-tela-de-pedido-de-certidao",
    "titulo": "Funcionalidades da Tela de Pedido de Certidão",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/M-54.0-funcionalidades-da-tela-de-pedido-de-certidao.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Pedido de certidão"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Notas > Pedido de certidão**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Pedido de certidão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Pedido de certidão"
      },
      {
        "stepNumber": 2,
        "rawText": "Utilize os comandos do menu superior:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Novo",
          "Editar",
          "Salvar",
          "Pedidos em aberto",
          "Andamentos",
          "Gerar recibo",
          "Selo digital",
          "Inutilizar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Preencha os cards estruturais e conclua o atendimento.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "M-54.1",
    "slug": "M-54.1-como-criar-um-novo-pedido-de-certidao-dados-do-sol",
    "titulo": "Como Criar um Novo Pedido de Certidão (Dados do Solicitante)",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/M-54.1-como-criar-um-novo-pedido-de-certidao-dados-do-sol.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Pedido de certidão"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Na tela **Notas > Pedido de certidão**, clique no botão **Novo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Pedido de certidão",
          "Novo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Pedido de certidão"
      },
      {
        "stepNumber": 2,
        "rawText": "No card **Dados do pedido de certidão**, selecione o **Tipo de Certidão**:",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Dados do pedido de certidão",
          "Tipo de Certidão",
          "Inteiro Teor",
          "Breve Relato / Resumo",
          "Traslado / 2ª Via"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "No campo **Solicitante**, busque e selecione o interessado (ou cadastre novo com Nome, CPF/CNPJ, Telefone e E-mail).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Solicitante"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "O sistema calculará automaticamente o campo **Previsão de Entrega** com base nos parâmetros da serventia.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Previsão de Entrega"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Selecione o **Escrevente** responsável e defina a situação como **Em Aberto**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Escrevente",
          "Em Aberto"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Salvar** na barra superior para desbloquear os cards de busca do ato e custas.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-54.2",
    "slug": "M-54.2-como-realizar-a-busca-do-ato-original-em-um-pedido",
    "titulo": "Como Realizar a Busca do Ato Original em um Pedido de Certidão",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/M-54.2-como-realizar-a-busca-do-ato-original-em-um-pedido.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Com o pedido de certidão salvo, acesse o card **Busca**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Busca"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Preencha os dados conhecidos do ato original:",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Espécie",
          "Livro",
          "Folha",
          "Nº do Protocolo / Ato",
          "Partes"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Clique no botão **Buscar Ato**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Buscar Ato"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "O sistema exibirá os registros localizados no acervo do cartório.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no registro correto para vinculá-lo ao pedido de certidão: o Orion TN carregará o resumo do ato original na tela.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Salvar** na barra de ferramentas.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-54.3",
    "slug": "M-54.3-como-lancar-as-custas-em-um-pedido-de-certidao",
    "titulo": "Como Lançar as Custas em um Pedido de Certidão",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/M-54.3-como-lancar-as-custas-em-um-pedido-de-certidao.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No pedido de certidão, clique no card **Custas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Custas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Adicionar Item** e selecione o item correspondente da tabela (ex: 'Certidão de Notas - 1ª Folha').",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Adicionar Item"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Se a certidão de inteiro teor possuir mais de uma página, adicione o item **Folha Excedente** e informe a quantidade adicional de páginas.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Folha Excedente"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Caso tenha sido necessária pesquisa no acervo por falta de indicação de livro/folha pelo usuário, inclua o item de **Busca no Arquivo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Busca no Arquivo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "O sistema calculará automaticamente os emolumentos do cartório, taxas de fiscalização do Estado e o valor total devido.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Salvar** na barra superior.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Na barra de ferramentas, clique em **Gerar recibo** para emitir o comprovante fiscal para pagamento no caixa.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerar recibo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "V-6.2.3",
    "slug": "V-6.2.3-pesquisa-rapida-na-barra-superior-da-tela-de-proto",
    "titulo": "Pesquisa Rápida na Barra Superior da Tela de Protocolos em Aberto (Busca de Atos Abertos e Encerrados)",
    "modulo": "certidoes",
    "filePath": "kb/rotinas/certidoes/V-6.2.3-pesquisa-rapida-na-barra-superior-da-tela-de-proto.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolos em aberto"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Estando na tela de **Notas > Protocolos em aberto**, localizar o ícone de lupa (**Lupinha de Busca**) posicionado na barra superior da página.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolos em aberto",
          "Lupinha de Busca"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Protocolos em aberto"
      },
      {
        "stepNumber": 2,
        "rawText": "Clicar no ícone de lupa para expandir a barra com os campos de pesquisa (clicar novamente quando desejar ocultar a barra e liberar espaço visual).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "**Para busca imediata por número:**",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Para busca imediata por número:",
          "Protocolo",
          "Enter"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "**Para busca combinada por múltiplos parâmetros (atos abertos ou encerrados):**",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Para busca combinada por múltiplos parâmetros (atos abertos ou encerrados):",
          "Livro",
          "Folha",
          "Solicitante",
          "Partes",
          "Data de recepção",
          "Número do recibo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Clicar no botão **Filtrar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Localizar o ato retornado no resultado da busca e clicar sobre ele para carregá-lo na interface.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CENTRAL-01",
    "slug": "C-CENTRAL-01-sanitizacao-de-caracteres-especiais-no-envio-de-co",
    "titulo": "Sanitização de Caracteres Especiais no Envio de Comunicações ao COAF / SISCOAF",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-01-sanitizacao-de-caracteres-especiais-no-envio-de-co.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > COAF"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, acesse o menu **Administração > Comunicações > COAF**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Administração > Comunicações > COAF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Comunicações > COAF"
      },
      {
        "stepNumber": 2,
        "rawText": "Localize a comunicação rejeitada e abra a aba **Informações Adicionais**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Informações Adicionais"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Aplique a higienização textual obrigatória:",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Substitua qualquer apóstrofo (`'`) por acento agudo (`´`) — ex.: altere `Santa Bárbara D'Oeste` para `Santa Bárbara D´Oeste`.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Se houver o caractere comercial `&`, substitua pela palavra `e` ou pela entidade `&amp;`.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Remova todas as aspas simples e duplas (`\"` e `'`).",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "**Remova todos os Enters (quebras de linha):** mantenha o texto em um parágrafo único e contínuo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Remova todos os Enters (quebras de linha):"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 8,
        "rawText": "Clique no botão **Salvar e Transmitir** para receber o protocolo de entrega imediato.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar e Transmitir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-CENTRAL-02",
    "slug": "C-CENTRAL-02-habilitacao-de-pessoa-obrigada-ativa-no-portal-sis",
    "titulo": "Habilitação de Pessoa Obrigada Ativa no Portal SISCOAF para Envio de Comunicações",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-02-habilitacao-de-pessoa-obrigada-ativa-no-portal-sis.md",
    "routeHash": null,
    "menuPaths": [
      "Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos",
      "Configurações > Parâmetros Gerais > Comunicação COAF"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "O Tabelião Titular deve acessar o portal oficial do **SISCOAF** utilizando seu certificado digital e-CPF.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "SISCOAF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Navegue até **Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Pessoas Obrigadas > Habilitações de Usuários / Gerenciar Prepostos"
      },
      {
        "stepNumber": 3,
        "rawText": "Cadastre o CPF do colaborador responsável pelas comunicações, concedendo perfil ativo de remetente da serventia.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "No **Orion TN**, acesse **Configurações > Parâmetros Gerais > Comunicação COAF**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Configurações > Parâmetros Gerais > Comunicação COAF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Configurações > Parâmetros Gerais > Comunicação COAF"
      },
      {
        "stepNumber": 5,
        "rawText": "No campo **CPF do Responsável pelo Envio**, informe com exatidão o CPF que foi habilitado no portal.",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "CPF do Responsável pelo Envio"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Gravar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gravar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Retorne à tela de envio do COAF e faça a transmissão do lote pendente.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CENTRAL-03",
    "slug": "C-CENTRAL-03-mapeamento-de-qualidade-cesdi-em-inventarios-e-pre",
    "titulo": "Mapeamento de Qualidade CESDI em Inventários e Preenchimento Obrigatório",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-03-mapeamento-de-qualidade-cesdi-em-inventarios-e-pre.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Cadastros Auxiliares > Tipos de Participação",
      "Notas > Protocolo"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, acesse **Configurações > Cadastros Auxiliares > Tipos de Participação**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Configurações > Cadastros Auxiliares > Tipos de Participação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Configurações > Cadastros Auxiliares > Tipos de Participação"
      },
      {
        "stepNumber": 2,
        "rawText": "Verifique se as participações estão mapeadas no quadro **Comunicações - Configurações**:",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Comunicações - Configurações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Falecido/Autor da Herança ➔ Qualidade CESDI: **De Cujus / Falecido**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "De Cujus / Falecido"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Herdeiro/Cônjuge Meiro ➔ Qualidade CESDI: **Herdeiro**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Herdeiro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Advogado/Assistente ➔ Qualidade CESDI: **Advogado**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Advogado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Abra o protocolo do inventário em **Notas > Protocolo**, aba **Partes**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo",
          "Partes"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 7,
        "rawText": "Confira cada participante, garantindo que os papéis acima foram selecionados.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 8,
        "rawText": "Abra o cadastro das pessoas e preencha obrigatoriamente: **Filiação (Pai e Mãe)**, **Data de Nascimento** e **Município com Código IBGE**.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Filiação (Pai e Mãe)",
          "Data de Nascimento",
          "Município com Código IBGE"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 9,
        "rawText": "Salve o protocolo e retransmita a carga da CESDI.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CENTRAL-04",
    "slug": "C-CENTRAL-04-renovacao-de-token-de-autenticacao-expirado-na-pla",
    "titulo": "Renovação de Token de Autenticação Expirado na Plataforma SIGNO / CENSEC",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-04-renovacao-de-token-de-autenticacao-expirado-na-pla.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações da Serventia > Integração / API / Tokens",
      "Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o portal oficial do **SIGNO / CENSEC** (`signo.censec.org.br`) com o certificado digital do Tabelião.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "SIGNO / CENSEC"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Navegue até **Configurações da Serventia > Integração / API / Tokens**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações da Serventia > Integração / API / Tokens"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações da Serventia > Integração / API / Tokens"
      },
      {
        "stepNumber": 3,
        "rawText": "Clique no botão **Gerar Novo Token de Integração / API Key** e copie a chave extensa gerada.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gerar Novo Token de Integração / API Key"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "No **Orion TN**, acesse com perfil de administrador: **Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Configurações > Parâmetros Gerais > Integração SIGNO / CENSEC"
      },
      {
        "stepNumber": 5,
        "rawText": "Cole a nova chave no campo **Token de Acesso (API Key)**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Token de Acesso (API Key)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Validar Conexão com SIGNO** e confirme a mensagem de sucesso.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Validar Conexão com SIGNO"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Clique em **Salvar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 8,
        "rawText": "Acesse a tela de envio da CENSEC e retransmita os lotes pendentes da quinzena.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CENTRAL-05",
    "slug": "C-CENTRAL-05-correcao-de-vinculo-de-representante-legal-na-carg",
    "titulo": "Correção de Vínculo de Representante Legal na Carga CENSEC CTP / RCTO",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-05-correcao-de-vinculo-de-representante-legal-na-carg.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo",
      "Comunicações > CENSEC CTP"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Abra o protocolo da procuração no menu **Notas > Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse a aba **Partes** e localize a Pessoa Jurídica outorgante.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Partes"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Selecione a empresa e clique na sub-aba **Representantes Legais**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Representantes Legais"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Caso o sócio já esteja listado mas o sistema não valide: exclua o vínculo e adicione novamente.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Selecione a pessoa física representante, marque o checkbox **Representante Ativo no Ato** e indique o título de representação (ex.: Administrador / Diretor).",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Representante Ativo no Ato"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique em **Salvar Vínculo** e, em seguida, em **Salvar Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar Vínculo",
          "Salvar Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 7,
        "rawText": "Retorne ao módulo **Comunicações > CENSEC CTP**, recalcule a carga quinzenal e faça a transmissão.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Comunicações > CENSEC CTP"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Comunicações > CENSEC CTP"
      }
    ]
  },
  {
    "id": "C-CENTRAL-06",
    "slug": "C-CENTRAL-06-adequacao-de-fracoes-ideais-e-titularidade-de-imov",
    "titulo": "Adequação de Frações Ideais e Titularidade de Imóveis para Remessa da DOI",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-06-adequacao-de-fracoes-ideais-e-titularidade-de-imov.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo",
      "Comunicações > DOI"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, abra o protocolo da escritura através de **Notas > Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Notas > Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse a aba **Imóveis** e clique em **Editar** no bem correspondente.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Imóveis",
          "Editar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Confira os campos obrigatórios: **Tipo de Imóvel** (Urbano/Rural), **Matrícula**, **Código IBGE** e **Logradouro**.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Tipo de Imóvel",
          "Matrícula",
          "Código IBGE",
          "Logradouro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 4,
        "rawText": "Acesse a sub-aba **Partes do Imóvel / Transmissão**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Partes do Imóvel / Transmissão"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Selecione os alienantes e adquirentes e marque obrigatoriamente a flag **Titular do Imóvel**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Titular do Imóvel"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "No campo **Fração Transmitida (%)**, preencha com exatidão a porcentagem de cada um (ex.: 50% e 50%, ou 100%).",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Fração Transmitida (%)"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Clique no botão **Gravar Metadados da DOI** dentro da aba e salve o protocolo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Gravar Metadados da DOI"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 8,
        "rawText": "Acesse **Comunicações > DOI**, gere novamente a remessa mensal e valide no programa da Receita Federal.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Comunicações > DOI"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Comunicações > DOI"
      }
    ]
  },
  {
    "id": "C-CENTRAL-07",
    "slug": "C-CENTRAL-07-inicializacao-do-integrador-local-para-geracao-e-e",
    "titulo": "Inicialização do Integrador Local para Geração e Exportação de Lotes da DOI",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-07-inicializacao-do-integrador-local-para-geracao-e-e.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > DOI"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": true,
      "tag": "[DDD]",
      "reason": "Depende do aplicativo binário local Integrador Orion (C:\\Siplan\\Integrador\\Integrador.exe) na bandeja do Windows para compilação e exportação de lotes DOI."
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Verifique a bandeja do sistema do Windows (Systray ao lado do relógio).",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "Caso o ícone do **Integrador Orion** não esteja visível:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Integrador Orion"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Acesse o menu Iniciar do Windows e digite **Integrador Orion** (ou acesse `C:\\Siplan\\Integrador\\Integrador.exe`).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Integrador Orion"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Execute o aplicativo como Administrador.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Confirme que o ícone passou a ser exibido na bandeja com status conectado.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "No navegador, retorne ao **Orion TN** em **Administração > Comunicações > DOI**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Administração > Comunicações > DOI"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Comunicações > DOI"
      },
      {
        "stepNumber": 7,
        "rawText": "Selecione o mês de apuração e clique no botão **Gerar e Exportar Lote DOI**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Gerar e Exportar Lote DOI"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 8,
        "rawText": "O sistema salvará o arquivo gerado diretamente na pasta de downloads ou diretório parametrizado.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CENTRAL-08",
    "slug": "C-CENTRAL-08-disparo-forcado-sincrono-de-fichas-de-firma-para-o",
    "titulo": "Disparo Forçado Síncrono de Fichas de Firma para o e-Notariado / CNN",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-08-disparo-forcado-sincrono-de-fichas-de-firma-para-o.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > Outras Comunicações > E-Notariado"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, certifique-se de que a ficha de firma do cliente está salva com imagem da assinatura e biometria.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Orion TN"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse o menu **Administração > Comunicações > Outras Comunicações > E-Notariado**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Comunicações > Outras Comunicações > E-Notariado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Comunicações > Outras Comunicações > E-Notariado"
      },
      {
        "stepNumber": 3,
        "rawText": "Na aba **Cartões de Autógrafo / Fichas de Firma**, informe o CPF ou número da ficha do cliente.",
        "actionType": "fill",
        "zone": "any",
        "targets": [
          "Cartões de Autógrafo / Fichas de Firma"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Selecione o registro na grade e clique no botão **Gerar / Enviar Imediatamente**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Gerar / Enviar Imediatamente"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "O sistema executará o upload síncrono do payload com as assinaturas para os servidores do Colégio Notarial.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 6,
        "rawText": "Confirme o recebimento do hash de transmissão.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 7,
        "rawText": "Acesse o portal do **CCN / e-Notariado** e confirme que a ficha já está disponível para consulta nacional.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "CCN / e-Notariado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-CENTRAL-09",
    "slug": "C-CENTRAL-09-correcao-de-rejeicao-da-carga-censec-cep-por-ausen",
    "titulo": "Correção de Rejeição da Carga CENSEC CEP por Ausência de Código IBGE",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-09-correcao-de-rejeicao-da-carga-censec-cep-por-ausen.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo",
      "Comunicações > CENSEC CEP"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse **Notas > Protocolo** e abra o ato apontado com pendência no log da CEP.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "Na aba **Partes**, edite o endereço das partes: no campo **Município**, utilize a lupa de busca para selecionar a cidade da lista oficial (o sistema preencherá o código IBGE automaticamente).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Partes",
          "Município"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Na aba **Imóveis**, confira o endereço do bem e repita a seleção assistida do município.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Imóveis"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Salvar** do protocolo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Acesse **Comunicações > CENSEC CEP**, selecione a quinzena e clique em **Reprocessar Carga**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Comunicações > CENSEC CEP",
          "Reprocessar Carga"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Comunicações > CENSEC CEP"
      },
      {
        "stepNumber": 6,
        "rawText": "Transmita o lote aprovado.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CENTRAL-10",
    "slug": "C-CENTRAL-10-emissao-e-transmissao-de-comunicacao-de-inocorrenc",
    "titulo": "Emissão e Transmissão de Comunicação de Inocorrência Periódica ao COAF",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-10-emissao-e-transmissao-de-comunicacao-de-inocorrenc.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > COAF"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, acesse o menu **Administração > Comunicações > COAF**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Administração > Comunicações > COAF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Comunicações > COAF"
      },
      {
        "stepNumber": 2,
        "rawText": "Selecione a competência correspondente (mês anterior) e clique na aba **Declaração de Inocorrência**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Declaração de Inocorrência"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "O sistema apresentará o termo padrão afirmando que não foram identificadas operações de comunicação obrigatória.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Confirme os dados do Tabelião ou Oficial designado.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Transmitir Declaração de Inocorrência ao SISCOAF**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Transmitir Declaração de Inocorrência ao SISCOAF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Após o envio síncrono, clique no botão **Imprimir Recibo de Entrega** e arquive o comprovante digital.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Imprimir Recibo de Entrega"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "C-CENTRAL-11",
    "slug": "C-CENTRAL-11-apontamento-de-ato-primitivo-em-retificacoes-e-adi",
    "titulo": "Apontamento de Ato Primitivo em Retificações e Aditamentos para CENSEC RCTO",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-11-apontamento-de-ato-primitivo-em-retificacoes-e-adi.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo",
      "Comunicações > CENSEC RCTO"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Abra o protocolo da escritura de rerratificação no menu **Notas > Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 2,
        "rawText": "Navegue até a aba **Dados do Ato / Retificação**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Dados do Ato / Retificação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Marque a opção **Este Ato Retifica / Adita Negócio Jurídico Anterior**.",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Este Ato Retifica / Adita Negócio Jurídico Anterior"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Preencha obrigatoriamente os campos:",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "**Livro de Origem**, **Folha de Origem**, **Data da Lavratura Primitiva** e **Cartório de Origem** (se praticado na mesma serventia ou fora).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Livro de Origem",
          "Folha de Origem",
          "Data da Lavratura Primitiva",
          "Cartório de Origem"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Salvar Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Salvar Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Acesse **Comunicações > CENSEC RCTO**, regenere a carga da quinzena e transmita com aprovação imediata.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Comunicações > CENSEC RCTO"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Comunicações > CENSEC RCTO"
      }
    ]
  },
  {
    "id": "C-CENTRAL-12",
    "slug": "C-CENTRAL-12-localizacao-e-rastreamento-de-erros-estruturais-no",
    "titulo": "Localização e Rastreamento de Erros Estruturais no Arquivo da DOI pelo Editor de Texto",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-12-localizacao-e-rastreamento-de-erros-estruturais-no.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Protocolo"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Anote o **Número da Linha / Registro** apontado no relatório de erro do programa da Receita Federal (ex.: Linha `142`).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Número da Linha / Registro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Localize o arquivo gerado da DOI (geralmente salvo na pasta `C:\\Siplan\\DOI\\` ou Downloads com extensão `.txt` ou `.dec`).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 3,
        "rawText": "Abra o arquivo utilizando o **Notepad++** ou **Bloco de Notas** do Windows.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notepad++",
          "Bloco de Notas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "Pressione `Ctrl + G` e digite o número da linha correspondente ao erro.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "No início dessa linha ou no registro de controle imediatamente anterior, localize o campo de identificação que contém o **Número do Protocolo** ou a data de lavratura.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Número do Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Com o número em mãos, abra o protocolo no **Orion TN** em **Notas > Protocolo**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Orion TN",
          "Notas > Protocolo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Protocolo"
      },
      {
        "stepNumber": 7,
        "rawText": "Acesse a aba **Imóveis** ou **Partes** e aplique a correção do dado faltante indicado pela Receita.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Imóveis",
          "Partes"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 8,
        "rawText": "Exporte o lote novamente e revalide no programa oficial.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CENTRAL-13",
    "slug": "C-CENTRAL-13-transmissao-de-comunicacoes-ao-sirc-decorrentes-de",
    "titulo": "Transmissão de Comunicações ao SIRC decorrentes de Inventários e Testamentos",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-13-transmissao-de-comunicacoes-ao-sirc-decorrentes-de.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > SIRC / Comunicações Previdenciárias"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No **Orion TN**, certifique-se de que no cadastro do inventário a certidão de óbito do autor da herança (Livro, Folha, Termo e Município) foi preenchida na aba do falecido.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Orion TN"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse o menu **Administração > Comunicações > SIRC / Comunicações Previdenciárias**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Comunicações > SIRC / Comunicações Previdenciárias"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Comunicações > SIRC / Comunicações Previdenciárias"
      },
      {
        "stepNumber": 3,
        "rawText": "Selecione o período de apuração mensal.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Compilar Registros de Óbito de Inventários**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Compilar Registros de Óbito de Inventários"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Valide a listagem gerada e clique em **Transmitir / Exportar para o SIRC**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Transmitir / Exportar para o SIRC"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Imprima o comprovante de remessa para anexar à pasta de prestação de contas da serventia.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "C-CENTRAL-14",
    "slug": "C-CENTRAL-14-acompanhamento-e-envio-eletronico-de-escrituras-ao",
    "titulo": "Acompanhamento e Envio Eletrônico de Escrituras ao Registro de Imóveis (ONR / SAEC)",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/C-CENTRAL-14-acompanhamento-e-envio-eletronico-de-escrituras-ao.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "No protocolo da escritura lavrada e assinada, acerte o status para `Concluído / Lavrado`.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 2,
        "rawText": "Acesse a aba **Integração Externa / ONR - SAEC**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Integração Externa / ONR - SAEC"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Selecione o **Ofício de Registro de Imóveis Competente** a partir da comarca e circunscrição do imóvel.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Ofício de Registro de Imóveis Competente"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Anexe o traslado em PDF/A gerado e assinado digitalmente.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Transmitir Escritura para o ONR**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Transmitir Escritura para o ONR"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "O sistema retornará o **Número de Protocolo / Prenotação no RI**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Número de Protocolo / Prenotação no RI"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Acompanhe o status (Registrado, Exigência ou Devolução) diretamente pelo painel do Orion TN, acionando o botão **Consultar Andamento no SAEC**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Consultar Andamento no SAEC"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "D-3.2",
    "slug": "D-3.2-visualizar-dashboard-de-envio-para-registro",
    "titulo": "Visualizar Dashboard de Envio para Registro",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/D-3.2-visualizar-dashboard-de-envio-para-registro.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Dashboard de Envio para Registro"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Notas > Dashboard de Envio para Registro**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Dashboard de Envio para Registro"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Notas > Dashboard de Envio para Registro"
      },
      {
        "stepNumber": 2,
        "rawText": "Analise os blocos operacionais: **Aguardando Envio**, **Prenotados no RI**, **Com Exigência** e **Registrados**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Aguardando Envio",
          "Prenotados no RI",
          "Com Exigência",
          "Registrados"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 3,
        "rawText": "Filtre por **Cartório de Imóveis de Destino**, **Número do Protocolo** ou **Período**.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Cartório de Imóveis de Destino",
          "Número do Protocolo",
          "Período"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 4,
        "rawText": "Ao clicar em um card em exigência, visualize o teor da nota devolutiva e o prazo limite para reapresentação.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique em **Atualizar Status** após anexar a certidão ou comprovação do registro imobiliário concluído.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Atualizar Status"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "M-13.0",
    "slug": "M-13.0-abertura-de-pedido-de-firmas-com-senha-pre-atendim",
    "titulo": "Abertura de Pedido de Firmas com Senha (Pré-Atendimento)",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/M-13.0-abertura-de-pedido-de-firmas-com-senha-pre-atendim.md",
    "routeHash": null,
    "menuPaths": [
      "Firmas > Atendimento > Abertura de pedido com senha"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Firmas > Atendimento > Abertura de pedido com senha**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Firmas > Atendimento > Abertura de pedido com senha"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Firmas > Atendimento > Abertura de pedido com senha"
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Novo** para gerar a senha sequencial de fila conforme a prioridade (Normal ou Preferencial).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Novo"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Na seção de partes, informe o nome e documento dos interessados que solicitaram os serviços.",
        "actionType": "fill",
        "zone": "content",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Na seção de serviços, selecione os atos solicitados (ex: Reconhecimento por Semelhança, Autenticação de Cópia) e indique as quantidades estimadas.",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Concluir o pedido** para enviar a solicitação para a fila do painel e imprimir o comprovante de senha do cidadão.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir o pedido"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "O escrevente do guichê receberá o pedido pronto para conferência ao chamar a respectiva senha.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "M-16.5",
    "slug": "M-16.5-configurar-comunicacoes-externas-selo-digital-e-no",
    "titulo": "Configurar Comunicações Externas (Selo Digital, E-notariado, COAF)",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/M-16.5-configurar-comunicacoes-externas-selo-digital-e-no.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Parâmetros > Comunicações externas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Parâmetros > Comunicações externas**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Parâmetros > Comunicações externas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Parâmetros > Comunicações externas"
      },
      {
        "stepNumber": 2,
        "rawText": "Na aba **Selo Digital TJSP**, preencha a URL do WebService, o usuário, senha e código da serventia fornecidos pelo tribunal.",
        "actionType": "fill",
        "zone": "any",
        "targets": [
          "Selo Digital TJSP"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Na aba **e-Notariado**, insira a chave de integração (API Token) e configure o modo de ambiente (**Produção** ou **Homologação**).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "e-Notariado",
          "Produção",
          "Homologação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 3
      },
      {
        "stepNumber": 4,
        "rawText": "Na aba **COAF / SISCOAF**, defina o código de habilitação da serventia e o prazo de alerta de atos suspeitos para comunicação.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "COAF / SISCOAF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Na aba **Livro Caixa Web**, configure o token de exportação financeira diária.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Livro Caixa Web"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Clique no botão **Testar Conexão** em cada aba para validar os acessos e clique em **Salvar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Testar Conexão",
          "Salvar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      }
    ]
  },
  {
    "id": "M-32.0",
    "slug": "M-32.0-como-consultar-e-gerenciar-lotes-de-comunicacao-se",
    "titulo": "Como Consultar e Gerenciar Lotes de Comunicação (SEFAZ / E-notariado)",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/M-32.0-como-consultar-e-gerenciar-lotes-de-comunicacao-se.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > Lotes de comunicação",
      "Firmas > Comunicações > Lotes SEFAZ"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Administração > Comunicações > Lotes de comunicação** (ou **Firmas > Comunicações > Lotes SEFAZ**).",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Comunicações > Lotes de comunicação",
          "Firmas > Comunicações > Lotes SEFAZ"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Comunicações > Lotes de comunicação"
      },
      {
        "stepNumber": 2,
        "rawText": "Na área de filtros, defina a busca: selecione o **Destino** (**SEFAZ** ou **e-Notariado**), o **Período de envio**, o **Número do Lote** ou o **Status** (**Processado**, **Pendente**, **Rejeitado**).",
        "actionType": "select",
        "zone": "content",
        "targets": [
          "Destino",
          "SEFAZ",
          "e-Notariado",
          "Período de envio",
          "Número do Lote",
          "Status",
          "Processado",
          "Pendente",
          "Rejeitado"
        ],
        "implicitTargets": [],
        "mainTargetCount": 9
      },
      {
        "stepNumber": 3,
        "rawText": "Clique em **Filtrar** para listar os lotes na tela.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Na linha do lote pretendido, utilize as ferramentas disponíveis:",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Visualizar logs",
          "Itens do lote",
          "Estornar lote"
        ],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique em **Fechar** ou **Voltar** ao concluir a análise.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Fechar",
          "Voltar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      }
    ]
  },
  {
    "id": "M-61.0",
    "slug": "M-61.0-adicionar-nova-natureza",
    "titulo": "Adicionar Nova Natureza",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/M-61.0-adicionar-nova-natureza.md",
    "routeHash": null,
    "menuPaths": [
      "Notas > Cadastros auxiliares > Naturezas"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o menu **Notas > Cadastros auxiliares > Naturezas** e clique no botão **Adicionar**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Notas > Cadastros auxiliares > Naturezas",
          "Adicionar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Notas > Cadastros auxiliares > Naturezas"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **Espécie**, selecione o gênero correspondente (ex: **Escritura**, **Procuração**, **Ata Notarial**).",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "Espécie",
          "Escritura",
          "Procuração",
          "Ata Notarial"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      },
      {
        "stepNumber": 3,
        "rawText": "No campo **Descrição**, digite a denominação jurídica formal da nova natureza (ex: 'Escritura Pública de Emancipação', 'Doação em Adiantamento de Legítima').",
        "actionType": "fill",
        "zone": "content",
        "targets": [
          "Descrição"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "No campo **Sigla**, insira um código mnemônico abreviado (ex: `EMAN`, `DOAC`).",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Sigla"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Na seção **Comunicações com Centrais Notariais**, configure os parâmetros normativos:",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Comunicações com Centrais Notariais",
          "CESDI",
          "CEP",
          "RCTO"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 6,
        "rawText": "Na aba **Custas**, associe o item padrão da tabela de emolumentos estadual.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Custas"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 7,
        "rawText": "Clique no botão **Concluir** para registrar a nova natureza.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  },
  {
    "id": "R-11.0",
    "slug": "R-11.0-comunicacao-de-fichas-de-firma-com-o-e-notariado",
    "titulo": "Comunicação de Fichas de Firma com o e-Notariado",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/R-11.0-comunicacao-de-fichas-de-firma-com-o-e-notariado.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > Outras Comunicações",
      "Configurações > Parametrizações > Comunicações"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "**Para Envio Manual:** Acesse **Administração > Comunicações > Outras Comunicações**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Para Envio Manual:",
          "Administração > Comunicações > Outras Comunicações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Administração > Comunicações > Outras Comunicações"
      },
      {
        "stepNumber": 2,
        "rawText": "Clique no botão **Gerar**, selecione o tipo **\"E-notariado\"** e defina o período das fichas cadastradas.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Gerar",
          "\"E-notariado\""
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 3,
        "rawText": "Selecione as fichas listadas, clique em **Processar** e em seguida em **Finalizar** para concluir a transmissão.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Processar",
          "Finalizar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2
      },
      {
        "stepNumber": 4,
        "rawText": "**Para Configurar o Envio Automático:** Acesse **Configurações > Parametrizações > Comunicações**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Para Configurar o Envio Automático:",
          "Configurações > Parametrizações > Comunicações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 2,
        "menuPath": "Configurações > Parametrizações > Comunicações"
      },
      {
        "stepNumber": 5,
        "rawText": "Selecione a opção **Automático**, defina a periodicidade (diária ou semanal), insira o **Token do Cartório** (obtido na plataforma do e-Notariado), marque o status como **\"Ativo\"** e clique em **Concluir**.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Automático",
          "Token do Cartório",
          "\"Ativo\"",
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 4
      }
    ]
  },
  {
    "id": "R-32.0",
    "slug": "R-32.0-imprimir-relatorio-de-atos-comunicados-ao-coaf",
    "titulo": "Imprimir Relatório de Atos Comunicados ao COAF",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/R-32.0-imprimir-relatorio-de-atos-comunicados-ao-coaf.md",
    "routeHash": null,
    "menuPaths": [
      "Administração > Comunicações > COAF"
    ],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o caminho: **Administração > Comunicações > COAF**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Administração > Comunicações > COAF"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Administração > Comunicações > COAF"
      },
      {
        "stepNumber": 2,
        "rawText": "No campo **\"Situação do protocolo\"**, selecione o filtro desejado:",
        "actionType": "select",
        "zone": "content-preferred",
        "targets": [
          "\"Situação do protocolo\"",
          "Comunicados:",
          "Não comunicado:"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Defina o período de pesquisa do ato e clique no botão **Filtrar**.",
        "actionType": "click",
        "zone": "content",
        "targets": [
          "Filtrar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Clique no botão **Imprimir** no canto superior da tela e escolha o modelo de relatório disponível.",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Imprimir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Confirme a geração para que o sistema exiba o documento em formato para impressão e arquivo fiscal.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "R-32.1",
    "slug": "R-32.1-solucao-para-o-erro-o-servico-local-nao-foi-encont",
    "titulo": "Solução para o Erro 'O serviço local não foi encontrado' nas Comunicações",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/R-32.1-solucao-para-o-erro-o-servico-local-nao-foi-encont.md",
    "routeHash": null,
    "menuPaths": [],
    "workloadType": "read_only",
    "hardwarePreTriage": {
      "isHardwareDependent": true,
      "tag": "[DDD]",
      "reason": "Depende do aplicativo local Integrador Local na estação Windows e leitura de certificado digital A3 para comunicação com órgãos externos."
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Verifique a barra de tarefas do Windows (ao lado do relógio) para checar se o ícone do **Integrador Local** está ativo.",
        "actionType": "verify",
        "zone": "any",
        "targets": [
          "Integrador Local"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 2,
        "rawText": "Caso o programa esteja fechado, abra o menu Iniciar do Windows, pesquise por **\"Integrador Local\"** e clique para executá-lo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "\"Integrador Local\""
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Aguarde o aplicativo carregar e certifique-se de que o ícone permaneça verde na barra de tarefas.",
        "actionType": "verify",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 4,
        "rawText": "Retorne ao navegador no Orion TN, pressione a tecla **F5** para atualizar a página e repita a comunicação desejada com o órgão externo.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "F5"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 5,
        "rawText": "Se o aplicativo não estiver instalado em sua estação de trabalho, solicite a instalação à equipe de suporte técnico da serventia ou ao Service Desk Siplan.",
        "actionType": "click",
        "zone": "any",
        "targets": [],
        "implicitTargets": [],
        "mainTargetCount": 0
      }
    ]
  },
  {
    "id": "R-4.0",
    "slug": "R-4.0-alterar-configuracao-da-comunicacao-de-uma-partici",
    "titulo": "Alterar Configuração da Comunicação de uma Participação",
    "modulo": "centrais",
    "filePath": "kb/rotinas/centrais/R-4.0-alterar-configuracao-da-comunicacao-de-uma-partici.md",
    "routeHash": null,
    "menuPaths": [
      "Configurações > Geral > Cadastros Auxiliares > Participação"
    ],
    "workloadType": "mutation",
    "hardwarePreTriage": {
      "isHardwareDependent": false
    },
    "steps": [
      {
        "stepNumber": 1,
        "rawText": "Acesse o caminho: **Configurações > Geral > Cadastros Auxiliares > Participação**.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Configurações > Geral > Cadastros Auxiliares > Participação"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1,
        "menuPath": "Configurações > Geral > Cadastros Auxiliares > Participação"
      },
      {
        "stepNumber": 2,
        "rawText": "Na listagem de participações, pesquise o tipo desejado (ex: \"Interveniente Anuente\") e clique no botão **Editar** (ícone de lápis).",
        "actionType": "click",
        "zone": "content-preferred",
        "targets": [
          "Editar"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 3,
        "rawText": "Na janela de edição, selecione a aba **Comunicações - Configurações**.",
        "actionType": "select",
        "zone": "any",
        "targets": [
          "Comunicações - Configurações"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      },
      {
        "stepNumber": 4,
        "rawText": "Para cada central listada (CEP, CESDI, DOI, CENSEC), configure se o tipo de participação deve ser transmitido e selecione a descrição correspondente.",
        "actionType": "select",
        "zone": "content",
        "targets": [],
        "implicitTargets": [
          "descricao"
        ],
        "mainTargetCount": 0
      },
      {
        "stepNumber": 5,
        "rawText": "Clique no botão **Concluir** para salvar as parametrizações.",
        "actionType": "click",
        "zone": "any",
        "targets": [
          "Concluir"
        ],
        "implicitTargets": [],
        "mainTargetCount": 1
      }
    ]
  }
];
