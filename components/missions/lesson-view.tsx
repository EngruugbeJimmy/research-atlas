"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Equation } from "@/components/ui/equation";
import { CodeBlock } from "@/components/ui/code-block";
import { QuizBlock } from "@/components/ui/quiz-block";
import { ContourField } from "@/components/simulations/contour-field";
import { simulationRegistry } from "@/components/simulations/registry";
import { MissionCompleteModal } from "@/components/missions/mission-complete-modal";
import { useProgress } from "@/hooks/use-progress";
import { useTimeTracking } from "@/hooks/use-time-tracking";
import { missions } from "@/lib/missions/data";
import { XP_PER_LESSON, XP_PER_MISSION_BONUS } from "@/lib/gamification";
import type { Lesson } from "@/lib/missions/types";

export function LessonView({
  lesson,
  missionId,
  missionTitle,
  lessonIndex,
  lessonCount,
  nextHref,
  previousHref,
}: {
  lesson: Lesson;
  missionId: string;
  missionTitle: string;
  lessonIndex: number;
  lessonCount: number;
  nextHref: string | null;
  previousHref: string | null;
}) {
  const { markLessonComplete, progress, completionPercent } = useProgress();
  useTimeTracking(missionId);
  const [teachBackText, setTeachBackText] = useState("");
  const [teachBackSaved, setTeachBackSaved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const complete = progress.completedLessons[missionId]?.includes(lesson.id);
  const SimComponent = lesson.simulation ? simulationRegistry[lesson.simulation.component] : null;

  const mission = missions.find((m) => m.id === missionId) ?? null;
  const isLastLessonOfMission = lessonIndex === lessonCount;

  function handleComplete() {
    const willCompleteMission = isLastLessonOfMission && !complete;
    markLessonComplete(missionId, lesson.id);
    if (willCompleteMission) {
      setShowCelebration(true);
    }
  }

  const builtOutMissions = missions.filter((m) => m.builtOut);
  const nextMission = mission
    ? builtOutMissions.find((m) => m.number === mission.number + 1) ?? null
    : null;
  const missionsRemaining = mission
    ? builtOutMissions.filter((m) => !progress.completedMissions.includes(m.id) && m.id !== mission.id).length
    : 0;
  const xpEarned = mission ? mission.lessonCount * XP_PER_LESSON + XP_PER_MISSION_BONUS : 0;

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 md:px-8">
      <p className="type-eyebrow">
        {missionTitle} · Lesson {lessonIndex} of {lessonCount}
      </p>
      <h1 className="mt-2 text-3xl font-medium md:text-4xl">{lesson.title}</h1>
      <p className="mt-2 font-mono text-xs text-ink/45 dark:text-paper/45">
        ~{lesson.durationMinutes} min
      </p>

      {/* 1. The Concept */}
      <Section number="📘" title="The Concept">
        {lesson.story.map((p, i) => (
          <p key={i} className="leading-relaxed text-ink/85 dark:text-paper/85">
            {p}
          </p>
        ))}
        {lesson.visual && (
          <div className="mt-2 overflow-hidden rounded-xl border border-basin-500/15">
            <ContourField
              className="h-40 w-full text-basin-500"
              lines={10}
              height={200}
            />
            <p className="border-t border-basin-500/15 bg-basin-50/40 px-4 py-2 text-xs text-ink/60 dark:bg-basin-700/10 dark:text-paper/60">
              {lesson.visual.caption}
            </p>
          </div>
        )}
        {lesson.plainEnglish.map((p, i) => (
          <p key={i} className="leading-relaxed text-ink/85 dark:text-paper/85">
            {p}
          </p>
        ))}
      </Section>

      {/* 2. The Analogy */}
      {lesson.analogy && lesson.analogy.length > 0 && (
        <Section number="💡" title="The Analogy">
          {lesson.analogy.map((p, i) => (
            <p key={i} className="leading-relaxed text-ink/85 dark:text-paper/85">
              {p}
            </p>
          ))}
        </Section>
      )}

      {/* Mathematics (optional deep dive, kept inline for researchers) */}
      {lesson.math && (
        <Section number="📐" title="The Math (optional)">
          <p className="text-ink/80 dark:text-paper/80">{lesson.math.intro}</p>
          <div className="space-y-4">
            {lesson.math.equations.map((eq) => (
              <Equation key={eq.label} {...eq} />
            ))}
          </div>
        </Section>
      )}

      {/* Interactive Simulation */}
      {SimComponent && (
        <Section number="🖥️" title="Try It">
          <p className="text-sm text-ink/60 dark:text-paper/60">{lesson.simulation!.caption}</p>
          <SimComponent />
        </Section>
      )}

      {/* Code (optional, for researchers who work in Python/R) */}
      {lesson.code && lesson.code.length > 0 && (
        <Section number="👩‍💻" title="Code (optional)">
          <div className="space-y-6">
            {lesson.code.map((c) => (
              <CodeBlock key={c.filename} {...c} />
            ))}
          </div>
        </Section>
      )}

      {/* Research Connection */}
      <Section number="🔬" title="Why Real Researchers Care">
        {lesson.researchConnection.map((p, i) => (
          <p key={i} className="leading-relaxed text-ink/85 dark:text-paper/85">
            {p}
          </p>
        ))}
      </Section>

      {/* Mini Quiz */}
      <Section number="🧠" title="Quick Check">
        <QuizBlock questions={lesson.quiz} />
      </Section>

      {/* 3. Your Goal */}
      <Section number="🛠️" title="Your Goal">
        <div className="rounded-xl border border-silt-500/30 bg-silt-500/5 p-5">
          <p className="text-ink/85 dark:text-paper/85">{lesson.challenge.prompt}</p>
          <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">Hint: {lesson.challenge.hint}</p>
        </div>
      </Section>

      {/* Teach Back */}
      <Section number="✍️" title="Teach It Back">
        <p className="text-ink/85 dark:text-paper/85">{lesson.teachBack.prompt}</p>
        <textarea
          value={teachBackText}
          onChange={(e) => {
            setTeachBackText(e.target.value);
            setTeachBackSaved(false);
          }}
          rows={4}
          placeholder="Write your explanation here. It's saved only on this device."
          className="mt-3 w-full rounded-lg border border-basin-500/20 bg-transparent p-3 text-sm outline-none focus:border-basin-500"
        />
        <button
          onClick={() => setTeachBackSaved(true)}
          className="mt-2 rounded-full border border-basin-500/30 px-4 py-1.5 text-sm text-basin-500 hover:bg-basin-500/10"
        >
          {teachBackSaved ? "Saved to this device" : "Save my explanation"}
        </button>
      </Section>

      {/* 4. Next Lesson Trigger */}

      {/* Completion + navigation */}
      <div className="mt-14 flex items-center justify-between border-t border-basin-500/15 pt-8">
        <div>
          {previousHref ? (
            <Link href={previousHref} className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-basin-500 dark:text-paper/60">
              <ArrowLeft className="h-4 w-4" /> Previous lesson
            </Link>
          ) : (
            <span />
          )}
        </div>
        <div className="flex items-center gap-3">
          {!complete && (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 rounded-full bg-signal-500 px-5 py-2 text-sm font-medium text-ink"
            >
              <CheckCircle2 className="h-4 w-4" /> Run test → mark complete
            </button>
          )}
          {complete && nextHref && (
            <Link
              href={nextHref}
              className="flex items-center gap-2 rounded-full bg-basin-500 px-5 py-2 text-sm font-medium text-paper hover:bg-basin-600"
            >
              Next lesson <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {mission && (
        <MissionCompleteModal
          open={showCelebration}
          onClose={() => setShowCelebration(false)}
          mission={mission}
          nextMission={nextMission}
          xpEarned={xpEarned}
          completionPercent={completionPercent}
          missionsRemaining={missionsRemaining}
        />
      )}
    </article>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-lg" aria-hidden="true">{number}</span>
        <h2 className="font-display text-xl">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
