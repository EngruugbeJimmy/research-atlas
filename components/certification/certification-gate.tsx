"use client";

import Link from "next/link";
import { CheckCircle2, Lock, GraduationCap, ArrowRight, Award } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { missions } from "@/lib/missions/data";
import { allMissionsComplete } from "@/lib/gamification";
import { EXAM_PASS_PERCENT } from "@/lib/exam";
import { cn } from "@/lib/utils/cn";

export function CertificationGate() {
  const { hydrated, progress } = useProgress();
  const builtOut = missions.filter((m) => m.builtOut);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        <div className="h-40 animate-pulse rounded-2xl bg-basin-500/5" />
      </div>
    );
  }

  const allComplete = allMissionsComplete(progress);
  const hasPassed = (progress.examBestScorePercent ?? 0) >= EXAM_PASS_PERCENT;
  const hasCertificate = progress.certificate.earned;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-basin-500/10 text-basin-500">
          <GraduationCap className="h-8 w-8" />
        </div>
        <p className="type-eyebrow mt-5">Research Atlas</p>
        <h1 className="mt-2 font-display text-3xl">Final Certification</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink/65 dark:text-paper/65">
          Complete every mission, then pass a {EXAM_PASS_PERCENT}%-threshold exam drawn from
          across the whole curriculum to earn your Research Atlas Certificate
          of Achievement.
        </p>
      </div>

      {hasCertificate ? (
        <div className="mt-10 rounded-2xl border border-signal-500/30 bg-signal-500/5 p-6 text-center">
          <Award className="mx-auto h-8 w-8 text-signal-500" />
          <p className="mt-3 font-medium">You've already earned your certificate.</p>
          <Link
            href="/certification/certificate"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-basin-500 px-6 py-2.5 text-sm font-medium text-paper hover:bg-basin-600"
          >
            View certificate <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Checklist */}
          <div className="mt-10 rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
            <ul className="space-y-3">
              {builtOut.map((m) => {
                const done = progress.completedMissions.includes(m.id);
                return (
                  <li key={m.id} className="flex items-center gap-3 text-sm">
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-signal-500" />
                    ) : (
                      <Lock className="h-4 w-4 shrink-0 text-ink/30 dark:text-paper/30" />
                    )}
                    <span className={cn(!done && "text-ink/50 dark:text-paper/50")}>{m.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-8 text-center">
            {!allComplete && (
              <p className="text-sm text-ink/55 dark:text-paper/55">
                Finish every mission above to unlock the exam.
              </p>
            )}
            {allComplete && !hasPassed && (
              <>
                <p className="text-sm text-ink/65 dark:text-paper/65">
                  All missions complete. You're ready for the exam.
                  {progress.examAttempts > 0 && (
                    <> Your best score so far is {progress.examBestScorePercent}%.</>
                  )}
                </p>
                <Link
                  href="/certification/exam"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper hover:bg-basin-600"
                >
                  {progress.examAttempts > 0 ? "Retake the exam" : "Start the exam"} <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
            {allComplete && hasPassed && (
              <>
                <p className="text-sm text-ink/65 dark:text-paper/65">
                  You passed with {progress.examBestScorePercent}%. Get your certificate for a
                  one-time fee of $5.
                </p>
                <Link
                  href="/certification/checkout"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper hover:bg-basin-600"
                >
                  Get your certificate <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
