import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200/85">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.03] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">{title}</h2>
      {description && <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{description}</p>}
    </div>
  );
}
