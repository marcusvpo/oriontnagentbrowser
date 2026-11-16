/**
 * Autonomia Condicional de Criação de Registro Mock — `auto-seed-mock` (ADR-021 §3).
 *
 * Gatilho (e só ele): a tela do passo é uma grade VAZIA e existe um botão Adicionar/Novo/Cadastrar ativo
 * na mesma tela. Com grade já populada nada é gravado (comportamento anterior preservado).
 *
 * Ciclo: Adicionar -> inspeciona e preenche os campos visíveis com valores válidos de teste -> Salvar
 * (autorizado mesmo com `--dry-run-mutations`; a Trava de Mutação segue valendo para o resto da rotina)
 * -> volta à grade. Cada registro é marcado `AUDIT-MOCK`, vai para a telemetria e para o `-revisado.md`.
 *
 * Limites de segurança: só aciona os dois nós carimbados por este módulo (abrir cadastro e gravar);
 * nunca Excluir/Inativar; um ciclo por tela e por rotina; execução serializada entre workers.
 */
import type { AgentBrowserClient } from './browser.js';
import { NAV_ZONE_SELECTOR } from './dom-geometry.js';
import { ACTIVE_MODAL_SELECTOR } from './modal-scope.js';
import { countGridRows } from './empty-state.js';
import { generateMockFieldValue } from './mock-generator.js';
import { dismissTopModal } from './reveal-explorer.js';
import type { EmptyStateEvidence, SeededRecord } from './types.js';

// Seletores de atributo com valor perdem as aspas no agent-browser/Windows (ADR-020): só atributos SEM valor
const FIELD_STAMP = 'data-orion-seed-field';
const fieldSel = (idx: number) => `[${FIELD_STAMP}-${idx}]`;
const COMMIT_STAMP = 'data-orion-seed-commit';
const OPTION_STAMP = 'data-orion-seed-option';

/** Botões de gravação aceitos como fim do cadastro (texto inteiro do controle). */
const COMMIT_TEXT_SOURCE = '^(salvar|gravar|concluir|confirmar|cadastrar)$';

/** Contexto comum dos scripts: raiz (modal aberto ou documento) e utilitários. */
const PRELUDE = `
  const NAV = ${JSON.stringify(NAV_ZONE_SELECTOR)};
  const clean = t => String(t == null ? '' : t).replace(/\\s+/g, ' ').trim();
  const norm = t => clean(t).normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
  const vis = e => { if (!e || !e.getBoundingClientRect) return false; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const MODAL = ${JSON.stringify(ACTIVE_MODAL_SELECTOR)};
  const modals = Array.from(document.querySelectorAll(MODAL)).filter(vis);
  // Raiz = modal visível mais externo: cobre o formulário inteiro, inclusive diálogos aninhados
  const root = modals.length > 0 ? modals[0] : document;
`;

interface ScannedField {
  idx: number;
  tag: 'input' | 'textarea' | 'select' | 'ngselect';
  type: string;
  label: string;
  placeholder: string;
  name: string;
  maxLength: number;
  required: boolean;
  empty: boolean;
}

