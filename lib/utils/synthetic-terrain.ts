// A small, deterministic synthetic elevation field standing in for Bluewater
// Basin's DEM inside browser-side simulations. Ridge in the northwest,
// coastal outlet in the southeast — matches the narrative in the lessons.
export function elevationAt(xNorm: number, yNorm: number): number {
  const ridge = Math.max(0, 1 - Math.hypot(xNorm - 0.15, yNorm - 0.15) * 1.1);
  const secondary = Math.max(0, 1 - Math.hypot(xNorm - 0.55, yNorm - 0.3) * 1.6) * 0.5;
  const coastalPull = (1 - xNorm) * 0.15 + (1 - yNorm) * 0.05;
  return Math.max(0, ridge * 1.0 + secondary - coastalPull * 0.3);
}

export function buildGrid(resolution: number): number[][] {
  const grid: number[][] = [];
  for (let j = 0; j < resolution; j++) {
    const row: number[] = [];
    for (let i = 0; i < resolution; i++) {
      row.push(elevationAt(i / (resolution - 1), j / (resolution - 1)));
    }
    grid.push(row);
  }
  return grid;
}

export function steepestDescentPath(
  grid: number[][],
  start: { i: number; j: number },
  maxSteps = 60
): { i: number; j: number }[] {
  const path = [start];
  let current = start;
  const res = grid.length;

  for (let step = 0; step < maxSteps; step++) {
    const { i, j } = current;
    let bestI = i;
    let bestJ = j;
    let bestZ = grid[j]?.[i] ?? Infinity;

    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        const ni = i + di;
        const nj = j + dj;
        if (ni < 0 || nj < 0 || ni >= res || nj >= res) continue;
        const z = grid[nj]?.[ni] ?? Infinity;
        if (z < bestZ) {
          bestZ = z;
          bestI = ni;
          bestJ = nj;
        }
      }
    }
    if (bestI === current.i && bestJ === current.j) break;
    path.push({ i: bestI, j: bestJ });
    current = { i: bestI, j: bestJ };
  }
  return path;
}
