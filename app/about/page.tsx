export const metadata = {
  title: "About Bluewater Basin",
  description: "Why Research Atlas teaches everything through one fictional watershed.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <p className="type-eyebrow">The case study</p>
      <h1 className="mt-2 text-4xl font-medium">Bluewater Basin</h1>

      <div className="mt-8 space-y-5 text-ink/80 dark:text-paper/80">
        <p>
          Bluewater Basin is a fictional coastal watershed built specifically
          for Research Atlas. It has rivers, wetlands, forests, farmland,
          groundwater wells, rain gauges, and a coastline, and every dataset is
          synthetic, but each one is built to resemble what a real
          environmental research team would actually collect.
        </p>
        <p>
          We built it this way for two reasons. First, it lets you explore,
          question, and even deliberately break every dataset in this
          platform without any risk of misrepresenting a real place or real
          people. Second, and more importantly, it lets every mission build
          on the last. The groundwater well you map in Mission 1 is the same
          well whose nitrate trend you&apos;ll test with statistics in Mission 5
          and predict with machine learning in Mission 7. Nothing here is a
          disposable toy example.
        </p>
        <p>
          Bluewater Basin is not modeled on any specific real watershed, and
          any resemblance to a real place is coincidental. Its geology,
          rainfall patterns, and water quality trends were designed to be
          scientifically plausible, not to match any published dataset.
        </p>
        <h2 className="pt-4 font-display text-2xl text-ink dark:text-paper">
          Why one continuous project?
        </h2>
        <p>
          Most people learn statistics, GIS, and machine learning as
          separate subjects, each with its own disconnected examples. That
          makes it hard to see how a real research project actually uses all
          of them together, in sequence, to answer one question. Research
          Atlas is built around a single investigation: is something
          changing in Bluewater Basin&apos;s water, and why, so that every new
          skill has an immediate, concrete job to do.
        </p>
      </div>

      <div className="mt-12 rounded-2xl border border-basin-500/20 bg-basin-500/5 p-6">
        <p className="type-eyebrow">Join other learners</p>
        <h2 className="mt-1 font-display text-xl">Research Atlas community</h2>
        <p className="mt-2 text-sm text-ink/70 dark:text-paper/70">
          Ask questions, compare notes on missions, and swap tips with other
          people working through Bluewater Basin.
        </p>
        <a
          href="https://chat.whatsapp.com/FYei0E0I9JI4iwputo2RFG?s=sh&p=a&ilr=1"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-basin-500 px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-basin-600"
        >
          Join the WhatsApp group
        </a>
      </div>
    </div>
  );
}
