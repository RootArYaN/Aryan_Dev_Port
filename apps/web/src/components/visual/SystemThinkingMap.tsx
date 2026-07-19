import { useEffect, useState } from "react";
import { Boxes, ChartNoAxesCombined, CircleCheck, DatabaseZap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const signals = [
  {
    id: "production",
    label: "Production",
    icon: DatabaseZap,
    metric: "91.8%",
    metricLabel: "stable output",
    outcome: "Review two settings",
    path: "M42 34 C112 34 104 108 184 108",
    color: "#73e4de",
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Boxes,
    metric: "12.4%",
    metricLabel: "overstock risk",
    outcome: "Move three ageing stock groups",
    path: "M42 108 H184",
    color: "#a78bfa",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: ChartNoAxesCombined,
    metric: "24.7%",
    metricLabel: "conversion",
    outcome: "Test the weak price range",
    path: "M42 182 C112 182 104 108 184 108",
    color: "#f7c66a",
  },
] as const;

export function SystemThinkingMap() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = signals[activeIndex];

  useEffect(() => {
    if (manual || reduceMotion) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % signals.length), 2800);
    return () => window.clearInterval(timer);
  }, [manual, reduceMotion]);

  return (
    <div className="thinking-map" style={{ "--thinking-accent": active.color } as React.CSSProperties}>
      <div className="thinking-map__label"><span><i /> live model</span><small>checked sample</small></div>

      <div className="thinking-map__canvas">
        <svg viewBox="0 0 360 216" aria-hidden="true">
          {signals.map((signal, index) => (
            <g key={signal.id}>
              <path className={index === activeIndex ? "is-active" : ""} d={signal.path} />
              {index === activeIndex && !reduceMotion && (
                <motion.circle
                  r="3"
                  fill={signal.color}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  style={{ offsetPath: `path('${signal.path}')` }}
                />
              )}
            </g>
          ))}
          <path className="thinking-map__out-path" d="M218 108 C274 108 273 108 327 108" />
        </svg>

        <div className="thinking-map__sources" role="tablist" aria-label="Select operational signal">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <button
                key={signal.id}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                onClick={() => {
                  setActiveIndex(index);
                  setManual(true);
                }}
              >
                <Icon size={13} /> {signal.label}
              </button>
            );
          })}
        </div>

        <div className="thinking-map__core" aria-label="Validation and modelling engine">
          <motion.i
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <span>Validate</span>
          <strong>Model</strong>
        </div>

        <motion.div
          key={active.id}
          className="thinking-map__output"
          initial={reduceMotion ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28 }}
          aria-live="polite"
        >
          <CircleCheck size={14} />
          <strong>{active.metric}</strong>
          <span>{active.metricLabel}</span>
        </motion.div>
      </div>

      <motion.p key={active.outcome} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }}>
        <span>Next:</span> {active.outcome}
      </motion.p>
    </div>
  );
}
