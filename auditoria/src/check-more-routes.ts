import { AgentBrowserClient } from './browser.js';
import { config } from './config.js';
import path from 'node:path';

const auditoriaRoot = path.resolve(process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria'));

async function checkMoreRoutes() {
  const client = new AgentBrowserClient({
    headless: true,
    sessionId: 'check-more-routes',
    deviceScaleFactor: 1
  });

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

  const moreRoutes = [
    '#/cartorio/cadastrar',
    '#/orcamento/cadastrar',
    '#/pedidoFirmas/cadastrar',
    '#/tipoDocumento',
    '#/tipoTermo',
    '#/configuracaoImpressaoModelo',
    '#/documentoApresentado',
    '#/perfilParticipacao',
    '#/grupoItem',
    '#/custas/parametros',
    '#/servicoPraticado',
    '#/protocolo/aberto'
  ];

  for (const r of moreRoutes) {
    await client.jumpHash(r);
    await client.wait(2000);
    const url = await client.eval('window.location.href');
    const header = await client.eval(`
      (() => {
        const h = document.querySelector('h1, h2, h3, .panel-title, .title, legend');
        return h ? h.textContent.trim() : 'sem-header';
      })()
    `);
    const cleanName = r.replace(/[^a-zA-Z0-9]/g, '_');
    const imgPath = path.join(auditoriaRoot, 'cache', 'raw', `tela${cleanName}.png`);
    await client.screenshot(imgPath);
    console.log(`Rota: ${r} -> Header: ${header} | Salvo: ${imgPath}`);
  }

  await client.close();
}

checkMoreRoutes().catch(console.error);
