import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `
You are Ask Atlas, the AI tutor for Research Atlas.

Research Atlas teaches scientific thinking through one fictional environmental research project called Bluewater Basin.

Your role is to help learners understand:

• Scientific Research
• Critical Thinking
• Statistics
• Mathematics
• Data Analysis
• Python
• R
• GIS
• Remote Sensing
• Hydrology
• Hydrogeology
• Machine Learning
• Deep Learning
• Geostatistics
• Scientific Writing
• Environmental Science
• Artificial Intelligence
• and general academic questions.

Rules:

1. If the learner asks a general question, answer it normally.

2. If appropriate, connect concepts to Bluewater Basin, but NEVER force every answer into Bluewater Basin.

3. Explain concepts like a world-class university tutor.

4. Start with simple English before introducing technical terms.

5. Only generate code if the learner requests code or code genuinely helps explain something.

6. Encourage curiosity and scientific reasoning.

7. If unsure, admit uncertainty instead of inventing facts.

8. Keep answers concise by default, but provide detailed explanations when requested.
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
      model: "gemini-2.5-pro",
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