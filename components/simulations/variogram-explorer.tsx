"use client";

import { useMemo, useState } from "react";

// Well nitrate data from Bluewater Basin (canonical positions)
const wells = [
  { id: "GW-01", x: 0.15, y: 0.18, v: 3.1 },
  { id: "GW-02", x: 0.28, y: 0.12, v: 2.8 },
  { id: "GW-03", x: 0.42, y: 0.22, v: 5.4 },
  { id: "GW-04", x: 0.55, y: 0.18, v: 7.2 },
  { id: "GW-05", x: 0.68, y: 0.28, v: 9.8 },
  { id: "GW-06", x: 0.78, y: 0.38, v: 12.4 },
  { id: "GW-07", x: 0.82, y: 0.52, v: 11.1 },
  { id: "GW-08", x: 0.72, y: 0.62, v: 8.6 },
  { id: "GW-09", x: 0.58, y: 0.72, v: 6.3 },
  { id: "GW-10", x: 0.45, y: 0.78, v: 4.1 },
  { id: "GW-11", x: 0.32, y: 0.68, v: 3.5 },
  { id: "GW-12", x: 0.22, y: 0.58, v: 2.9 },
  { id: "GW-13", x: 0.18, y: 0.45, v: 3.8 },
  { id: "GW-14", x: 0.62, y: 0.45, v: 13.2 },
  { id: "GW-15", x: 0.38, y: 0.42, v: 4.9 },
];

function dist(a: typeof wells[0], b: typeof wells[0]) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Build experimental semivariogram: bin all pairs by distance
function buildExperimental(nBins: number) {
  const pairs: { h: number; sv: number }[] = [];
  for (let i = 0; i < wells.length; i++) {
    for (let j = i + 1; j < wells.length; j++) {
      const wi = wells[i]!;
      const wj = wells[j]!;
      pairs.push({ h: dist(wi, wj), sv: 0.5 * (wi.v - wj.v) ** 2 });
    }
  }
  const maxH = Math.max(...pairs.map(p => p.h));
  const bins: { midH: number; gamma: number; count: number }[] = [];
  for (let b = 0; b < nBins; b++) {
    const lo = (b / nBins) * maxH;
    const hi = ((b + 1) / nBins) * maxH;
    const inBin = pairs.filter(p => p.h >= lo && p.h < hi);
    if (inBin.length === 0) continue;
    bins.push({
      midH: (lo + hi) / 2,
      gamma: inBin.reduce((s, p) => s + p.sv, 0) / inBin.length,
      count: inBin.length,
    });
  }
  return { bins, maxH };
}

// Exponential model: γ(h) = nugget + (sill - nugget) * (1 - exp(-h/range))
function exponentialModel(h: number, nugget: number, sill: number, range: number) {
  if (h === 0) return 0;
  return nugget + (sill - nugget) * (1 - Math.exp(-h / range));
}

const W = 500, H = 260;
const PAD = { l: 48, r: 16, t: 16, b: 40 };

