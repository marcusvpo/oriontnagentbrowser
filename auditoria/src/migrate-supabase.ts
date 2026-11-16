import fs from 'node:fs';
import path from 'node:path';
import { createPgClient, getSupabaseAdmin, SUPABASE_STORAGE_BUCKET } from './supabase.js';

const auditoriaRoot = path.resolve(
  process.cwd().endsWith('auditoria') ? process.cwd() : path.join(process.cwd(), 'auditoria')
);

async function main() {
  console.log('====================================================');
  console.log('  ORION AUDIT CONSOLE — MIGRATION SUPABASE          ');
  console.log('====================================================\n');

  const migrationsDir = path.join(auditoriaRoot, 'supabase', 'migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const pgClient = createPgClient();
  await pgClient.connect();
  try {
    console.log('1. Aplicando migrations DDL no PostgreSQL Supabase...');
    for (const file of migrationFiles) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await pgClient.query(sql);
      console.log(`   ✓ Migration aplicada: ${file}`);
    }

    const tablesRes = await pgClient.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    );
    console.log(
      '   ✓ Tabelas em public:',
      tablesRes.rows.map((r: any) => r.tablename).join(', ')
    );
  } finally {
    await pgClient.end();
  }

  console.log(`\n2. Verificando Storage Bucket '${SUPABASE_STORAGE_BUCKET}'...`);
  const supabase = getSupabaseAdmin();
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw listErr;

  const exists = buckets?.some(b => b.name === SUPABASE_STORAGE_BUCKET);
  if (!exists) {
    const { error: createErr } = await supabase.storage.createBucket(SUPABASE_STORAGE_BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10MB por print
      allowedMimeTypes: ['image/png', 'image/webp'],
    });
    if (createErr) throw createErr;
    console.log(`   ✓ Bucket '${SUPABASE_STORAGE_BUCKET}' criado (público para leitura de prints).`);
  } else {
    console.log(`   ✓ Bucket '${SUPABASE_STORAGE_BUCKET}' já existe.`);
  }

  console.log('\n✓ Migration concluída com sucesso!');
}

main().catch(err => {
  console.error('✕ Erro na migration Supabase:', err);
  process.exit(1);
});
