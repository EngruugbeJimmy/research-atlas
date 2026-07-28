// components/lab/apollo-exam.tsx
//
// The Lab's front door. A recruit answers the diagnostic exam
// (lib/lab/professors/apollo.ts), gets scored client-side (no API call
// needed for scoring — it's a fixed answer key), and is routed either
// to Missions (fail) or into a conversation with Prof Apollo about
// their topic and faculty handoff (pass).

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLabSession } from "@/hooks/use-lab-session";
import {
  APOLLO_EXAM_QUESTIONS,
  scoreApolloExam,
  suggestFacultyFromTopic,
} from "@/lib/lab/professors/apollo";
import { sendLabMessage, toApiHistory } from "@/lib/lab/chat";
import type { Faculty, StageMessage } from "@/lib/lab/types";

type ScreenState = "exam" | "exam_result_fail" | "topic_intake" | "handoff_confirm";

export function ApolloExam() {
  const { activeSession, startNewSession, recordExamResult, assignFaculty, updateSession } =
    useLabSession();

  const [screen, setScreen] = useState<ScreenState>("exam");
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(APOLLO_EXAM_QUESTIONS.length).fill(null)
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [topic, setTopic] = useState("");
  const [suggestedFaculty, setSuggestedFaculty] = useState<Faculty | null>(null);
  const [apolloReply, setApolloReply] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function selectAnswer(index: number) {
    const next = [...answers];
    next[currentQ] = index;
    setAnswers(next);
  }

  function nextQuestion() {
    if (currentQ < APOLLO_EXAM_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      return;
    }
    submitExam();
  }

  function submitExam() {
    const sessionId = activeSession?.id ?? startNewSession();
    const outcome = scoreApolloExam(answers);

    recordExamResult(sessionId, {
      score: outcome.score,
      passed: outcome.passed,
      weakAreas: outcome.weakAreas.map((w) => w.tag),
      takenAt: new Date().toISOString(),
    });

    if (!outcome.passed) {
      setScreen("exam_result_fail");
    } else {
      setScreen("topic_intake");
    }
  }

  async function handleTopicSubmit() {
    if (!topic.trim() || !activeSession) return;
    setPending(true);

    const suggestion = suggestFacultyFromTopic(topic) as Faculty | null;
    setSuggestedFaculty(suggestion);

    const result = await sendLabMessage("apollo", `My research interest is: ${topic}`, []);
    setApolloReply(result.reply);
    setPending(false);
    setScreen("handoff_confirm");
  }

  function confirmHandoff(faculty: Faculty) {
    if (!activeSession) return;
    assignFaculty(activeSession.id, faculty, topic);
    updateSession(activeSession.id, { status: "in_progress" });
    // Navigation to the actual supervision workspace happens via the
    // parent page once faculty is set — see app/lab/[sessionId]/page.tsx
  }

  const outcome = screen !== "exam" ? scoreApolloExam(answers) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <AnimatePresence mode="wait">
        {screen === "exam" && (
          <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="mb-2 text-sm font-medium text-basin-500">
              Prof Apollo · Diagnostic Exam · Question {currentQ + 1} of {APOLLO_EXAM_QUESTIONS.length}
            </p>
            <div className="mb-6 h-1.5 w-full rounded-full bg-basin-500/10">
              <div
                className="h-full rounded-full bg-basin-500 transition-all"
                style={{ width: `${((currentQ + 1) / APOLLO_EXAM_QUESTIONS.length) * 100}%` }}
              />
            </div>

            <h1 className="mb-6 text-2xl font-medium leading-snug">
              {APOLLO_EXAM_QUESTIONS[currentQ]!.question}
            </h1>

            <div className="space-y-3">
              {APOLLO_EXAM_QUESTIONS[currentQ]!.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  className={cn(
                    "w-full rounded-xl border-2 px-5 py-3.5 text-left text-base transition",
                    answers[currentQ] === i
                      ? "border-basin-500 bg-basin-500/10"
                      : "border-basin-500/15 hover:border-basin-500/40"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={nextQuestion}
              disabled={answers[currentQ] === null}
              className="mt-8 flex items-center gap-2 rounded-xl bg-basin-500 px-6 py-3 font-medium text-paper transition hover:bg-basin-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {currentQ === APOLLO_EXAM_QUESTIONS.length - 1 ? "Submit exam" : "Next question"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {screen === "exam_result_fail" && outcome && (
          <motion.div key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 text-amber-600">
              <XCircle className="h-8 w-8" />
              <h1 className="text-2xl font-medium">Not quite ready for the Lab yet</h1>
            </div>
            <p className="mt-4 text-ink/70 dark:text-paper/70">
              You scored {outcome.score}%, and the Lab needs 70% to make sure supervision starts on
              solid ground. That's not a rejection — here's exactly what to strengthen first:
            </p>
            <ul className="mt-4 space-y-2">
              {[...new Set(outcome.weakAreas.map((w) => w.missionHint))].map((hint) => (
                <li key={hint} className="rounded-lg bg-basin-500/5 px-4 py-3 text-sm">
                  {hint}
                </li>
              ))}
            </ul>
            <Link
              href="/missions"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-basin-500 px-6 py-3 font-medium text-paper hover:bg-basin-600"
            >
              Go strengthen these in Missions <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        {screen === "topic_intake" && (
          <motion.div key="topic" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 text-signal-600">
              <CheckCircle2 className="h-8 w-8" />
              <h1 className="text-2xl font-medium">You're ready. Welcome to the Lab.</h1>
            </div>
            <p className="mt-4 text-ink/70 dark:text-paper/70">
              Prof Apollo just needs to know what you're interested in researching, so he can
              connect you with the right faculty supervisor.
            </p>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              placeholder="What real-world problem or community are you interested in researching?"
              className="mt-5 w-full rounded-xl border-2 border-basin-500/20 bg-transparent p-4 text-base outline-none focus:border-basin-500"
            />
            <button
              onClick={handleTopicSubmit}
              disabled={!topic.trim() || pending}
              className="mt-5 flex items-center gap-2 rounded-xl bg-basin-500 px-6 py-3 font-medium text-paper hover:bg-basin-600 disabled:opacity-40"
            >
              {pending ? "Thinking..." : "Continue"} <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {screen === "handoff_confirm" && (
          <motion.div key="handoff" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-medium">Prof Apollo says:</h1>
            <p className="mt-4 whitespace-pre-line text-ink/80 dark:text-paper/80">{apolloReply}</p>

            <p className="mt-6 text-sm font-medium text-ink/60 dark:text-paper/60">
              Confirm your supervising faculty:
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  ["environmental", "Prof Willey — Environmental Science"],
                  ["social", "Prof Adam Smith — Social Science"],
                  ["physical", "Prof Newton — Physical Science & Engineering"],
                  ["life", "Prof Darwin — Life Sciences"],
                ] as [Faculty, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => confirmHandoff(key)}
                  className={cn(
                    "rounded-xl border-2 px-4 py-3 text-left text-sm transition",
                    suggestedFaculty === key
                      ? "border-basin-500 bg-basin-500/10 font-medium"
                      : "border-basin-500/15 hover:border-basin-500/40"
                  )}
                >
                  {label}
                  {suggestedFaculty === key && (
                    <span className="ml-2 text-xs text-basin-500">(suggested)</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}