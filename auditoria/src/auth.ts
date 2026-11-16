import fs from 'node:fs';
import path from 'node:path';
import { AgentBrowserClient } from './browser.js';
import { config } from './config.js';

/**
 * Contadores de autenticação do processo (ADR-024). O resumo do lote e os logs usam estes números para
 * provar que rotinas em sequência não repetiram o login WildFly SSO sem necessidade.
 */
const stats = { loginsPerformed: 0, sessionsReused: 0, lightResets: 0, fullResets: 0 };
export const authStats = () => ({ ...stats });
export const noteLightReset = () => {
  stats.lightResets++;
};
export const noteFullReset = () => {
  stats.fullResets++;
};

/** Onde a página aberta está, do ponto de vista da sessão. */
export interface SessionProbe {
  /** Sessão autenticada reconhecida na própria página (sem navegar, sem recarregar) */
  active: boolean;
  /** `portal`: `/webPortal`; `orion_tn`: `/webFirmas`; `login`: tela de login; `unknown`: outra página/aba em branco */
  where: 'portal' | 'orion_tn' | 'login' | 'unknown';
  url: string;
  hash: string;
  reason: string;
}

/**
 * Verificação rápida de sessão ativa no DOM/URL (ADR-024): a página está em `/webPortal` ou `/webFirmas`,
 * o menu "Olá, ..." está visível e NÃO há campos de login (`#username`/`#password`/`input[type=password]`).
 * Só lê a página atual: não abre URL, não recarrega e não preenche nada. Se a página não responde, a
 * sessão simplesmente não é considerada ativa (quem chama segue o fluxo completo).
 */
export async function isSessionActiveInPage(client: AgentBrowserClient): Promise<SessionProbe> {
  const unknown: SessionProbe = { active: false, where: 'unknown', url: '', hash: '', reason: 'Página sem resposta' };
  try {
    const probe = await client.evalJson<SessionProbe>(`
      (() => {
        const vis = e => {
          const r = e.getBoundingClientRect();
          const s = window.getComputedStyle(e);
          return r.width > 1 && r.height > 1 && s.display !== 'none' && s.visibility !== 'hidden';
        };
        const url = window.location.href || '';
        const hash = window.location.hash || '';
        const inPortal = /\\/webPortal/i.test(url);
        const inApp = /\\/webFirmas/i.test(url);
        const onLogin = /\\/login/i.test(url) || /#\\/login/i.test(hash);
        const loginFields = Array.from(document.querySelectorAll('#username, #password, input[type="password"]')).filter(vis).length;
        const greeting = Array.from(document.querySelectorAll('body a, body button, body span, body li, body p')).some(e => {
          if (e.children.length > 4 || !vis(e)) return false;
          const t = String(e.innerText || '').trim();
          return t.length < 90 && /^Ol[áa],\\s*\\S/i.test(t);
        });
        const where = onLogin || loginFields > 0 ? 'login' : inPortal ? 'portal' : inApp ? 'orion_tn' : 'unknown';
        const active = (inPortal || inApp) && !onLogin && loginFields === 0 && greeting;
        const reason = active
          ? 'Menu "Olá, ..." visível, sem campos de login'
          : loginFields > 0 || onLogin
            ? 'Tela de login'
            : !(inPortal || inApp)
              ? 'Página fora do Orion TN/portal'
              : 'Menu "Olá, ..." não encontrado';
        return JSON.stringify({ active, where, url, hash, reason });
      })()
    `);
    return probe ?? unknown;
  } catch {
    return unknown;
  }
}

/**
 * Garante que a sessão está autenticada com Zero Login Overhead (ADR-009, ADR-024).
 * 1. Página já autenticada (`isSessionActiveInPage`): reaproveita na hora, sem abrir URL nem logar.
 * 2. Arquivo de sessão válido: carrega o estado e confere a aplicação.
 * 3. Só então o fluxo completo de login (WildFly SSO).
 */
export async function ensureAuthenticated(client: AgentBrowserClient): Promise<boolean> {
  const sessionDir = path.dirname(config.sessionFile);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }

  const live = await isSessionActiveInPage(client);
  if (live.active) {
    stats.sessionsReused++;
    console.log(`✓ [Auth] Sessão ativa na própria página (${live.where}); login e recarga dispensados (${live.reason}).`);
    return true;
  }

  // Se já temos sessão salva, tenta carregá-la primeiro
  if (fs.existsSync(config.sessionFile)) {
    if (!config.appHomeUrl) {
      throw new Error('ORION_HOMOLOG_URL / ORION_APP_HOME_URL não configurados em auditoria/.env');
    }
    try {
      console.log(`[Auth] Carregando sessão prévia de: ${config.sessionFile}`);
      await client.stateLoad(config.sessionFile);
      await client.open(config.appHomeUrl);
      await client.wait(1500);

      // Checa se a sessão carregada já está dentro da aplicação. (ADR-024: a checagem anterior usava o seletor
      // Playwright `a:has-text("Firmas")` dentro de `querySelector`, que lança exceção no DOM; a exceção caía
      // no `catch` abaixo e TODA execução refazia o login mesmo com a sessão válida.)
      const loaded = await isSessionActiveInPage(client);
      if (loaded.active) {
        stats.sessionsReused++;
        console.log(`✓ [Auth] Sessão existente ativa e válida (${loaded.where})! Pulando 100% do fluxo de login (Zero Login Overhead).`);
        return true;
      }
      console.log(`[Auth] Sessão carregada não está autenticada (${loaded.reason}).`);
    } catch (e: any) {
      console.log(`[Auth] Sessão prévia expirada ou inválida. Refazendo autenticação...`);
    }
  }

  return loginOrion(client);
}

