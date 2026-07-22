"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

type Sample = { slope: number; area: number; drain: number; flooded: boolean };
type NumericFeature = "slope" | "area" | "drain";

function makeSamples(n: number): Sample[] {
  const s = { v: 99 };
  const rand = () => { s.v = (s.v * 9301 + 49297) % 233280; return s.v / 233280; };
  return Array.from({ length: n }, () => {
    const slope = rand() * 18;
    const area = rand() * 50 + 1;
    const drain = rand() * 10;
    const flooded = slope < 4 && area > 15 && drain < 5;
    const noisy = rand() < 0.08 ? !flooded : flooded;
    return { slope: parseFloat(slope.toFixed(1)), area: parseFloat(area.toFixed(1)), drain: parseFloat(drain.toFixed(1)), flooded: noisy };
  });
}

interface TreeNode {
  feature?: NumericFeature;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: boolean;
  samples: number;
}

function giniImpurity(data: Sample[]): number {
  const p = data.filter(d => d.flooded).length / data.length;
  return 1 - p * p - (1 - p) * (1 - p);
}

function buildTree(data: Sample[], depth = 0, maxDepth = 3): TreeNode {
  const nFlooded = data.filter(d => d.flooded).length;
  if (depth >= maxDepth || data.length < 4) {
    return { prediction: nFlooded > data.length / 2, samples: data.length };
  }
  const features: NumericFeature[] = ["slope", "area", "drain"];
  let bestGini = Infinity;
  let bestFeat: NumericFeature = "slope";
  let bestThresh = 0;

  for (const feat of features) {
    const vals = [...new Set(data.map(d => d[feat]))].sort((a, b) => a - b);
    for (let i = 0; i < vals.length - 1; i++) {
      const thresh = (vals[i]! + vals[i + 1]!) / 2;
      const left = data.filter(d => d[feat] <= thresh);
      const right = data.filter(d => d[feat] > thresh);
      if (!left.length || !right.length) continue;
      const gini =
        (left.length / data.length) * giniImpurity(left) +
        (right.length / data.length) * giniImpurity(right);
      if (gini < bestGini) { bestGini = gini; bestFeat = feat; bestThresh = thresh; }
    }
  }

  return {
    feature: bestFeat,
    threshold: bestThresh,
    samples: data.length,
    left: buildTree(data.filter(d => d[bestFeat] <= bestThresh), depth + 1, maxDepth),
    right: buildTree(data.filter(d => d[bestFeat] > bestThresh), depth + 1, maxDepth),
  };
}

function bootstrapSample(data: Sample[], seed: number): Sample[] {
  const s = { v: seed };
  const rand = () => { s.v = (s.v * 9301 + 49297) % 233280; return Math.floor((s.v / 233280) * data.length); };
  return Array.from({ length: data.length }, () => data[rand()]!);
}

const FEAT_LABELS: Record<NumericFeature, string> = {
  slope: "Slope (%)", area: "Upstr. area (km²)", drain: "Soil drainage"
};

function TreeSVG({ node, x, y, spread }: { node: TreeNode; x: number; y: number; spread: number; depth: number }) {
  const child = spread / 2.2;
  const dy = 44;
  if (!node.feature) {
    return (
      <g>
        <rect x={x - 22} y={y - 11} width={44} height={22} rx={4}
          fill={node.prediction ? "#A97452" : "#1D6E73"} opacity={0.9} />
        <text x={x} y={y + 4} textAnchor="middle" fontSize={9} fill="#F1EDE4">
          {node.prediction ? "FLOOD" : "DRY"}
        </text>
      </g>
    );
  }
  return (
    <g>
      {node.left && (
        <>
          <line x1={x} y1={y + 11} x2={x - child} y2={y + dy - 11} stroke="#1D6E73" strokeWidth={1} opacity={0.4} />
          <TreeSVG node={node.left} x={x - child} y={y + dy} spread={child} depth={1} />
        </>
      )}
      {node.right && (
        <>
          <line x1={x} y1={y + 11} x2={x + child} y2={y + dy - 11} stroke="#1D6E73" strokeWidth={1} opacity={0.4} />
          <TreeSVG node={node.right} x={x + child} y={y + dy} spread={child} depth={1} />
        </>
      )}
      <rect x={x - 34} y={y - 11} width={68} height={22} rx={4} fill="#0E1B1F" stroke="#1D6E73" strokeWidth={1} />
      <text x={x} y={y - 1} textAnchor="middle" fontSize={8} fill="#7DB6B3">{FEAT_LABELS[node.feature]}</text>
      <text x={x} y={y + 8} textAnchor="middle" fontSize={9} fill="#D4A72C">≤ {node.threshold?.toFixed(1)}</text>
    </g>
  );
}

