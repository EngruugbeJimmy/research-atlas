import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { simulations } from "@/lib/simulations/data";

export const metadata = {
  title: "Simulations",
  description: "Every interactive simulation in Research Atlas, in one place.",
};

export default function SimulationsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">Learn by dragging things</p>
      <h1 className="mt-2 text-4xl font-medium">Simulations</h1>
      <p className="mt-4 max-w-2xl text-ink/70 dark:text-paper/70">
        Every difficult idea in Research Atlas becomes something you can
        drag, click, or watch move. These are standalone — no mission
        progress required.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {simulations.map((sim) => (
          <Link
            key={sim.slug}
            href={`/simulations/${sim.slug}`}
            className="group rounded-2xl border border-basin-500/15 p-6 transition hover:border-basin-500/40 hover:shadow-lg"
          >
            <span className="type-eyebrow">{sim.field}</span>
            <h2 className="mt-3 font-display text-xl group-hover:text-basin-500">
              {sim.title}
            </h2>
            <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">{sim.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-basin-500">
              Open simulation <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
