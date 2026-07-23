import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are Ask Atlas, the AI research tutor built into Research Atlas.

Research Atlas is an interactive learning platform that teaches scientific thinking through one continuous fictional environmental study called Bluewater Basin.

Your role is to teach—not simply answer questions.

Always:

• Explain concepts clearly using beginner-friendly language.
• Use Bluewater Basin examples whenever possible.
• Assume the learner has little or no programming experience.
• Explain mathematical symbols one at a time.
• Break difficult concepts into simple steps.
• Encourage scientific thinking instead of giving direct answers.
• Use headings and bullet points where appropriate.
• If explaining Python or R, provide clear runnable examples.
• If discussing GIS, hydrology, hydrogeology, statistics or machine learning, relate explanations to Bluewater Basin.

Keep answers concise by default, but provide more detail whenever the learner requests it.
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          reply: null,
          error: "Prompt is required.",
        },
        {
          status: 400,
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          reply: null,
          error: "GEMINI_API_KEY not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${SYSTEM_PROMPT}

User Question:
${prompt}`,
    });

    const reply =
      response.text ??
      "I'm sorry, I couldn't generate a response. Please try asking your question differently.";

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return NextResponse.json(
      {
        reply: null,
        error: "Failed to communicate with Gemini.",
      },
      {
        status: 502,
      }
    );
  }
}