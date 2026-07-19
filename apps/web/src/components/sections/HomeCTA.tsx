import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/common/Reveal";
import { trackEvent } from "@/lib/analytics";

export function HomeCTA() {
  return (
    <section className="px-5 pb-10 pt-6 lg:px-8 lg:pb-14">
      <Reveal className="mx-auto max-w-7xl">
        <div className="focus-panel relative overflow-hidden rounded-[2.25rem] px-7 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div className="blueprint-grid absolute inset-0 opacity-35" />
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-cyan-300/[0.08] blur-3xl" />
          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/80">What I want to build</p>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
              Build clear tools for difficult work.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              I am adding more case studies, public demos, and full business systems.
            </p>
            <Link to="/contact" onClick={() => trackEvent("contact_cta_click", { surface: "homepage-footer-cta" })} className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#071018] transition hover:bg-cyan-100">
              Get in touch <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
