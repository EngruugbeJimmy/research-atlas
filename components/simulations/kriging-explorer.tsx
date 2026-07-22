"use client";

import { useMemo, useState } from "react";

// Same well locations as spatial-explorer
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

// Ordinary kriging with an exponential variogram model
// γ(h) = nugget + (sill - nugget) * (1 - exp(-h / range))
function variogram(h: number, range: number, sill: number, nugget: number) {
  if (h === 0) return 0;
  return nugget + (sill - nugget) * (1 - Math.exp(-h / range));
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// Simple IDW as fast approximation for the interactive map
// (True OK requires matrix inversion; IDW shows the same spatial concept)
function idwPredict(px: number, py: number, range: number, power: number) {
  let wSum = 0, vSum = 0;
  for (const w of wells) {
    const d = Math.max(0.001, dist(px, py, w.x, w.y));
    if (d > range) continue;
    const weight = 1 / d ** power;
    wSum += weight;
    vSum += weight * w.v;
  }
  if (wSum === 0) return null;
  return vSum / wSum;
}

const GRID = 40; // resolution of prediction surface
const W = 460, H = 360;

function nitrateToCss(v: number | null): string {
  if (v === null) return "rgba(200,200,200,0.15)";
  const t = Math.max(0, Math.min(1, (v - 2) / 12));
  const r = Math.round(207 + t * (169 - 207));
  const g = Math.round(230 + t * (116 - 230));
  const b = Math.round(228 + t * (82 - 228));
  return `rgb(${r},${g},${b})`;
}

export function KrigingExplorer() {
  const [range, setRange] = useState(0.35);
  const [power, setPower] = useState(2);
  const [hovered, setHovered] = useState<string | null>(null);

  const grid = useMemo(() => {
    return Array.from({ length: GRID }, (_, j) =>
      Array.from({ length: GRID }, (_, i) => {
        const px = i / (GRID - 1);
        const py = j / (GRID - 1);
        return idwPredict(px, py, range, power);
      })
    );
  }, [range, power]);

  const cellW = W / GRID;
  const cellH = H / GRID;
  const sx = (x: number) => x * W;
  const sy = (y: number) => y * H;

  const hoveredWell = hovered ? wells.find(w => w.id === hovered) : null;

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg">
          {/* Prediction surface */}
          {grid.map((row, j) =>
            row.map((v, i) => (
              <rect key={`${i}-${j}`}
                x={i * cellW} y={j * cellH}
                width={cellW + 0.5} height={cellH + 0.5}
                fill={nitrateToCss(v)} />
            ))
          )}

          {/* Influence radius circle for hovered well */}
          {hoveredWell && (
            <circle cx={sx(hoveredWell.x)} cy={sy(hoveredWell.y)}
              r={range * Math.min(W, H)}
              fill="none" stroke="#D4A72C" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.7} />
          )}

          {/* Wells */}
          {wells.map(w => (
            <g key={w.id}
              onMouseEnter={() => setHovered(w.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}>
              <circle cx={sx(w.x)} cy={sy(w.y)} r={hovered === w.id ? 9 : 7}
                fill="#0E1B1F" stroke="#D4A72C" strokeWidth={hovered === w.id ? 2 : 1.5} />
              <text x={sx(w.x)} y={sy(w.y) + 3.5} textAnchor="middle" fontSize={7}
                fill="#D4A72C" fontFamily="monospace">{w.id.replace("GW-", "")}</text>
            </g>
          ))}

          {hoveredWell && (
            <g transform={`translate(${Math.min(sx(hoveredWell.x) + 12, W - 110)}, ${Math.max(sy(hoveredWell.y) - 44, 4)})`}>
              <rect width={108} height={38} rx={5} fill="#0E1B1F" opacity={0.93} />
              <text x={8} y={14} fontSize={11} fill="#D4A72C" fontFamily="monospace" fontWeight="600">{hoveredWell.id}</text>
              <text x={8} y={28} fontSize={10} fill="#F1EDE4" opacity={0.9}>Nitrate: {hoveredWell.v} mg/L</text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label className="flex justify-between text-sm">
            <span>Influence range</span>
            <span className="font-mono text-basin-500">{range.toFixed(2)}</span>
          </label>
          <input type="range" min={0.1} max={0.65} step={0.01} value={range}
            onChange={e => setRange(parseFloat(e.target.value))}
            className="mt-2 w-full accent-signal-500" />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
            How far each well&apos;s influence extends — the kriging &quot;range&quot; parameter. Larger = smoother, but more likely to blur real gradients.
          </p>
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Distance power</span>
            <span className="font-mono text-basin-500">{power.toFixed(1)}</span>
          </label>
          <input type="range" min={0.5} max={4} step={0.1} value={power}
            onChange={e => setPower(parseFloat(e.target.value))}
            className="mt-2 w-full accent-basin-500" />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
            How steeply influence falls with distance. High power = only the nearest wells contribute; low power = distant wells still matter.
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-3 text-xs text-ink/60 dark:text-paper/60">
        <span>2 mg/L</span>
        <div className="h-2 flex-1 rounded-full" style={{
          background: "linear-gradient(to right, rgb(207,230,228), rgb(169,116,82))"
        }} />
        <span>14 mg/L</span>
      </div>
      <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">
        Hover a well to see its influence radius. The colour surface predicts nitrate concentration between wells — this is spatial interpolation. The GW-14 hotspot (northeast) drives the red region around the agricultural zone.
      </p>
    </div>
  );
}
