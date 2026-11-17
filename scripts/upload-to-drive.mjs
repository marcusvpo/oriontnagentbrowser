#!/usr/bin/env node
/**
 * Upload idempotente do Super-Contexto Orion TN para o Google Drive (ADR-034).
 *
 * Le os 5 pacotes gerados pelo repomix (`npm run pack:context`) e SOBRESCREVE o conteudo
 * de 5 Google Docs nativos ja existentes via `drive.files.update` (ID/URL preservados).
 * Nunca usa `files.create`: a Service Account nao tem cota de armazenamento propria
 * (evita HTTP 403 `storageQuotaExceeded`).
 *
 * Uso:
 *   node scripts/upload-to-drive.mjs           # valida e envia os 5 pacotes
 *   node scripts/upload-to-drive.mjs --check   # so valida configs/tamanhos, sem rede nem credenciais
 *
 * Variaveis de ambiente (somente NOMES aqui; valores vivem em Secrets/.env ignorado pelo Git):
 *   GDRIVE_SERVICE_ACCOUNT_KEY   JSON da Service Account (fallback: GOOGLE_APPLICATION_CREDENTIALS = caminho do arquivo)
 *   GDRIVE_FILE_ID_MEMORY, GDRIVE_FILE_ID_ENGINE, GDRIVE_FILE_ID_ENGINE_2, GDRIVE_FILE_ID_ENGINE_3, GDRIVE_FILE_ID_CONSOLE
 *   GDRIVE_UPLOAD_MIME           opcional (padrao text/markdown)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// .env local e opcional: no GitHub Actions as variaveis vem exclusivamente do ambiente (secrets).
// `loadEnvFile` nao sobrescreve variaveis ja definidas e lanca ENOENT quando o arquivo nao existe.
try {
  process.loadEnvFile(path.join(ROOT_DIR, '.env'));
} catch {
  /* sem .env: segue apenas com process.env */
}

/** Teto por Google Doc: ~570k caracteres (~260 paginas). Acima de ~300 paginas o parser do NotebookLM estoura o timeout (o Docs aceitaria ate ~1,02 M). */
const MAX_CHARS = 570_000;
/** Limite de palavras por fonte do NotebookLM (500k); avisa a partir de 450k. */
const WARN_WORDS = 450_000;
const DOC_MIME = 'application/vnd.google-apps.document';
const DEFAULT_UPLOAD_MIME = 'text/markdown';
const FALLBACK_UPLOAD_MIME = 'text/plain';
const FIELDS = 'id, name, modifiedTime, webViewLink';

/** @type {{key:string,label:string,file:string,envVar:string,config:string}[]} */
const BUNDLES = [
  { key: 'memory', label: '01 Memoria e Contratos', file: '.repomix-output/01-memoria-e-contratos.md', envVar: 'GDRIVE_FILE_ID_MEMORY', config: 'repomix.memory.config.json' },
  { key: 'engine', label: '02a Motor (nucleo)', file: '.repomix-output/02a-motor-nucleo.md', envVar: 'GDRIVE_FILE_ID_ENGINE', config: 'repomix.engine.config.json' },
  { key: 'engine2', label: '02b Motor (operacao)', file: '.repomix-output/02b-motor-operacao.md', envVar: 'GDRIVE_FILE_ID_ENGINE_2', config: 'repomix.engine2.config.json' },
  { key: 'engine3', label: '02c Motor (periferia) + scripts', file: '.repomix-output/02c-motor-periferia-e-scripts.md', envVar: 'GDRIVE_FILE_ID_ENGINE_3', config: 'repomix.engine3.config.json' },
  { key: 'console', label: '03 Console e testes', file: '.repomix-output/03-console-e-testes.md', envVar: 'GDRIVE_FILE_ID_CONSOLE', config: 'repomix.console.config.json' },
];

const checkOnly = process.argv.includes('--check');
const errors = [];
const warnings = [];

const fmt = (n) => n.toLocaleString('pt-BR');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const hasGlob = (p) => /[*?[\]{}]/.test(p);

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8'));
}

