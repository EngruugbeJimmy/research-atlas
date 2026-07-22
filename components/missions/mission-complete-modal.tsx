"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ArrowRight, LayoutDashboard, RotateCcw, X } from "lucide-react";
import { fireMissionCompleteConfetti } from "@/lib/utils/confetti";
import type { MissionSummary } from "@/lib/missions/data";

interface MissionCompleteModalProps {
  open: boolean;
  onClose: () => void;
  mission: MissionSummary;
  nextMission: MissionSummary | null;
  xpEarned: number;
  completionPercent: number;
  missionsRemaining: number;
}

export function MissionCompleteModal({
  open,
  onClose,
  mission,
  nextMission,
  xpEarned,
  completionPercent,
  missionsRemaining,
}: MissionCompleteModalProps) {
  useEffect(() => {
    if (open) fireMissionCompleteConfetti();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mission-complete-title"
        >
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-basin-500/20 bg-paper p-8 text-center shadow-2xl dark:bg-ink"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-ink/40 transition hover:bg-basin-500/10 hover:text-ink dark:text-paper/40"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-signal-500/15 text-signal-500"
            >
              <Award className="h-10 w-10" />
            </motion.div>

            <p className="type-eyebrow mt-6">Mission Complete</p>
            <h2 id="mission-complete-title" className="mt-2 font-display text-2xl md:text-3xl">
              {mission.title}
            </h2>
            <p className="mt-3 text-sm text-ink/65 dark:text-paper/65">{mission.summary}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {mission.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-basin-500/25 px-3 py-1 font-mono text-xs text-basin-500"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-basin-500/15 p-4">
              <div>
                <p className="font-display text-xl text-signal-500">+{xpEarned}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
                  XP earned
                </p>
              </div>
              <div>
                <p className="font-display text-xl">{completionPercent}%</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
                  Overall progress
                </p>
              </div>
              <div>
                <p className="font-display text-xl">{missionsRemaining}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
                  Missions left
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {nextMission && (
                <Link
                  href={`/missions/${nextMission.id}`}
                  className="flex items-center justify-center gap-2 rounded-full bg-basin-500 px-5 py-3 font-medium text-paper transition hover:bg-basin-600"
                >
                  Continue to Mission {nextMission.number} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <div className="flex gap-3">
                <Link
                  href="/dashboard"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-basin-500/25 px-5 py-2.5 text-sm font-medium text-basin-500 transition hover:bg-basin-500/10"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link
                  href={`/missions/${mission.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-basin-500/25 px-5 py-2.5 text-sm font-medium text-basin-500 transition hover:bg-basin-500/10"
                >
                  <RotateCcw className="h-4 w-4" /> Review mission
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
