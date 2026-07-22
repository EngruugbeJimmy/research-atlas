"use client";

import { useState } from "react";

// Synthetic well locations across Bluewater Basin with multiple measurements
// Positions expressed as 0–1 normalised coordinates (x=west-east, y=north-south)
const wells = [
  { id: "GW-01", x: 0.15, y: 0.18, nitrate: 3.1, do: 9.2, conductivity: 312 },
  { id: "GW-02", x: 0.28, y: 0.12, nitrate: 2.8, do: 9.5, conductivity: 298 },
  { id: "GW-03", x: 0.42, y: 0.22, nitrate: 5.4, do: 8.8, conductivity: 341 },
  { id: "GW-04", x: 0.55, y: 0.18, nitrate: 7.2, do: 8.1, conductivity: 378 },
  { id: "GW-05", x: 0.68, y: 0.28, nitrate: 9.8, do: 7.4, conductivity: 425 },
  { id: "GW-06", x: 0.78, y: 0.38, nitrate: 12.4, do: 6.9, conductivity: 468 },
  { id: "GW-07", x: 0.82, y: 0.52, nitrate: 11.1, do: 7.1, conductivity: 451 },
  { id: "GW-08", x: 0.72, y: 0.62, nitrate: 8.6, do: 7.8, conductivity: 402 },
  { id: "GW-09", x: 0.58, y: 0.72, nitrate: 6.3, do: 8.3, conductivity: 365 },
  { id: "GW-10", x: 0.45, y: 0.78, nitrate: 4.1, do: 8.9, conductivity: 328 },
  { id: "GW-11", x: 0.32, y: 0.68, nitrate: 3.5, do: 9.1, conductivity: 315 },
  { id: "GW-12", x: 0.22, y: 0.58, nitrate: 2.9, do: 9.4, conductivity: 302 },
  { id: "GW-13", x: 0.18, y: 0.45, nitrate: 3.8, do: 9.0, conductivity: 318 },
  { id: "GW-14", x: 0.62, y: 0.45, nitrate: 13.2, do: 6.5, conductivity: 489 },
  { id: "GW-15", x: 0.38, y: 0.42, nitrate: 4.9, do: 8.6, conductivity: 347 },
] as const;

type Variable = "nitrate" | "do" | "conductivity";

const varConfig: Record<Variable, { label: string; unit: string; low: number; high: number; lowColor: string; highColor: string }> = {
  nitrate:      { label: "Nitrate",      unit: "mg/L",  low: 2,   high: 14,  lowColor: "#CFE6E4", highColor: "#A97452" },
  do:           { label: "Dissolved O₂", unit: "mg/L",  low: 6,   high: 10,  lowColor: "#A97452", highColor: "#1D6E73" },
  conductivity: { label: "Conductivity", unit: "µS/cm", low: 290, high: 500, lowColor: "#CFE6E4", highColor: "#132428" },
};

function lerp(a: string, b: string, t: number): string {
  const hr = (s: string, i: number) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16);
  return `rgb(${[0,1,2].map(i => Math.round(hr(a,i) + (hr(b,i) - hr(a,i)) * t)).join(",")})`;
}

export function SpatialExplorer() {
  const [variable, setVariable] = useState<Variable>("nitrate");
  const [hovered, setHovered] = useState<string | null>(null);
  const W = 500, H = 380;

  const cfg = varConfig[variable];
  const sx = (x: number) => x * (W - 40) + 20;
  const sy = (y: number) => y * (H - 40) + 20;

  const colorOf = (well: typeof wells[number]) => {
    const v = well[variable];
    const t = Math.max(0, Math.min(1, (v - cfg.low) / (cfg.high - cfg.low)));
    return lerp(cfg.lowColor, cfg.highColor, t);
  };

  const hoveredWell = hovered ? wells.find(w => w.id === hovered) : null;

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <div className="mb-4 flex flex-wrap gap-3">
        {(["nitrate", "do", "conductivity"] as Variable[]).map(v => (
          <button key={v} onClick={() => setVariable(v)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${variable === v ? "bg-basin-500 text-paper" : "border border-basin-500/25 text-basin-500 hover:bg-basin-500/10"}`}>
            {varConfig[v].label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg bg-basin-50/40 dark:bg-basin-700/10">
        {/* Bluewater Basin outline approximation */}
        <path d="M 60 40 Q 200 20 360 50 Q 460 70 480 180 Q 490 290 420 350 Q 320 380 200 360 Q 100 340 50 260 Q 20 180 60 40 Z"
          fill="none" stroke="#1D6E73" strokeWidth={1.5} opacity={0.2} />
        {/* Agricultural zone indication */}
        <rect x={sx(0.45)} y={sy(0.12)} width={sx(0.38) - sx(0.38) + 130} height={75} fill="#D4A72C" opacity={0.06} rx={6} />
        <text x={sx(0.56)} y={sy(0.16) + 12} fontSize={9} fill="#D4A72C" opacity={0.7} textAnchor="middle">Agricultural zone</text>

        {/* Wells */}
        {wells.map(w => (
          <g key={w.id} onMouseEnter={() => setHovered(w.id)} onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}>
            <circle cx={sx(w.x)} cy={sy(w.y)} r={hovered === w.id ? 13 : 10}
              fill={colorOf(w)} stroke={hovered === w.id ? "#D4A72C" : "#1D6E73"}
              strokeWidth={hovered === w.id ? 2 : 1} opacity={0.9} />
            <text x={sx(w.x)} y={sy(w.y) + 3.5} textAnchor="middle" fontSize={8}
              fill={variable === "do" ? "#0E1B1F" : "#F1EDE4"} fontFamily="monospace" fontWeight="500">
              {w.id.replace("GW-", "")}
            </text>
          </g>
        ))}

        {/* Tooltip */}
        {hoveredWell && (
          <g transform={`translate(${Math.min(sx(hoveredWell.x) + 14, W - 110)}, ${Math.max(sy(hoveredWell.y) - 44, 4)})`}>
            <rect width={105} height={50} rx={6} fill="#0E1B1F" opacity={0.92} />
            <text x={8} y={16} fontSize={11} fill="#D4A72C" fontFamily="monospace" fontWeight="600">{hoveredWell.id}</text>
            <text x={8} y={30} fontSize={10} fill="#F1EDE4" opacity={0.9}>
              {cfg.label}: {hoveredWell[variable]} {cfg.unit}
            </text>
            <text x={8} y={44} fontSize={9} fill="#7DB6B3" opacity={0.75}>
              {variable === "nitrate" && hoveredWell.nitrate > 10 ? "⚠ above 10 mg/L limit" :
               variable === "do" && hoveredWell.do < 7 ? "⚠ low oxygen" : "within normal range"}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-3 text-xs text-ink/60 dark:text-paper/60">
        <span>{cfg.low} {cfg.unit}</span>
        <div className="h-2 flex-1 rounded-full" style={{
          background: `linear-gradient(to right, ${cfg.lowColor}, ${cfg.highColor})`
        }} />
        <span>{cfg.high} {cfg.unit}</span>
      </div>
      <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">
        Hover any well to see its reading. Notice how nitrate concentrations are highest near the agricultural zone (northeast), while dissolved oxygen is lowest there — a classic signature of nutrient contamination.
      </p>
    </div>
  );
}
