import { motion } from "motion/react";
import { impactMetrics } from "@/data/profile";

export function Impact() {
  return (
    <section aria-label="Selected impact" className="px-5 lg:px-8">
      <div className="mx-auto max-w-7xl border-y border-white/[0.08] py-7">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
              className="relative px-0 lg:px-7 lg:first:pl-0 lg:not-first:border-l lg:not-first:border-white/[0.07]"
            >
              <p className="text-3xl font-medium tracking-[-0.04em] text-white">{metric.value}</p>
              <p className="mt-2 text-sm font-medium text-slate-300">{metric.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{metric.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
