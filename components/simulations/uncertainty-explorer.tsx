"use client";

import { useMemo, useState } from "react";

function makeData(n = 22) {
  let seed = 13;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const rainfall = 20 + rand() * 180;
    const streamflow = 1.4 + rainfall * 0.19 + (rand() - 0.5) * 16;
    pts.push({ x: rainfall, y: Math.max(streamflow, 0.5) });
  }
  return pts;
}

const baseData = makeData();

function ols(points: { x: number; y: number }[]) {
  const n = points.length;
  const meanX = points.reduce((s, p) => s + p.x, 0) / n;
  const meanY = points.reduce((s, p) => s + p.y, 0) / n;
  const num = points.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0);
  const den = points.reduce((s, p) => s + (p.x - meanX) ** 2, 0) || 1e-6;
  const slope = num / den;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}

// Deterministic pseudo-random bootstrap resample so results are stable
// across re-renders for a given seed.
function bootstrapSample(points: { x: number; y: number }[], seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const result: { x: number; y: number }[] = [];
  for (let i = 0; i < points.length; i++) {
    const idx = Math.floor(rand() * points.length);
    const point = points[idx] ?? points[0];
    if (point) result.push(point);
  }
  return result;
}

const width = 600;
const height = 340;
const margin = { top: 20, right: 20, bottom: 40, left: 50 };

export function UncertaintyExplorer() {
  const [ensembleSize, setEnsembleSize] = useState(20);
  const [confidenceBand, setConfidenceBand] = useState(80); // percentile width

  const fits = useMemo(() => {
    return Array.from({ length: ensembleSize }, (_, i) => {
      const sample = bootstrapSample(baseData, 100 + i * 37);
      return ols(sample);
    });
  }, [ensembleSize]);

  const xMax = Math.max(...baseData.map((p) => p.x)) * 1.05;
  const yMax = Math.max(...baseData.map((p) => p.y)) * 1.2;
  const sx = (x: number) => margin.left + (x / xMax) * (width - margin.left - margin.right);
  const sy = (y: number) => height - margin.bottom - (y / yMax) * (height - margin.top - margin.bottom);

  const steps = 40;
  const band = useMemo(() => {
    const lower = (100 - confidenceBand) / 2 / 100;
    const upper = 1 - lower;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const x = (xMax / steps) * i;
      const ys = fits.map((f) => f.slope * x + f.intercept).sort((a, b) => a - b);
      const lo = ys[Math.floor(lower * (ys.length - 1))] ?? ys[0] ?? 0;
      const hi = ys[Math.floor(upper * (ys.length - 1))] ?? ys[ys.length - 1] ?? 0;
      return { x, lo, hi };
    });
  }, [fits, confidenceBand, xMax]);

  const bandPath =
    band.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.hi)}`).join(" ") +
    " " +
    band
      .slice()
      .reverse()
      .map((p) => `L${sx(p.x)},${sy(p.lo)}`)
      .join(" ") +
    " Z";

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="currentColor" opacity={0.25} />
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="currentColor" opacity={0.25} />
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6}>
          Monthly rainfall (mm)
        </text>
        <text x={14} y={height / 2} textAnchor="middle" fontSize={11} fill="currentColor" opacity={0.6} transform={`rotate(-90 14 ${height / 2})`}>
          Streamflow (m³/s)
        </text>

        <path d={bandPath} fill="#D4A72C" opacity={0.18} stroke="none" />

        {fits.slice(0, 20).map((f, i) => (
          <line
            key={i}
            x1={sx(0)}
            y1={sy(f.intercept)}
            x2={sx(xMax)}
            y2={sy(f.slope * xMax + f.intercept)}
            stroke="#1D6E73"
            strokeWidth={0.6}
            opacity={0.35}
          />
        ))}

        {baseData.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={3.5} fill="#A97452" />
        ))}
      </svg>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="flex justify-between text-sm">
            <span>Ensemble size (bootstrap resamples)</span>
            <span className="font-mono text-basin-500">{ensembleSize}</span>
          </label>
          <input
            type="range"
            min={3}
            max={60}
            step={1}
            value={ensembleSize}
            onChange={(e) => setEnsembleSize(parseInt(e.target.value))}
            className="mt-2 w-full accent-basin-500"
          />
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Interval width</span>
            <span className="font-mono text-basin-500">{confidenceBand}%</span>
          </label>
          <input
            type="range"
            min={50}
            max={98}
            step={2}
            value={confidenceBand}
            onChange={(e) => setConfidenceBand(parseInt(e.target.value))}
            className="mt-2 w-full accent-signal-500"
          />
        </div>
      </div>
      <p className="mt-4 text-xs text-ink/50 dark:text-paper/50">
        Each thin teal line is one regression fit to a bootstrap resample of
        the same 22 data points — resampling with replacement simulates
        &quot;what if we&apos;d collected slightly different data by chance?&quot;
        The gold band is the spread of predictions across the ensemble at
        each rainfall value: your honest uncertainty, not a single
        overconfident line.
      </p>
    </div>
  );
}
