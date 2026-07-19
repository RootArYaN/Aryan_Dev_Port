import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/common/ProjectCard";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

export function FeaturedWork() {
  const { projects } = useProjects();
  const featured = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <section className="px-5 py-28 lg:px-8 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Selected systems"
            title="Not dashboards. Decision infrastructure."
            description="Each case connects enterprise data, business rules, backend logic, interface design, validation, and measurable workflow improvement."
          />
          <Link to="/work" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white transition hover:text-cyan-200">
            View all work <ArrowRight size={17} />
          </Link>
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {featured.map((project, index) => <ProjectCard key={project.id} project={project} index={index} compact />)}
        </div>
      </div>
    </section>
  );
}
