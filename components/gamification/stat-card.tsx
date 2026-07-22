import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: boolean;
}

export function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-basin-500/15 bg-paper p-5 dark:bg-ink">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${
          accent ? "bg-signal-500/15 text-signal-500" : "bg-basin-500/10 text-basin-500"
        }`}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-3 font-display text-2xl">{value}</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
        {label}
      </p>
    </div>
  );
}
