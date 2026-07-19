import { useMemo, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { PageIntro } from "@/components/common/PageIntro";
import { PageTransition } from "@/components/common/PageTransition";
import { ProjectCard } from "@/components/common/ProjectCard";
import { projectMeta } from "@/data/profile";
import { useProjects } from "@/hooks/useProjects";
import { SystemThinkingMap } from "@/components/visual/SystemThinkingMap";

const filters = ["All", "Data", "Automation", "Engineering"] as const;
type Filter = (typeof filters)[number];

function categoryFor(slug: string) {
  const category = projectMeta[slug]?.category ?? "";
  if (["Drones", "Robotics"].includes(category)) return "Engineering";
  if (category === "Report automation") return "Automation";
  return "Data";
}

export function WorkPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const { projects, loading } = useProjects();
  const visibleProjects = useMemo(
    () => filter === "All" ? projects : projects.filter((project) => categoryFor(project.slug) === filter),
    [filter, projects],
  );

  return (
    <PageTransition>
      <PageIntro
        index="01"
        eyebrow="Selected work"
        title="Tools built to solve real work problems."
        description="Examples from production, inventory, pricing, reports, drones, and robotics."
        visual={<SystemThinkingMap />}
      />
      <section className="px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <LayoutGroup>
            <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-7" role="group" aria-label="Filter projects">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  data-testid={`work-filter-${item.toLowerCase()}`}
                  className="relative rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:text-white"
                >
                  {filter === item && <motion.span layoutId="work-filter" className="absolute inset-0 -z-10 rounded-full border border-white/[0.1] bg-white/[0.07]" />}
                  <span className={filter === item ? "text-white" : undefined}>{item}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          {loading ? (
            <div className="mt-10 grid gap-5 lg:grid-cols-2" aria-label="Loading projects">
              {[0, 1, 2, 3].map((item) => <div key={item} className="h-[32rem] animate-pulse rounded-[1.85rem] border border-white/[0.07] bg-white/[0.025]" />)}
            </div>
          ) : (
            <motion.div layout aria-live="polite" className="mt-10 grid gap-5 lg:grid-cols-2">
              {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} source="work-grid" />)}
            </motion.div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
