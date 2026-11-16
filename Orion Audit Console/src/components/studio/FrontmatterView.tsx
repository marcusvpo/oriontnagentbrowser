import { CopyCode } from "./CopyCode";

export function FrontmatterView({ original, revisado }: { original: string; revisado: string }) {
  return (
    <div className="stack-6">
      <CopyCode title="YAML original" code={original} />
      <CopyCode title="YAML revisado (com auditoria_ui)" code={revisado} />
    </div>
  );
}
