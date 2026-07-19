import { motion } from "motion/react";
import { Braces, Database, Layers3, ShieldCheck } from "lucide-react";
import { PageIntro } from "@/components/common/PageIntro";
import { PageTransition } from "@/components/common/PageTransition";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { capabilityGroups, principles } from "@/data/profile";
import { PageProcessVisual } from "@/components/visual/PageProcessVisual";

const stackLayers = [
  { icon: Database, label: "Enterprise data", text: "Production and pre-production SQL Server, multiple schemas, large operational datasets." },
  { icon: Braces, label: "Business services", text: "Python APIs, validation, authentication, calculations, caching, and preprocessing." },
  { icon: Layers3, label: "Decision experience", text: "React and Vite interfaces with Radix/shadcn patterns, focused flows, and responsive design." },
  { icon: ShieldCheck, label: "Release confidence", text: "Testing, access control, environment separation, human verification, and safe deployment habits." },
];

export function ExpertisePage() {
  return (
    <PageTransition>
      <PageIntro
        index="03"
        eyebrow="Expertise"
        title="Broad enough to ship. Honest enough to keep learning."
        description="The strength is end-to-end problem ownership: understanding operational context, retrieving enterprise data, building logic and interfaces, validating outputs, and improving the workflow after release."
        visual={<PageProcessVisual variant="expertise" />}
      />

      <section className="px-5 pb-28 lg:px-8 lg:pb-36">
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

      <section className="px-5 py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="System layers"
              title="From source schema to executive decision."
              description="A clean modular-monolith mindset keeps the stack understandable while still respecting security, data contracts, deployment boundaries, and future growth."
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

      <section className="px-5 py-28 lg:px-8 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:gap-24">
          <Reveal>
            <SectionHeading eyebrow="Engineering principles" title="Professional does not have to mean complicated." description="The best internal system is usually the one a future engineer can understand, a user can trust, and a manager can act on." />
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
