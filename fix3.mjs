import fs from 'node:fs';
const f = 'auditoria/src/auth.ts';
let s = fs.readFileSync(f, 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 80)); s = s.replace(a, b); };

rep(`import { config, persistDiscoveredAppHome } from './config.js';`,
`import { config, DEFAULT_PORTAL_PRODUCT, persistDiscoveredAppHome, portalProductsUrl, type PortalProductName } from './config.js';`);

rep(`/** Path do módulo Orion TN descoberto (ex.: \`/webFirmas\`), para o teste de sessão ativa aceitar outro contexto (ADR-025). */
function discoveredModulePath(): string {`,
`/** Path do módulo do produto ativo descoberto (ex.: \`/webFirmas\`), para o teste de sessão ativa aceitar outro contexto (ADR-025). */
export function discoveredModulePath(): string {`);

rep(`        const modulePath = \${JSON.stringify(discoveredModulePath())};
        const inApp = /\\/webFirmas/i.test(url) || (modulePath !== '' && url.indexOf(modulePath) !== -1 && !inPortal);`,
`        const modulePath = \${JSON.stringify(discoveredModulePath())};
        // Fase 4: com --product "Orion Caixa"/"Orion Estoque", só o módulo do produto ativo conta como sessão no
        // módulo; uma página aberta em /webFirmas (Orion TN) não pode ser confundida com o Caixa ou o Estoque.
        const tnProduct = \${JSON.stringify(config.portalProduct === DEFAULT_PORTAL_PRODUCT)};
        const inModule = modulePath !== '' && url.indexOf(modulePath) !== -1 && !inPortal;
        const inApp = tnProduct ? /\\/webFirmas/i.test(url) || inModule : inModule;`);

// ensureAuthenticated: produto sem URL descoberta passa pelo card do Portal
rep(`  // Se já temos sessão salva, tenta carregá-la primeiro
  if (fs.existsSync(config.sessionFile)) {`,
`  // Fase 4: Orion Caixa/Estoque ainda sem URL do módulo descoberta. Com sessão salva, entra pelo card do Portal
  // reaproveitando o SSO (sem login); sem sessão, o login completo também passa pelo card.
  if (!config.appHomeUrl && config.portalProduct !== DEFAULT_PORTAL_PRODUCT) {
    if (fs.existsSync(config.sessionFile)) {
      try {
        await client.stateLoad(config.sessionFile);
        await client.open(portalProductsUrl());
        await client.wait(2500);
        const atPortal = await isSessionActiveInPage(client);
        if (atPortal.active && atPortal.where === 'portal') {
          const ok = await openPortalProductCard(client, config.portalProduct);
          if (ok && config.appHomeUrl) {
            stats.sessionsReused++;
            try {
              await client.stateSave(config.sessionFile);
            } catch {}
            return true;
          }
        }
      } catch {
        // segue para o login completo
      }
    }
    return loginOrion(client, { force: true });
  }

  // Se já temos sessão salva, tenta carregá-la primeiro
  if (fs.existsSync(config.sessionFile)) {`);

// loginOrion: bloco do card + persistência
const start = s.indexOf(`    // 4. Se estiver no webPortal pós-login`);
const end = s.indexOf(`    // 5. Salvar estado da sessão`);
if (start < 0 || end < 0) throw new Error('login block not found');
s = s.slice(0, start) + `    // 4. Se estiver no webPortal pós-login (\`#/produtos\` ou \`#/inicio\` do portal), clicar no card do produto
    // ativo (\`--product\`, padrão 'Orion TN'). O card pode abrir o módulo numa NOVA guia (ADR-025).
    const curUrl = await client.eval('window.location.href');
    console.log('[Auth] URL atual pós-login:', maskUrlHost(String(curUrl)));

    if (String(curUrl).includes('webPortal')) {
      await openPortalProductCard(client, config.portalProduct);
    } else {
      persistModuleHome(String(await client.eval('window.location.href')));
    }

` + s.slice(end);