async function scanFields(client: AgentBrowserClient): Promise<ScannedField[]> {
  const fields = await client.evalJson<ScannedField[]>(`
    (() => {
      ${PRELUDE}
      for (let i = 0; i < 60; i++) document.querySelectorAll('[${FIELD_STAMP}-' + i + ']').forEach(e => e.removeAttribute('${FIELD_STAMP}-' + i));
      const SKIP_TYPES = ['hidden', 'file', 'button', 'submit', 'checkbox', 'radio', 'image', 'reset', 'range', 'color'];
      const labelOf = el => {
        if (el.id) { const l = root.querySelector('label[for="' + CSS.escape(el.id) + '"]'); if (l) return clean(l.innerText || l.textContent); }
        const wrap = el.closest('label'); if (wrap) return clean(wrap.innerText || wrap.textContent);
        const grp = el.closest('.form-group, .field, .form-field, [class*="col-"]');
        const l2 = grp && grp.querySelector('label'); if (l2) return clean(l2.innerText || l2.textContent);
        return clean(el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('name') || '');
      };
      const out = [];
      let idx = 0;
      for (const el of root.querySelectorAll('input, textarea, select, ng-select, .ng-select')) {
        if (!vis(el) || el.closest(NAV) || el.closest('thead, table, [role="grid"]')) continue;
        const tagName = el.tagName.toLowerCase();
        const isNg = tagName === 'ng-select' || el.classList.contains('ng-select');
        // Campo interno de um ng-select e ng-select aninhado: só o invólucro externo conta
        if (!isNg && el.closest('ng-select, .ng-select')) continue;
        if (isNg && el.parentElement && el.parentElement.closest('ng-select, .ng-select')) continue;
        if (!isNg && (el.disabled || el.readOnly)) continue;
        if (isNg && (el.classList.contains('ng-select-disabled') || el.getAttribute('aria-disabled') === 'true')) continue;
        const type = isNg ? 'ngselect' : (el.getAttribute('type') || (tagName === 'input' ? 'text' : tagName)).toLowerCase();
        if (SKIP_TYPES.includes(type)) continue;
        const label = labelOf(el);
        const grp = el.closest('.form-group, .field, [class*="col-"]');
        const labelEl = grp && grp.querySelector('label');
        const required = /\\*\\s*$/.test(label) || !!el.required || el.getAttribute('aria-required') === 'true' || (labelEl && labelEl.classList.contains('required')) || (grp && grp.classList.contains('required'));
        let empty;
        if (isNg) empty = !el.querySelector('.ng-value, .ng-value-label');
        else if (tagName === 'select') empty = el.selectedIndex <= 0 || !el.value;
        else empty = !String(el.value || '').trim();
        el.setAttribute('${FIELD_STAMP}-' + idx, '');
        out.push({
          idx, tag: isNg ? 'ngselect' : tagName, type, label: label.replace(/[\\s*:]+$/, ''),
          placeholder: clean(el.getAttribute('placeholder') || ''), name: clean(el.getAttribute('name') || el.getAttribute('formcontrolname') || ''),
          maxLength: el.maxLength > 0 && el.maxLength < 100000 ? el.maxLength : 0, required: !!required, empty
        });
        idx++;
      }
      return JSON.stringify(out.slice(0, 40));
    })()
  `);
  return fields || [];
}

/** Escolhe a primeira opção válida de um <select> nativo e dispara os eventos do Angular. */
async function pickNativeOption(client: AgentBrowserClient, idx: number): Promise<string | null> {
  const res = await client.evalJson<{ text: string | null }>(`
    (() => {
      const el = document.querySelector('[${FIELD_STAMP}-${idx}]');
      if (!el || el.tagName !== 'SELECT') return JSON.stringify({ text: null });
      const i = Array.from(el.options).findIndex((o, n) => n > 0 && !o.disabled && String(o.value).trim() !== '' && o.value !== 'null' && o.value !== 'undefined');
      if (i < 0) return JSON.stringify({ text: null });
      el.selectedIndex = i;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return JSON.stringify({ text: (el.options[i].text || '').trim() });
    })()
  `);
  return res?.text ?? null;
}

