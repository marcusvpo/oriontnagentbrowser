import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { parseRoutineMarkdown } from './parser.js';
import { annotateScreenshot } from './annotator.js';
import { AgentBrowserClient } from './browser.js';
import { BrowserWorkerPool, classifyRoutineWorkload } from './worker-pool.js';
import { inferStepZone } from './smart-locator.js';
import { listRoutineBoldTargets, probeTargetsPresence } from './evidence.js';
import { buildRevisedRoutineDocument, type EvidencePrint } from './report.js';
import { RBAC_BLOCK_TYPE, buildPrivilegeGateBlock, runPrivilegeGate } from './rbac.js';
import { classifyBlock } from './review-classifier.js';
import { REVIEW_TAGS, isReviewStatus, reviewPrefix } from './review-taxonomy.js';
import { config } from './config.js';
import type {
  RoutineAuditStatus,
  AnchorPlacement,
  AuditRoutineReport,
  AuditStepResult,
  DOMResolvedGeometry,
  ParsedRoutine,
  PrivilegeGateResult,
  RoutineBlockInfo,
  StepZonePolicy,
  WorkloadType
} from './types.js';

const auditoriaRoot = path.resolve(
  process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria')
);
const rawLiveDir = path.join(auditoriaRoot, 'cache', 'live-phase2');
const kbDir = path.join(auditoriaRoot, '..', 'kb', 'rotinas');
const rotinasOutDir = path.join(auditoriaRoot, 'rotinas');
const telemetryOutPath = path.join(auditoriaRoot, 'cache', 'phase2-live-telemetry.json');

export interface StepConfig {
  /** Rota hash SPA opcional para navegar antes de medir este passo (ex: '#/configuracoes') */
  navigateHash?: string;
  /** Lista ordenada de seletores CSS ou textos semânticos para medição ao vivo via getDOMGeometry() */
  targets: string[];
  /**
   * União Geométrica de Múltiplos Alvos (ADR-015): parâmetros do mesmo bloco/seção (texto do rótulo ou
   * seletor CSS) cujos DOMRects são unidos (minX, minY, maxX, maxY) numa única moldura. Se nenhum for
   * localizado no contêiner de conteúdo, a medição recai na lista `targets`.
   */
  groupTargets?: string[];
  /**
   * Política de Zona Semântica (ADR-015). Se omitida, é inferida de `label` + `actionType` via
   * `inferStepZone()`: passos de parametrização/formulário ficam restritos ao contêiner de conteúdo.
   */
  zone?: StepZonePolicy;
  /** Se verdadeiro, clica no elemento localizado após capturar o print para avançar o fluxo (ex: abrir aba ou modal) */
  clickTargetAfter?: boolean;
  /** Seletor/texto opcional para clicar após a captura caso seja diferente do alvo medido */
  clickSelectorAfter?: string;
  /** Tempo de espera extra (ms) após navegação ou clique */
  waitMs?: number;
  actionType: 'click' | 'fill' | 'select' | 'search' | 'verify';
  label: string;
  anchorPlacement?: AnchorPlacement;
}

export interface RoutineConfig {
  id: string;
  slug: string;
  modulo: string;
  screenTitle: string;
  steps: StepConfig[];
  /**
   * @deprecated ADR-017 (Regra da Evidência Estrita): texto escrito à mão no manifesto, sem evidência
   * no DOM. NÃO é mais emitido no `-revisado.md`; o relatório usa o texto original do KB.
   */
  revisadoDesc: string;
  /** @deprecated ADR-017: ver `revisadoDesc`. */
  revisadoPassos: string[];
  /** @deprecated ADR-017: ver `revisadoDesc`. */
  dica?: string;
}

export interface LiveStepTelemetry {
  routineId: string;
  slug: string;
  modulo: string;
  stepNum: number;
  label: string;
  actionType: StepConfig['actionType'];
  rawScreenshotPath: string;
  finalPngPath: string;
  finalWebpPath: string;
  domGeometry: DOMResolvedGeometry | null;
  /** Política de Zona Semântica aplicada ao passo (ADR-015) */
  zonePolicy?: StepZonePolicy;
  status: 'ok' | 'blocked';
  /** `rbac`: bloqueio por privilégio (ADR-017) — não é discrepância geométrica */
  blockKind?: RoutineBlockInfo['kind'];
  errorMessage?: string;
}

// Fallback das abas de Configurações. Só é medido dentro do contêiner de conteúdo (zona `content`):
// sem o filtro de zona, `form .col-md-24` casava com a coluna do menu lateral (ADR-015).
const CONFIG_TAB_CONTENT_TARGETS = [
  'form .col-md-24',
  '.panel-default',
  '.panel',
  'fieldset',
  'table',
  'form'
];

const LIST_SEARCH_TARGETS = ['form', '.panel-body .row', '.panel-body', 'fieldset', 'input[type="text"]'];
const LIST_TABLE_TARGETS = ['table', '.table-responsive', '.ui-grid', '.panel-body'];
const BTN_ADICIONAR_TARGETS = ['button:has-text("Adicionar")', 'a:has-text("Adicionar")', 'Adicionar +', 'Adicionar'];
const BTN_SALVAR_TARGETS = [
  'button:has-text("Salvar")',
  'a:has-text("Salvar")',
  'button:has-text("Concluir")',
  'a:has-text("Concluir")',
  'Salvar',
  'Concluir'
];
const BTN_CONCLUIR_TARGETS = ['button:has-text("Concluir")', 'a:has-text("Concluir")', 'Concluir'];

