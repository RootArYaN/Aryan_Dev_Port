import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 disabled:cursor-not-allowed disabled:opacity-60",
        "bg-cyan-200 text-[#061017] shadow-[0_12px_35px_rgba(126,231,226,.08)] hover:bg-cyan-100",
        className,
      )}
      {...props}
    />
  );
}