// helpers ao final
s += `
/** Mascara o host da URL nos logs (\`http://10.0.3.x:porta/...\`): nenhum IP interno completo no console. */
function maskUrlHost(url: string): string {
  return url.replace(/^"|"$/g, '').replace(/(\/\/\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}/, '$1.x');
}

/**
 * URL inicial do módulo a persistir a partir da URL de pouso após o card do Portal (pura; testes offline).
 * Orion TN: \`<origem><path>/#/inicio\` (comportamento da ADR-025). Orion Caixa/Estoque: a própria URL de
 * pouso (origem + path + hash real), sem derivar \`/webFirmas\` nem supor \`#/inicio\`. Portal ou URL
 * ilegível devolvem \`''\`.
 */
export function moduleHomeFromLanding(landingUrl: string, product: PortalProductName): string {
  try {
    const final = new URL(String(landingUrl).replace(/^"|"$/g, ''));
    if (/webPortal/i.test(final.pathname) || !/^https?:$/.test(final.protocol)) return '';
    const base = \`\${final.origin}\${final.pathname.replace(/\/+$/, '')}\`;
    if (product === DEFAULT_PORTAL_PRODUCT) return \`\${base}/#/inicio\`;
    return \`\${base}/\${final.hash || ''}\`;
  } catch {
    return '';
  }
}

function persistModuleHome(landingUrl: string): void {
  const home = moduleHomeFromLanding(landingUrl, config.portalProduct);
  if (!home) return;
  persistDiscoveredAppHome(home);
  try {
    console.log(\`[Auth] URL inicial do módulo \${config.portalProduct} descoberta e persistida (\${new URL(home).pathname}\${new URL(home).hash}).\`);
  } catch {}
}

/**
 * Clica no card do produto em \`/webPortal/#/produtos\` (Orion TN, Orion Caixa ou Orion Estoque), detecta a
 * nova guia pelo diff de \`tab list\` (ADR-025), fecha a do portal, reaplica o viewport e persiste a URL real
 * do módulo em \`config.appHomeFile\`. Devolve \`true\` quando a página saiu do portal para o módulo.
 */
export async function openPortalProductCard(client: AgentBrowserClient, product: PortalProductName): Promise<boolean> {
  console.log(\`[Auth] Clicando no card do produto \${product} no Portal Orion...\`);
  const portalTab = await client.markPrimaryTab();
  let clicked = false;
  const { openedTab } = await client.withNewTabDetection(async () => {
    const raw = await client.eval(\`
      (() => {
        const want = \${JSON.stringify(product)};
        const cards = Array.from(document.querySelectorAll('div, a, span, p, h1, h2, h3, h4, h5')).filter(el => el.textContent && el.textContent.trim() === want);
        if (cards.length === 0) return 'none';
        const card = cards[cards.length - 1];
        (card.closest('a, [ng-click], [onclick], button') || card).click();
        return 'clicked';
      })()
    \`);
    clicked = String(raw).includes('clicked');
    await client.wait(4500);
  });
  if (!clicked) {
    console.warn(\`[Auth] Card "\${product}" não encontrado no Portal Orion.\`);
    return false;
  }
  if (openedTab) {
    console.log(\`[Auth] O módulo abriu em nova guia (\${openedTab.tabId}); a guia do portal será fechada.\`);
    if (portalTab && portalTab !== openedTab.tabId) {
      await client.closeTab(portalTab).catch(() => undefined);
      await client.switchTab(openedTab.tabId).catch(() => undefined);
    }
    client.setPrimaryTab(openedTab.tabId);
  }
  await client.ensureViewport(config.viewportWidth, config.viewportHeight);
  const finalUrl = String(await client.eval('window.location.href'));
  console.log('[Auth] URL final no módulo:', maskUrlHost(finalUrl));
  persistModuleHome(finalUrl);
  return !/webPortal/i.test(finalUrl);
}
`;
fs.writeFileSync(f, s);
