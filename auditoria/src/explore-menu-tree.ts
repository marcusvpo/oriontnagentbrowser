import { AgentBrowserClient } from './browser.js';
import { config } from './config.js';
import fs from 'node:fs';
import path from 'node:path';

const auditoriaRoot = path.resolve(process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria'));

async function main() {
  const client = new AgentBrowserClient({
    headless: true,
    sessionId: 'explore-menu-tree',
    deviceScaleFactor: 1
  });

  console.log('1. Abrindo login...');
  await client.open(config.homologUrl);
  await client.wait(3000);
  await client.setViewport(1440, 900);

  let snap = await client.snapshotInteractive();
  const u = snap.match(/textbox "Usuário"[^\]]*ref=([^\s\]]+)/)?.[1] || 'e7';
  const p = snap.match(/textbox "Senha"[^\]]*ref=([^\s\]]+)/)?.[1] || 'e8';
  await client.fill(`@${u}`, config.user);
  await client.fill(`@${p}`, config.pass);
  await client.wait(500);

  snap = await client.snapshotInteractive();
  const btn = snap.match(/button "ENTRAR"[^\]]*ref=([^\s\]]+)/)?.[1] || 'e3';
  await client.click(`@${btn}`);
  await client.wait(5000);

  const portalSnap = await client.snapshotInteractive();
  const tnRef = portalSnap.match(/generic "[^"]*Orion TN[^"]*"[^\]]*ref=([^\s\]]+)/)?.[1];
  if (tnRef) {
    await client.click(`@${tnRef}`);
    await client.wait(6000);
  }

  await client.setViewport(1440, 900);
  console.log('2. Conectado ao Orion TN!');

  // Clica no menu Configurações via DOM
  console.log('3. Abrindo dropdown de Configurações...');
  await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(b => (b.textContent || '').trim() === 'Configurações');
      if (btn) btn.click();
    })()
  `);
  await client.wait(1500);

  // Snapshot com menu aberto
  const snapConfigOpen = await client.snapshotInteractive();
  console.log('--- SNAPSHOT CONFIGURAÇÕES ABERTO ---');
  console.log(snapConfigOpen.slice(0, 2500));

  // Tira print do menu Configurações aberto
  await client.screenshot(path.join(auditoriaRoot, 'cache', 'raw', 'config-menu-live.png'));

  // Extrai todos os subitens de Configurações
  const subItems = await client.eval(`
    (() => {
      const items = [];
      const links = Array.from(document.querySelectorAll('.dropdown-menu a, .dropdown.open a, li.open ul a, ul.dropdown-menu a'));
      for (const a of links) {
        const text = (a.textContent || '').trim().replace(/\\s+/g, ' ');
        const rect = a.getBoundingClientRect();
        items.push({
          text,
          href: a.getAttribute('href'),
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
      return JSON.stringify(items, null, 2);
    })()
  `);
  console.log('--- SUBITENS DE CONFIGURAÇÕES DETECTADOS ---');
  console.log(subItems);

  // Também tenta inspecionar Administração
  console.log('4. Abrindo dropdown de Administração...');
  await client.eval(`
    (() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(b => (b.textContent || '').trim() === 'Administração');
      if (btn) btn.click();
    })()
  `);
  await client.wait(1500);
  await client.screenshot(path.join(auditoriaRoot, 'cache', 'raw', 'admin-menu-live.png'));

  const adminSubItems = await client.eval(`
    (() => {
      const items = [];
      const links = Array.from(document.querySelectorAll('.dropdown-menu a, .dropdown.open a, li.open ul a, ul.dropdown-menu a'));
      for (const a of links) {
        const text = (a.textContent || '').trim().replace(/\\s+/g, ' ');
        const rect = a.getBoundingClientRect();
        items.push({
          text,
          href: a.getAttribute('href'),
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
      return JSON.stringify(items, null, 2);
    })()
  `);
  console.log('--- SUBITENS DE ADMINISTRAÇÃO DETECTADOS ---');
  console.log(adminSubItems);

  await client.close();
}

main().catch(console.error);
