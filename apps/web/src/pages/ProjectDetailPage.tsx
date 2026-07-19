import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { motion } from "motion/react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageTransition } from "@/components/common/PageTransition";
import { ProjectGlyph } from "@/components/visual/ProjectGlyph";
import { fallbackProjects, projectMeta } from "@/data/profile";
import { useProjects } from "@/hooks/useProjects";

const architecture = [
  { title: "Sources", text: "Production SQL Server schemas, reports, parameters, and operational reference data." },
  { title: "Logic", text: "Validated calculations, preprocessing, caching, scenario rules, and reusable service functions." },
  { title: "Experience", text: "Focused React workflows, filters, context, exports, and clear decision-oriented states." },
  { title: "Control", text: "Testing, authentication, pre-production verification, and human approval for critical outcomes." },
];

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { projects, loading } = useProjects();
  const project = projects.find((item) => item.slug === slug);

  if (loading) {
    return <div className="grid min-h-[75vh] place-items-center px-5 pt-28 text-sm text-slate-500">Loading case study</div>;
  }
  if (!project) return <Navigate to="/404" replace />;

  const meta = projectMeta[project.slug];
  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length] ?? fallbackProjects[0];

  return (
    <PageTransition>
      <article className="px-5 pb-20 pt-36 lg:px-8 lg:pb-32 lg:pt-44">
        <div className="mx-auto max-w-7xl">
          <Link to="/work" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white">
            <ArrowLeft size={16} /> All systems
          </Link>

          <header className="mt-12 grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">
                <span className="font-mono text-white/30">{meta?.index}</span>
                <span>{meta?.category}</span>
              </div>
              <h1 className="mt-6 text-balance text-5xl font-medium leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl">{project.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">{meta?.statement}</p>
            </div>
            <p className="max-w-xl text-base leading-8 text-slate-400 lg:justify-self-end">{project.summary}</p>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-14"
          >
            <ProjectGlyph slug={project.slug} />
          </motion.div>

          <section className="mt-16 grid gap-3 lg:grid-cols-3">
            {[
              { label: "Problem", text: project.problem },
              { label: "System approach", text: project.solution },
              { label: "Operational impact", text: project.impact },
            ].map((item) => (
              <div key={item.label} className="adaptive-surface rounded-[1.5rem] border p-7 sm:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.23em] text-cyan-200/70">{item.label}</p>
                <p className="mt-5 text-sm leading-7 text-slate-300">{item.text}</p>
              </div>
            ))}
          </section>

          <section className="mt-24 grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">Architecture logic</p>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl">Clear layers. Fewer surprises.</h2>
              <p className="mt-6 text-base leading-8 text-slate-400">A modular flow keeps data retrieval, business rules, interface behaviour, and release controls understandable.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {architecture.map((layer, index) => (
                <div key={layer.title} className="adaptive-surface rounded-[1.5rem] border p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white/25">0{index + 1}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-200/70" />
                  </div>
                  <h3 className="mt-8 text-xl font-medium text-white">{layer.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{layer.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-6 border-l border-white/[0.08] p-7 sm:p-9 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-0.5 text-cyan-200" size={20} />
              <div>
                <h2 className="font-medium text-white">Confidentiality-aware case study</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">The architecture and impact are described accurately while company data, schema names, formulas, screenshots, and sensitive operational logic remain private.</p>
              </div>
            </div>
            <div className="flex flex-wrap content-start gap-2 lg:justify-end">
              {project.techStack.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={13} className="text-cyan-200/75" />{tech}
                </span>
              ))}
            </div>
          </section>

          <Link to={`/work/${nextProject.slug}`} className="group mt-24 flex items-end justify-between gap-8 border-t border-white/[0.08] pt-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-600">Next system</p>
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
