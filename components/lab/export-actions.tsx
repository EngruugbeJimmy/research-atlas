"use client";

import { useState } from "react";
import { Download, FileText, MessageCircle } from "lucide-react";
import type { LabSession } from "@/lib/lab/types";
import { downloadMarkdown, downloadPdf, shareForConsultantReview } from "@/lib/lab/export";

export function ExportActions({ session }: { session: LabSession }) {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="rounded-xl border-2 border-signal-500/40 bg-signal-400/10 p-5">
      <p className="font-semibold">Ready for human review</p>
      <p className="mt-1 text-sm text-ink/70 dark:text-paper/70">
        Download your draft, then send it to a real consultant for feedback.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            downloadPdf(session);
            setDownloaded(true);
          }}
          className="flex items-center gap-2 rounded-lg border border-basin-500/25 px-4 py-2 text-sm font-medium hover:bg-basin-500/10"
        >
          <Download className="h-4 w-4" /> Download PDF
        </button>
        <button
          onClick={() => {
            downloadMarkdown(session);
            setDownloaded(true);
          }}
          className="flex items-center gap-2 rounded-lg border border-basin-500/25 px-4 py-2 text-sm font-medium hover:bg-basin-500/10"
        >
          <FileText className="h-4 w-4" /> Download Markdown
        </button>
      </div>

      {downloaded && (
        <div className="mt-4 border-t border-signal-500/20 pt-4">
          <p className="text-xs text-ink/60 dark:text-paper/60">
            Downloaded. WhatsApp can't auto-attach files — once it opens, attach the file you just
            downloaded before sending.
          </p>
          <button
            onClick={() => shareForConsultantReview(session)}
            className="mt-2 flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-ink transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" /> Open WhatsApp to share
          </button>
        </div>
      )}
    </div>
  );
}