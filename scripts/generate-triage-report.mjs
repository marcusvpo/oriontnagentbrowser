#!/usr/bin/env node
/**
 * Guia consolidado de triagem das Fases 2 e 3 (ADR-035) — SOMENTE LEITURA.
 *
 * Lê os `*-revisado.md` de `auditoria/rotinas/` (frontmatter `auditoria_ui`) e gera
 * `docs/RELATORIO_TRIAGEM_FASES_2_E_3.md`. Nunca escreve nos relatórios das rotinas, não toca no navegador,
 * não lê `.env` e mascara qualquer IP interno que apareça nos textos.
 *
 * Uso (a partir da raiz do repositório):
 *   node scripts/generate-triage-report.mjs [--out docs/RELATORIO_TRIAGEM_FASES_2_E_3.md] [--before-ref HEAD]
 *                                           [--semantic-before <semantic-audit-report.json>] [--semantic-after <idem>]
 *
 * `--before-ref` (padrão `HEAD`) é o commit usado como "Antes" no comparativo das rotinas reauditadas (ADR-035).
 * `--semantic-before` (opcional) é uma cópia do `semantic-audit-report.json` anterior à reauditoria; com ele a tabela
 * Antes × Depois ganha a coluna "Divergências do verificador" (o "Depois" lê `auditoria/cache/semantic-audit-report.json`).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'auditoria', 'package.json'));
const yaml = require('yaml');

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const OUT = path.resolve(ROOT, argOf('--out', 'docs/RELATORIO_TRIAGEM_FASES_2_E_3.md'));
const BEFORE_REF = argOf('--before-ref', 'HEAD');
/** Relatórios do verificador semântico (ADR-033) para a coluna "Divergências do verificador": `--semantic-before` é opcional. */
const SEMANTIC_BEFORE = argOf('--semantic-before', '');
const SEMANTIC_AFTER = argOf('--semantic-after', 'auditoria/cache/semantic-audit-report.json');

/** Lê um `semantic-audit-report.json` (somente leitura); qualquer falha devolve `null` e a coluna é omitida. */
function loadSemanticReport(file) {
  if (!file) return null;
  try {
    const json = JSON.parse(fs.readFileSync(path.resolve(ROOT, file), 'utf8'));
    const threshold = Number(json.confidence_threshold ?? 0.85);
    const results = Array.isArray(json.results) ? json.results : [];
    const byRoutine = new Map();
    for (const r of results) {
      if (!byRoutine.has(r.routine_id)) byRoutine.set(r.routine_id, []);
      byRoutine.get(r.routine_id).push(r);
    }
    const isFlagged = r => r.semantic_match === false || Number(r.visual_confidence ?? 1) < threshold;
    const calibratedSet = new Set(CALIBRATED);
    const flagged = results.filter(r => calibratedSet.has(r.routine_id) && isFlagged(r)).length;
    return { threshold, byRoutine, isFlagged, flagged };
  } catch {
    return null;
  }
}

/** Números dos passos reprovados de uma rotina no relatório lido. */
function flaggedSteps(report, id) {
  return (report.byRoutine.get(id) ?? []).filter(report.isFlagged).map(r => r.step_number).sort((a, b) => a - b);
}

/** Rotinas calibradas pela ADR-035 (para o comparativo Antes × Depois). */
const CALIBRATED = ['C-CERT-02', 'D-3.11', 'D-3.9', 'M-36.0', 'M-41.0', 'M-43.0', 'M-60.0', 'M-66.0', 'M-68.0', 'R-1.1', 'R-10.0', 'R-18.0', 'R-3.0'];

const PHASE_OF_MODULE = { acesso: 2, config: 2, firmas: 3, selos: 3, livros: 3, certidoes: 3, centrais: 3 };
const MODULE_ORDER = ['acesso', 'config', 'firmas', 'selos', 'livros', 'certidoes', 'centrais'];
const TAG_ORDER = ['ATT', 'CCC', 'DDD', 'XRX'];
const STATUS_TAG = { atualizacao_editorial: 'ATT', dependencia_dados_banco: 'DDD', dependencia_cruzada_rotina: 'XRX', comunicacao_externa: 'CCC' };

