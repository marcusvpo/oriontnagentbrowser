import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import { parseRoutineMarkdown } from './parser.js';
import { classifyRoutineWorkload } from './worker-pool.js';
import { auditPrint, loadPrintTelemetry, printNameOf, type PrintTelemetry } from './invariants.js';
import { getSupabaseAdmin, SUPABASE_STORAGE_BUCKET, SUPABASE_URL } from './supabase.js';
import { LEGACY_PREFIX_RE, isReviewStatus, statusFromPrefix } from './review-taxonomy.js';
import type {
  AnnotationLayoutResult,
  DOMResolvedGeometry,
  RoutineStep,
  WorkloadType,
} from './types.js';

const auditoriaRoot = path.resolve(
  process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria')
);
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

function getPhaseForRoutine(id: string, modulo: string): number | null {
  if (id === 'D-1.1' || id === 'R-1.1') return 1;
  if (modulo === 'acesso' || modulo === 'config') return 2;
  if (['firmas', 'selos', 'livros', 'certidoes', 'centrais'].includes(modulo)) return 3;
  if (modulo === 'caixa') return 4;
  if (modulo === 'notas') return 5;
  return null;
}

function scanAuditedFolders(): Map<string, AuditedFolderInfo> {
  const map = new Map<string, AuditedFolderInfo>();
  if (!fs.existsSync(rotinasDir)) return map;

  for (const mod of fs.readdirSync(rotinasDir)) {
    const modDir = path.join(rotinasDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    for (const folder of fs.readdirSync(modDir)) {
      const folderPath = path.join(modDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const revFile = fs.readdirSync(folderPath).find(f => f.endsWith('-revisado.md'));
      if (!revFile) continue;

      try {
        const revPath = path.join(folderPath, revFile);
        const content = fs.readFileSync(revPath, 'utf8').replace(/\r\n/g, '\n');
        const parts = content.split(/^---$/m);
        if (parts.length >= 3) {
          const fm = yaml.parse(parts[1].trim());
          const id = fm?.id;
          if (id) {
            const mtime = fs.statSync(revPath).mtimeMs;
            const existing = map.get(id);
            if (!existing || mtime > existing.mtime) {
              map.set(id, {
                dirPath: folderPath,
                slug: folder,
                modulo: mod,
                isFlaggedBlocked: !!statusFromPrefix(folder) || LEGACY_PREFIX_RE.test(folder),
                revisadoMdFile: revFile,
                revisadoMdContent: content,
                frontmatter: fm,
                mtime,
              });
            }
          }
        }
      } catch (err) {
        console.error(`Erro ao ler ${folder}:`, err);
      }
    }
  }
  return map;
}

function scanKbFiles(): Map<string, { filePath: string; modulo: string; slug: string }> {
  const map = new Map<string, { filePath: string; modulo: string; slug: string }>();
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

function safeStorageKey(modulo: string, slug: string, filename: string): string {
  const cleanSlug = slug.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${modulo}/${cleanSlug}/${filename}`;
}

async function uploadScreenshots(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  auditedFolders: Map<string, AuditedFolderInfo>
): Promise<Map<string, string>> {
  const publicUrlMap = new Map<string, string>(); // key: `${id}:${stepNum}:${frame}:${ext}` -> publicUrl
  const uploadTasks: Array<{ id: string; stepNum: number; frame: string; ext: string; diskPath: string; objectPath: string; mime: string }> = [];

  for (const [id, info] of auditedFolders.entries()) {
    const files = fs.readdirSync(info.dirPath);
    for (const f of files) {
      const m = f.match(/^passo-(\d+)(?:-([a-z]))?\.(png|webp)$/i);
      if (!m) continue;
      const stepNum = parseInt(m[1], 10);
      const frame = (m[2] || 'a').toLowerCase();
      const ext = m[3].toLowerCase();
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

  console.log(`   -> ${uploadTasks.length} arquivos de imagem (.png/.webp) para sincronizar no Storage...`);
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
  console.log(`   ✓ ${uploaded}/${uploadTasks.length} screenshots sincronizadas no bucket '${SUPABASE_STORAGE_BUCKET}'.`);
  return publicUrlMap;
}

async function main() {
  console.log('====================================================');
  console.log('  ORION AUDIT CONSOLE — SYNC PARA SUPABASE          ');
  console.log('====================================================\n');

  const supabase = getSupabaseAdmin();
  const skipMedia = process.argv.includes('--skip-media');

  const kbFiles = scanKbFiles();
  const auditedFolders = scanAuditedFolders();

  const telemetryByRoutine = new Map<string, PrintTelemetry[]>();
  const loadedTelemetry = await loadPrintTelemetry(telemetryPath, kbTelemetryDir);
  for (const item of loadedTelemetry.items) {
    if (!telemetryByRoutine.has(item.routineId)) telemetryByRoutine.set(item.routineId, []);
    telemetryByRoutine.get(item.routineId)!.push(item);
  }

  let localGov: any = { approvals: {}, reviews: {}, history: {}, runnerJobs: {} };
  if (fs.existsSync(governancePath)) {
    try {
      localGov = JSON.parse(fs.readFileSync(governancePath, 'utf8'));
    } catch {}
  }

  console.log(`1. Descoberta local: ${kbFiles.size} rotinas KB | ${auditedFolders.size} rotinas auditadas`);

  let mediaUrls = new Map<string, string>();
  if (!skipMedia) {
    console.log('\n2. Sincronizando screenshots com Supabase Storage...');
    mediaUrls = await uploadScreenshots(supabase, auditedFolders);
  } else {
    console.log('\n2. Pulando upload de mídia (--skip-media).');
  }

  console.log('\n3. Montando registros de rotinas, passos e eventos...');
  const routineRows: any[] = [];
  const stepRows: any[] = [];
  const eventRows: any[] = [];

  for (const [id, kbInfo] of kbFiles.entries()) {
    const auditedInfo = auditedFolders.get(id);
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
    const statusGovernanca = govApproval ? 'aprovada' : govReview ? 'revisao_solicitada' : 'pendente_aprovacao';

    const telSteps = telemetryByRoutine.get(id) || [];
    // Por passo: a print principal (frame `a`) e as sub-capturas (`b`, `c`...), em ordem
    const framesByStep = new Map<number, PrintTelemetry[]>();
    for (const t of telSteps) {
      if (!framesByStep.has(t.stepNum)) framesByStep.set(t.stepNum, []);
      framesByStep.get(t.stepNum)!.push(t);
    }
    for (const frames of framesByStep.values()) frames.sort((x, y) => (x.frame || 'a').charCodeAt(0) - (y.frame || 'a').charCodeAt(0));

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
    const revStepTexts = new Map<number, string>();
    for (const m of revMdContent.matchAll(/^\s*(\d+)\.\s*(.+)$/gm)) {
      revStepTexts.set(parseInt(m[1], 10), m[2].trim());
    }

    const stepsCount = Math.max(parsedKb?.steps?.length || 0, printsGeradas, telSteps.length);

    let bloqueio: any = null;
    if (isReviewStatus(statusAuditoria)) {
      const tipo = auditoriaUi?.tipo_bloqueio || 'Revisão Técnica Necessária';
      let motivo = 'Esta rotina atua fora do escopo do navegador Chromium ou exige acesso a hardware/rede.';
      const cautionMatch = revMdContent.match(/> \*\*Motivo Técnico:\*\*\s*(.+)/);
      if (cautionMatch) motivo = cautionMatch[1].trim();
      const roteiroManual: string[] = [];
      const rotMatch = revMdContent.match(/#### Roteiro Técnico para Execução Manual:\s*\n([\s\S]*?)(?=\n\*|\n---|$)/);
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
    routineRows.push({
      id,
      titulo,
      modulo,
      secao,
      fase,
      tem_video: temVideo,
      workload_type: workloadType,
      status_auditoria: statusAuditoria,
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
      descricao_original: parsedKb?.descricao || '',
      descricao_revisada: parsedKb?.descricao || '',
      observacoes: parsedKb?.observacoes || [],
      frontmatter_original: parsedKb?.frontmatter || {},
      frontmatter_original_yaml: frontmatterOriginalYaml,
      frontmatter_revisado_yaml: frontmatterRevisadoYaml,
      auditoria_ui: auditoriaUi,
      markdown_original: rawKbContent,
      markdown_revisado: revMdContent || rawKbContent,
      bloqueio,
      updated_at: govApproval?.aprovadoEm || govReview?.solicitadoEm || dataExecucao || nowIso,
    });

    for (let s = 1; s <= stepsCount; s++) {
      const origStep: RoutineStep | undefined = parsedKb?.steps?.[s - 1];
      const stepFrames = framesByStep.get(s) || [];
      const telItem = stepFrames[0];
      const originalText = origStep?.rawText || telItem?.label || `Passo ${s}`;
      const validatedText = revStepTexts.get(s) || origStep?.rawText || telItem?.label || `Passo ${s}`;
      const isModified = validatedText !== originalText;

      let media: any = null;
      let finalPngExists = false;
      let finalWebpExists = false;

      // Mídia de uma print (principal ou sub-captura) com as URLs do Storage
      const mediaFor = (pngName: string, frame: string) => {
        if (!auditedInfo) return null;
        const webpName = pngName.replace(/\.png$/i, '.webp');
        const pngDisk = path.join(auditedInfo.dirPath, pngName);
        const webpDisk = path.join(auditedInfo.dirPath, webpName);
        const pngOk = fs.existsSync(pngDisk);
        const webpOk = fs.existsSync(webpDisk);
        if (!pngOk && !webpOk) return null;
        const publicUrl = (name: string, ext: string) =>
          mediaUrls.get(`${id}:${s}:${frame}:${ext}`) ||
          `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${safeStorageKey(auditedInfo.modulo, auditedInfo.slug, name)}`;
        return {
          pngUrl: publicUrl(pngName, 'png'),
          webpUrl: webpOk ? publicUrl(webpName, 'webp') : undefined,
          width: 1440,
          height: 900,
          pngBytes: pngOk ? fs.statSync(pngDisk).size : undefined,
          webpBytes: webpOk ? fs.statSync(webpDisk).size : undefined,
        };
      };

      if (auditedInfo) {
        const pad = String(s).padStart(2, '0');
        const pngName = `passo-${pad}.png`;
        const webpName = `passo-${pad}.webp`;
        const pngDisk = path.join(auditedInfo.dirPath, pngName);
        const webpDisk = path.join(auditedInfo.dirPath, webpName);
        finalPngExists = fs.existsSync(pngDisk);
        finalWebpExists = fs.existsSync(webpDisk);

        if (finalPngExists || finalWebpExists) {
          const pngStorageUrl =
            mediaUrls.get(`${id}:${s}:a:png`) ||
            `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${safeStorageKey(
              auditedInfo.modulo,
              auditedInfo.slug,
              pngName
            )}`;
          const webpStorageUrl = finalWebpExists
            ? mediaUrls.get(`${id}:${s}:a:webp`) ||
              `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${safeStorageKey(
                auditedInfo.modulo,
                auditedInfo.slug,
                webpName
              )}`
            : undefined;

          media = {
            pngUrl: pngStorageUrl,
            webpUrl: webpStorageUrl,
            width: 1440,
            height: 900,
            pngBytes: finalPngExists ? fs.statSync(pngDisk).size : undefined,
            webpBytes: finalWebpExists ? fs.statSync(webpDisk).size : undefined,
          };
        }
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

      let stepStatus = 'nao_executado';
      if (statusAuditoria !== 'nao_auditada') {
        if (telItem?.status === 'blocked' || (isReviewStatus(statusAuditoria) && !media)) {
          stepStatus = 'blocked';
        } else if (divergence || isModified) {
          stepStatus = 'modified';
        } else {
          stepStatus = 'ok';
        }
      }

      const invariantes = mainAudit
        ? mainAudit.invariants.map(i => ({ id: i.id, nome: i.nome, aprovado: i.aprovado, aplicavel: i.aplicavel, detalhe: i.detalhe }))
        : null;

      // Sub-capturas (`passo-NN-b`...): mídia, geometria, demarcações e os 8 invariantes de cada uma (ADR-018)
      if (media && stepFrames.length > 1) {
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
            invariantes: subAudit?.invariants.map(x => ({ id: x.id, nome: x.nome, aprovado: x.aprovado, aplicavel: x.aplicavel, detalhe: x.detalhe })),
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
        media,
        dom_geometry: domGeometry || null,
        layout_result: layoutResult || null,
        divergence,
        executed_action: telItem?.executedAction || null,
        invariantes,
        error_message: telItem?.errorMessage || null,
      });
    }

    if (dataExecucao) {
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

main().catch(err => {
  console.error('✕ Erro na sincronização Supabase:', err);
  process.exit(1);
});
