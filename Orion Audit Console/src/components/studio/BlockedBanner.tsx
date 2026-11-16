import { Alert } from "@/design-system/orion-audit-console---design-system-bdbb01";

export function BlockedBanner({ bloqueio }: { bloqueio: { tipo: string; motivo: string; roteiroManual: string[] } }) {
  return (
    <Alert tone="error" title={`CAUTION · ${bloqueio.tipo}`}>
      <div className="stack-3" style={{ marginTop: "var(--space-2)" }}>
        <p className="t-body-s" style={{ margin: 0 }}>{bloqueio.motivo}</p>
        <span className="t-overline-xs">Roteiro técnico para execução manual</span>
        <ol className="ol-steps t-body-s">{bloqueio.roteiroManual.map((r, i) => <li key={i}>{r}</li>)}</ol>
      </div>
    </Alert>
  );
}
