"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Flame,
  BookOpen,
  CheckCircle2,
  Award,
  GraduationCap,
} from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { missions } from "@/lib/missions/data";
import { allMissionsComplete } from "@/lib/gamification";
import { ProgressRing } from "@/components/gamification/progress-ring";
import { XpBar } from "@/components/gamification/xp-bar";
import { StatCard } from "@/components/gamification/stat-card";
import { BadgeGrid } from "@/components/gamification/badge-grid";
import { AchievementList } from "@/components/gamification/achievement-list";
import { WeeklyActivityChart } from "@/components/gamification/weekly-activity-chart";

export function DashboardContent() {
  const {
    hydrated,
    progress,
    completionPercent,
    xp,
    level,
    badges,
    achievements,
    getWeeklyActivity,
  } = useProgress();

  const builtOut = missions.filter((m) => m.builtOut);
  const currentMission = builtOut.find((m) => !progress.completedMissions.includes(m.id));
  const totalLessons = builtOut.reduce((sum, m) => sum + m.lessonCount, 0);
  const lessonsCompleted = Object.values(progress.completedLessons).reduce(
    (sum, l) => sum + l.length,
    0
  );
  const totalQuizzesTaken = Object.keys(progress.quizScores).length;
  const hoursStudied = progress.totalTimeSpentMs / 1000 / 60 / 60;
  const weeklyActivity = hydrated ? getWeeklyActivity() : [];
  const finishedEverything = hydrated && allMissionsComplete(progress);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="h-40 animate-pulse rounded-2xl bg-basin-500/5" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <p className="type-eyebrow">Your field station</p>
      <h1 className="mt-2 text-3xl font-medium md:text-4xl">Dashboard</h1>

      {/* Continue learning banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 flex flex-col items-start gap-6 rounded-2xl border border-basin-500/20 bg-basin-50/50 p-6 dark:bg-basin-700/10 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <p className="type-eyebrow">
            {currentMission ? `Mission ${currentMission.number}` : "All missions complete"}
          </p>
          <h2 className="mt-1 font-display text-2xl">
            {currentMission ? currentMission.title : "Ready for certification"}
          </h2>
          <p className="mt-1 text-sm text-ink/65 dark:text-paper/65">
            {currentMission
              ? currentMission.summary
              : "You've completed every mission in Research Atlas. Take the final exam to earn your certificate."}
          </p>
        </div>
        <Link
          href={currentMission ? `/missions/${currentMission.id}` : "/certification"}
          className="flex shrink-0 items-center gap-2 rounded-full bg-basin-500 px-5 py-2.5 font-medium text-paper transition hover:bg-basin-600"
        >
          {currentMission ? "Continue learning" : "Take the exam"} <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {finishedEverything && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-signal-500/30 bg-signal-500/10 px-4 py-3 text-sm text-ink dark:text-paper">
          <GraduationCap className="h-4 w-4 text-signal-500" />
          Every mission is complete — the Final Certification Exam is unlocked.
          <Link href="/certification" className="ml-auto font-medium text-basin-500 hover:underline">
            Go to exam
          </Link>
        </div>
      )}

      {/* Top row: progress ring + XP + streak */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="flex items-center justify-center rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
          <ProgressRing percent={completionPercent} sublabel="Missions complete" />
        </div>
        <div className="md:col-span-2">
          <XpBar xp={xp} level={level} />
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-basin-500/15 bg-paper p-5 dark:bg-ink">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-basin-500/10 text-basin-500">
              <Flame className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-display text-xl">{progress.streakDays} day{progress.streakDays === 1 ? "" : "s"}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
                Current learning streak
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={BookOpen} label="Lessons Completed" value={`${lessonsCompleted}/${totalLessons}`} />
        <StatCard icon={CheckCircle2} label="Missions Complete" value={`${progress.completedMissions.length}/${builtOut.length}`} />
        <StatCard icon={Clock} label="Hours Studied" value={hoursStudied.toFixed(1)} />
        <StatCard icon={Award} label="Quick Checks Taken" value={totalQuizzesTaken} accent />
      </div>

      {/* Weekly activity */}
      <div className="mt-10 rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
        <h2 className="font-display text-xl">Weekly activity</h2>
        <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Minutes spent learning, last 7 days.</p>
        <div className="mt-6">
          <WeeklyActivityChart days={weeklyActivity} />
        </div>
      </div>

      {/* Badges */}
      <div className="mt-10 rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Badges</h2>
          <Link href="/profile" className="text-sm font-medium text-basin-500 hover:underline">
            View profile
          </Link>
        </div>
        <div className="mt-6">
          <BadgeGrid badges={badges} />
        </div>
      </div>

      {/* Recent achievements */}
      <div className="mt-10 rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
        <h2 className="font-display text-xl">Achievements</h2>
        <div className="mt-6">
          <AchievementList achievements={achievements} />
        </div>
      </div>
    </div>
  );
}
