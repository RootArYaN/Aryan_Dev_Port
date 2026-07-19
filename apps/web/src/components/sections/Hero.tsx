import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Download, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { profile } from "@/data/profile";
import { AnalyticsWorkspace } from "@/components/visual/AnalyticsWorkspace";
import { trackEvent } from "@/lib/analytics";

export function Hero() {
  return (
    <section className="relative px-5 pb-16 pt-32 lg:px-8 lg:pb-20 lg:pt-36" aria-labelledby="home-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.96fr_1.04fr] lg:gap-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/75">
            <span>Analytics engineer</span>
            <span className="h-1 w-1 rounded-full bg-white/25" />
            <span className="inline-flex items-center gap-1.5 text-slate-500"><MapPin size={12} />{profile.location}</span>
          </div>
          <h1 id="home-heading" className="mt-7 max-w-4xl text-balance text-5xl font-medium leading-[0.98] tracking-[-0.058em] text-white sm:text-7xl lg:text-[5.05rem]">
            I build <span className="text-cyan-200">data tools</span> that make work easier.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-slate-300 sm:text-xl">{profile.introduction}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#flagship-story" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#061017] transition hover:bg-cyan-100">
              See the main case <ArrowDownRight size={17} />
            </a>
            <a
              href={`${import.meta.env.BASE_URL}aryan-tembhekar-resume.pdf`}
              target="_blank"
              rel="noreferrer"
              data-testid="resume-link"
              onClick={() => trackEvent("resume_click", { surface: "homepage-hero" })}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/[0.11] bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
            >
              Resume <Download size={17} />
            </a>
            <Link to="/work" className="inline-flex min-h-12 items-center gap-2 px-3 py-3 text-sm font-semibold text-slate-400 transition hover:text-white">
              View all work <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-4 text-xs text-slate-500">
            <span className="h-px w-10 bg-gradient-to-r from-cyan-200/60 to-transparent" />
            SQL Server · Python · React · Applied AI
          </div>
        </motion.div>

        <AnalyticsWorkspace />
      </div>
    </section>
  );
}
