import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';
import { parseRoutineMarkdown } from './parser.js';
import { classifyRoutineWorkload } from './worker-pool.js';
import { auditPrint, externalStepsFromMd, loadPrintTelemetry, printNameOf, reviewTagsFromMd, type PrintTelemetry } from './invariants.js';
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  SUPABASE_STORAGE_BUCKET,
  SUPABASE_URL,
} from './supabase.js';
import {
  EXTERNAL_PORTAL_BLOCK_TYPE,
  LEGACY_PREFIX_RE,
  isBlockingReviewStatus,
  isReviewStatus,
  normalizeReviewTags,
  reviewTagsFor,
  statusFromPrefix,
  stripReviewPrefix,
  tagsFromPrefix
} from './review-taxonomy.js';
import type {
  AnnotationLayoutResult,
  DOMResolvedGeometry,
  RoutineStep,
  WorkloadType,
} from './types.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');
const projectRoot = path.resolve(auditoriaRoot, '..');
const kbDir = path.join(projectRoot, 'kb', 'rotinas');
const rotinasDir = path.join(auditoriaRoot, 'rotinas');
const telemetryPath = path.join(auditoriaRoot, 'cache', 'phase2-live-telemetry.json');
const kbTelemetryDir = path.join(auditoriaRoot, 'cache', 'kb-telemetry');
const governancePath = path.join(auditoriaRoot, 'cache', 'governance.json');

interface AuditedFolderInfo {
  dirPath: string;
  slug: string;
  modulo: string;
  isFlaggedBlocked: boolean;
  revisadoMdFile: string;
  revisadoMdContent: string;
  frontmatter: any;
  mtime: number;
}

interface KbFileInfo {
  filePath: string;
  modulo: string;
  slug: string;
}

export interface SyncSingleRoutineOptions {
  /** Pula upload de mídia no Storage (ex.: apenas edição de texto/governança no Console) */
  skipMedia?: boolean;
  /** Envia somente arquivos .webp ao Storage (padrão no write-through em tempo real) */
  onlyWebp?: boolean;
  /** Preserva status_governanca já gravado no Supabase se o governance.json não definir outro (padrão: true) */
  preserveExistingGovernance?: boolean;
  /** Sobrescreve status_governanca explicitamente */
  statusGovernancaOverride?: 'pendente_aprovacao' | 'aprovada' | 'revisao_solicitada';
  /** Suprime logs detalhados */
  quiet?: boolean;
}

export interface SyncSingleRoutineResult {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  routineId: string;
  statusAuditoria?: string;
  stepsCount?: number;
  uploadedMedia?: number;
}

function getPhaseForRoutine(id: string, modulo: string): number | null {
  if (id === 'D-1.1' || id === 'R-1.1') return 1;
  if (modulo === 'acesso' || modulo === 'config') return 2;
  if (['firmas', 'selos', 'livros', 'certidoes', 'centrais'].includes(modulo)) return 3;
  if (modulo === 'caixa') return 4;
  if (modulo === 'notas') return 5;
  return null;
}

function readAuditedFolderEntry(mod: string, folder: string, folderPath: string): AuditedFolderInfo | null {
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) return null;
  const revFile = fs.readdirSync(folderPath).find(f => f.endsWith('-revisado.md'));
  if (!revFile) return null;

  try {
    const revPath = path.join(folderPath, revFile);
    const content = fs.readFileSync(revPath, 'utf8').replace(/\r\n/g, '\n');
    const parts = content.split(/^---$/m);
    if (parts.length < 3) return null;
    const fm = yaml.parse(parts[1].trim());
    const id = fm?.id;
    if (!id) return null;
    const mtime = fs.statSync(revPath).mtimeMs;
    return {
      dirPath: folderPath,
      slug: folder,
      modulo: mod,
      isFlaggedBlocked: !!statusFromPrefix(folder) || LEGACY_PREFIX_RE.test(folder),
      revisadoMdFile: revFile,
      revisadoMdContent: content,
      frontmatter: fm,
      mtime,
    };
  } catch (err) {
    console.error(`Erro ao ler ${folder}:`, err);
    return null;
  }
}

