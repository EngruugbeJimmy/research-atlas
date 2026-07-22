"use client";

import { useMemo, useState } from "react";
import { buildGrid } from "@/lib/utils/synthetic-terrain";

const RES = 48;
const SIZE = 480;

export function ContourBuilder() {
  const [threshold, setThreshold] = useState(0.5);
  const grid = useMemo(() => buildGrid(RES), []);
  const cell = SIZE / RES;

  const maxZ = useMemo(
    () => Math.max(...grid.flat()),
    [grid]
  );

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full rounded-lg bg-basin-50/40 dark:bg-basin-700/10">
        {grid.map((row, j) =>
          row.map((z, i) => {
            const shade = 1 - z / maxZ;
            return (
              <rect
                key={`${i}-${j}`}
                x={i * cell}
                y={j * cell}
                width={cell}
                height={cell}
                fill={`rgba(29,110,115,${(0.06 + shade * 0.05).toFixed(3)})`}
              />
            );
          })
        )}
        {grid.map((row, j) =>
          row.map((z, i) => {
            const inBand = Math.abs(z - threshold * maxZ) < maxZ * 0.015;
            if (!inBand) return null;
            return (
              <rect
                key={`c-${i}-${j}`}
                x={i * cell}
                y={j * cell}
                width={cell}
                height={cell}
                fill="#D4A72C"
              />
            );
          })
        )}
      </svg>

      <div className="mt-6">
        <label className="flex justify-between text-sm">
          <span>Elevation threshold</span>
          <span className="font-mono text-basin-500">
            {(threshold * maxZ).toFixed(2)} (normalized units)
          </span>
        </label>
        <input
          type="range"
          min={0.02}
          max={0.98}
          step={0.01}
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="mt-2 w-full accent-signal-500"
        />
        <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">
          The gold band marks every grid cell close to your chosen elevation
          — exactly what a contour line traces on a real topographic map.
        </p>
      </div>
    </div>
  );
}
