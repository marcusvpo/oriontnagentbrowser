/**
 * Minerador de causas raiz dos bloqueios `[ATT]` e `[XRX]` (ADR-029, Etapa 1).
 *
 * SOMENTE LEITURA, offline: lê todos os `*-revisado.md` (frontmatter `auditoria_ui` + `diagnostico_tela_att` +
 * corpo) e `auditoria/cache/kb-telemetry/*.json`, e classifica cada rotina bloqueada em quatro clusters:
 *
 *   A — Falha de caminho de menu (passo 1 ou navegação intermediária)
 *       A1 equivalente canônico inequívoco na árvore real | A2 rota curada mas clique omitido (bug de motor, ADR-029)
 *       A3 caminho sem equivalente na árvore | A4 módulo/produto externo ao menu do Orion TN
 *   B — Grade inicialmente vazia que exige disparo de filtro/busca (Filtrar/Pesquisar/Consultar)
 *   C — Rótulo de campo/botão/aba renomeado (ou alvo espúrio de parser) na tela alcançada
 *   D — Recurso realmente removido / tela pressuposta / exclusivo de outra rotina (permanece `[ATT]`/`[XRX]`)
 *
 * Saída: `auditoria/cache/att-xrx-cluster-analysis.json` (ignorado pelo Git) + resumo no terminal. A árvore de menus
 * real vem de `auditoria/cache/orion-menu-tree-real.json` (`capture-menu-tree.ts`); sem ela, o cluster A fica sem
 * prova de equivalência e é marcado como tal.
 *
 *   npx --prefix auditoria tsx auditoria/src/mine-att-clusters.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { config } from './config.js';
import { canonNormalize, EXPLICIT_MENU_EQUIVALENCES, resolveCanonicalMenuPath, type CanonicalMenuItem } from './menu-canonical.js';
import { extractMenuPaths } from './menu-path.js';
import { PHASES } from './phases.js';
import { ROUTE_LABEL_SYNONYMS, routeKey } from './route-synonyms.js';
import { stepNeedsGridRows } from './grid-prefilter.js';
import type { RoutineStep } from './types.js';

export type ClusterId = 'A' | 'B' | 'C' | 'D';

export interface MinedRoutine {
  id: string;
  modulo: string;
  fase: 1 | 2 | 3 | 0;
  tags: string[];
  status: string;
  tipoBloqueio: string;
  passo: number | null;
  passoTexto: string;
  blockKind: string;
  cluster: ClusterId;
  subcausa: string;
  /** Sinais secundários que também apareceram (ex.: rotina A que também tem grade vazia) */
  sinaisSecundarios: string[];
  evidencia: Record<string, unknown>;
  /** A ação de motor/manual que destrava (ou o motivo de permanecer) */
  acao: string;
  /** Coberta por uma regra de motor da ADR-029 (entra na reauditoria seletiva) */
  destravavel: boolean;
}

const PHASE_OF = (id: string, modulo: string): MinedRoutine['fase'] => {
  if (PHASES[0].specificRoutines?.includes(id)) return 1;
  if (PHASES[1].modules.includes(modulo)) return 2;
  if (PHASES[2].modules.includes(modulo)) return 3;
  return 0;
};

const EXTERNAL_RE = /\b(orion stock|orion estoque|orion caixa|docker|powershell|google chrome|chrome|siscoaf|e-notariado|censec|portal)\b/;

function readStepText(body: string, stepNumber: number | null): string {
  if (stepNumber == null) return '';
  const block = body.split('#### Passo a passo (texto original preservado):')[1] ?? '';
  const line = block.split('\n').find(l => new RegExp(`^${stepNumber}\\. `).test(l));
  return line ? line.replace(/^\d+\.\s*/, '').trim() : '';
}

function pseudoStep(rawText: string): RoutineStep {
  return { rawText, targets: [], stepNumber: 0, routineId: '' } as unknown as RoutineStep;
}

export interface MinerInput {
  rotinasDir: string;
  telemetryDir: string;
  menuTreeFile: string;
}

