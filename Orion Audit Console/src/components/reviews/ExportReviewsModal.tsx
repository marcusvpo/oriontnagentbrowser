import { useEffect, useMemo, useState } from "react";
import { Download, FileCode2, FileText, Sparkles } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Divider,
  Field,
  Input,
  Radio,
} from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import { useReviewer } from "@/components/governance/useReviewer";
import { useExportarRevisoes } from "@/hooks/useRotinas";
import { triggerTextDownload } from "@/lib/download";
import { toast } from "@/lib/toast";
import type { RoutineReviewItem } from "@/types/api";

interface Props {
  open: boolean;
  onClose: () => void;
  allReviews: RoutineReviewItem[];
  filteredReviews?: RoutineReviewItem[];
  defaultScope?: "pendentes" | "selecionadas" | "todas_ativas";
}

/**
 * Fluxo minimalista de exportação em massa das revisões humanas para análise e
 * ingestão manual no Antigravity / Claude Code (ADR-036).
 */
export function ExportReviewsModal({
  open,
  onClose,
  allReviews,
  filteredReviews,
  defaultScope = "pendentes",
}: Props) {
  const [operador, setOperador] = useReviewer();
  const [escopo, setEscopo] = useState<"pendentes" | "selecionadas" | "todas_ativas">(defaultScope);
  const [formato, setFormato] = useState<"markdown" | "json">("markdown");
  const [marcarComoIngeridas, setMarcarComoIngeridas] = useState(true);
  const [nota, setNota] = useState("");
  const [touched, setTouched] = useState(false);

  const exportMutation = useExportarRevisoes();

  const pendingList = useMemo(
    () => allReviews.filter((r) => r.pendenteExportacao),
    [allReviews],
  );
  const activeList = useMemo(
    () => allReviews.filter((r) => r.status === "aberta" || r.status === "em_andamento"),
    [allReviews],
  );
  const hasDistinctFilter = Boolean(
    filteredReviews && filteredReviews.length > 0 && filteredReviews.length !== allReviews.length,
  );

  useEffect(() => {
    if (open) {
      setTouched(false);
      setNota("");
      setFormato("markdown");
      const initialScope =
        defaultScope === "pendentes" && pendingList.length === 0 && activeList.length > 0
          ? "todas_ativas"
          : defaultScope;
      setEscopo(initialScope);
      setMarcarComoIngeridas(initialScope === "pendentes");
      exportMutation.reset();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const targetReviews = useMemo(() => {
    if (escopo === "pendentes") return pendingList;
    if (escopo === "selecionadas") return filteredReviews ?? [];
    return activeList;
  }, [escopo, pendingList, filteredReviews, activeList]);

  const targetRoutineIds = useMemo(
    () => Array.from(new Set(targetReviews.map((r) => r.routineId))).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true })),
    [targetReviews],
  );

  const operadorErr =
    touched && marcarComoIngeridas && !operador.trim()
      ? "Informe quem está exportando para registrar no histórico do lote."
      : undefined;

  const submit = () => {
    setTouched(true);
    if (targetReviews.length === 0) return;
    if (marcarComoIngeridas && !operador.trim()) return;

    exportMutation.mutate(
      {
        escopo,
        reviewIds: escopo === "selecionadas" ? targetReviews.map((r) => r.id) : undefined,
        formato,
        marcarComoIngeridas,
        operador: operador.trim() || "Operador",
        nota: nota.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          triggerTextDownload(res.filename, res.content, res.mimeType);
          toast(
            marcarComoIngeridas ? "Pacote exportado e ingerido" : "Cópia de leitura exportada",
            `${res.totalRevisoes} revisão(ões) de ${res.totalRotinas} rotina(s) baixada(s) em ${res.filename}.`,
          );
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Exportar revisões para o agente"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            loading={exportMutation.isPending}
            disabled={targetReviews.length === 0}
            onClick={submit}
            data-testid="confirm-export-reviews"
          >
            <Download size={14} strokeWidth={1.6} />
            {marcarComoIngeridas ? "Baixar & marcar ingeridas" : "Baixar apenas cópia"}
          </Button>
        </>
      }
    >
      <div className="stack-4" data-testid="export-reviews-modal">
        <p className="t-body-s" style={{ margin: 0 }}>
          Gere um pacote consolidado com as observações dos revisores, passo a passo original × revisado e diagnósticos
          do motor para anexar e analisar profundamente no Antigravity.
        </p>

        {exportMutation.error && (
          <Alert tone="error" title="Não foi possível exportar">
            {(exportMutation.error as Error).message}
          </Alert>
        )}

        <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="ds-field__label">O que exportar</legend>
          <Radio
            name="export-scope"
            checked={escopo === "pendentes"}
            onChange={() => {
              setEscopo("pendentes");
              setMarcarComoIngeridas(true);
            }}
          >
            <span>
              Apenas pendentes de ingestão{" "}
              <strong className="t-mono">({pendingList.length})</strong>{" "}
              <span className="t-body-s dim">· recomendado</span>
            </span>
          </Radio>
          {hasDistinctFilter && (
            <Radio
              name="export-scope"
              checked={escopo === "selecionadas"}
              onChange={() => setEscopo("selecionadas")}
            >
              <span>
                Somente o filtro atual da tela{" "}
                <strong className="t-mono">({filteredReviews?.length ?? 0})</strong>
              </span>
            </Radio>
          )}
          <Radio
            name="export-scope"
            checked={escopo === "todas_ativas"}
            onChange={() => setEscopo("todas_ativas")}
          >
            <span>
              Todas as revisões ativas (abertas e em andamento){" "}
              <strong className="t-mono">({activeList.length})</strong>
            </span>
          </Radio>
        </fieldset>

        <fieldset className="stack-2" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="ds-field__label">Formato do arquivo</legend>
          <div className="row-3">
            <Radio name="export-format" checked={formato === "markdown"} onChange={() => setFormato("markdown")}>
              <span className="icon-inline">
                <FileText size={14} strokeWidth={1.5} aria-hidden /> Markdown (.md) · ideal p/ Antigravity
              </span>
            </Radio>
            <Radio name="export-format" checked={formato === "json"} onChange={() => setFormato("json")}>
              <span className="icon-inline">
                <FileCode2 size={14} strokeWidth={1.5} aria-hidden /> JSON estruturado (.json)
              </span>
            </Radio>
          </div>
        </fieldset>

        <div className="export-preview-box stack-2">
          <div className="row-between">
            <span className="t-overline-xs">Prévia do lote</span>
            <span className="t-mono">
              {targetReviews.length} revisão(ões) · {targetRoutineIds.length} rotina(s)
            </span>
          </div>
          {targetRoutineIds.length === 0 ? (
            <span className="t-body-s dim">Nenhuma revisão disponível neste escopo.</span>
          ) : (
            <div className="row">
              {targetRoutineIds.map((id) => (
                <span key={id} className="chip t-mono">
                  {id}
                </span>
              ))}
            </div>
          )}
        </div>

        <Divider style={{ margin: 0 }} />

        <div className="stack-3">
          <Checkbox
            checked={marcarComoIngeridas}
            onChange={(e) => setMarcarComoIngeridas(e.target.checked)}
          >
            <span>
              Marcar estas rotinas e revisões como{" "}
              <Badge status="neutral" className="ds-badge--ingested" hideDot style={{ verticalAlign: "middle" }}>
                <Sparkles size={11} strokeWidth={1.6} aria-hidden /> Ingerida pelo agente
              </Badge>
            </span>
          </Checkbox>

          {marcarComoIngeridas && (
            <div className="cols-2">
              <Field label="Responsável pelo lote" error={operadorErr}>
                {(p) => (
                  <Input
                    {...p}
                    value={operador}
                    onChange={(e) => setOperador(e.target.value)}
                    placeholder="Ex.: Marcus"
                  />
                )}
              </Field>
              <Field label="Nota do lote (opcional)">
                {(p) => (
                  <Input
                    {...p}
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Ex.: Triagem SD Fase 3"
                  />
                )}
              </Field>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
