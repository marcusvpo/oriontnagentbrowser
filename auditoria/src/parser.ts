import fs from 'node:fs';
import yaml from 'yaml';
import type { ParsedRoutine, RoutineStep, ActionType } from './types.js';

export function parseRoutineMarkdown(filePath: string): ParsedRoutine {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
  const parts = content.split(/^---$/m);

  if (parts.length < 3) {
    throw new Error(`Arquivo não possui YAML frontmatter válido: ${filePath}`);
  }

  const rawYaml = parts[1].trim();
  const body = parts.slice(2).join('---').trim();
  const frontmatter = yaml.parse(rawYaml);

  // Extrair descrição
  let descricao = '';
  const descMatch = body.match(/#### Descrição:\s*\n(.*?)(?=\n####|\n\*\s+\*\*|\n---\s*\n|$)/s);
  if (descMatch) {
    descricao = descMatch[1].trim();
  }

  // Extrair passos
  const steps: RoutineStep[] = [];
  const stepsMatch = body.match(/#### Passo a passo:\s*\n(.*?)(?=\n####|\n\*\s+\*\*|\n---\s*\n|$)/s);

  if (stepsMatch) {
    const stepsText = stepsMatch[1].trim();
    const lines = stepsText.split('\n');
    let currentStep: RoutineStep | null = null;

    for (const line of lines) {
      const stepMatch = line.match(/^\s*(\d+)\.\s*(.+)$/);
      if (stepMatch) {
        if (currentStep) {
          steps.push(currentStep);
        }
        const stepNum = parseInt(stepMatch[1], 10);
        const text = stepMatch[2].trim();
        const targets = extractBoldTargets(text);
        const actionType = inferActionType(text);

        currentStep = {
          stepNumber: stepNum,
          rawText: text,
          targets,
          actionType,
          subItems: [],
          mainTargetCount: targets.length
        };
      } else if (currentStep && line.match(/^\s*[-*]\s+(.+)$/)) {
        const subText = line.replace(/^\s*[-*]\s+/, '').trim();
        currentStep.subItems?.push(subText);
        // Também extrair alvos dos sub-itens
        const subTargets = extractBoldTargets(subText);
        for (const st of subTargets) {
          if (!currentStep.targets.includes(st)) {
            currentStep.targets.push(st);
          }
        }
      }
    }
    if (currentStep) {
      steps.push(currentStep);
    }
  }

  // Extrair observações
  const observacoes: string[] = [];
  const obsMatches = body.matchAll(/^\s*\*\s+\*\*([^:]+):\*\*\s*(.+)$/gm);
  for (const m of obsMatches) {
    observacoes.push(`${m[1]}: ${m[2]}`);
  }

  return {
    id: String(frontmatter.id || ''),
    titulo: String(frontmatter.titulo || ''),
    modulo: String(frontmatter.modulo || ''),
    secao: String(frontmatter.secao || ''),
    tem_video: Boolean(frontmatter.video?.tem_video),
    frontmatter,
    descricao,
    steps,
    observacoes,
    rawContent: content
  };
}

/**
 * ADR-035: frase introdutória em negrito ("**Para definir um preço padrão:**", "**Se possuir scanner conectado:**").
 * Termina em dois-pontos e abre com conectivo de finalidade/condição: é o enunciado do passo, nunca um controle da
 * tela (virava alvo "não localizado" e bloqueava a rotina com `[ATT]`). Rótulo de seção real ("**Serventia:**",
 * "**Seção Final (Outras Informações):**") não começa por esses conectivos e continua sendo alvo.
 */
const LEAD_IN_BOLD_RE = /^(para|se|caso|quando|ao|enquanto|sempre que|em caso de|nos casos em que|no caso de)\s+\S[^]*:\s*$/i;

export function isLeadInBoldPhrase(text: string): boolean {
  return LEAD_IN_BOLD_RE.test(String(text ?? '').trim());
}

export function extractBoldTargets(text: string): string[] {
  const targets: string[] = [];
  const matches = text.matchAll(/\*\*([^*]+)\*\*/g);
  for (const m of matches) {
    const cleaned = m[1].trim();
    if (isLeadInBoldPhrase(cleaned)) continue;
    // ADR-029: negrito sem letra nem número ("(**\***)" = asterisco de campo obrigatório escapado) é pontuação do
    // texto, não um controle da tela: nunca é alvo (virava o alvo espúrio "\" e bloqueava a rotina com `[ATT]`).
    if (cleaned && /[\p{L}\p{N}]/u.test(cleaned) && !targets.includes(cleaned)) {
      targets.push(cleaned);
    }
  }
  return targets;
}

function inferActionType(text: string): ActionType {
  const lower = text.toLowerCase();
  if (lower.includes('clique') || lower.includes('acesse') || lower.includes('abra') || lower.includes('selecione o card')) {
    return 'click';
  }
  if (lower.includes('digite') || lower.includes('informe') || lower.includes('preencha')) {
    return 'fill';
  }
  if (lower.includes('selecione') || lower.includes('escolha') || lower.includes('marque')) {
    return 'select';
  }
  if (lower.includes('confira') || lower.includes('verifique') || lower.includes('certifique-se')) {
    return 'verify';
  }
  return 'click';
}

// Auto-teste se executado diretamente
if (process.argv[1]?.endsWith('parser.ts')) {
  let testFile = 'kb/rotinas/caixa/D-1.1-acessar-o-modulo-orion-caixa.md';
  if (!fs.existsSync(testFile)) {
    testFile = '../' + testFile;
  }
  const parsed = parseRoutineMarkdown(testFile);
  console.log(`[Parser Test] Rotina carregada: ${parsed.id} - ${parsed.titulo}`);
  console.log(`[Parser Test] Passos identificados: ${parsed.steps.length}`);
  parsed.steps.forEach(s => {
    console.log(`  Passo ${s.stepNumber} [${s.actionType}]: ${s.targets.join(', ')}`);
  });
}
