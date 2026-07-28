// lib/lab/scorecard.ts
//
// Parses the professor's structured "READINESS SCORECARD:" text block
// (format defined in lib/lab/professors/shared-supervision-rules.ts)
// back into the ReadinessScorecard type. Parsing failures degrade
// gracefully — a malformed block just means no scorecard was extracted,
// never a crash or lost message.

import type { ReadinessScorecard } from "@/lib/lab/types";

const FIELD_PATTERN = /^([a-z_]+):\s*(.+)$/i;
const MARKER = "READINESS SCORECARD:";

export function parseReadinessScorecard(
  text: string
): { scorecard: ReadinessScorecard | null; cleanedText: string } {
  const markerIndex = text.indexOf(MARKER);
  if (markerIndex === -1) {
    return { scorecard: null, cleanedText: text };
  }

  const before = text.slice(0, markerIndex).trim();
  const block = text.slice(markerIndex + MARKER.length);
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  const fields: Record<string, string> = {};
  let consumedLines = 0;
  for (const line of lines) {
    const match = FIELD_PATTERN.exec(line);
    if (!match) break; // first non-field line = where the professor's plain-language explanation resumes
    fields[match[1].toLowerCase()] = match[2].trim();
    consumedLines++;
  }

  try {
    const scorecard: ReadinessScorecard = {
      novelty: { score: parseScore(fields.novelty_score), notes: fields.novelty_notes ?? "" },
      methodologicalSoundness: {
        score: parseScore(fields.methodology_score),
        notes: fields.methodology_notes ?? "",
      },
      clarity: { score: parseScore(fields.clarity_score), notes: fields.clarity_notes ?? "" },
      ethicalCompliance: {
        score: parseScore(fields.ethics_score),
        notes: fields.ethics_notes ?? "",
        flagged: (fields.ethics_flagged ?? "false").toLowerCase() === "true",
      },
      overallRecommendation: fields.recommendation?.toLowerCase().includes("ready")
        ? "ready_for_human_review"
        : "needs_more_work",
      generatedAt: new Date().toISOString(),
    };

    const remainingProse = lines.slice(consumedLines).join("\n");
    const cleanedText = [before, remainingProse].filter(Boolean).join("\n\n").trim();

    return { scorecard, cleanedText: cleanedText || before };
  } catch (err) {
    console.warn("Failed to parse readiness scorecard — model output may not match the expected format:", err);
    return { scorecard: null, cleanedText: text };
  }
}

function parseScore(raw: string | undefined): number {
  const n = Number(raw);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(10, n));
}