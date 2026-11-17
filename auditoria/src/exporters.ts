import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';
import { extractMenuPaths } from './menu-path.js';
import { isBlockingReviewStatus, stripReviewPrefix } from './review-taxonomy.js';
import type { RoutineStep } from './types.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const auditoriaRoot = path.resolve(moduleDir, '..');
const rotinasDir = path.join(auditoriaRoot, 'rotinas');
const kbTelemetryDir = path.join(auditoriaRoot, 'cache', 'kb-telemetry');
const governancePath = path.join(auditoriaRoot, 'cache', 'governance.json');

export const DEFAULT_MANUAL_EXPORT_DIR = path.join(auditoriaRoot, 'exports', 'manual-publicado');
export const DEFAULT_PLAYWRIGHT_EXPORT_DIR = path.join(auditoriaRoot, 'exports', 'playwright-e2e');

export interface AuditedRoutineRecordForExport {
  id: string;
  titulo: string;
  modulo: string;
  secao: string;
  slug: string;
  folderPath: string;
  revisadoPath: string;
  rawContent: string;
  frontmatter: Record<string, any>;
  statusAuditoria: string;
  statusGovernanca: string;
}

function loadLocalGovernanceApprovals(): Set<string> {
  const approved = new Set<string>();
  if (fs.existsSync(governancePath)) {
    try {
      const gov = JSON.parse(fs.readFileSync(governancePath, 'utf8'));
      for (const id of Object.keys(gov?.approvals || {})) {
        approved.add(id);
      }
    } catch {}
  }
  return approved;
}

/**
 * Varre `auditoria/rotinas/` e retorna a versão revisada mais recente de cada rotina auditada.
 */
