import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Ask Atlas, the in-context research assistant embedded in Research Atlas,
an educational platform that teaches statistics, GIS, and machine learning through one
continuous fictional case study: the Bluewater Basin watershed.

Rules:
- Ground every explanation in Bluewater Basin where possible (rain gauges, groundwater
  wells, streamflow, land use) rather than generic examples.
- Assume the learner has never programmed and may have no math background beyond
  arithmetic unless they show otherwise.
- Prefer plain language first, then introduce precise terminology.
- Keep replies under 120 words unless asked to elaborate.
- Never invent specific numeric results for real-world locations; Bluewater Basin data
  is synthetic and can be used freely.`;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { reply: null, error: "ANTHROPIC_API_KEY not configured" },
      { status: 501 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { reply: null, error: `Anthropic API error ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content
      ?.filter((block: { type: string }) => block.type === "text")
      .map((block: { text: string }) => block.text)
      .join("\n");

    return NextResponse.json({ reply: text ?? "I couldn't form a reply — try rephrasing." });
  } catch {
    return NextResponse.json(
      { reply: null, error: "Network error calling Anthropic API" },
      { status: 502 }
    );
  }
}