// ---------------------------------------------------------------------------
const maskIps = s => String(s ?? '').replace(/\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\b/g, 'x.x.x.x');
const clean = s => maskIps(String(s ?? '').replace(/\s+/g, ' ').trim());
const cell = s => clean(s).replace(/\|/g, '\\|');
const trunc = (s, n) => {
  const t = clean(s);
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
};
const natKey = id => id.split(/[-.]/).map(p => (/^\d+$/.test(p) ? p.padStart(4, '0') : p)).join('.');
const byId = (a, b) => natKey(a.id).localeCompare(natKey(b.id));

function parseReport(mdPath, content) {
  const text = content.replace(/\r\n/g, '\n');
  const parts = text.split(/^---$/m);
  if (parts.length < 3) return null;
  let fm;
  try {
    fm = yaml.parse(parts[1].trim());
  } catch {
    return null;
  }
  if (!fm?.id) return null;
  const folder = path.basename(path.dirname(mdPath));
  const prefix = (folder.match(/^((?:\[[A-Z]{3}\])+)\s/) || [])[1] || '';
  const folderTags = [...prefix.matchAll(/\[([A-Z]{3})\]/g)].map(m => m[1]);
  const ui = fm.auditoria_ui || {};
  const status = String(ui.status || '');
  let tags = folderTags.length ? folderTags : Array.isArray(ui.review_tags) ? ui.review_tags.map(String) : [];
  if (tags.length === 0 && STATUS_TAG[status]) tags = [STATUS_TAG[status]];
  tags = TAG_ORDER.filter(t => tags.includes(t));
  const body = parts.slice(2).join('---');
  const motivo = (body.match(/\*\*Motivo Técnico:\*\*\s*([^\n]*)/) || [])[1] || '';
  const prereq = (body.match(/\*\*Rotinas pré-requisito \(executar antes\):\*\*\s*([^\n]*)/) || [])[1] || '';
  return {
    id: String(fm.id),
    titulo: String(fm.titulo || ''),
    modulo: String(fm.modulo || path.basename(path.dirname(path.dirname(mdPath)))),
    status,
    tags,
    tipoBloqueio: String(ui.tipo_bloqueio || ''),
    motivo,
    prereq: [...prereq.matchAll(/\*\*([A-Z]{1,2}-[\w.]+)\*\*/g)].map(m => m[1]),
    diag: ui.diagnostico_tela_att || null,
    exploracao: ui.exploracao_investigativa || null,
    body,
    folder
  };
}