/** Abre um ng-select e escolhe a primeira opção habilitada com cliques reais. */
async function pickNgOption(client: AgentBrowserClient, idx: number): Promise<string | null> {
  try {
    await client.click(`${fieldSel(idx)} .ng-select-container`);
  } catch {
    return null;
  }
  await client.wait(500);
  const optRes = await client.evalJson<{ text: string | null }>(`
    (() => {
      ${PRELUDE}
      document.querySelectorAll('[${OPTION_STAMP}]').forEach(e => e.removeAttribute('${OPTION_STAMP}'));
      const opt = Array.from(document.querySelectorAll('.ng-dropdown-panel .ng-option, .ng-option')).find(o => vis(o) && !o.classList.contains('ng-option-disabled') && clean(o.innerText));
      if (!opt) return JSON.stringify({ text: null });
      opt.setAttribute('${OPTION_STAMP}', '');
      return JSON.stringify({ text: clean(opt.innerText) });
    })()
  `);
  const text = optRes?.text ?? null;
  if (!text) return null;
  try {
    await client.click(`[${OPTION_STAMP}]`);
  } catch {
    return null;
  }
  await client.wait(500);
  return text;
}

interface FillSummary {
  filled: SeededRecord['fields'];
  /** Campos obrigatórios que continuaram vazios */
  missingRequired: string[];
}

/** Preenche os campos vazios em até 3 passadas (selects dependentes, ex.: UF -> Cidade, abrem novas opções). */
async function fillForm(client: AgentBrowserClient, already: SeededRecord['fields']): Promise<FillSummary> {
  const filled: SeededRecord['fields'] = [...already];
  const attempted = new Set(already.map(f => f.label));
  for (let pass = 0; pass < 3; pass++) {
    const fields = await scanFields(client);
    const todo = fields.filter(f => f.empty && !attempted.has(f.label || `#${f.idx}`));
    if (todo.length === 0) break;
    let reloaded = false;
    for (const f of todo) {
      const key = f.label || `#${f.idx}`;
      attempted.add(key);
      const sel = fieldSel(f.idx);
      try {
        if (f.tag === 'select') {
          const chosen = await pickNativeOption(client, f.idx);
          if (chosen) {
            filled.push({ label: key, value: chosen, kind: 'select' });
            reloaded = true;
          }
        } else if (f.tag === 'ngselect') {
          const chosen = await pickNgOption(client, f.idx);
          if (chosen) {
            filled.push({ label: key, value: chosen, kind: 'select' });
            reloaded = true;
          }
        } else {
          const { kind, value } = generateMockFieldValue({
            label: f.label,
            inputType: f.type,
            placeholder: f.placeholder,
            name: f.name,
            maxLength: f.maxLength
          });
          await client.fill(sel, value);
          filled.push({ label: key, value, kind });
        }
      } catch (err: any) {
        console.warn(`   [Auto-Seed] Campo "${key}" não preenchido: ${String(err.message).slice(0, 100)}`);
      }
    }
    if (reloaded) await client.wait(700);
  }
  const after = await scanFields(client);
  return { filled, missingRequired: after.filter(f => f.required && f.empty).map(f => f.label || `#${f.idx}`) };
}

interface CommitProbe {
  found: boolean;
  disabled?: boolean;
  label?: string;
}

/** Localiza e carimba o botão de gravação do formulário aberto. */
async function stampCommitButton(client: AgentBrowserClient): Promise<CommitProbe> {
  const probe = await client.evalJson<CommitProbe>(`
    (() => {
      ${PRELUDE}
      document.querySelectorAll('[${COMMIT_STAMP}]').forEach(e => e.removeAttribute('${COMMIT_STAMP}'));
      const RE = new RegExp(${JSON.stringify(COMMIT_TEXT_SOURCE)});
      const order = ['salvar', 'gravar', 'concluir', 'confirmar', 'cadastrar'];
      const btns = Array.from(root.querySelectorAll('button, a.btn, input[type="submit"], input[type="button"]'))
        .filter(b => vis(b) && !b.closest(NAV) && RE.test(norm(b.innerText || b.textContent || b.getAttribute('value') || '')));
      if (btns.length === 0) return JSON.stringify({ found: false });
      btns.sort((a, b) => order.indexOf(norm(a.innerText || a.getAttribute('value'))) - order.indexOf(norm(b.innerText || b.getAttribute('value'))));
      const b = btns.find(x => !(x.disabled || x.getAttribute('aria-disabled') === 'true' || x.classList.contains('disabled')));
      if (!b) return JSON.stringify({ found: true, disabled: true, label: clean(btns[0].innerText || btns[0].getAttribute('value')) });
      b.setAttribute('${COMMIT_STAMP}', '');
      return JSON.stringify({ found: true, disabled: false, label: clean(b.innerText || b.getAttribute('value')) });
    })()
  `);
  return probe ?? { found: false };
}

