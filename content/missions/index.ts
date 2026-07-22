import { mission00Lessons } from "./00-becoming-a-researcher";
import { mission01Lessons } from "./01-understanding-the-landscape";
import { mission02Lessons } from "./02-collecting-environmental-data";
import { mission03Lessons } from "./03-cleaning-scientific-data";
import { mission04Lessons } from "./04-exploring-patterns";
import { mission05Lessons } from "./05-scientific-statistics";
import { mission06Lessons } from "./06-regression-and-prediction";
import { mission07Lessons } from "./07-machine-learning";
import { mission08Lessons } from "./08-spatial-analysis-and-gis";
import { mission09Lessons } from "./09-physics-informed-ai";
import { mission10Lessons } from "./10-quantifying-uncertainty";
import { mission11Lessons } from "./11-scientific-communication";
import { mission12Lessons } from "./12-publishing-your-research";
import type { Lesson } from "@/lib/missions/types";

const lessonsByMission: Record<string, Lesson[]> = {
  "00-becoming-a-researcher": mission00Lessons,
  "01-understanding-the-landscape": mission01Lessons,
  "02-collecting-environmental-data": mission02Lessons,
  "03-cleaning-scientific-data": mission03Lessons,
  "04-exploring-patterns": mission04Lessons,
  "05-scientific-statistics": mission05Lessons,
  "06-regression-and-prediction": mission06Lessons,
  "07-machine-learning": mission07Lessons,
  "08-spatial-analysis-and-gis": mission08Lessons,
  "09-physics-informed-ai": mission09Lessons,
  "10-quantifying-uncertainty": mission10Lessons,
  "11-scientific-communication": mission11Lessons,
  "12-publishing-your-research": mission12Lessons,
};

export function getLessonsForMission(missionId: string): Lesson[] {
  return lessonsByMission[missionId] ?? [];
}

export function getLesson(missionId: string, lessonId: string): Lesson | undefined {
  return getLessonsForMission(missionId).find((l) => l.id === lessonId);
}

export function getAllLessons(): Lesson[] {
  return Object.values(lessonsByMission).flat();
}
