import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";
import { getMissionById, missions } from "@/lib/missions/data";
import { getLessonsForMission } from "@/content/missions";

export function generateStaticParams() {
  return missions.map((m) => ({ missionId: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const mission = getMissionById(missionId);
  if (!mission) return {};
  return {
    title: mission.title,
    description: mission.summary,
  };
}

export default async function MissionPage({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;
  const mission = getMissionById(missionId);
  if (!mission) notFound();

  const lessons = getLessonsForMission(mission.id);
  const firstLesson = lessons[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">
        Mission {String(mission.number).padStart(2, "0")} · {mission.field}
      </p>
      <h1 className="mt-2 text-4xl font-medium">{mission.title}</h1>
      <p className="mt-4 text-lg text-ink/70 dark:text-paper/70">{mission.summary}</p>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-ink/50 dark:text-paper/50">
        <div>
          <dt className="inline">Field station: </dt>
          <dd className="inline">{mission.station}</dd>
        </div>
        <div>
          <dt className="inline">Estimated time: </dt>
          <dd className="inline">{mission.estimatedMinutes} min</dd>
        </div>
        <div>
          <dt className="inline">Skills: </dt>
          <dd className="inline">{mission.skills.join(", ")}</dd>
        </div>
      </dl>

      {lessons.length > 0 && firstLesson ? (
        <>
          <Link
            href={`/missions/${mission.id}/${firstLesson.id}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper hover:bg-basin-600"
          >
            Begin Mission <ArrowRight className="h-4 w-4" />
          </Link>

          <ol className="mt-10 space-y-3">
            {lessons.map((lesson, i) => (
              <li key={lesson.id}>
                <Link
                  href={`/missions/${mission.id}/${lesson.id}`}
                  className="flex items-center justify-between rounded-xl border border-basin-500/15 px-5 py-4 transition hover:border-basin-500/40 hover:bg-basin-500/5"
                >
                  <span>
                    <span className="mr-3 font-mono text-xs text-basin-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {lesson.title}
                  </span>
                  <span className="font-mono text-xs text-ink/40 dark:text-paper/40">
                    {lesson.durationMinutes} min
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="mt-10 flex items-center gap-3 rounded-xl border border-dashed border-basin-500/25 px-5 py-6 text-ink/60 dark:text-paper/60">
          <Lock className="h-5 w-5 text-silt-500" />
          <p>
            This mission&apos;s full lesson content is still being written for
            Research Atlas. The mission structure, skills, and field station
            above are final — check back soon, or follow the project on
            GitHub to see it land.
          </p>
        </div>
      )}
    </div>
  );
}
