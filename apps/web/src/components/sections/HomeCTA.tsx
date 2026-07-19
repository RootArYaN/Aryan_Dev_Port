import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/common/Reveal";

export function HomeCTA() {
  return (
    <section className="px-5 pb-12 pt-8 lg:px-8 lg:pb-20">
      <Reveal className="mx-auto max-w-7xl">
        <div className="focus-panel relative overflow-hidden rounded-[2.25rem] px-7 py-16 sm:px-12 sm:py-20 lg:px-20">
          <div className="blueprint-grid absolute inset-0 opacity-35" />
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-300/[0.08] blur-3xl" />
          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/80">The professional direction</p>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
              Build enterprise tools that make difficult work feel obvious.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              The portfolio is designed to evolve with deeper case studies, public demo systems, ERP experiments, and documented engineering decisions.
            </p>
            <Link to="/contact" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#071018] transition hover:bg-cyan-100">
              Discuss an opportunity <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
