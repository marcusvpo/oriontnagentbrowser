import fs from 'node:fs';
import path from 'node:path';
import { AgentBrowserClient } from './browser.js';
import { config } from './config.js';

/**
 * Garante que a sessão está autenticada com Zero Login Overhead (ADR-009).
 * Se o arquivo de sessão existir e for válido, reaproveita imediatamente sem refazer login.
 */
export async function ensureAuthenticated(client: AgentBrowserClient): Promise<boolean> {
  const sessionDir = path.dirname(config.sessionFile);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
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

      // Checa se já está dentro da aplicação (navbar visível ou sem redirecionamento para #/login)
      const isAuth = await client.eval(`
        (() => {
          const hash = window.location.hash || '';
          const hasNavbar = !!document.querySelector('.navbar, #navbar, a:has-text("Firmas")');
          return !hash.includes('/login') && (hasNavbar || hash.includes('/inicio'));
        })()
      `);

      if (isAuth === 'true') {
        console.log('✓ [Auth] Sessão existente ativa e válida! Pulando 100% do fluxo de login (Zero Login Overhead).');
        return true;
      }
    } catch (e: any) {
      console.log(`[Auth] Sessão prévia expirada ou inválida. Refazendo autenticação...`);
    }
  }

  return loginOrion(client);
}

export async function loginOrion(client: AgentBrowserClient): Promise<boolean> {
  if (!config.homologUrl || !config.user || !config.pass) {
    throw new Error('ORION_HOMOLOG_URL, ORION_USER e ORION_PASS devem estar configurados em auditoria/.env');
  }
  const portalLoginUrl = config.homologUrl;
  console.log(`[Auth] Iniciando autenticação no Portal Orion: ${portalLoginUrl}`);
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
