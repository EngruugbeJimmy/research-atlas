"use client";

import { useMemo, useState } from "react";

// Synthetic 5-year monthly nitrate record for well GW-14
// Trend: slow upward creep from agricultural loading
// Seasonal: higher in winter (recharge events push surface N down), lower in summer
// Residuals: realistic sensor noise + occasional events
function generateNitrateSeries() {
  const months = 60; // 5 years
  const seed = { v: 17 };
  const rand = () => { seed.v = (seed.v * 9301 + 49297) % 233280; return seed.v / 233280 - 0.5; };

  return Array.from({ length: months }, (_, i) => {
    const trend = 4.2 + i * 0.048;                         // slow linear rise
    const seasonal = -1.1 * Math.sin((2 * Math.PI * i) / 12 + 0.8); // winter peak
    const residual = rand() * 1.4 + rand() * 0.6;          // noise + occasional spikes
    return {
      month: i,
      trend: parseFloat(trend.toFixed(3)),
      seasonal: parseFloat(seasonal.toFixed(3)),
      residual: parseFloat(residual.toFixed(3)),
      total: parseFloat((trend + seasonal + residual).toFixed(3)),
    };
  });
}

const W = 580, H = 180;
const PAD = { l: 38, r: 12, t: 12, b: 28 };

export function TimeseriesExplorer() {
  const [showTrend, setShowTrend] = useState(true);
  const [showSeasonal, setShowSeasonal] = useState(false);
  const [showResidual, setShowResidual] = useState(false);

  const data = useMemo(() => generateNitrateSeries(), []);

  function buildLayer(key: "trend" | "seasonal" | "residual" | "total") {
    const vals = data.map(d => d[key]);
    const minV = Math.min(...vals);
    const maxV = Math.max(...vals);
    const range = maxV - minV || 1;
    const sx = (i: number) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
    const sy = (v: number) => PAD.t + (1 - (v - minV) / range) * (H - PAD.t - PAD.b);
    return data.map((d, i) => `${i === 0 ? "M" : "L"}${sx(i).toFixed(1)},${sy(d[key]).toFixed(1)}`).join(" ");
  }

  const years = [0, 12, 24, 36, 48, 60];
  const sx = (i: number) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {/* axes */}
        <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="currentColor" opacity={0.2} />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="currentColor" opacity={0.2} />
        {years.map(i => (
          <g key={i}>
            <line x1={sx(Math.min(i, data.length - 1))} y1={H - PAD.b} x2={sx(Math.min(i, data.length - 1))} y2={H - PAD.b + 4} stroke="currentColor" opacity={0.3} />
            <text x={sx(Math.min(i, data.length - 1))} y={H - PAD.b + 14} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.5}>
              Y{Math.floor(i / 12) + (i % 12 === 0 ? 1 : 0)}
            </text>
          </g>
        ))}

        {/* raw total always shown */}
        <path d={buildLayer("total")} fill="none" stroke="#1D6E73" strokeWidth={1.5} opacity={0.35} />

        {/* layers */}
        {showTrend && <path d={buildLayer("trend")} fill="none" stroke="#D4A72C" strokeWidth={2.5} />}
        {showSeasonal && <path d={buildLayer("seasonal")} fill="none" stroke="#7DB6B3" strokeWidth={2} strokeDasharray="6 3" />}
        {showResidual && <path d={buildLayer("residual")} fill="none" stroke="#A97452" strokeWidth={1.5} strokeDasharray="2 2" />}

        <text x={PAD.l - 5} y={PAD.t + 6} fontSize={9} textAnchor="end" fill="currentColor" opacity={0.5}>mg/L</text>
      </svg>

      <div className="mt-5 flex flex-wrap gap-4">
        {[
          { key: "showTrend", label: "Trend", color: "text-signal-500", state: showTrend, set: setShowTrend },
          { key: "showSeasonal", label: "Seasonal", color: "text-basin-300", state: showSeasonal, set: setShowSeasonal },
          { key: "showResidual", label: "Residual", color: "text-silt-500", state: showResidual, set: setShowResidual },
        ].map(({ key, label, color, state, set }) => (
          <label key={key} className={`flex items-center gap-2 cursor-pointer text-sm ${color}`}>
            <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className="accent-basin-500" />
            {label}
          </label>
        ))}
      </div>

      <p className="mt-3 text-xs text-ink/50 dark:text-paper/50">
        The teal line is the raw signal — everything combined. Toggle each layer to see what it contributes.
        The <span className="text-signal-400">trend</span> is the slow drift; the <span className="text-basin-300">seasonal</span> pattern repeats every 12 months; the <span className="text-silt-300">residual</span> is what&apos;s left over — noise and events.
      </p>
    </div>
  );
}
