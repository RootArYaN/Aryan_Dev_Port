import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  Boxes,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

type WorkspaceId = "production" | "inventory" | "sales";
type Scenario = "live" | "forecast";

type Workspace = {
  id: WorkspaceId;
  label: string;
  description: string;
  accent: string;
  metrics: Array<{
    label: string;
    live: string;
    forecast: string;
    delta: string;
  }>;
  liveTrend: number[];
  forecastTrend: number[];
  distribution: Array<{
    label: string;
    live: number;
    forecast: number;
  }>;
};

const workspaces: Workspace[] = [
  {
    id: "production",
    label: "Production",
    description: "Output, stable work, and unusual values.",
    accent: "Production view",
    metrics: [
      { label: "Items tracked", live: "18,420", forecast: "19,080", delta: "+3.6%" },
      { label: "Stable output", live: "91.8%", forecast: "93.1%", delta: "+1.3 pts" },
      { label: "Report time", live: "8 sec", forecast: "5 sec", delta: "-37%" },
    ],
    liveTrend: [42, 49, 47, 58, 55, 66, 64, 71, 69, 78, 82, 86],
    forecastTrend: [44, 51, 53, 59, 61, 67, 70, 75, 78, 83, 88, 92],
    distribution: [
      { label: "Cut", live: 78, forecast: 82 },
      { label: "Polish", live: 91, forecast: 94 },
      { label: "QC", live: 68, forecast: 76 },
      { label: "Dispatch", live: 84, forecast: 88 },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    description: "Stock movement, age, risk, and next actions.",
    accent: "Stock view",
    metrics: [
      { label: "Active stock", live: "₹4.8 Cr", forecast: "₹4.5 Cr", delta: "-6.2%" },
      { label: "Overstock risk", live: "12.4%", forecast: "8.9%", delta: "-3.5 pts" },
      { label: "Refresh cycle", live: "Live", forecast: "Live", delta: "SQL driven" },
    ],
    liveTrend: [72, 74, 70, 69, 66, 64, 61, 63, 59, 56, 54, 52],
    forecastTrend: [72, 70, 67, 64, 61, 57, 53, 49, 45, 43, 40, 38],
    distribution: [
      { label: "0–15d", live: 92, forecast: 94 },
      { label: "16–30d", live: 73, forecast: 78 },
      { label: "31–60d", live: 48, forecast: 39 },
      { label: "60d+", live: 26, forecast: 16 },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    description: "Price, sales, customer groups, and reports.",
    accent: "Sales view",
    metrics: [
      { label: "Conversion", live: "24.7%", forecast: "27.2%", delta: "+2.5 pts" },
      { label: "Average value", live: "₹38.4K", forecast: "₹40.1K", delta: "+4.4%" },
      { label: "Reports automated", live: "284", forecast: "300", delta: "daily" },
    ],
    liveTrend: [38, 43, 41, 49, 54, 51, 59, 63, 61, 70, 73, 77],
    forecastTrend: [39, 45, 48, 52, 57, 60, 65, 69, 73, 77, 82, 87],
    distribution: [
      { label: "Domestic", live: 76, forecast: 81 },
      { label: "Export", live: 88, forecast: 91 },
      { label: "Repeat", live: 63, forecast: 71 },
      { label: "New", live: 52, forecast: 58 },
    ],
  },
];

function createChart(values: number[]) {
  const width = 560;
  const height = 190;
  const horizontalPadding = 16;
  const verticalPadding = 18;
  const min = Math.min(...values) - 6;
  const max = Math.max(...values) + 6;
  const range = Math.max(max - min, 1);
  const usableWidth = width - horizontalPadding * 2;
  const usableHeight = height - verticalPadding * 2;

  const points = values.map((value, index) => ({
    x: horizontalPadding + (index / Math.max(values.length - 1, 1)) * usableWidth,
    y: verticalPadding + (1 - (value - min) / range) * usableHeight,
  }));

  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${path} L${points.at(-1)?.x ?? width},${height} L${points[0]?.x ?? 0},${height} Z`;

  return { width, height, points, path, area };
}

export function SaasAnalyticsSimulation() {
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId>("production");
  const [scenario, setScenario] = useState<Scenario>("live");
  const reduceMotion = useReducedMotion();
  const workspace = workspaces.find((item) => item.id === workspaceId) ?? workspaces[0];
  const trend = scenario === "forecast" ? workspace.forecastTrend : workspace.liveTrend;
  const chart = useMemo(() => createChart(trend), [trend]);
  const animationKey = `${workspaceId}-${scenario}`;

  return (
    <section className="saas-simulation-section px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="Interactive report"
            title="Production data in one clear view."
            description="Explore checked production, inventory, and sales data."
          />
        </Reveal>

        <Reveal delay={0.06}>
          <div className="saas-window">
            <div className="saas-window__chrome">
              <div className="saas-window__traffic" aria-hidden="true"><i /><i /><i /></div>
              <div className="saas-window__address">console.aryan.systems / executive-reporting</div>
              <div className="saas-window__secure"><ShieldCheck size={13} /> secure</div>
            </div>

            <div className="saas-window__toolbar">
              <div>
                <p>Report workspace</p>
                <span>{workspace.accent}</span>
              </div>
              <button
                type="button"
                className="saas-window__scenario"
                aria-pressed={scenario === "forecast"}
                onClick={() => setScenario((current) => (current === "live" ? "forecast" : "live"))}
              >
                <RefreshCw size={14} />
                {scenario === "live" ? "Run forecast" : "Return to live"}
              </button>
            </div>

            <div className="saas-window__tabs" role="tablist" aria-label="Reporting workspace">
              {workspaces.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={workspaceId === item.id}
                  onClick={() => {
                    setWorkspaceId(item.id);
                    setScenario("live");
                  }}
                >
                  {item.id === "production" && <BarChart3 size={15} />}
                  {item.id === "inventory" && <Boxes size={15} />}
                  {item.id === "sales" && <TrendingUp size={15} />}
                  {item.label}
                  {workspaceId === item.id && <motion.span layoutId="saas-active-tab" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={animationKey}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="saas-window__content"
              >
                <div className="saas-metrics">
                  {workspace.metrics.map((metric) => (
                    <motion.div key={metric.label} className="saas-metric" whileHover={reduceMotion ? undefined : { y: -2 }}>
                      <span>{metric.label}</span>
                      <strong>{scenario === "forecast" ? metric.forecast : metric.live}</strong>
                      <small>{metric.delta}</small>
                    </motion.div>
                  ))}
                </div>

                <div className="saas-dashboard-grid">
                  <article className="saas-chart-card">
                    <div className="saas-card-heading">
                      <div>
                        <span>Trend</span>
                        <strong>{workspace.label} result</strong>
                      </div>
                      <span className="saas-card-heading__mode">{scenario}</span>
                    </div>
                    <p className="saas-chart-card__description">{workspace.description}</p>
                    <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={`${workspace.label} ${scenario} trend simulation`}>
                      <defs>
                        <linearGradient id={`saas-area-${animationKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(113 227 220)" stopOpacity="0.24" />
                          <stop offset="100%" stopColor="rgb(113 227 220)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path className="saas-chart-gridline" d="M16 48 H544 M16 95 H544 M16 142 H544" />
                      <motion.path
                        d={chart.area}
                        fill={`url(#saas-area-${animationKey})`}
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.45 }}
                      />
                      <motion.path
                        d={chart.path}
                        fill="none"
                        stroke="rgb(126 231 226)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={reduceMotion ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                      />
                      {chart.points.map((point, index) => (
                        <motion.circle
                          key={`${point.x}-${point.y}`}
                          cx={point.x}
                          cy={point.y}
                          r="3.4"
                          fill="rgb(207 250 254)"
                          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: index === chart.points.length - 1 ? 1 : 0.45 }}
                          transition={{ delay: reduceMotion ? 0 : index * 0.025, duration: 0.2 }}
                        />
                      ))}
                    </svg>
                  </article>

                  <article className="saas-distribution-card">
                    <div className="saas-card-heading">
                      <div>
                        <span>Breakdown</span>
                        <strong>Current mix</strong>
                      </div>
                    </div>
                    <div className="saas-bars">
                      {workspace.distribution.map((item) => {
                        const value = scenario === "forecast" ? item.forecast : item.live;
                        return (
                          <div key={item.label} className="saas-bar">
                            <div><span>{item.label}</span><strong>{value}%</strong></div>
                            <i><motion.b initial={reduceMotion ? false : { width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }} /></i>
                          </div>
                        );
                      })}
                    </div>
                  </article>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
