import { ArrowUpRight, Database, FileCode2, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { PageIntro } from "@/components/common/PageIntro";
import { PageTransition } from "@/components/common/PageTransition";
import { ProjectCard } from "@/components/common/ProjectCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { fallbackProjects, labItems } from "@/data/profile";
import { AnalyticsWorkspace } from "@/components/visual/AnalyticsWorkspace";
import { ExcelWorkspace } from "@/components/visual/ExcelWorkspace";
import { PageProcessVisual } from "@/components/visual/PageProcessVisual";

export function LabPage() {
  const engineeringProjects = fallbackProjects.filter((project) => !project.featured);

  return (
    <PageTransition>
      <PageIntro
        index="04"
        eyebrow="Learning"
        title="What I am learning and building now."
        description="A clear view of current experiments, new skills, and work in progress."
        visual={<PageProcessVisual variant="lab" />}
      />

      <section className="px-5 pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">Report demo</p>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl">From raw data to a trusted report.</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">Get the data, shape it in code, check the result, and show a clear report.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="adaptive-surface rounded-2xl border p-4">
                  <Database size={18} className="text-cyan-200" />
                  <p className="mt-4 text-sm font-medium text-white">Data connected</p>
                  <p className="mt-2 text-xs leading-6 text-slate-500">SQL queries, shared data steps, and clear checks.</p>
                </div>
                <div className="adaptive-surface rounded-2xl border p-4">
                  <FileCode2 size={18} className="text-violet-300" />
                  <p className="mt-4 text-sm font-medium text-white">Code you can follow</p>
                  <p className="mt-2 text-xs leading-6 text-slate-500">SQL, Python, and React shown as one simple flow.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <AnalyticsWorkspace />
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.58fr_1.42fr] lg:items-center">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/75">Excel model</p>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl">Edit a number. See every formula update.</h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">Change an Actual cell, then try the variance, total, average, and status formulas.</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}><ExcelWorkspace /></Reveal>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          {labItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <article className="adaptive-surface group relative h-full overflow-hidden rounded-[1.75rem] border p-7 sm:p-9">
                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-300/[0.045] blur-3xl transition group-hover:bg-cyan-300/[0.075]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-6">
                    <div className="grid h-11 w-11 place-items-center text-cyan-200"><FlaskConical size={19} /></div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-slate-600">{item.status}</span>
                  </div>
                  <h2 className="mt-8 text-2xl font-medium tracking-[-0.035em] text-white">{item.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">{item.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {item.tags.map((tag) => <span key={tag} className="text-xs text-slate-500">{tag}</span>)}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Robotics work"
              title="Robotics taught me to test the whole system."
              description="Hardware fails in clear ways. These projects taught me to test sensors, code, controls, and real use together."
            />
            <Link to="/journey" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition hover:text-cyan-200">See the journey <ArrowUpRight size={17} /></Link>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {engineeringProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <Reveal className="adaptive-surface mx-auto max-w-7xl rounded-[2rem] border p-8 sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">Next public project</p>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] text-white sm:text-5xl">A public manufacturing ERP demo.</h2>
            </div>
            <div>
              <p className="text-base leading-8 text-slate-400">It will use sample data and include user roles, stock, production, history, reports, tests, and setup notes.</p>
              <Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-cyan-200">Ask about the build <ArrowUpRight size={17} /></Link>
            </div>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  );
}
