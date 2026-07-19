import { useState } from "react";
import { CheckCircle2, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { projectMeta } from "@/data/profile";

type DemoState = {
  metric: string;
  delta: string;
  bars: number[];
};

type Demo = {
  label: string;
  action: string;
  units: string;
  labels: string[];
  baseline: DemoState;
  scenario: DemoState;
};

const demos: Record<string, Demo> = {
  "manufacturing-analytics-platform": {
    label: "Stable output",
    action: "Forecast",
    units: "stage performance",
    labels: ["Rough", "Cut", "Polish", "QC"],
    baseline: { metric: "91.8%", delta: "Current shift", bars: [72, 81, 88, 74] },
    scenario: { metric: "93.1%", delta: "+1.3 pts", bars: [78, 86, 94, 82] },
  },
  "inventory-intelligence": {
    label: "Overstock risk",
    action: "Reallocate",
    units: "inventory ageing",
    labels: ["0–15d", "16–30d", "31–60d", "60d+"],
    baseline: { metric: "12.4%", delta: "Current exposure", bars: [92, 73, 48, 26] },
    scenario: { metric: "8.9%", delta: "−3.5 pts", bars: [94, 78, 39, 16] },
  },
  "sales-pricing-analytics": {
    label: "Conversion",
    action: "Test pricing",
    units: "segment response",
    labels: ["Domestic", "Export", "Repeat", "New"],
    baseline: { metric: "24.7%", delta: "Current mix", bars: [76, 88, 63, 52] },
    scenario: { metric: "27.2%", delta: "+2.5 pts", bars: [81, 91, 71, 58] },
  },
  "report-automation": {
    label: "Report time",
    action: "Automate",
    units: "workflow duration",
    labels: ["Extract", "Prepare", "Check", "Publish"],
    baseline: { metric: "42 min", delta: "Manual", bars: [86, 92, 58, 70] },
    scenario: { metric: "12 sec", delta: "Automated", bars: [18, 12, 16, 10] },
  },
  "autonomous-drone-platform": {
    label: "Landing error",
    action: "Run assist",
    units: "precision landing",
    labels: ["Detect", "Align", "Descend", "Land"],
    baseline: { metric: "1.8 m", delta: "GPS only", bars: [52, 61, 72, 84] },
    scenario: { metric: "0.24 m", delta: "Vision assist", bars: [91, 88, 93, 96] },
  },
  "hexapod-autonomous-robot": {
    label: "Gait stability",
    action: "Adapt gait",
    units: "terrain response",
    labels: ["Balance", "Stride", "Grip", "Recovery"],
    baseline: { metric: "74%", delta: "Fixed gait", bars: [74, 69, 62, 58] },
    scenario: { metric: "91%", delta: "Adaptive", bars: [91, 88, 94, 86] },
  },
};

const accentMap: Record<string, string> = {
  cyan: "#73e4de",
  violet: "#a78bfa",
  amber: "#f7c66a",
  emerald: "#6ee7b7",
  sky: "#7dd3fc",
  rose: "#fda4af",
};

export function ProjectGlyph({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [scenario, setScenario] = useState(false);
  const reduceMotion = useReducedMotion();
  const meta = projectMeta[slug] ?? { accent: "cyan", category: "System", index: "00" };
  const demo = demos[slug] ?? demos["manufacturing-analytics-platform"];
  const state = scenario ? demo.scenario : demo.baseline;
  const accent = accentMap[meta.accent] ?? accentMap.cyan;

  return (
    <div
      className={`project-demo ${compact ? "project-demo--compact" : ""}`}
      style={{ "--project-accent": accent } as React.CSSProperties}
    >
      <div className="project-demo__topline">
        <span>{demo.units}</span>
        <span><i /> validated</span>
      </div>

      <div className="project-demo__summary">
        <div aria-live="polite">
          <small>{demo.label}</small>
          <strong>{state.metric}</strong>
          <span>{state.delta}</span>
        </div>
        <button type="button" aria-pressed={scenario} onClick={() => setScenario((value) => !value)}>
          {scenario ? <CheckCircle2 size={13} /> : <Play size={12} fill="currentColor" />}
          {scenario ? "Reset" : demo.action}
        </button>
      </div>

      <div className="project-demo__bars" aria-label={`${demo.label} comparison`}>
        {state.bars.map((value, index) => (
          <div key={demo.labels[index]}>
            <span><small>{demo.labels[index]}</small><b>{value}%</b></span>
            <i>
              <motion.b
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.04 }}
              />
            </i>
          </div>
        ))}
      </div>

      <div className="project-demo__result">
        <span>{meta.index}</span>
        {scenario ? "Scenario applied to validated sample" : "Select an action to compare outcomes"}
      </div>
    </div>
  );
}
