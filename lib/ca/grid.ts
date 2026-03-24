export type Grid = Uint8Array;

export function createGrid(cols: number, rows: number): Grid {
  return new Uint8Array(cols * rows);
}

export function randomizeGrid(
  grid: Grid,
  density: number,
  rng: () => number = Math.random
): Grid {
  const next = grid.slice();
  const threshold = density;
  for (let i = 0; i < next.length; i += 1) {
    next[i] = rng() < threshold ? 1 : 0;
  }
  return next;
}

export function countNeighbors(
  grid: Grid,
  cols: number,
  rows: number,
  x: number,
  y: number
): number {
  let count = 0;
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      count += grid[ny * cols + nx];
    }
  }
  return count;
}

export function stepLife(
  grid: Grid,
  cols: number,
  rows: number
): Grid {
  const next = createGrid(cols, rows);
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const idx = y * cols + x;
      const neighbors = countNeighbors(grid, cols, rows, x, y);
      if (grid[idx] === 1) {
        next[idx] = neighbors === 2 || neighbors === 3 ? 1 : 0;
      } else {
        next[idx] = neighbors === 3 ? 1 : 0;
      }
    }
  }
  return next;
}

export function insertPattern(
  grid: Grid,
  cols: number,
  rows: number,
  points: Array<[number, number]>,
  offsetX: number,
  offsetY: number
): Grid {
  const next = grid.slice();
  for (const [dx, dy] of points) {
    const x = offsetX + dx;
    const y = offsetY + dy;
    if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
    next[y * cols + x] = 1;
  }
  return next;
}

export function gridStats(grid: Grid): { live: number; density: number } {
  let live = 0;
  for (let i = 0; i < grid.length; i += 1) {
    live += grid[i];
  }
  const density = grid.length ? live / grid.length : 0;
  return { live, density };
}