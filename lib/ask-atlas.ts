/**
 * Ask Atlas — client helper.
 *
 * Calls the server route at /api/ask-atlas, which in turn calls the
 * Anthropic API using ANTHROPIC_API_KEY (see .env.example and README).
 *
 * If no key is configured (e.g. a fresh local clone), the API route falls
 * back to a small set of grounded, canned responses so the UI still works
 * end-to-end during development.
 */
export async function answerAskAtlas(prompt: string): Promise<string> {
  try {
    const res = await fetch("/api/ask-atlas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error(`Ask Atlas API returned ${res.status}`);
    const data = await res.json();
    return data.reply as string;
  } catch {
    return fallbackReply(prompt);
  }
}

function fallbackReply(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("quiz")) {
    return "Quick check: in Bluewater Basin, if a rain gauge sits under a tree canopy, is the rainfall it records likely to read too high, too low, or unbiased — and why?";
  }
  if (p.includes("simply") || p.includes("simple")) {
    return "In plain terms: we're treating Bluewater Basin like a real field site. Every concept gets tied to something you could point to on the map — a gauge, a well, a slope — before we touch the math.";
  }
  if (p.includes("example")) {
    return "Another example from the basin: the Ridge Overlook station sits at 214 m elevation with a 6% slope toward Bluewater River — that slope is exactly what drives the runoff patterns you'll model in Mission 01.";
  }
  if (p.includes("summar")) {
    return "This lesson connects one idea from the basin to one tool you'll use throughout Research Atlas — check the 'Research Connection' section on the page for exactly how professionals use it.";
  }
  return "I connect every answer back to Bluewater Basin data so it stays concrete. Try one of the suggested prompts, or ask me to relate this to an earlier mission.";
}
