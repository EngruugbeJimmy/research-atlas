import { notFound } from "next/navigation";
import { simulations, getSimulation } from "@/lib/simulations/data";
import { simulationRegistry } from "@/components/simulations/registry";

export function generateStaticParams() {
  return simulations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sim = getSimulation(slug);
  if (!sim) return {};
  return { title: sim.title, description: sim.description };
}

export default async function SimulationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sim = getSimulation(slug);
  if (!sim) notFound();

  const SimComponent = simulationRegistry[sim.component];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">{sim.field}</p>
      <h1 className="mt-2 text-4xl font-medium">{sim.title}</h1>
      <p className="mt-4 text-ink/70 dark:text-paper/70">{sim.description}</p>
      <div className="mt-10">
        <SimComponent />
      </div>
    </div>
  );
}
