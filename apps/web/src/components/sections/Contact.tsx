import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { profile } from "@/data/profile";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { trackEvent } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email."),
  company: z.string().trim().max(120).optional(),
  subject: z.string().trim().min(3, "Please add a subject.").max(140),
  message: z.string().trim().min(20, "Please share a little more.").max(3000),
  website: z.string().max(0).optional(),
});
type ContactForm = z.infer<typeof contactSchema>;

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactForm) => {
    setStatus("idle");
    trackEvent("contact_cta_click", { surface: "contact-form-submit" });
    try {
      if (!api.isConfigured) {
        trackEvent("contact_submitted", { method: "email" });
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(`${values.message}\n\nFrom: ${values.name}${values.company ? `, ${values.company}` : ""}`)}`;
        return;
      }
      await api.contact(values);
      trackEvent("contact_submitted", { method: "api" });
      reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-transparent transition focus-within:border-cyan-200/25 focus-within:bg-cyan-200/[0.018] sm:rounded-[1.75rem] sm:p-1">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 p-4 sm:grid-cols-2 sm:p-9" noValidate>
        <label className="field-label">
          Name
          <Input className="mt-2" placeholder="Your name" autoComplete="name" {...register("name")} />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </label>
        <label className="field-label">
          Work email
          <Input className="mt-2" placeholder="you@company.com" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </label>
        <label className="field-label sm:col-span-2">
          Company <span className="text-slate-600">(optional)</span>
          <Input className="mt-2" placeholder="Company or team" autoComplete="organization" {...register("company")} />
        </label>
        <label className="field-label sm:col-span-2">
          Subject
          <Input className="mt-2" placeholder="Role, project, or question" {...register("subject")} />
          {errors.subject && <span className="field-error">{errors.subject.message}</span>}
        </label>
        <label className="field-label sm:col-span-2">
          Message
          <Textarea className="mt-2" placeholder="What would you like to discuss?" {...register("message")} />
          {errors.message && <span className="field-error">{errors.message.message}</span>}
        </label>
        <input className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} />
        <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
          <Button type="submit" disabled={isSubmitting} className="w-full gap-2 sm:w-auto">
            {isSubmitting ? <><Loader2 className="animate-spin" size={17} />Sending</> : <>Send message <Send size={16} /></>}
          </Button>
          {status === "sent" && <span className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={17} />Message received.</span>}
          {status === "error" && <span className="text-sm text-rose-300">Could not send. Please use email.</span>}
        </div>
      </form>
    </div>
  );
}
