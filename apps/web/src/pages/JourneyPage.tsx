import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Award, Briefcase, GraduationCap, Lightbulb, Microscope } from "lucide-react";
import { PageIntro } from "@/components/common/PageIntro";
import { PageTransition } from "@/components/common/PageTransition";
import { Reveal } from "@/components/common/Reveal";
import { timeline } from "@/data/profile";
import { PageProcessVisual } from "@/components/visual/PageProcessVisual";

const iconMap = [Briefcase, Briefcase, Microscope, Lightbulb, GraduationCap];

const achievements = [
  { value: "Top 10", label: "SAE autonomous drone challenge" },
  { value: "2nd", label: "Robofest hexapod competition" },
  { value: "₹1L", label: "innovation funding secured" },
  { value: "3", label: "patent outcomes across product and design" },
];

export function JourneyPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 70%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <PageTransition>
      <PageIntro
        index="02"
        eyebrow="Journey"
        title="A systems career shaped by manufacturing, robotics, and real users."
        description="The path is not a straight transition from mechanical engineering to software. It is a continuous focus on how complex systems behave, fail, communicate, and improve."
        visual={<PageProcessVisual variant="journey" />}
      />

      <section className="px-5 pb-24 lg:px-8 lg:pb-36">
        <div ref={timelineRef} className="relative mx-auto max-w-7xl">
          <div className="absolute bottom-0 left-[1.18rem] top-0 w-px bg-white/[0.08] md:left-1/2" />
          <motion.div style={{ scaleY: lineScale }} className="absolute bottom-0 left-[1.18rem] top-0 w-px origin-top bg-gradient-to-b from-cyan-200 via-violet-300 to-emerald-300 md:left-1/2" />

          <div className="space-y-16 md:space-y-24">
            {timeline.map((item, index) => {
              const Icon = iconMap[index] ?? Award;
              const isRight = index % 2 === 0;

              return (
                <Reveal key={`${item.year}-${item.title}`}>
                  <article className="relative grid pl-16 md:grid-cols-2 md:pl-0">
                    <div className="absolute left-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-full border border-cyan-200/30 bg-[#08131c] text-cyan-200 shadow-[0_0_30px_rgba(115,228,222,.11)] md:left-1/2 md:-translate-x-1/2">
                      <Icon size={17} />
                    </div>

                    <div className={`${isRight ? "md:col-start-2 md:pl-16" : "md:pr-16 md:text-right"}`}>
                      <div className={`adaptive-surface rounded-[1.75rem] border p-7 sm:p-9 ${isRight ? "" : "md:ml-auto"}`}>
                        <div className={`flex flex-wrap items-center gap-3 ${isRight ? "" : "md:justify-end"}`}>
                          <span className="font-mono text-sm text-cyan-200/75">{item.year}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">{item.eyebrow}</span>
                        </div>
                        <h2 className="mt-5 text-2xl font-medium tracking-[-0.035em] text-white sm:text-3xl">{item.title}</h2>
                        <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">{item.description}</p>
                        <div className={`mt-6 flex flex-wrap gap-2 ${isRight ? "" : "md:justify-end"}`}>
                          {item.tags.map((tag) => <span key={tag} className="text-[11px] text-slate-500">{tag}</span>)}
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/75">Selected outcomes</p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {achievements.map((item) => (
                <div key={item.label} className="adaptive-surface rounded-[1.35rem] border p-7">
                  <p className="text-3xl font-medium tracking-[-0.04em] text-white">{item.value}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
