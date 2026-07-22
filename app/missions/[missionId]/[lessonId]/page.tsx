import { notFound } from "next/navigation";
import { getMissionById, missions } from "@/lib/missions/data";
import { getLesson, getLessonsForMission } from "@/content/missions";
import { LessonView } from "@/components/missions/lesson-view";

export function generateStaticParams() {
  return missions.flatMap((m) =>
    getLessonsForMission(m.id).map((l) => ({ missionId: m.id, lessonId: l.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ missionId: string; lessonId: string }>;
}) {
  const { missionId, lessonId } = await params;
  const lesson = getLesson(missionId, lessonId);
  if (!lesson) return {};
  return { title: lesson.title };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ missionId: string; lessonId: string }>;
}) {
  const { missionId, lessonId } = await params;
  const mission = getMissionById(missionId);
  const lesson = getLesson(missionId, lessonId);
  if (!mission || !lesson) notFound();

  const lessons = getLessonsForMission(mission.id);
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const previous = index > 0 ? lessons[index - 1] : undefined;
  const next = index < lessons.length - 1 ? lessons[index + 1] : undefined;

  return (
    <LessonView
      lesson={lesson}
      missionId={mission.id}
      missionTitle={mission.title}
      lessonIndex={index + 1}
      lessonCount={lessons.length}
      previousHref={previous ? `/missions/${mission.id}/${previous.id}` : null}
      nextHref={next ? `/missions/${mission.id}/${next.id}` : `/missions/${mission.id}`}
    />
  );
}
