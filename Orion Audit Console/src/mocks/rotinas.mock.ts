import type {
  ActionType, AnnotationLayoutResult, AuditRoutineReport, BoundingBox, DOMGroupMember, DOMResolvedGeometry,
  ParsedRoutine, SmartLocatorDivergence, StepZonePolicy, WorkloadType,
} from "@/types/audit";
import type {
  AuditoriaUiFrontmatter, GeometryInvariantResult, GovernanceEvent, GovernanceStatus, Modulo, PhaseNumber,
  RoutineAuditState, RoutineDetail, RunnerJobInfo, Secao, StepView,
} from "@/types/api";
import { isReviewState } from "@/lib/status";
import { annotatedScreenshot, blockedScreenshot, rawScreenshot, SCREEN_SIZE, type ScreenSpec } from "./screenshotFactory";

export const AMBIENTE = "Homologação — Cartório Fictício de Notas";
export const VERSAO_HOMOLOGACAO = "WildFly 22 / Orion 06.04.01";
const LATERAL_NAV: BoundingBox[] = [{ x: 0, y: 56, width: 220, height: 844 }];
const CONTENT_ROOT = { selector: "main.erp-content", strategy: "landmark-main", box: { x: 220, y: 56, width: 1220, height: 844 } };

interface StepDef {
  text: string;                 // texto original com **alvos**
  validated?: string;           // texto revisado (se diferente)
  action: ActionType;
  box?: BoundingBox;            // alvo no canvas 1440×900
  zone?: StepZonePolicy;
  group?: Array<{ query: string; box: BoundingBox }>;
  divergence?: Omit<SmartLocatorDivergence, "stepNumber" | "detectedAt">;
  failInvariant4?: string;
}

interface RoutineDef {
  id: string; titulo: string; modulo: Modulo; secao: Secao; fase: PhaseNumber | null; workload: WorkloadType;
  status: RoutineAuditState; gov: GovernanceStatus; runner?: RunnerJobInfo; rotas: string[]; tags: string[];
  temVideo?: boolean; descricao: string; objetivo: string; sinonimos: string[]; perguntas: string[]; sintomas: string[];
  observacoes: string[]; screen: string; menu: string[]; steps: StepDef[]; worker?: string; executedAt?: string;
  duration?: number; pasta?: string | null;
  bloqueio?: { tipo: string; motivo: string; roteiroManual: string[] };
  blockedStep?: { text: string; error: string };
  historico?: Array<Omit<GovernanceEvent, "id">>;
}

const targetsOf = (t: string) => Array.from(t.matchAll(/\*\*(.+?)\*\*/g)).map((m) => m[1]);
const menuBox = (i: number): BoundingBox => ({ x: 300 + i * 116, y: 14, width: 104, height: 28 });
const fieldBox = (row: number, col: number): BoundingBox => ({ x: 260 + col * 380, y: 180 + row * 84, width: 350, height: 36 });
const btnBox = (i: number): BoundingBox => ({ x: 1100 - i * 150, y: 470, width: 140, height: 36 });

function union(boxes: BoundingBox[]): BoundingBox {
  const x = Math.min(...boxes.map((b) => b.x)); const y = Math.min(...boxes.map((b) => b.y));
  const r = Math.max(...boxes.map((b) => b.x + b.width)); const btm = Math.max(...boxes.map((b) => b.y + b.height));
  return { x, y, width: r - x, height: btm - y };
}

function layoutFor(target: BoundingBox, label: string): AnnotationLayoutResult {
  const labelW = Math.max(90, label.length * 8 + 20);
  if (target.y < 40) {
    const badgeBox = { x: target.x + target.width / 2 - 18, y: target.y + target.height + 10, width: 36, height: 26 };
    return { targetBox: target, badgeBox, labelBox: { x: badgeBox.x + 44, y: badgeBox.y, width: labelW, height: 26 }, placement: "bottom", scaleX: 1, scaleY: 1, selfOcclusionArea: 0 };
  }
  if (target.x + target.width + 60 + labelW < SCREEN_SIZE.width) {
    const badgeBox = { x: target.x + target.width + 12, y: target.y + target.height / 2 - 13, width: 36, height: 26 };
    return { targetBox: target, badgeBox, labelBox: { x: badgeBox.x + 44, y: badgeBox.y, width: labelW, height: 26 }, placement: "right", scaleX: 1, scaleY: 1, selfOcclusionArea: 0 };
  }
  const badgeBox = { x: target.x, y: target.y + target.height + 10, width: 36, height: 26 };
  return { targetBox: target, badgeBox, labelBox: { x: badgeBox.x + 44, y: badgeBox.y, width: labelW, height: 26 }, placement: "bottom", scaleX: 1, scaleY: 1, selfOcclusionArea: 0 };
}

