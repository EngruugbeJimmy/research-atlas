"use client";

import { useMemo, useState } from "react";

// Synthetic Bluewater River storm hydrograph
// Convolution of rainfall pulse with a unit hydrograph shape
function generateHydrograph(lag: number, peakMagnitude: number, baseflow: number) {
  const hours = 72;
  // Rainfall: 3 events
  const rainfall = Array(hours).fill(0) as number[];
  [[6, 8], [8, 18], [9, 26], [5, 27], [3, 28], [12, 44], [9, 45], [6, 46]].forEach(([mm, h]) => {
    if (h !== undefined && mm !== undefined) rainfall[h] = mm;
  });

  // Unit hydrograph shape (gamma-like rise and exponential recession)
  const uh = Array.from({ length: 24 }, (_, k) => {
    const t = k + 1;
    return peakMagnitude * (t / 6) * Math.exp(1 - t / 6);
  });

  // Convolve with lag
  const quickflow = Array(hours).fill(0) as number[];
  rainfall.forEach((r, t) => {
    if (r === 0) return;
    uh.forEach((u, k) => {
      const idx = t + k + Math.round(lag);
      if (idx < hours) quickflow[idx] = (quickflow[idx] ?? 0) + r * u * 0.012;
    });
  });

  return rainfall.map((r, t) => ({
    hour: t,
    rainfall: r,
    streamflow: parseFloat(((quickflow[t] ?? 0) + baseflow).toFixed(3)),
    quickflow: parseFloat((quickflow[t] ?? 0).toFixed(3)),
  }));
}

const W = 580, H = 200, PAD = { l: 42, r: 12, t: 10, b: 30 };

export function HydrographExplorer() {
  const [lag, setLag] = useState(3);
  const [peak, setPeak] = useState(6);
  const [baseflow, setBaseflow] = useState(0.4);

  const data = useMemo(() => generateHydrograph(lag, peak, baseflow), [lag, peak, baseflow]);

  const maxQ = Math.max(...data.map(d => d.streamflow)) * 1.15;
  const maxR = Math.max(...data.map(d => d.rainfall)) * 1.2;

  const sx = (h: number) => PAD.l + (h / (data.length - 1)) * (W - PAD.l - PAD.r);
  const syQ = (q: number) => PAD.t + (1 - q / maxQ) * (H - PAD.t - PAD.b);
  const syR = (r: number) => H - PAD.b - (r / maxR) * 40; // rainfall bars at bottom

  const flowPath = data.map((d, i) => `${i === 0 ? "M" : "L"}${sx(d.hour).toFixed(1)},${syQ(d.streamflow).toFixed(1)}`).join(" ");

  // Find peak flow time for annotation
  const peakIdx = data.reduce((best, d, i) => d.streamflow > (data[best]?.streamflow ?? 0) ? i : best, 0);
  const peakData = data[peakIdx];

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* Axes */}
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="currentColor" opacity={0.2} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="currentColor" opacity={0.2} />

        {/* Time axis labels */}
        {[0, 12, 24, 36, 48, 60, 72].map(h => (
          <text key={h} x={sx(Math.min(h, 71))} y={H - PAD.b + 14} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.5}>
            {h}h
          </text>
        ))}
        <text x={PAD.l - 6} y={PAD.t + 8} textAnchor="end" fontSize={9} fill="#1D6E73" opacity={0.7}>m³/s</text>

        {/* Rainfall bars at bottom */}
        {data.filter(d => d.rainfall > 0).map(d => (
          <rect key={d.hour}
            x={sx(d.hour) - 3} y={syR(d.rainfall)}
            width={6} height={H - PAD.b - syR(d.rainfall)}
            fill="#7DB6B3" opacity={0.6} />
        ))}
        <text x={W - PAD.r} y={H - PAD.b - 8} textAnchor="end" fontSize={9} fill="#7DB6B3" opacity={0.7}>rainfall</text>

        {/* Baseflow reference */}
        <line x1={PAD.l} y1={syQ(baseflow)} x2={W - PAD.r} y2={syQ(baseflow)}
          stroke="#1D6E73" strokeWidth={1} strokeDasharray="4 3" opacity={0.4} />

        {/* Hydrograph */}
        <path d={flowPath} fill="none" stroke="#1D6E73" strokeWidth={2.5} />

        {/* Peak annotation */}
        {peakData && peakIdx > 0 && (
          <g>
            <line x1={sx(peakData.hour)} y1={syQ(peakData.streamflow) - 4}
              x2={sx(peakData.hour)} y2={syQ(peakData.streamflow) - 18}
              stroke="#D4A72C" strokeWidth={1.5} />
            <text x={sx(peakData.hour)} y={syQ(peakData.streamflow) - 22}
              textAnchor="middle" fontSize={10} fill="#D4A72C">
              Peak {peakData.streamflow.toFixed(2)} m³/s
            </text>
          </g>
        )}
      </svg>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <div>
          <label className="flex justify-between text-sm">
            <span>Lag time</span>
            <span className="font-mono text-basin-500">{lag}h</span>
          </label>
          <input type="range" min={0} max={12} step={1} value={lag}
            onChange={e => setLag(parseInt(e.target.value))}
            className="mt-2 w-full accent-signal-500" />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">How long after rain before the stream responds — longer in large or forested basins.</p>
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Peak multiplier</span>
            <span className="font-mono text-basin-500">{peak}×</span>
          </label>
          <input type="range" min={1} max={14} step={0.5} value={peak}
            onChange={e => setPeak(parseFloat(e.target.value))}
            className="mt-2 w-full accent-basin-500" />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">How flashy the basin responds — steep, impervious basins spike higher and faster.</p>
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Baseflow</span>
            <span className="font-mono text-basin-500">{baseflow.toFixed(2)} m³/s</span>
          </label>
          <input type="range" min={0.1} max={2} step={0.05} value={baseflow}
            onChange={e => setBaseflow(parseFloat(e.target.value))}
            className="mt-2 w-full accent-silt-500" />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">Background groundwater contribution — the floor the hydrograph rises from.</p>
        </div>
      </div>
    </div>
  );
}