function loadAll() {
  const base = path.join(ROOT, 'auditoria', 'rotinas');
  const out = [];
  for (const mod of fs.readdirSync(base)) {
    const modDir = path.join(base, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;
    for (const d of fs.readdirSync(modDir)) {
      const dir = path.join(modDir, d);
      if (!fs.statSync(dir).isDirectory()) continue;
      const f = fs.readdirSync(dir).find(x => x.endsWith('-revisado.md'));
      if (!f) continue;
      const p = path.join(dir, f);
      const r = parseReport(p, fs.readFileSync(p, 'utf8'));
      if (r) out.push(r);
    }
  }
  return out;
}

/** Índice leve do KB (`kb/rotinas/<modulo>/<ID>-slug.md`): título e módulo de rotinas ainda não auditadas. */
function loadKbIndex() {
  const base = path.join(ROOT, 'kb', 'rotinas');
  const index = new Map();
  if (!fs.existsSync(base)) return index;
  for (const mod of fs.readdirSync(base)) {
    const modDir = path.join(base, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;
    for (const f of fs.readdirSync(modDir)) {
      const m = f.match(/^([A-Z]{1,2}-[\d.]+(?:\.\d+)*)-/);
      if (!m || !f.endsWith('.md')) continue;
      const head = fs.readFileSync(path.join(modDir, f), 'utf8').split('\n').slice(0, 30).join('\n');
      const titulo = (head.match(/^titulo:\s*(.+)$/m) || [])[1] || '';
      index.set(m[1], { titulo: titulo.replace(/^['"]|['"]\s*$/g, '').trim(), modulo: mod });
    }
  }
  return index;
}
const KB_PHASE = { notas: 5, caixa: 4 };

const isValidated = r => r.tags.length === 0 && /^validado/.test(r.status);
const label = r => (r.tags.length ? r.tags.map(t => `[${t}]`).join('') : isValidated(r) ? 'validada' : r.status || 'sem status');

// --- "Antes" por git (frontmatter do commit de referência) -------------------
function gitBefore(id) {
  try {
    const files = execFileSync('git', ['ls-tree', '-r', '--name-only', BEFORE_REF, 'auditoria/rotinas'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
      .split('\n')
      .filter(f => f.endsWith('-revisado.md') && new RegExp(`(^|/)(\\[[A-Z]{3}\\])*\\s?${id.replace(/\./g, '\\.')}-`).test(f));
    if (files.length === 0) return null;
    const content = execFileSync('git', ['show', `${BEFORE_REF}:${files[0]}`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    return parseReport(files[0], content);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
function classifyAtt(r) {
  const stepNo = Number((r.motivo.match(/No passo (\d+)/i) || [])[1] || r.diag?.passo || 0);
  const stepText = (r.body.match(new RegExp(`^\\s*${stepNo}\\.\\s*(.+)$`, 'm')) || [])[1] || '';
  const isMenu =
    /caminho de menu|árvore de navegação|árvore de navegacao/i.test(r.motivo) || (stepNo > 0 && (/>/.test(stepText) || /\bacesse o menu\b/i.test(stepText)));
  return { stepNo, stepText, kind: isMenu ? 'menu' : 'campo' };
}

function screenSummary(diag) {
  if (!diag) return { tela: '—', botoes: '—', abas: '—', sugestoes: '—', campos: '—', reescrita: '' };
  const lista = (a, n) => (Array.isArray(a) && a.length ? `${a.slice(0, n).join(', ')}${a.length > n ? ` (+${a.length - n})` : ''}` : '—');
  const campos = Array.isArray(diag.campos) ? diag.campos.map(c => c.rotulo).filter(Boolean) : [];
  const sug = Array.isArray(diag.correspondencias_sugeridas)
    ? diag.correspondencias_sugeridas.slice(0, 3).map(c => `${c.alvo} → ${c.elemento_real} (${c.tipo || 'elemento'}${c.similaridade ? `, ${Math.round(c.similaridade * 100)}%` : ''})`)
    : [];
  return {
    tela: `${diag.rota || '—'}${diag.secoes?.length ? ` · ${diag.secoes.slice(0, 2).join(' / ')}` : ''}`,
    botoes: lista(diag.botoes, 8),
    abas: lista(diag.abas, 6),
    campos: lista(campos, 8),
    sugestoes: sug.length ? sug.join('; ') : '—',
    reescrita: diag.sugestao_reescrita || ''
  };
}

function main() {
  const all = loadAll();
  const scope = all.filter(r => PHASE_OF_MODULE[r.modulo]);
  const outside = all.filter(r => !PHASE_OF_MODULE[r.modulo]);
  const phase = r => PHASE_OF_MODULE[r.modulo];
  const idIndex = new Map(all.map(r => [r.id, r]));
  const kbIndex = loadKbIndex();
  /** Descrição de uma produtora que não está no acervo auditado (rotina de fase futura). */
  const notAudited = id => {
    const k = kbIndex.get(id);
    if (!k) return `${id}: fora do acervo auditado e do KB`;
    const fase = KB_PHASE[k.modulo];
    return `${id}: ainda não auditada (módulo ${k.modulo}${fase ? `, Fase ${fase}` : ''})`;
  };
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const L = [];
  const push = (...x) => L.push(...x);

  const cat = {
    validadas: r => isValidated(r),
    ATT: r => r.tags.includes('ATT'),
    XRX: r => r.tags.includes('XRX'),
    DDD: r => r.tags.includes('DDD'),
    CCC: r => r.tags.includes('CCC')
  };
  const count = (list, fn) => list.filter(fn).length;
  const onlyTag = (r, t) => r.tags.length === 1 && r.tags[0] === t;

  push('# Relatório de Triagem — Fases 2 e 3 (Orion TN 6.0)', '');
  push(`> Gerado em ${now} (UTC) por \`node scripts/generate-triage-report.mjs\` — **somente leitura**: nenhum relatório de rotina, print ou cache foi alterado. Fonte: \`auditoria/rotinas/**/*-revisado.md\` (frontmatter \`auditoria_ui\`) e, para o comparativo "Antes", o commit \`${BEFORE_REF}\`.`);
  push(`> Escopo: **${scope.length} rotinas** — Fase 2 (\`acesso\` + \`config\`, ${count(scope, r => phase(r) === 2)}) e Fase 3 (\`firmas\`, \`selos\`, \`livros\`, \`certidoes\`, \`centrais\`, ${count(scope, r => phase(r) === 3)}).${outside.length ? ` Fora do escopo: ${outside.map(r => r.id).join(', ')} (módulo \`${[...new Set(outside.map(r => r.modulo))].join(', ')}\`).` : ''}`);
  push('> Uma rotina pode ter várias tags (`[ATT][CCC]`): ela conta em cada categoria, por isso a soma das colunas pode exceder o total.', '');

  // ---- 1. Quadro ---------------------------------------------------------
  push('## 1. Quadro atualizado das rotinas', '', '### 1.1 Por fase e categoria', '');
  push('| Categoria | Fase 2 | Fase 3 | Total |', '|---|---:|---:|---:|');
  const row = (name, fn) => {
    const a = count(scope.filter(r => phase(r) === 2), fn);
    const b = count(scope.filter(r => phase(r) === 3), fn);
    push(`| ${name} | ${a} | ${b} | ${a + b} |`);
  };
  push(`| **Rotinas no escopo** | ${count(scope, r => phase(r) === 2)} | ${count(scope, r => phase(r) === 3)} | ${scope.length} |`);
  row('Validadas (sem tag)', cat.validadas);
  row('`[ATT]` — atualização editorial (inclui multi-tag)', cat.ATT);
  row('`[XRX]` — dependência cruzada (inclui multi-tag)', cat.XRX);
  row('`[DDD]` — dados/ambiente/hardware', cat.DDD);
  row('`[CCC]` — etapa externa (inclui multi-tag)', cat.CCC);
  const untagged = scope.filter(r => r.tags.length === 0 && !isValidated(r));
  if (untagged.length) row('Sem tag e sem validação (revisar)', r => r.tags.length === 0 && !isValidated(r));
  push('', `Só uma tag (sem combinações): \`[ATT]\` ${count(scope, r => onlyTag(r, 'ATT'))} · \`[XRX]\` ${count(scope, r => onlyTag(r, 'XRX'))} · \`[DDD]\` ${count(scope, r => onlyTag(r, 'DDD'))} · \`[CCC]\` ${count(scope, r => onlyTag(r, 'CCC'))}.`, '');

  push('### 1.2 Por módulo', '', '| Módulo | Fase | Total | Validadas | `[ATT]` | `[XRX]` | `[DDD]` | `[CCC]` |', '|---|---:|---:|---:|---:|---:|---:|---:|');
  for (const m of MODULE_ORDER) {
    const list = scope.filter(r => r.modulo === m);
    push(`| ${m} | ${PHASE_OF_MODULE[m]} | ${list.length} | ${count(list, cat.validadas)} | ${count(list, cat.ATT)} | ${count(list, cat.XRX)} | ${count(list, cat.DDD)} | ${count(list, cat.CCC)} |`);
  }
  push('');

  // ---- 1.3 Antes × Depois ------------------------------------------------
  push('### 1.3 Efeito da reauditoria das 13 rotinas calibradas (Antes × Depois)', '');
  push(`"Antes" = relatório no commit \`${BEFORE_REF}\`; "Depois" = relatório atual em disco.`, '');
  const semBefore = loadSemanticReport(SEMANTIC_BEFORE);
  const semAfter = loadSemanticReport(SEMANTIC_AFTER);
  const withSemantics = !!(semBefore && semAfter);
  if (withSemantics) {
    push(`"Divergências do verificador" = passos que o verificador semântico multimodal (ADR-033) reprovou (\`semantic_match = false\` ou confiança visual < ${semAfter.threshold}): lote de ${semBefore.flagged} divergência(s) antes → ${semAfter.flagged} depois (relatório consolidado). Rotina que passou a \`[ATT]\`/\`[XRX]\` não é reavaliada pelo verificador (só inspeciona \`validado_com_ajustes\`).`, '');
    push('| Rotina | Antes | Depois | Divergências do verificador (antes → depois) | Observação |', '|---|---|---|---|---|');
  } else {
    push('| Rotina | Antes | Depois | Observação |', '|---|---|---|---|');
  }
  for (const id of CALIBRATED) {
    const after = idIndex.get(id);
    const before = gitBefore(id);
    const b = before ? label(before) : '—';
    const a = after ? label(after) : '—';
    let note = after && after.tags.length ? trunc(after.motivo, 170) : after ? 'Auditada com tela real; revisar `-revisado.md` se houver notas de divergência.' : '';
    if (withSemantics) {
      const bs = flaggedSteps(semBefore, id);
      const as = flaggedSteps(semAfter, id);
      const stepsTxt = list => (list.length ? `${list.length} (passo${list.length > 1 ? 's' : ''} ${list.join(', ')})` : '0');
      const evaluatedAfter = semAfter.byRoutine.has(id);
      const afterTxt = evaluatedAfter ? stepsTxt(as) : 'não reavaliada (bloqueio com tag)';
      if (after && !after.tags.length) {
        if (bs.length && evaluatedAfter && !as.length) note = 'Divergência(s) sanada(s) na reauditoria e confirmada(s) pelo verificador.';
        else if (bs.length && as.length) note = `Permanece(m) ${as.length} divergência(s) para adjudicação humana (ver ADR-035 §2.6).`;
      }
      push(`| ${id} | ${b} | ${a} | ${stepsTxt(bs)} → ${afterTxt} | ${cell(note)} |`);
    } else {
      push(`| ${id} | ${b} | ${a} | ${cell(note)} |`);
    }
  }
  push('');

  // ---- 2. ATT -------------------------------------------------------------
  const att = scope.filter(cat.ATT).sort(byId);
  const attInfo = new Map(att.map(r => [r.id, classifyAtt(r)]));
  const attMenu = att.filter(r => attInfo.get(r.id).kind === 'menu');
  const attField = att.filter(r => attInfo.get(r.id).kind === 'campo');
  push(`## 2. Mapa de ação das rotinas \`[ATT]\` (${att.length})`, '');
  push('Bloqueio `[ATT]` = **manual desatualizado**: o auditor esgotou menu, auto-cura, exploração investigativa e máquina de estado, e **não adivinhou** a tela (Evidência Estrita). O texto de cada manual permanece 100% original; as sugestões abaixo vêm do Raio-X lido ao vivo (`diagnostico_tela_att`) e são apenas subsídio de reescrita.', '');
  push('### 2.1 Resumo por módulo e tipo de bloqueio', '', '| Módulo | Total `[ATT]` | Falha no menu (passo 1) | Falha no menu (passo ≥ 2) | Campo/botão ausente na tela |', '|---|---:|---:|---:|---:|');
  for (const m of MODULE_ORDER) {
    const list = att.filter(r => r.modulo === m);
    if (!list.length) continue;
    const menu1 = list.filter(r => attInfo.get(r.id).kind === 'menu' && attInfo.get(r.id).stepNo <= 1).length;
    const menu2 = list.filter(r => attInfo.get(r.id).kind === 'menu' && attInfo.get(r.id).stepNo > 1).length;
    push(`| ${m} | ${list.length} | ${menu1} | ${menu2} | ${list.filter(r => attInfo.get(r.id).kind === 'campo').length} |`);
  }
  push(`| **Total** | **${att.length}** | **${attMenu.filter(r => attInfo.get(r.id).stepNo <= 1).length}** | **${attMenu.filter(r => attInfo.get(r.id).stepNo > 1).length}** | **${attField.length}** |`, '');

  push(`### 2.2 Falha no caminho de menu (${attMenu.length})`, '', 'O caminho citado no manual não existe na árvore de navegação real (leitura ao vivo, sem cliques). Ação editorial: trocar pelo caminho real (ver "Evidência") ou confirmar com Produtos onde a tela foi movida.', '');
  for (const m of MODULE_ORDER) {
    const list = attMenu.filter(r => r.modulo === m);
    if (!list.length) continue;
    push(`<details><summary><b>${m}</b> — ${list.length} rotina(s)</summary>`, '', '| Rotina | Título | Passo | Evidência lida da árvore real |', '|---|---|---:|---|');
    for (const r of list) push(`| ${r.id} | ${cell(trunc(r.titulo, 70))} | ${attInfo.get(r.id).stepNo || '—'} | ${cell(trunc(r.motivo, 330))} |`);
    push('', '</details>', '');
  }

  push(`### 2.3 Campo/botão ausente na tela (${attField.length})`, '', 'A tela abriu, mas o elemento citado não existe nela. A tabela lista o que **existe de fato** na tela do bloqueio, para orientar a reescrita.', '');
  for (const m of MODULE_ORDER) {
    const list = attField.filter(r => r.modulo === m);
    if (!list.length) continue;
    push(`<details><summary><b>${m}</b> — ${list.length} rotina(s)</summary>`, '');
    for (const r of list) {
      const s = screenSummary(r.diag);
      const ausentes = r.diag?.alvos_sem_correspondencia?.length ? r.diag.alvos_sem_correspondencia : r.diag?.alvos_do_passo || [];
      push(`**${r.id}** — ${cell(trunc(r.titulo, 90))} · bloqueio no passo ${attInfo.get(r.id).stepNo || r.diag?.passo || '—'}`, '');
      push(`- **Ausente(s) na tela:** ${ausentes.length ? ausentes.map(a => `**${clean(a)}**`).join(', ') : trunc(r.motivo, 200)}`);
      push(`- **Tela real:** ${cell(s.tela)}`);
      push(`- **Abas:** ${cell(s.abas)} · **Botões:** ${cell(s.botoes)}`);
      push(`- **Campos:** ${cell(s.campos)}`);
      if (s.sugestoes !== '—') push(`- **Correspondências sugeridas:** ${cell(s.sugestoes)}`);
      if (s.reescrita) push(`- **Subsídio de reescrita:** ${cell(trunc(s.reescrita, 260))}`);
      push('');
    }
    push('</details>', '');
  }

  // ---- 3. XRX -------------------------------------------------------------
  const xrx = scope.filter(cat.XRX).sort(byId);
  push(`## 3. Mapa de encadeamento das rotinas \`[XRX]\` (${xrx.length})`, '');
  push('Cada rotina depende de outra que **cria o registro/estado** de que ela precisa. Execute a produtora antes e reaudite a consumidora. A coluna "Situação da produtora" mostra se a cadeia já está destravada.', '');
  push('| Consumidora (`[XRX]`) | Título | Produtora(s) a executar antes | Situação da produtora | Por que está bloqueada |', '|---|---|---|---|---|');
  for (const r of xrx) {
    const prods = r.prereq.length ? r.prereq : [];
    const titleOf = p => idIndex.get(p)?.titulo || kbIndex.get(p)?.titulo || '';
    const prodText = prods.length ? prods.map(p => `**${p}**${titleOf(p) ? ` (${cell(trunc(titleOf(p), 50))})` : ''}`).join('; ') : '_provedor não identificado pelo grafo do KB_';
    const sit = prods.length
      ? prods.map(p => {
          const pr = idIndex.get(p);
          if (!pr) return notAudited(p);
          return `${p}: ${pr.tags.length ? `${label(pr)} (cadeia bloqueada)` : isValidated(pr) ? 'validada (pronta para executar)' : label(pr)}`;
        }).join('; ')
      : '—';
    push(`| ${r.id} | ${cell(trunc(r.titulo, 60))} | ${prodText} | ${cell(sit)} | ${cell(trunc(r.motivo, 190))} |`);
  }
  const chainReady = xrx.filter(r => r.prereq.length && r.prereq.every(p => idIndex.get(p) && isValidated(idIndex.get(p))));
  const chainBlocked = xrx.filter(r => r.prereq.length && r.prereq.some(p => idIndex.get(p)?.tags.length));
  const chainFuture = xrx.filter(r => r.prereq.length && r.prereq.some(p => !idIndex.get(p)));
  push(
    '',
    `Resumo: **${chainReady.length}** consumidora(s) com todas as produtoras validadas (podem ser reauditadas após executar a produtora); **${chainBlocked.length}** com produtora também sinalizada (resolver a produtora primeiro); **${chainFuture.length}** dependem de rotina de fase futura (ex.: criação de protocolo no módulo Notas, Fase 5) — só destravam quando essa fase for auditada ou o registro for criado manualmente; **${xrx.filter(r => r.prereq.length === 0).length}** sem produtora identificada.`,
    ''
  );

  // ---- 4. DDD -------------------------------------------------------------
  const ddd = scope.filter(cat.DDD).sort(byId);
  const dddHw = ddd.filter(r => /ambiente\/hardware/i.test(r.tipoBloqueio));
  const dddData = ddd.filter(r => !/ambiente\/hardware/i.test(r.tipoBloqueio));
  push(`## 4. Rotinas \`[DDD]\` (${ddd.length})`, '');
  push(`### 4.1 Periféricos físicos / ambiente (${dddHw.length}) — fora do alcance do agente`, '', 'Dependem de hardware (scanner TWAIN, biometria, impressora térmica), serviço local ou Docker. São derivadas por `hardware-registry.ts` e ficam **protegidas** da reauditoria em lote (`--reaudit-pending` as ignora; só `--routines` as força). Validação: manual, com o periférico.', '');
  push('| Rotina | Título | Dependência |', '|---|---|---|');
  for (const r of dddHw) push(`| ${r.id} | ${cell(trunc(r.titulo, 70))} | ${cell(trunc(r.motivo, 210))} |`);
  push('', `### 4.2 Parâmetro/dados no banco (${dddData.length})`, '');
  if (dddData.length === 0) push('Nenhuma.');
  else {
    push('| Rotina | Título | Tipo de bloqueio | Detalhe |', '|---|---|---|---|');
    for (const r of dddData) push(`| ${r.id} | ${cell(trunc(r.titulo, 70))} | ${cell(r.tipoBloqueio)} | ${cell(trunc(r.motivo, 320))} |`);
  }
  push('');

  // ---- 5. CCC -------------------------------------------------------------
  const ccc = scope.filter(cat.CCC).sort(byId);
  push(`## 5. Rotinas com etapa externa \`[CCC]\` (${ccc.length})`, '', '`[CCC]` não bloqueia: as etapas do Orion TN foram auditadas e fotografadas; as etapas em portal externo (SISCOAF, e-Notariado, CENSEC...) ficam documentadas como "Etapa Externa" e só podem ser validadas no próprio portal.', '');
  push('| Rotina | Título | Tags |', '|---|---|---|');
  for (const r of ccc) push(`| ${r.id} | ${cell(trunc(r.titulo, 80))} | ${r.tags.map(t => `\`[${t}]\``).join('')} |`);
  push('', '## Como regenerar', '', '```powershell', 'node scripts/generate-triage-report.mjs', '```', '', 'O gerador lê o estado atual de `auditoria/rotinas/` e compara as 13 rotinas calibradas com o commit indicado em `--before-ref`.');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${maskIps(L.join('\n'))}\n`, 'utf8');
  console.log(`OK ${path.relative(ROOT, OUT)} | escopo=${scope.length} validadas=${count(scope, cat.validadas)} ATT=${att.length} (menu=${attMenu.length}, campo=${attField.length}) XRX=${xrx.length} DDD=${ddd.length} CCC=${ccc.length}`);
}

main();
