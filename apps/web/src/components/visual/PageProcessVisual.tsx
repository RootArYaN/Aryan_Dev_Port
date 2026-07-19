import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Beaker,
  Blocks,
  Bot,
  Braces,
  CheckCheck,
  Database,
  DraftingCompass,
  Gauge,
  Goal,
  Layers3,
  MessageSquareText,
  Network,
  ScanSearch,
  ShieldCheck,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type Variant = "journey" | "expertise" | "lab" | "contact";

type Step = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

const variants: Record<Variant, { label: string; accent: string; steps: Step[] }> = {
  journey: {
    label: "Career evolution",
    accent: "#a78bfa",
    steps: [
      { label: "Foundation", value: "Mechanical", detail: "Systems, manufacturing, and physical constraints", icon: DraftingCompass },
      { label: "Build", value: "Robotics", detail: "Controls, sensing, and integrated prototypes", icon: Bot },
      { label: "Apply", value: "Research", detail: "Autonomous platforms and real-world testing", icon: ScanSearch },
      { label: "Scale", value: "Analytics", detail: "Enterprise data products for operational teams", icon: BarChart3 },
    ],
  },
  expertise: {
    label: "System delivery path",
    accent: "#73e4de",
    steps: [
      { label: "Source", value: "SQL", detail: "Retrieve and validate operational data", icon: Database },
      { label: "Logic", value: "Python", detail: "Model rules, calculations, and services", icon: Braces },
      { label: "Experience", value: "React", detail: "Turn complexity into a focused workflow", icon: Layers3 },
      { label: "Confidence", value: "Release", detail: "Test, secure, observe, and improve", icon: ShieldCheck },
    ],
  },
  lab: {
    label: "Experiment loop",
    accent: "#6ee7b7",
    steps: [
      { label: "Question", value: "Study", detail: "Identify the assumption worth testing", icon: Beaker },
      { label: "Prototype", value: "Build", detail: "Create the smallest useful system", icon: Blocks },
      { label: "Evidence", value: "Measure", detail: "Test correctness, speed, and usability", icon: Gauge },
      { label: "Learning", value: "Improve", detail: "Keep what works and refine the model", icon: CheckCheck },
    ],
  },
  contact: {
    label: "Good project signal",
    accent: "#7dd3fc",
    steps: [
      { label: "Need", value: "Problem", detail: "What decision or workflow is blocked?", icon: MessageSquareText },
      { label: "Context", value: "Data", detail: "What information and constraints exist?", icon: Network },
      { label: "People", value: "Users", detail: "Who acts on the result and how?", icon: Users },
      { label: "Success", value: "Outcome", detail: "What measurable change should follow?", icon: Goal },
    ],
  },
};

export function PageProcessVisual({ variant }: { variant: Variant }) {
  const config = variants[variant];
  const [activeIndex, setActiveIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = config.steps[activeIndex];

  useEffect(() => {
    if (manual || reduceMotion) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % config.steps.length), 2400);
    return () => window.clearInterval(timer);
  }, [config.steps.length, manual, reduceMotion]);

  return (
    <div className="page-process" style={{ "--process-accent": config.accent } as React.CSSProperties}>
      <div className="page-process__heading">
        <span><i /> {config.label}</span>
        <small>{String(activeIndex + 1).padStart(2, "0")} / 04</small>
      </div>

      <div className="page-process__track" role="tablist" aria-label={config.label}>
        <motion.i
          className="page-process__signal"
          animate={{ left: `${((activeIndex + 0.5) / config.steps.length) * 100}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        />
        {config.steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <button
              key={step.label}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              onClick={() => {
                setActiveIndex(index);
                setManual(true);
              }}
            >
              <span><Icon size={14} /></span>
              <small>{step.label}</small>
            </button>
          );
        })}
      </div>

      <motion.div
        key={`${variant}-${active.label}`}
        className="page-process__detail"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        aria-live="polite"
      >
        <strong>{active.value}</strong>
        <span>{active.detail}</span>
      </motion.div>
    </div>
  );
}
