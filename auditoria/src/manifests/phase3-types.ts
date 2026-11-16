import type { ActionType, StepZonePolicy, WorkloadType } from '../types.js';

export type Phase3Module = 'firmas' | 'selos' | 'livros' | 'certidoes' | 'centrais';

export interface Phase3StepEntry {
  stepNumber: number;
  rawText: string;
  actionType: ActionType;
  zone: StepZonePolicy;
  targets: string[];
  implicitTargets: string[];
  mainTargetCount: number;
  menuPath?: string;
}

export interface Phase3HardwarePreTriage {
  isHardwareDependent: boolean;
  tag?: '[DDD]';
  reason?: string;
}

export interface Phase3RoutineEntry {
  id: string;
  slug: string;
  titulo: string;
  modulo: Phase3Module;
  filePath: string;
  routeHash: string | null;
  menuPaths: string[];
  workloadType: WorkloadType;
  hardwarePreTriage: Phase3HardwarePreTriage;
  steps: Phase3StepEntry[];
}