/**
 * Consistencia dos configs: include explicito precisa existir (um arquivo renomeado sairia do pacote
 * em silencio) e o nucleo do motor (02a) nao pode se repetir na periferia (02b).
 */
function checkConfigs() {
  const configs = {};
  for (const bundle of BUNDLES) {
    try {
      configs[bundle.key] = readJson(bundle.config);
    } catch (err) {
      errors.push(`${bundle.config}: nao foi possivel ler/parsear (${err.message}).`);
      continue;
    }
    for (const entry of configs[bundle.key].include ?? []) {
      if (!hasGlob(entry) && !fs.existsSync(path.join(ROOT_DIR, entry))) {
        errors.push(`${bundle.config}: arquivo explicito do include nao existe mais: ${entry}`);
      }
    }
  }
  checkEngineDisjoint(configs);
  if (configs.engine && configs.memory) {
    const memory = new Set(configs.memory.include ?? []);
    for (const entry of configs.engine.include ?? []) {
      if (memory.has(entry)) errors.push(`${entry} aparece nos pacotes 01 e 02a.`);
    }
  }
}

/**
 * 02a.include, 02b.include e 02c devem ser 100% disjuntos e cobrir todo auditoria/src/*.ts
 * (exceto types.ts, que vive no pacote 01): zero sobreposicao e zero arquivo esquecido.
 */
function checkEngineDisjoint(configs) {
  const { engine, engine2, engine3 } = configs;
  if (!engine || !engine2 || !engine3) return;
  const inA = new Set(engine.include ?? []);
  const inB = new Set(engine2.include ?? []);
  for (const entry of inA) if (inB.has(entry)) errors.push(`${entry} aparece nos pacotes 02a e 02b.`);
  const ignoreC = new Set(engine3.ignore?.customPatterns ?? []);
  for (const entry of [...inA, ...inB]) {
    if (!ignoreC.has(entry)) errors.push(`${entry} esta em 02a/02b mas nao no ignore de 02c: sairia duplicado.`);
  }
  const srcDir = path.join(ROOT_DIR, 'auditoria', 'src');
  for (const name of fs.readdirSync(srcDir)) {
    if (!name.endsWith('.ts') || name.endsWith('.test.ts')) continue;
    const rel = `auditoria/src/${name}`;
    if (rel === 'auditoria/src/types.ts') continue;
    const owners = [inA.has(rel) && '02a', inB.has(rel) && '02b', !ignoreC.has(rel) && '02c'].filter(Boolean);
    if (owners.length !== 1) errors.push(`${rel} pertence a ${owners.length} pacotes do motor (${owners.join(',') || 'nenhum'}); deve estar em exatamente 1.`);
  }
}

/** Mede cada pacote gerado. Retorna os que podem ser enviados. */
function measureBundles() {
  console.log('\nPacote                               KB        Caracteres   Palavras    Limite');
  console.log('-'.repeat(82));
  const ready = [];
  for (const bundle of BUNDLES) {
    const abs = path.join(ROOT_DIR, bundle.file);
    if (!fs.existsSync(abs)) {
      const msg = `${bundle.file} nao encontrado. Rode "npm run pack:context" antes.`;
      (checkOnly ? warnings : errors).push(msg);
      continue;
    }
    const text = fs.readFileSync(abs, 'utf8');
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const kb = (Buffer.byteLength(text, 'utf8') / 1024).toFixed(1);
    const pct = ((chars / MAX_CHARS) * 100).toFixed(0);
    console.log(
      `${bundle.label.padEnd(34)} ${String(kb).padStart(8)} ${fmt(chars).padStart(14)} ${fmt(words).padStart(10)}   ${pct}% de ${fmt(MAX_CHARS)}`,
    );
    if (chars > MAX_CHARS) {
      errors.push(`${bundle.file} tem ${fmt(chars)} caracteres (> ${fmt(MAX_CHARS)}): o Google Docs rejeitaria a conversao. Rebalanceie os bundles em repomix.*.config.json.`);
      continue;
    }
    if (chars > MAX_CHARS * 0.9) warnings.push(`${bundle.file} usa ${pct}% do limite; considere rebalancear antes que estoure.`);
    if (words > WARN_WORDS) warnings.push(`${bundle.file} tem ${fmt(words)} palavras (> ${fmt(WARN_WORDS)}; limite de ~500.000 por fonte do NotebookLM).`);
    ready.push({ ...bundle, abs, chars });
  }
  return ready;
}

