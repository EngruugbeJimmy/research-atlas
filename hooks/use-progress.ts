"use client";

import { useCallback, useEffect, useState } from "react";
import { missions } from "@/lib/missions/data";
import { computeXP, computeLevel, computeBadges, computeAchievements } from "@/lib/gamification";

const STORAGE_KEY = "research-atlas:progress:v1";

interface QuizScore {
  correct: number;
  total: number;
}

export interface CertificateRecord {
  earned: boolean;
  issuedISODate: string | null;
  learnerName: string;
  email: string;
  country: string;
  institution: string;
}

export interface LearnerProfile {
  name: string;
  email: string;
  country: string;
  institution: string;
}

interface ProgressState {
  completedMissions: string[];
  completedLessons: Record<string, string[]>;
  streakDays: number;
  lastActiveISODate: string | null;
  // key is `${missionId}:${lessonId}`
  quizScores: Record<string, QuizScore>;
  totalTimeSpentMs: number;
  missionTimeSpentMs: Record<string, number>;
  // key is an ISO date string, YYYY-MM-DD, in the learner's local time
  dailyActivityMs: Record<string, number>;
  certificate: CertificateRecord;
  examBestScorePercent: number | null;
  examAttempts: number;
  learnerProfile: LearnerProfile;
}

const emptyProfile: LearnerProfile = {
  name: "",
  email: "",
  country: "",
  institution: "",
};

const emptyCertificate: CertificateRecord = {
  earned: false,
  issuedISODate: null,
  learnerName: "",
  email: "",
  country: "",
  institution: "",
};

const emptyState: ProgressState = {
  completedMissions: [],
  completedLessons: {},
  streakDays: 0,
  lastActiveISODate: null,
  quizScores: {},
  totalTimeSpentMs: 0,
  missionTimeSpentMs: {},
  dailyActivityMs: {},
  certificate: emptyCertificate,
  examBestScorePercent: null,
  examAttempts: 0,
  learnerProfile: emptyProfile,
};

function readState(): ProgressState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    return { ...emptyState, ...JSON.parse(raw) };
  } catch {
    return emptyState;
  }
}

function writeState(state: ProgressState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isYesterdayOrToday(lastISODate: string | null) {
  if (!lastISODate) return { continuesStreak: false, isToday: false };
  const last = new Date(lastISODate);
  const today = new Date();
  const oneDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(last.getFullYear(), last.getMonth(), last.getDate())) /
      oneDay
  );
  return { continuesStreak: diffDays === 1, isToday: diffDays === 0 };
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ProgressState) => {
    setState(next);
    writeState(next);
  }, []);

  const markLessonComplete = useCallback(
    (missionId: string, lessonId: string) => {
      const current = readState();
      const existing: string[] = current.completedLessons[missionId] ?? [];
      if (existing.includes(lessonId)) return;

      const { continuesStreak, isToday } = isYesterdayOrToday(current.lastActiveISODate);
      const nextStreak = isToday
        ? current.streakDays || 1
        : continuesStreak
          ? current.streakDays + 1
          : 1;

      const nextLessons: Record<string, string[]> = {
        ...current.completedLessons,
        [missionId]: [...existing, lessonId],
      };

      const mission = missions.find((m) => m.id === missionId);
      const completedCount = nextLessons[missionId]?.length ?? 0;
      const missionComplete = mission
        ? completedCount >= mission.lessonCount
        : false;

      const nextCompletedMissions = missionComplete
        ? Array.from(new Set([...current.completedMissions, missionId]))
        : current.completedMissions;

      persist({
        ...current,
        completedMissions: nextCompletedMissions,
        completedLessons: nextLessons,
        streakDays: nextStreak,
        lastActiveISODate: new Date().toISOString(),
      });
    },
    [persist]
  );

  const recordQuizScore = useCallback(
    (missionId: string, lessonId: string, correct: number, total: number) => {
      const current = readState();
      const key = `${missionId}:${lessonId}`;
      const existing = current.quizScores[key];
      // Keep the best attempt, don't let a retake lower a learner's recorded score.
      if (existing && existing.correct >= correct) return;
      persist({
        ...current,
        quizScores: { ...current.quizScores, [key]: { correct, total } },
      });
    },
    [persist]
  );

  const addTimeSpent = useCallback(
    (missionId: string, ms: number) => {
      if (ms <= 0) return;
      const current = readState();
      const todayKey = new Date().toISOString().slice(0, 10);
      persist({
        ...current,
        totalTimeSpentMs: current.totalTimeSpentMs + ms,
        missionTimeSpentMs: {
          ...current.missionTimeSpentMs,
          [missionId]: (current.missionTimeSpentMs[missionId] ?? 0) + ms,
        },
        dailyActivityMs: {
          ...current.dailyActivityMs,
          [todayKey]: (current.dailyActivityMs[todayKey] ?? 0) + ms,
        },
      });
    },
    [persist]
  );

  const saveCertificate = useCallback(
    (details: Omit<CertificateRecord, "earned" | "issuedISODate">) => {
      const current = readState();
      persist({
        ...current,
        certificate: {
          earned: true,
          issuedISODate: new Date().toISOString(),
          ...details,
        },
      });
    },
    [persist]
  );

  const recordExamAttempt = useCallback(
    (scorePercent: number) => {
      const current = readState();
      persist({
        ...current,
        examAttempts: current.examAttempts + 1,
        examBestScorePercent: Math.max(current.examBestScorePercent ?? 0, scorePercent),
      });
    },
    [persist]
  );

  const xp = hydrated ? computeXP(state) : 0;
  const level = computeLevel(xp);
  const badges = hydrated ? computeBadges(state) : computeBadges(emptyState);
  const achievements = hydrated ? computeAchievements(state) : computeAchievements(emptyState);
  const totalLessons = missions.reduce((sum, m) => sum + m.lessonCount, 0);
  const completedLessonCount = Object.values(state.completedLessons).reduce(
    (sum, lessonIds) => sum + lessonIds.length,
    0
  );
  const completionPercent =
    hydrated && totalLessons > 0
      ? Math.round((completedLessonCount / totalLessons) * 100)
      : 0;

  const isMissionUnlocked = useCallback(
    (missionId: string) => {
      const index = missions.findIndex((m) => m.id === missionId);
      if (index <= 0) return true;
      const prev = missions[index - 1];
      if (!prev) return true;
      return state.completedMissions.includes(prev.id);
    },
    [state.completedMissions]
  );

  const updateProfile = useCallback(
    (profile: Partial<LearnerProfile>) => {
      const current = readState();
      persist({
        ...current,
        learnerProfile: { ...current.learnerProfile, ...profile },
      });
    },
    [persist]
  );

  const resetProgress = useCallback(() => {
    persist(emptyState);
  }, [persist]);

  const getWeeklyActivity = useCallback((): { date: string; label: string; minutes: number }[] => {
    const days: { date: string; label: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const ms = state.dailyActivityMs[key] ?? 0;
      days.push({
        date: key,
        label: d.toLocaleDateString(undefined, { weekday: "short" }),
        minutes: Math.round(ms / 1000 / 60),
      });
    }
    return days;
  }, [state.dailyActivityMs]);

  return {
    hydrated,
    progress: state,
    completionPercent,
    markLessonComplete,
    isMissionUnlocked,
    resetProgress,
    recordQuizScore,
    addTimeSpent,
    saveCertificate,
    recordExamAttempt,
    getWeeklyActivity,
    updateProfile,
    xp,
    level,
    badges,
    achievements,
  };
}
