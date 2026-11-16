import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { Crosshair, Expand, ImageOff, Keyboard, Maximize, Minus, OctagonAlert, Plus, ScanLine, X } from "lucide-react";
import { Button, EmptyState, Skeleton, Switch, Tooltip } from "@/design-system/orion-audit-console---design-system-bdbb01";
import { Modal } from "@/components/ui/Modal";
import type { StepView } from "@/types/api";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { fmtKb } from "@/lib/format";
import { anchoredTransform, MAX_VIEWER_SCALE, wheelScale } from "@/lib/viewerZoom";
import { GeometryOverlay } from "./GeometryOverlay";
import { Filmstrip } from "./Filmstrip";

interface Props { steps: StepView[]; active: number; onSelect: (n: number) => void; loading?: boolean; bloqueioTipo?: string }

const SHORTCUTS: Array<[string, string]> = [["← / → ou J / K", "Trocar de passo"], ["+ / −", "Zoom"], ["0", "Ajustar"], ["F", "Focar alvo"], ["O", "Sobreposição geométrica"], ["W", "Alternar WebP/PNG"], ["Ctrl+K", "Buscar rotina"]];

function Stage({ step, format, overlay, frame }: { step: StepView; format: "webp" | "png"; overlay: boolean; frame: number }) {
  const sub = frame > 0 ? step.subCapturas?.[frame - 1] : undefined;
  const m = sub ? sub.media : step.media;
  if (!m) return null;
  const view = sub ? { ...step, media: sub.media, domGeometry: sub.domGeometry, layoutResult: sub.layoutResult } : step;
  const src = format === "webp" && m.webpUrl ? m.webpUrl : m.pngUrl;
  return (
    <div className="viewer-stage" style={{ width: m.width, height: m.height }}>
      <img src={src} width={m.width} height={m.height} alt={`Print do passo ${step.stepNumber}${sub ? ` (${sub.printName})` : ""}`} draggable={false} />
      {overlay && <GeometryOverlay step={view} />}
    </div>
  );
}

