"use client";

import { useMemo, useState } from "react";

// Synthetic Bluewater Basin dataset: monthly rainfall (mm) vs streamflow (m3/s)
// at the Bluewater River gauge, generated once with a fixed seed so the
// scatter is stable across renders.
function generateData(n = 24) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: n }, () => {
    const rainfall = 20 + rand() * 180;
    const streamflow = 1.4 + rainfall * 0.19 + (rand() - 0.5) * 14;
    return { rainfall, streamflow: Math.max(streamflow, 0.5) };
  });
}

const data = generateData();

function ols(points: { x: number; y: number }[]) {
  const n = points.length;
  const meanX = points.reduce((s, p) => s + p.x, 0) / n;
  const meanY = points.reduce((s, p) => s + p.y, 0) / n;
  const num = points.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0);
  const den = points.reduce((s, p) => s + (p.x - meanX) ** 2, 0);
  const slope = num / den;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}

function rSquared(points: { x: number; y: number }[], slope: number, intercept: number) {
  const meanY = points.reduce((s, p) => s + p.y, 0) / points.length;
  const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
  const ssRes = points.reduce((s, p) => {
    const pred = slope * p.x + intercept;
    return s + (p.y - pred) ** 2;
  }, 0);
  return 1 - ssRes / ssTot;
}

const width = 600;
const height = 340;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };

export function RegressionExplorer() {
  const [manualSlope, setManualSlope] = useState<number | null>(null);
  const [showResiduals, setShowResiduals] = useState(true);

  const points = useMemo(
    () => data.map((d) => ({ x: d.rainfall, y: d.streamflow })),
    []
  );

  const fitted = useMemo(() => ols(points), [points]);
  const slope = manualSlope ?? fitted.slope;
  const intercept = manualSlope !== null
    ? points.reduce((s, p) => s + p.y, 0) / points.length - slope * (points.reduce((s, p) => s + p.x, 0) / points.length)
    : fitted.intercept;
  const r2 = rSquared(points, slope, intercept);

  const xMax = Math.max(...points.map((p) => p.x)) * 1.05;
  const yMax = Math.max(...points.map((p) => p.y)) * 1.15;

  const sx = (x: number) => margin.left + (x / xMax) * (width - margin.left - margin.right);
  const sy = (y: number) => height - margin.bottom - (y / yMax) * (height - margin.top - margin.bottom);

  const lineX1 = 0;
  const lineX2 = xMax;

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* axes */}
        <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="currentColor" opacity={0.25} />
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="currentColor" opacity={0.25} />
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
          Monthly rainfall (mm)
        </text>
        <text x={14} y={height / 2} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6} transform={`rotate(-90 14 ${height / 2})`}>
          Streamflow (m³/s)
        </text>

        {/* residuals */}
        {showResiduals &&
          points.map((p, i) => {
            const pred = slope * p.x + intercept;
            return (
              <line
                key={i}
                x1={sx(p.x)}
                y1={sy(p.y)}
                x2={sx(p.x)}
                y2={sy(pred)}
                stroke="#A97452"
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}

        {/* fit line */}
        <line
          x1={sx(lineX1)}
          y1={sy(slope * lineX1 + intercept)}
          x2={sx(lineX2)}
          y2={sy(slope * lineX2 + intercept)}
          stroke="#D4A72C"
          strokeWidth={2}
        />

        {/* points */}
        {points.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4} fill="#1D6E73" opacity={0.85} />
        ))}
      </svg>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="flex justify-between text-sm">
            <span>Slope override</span>
            <span className="font-mono text-basin-500">
              {manualSlope !== null ? manualSlope.toFixed(3) : `${fitted.slope.toFixed(3)} (best fit)`}
            </span>
          </label>
          <input
            type="range"
            min={-0.1}
            max={0.5}
            step={0.005}
            value={slope}
            onChange={(e) => setManualSlope(parseFloat(e.target.value))}
            className="mt-2 w-full accent-signal-500"
          />
          <button
            onClick={() => setManualSlope(null)}
            className="mt-2 text-xs text-basin-500 underline"
          >
            Reset to best fit
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showResiduals}
            onChange={(e) => setShowResiduals(e.target.checked)}
            className="accent-silt-500"
          />
          Show residuals
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 rounded-lg bg-ink px-4 py-3 font-mono text-sm text-paper">
        <span>slope = {slope.toFixed(3)}</span>
        <span>intercept = {intercept.toFixed(2)}</span>
        <span className={r2 < rSquared(points, fitted.slope, fitted.intercept) ? "text-red-400" : "text-signal-400"}>
          R² = {r2.toFixed(3)}
        </span>
      </div>
      <p className="mt-3 text-xs text-ink/50 dark:text-paper/50">
        Drag the slope away from &quot;best fit&quot; and watch R² drop — the ordinary
        least squares line specifically minimizes total squared residual
        distance, which is why it maximizes R² for a straight-line fit.
      </p>
    </div>
  );
}
