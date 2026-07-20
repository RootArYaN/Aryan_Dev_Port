import { useEffect, useState } from "react";
import { Braces, Database, FileText, PanelsTopLeft, Rocket, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";

type BuildStage = {
  id: string;
  label: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
  lines: string[];
};

const stages: BuildStage[] = [
  {
    id: "plan",
    label: "Plan",
    title: "Start with the story",
    summary: "Choose the work, remove private details, and explain each result in plain words.",
    icon: FileText,
    color: "#7dd3fc",
    tags: ["Content", "Case studies", "Privacy"],
    lines: ["Set the goal", "Choose real projects", "Write clear case stories"],
  },
  {
    id: "web",
    label: "Web",
    title: "Build the interface",
    summary: "React handles the pages. Vite builds the site. Motion adds feedback where it helps.",
    icon: PanelsTopLeft,
    color: "#73e4de",
    tags: ["React", "Vite", "TypeScript"],
    lines: ["Create shared pages", "Add responsive layouts", "Animate useful actions"],
  },
  {
    id: "api",
    label: "API",
    title: "Connect the backend",
    summary: "FastAPI serves projects, accepts contact messages, and protects the private admin area.",
    icon: Braces,
    color: "#a78bfa",
    tags: ["FastAPI", "Validation", "Auth"],
    lines: ["GET  /projects", "POST /contact", "POST /auth/login"],
  },
  {
    id: "data",
    label: "Data",
    title: "Store data safely",
    summary: "SQLAlchemy maps the data, Alembic tracks changes, and contact details stay encrypted.",
    icon: Database,
    color: "#f7c66a",
    tags: ["PostgreSQL", "Alembic", "Encryption"],
    lines: ["Create data models", "Run database changes", "Encrypt private messages"],
  },
  {
    id: "ship",
    label: "Ship",
    title: "Test and deploy",
    summary: "GitHub Actions checks both apps, sends the web build to Pages, and builds the API image.",
    icon: Rocket,
    color: "#6ee7b7",
    tags: ["GitHub Actions", "Pages", "Containers"],
    lines: ["Check types and tests", "Deploy the web app", "Publish the API image"],
  },
];

export function PortfolioBuildStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = stages[activeIndex];

  useEffect(() => {
    if (manual || reduceMotion) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % stages.length), 2600);
    return () => window.clearInterval(timer);
  }, [manual, reduceMotion]);

  return (
    <section className="portfolio-build px-5 py-16 lg:px-8 lg:py-20" aria-labelledby="portfolio-build-title">
      <div className="mx-auto max-w-7xl">
        <div className="portfolio-build__intro">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">How this site was built</p>
            <h2 id="portfolio-build-title" className="mt-5 max-w-4xl text-balance text-4xl font-medium leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl">
              One portfolio, built as a full system.
            </h2>
          </div>
          <p>Choose a step to see how the frontend, backend, data, and deployment fit together.</p>
        </div>

        <div className="portfolio-build__workspace" style={{ "--build-accent": active.color } as React.CSSProperties}>
          <div className="portfolio-build__status">
            <span><i /> portfolio.build</span>
            <span><ShieldCheck size={13} /> Step {activeIndex + 1} of {stages.length}</span>
          </div>

          <div className="portfolio-build__track" role="tablist" aria-label="Portfolio build steps">
            <div className="portfolio-build__rail"><motion.i animate={{ scaleX: activeIndex / (stages.length - 1) }} /></div>
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const reached = index <= activeIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  className={reached ? "is-reached" : undefined}
                  onClick={() => {
                    setActiveIndex(index);
                    setManual(true);
                  }}
                >
                  <span><Icon size={16} /></span>
                  <small>0{index + 1}</small>
                  <strong>{stage.label}</strong>
                </button>
              );
            })}
          </div>

          <motion.div
            key={active.id}
            className="portfolio-build__detail"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            aria-live="polite"
          >
            <div className="portfolio-build__copy">
              <span>{active.label}</span>
              <h3>{active.title}</h3>
              <p>{active.summary}</p>
              <div>{active.tags.map((tag) => <small key={tag}>{tag}</small>)}</div>
            </div>
            <div className="portfolio-build__log">
              <div><span>BUILD LOG</span><small>complete</small></div>
              <ol>
                {active.lines.map((line, index) => (
                  <motion.li
                    key={line}
                    initial={reduceMotion ? false : { opacity: 0, x: -7 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
                  >
                    <span>0{index + 1}</span><i /><strong>{line}</strong><small>done</small>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
