"use client";

import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";
import { missions } from "@/lib/missions/data";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils/cn";

export function MissionRoadmap() {
  const { progress, isMissionUnlocked, hydrated } = useProgress();

  return (
    <ol className="relative border-l border-basin-500/20 pl-6">
      {missions.map((mission) => {
        const unlocked = !hydrated || isMissionUnlocked(mission.id);
        const complete = progress.completedMissions.includes(mission.id);

        const content = (
          <div
            className={cn(
              "group relative -ml-[calc(1.5rem+1px)] flex gap-4 rounded-xl px-4 py-4 transition",
              unlocked ? "hover:bg-basin-500/5" : "opacity-50"
            )}
          >
            <span
              className={cn(
                "absolute -left-[1.95rem] top-6 flex h-3 w-3 items-center justify-center rounded-full border-2",
                complete
                  ? "border-signal-500 bg-signal-500"
                  : unlocked
                    ? "border-basin-500 bg-paper dark:bg-ink"
                    : "border-ink/20 bg-paper dark:bg-ink"
              )}
            />
            <div className="w-14 shrink-0 font-mono text-sm text-basin-500">
              {String(mission.number).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-display text-lg",
                    unlocked && "group-hover:text-basin-500"
                  )}
                >
                  {mission.title}
                </h3>
                {complete && <CheckCircle2 className="h-4 w-4 text-signal-500" />}
                {!unlocked && <Lock className="h-3.5 w-3.5 text-ink/40" />}
                {!mission.builtOut && (
                  <span className="rounded-full bg-silt-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-silt-500">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
                {mission.summary}
              </p>
              <p className="mt-2 font-mono text-xs text-ink/40 dark:text-paper/40">
                {mission.field} · {mission.station} · ~{mission.estimatedMinutes} min
              </p>
            </div>
          </div>
        );

        return (
          <li key={mission.id}>
            {unlocked && mission.builtOut ? (
              <Link href={`/missions/${mission.id}`}>{content}</Link>
            ) : (
              <div aria-disabled="true">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
