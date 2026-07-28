// lib/lab/chat.ts
//
// Client-side helper for Lab conversations — the Lab's equivalent of
// lib/ask-atlas.ts, but with one deliberate difference: on failure, this
// NEVER fabricates plausible-sounding supervisory feedback. Ask Atlas's
// fallback is fine giving generic canned tutoring; a fake "this looks
// good" from a Lab professor would be a false signal about real
// research work, which is a different kind of failure entirely.

import type { Faculty, StageMessage } from "@/lib/lab/types";

export type ProfessorKey = Faculty | "apollo";

interface HistoryTurn {
  role: "user" | "model";
  content: string;
}

export interface LabChatResult {
  reply: string;
  scorecard: import("@/lib/lab/types").ReadinessScorecard | null;
  /** True if this is a real professor response; false if the API call failed. */
  ok: boolean;
}

/** Converts a stage's stored StageMessage[] (recruit/professor) into the
 *  role naming Gemini's API expects (user/model). Kept as a named export
 *  since both the exam flow and stage supervision need this conversion. */
export function toApiHistory(messages: StageMessage[]): HistoryTurn[] {
  return messages.map((m) => ({
    role: m.role === "recruit" ? "user" : "model",
    content: m.content,
  }));
}

export async function sendLabMessage(
  professor: ProfessorKey,
  prompt: string,
  history: HistoryTurn[]
): Promise<LabChatResult> {
  try {
    const res = await fetch("/api/lab", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professor, prompt, history }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? `Lab API returned ${res.status}`);
    }

    const data = await res.json();
    return { reply: data.reply as string, scorecard: data.scorecard ?? null, ok: true };
  } catch (err) {
    console.error("Lab chat error:", err);
    return {
      reply:
        "I'm having trouble connecting right now — this isn't feedback on your work, just a connection issue. Please try again in a moment, and if it persists, check that the Lab's AI service is configured correctly.",
      scorecard: null,
      ok: false,
    };
  }
}