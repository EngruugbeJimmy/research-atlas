"use client";

import { motion } from "framer-motion";
import type { Level } from "@/lib/gamification";

interface XpBarProps {
  xp: number;
  level: Level;
}

export function XpBar({ xp, level }: XpBarProps) {
  const percent = level.xpForNextLevel > 0 ? (level.xpIntoLevel / level.xpForNextLevel) * 100 : 100;

  return (
    <div className="rounded-2xl border border-basin-500/15 bg-paper p-5 dark:bg-ink">
      <div className="flex items-center justify-between">
        <div>
          <p className="type-eyebrow">Level {level.level}</p>
          <h3 className="mt-1 font-display text-xl">{level.title}</h3>
        </div>
        <p className="font-mono text-sm text-ink/60 dark:text-paper/60">{xp.toLocaleString()} XP</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-basin-500/15">
        <motion.div
          className="h-full rounded-full bg-signal-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, percent)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 font-mono text-xs text-ink/50 dark:text-paper/50">
        {level.xpIntoLevel.toLocaleString()} / {level.xpForNextLevel.toLocaleString()} XP to Level{" "}
        {level.level + 1}
      </p>
    </div>
  );
}