export function scanAuditedRoutinesForExport(
  customRotinasDir = rotinasDir
): AuditedRoutineRecordForExport[] {
  if (!fs.existsSync(customRotinasDir)) return [];
  const approvedInCache = loadLocalGovernanceApprovals();
  const byId = new Map<string, AuditedRoutineRecordForExport & { mtimeMs: number }>();

  for (const mod of fs.readdirSync(customRotinasDir)) {
    const modDir = path.join(customRotinasDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    for (const folder of fs.readdirSync(modDir)) {
      const folderPath = path.join(modDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;
      const revFile = fs.readdirSync(folderPath).find(f => f.endsWith('-revisado.md'));
      if (!revFile) continue;

      const revisadoPath = path.join(folderPath, revFile);
      try {
        const rawContent = fs.readFileSync(revisadoPath, 'utf8').replace(/\r\n/g, '\n');
        const parts = rawContent.split(/^---$/m);
        if (parts.length < 3) continue;
        const fm = yaml.parse(parts[1].trim()) || {};
        const id = String(fm.id || '').trim();
        if (!id) continue;

        const ui = fm.auditoria_ui || {};
        const statusAuditoria = String(ui.status || 'validado_inalterado');
        const statusGovernanca = String(
          ui.status_governanca ||
            (approvedInCache.has(id) ? 'aprovada' : 'pendente_aprovacao')
        );
        const mtimeMs = fs.statSync(revisadoPath).mtimeMs;
        const existing = byId.get(id);
        if (!existing || mtimeMs > existing.mtimeMs) {
          byId.set(id, {
            id,
            titulo: String(fm.titulo || id),
            modulo: String(fm.modulo || mod),
            secao: String(fm.secao || id[0] || 'R'),
            slug: stripReviewPrefix(folder),
            folderPath,
            revisadoPath,
            rawContent,
            frontmatter: fm,
            statusAuditoria,
            statusGovernanca,
            mtimeMs
          });
        }
      } catch {}
    }
  }

  return Array.from(byId.values())
    .sort((a, b) => a.id.localeCompare(b.id, 'pt-BR', { numeric: true }))
    .map(({ mtimeMs: _m, ...rest }) => rest);
}

/**
 * Converte um arquivo `*-revisado.md` em documento limpo de Base de Ajuda / Manual Publicado:
 * - Remove o frontmatter interno de auditoria (`auditoria_ui`, `worker_id`, `auto_cura`, `historico_reauditoria`, etc.);
 * - Remove todos os callouts técnicos de debug (`> [!NOTE]`, `> [!WARNING]`, `> [!CAUTION]`, `> [!TIP] Raio-X...`)
 *   e a seção `#### Evolução da Reauditoria`;
 * - Converte os marcadores `[aqui vai a print "passo-NN.png"]` em links Markdown relativos para `.webp` demarcados.
 */
export function cleanRevisedMarkdownForDocs(
  rawRevisedMd: string,
  options: {
    imageRelativePrefix?: string;
    includeTitleHeader?: boolean;
  } = {}
): string {
  const normalized = String(rawRevisedMd || '').replace(/\r\n/g, '\n');
  const parts = normalized.split(/^---$/m);
  const fm = parts.length >= 3 ? yaml.parse(parts[1].trim()) || {} : {};
  let body = parts.length >= 3 ? parts.slice(2).join('---').trim() : normalized.trim();

  // 1. Remove a seção técnica `#### Evolução da Reauditoria` e `#### Roteiro Técnico para Execução Manual:`
  body = body.replace(/\n*#### Evolução da Reauditoria[\s\S]*$/m, '');
  body = body.replace(
    /\n*#### Roteiro Técnico para Execução Manual:\s*\n[\s\S]*?(?=\n#### |\n\*\s+\*\*|$)/m,
    ''
  );
  body = body.replace(
    /\n*\*\s+\*\*Regra da Evidência Estrita:\*\*[^\n]*\n*/g,
    '\n\n'
  );
  body = body.replace(
    /\n*\*\s+\*\*Rotinas pré-requisito \(executar antes\):\*\*[^\n]*\n*/g,
    '\n\n'
  );

  // 2. Normaliza cabeçalho de Passo a passo
  body = body.replace(
    /^#### Passo a passo(?:\s+revisado|\s+\(texto original preservado\))?:/gm,
    '#### Passo a passo:'
  );

  // 3. Remove blocos de callout técnicos multi-linha ou linha única (`> [!NOTE]`, `> [!WARNING]`, `> [!CAUTION]`, `> [!TIP]`, `> [!IMPORTANT]`)
  const lines = body.split('\n');
  const cleanedLines: string[] = [];
  let inCalloutBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^>\s*\[!(?:NOTE|WARNING|CAUTION|TIP|IMPORTANT)\]/i.test(trimmed)) {
      inCalloutBlock = true;
      continue;
    }
    if (inCalloutBlock) {
      if (trimmed.startsWith('>')) {
        continue;
      }
      inCalloutBlock = false;
    }
    cleanedLines.push(line);
  }

  body = cleanedLines.join('\n');

  // 4. Converte `[aqui vai a print "passo-NN.png"]` em `![Passo NN](<prefix>/passo-NN.webp)`
  const prefix = options.imageRelativePrefix
    ? options.imageRelativePrefix.replace(/\/+$/, '') + '/'
    : './';

  body = body.replace(
    /^\s*\[aqui vai a print "([^"]+)"\]\s*$/gm,
    (_match, fileName: string) => {
      const webpName = String(fileName).replace(/\.png$/i, '.webp');
      const stepMatch = webpName.match(/passo-(\d+)(?:-([a-z]))?/i);
      const altLabel = stepMatch
        ? `Passo ${parseInt(stepMatch[1], 10)}${stepMatch[2] ? ` (${stepMatch[2].toUpperCase()})` : ''}`
        : webpName;
      return `   ![${altLabel}](${prefix}${webpName})`;
    }
  );

  // Colapsa múltiplas linhas em branco consecutivas
  body = body.replace(/\n{3,}/g, '\n\n').trim();

  const includeTitle = options.includeTitleHeader !== false;
  const titleHeader =
    includeTitle && fm.titulo ? `# ${String(fm.titulo).trim()}\n\n` : '';

  return `${titleHeader}${body}\n`;
}

export interface ExportManualDocsOptions {
  outputDir?: string;
  rotinasDir?: string;
  includeUnapproved?: boolean;
  routineIds?: string[];
}