export function VariogramExplorer() {
  const [nugget, setNugget] = useState(1.0);
  const [sill, setSill] = useState(28.0);
  const [range, setRange] = useState(0.36);

  const { bins, maxH } = useMemo(() => buildExperimental(8), []);

  const maxG = Math.max(sill * 1.15, Math.max(...bins.map(b => b.gamma)) * 1.15);

  const sx = (h: number) => PAD.l + (h / maxH) * (W - PAD.l - PAD.r);
  const sy = (g: number) => PAD.t + (1 - g / maxG) * (H - PAD.t - PAD.b);

  // Model curve points
  const modelPoints = Array.from({ length: 80 }, (_, i) => {
    const h = (i / 79) * maxH;
    const g = exponentialModel(h, nugget, sill, range);
    return `${i === 0 ? "M" : "L"}${sx(h).toFixed(1)},${sy(g).toFixed(1)}`;
  }).join(" ");

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full"
        role="img" aria-label="Variogram showing semivariance vs distance between wells">
        {/* Axes */}
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="currentColor" opacity={0.2} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="currentColor" opacity={0.2} />

        {/* Axis labels */}
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.55}>
          Separation distance (normalised)
        </text>
        <text x={14} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.55}
          transform={`rotate(-90 14 ${(PAD.t + H - PAD.b) / 2})`}>
          Semivariance
        </text>

        {/* Sill reference line */}
        <line x1={PAD.l} y1={sy(sill)} x2={W - PAD.r} y2={sy(sill)}
          stroke="#D4A72C" strokeWidth={1} strokeDasharray="5 3" opacity={0.5} />
        <text x={W - PAD.r + 2} y={sy(sill) + 4} fontSize={9} fill="#D4A72C" opacity={0.8}>sill</text>

        {/* Nugget reference line */}
        {nugget > 0.3 && (
          <>
            <line x1={PAD.l} y1={sy(nugget)} x2={PAD.l + 40} y2={sy(nugget)}
              stroke="#A97452" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
            <text x={PAD.l + 43} y={sy(nugget) + 4} fontSize={9} fill="#A97452" opacity={0.8}>nugget</text>
          </>
        )}

        {/* Range reference line */}
        <line x1={sx(range)} y1={PAD.t} x2={sx(range)} y2={H - PAD.b}
          stroke="#7DB6B3" strokeWidth={1} strokeDasharray="4 3" opacity={0.45} />
        <text x={sx(range)} y={H - PAD.b + 14} textAnchor="middle" fontSize={9} fill="#7DB6B3" opacity={0.8}>range</text>

        {/* Model curve */}
        <path d={modelPoints} fill="none" stroke="#1D6E73" strokeWidth={2.5} />

        {/* Experimental points */}
        {bins.map((b, i) => (
          <g key={i}>
            <circle cx={sx(b.midH)} cy={sy(b.gamma)} r={5.5}
              fill="#D4A72C" stroke="#0E1B1F" strokeWidth={1.5} />
            <text x={sx(b.midH)} y={sy(b.gamma) - 9} textAnchor="middle" fontSize={8}
              fill="currentColor" opacity={0.5}>{b.count}</text>
          </g>
        ))}
      </svg>

      <p className="mb-4 mt-1 text-xs text-ink/50 dark:text-paper/50">
        Gold circles = experimental semivariance from Bluewater Basin well pairs (number = pair count per bin).
        Teal curve = exponential model fit. Drag sliders to fit the model to the data.
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="flex justify-between text-sm">
            <span>Nugget</span>
            <span className="font-mono text-silt-500">{nugget.toFixed(1)}</span>
          </label>
          <input type="range" min={0} max={8} step={0.1} value={nugget}
            onChange={e => setNugget(parseFloat(e.target.value))}
            className="mt-2 w-full accent-silt-500" />
          <p className="mt-1 text-xs text-ink/45 dark:text-paper/45">Semivariance at distance zero — measurement noise and fine-scale variability.</p>
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Sill</span>
            <span className="font-mono text-signal-500">{sill.toFixed(1)}</span>
          </label>
          <input type="range" min={5} max={60} step={0.5} value={sill}
            onChange={e => setSill(parseFloat(e.target.value))}
            className="mt-2 w-full accent-signal-500" />
          <p className="mt-1 text-xs text-ink/45 dark:text-paper/45">Plateau semivariance — the total spatial variance when correlation is exhausted.</p>
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Range</span>
            <span className="font-mono text-basin-500">{range.toFixed(2)}</span>
          </label>
          <input type="range" min={0.05} max={0.8} step={0.01} value={range}
            onChange={e => setRange(parseFloat(e.target.value))}
            className="mt-2 w-full accent-basin-500" />
          <p className="mt-1 text-xs text-ink/45 dark:text-paper/45">Distance at which spatial correlation effectively ends.</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-ink px-4 py-3 font-mono text-sm text-paper">
        γ(h) = {nugget.toFixed(1)} + ({sill.toFixed(1)} − {nugget.toFixed(1)}) × (1 − e<sup>−h/{range.toFixed(2)}</sup>)
      </div>
    </div>
  );
}
