"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { suggestFacultyFromTopic } from "@/lib/lab/professors/apollo";
import { FACULTIES, type Faculty } from "@/lib/lab/types";

export function TopicIntake({
  onSubmit,
}: {
  onSubmit: (topic: string, faculty: Faculty) => void;
}) {
  const [topic, setTopic] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const suggested = topic.trim().length > 10 ? suggestFacultyFromTopic(topic) : null;

  return (
    <div className="mx-auto max-w-xl py-16">
      <h1 className="font-display text-3xl">What are you researching?</h1>
      <p className="mt-2 text-ink/70 dark:text-paper/70">
        Describe the problem or community you're interested in — this connects you with the right
        faculty supervisor.
      </p>

      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        rows={4}
        placeholder="e.g. Groundwater contamination risk in a coastal farming community..."
        className="mt-4 w-full rounded-xl border-2 border-basin-500/20 bg-transparent p-4 outline-none focus:border-basin-500"
      />

      {topic.trim().length > 10 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-ink/60 dark:text-paper/60">Choose your faculty supervisor:</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(Object.keys(FACULTIES) as Faculty[]).map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFaculty(f)}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition",
                  selectedFaculty === f
                    ? "border-basin-500 bg-basin-500/10"
                    : "border-basin-500/15 hover:bg-basin-500/5"
                )}
              >
                <p className="font-semibold">{FACULTIES[f].professorName}</p>
                <p className="text-xs text-ink/60 dark:text-paper/60">{FACULTIES[f].domain}</p>
                {suggested === f && (
                  <p className="mt-1 text-xs font-medium text-signal-600">Suggested match</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => selectedFaculty && onSubmit(topic, selectedFaculty)}
        disabled={!selectedFaculty}
        className={cn(
          "mt-8 w-full rounded-xl px-8 py-4 text-lg font-semibold transition",
          selectedFaculty
            ? "bg-basin-500 text-paper hover:bg-basin-600"
            : "cursor-not-allowed bg-ink/10 text-ink/40 dark:bg-paper/10 dark:text-paper/40"
        )}
      >
        Begin supervision
      </button>
    </div>
  );
}