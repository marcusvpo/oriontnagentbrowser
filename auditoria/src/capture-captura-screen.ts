import path from 'node:path';
import { AgentBrowserClient } from './browser.js';
import { ensureAuthenticated } from './auth.js';
import { config } from './config.js';

async function main() {
  const client = new AgentBrowserClient({
    headless: true
  });

  try {
    const authOk = await ensureAuthenticated(client);
    if (!authOk) throw new Error('Falha na autenticação');

    console.log('[Nav] Abrindo #/configuracoes...');
    await client.open(new URL('/webFirmas/#/configuracoes', config.appHomeUrl || config.homologUrl).toString());
    await client.wait(3000);

    // Clicar na aba Captura e digitalização (centro da aba: x=100, y=180)
    console.log('[Click] Clicando na aba Captura e digitalização em (100, 180)...');
    await client.eval(`
      (() => {
        // Encontra o elemento na coordenada (100, 180) e dispara o clique
        const el = document.elementFromPoint(100, 180);
        if (el) {
          el.click();
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      })()
    `);

    await client.wait(1500);
    const outPath = path.resolve('cache/raw/real-config-captura.png');
    await client.screenshot(outPath);
    console.log('✓ Screenshot da aba Captura salvo em:', outPath);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
