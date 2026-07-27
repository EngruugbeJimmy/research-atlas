// lib/lab/export.ts
//
// Turns a Lab session's stage drafts into a shareable document, and
// hands off to WhatsApp for human review.
//
// Honest limitation, stated plainly: wa.me links can only pre-fill a
// text message — WhatsApp's click-to-chat API has no mechanism to
// attach a file automatically. So this is a two-step handoff, not a
// one-click send: download the file, then WhatsApp opens with a
// ready-written message telling the recruit to attach what they just
// downloaded. Anything that implied "click once and the PDF appears in
// WhatsApp" would be overstating what's actually possible here.

import jsPDF from "jspdf";
import { LabSession, LIFECYCLE_STAGES, FACULTIES } from "@/lib/lab/types";

const STAGE_TITLES: Record<string, string> = {
  ideation: "Ideation",
  problem_identification: "Problem Identification",
  introduction: "Introduction",
  literature_review: "Literature Review",
  methodology: "Methodology",
  results: "Results",
  conclusion: "Conclusion",
  recommendations: "Recommendations",
};

// Reuses the same WhatsApp community link already wired into the About
// page — see app/about/page.tsx. This is the only concrete WhatsApp
// destination that exists today; once real consultant-matching (from
// the Google Form design) is wired up, this should route to the
// specific matched consultant's number instead of the general group.
export const CONSULTANT_REVIEW_WHATSAPP_LINK =
  "https://chat.whatsapp.com/FYei0E0I9JI4iwputo2RFG?s=sh&p=a&ilr=1";

export function generateMarkdown(session: LabSession): string {
  const facultyLabel = session.faculty ? FACULTIES[session.faculty] : null;
  const lines: string[] = [
    `# ${session.topic ?? "Untitled Research Draft"}`,
    "",
    facultyLabel
      ? `*Supervised by ${facultyLabel.professorName} (${facultyLabel.domain}) — Research Atlas Lab*`
      : "*Research Atlas Lab*",
    "",
    `Status: ${session.status === "ready_for_review" ? "Ready for human review" : session.status}`,
    "",
    "---",
    "",
  ];

  for (const stage of LIFECYCLE_STAGES) {
    const record = session.stages[stage];
    if (!record.draftContent.trim()) continue;
    lines.push(`## ${STAGE_TITLES[stage]}`, "", record.draftContent.trim(), "");
  }

  if (session.scorecard) {
    const s = session.scorecard;
    lines.push(
      "---",
      "",
      "## Readiness Scorecard (AI-supervised, not a publication guarantee)",
      "",
      `- **Novelty:** ${s.novelty.score}/10 — ${s.novelty.notes}`,
      `- **Methodological soundness:** ${s.methodologicalSoundness.score}/10 — ${s.methodologicalSoundness.notes}`,
      `- **Clarity:** ${s.clarity.score}/10 — ${s.clarity.notes}`,
      `- **Ethical compliance:** ${s.ethicalCompliance.score}/10 — ${s.ethicalCompliance.notes}${
        s.ethicalCompliance.flagged ? " ⚠️ FLAGGED — resolve before any submission." : ""
      }`,
      "",
      `**Recommendation:** ${
        s.overallRecommendation === "ready_for_human_review"
          ? "Ready for a human reviewer to assess."
          : "Needs more work before human review."
      }`,
      "",
      "*This scorecard reflects an AI supervisor's assessment against research-quality criteria. It is not a certification of publishability — a qualified human reviewer should assess this before any submission to a journal.*"
    );
  }

  return lines.join("\n");
}

export function downloadMarkdown(session: LabSession) {
  const content = generateMarkdown(session);
  const blob = new Blob([content], { type: "text/markdown" });
  triggerDownload(blob, `${slugify(session.topic ?? "research-draft")}.md`);
}

export function downloadPdf(session: LabSession) {
  const content = generateMarkdown(session);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;

  const lines = doc.splitTextToSize(content, maxWidth);
  let cursorY = margin;
  const lineHeight = 14;
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  for (const line of lines) {
    if (cursorY > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(line, margin, cursorY);
    cursorY += lineHeight;
  }

  doc.save(`${slugify(session.topic ?? "research-draft")}.pdf`);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || "draft";
}

/**
 * Opens WhatsApp with a pre-written message asking for consultant review.
 * IMPORTANT: this does NOT attach the file — see the file-level comment.
 * Call downloadPdf() or downloadMarkdown() first so the recruit has the
 * file ready to manually attach once WhatsApp opens.
 */
export function shareForConsultantReview(session: LabSession) {
  const facultyLabel = session.faculty ? FACULTIES[session.faculty].domain : "research";
  const message =
    `Hi! I've completed a ${facultyLabel} research draft on "${session.topic ?? "my topic"}" ` +
    `through Research Atlas Lab and I'd like a human reviewer's feedback before considering submission.\n\n` +
    `I've just downloaded the draft — attaching it to this chat now.\n\n` +
    `Learn more: https://research-atlas-chi.vercel.app`;

  window.open(
    `${CONSULTANT_REVIEW_WHATSAPP_LINK}`, // group invite link — opens the community
    "_blank"
  );
  // Separately, also offer the direct compose intent so the message text
  // is pre-filled if the recruit instead wants to message an individual:
  // https://wa.me/?text=<encoded message> — surfaced as a second button
  // in the UI component, not auto-triggered, since opening two WhatsApp
  // intents at once would be jarring.
  return message;
}