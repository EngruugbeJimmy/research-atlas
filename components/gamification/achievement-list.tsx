"use client";

import { motion } from "framer-motion";
import { Flame, Target, Award, Brain, Compass, Trophy, Clock, type LucideIcon } from "lucide-react";
import type { Achievement } from "@/lib/gamification";
import { cn } from "@/lib/utils/cn";

const ICONS: Record<Achievement["icon"], LucideIcon> = {
  flame: Flame,
  target: Target,
  award: Award,
  brain: Brain,
  compass: Compass,
  trophy: Trophy,
  clock: Clock,
};

interface AchievementListProps {
  achievements: Achievement[];
  onlyEarned?: boolean;
}

export function AchievementList({ achievements, onlyEarned }: AchievementListProps) {
  const list = onlyEarned ? achievements.filter((a) => a.earned) : achievements;

  if (list.length === 0) {
    return (
      <p className="text-sm text-ink/60 dark:text-paper/60">
        No achievements unlocked yet — complete your first lesson to get started.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {list.map((a, i) => {
        const Icon = ICONS[a.icon];
        return (
          <motion.li
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3",
              a.earned
                ? "border-signal-500/25 bg-signal-500/5"
                : "border-basin-500/10 opacity-50"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                a.earned
                  ? "bg-signal-500/15 text-signal-500"
                  : "bg-ink/5 text-ink/30 dark:bg-paper/10 dark:text-paper/30"
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-medium">{a.title}</p>
              <p className="mt-0.5 text-xs text-ink/60 dark:text-paper/60">{a.description}</p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
