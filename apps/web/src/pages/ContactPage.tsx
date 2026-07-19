import { ArrowUpRight, GitBranch, ExternalLink, Mail, MapPin } from "lucide-react";
import { Contact } from "@/components/sections/Contact";
import { PageIntro } from "@/components/common/PageIntro";
import { PageTransition } from "@/components/common/PageTransition";
import { Reveal } from "@/components/common/Reveal";
import { profile } from "@/data/profile";
import { PageProcessVisual } from "@/components/visual/PageProcessVisual";

const channels = [
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: ExternalLink, label: "LinkedIn", value: "View profile", href: profile.linkedin },
  { icon: GitBranch, label: "GitHub", value: "Projects and code", href: profile.github },
];

export function ContactPage() {
  return (
    <PageTransition>
      <PageIntro
        index="05"
        eyebrow="Contact"
        title="Let’s build something useful."
        description="Open to data, analytics, automation, and full-stack roles."
        visual={<PageProcessVisual variant="contact" />}
      />
      <section className="px-5 pb-16 lg:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <Reveal>
            <div className="space-y-3">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                  className="adaptive-surface group flex items-center justify-between gap-5 rounded-[1.35rem] border p-5"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center text-cyan-200"><channel.icon size={18} /></span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-600">{channel.label}</p>
                      <p className="mt-1 text-sm text-slate-300">{channel.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={17} className="text-slate-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-200" />
                </a>
              ))}
            </div>
            <div className="mt-8 border-l border-white/[0.08] p-6">
              <div className="flex items-center gap-3 text-sm text-slate-300"><MapPin size={17} className="text-cyan-200" />{profile.location}</div>
              <p className="mt-4 text-sm leading-7 text-slate-500">Tell me about the problem, the users, the data, and the result you need.</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}><Contact /></Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