const INVARIANTES: Array<GeometryInvariantResult["nome"]> = [
  "confinamento", "zero_auto_oclusao", "zero_colisao_badge_rotulo", "variancia_estrutural", "paridade_artefatos", "zona_semantica", "uniao_geometrica",
];
const INV_DETALHE: Record<string, string> = {
  confinamento: "Badge e rótulo inteiramente dentro do viewport 1440×900.",
  zero_auto_oclusao: "selfOcclusionArea = 0 px².",
  zero_colisao_badge_rotulo: "Interseção badge × rótulo = 0 px².",
  variancia_estrutural: "Layout estável entre execuções (Δ < 2px).",
  paridade_artefatos: "PNG e WebP com dimensões idênticas.",
  zona_semantica: "Alvo resolvido na zona permitida pela política.",
  uniao_geometrica: "União dos membros do grupo contém todos os alvos.",
};

function iso(day: number, h: number, m: number) {
  return new Date(Date.UTC(2026, 10, day, h + 3, m)).toISOString();
}

function toYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (Array.isArray(obj)) {
    return obj.map((v) => (typeof v === "object" && v !== null
      ? `${pad}-\n${toYaml(v, indent + 1)}`
      : `${pad}- ${scalar(v)}`)).join("\n");
  }
  if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj as Record<string, unknown>).filter(([, v]) => v !== undefined).map(([k, v]) => {
      if (typeof v === "object" && v !== null) {
        if (Array.isArray(v) && v.length === 0) return `${pad}${k}: []`;
        return `${pad}${k}:\n${toYaml(v, indent + 1)}`;
      }
      return `${pad}${k}: ${scalar(v)}`;
    }).join("\n");
  }
  return pad + scalar(obj);
}
function scalar(v: unknown) {
  if (typeof v === "string") return /[:#\-[\]{}"'\n]|^\s|\s$/.test(v) || v === "" ? JSON.stringify(v) : v;
  return String(v);
}

function build(d: RoutineDef): RoutineDetail {
  const executed = d.status !== "nao_auditada";
  const executedAt = d.executedAt ?? iso(10, 14, 20);
  const frontmatter: Record<string, unknown> = {
    id: d.id, titulo: d.titulo, modulo: d.modulo, secao: d.secao, fase: d.fase, tem_video: !!d.temVideo,
    carga: d.workload, objetivo: d.objetivo, tags: d.tags, sinonimos: d.sinonimos,
    perguntas_usuario: d.perguntas, sintomas_comuns: d.sintomas,
    ...(d.temVideo ? { bunny_library_id: "000000", bunny_video_id: "00000000-0000-0000-0000-000000000000" } : {}),
  };
  const allSteps = d.blockedStep ? [{ text: d.blockedStep.text, action: "click" as ActionType }] : d.steps;
  const original: ParsedRoutine = {
    id: d.id, titulo: d.titulo, modulo: d.modulo, secao: d.secao, tem_video: !!d.temVideo, workloadType: d.workload,
    frontmatter, descricao: d.descricao,
    steps: allSteps.map((s, i) => ({ stepNumber: i + 1, rawText: s.text, targets: targetsOf(s.text), actionType: s.action, zone: (s as StepDef).zone })),
    observacoes: d.observacoes,
    rawContent: "",
  };

  const steps: StepView[] = [];
  const divergences: SmartLocatorDivergence[] = [];

  if (d.blockedStep) {
    const img = executed ? blockedScreenshot(d.screen, d.blockedStep.error) : undefined;
    steps.push({
      stepNumber: 1, actionType: "click", targets: targetsOf(d.blockedStep.text), originalText: d.blockedStep.text,
      validatedText: d.blockedStep.text, isModified: false, status: "blocked",
      media: img ? { pngUrl: img, webpUrl: img, width: 1440, height: 900, pngBytes: 182_400, webpBytes: 61_200 } : null,
      errorMessage: d.blockedStep.error,
    });
  } else {
    d.steps.forEach((s, i) => {
      const n = i + 1;
      const targets = targetsOf(s.text);
      const label = targets[0] ?? "Alvo";
      const validatedText = s.validated ?? s.text;
      if (!executed || !s.box) {
        steps.push({ stepNumber: n, actionType: s.action, zonePolicy: s.zone, targets, originalText: s.text, validatedText, isModified: false, status: isReviewState(d.status) ? "blocked" : "nao_executado", media: null });
        return;
      }
      const groupMembers: DOMGroupMember[] | undefined = s.group?.map((g) => ({ query: g.query, matchedSelector: `label:has-text("${g.query}") + input`, innerText: g.query, cssBox: g.box }));
      const target = s.group ? union(s.group.map((g) => g.box)) : s.box;
      const realLabel = s.divergence?.actualElementText ?? label;
      const layout = layoutFor(target, realLabel);
      const geometry: DOMResolvedGeometry = {
        cssBox: target, viewport: { width: 1440, height: 900, devicePixelRatio: 1, scrollX: 0, scrollY: 0 },
        context: { tagName: s.action === "fill" ? "INPUT" : "BUTTON", role: s.action === "fill" ? "textbox" : "button", innerText: realLabel, isTopNav: target.y < 56, isVerticalSidebar: false },
        matchedSelector: s.action === "fill" ? `input[name="${label.toLowerCase().replace(/\W+/g, "_")}"]` : `button:has-text("${realLabel}")`,
        url: `https://erp.homologacao.local/${d.rotas[0] ?? "#/"}`, capturedAt: executedAt,
        zone: target.y < 56 ? "any" : "content", zonePolicy: s.zone ?? "content-preferred",
        contentRoot: CONTENT_ROOT, lateralNavBoxes: LATERAL_NAV,
        groupMembers, groupUnionBox: s.group ? target : undefined, unresolvedGroupTargets: s.group ? [] : undefined,
        clippedToViewport: false,
      };
      const divergence = s.divergence ? { ...s.divergence, stepNumber: n, detectedAt: executedAt } : undefined;
      if (divergence) divergences.push(divergence);
      const screen: ScreenSpec = { screenTitle: d.screen, menu: d.menu, activeMenu: 0, target: s.group ? undefined : { box: s.box, label: realLabel }, extraTargets: s.group?.map((g) => ({ box: g.box, label: g.query })) };
      const annotated = annotatedScreenshot(screen, n, layout, realLabel, s.group?.map((g) => g.box));
      const raw = rawScreenshot(screen);
      steps.push({
        stepNumber: n, actionType: s.action, zonePolicy: s.zone, targets, originalText: s.text, validatedText,
        isModified: validatedText !== s.text, status: validatedText !== s.text ? "modified" : "ok",
        media: { webpUrl: annotated, pngUrl: annotated, rawUrl: raw, width: 1440, height: 900, webpBytes: 48_000 + n * 3_100, pngBytes: 151_000 + n * 9_700 },
        domGeometry: geometry, layoutResult: layout, divergence,
        executedAction: { kind: s.action === "fill" ? "fill" : s.action === "verify" ? "none" : "click", via: "measured-node", selector: geometry.matchedSelector, node: { tagName: geometry.context.tagName, text: realLabel, box: target, insideNavZone: target.y < 56 }, zone: geometry.zone },
        invariantes: INVARIANTES.map((nome, k) => ({
          id: (k + 1) as GeometryInvariantResult["id"], nome,
          aprovado: !(k === 3 && s.failInvariant4),
          detalhe: k === 3 && s.failInvariant4 ? s.failInvariant4 : INV_DETALHE[nome],
        })),
      });
    });
  }

  const report: AuditRoutineReport | null = executed && d.status !== "nao_auditada" ? {
    id: d.id, modulo: d.modulo, titulo: d.titulo, workloadType: d.workload, workerSessionId: `${d.worker ?? "worker-1"}:sess-${d.id.toLowerCase()}`,
    status: d.status as AuditRoutineReport["status"],
    steps: steps.map((s) => ({
      stepNumber: s.stepNumber, originalText: s.originalText, validatedText: s.validatedText, isModified: s.isModified,
      screenshotRawPath: "(interno)", screenshotAnnotatedPath: "(interno)", boundingBox: s.layoutResult?.targetBox,
      domGeometry: s.domGeometry, layoutResult: s.layoutResult, divergence: s.divergence, executedAction: s.executedAction,
      status: s.status === "nao_executado" ? "blocked" : s.status, errorMessage: s.errorMessage,
    })),
    divergences, executedAt, durationSeconds: d.duration ?? 42, changelogPath: "(interno)",
  } : null;

  const prints = steps.filter((s) => s.media).length;
  const auditoriaUi: AuditoriaUiFrontmatter | null = report ? {
    data_execucao: executedAt.slice(0, 10), status: report.status, carga: d.workload, worker_id: d.worker ?? "worker-1",
    versao_homologacao: VERSAO_HOMOLOGACAO, ambiente: AMBIENTE, prints_geradas: prints,
    tipo_bloqueio: d.bloqueio?.tipo,
    auto_cura: { acionada: divergences.length > 0, divergencias_detectadas: divergences.map((v) => ({ passo: v.stepNumber, alvo_documentado: v.documentedTarget, elemento_real: v.actualElementText, camada: v.resolutionLayer, confianca: v.confidence })) },
  } : null;

  const descricaoMd = `# ${d.titulo}\n\n${d.descricao}\n\n## Passo a passo\n\n`;
  const stepsMd = steps.map((s) => `${s.stepNumber}. ${s.validatedText}${s.media ? `\n\n   [aqui vai a print "passo-${String(s.stepNumber).padStart(2, "0")}.png"]` : ""}`).join("\n\n");
  const obsMd = d.observacoes.length ? `\n\n## Observações\n\n${d.observacoes.map((o) => `- ${o}`).join("\n")}` : "";
  original.rawContent = `---\n${toYaml(frontmatter)}\n---\n\n${descricaoMd}${d.steps.map((s, i) => `${i + 1}. ${s.text}`).join("\n")}${obsMd}\n`;

  const menor = divergences.length ? Math.min(...divergences.map((v) => v.confidence)) : undefined;
  const historico: GovernanceEvent[] = (d.historico ?? (executed ? [{ tipo: "auditoria_executada", autor: "runner", em: executedAt, descricao: `Auditoria concluída em ${d.worker ?? "worker-1"} com ${prints} prints.` }] : []))
    .map((e, i) => ({ ...e, id: `${d.id}-ev-${i + 1}` }));

  return {
    summary: {
      id: d.id, titulo: d.titulo, modulo: d.modulo, secao: d.secao, fase: d.fase, temVideo: !!d.temVideo, workloadType: d.workload,
      statusAuditoria: d.status, statusGovernanca: d.gov, runner: d.runner ?? { estado: "idle" },
      pastaAuditoria: d.pasta !== undefined ? d.pasta : executed ? `${d.id}-${d.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").slice(0, 40)}` : null,
      totalPassos: steps.length, printsGeradas: prints, divergenciasCount: divergences.length, menorConfianca: menor,
      rotasHash: d.rotas, tags: d.tags, dataExecucao: executed ? executedAt : undefined, workerId: executed ? d.worker ?? "worker-1" : undefined,
      durationSeconds: executed ? d.duration ?? 42 : undefined, thumbnailUrl: steps.find((s) => s.media)?.media?.webpUrl,
      updatedAt: executed ? executedAt : iso(1, 9, 0),
    },
    original, report, auditoriaUi, steps,
    frontmatterOriginalYaml: toYaml(frontmatter),
    frontmatterRevisadoYaml: toYaml({ ...frontmatter, ...(auditoriaUi ? { auditoria_ui: auditoriaUi } : {}) }),
    markdownRevisado: descricaoMd + stepsMd + obsMd,
    bloqueio: d.bloqueio,
    historico,
  };
}

const commonPerguntas = (t: string) => [`Como faço para ${t}?`, `Onde fica a opção para ${t}?`, `Quem tem permissão para ${t}?`];

const DEFS: RoutineDef[] = [
  {
    id: "D-1.1", titulo: "Acessar o Módulo Orion Caixa", modulo: "caixa", secao: "D", fase: 1, workload: "read_only",
    status: "validado_inalterado", gov: "aprovada", rotas: ["#/caixa"], tags: ["caixa", "acesso", "navegação"], worker: "worker-2",
    executedAt: iso(3, 9, 12), duration: 18, screen: "Caixa — Visão geral", menu: ["Caixa", "Notas", "Firmas", "Selos"],
    descricao: "Mostra como entrar no módulo de Caixa a partir da tela inicial do sistema.",
    objetivo: "Permitir que o colaborador acesse o módulo de Caixa para consultar o movimento do dia.",
    sinonimos: ["abrir caixa", "entrar no caixa", "tela do caixa"], perguntas: commonPerguntas("acessar o caixa"),
    sintomas: ["Menu Caixa não aparece", "Tela em branco ao abrir o caixa", "Mensagem de acesso negado"],
    observacoes: ["O menu só aparece para perfis com a permissão Caixa › Consultar."],
    steps: [
      { text: "No menu superior, clique em **Caixa**.", action: "click", box: menuBox(0), zone: "any" },
      { text: "Selecione a opção **Visão Geral**.", action: "click", box: btnBox(0) },
      { text: "Confira o painel **Movimento do Dia** exibido na tela.", action: "verify", box: { x: 260, y: 520, width: 1140, height: 40 } },
    ],
    historico: [
      { tipo: "auditoria_executada", autor: "runner", em: iso(3, 9, 12), descricao: "Auditoria concluída em worker-2 com 3 prints." },
      { tipo: "aprovada", autor: "Ana Revisora", em: iso(4, 10, 5), descricao: "Rotina aprovada sem edições." },
    ],
  },
  {
    id: "R-1.1", titulo: "Abertura de Protocolo de Escritura", modulo: "notas", secao: "R", fase: 1, workload: "mutation",
    status: "validado_com_ajustes", gov: "pendente_aprovacao", rotas: ["#/protocolo/novo"], tags: ["notas", "protocolo", "escritura"], worker: "worker-1",
    executedAt: iso(9, 15, 40), duration: 64, screen: "Protocolo de Escritura", menu: ["Notas", "Protocolo", "Minutas", "Livros"],
    descricao: "Abre um novo protocolo de escritura pública vinculando as partes e o tipo de ato.",
    objetivo: "Registrar a entrada de um pedido de escritura e gerar o número de protocolo.",
    sinonimos: ["abrir protocolo", "novo protocolo de escritura", "protocolar escritura"], perguntas: commonPerguntas("abrir um protocolo de escritura"),
    sintomas: ["Botão de novo protocolo não aparece", "Número de protocolo não é gerado", "Erro ao vincular partes"],
    observacoes: ["Em homologação, o número de protocolo é reiniciado diariamente."],
    steps: [
      { text: "No menu superior, acesse **Protocolo**.", action: "click", box: menuBox(1), zone: "any" },
      { text: "Clique em **Novo Protocolo**.", validated: "Clique em **Adicionar +**.", action: "click", box: btnBox(0),
        divergence: { documentedTarget: "Novo Protocolo", actualElementText: "Adicionar +", actualRole: "button", matchedRef: "e42", resolutionLayer: "a11y_fuzzy_match", confidence: 0.91, reason: "Rótulo acessível 'Adicionar +' com mesma posição e papel do botão documentado." } },
      { text: "Selecione o **Tipo de Ato** desejado.", action: "select", box: fieldBox(0, 0) },
      { text: "Preencha o campo **Outorgante** com o nome da parte.", action: "fill", box: fieldBox(0, 1) },
      { text: "Clique em **Gravar** para gerar o protocolo.", action: "click", box: btnBox(1) },
    ],
  },
  {
    id: "M-16.2", titulo: "Parametrizar Captura e Digitalização", modulo: "config", secao: "M", fase: 2, workload: "mutation",
    status: "validado_inalterado", gov: "aprovada", rotas: ["#/configuracoes"], tags: ["configuração", "scanner", "digitalização"], worker: "worker-3",
    executedAt: iso(6, 11, 2), duration: 51, screen: "Configurações — Digitalização", menu: ["Config", "Usuários", "Parâmetros", "Sistema"],
    descricao: "Define os parâmetros padrão de captura de imagens e digitalização de documentos.",
    objetivo: "Padronizar resolução, formato e dispositivo de captura para todo o cartório.",
    sinonimos: ["configurar scanner", "parâmetros de digitalização", "resolução de captura"], perguntas: commonPerguntas("configurar a digitalização"),
    sintomas: ["Imagens digitalizadas borradas", "Scanner padrão não salvo", "Formato de arquivo incorreto"],
    observacoes: ["Alterações valem para novas capturas; arquivos antigos não são reprocessados."],
    steps: [
      { text: "Acesse **Config** no menu superior.", action: "click", box: menuBox(0), zone: "any" },
      { text: "Abra a aba **Digitalização**.", action: "click", box: btnBox(0) },
      { text: "Ajuste os campos **Dispositivo**, **Resolução (DPI)** e **Modo de Cor**.", action: "fill", zone: "content",
        box: fieldBox(1, 0), group: [{ query: "Dispositivo", box: fieldBox(1, 0) }, { query: "Resolução (DPI)", box: fieldBox(1, 1) }, { query: "Modo de Cor", box: fieldBox(1, 2) }] },
      { text: "Clique em **Salvar Parâmetros**.", action: "click", box: btnBox(1) },
    ],
    historico: [
      { tipo: "auditoria_executada", autor: "runner", em: iso(6, 11, 2), descricao: "Auditoria concluída em worker-3 com 4 prints." },
      { tipo: "aprovada", autor: "Bruno Auditor", em: iso(7, 8, 44), descricao: "Rotina aprovada." },
    ],
  },
  {
    id: "C-ACESSO-01", titulo: "Criação de Novo Colaborador e Espelhamento de Permissões", modulo: "acesso", secao: "C", fase: 2, workload: "mutation",
    status: "validado_com_ajustes", gov: "pendente_aprovacao", rotas: ["#/usuarios"], tags: ["acesso", "usuário", "permissões"], worker: "worker-4",
    executedAt: iso(10, 16, 18), duration: 88, screen: "Usuários e Permissões", menu: ["Usuários", "Perfis", "Auditoria", "Sessões"],
    descricao: "Cadastra um novo colaborador e copia as permissões de um colaborador existente.",
    objetivo: "Agilizar a liberação de acesso de novos colaboradores com o mesmo perfil de um colega.",
    sinonimos: ["cadastrar usuário", "copiar permissões", "novo colaborador"], perguntas: commonPerguntas("criar um colaborador"),
    sintomas: ["Permissões não copiadas", "Usuário criado sem acesso", "Login duplicado"],
    observacoes: ["O espelhamento não copia permissões de caixa por segurança."],
    steps: [
      { text: "No menu superior, clique em **Usuários**.", action: "click", box: menuBox(0), zone: "any" },
      { text: "Clique em **Novo Colaborador**.", action: "click", box: btnBox(0) },
      { text: "Preencha **Nome Completo** e **Login**.", action: "fill", box: fieldBox(0, 0) },
      { text: "No campo **Espelhar de**, selecione o colaborador de referência.", action: "select", box: fieldBox(1, 1) },
      { text: "Clique em **Gravar**.", validated: "Clique em **Salvar**.", action: "click", box: btnBox(1),
        divergence: { documentedTarget: "Gravar", actualElementText: "Salvar", actualRole: "button", matchedRef: "e88", resolutionLayer: "dom_synonym_heuristic", confidence: 0.88, reason: "Sinônimo 'Gravar' → 'Salvar' no dicionário de ações do DOM." } },
      { text: "Confirme a mensagem **Colaborador criado**.", action: "verify", box: { x: 520, y: 120, width: 400, height: 40 } },
    ],
  },
  {
    id: "C-ACESSO-05", titulo: "Serviço de Infraestrutura Indisponível no Módulo SGA", modulo: "acesso", secao: "C", fase: 2, workload: "read_only",
    status: "dependencia_dados_banco", gov: "pendente_aprovacao", rotas: ["#/sga"], tags: ["acesso", "infraestrutura", "SGA"], worker: "worker-2",
    executedAt: iso(11, 8, 30), duration: 31, pasta: "[DDD] C-ACESSO-05-falha-de-conexao-sga", screen: "SGA — Atendimento", menu: ["SGA", "Senhas", "Painel", "Filas"],
    descricao: "Orienta o que fazer quando o módulo de atendimento (SGA) não responde.",
    objetivo: "Restabelecer o serviço de senhas e atendimento do balcão.",
    sinonimos: ["SGA fora do ar", "senhas não funcionam", "painel de atendimento parado"], perguntas: commonPerguntas("resolver o SGA indisponível"),
    sintomas: ["Tela do SGA não carrega", "Erro 503 ao abrir o painel", "Senhas não são emitidas"],
    observacoes: ["Acione o suporte técnico se o serviço não voltar após reinício."],
    steps: [
      { text: "No menu superior, clique em **SGA**.", action: "click" },
      { text: "Verifique o indicador **Status do Serviço**.", action: "verify" },
      { text: "Clique em **Reconectar**.", action: "click" },
      { text: "Confirme que a tela **Atendimento** carregou.", action: "verify" },
    ],
    bloqueio: {
      tipo: "Serviço de Infraestrutura Indisponível",
      motivo: "O serviço de atendimento retornou HTTP 503 durante toda a janela de execução; nenhuma tela pôde ser capturada.",
      roteiroManual: [
        "Verificar o status do serviço de atendimento no painel de infraestrutura.",
        "Consultar o log do servidor de aplicação no horário da execução.",
        "Reiniciar o serviço de atendimento pelo console de administração.",
        "Validar que a rota do SGA responde HTTP 200 antes de reexecutar a auditoria.",
      ],
    },
  },
  {
    id: "M-14.2", titulo: "Balcão de Firmas: Lançando Serviços e Imprimindo Etiquetas", modulo: "firmas", secao: "M", fase: 3, workload: "mutation",
    status: "validado_com_ajustes", gov: "revisao_solicitada", rotas: ["#/pedidoFirmas/cadastrar"], tags: ["firmas", "balcão", "etiquetas"], worker: "worker-1",
    runner: { estado: "na_fila", jobId: "job-7f3a21", lane: "mutation", posicaoFila: 2, enfileiradoEm: iso(12, 19, 40) },
    executedAt: iso(8, 13, 55), duration: 73, screen: "Pedido de Firmas", menu: ["Firmas", "Pedidos", "Cartões", "Etiquetas"],
    descricao: "Lança os serviços de reconhecimento de firma no balcão e imprime as etiquetas.",
    objetivo: "Registrar o pedido de firma e emitir as etiquetas com selo.",
    sinonimos: ["lançar firma", "imprimir etiqueta de firma", "pedido de reconhecimento"], perguntas: commonPerguntas("imprimir etiquetas de firma"),
    sintomas: ["Etiqueta sai em branco", "Selo não vinculado", "Impressora não listada"],
    observacoes: ["Use papel de etiqueta 60×30 mm na impressora térmica."],
    steps: [
      { text: "No menu superior, clique em **Pedidos**.", action: "click", box: menuBox(1), zone: "any" },
      { text: "Informe o **CPF da Parte**.", action: "fill", box: fieldBox(0, 0) },
      { text: "Selecione o **Tipo de Reconhecimento**.", action: "select", box: fieldBox(0, 1), failInvariant4: "Variação de 6px no rótulo entre a 1ª e a 2ª execução (limite 2px)." },
      { text: "Clique em **Imprimir Etiqueta**.", validated: "Clique em **Etiquetas**.", action: "click", box: btnBox(0),
        divergence: { documentedTarget: "Imprimir Etiqueta", actualElementText: "Etiquetas", actualRole: "menuitem", matchedRef: "e131", resolutionLayer: "llm_a11y_fallback", confidence: 0.72, reason: "Nenhum match direto; o modelo inferiu 'Etiquetas' pela árvore de acessibilidade." } },
    ],
    historico: [
      { tipo: "auditoria_executada", autor: "runner", em: iso(8, 13, 55), descricao: "Auditoria concluída em worker-1 com 4 prints." },
      { tipo: "revisao_solicitada", autor: "Carla Analista", em: iso(12, 19, 30), descricao: "Divergência de baixa confiança no passo 4.", meta: { categoria: "divergencia_texto" } },
      { tipo: "reexecucao_enfileirada", autor: "Carla Analista", em: iso(12, 19, 40), descricao: "Reexecução enfileirada na lane mutation (posição 2)." },
    ],
  },
  {
    id: "C-FIRMA-03", titulo: "Scanner de Cartão de Autógrafo Não Reconhecido (Driver TWAIN)", modulo: "firmas", secao: "C", fase: 3, workload: "read_only",
    status: "dependencia_dados_banco", gov: "pendente_aprovacao", rotas: ["#/firmas/cartao/digitalizar"], tags: ["firmas", "scanner", "TWAIN"], worker: "worker-3",
    executedAt: iso(11, 10, 15), duration: 22, pasta: "[DDD] C-FIRMA-03-scanner-twain", screen: "Cartão de Autógrafo — Digitalizar", menu: ["Atos", "Firmas", "Digitalizar"],
    descricao: "Resolve o erro de scanner não reconhecido ao digitalizar o cartão de autógrafo.",
    objetivo: "Restabelecer a captura do cartão de autógrafo pelo driver TWAIN.",
    sinonimos: ["scanner não encontrado", "erro TWAIN", "não digitaliza cartão"], perguntas: commonPerguntas("resolver o scanner não reconhecido"),
    sintomas: ["Mensagem 'Dispositivo não encontrado'", "Lista de scanners vazia", "Captura trava em 0%"],
    observacoes: ["Exige acesso físico à estação de trabalho."],
    steps: [],
    blockedStep: { text: "Clique em **Digitalizar Cartão**.", error: "TWAIN_DS_NOT_FOUND: nenhuma fonte de dados TWAIN disponível na estação." },
    bloqueio: {
      tipo: "Hardware / Driver TWAIN",
      motivo: "O runner não tem acesso a um scanner físico; o driver TWAIN não expôs nenhuma fonte de dados.",
      roteiroManual: [
        "Conectar o scanner à estação e confirmar que está ligado.",
        "Reinstalar o driver TWAIN do fabricante e reiniciar a estação.",
        "Abrir a tela de digitalização e selecionar a fonte TWAIN listada.",
        "Digitalizar um cartão de teste e conferir a imagem gerada.",
      ],
    },
  },
  {
    id: "V-7.6.1", titulo: "Importação Reversa de Minuta Word com Extração via IA", modulo: "notas", secao: "V", fase: 5, workload: "mutation",
    status: "nao_auditada", gov: "pendente_aprovacao", rotas: ["#/minutas/importar"], tags: ["notas", "minuta", "IA", "vídeo"], temVideo: true,
    screen: "Minutas — Importar", menu: ["Notas", "Minutas", "Modelos", "IA"],
    descricao: "Importa uma minuta em Word e extrai partes e cláusulas automaticamente.",
    objetivo: "Reduzir a digitação manual na preparação de escrituras.",
    sinonimos: ["importar minuta", "extrair dados do Word", "minuta com IA"], perguntas: commonPerguntas("importar uma minuta Word"),
    sintomas: ["Arquivo não aceito", "Partes não identificadas", "Cláusulas duplicadas"],
    observacoes: ["Aceita apenas arquivos .docx de até 10 MB."],
    steps: [
      { text: "Acesse **Minutas** no menu superior.", action: "click" },
      { text: "Clique em **Importar Word**.", action: "click" },
      { text: "Selecione o arquivo no campo **Arquivo da Minuta**.", action: "fill" },
      { text: "Clique em **Extrair com IA**.", action: "click" },
      { text: "Revise as partes no painel **Dados Extraídos**.", action: "verify" },
    ],
  },
];

export function buildRotinas(): RoutineDetail[] {
  return DEFS.map(build);
}
