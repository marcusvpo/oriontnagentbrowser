import fs from 'node:fs';
import path from 'node:path';
import { AgentBrowserClient } from './browser.js';
import { ensureAuthenticated } from './auth.js';
import { config } from './config.js';

interface TabDef {
  key: string;
  name: string;
  targetFileName: string;
}

const TABS: TabDef[] = [
  { key: 'geral', name: 'Geral', targetFileName: 'real-config-geral.png' },
  { key: 'captura', name: 'Captura e digitalização', targetFileName: 'real-config-captura.png' },
  { key: 'estacao', name: 'Parâmetros por estação', targetFileName: 'real-config-estacao.png' },
  { key: 'sequencia', name: 'Sequência', targetFileName: 'real-config-sequencia.png' },
  { key: 'comunicacoes', name: 'Comunicações', targetFileName: 'real-config-comunicacoes.png' },
  { key: 'campos', name: 'Campos obrigatórios', targetFileName: 'real-config-campos.png' },
  { key: 'atalhos', name: 'Painel de atalhos', targetFileName: 'real-config-atalhos.png' },
  { key: 'pedido_firmas', name: 'Pedido de firmas', targetFileName: 'real-config-pedido-firmas.png' },
  { key: 'comissoes', name: 'Comissões e mensalistas', targetFileName: 'real-config-comissoes.png' },
  { key: 'email', name: 'E-mail', targetFileName: 'real-config-email.png' },
  { key: 'faturamento', name: 'Faturamento', targetFileName: 'real-config-faturamento.png' },
  { key: 'protocolo', name: 'Protocolo', targetFileName: 'real-config-protocolo.png' },
  { key: 'certidao', name: 'Certidão', targetFileName: 'real-config-certidao.png' },
  { key: 'editor', name: 'Editor', targetFileName: 'real-config-editor.png' },
  { key: 'produtos', name: 'Produtos Orion', targetFileName: 'real-config-produtos.png' },
  { key: 'ia', name: 'Inteligência Artificial', targetFileName: 'real-config-ia.png' },
  { key: 'whatsapp', name: 'WhatsApp', targetFileName: 'real-config-whatsapp.png' },
  { key: 'impressao', name: 'Impressão', targetFileName: 'real-config-impressao.png' }
];

async function main() {
  console.log('=== CAPTURA DE TELAS REAIS DAS ABAS DE CONFIGURAÇÃO ===');
  const client = new AgentBrowserClient({
    headless: true
  });

  const rawDir = path.resolve('cache/raw');
  if (!fs.existsSync(rawDir)) fs.mkdirSync(rawDir, { recursive: true });

  try {
    const authOk = await ensureAuthenticated(client);
    if (!authOk) throw new Error('Falha na autenticação do Orion TN');

    // 1. Abrir a rota oficial de configurações (#/configuracoes)
    console.log('[Nav] Navegando para #/configuracoes...');
    await client.open(new URL('/webFirmas/#/configuracoes', config.appHomeUrl || config.homologUrl).toString());
    await client.wait(3500);

    // 2. Extrair coordenadas reais do DOM para cada aba e para os botões do rodapé
    const domDataRaw = await client.eval(`
      (() => {
        // Encontrar todas as abas no menu vertical esquerdo
        const links = Array.from(document.querySelectorAll('a, li, div, span, button'));
        const tabBoxes = {};
        
        const tabNames = ${JSON.stringify(TABS.map(t => t.name))};
        for (const name of tabNames) {
          const el = links.find(l => {
            const t = (l.innerText || l.textContent || '').trim();
            const r = l.getBoundingClientRect();
            return t.toLowerCase() === name.toLowerCase() && r.width > 0 && r.height > 0 && r.left < 260;
          });
          if (el) {
            const r = el.getBoundingClientRect();
            tabBoxes[name] = {
              x: Math.round(r.left),
              y: Math.round(r.top),
              width: Math.round(r.width),
              height: Math.round(r.height)
            };
          }
        }

        // Botões de rodapé (Concluir, Voltar)
        const buttons = Array.from(document.querySelectorAll('button, a'));
        let btnConcluir = null;
        let btnVoltar = null;

        for (const b of buttons) {
          const t = (b.textContent || '').trim().toLowerCase();
          const r = b.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            if (t.includes('concluir')) {
              btnConcluir = { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
            }
            if (t.includes('voltar')) {
              btnVoltar = { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
            }
          }
        }

        return JSON.stringify({ tabBoxes, btnConcluir, btnVoltar });
      })()
    `);

    const domData = JSON.parse(domDataRaw);
    console.log('[DOM] Dados extraídos da tela de configuração:', domData);

    // Salvar catálogo de coordenadas reais
    const catalogPath = path.resolve('src/screen-catalog.ts');
    const catalogContent = `// Catálogo Oficial de Coordenadas de Telas Extraídas ao Vivo no DOM
// Viewport Canônica: 1440x900 (DPR 1.0)
import type { BoundingBox } from './types.js';

export const CONFIG_SCREEN_COORDS = {
  tabs: ${JSON.stringify(domData.tabBoxes, null, 2)} as Record<string, BoundingBox>,
  btnConcluir: ${JSON.stringify(domData.btnConcluir, null, 2)} as BoundingBox,
  btnVoltar: ${JSON.stringify(domData.btnVoltar, null, 2)} as BoundingBox
};
`;
    fs.writeFileSync(catalogPath, catalogContent, 'utf8');
    console.log('✓ Catálogo de coordenadas gravado em:', catalogPath);

    // 3. Clicar em cada aba e capturar screenshot real
    for (let i = 0; i < TABS.length; i++) {
      const tab = TABS[i];
      console.log(`[${i + 1}/${TABS.length}] Capturando aba: "${tab.name}"...`);

      // Clicar na aba via JS ou coordenadas
      await client.eval(`
        (() => {
          const els = Array.from(document.querySelectorAll('a, li, div, span, button'));
          const targetName = ${JSON.stringify(tab.name.toLowerCase())};
          const el = els.find(l => {
            const t = (l.innerText || l.textContent || '').trim().toLowerCase();
            const r = l.getBoundingClientRect();
            return t === targetName && r.width > 0 && r.left < 260;
          });
          if (el) {
            el.click();
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          }
        })()
      `);

      await client.wait(800);
      const targetPath = path.join(rawDir, tab.targetFileName);
      await client.screenshot(targetPath);
      console.log(`  ✓ Screenshot salvo: ${tab.targetFileName}`);
    }

    console.log('\n✓ Todas as abas de configuração foram capturadas ao vivo com sucesso!');
  } catch (err: any) {
    console.error('Erro na captura:', err.message);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