function scanAuditedFolders(): Map<string, AuditedFolderInfo> {
  const map = new Map<string, AuditedFolderInfo>();
  if (!fs.existsSync(rotinasDir)) return map;

  for (const mod of fs.readdirSync(rotinasDir)) {
    const modDir = path.join(rotinasDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    for (const folder of fs.readdirSync(modDir)) {
      const folderPath = path.join(modDir, folder);
      const info = readAuditedFolderEntry(mod, folder, folderPath);
      if (!info) continue;
      const id = String(info.frontmatter.id);
      const existing = map.get(id);
      if (!existing || info.mtime > existing.mtime) {
        map.set(id, info);
      }
    }
  }
  return map;
}

function findAuditedFolderById(routineId: string): AuditedFolderInfo | null {
  if (!fs.existsSync(rotinasDir)) return null;
  let best: AuditedFolderInfo | null = null;

  for (const mod of fs.readdirSync(rotinasDir)) {
    const modDir = path.join(rotinasDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    for (const folder of fs.readdirSync(modDir)) {
      const bare = stripReviewPrefix(folder);
      if (!bare.startsWith(`${routineId}-`) && bare !== routineId) continue;
      const info = readAuditedFolderEntry(mod, folder, path.join(modDir, folder));
      if (!info || String(info.frontmatter?.id) !== routineId) continue;
      if (!best || info.mtime > best.mtime) {
        best = info;
      }
    }
  }
  return best;
}

function scanKbFiles(): Map<string, KbFileInfo> {
  const map = new Map<string, KbFileInfo>();
  if (!fs.existsSync(kbDir)) return map;

  for (const mod of fs.readdirSync(kbDir)) {
    const modDir = path.join(kbDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    const files = fs.readdirSync(modDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    for (const file of files) {
      const filePath = path.join(modDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
        const idMatch = content.match(/^id:\s*([^\r\n]+)/m);
        if (idMatch) {
          const id = idMatch[1].trim();
          map.set(id, { filePath, modulo: mod, slug: file.replace(/\.md$/, '') });
        }
      } catch (err) {
        console.error(`Erro ao ler kb ${file}:`, err);
      }
    }
  }
  return map;
}

function findKbFileById(routineId: string): KbFileInfo | null {
  if (!fs.existsSync(kbDir)) return null;

  for (const mod of fs.readdirSync(kbDir)) {
    const modDir = path.join(kbDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    const files = fs.readdirSync(modDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    for (const file of files) {
      if (!file.startsWith(`${routineId}-`) && file !== `${routineId}.md`) continue;
      const filePath = path.join(modDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
        const idMatch = content.match(/^id:\s*([^\r\n]+)/m);
        if (idMatch && idMatch[1].trim() === routineId) {
          return { filePath, modulo: mod, slug: file.replace(/\.md$/, '') };
        }
      } catch {}
    }
  }
  return null;
}

function safeStorageKey(modulo: string, slug: string, filename: string): string {
  const cleanSlug = slug.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${modulo}/${cleanSlug}/${filename}`;
}

async function uploadScreenshots(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  auditedFolders: Map<string, AuditedFolderInfo>,
  opts: { onlyWebp?: boolean; quiet?: boolean } = {}
): Promise<{ publicUrlMap: Map<string, string>; uploadedCount: number }> {
  const publicUrlMap = new Map<string, string>(); // key: `${id}:${stepNum}:${frame}:${ext}` -> publicUrl
  const uploadTasks: Array<{
    id: string;
    stepNum: number;
    frame: string;
    ext: string;
    diskPath: string;
    objectPath: string;
    mime: string;
  }> = [];

  for (const [id, info] of auditedFolders.entries()) {
    const files = fs.readdirSync(info.dirPath);
    for (const f of files) {
      const m = f.match(/^passo-(\d+)(?:-([a-z]))?\.(png|webp)$/i);
      if (!m) continue;
      const ext = m[3].toLowerCase();
      if (opts.onlyWebp && ext !== 'webp') continue;
      const stepNum = parseInt(m[1], 10);
      const frame = (m[2] || 'a').toLowerCase();
      const objectPath = safeStorageKey(info.modulo, info.slug, f);
      uploadTasks.push({
        id,
        stepNum,
        frame,
        ext,
        diskPath: path.join(info.dirPath, f),
        objectPath,
        mime: ext === 'webp' ? 'image/webp' : 'image/png',
      });
    }
  }

  if (!opts.quiet) {
    console.log(`   -> ${uploadTasks.length} arquivos de imagem (${opts.onlyWebp ? '.webp' : '.png/.webp'}) para sincronizar no Storage...`);
  }
  const CONCURRENCY = 8;
  let uploaded = 0;

  for (let i = 0; i < uploadTasks.length; i += CONCURRENCY) {
    const batch = uploadTasks.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async task => {
        const buffer = await fs.promises.readFile(task.diskPath);
        const { error } = await supabase.storage
          .from(SUPABASE_STORAGE_BUCKET)
          .upload(task.objectPath, buffer, {
            contentType: task.mime,
            upsert: true,
          });
        if (error) {
          console.warn(`   ⚠ Falha upload ${task.objectPath}: ${error.message}`);
          return;
        }
        const { data } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(task.objectPath);
        publicUrlMap.set(`${task.id}:${task.stepNum}:${task.frame}:${task.ext}`, data.publicUrl);
        uploaded++;
      })
    );
  }
  if (!opts.quiet) {
    console.log(`   ✓ ${uploaded}/${uploadTasks.length} screenshots sincronizadas no bucket '${SUPABASE_STORAGE_BUCKET}'.`);
  }
  return { publicUrlMap, uploadedCount: uploaded };
}

/**
 * Extrai os passos numerados exclusivamente da seção `#### Passo a passo...`, evitando
 * capturar os números de `#### Roteiro Técnico para Execução Manual:`.
 */
function extractRevisedStepsMap(revMdContent: string): Map<number, string> {
  const revStepTexts = new Map<number, string>();
  if (!revMdContent) return revStepTexts;

  const stepsSectionMatch = revMdContent.match(
    /#### Passo a passo[^\n]*:\s*\n([\s\S]*?)(?=\n#### |\n---\s*\n|$)/
  );
  const sectionText = stepsSectionMatch ? stepsSectionMatch[1] : '';
  for (const m of sectionText.matchAll(/^\s*(\d+)\.\s*(.+)$/gm)) {
    revStepTexts.set(parseInt(m[1], 10), m[2].trim());
  }
  return revStepTexts;
}

function extractRevisedDescription(revMdContent: string, fallback: string): string {
  if (!revMdContent) return fallback;
  const descMatch = revMdContent.match(
    /#### Descrição:\s*\n([\s\S]*?)(?=\n#### |\n\*\s+\*\*|\n---\s*\n|$)/
  );
  if (!descMatch) return fallback;
  // Report.ts pode anexar blocos `> [!NOTE]` de confronto semântico ao final da descrição
  const clean = descMatch[1].split(/\n\n> \[!(?:NOTE|TIP|WARNING|CAUTION)\]/)[0].trim();
  return clean || fallback;
}

function loadLocalGovernance(): any {
  if (fs.existsSync(governancePath)) {
    try {
      return JSON.parse(fs.readFileSync(governancePath, 'utf8'));
    } catch {}
  }
  return { approvals: {}, reviews: {}, history: {}, runnerJobs: {} };
}

async function buildRoutineRecords(params: {
  id: string;
  kbInfo: KbFileInfo;
  auditedInfo?: AuditedFolderInfo;
  telSteps: PrintTelemetry[];
  mediaUrls: Map<string, string>;
  localGov: any;
  existingGovStatus?: string | null;
  existingStepMediaByNumber?: Map<number, any>;
  skipMedia?: boolean;
  onlyWebp?: boolean;
  statusGovernancaOverride?: 'pendente_aprovacao' | 'aprovada' | 'revisao_solicitada';
  includeInitEvent?: boolean;
}) {
  const {
    id,
    kbInfo,
    auditedInfo,
    telSteps,
    mediaUrls,
    localGov,
    existingGovStatus,
    existingStepMediaByNumber,
    skipMedia,
    onlyWebp,
    statusGovernancaOverride,
    includeInitEvent = true,
  } = params;

  const rawKbContent = fs.readFileSync(kbInfo.filePath, 'utf8').replace(/\r\n/g, '\n');
  let parsedKb: any = null;
  try {
    parsedKb = parseRoutineMarkdown(kbInfo.filePath);
  } catch {}

  const modulo = auditedInfo?.modulo || kbInfo.modulo || 'geral';
  const secao = auditedInfo?.frontmatter?.secao || parsedKb?.secao || id[0] || 'R';
  const titulo = auditedInfo?.frontmatter?.titulo || parsedKb?.titulo || id;
  const fase = getPhaseForRoutine(id, modulo);
  const temVideo = Boolean(parsedKb?.tem_video);
  let workloadType: WorkloadType = parsedKb ? classifyRoutineWorkload(parsedKb) : 'read_only';

  let statusAuditoria = 'nao_auditada';
  let pastaAuditoria: string | null = null;
  let printsGeradas = 0;
  let divergenciasCount = 0;
  let menorConfianca: number | null = null;
  let dataExecucao: string | null = null;
  let workerId: string | null = null;
  let auditoriaUi: any = null;

  if (auditedInfo) {
    pastaAuditoria = auditedInfo.slug;
    auditoriaUi = auditedInfo.frontmatter?.auditoria_ui || null;
    const rawSt = auditoriaUi?.status || 'validado_inalterado';
    if (rawSt === 'validado_com_sucesso') {
      statusAuditoria = 'validado_inalterado';
    } else if (rawSt === 'requer_revisao_humana') {
      // Legado pré-ADR-021: a tag vem do prefixo da pasta; sem ela, `[ATT]` (revisão editorial) é o padrão
      statusAuditoria = statusFromPrefix(auditedInfo.slug) ?? 'atualizacao_editorial';
    } else {
      statusAuditoria = rawSt;
    }
    printsGeradas = auditoriaUi?.prints_geradas ?? 0;
    if (auditoriaUi?.data_execucao) {
      dataExecucao = new Date(auditoriaUi.data_execucao).toISOString();
    }
    workerId = auditoriaUi?.worker_id || null;
    if (auditoriaUi?.carga) workloadType = auditoriaUi.carga;

    const divs = auditoriaUi?.auto_cura?.divergencias_detectadas;
    if (Array.isArray(divs) && divs.length > 0) {
      divergenciasCount = divs.length;
      menorConfianca = Math.min(...divs.map((d: any) => d.confianca || 1));
    }
  }

  const govApproval = localGov.approvals?.[id];
  const govReview = localGov.reviews?.[id];
  let statusGovernanca =
    statusGovernancaOverride ??
    existingGovStatus ??
    (govApproval ? 'aprovada' : govReview ? 'revisao_solicitada' : 'pendente_aprovacao');

  if (!['pendente_aprovacao', 'aprovada', 'revisao_solicitada'].includes(statusGovernanca)) {
    statusGovernanca = 'pendente_aprovacao';
  }

  const framesByStep = new Map<number, PrintTelemetry[]>();
  for (const t of telSteps) {
    if (!framesByStep.has(t.stepNum)) framesByStep.set(t.stepNum, []);
    framesByStep.get(t.stepNum)!.push(t);
  }
  for (const frames of framesByStep.values()) {
    frames.sort((x, y) => (x.frame || 'a').charCodeAt(0) - (y.frame || 'a').charCodeAt(0));
  }

  const rotasHash = Array.from(
    new Set(
      telSteps
        .map(t => {
          const u = t.domGeometry?.url;
          if (u && u.includes('#/')) return `#/${u.split('#/')[1]}`;
          return null;
        })
        .filter(Boolean) as string[]
    )
  );

  const revMdContent = auditedInfo?.revisadoMdContent || '';
  const revStepTexts = extractRevisedStepsMap(revMdContent);
  const descricaoOriginal = parsedKb?.descricao || '';
  const descricaoRevisada = extractRevisedDescription(revMdContent, descricaoOriginal);

  const stepsCount = Math.max(parsedKb?.steps?.length || 0, printsGeradas, telSteps.length);

  // ADR-024: lista completa de tags (ordem canônica) e passos externos ao Orion TN, lidos do relatório
  const tagsRevisao: string[] = !auditedInfo
    ? []
    : normalizeReviewTags([
        ...(Array.isArray(auditoriaUi?.review_tags) ? auditoriaUi.review_tags : []),
        ...tagsFromPrefix(auditedInfo.slug),
        ...reviewTagsFromMd(revMdContent),
        ...(isReviewStatus(statusAuditoria) ? reviewTagsFor(statusAuditoria) : []),
      ]);
  const externalByStep = new Map<number, string>();
  if (Array.isArray(auditoriaUi?.etapas_externas)) {
    for (const entry of auditoriaUi.etapas_externas) {
      const n = Number(entry?.passo);
      if (Number.isFinite(n) && entry?.portal) externalByStep.set(n, String(entry.portal));
    }
  }
  for (const ext of externalStepsFromMd(revMdContent)) {
    if (!externalByStep.has(ext.stepNumber)) externalByStep.set(ext.stepNumber, ext.portal);
  }

  let bloqueio: any = null;
  if (statusAuditoria === 'comunicacao_externa') {
    // `[CCC]` sozinha: nenhuma etapa do Orion TN bloqueou; só há etapas em portal externo a validar por humano
    const summary = revMdContent.match(/ROTINA COM ETAPAS EM AMBIENTE EXTERNO[^\n]*\n>\s*(.+)/)?.[1]?.trim();
    bloqueio = {
      tipo: auditoriaUi?.tipo_bloqueio || EXTERNAL_PORTAL_BLOCK_TYPE,
      motivo: summary || 'Parte do passo a passo ocorre em portal externo ao Orion TN e não foi executada pelo agente.',
      roteiroManual: Array.from(externalByStep.entries()).map(
        ([n, portal]) => `Validar manualmente, no ambiente externo (${portal}), o passo ${n} do manual.`
      )
    };
  } else if (isReviewStatus(statusAuditoria)) {
    const tipo = auditoriaUi?.tipo_bloqueio || 'Revisão Técnica Necessária';
    let motivo = 'Esta rotina atua fora do escopo do navegador Chromium ou exige acesso a hardware/rede.';
    const cautionMatch = revMdContent.match(/> \*\*Motivo Técnico:\*\*\s*(.+)/);
    if (cautionMatch) motivo = cautionMatch[1].trim();
    const roteiroManual: string[] = [];
    const rotMatch = revMdContent.match(
      /#### Roteiro Técnico para Execução Manual:\s*\n([\s\S]*?)(?=\n\*|\n####|\n---|$)/
    );
    if (rotMatch) {
      for (const rl of rotMatch[1].trim().split('\n')) {
        const m = rl.match(/^\d+\.\s*(.+)$/);
        if (m) roteiroManual.push(m[1].trim());
      }
    }
    if (roteiroManual.length === 0) {
      roteiroManual.push('Inspecionar logs e portas no servidor.');
      roteiroManual.push('Validar funcionamento no balcão de homologação.');
    }
    bloqueio = { tipo, motivo, roteiroManual };
  }

  const origFmParts = rawKbContent.split(/^---$/m);
  const frontmatterOriginalYaml = origFmParts.length >= 2 ? origFmParts[1].trim() : '';
  const revFmParts = revMdContent.split(/^---$/m);
  const frontmatterRevisadoYaml = revFmParts.length >= 2 ? revFmParts[1].trim() : frontmatterOriginalYaml;

  const nowIso = new Date().toISOString();
  const routineRow = {
    id,
    titulo,
    modulo,
    secao,
    fase,
    tem_video: temVideo,
    workload_type: workloadType,
    status_auditoria: statusAuditoria,
    tags_revisao: tagsRevisao,
    status_governanca: statusGovernanca,
    pasta_auditoria: pastaAuditoria,
    total_passos: stepsCount || 1,
    prints_geradas: printsGeradas,
    divergencias_count: divergenciasCount,
    menor_confianca: menorConfianca,
    rotas_hash: rotasHash,
    tags: parsedKb?.frontmatter?.tags || [],
    data_execucao: dataExecucao,
    worker_id: workerId,
    duration_seconds: auditedInfo ? 12 : null,
    thumbnail_url: parsedKb?.frontmatter?.video?.thumbnail_url || null,
    descricao_original: descricaoOriginal,
    descricao_revisada: descricaoRevisada,
    observacoes: parsedKb?.observacoes || [],
    frontmatter_original: parsedKb?.frontmatter || {},
    frontmatter_original_yaml: frontmatterOriginalYaml,
    frontmatter_revisado_yaml: frontmatterRevisadoYaml,
    auditoria_ui: auditoriaUi,
    markdown_original: rawKbContent,
    markdown_revisado: revMdContent || rawKbContent,
    bloqueio,
    updated_at: nowIso,
  };

  const stepRows: any[] = [];
  for (let s = 1; s <= (stepsCount || 0); s++) {
    const origStep: RoutineStep | undefined = parsedKb?.steps?.[s - 1];
    const stepFrames = framesByStep.get(s) || [];
    const telItem = stepFrames[0];
    const originalText = origStep?.rawText || telItem?.label || `Passo ${s}`;
    const validatedText = revStepTexts.get(s) || origStep?.rawText || telItem?.label || `Passo ${s}`;
    const isModified = validatedText !== originalText;

    let media: any = null;

    const mediaFor = (pngName: string, frame: string) => {
      if (!auditedInfo) return null;
      const webpName = pngName.replace(/\.png$/i, '.webp');
      const pngDisk = path.join(auditedInfo.dirPath, pngName);
      const webpDisk = path.join(auditedInfo.dirPath, webpName);
      const pngOk = fs.existsSync(pngDisk);
      const webpOk = fs.existsSync(webpDisk);
      if (!pngOk && !webpOk) return null;

      const uploadedWebpUrl = mediaUrls.get(`${id}:${s}:${frame}:webp`);
      const uploadedPngUrl = mediaUrls.get(`${id}:${s}:${frame}:png`);

      const defaultStorageUrl = (name: string) =>
        `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${safeStorageKey(
          auditedInfo.modulo,
          auditedInfo.slug,
          name
        )}`;

      const webpUrl = webpOk ? uploadedWebpUrl || defaultStorageUrl(webpName) : undefined;
      // Em write-through (.webp-only) ou em clone sem .png, pngUrl aponta para webpUrl para evitar 404/stale
      const pngUrl = onlyWebp
        ? webpUrl || (pngOk ? defaultStorageUrl(pngName) : '')
        : pngOk
          ? uploadedPngUrl || defaultStorageUrl(pngName)
          : webpUrl || '';

      if (!pngUrl && !webpUrl) return null;
      return {
        pngUrl: pngUrl || webpUrl,
        webpUrl,
        width: 1440,
        height: 900,
        pngBytes: pngOk ? fs.statSync(pngDisk).size : undefined,
        webpBytes: webpOk ? fs.statSync(webpDisk).size : undefined,
      };
    };

    const existingStepMedia = existingStepMediaByNumber?.get(s) ?? null;
    if (skipMedia && existingStepMedia) {
      media = { ...existingStepMedia };
    } else if (auditedInfo) {
      const pad = String(s).padStart(2, '0');
      media = mediaFor(`passo-${pad}.png`, 'a');
    }

    const domGeometry: DOMResolvedGeometry | undefined = telItem?.domGeometry ?? undefined;
    const auditCtx = (previous?: PrintTelemetry) => ({
      mdContent: revMdContent,
      dirSlug: auditedInfo?.slug || '',
      previousFrame: previous,
    });
    const mainAudit =
      telItem && statusAuditoria !== 'nao_auditada' ? await auditPrint(telItem, auditCtx()).catch(() => null) : null;
    const layoutResult: AnnotationLayoutResult | undefined = mainAudit?.layout;

    let divergence: any = null;
    const divs = auditoriaUi?.auto_cura?.divergencias_detectadas;
    if (Array.isArray(divs)) {
      const matched = divs.find((d: any) => d.passo === s);
      if (matched) {
        divergence = {
          stepNumber: s,
          documentedTarget: matched.alvo_documentado,
          actualElementText: matched.elemento_real,
          resolutionLayer: matched.camada,
          confidence: matched.confianca,
          reason: 'Identificado via auto-cura do SmartLocator',
          detectedAt: dataExecucao || nowIso,
        };
      }
    }

    // ADR-024: passo em portal externo não tem print por desenho: nunca é "blocked" por falta de mídia
    const externalPortal = externalByStep.get(s);
    let stepStatus = 'nao_executado';
    if (statusAuditoria !== 'nao_auditada') {
      if (externalPortal !== undefined) {
        stepStatus = 'ok';
      } else if (telItem?.status === 'blocked' || (isBlockingReviewStatus(statusAuditoria) && !media)) {
        stepStatus = 'blocked';
      } else if (divergence || isModified) {
        stepStatus = 'modified';
      } else {
        stepStatus = 'ok';
      }
    }

    const invariantes = mainAudit
      ? mainAudit.invariants.map(i => ({
          id: i.id,
          nome: i.nome,
          aprovado: i.aprovado,
          aplicavel: i.aplicavel,
          detalhe: i.detalhe,
        }))
      : null;

    // Sub-capturas (`passo-NN-b`...): mídia, geometria, demarcações e os 8 invariantes de cada uma (ADR-018)
    if (media && stepFrames.length > 1 && !(skipMedia && existingStepMedia?.subCapturas)) {
      const subCapturas: any[] = [];
      for (let i = 1; i < stepFrames.length; i++) {
        const f = stepFrames[i];
        const subMedia = mediaFor(printNameOf(f), f.frame || 'b');
        if (!subMedia) continue;
        const subAudit = await auditPrint(f, auditCtx(stepFrames[i - 1])).catch(() => null);
        subCapturas.push({
          frame: f.frame,
          printName: printNameOf(f),
          kind: f.captureKind,
          media: subMedia,
          domGeometry: f.domGeometry ?? undefined,
          layoutResult: subAudit?.layout,
          callouts: f.callouts,
          revealTrigger: f.revealTrigger,
          invariantes: subAudit?.invariants.map(x => ({
            id: x.id,
            nome: x.nome,
            aprovado: x.aprovado,
            aplicavel: x.aplicavel,
            detalhe: x.detalhe,
          })),
        });
      }
      if (subCapturas.length > 0) media = { ...media, subCapturas };
    }

    stepRows.push({
      routine_id: id,
      step_number: s,
      action_type: origStep?.actionType || telItem?.actionType || 'click',
      zone_policy: origStep?.zone || telItem?.zonePolicy || 'any',
      targets: origStep?.targets || (divergence ? [divergence.actualElementText] : []),
      sub_items: origStep?.subItems || [],
      original_text: originalText,
      validated_text: validatedText,
      is_modified: isModified,
      status: stepStatus,
      step_scope: externalPortal !== undefined ? 'external_portal' : 'orion_tn',
      portal_externo: externalPortal ?? null,
      media,
      dom_geometry: domGeometry || null,
      layout_result: layoutResult || null,
      divergence,
      executed_action: telItem?.executedAction || null,
      invariantes,
      error_message: telItem?.errorMessage || null,
      updated_at: nowIso,
    });
  }

  const eventRows: any[] = [];
  if (includeInitEvent && dataExecucao) {
    eventRows.push({
      id: `ev-init-${id}`,
      routine_id: id,
      tipo: 'auditoria_executada',
      autor: workerId || 'runner',
      em: dataExecucao,
      descricao: `Auditoria executada via Worker Pool (${printsGeradas} prints geradas).`,
      meta: null,
    });
  }
  for (const ev of localGov.history?.[id] || []) {
    eventRows.push({
      id: ev.id,
      routine_id: id,
      tipo: ev.tipo,
      autor: ev.autor,
      em: ev.em,
      descricao: ev.descricao,
      meta: ev.meta || null,
    });
  }

  return { routineRow, stepRows, eventRows, statusAuditoria, stepsCount };
}

/**
 * Sincronização em tempo real (Write-Through) de uma única rotina com o Supabase (ADR-022/023).
 * Envia apenas os artefatos (`.webp` + rotina + passos + divergências) da rotina informada.
 */
export async function syncSingleRoutineToSupabase(
  routineId: string,
  options: SyncSingleRoutineOptions = {}
): Promise<SyncSingleRoutineResult> {
  if (!isSupabaseConfigured()) {
    if (!options.quiet) {
      console.warn(`⚠ [Supabase Write-Through] Ignorando sync de ${routineId}: SUPABASE_URL/SUPABASE_SECRET_KEY não configurados.`);
    }
    return { ok: false, skipped: true, reason: 'supabase_not_configured', routineId };
  }

  const kbInfo = findKbFileById(routineId);
  if (!kbInfo) {
    return { ok: false, skipped: true, reason: `rotina_nao_encontrada_no_kb:${routineId}`, routineId };
  }

  const supabase = getSupabaseAdmin();
  const auditedInfo = findAuditedFolderById(routineId) || undefined;
  const onlyWebp = options.onlyWebp !== false;
  const skipMedia = Boolean(options.skipMedia);
  const preserveGov = options.preserveExistingGovernance !== false;

  // Telemetria apenas desta rotina
  let telSteps: PrintTelemetry[] = [];
  const kbTelFile = path.join(kbTelemetryDir, `${routineId}.json`);
  if (fs.existsSync(kbTelFile)) {
    try {
      const entries = JSON.parse(await fs.promises.readFile(kbTelFile, 'utf8')) as PrintTelemetry[];
      telSteps = entries.map(t => ({ ...t, source: 'kb' as const }));
    } catch {}
  } else if (fs.existsSync(telemetryPath)) {
    try {
      const manifest = JSON.parse(await fs.promises.readFile(telemetryPath, 'utf8')) as PrintTelemetry[];
      telSteps = manifest
        .filter(t => t.routineId === routineId)
        .map(t => ({ ...t, source: 'manifesto' as const }));
    } catch {}
  }

  let mediaUrls = new Map<string, string>();
  let uploadedMedia = 0;
  if (!skipMedia && auditedInfo) {
    const map = new Map<string, AuditedFolderInfo>([[routineId, auditedInfo]]);
    const res = await uploadScreenshots(supabase, map, { onlyWebp, quiet: true });
    mediaUrls = res.publicUrlMap;
    uploadedMedia = res.uploadedCount;
  }

  let existingGovStatus: string | null = null;
  let existingStepMediaByNumber: Map<number, any> | undefined;

  if (preserveGov || skipMedia || !options.statusGovernancaOverride) {
    const [{ data: existingRow }, { data: existingSteps }, { data: openReviews }] = await Promise.all([
      preserveGov
        ? supabase.from('routines').select('status_governanca').eq('id', routineId).maybeSingle()
        : Promise.resolve({ data: null }),
      skipMedia
        ? supabase.from('routine_steps').select('step_number, media').eq('routine_id', routineId)
        : Promise.resolve({ data: null }),
      !options.statusGovernancaOverride
        ? supabase
            .from('routine_reviews')
            .select('id')
            .eq('routine_id', routineId)
            .in('status', ['aberta', 'em_andamento'])
            .limit(1)
        : Promise.resolve({ data: null }),
    ]);
    if (existingRow?.status_governanca) {
      existingGovStatus = existingRow.status_governanca;
    }
    if (Array.isArray(openReviews) && openReviews.length > 0) {
      existingGovStatus = 'revisao_solicitada';
    }
    if (Array.isArray(existingSteps) && existingSteps.length > 0) {
      existingStepMediaByNumber = new Map<number, any>();
      for (const st of existingSteps) {
        if (st.media) existingStepMediaByNumber.set(st.step_number, st.media);
      }
    }
  }

  const localGov = loadLocalGovernance();
  const { routineRow, stepRows, eventRows, statusAuditoria, stepsCount } = await buildRoutineRecords({
    id: routineId,
    kbInfo,
    auditedInfo,
    telSteps,
    mediaUrls,
    localGov,
    existingGovStatus,
    existingStepMediaByNumber,
    skipMedia,
    onlyWebp,
    statusGovernancaOverride: options.statusGovernancaOverride,
    includeInitEvent: !options.skipMedia,
  });

  const { error: rErr } = await supabase.from('routines').upsert([routineRow], { onConflict: 'id' });
  if (rErr) throw new Error(`Erro upsert rotina ${routineId}: ${rErr.message}`);

  if (stepRows.length > 0) {
    const { error: sErr } = await supabase
      .from('routine_steps')
      .upsert(stepRows, { onConflict: 'routine_id,step_number' });
    if (sErr) throw new Error(`Erro upsert passos ${routineId}: ${sErr.message}`);
  }
  await supabase.from('routine_steps').delete().eq('routine_id', routineId).gt('step_number', stepsCount || 1);

  if (eventRows.length > 0) {
    const { error: eErr } = await supabase
      .from('governance_events')
      .upsert(eventRows, { onConflict: 'id' });
    if (eErr) throw new Error(`Erro upsert eventos ${routineId}: ${eErr.message}`);
  }

  if (!options.quiet) {
    console.log(
      `✓ [Supabase Write-Through] ${routineId} sincronizada (${statusAuditoria} | ${stepRows.length} passos | ${uploadedMedia} .webp)`
    );
  }
  return { ok: true, routineId, statusAuditoria, stepsCount: stepRows.length, uploadedMedia };
}

async function main() {
  console.log('====================================================');
  console.log('  ORION AUDIT CONSOLE — SYNC PARA SUPABASE          ');
  console.log('====================================================\n');

  const supabase = getSupabaseAdmin();
  const skipMedia = process.argv.includes('--skip-media');
  const onlyWebp = process.argv.includes('--only-webp');

  const kbFiles = scanKbFiles();
  const auditedFolders = scanAuditedFolders();

  const telemetryByRoutine = new Map<string, PrintTelemetry[]>();
  const loadedTelemetry = await loadPrintTelemetry(telemetryPath, kbTelemetryDir);
  for (const item of loadedTelemetry.items) {
    if (!telemetryByRoutine.has(item.routineId)) telemetryByRoutine.set(item.routineId, []);
    telemetryByRoutine.get(item.routineId)!.push(item);
  }

  const localGov = loadLocalGovernance();

  // Preservar aprovações/revisões já registradas no Supabase pelo Console
  const { data: existingGovRows } = await supabase
    .from('routines')
    .select('id, status_governanca')
    .neq('status_governanca', 'pendente_aprovacao');
  const existingGovMap = new Map<string, string>();
  for (const row of existingGovRows || []) {
    existingGovMap.set(row.id, row.status_governanca);
  }

  console.log(`1. Descoberta local: ${kbFiles.size} rotinas KB | ${auditedFolders.size} rotinas auditadas`);

  let mediaUrls = new Map<string, string>();
  if (!skipMedia) {
    console.log('\n2. Sincronizando screenshots com Supabase Storage...');
    const res = await uploadScreenshots(supabase, auditedFolders, { onlyWebp });
    mediaUrls = res.publicUrlMap;
  } else {
    console.log('\n2. Pulando upload de mídia (--skip-media).');
  }

  console.log('\n3. Montando registros de rotinas, passos e eventos...');
  const routineRows: any[] = [];
  const stepRows: any[] = [];
  const eventRows: any[] = [];

  for (const [id, kbInfo] of kbFiles.entries()) {
    const built = await buildRoutineRecords({
      id,
      kbInfo,
      auditedInfo: auditedFolders.get(id),
      telSteps: telemetryByRoutine.get(id) || [],
      mediaUrls,
      localGov,
      existingGovStatus: existingGovMap.get(id) ?? null,
      skipMedia,
      onlyWebp,
      includeInitEvent: true,
    });
    routineRows.push(built.routineRow);
    stepRows.push(...built.stepRows);
    eventRows.push(...built.eventRows);
  }

  console.log(`\n4. Enviando lotes para o PostgreSQL Supabase...`);
  const BATCH = 50;

  for (let i = 0; i < routineRows.length; i += BATCH) {
    const { error } = await supabase
      .from('routines')
      .upsert(routineRows.slice(i, i + BATCH), { onConflict: 'id' });
    if (error) throw new Error(`Erro upsert routines lote ${i}: ${error.message}`);
  }
  console.log(`   ✓ ${routineRows.length} rotinas sincronizadas na tabela 'routines'.`);

  for (let i = 0; i < stepRows.length; i += BATCH) {
    const { error } = await supabase
      .from('routine_steps')
      .upsert(stepRows.slice(i, i + BATCH), { onConflict: 'routine_id,step_number' });
    if (error) throw new Error(`Erro upsert routine_steps lote ${i}: ${error.message}`);
  }
  console.log(`   ✓ ${stepRows.length} passos sincronizados na tabela 'routine_steps'.`);

  if (eventRows.length > 0) {
    for (let i = 0; i < eventRows.length; i += BATCH) {
      const { error } = await supabase
        .from('governance_events')
        .upsert(eventRows.slice(i, i + BATCH), { onConflict: 'id' });
      if (error) throw new Error(`Erro upsert governance_events lote ${i}: ${error.message}`);
    }
    console.log(`   ✓ ${eventRows.length} eventos sincronizados na tabela 'governance_events'.`);
  }

  console.log('\n✓ Sincronização completa com o Supabase finalizada!');
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();

if (isDirectRun) {
  main().catch(err => {
    console.error('✕ Erro na sincronização Supabase:', err);
    process.exit(1);
  });
}
