"use client";

import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LIFECYCLE_STAGES, LifecycleStage, LabSession, FACULTIES } from "@/lib/lab/types";

const STAGE_LABELS: Record<LifecycleStage, string> = {
  ideation: "Ideation",
  problem_identification: "Problem Identification",
  introduction: "Introduction",
  literature_review: "Literature Review",
  methodology: "Methodology",
  results: "Results",
  conclusion: "Conclusion",
  recommendations: "Recommendations",
};

export function LabSidebar({
  session,
  activeStage,
  onSelectStage,
}: {
  session: LabSession;
  activeStage: LifecycleStage;
  onSelectStage: (stage: LifecycleStage) => void;
}) {
  const faculty = session.faculty ? FACULTIES[session.faculty] : null;

  return (
    <aside className="w-72 shrink-0 border-r border-basin-500/15 px-5 py-6">
      <p className="text-sm font-semibold text-ink/50 dark:text-paper/50">Research Atlas Lab</p>
      {faculty && (
        <p className="mt-1 font-display text-lg">
          {faculty.professorName} · {faculty.domain}
        </p>
      )}
      {session.topic && (
        <p className="mt-2 text-sm italic text-ink/60 dark:text-paper/60">"{session.topic}"</p>
      )}

      <ol className="mt-6 space-y-1">
        {LIFECYCLE_STAGES.map((stage, i) => {
          const record = session.stages[stage];
          const isCurrent = stage === activeStage;
          const isLocked = record.status === "locked";

          return (
            <li key={stage}>
              <button
                onClick={() => !isLocked && onSelectStage(stage)}
                disabled={isLocked}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                  isCurrent
                    ? "bg-basin-500 text-paper"
                    : isLocked
                      ? "cursor-not-allowed text-ink/30 dark:text-paper/30"
                      : "text-ink/75 hover:bg-basin-500/10 dark:text-paper/75"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                    isCurrent
                      ? "border-paper bg-paper text-basin-500"
                      : record.status === "complete"
                        ? "border-signal-500 bg-signal-500 text-ink"
                        : "border-ink/25 dark:border-paper/25"
                  )}
                >
                  {record.status === "complete" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : isLocked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    i + 1
                  )}
                </span>
                {STAGE_LABELS[stage]}
              </button>
            </li>
          );
        })}
      </ol>

      {session.status === "ready_for_review" && (
        <div className="mt-6 rounded-lg border border-signal-500/40 bg-signal-400/10 px-3 py-2 text-xs font-medium text-ink dark:text-paper">
          ✓ Ready for human review
        </div>
      )}
    </aside>
  );
}