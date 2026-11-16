import { AgentBrowserClient } from './browser.js';
import { config } from './config.js';
import fs from 'node:fs';

async function main() {
  const client = new AgentBrowserClient({
    headless: true,
    sessionId: 'explore-screens',
    deviceScaleFactor: 1
  });

  console.log('1. Abrindo login...');
  await client.open(config.homologUrl);
  await client.wait(3000);
  await client.setViewport(1440, 900);

  const snap = await client.snapshotInteractive();
  const u = snap.match(/textbox "Usuário"[^\]]*ref=([^\s\]]+)/)?.[1] || 'e7';
  const p = snap.match(/textbox "Senha"[^\]]*ref=([^\s\]]+)/)?.[1] || 'e8';
  await client.fill(`@${u}`, config.user);
  await client.fill(`@${p}`, config.pass);
  await client.wait(500);

  const snap2 = await client.snapshotInteractive();
  const btn = snap2.match(/button "ENTRAR"[^\]]*ref=([^\s\]]+)/)?.[1] || 'e3';
  await client.click(`@${btn}`);
  await client.wait(4000);

  const portalSnap = await client.snapshotInteractive();
  const tnRef = portalSnap.match(/generic "[^"]*Orion TN[^"]*"[^\]]*ref=([^\s\]]+)/)?.[1];
  if (tnRef) {
    await client.click(`@${tnRef}`);
    await client.wait(5000);
  }

  await client.setViewport(1440, 900);
  console.log('2. URL atual no Orion TN:', await client.eval('window.location.href'));

  // Testar clique no menu Configurações
  console.log('3. Clicando no menu Configurações...');
  await client.click('@e46'); // ou botão Configurações
  await client.wait(1500);

  const snapMenu = await client.snapshotInteractive();
  console.log('--- SUBMENUS DE CONFIGURAÇÕES ---');
  console.log(snapMenu.slice(0, 2000));

  // Testar busca rápida (Pesquise aqui...)
  console.log('4. Testando busca rápida...');
  const searchInputBox = snapMenu.match(/textbox "Pesquise aqui[^"]*"[^\]]*ref=([^\s\]]+)/)?.[1];
  if (searchInputBox) {
    console.log(`Buscando "Parametrizações" (@${searchInputBox})...`);
    await client.fill(`@${searchInputBox}`, 'Parametrizações');
    await client.wait(1500);
    const snapBusca = await client.snapshotInteractive();
    console.log('--- RESULTADO DA BUSCA POR PARAMETRIZAÇÕES ---');
    console.log(snapBusca.slice(0, 2000));
  }

  // Obter todas as rotas registradas no AngularJS
  const routes = await client.eval(`
    (() => {
      try {
        const app = angular.element(document.querySelector('[ng-app]') || document.body);
        const injector = app.injector();
        if (injector && injector.has('$route')) {
          const r = injector.get('$route');
          return JSON.stringify(Object.keys(r.routes || {}));
        }
      } catch (e) {
        return 'angular-not-found: ' + e.message;
      }
      return 'no-routes';
    })()
  `);
  console.log('--- ROTAS DO ANGULARJS DETECTADAS ---');
  console.log(routes);

  await client.close();
}

main().catch(console.error);
