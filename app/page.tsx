import Link from "next/link";
import {
  PlayCircle,
  Map as MapIcon,
  ArrowRight,
  HelpCircle,
  Eye,
  Compass,
  LineChart,
  MessageSquare,
  BookOpen,
  Sparkles,
  Layers,
  Brain,
  Droplets,
  Leaf,
  Users,
  Atom,
  Lock,
} from "lucide-react";
import { MissionRoadmap } from "@/components/missions/mission-roadmap";
import { HeroCta } from "@/components/missions/hero-cta";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { Reveal } from "@/components/ui/reveal";
import { HeroBackground } from "@/components/home/hero-background";
import { DomainGrid } from "@/components/home/domain-grid";
import { HeroScientificGrid } from "@/components/home/hero-scientific-grid";

const domainIcons: Record<string, typeof Droplets> = {
  "environmental-science": Droplets,
  "life-sciences": Leaf,
  "social-behavioral-science": Users,
  "physical-sciences-engineering": Atom,
};

const workflow = [
  { step: "Ask", icon: HelpCircle, detail: "Is groundwater near the agricultural zone actually contaminated, or does it look that way by chance?" },
  { step: "Observe", icon: Eye, detail: "Read the terrain, the well logs, and the sampling history before touching a model." },
  { step: "Design", icon: Compass, detail: "Choose a sampling plan and a method that can actually answer the question." },
  { step: "Analyze", icon: LineChart, detail: "Clean, explore, model, and quantify uncertainty — in that order." },
  { step: "Communicate", icon: MessageSquare, detail: "Turn the analysis into a figure and a claim someone else can check." },
];

const heroStats = [
  { icon: Compass, value: "13", label: "Research Missions" },
  { icon: BookOpen, value: "70", label: "Interactive Lessons" },
  { icon: LineChart, value: "14", label: "Interactive Simulations" },
  { icon: Sparkles, value: "100%", label: "Free & Open Source" },
];

const heroLearningAreas = [
  {
    icon: Layers,
    title: "Interactive GIS",
    description: "Explore spatial data with the mapping tools working researchers actually use.",
    href: "/simulations/watershed-explorer",
  },
  {
    icon: LineChart,
    title: "Data Analysis",
    description: "Analyze real environmental datasets using statistics, from raw readings to insight.",
    href: "/missions/04-exploring-patterns",
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description: "Build and train models that predict real environmental outcomes.",
    href: "/missions/07-machine-learning",
  },
  {
    icon: Droplets,
    title: "Hydrology",
    description: "Understand water systems, from rainfall to groundwater to ocean interaction.",
    href: "/simulations/darcys-law",
  },
];

const featuredSimulations = [
  {
    href: "/simulations/darcys-law",
    title: "Darcy's Law Visualizer",
    description: "Drag the hydraulic gradient and watch groundwater actually move through Bluewater Basin's aquifer.",
    tag: "Hydrogeology",
  },
  {
    href: "/simulations/regression-explorer",
    title: "Regression Explorer",
    description: "Fit a line to rainfall vs. streamflow data and see R², residuals, and overfitting update live.",
    tag: "Statistics",
  },
  {
    href: "/simulations/watershed-explorer",
    title: "Watershed Explorer",
    description: "Click any point on the DEM and trace exactly where that raindrop ends up.",
    tag: "GIS",
  },
];

const testimonials = [
  {
    quote:
      "I'd taken a statistics course twice before and never understood why a p-value mattered. Seeing it decide something real about Bluewater Basin's water quality made it click in one sitting.",
    name: "Early access learner",
    role: "Self-taught, Mission 05",
  },
  {
    quote:
      "The fact that Mission 7's random forest uses the exact same wells I mapped in Mission 1 is what made me keep going. It never feels like a new toy example.",
    name: "Early access learner",
    role: "Environmental science undergrad",
  },
  {
    quote:
      "This is the first place that taught me GIS by making me care whether a well was contaminated, not by making me memorize menu items.",
    name: "Early access learner",
    role: "Career switcher, Mission 08",
  },
];

