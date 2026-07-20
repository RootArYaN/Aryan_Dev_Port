import * as Dialog from "@radix-ui/react-dialog";
import { Download, ExternalLink, FileText, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const resumeUrl = `${import.meta.env.BASE_URL}aryan-tembhekar-resume.pdf`;

export function ResumePreview() {
  const handleOpenChange = (open: boolean) => {
    if (open) trackEvent("resume_click", { surface: "homepage-hero-preview" });
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          data-testid="resume-link"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/[0.11] bg-white/[0.035] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
        >
          Preview resume <FileText size={17} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="resume-preview-overlay fixed inset-0 z-[80] bg-[#03090d]/80 backdrop-blur-md" />
        <Dialog.Content className="resume-preview-dialog fixed left-1/2 top-1/2 z-[90] flex h-[min(88vh,920px)] w-[min(94vw,920px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a141c] shadow-[0_32px_100px_rgba(0,0,0,.55)] focus:outline-none">
          <div className="flex min-h-16 items-center justify-between border-b border-white/10 px-4 sm:px-6">
            <div className="min-w-0">
              <Dialog.Title className="truncate text-sm font-semibold text-white">Aryan Tembhekar — Resume</Dialog.Title>
              <Dialog.Description className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                Work, education, projects, and technical skills
              </Dialog.Description>
            </div>
            <div className="ml-4 flex items-center gap-1">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("resume_click", { surface: "resume-preview-open" })}
                className="inline-flex h-10 items-center gap-2 px-3 text-xs font-semibold text-slate-300 transition hover:text-white"
              >
                <ExternalLink size={15} />
                <span className="hidden sm:inline">Open</span>
              </a>
              <a
                href={resumeUrl}
                download="Aryan-Tembhekar-Resume.pdf"
                onClick={() => trackEvent("resume_click", { surface: "resume-preview-download" })}
                className="inline-flex h-10 items-center gap-2 px-3 text-xs font-semibold text-cyan-100 transition hover:text-white"
              >
                <Download size={15} />
                <span className="hidden sm:inline">Download</span>
              </a>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="ml-1 grid h-10 w-10 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="Close resume preview"
                >
                  <X size={18} />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <div className="min-h-0 flex-1 bg-[#151b20] p-2 sm:p-4">
            <iframe
              title="Aryan Tembhekar resume preview"
              src={`${resumeUrl}#view=FitH&toolbar=0&navpanes=0`}
              className="h-full w-full rounded-lg bg-white"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
