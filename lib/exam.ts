import { getAllLessons } from "@/content/missions";
import type { QuizQuestion } from "@/lib/missions/types";

export interface ExamQuestion {
  id: string;
  missionId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const EXAM_QUESTION_COUNT = 25;
export const EXAM_PASS_PERCENT = 70;

// Simple seeded PRNG (mulberry32) so an exam can be reproduced from a seed
// if needed, while still looking random to the learner on each attempt.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function buildQuestionPool(): ExamQuestion[] {
  const lessons = getAllLessons();
  const pool: ExamQuestion[] = [];
  for (const lesson of lessons) {
    lesson.quiz.forEach((q: QuizQuestion, i: number) => {
      pool.push({
        id: `${lesson.id}-q${i}`,
        missionId: lesson.missionId,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      });
    });
  }
  return pool;
}

/**
 * Builds a randomized exam that pulls from every mission's quiz bank,
 * favoring broad coverage (at least one question per mission before any
 * mission gets a second), then shuffles both question order and each
 * question's answer order.
 */
export function buildExam(seed: number = Date.now(), count: number = EXAM_QUESTION_COUNT): ExamQuestion[] {
  const rand = mulberry32(seed);
  const pool = buildQuestionPool();

  const byMission = new Map<string, ExamQuestion[]>();
  for (const q of pool) {
    const list = byMission.get(q.missionId) ?? [];
    list.push(q);
    byMission.set(q.missionId, list);
  }
  for (const [missionId, list] of byMission) {
    byMission.set(missionId, shuffle(list, rand));
  }

  const missionIds = shuffle(Array.from(byMission.keys()), rand);
  const selected: ExamQuestion[] = [];
  let round = 0;
  while (selected.length < count && selected.length < pool.length) {
    let addedThisRound = false;
    for (const missionId of missionIds) {
      const list = byMission.get(missionId)!;
      if (round < list.length) {
        selected.push(list[round]!);
        addedThisRound = true;
        if (selected.length >= count) break;
      }
    }
    if (!addedThisRound) break;
    round += 1;
  }

  const finalOrder = shuffle(selected, rand);

  // Shuffle each question's own options, remapping correctIndex to match.
  return finalOrder.map((q) => {
    const optionOrder = shuffle(
      q.options.map((_, i) => i),
      rand
    );
    const newOptions = optionOrder.map((i) => q.options[i]!);
    const newCorrectIndex = optionOrder.indexOf(q.correctIndex);
    return { ...q, options: newOptions, correctIndex: newCorrectIndex };
  });
}
