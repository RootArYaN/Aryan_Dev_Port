import { motion } from "motion/react";
import { Braces, Database, Layers3, ShieldCheck } from "lucide-react";
import { PageIntro } from "@/components/common/PageIntro";
import { PageTransition } from "@/components/common/PageTransition";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { capabilityGroups, principles } from "@/data/profile";
import { PageProcessVisual } from "@/components/visual/PageProcessVisual";

const stackLayers = [
  { icon: Database, label: "Data", text: "Large SQL Server datasets from production and test systems." },
  { icon: Braces, label: "Backend", text: "Python APIs, login checks, calculations, caching, and data checks." },
  { icon: Layers3, label: "Frontend", text: "Clear and responsive React interfaces for focused work." },
  { icon: ShieldCheck, label: "Release", text: "Testing, access control, human review, and safe deployment." },
];

export function ExpertisePage() {
  return (
    <PageTransition>
      <PageIntro
        index="03"
        eyebrow="Skills"
        title="I can build the full tool and keep learning."
        description="I understand the problem, get the data, build the logic and screen, test the result, and improve it after release."
        visual={<PageProcessVisual variant="expertise" />}
      />

      <section className="px-5 pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          {capabilityGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.04}>
              <article className="adaptive-surface h-full rounded-[1.75rem] border p-7 sm:p-9">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-mono text-xs text-cyan-200/55">0{index + 1}</p>
                    <h2 className="mt-4 text-2xl font-medium tracking-[-0.035em] text-white">{group.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-500">{group.summary}</p>
                  </div>
                  <span className="text-2xl font-medium tracking-[-0.04em] text-white/70">{group.level}<span className="text-sm text-white/25">%</span></span>
                </div>
                <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${group.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.95, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300/80 via-cyan-200/65 to-violet-400/60"
                  />
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {group.items.map((item) => <span key={item} className="text-xs text-slate-500">{item}</span>)}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="How it fits together"
              title="From raw data to a clear decision."
              description="Each layer has one job, so the system stays easy to test, secure, and change."
            />
          </Reveal>
          <div className="relative mt-14 grid gap-4 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent lg:block" />
            {stackLayers.map((layer, index) => (
              <Reveal key={layer.label} delay={index * 0.05}>
                <article className="adaptive-surface relative h-full rounded-[1.5rem] border p-6">
                  <div className="grid h-12 w-12 place-items-center text-cyan-200">
                    <layer.icon size={21} />
                  </div>
                  <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">Layer 0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-medium text-white">{layer.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{layer.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-24">
          <Reveal>
            <SectionHeading eyebrow="How I work" title="Professional does not mean complicated." description="A good tool is easy to understand, trust, and use." />
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <Reveal key={principle} delay={index * 0.035}>
                <div className="adaptive-surface h-full rounded-[1.5rem] border p-6 sm:p-7">
                  <p className="font-mono text-xs text-cyan-200/45">0{index + 1}</p>
                  <p className="mt-7 text-lg font-medium leading-7 text-white">{principle}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
