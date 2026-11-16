import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { PHASE3_MANIFEST } from './manifests/phase3-manifest.js';

export interface PhaseDefinition {
  phase: number;
  title: string;
  description: string;
  modules: string[];
  specificRoutines?: string[];
}

export const PHASES: PhaseDefinition[] = [
  {
    phase: 1,
    title: 'PoC Ponta a Ponta (Validação de Infraestrutura e Formulário)',
    description: 'Valida D-1.1 (Acesso/Caixa/Login) e R-1.1 (Abertura de Protocolo/Notas)',
    modules: ['caixa', 'notas'],
    specificRoutines: ['D-1.1', 'R-1.1']
  },
  {
    phase: 2,
    title: 'Cadastrais, Segurança e Parâmetros',
    description: 'Rotinas com baixa dependência de massa complexa de atos lavrados',
    modules: ['acesso', 'config']
  },
  {
    phase: 3,
    title: 'Atos de Balcão, Insumos e Livros (118 rotinas)',
    description:
      'Firmas (36), Selos Digitais (24), Livros Notariais (20), Certidões (15) e Centrais Eletrônicas (23): 118 rotinas do phase3-manifest.ts (37 read_only, 81 mutation, 7 pré-triadas [DDD] de hardware/serviço local)',
    modules: ['firmas', 'selos', 'livros', 'certidoes', 'centrais']
  },
  {
    phase: 4,
    title: 'Financeiro, Custas e Controle de Caixa',
    description: 'Orion Caixa, emissão de recibos, estornos, sangrias e faturamento',
    modules: ['caixa']
  },
  {
    phase: 5,
    title: 'Notas, Minutas e Escrituras',
    description: 'Editor de minutas, qualificação de partes, imóveis, IA e lavratura',
    modules: ['notas']
  },
  {
    phase: 6,
    title: 'Consolidação Mestre e Sync OpenAI Vector Store',
    description: 'Revisão dos relatórios de bloqueio, merge dos textos saneados e sincronização RAG',
    modules: []
  }
];

export function getRoutinesForPhase(phaseNum: number): string[] {
  const phaseDef = PHASES.find(p => p.phase === phaseNum);
  if (!phaseDef) {
    throw new Error(`Fase não encontrada: ${phaseNum}`);
  }

  const routines: string[] = [];

  // Fase 3: o escopo é exatamente o do manifesto (118 IDs), na ordem dele
  if (phaseNum === 3) {
    for (const entry of PHASE3_MANIFEST) {
      const match = findRoutineFileById(entry.id);
      if (match) routines.push(match);
      else console.warn(`[Fase 3] Rotina ${entry.id} do manifesto não encontrada em kb/rotinas/`);
    }
    return routines;
  }

  if (phaseDef.specificRoutines && phaseDef.specificRoutines.length > 0) {
    for (const rId of phaseDef.specificRoutines) {
      const match = findRoutineFileById(rId);
      if (match) routines.push(match);
    }
    return routines;
  }

  for (const mod of phaseDef.modules) {
    const modDir = path.join(config.kbDir, mod);
    if (fs.existsSync(modDir)) {
      const files = fs.readdirSync(modDir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
      for (const f of files) {
        routines.push(path.join(modDir, f));
      }
    }
  }

  return routines;
}

export function findRoutineFileById(routineId: string): string | null {
  const modDirs = fs.readdirSync(config.kbDir);
  for (const mod of modDirs) {
    const fullModDir = path.join(config.kbDir, mod);
    if (fs.statSync(fullModDir).isDirectory()) {
      const files = fs.readdirSync(fullModDir);
      for (const f of files) {
        if (f.startsWith(routineId + '-') || f === routineId + '.md') {
          return path.join(fullModDir, f);
        }
      }
    }
  }
  return null;
}