/**
 * Login WildFly SSO no Portal Orion. Antes de qualquer navegação, confere se a página já está autenticada
 * (ADR-024): nesse caso só persiste o estado e devolve `true`. `force` ignora a verificação (renovação explícita).
 */
export async function loginOrion(client: AgentBrowserClient, opts: { force?: boolean } = {}): Promise<boolean> {
  if (!opts.force) {
    const live = await isSessionActiveInPage(client);
    if (live.active) {
      stats.sessionsReused++;
      console.log(`✓ [Auth] Sessão já autenticada na página (${live.where}); login redundante evitado.`);
      try {
        await client.stateSave(config.sessionFile);
      } catch {}
      return true;
    }
  }

  if (!config.homologUrl || !config.user || !config.pass) {
    throw new Error('ORION_HOMOLOG_URL, ORION_USER e ORION_PASS devem estar configurados em auditoria/.env');
  }
  const portalLoginUrl = config.homologUrl;
  stats.loginsPerformed++;
  console.log(`[Auth] Iniciando autenticação no Portal Orion (login #${stats.loginsPerformed} neste processo): ${portalLoginUrl}`);
  console.log(`[Auth] Usuário: ${config.user}`);

  // 1. Abrir a página oficial de login do Portal
  await client.open(portalLoginUrl);
  await client.wait(3000); // Aguarda carregamento do SPA

  // 2. Travar Viewport e DPR 1.0 (ADR-009)
  await client.setViewport(config.viewportWidth, config.viewportHeight);

  // 3. Estratégia de preenchimento dos campos de login compatível com AngularJS
  try {
    await client.eval(`
      (() => {
        const u = document.querySelector('input[type=text], input[name*="user" i], #user');
        const p = document.querySelector('input[type=password], #pass');
        if (u) {
          u.focus();
          u.value = ${JSON.stringify(config.user)};
          u.dispatchEvent(new Event('input', { bubbles: true }));
          u.dispatchEvent(new Event('change', { bubbles: true }));
          u.blur();
        }
        if (p) {
          p.focus();
          p.value = ${JSON.stringify(config.pass)};
          p.dispatchEvent(new Event('input', { bubbles: true }));
          p.dispatchEvent(new Event('change', { bubbles: true }));
          p.blur();
        }
        const btn = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent && b.textContent.includes('ENTRAR')) || document.querySelector('#submit');
        if (btn) {
          btn.disabled = false;
          btn.click();
        }
      })()
    `);

    console.log('[Auth] Credenciais enviadas. Aguardando transição de rota do SPA...');
    await client.wait(4000);

    // 4. Se estiver no webPortal pós-login, clicar no card do módulo 'Orion TN'
    const curUrl = await client.eval('window.location.href');
    console.log('[Auth] URL atual pós-login:', curUrl);

    if (curUrl.includes('webPortal')) {
      console.log('[Auth] Clicando no card do módulo Orion TN...');
      await client.eval(`
        (() => {
          const cards = Array.from(document.querySelectorAll('div, a, span, p')).filter(el => el.textContent && el.textContent.trim() === 'Orion TN');
          if (cards.length > 0) {
            cards[cards.length - 1].click();
          }
        })()
      `);
      await client.wait(4500);
    }

    const finalUrl = await client.eval('window.location.href');
    console.log('[Auth] URL final no módulo:', finalUrl);

    // 5. Salvar estado da sessão para reaproveitamento nas próximas rotinas
    try {
      await client.stateSave(config.sessionFile);
      console.log(`✓ [Auth] Sessão autenticada persistida com sucesso em: ${config.sessionFile}`);
    } catch (saveErr: any) {
      console.warn(`[Auth] Aviso ao persistir estado da sessão: ${saveErr.message} (prosseguindo normalmente)`);
    }
    return true;
  } catch (err: any) {
    console.warn(`[Auth] Erro durante preenchimento: ${err.message}`);
    return false;
  }
}
