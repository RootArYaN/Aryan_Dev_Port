import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/common/PageTransition";

export function NotFoundPage() {
  return (
    <PageTransition>
      <section className="grid min-h-[78vh] place-items-center px-5 pb-20 pt-32">
        <div className="max-w-xl text-center">
          <p className="font-mono text-sm text-cyan-200/60">404 · ROUTE_NOT_FOUND</p>
          <h1 className="mt-6 text-6xl font-medium tracking-[-0.06em] text-white sm:text-8xl">Wrong branch.</h1>
          <p className="mt-6 text-base leading-8 text-slate-400">This route is not part of the current system map.</p>
          <Link to="/" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#061017]">
            <ArrowLeft size={17} /> Return home
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
