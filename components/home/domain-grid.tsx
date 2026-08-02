import Link from "next/link";
import { Droplets, Leaf, Users, Atom, Lock, ArrowRight } from "lucide-react";
import { domains } from "@/lib/domains/data";
import type { Domain } from "@/lib/domains/types";

const domainIcons: Record<string, typeof Droplets> = {
  "environmental-science": Droplets,
  "life-sciences": Leaf,
  "social-behavioral-science": Users,
  "physical-sciences-engineering": Atom,
};

export function DomainGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <h2 className="text-3xl font-medium md:text-4xl">Explore by discipline</h2>
      <p className="mt-2 max-w-2xl text-ink/70 dark:text-paper/70">
        Environmental Science is fully built today. Other disciplines follow the same
        mission-based model as we build them out.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {domains.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </section>
  );
}

function DomainCard({ domain }: { domain: Domain }) {
  const Icon = domainIcons[domain.id] ?? Droplets;
  const isLive = domain.status === "live";

  const content = (
    <div
      className={`h-full rounded-2xl border p-6 transition ${
        isLive
          ? "border-basin-500/25 bg-basin-500/5 hover:-translate-y-1 hover:shadow-lg"
          : "border-ink/10 bg-ink/[0.02] opacity-75 dark:border-paper/10 dark:bg-paper/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between">
        <Icon className={`h-8 w-8 ${isLive ? "text-basin-500" : "text-ink/40 dark:text-paper/40"}`} />
        {!isLive && <Lock className="h-4 w-4 text-ink/30 dark:text-paper/30" />}
      </div>
      <h3 className="mt-4 font-display text-xl">{domain.name}</h3>
      <p className="mt-1 text-sm font-medium text-basin-600">{domain.tagline}</p>
      <p className="mt-3 text-sm text-ink/70 dark:text-paper/70">{domain.description}</p>
      {isLive && (
        <p className="mt-4 flex items-center gap-1 text-sm font-medium text-basin-500">
          Start learning <ArrowRight className="h-3.5 w-3.5" />
        </p>
      )}
    </div>
  );

  return isLive ? <Link href="/missions">{content}</Link> : <div>{content}</div>;
}