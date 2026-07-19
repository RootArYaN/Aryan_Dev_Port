import { useState } from "react";
import { CheckCircle2, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { projectMeta } from "@/data/profile";
import { projectComparisons } from "@/data/caseStory";
import { trackEvent } from "@/lib/analytics";

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
  const demo = projectComparisons[slug] ?? projectComparisons["manufacturing-analytics-platform"];
  const state = scenario ? demo.improved : demo.current;
  const accent = accentMap[meta.accent] ?? accentMap.cyan;

  const toggleScenario = () => {
    const next = !scenario;
    setScenario(next);
    trackEvent("scenario_interaction", {
      surface: compact ? "project-preview-compact" : "project-preview",
      slug,
      scenario: next ? "improved" : "current",
    });
  };

  return (
    <div
      className={`project-demo ${compact ? "project-demo--compact" : ""}`}
      style={{ "--project-accent": accent } as React.CSSProperties}
    >
      <div className="project-demo__topline">
        <span>{demo.units}</span>
        <span><i /> sample demo</span>
      </div>

      <div className="project-demo__summary">
        <div aria-live="polite">
          <small>{demo.label}</small>
          <strong>{state.metric}</strong>
          <span>{state.delta}</span>
        </div>
        <button type="button" aria-pressed={scenario} aria-label={`${scenario ? "Reset" : demo.action} for ${meta.category}`} onClick={toggleScenario}>
          {scenario ? <CheckCircle2 size={13} /> : <Play size={12} fill="currentColor" />}
          {scenario ? "Reset" : demo.action}
        </button>
      </div>

      <div className="project-demo__bars" aria-label={`${demo.label} current versus improved comparison`}>
        {state.bars.map((value, index) => (
          <div key={demo.labels[index]}>
            <span><small>{demo.labels[index]}</small><b>{value}%</b></span>
            <i>
              <motion.b
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.04 }}
              />
            </i>
          </div>
        ))}
      </div>

      <div className="project-demo__result">
        <span>{meta.index}</span>
        {scenario ? "Sample improvement shown" : "Choose an action to compare"}
      </div>
    </div>
  );
}
