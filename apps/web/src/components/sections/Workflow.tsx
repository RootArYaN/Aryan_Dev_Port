import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { workflowSteps } from "@/data/profile";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";

export function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 80%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="px-5 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
        <Reveal>
          <SectionHeading
            eyebrow="Working method"
            title="A simple path from problem to working tool."
            description="Solve the real problem, check the result, then automate repeat work."
          />
        </Reveal>

        <div className="relative pl-8 sm:pl-12">
          <div className="absolute bottom-5 left-[5px] top-4 w-px bg-white/[0.08] sm:left-[9px]" />
          <motion.div style={{ scaleY }} className="absolute bottom-5 left-[5px] top-4 w-px origin-top bg-gradient-to-b from-cyan-200 via-violet-300 to-emerald-300 sm:left-[9px]" />
          <div className="space-y-12">
            {workflowSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.04}>
                <article className="relative">
                  <div className="absolute -left-[2.1rem] top-1.5 grid h-3 w-3 place-items-center rounded-full border border-cyan-200/50 bg-[#071018] shadow-[0_0_18px_rgba(115,228,222,.28)] sm:-left-[2.85rem]" />
                  <div className="flex items-start gap-5">
                    <span className="font-mono text-xs text-cyan-200/55">{step.number}</span>
                    <div>
                      <h3 className="text-2xl font-medium tracking-[-0.035em] text-white">{step.title}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">{step.text}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
