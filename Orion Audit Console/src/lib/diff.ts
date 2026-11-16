import { diffArrays } from "diff";

export interface DiffPart { value: string; added?: boolean; removed?: boolean }

/** Trechos **negrito** contam como uma única palavra, para não quebrar os marcadores. */
const tokenize = (t: string) => t.match(/\*\*[^*]+\*\*|\s+|[^\s*]+|\*/g) ?? [];

export function wordDiff(a: string, b: string): DiffPart[] {
  return diffArrays(tokenize(a), tokenize(b)).map((p) => ({ value: p.value.join(""), added: p.added, removed: p.removed }));
}
