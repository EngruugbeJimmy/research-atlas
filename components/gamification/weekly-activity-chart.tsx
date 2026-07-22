"use client";

import { motion } from "framer-motion";

interface WeeklyActivityChartProps {
  days: { date: string; label: string; minutes: number }[];
}

export function WeeklyActivityChart({ days }: WeeklyActivityChartProps) {
  const max = Math.max(...days.map((d) => d.minutes), 10);

  return (
    <div className="flex h-32 items-end justify-between gap-2">
      {days.map((d, i) => (
        <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-24 w-full items-end justify-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, (d.minutes / max) * 100)}%` }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
              className={`w-full max-w-[28px] rounded-t-md ${
                d.minutes > 0 ? "bg-signal-500" : "bg-basin-500/10"
              }`}
              title={`${d.minutes} min`}
            />
          </div>
          <span className="font-mono text-[10px] uppercase text-ink/45 dark:text-paper/45">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
