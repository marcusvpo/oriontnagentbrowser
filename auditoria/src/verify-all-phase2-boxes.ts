import fs from 'node:fs';
import path from 'node:path';
import { auditExternalSteps, auditPrint, loadPrintTelemetry, printNameOf, reviewTagsFromMd, type PrintTelemetry } from './invariants.js';
import { PHASE3_MANIFEST } from './manifests/phase3-manifest.js';
import {
  ENVIRONMENT_BLOCK_TYPE,
  LEGACY_PREFIX_RE,
  REVIEW_PREFIX_RE,
  REVIEW_TAGS,
  isReviewStatus,
  reviewTagsPrefix,
  statusFromPrefix,
  stripReviewPrefix,
  tagsFromPrefix
} from './review-taxonomy.js';

interface PrintIssue {
  id: string;
  stepNum: number;
  print: string;
  rawScreenshotPath: string;
  box: unknown;
  label: string;
  issues: string[];
}

const frameOrder = (t: PrintTelemetry) => (t.frame || 'a').charCodeAt(0);

/**
 * Validador Determinístico de Integridade Geométrica e Estrutural (100% DOM Real ao Vivo).
 *
 * Audita os 8 invariantes (`invariants.ts`) em cada print das duas fontes de telemetria: o manifesto
 * da Fase 2 (`cache/phase2-live-telemetry.json`, opcional) e o executor do KB
 * (`cache/kb-telemetry/<id>.json`), incluindo as sub-capturas `passo-NN-b`.
 *
 * Para as rotinas do executor do KB há ainda a conferência inversa, do disco para a telemetria
 * (ADR-018): toda print em disco tem telemetria e marcador no relatório, todo marcador tem arquivo,
 * o total de prints do frontmatter confere e não existe pasta gêmea da mesma rotina.
 *
 * Bloqueios estruturados (`[ATT]`/`[DDD]`/`[XRX]`, ADR-021) e prints limpas não são discrepâncias
 * geométricas: são contados à parte e só passam pelo invariante 5. Uma varredura final garante que não
 * resta nenhuma pasta `[!!!]` e que cada prefixo coincide com o `status` do relatório.
 *
 * Uso: `tsx verify-all-phase2-boxes.ts [--only=ID1,ID2] [--source=kb|manifesto] [--phase 3 | --all]`
 * - `--all` (padrão): audita todo o acervo com telemetria.
 * - `--phase 3`: restringe às 118 rotinas do `phase3-manifest.ts` e confere a completude (pasta por rotina,
 *   sem gêmeas) e as 7 pré-triadas [DDD] de hardware/serviço local, que NÃO têm telemetria nem prints
 *   (`prints_geradas: 0`) e por isso ficam fora da conferência inversa disco -> telemetria.
 */
