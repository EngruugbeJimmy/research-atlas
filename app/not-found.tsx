import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Compass className="h-12 w-12 text-basin-500/40" strokeWidth={1} />
      <h1 className="mt-6 font-display text-4xl">
        This isn&apos;t on the map.
      </h1>
      <p className="mt-3 max-w-sm text-ink/60 dark:text-paper/60">
        The field station you&apos;re looking for doesn&apos;t exist — or hasn&apos;t been
        built yet. Head back to the expedition log and pick a real mission.
      </p>
      <Link
        href="/missions"
        className="mt-8 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper hover:bg-basin-600"
      >
        View all missions
      </Link>
    </div>
  );
}