export interface ExportManualDocsResult {
  outputDir: string;
  exportedCount: number;
  skippedCount: number;
  files: Array<{
    routineId: string;
    modulo: string;
    markdownPath: string;
    webpCopiedCount: number;
  }>;
}

/**
 * Exportador 1 (`--export-docs`):
 * Gera em `auditoria/exports/manual-publicado/<modulo>/<slug>/` versões limpas em Markdown
 * (mais cópia das imagens `.webp` demarcadas ou links relativos) de todas as rotinas com
 * `status_governanca === 'aprovada'` (ou todas as validadas se `includeUnapproved: true`).
 */
export async function exportManualDocs(
  options: ExportManualDocsOptions = {}
): Promise<ExportManualDocsResult> {
  const outputDir = options.outputDir || DEFAULT_MANUAL_EXPORT_DIR;
  const sourceRotinasDir = options.rotinasDir || rotinasDir;
  const includeUnapproved = Boolean(options.includeUnapproved);
  const filterIds =
    options.routineIds && options.routineIds.length > 0
      ? new Set(options.routineIds.map(s => s.trim()))
      : null;

  const allAudited = scanAuditedRoutinesForExport(sourceRotinasDir);
  const files: ExportManualDocsResult['files'] = [];
  let skippedCount = 0;

  await fs.promises.mkdir(outputDir, { recursive: true });

  for (const rec of allAudited) {
    if (filterIds && !filterIds.has(rec.id)) {
      continue;
    }

    const isApproved = rec.statusGovernanca === 'aprovada';
    const isValidated =
      rec.statusAuditoria === 'validado_inalterado' ||
      rec.statusAuditoria === 'validado_com_ajustes' ||
      !isBlockingReviewStatus(rec.statusAuditoria);

    if (!isApproved && !(includeUnapproved && isValidated)) {
      skippedCount++;
      continue;
    }

    const routineOutDir = path.join(outputDir, rec.modulo);
    await fs.promises.mkdir(routineOutDir, { recursive: true });

    const relImageDir = path
      .relative(routineOutDir, rec.folderPath)
      .replace(/\\/g, '/');

    const cleanMd = cleanRevisedMarkdownForDocs(rec.rawContent, {
      imageRelativePrefix: relImageDir
    });

    const outMdPath = path.join(routineOutDir, `${rec.slug}.md`);
    await fs.promises.writeFile(outMdPath, cleanMd, 'utf8');

    const webpCount = fs
      .readdirSync(rec.folderPath)
      .filter(f => f.toLowerCase().endsWith('.webp') && !f.includes('contexto-att')).length;

    files.push({
      routineId: rec.id,
      modulo: rec.modulo,
      markdownPath: outMdPath,
      webpCopiedCount: webpCount
    });
  }

  // Gera _indice.md consolidado da Base de Ajuda publicada
  const indexLines = [
    '# Base de Ajuda Publicada — Orion TN',
    '',
    `> Gerado automaticamente em ${new Date().toISOString()} (${files.length} rotina(s) publicada(s)).`,
    ''
  ];
  for (const f of files) {
    const rel = path.relative(outputDir, f.markdownPath).replace(/\\/g, '/');
    indexLines.push(`- **${f.routineId}** (${f.modulo}): [${path.basename(f.markdownPath)}](./${rel})`);
  }
  await fs.promises.writeFile(
    path.join(outputDir, '_indice.md'),
    indexLines.join('\n') + '\n',
    'utf8'
  );

  return {
    outputDir,
    exportedCount: files.length,
    skippedCount,
    files
  };
}

export interface PlaywrightStepActionSpec {
  stepNumber: number;
  stepText: string;
  routeHash?: string;
  actionType: 'navigate_menu' | 'click' | 'fill' | 'assert_visible' | 'dry_run_commit';
  menuChain?: string[];
  selector?: string;
  targetLabel?: string;
  isCommitCommand?: boolean;
}

const COMMIT_RE = /^(salvar|gravar|confirmar|concluir|excluir|inativar|remover|apagar)$/i;