interface PostCommit {
  formOpen: boolean;
  errors: string[];
  hash: string;
}

/** Estado após o Salvar: formulário ainda aberto? mensagens de validação visíveis? */
async function readPostCommit(client: AgentBrowserClient): Promise<PostCommit> {
  const res = await client.evalJson<PostCommit>(`
    (() => {
      ${PRELUDE}
      const errs = Array.from(root.querySelectorAll('.has-error, .invalid-feedback, .help-block.error, .text-danger, .alert-danger, .ng-invalid.ng-touched, .error-message'))
        .filter(e => vis(e) && !e.closest(NAV))
        .map(e => clean(e.innerText || e.textContent || e.getAttribute('name') || 'campo inválido').slice(0, 100))
        .filter(Boolean);
      const formOpen = modals.length > 0 || !!document.querySelector('[${COMMIT_STAMP}]') && vis(document.querySelector('[${COMMIT_STAMP}]'));
      return JSON.stringify({ formOpen, errors: Array.from(new Set(errs)).slice(0, 8), hash: window.location.hash || '' });
    })()
  `);
  return res ?? { formOpen: false, errors: [], hash: '' };
}

/** Confirma o diálogo "Deseja salvar?" (Sim/OK) que o Orion abre depois do Salvar, se existir. */
async function confirmDialogIfAny(client: AgentBrowserClient): Promise<boolean> {
  const stamped = await client.evalJson<boolean>(`
    (() => {
      ${PRELUDE}
      document.querySelectorAll('[${OPTION_STAMP}]').forEach(e => e.removeAttribute('${OPTION_STAMP}'));
      const dialogs = Array.from(document.querySelectorAll('.swal2-popup, .swal-modal, .bootbox, .sweet-alert, .confirm-dialog, .modal-dialog')).filter(vis);
      const dlg = dialogs[dialogs.length - 1];
      if (!dlg) return JSON.stringify(false);
      const yes = Array.from(dlg.querySelectorAll('button')).find(b => vis(b) && ['sim', 'ok', 'confirmar'].includes(norm(b.innerText || b.textContent)) && !b.disabled);
      if (!yes) return JSON.stringify(false);
      yes.setAttribute('${OPTION_STAMP}', '');
      return JSON.stringify(true);
    })()
  `);
  if (!stamped) return false;
  try {
    await client.click(`[${OPTION_STAMP}]`);
    await client.wait(1500);
    return true;
  } catch {
    return false;
  }
}

export interface SeedOutcome {
  seeded: boolean;
  record?: SeededRecord;
  /** Motivo quando o ciclo foi abortado (vira evidência do bloqueio) */
  reason?: string;
}

// Serializa os ciclos entre workers: o seed grava no banco e não pode competir por locks (Golden Rule 8)
let seedChain: Promise<unknown> = Promise.resolve();
const serialized = <T>(fn: () => Promise<T>): Promise<T> => {
  const run = seedChain.then(fn, fn);
  seedChain = run.catch(() => undefined);
  return run;
};

async function returnToGrid(client: AgentBrowserClient, originHash: string): Promise<void> {
  try {
    await dismissTopModal(client);
  } catch {}
  const cur = await client.evalJson<{ hash: string }>(`JSON.stringify({ hash: window.location.hash || '' })`);
  if (originHash && cur?.hash !== originHash) {
    await client.jumpHash(originHash);
    await client.wait(1500);
  }
}