const faqs = [
  {
    q: "Do I need to know how to code?",
    a: "No. Mission 00 assumes zero programming experience. Code is introduced gradually starting in Mission 02, always after the underlying idea is clear without it.",
  },
  {
    q: "Is Bluewater Basin a real place?",
    a: "No — it's a fictional but scientifically realistic watershed built specifically for this platform, so every dataset can be freely explored, modified, and broken without consequence.",
  },
  {
    q: "Is Research Atlas really free?",
    a: "Yes. The platform is open-source under the MIT license. Progress is stored locally in your browser — there's no account and no paywall.",
  },
  {
    q: "What if I only care about GIS, or only about machine learning?",
    a: "Each mission stands reasonably well on its own, but they build on shared Bluewater Basin data — we'd recommend starting from Mission 00 even if you skim it, so later missions make sense.",
  },
  {
    q: "Is Research Atlas only about environmental science?",
    a: "Not by design — Bluewater Basin is our first research track, chosen because environmental data makes the full research workflow easy to see end to end. Other domains, like life sciences, social and behavioral science, and physical sciences and engineering, are planned to follow the same mission-based approach, but don't have built-out content yet.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
<section className="relative overflow-hidden border-b border-ink/10 dark:border-paper/10">
  <HeroBackground />

  <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:pt-14 md:px-8 md:pb-24 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-8 lg:pt-16">
    {/* LEFT — content */}
    <Reveal className="max-w-xl">
      <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-ink/70 dark:border-paper/15 dark:bg-ink-800 dark:text-paper/70">
        <MapIcon className="h-3.5 w-3.5" /> Learn · Code · Simulate · Discover
      </p>
      <h1 className="text-4xl font-medium leading-tight tracking-tight text-ink dark:text-paper md:text-6xl">
        Become a
        <br />
        <span className="text-basin-500">Computational Scientist.</span>
      </h1>
      <p className="mt-6 max-w-lg text-lg text-ink/70 dark:text-paper/70">
        Learn Python, GIS, statistics, and machine learning through real research missions —
        starting with Bluewater Basin, our first fully built Environmental Science track,
        with more scientific disciplines on the way.
      </p>

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <HeroCta />
        <Link
          href="/missions"
          className="rounded-full border border-ink/20 px-6 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:border-basin-500/50 hover:bg-basin-500/5 dark:border-paper/20 dark:text-paper"
        >
          Explore Missions
        </Link>
      </div>

      <Link
        href="/simulations/watershed-explorer"
        className="mt-4 flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-basin-500 dark:text-paper/60"
      >
        <PlayCircle className="h-4 w-4" /> Try an interactive demo
      </Link>

      {/* Real numbers instead of a stats card grid */}
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-6 text-sm text-ink/60 dark:border-paper/10 dark:text-paper/60">
        {heroStats.map((s) => (
          <span key={s.label}>
            <strong className="text-ink dark:text-paper">{s.value}</strong> {s.label}
          </span>
        ))}
      </div>
    </Reveal>

    {/* RIGHT — scientific computing grid */}
    <div className="lg:pl-4">
      <HeroScientificGrid />
    </div>
  </div>
</section>

      {/* RESEARCH DOMAINS */}
      <section className="border-b border-basin-500/15 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
             <DomainGrid />
            <p className="type-eyebrow">One platform, many fields</p>
            <h2 className="mt-2 text-3xl font-medium md:text-4xl">
              Research Atlas isn&apos;t just environmental science.
            </h2>
            <p className="mt-4 max-w-2xl text-ink/65 dark:text-paper/65">
              It&apos;s a way of teaching research itself, through one
              continuous, realistic mission simulation instead of disconnected
              exercises. Bluewater Basin is where that approach lives today.
              Other research domains are planned to follow the same model,
              built out with real mission content over time.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain, i) => {
              const Icon = domainIcons[domain.id] ?? Compass;
              const isLive = domain.status === "live";
              const card = (
                <div
                  className={`group relative h-full rounded-2xl border p-6 transition-all duration-300 ${
                    isLive
                      ? "border-basin-500/20 bg-paper hover:-translate-y-1 hover:border-basin-500/40 hover:shadow-xl hover:shadow-basin-500/10 dark:bg-ink"
                      : "border-basin-500/10 bg-basin-500/[0.03] dark:bg-paper/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isLive
                          ? "bg-basin-500/10 text-basin-500"
                          : "bg-ink/5 text-ink/30 dark:bg-paper/10 dark:text-paper/30"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </div>
                    {isLive ? (
                      <span className="rounded-full bg-signal-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-signal-600 dark:text-signal-400">
                        Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink/40 dark:bg-paper/10 dark:text-paper/40">
                        <Lock className="h-2.5 w-2.5" /> Coming soon
                      </span>
                    )}
                  </div>
                  <h3
                    className={`mt-4 font-display text-lg ${
                      isLive ? "transition group-hover:text-basin-500" : "text-ink/60 dark:text-paper/50"
                    }`}
                  >
                    {domain.name}
                  </h3>
                  <p
                    className={`mt-1 text-xs font-medium uppercase tracking-wide ${
                      isLive ? "text-basin-500" : "text-ink/30 dark:text-paper/30"
                    }`}
                  >
                    {domain.tagline}
                  </p>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      isLive ? "text-ink/65 dark:text-paper/65" : "text-ink/45 dark:text-paper/40"
                    }`}
                  >
                    {domain.description}
                  </p>
                  {isLive && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-basin-500">
                      Start this track{" "}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>
              );
              return (
                <Reveal key={domain.id} delay={i * 0.08}>
                  {isLive ? (
                    <Link href="/missions">{card}</Link>
                  ) : (
                    card
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <section className="border-b border-basin-500/15 bg-basin-50/40 py-20 dark:bg-basin-700/10">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <p className="type-eyebrow">How the expedition runs</p>
            <h2 className="mt-2 text-3xl font-medium md:text-4xl">
              Every mission follows real scientific workflow.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-5">
            {workflow.map((w, i) => (
              <Reveal key={w.step} delay={i * 0.08} className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-basin-500/10 text-basin-500">
                  <w.icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <span className="mt-3 block font-mono text-xs text-basin-500">
                  0{i + 1}
                </span>
                <h3 className="mt-1 font-display text-xl">{w.step}</h3>
                <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">
                  {w.detail}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION ROADMAP */}
      <section className="border-b border-basin-500/15 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <p className="type-eyebrow">The expedition log · Track 01</p>
            <h2 className="mt-2 text-3xl font-medium md:text-4xl">
              Thirteen missions. One watershed.
            </h2>
            <p className="mt-4 max-w-2xl text-ink/65 dark:text-paper/65">
              Every mission is a real milestone in investigating Bluewater
              Basin, numbered because the order genuinely matters. Mission 7&apos;s
              model depends on the wells you mapped in Mission 1.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <MissionRoadmap />
          </Reveal>
        </div>
      </section>

      {/* FEATURED SIMULATIONS */}
      <section className="border-b border-basin-500/15 bg-basin-50/40 py-20 dark:bg-basin-700/10">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <p className="type-eyebrow">Learn by dragging things</p>
            <h2 className="mt-2 text-3xl font-medium md:text-4xl">
              Featured simulations
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredSimulations.map((sim, i) => (
              <Reveal key={sim.href} delay={i * 0.08}>
                <Link
                  href={sim.href}
                  className="group relative block overflow-hidden rounded-2xl border border-basin-500/15 bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-basin-500/40 hover:shadow-xl hover:shadow-basin-500/10 dark:bg-ink"
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-basin-500/0 via-basin-500/0 to-signal-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-basin-500/5 group-hover:to-signal-500/5"
                    aria-hidden="true"
                  />
                  <span className="type-eyebrow">{sim.tag}</span>
                  <h3 className="mt-3 font-display text-xl transition group-hover:text-basin-500">
                    {sim.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/65 dark:text-paper/65">
                    {sim.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-basin-500">
                    Try it{" "}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-b border-basin-500/15 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <p className="type-eyebrow">From the field</p>
            <h2 className="mt-2 text-3xl font-medium md:text-4xl">
              What early researchers say
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name + t.role} delay={i * 0.08}>
                <figure className="h-full rounded-2xl border border-basin-500/15 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-basin-500/30 hover:shadow-lg hover:shadow-basin-500/5">
                  <blockquote className="text-ink/80 dark:text-paper/80">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 font-mono text-xs text-ink/50 dark:text-paper/50">
                    {t.name} · {t.role}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <Reveal>
            <p className="type-eyebrow">Before you start</p>
            <h2 className="mt-2 text-3xl font-medium md:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