export interface MinerResult {
  generatedAt: string;
  menuTreeItems: number;
  totals: { analisadas: number; att: number; xrx: number; porCluster: Record<ClusterId, number>; destravaveis: number };
  porFase: Record<string, Record<ClusterId, number>>;
  subcausas: Record<string, number>;
  canonicalTableCheck: Array<{ documented: string; real: string; existsInRealTree: boolean }>;
  routeSynonymCheck: Array<{ route: string; documented: string; real: string[]; seenInRaioX: boolean }>;
  routines: MinedRoutine[];
}

export function mineClusters(input: MinerInput): MinerResult {
  const tree: CanonicalMenuItem[] = fs.existsSync(input.menuTreeFile)
    ? (JSON.parse(fs.readFileSync(input.menuTreeFile, 'utf-8')).items as CanonicalMenuItem[])
    : [];
  const raioXFieldsByRoute = new Map<string, Set<string>>();
  const routines: MinedRoutine[] = [];

  for (const mod of fs.readdirSync(input.rotinasDir)) {
    const modDir = path.join(input.rotinasDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;
    for (const folder of fs.readdirSync(modDir)) {
      const dir = path.join(modDir, folder);
      if (!fs.statSync(dir).isDirectory()) continue;
      const file = fs.readdirSync(dir).find(f => f.endsWith('-revisado.md'));
      if (!file) continue;
      const text = fs.readFileSync(path.join(dir, file), 'utf-8').replace(/\r\n/g, '\n');
      const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
      if (!fm) continue;
      const meta = YAML.parse(fm[1]);
      const ui = meta?.auditoria_ui ?? {};
      const tags: string[] = ui.review_tags ?? [];
      const diag = ui.diagnostico_tela_att;
      // O Raio-X de qualquer rotina alimenta a conferência da tabela de sinônimos por rota
      if (diag?.rota) {
        const key = routeKey(diag.rota);
        const set = raioXFieldsByRoute.get(key) ?? new Set<string>();
        for (const c of diag.campos ?? []) set.add(canonNormalize(c.rotulo));
        for (const b of diag.botoes ?? []) set.add(canonNormalize(b));
        for (const a of diag.abas ?? []) set.add(canonNormalize(typeof a === 'string' ? a : a.rotulo));
        for (const s of diag.secoes ?? []) set.add(canonNormalize(s));
        raioXFieldsByRoute.set(key, set);
      }
      if (!tags.includes('ATT') && !tags.includes('XRX')) continue;

      const body = text.slice(fm[0].length);
      const motivo = (body.match(/> \*\*Motivo Técnico:\*\*([\s\S]*?)\n\n/) || [])[1]?.replace(/\n> ?/g, ' ').trim() ?? '';
      const history = ui.historico_reauditoria?.at(-1)?.bloqueio_atual;
      const passo: number | null = history?.passo ?? (Number((motivo.match(/No passo (\d+)/) || [])[1]) || null);
      const passoTexto = readStepText(body, passo);
      const id: string = meta.id;

      let tele: any[] = [];
      const telFile = path.join(input.telemetryDir, `${id}.json`);
      if (fs.existsSync(telFile)) tele = JSON.parse(fs.readFileSync(telFile, 'utf-8'));
      const blocked = tele.find(e => e.status === 'blocked');
      const blockKind: string = blocked?.blockKind ?? '';
      const emptyState = blocked?.emptyState;

      const signals: string[] = [];
      const evidencia: Record<string, unknown> = {};
      let cluster: ClusterId = 'D';
      let subcausa = 'D1_tela_pressuposta';
      let acao = 'Reescrever o passo do manual (a tela/recurso citado não é alcançável nesta rotina).';
      let destravavel = false;

      const menuPaths = passoTexto ? extractMenuPaths(pseudoStep(passoTexto)) : [];
      const pathMissing = /caminho de menu/.test(motivo);

      // A2: um passo de caminho de menu ANTERIOR foi curado, mas o clique da folha foi omitido
      const skippedNav = tele.find(
        e =>
          e.frame === 'a' &&
          e.status === 'ok' &&
          passo != null &&
          e.stepNum < passo &&
          /não é nenhum dos alvos citados/.test(e.executedAction?.reason ?? '')
      );

      const hasSpuriousTarget = /"\\"|[“"]\\[“"]/.test(motivo) || (diag?.alvos_do_passo ?? []).some((t: string) => !/[\p{L}\p{N}]/u.test(t));
      const correspondencias: any[] = diag?.correspondencias_sugeridas ?? [];
      const needsRows = passoTexto ? stepNeedsGridRows({ rawText: passoTexto, targets: [], subItems: [] }) : false;
      const emptyGrid = !!emptyState?.emptyGrid || /tela está sem dados|grade com \d+ coluna/.test(motivo);

      if (pathMissing && menuPaths.length > 0) {
        cluster = 'A';
        const resolutions = menuPaths.map(p => ({ p, r: tree.length > 0 ? resolveCanonicalMenuPath(p.segments, tree) : null }));
        const hit = resolutions.find(x => x.r);
        evidencia.caminhoDocumentado = menuPaths.map(p => p.segments.join(' > '));
        if (hit?.r) {
          subcausa = hit.r.basis === 'tail_as_screen_section' ? 'A1_tela_real_com_cauda_como_aba' : 'A1_equivalente_canonico_inequivoco';
          evidencia.cadeiaReal = hit.r.chain.join(' > ');
          evidencia.cauda = hit.r.tail;
          evidencia.base = hit.r.basis;
          evidencia.prova = hit.r.evidence;
          acao = `Equivalência canônica (${hit.r.basis}) no motor: ${hit.r.chain.join(' > ')}${hit.r.tail.length ? ` + aba/seção "${hit.r.tail.join(' > ')}"` : ''}; divergência registrada para corrigir o manual.`;
          destravavel = true;
        } else if (menuPaths.some(p => EXTERNAL_RE.test(canonNormalize(p.segments.join(' '))))) {
          subcausa = 'A4_modulo_externo_ao_menu';
          acao = 'O manual descreve outro produto/módulo (fora da barra de menus do Orion TN): atualizar o manual.';
        } else {
          subcausa = tree.length > 0 ? 'A3_sem_equivalente_na_arvore_real' : 'A3_arvore_real_nao_capturada';
          acao = 'Sem destino único e inequívoco na árvore real: permanece `[ATT]` até Produtos confirmar onde a tela fica.';
        }
      } else if (skippedNav) {
        cluster = 'A';
        subcausa = 'A2_rota_curada_com_clique_omitido';
        evidencia.passoNavegacao = skippedNav.stepNum;
        evidencia.motivoOmissao = String(skippedNav.executedAction?.reason ?? '').slice(0, 160);
        acao = 'Correção de motor: a folha de um caminho de menu curado é o nó de navegação e deve ser clicada (ADR-029).';
        destravavel = true;
      } else if (emptyGrid && (tags.includes('XRX') || needsRows || (emptyState?.disabledControls ?? []).length > 0)) {
        cluster = 'B';
        const filtrar = (emptyState?.disabledControls ?? []).find((d: any) => /filtrar|pesquisar|consultar/i.test(d.label));
        subcausa = filtrar ? 'B1_filtrar_desabilitado_aguarda_campos' : 'B2_grade_vazia_sem_busca_acionada';
        evidencia.hash = emptyState?.hash;
        evidencia.cabecalhos = emptyState?.headers;
        evidencia.controlesInativos = emptyState?.disabledControls;
        acao = 'Pré-filtro automático (ADR-029): período amplo/sonda de texto e busca antes de declarar a grade vazia.';
        destravavel = true;
      } else if (hasSpuriousTarget) {
        cluster = 'C';
        subcausa = 'C0_alvo_espurio_de_parser';
        evidencia.alvos = diag?.alvos_do_passo;
        acao = 'Correção de parser: negrito sem letra/número (asterisco de obrigatório) não é alvo (ADR-029).';
        destravavel = true;
      } else if (diag && routeKey(diag.rota) && ROUTE_LABEL_SYNONYMS.some(s => s.route === routeKey(diag.rota))) {
        const alvos: string[] = diag.alvos_do_passo ?? [];
        const syn = ROUTE_LABEL_SYNONYMS.filter(s => s.route === routeKey(diag.rota) && alvos.some(a => canonNormalize(a) === canonNormalize(s.documented)));
        if (syn.length > 0) {
          cluster = 'C';
          subcausa = 'C1_rotulo_renomeado_na_rota';
          evidencia.rota = diag.rota;
          evidencia.sinonimos = syn.map(s => ({ documentado: s.documented, real: s.real }));
          acao = `Sinônimo contextual da rota ${routeKey(diag.rota)} (ADR-029): medido ao vivo e registrado como divergência.`;
          destravavel = true;
        }
      }
      if (cluster === 'D' && correspondencias.length > 0) {
        cluster = 'C';
        subcausa = 'C2_correspondencia_sugerida_sem_regra';
        evidencia.rota = diag?.rota;
        evidencia.correspondencias = correspondencias;
        acao = 'O Raio-X sugere equivalente, mas não é inequívoco (similaridade/seção): revisão humana confirma e vira sinônimo de rota.';
      }

      if (cluster === 'D') {
        if (tags.includes('XRX') && blockKind === 'cross_routine') {
          subcausa = 'D4_depende_de_objeto_criado_em_outra_rotina';
          acao = 'O manual opera sobre um objeto (ex.: protocolo) que outra rotina cria: permanece `[XRX]`.';
        } else if (EXTERNAL_RE.test(canonNormalize(`${passoTexto} ${motivo}`))) {
          subcausa = 'D2_produto_ou_portal_externo';
          acao = 'O passo descreve outro produto/portal/ferramenta: atualizar o manual.';
        } else if (diag?.rota && diag.rota !== '#/inicio') {
          subcausa = 'D3_recurso_removido_ou_movido_na_tela_alcancada';
          evidencia.rota = diag.rota;
          evidencia.alvosSemCorrespondencia = diag.alvos_sem_correspondencia;
          acao = 'A tela foi alcançada e o recurso não existe nela (Raio-X sem correspondência): corrigir o manual.';
        } else {
          subcausa = 'D1_tela_pressuposta_nao_alcancada';
          acao = 'O passo pressupõe uma tela/estado que nenhum passo anterior abre (sem caminho de menu): corrigir o manual.';
        }
      }
      if (emptyGrid && cluster !== 'B') signals.push('grade_vazia');
      if (correspondencias.length > 0 && cluster !== 'C') signals.push('correspondencia_raiox');
      if (skippedNav && cluster !== 'A') signals.push('clique_omitido_em_rota_curada');

      routines.push({
        id,
        modulo: mod,
        fase: PHASE_OF(id, mod),
        tags,
        status: ui.status,
        tipoBloqueio: ui.tipo_bloqueio ?? '',
        passo,
        passoTexto,
        blockKind,
        cluster,
        subcausa,
        sinaisSecundarios: signals,
        evidencia,
        acao,
        destravavel
      });
    }
  }

  const porCluster: Record<ClusterId, number> = { A: 0, B: 0, C: 0, D: 0 };
  const porFase: Record<string, Record<ClusterId, number>> = {};
  const subcausas: Record<string, number> = {};
  for (const r of routines) {
    porCluster[r.cluster]++;
    const f = `fase${r.fase}`;
    porFase[f] = porFase[f] ?? { A: 0, B: 0, C: 0, D: 0 };
    porFase[f][r.cluster]++;
    subcausas[r.subcausa] = (subcausas[r.subcausa] ?? 0) + 1;
  }

  const existsInTree = (real: string[]) =>
    tree.some(i => i.chain.length === real.length && i.chain.every((s, k) => canonNormalize(s) === canonNormalize(real[k])));

  return {
    generatedAt: new Date().toISOString(),
    menuTreeItems: tree.length,
    totals: {
      analisadas: routines.length,
      att: routines.filter(r => r.tags.includes('ATT')).length,
      xrx: routines.filter(r => r.tags.includes('XRX')).length,
      porCluster,
      destravaveis: routines.filter(r => r.destravavel).length
    },
    porFase,
    subcausas,
    canonicalTableCheck: EXPLICIT_MENU_EQUIVALENCES.map(e => ({
      documented: e.documented.join(' > '),
      real: e.real.join(' > '),
      existsInRealTree: existsInTree(e.real)
    })),
    routeSynonymCheck: ROUTE_LABEL_SYNONYMS.map(s => {
      const seen = raioXFieldsByRoute.get(s.route);
      return { route: s.route, documented: s.documented, real: s.real, seenInRaioX: !!seen && s.real.every(r => seen.has(canonNormalize(r))) };
    }),
    routines
  };
}

function printSummary(r: MinerResult): void {
  console.log('\n==================================================================');
  console.log('  MINERAÇÃO DOS BLOQUEIOS [ATT] E [XRX] — CAUSAS RAIZ (ADR-029)');
  console.log('==================================================================');
  console.log(`Rotinas analisadas: ${r.totals.analisadas} ([ATT] ${r.totals.att} | [XRX] ${r.totals.xrx}) | árvore real: ${r.menuTreeItems} itens`);
  const names: Record<ClusterId, string> = {
    A: 'A — Falha de caminho de menu',
    B: 'B — Grade vazia que exige filtro/busca',
    C: 'C — Rótulo renomeado / alvo espúrio',
    D: 'D — Removido / pressuposto / exclusivo de outra rotina'
  };
  for (const c of ['A', 'B', 'C', 'D'] as ClusterId[]) console.log(`  Cluster ${names[c]}: ${r.totals.porCluster[c]}`);
  console.log(`  Destraváveis por regra de motor (ADR-029): ${r.totals.destravaveis}`);
  console.log('\nSubcausas:');
  for (const [k, v] of Object.entries(r.subcausas).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
  console.log('\nPor fase:');
  for (const [k, v] of Object.entries(r.porFase)) console.log(`  ${k}: A=${v.A} B=${v.B} C=${v.C} D=${v.D}`);
  const badEq = r.canonicalTableCheck.filter(c => !c.existsInRealTree);
  console.log(`\nTabela de equivalências de menu: ${r.canonicalTableCheck.length - badEq.length}/${r.canonicalTableCheck.length} destinos existem na árvore real${badEq.length ? ` (AUSENTES: ${badEq.map(b => b.real).join('; ')})` : ''}`);
  const unseen = r.routeSynonymCheck.filter(c => !c.seenInRaioX);
  console.log(`Sinônimos de rota: ${r.routeSynonymCheck.length - unseen.length}/${r.routeSynonymCheck.length} com os rótulos reais vistos no Raio-X${unseen.length ? ` (sem Raio-X: ${unseen.map(u => `${u.route}:${u.documented}`).join('; ')} — comprovados por leitura ao vivo)` : ''}`);
}

function main(): void {
  const root = path.join(config.rootDir, 'auditoria');
  const result = mineClusters({
    rotinasDir: config.outputDir,
    telemetryDir: path.join(root, 'cache', 'kb-telemetry'),
    menuTreeFile: path.join(root, 'cache', 'orion-menu-tree-real.json')
  });
  const out = path.join(root, 'cache', 'att-xrx-cluster-analysis.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(result, null, 1), 'utf-8');
  printSummary(result);
  console.log(`\n✓ Relatório estruturado: ${path.relative(config.rootDir, out)}`);
}

if (process.argv[1] && /mine-att-clusters\.[tj]s$/.test(process.argv[1].replace(/\\/g, '/'))) main();
