"use client";

import { useState, type RefObject } from "react";
import { Download, Image as ImageIcon, Linkedin, Facebook, Loader2 } from "lucide-react";

interface CertificateActionsProps {
  targetRef: RefObject<HTMLDivElement | null>;
  learnerName: string;
}

const SITE_URL = "https://research-atlas.dev";
const SHARE_TEXT =
  "I just earned my Research Atlas Certificate of Achievement — completing a full curriculum in statistics, GIS, machine learning, and scientific research methods.";

export function CertificateActions({ targetRef, learnerName }: CertificateActionsProps) {
  const [busy, setBusy] = useState<"pdf" | "image" | null>(null);

  async function renderCanvas() {
    if (!targetRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(targetRef.current, {
      scale: 3,
      backgroundColor: "#f7f3e8",
      useCORS: true,
    });
  }

  async function downloadImage() {
    setBusy("image");
    try {
      const canvas = await renderCanvas();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = `research-atlas-certificate-${slugify(learnerName)}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    } finally {
      setBusy(null);
    }
  }

  async function downloadPdf() {
    setBusy("pdf");
    try {
      const canvas = await renderCanvas();
      if (!canvas) return;
      const { jsPDF } = await import("jspdf");
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`research-atlas-certificate-${slugify(learnerName)}.pdf`);
    } finally {
      setBusy(null);
    }
  }

  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  }

  function shareX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  }

  function shareFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={downloadPdf}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-basin-500 px-5 py-3 text-sm font-medium text-paper transition hover:bg-basin-600 disabled:opacity-60"
        >
          {busy === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download PDF
        </button>
        <button
          onClick={downloadImage}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-basin-500/30 px-5 py-3 text-sm font-medium text-basin-500 transition hover:bg-basin-500/10 disabled:opacity-60"
        >
          {busy === "image" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          Download Image
        </button>
      </div>
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-ink/50 dark:text-paper/50">Share:</span>
        <button
          onClick={shareLinkedIn}
          aria-label="Share on LinkedIn"
          className="rounded-full border border-basin-500/25 p-2 text-basin-500 transition hover:bg-basin-500/10"
        >
          <Linkedin className="h-4 w-4" />
        </button>
        <button
          onClick={shareX}
          aria-label="Share on X"
          className="rounded-full border border-basin-500/25 p-2 text-basin-500 transition hover:bg-basin-500/10"
        >
          <span className="block h-4 w-4 text-center text-xs font-bold leading-4">X</span>
        </button>
        <button
          onClick={shareFacebook}
          aria-label="Share on Facebook"
          className="rounded-full border border-basin-500/25 p-2 text-basin-500 transition hover:bg-basin-500/10"
        >
          <Facebook className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function slugify(name: string): string {
  const s = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return s || "learner";
}
