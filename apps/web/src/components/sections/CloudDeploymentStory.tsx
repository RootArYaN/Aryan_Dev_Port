import { useEffect, useState, type CSSProperties } from "react";
import {
  BadgeCheck,
  Container,
  Database,
  GitBranch,
  Globe2,
  MailCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type DeploymentStage = {
  id: string;
  label: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
  trace: string[];
};

const stages: DeploymentStage[] = [
  {
    id: "source",
    label: "Source",
    title: "A private repository starts the release",
    summary:
      "Every production change begins as a focused commit. Render reads the private GitHub repository without exposing application secrets.",
    icon: GitBranch,
    color: "#7dd3fc",
    tags: ["GitHub", "Private source", "Versioned changes"],
    trace: ["Commit pushed to main", "Render receives deploy hook", "Secrets stay outside Git"],
  },
  {
    id: "verify",
    label: "Verify",
    title: "Checks run before cloud release",
    summary:
      "GitHub Actions checks the React build, Python lint rules, and backend tests before Render promotes the new version.",
    icon: BadgeCheck,
    color: "#73e4de",
    tags: ["TypeScript", "Ruff", "Pytest"],
    trace: ["Frontend type-check passes", "API lint passes", "Backend tests pass"],
  },
  {
    id: "web",
    label: "Render Static",
    title: "Render publishes the React frontend",
    summary:
      "Vite creates a static production build that Render distributes over HTTPS while React keeps each route fast and interactive.",
    icon: Globe2,
    color: "#60a5fa",
    tags: ["Render Static", "React", "HTTPS edge"],
    trace: ["Vite bundle created", "Static assets published", "React routes available"],
  },
  {
    id: "api",
    label: "Render API",
    title: "Render builds and starts the API container",
    summary:
      "The Docker image installs locked dependencies, applies Alembic migrations, initializes safe defaults, and starts FastAPI behind HTTPS.",
    icon: Container,
    color: "#a78bfa",
    tags: ["Render", "Docker", "FastAPI"],
    trace: ["Container image built", "Database migration applied", "Health check returns OK"],
  },
  {
    id: "data",
    label: "Neon",
    title: "Neon keeps application data durable",
    summary:
      "Managed PostgreSQL stores projects and encrypted contact messages independently from the disposable web container.",
    icon: Database,
    color: "#f7c66a",
    tags: ["Neon", "PostgreSQL", "Encryption"],
    trace: ["TLS connection established", "Contact fields encrypted", "Persistent records committed"],
  },
  {
    id: "mail",
    label: "Brevo Mail",
    title: "Brevo delivers mail through an HTTPS API",
    summary:
      "Render's free tier blocks standard SMTP ports, so the API sends contact alerts and confirmations securely through Brevo over HTTPS.",
    icon: MailCheck,
    color: "#6ee7b7",
    tags: ["Brevo API", "Port 443", "Transactional email"],
    trace: ["Contact stored first", "HTTPS mail request accepted", "Delivery status recorded"],
  },
];

export function CloudDeploymentStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = stages[activeIndex];

  useEffect(() => {
    if (manual || reduceMotion) return;
    const timer = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % stages.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [manual, reduceMotion]);

  return (
    <section
      id="cloud-deployment"
      className="cloud-deploy scroll-mt-24 px-5 py-16 lg:px-8 lg:py-20"
      aria-labelledby="cloud-deploy-title"
    >
      <div className="mx-auto max-w-7xl">
        <div className="cloud-deploy__intro">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">
              Live cloud architecture
            </p>
            <h2 id="cloud-deploy-title" className="mt-5 max-w-4xl text-balance text-4xl font-medium leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl">
              This portfolio now runs fully in the cloud.
            </h2>
          </div>
          <p>
            Follow a release through Render's frontend and API services, Neon PostgreSQL, and Brevo's
            HTTPS mail delivery.
          </p>
        </div>

        <div className="cloud-deploy__providers" aria-label="Live cloud providers">
          <span><Globe2 size={14} /> Render Static</span>
          <span><Container size={14} /> Render Web Service</span>
          <span><Database size={14} /> Neon PostgreSQL</span>
          <span><MailCheck size={14} /> Brevo Mail API</span>
        </div>

        <div
          className="cloud-deploy__workspace"
          style={{ "--build-accent": active.color } as CSSProperties}
        >
          <div className="cloud-deploy__status">
            <span><i /> portfolio.cloud</span>
            <span><ShieldCheck size={13} /> Stage {activeIndex + 1} of {stages.length}</span>
          </div>

          <div className="cloud-deploy__track" role="tablist" aria-label="Cloud deployment stages">
            <div className="cloud-deploy__rail">
              <motion.i animate={{ scaleX: activeIndex / (stages.length - 1) }} />
            </div>
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
            className="cloud-deploy__detail"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            aria-live="polite"
          >
            <div className="cloud-deploy__copy">
              <span>{active.label}</span>
              <h3>{active.title}</h3>
              <p>{active.summary}</p>
              <div>{active.tags.map((tag) => <small key={tag}>{tag}</small>)}</div>
            </div>
            <div className="cloud-deploy__log">
              <div><span>DEPLOY TRACE</span><small>healthy</small></div>
              <ol>
                {active.trace.map((line, index) => (
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
