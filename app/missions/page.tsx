import { MissionRoadmap } from "@/components/missions/mission-roadmap";

export const metadata = {
  title: "Missions",
  description: "The full thirteen-mission Bluewater Basin research roadmap.",
};

export default function MissionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">The expedition log</p>
      <h1 className="mt-2 text-4xl font-medium">All Missions</h1>
      <p className="mt-4 max-w-2xl text-ink/70 dark:text-paper/70">
        Thirteen missions, one watershed. Missions unlock in order — each one
        depends on data and skills from the last.
      </p>
      <div className="mt-10">
        <MissionRoadmap />
      </div>
    </div>
  );
}
