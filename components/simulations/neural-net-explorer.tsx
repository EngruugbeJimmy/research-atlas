"use client";

import { useMemo, useState } from "react";

// Synthetic, sparse groundwater head observations along a transect away from
// a pumping well — exactly the kind of sparse, noisy data a real hybrid
// model has to work with. Head should decrease monotonically with distance
// (that's what Darcy's Law requires for steady radial flow to a well).
function generateHeadData() {
  let seed = 11;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const points = [2, 8, 15, 25, 40, 60, 85, 110].map((distance) => {
    const trueHead = 42 - 14 * Math.log(distance / 2 + 1);
    const noisy = trueHead + (rand() - 0.5) * 3.5;
    return { distance, head: noisy };
  });
  return points;
}

const data = generateHeadData();

// Flexible fit: a high-degree polynomial-ish interpolation that can wiggle
// and even rise where noise happens to push it up — this is what a
// data-only neural network tends to do with only eight points.
function flexibleFit(x: number, wiggle: number) {
  const base = 42 - 14 * Math.log(x / 2 + 1);
  const wobble =
    Math.sin(x / 6) * wiggle * 4 + Math.sin(x / 17 + 1) * wiggle * 2.5;
  return base + wobble;
}

// Physics-informed fit: constrained to be monotonically non-increasing,
// exactly as Darcy's Law demands for this configuration — a smooth
// logarithmic drawdown curve.
function physicsFit(x: number) {
  return 42 - 14 * Math.log(x / 2 + 1);
}

const width = 600;
const height = 320;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const xMax = 120;
const yMax = 45;

export function NeuralNetExplorer() {
  const [physicsWeight, setPhysicsWeight] = useState(0.4);

  const sx = (x: number) => margin.left + (x / xMax) * (width - margin.left - margin.right);
  const sy = (y: number) => height - margin.bottom - (y / yMax) * (height - margin.top - margin.bottom);

  const curve = useMemo(() => {
    const steps = 80;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const x = (xMax / steps) * i;
      const flexible = flexibleFit(x, 1 - physicsWeight);
      const physics = physicsFit(x);
      const blended = flexible * (1 - physicsWeight) + physics * physicsWeight;
      return { x, y: blended };
    });
  }, [physicsWeight]);

  const path = curve.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`).join(" ");

  // A simple violation check: does the blended curve ever increase with distance?
  const violatesPhysics = curve.some((p, i) => {
    if (i === 0) return false;
    const prev = curve[i - 1];
    return prev !== undefined && p.y > prev.y + 0.05;
  });

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="currentColor" opacity={0.25} />
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="currentColor" opacity={0.25} />
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
          Distance from well (m)
        </text>
        <text x={14} y={height / 2} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6} transform={`rotate(-90 14 ${height / 2})`}>
          Head (m)
        </text>

        <path d={path} fill="none" stroke={violatesPhysics ? "#c0392b" : "#1D6E73"} strokeWidth={2.5} />

        {data.map((d, i) => (
          <circle key={i} cx={sx(d.distance)} cy={sy(d.head)} r={4} fill="#A97452" />
        ))}
      </svg>

      <div className="mt-6">
        <label className="flex justify-between text-sm">
          <span>Physics constraint weight</span>
          <span className="font-mono text-basin-500">{physicsWeight.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={physicsWeight}
          onChange={(e) => setPhysicsWeight(parseFloat(e.target.value))}
          className="mt-2 w-full accent-basin-500"
        />
        <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">
          At weight 0, the curve fits only the eight noisy points — with so
          little data it can bend upward, which is physically impossible for
          steady flow to a pumping well. Increasing the weight blends in
          Darcy&apos;s Law&apos;s monotonic drawdown shape as a constraint.
        </p>
      </div>

      <div className={`mt-4 rounded-lg px-4 py-3 font-mono text-sm ${violatesPhysics ? "bg-red-900/80 text-red-100" : "bg-ink text-paper"}`}>
        {violatesPhysics
          ? "⚠ This curve rises somewhere — physically impossible for this well configuration."
          : "✓ Head decreases monotonically with distance — consistent with Darcy's Law."}
      </div>
    </div>
  );
}
