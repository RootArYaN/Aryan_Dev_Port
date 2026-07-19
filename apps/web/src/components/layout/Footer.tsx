import { ArrowUpRight, GitBranch, ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="px-5 pb-8 pt-20 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden border-t border-white/[0.07]">
        <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Build the next useful system</p>
            <h2 className="mt-5 max-w-2xl text-4xl font-medium leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl">
              Complex data. Clear decisions. Human control.
            </h2>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-cyan-200">
              Start a conversation <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="grid content-end gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <a href={`mailto:${profile.email}`} className="footer-link"><Mail size={17} />Email</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="footer-link"><ExternalLink size={17} />LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="footer-link"><GitBranch size={17} />GitHub</a>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/[0.07] px-7 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>React · Vite · Motion · FastAPI · SQL</p>
        </div>
      </div>
    </footer>
  );
}
