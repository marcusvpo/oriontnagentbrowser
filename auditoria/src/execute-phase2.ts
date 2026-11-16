import { runPhase2Master } from './run-phase2-master.js';

/**
 * Ponto de entrada da Fase 2 integrado à CLI (`cli.ts`).
 * Delega integralmente para o executor determinístico baseado na geometria real do DOM,
 * tendo removido todas as tabelas de coordenadas estáticas/heurísticas legadas.
 */
export async function executePhase2() {
  return runPhase2Master();
}

if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('execute-phase2.ts')) {
  executePhase2().catch(err => {
    console.error('✕ Falha crítica na execução da Fase 2:', err);
    process.exit(1);
  });
}
