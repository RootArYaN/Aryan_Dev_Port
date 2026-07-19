import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { Project } from "@/lib/api";
import { projectMeta } from "@/data/profile";
import { ProjectGlyph } from "@/components/visual/ProjectGlyph";

export function ProjectCard({
  project,
  index = 0,
  compact = false,
  source = "project-grid",
}: {
  project: Project;
  index?: number;
  compact?: boolean;
  source?: string;
}) {
  const meta = projectMeta[project.slug];
  const flagship = project.slug === "manufacturing-analytics-platform";

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.18), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={`group ${flagship ? "project-card--flagship" : ""}`}
    >
      <div className="h-full border-t border-white/[0.07] pt-5 transition duration-300 group-hover:border-white/[0.14]">
        <ProjectGlyph slug={project.slug} compact={compact} />
        <Link to={`/work/${project.slug}`} state={{ source }} className="block pb-4 pt-6" aria-label={`${flagship ? "Read full flagship case:" : "Open project:"} ${project.title}`}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">{meta?.category ?? "Project"}</p>
            <ArrowUpRight size={18} className="text-slate-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
          </div>
          <h3 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.035em] text-white">{project.title}</h3>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-400">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {project.techStack.slice(0, compact ? 4 : 5).map((tech) => (
              <span key={tech} className="text-[11px] text-slate-500">{tech}</span>
            ))}
          </div>
          {flagship && (
            <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
              Read full case <ArrowRight size={15} />
            </span>
          )}
        </Link>
      </div>
    </motion.article>
  );
}
