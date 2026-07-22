import { missions } from "@/lib/missions/data";

/**
 * Gamification is intentionally derived, not stored. Badges, achievements,
 * XP, and level are all computed from the same ProgressState that already
 * lives in localStorage (see hooks/use-progress.ts). This means there is
 * only one source of truth, and it can never drift out of sync with itself.
 */

export interface ProgressLike {
  completedMissions: string[];
  completedLessons: Record<string, string[]>;
  quizScores: Record<string, { correct: number; total: number }>;
  streakDays: number;
  totalTimeSpentMs: number;
}

export const XP_PER_LESSON = 50;
export const XP_PER_QUIZ_CORRECT = 10;
export const XP_PER_MISSION_BONUS = 200;

export function computeXP(progress: ProgressLike): number {
  const lessonXP =
    Object.values(progress.completedLessons).reduce((sum, l) => sum + l.length, 0) *
    XP_PER_LESSON;

  const quizXP = Object.values(progress.quizScores).reduce(
    (sum, q) => sum + q.correct * XP_PER_QUIZ_CORRECT,
    0
  );

  const missionBonusXP = progress.completedMissions.length * XP_PER_MISSION_BONUS;

  return lessonXP + quizXP + missionBonusXP;
}

export interface Level {
  level: number;
  title: string;
  xpIntoLevel: number;
  xpForNextLevel: number;
}

const LEVEL_TITLES = [
  "New Recruit",
  "Field Trainee",
  "Junior Researcher",
  "Field Researcher",
  "Senior Researcher",
  "Lead Investigator",
  "Basin Scientist",
  "Principal Investigator",
];

// Each level requires progressively more XP than the last.
function xpRequiredForLevel(level: number): number {
  return 250 * level + 50 * level * level;
}

export function computeLevel(xp: number): Level {
  let level = 1;
  while (xp >= xpRequiredForLevel(level)) {
    level += 1;
  }
  const currentFloor = level === 1 ? 0 : xpRequiredForLevel(level - 1);
  const nextCeiling = xpRequiredForLevel(level);
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] ?? LEVEL_TITLES[0]!,
    xpIntoLevel: xp - currentFloor,
    xpForNextLevel: nextCeiling - currentFloor,
  };
}

export interface Badge {
  id: string;
  missionId: string;
  missionNumber: number;
  title: string;
  field: string;
  earned: boolean;
}

export function computeBadges(progress: ProgressLike): Badge[] {
  return missions
    .filter((m) => m.builtOut)
    .map((m) => ({
      id: `badge-${m.id}`,
      missionId: m.id,
      missionNumber: m.number,
      title: m.title,
      field: m.field,
      earned: progress.completedMissions.includes(m.id),
    }));
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "flame" | "target" | "award" | "brain" | "compass" | "trophy" | "clock";
  earned: boolean;
}

export function computeAchievements(progress: ProgressLike): Achievement[] {
  const totalLessonsComplete = Object.values(progress.completedLessons).reduce(
    (sum, l) => sum + l.length,
    0
  );
  const totalQuizzes = Object.values(progress.quizScores).length;
  const perfectQuizzes = Object.values(progress.quizScores).filter(
    (q) => q.total > 0 && q.correct === q.total
  ).length;
  const builtOutMissionCount = missions.filter((m) => m.builtOut).length;
  const hoursSpent = progress.totalTimeSpentMs / 1000 / 60 / 60;

  return [
    {
      id: "first-lesson",
      title: "First Steps",
      description: "Complete your first lesson.",
      icon: "compass",
      earned: totalLessonsComplete >= 1,
    },
    {
      id: "first-mission",
      title: "Mission Accomplished",
      description: "Complete your first full mission.",
      icon: "award",
      earned: progress.completedMissions.length >= 1,
    },
    {
      id: "streak-3",
      title: "Building Momentum",
      description: "Keep a 3-day learning streak.",
      icon: "flame",
      earned: progress.streakDays >= 3,
    },
    {
      id: "streak-7",
      title: "One Week Strong",
      description: "Keep a 7-day learning streak.",
      icon: "flame",
      earned: progress.streakDays >= 7,
    },
    {
      id: "perfect-quiz",
      title: "Sharp Mind",
      description: "Score 100% on a mission quiz.",
      icon: "brain",
      earned: perfectQuizzes >= 1,
    },
    {
      id: "quiz-five",
      title: "Quick Check Regular",
      description: "Complete 5 quick checks.",
      icon: "target",
      earned: totalQuizzes >= 5,
    },
    {
      id: "halfway",
      title: "Halfway to Bluewater",
      description: "Complete half of all missions.",
      icon: "trophy",
      earned: progress.completedMissions.length >= Math.ceil(builtOutMissionCount / 2),
    },
    {
      id: "all-missions",
      title: "Basin Expert",
      description: "Complete every mission in Research Atlas.",
      icon: "trophy",
      earned:
        builtOutMissionCount > 0 && progress.completedMissions.length >= builtOutMissionCount,
    },
    {
      id: "five-hours",
      title: "Deep Field Work",
      description: "Spend 5 hours learning in Research Atlas.",
      icon: "clock",
      earned: hoursSpent >= 5,
    },
  ];
}

export function allMissionsComplete(progress: ProgressLike): boolean {
  const builtOut = missions.filter((m) => m.builtOut);
  return builtOut.length > 0 && builtOut.every((m) => progress.completedMissions.includes(m.id));
}