/**
 * Executa o ciclo de criação de um registro mock a partir da grade vazia. Só deve ser chamado com
 * evidência de grade vazia e botão Adicionar ativo (`state.addButton`).
 */
export function autoSeedMockRecord(
  client: AgentBrowserClient,
  state: EmptyStateEvidence,
  stepNumber: number
): Promise<SeedOutcome> {
  return serialized(async (): Promise<SeedOutcome> => {
    const add = state.addButton;
    if (!add) return { seeded: false, reason: 'Nenhum botão Adicionar/Novo ativo na tela.' };
    const originHash = state.hash || '';
    console.log(`   🌱 [Auto-Seed] Grade vazia com "${add.label}" ativo: criando registro mock de pré-requisito (AUDIT-MOCK).`);

    try {
      await client.click(add.selector);
      await client.wait(1500);

      let fill = await fillForm(client, []);
      let commit = await stampCommitButton(client);
      if (!commit.found) {
        await returnToGrid(client, originHash);
        return { seeded: false, reason: 'O formulário de cadastro não exibiu botão Salvar/Gravar/Concluir.' };
      }
      if (commit.disabled) {
        await returnToGrid(client, originHash);
        return {
          seeded: false,
          reason: `"${commit.label}" permaneceu desabilitado após o preenchimento${fill.missingRequired.length ? ` (obrigatórios vazios: ${fill.missingRequired.join(', ')})` : ''}.`
        };
      }

      let post: PostCommit = { formOpen: true, errors: [], hash: originHash };
      for (let attempt = 0; attempt < 2; attempt++) {
        console.log(`   🌱 [Auto-Seed] Gravando registro mock em "${commit.label}" (autorizado; ${fill.filled.length} campo(s) preenchido(s)).`);
        await client.click(`[${COMMIT_STAMP}]`);
        await client.wait(2000);
        await confirmDialogIfAny(client);
        post = await readPostCommit(client);
        if (!post.formOpen && post.errors.length === 0) break;
        if (post.errors.length === 0) break; // formulário em tela sem erro: provável rota de formulário; segue
        // Validação recusou: uma segunda passada preenche o que a tela marcou como inválido
        fill = await fillForm(client, fill.filled);
        commit = await stampCommitButton(client);
        if (!commit.found || commit.disabled) break;
      }

      if (post.errors.length > 0 && post.formOpen) {
        await returnToGrid(client, originHash);
        return { seeded: false, reason: `A tela recusou o cadastro mock: ${post.errors.join(' | ')}` };
      }

      await returnToGrid(client, originHash);
      await client.wait(1200);
      const rows = await countGridRows(client);
      const record: SeededRecord = {
        stepNumber,
        route: originHash,
        addButton: add.label,
        commitButton: commit.label || 'Salvar',
        fields: fill.filled,
        rowsAfter: rows,
        createdAt: new Date().toISOString()
      };
      console.log(`   🌱 [Auto-Seed] Registro mock gravado. Linhas na grade agora: ${rows < 0 ? 'sem grade' : rows}.`);
      return { seeded: true, record };
    } catch (err: any) {
      try {
        await returnToGrid(client, originHash);
      } catch {}
      return { seeded: false, reason: `Falha técnica no ciclo de seed: ${String(err.message).slice(0, 160)}` };
    }
  });
}

/**
 * A rotina precisa de registro existente? Evita gravar mock em rotina de cadastro puro, cujos passos nunca
 * consultam, alteram ou filtram uma linha da grade.
 */
export function routineNeedsExistingRows(stepTexts: string[]): boolean {
  const norm = (t: string) =>
    t
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  return stepTexts.some(t =>
    /\b(editar|alterar|consultar|visualizar|excluir|remover|inativar|filtrar|filtre|pesquis\w*|localiz\w*|linha|registro cadastrado|desejad[oa])\b/.test(norm(t))
  );
}
