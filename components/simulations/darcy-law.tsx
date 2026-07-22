"use client";

import { useEffect, useRef, useState } from "react";

// Darcy's Law: q = -K * (dh/dl)
// q: specific discharge (flow rate per unit area)
// K: hydraulic conductivity of the aquifer material
// dh/dl: hydraulic gradient (change in head over distance)

export function DarcyLawSimulation() {
  const [conductivity, setConductivity] = useState(5); // K, arbitrary units 1-10
  const [gradient, setGradient] = useState(0.03); // dh/dl, 0.005 - 0.08
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef(
    Array.from({ length: 40 }, () => ({
      x: Math.random() * 560,
      y: Math.random() * 220 + 40,
    }))
  );

  const discharge = conductivity * gradient; // q

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, 600, 300);

      // aquifer bounds
      ctx.strokeStyle = "rgba(29,110,115,0.35)";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 40, 560, 220);

      // sloped water table line, reflecting gradient
      ctx.beginPath();
      ctx.moveTo(20, 60);
      ctx.lineTo(580, 60 + gradient * 2000);
      ctx.strokeStyle = "rgba(212,167,44,0.8)";
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      const speed = discharge * 18;
      particlesRef.current.forEach((p) => {
        p.x += speed;
        if (p.x > 580) p.x = 20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#1D6E73";
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [discharge, gradient]);

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full rounded-lg bg-basin-50/40 dark:bg-basin-700/10"
        role="img"
        aria-label="Animation of groundwater particles flowing through an aquifer, speed determined by hydraulic conductivity and gradient"
      />

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="flex justify-between text-sm">
            <span>Hydraulic conductivity (K)</span>
            <span className="font-mono text-basin-500">{conductivity.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={0.1}
            value={conductivity}
            onChange={(e) => setConductivity(parseFloat(e.target.value))}
            className="mt-2 w-full accent-basin-500"
          />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
            How easily water moves through the aquifer material — gravel is high, clay is low.
          </p>
        </div>
        <div>
          <label className="flex justify-between text-sm">
            <span>Hydraulic gradient (dh/dl)</span>
            <span className="font-mono text-basin-500">{gradient.toFixed(3)}</span>
          </label>
          <input
            type="range"
            min={0.005}
            max={0.08}
            step={0.001}
            value={gradient}
            onChange={(e) => setGradient(parseFloat(e.target.value))}
            className="mt-2 w-full accent-basin-500"
          />
          <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
            The slope of the water table — the driving force behind groundwater flow.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-ink px-4 py-3 font-mono text-sm text-paper">
        q = K × (dh/dl) = {conductivity.toFixed(1)} × {gradient.toFixed(3)} ={" "}
        <span className="text-signal-400">{discharge.toFixed(3)}</span>
      </div>
    </div>
  );
}
