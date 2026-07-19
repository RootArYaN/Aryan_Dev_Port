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
    label: "Career path",
    accent: "#a78bfa",
    steps: [
      { label: "Start", value: "Mechanical", detail: "Design, manufacturing, and real limits", icon: DraftingCompass },
      { label: "Build", value: "Robotics", detail: "Controls, sensors, and working prototypes", icon: Bot },
      { label: "Test", value: "Research", detail: "Self-driving systems and field tests", icon: ScanSearch },
      { label: "Use", value: "Analytics", detail: "Data tools for work teams", icon: BarChart3 },
    ],
  },
  expertise: {
    label: "Build path",
    accent: "#73e4de",
    steps: [
      { label: "Data", value: "SQL", detail: "Get and check the data", icon: Database },
      { label: "Logic", value: "Python", detail: "Build rules, calculations, and APIs", icon: Braces },
      { label: "Screen", value: "React", detail: "Make the workflow clear", icon: Layers3 },
      { label: "Ship", value: "Release", detail: "Test, secure, watch, and improve", icon: ShieldCheck },
    ],
  },
  lab: {
    label: "Test and learn",
    accent: "#6ee7b7",
    steps: [
      { label: "Ask", value: "Study", detail: "Choose one idea to test", icon: Beaker },
      { label: "Build", value: "Prototype", detail: "Create the smallest useful version", icon: Blocks },
      { label: "Check", value: "Measure", detail: "Test results, speed, and ease of use", icon: Gauge },
      { label: "Learn", value: "Improve", detail: "Keep what works and fix what does not", icon: CheckCheck },
    ],
  },
  contact: {
    label: "Project basics",
    accent: "#7dd3fc",
    steps: [
      { label: "Need", value: "Problem", detail: "What is slow or blocked?", icon: MessageSquareText },
      { label: "Input", value: "Data", detail: "What data and limits exist?", icon: Network },
      { label: "People", value: "Users", detail: "Who will use the result?", icon: Users },
      { label: "Goal", value: "Outcome", detail: "What should improve?", icon: Goal },
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
