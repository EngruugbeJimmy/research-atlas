"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { missions } from "@/lib/missions/data";
import { useProgress } from "@/hooks/use-progress";

/**
 * Decides what the primary homepage call-to-action should say and link to:
 * - Nobody has started yet: "Start Your First Mission" -> Mission 00
 * - Mid-way through an in-progress mission: "Continue Mission N" -> that mission
 * - Just finished a mission with more remaining: "Continue Mission N+1" -> next mission
 * - Every built-out mission is complete: "Review Your Missions" -> the roadmap
 */
export function HeroCta() {
  const { progress, hydrated } = useProgress();

  const builtOut = missions.filter((m) => m.builtOut);
  const nextMission =
    builtOut.find((m) => !progress.completedMissions.includes(m.id)) ?? null;

  if (!hydrated) {
    return (
      <Link
        href="/missions/00-becoming-a-researcher"
        className="flex items-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper transition hover:bg-basin-600"
      >
        Start Your First Mission <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  if (!nextMission) {
    return (
      <Link
        href="/missions"
        className="flex items-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper transition hover:bg-basin-600"
      >
        Review Your Missions <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  const hasStartedAnything = progress.completedMissions.length > 0 ||
    Object.values(progress.completedLessons).some((l) => l.length > 0);

  const label = hasStartedAnything
    ? `Continue Mission ${nextMission.number}`
    : "Start Your First Mission";

  return (
    <Link
      href={`/missions/${nextMission.id}`}
      className="flex items-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper transition hover:bg-basin-600"
    >
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