/** Credenciais a partir do ambiente. Nunca imprime a chave; so o e-mail da Service Account. */
function loadCredentials() {
  const raw = process.env.GDRIVE_SERVICE_ACCOUNT_KEY?.trim();
  if (raw) {
    let text = raw;
    if (!raw.startsWith('{')) {
      try {
        text = Buffer.from(raw, 'base64').toString('utf8');
      } catch {
        /* cai no erro de JSON abaixo */
      }
    }
    try {
      const credentials = JSON.parse(text);
      if (!credentials.client_email || !credentials.private_key) throw new Error('faltam client_email/private_key');
      return { authOptions: { credentials }, email: credentials.client_email };
    } catch (err) {
      throw new Error(`GDRIVE_SERVICE_ACCOUNT_KEY nao e um JSON de Service Account valido (${err.message}). Cole o conteudo integral do arquivo de chave no secret.`);
    }
  }
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (keyFile) {
    if (!fs.existsSync(keyFile)) throw new Error(`GOOGLE_APPLICATION_CREDENTIALS aponta para um arquivo inexistente: ${keyFile}`);
    let email = '(desconhecido)';
    try {
      email = JSON.parse(fs.readFileSync(keyFile, 'utf8')).client_email ?? email;
    } catch {
      /* o GoogleAuth reporta o erro real */
    }
    return { authOptions: { keyFile }, email };
  }
  throw new Error('Credenciais ausentes: defina GDRIVE_SERVICE_ACCOUNT_KEY (JSON da Service Account) ou GOOGLE_APPLICATION_CREDENTIALS (caminho do arquivo).');
}

const statusOf = (err) => Number(err?.code ?? err?.response?.status) || 0;
const reasonOf = (err) => err?.errors?.[0]?.reason ?? err?.response?.data?.error?.errors?.[0]?.reason ?? '';
const messageOf = (err) => err?.response?.data?.error?.message ?? err?.message ?? String(err);

function explainError(err, bundle, email) {
  const status = statusOf(err);
  const reason = reasonOf(err);
  const base = `${bundle.label} (${bundle.envVar}): HTTP ${status || '?'} ${reason} - ${messageOf(err)}`;
  if (reason === 'storageQuotaExceeded') {
    return `${base}\n  -> A Service Account nao tem cota propria. O Google Doc precisa EXISTIR previamente (este script so faz update, nunca create) e estar compartilhado como Editor com ${email}.`;
  }
  if (status === 403 || status === 404) {
    return `${base}\n  -> Verifique o ID em ${bundle.envVar} e compartilhe o Google Doc como Editor com a Service Account: ${email}`;
  }
  if (status === 401 || /invalid_grant|invalid_client/i.test(messageOf(err))) {
    return `${base}\n  -> Credenciais invalidas/expiradas: gere uma nova chave da Service Account e atualize o secret GDRIVE_SERVICE_ACCOUNT_KEY.`;
  }
  return base;
}

