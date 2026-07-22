// Deterministically generates a topographic contour field so the hero reads
// like a real survey plate of Bluewater Basin rather than a decorative blob.
// Pure function of its inputs — safe to render on the server.

function contourPath(seed: number, amplitude: number, yBase: number, width: number) {
  const points: string[] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const y =
      yBase +
      Math.sin(i * 0.6 + seed) * amplitude +
      Math.sin(i * 0.23 + seed * 1.7) * amplitude * 0.5;
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

export function ContourField({
  lines = 14,
  width = 1200,
  height = 640,
  className,
}: {
  lines?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const paths = Array.from({ length: lines }, (_, i) => {
    const yBase = (height / lines) * i + height * 0.08;
    return {
      d: contourPath(i * 0.9, 18 + i * 1.4, yBase, width),
      opacity: 0.12 + (i % 3) * 0.05,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          opacity={p.opacity}
        />
      ))}
      {/* survey markers */}
      {[
        { x: width * 0.18, y: height * 0.32, label: "GW-14" },
        { x: width * 0.62, y: height * 0.22, label: "RG-03" },
        { x: width * 0.78, y: height * 0.58, label: "WQ-09" },
      ].map((m) => (
        <g key={m.label} transform={`translate(${m.x},${m.y})`} opacity={0.5}>
          <circle r={4} fill="currentColor" />
          <text x={10} y={4} fontSize={11} fontFamily="var(--font-plex-mono)" fill="currentColor">
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
