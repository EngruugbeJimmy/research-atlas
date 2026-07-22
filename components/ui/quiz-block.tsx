"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/lib/missions/types";

export function QuizBlock({
  questions,
  onScoreChange,
}: {
  questions: QuizQuestion[];
  onScoreChange?: (correct: number, total: number) => void;
}) {
  const results = useRef<Record<number, boolean>>({});

  const reportScore = useCallback(() => {
    if (!onScoreChange) return;
    const answeredCount = Object.keys(results.current).length;
    if (answeredCount < questions.length) return;
    const correct = Object.values(results.current).filter(Boolean).length;
    onScoreChange(correct, questions.length);
  }, [onScoreChange, questions.length]);

  return (
    <div className="space-y-8">
      {questions.map((q, i) => (
        <QuizQuestionCard
          key={i}
          question={q}
          index={i}
          onAnswered={(isCorrect) => {
            results.current[i] = isCorrect;
            reportScore();
          }}
        />
      ))}
    </div>
  );
}

function QuizQuestionCard({
  question,
  index,
  onAnswered,
}: {
  question: QuizQuestion;
  index: number;
  onAnswered?: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const answered = selected !== null;
  const correct = selected === question.correctIndex;

  useEffect(() => {
    if (answered) onAnswered?.(correct);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered]);

  return (
    <div className="rounded-xl border border-basin-500/15 p-5">
      <p className="font-medium">
        <span className="font-mono text-basin-500">Q{index + 1}.</span>{" "}
        {question.question}
      </p>
      <div className="mt-4 space-y-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = i === selected;
          return (
            <button
              key={option}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition",
                !answered && "border-basin-500/20 hover:border-basin-500/50 hover:bg-basin-500/5",
                answered && isCorrect && "border-signal-500 bg-signal-500/10",
                answered && isSelected && !isCorrect && "border-red-400/60 bg-red-400/5",
                answered && !isSelected && !isCorrect && "border-basin-500/10 opacity-50"
              )}
            >
              {option}
              {answered && isCorrect && <CheckCircle2 className="h-4 w-4 text-signal-500" />}
              {answered && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-400" />}
            </button>
          );
        })}
      </div>
      {answered && (
        <p
          className={cn(
            "mt-3 text-sm",
            correct ? "text-signal-500" : "text-ink/65 dark:text-paper/65"
          )}
        >
          {correct ? "Correct. " : "Not quite. "}
          {question.explanation}
        </p>
      )}
    </div>
  );
}