async function updateWithRetry(drive, fileId, mimeType, filePath) {
  const maxAttempts = 3;
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await drive.files.update({
        fileId,
        supportsAllDrives: true,
        media: { mimeType, body: fs.createReadStream(filePath) },
        fields: FIELDS,
      });
    } catch (err) {
      if ([429, 500, 502, 503, 504].includes(statusOf(err)) && attempt < maxAttempts) {
        const wait = 2000 * 2 ** (attempt - 1);
        console.warn(`   ! HTTP ${statusOf(err)} transitorio; nova tentativa ${attempt + 1}/${maxAttempts} em ${wait / 1000}s...`);
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
}

async function uploadBundle(drive, bundle, fileId, email) {
  const meta = await drive.files.get({ fileId, supportsAllDrives: true, fields: 'id, name, mimeType, trashed, capabilities(canEdit)' });
  const info = meta.data;
  if (info.trashed) throw Object.assign(new Error('o Google Doc esta na lixeira'), { code: 404 });
  if (info.capabilities?.canEdit === false) {
    throw Object.assign(new Error(`sem permissao de edicao; compartilhe como Editor com ${email}`), { code: 403 });
  }
  if (info.mimeType !== DOC_MIME) {
    console.warn(`   ! "${info.name}" nao e um Google Doc nativo (${info.mimeType}); o conteudo sera gravado como arquivo comum.`);
  }

  const wantedMime = process.env.GDRIVE_UPLOAD_MIME?.trim() || DEFAULT_UPLOAD_MIME;
  let res;
  try {
    res = await updateWithRetry(drive, fileId, wantedMime, bundle.abs);
  } catch (err) {
    // Conversao markdown recusada pelo Drive: 1 tentativa com texto simples (conteudo preservado, sem estilos).
    if ([400, 415].includes(statusOf(err)) && wantedMime === DEFAULT_UPLOAD_MIME) {
      console.warn(`   ! ${wantedMime} recusado (HTTP ${statusOf(err)}: ${messageOf(err)}); tentando ${FALLBACK_UPLOAD_MIME}.`);
      res = await updateWithRetry(drive, fileId, FALLBACK_UPLOAD_MIME, bundle.abs);
    } else {
      throw err;
    }
  }
  return res.data;
}

async function main() {
  console.log(`Super-Contexto Orion TN -> Google Drive ${checkOnly ? '(modo --check: sem rede)' : ''}`);
  checkConfigs();
  const ready = measureBundles();

  if (!checkOnly) {
    for (const bundle of BUNDLES) {
      if (!process.env[bundle.envVar]?.trim()) errors.push(`Variavel ${bundle.envVar} ausente (ID do Google Doc de "${bundle.label}").`);
    }
  }
  for (const w of warnings) console.warn(`AVISO: ${w}`);
  if (errors.length > 0) {
    for (const e of errors) console.error(`ERRO: ${e}`);
    console.error('\nNada foi enviado ao Drive (validacao falhou antes de qualquer upload).');
    process.exit(1);
  }
  if (checkOnly) {
    console.log('\nOK: configs consistentes e pacotes dentro do limite.');
    return;
  }

  let credentialInfo;
  try {
    credentialInfo = loadCredentials();
  } catch (err) {
    console.error(`ERRO: ${err.message}`);
    process.exit(1);
  }
  const { google } = await import('googleapis');
  const auth = new google.auth.GoogleAuth({ ...credentialInfo.authOptions, scopes: ['https://www.googleapis.com/auth/drive'] });
  const drive = google.drive({ version: 'v3', auth });
  console.log(`\nService Account: ${credentialInfo.email}`);

  const results = [];
  for (const bundle of ready) {
    const fileId = process.env[bundle.envVar].trim();
    console.log(`\n-> ${bundle.label}: atualizando Google Doc (${bundle.envVar})...`);
    try {
      const data = await uploadBundle(drive, bundle, fileId, credentialInfo.email);
      console.log(`   OK  "${data.name}" modificado em ${data.modifiedTime}\n       ${data.webViewLink ?? '(sem link)'}`);
      results.push({ bundle, ok: true });
    } catch (err) {
      console.error(`   FALHA ${explainError(err, bundle, credentialInfo.email)}`);
      results.push({ bundle, ok: false });
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\nResumo: ${results.length - failed.length}/${results.length} Google Docs atualizados.`);
  if (failed.length > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`ERRO inesperado: ${messageOf(err)}`);
  process.exit(1);
});
