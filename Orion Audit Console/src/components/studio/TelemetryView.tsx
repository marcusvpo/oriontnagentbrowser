import { Activity } from "lucide-react";
import { EmptyState } from "@/design-system/orion-audit-console---design-system-bdbb01";
import type { StepView } from "@/types/api";
import { CopyCode } from "./CopyCode";

export function TelemetryView({ step }: { step?: StepView }) {
  if (!step || (!step.domGeometry && !step.layoutResult)) {
    return <EmptyState icon={<Activity size={24} strokeWidth={1.5} />} title="Sem telemetria" description="Este passo não tem geometria registrada." />;
  }
  const g = step.domGeometry;
  return (
    <div className="stack-6">
      {g && <CopyCode title={`domGeometry · passo ${step.stepNumber}`} code={JSON.stringify({ cssBox: g.cssBox, viewport: g.viewport, zone: g.zone, contentRoot: g.contentRoot, lateralNavBoxes: g.lateralNavBoxes, groupMembers: g.groupMembers, groupUnionBox: g.groupUnionBox, unresolvedGroupTargets: g.unresolvedGroupTargets, clippedToViewport: g.clippedToViewport }, null, 2)} />}
      {step.layoutResult && <CopyCode title="layoutResult" code={JSON.stringify(step.layoutResult, null, 2)} />}
      {step.executedAction && <CopyCode title="executedAction" code={JSON.stringify(step.executedAction, null, 2)} />}
    </div>
  );
}
