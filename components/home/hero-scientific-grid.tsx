"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { HeroDomainCard } from "./hero-domain-card";

/**
 * The hero's right-side "scientific computing grid" — 8 cards showing what
 * computational science looks like across disciplines. Every visual here
 * is inline SVG/CSS, not a stock photo (per design brief). Environmental
 * Science is the only LIVE track and is labeled as such; every other
 * card is explicitly marked "Coming Soon" so the composition communicates
 * future breadth without implying built-out curriculum that doesn't exist.
 */
export function HeroScientificGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {/* Environmental Science — large, spans 2 cols, the one real live track */}
      <HeroDomainCard className="col-span-2 row-span-2" delay={0.1}>
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="flex items-center gap-1.5 text-sm font-medium text-ink dark:text-paper">
            🌱 Environmental Science
          </p>
          <span className="rounded-full bg-basin-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-basin-600">
            Live
          </span>
        </div>
        <div className="relative mt-3 h-40 overflow-hidden sm:h-48">
          <WatershedVisual />
        </div>
        <p className="px-4 pb-3 pt-2 text-xs text-ink/60 dark:text-paper/60">
          Bluewater Basin — hydrology, GIS &amp; water-quality data, one continuous investigation.
        </p>
      </HeroDomainCard>

      {/* AI & Data Science — large, spans 2 cols */}
      <HeroDomainCard className="col-span-2" delay={0.3}>
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="text-sm font-medium text-ink dark:text-paper">{"</> AI & Data Science"}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 px-4 pb-4 pt-2">
          <CodeSnippetVisual />
          <div className="flex flex-col gap-2">
            <FeatureImportanceVisual />
            <ModelScoreVisual />
          </div>
        </div>
      </HeroDomainCard>

      {/* Biology / Bioinformatics — medium */}
      <HeroDomainCard delay={0.15}>
        <CardHeader emoji="🧬" title="Biology" badge="Coming Soon" />
        <div className="h-24 px-3 pb-3">
          <DnaVisual />
        </div>
      </HeroDomainCard>

      {/* Medicine — medium */}
      <HeroDomainCard delay={0.2}>
        <CardHeader emoji="🩺" title="Medicine" badge="Coming Soon" />
        <div className="h-24 px-3 pb-3">
          <PulseVisual />
        </div>
      </HeroDomainCard>

      {/* Engineering — medium */}
      <HeroDomainCard delay={0.25}>
        <CardHeader emoji="⚙️" title="Engineering" badge="Coming Soon" />
        <div className="h-24 px-3 pb-3">
          <TrussVisual />
        </div>
      </HeroDomainCard>

      {/* Agriculture — medium */}
      <HeroDomainCard delay={0.3}>
        <CardHeader emoji="🌾" title="Agriculture" badge="Coming Soon" />
        <div className="h-24 px-3 pb-3">
          <FieldRowsVisual />
        </div>
      </HeroDomainCard>

      {/* Social Sciences — medium */}
      <HeroDomainCard delay={0.35}>
        <CardHeader emoji="🌐" title="Social Sciences" badge="Coming Soon" />
        <div className="h-24 px-3 pb-3">
          <NetworkVisual />
        </div>
      </HeroDomainCard>

      {/* Ask Atlas — medium, links to the real feature */}
      <HeroDomainCard delay={0.4}>
        <Link href="/missions" className="block">
          <div className="flex items-center justify-between px-3 pt-3">
            <p className="flex items-center gap-1.5 text-sm font-medium text-ink dark:text-paper">
              <Sparkles className="h-3.5 w-3.5 text-signal-500" /> Ask Atlas
            </p>
            <span className="flex items-center gap-1 text-[10px] font-medium text-basin-600">
              <span className="h-1.5 w-1.5 rounded-full bg-basin-500" /> Online
            </span>
          </div>
          <div className="space-y-1.5 px-3 py-2.5">
            <p className="ml-auto max-w-[85%] rounded-lg bg-signal-400/20 px-2 py-1 text-[10px] text-ink dark:text-paper">
              Why is my model overfitting?
            </p>
            <p className="max-w-[90%] rounded-lg bg-basin-500/10 px-2 py-1 text-[10px] text-ink/80 dark:text-paper/80">
              Let's check your training vs. test error first...
            </p>
          </div>
        </Link>
      </HeroDomainCard>
    </div>
  );
}

