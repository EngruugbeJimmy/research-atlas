"use client";

import { useMemo, useState } from "react";
import { buildGrid, steepestDescentPath } from "@/lib/utils/synthetic-terrain";

const RES = 48;
const SIZE = 480;

export function WatershedExplorer() {
  const grid = useMemo(() => buildGrid(RES), []);
  const cell = SIZE / RES;
  const maxZ = useMemo(() => Math.max(...grid.flat()), [grid]);
  const [path, setPath] = useState<{ i: number; j: number }[]>([]);

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * SIZE;
    const y = ((e.clientY - rect.top) / rect.height) * SIZE;
    const i = Math.min(RES - 1, Math.max(0, Math.floor(x / cell)));
    const j = Math.min(RES - 1, Math.max(0, Math.floor(y / cell)));
    setPath(steepestDescentPath(grid, { i, j }));
  }

  const pathPoints = path
    .map((p) => `${(p.i + 0.5) * cell},${(p.j + 0.5) * cell}`)
    .join(" ");

  const firstPoint = path[0];
  const lastPoint = path[path.length - 1];

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        onClick={handleClick}
        className="w-full cursor-crosshair rounded-lg bg-basin-50/40 dark:bg-basin-700/10"
      >
        {grid.map((row, j) =>
          row.map((z, i) => (
            <rect
              key={`${i}-${j}`}
              x={i * cell}
              y={j * cell}
              width={cell}
              height={cell}
              fill={`rgba(29,110,115,${(0.05 + (1 - z / maxZ) * 0.05).toFixed(3)})`}
            />
          ))
        )}
        {path.length > 1 && (
          <polyline
            points={pathPoints}
            fill="none"
            stroke="#D4A72C"
            strokeWidth={3}
            strokeLinecap="round"
          />
        )}
        {firstPoint && (
          <circle
            cx={(firstPoint.i + 0.5) * cell}
            cy={(firstPoint.j + 0.5) * cell}
            r={5}
            fill="#1D6E73"
          />
        )}
        {lastPoint && path.length > 1 && (
          <circle
            cx={(lastPoint.i + 0.5) * cell}
            cy={(lastPoint.j + 0.5) * cell}
            r={5}
            fill="#A97452"
          />
        )}
      </svg>
      <p className="mt-4 text-xs text-ink/50 dark:text-paper/50">
        Click anywhere on the basin. The line traces where a raindrop
        landing there would flow — always downhill toward the steepest
        neighbouring cell — until it reaches the outlet (clay marker) or a
        local low point.
      </p>
    </div>
  );
}