const samples = makeSamples(120);

export function RandomForestExplorer() {
  const [nTrees, setNTrees] = useState(1);
  const [revealed, setRevealed] = useState(0);

  const trees = Array.from({ length: nTrees }, (_, i) => buildTree(bootstrapSample(samples, i * 37 + 1)));
  const activeTree = trees[revealed] ?? trees[0]!;

  const importance: Record<NumericFeature, number> = { slope: 0, area: 0, drain: 0 };
  function countSplits(node: TreeNode) {
    if (!node.feature) return;
    importance[node.feature] = (importance[node.feature] ?? 0) + 1;
    if (node.left) countSplits(node.left);
    if (node.right) countSplits(node.right);
  }
  trees.forEach(t => countSplits(t));
  const totalSplits = Object.values(importance).reduce((s, v) => s + v, 0) || 1;

  const grow = useCallback(() => {
    if (nTrees < 12) { setNTrees(n => n + 1); setRevealed(nTrees); }
  }, [nTrees]);

  return (
    <div className="rounded-2xl border border-basin-500/15 p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {Array.from({ length: nTrees }, (_, i) => (
          <button key={i} onClick={() => setRevealed(i)}
            className={cn("h-8 w-8 rounded border font-mono text-xs transition",
              i === revealed ? "border-signal-500 bg-signal-500/20 text-signal-500" : "border-basin-500/30 text-basin-500 hover:bg-basin-500/10")}>
            T{i + 1}
          </button>
        ))}
        {nTrees < 12 && (
          <button onClick={grow}
            className="h-8 rounded border border-dashed border-basin-500/30 px-3 font-mono text-xs text-basin-500 hover:bg-basin-500/10">
            + Grow tree
          </button>
        )}
      </div>

      <svg viewBox="0 0 460 200" className="w-full rounded-lg bg-ink/5 dark:bg-basin-700/10"
        role="img" aria-label="Decision tree diagram showing flood prediction splits">
        <TreeSVG node={activeTree} x={230} y={24} spread={170} depth={0} />
      </svg>

      <div className="mt-5">
        <p className="type-eyebrow mb-3">Feature importance across {nTrees} tree{nTrees > 1 ? "s" : ""}</p>
        {(["slope", "area", "drain"] as NumericFeature[]).map(feat => (
          <div key={feat} className="mb-2 flex items-center gap-3 text-sm">
            <span className="w-32 font-mono text-xs text-basin-500">{FEAT_LABELS[feat]}</span>
            <div className="flex-1 overflow-hidden rounded-full bg-basin-500/10">
              <div className="h-2 rounded-full bg-basin-500 transition-all"
                style={{ width: `${(importance[feat] / totalSplits) * 100}%` }} />
            </div>
            <span className="w-10 text-right font-mono text-xs text-ink/50 dark:text-paper/50">
              {((importance[feat] / totalSplits) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink/50 dark:text-paper/50">
        Each tree trains on a bootstrap sample of 120 Bluewater Basin sites.
        The forest votes: a site is predicted flooded if the majority of trees say so.
        Feature importance shows which variables drive the most splits across all trees.
      </p>
    </div>
  );
}