function CardHeader({ emoji, title, badge }: { emoji: string; title: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between px-3 pt-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-ink dark:text-paper">
        <span aria-hidden="true">{emoji}</span> {title}
      </p>
      {badge && (
        <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[9px] font-medium text-ink/50 dark:bg-paper/10 dark:text-paper/50">
          {badge}
        </span>
      )}
    </div>
  );
}

/* ---------- Inline SVG/CSS visuals — no stock photography anywhere ---------- */

function WatershedVisual() {
  return (
    <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="200" fill="#EAF4F3" />
      <path d="M0 60 Q100 40 200 65 T400 55 V0 H0 Z" fill="#D9E8C4" opacity="0.6" />
      <path d="M0 120 Q120 100 220 130 T400 115" fill="none" stroke="#7DB6B3" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
      <path d="M0 130 Q140 105 230 140 T400 125" fill="none" stroke="#1D6E73" strokeWidth="5" strokeLinecap="round" />
      <circle cx="230" cy="140" r="4" fill="#175A5E" />
      <circle cx="120" cy="112" r="3" fill="#175A5E" />
    </svg>
  );
}

function DnaVisual() {
  return (
    <svg viewBox="0 0 100 90" className="h-full w-full text-basin-500">
      {Array.from({ length: 6 }).map((_, i) => {
        const y = 8 + i * 14;
        const offset = i % 2 === 0 ? 20 : 60;
        return (
          <g key={i}>
            <circle cx={offset} cy={y} r="3" fill="currentColor" opacity="0.8" />
            <circle cx={100 - offset} cy={y} r="3" fill="currentColor" opacity="0.5" />
            <line x1={offset} y1={y} x2={100 - offset} y2={y} stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </g>
        );
      })}
      <path d="M20 8 Q60 45 20 82" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M80 8 Q40 45 80 82" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

function PulseVisual() {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full text-silt-500">
      <path
        d="M0 20 H30 L36 6 L42 34 L48 14 L54 20 H100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrussVisual() {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full text-ink/50 dark:text-paper/50">
      <line x1="0" y1="34" x2="100" y2="34" stroke="currentColor" strokeWidth="1.5" />
      {[0, 20, 40, 60, 80, 100].map((x) => (
        <line key={x} x1={x} y1="34" x2={x + 10 > 100 ? 100 : x} y2="10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      ))}
      <path d="M0 34 L20 10 L40 34 L60 10 L80 34 L100 10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FieldRowsVisual() {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={i * 17} y="4" width="12" height="32" rx="2" fill="#A9C9A0" opacity={0.4 + (i % 3) * 0.15} />
      ))}
    </svg>
  );
}

function NetworkVisual() {
  const nodes = [
    [15, 10], [50, 6], [85, 14], [10, 32], [45, 28], [80, 34],
  ];
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full text-basin-500">
      <g stroke="currentColor" strokeWidth="0.75" opacity="0.4">
        <line x1={15} y1={10} x2={50} y2={6} />
        <line x1={50} y1={6} x2={85} y2={14} />
        <line x1={15} y1={10} x2={10} y2={32} />
        <line x1={50} y1={6} x2={45} y2={28} />
        <line x1={45} y1={28} x2={80} y2={34} />
        <line x1={85} y1={14} x2={80} y2={34} />
      </g>
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" />
      ))}
    </svg>
  );
}

function CodeSnippetVisual() {
  return (
    <div className="rounded-lg bg-ink px-2.5 py-2 font-mono text-[9px] leading-[1.5] text-paper/90">
      <p><span className="text-basin-300">from</span> sklearn <span className="text-basin-300">import</span> ensemble</p>
      <p><span className="text-silt-300">model</span> = ensemble.RandomForest()</p>
      <p><span className="text-silt-300">model</span>.fit(X_train, y_train)</p>
      <p className="text-ink/40">{"# R² = 0.87"}</p>
    </div>
  );
}

function FeatureImportanceVisual() {
  const bars = [0.9, 0.7, 0.55, 0.35, 0.2];
  return (
    <div className="flex h-10 items-end gap-1 rounded-lg bg-basin-500/5 px-2 pb-1.5 pt-2">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-sm bg-basin-500" style={{ height: `${h * 100}%`, opacity: 0.5 + h * 0.5 }} />
      ))}
    </div>
  );
}

function ModelScoreVisual() {
  return (
    <div className="rounded-lg bg-signal-400/10 px-2.5 py-1.5">
      <p className="text-[9px] font-medium text-ink/50 dark:text-paper/50">R² Score</p>
      <p className="font-mono text-sm font-semibold text-basin-600">0.87</p>
    </div>
  );
}