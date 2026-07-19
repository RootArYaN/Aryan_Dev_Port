import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { experience } from "@/data/profile";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

export function JourneyPreview() {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="About" title="From machines to data tools." description="Manufacturing, robotics, research, and teamwork shaped how I build." />
            <Link to="/journey" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-cyan-200">
              View the timeline <ArrowRight size={17} />
            </Link>
          </div>
          <div className="space-y-5">
            {experience.map((item, index) => (
              <article key={`${item.company}-${item.role}`} className="adaptive-surface group grid gap-4 rounded-[1.5rem] border p-6 sm:grid-cols-[8rem_1fr] sm:p-7">
                <div>
                  <p className="font-mono text-xs text-cyan-200/60">{item.period}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-600">0{index + 1} · {item.type}</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.025em] text-white">{item.role}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.company}</p>
                  <p className="mt-4 text-sm leading-7 text-slate-500">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