async function main() {
  console.log('================================================================');
  console.log('  AUDITORIA GEOMÉTRICA DETERMINÍSTICA — DOM REAL LIVE (8 INVARIANTES)  ');
  console.log('================================================================\n');

  const auditoriaRoot = path.resolve(
    process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria')
  );
  const telemetryPath = path.join(auditoriaRoot, 'cache', 'phase2-live-telemetry.json');
  const kbTelemetryDir = path.join(auditoriaRoot, 'cache', 'kb-telemetry');
  const rotinasDir = path.join(auditoriaRoot, 'rotinas');

  const onlyArg = process.argv.find(a => a.startsWith('--only='));
  const argvList = process.argv.slice(2);
  const phaseIdx = argvList.findIndex(a => a === '--phase' || a.startsWith('--phase='));
  const phaseRaw = phaseIdx === -1 ? null : argvList[phaseIdx].includes('=') ? argvList[phaseIdx].split('=')[1] : argvList[phaseIdx + 1];
  const phaseNum = phaseRaw ? parseInt(phaseRaw, 10) : null;
  if (phaseRaw !== null && phaseNum !== 3) {
    console.error('✕ --phase só é suportado para a Fase 3 (use --all ou --only= para as demais).');
    process.exit(1);
  }
  const phaseEntries = phaseNum === 3 && !argvList.includes('--all') ? PHASE3_MANIFEST : null;
  const explicitOnly = onlyArg ? onlyArg.slice('--only='.length).split(',').map(s => s.trim()).filter(Boolean) : null;
  const onlyIds = phaseEntries
    ? phaseEntries.map(e => e.id).filter(id => !explicitOnly || explicitOnly.includes(id))
    : explicitOnly;
  const preTriagedIds = new Set((phaseEntries || []).filter(e => e.hardwarePreTriage.isHardwareDependent).map(e => e.id));
  const sourceArg = process.argv.find(a => a.startsWith('--source='))?.slice('--source='.length);

  const loaded = await loadPrintTelemetry(telemetryPath, kbTelemetryDir);
  if (loaded.items.length === 0 && !phaseEntries) {
    console.error('✕ Nenhuma telemetria encontrada (manifesto da Fase 2 ou executor do KB).');
    console.error('  Execute primeiro: npx --prefix auditoria tsx auditoria/src/cli.ts --phase 2 --dry-run-mutations');
    process.exit(1);
  }
  if (loaded.supersededCount > 0) {
    console.log(
      `Rotinas do manifesto reauditadas pelo executor do KB (${loaded.supersededCount} entradas superadas): ${loaded.supersededIds.join(', ')}\n`
    );
  }
  const telemetry = loaded.items.filter(
    t => (!onlyIds || onlyIds.includes(t.routineId)) && (!sourceArg || t.source === sourceArg)
  );

  const issuesFound: PrintIssue[] = [];
  const counters = {
    geometry: 0,
    zeroOcclusion: 0,
    zoneScoped: 0,
    groupUnion: 0,
    multiPrints: 0,
    multiBoxes: 0,
    clean: 0,
    structuredBlocks: 0,
    privilegeBlocks: 0,
    unclassifiedBlocks: 0,
    artifactPairs: 0,
    subCaptures: 0,
    revealPrints: 0,
    dryRunSkips: 0
  };
  const blockKinds = new Map<string, number>();
  const mdCache = new Map<string, string>();
  const readMd = async (dir: string) => {
    if (!mdCache.has(dir)) {
      const mdPath = path.join(dir, `${path.basename(dir)}-revisado.md`);
      mdCache.set(dir, fs.existsSync(mdPath) ? await fs.promises.readFile(mdPath, 'utf8') : '');
    }
    return mdCache.get(dir)!;
  };

  // Agrupa por rotina e passo para conferir a continuidade da numeração entre print e sub-capturas
  const byStep = new Map<string, PrintTelemetry[]>();
  for (const t of telemetry) {
    const key = `${t.source}|${t.routineId}|${t.stepNum}`;
    if (!byStep.has(key)) byStep.set(key, []);
    byStep.get(key)!.push(t);
  }

  for (const frames of byStep.values()) {
    frames.sort((a, b) => frameOrder(a) - frameOrder(b));
    for (let i = 0; i < frames.length; i++) {
      const item = frames[i];
      const routineOutDir = path.dirname(item.finalPngPath);
      const audit = await auditPrint(item, {
        mdContent: await readMd(routineOutDir),
        dirSlug: path.basename(routineOutDir),
        previousFrame: i > 0 ? frames[i - 1] : undefined
      });

      if (audit.kind === 'geometry') {
        counters.geometry++;
        if (audit.zeroOcclusion) counters.zeroOcclusion++;
        if (audit.zoneScoped) counters.zoneScoped++;
        if (audit.groupUnion) counters.groupUnion++;
        if (audit.calloutBoxes > 0) {
          counters.multiPrints++;
          counters.multiBoxes += audit.calloutBoxes;
        }
      } else if (audit.kind === 'clean') {
        counters.clean++;
      } else if (audit.kind === 'structured-block') {
        counters.structuredBlocks++;
        if (item.blockKind === 'rbac') counters.privilegeBlocks++;
        blockKinds.set(item.blockKind!, (blockKinds.get(item.blockKind!) || 0) + 1);
      } else if (audit.kind === 'unclassified-block') {
        counters.unclassifiedBlocks++;
      }
      if (audit.artifactPair) counters.artifactPairs++;
      if (item.frame && item.frame !== 'a') counters.subCaptures++;
      if (item.captureKind === 'reveal') counters.revealPrints++;
      if (item.executedAction?.via === 'dry-run') counters.dryRunSkips++;

      if (audit.issues.length > 0) {
        issuesFound.push({
          id: `${item.routineId} (${item.source})`,
          stepNum: item.stepNum,
          print: audit.printName,
          rawScreenshotPath: item.rawScreenshotPath,
          box: item.domGeometry?.cssBox || null,
          label: item.label,
          issues: audit.issues.map(i => (i.invariant ? `[inv. ${i.invariant}] ${i.message}` : i.message))
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Conferência inversa das rotinas do executor do KB: do disco para a telemetria (ADR-018)
  // ---------------------------------------------------------------------------
  const kbByRoutine = new Map<string, PrintTelemetry[]>();
  for (const t of telemetry.filter(x => x.source === 'kb')) {
    if (!kbByRoutine.has(t.routineId)) kbByRoutine.set(t.routineId, []);
    kbByRoutine.get(t.routineId)!.push(t);
  }
  const folderIssue = (routineId: string, message: string, dir: string) =>
    issuesFound.push({ id: `${routineId} (kb)`, stepNum: 0, print: '(pasta da rotina)', rawScreenshotPath: dir, box: null, label: '', issues: [message] });

  for (const [routineId, items] of kbByRoutine) {
    const dir = path.dirname(items[0].finalPngPath);
    if (!fs.existsSync(dir)) {
      folderIssue(routineId, `Pasta da rotina ausente: ${dir}`, dir);
      continue;
    }
    const md = await readMd(dir);
    const known = new Set(items.map(printNameOf));
    const onDisk = (await fs.promises.readdir(dir)).filter(f => /^passo-\d+(-[a-z])?\.png$/i.test(f));
    for (const f of onDisk) {
      if (!known.has(f)) folderIssue(routineId, `Print em disco sem telemetria: ${f}`, dir);
    }
    const markers = Array.from(md.matchAll(/\[aqui vai a print "([^"]+)"\]/g)).map(m => m[1]);
    for (const m of markers) {
      if (!onDisk.includes(m)) folderIssue(routineId, `Marcador no relatório sem arquivo em disco: ${m}`, dir);
    }
    const declared = Number(md.match(/prints_geradas:\s*(\d+)/)?.[1] ?? NaN);
    if (declared !== items.length) {
      folderIssue(routineId, `prints_geradas no relatório (${declared}) difere da telemetria (${items.length})`, dir);
    }
    // Pasta gêmea: a mesma rotina auditada sob outro nome de pasta (ex.: slug antigo do manifesto)
    if (fs.existsSync(rotinasDir)) {
      for (const mod of await fs.promises.readdir(rotinasDir)) {
        const modDir = path.join(rotinasDir, mod);
        if (!(await fs.promises.stat(modDir)).isDirectory()) continue;
        for (const folder of await fs.promises.readdir(modDir)) {
          const twin = path.join(modDir, folder);
          // Windows: a letra do drive varia entre `d:` e `D:` conforme o cwd que gravou a telemetria
          const samePath = path.resolve(twin).toLowerCase() === path.resolve(dir).toLowerCase();
          if (samePath || !stripReviewPrefix(folder).startsWith(`${routineId}-`)) continue;
          folderIssue(routineId, `Pasta gêmea da mesma rotina em disco: ${path.join(mod, folder)}`, dir);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Varredura da taxonomia (ADR-021): nenhuma pasta `[!!!]` pode restar e todo prefixo [ATT]/[DDD]/[XRX]
  // precisa coincidir com o `status` do `-revisado.md`, inclusive nas rotinas sem telemetria (revisão humana
  // gerada por `generate-human-review-routines.ts`).
  // ---------------------------------------------------------------------------
  // ADR-024: uma rotina pode ter várias tags (`[ATT][CCC]`); cada tag da pasta conta uma vez
  const tagCounts: Record<string, number> = { ATT: 0, CCC: 0, DDD: 0, XRX: 0 };
  let multiTagFolders = 0;
  let externalStepsTotal = 0;
  let externalRoutines = 0;
  let legacyFolders = 0;
  if (fs.existsSync(rotinasDir)) {
    for (const mod of await fs.promises.readdir(rotinasDir)) {
      const modDir = path.join(rotinasDir, mod);
      if (!(await fs.promises.stat(modDir)).isDirectory()) continue;
      for (const folder of await fs.promises.readdir(modDir)) {
        const dir = path.join(modDir, folder);
        if (!(await fs.promises.stat(dir)).isDirectory()) continue;
        const bareName = stripReviewPrefix(folder);
        // IDs de 3 partes (C-FIRMA-01, C-SELO-08) enganam o regex genérico: o manifesto da fase resolve o ID exato
        const routineId =
          phaseEntries?.map(e => e.id).filter(id => bareName.startsWith(`${id}-`)).sort((a, b) => b.length - a.length)[0] ??
          bareName.match(/^([A-Z]+-[\w.]+?)-/)?.[1] ??
          folder;
        if (onlyIds && !onlyIds.includes(routineId)) continue;
        if (LEGACY_PREFIX_RE.test(folder)) {
          legacyFolders++;
          folderIssue(routineId, `Pasta com o prefixo legado [!!!] (ADR-021): ${path.join(mod, folder)}`, dir);
          continue;
        }
        const byPrefix = statusFromPrefix(folder);
        const folderTags = tagsFromPrefix(folder);
        const md = await readMd(dir);
        const mdStatus = md.match(/^\s*status:\s*(\w+)/m)?.[1];
        for (const t of folderTags) tagCounts[t]++;
        if (folderTags.length > 1) multiTagFolders++;
        if (md && (isReviewStatus(mdStatus) ? mdStatus !== byPrefix : !!byPrefix)) {
          folderIssue(routineId, `Taxonomia incoerente: pasta "${folder}" x status "${mdStatus ?? '(ausente)'}" do relatório`, dir);
        }
        // ADR-024: prefixo canônico (ordem ATT, CCC, DDD, XRX; sem espaço entre colchetes) e tags do relatório = tags da pasta
        const rawPrefix = folder.match(REVIEW_PREFIX_RE)?.[0] ?? '';
        if (rawPrefix && rawPrefix !== reviewTagsPrefix(folderTags)) {
          folderIssue(routineId, `Prefixo fora do padrão canônico: "${folder}" (esperado "${reviewTagsPrefix(folderTags)}")`, dir);
        }
        if (md && reviewTagsFromMd(md).join(',') !== folderTags.join(',')) {
          folderIssue(routineId, `Tags incoerentes: review_tags [${reviewTagsFromMd(md).join(', ') || '-'}] x pasta [${folderTags.join(', ') || '-'}]`, dir);
        }
        // ADR-024: passo externo (portal fora do Orion TN) vale pelo callout; NÃO tem passo-NN.png e isso não é erro de paridade
        if (md) {
          const onDisk = (await fs.promises.readdir(dir)).filter(f => /^passo-\d+(-[a-z])?\.(png|webp)$/i.test(f));
          const ext = auditExternalSteps(md, onDisk);
          if (ext.steps.length > 0) {
            externalRoutines++;
            externalStepsTotal += ext.steps.length;
          }
          for (const issue of ext.issues) folderIssue(routineId, issue, dir);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Completude da fase (--phase 3): uma pasta por rotina do manifesto, sem gêmeas, e as pré-triadas [DDD]
  // de hardware sem prints. Rotina sem pasta = falha técnica (`nao_auditada`): informada, não é discrepância.
  // ---------------------------------------------------------------------------
  const phaseStatus: Record<string, number> = {
    validado_inalterado: 0,
    validado_com_ajustes: 0,
    atualizacao_editorial: 0,
    comunicacao_externa: 0,
    dependencia_dados_banco: 0,
    dependencia_cruzada_rotina: 0,
    nao_auditada: 0
  };
  const notAudited: string[] = [];
  let preTriagedOk = 0;
  if (phaseEntries && fs.existsSync(rotinasDir)) {
    const entries = phaseEntries.filter(e => !onlyIds || onlyIds.includes(e.id));
    for (const e of entries) {
      const modDir = path.join(rotinasDir, e.modulo);
      const folders = fs.existsSync(modDir)
        ? (await fs.promises.readdir(modDir)).filter(f => stripReviewPrefix(f).startsWith(`${e.id}-`))
        : [];
      // Pasta de outro módulo com o mesmo ID também conta como gêmea
      const elsewhere: string[] = [];
      for (const mod of await fs.promises.readdir(rotinasDir)) {
        if (mod === e.modulo) continue;
        const d = path.join(rotinasDir, mod);
        if (!(await fs.promises.stat(d)).isDirectory()) continue;
        for (const f of await fs.promises.readdir(d)) if (stripReviewPrefix(f).startsWith(`${e.id}-`)) elsewhere.push(path.join(mod, f));
      }
      if (folders.length + elsewhere.length > 1) {
        folderIssue(e.id, `Pastas gêmeas da mesma rotina: ${[...folders.map(f => path.join(e.modulo, f)), ...elsewhere].join(' | ')}`, modDir);
      }
      if (folders.length === 0) {
        phaseStatus.nao_auditada++;
        notAudited.push(e.id);
        if (preTriagedIds.has(e.id)) folderIssue(e.id, 'Pré-triada [DDD] sem pasta de relatório', modDir);
        continue;
      }
      const dir = path.join(modDir, folders[0]);
      const md = await readMd(dir);
      const st = md.match(/^\s*status:\s*(\w+)/m)?.[1] ?? '';
      if (st in phaseStatus) phaseStatus[st]++;
      if (preTriagedIds.has(e.id)) {
        const pngs = (await fs.promises.readdir(dir)).filter(f => /^passo-\d+(-[a-z])?\.(png|webp)$/i.test(f));
        const declared = md.match(/prints_geradas:\s*(\d+)/)?.[1];
        const problems: string[] = [];
        if (!folders[0].startsWith(REVIEW_TAGS.dependencia_dados_banco.prefix)) problems.push('pasta sem o prefixo [DDD]');
        if (st !== 'dependencia_dados_banco') problems.push(`status "${st}" em vez de dependencia_dados_banco`);
        if (declared !== '0' || pngs.length > 0) problems.push(`prints_geradas=${declared} / arquivos de print em disco=${pngs.length} (esperado 0)`);
        if (!md.includes(ENVIRONMENT_BLOCK_TYPE)) problems.push('tipo_bloqueio ausente no relatório');
        if (problems.length > 0) folderIssue(e.id, `Pré-triada [DDD] de hardware inconsistente: ${problems.join('; ')}`, dir);
        else preTriagedOk++;
      }
    }
  }

  const total = telemetry.length;
  const fromKb = telemetry.filter(t => t.source === 'kb').length;
  const routineIds = new Set(telemetry.map(t => t.routineId));
  console.log(`Total de rotinas auditadas:           ${routineIds.size} (executor do KB: ${kbByRoutine.size})`);
  console.log(`Total de prints inspecionadas:        ${total} (manifesto: ${total - fromKb} | executor do KB: ${fromKb})`);
  console.log(`  sub-capturas (passo-NN-b...):       ${counters.subCaptures} (alvo revelado por gatilho: ${counters.revealPrints})`);
  console.log(`Prints com geometria auditada:        ${counters.geometry}`);
  console.log(`  com Zero Auto-Oclusão:              ${counters.zeroOcclusion}/${counters.geometry}`);
  console.log(`  medidas em zona de conteúdo:        ${counters.zoneScoped}`);
  console.log(`  com união de múltiplos alvos:       ${counters.groupUnion}`);
  console.log(`  com multi-demarcação numerada:      ${counters.multiPrints} (${counters.multiBoxes} caixas)`);
  console.log(`Prints limpas (passo sem alvo):       ${counters.clean}`);
  console.log(
    `Bloqueios estruturados (prints):      ${counters.structuredBlocks} (por privilégio: ${counters.privilegeBlocks}${
      blockKinds.size ? ` | ${Array.from(blockKinds).map(([k, n]) => `${k}: ${n}`).join(', ')}` : ''
    })`
  );
  console.log(
    `Tags nas pastas (ADR-024):            [ATT] ${tagCounts.ATT} | [CCC] ${tagCounts.CCC} | [DDD] ${tagCounts.DDD} | [XRX] ${tagCounts.XRX} | pastas multi-tag: ${multiTagFolders} | pastas [!!!] remanescentes: ${legacyFolders}`
  );
  console.log(
    `Passos externos (fora do Orion TN):   ${externalStepsTotal} em ${externalRoutines} rotina(s), sem print por desenho (não é erro de paridade)`
  );
  console.log(`Passos bloqueados sem classificação:  ${counters.unclassifiedBlocks}`);
  console.log(`Comandos de gravação não acionados:   ${counters.dryRunSkips} (Trava Segura de Mutação)`);
  console.log(`Pares PNG+WebP íntegros em disco:     ${counters.artifactPairs}/${total}`);
  if (phaseEntries) {
    console.log(`Fase 3 — rotinas do manifesto:        ${onlyIds?.length ?? phaseEntries.length} (pré-triadas [DDD] de hardware íntegras: ${preTriagedOk}/${preTriagedIds.size})`);
    console.log(
      `  status: inalterado ${phaseStatus.validado_inalterado} | com ajustes ${phaseStatus.validado_com_ajustes} | [ATT] ${phaseStatus.atualizacao_editorial} | [CCC] (só) ${phaseStatus.comunicacao_externa} | [DDD] ${phaseStatus.dependencia_dados_banco} | [XRX] ${phaseStatus.dependencia_cruzada_rotina} | nao_auditada ${phaseStatus.nao_auditada}${notAudited.length ? ` (${notAudited.join(', ')})` : ''}`
    );
  }
  console.log(`Discrepâncias:                        ${issuesFound.length}\n`);

  if (issuesFound.length > 0) {
    console.log('--- RELATÓRIO DETALHADO DE DISCREPÂNCIAS ---');
    for (const item of issuesFound) {
      console.log(`[${item.id}] Passo ${item.stepNum} — ${item.print} (${item.label})`);
      console.log(`  Raw: ${item.rawScreenshotPath} | Box: ${JSON.stringify(item.box)}`);
      for (const iss of item.issues) {
        console.log(`  ✗ ${iss}`);
      }
    }
    process.exit(1);
  } else {
    console.log(`✓ 100% das ${total} prints passaram em todos os 8 invariantes matemáticos e estruturais!`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