// Manifesto 100% Declarativo de Alvos Reais no DOM (Zero Coordenadas Estáticas / Zero baseImage)
export const ROUTINES: RoutineConfig[] = [
  // ==========================================
  // MÓDULO ACESSO (8 rotinas funcionais)
  // ==========================================
  {
    id: 'C-ACESSO-02',
    slug: 'C-ACESSO-02-inativacao-segura-de-colaborador-desligado-com-pre',
    modulo: 'acesso',
    screenTitle: 'Inativação de Colaborador Desligado',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/usuario', targets: LIST_TABLE_TARGETS, clickSelectorAfter: '.fa-pencil, .fa-edit, a[title*="Alterar"], button[title*="Alterar"]', actionType: 'select', label: 'Localize o operador na lista de usuários cadastrados' },
      { targets: ['input[type="checkbox"]', 'label:has-text("Ativo")', 'Ativo', 'form'], actionType: 'click', label: 'Desmarque a opção Ativo para inativar o acesso' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Clique em Salvar para revogar as credenciais' }
    ],
    revisadoDesc: 'A inativação de colaboradores desligados no Orion TN é realizada de forma lógica no cadastro de usuários, revogando o login e bloqueando acessos futuros sem violar chaves estrangeiras ou apagar o histórico de atos praticados.',
    revisadoPassos: [
      'Na barra superior do Orion TN, acione o menu **Configurações** e selecione o submenu **Usuários**.',
      'Na listagem de colaboradores, localize o preposto desligado e clique no botão de edição (**Alterar**).',
      'No formulário de dados cadastrais, localize o campo de status e desmarque a opção **Ativo**.',
      'Confirme a revogação de acessos clicando no botão **Salvar**.'
    ],
    dica: 'A inativação lógica preserva 100% da autoria dos atos notariais e registros do selo digital, atendendo às normas de auditoria da Corregedoria Geral da Justiça.'
  },
  {
    id: 'C-ACESSO-03',
    slug: 'C-ACESSO-03-redefinicao-de-senha-e-reset-de-autenticacao-em-do',
    modulo: 'acesso',
    screenTitle: 'Redefinição de Senha e Reset de 2FA',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/usuario', targets: LIST_TABLE_TARGETS, clickSelectorAfter: '.fa-pencil, .fa-edit, a[title*="Alterar"], button[title*="Alterar"]', actionType: 'select', label: 'Selecione o operador na grade de usuários' },
      { targets: ['form', '.panel-body', 'input[type="password"]'], actionType: 'fill', label: 'Gere a nova senha provisória ou redefina o 2FA' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Clique em Salvar para aplicar a nova credencial' }
    ],
    revisadoDesc: 'Permite ao administrador redefinir senhas de acesso e reiniciar parâmetros de autenticação em dois fatores (2FA) para prepostos bloqueados ou que perderam seus dispositivos de verificação.',
    revisadoPassos: [
      'Acesse a barra de navegação e clique em **Configurações** > **Usuários**.',
      'Selecione o preposto que necessita de redefinição na listagem geral.',
      'No formulário cadastral, gere uma nova senha provisória ou execute o reset das chaves de **Autenticação em dois fatores**.',
      'Finalize o procedimento clicando em **Salvar**.'
    ]
  },
  {
    id: 'C-ACESSO-04',
    slug: 'C-ACESSO-04-descompasso-de-credenciais-entre-orion-tn-e-modulo',
    modulo: 'acesso',
    screenTitle: 'Descompasso de Credenciais Orion TN e Módulo Externo',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/configuracoes', targets: ['.aba-configuracoes a:has-text("Comunicações")', 'Comunicações'], clickTargetAfter: true, actionType: 'click', label: 'Acesse a aba Comunicações' },
      { targets: CONFIG_TAB_CONTENT_TARGETS, groupTargets: ['Token do cartório', 'Subscription', 'API Key CNB'], zone: 'content', actionType: 'fill', label: 'Valide os parâmetros e credenciais de integração' },
      { targets: BTN_CONCLUIR_TARGETS, actionType: 'click', label: 'Clique em Concluir para sincronizar as credenciais' }
    ],
    revisadoDesc: 'Orienta o alinhamento de credenciais e tokens de integração entre o Orion TN e módulos externos da Siplan, evitando divergências de autenticação em serviços integrados.',
    revisadoPassos: [
      'Na barra superior do Orion TN, acione o menu **Configurações** > **Parametrizações**.',
      'No painel lateral esquerdo, clique na aba **Comunicações**.',
      'Verifique os usuários, senhas e endereços de integração dos módulos periféricos.',
      'Clique em **Concluir** para gravar as novas credenciais unificadas.'
    ]
  },
  {
    id: 'C-ACESSO-06',
    slug: 'C-ACESSO-06-habilitacao-de-permissoes-para-edicao-de-partes-e-',
    modulo: 'acesso',
    screenTitle: 'Habilitação de Permissões de Edição',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/perfil', targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o perfil desejado na grade' },
      { targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique em Adicionar + ou acione o ícone de edição do perfil' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Salve as permissões de edição concedidas' }
    ],
    revisadoDesc: 'A liberação de permissões para edição de partes e campos travados em atos notariais é gerenciada na tela de Perfis e Permissões de Acesso do Orion TN, controlando quais papéis podem retificar dados em protocolos.',
    revisadoPassos: [
      'No menu superior, acesse **Configurações** > **Perfis e permissões de acesso**.',
      'Na grade de perfis cadastrados, localize o perfil alvo (ex: Gerência webFirmas, Escreventes).',
      'Abra a matriz de permissões e marque a autorização para **Edição de partes e campos bloqueados**.',
      'Clique em **Salvar** para propagar a nova regra a todos os operadores do perfil.'
    ]
  },
  {
    id: 'C-ACESSO-07',
    slug: 'C-ACESSO-07-liberacao-de-acesso-e-impressao-de-consulta-de-ser',
    modulo: 'acesso',
    screenTitle: 'Liberação de Consulta de Serviços Praticados',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/perfil', targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o perfil dos colaboradores auxiliares' },
      { targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique em Adicionar + para gerenciar permissões' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Confirme as permissões concedidas' }
    ],
    revisadoDesc: 'Configura a autorização de acesso e emissão de relatórios de serviços praticados no balcão de firmas para perfis operacionais e auxiliares.',
    revisadoPassos: [
      'Acesse **Configurações** > submenu **Perfis e permissões de acesso**.',
      'Selecione o perfil dos operadores auxiliares na grade.',
      'Habilite a visualização e impressão da rotina de **Serviços praticados**.',
      'Grave as alterações para liberar o recurso no menu do preposto.'
    ]
  },
  {
    id: 'C-ACESSO-08',
    slug: 'C-ACESSO-08-promocao-de-colaborador-de-auxiliar-para-escrevent',
    modulo: 'acesso',
    screenTitle: 'Promoção de Colaborador e Ajuste de Perfil',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/usuario', targets: LIST_TABLE_TARGETS, clickSelectorAfter: '.fa-pencil, .fa-edit, a[title*="Alterar"], button[title*="Alterar"]', actionType: 'select', label: 'Localize o preposto promovido na grade' },
      { targets: ['select', 'form', '.panel-body'], actionType: 'select', label: 'Altere o Cargo para Escrevente e marque as novas funções notariais' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Clique em Salvar para consolidar a promoção' }
    ],
    revisadoDesc: 'Descreve o fluxo administrativo de alteração de cargo e perfil quando um colaborador é promovido de auxiliar para escrevente, habilitando assinaturas de atos e lavratura no Orion TN.',
    revisadoPassos: [
      'Acesse **Configurações** > **Usuários** no menu principal.',
      'Abra o cadastro do preposto promovido clicando em **Alterar**.',
      'Atualize o campo **Cargo** para Escrevente e marque as funções **Escrevente de Notas** e **Escrevente de Firmas**.',
      'Clique em **Salvar e incluir novo** (ou **Salvar**) para registrar o novo perfil.'
    ]
  },
  {
    id: 'V-3.4.6',
    slug: 'V-3.4.6-gestao-de-protocolos-com-assinaturas-pendentes-e-e',
    modulo: 'acesso',
    screenTitle: 'Gestão de Protocolos com Assinaturas Pendentes',
    steps: [
      { targets: ['.navbar a:has-text("Notas")', 'Notas'], actionType: 'click', label: 'Acesse o menu Notas' },
      { navigateHash: '#/protocolo/aberto', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre os protocolos com pendência de assinatura' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Abra o protocolo para conferência das assinaturas e partes' }
    ],
    revisadoDesc: 'Permite acompanhar atos notariais em aberto com pendências de assinatura presencial ou digital (e-Notariado), viabilizando o controle rigoroso do fluxo de lavratura.',
    revisadoPassos: [
      'No menu superior, clique em **Notas** > **Protocolos em aberto**.',
      'Utilize os filtros de pesquisa para selecionar atos com status de assinatura pendente.',
      'Abra o protocolo desejado para conferir as partes faltantes ou encaminhar para estorno/finalização.'
    ]
  },
  {
    id: 'V-7.5.3',
    slug: 'V-7.5.3-gestao-de-livros-notariais-e-folhas-soltas-no-orion-t',
    modulo: 'config',
    screenTitle: 'Gestão de Livros Notariais e Folhas Soltas',
    steps: [
      { targets: ['.navbar a:has-text("Administração")', 'Administração'], actionType: 'click', label: 'Acesse o menu Administração' },
      { navigateHash: '#/livro', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre e localize os livros notariais cadastrados' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o livro desejado na grade' },
      { targets: BTN_ADICIONAR_TARGETS, actionType: 'click', label: 'Gerencie as folhas e travas do livro' }
    ],
    revisadoDesc: 'Gerencia o status operacional dos livros notariais (Aberto, Em Uso, Encerrado), controlando o bloqueio de edição para proteger atos já lavrados e impressos.',
    revisadoPassos: [
      'No menu **Administração**, selecione **Controle de Livros**.',
      'Filtre o livro desejado informando **Número** e **Tipo livro**.',
      'Inspecione a situação das folhas e o responsável registrado.',
      'Aplique as travas de segurança ou libere edições justificadas conforme provimento.'
    ]
  },

  // ==========================================
  // MÓDULO CONFIG (31 rotinas funcionais)
  // ==========================================
  {
    id: 'M-12.0',
    slug: 'M-12.0-gerenciamento-de-servicos-lancados-visualizar-reut',
    modulo: 'config',
    screenTitle: 'Gerenciamento de Serviços Lançados',
    steps: [
      { targets: ['.navbar a:has-text("Firmas")', 'Firmas'], actionType: 'click', label: 'Acesse o menu Firmas' },
      { navigateHash: '#/servicoPraticado', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Informe os filtros de data e operador na consulta' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Verifique os serviços e selos vinculados na grade' }
    ],
    revisadoDesc: 'A rotina de Serviços Praticados possibilita consultar atos lançados no balcão de firmas, verificar selos emitidos e auditar a reutilização ou inutilização de insumos.',
    revisadoPassos: [
      'Acesse o menu **Firmas** e clique em **Serviços praticados**.',
      'Preencha o período de busca e os critérios de conferência.',
      'Analise a relação de atos lançados e acione a visualização dos selos correspondentes.'
    ]
  },
  {
    id: 'M-14.2',
    slug: 'M-14.2-balcao-de-firmas-lancando-servicos-e-imprimindo-et',
    modulo: 'config',
    screenTitle: 'Balcão de Firmas - Lançamento e Impressão de Etiquetas',
    steps: [
      { targets: ['.navbar a:has-text("Firmas")', 'Firmas'], actionType: 'click', label: 'Acesse o menu Firmas' },
      { navigateHash: '#/pedidoFirmas/cadastrar', targets: LIST_SEARCH_TARGETS, actionType: 'fill', label: 'Localize a ficha do signatário e adicione os serviços' },
      { targets: ['select', '.panel-body', 'table'], actionType: 'select', label: 'Selecione o modelo de etiqueta e confirme a quantidade' },
      { targets: BTN_CONCLUIR_TARGETS.concat(BTN_SALVAR_TARGETS), actionType: 'click', label: 'Conclua o pedido e dispare a impressão das etiquetas' }
    ],
    revisadoDesc: 'Fluxo operacional do balcão de firmas para reconhecimento de assinatura (por autenticidade ou semelhança), vinculação de selos e impressão de etiquetas térmicas.',
    revisadoPassos: [
      'No menu **Firmas**, selecione **Balcão de firmas**.',
      'Busque a pessoa física pelo CPF ou nome para carregar o cartão de assinatura.',
      'Selecione os atos praticados e o modelo de etiqueta cadastrado.',
      'Acione o botão de conclusão para gravar o ato e imprimir a etiqueta.'
    ]
  },
  {
    id: 'M-16.10',
    slug: 'M-16.10-parametrizar-e-mail',
    modulo: 'config',
    screenTitle: 'Parametrização de E-mail',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/configuracoes', targets: ['.aba-configuracoes a:has-text("E-mail")', 'E-mail'], clickTargetAfter: true, actionType: 'click', label: 'Clique na aba E-mail no painel de configurações' },
      { targets: CONFIG_TAB_CONTENT_TARGETS, groupTargets: ['Serviço realizados x Serviços solicitados', 'E-mail'], zone: 'content', anchorPlacement: 'bottom', actionType: 'fill', label: 'Configure o e-mail de envio e credenciais' },
      { targets: BTN_CONCLUIR_TARGETS, actionType: 'click', label: 'Clique em Concluir para salvar as configurações de e-mail' }
    ],
    revisadoDesc: 'Permite configurar o servidor de correio eletrônico (SMTP) da serventia para envio automático de orçamentos, notificações de protocolo e traslados aos clientes.',
    revisadoPassos: [
      'Na barra superior, acesse **Configurações** > **Parametrizações**.',
      'No menu vertical esquerdo, selecione a aba **E-mail**.',
      'Preencha os dados do servidor (**SMTP**, **Porta**, **SSL/TLS**, **Usuário** e **Senha**).',
      'Salve as alterações clicando em **Concluir**.'
    ]
  },
  {
    id: 'M-16.2',
    slug: 'M-16.2-parametrizar-captura-e-digitalizacao',
    modulo: 'config',
    screenTitle: 'Parametrização de Captura e Digitalização',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/configuracoes', targets: ['.aba-configuracoes a:has-text("Captura e digitalização")', 'Captura e digitalização'], clickTargetAfter: true, actionType: 'click', label: 'Selecione a aba Captura e digitalização' },
      { targets: CONFIG_TAB_CONTENT_TARGETS, groupTargets: ['Cor para digitalização do DUT', "Dpi's para digitalização do DUT", 'Mostrar configurações do scanner'], zone: 'content', anchorPlacement: 'bottom', actionType: 'select', label: 'Defina a resolução (DPI), formato e parâmetros do scanner' },
      { targets: BTN_CONCLUIR_TARGETS, actionType: 'click', label: 'Finalize a configuração clicando em Concluir' }
    ],
    revisadoDesc: 'Define os parâmetros globais de digitalização de documentos e captura de imagens de cartões de autógrafo no Orion TN.',
    revisadoPassos: [
      'Acesse **Configurações** > **Parametrizações**.',
      'No painel lateral, clique na aba **Captura e digitalização**.',
      'Ajuste o perfil de captura, resolução e compressão padrão.',
      'Finalize a configuração clicando em **Concluir**.'
    ]
  },
  {
    id: 'M-16.6',
    slug: 'M-16.6-definir-campos-obrigatorios',
    modulo: 'config',
    screenTitle: 'Definição de Campos Obrigatórios',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/configuracoes', targets: ['.aba-configuracoes a:has-text("Campos obrigatórios")', 'Campos obrigatórios'], clickTargetAfter: true, actionType: 'click', label: 'Acesse a aba Campos obrigatórios' },
      { targets: CONFIG_TAB_CONTENT_TARGETS, groupTargets: ['Tela', '.panel-default', 'table'], zone: 'content', anchorPlacement: 'bottom', actionType: 'select', label: 'Marque os campos de preenchimento obrigatório por tela' },
      { targets: BTN_CONCLUIR_TARGETS, actionType: 'click', label: 'Grave as regras clicando em Concluir' }
    ],
    revisadoDesc: 'Customização de campos mandatários por formulário no Orion TN, impedindo a lavratura de atos sem preenchimento de requisitos notariais obrigatórios.',
    revisadoPassos: [
      'Abra **Configurações** > submenu **Parametrizações**.',
      'Clique na aba **Campos obrigatórios** no menu lateral esquerdo.',
      'Selecione o módulo/tela e marque as caixas de seleção dos campos exigidos.',
      'Clique em **Concluir** para salvar a política cadastral.'
    ]
  },
  {
    id: 'M-16.7',
    slug: 'M-16.7-configurar-painel-de-atalhos',
    modulo: 'config',
    screenTitle: 'Configuração de Atalhos de Teclado',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/configuracoes', targets: ['.aba-configuracoes a:has-text("Painel de atalhos")', 'Painel de atalhos'], clickTargetAfter: true, actionType: 'click', label: 'Clique na aba Painel de atalhos' },
      { targets: CONFIG_TAB_CONTENT_TARGETS, groupTargets: ['Tela', 'table'], zone: 'content', anchorPlacement: 'bottom', actionType: 'fill', label: 'Vincule teclas de função rápida (F2, F4, etc.) às rotinas' },
      { targets: BTN_CONCLUIR_TARGETS, actionType: 'click', label: 'Clique em Concluir para persistir os atalhos' }
    ],
    revisadoDesc: 'Permite configurar teclas de atalho rápido para agilizar o atendimento no balcão e a redação de minutas no dia a dia da serventia.',
    revisadoPassos: [
      'Acesse **Configurações** > **Parametrizações**.',
      'No menu lateral, selecione **Painel de atalhos**.',
      'Associe as combinações de teclado desejadas às telas mais acessadas.',
      'Salve as definições clicando em **Concluir**.'
    ]
  },
  {
    id: 'M-22.0',
    slug: 'M-22.0-acessar-e-gerenciar-cadastro-de-livros',
    modulo: 'config',
    screenTitle: 'Gestão do Cadastro de Livros Notariais',
    steps: [
      { targets: ['.navbar a:has-text("Administração")', 'Administração'], actionType: 'click', label: 'Acesse o menu Administração' },
      { navigateHash: '#/livro', targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique no botão Adicionar + para novo livro' },
      { targets: ['form', '.panel-body', 'fieldset'], actionType: 'fill', label: 'Preencha o número do livro, tipo e quantidade de folhas' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Confirme a criação do novo livro notarial' }
    ],
    revisadoDesc: 'Abertura de novos livros notariais no Orion TN com definição de numeração, tipo de ato (Escrituras, Procurações, Testamentos) e controle de numeração de folhas.',
    revisadoPassos: [
      'No menu superior, acesse **Administração** > **Controle de Livros**.',
      'No canto inferior direito, clique em **Adicionar +**.',
      'Preencha os dados: **Tipo livro**, **Número**, **Página inicial** e **Responsável**.',
      'Grave o cadastro para disponibilizar o livro para lavratura.'
    ]
  },
  {
    id: 'M-24.0',
    slug: 'M-24.0-acessar-e-gerenciar-tipos-de-documento-de-partes',
    modulo: 'config',
    screenTitle: 'Gestão de Tipos de Documento de Partes',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/tipoTermo', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre os tipos de documentos cadastrados' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o registro para edição dos parâmetros' },
      { targets: BTN_ADICIONAR_TARGETS, actionType: 'click', label: 'Grave o novo tipo de documento cadastrado' }
    ],
    revisadoDesc: 'Cadastra novos tipos de documentos aceitos para formalização de termos de comparecimento no balcão de notas e firmas.',
    revisadoPassos: [
      'Acesse **Configurações** > submenu **Cadastros auxiliares** > **Tipo de documento - Termo de comparecimento**.',
      'Clique no botão **Adicionar +**.',
      'Digite a nomenclatura oficial do documento no campo correspondente.',
      'Confirme o cadastro clicando em **Salvar**.'
    ]
  },
  {
    id: 'M-25.0',
    slug: 'M-25.0-gerenciamento-de-configuracoes-de-impressao',
    modulo: 'config',
    screenTitle: 'Gerenciamento de Configurações de Impressão',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/configuracaoImpressaoModelo', targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Localize a configuração de impressão na grade' },
      { targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Edite ou adicione uma nova configuração de impressora' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Grave as definições de porta e modelo' }
    ],
    revisadoDesc: 'Centraliza a vinculação de impressoras térmicas e de papel comum aos tipos de documento e relatórios gerados pelo ecossistema Orion.',
    revisadoPassos: [
      'No menu **Configurações**, selecione **Modelos de impressão** > **Configuração de impressão**.',
      'Consulte as impressoras mapeadas por modelo na listagem.',
      'Abra a configuração desejada para alterar o driver ou fila de impressão.',
      'Salve as atualizações.'
    ]
  },
  {
    id: 'M-26.0',
    slug: 'M-26.0-cadastro-de-nova-configuracao-de-impressao-de-etiq',
    modulo: 'config',
    screenTitle: 'Cadastro de Configuração de Impressão de Etiquetas',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/configuracaoImpressaoModelo', targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique em Adicionar + para configurar impressora de etiqueta' },
      { targets: ['form', '.panel-body', 'fieldset'], actionType: 'fill', label: 'Selecione a impressora térmica e ajuste as margens' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Salve a configuração de etiqueta' }
    ],
    revisadoDesc: 'Mapeamento de impressoras térmicas (Zebra, Elgin, Argox) para etiquetas de autenticidade, reconhecimento e recibo no Orion TN.',
    revisadoPassos: [
      'Acesse **Configurações** > **Modelos de impressão** > **Configuração de impressão**.',
      'Clique em **Adicionar +** no canto inferior da tela.',
      'Associe o modelo de etiqueta à impressora de etiquetas instalada na estação.',
      'Grave os parâmetros clicando em **Salvar**.'
    ]
  },
  {
    id: 'M-32.2',
    slug: 'M-32.2-cadastrar-cartorio-dados-para-o-censec-certificado-d',
    modulo: 'config',
    screenTitle: 'Cadastro de Cartório - CENSEC e Certificado Digital',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/cartorio/cadastrar', targets: ['input[type="text"]', 'fieldset', '.row'], clickSelectorAfter: 'button:has-text("Alterar"), a:has-text("Alterar"), Alterar', actionType: 'fill', label: 'Preencha os dados da serventia e credenciais CENSEC' },
      { targets: ['input[type="email"]', 'fieldset', '.row'], actionType: 'select', label: 'Vincule o arquivo do certificado digital A1 (.pfx)' },
      { targets: BTN_SALVAR_TARGETS.concat(['button:has-text("Alterar")', 'Alterar']), actionType: 'click', label: 'Valide a cadeia ICP-Brasil e clique em Salvar' }
    ],
    revisadoDesc: 'Instrui a importação e parametrização do Certificado Digital tipo A1 (.pfx) no cadastro do cartório, habilitando assinaturas de lotes de comunicação e e-Notariado.',
    revisadoPassos: [
      'No menu **Configurações**, acesse **Dados do cartório**.',
      'Localize a aba ou painel de **Certificados Digitais**.',
      'Selecione o arquivo `.pfx` no armazenamento local e digite a respectiva senha.',
      'Teste a validade do certificado e confirme a gravação.'
    ]
  },
  {
    id: 'M-34.0',
    slug: 'M-34.0-gerenciar-tipos-de-anexo',
    modulo: 'config',
    screenTitle: 'Gerenciamento de Tipos de Anexo',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/tipoDocumento', targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Consulte os tipos de anexo cadastrados na grade' },
      { targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Acione o botão para adicionar ou gerenciar anexos' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Confirme as alterações realizadas' }
    ],
    revisadoDesc: 'Gerencia as categorias e classificações de anexos digitais que podem ser vinculados a protocolos de escrituras e procurações.',
    revisadoPassos: [
      'Acesse **Configurações** > **Cadastros auxiliares** > **Tipo de documento**.',
      'Visualize os tipos existentes (ex: RG, CPF, Certidão de Casamento).',
      'Inspecione ou edite as propriedades de cada categoria.',
      'Grave para manter o catálogo atualizado.'
    ]
  },
  {
    id: 'M-35.0',
    slug: 'M-35.0-cadastrar-novo-tipo-de-anexo',
    modulo: 'config',
    screenTitle: 'Cadastro de Novo Tipo de Anexo',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/tipoDocumento', targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique em Adicionar + para incluir novo anexo' },
      { targets: ['form', '.panel-body', 'input[type="text"]'], actionType: 'fill', label: 'Digite a descrição e requisitos do tipo de anexo' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Clique em Salvar para disponibilizar o anexo' }
    ],
    revisadoDesc: 'Inclusão de uma nova classificação de documento anexo no acervo do Orion TN.',
    revisadoPassos: [
      'Acesse **Configurações** > **Cadastros auxiliares** > **Tipo de documento**.',
      'Clique em **Adicionar +**.',
      'Informe o nome da categoria no campo **Descrição**.',
      'Clique em **Salvar** para disponibilizar na lista de anexos do protocolo.'
    ]
  },
  {
    id: 'M-36.0',
    slug: 'M-36.0-gerenciar-documentos-apresentados',
    modulo: 'config',
    screenTitle: 'Gerenciamento de Documentos Apresentados',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/documentoApresentado', targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Consulte os documentos apresentados cadastrados' },
      { targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Adicione ou edite o catálogo de documentos' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Grave as alterações de documentos apresentados' }
    ],
    revisadoDesc: 'Controle dos tipos de documentos comprobatórios apresentados pelas partes na qualificação notarial (CNH, RG, Passaporte, etc.).',
    revisadoPassos: [
      'No menu **Configurações**, abra **Cadastros auxiliares** > **Documento apresentado**.',
      'Verifique a listagem de documentos válidos pela legislação.',
      'Inclua novos tipos de identificação oficial conforme provimentos vigentes.',
      'Salve para aplicar à qualificação de partes.'
    ]
  },
  {
    id: 'M-40.0',
    slug: 'M-40.0-acessar-e-gerenciar-aliquotas',
    modulo: 'config',
    screenTitle: 'Gestão de Alíquotas e Parâmetros Fiscais',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/aliquota', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre a alíquota municipal desejada' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione a regra tributária na listagem' },
      { targets: BTN_ADICIONAR_TARGETS.concat(['button:has-text("Filtrar")', 'Filtrar']).concat(BTN_SALVAR_TARGETS), actionType: 'click', label: 'Confirme a nova alíquota tributária' }
    ],
    revisadoDesc: 'Manutenção das alíquotas de tributos municipais (ISS) e taxas estaduais incidentes sobre os emolumentos notariais.',
    revisadoPassos: [
      'Acesse **Configurações** > submenu **Cadastros auxiliares** > **Alíquotas**.',
      'Selecione o tributo que sofreu alteração na legislação municipal/estadual.',
      'Informe o novo percentual da alíquota e a data de vigência.',
      'Grave os dados para atualizar os cálculos fiscais.'
    ]
  },
  {
    id: 'M-41.0',
    slug: 'M-41.0-cadastrar-area-de-atuacao',
    modulo: 'config',
    screenTitle: 'Cadastro de Área de Atuação',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/areaAtuacao', targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique em Adicionar + para nova área' },
      { targets: ['form', '.panel-body', 'input[type="text"]'], actionType: 'fill', label: 'Preencha a descrição da área de atuação' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Salve a nova área de atuação' }
    ],
    revisadoDesc: 'Cadastra ramos e áreas de atuação profissional para classificação de pessoas físicas e jurídicas no índice notarial.',
    revisadoPassos: [
      'Acesse **Configurações** > **Cadastros auxiliares** > **Área de Atuação**.',
      'Clique no botão **Adicionar +**.',
      'Digite a descrição da área (ex: Construção Civil, Advocacia, Imobiliário).',
      'Confirme em **Salvar**.'
    ]
  },
  {
    id: 'M-42.0',
    slug: 'M-42.0-gerenciar-modelos-de-etiqueta',
    modulo: 'config',
    screenTitle: 'Gerenciamento de Modelos de Etiqueta',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/modeloEtiqueta', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Consulte os modelos de etiqueta ativos' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o modelo térmico para inspeção' },
      { targets: BTN_ADICIONAR_TARGETS, actionType: 'click', label: 'Adicione ou edite o layout da etiqueta' }
    ],
    revisadoDesc: 'Administração dos modelos de impressão de etiquetas térmicas para reconhecimento de firma, autenticação de cópias e recibos de caixa.',
    revisadoPassos: [
      'Acesse **Configurações** > **Modelos de impressão** > **Etiquetas diversas**.',
      'Filtre pelo **Título** ou **Tipo modelo** desejado.',
      'Abra a etiqueta selecionada para ajustes de texto, selo e QR Code.',
      'Salve as atualizações de layout.'
    ]
  },
  {
    id: 'M-43.0',
    slug: 'M-43.0-gerenciar-perfil-de-participacao',
    modulo: 'config',
    screenTitle: 'Gestão de Perfis de Participação de Partes',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/perfilParticipacao', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre os perfis cadastrados' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o perfil desejado na grade' },
      { targets: BTN_ADICIONAR_TARGETS, actionType: 'click', label: 'Grave as novas regras de participação' }
    ],
    revisadoDesc: 'Define papéis e perfis de participação de partes em atos protocolares (Outorgante, Outorgado, Vendedor, Comprador, Anuente, Testemunha).',
    revisadoPassos: [
      'Acesse **Configurações** > **Cadastros auxiliares** > **Perfil de partes**.',
      'Analise a lista de papéis aplicáveis às minutas.',
      'Configure novas participações conforme exigência do tipo de escritura.',
      'Clique em **Salvar** para registrar.'
    ]
  },
  {
    id: 'M-60.0',
    slug: 'M-60.0-gerenciar-cadastro-de-naturezas',
    modulo: 'config',
    screenTitle: 'Gestão do Cadastro de Naturezas de Atos',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/natureza', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre as naturezas existentes por código ou descrição' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Localize e selecione o ato desejado na grade' },
      { targets: BTN_ADICIONAR_TARGETS, actionType: 'click', label: 'Adicione ou edite os metadados da natureza' }
    ],
    revisadoDesc: 'Catálogo de naturezas jurídicas de atos notariais (Compra e Venda, Doação, Inventário, Ata Notarial), mapeando a obrigatoriedade de comunicação para DOI, CENSEC e livro/folhas.',
    revisadoPassos: [
      'Acesse **Configurações** > submenu **Cadastros auxiliares** > **Natureza**.',
      'Utilize os filtros de **Espécie** para localizar o tipo de ato.',
      'Verifique se a natureza exige livro e folhas, imóvel ou comunicação setorial.',
      'Clique em **Adicionar +** para criar novas naturezas ou edite as existentes.'
    ]
  },
  {
    id: 'M-62.0',
    slug: 'M-62.0-gerenciar-cadastro-de-grupo-de-item',
    modulo: 'config',
    screenTitle: 'Gestão de Grupos de Itens Tarifários',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/grupoItem', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre os grupos de itens por código ou descrição' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o grupo tarifário na listagem' },
      { targets: BTN_ADICIONAR_TARGETS, actionType: 'click', label: 'Grave as alterações de grupo de item' }
    ],
    revisadoDesc: 'Organização dos itens de custas em grupos estruturados (Escrituras, Procurações, Certidões, Firmas) para composição tarifária precisa.',
    revisadoPassos: [
      'No menu **Configurações**, abra **Tabela de custas** > **Grupo de item**.',
      'Examine os grupos tarifários vigentes na serventia.',
      'Ajuste descrições ou regras de consolidação dos itens.',
      'Confirme as modificações.'
    ]
  },
  {
    id: 'M-63.0',
    slug: 'M-63.0-gerenciar-cadastro-de-item-de-grupo-de-item',
    modulo: 'config',
    screenTitle: 'Gestão de Itens Vinculados a Grupos',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/grupoItem', targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o grupo pai na listagem de grupos tarifários' },
      { targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Acione Adicionar + para incluir novo grupo ou subitem' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Salve o novo grupo tarifário' }
    ],
    revisadoDesc: 'Inclusão de um novo grupo tarifário na tabela de custas do Orion TN.',
    revisadoPassos: [
      'Acesse **Configurações** > **Tabela de custas** > **Grupo de item**.',
      'Clique em **Adicionar +**.',
      'Digite o nome do novo grupo tarifário no campo correspondente.',
      'Clique em **Salvar** para registrar.'
    ]
  },
  {
    id: 'M-66.0',
    slug: 'M-66.0-gerenciar-cadastro-de-outros-servicos',
    modulo: 'config',
    screenTitle: 'Gestão de Cadastro de Outros Serviços',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/outrosServicos', targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique em Adicionar + para cadastrar novo outro serviço' },
      { targets: ['form', '.panel-body', 'fieldset'], actionType: 'fill', label: 'Informe a descrição do serviço, valor base e regras de repasse' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Confirme o cadastro do serviço' }
    ],
    revisadoDesc: 'Cadastro de serviços acessórios ou despesas reembolsáveis (diligências, cópias, encadernação) que compõem o faturamento das custas.',
    revisadoPassos: [
      'Acesse **Configurações** > **Cadastros auxiliares** > **Outros serviços**.',
      'Clique em **Adicionar +** no canto inferior direito.',
      'Informe a **Descrição** clara e o **Valor** unitário do serviço.',
      'Clique em **Salvar** para disponibilizar nas rotinas de custas.'
    ]
  },
  {
    id: 'M-67.0',
    slug: 'M-67.0-gerenciar-area-de-atuacao',
    modulo: 'config',
    screenTitle: 'Gerenciamento de Área de Atuação',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/areaAtuacao', targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Consulte as áreas de atuação cadastradas' },
      { targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Edite ou adicione novos ramos' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Salve as áreas cadastradas' }
    ],
    revisadoDesc: 'Manutenção do catálogo de áreas de atuação profissional para fins estatísticos e qualificação cadastral.',
    revisadoPassos: [
      'Abra **Configurações** > **Cadastros auxiliares** > **Área de Atuação**.',
      'Inspecione os registros existentes no sistema.',
      'Atualize ou inative áreas que não estão em uso.',
      'Grave para manter a base consistente.'
    ]
  },
  {
    id: 'M-68.0',
    slug: 'M-68.0-cadastrar-nova-area-de-atuacao',
    modulo: 'config',
    screenTitle: 'Cadastro de Nova Área de Atuação',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/areaAtuacao', targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique em Adicionar + para nova área' },
      { targets: ['form', '.panel-body', 'input[type="text"]'], actionType: 'fill', label: 'Digite o nome da nova área de atuação' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Salve a nova área' }
    ],
    revisadoDesc: 'Inclusão de um novo ramo de atividade para preenchimento de cadastro de clientes.',
    revisadoPassos: [
      'Acesse **Configurações** > **Cadastros auxiliares** > **Área de Atuação**.',
      'Clique no botão **Adicionar +**.',
      'Informe a nomenclatura da área profissional.',
      'Clique em **Salvar**.'
    ]
  },
  {
    id: 'M-69.0',
    slug: 'M-69.0-acessar-e-gerenciar-modelos-de-etiqueta',
    modulo: 'config',
    screenTitle: 'Acesso e Gestão de Modelos de Etiqueta',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/modeloEtiqueta', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre os modelos cadastrados no acervo' },
      { targets: LIST_TABLE_TARGETS, actionType: 'select', label: 'Selecione o modelo térmico desejado' },
      { targets: BTN_ADICIONAR_TARGETS, actionType: 'click', label: 'Abra para visualização e edição' }
    ],
    revisadoDesc: 'Consulta e gestão integrada de layouts de etiquetas para balcão, caixa e atos de notas.',
    revisadoPassos: [
      'Acesse **Configurações** > **Modelos de impressão** > **Etiquetas diversas**.',
      'Filtre pelo tipo de serviço correspondente.',
      'Abra o modelo para conferência dos campos e variáveis dinâmicas.',
      'Salve eventuais ajustes de diagramação.'
    ]
  },
  {
    id: 'M-70.0',
    slug: 'M-70.0-criando-um-novo-modelo-de-etiqueta-configuracao-ba',
    modulo: 'config',
    screenTitle: 'Criação de Novo Modelo de Etiqueta - Configuração Básica',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/modeloEtiqueta', targets: BTN_ADICIONAR_TARGETS, clickTargetAfter: true, actionType: 'click', label: 'Clique em Adicionar + para criar novo modelo de etiqueta' },
      { targets: ['form', '.panel-body', 'fieldset'], actionType: 'fill', label: 'Informe o nome do modelo, dimensões e tipo de impressora' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Salve a configuração básica da etiqueta' }
    ],
    revisadoDesc: 'Criação inicial de layout de etiqueta com parametrização de tipo, título e estrutura de impressão.',
    revisadoPassos: [
      'No menu **Configurações**, abra **Modelos de impressão** > **Etiquetas diversas**.',
      'Clique em **Adicionar +** no rodapé da página.',
      'Defina **Título**, **Descrição** e o **Tipo modelo** (ex: Balcão, Caixa, Autenticidade).',
      'Salve para prosseguir aos parâmetros técnicos.'
    ]
  },
  {
    id: 'M-70.1',
    slug: 'M-70.1-configurando-os-parametros-tecnicos-de-um-modelo-d',
    modulo: 'config',
    screenTitle: 'Parâmetros Técnicos de Modelo de Etiqueta',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/modeloEtiqueta', targets: LIST_TABLE_TARGETS, clickSelectorAfter: 'a[title*="Alterar"], button[title*="Alterar"], .fa-pencil, .fa-edit, table tbody tr a, table tbody tr button', actionType: 'select', label: 'Selecione a etiqueta criada na listagem' },
      { targets: ['form', '.panel-body', 'fieldset'], clickSelectorAfter: 'button:has-text("Alterar"), a:has-text("Alterar"), Alterar', actionType: 'fill', label: 'Ajuste largura, altura, margens e posição do QR Code' },
      { targets: BTN_SALVAR_TARGETS.concat(['button:has-text("Alterar")', 'Alterar']), actionType: 'click', label: 'Grave os parâmetros técnicos da impressora térmica' }
    ],
    revisadoDesc: 'Calibração subpixel de dimensões (largura, altura em mm), densidade térmica e posicionamento de elementos dinâmicos na etiqueta.',
    revisadoPassos: [
      'Acesse **Configurações** > **Modelos de impressão** > **Etiquetas diversas**.',
      'Abra o modelo de etiqueta para calibração técnica.',
      'Defina medidas exatas da mídia e espaçamento do cabeçalho e selo.',
      'Clique em **Salvar** para aplicar à impressora.'
    ]
  },
  {
    id: 'R-18.0',
    slug: 'R-18.0-cadastro-de-outros-servicos-despesas-e-valores-ext',
    modulo: 'config',
    screenTitle: 'Cadastro de Outros Serviços e Despesas Extranotariais',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/outrosServicos', targets: LIST_SEARCH_TARGETS, actionType: 'search', label: 'Filtre os serviços extranotariais existentes' },
      { targets: LIST_TABLE_TARGETS, actionType: 'fill', label: 'Defina a descrição da despesa, alíquota e tipo de cobrança' },
      { targets: BTN_ADICIONAR_TARGETS, actionType: 'click', label: 'Clique em Salvar para atualizar a tabela' }
    ],
    revisadoDesc: 'Atualização do valor monetário de serviços avulsos cadastrados nas custas da serventia.',
    revisadoPassos: [
      'No menu **Configurações**, abra **Cadastros auxiliares** > **Outros serviços**.',
      'Pesquise pelo nome do serviço na caixa de busca.',
      'Altere o campo **Valor** com o novo montante homologado.',
      'Clique em **Salvar** para atualizar o faturamento.'
    ]
  },
  {
    id: 'V-2.2.2',
    slug: 'V-2.2.2-configuracao-de-atos-notariais-quantidade-e-base-d',
    modulo: 'config',
    screenTitle: 'Configuração de Atos Notariais e Base de Cálculo',
    steps: [
      { targets: ['.navbar a:has-text("Notas")', 'Notas'], actionType: 'click', label: 'Acesse o menu Notas' },
      { navigateHash: '#/orcamento/cadastrar', targets: ['fieldset', 'input[type="text"]', '.panel-body'], actionType: 'fill', label: 'Informe a base de cálculo e natureza do ato no orçamento' },
      { targets: ['table', 'fieldset', '.panel-body'], actionType: 'select', label: 'Adicione os atos notariais e confira a quantidade' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Calcule as custas e consolide o orçamento completo' }
    ],
    revisadoDesc: 'Parametrização de faixas de valor, quantidades de atos e deduções na composição de orçamentos completos para lavratura de escrituras.',
    revisadoPassos: [
      'Acesse **Notas** > **Orçamentos** > **Orçamento completo**.',
      'Preencha o valor da transação no campo de base de cálculo.',
      'Adicione os atos adicionais necessários (outorga, certidões, ITBI).',
      'Confirme o cálculo das custas e emolumentos.'
    ]
  },
  {
    id: 'V-2.2.3',
    slug: 'V-2.2.3-calculo-de-itbi-e-detalhamento-de-custas-do-regist',
    modulo: 'config',
    screenTitle: 'Cálculo de ITBI e Detalhamento de Custas do RI',
    steps: [
      { targets: ['.navbar a:has-text("Configurações")', 'Configurações'], actionType: 'click', label: 'Acesse o menu Configurações' },
      { navigateHash: '#/custas/parametros', targets: ['fieldset', 'table', 'input[type="text"]', '.panel-body'], actionType: 'select', label: 'Consulte os parâmetros de cálculo de impostos e RI' },
      { navigateHash: '#/orcamento/cadastrar', targets: ['fieldset', 'input[type="text"]', '.panel-body'], actionType: 'fill', label: 'Acesse o quadro de custas do Registro de Imóveis' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Grave a composição detalhada no orçamento' }
    ],
    revisadoDesc: 'Simulação automatizada do cálculo do imposto de transmissão (ITBI/ITCMD) e custas estimadas de registro imobiliário para conferência do escrevente.',
    revisadoPassos: [
      'No menu **Configurações**, abra **Tabela de custas** > **Parâmetros**.',
      'Defina as alíquotas municipais e bases de incidência do ITBI.',
      'No orçamento da escritura, verifique o rateio entre notas, registro e tributos.',
      'Consolide o orçamento final.'
    ]
  },
  {
    id: 'V-2.3.1',
    slug: 'V-2.3.1-edicao-de-custas-do-registro-de-imoveis-e-adicao-d',
    modulo: 'config',
    screenTitle: 'Edição de Custas do Registro de Imóveis',
    steps: [
      { targets: ['.navbar a:has-text("Notas")', 'Notas'], actionType: 'click', label: 'Acesse o menu Notas' },
      { navigateHash: '#/orcamento/cadastrar', targets: ['fieldset', 'input[type="text"]', '.panel-body'], actionType: 'fill', label: 'Acesse o quadro de custas do Registro de Imóveis' },
      { targets: ['table', 'fieldset', '.panel-body'], actionType: 'select', label: 'Adicione emolumentos complementares da central RI' },
      { targets: BTN_SALVAR_TARGETS, actionType: 'click', label: 'Atualize o total do orçamento' }
    ],
    revisadoDesc: 'Permite ao escrevente retificar valores de emolumentos do Registro de Imóveis no orçamento de escrituras para adequação à prenotação real.',
    revisadoPassos: [
      'No menu **Notas**, abra o orçamento da escritura em andamento.',
      'Localize a seção de **Custas do Registro de Imóveis**.',
      'Edite os itens de prenotação e registro com os valores exatos da certidão.',
      'Recalcule o total e salve o orçamento.'
    ]
  }
];

async function clickDOMElement(client: AgentBrowserClient, selectorsOrTexts: string[]): Promise<boolean> {
  const clicked = await client.eval(`
    (() => {
      const queries = ${JSON.stringify(selectorsOrTexts)};
      function isVisible(el) {
        if (!el || !el.getBoundingClientRect) return false;
        const s = window.getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity || '1') === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 1 && r.height > 1;
      }
      for (const q of queries) {
        if (!q) continue;
        if (!q.includes(':has-text(')) {
          try {
            const el = Array.from(document.querySelectorAll(q)).find(isVisible);
            if (el) { el.click(); return true; }
          } catch {}
        }
        const clean = q.replace(/^.*:has-text\\(['"]([^'"]+)['"]\\).*$/, '$1').trim().toLowerCase();
        if (!clean) continue;
        const nodes = Array.from(document.querySelectorAll('a, button, [role="tab"], [role="button"]')).filter(isVisible);
        const exact = nodes.find(n => (n.innerText || n.textContent || '').trim().toLowerCase() === clean);
        if (exact) { exact.click(); return true; }
        const partial = nodes.find(n => (n.innerText || n.textContent || '').trim().toLowerCase().includes(clean));
        if (partial) { partial.click(); return true; }
      }
      return false;
    })()
  `);
  return clicked === 'true';
}

async function runSingleRoutineLive(
  routine: RoutineConfig,
  kbFilePath: string,
  client: AgentBrowserClient,
  workerSessionId: string,
  workload: WorkloadType,
  workerIndex: number
): Promise<{ report: AuditRoutineReport; telemetry: LiveStepTelemetry[] }> {
  const routineStart = Date.now();
  const baseModuleDir = path.join(rotinasOutDir, routine.modulo);
  let targetDir = path.join(baseModuleDir, routine.slug);
  await fs.promises.mkdir(targetDir, { recursive: true });
  await fs.promises.mkdir(rawLiveDir, { recursive: true });

  // Garantir que o worker inicia na tela inicial autenticada do Orion TN
  await client.open(config.appHomeUrl);
  await client.wait(1800);

  const stepResults: AuditStepResult[] = [];
  const stepTelemetry: LiveStepTelemetry[] = [];
  const generatedPrints: string[] = [];

  // Esta execução passa a ser a dona da pasta da rotina: a telemetria que o executor do KB tenha
  // gravado para ela (ADR-017) descreve prints que serão sobrescritas.
  await fs.promises.rm(path.join(auditoriaRoot, 'cache', 'kb-telemetry', `${routine.id}.json`), { force: true });

  // Artefatos de execuções anteriores desta rotina não convivem com o relatório novo
  for (const stale of await fs.promises.readdir(targetDir)) {
    if (/^passo-\d+(-[a-z])?\.(png|webp)$/i.test(stale) || /-revisado\.md$/i.test(stale)) {
      await fs.promises.rm(path.join(targetDir, stale), { force: true });
    }
  }

  // Texto-fonte do relatório: SEMPRE o manual original do KB (ADR-017)
  const origParsed: ParsedRoutine | null = fs.existsSync(kbFilePath) ? parseRoutineMarkdown(kbFilePath) : null;
  const kbTargets = origParsed ? listRoutineBoldTargets(origParsed) : [];
  const seenTargets = new Set<string>();
  const recordPresence = async () => {
    const missing = kbTargets.filter(t => !seenTargets.has(t));
    if (missing.length === 0) return;
    for (const t of await probeTargetsPresence(client, missing)) seenTargets.add(t);
  };

  // RBAC GATE (ADR-017): perfil exigido pelo manual x identidade real da sessão, antes de qualquer passo
  let gate: PrivilegeGateResult | undefined;
  let block: RoutineBlockInfo | undefined;
  if (origParsed) {
    gate = await runPrivilegeGate(client, origParsed);
    if (!gate.satisfied) {
      block = buildPrivilegeGateBlock(gate);
      console.warn(`⛔ [RBAC Gate] ${routine.id}: ${RBAC_BLOCK_TYPE}. ${gate.reason}`);
      const printName = 'passo-01.png';
      const rawStepPath = path.join(rawLiveDir, `${routine.slug}-passo-01-raw.png`);
      const outPng = path.join(targetDir, printName);
      const outWebp = outPng.replace(/\.png$/i, '.webp');
      await client.screenshot(rawStepPath);
      await fs.promises.copyFile(rawStepPath, outPng);
      await sharp(rawStepPath).webp({ quality: 85 }).toFile(outWebp);
      generatedPrints.push(printName);
      const errMsg = `${RBAC_BLOCK_TYPE}. ${gate.reason}`;
      stepResults.push({
        stepNumber: 1,
        originalText: routine.steps[0]?.label || '',
        validatedText: routine.steps[0]?.label || '',
        isModified: false,
        screenshotRawPath: rawStepPath,
        screenshotAnnotatedPath: outPng,
        screenshotWebpPath: outWebp,
        captureMode: 'clean',
        status: 'blocked',
        errorMessage: errMsg
      });
      stepTelemetry.push({
        routineId: routine.id,
        slug: routine.slug,
        modulo: routine.modulo,
        stepNum: 1,
        label: 'Tela no instante do bloqueio por privilégio (sem demarcação)',
        actionType: 'verify',
        rawScreenshotPath: rawStepPath,
        finalPngPath: outPng,
        finalWebpPath: outWebp,
        domGeometry: null,
        status: 'blocked',
        blockKind: 'rbac',
        errorMessage: errMsg
      });
    }
  }

  for (let sIdx = 0; sIdx < (block ? 0 : routine.steps.length); sIdx++) {
    const stepCfg = routine.steps[sIdx];
    const stepNum = sIdx + 1;
    const padStep = String(stepNum).padStart(2, '0');
    const printName = `passo-${padStep}.png`;
    const rawStepPath = path.join(rawLiveDir, `${routine.slug}-passo-${padStep}-raw.png`);
    const outPng = path.join(targetDir, printName);
    const outWebp = outPng.replace(/\.png$/i, '.webp');

    try {
      if (stepCfg.navigateHash) {
        await client.jumpHash(stepCfg.navigateHash);
        await client.wait(stepCfg.waitMs ?? 2200);
      }

      // Filtro de Zona Semântica (ADR-015): passos de parametrização/formulário nunca medem a navegação
      const zonePolicy: StepZonePolicy = stepCfg.zone ?? inferStepZone(stepCfg.label, stepCfg.actionType);

      // Medição ao vivo no DOM + captura imediata no mesmo frame
      const domGeometry = await client.captureStepWithDOMGeometry(stepCfg.targets, rawStepPath, {
        scrollIntoView: true,
        zone: zonePolicy,
        groupTargets: stepCfg.groupTargets
      });

      await recordPresence();

      if (domGeometry) {
        const res = await annotateScreenshot({
          inputPath: rawStepPath,
          outputPath: outPng,
          box: domGeometry.cssBox,
          viewport: domGeometry.viewport,
          domContext: domGeometry.context,
          anchorPlacement: stepCfg.anchorPlacement ?? 'auto',
          stepNumber: stepNum,
          actionType: stepCfg.actionType,
          label: stepCfg.label,
          themeColor: '#ad0505',
          exportWebp: true
        });
        generatedPrints.push(printName);

        stepResults.push({
          stepNumber: stepNum,
          originalText: stepCfg.label,
          validatedText: stepCfg.label,
          isModified: false,
          screenshotRawPath: rawStepPath,
          screenshotAnnotatedPath: outPng,
          screenshotWebpPath: res.webpPath,
          boundingBox: res.layout.targetBox,
          domGeometry,
          layoutResult: res.layout,
          status: 'ok'
        });

        stepTelemetry.push({
          routineId: routine.id,
          slug: routine.slug,
          modulo: routine.modulo,
          stepNum,
          label: stepCfg.label,
          actionType: stepCfg.actionType,
          zonePolicy,
          rawScreenshotPath: rawStepPath,
          finalPngPath: outPng,
          finalWebpPath: res.webpPath || outWebp,
          domGeometry,
          status: 'ok'
        });

        // Avançar estado da UI após captura se configurado (ex: clicar aba ou Adicionar +)
        if (stepCfg.clickTargetAfter || stepCfg.clickSelectorAfter) {
          const clickList = stepCfg.clickSelectorAfter
            ? [stepCfg.clickSelectorAfter]
            : stepCfg.targets;
          await clickDOMElement(client, clickList);
          await client.wait(stepCfg.waitMs ?? 1500);
          await recordPresence();
        }
      } else {
        // ADR-010: Elemento ausente no DOM real -> salvar frame real sem caixas fantasmas e marcar bloqueio
        if (fs.existsSync(rawStepPath)) {
          await fs.promises.copyFile(rawStepPath, outPng);
          await sharp(rawStepPath).webp({ quality: 85 }).toFile(outWebp);
          generatedPrints.push(printName);
        }
        const errMsg = `Elemento não localizado ao vivo no DOM: [${stepCfg.targets.join(', ')}]`;
        stepResults.push({
          stepNumber: stepNum,
          originalText: stepCfg.label,
          validatedText: stepCfg.label,
          isModified: false,
          screenshotRawPath: rawStepPath,
          screenshotAnnotatedPath: outPng,
          screenshotWebpPath: outWebp,
          status: 'blocked',
          errorMessage: errMsg
        });
        stepTelemetry.push({
          routineId: routine.id,
          slug: routine.slug,
          modulo: routine.modulo,
          stepNum,
          label: stepCfg.label,
          actionType: stepCfg.actionType,
          zonePolicy,
          rawScreenshotPath: rawStepPath,
          finalPngPath: outPng,
          finalWebpPath: outWebp,
          domGeometry: null,
          status: 'blocked',
          errorMessage: errMsg
        });
      }
    } catch (stepErr: any) {
      stepResults.push({
        stepNumber: stepNum,
        originalText: stepCfg.label,
        validatedText: stepCfg.label,
        isModified: false,
        screenshotRawPath: rawStepPath,
        screenshotAnnotatedPath: outPng,
        status: 'blocked',
        errorMessage: stepErr.message
      });
      stepTelemetry.push({
        routineId: routine.id,
        slug: routine.slug,
        modulo: routine.modulo,
        stepNum,
        label: stepCfg.label,
        actionType: stepCfg.actionType,
        zonePolicy: stepCfg.zone ?? inferStepZone(stepCfg.label, stepCfg.actionType),
        rawScreenshotPath: rawStepPath,
        finalPngPath: outPng,
        finalWebpPath: outWebp,
        domGeometry: null,
        status: 'blocked',
        errorMessage: stepErr.message
      });
    }
  }

  // Regra da Evidência Estrita (ADR-017): o manifesto não revisa texto. A rotina só sai validada se
  // todo elemento em negrito do manual foi visto ao vivo em alguma tela capturada.
  const unseenTargets = block ? [] : kbTargets.filter(t => !seenTargets.has(t));
  const stepBlocked = stepResults.some(r => r.status === 'blocked');
  if (!block && stepBlocked) {
    const first = stepResults.find(r => r.status === 'blocked')!;
    block = {
      kind: 'missing_target',
      tipo: 'Alvo do Manifesto não Localizado ao Vivo',
      motivo: `Na captura ${first.stepNumber}: ${first.errorMessage}. O texto original do manual foi preservado.`,
      roteiro: ['Conferir a tela no ambiente de homologação.', 'Reexecutar a auditoria desta rotina.']
    };
  } else if (!block && !origParsed) {
    block = {
      kind: 'other',
      tipo: 'Manual Original não Encontrado no KB',
      motivo: `O arquivo ${path.basename(kbFilePath)} não existe em kb/rotinas; sem o texto original não há o que validar.`,
      roteiro: ['Conferir o identificador e o nome do arquivo da rotina no KB.']
    };
  } else if (!block && unseenTargets.length > 0) {
    block = {
      kind: 'missing_target',
      tipo: 'Alvo do Manual sem Evidência na Tela',
      motivo: `O manual cita ${unseenTargets.map(t => `"${t}"`).join(', ')}, que não apareceram em nenhuma das ${generatedPrints.length} telas capturadas. Pela Regra da Evidência Estrita, o texto original foi preservado e nada foi reescrito.`,
      roteiro: [
        'Percorrer a rotina no ambiente de homologação e conferir se esses elementos existem (com outro nome, em outra tela ou sob outro perfil).',
        'Corrigir o manual manualmente, se necessário, e reexecutar a auditoria.'
      ]
    };
  }
  const hasBlocks = !!block;
  const reportParsed: ParsedRoutine = origParsed
    ? { ...origParsed, workloadType: workload }
    : {
        id: routine.id,
        titulo: routine.screenTitle,
        modulo: routine.modulo,
        secao: routine.id[0] || 'M',
        tem_video: false,
        workloadType: workload,
        frontmatter: {},
        descricao: '(manual original não encontrado no KB)',
        steps: [],
        observacoes: [],
        rawContent: ''
      };

  // ADR-021: o bloqueio do manifesto também é classificado em [ATT]/[DDD]/[XRX] (sem leitura de tela vazia
  // neste runner declarativo; manual ausente no KB conta como [ATT]).
  let overallStatus: RoutineAuditStatus = 'validado_inalterado';
  if (block) {
    const cls = classifyBlock({ parsed: reportParsed, block, blockedStep: stepResults.find(r => r.status === 'blocked')?.stepNumber });
    overallStatus = cls.status ?? 'atualizacao_editorial';
    block = cls.block;
  }

  // Sinalização obrigatória no nome da pasta e do arquivo
  let finalSlug = `${reviewPrefix(overallStatus)}${routine.slug}`;
  const flaggedDir = path.join(baseModuleDir, finalSlug);
  if (targetDir !== flaggedDir) {
    if (fs.existsSync(flaggedDir)) {
      await fs.promises.rm(flaggedDir, { recursive: true, force: true });
    }
    await fs.promises.rename(targetDir, flaggedDir);
    targetDir = flaggedDir;
    for (const t of stepTelemetry) {
      t.finalPngPath = path.join(targetDir, path.basename(t.finalPngPath));
      t.finalWebpPath = path.join(targetDir, path.basename(t.finalWebpPath));
    }
  }
  // Variantes antigas da mesma rotina (prefixo legado [!!!] ou outra tag) ficariam duplicadas
  for (const variant of [`[!!!] ${routine.slug}`, routine.slug, ...Object.values(REVIEW_TAGS).map(m => `${m.prefix}${routine.slug}`)]) {
    const stale = path.join(baseModuleDir, variant);
    if (variant !== finalSlug && stale !== targetDir && fs.existsSync(stale)) {
      await fs.promises.rm(stale, { recursive: true, force: true });
    }
  }

  const printsCount = generatedPrints.length;
  const evidencePrints: EvidencePrint[] = generatedPrints.map((print, i) => ({
    print,
    label: stepTelemetry[i]?.label || routine.steps[i]?.label || `Captura ${i + 1}`,
    blockedMessage: stepResults[i]?.status === 'blocked' && block?.kind !== 'rbac' ? stepResults[i].errorMessage : undefined
  }));
  const mdBody = buildRevisedRoutineDocument({
    parsed: reportParsed,
    results: [],
    divergences: [],
    status: overallStatus,
    block,
    gate,
    workerId: workerSessionId,
    ambiente: '4 TN SCS - CARTÓRIO SILVIA DALBIEN',
    evidencePrints,
    unseenTargets
  }).content;

  const revisadoMdPath = path.join(targetDir, `${finalSlug}-revisado.md`);
  await fs.promises.writeFile(revisadoMdPath, mdBody, 'utf8');

  const durationSeconds = Math.round((Date.now() - routineStart) / 1000);
  console.log(
    `${hasBlocks ? '⚠' : '✓'} [${workerSessionId} | ${workload.toUpperCase()}] ${routine.id} concluída (${printsCount} prints ao vivo em ${durationSeconds}s, status=${overallStatus})`
  );

  return {
    report: {
      id: routine.id,
      modulo: routine.modulo,
      titulo: routine.screenTitle,
      workloadType: workload,
      workerSessionId,
      status: overallStatus,
      steps: stepResults,
      divergences: [],
      block,
      privilegeGate: gate,
      executedAt: new Date().toISOString(),
      durationSeconds,
      changelogPath: revisadoMdPath
    },
    telemetry: stepTelemetry
  };
}

export async function runPhase2Master(concurrency = 4, onlyIds?: string[]) {
  const targetRoutines = onlyIds && onlyIds.length > 0
    ? ROUTINES.filter(r => onlyIds.includes(r.id))
    : ROUTINES;

  console.log('================================================================');
  console.log(`  EXECUTOR MESTRE DA FASE 2: ${targetRoutines.length} ROTINAS AO VIVO (DOM REAL)`);
  console.log(`  Concorrência Leitura: ${concurrency} | Mutação: 1 (Semáforo)`);
  console.log('================================================================\n');

  const startTime = Date.now();
  const routineByFile = new Map<string, RoutineConfig>();
  const routineFiles: string[] = [];

  for (const r of targetRoutines) {
    const filePath = path.join(kbDir, r.modulo, `${r.slug}.md`);
    routineByFile.set(filePath, r);
    routineFiles.push(filePath);
  }

  const allTelemetry: LiveStepTelemetry[] = [];
  const pool = new BrowserWorkerPool({
    readConcurrency: concurrency,
    mutationConcurrency: config.maxWriteConcurrency > 1 ? 1 : 1,
    headless: true
  });

  const reports = await pool.executeBatch(
    routineFiles,
    file => {
      if (fs.existsSync(file)) {
        return parseRoutineMarkdown(file);
      }
      const r = routineByFile.get(file)!;
      return {
        id: r.id,
        titulo: r.screenTitle,
        modulo: r.modulo,
        secao: r.id[0] || 'M',
        tem_video: false,
        frontmatter: {},
        rawContent: '',
        descricao: r.revisadoDesc,
        steps: r.steps.map((s, idx) => ({
          stepNumber: idx + 1,
          rawText: s.label,
          targets: s.targets,
          actionType: s.actionType
        })),
        observacoes: []
      };
    },
    async (file, client, workerSessionId, workload) => {
      const routine = routineByFile.get(file)!;
      const workerNum = parseInt(workerSessionId.replace(/\D+/g, ''), 10) || 1;
      const { report, telemetry } = await runSingleRoutineLive(
        routine,
        file,
        client,
        workerSessionId,
        workload,
        workerNum
      );
      allTelemetry.push(...telemetry);
      return report;
    }
  );

  await fs.promises.mkdir(path.dirname(telemetryOutPath), { recursive: true });
  let finalTelemetry = allTelemetry;
  if (onlyIds && onlyIds.length > 0 && fs.existsSync(telemetryOutPath)) {
    try {
      const prevTelemetry: LiveStepTelemetry[] = JSON.parse(await fs.promises.readFile(telemetryOutPath, 'utf8'));
      const updatedIds = new Set(onlyIds);
      finalTelemetry = [...prevTelemetry.filter(t => !updatedIds.has(t.routineId)), ...allTelemetry];
    } catch {}
  }
  await fs.promises.writeFile(telemetryOutPath, JSON.stringify(finalTelemetry, null, 2), 'utf8');

  const isReview = (s: string | undefined) => !!s && isReviewStatus(s);
  const successCount = reports.filter(r => r && !isReview(r.status)).length;
  const blockedCount = reports.filter(r => r && isReview(r.status)).length;
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n================================================================');
  console.log('  RESUMO DA EXECUÇÃO AO VIVO DA FASE 2:');
  console.log(`  - Rotinas validadas ao vivo:  ${successCount}/${targetRoutines.length}`);
  console.log(`  - Rotinas com revisão [ATT]/[DDD]/[XRX]: ${blockedCount}`);
  console.log(`  - Telemetria DOM salva em:    ${telemetryOutPath}`);
  console.log(`  - Tempo total:                ${totalTime}s`);
  console.log('================================================================\n');

  return { successCount, errorCount: blockedCount, totalTime: parseFloat(totalTime) };
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('run-phase2-master.ts')) {
  const onlyArg = process.argv.find(a => a.startsWith('--only='));
  const onlyIds = onlyArg ? onlyArg.replace('--only=', '').split(',').map(s => s.trim()).filter(Boolean) : undefined;
  runPhase2Master(4, onlyIds).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
