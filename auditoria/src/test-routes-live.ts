import { AgentBrowserClient } from './browser.js';
import { config } from './config.js';
import fs from 'node:fs';
import path from 'node:path';

const auditoriaRoot = path.resolve(process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria'));

async function testRoutes() {
  const client = new AgentBrowserClient({
    headless: true,
    sessionId: 'test-routes-session',
    deviceScaleFactor: 1
  });

  console.log('1. Autenticando...');
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

  const testRoutes = [
    { name: 'perfil', hash: '#/perfil' },
    { name: 'configuracoes', hash: '#/configuracoes' },
    { name: 'aliquota', hash: '#/aliquota' },
    { name: 'natureza', hash: '#/natureza' },
    { name: 'outrosServicos', hash: '#/outrosServicos' },
    { name: 'modeloEtiqueta', hash: '#/modeloEtiqueta' },
    { name: 'livro', hash: '#/livro' }
  ];

  for (const r of testRoutes) {
    console.log(`\n--- Testando rota ${r.name} (${r.hash}) ---`);
    await client.jumpHash(r.hash);
    await client.wait(2500);

    const currentUrl = await client.eval('window.location.href');
    console.log(`URL carregada: ${currentUrl}`);

    const titleOrHeader = await client.eval(`
      (() => {
        const h = document.querySelector('h1, h2, h3, .panel-title, .title, legend');
        return h ? h.textContent.trim() : 'sem-titulo';
      })()
    `);
    console.log(`Título da tela: ${titleOrHeader}`);

    const btnAdicionar = await client.getElementBoxFast('Adicionar');
    console.log(`Botão Adicionar:`, btnAdicionar);

    const btnNovo = await client.getElementBoxFast('Novo');
    console.log(`Botão Novo:`, btnNovo);

    const screenPath = path.join(auditoriaRoot, 'cache', 'raw', `test-tela-${r.name}.png`);
    await client.screenshot(screenPath);
    console.log(`Screenshot salvo: ${screenPath}`);
  }

  await client.close();
  console.log('\n✓ Teste de rotas concluído com sucesso!');
}

testRoutes().catch(console.error);
