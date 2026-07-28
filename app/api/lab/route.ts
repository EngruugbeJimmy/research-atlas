// app/api/lab/route.ts
//
// Single endpoint for all Lab conversations — Apollo's intake/exam
// discussion and all four domain professors' supervision. The correct
// system prompt is selected per-request via the `professor` field, so
// one route serves the whole feature rather than five near-duplicates.
//
// Separate from, and does not modify, app/api/ask-atlas/route.ts.

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { APOLLO_SYSTEM_PROMPT } from "@/lib/lab/professors/apollo";
import { WILLEY_SYSTEM_PROMPT } from "@/lib/lab/professors/willey";
import { ADAM_SMITH_SYSTEM_PROMPT } from "@/lib/lab/professors/adam-smith";
import { NEWTON_SYSTEM_PROMPT } from "@/lib/lab/professors/newton";
import { DARWIN_SYSTEM_PROMPT } from "@/lib/lab/professors/darwin";
import { parseReadinessScorecard } from "@/lib/lab/scorecard";
import type { Faculty } from "@/lib/lab/types";

type ProfessorKey = Faculty | "apollo";

const PROFESSOR_PROMPTS: Record<ProfessorKey, string> = {
  apollo: APOLLO_SYSTEM_PROMPT,
  environmental: WILLEY_SYSTEM_PROMPT,
  social: ADAM_SMITH_SYSTEM_PROMPT,
  physical: NEWTON_SYSTEM_PROMPT,
  life: DARWIN_SYSTEM_PROMPT,
};

interface HistoryTurn {
  role: "user" | "model";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const professor: unknown = body?.professor;
    const prompt: unknown = body?.prompt;
    const history: HistoryTurn[] = Array.isArray(body?.history) ? body.history : [];

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ reply: null, error: "Prompt is required." }, { status: 400 });
    }

    if (typeof professor !== "string" || !(professor in PROFESSOR_PROMPTS)) {
      return NextResponse.json(
        {
          reply: null,
          error: `Unknown professor "${professor}". Expected one of: ${Object.keys(PROFESSOR_PROMPTS).join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: null, error: "GEMINI_API_KEY not configured." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = PROFESSOR_PROMPTS[professor as ProfessorKey];

    const contents = [
      ...history.map((turn) => ({ role: turn.role, parts: [{ text: turn.content }] })),
      { role: "user" as const, parts: [{ text: prompt }] },
    ];

    const response = await ai.models.generateContent({
      model: "models/gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.6,
        // Lab responses run longer than Ask Atlas's quick tutoring replies —
        // stage feedback and the readiness scorecard both need real room.
        maxOutputTokens: 600,
        topP: 0.9,
      },
    });

    const rawReply = response.text ?? "I'm sorry, I couldn't generate a response. Please try again.";
    const { scorecard, cleanedText } = parseReadinessScorecard(rawReply);

    return NextResponse.json({
      reply: cleanedText,
      scorecard, // null unless this specific response actually contained a scorecard block
    });
  } catch (error) {
    console.error("Lab API Error:", error);
    return NextResponse.json({ reply: null, error: "Failed to communicate with Gemini." }, { status: 502 });
  }
}