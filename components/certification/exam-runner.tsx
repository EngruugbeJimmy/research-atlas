"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, AlertCircle } from "lucide-react";
import { buildExam, EXAM_PASS_PERCENT, type ExamQuestion } from "@/lib/exam";
import { missions } from "@/lib/missions/data";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils/cn";

type Answers = Record<string, number>;

export function ExamRunner() {
  const { recordExamAttempt, progress } = useProgress();
  const [seed, setSeed] = useState(() => Date.now());
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const questions = useMemo(() => buildExam(seed), [seed]);
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const results = useMemo(() => {
    if (!submitted) return null;
    const perMission = new Map<string, { correct: number; total: number }>();
    let correct = 0;
    for (const q of questions) {
      const isCorrect = answers[q.id] === q.correctIndex;
      if (isCorrect) correct += 1;
      const entry = perMission.get(q.missionId) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (isCorrect) entry.correct += 1;
      perMission.set(q.missionId, entry);
    }
    const percent = Math.round((correct / questions.length) * 100);
    return { correct, total: questions.length, percent, perMission };
  }, [submitted, questions, answers]);

  useEffect(() => {
    if (results && !recorded) {
      recordExamAttempt(results.percent);
      setRecorded(true);
    }
  }, [results, recorded, recordExamAttempt]);

  function handleRetake() {
    setSeed(Date.now());
    setAnswers({});
    setSubmitted(false);
    setRecorded(false);
  }

  if (submitted && results) {
    const passed = results.percent >= EXAM_PASS_PERCENT;

    const weakMissions = Array.from(results.perMission.entries())
      .filter(([, r]) => r.correct / r.total < 0.7)
      .map(([missionId]) => missions.find((m) => m.id === missionId))
      .filter((m): m is NonNullable<typeof m> => Boolean(m));

    return (
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-2xl border p-8 text-center",
            passed ? "border-signal-500/30 bg-signal-500/5" : "border-basin-500/20"
          )}
        >
          <div
            className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
              passed ? "bg-signal-500/15 text-signal-500" : "bg-ink/5 text-ink/40 dark:bg-paper/10 dark:text-paper/40"
            )}
          >
            {passed ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
          </div>
          <p className="type-eyebrow mt-5">{passed ? "You passed" : "Not quite yet"}</p>
          <h1 className="mt-2 font-display text-3xl">{results.percent}%</h1>
          <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">
            {results.correct} of {results.total} correct · passing score is {EXAM_PASS_PERCENT}%
          </p>

          {passed ? (
            <Link
              href="/certification/checkout"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper transition hover:bg-basin-600"
            >
              Continue to your certificate <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="mt-8 space-y-4 text-left">
              {weakMissions.length > 0 && (
                <div className="rounded-xl border border-basin-500/15 bg-paper p-4 dark:bg-ink">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="h-4 w-4 text-basin-500" /> Review recommended
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-ink/65 dark:text-paper/65">
                    {weakMissions.map((m) => (
                      <li key={m.id}>
                        <Link href={`/missions/${m.id}`} className="text-basin-500 hover:underline">
                          {m.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={handleRetake}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper transition hover:bg-basin-600"
              >
                <RotateCcw className="h-4 w-4" /> Retake the exam
              </button>
              <p className="text-center text-xs text-ink/45 dark:text-paper/45">
                Attempt {progress.examAttempts} · your best score so far is{" "}
                {progress.examBestScorePercent ?? 0}%
              </p>
            </div>
          )}
        </motion.div>

        {/* Per-question review */}
        <div className="mt-10 space-y-4">
          <h2 className="font-display text-lg">Review your answers</h2>
          {questions.map((q, i) => {
            const isCorrect = answers[q.id] === q.correctIndex;
            return (
              <div key={q.id} className="rounded-xl border border-basin-500/15 p-4">
                <p className="text-sm font-medium">
                  <span className="font-mono text-basin-500">Q{i + 1}.</span> {q.question}
                </p>
                <p className={cn("mt-2 text-sm", isCorrect ? "text-signal-500" : "text-red-500")}>
                  Your answer: {q.options[answers[q.id] ?? -1] ?? "Not answered"}
                </p>
                {!isCorrect && (
                  <p className="mt-1 text-sm text-ink/65 dark:text-paper/65">
                    Correct answer: {q.options[q.correctIndex]}
                  </p>
                )}
                <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">Final Certification Exam</p>
      <h1 className="mt-2 text-3xl font-medium">{questions.length} questions</h1>
      <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
        Answer every question, then submit for your score. You need {EXAM_PASS_PERCENT}% to pass, and you can retake the exam as many times as you need.
      </p>

      <div className="mt-10 space-y-6">
        {questions.map((q, i) => (
          <ExamQuestionCard
            key={q.id}
            index={i}
            question={q}
            selected={answers[q.id]}
            onSelect={(optionIndex) => setAnswers((a) => ({ ...a, [q.id]: optionIndex }))}
          />
        ))}
      </div>

      <div className="sticky bottom-4 mt-10 flex justify-center">
        <button
          onClick={() => allAnswered && setSubmitted(true)}
          disabled={!allAnswered}
          className={cn(
            "rounded-full px-8 py-3 font-medium shadow-lg transition",
            allAnswered
              ? "bg-basin-500 text-paper hover:bg-basin-600"
              : "cursor-not-allowed bg-basin-500/30 text-paper/70"
          )}
        >
          {allAnswered
            ? "Submit exam"
            : `Answer all questions (${Object.keys(answers).length}/${questions.length})`}
        </button>
      </div>
    </div>
  );
}

function ExamQuestionCard({
  index,
  question,
  selected,
  onSelect,
}: {
  index: number;
  question: ExamQuestion;
  selected: number | undefined;
  onSelect: (optionIndex: number) => void;
}) {
  return (
    <div className="rounded-xl border border-basin-500/15 p-5">
      <p className="font-medium">
        <span className="font-mono text-basin-500">Q{index + 1}.</span> {question.question}
      </p>
      <div className="mt-4 space-y-2">
        {question.options.map((option, i) => (
          <button
            key={option}
            onClick={() => onSelect(i)}
            className={cn(
              "block w-full rounded-lg border px-4 py-2.5 text-left text-sm transition",
              selected === i
                ? "border-basin-500 bg-basin-500/10"
                : "border-basin-500/20 hover:border-basin-500/50 hover:bg-basin-500/5"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
