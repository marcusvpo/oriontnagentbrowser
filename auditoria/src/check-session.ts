import { AgentBrowserClient } from './browser.js';

async function main() {
  const client = new AgentBrowserClient({
    headless: true,
    sessionId: 'calib-session-live',
    deviceScaleFactor: 1
  });

  const url = await client.eval('window.location.href');
  console.log('Current URL in calib-session-live:', url);

  const navData = await client.eval(`
    (() => {
      const results = [];
      const els = Array.from(document.querySelectorAll('.navbar li a, .navbar li button, nav li a, nav li button, ul.nav li a, ul.nav li button, header a, header button'));
      for (const el of els) {
        const text = (el.textContent || '').trim().replace(/\\s+/g, ' ');
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          results.push({
            text,
            x: Math.round(rect.left),
            y: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            tag: el.tagName
          });
        }
      }
      return JSON.stringify(results, null, 2);
    })()
  `);
  console.log('--- NAVBAR ELEMENTS IN DOM ---');
  console.log(navData);

  const boxConfig = await client.getElementBoxFast('Configurações');
  console.log("getElementBoxFast('Configurações'):", boxConfig);

  const boxHistoricos = await client.getElementBoxFast('Históricos');
  console.log("getElementBoxFast('Históricos'):", boxHistoricos);

  const boxRelatorios = await client.getElementBoxFast('Relatórios');
  console.log("getElementBoxFast('Relatórios'):", boxRelatorios);

  const boxAdmin = await client.getElementBoxFast('Administração');
  console.log("getElementBoxFast('Administração'):", boxAdmin);
}

main().catch(console.error);
