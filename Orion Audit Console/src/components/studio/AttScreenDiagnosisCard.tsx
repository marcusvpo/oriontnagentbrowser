import { Alert } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { similarityPct, toDiagnosisView } from "@/lib/attDiagnosis";
import type { DiagnosticoTelaAtt } from "@/types/api";

/**
 * Raio-X da Tela Atual (ADR-028/029): o que existe de fato na tela onde o passo `[ATT]` bloqueou. Leitura somente
 * consultiva — nada foi clicado e o texto do manual segue original (Evidência Estrita).
 */
export function AttScreenDiagnosisCard({ diagnostico }: { diagnostico?: DiagnosticoTelaAtt | null }) {
  const v = toDiagnosisView(diagnostico);
  if (!v) return null;
  return (
    <Alert tone="accent" title="Raio-X da Tela Atual (subsídio para atualização do manual)">
      <div className="stack-3 att-diagnosis" data-testid="att-diagnosis" style={{ marginTop: "var(--space-2)" }}>
        <p className="t-body-s" style={{ margin: 0 }}>
          Tela alcançada no passo {v.passo}: rota <strong className="t-mono">{v.rota}</strong>
          {v.titulo ? <> · título <strong>{v.titulo}</strong></> : null}
          {v.emModal ? " · modal aberto" : ""}. Leitura ao vivo do DOM; nada foi acionado.
        </p>

        {v.vazio && <p className="t-body-s dim" style={{ margin: 0 }}>A tela não expôs seções, campos nem botões legíveis.</p>}

        {v.secoes.length > 0 && <Row label="Seções visíveis" items={v.secoes} />}
        {v.abas.length > 0 && <Row label="Abas" items={v.abas} />}
        {v.campos.length > 0 && <Row label="Campos reais" items={v.campos.map((c) => c.rotulo + (c.obrigatorio ? " *" : ""))} />}
        {v.botoes.length > 0 && <Row label="Botões reais" items={v.botoes} />}

        {v.sugestoes.length > 0 && (
          <div className="stack-1">
            <span className="t-overline-xs">Sugestões de atualização editorial</span>
            <ul className="ol-steps t-body-s" style={{ margin: 0 }}>
              {v.sugestoes.map((s, i) => (
                <li key={`${s.alvo}-${i}`}>
                  O manual cita <strong>{s.alvo}</strong>; a tela tem <strong>{s.real}</strong>
                  {s.tipo ? ` (${s.tipo}${s.secao ? `, seção ${s.secao}` : ""})` : ""} · afinidade {similarityPct(s.similaridade)}.
                </li>
              ))}
            </ul>
          </div>
        )}

        {v.semCorrespondencia.length > 0 && <Row label="Sem correspondência funcional na tela" items={v.semCorrespondencia} />}
        {v.reescrita && <p className="t-body-s" style={{ margin: 0 }}>{v.reescrita}</p>}
        {v.printContexto && <p className="t-overline-xs" style={{ margin: 0 }}>Referência visual: {v.printContexto}</p>}
      </div>
    </Alert>
  );
}

function Row({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="stack-1">
      <span className="t-overline-xs">{label}</span>
      <span className="t-body-s">{items.map((it, i) => <span key={`${it}-${i}`} className="chip" style={{ marginRight: "var(--space-1)" }}>{it}</span>)}</span>
    </div>
  );
}