function sanitizeRouteHash(rawUrlOrHash?: string): string | undefined {
  if (!rawUrlOrHash) return undefined;
  const idx = rawUrlOrHash.indexOf('#/');
  if (idx >= 0) return rawUrlOrHash.slice(idx).trim();
  if (rawUrlOrHash.startsWith('#')) return rawUrlOrHash.trim();
  return undefined;
}

function isEphemeralAuditAttributeSelector(sel?: string): boolean {
  if (!sel) return false;
  return /data-orion-(?:audit|firmas|som|grounding|add-stamp)/i.test(sel);
}

/**
 * Gera o código TypeScript de um teste `@playwright/test` E2E (`<ID>.spec.ts`)
 * a partir do `*-revisado.md` e da telemetria `kb-telemetry/<ID>.json`.
 */
export function generatePlaywrightSpecForRoutine(params: {
  id: string;
  titulo: string;
  modulo: string;
  revisadoMarkdown: string;
  telemetryEntries?: any[];
}): string {
  const { id, titulo, modulo, revisadoMarkdown, telemetryEntries = [] } = params;
  const normalized = String(revisadoMarkdown || '').replace(/\r\n/g, '\n');
  const parts = normalized.split(/^---$/m);
  const fm = parts.length >= 3 ? yaml.parse(parts[1].trim()) || {} : {};
  const body = parts.length >= 3 ? parts.slice(2).join('---') : normalized;

  const stepsSectionMatch = body.match(
    /#### Passo a passo[^\n]*:\s*\n([\s\S]*?)(?=\n#### |\n---\s*\n|$)/
  );
  const sectionText = stepsSectionMatch ? stepsSectionMatch[1] : body;
  const stepLines = Array.from(sectionText.matchAll(/^\s*(\d+)\.\s+(.+)$/gm)).map(m => ({
    stepNumber: parseInt(m[1], 10),
    text: m[2].trim()
  }));

  const divergences: any[] = Array.isArray(fm?.auditoria_ui?.auto_cura?.divergencias_detectadas)
    ? fm.auditoria_ui.auto_cura.divergencias_detectadas
    : [];

  const mainTelByStep = new Map<number, any>();
  for (const t of telemetryEntries) {
    if (typeof t?.stepNum === 'number' && (!t.frame || t.frame === 'a')) {
      mainTelByStep.set(t.stepNum, t);
    }
  }

  const stepCodeBlocks: string[] = [];
  let lastRouteHash = '#/inicio';

  for (const s of stepLines) {
    const tel = mainTelByStep.get(s.stepNumber);
    const stepDiv = divergences.find((d: any) => Number(d.passo) === s.stepNumber);
    const boldTargets = Array.from(s.text.matchAll(/\*\*([^*]+)\*\*/g)).map(m => m[1].trim());
    const primaryTarget =
      stepDiv?.elemento_real ||
      tel?.callouts?.[0]?.label ||
      boldTargets[0] ||
      '';

    const routeFromTel = sanitizeRouteHash(tel?.domGeometry?.url || tel?.emptyState?.hash);
    const pseudoStep: RoutineStep = {
      stepNumber: s.stepNumber,
      routineId: id,
      rawText: s.text,
      targets: boldTargets,
      actionType: tel?.actionType || 'click'
    };
    const menuPaths = extractMenuPaths(pseudoStep);

    const linesForStep: string[] = [
      `    // Passo ${s.stepNumber}: ${s.text.replace(/\*\*/g, '')}`
    ];

    if (routeFromTel && routeFromTel !== lastRouteHash && routeFromTel !== '#/inicio') {
      linesForStep.push(
        `    await page.goto(\`\${baseUrl.replace(/#\\/.*$/, '')}${routeFromTel}\`);`
      );
      lastRouteHash = routeFromTel;
    } else if (menuPaths.length > 0) {
      const chain =
        stepDiv?.camada === 'menu_path_resolution' && stepDiv?.elemento_real
          ? String(stepDiv.elemento_real)
              .split('>')
              .map((seg: string) => seg.trim())
              .filter(Boolean)
          : menuPaths[0].segments;

      if (chain.length > 0) {
        const rootMenu = chain[0];
        const leafMenu = chain[chain.length - 1];
        linesForStep.push(
          `    await page.locator('.navbar').getByText(${JSON.stringify(rootMenu)}, { exact: false }).first().click();`
        );
        for (let i = 1; i < chain.length - 1; i++) {
          linesForStep.push(
            `    await page.locator('.navbar').getByText(${JSON.stringify(chain[i])}, { exact: false }).first().hover();`
          );
        }
        if (chain.length > 1) {
          linesForStep.push(
            `    await page.locator('.navbar').getByText(${JSON.stringify(leafMenu)}, { exact: false }).first().click();`
          );
        }
        stepCodeBlocks.push(linesForStep.join('\n'));
        continue;
      }
    }

    const rawClickSel = tel?.domGeometry?.actionTarget?.clickSelector;
    const rawFillSel = tel?.domGeometry?.actionTarget?.fillSelector;
    const stableSelector =
      !isEphemeralAuditAttributeSelector(rawFillSel) && rawFillSel
        ? rawFillSel
        : !isEphemeralAuditAttributeSelector(rawClickSel) && rawClickSel
          ? rawClickSel
          : undefined;

    const commitBoldTarget = boldTargets.find(t => COMMIT_RE.test(t.trim()));
    const commitCmd =
      Boolean(commitBoldTarget) ||
      COMMIT_RE.test(primaryTarget.trim()) ||
      tel?.executedAction?.via === 'dry-run' ||
      Boolean(tel?.executedAction?.commitLabel);
    const labelToLocate =
      tel?.executedAction?.commitLabel ||
      commitBoldTarget ||
      primaryTarget ||
      tel?.domGeometry?.context?.innerText ||
      '';

    if (!labelToLocate && !stableSelector) {
      linesForStep.push(`    await expect(page.locator('body')).toBeVisible();`);
    } else if (commitCmd) {
      const locExpr = stableSelector
        ? `page.locator(${JSON.stringify(stableSelector)}).first()`
        : `page.getByText(${JSON.stringify(labelToLocate)}, { exact: false }).first()`;
      linesForStep.push(
        `    const commitTargetStep${s.stepNumber} = ${locExpr};`,
        `    await expect(commitTargetStep${s.stepNumber}).toBeVisible();`,
        `    if (process.env.ORION_E2E_ALLOW_MUTATIONS === 'true') {`,
        `      await commitTargetStep${s.stepNumber}.click();`,
        `    }`
      );
    } else if (tel?.actionType === 'fill' || tel?.actionType === 'search') {
      const locExpr = stableSelector
        ? `page.locator(${JSON.stringify(stableSelector)}).first()`
        : `page.getByLabel(${JSON.stringify(labelToLocate)}, { exact: false }).or(page.getByPlaceholder(${JSON.stringify(labelToLocate)}, { exact: false })).or(page.getByText(${JSON.stringify(labelToLocate)}, { exact: false })).first()`;
      linesForStep.push(
        `    const fieldStep${s.stepNumber} = ${locExpr};`,
        `    await expect(fieldStep${s.stepNumber}).toBeVisible();`
      );
    } else {
      const locExpr = stableSelector
        ? `page.locator(${JSON.stringify(stableSelector)}).first()`
        : `page.getByText(${JSON.stringify(labelToLocate)}, { exact: false }).first()`;
      linesForStep.push(
        `    const targetStep${s.stepNumber} = ${locExpr};`,
        `    await expect(targetStep${s.stepNumber}).toBeVisible();`,
        `    await targetStep${s.stepNumber}.click();`
      );
    }

    stepCodeBlocks.push(linesForStep.join('\n'));
  }

  return [
    `import { test, expect } from '@playwright/test';`,
    ``,
    `/**`,
    ` * Teste E2E de Regressão gerado automaticamente pelo Pipeline de Auditoria Orion TN (ADR-032)`,
    ` * Rotina: ${id} — ${titulo}`,
    ` * Módulo: ${modulo}`,
    ` */`,
    `test.use({`,
    `  viewport: { width: 1440, height: 900 },`,
    `  deviceScaleFactor: 1`,
    `});`,
    ``,
    `test.describe(${JSON.stringify(`[${modulo.toUpperCase()}] ${id} — ${titulo}`)}, () => {`,
    `  test(${JSON.stringify(`deve validar o fluxo da rotina ${id}`)}, async ({ page }) => {`,
    `    const baseUrl = process.env.ORION_APP_HOME_URL || process.env.ORION_BASE_URL || 'http://localhost:8080/webFirmas/#/inicio';`,
    `    await page.goto(baseUrl);`,
    `    await page.evaluate(() => { document.documentElement.style.zoom = '0.8'; });`,
    ``,
    stepCodeBlocks.join('\n\n'),
    `  });`,
    `});`,
    ``
  ].join('\n');
}

