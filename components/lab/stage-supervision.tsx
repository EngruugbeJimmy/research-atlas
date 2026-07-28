"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { sendLabMessage, toApiHistory, type ProfessorKey } from "@/lib/lab/chat";
import { useLabSession } from "@/hooks/use-lab-session";
import { LIFECYCLE_STAGES, LifecycleStage, LabSession } from "@/lib/lab/types";

export function StageSupervision({
  sessionId,
  session,
  stage,
}: {
  sessionId: string;
  session: LabSession;
  stage: LifecycleStage;
}) {
  const { appendStageMessages, completeStage, updateSession } = useLabSession();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const record = session.stages[stage];
  const professor: ProfessorKey = session.faculty ?? "apollo";
  const isLastStage = stage === LIFECYCLE_STAGES[LIFECYCLE_STAGES.length - 1];

  async function send() {
    if (!input.trim() || pending) return;
    const text = input;
    setInput("");
    setPending(true);

    appendStageMessages(sessionId, stage, [
      { role: "recruit", content: text, timestamp: new Date().toISOString() },
    ]);

    const result = await sendLabMessage(professor, text, toApiHistory(record.messages));

    appendStageMessages(sessionId, stage, [
      { role: "professor", content: result.reply, timestamp: new Date().toISOString() },
    ]);

    if (result.scorecard) {
      updateSession(sessionId, { scorecard: result.scorecard, status: "ready_for_review" });
    }

    setPending(false);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-8 py-6">
        {record.messages.length === 0 && (
          <p className="text-ink/50 dark:text-paper/50">
            Start the conversation — describe where you're at with this stage.
          </p>
        )}
        {record.messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed",
              m.role === "professor"
                ? "bg-basin-500/10 text-ink dark:text-paper"
                : "ml-auto bg-signal-500/20 text-ink dark:text-paper"
            )}
          >
            {m.content}
          </div>
        ))}
        {pending && (
          <div className="max-w-[75%] rounded-xl bg-basin-500/10 px-4 py-2.5 text-sm text-ink/60 dark:text-paper/60">
            Thinking...
          </div>
        )}
      </div>

      <div className="border-t border-basin-500/15 p-4">
        {record.status !== "complete" && !isLastStage && (
          <button
            onClick={() => completeStage(sessionId, stage)}
            className="mb-3 text-sm font-medium text-basin-500 hover:underline"
          >
            This stage feels solid → move to next stage
          </button>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk through this stage with your supervisor..."
            className="flex-1 rounded-full border border-basin-500/25 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-basin-500"
          />
          <button
            type="submit"
            className="rounded-full bg-basin-500 p-2.5 text-paper hover:bg-basin-600"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}