export function ScreenshotViewer({ steps, active, onSelect, loading, bloqueioTipo }: Props) {
  const step = steps.find((s) => s.stepNumber === active);
  const [format, setFormat] = useState<"webp" | "png">("webp");
  const [overlay, setOverlay] = useState(false);
  const [full, setFull] = useState(false);
  const [help, setHelp] = useState(false);
  const [frame, setFrame] = useState(0);
  useEffect(() => setFrame(0), [active]);
  const frames = step?.subCapturas ?? [];
  const frameLabel = (kind?: string) => kind === "reveal" ? "Alvo revelado" : kind === "trigger" ? "Gatilho" : "Após a ação";
  const zoomRef = useRef<ReactZoomPanPinchRef | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [minScale, setMinScale] = useState(0.1);
  const [scale, setScale] = useState(1);
  const animationMs = (ms: number) => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;

  useEffect(() => { const f = localStorage.getItem("orion.formato"); if (f === "png" || f === "webp") setFormat(f); }, []);
  const toggleFormat = () => setFormat((f) => { const n = f === "webp" ? "png" : "webp"; localStorage.setItem("orion.formato", n); return n; });

  const fit = useCallback((ms = 0) => {
    const z = zoomRef.current; const box = boxRef.current; const m = step?.media;
    if (!z || !box || !m) return;
    const s = Math.min(1, box.clientWidth / m.width, box.clientHeight / m.height);
    if (s <= 0) return;
    setMinScale(s);
    z.setTransform((box.clientWidth - m.width * s) / 2, (box.clientHeight - m.height * s) / 2, s, animationMs(ms));
  }, [step?.media]);

  const actual = () => {
    const z = zoomRef.current; const box = boxRef.current; const m = step?.media;
    if (!z || !box || !m) return;
    z.setTransform((box.clientWidth - m.width) / 2, (box.clientHeight - m.height) / 2, 1, animationMs(240));
  };

  const focus = () => {
    const z = zoomRef.current; const box = boxRef.current; const t = step?.layoutResult?.targetBox;
    if (!z || !box || !t || step?.status === "blocked") return;
    const s = Math.min(3, box.clientWidth / (t.width * 2.4), box.clientHeight / (t.height * 2.4));
    z.setTransform(box.clientWidth / 2 - (t.x + t.width / 2) * s, box.clientHeight / 2 - (t.y + t.height / 2) * s, s, animationMs(240));
  };

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(() => fit());
    observer.observe(box);
    fit();
    return () => observer.disconnect();
  }, [active, full, fit]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !step?.media) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const z = zoomRef.current;
      if (!z || event.deltaY === 0) return;
      const { scale: current, positionX, positionY } = z.state;
      const rect = box.getBoundingClientRect();
      const next = wheelScale(current, event.deltaY, event.deltaMode, box.clientHeight, minScale);
      const position = anchoredTransform(positionX, positionY, current, next, event.clientX - rect.left - box.clientLeft, event.clientY - rect.top - box.clientTop);
      z.setTransform(position.x, position.y, next, 0);
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => box.removeEventListener("wheel", onWheel);
  }, [full, step?.media, minScale]);

  const zoom = (factor: number) => {
    const z = zoomRef.current; const box = boxRef.current;
    if (!z || !box) return;
    const { scale: current, positionX, positionY } = z.state;
    const next = Math.max(minScale, Math.min(MAX_VIEWER_SCALE, current * factor));
    const position = anchoredTransform(positionX, positionY, current, next, box.clientWidth / 2, box.clientHeight / 2);
    z.setTransform(position.x, position.y, next, animationMs(180));
  };

  const idx = steps.findIndex((s) => s.stepNumber === active);
  const go = (d: number) => { const n = steps[idx + d]; if (n) onSelect(n.stepNumber); };
  useKeyboardShortcuts({
    ArrowRight: () => go(1), ArrowLeft: () => go(-1), j: () => go(1), k: () => go(-1),
    "+": () => zoom(1.2), "=": () => zoom(1.2), "-": () => zoom(1 / 1.2),
    "0": () => fit(240), f: focus, o: () => setOverlay((o) => !o), w: toggleFormat, Escape: () => setFull(false),
  });

  const canOverlay = !!step?.layoutResult && step.status !== "blocked";
  const bytes = format === "webp" ? step?.media?.webpBytes : step?.media?.pngBytes;

  const toolbar = (
    <div className="viewer-toolbar">
      <div className="viewer-tool-group">
      <Tooltip content="Diminuir zoom"><Button size="md" iconOnly aria-label="Diminuir zoom" onClick={() => zoom(1 / 1.2)}><Minus size={14} strokeWidth={1.5} /></Button></Tooltip>
      <Tooltip content="Aumentar zoom"><Button size="md" iconOnly aria-label="Aumentar zoom" onClick={() => zoom(1.2)}><Plus size={14} strokeWidth={1.5} /></Button></Tooltip>
      <output className="t-mono viewer-scale" aria-label="Nível de zoom">{Math.round(scale * 100)}%</output>
      <Button size="md" onClick={() => fit(240)}><Maximize size={14} strokeWidth={1.5} />Ajustar</Button>
      <Button size="md" onClick={actual}>100%</Button>
      <Button size="md" disabled={!canOverlay} onClick={focus}><Crosshair size={14} strokeWidth={1.5} />Focar alvo</Button>
      </div>
      <div className="viewer-tool-group">
      <Tooltip content="Alternar formato (W)"><Button size="md" variant="ghost" onClick={toggleFormat} aria-label="Alternar formato">{format.toUpperCase()}{bytes ? ` · ${fmtKb(bytes)}` : ""}</Button></Tooltip>
      {canOverlay && <label className="row t-body-s"><Switch checked={overlay} onCheckedChange={setOverlay} aria-label="Sobreposição geométrica" />Sobreposição</label>}
      </div>
      <div className="viewer-tool-group viewer-tools-end">
      <Button size="md" variant="ghost" iconOnly aria-label="Atalhos de teclado" onClick={() => setHelp(true)}><Keyboard size={14} strokeWidth={1.5} /></Button>
      <Button size="md" variant="ghost" iconOnly aria-label={full ? "Sair da tela cheia" : "Expandir em tela cheia"} onClick={() => setFull((f) => !f)}>{full ? <X size={14} strokeWidth={1.5} /> : <Expand size={14} strokeWidth={1.5} />}</Button>
      </div>
    </div>
  );

  let body;
  if (loading) body = <Skeleton height="100%" />;
  else if (!step?.media) {
    body = step?.status === "blocked" || bloqueioTipo
      ? <EmptyState icon={<OctagonAlert size={24} strokeWidth={1.5} />} title="Rotina bloqueada sem prints" description={bloqueioTipo ? `Tipo de bloqueio: ${bloqueioTipo}` : "A execução foi bloqueada antes da captura."} />
      : <EmptyState icon={<ImageOff size={24} strokeWidth={1.5} />} title="Nenhuma print gerada para este passo" description="A rotina ainda não foi executada pelo runner." />;
  } else {
    body = (
      <TransformWrapper ref={zoomRef} minScale={minScale} maxScale={MAX_VIEWER_SCALE} limitToBounds centerZoomedOut disablePadding centerOnInit={false} onInit={() => fit()} onTransform={(_, state) => setScale(state.scale)} doubleClick={{ disabled: true }} wheel={{ disabled: true }} velocityAnimation={{ disabled: true }} autoAlignment={{ animationTime: 0 }}>
        <TransformComponent wrapperClass="viewer-wrapper" contentClass="viewer-content-inner">
          <Stage step={step} format={format} overlay={overlay && canOverlay} frame={frame} />
        </TransformComponent>
      </TransformWrapper>
    );
  }

  const content = (
    <>
      <div className="row-between">
        <span className="t-overline-xs"><ScanLine size={12} strokeWidth={1.5} aria-hidden /> Passo {active} de {steps.length}</span>
      </div>
      {frames.length > 0 && (
        <div className="viewer-tool-group" role="tablist" aria-label="Prints do passo">
          <Button size="md" variant={frame === 0 ? undefined : "ghost"} onClick={() => setFrame(0)}>Principal</Button>
          {frames.map((f, i) => <Button key={f.printName} size="md" variant={frame === i + 1 ? undefined : "ghost"} onClick={() => setFrame(i + 1)}>{f.printName.replace(/^passo-\d+-?/, "").replace(/\.png$/, "") || "b"} · {frameLabel(f.kind)}</Button>)}
        </div>
      )}
      {toolbar}
      <div className="viewer" ref={boxRef}>{body}</div>
      <Filmstrip steps={steps} active={active} onSelect={onSelect} />
    </>
  );

  return (
    <>
      {full ? <div className="lightbox" role="dialog" aria-label="Visualizador em tela cheia">{content}</div> : content}
      <Modal open={help} onClose={() => setHelp(false)} title="Atalhos">
        <dl className="kv">{SHORTCUTS.map(([k, v]) => <Fragment key={k}><dt className="t-mono">{k}</dt><dd>{v}</dd></Fragment>)}</dl>
      </Modal>
    </>
  );
}
