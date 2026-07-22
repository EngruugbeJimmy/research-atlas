import { missions } from "@/lib/missions/data";

export const metadata = {
  title: "Curriculum",
  description: "Every subject Research Atlas covers, mapped to the mission that teaches it.",
};

const tracks = [
  {
    name: "Scientific Thinking & Research Design",
    coveredIn: ["Mission 00", "Mission 02", "Mission 11", "Mission 12"],
    description: "Asking answerable questions, forming falsifiable hypotheses, sampling design, and research ethics.",
  },
  {
    name: "Statistics",
    coveredIn: ["Mission 05", "Mission 06", "Mission 10"],
    description: "Hypothesis testing, confidence intervals, regression, and Bayesian uncertainty quantification.",
  },
  {
    name: "GIS & Remote Sensing",
    coveredIn: ["Mission 01", "Mission 08"],
    description: "Digital elevation models, coordinate systems, watershed delineation, kriging, and spatial autocorrelation.",
  },
  {
    name: "Hydrology & Hydrogeology",
    coveredIn: ["Mission 01", "Mission 09"],
    description: "Watersheds, streamflow, Darcy's Law, and groundwater flow.",
  },
  {
    name: "Machine Learning & AI",
    coveredIn: ["Mission 07", "Mission 09"],
    description: "Decision trees, random forests, cross-validation, and physics-informed neural networks.",
  },
  {
    name: "Environmental Data Science",
    coveredIn: ["Mission 02", "Mission 03", "Mission 04"],
    description: "Sensor networks, data cleaning, quality control, and exploratory data analysis.",
  },
  {
    name: "Scientific Communication & Open Science",
    coveredIn: ["Mission 11", "Mission 12"],
    description: "Honest data visualization, scientific writing, reproducibility, and publishing.",
  },
];

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">What you&apos;ll actually learn</p>
      <h1 className="mt-2 text-4xl font-medium">Curriculum</h1>
      <p className="mt-4 max-w-2xl text-ink/70 dark:text-paper/70">
        Research Atlas doesn&apos;t teach subjects in isolation — every track
        below is woven through the thirteen missions, in the order a real
        research project would need it.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {tracks.map((track) => (
          <div key={track.name} className="rounded-2xl border border-basin-500/15 p-6">
            <h2 className="font-display text-xl">{track.name}</h2>
            <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">{track.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {track.coveredIn.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-basin-500/10 px-2.5 py-1 font-mono text-xs text-basin-500"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 font-mono text-xs text-ink/40 dark:text-paper/40">
        {missions.length} missions total · {missions.filter((m) => m.builtOut).length} with full lesson content live today
      </p>
    </div>
  );
}
