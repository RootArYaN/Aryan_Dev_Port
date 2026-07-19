import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldClass = "w-full rounded-none border border-transparent border-b-white/[0.12] bg-transparent px-2 text-sm text-white outline-none transition placeholder:text-slate-650 hover:border-b-white/[0.22] focus:rounded-xl focus:border-cyan-200/40 focus:bg-cyan-200/[0.018] focus:px-4 focus:ring-4 focus:ring-cyan-200/[0.035]";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("min-h-12", fieldClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-40 resize-y py-3", fieldClass, className)} {...props} />;
}
