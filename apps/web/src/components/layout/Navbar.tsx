import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { profile } from "@/data/profile";
import { trackEvent } from "@/lib/analytics";

const links = [
  { label: "Work", to: "/work" },
  { label: "About", to: "/journey" },
  { label: "Skills", to: "/expertise" },
  { label: "Learning", to: "/lab" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.065] bg-[#071018]/82 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link to="/" className="group flex items-center gap-3" aria-label={`${profile.name} home`}>
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden font-mono text-xs font-semibold text-cyan-100">
            <span className="relative z-10">{profile.initials}</span>
            <span className="absolute inset-x-1/2 top-[-25%] h-[150%] w-px rotate-45 bg-cyan-200/25" />
            <span className="absolute inset-y-1/2 left-[-25%] h-px w-[150%] -rotate-45 bg-violet-300/20" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold tracking-[-0.02em] text-white">{profile.name}</span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500">Data systems</span>
          </span>
        </Link>

        <div className="hidden h-full items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="relative flex h-full items-center px-4 text-sm font-medium text-slate-500 transition hover:text-white">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-4 bottom-0 h-px bg-cyan-200 shadow-[0_0_12px_rgba(134,239,232,.55)]"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className={isActive ? "text-white" : undefined}>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            onClick={() => trackEvent("contact_cta_click", { surface: "navbar" })}
            className="hidden min-h-10 items-center gap-2 px-1 text-sm font-semibold text-cyan-100 transition hover:text-white sm:inline-flex"
          >
            Connect <ArrowUpRight size={16} />
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center text-slate-300 transition hover:text-white md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-7xl border-t border-white/[0.055] bg-[#071018]/96 px-3 py-2 md:hidden"
          >
            {[{ label: "Home", to: "/" }, ...links, { label: "Contact", to: "/contact" }].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-white/[0.045] px-3 py-3 text-sm font-medium transition last:border-b-0 ${isActive ? "text-cyan-100" : "text-slate-500 hover:text-white"}`
                }
              >
                {link.label}
                <ArrowUpRight size={15} />
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
