"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Award, GraduationCap, CheckCircle2, Clock, Target, Compass } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { missions } from "@/lib/missions/data";
import { StatCard } from "@/components/gamification/stat-card";
import { BadgeGrid } from "@/components/gamification/badge-grid";
import { cn } from "@/lib/utils/cn";

export function ProfileContent() {
  const { hydrated, progress, completionPercent, badges, updateProfile } = useProgress();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [institution, setInstitution] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setName(progress.learnerProfile.name);
    setEmail(progress.learnerProfile.email);
    setCountry(progress.learnerProfile.country);
    setInstitution(progress.learnerProfile.institution);
    // Only sync from storage once, on hydration — after that, the fields
    // are controlled by the user typing, not by every progress update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const builtOut = missions.filter((m) => m.builtOut);
  const totalQuizzes = Object.values(progress.quizScores);
  const totalCorrect = totalQuizzes.reduce((s, q) => s + q.correct, 0);
  const totalPossible = totalQuizzes.reduce((s, q) => s + q.total, 0);
  const quizAccuracy = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : null;
  const hoursStudied = progress.totalTimeSpentMs / 1000 / 60 / 60;

  function handleSave() {
    updateProfile({ name, email, country, institution });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <div className="h-40 animate-pulse rounded-2xl bg-basin-500/5" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-8">
      <p className="type-eyebrow">Researcher profile</p>
      <h1 className="mt-2 text-3xl font-medium md:text-4xl">
        {progress.learnerProfile.name || "Your Profile"}
      </h1>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {/* Personal information */}
        <div className="md:col-span-1">
          <div className="rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-basin-500" />
              <h2 className="font-display text-lg">Personal Information</h2>
            </div>
            <div className="mt-5 space-y-4">
              <Field label="Full name" value={name} onChange={setName} placeholder="Ada Lovelace" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="ada@example.com" type="email" />
              <Field label="Country" value={country} onChange={setCountry} placeholder="Nigeria" />
              <Field
                label="Institution (optional)"
                value={institution}
                onChange={setInstitution}
                placeholder="University of Lagos"
              />
              <button
                onClick={handleSave}
                className="w-full rounded-full bg-basin-500 px-4 py-2 text-sm font-medium text-paper transition hover:bg-basin-600"
              >
                {saved ? "Saved" : "Save profile"}
              </button>
              <p className="text-xs text-ink/50 dark:text-paper/50">
                Stored only on this device. This is also the name used on your certificate.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-basin-500" />
              <h2 className="font-display text-lg">Certificate</h2>
            </div>
            {progress.certificate.earned ? (
              <div className="mt-4">
                <p className="text-sm text-ink/70 dark:text-paper/70">
                  Earned {progress.certificate.issuedISODate ? new Date(progress.certificate.issuedISODate).toLocaleDateString() : ""}
                </p>
                <Link
                  href="/certification/certificate"
                  className="mt-3 inline-block text-sm font-medium text-basin-500 hover:underline"
                >
                  View certificate →
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-ink/60 dark:text-paper/60">
                  Complete every mission and pass the final exam to unlock your certificate.
                </p>
                <Link
                  href="/certification"
                  className="mt-3 inline-block text-sm font-medium text-basin-500 hover:underline"
                >
                  Go to certification →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Progress + stats */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={CheckCircle2} label="Missions Complete" value={`${progress.completedMissions.length}/${builtOut.length}`} />
            <StatCard icon={Clock} label="Hours Studied" value={hoursStudied.toFixed(1)} />
            <StatCard icon={Target} label="Quiz Accuracy" value={quizAccuracy !== null ? `${quizAccuracy}%` : "—"} />
            <StatCard icon={Compass} label="Overall Progress" value={`${completionPercent}%`} accent />
          </div>

          <div className="mt-6 rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
            <h2 className="font-display text-lg">Mission Progress</h2>
            <ul className="mt-4 space-y-2">
              {builtOut.map((m) => {
                const done = progress.completedMissions.includes(m.id);
                const lessonsDone = progress.completedLessons[m.id]?.length ?? 0;
                return (
                  <li key={m.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-mono",
                        done
                          ? "bg-signal-500/20 text-signal-500"
                          : "bg-basin-500/10 text-basin-500"
                      )}
                    >
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : m.number}
                    </span>
                    <span className="flex-1 text-sm">{m.title}</span>
                    <span className="font-mono text-xs text-ink/45 dark:text-paper/45">
                      {lessonsDone}/{m.lessonCount}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-basin-500" />
              <h2 className="font-display text-lg">Badges</h2>
            </div>
            <div className="mt-5">
              <BadgeGrid badges={badges} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-basin-500/25 p-6 text-center">
            <p className="text-sm text-ink/55 dark:text-paper/55">
              Public research portfolios, sharing your Bluewater Basin analyses with other learners, are coming in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-basin-500/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-basin-500"
      />
    </label>
  );
}
