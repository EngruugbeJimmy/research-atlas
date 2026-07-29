"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLabSession } from "@/hooks/use-lab-session";
import { ApolloExam } from "@/components/lab/apollo-exam";
import { TopicIntake } from "@/components/lab/topic-intake";
import type { Faculty } from "@/lib/lab/types";

export default function LabEntryPage() {
  const router = useRouter();
  const { hydrated, activeSession, startNewSession, assignFaculty } = useLabSession();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (hydrated && activeSession) setSessionId(activeSession.id);
  }, [hydrated, activeSession]);

  if (!hydrated) return null;

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="font-display text-4xl">Welcome to Research Atlas Lab</h1>
        <p className="mt-3 text-lg text-ink/70 dark:text-paper/70">
          Real research supervision, from a rough idea to a draft ready for human review. Prof Apollo
          starts every recruit with a short readiness exam.
        </p>
        <button
          onClick={() => setSessionId(startNewSession())}
          className="mt-8 rounded-xl bg-basin-500 px-8 py-4 text-lg font-semibold text-paper hover:bg-basin-600"
        >
          Start the readiness exam
        </button>
      </div>
    );
  }

  const session = activeSession?.id === sessionId ? activeSession : null;
  if (!session) return null;

  if (session.status === "exam_pending") {
    return <ApolloExam sessionId={sessionId} onPassed={() => {}} />;
  }

  if (session.status === "routed_to_missions") {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="font-display text-3xl">Build up a few skills first</h1>
        <p className="mt-3 text-lg text-ink/70 dark:text-paper/70">
          Based on your exam, here's exactly where to focus before retrying:
        </p>
        <div className="mt-6 space-y-2 rounded-xl border border-basin-500/20 bg-basin-500/5 p-5 text-left">
          {session.examResult?.weakAreas.map((tag) => (
            <p key={tag} className="text-sm text-ink/70 dark:text-paper/70">
              • {tag.replace(/_/g, " ")}
            </p>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-3">
 <a         
            href="/missions"
            className="rounded-xl bg-basin-500 px-6 py-3 font-semibold text-paper hover:bg-basin-600"
          >
            Go to Missions
          </a>
          <button
            onClick={() => setSessionId(startNewSession())}
            className="rounded-xl border-2 border-basin-500/30 px-6 py-3 font-semibold text-basin-500 hover:bg-basin-500/10"
          >
            Retry exam
          </button>
        </div>
      </div>
    );
  }

  if (session.status === "in_progress" && !session.faculty) {
    return (
      <TopicIntake
        onSubmit={(topic, faculty: Faculty) => {
          assignFaculty(sessionId, faculty, topic);
          router.push(`/lab/${sessionId}`);
        }}
      />
    );
  }

  router.push(`/lab/${sessionId}`);
  return null;
}