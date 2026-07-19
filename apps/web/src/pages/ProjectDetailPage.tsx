import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Database,
  Layers3,
  Lightbulb,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { PageTransition } from "@/components/common/PageTransition";
import { ProjectGlyph } from "@/components/visual/ProjectGlyph";
import { architectureStages, manufacturingStory, projectComparisons } from "@/data/caseStory";
import { fallbackProjects, projectMeta } from "@/data/profile";
import { useProjects } from "@/hooks/useProjects";
import { trackEvent } from "@/lib/analytics";

const sectionLinks = [
  { id: "problem", label: "Problem" },
  { id: "inputs", label: "Data" },
  { id: "system", label: "System" },
  { id: "validation", label: "Checks" },
  { id: "impact", label: "Impact" },
  { id: "lessons", label: "Lessons" },
] as const;

type SectionId = (typeof sectionLinks)[number]["id"];

function NextPrompt({ id, label }: { id: SectionId; label: string }) {
  return (
    <a href={`#${id}`} className="case-next-prompt">
      <span>{label}</span><ArrowDown size={15} />
    </a>
  );
}

function Comparison({ slug }: { slug: string }) {
  const reduceMotion = useReducedMotion();
  const [improved, setImproved] = useState(false);
  const comparison = projectComparisons[slug] ?? projectComparisons[manufacturingStory.slug];
  const state = improved ? comparison.improved : comparison.current;

  const selectScenario = (next: boolean) => {
    setImproved(next);
    trackEvent("scenario_interaction", {
      surface: "case-study-comparison",
      slug,
      scenario: next ? "improved" : "current",
    });
  };

  return (
    <div className="case-comparison" data-testid="case-comparison">
      <div className="case-comparison__header">
        <div>
          <p>Interactive sample</p>
          <h3>{comparison.label}</h3>
        </div>
        <div className="case-comparison__toggle" role="group" aria-label="Current versus improved state">
          <button type="button" aria-pressed={!improved} onClick={() => selectScenario(false)}>Current</button>
          <button type="button" aria-pressed={improved} onClick={() => selectScenario(true)}>Improved</button>
        </div>
      </div>

      <div className="case-comparison__body" aria-live="polite">
        <div className="case-comparison__metric">
          <span>{comparison.units}</span>
          <strong>{state.metric}</strong>
          <small>{state.delta}</small>
          <p>{improved ? "Sample result after the change. Not a live forecast." : "Sample result before the change."}</p>
        </div>
        <div className="case-comparison__bars" aria-label={`${comparison.label} stage comparison`}>
          {state.bars.map((value, index) => (
            <div key={comparison.labels[index]}>
              <span><small>{comparison.labels[index]}</small><b>{value}%</b></span>
              <i><motion.b animate={{ width: `${value}%` }} transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.035 }} /></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const { projects, loading } = useProjects();
  const project = projects.find((item) => item.slug === slug);
  const articleRef = useRef<HTMLElement | null>(null);
  const trackedDepth = useRef(new Set<number>());
  const openedProject = useRef<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("problem");
  const [activeArchitecture, setActiveArchitecture] = useState(0);
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });

  const source = useMemo(() => {
    const state = location.state as { source?: string } | null;
    return state?.source ?? "direct";
  }, [location.state]);

  useEffect(() => {
    if (loading || !project || !slug || openedProject.current === slug) return;
    openedProject.current = slug;
    trackedDepth.current.clear();
    trackEvent("project_opened", { source, slug });
  }, [loading, project, slug, source]);

  useEffect(() => {
    if (loading || !project) return;
    const observers = sectionLinks.map(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActiveSection(id),
        { rootMargin: "-28% 0px -58% 0px", threshold: 0.01 },
      );
      observer.observe(element);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, [loading, project, slug]);

  useEffect(() => {
    const article = articleRef.current;
    if (loading || !project || !article || !slug) return;
    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = Math.max(article.offsetHeight - window.innerHeight, 1);
      const depth = Math.min(1, Math.max(0, -rect.top / total));
      [50, 90].forEach((threshold) => {
        if (depth >= threshold / 100 && !trackedDepth.current.has(threshold)) {
          trackedDepth.current.add(threshold);
          trackEvent("case_study_depth", { slug, depth: String(threshold) as "50" | "90" });
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, project, slug]);

  if (loading) {
    return <div className="grid min-h-[75vh] place-items-center px-5 pt-28 text-sm text-slate-500">Loading case study</div>;
  }
  if (!project) return <Navigate to="/404" replace />;

  const meta = projectMeta[project.slug];
  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length] ?? fallbackProjects[0];
  const flagship = project.slug === manufacturingStory.slug;
  const selectedArchitecture = architectureStages[activeArchitecture];

  return (
    <PageTransition>
      <article ref={articleRef} className="case-study px-5 pb-16 pt-32 lg:px-8 lg:pb-24 lg:pt-36">
        <motion.div className="case-study__page-progress" style={{ scaleX: progress }} aria-hidden="true" />
        <div className="mx-auto max-w-7xl">
          <Link to="/work" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white">
            <ArrowLeft size={16} /> All systems
          </Link>

          <header className="mt-10 grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">
                <span className="font-mono text-white/30">{meta?.index}</span>
                <span>{meta?.category}</span>
                {flagship && <span className="case-study__flagship">Flagship</span>}
              </div>
              <h1 className="mt-6 text-balance text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl">{project.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">{meta?.statement}</p>
            </div>
            <div className="max-w-xl lg:justify-self-end">
              <p className="text-base leading-8 text-slate-400">{project.summary}</p>
              <p className="mt-5 inline-flex items-center gap-2 text-xs leading-6 text-slate-500"><LockKeyhole size={14} className="text-cyan-200/70" /> Safe sample data. Private details are not shown.</p>
            </div>
          </header>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }} className="mt-14">
            <ProjectGlyph slug={project.slug} />
          </motion.div>

          <nav className="case-nav" aria-label="Case study progress" data-testid="case-navigation">
            <div className="case-nav__track"><motion.i style={{ scaleX: progress }} /></div>
            <div className="case-nav__links">
              {sectionLinks.map((item, index) => (
                <a key={item.id} href={`#${item.id}`} aria-current={activeSection === item.id ? "location" : undefined}>
                  <span>0{index + 1}</span>{item.label}
                </a>
              ))}
            </div>
          </nav>

          <section id="problem" className="case-section scroll-mt-32" aria-labelledby="problem-title">
            <div className="case-section__heading">
              <p>01 · Problem</p>
              <h2 id="problem-title">Start with the problem.</h2>
            </div>
            <div className="case-section__content">
              <p className="case-section__lead">{project.problem}</p>
              <div className="case-evidence-grid">
                <div><span>Problem</span><strong>Repeat work</strong><p>Every question needed another export, check, or report.</p></div>
                <div><span>Risk</span><strong>Different answers</strong><p>Separate files and copied formulas could show different totals.</p></div>
                <div><span>Goal</span><strong>One clear view</strong><p>Show the result, its checks, and the next action.</p></div>
              </div>
              <NextPrompt id="inputs" label="See the inputs" />
            </div>
          </section>

          <section id="inputs" className="case-section scroll-mt-32" aria-labelledby="inputs-title">
            <div className="case-section__heading">
              <p>02 · Data</p>
              <h2 id="inputs-title">Know the data and its limits.</h2>
            </div>
            <div className="case-section__content">
              <div className="case-inputs">
                {[
                  { icon: Database, title: "Source data", text: "SQL Server records, past events, and known reports." },
                  { icon: Layers3, title: "Business rules", text: "Clear meanings, limits, work steps, and calculations." },
                  { icon: ShieldCheck, title: "Safe use", text: "Sample values, access checks, tests, and no private formulas." },
                ].map((item) => (
                  <div key={item.title} className="adaptive-surface rounded-[1.5rem] p-7">
                    <item.icon size={20} className="text-cyan-200" />
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="case-note"><CircleDot size={16} /><p><strong>Demo limit:</strong> Sample values show how the tool works. Live records and private formulas are not included.</p></div>
              <NextPrompt id="system" label="See how it works" />
            </div>
          </section>

          <section id="system" className="case-section scroll-mt-32" aria-labelledby="system-title">
            <div className="case-section__heading">
              <p>03 · System</p>
              <h2 id="system-title">Each step has one clear job.</h2>
            </div>
            <div className="case-section__content">
              <p className="case-section__lead">{project.solution}</p>
              <div className="case-architecture">
                <div className="case-architecture__stages" role="tablist" aria-label="Architecture stages">
                  {architectureStages.map((stage, index) => (
                    <button
                      key={stage.id}
                      type="button"
                      role="tab"
                      aria-selected={activeArchitecture === index}
                      aria-controls="architecture-detail"
                      onClick={() => setActiveArchitecture(index)}
                    >
                      <span>0{index + 1}</span>
                      <strong>{stage.title}</strong>
                      <small>{stage.short}</small>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
                <motion.div id="architecture-detail" role="tabpanel" key={selectedArchitecture.id} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} className="case-architecture__detail">
                  <span>{selectedArchitecture.title}</span>
                  <h3>{selectedArchitecture.short}</h3>
                  <p>{selectedArchitecture.text}</p>
                  <div><CheckCircle2 size={16} />{selectedArchitecture.proof}</div>
                </motion.div>
              </div>
              <NextPrompt id="validation" label="See how results were checked" />
            </div>
          </section>

          <section id="validation" className="case-section scroll-mt-32" aria-labelledby="validation-title">
            <div className="case-section__heading">
              <p>04 · Checks</p>
              <h2 id="validation-title">Check the result before using it.</h2>
            </div>
            <div className="case-section__content">
              <div className="case-validation">
                {[
                  ["Compare", "Match source totals with known reports."],
                  ["Test", "Check empty data, unusual values, old data, and edge cases."],
                  ["Review", "Let users check sample results and decide what stays manual."],
                  ["Release", "Check login, pages, mobile layout, and safe error states."],
                ].map(([title, text], index) => (
                  <div key={title}>
                    <span>0{index + 1}</span>
                    <div><h3>{title}</h3><p>{text}</p></div>
                  </div>
                ))}
              </div>
              <div className="case-note case-note--success"><ShieldCheck size={17} /><p><strong>Final check:</strong> AI can speed up the build, but every result is checked with known data and users.</p></div>
              <NextPrompt id="impact" label="Compare before and after" />
            </div>
          </section>

          <section id="impact" className="case-section scroll-mt-32" aria-labelledby="impact-title">
            <div className="case-section__heading">
              <p>05 · Impact</p>
              <h2 id="impact-title">Measure what changed.</h2>
            </div>
            <div className="case-section__content">
              <p className="case-section__lead">{project.impact}</p>
              <Comparison slug={project.slug} />
              <div className="case-impact-strip">
                {(flagship ? manufacturingStory.chapters.slice(1).map((chapter) => chapter.metric) : [
                  { value: "Shared", label: "logic", detail: "Calculations no longer live in copied files." },
                  { value: "Faster", label: "answers", detail: "Saved views answer repeat questions." },
                  { value: "Clear", label: "control", detail: "People approve key actions." },
                ]).slice(0, 3).map((metric) => (
                  <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.detail}</small></div>
                ))}
              </div>
              <NextPrompt id="lessons" label="See what I learned" />
            </div>
          </section>

          <section id="lessons" className="case-section scroll-mt-32" aria-labelledby="lessons-title">
            <div className="case-section__heading">
              <p>06 · Lessons</p>
              <h2 id="lessons-title">What I learned.</h2>
            </div>
            <div className="case-section__content">
              <div className="case-lessons">
                {[
                  ["Start with the decision", "A correct chart still fails if it does not match how the user works."],
                  ["Show the checks", "Make sample data, update time, and human approval easy to see."],
                  ["Speed matters", "Saved results and stable layouts make the tool easier to use."],
                  ["Keep clear layers", "Simple data, backend, frontend, and control layers are easier to change."],
                ].map(([title, text]) => (
                  <div key={title}><Lightbulb size={18} /><div><h3>{title}</h3><p>{text}</p></div></div>
                ))}
              </div>
              <div className="case-study__confidentiality">
                <LockKeyhole size={20} />
                <div><h3>Private data stays private</h3><p>This case shows the system, checks, and result without sharing company data, formulas, or private screens.</p></div>
              </div>
              <div className="flex flex-wrap gap-3 pt-3">
                {project.techStack.map((tech) => <span key={tech} className="case-tech"><CheckCircle2 size={13} />{tech}</span>)}
              </div>
            </div>
          </section>

          <Link to={`/work/${nextProject.slug}`} state={{ source: "case-study-next" }} className="group mt-16 flex items-end justify-between gap-8 border-t border-white/[0.08] pt-8">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Next project</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em] text-white sm:text-5xl">{nextProject.title}</h2>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-transparent text-slate-500 transition group-hover:border-cyan-200/35 group-hover:text-cyan-200">
              <ArrowRight size={20} />
            </span>
          </Link>
        </div>
      </article>
    </PageTransition>
  );
}
