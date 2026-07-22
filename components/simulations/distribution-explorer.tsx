"use client";

import { useMemo, useState } from "react";

// Box-Muller transform for normal deviates
function boxMuller(seed: { v: number }): number {
  let u = 0, v = 0;
  while (u === 0) { seed.v = (seed.v * 9301 + 49297) % 233280; u = seed.v / 233280; }
  while (v === 0) { seed.v = (seed.v * 9301 + 49297) % 233280; v = seed.v / 233280; }
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Generate synthetic nitrate distribution with controllable right-skew
function generateNitrate(n: number, skew: number, baseSeed = 42): number[] {
  const state = { v: baseSeed };
  return Array.from({ length: n }, () => {
    const normal = boxMuller(state);
    // Apply log-normal transform for positive skew; simple normal for none
    const raw = skew > 0.5
      ? Math.exp(normal * 0.45 + 1.6 + skew * 0.4) // log-normal, right-skewed
      : Math.max(0.5, 4.5 + normal * (1.5 + skew));
    return parseFloat(raw.toFixed(2));
  });
}

function mean(arr: number[]) { return arr.reduce((s, v) => s + v, 0) / arr.length; }
function median(arr: number[]) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : ((s[m - 1]! + s[m]!) / 2);
}

const W = 560, H = 200;

export function DistributionExplorer() {
  const [skew, setSkew] = useState(0.5);
  const [n, setN] = useState(60);

  const data = useMemo(() => generateNitrate(n, skew), [n, skew]);

  const xMax = Math.min(Math.max(...data) * 1.05, 40);
  const bins = 18;
  const binW = xMax / bins;

  const counts = Array(bins).fill(0) as number[];
  data.forEach(v => {
    const idx = Math.min(bins - 1, Math.floor(v / binW));
    counts[idx] = (counts[idx] ?? 0) + 1;
  });
  const maxCount = Math.max(...counts);

  const xS = (v: number) => (v / xMax) * (W - 40) + 20;
  const barH = (c: number) => (c / maxCount) * (H - 30);

  const mu = mean(data);
  const med = median(data);

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full">
        {/* axis */}
        <line x1={20} y1={H} x2={W - 20} y2={H} stroke="currentColor" opacity={0.2} />

        {/* bars */}
        {counts.map((c, i) => (
          <rect
            key={i}
            x={xS(i * binW) + 1}
            y={H - barH(c)}
            width={Math.max(1, xS(binW) - xS(0) - 2)}
            height={barH(c)}
            fill="#1D6E73"
            opacity={0.7}
          />
        ))}

        {/* mean line */}
        <line x1={xS(mu)} y1={10} x2={xS(mu)} y2={H} stroke="#D4A72C" strokeWidth={2} />
        <text x={xS(mu) + 4} y={22} fontSize={10} fill="#D4A72C">mean {mu.toFixed(1)}</text>

        {/* median line */}
        <line x1={xS(med)} y1={10} x2={xS(med)} y2={H} stroke="#A97452" strokeWidth={2} strokeDasharray="4 3" />
        <text x={xS(med) + 4} y={36} fontSize={10} fill="#A97452">median {med.toFixed(1)}</text>

        {/* x-axis labels */}
        {[0, 5, 10, 15, 20, 25].map(v => (
          <text key={v} x={xS(v)} y={H + 14} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.5}>{v}</text>
        ))}
        <text x={W / 2} y={H + 26} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.5}>
          Nitrate (mg/L)
        </text>
      </svg>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label className="flex justify-between text-sm">
            <span>Right skew</span>
            <span className="font-mono text-basin-500">{skew.toFixed(1)}</span>
          </label>
          <input type="range" min={0} max={2} step={0.05} value={skew}
            onChange={e => setSkew(parseFloat(e.target.value))}
            className="mt-2 w-full accent-signal-500" />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
            Right skew pulls the tail toward high values — common in contamination data where most readings are low but rare events are extreme.
          </p>
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Sample size (n)</span>
            <span className="font-mono text-basin-500">{n}</span>
          </label>
          <input type="range" min={10} max={300} step={5} value={n}
            onChange={e => setN(parseInt(e.target.value))}
            className="mt-2 w-full accent-basin-500" />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
            With small samples, the histogram looks ragged and the mean is unstable. Watch how it stabilises as n grows.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-6 rounded-lg bg-ink px-4 py-3 font-mono text-sm text-paper">
        <span>n = {data.length}</span>
        <span className="text-signal-400">mean = {mu.toFixed(2)} mg/L</span>
        <span className="text-silt-300">median = {med.toFixed(2)} mg/L</span>
        <span>gap = {Math.abs(mu - med).toFixed(2)}</span>
      </div>
    </div>
  );
}