export interface ExportPlaywrightSpecsOptions {
  outputDir?: string;
  rotinasDir?: string;
  telemetryDir?: string;
  includeUnapproved?: boolean;
  routineIds?: string[];
}

export interface ExportPlaywrightSpecsResult {
  outputDir: string;
  exportedCount: number;
  skippedCount: number;
  files: Array<{
    routineId: string;
    modulo: string;
    specPath: string;
  }>;
}

/**
 * Exportador 2 (`--export-playwright`):
 * Gera em `auditoria/exports/playwright-e2e/<modulo>/<ID>.spec.ts` scripts `@playwright/test`
 * limpos e executáveis a partir dos passos, rotas hash, `actionTarget` e seletores validados.
 */
export async function exportPlaywrightSpecs(
  options: ExportPlaywrightSpecsOptions = {}
): Promise<ExportPlaywrightSpecsResult> {
  const outputDir = options.outputDir || DEFAULT_PLAYWRIGHT_EXPORT_DIR;
  const sourceRotinasDir = options.rotinasDir || rotinasDir;
  const sourceTelDir = options.telemetryDir || kbTelemetryDir;
  const includeUnapproved = options.includeUnapproved !== false;
  const filterIds =
    options.routineIds && options.routineIds.length > 0
      ? new Set(options.routineIds.map(s => s.trim()))
      : null;

  const allAudited = scanAuditedRoutinesForExport(sourceRotinasDir);
  const files: ExportPlaywrightSpecsResult['files'] = [];
  let skippedCount = 0;

  await fs.promises.mkdir(outputDir, { recursive: true });

  for (const rec of allAudited) {
    if (filterIds && !filterIds.has(rec.id)) {
      continue;
    }

    const isApproved = rec.statusGovernanca === 'aprovada';
    const isValidated =
      rec.statusAuditoria === 'validado_inalterado' ||
      rec.statusAuditoria === 'validado_com_ajustes' ||
      !isBlockingReviewStatus(rec.statusAuditoria);

    if (!isApproved && !(includeUnapproved && isValidated)) {
      skippedCount++;
      continue;
    }

    let telemetryEntries: any[] = [];
    const telFile = path.join(sourceTelDir, `${rec.id}.json`);
    if (fs.existsSync(telFile)) {
      try {
        const parsedTel = JSON.parse(fs.readFileSync(telFile, 'utf8'));
        if (Array.isArray(parsedTel)) telemetryEntries = parsedTel;
      } catch {}
    }

    const specCode = generatePlaywrightSpecForRoutine({
      id: rec.id,
      titulo: rec.titulo,
      modulo: rec.modulo,
      revisadoMarkdown: rec.rawContent,
      telemetryEntries
    });

    const modOutDir = path.join(outputDir, rec.modulo);
    await fs.promises.mkdir(modOutDir, { recursive: true });
    const specPath = path.join(modOutDir, `${rec.id}.spec.ts`);
    await fs.promises.writeFile(specPath, specCode, 'utf8');

    files.push({
      routineId: rec.id,
      modulo: rec.modulo,
      specPath
    });
  }

  return {
    outputDir,
    exportedCount: files.length,
    skippedCount,
    files
  };
}
