"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Compass, Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useProgress } from "@/hooks/use-progress";
import { missions } from "@/lib/missions/data";

const navLinks = [
  { href: "/missions", label: "Missions" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/simulations", label: "Simulations" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const { progress, completionPercent, hydrated } = useProgress();

  const builtOut = missions.filter((m) => m.builtOut);
  const nextMission = builtOut.find((m) => !progress.completedMissions.includes(m.id));
  const hasStartedAnything =
    progress.completedMissions.length > 0 ||
    Object.values(progress.completedLessons).some((l) => l.length > 0);
  const ctaLabel = !hydrated
    ? "Start Your First Mission"
    : !nextMission
      ? "Review Your Missions"
      : hasStartedAnything
        ? `Continue Mission ${nextMission.number}`
        : "Start Your First Mission";
  const ctaHref = !hydrated
    ? "/missions/00-becoming-a-researcher"
    : !nextMission
      ? "/missions"
      : `/missions/${nextMission.id}`;

  useEffect(() => {
    const stored = window.localStorage.getItem("research-atlas:theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;
    setDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("research-atlas:theme", next ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-basin-500/15 bg-paper/90 backdrop-blur-md dark:bg-ink/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium">
          <Compass className="h-5 w-5 text-basin-500" strokeWidth={1.75} />
          <span>Research Atlas</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink/70 transition hover:text-basin-500 dark:text-paper/70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {hydrated && (
            <div className="flex items-center gap-2 font-mono text-xs text-ink/60 dark:text-paper/60">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-basin-500/15">
                <div
                  className="h-full bg-signal-500 transition-all"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span>{completionPercent}%</span>
            </div>
          )}
          <button
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full p-2 text-ink/70 transition hover:bg-basin-500/10 hover:text-basin-500 dark:text-paper/70"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            href={ctaHref}
            className="rounded-full bg-basin-500 px-4 py-2 text-sm font-medium text-paper transition hover:bg-basin-600"
          >
            {ctaLabel}
          </Link>
        </div>

        <button
          className="p-2 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-basin-500/15 px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-1 text-sm"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
