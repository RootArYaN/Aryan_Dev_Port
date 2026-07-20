import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { ResumePreview } from "@/components/common/ResumePreview";
import { profile } from "@/data/profile";
import { AnalyticsWorkspace } from "@/components/visual/AnalyticsWorkspace";

export function Hero() {
  return (
    <section className="relative px-5 pb-14 pt-28 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20 lg:pt-36" aria-labelledby="home-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-12 sm:gap-14 lg:grid-cols-[0.96fr_1.04fr] lg:gap-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/75">
            <span>Analytics engineer</span>
            <span className="h-1 w-1 rounded-full bg-white/25" />
            <span className="inline-flex items-center gap-1.5 text-slate-500"><MapPin size={12} />{profile.location}</span>
          </div>
          <h1 id="home-heading" className="mt-6 max-w-4xl text-balance text-[2.7rem] font-medium leading-[1] tracking-[-0.052em] text-white sm:mt-7 sm:text-7xl sm:leading-[0.98] lg:text-[5.05rem]">
            I build <span className="text-cyan-200">data tools</span> that make work easier.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-slate-300 sm:mt-8 sm:text-xl sm:leading-8">{profile.introduction}</p>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:flex sm:flex-wrap">
            <a href="#flagship-story" className="inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#061017] transition hover:bg-cyan-100 sm:w-auto sm:justify-start">
              See the main case <ArrowDownRight size={17} />
            </a>
            <ResumePreview />
            <Link to="/work" className="inline-flex min-h-12 w-full items-center justify-between gap-2 px-3 py-3 text-sm font-semibold text-slate-400 transition hover:text-white sm:w-auto sm:justify-start">
              View all work <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="mt-10 flex items-start gap-3 text-[11px] leading-5 text-slate-500 sm:mt-12 sm:items-center sm:gap-4 sm:text-xs">
            <span className="mt-2.5 h-px w-8 shrink-0 bg-gradient-to-r from-cyan-200/60 to-transparent sm:mt-0 sm:w-10" />
            <span>SQL Server · Python · React · Applied AI</span>
          </div>
        </motion.div>

        <AnalyticsWorkspace />
      </div>
    </section>
  );
}
