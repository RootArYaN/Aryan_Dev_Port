import { motion } from "motion/react";
import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  index?: string;
  visual?: ReactNode;
}

export function PageIntro({ eyebrow, title, description, index, visual }: PageIntroProps) {
  return (
    <header className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:pt-32 lg:px-8 lg:pb-14 lg:pt-36">
      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.55 }}>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/85">
            {index && <span className="font-mono text-white/35">{index}</span>}
            <span>{eyebrow}</span>
          </div>
          {visual && <div className="mt-10 lg:mt-14">{visual}</div>}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="max-w-5xl text-balance text-[2.7rem] font-medium leading-[1] tracking-[-0.052em] text-white sm:text-7xl sm:leading-[0.98] lg:text-[5.6rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-pretty text-base leading-7 text-slate-300 sm:mt-8 sm:text-xl sm:leading-8">{description}</p>
        </motion.div>
      </div>
    </header>
  );
}
