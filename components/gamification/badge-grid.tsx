"use client";

import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import type { Badge } from "@/lib/gamification";
import { cn } from "@/lib/utils/cn";

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <p className="text-sm text-ink/60 dark:text-paper/60">
        Badges will appear here once missions are available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
          className={cn(
            "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition",
            badge.earned
              ? "border-signal-500/30 bg-signal-500/5"
              : "border-basin-500/10 opacity-50"
          )}
          title={badge.earned ? `Earned: ${badge.title}` : `Locked: ${badge.title}`}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              badge.earned ? "bg-signal-500/15 text-signal-500" : "bg-ink/5 text-ink/30 dark:bg-paper/10 dark:text-paper/30"
            )}
          >
            {badge.earned ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wide text-ink/40 dark:text-paper/40">
              Mission {String(badge.missionNumber).padStart(2, "0")}
            </p>
            <p className="mt-0.5 text-xs font-medium leading-tight">{badge.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
