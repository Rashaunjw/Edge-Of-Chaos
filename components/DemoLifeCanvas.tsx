"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createGrid,
  insertPattern,
  stepLife,
} from "@/lib/ca/grid";

const CELL = 10;

const PRESETS = [
  // ── Still Lifes ──────────────────────────────────────────────────────────
  {
    label: "Block",
    category: "Still Life",
    points: [
      [0, 0], [1, 0],
      [0, 1], [1, 1],
    ] as Array<[number, number]>,
  },
  {
    label: "Beehive",
    category: "Still Life",
    points: [
      [1, 0], [2, 0],
      [0, 1], [3, 1],
      [1, 2], [2, 2],
    ] as Array<[number, number]>,
  },
  // ── Oscillators ──────────────────────────────────────────────────────────
  {
    label: "Blinker",
    category: "Oscillator",
    points: [[-1, 0], [0, 0], [1, 0]] as Array<[number, number]>,
  },
  {
    label: "Toad",
    category: "Oscillator",
    points: [
      [1, 0], [2, 0], [3, 0],
      [0, 1], [1, 1], [2, 1],
    ] as Array<[number, number]>,
  },
  {
    label: "Beacon",
    category: "Oscillator",
    points: [
      [0, 0], [1, 0],
      [0, 1],
      [3, 2],
      [2, 3], [3, 3],
    ] as Array<[number, number]>,
  },
  {
    label: "Pulsar",
    category: "Oscillator",
    points: [
      [2, 0], [3, 0], [4, 0], [8, 0], [9, 0], [10, 0],
      [0, 2], [5, 2], [7, 2], [12, 2],
      [0, 3], [5, 3], [7, 3], [12, 3],
      [0, 4], [5, 4], [7, 4], [12, 4],
      [2, 5], [3, 5], [4, 5], [8, 5], [9, 5], [10, 5],
      [2, 7], [3, 7], [4, 7], [8, 7], [9, 7], [10, 7],
      [0, 8], [5, 8], [7, 8], [12, 8],
      [0, 9], [5, 9], [7, 9], [12, 9],
      [0, 10], [5, 10], [7, 10], [12, 10],
      [2, 12], [3, 12], [4, 12], [8, 12], [9, 12], [10, 12],
    ] as Array<[number, number]>,
  },
  {
    label: "Pentadecathlon",
    category: "Oscillator",
    points: [
      [2, 0], [8, 0],
      [0, 1], [1, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [9, 1], [10, 1],
      [2, 2], [8, 2],
    ] as Array<[number, number]>,
  },
  // ── Spaceships ───────────────────────────────────────────────────────────
  {
    label: "Glider",
    category: "Spaceship",
    points: [
      [1, 0], [2, 1], [0, 2], [1, 2], [2, 2],
    ] as Array<[number, number]>,
  },
  {
    label: "LWSS",
    category: "Spaceship",
    points: [
      [0, 0], [3, 0],
      [4, 1],
      [0, 2], [4, 2],
      [1, 3], [2, 3], [3, 3], [4, 3],
    ] as Array<[number, number]>,
  },
  {
    label: "MWSS",
    category: "Spaceship",
    points: [
      [2, 0], [3, 0],
      [0, 1], [4, 1],
      [4, 2],
      [0, 3], [4, 3],
      [1, 4], [2, 4], [3, 4], [4, 4],
    ] as Array<[number, number]>,
  },
  {
    label: "HWSS",
    category: "Spaceship",
    points: [
      [2, 0], [3, 0], [4, 0],
      [0, 1], [5, 1],
      [5, 2],
      [0, 3], [5, 3],
      [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
    ] as Array<[number, number]>,
  },
  // ── Guns ─────────────────────────────────────────────────────────────────
  {
    label: "Glider Gun",
    category: "Gun",
    points: [
      [0, 4], [1, 4], [0, 5], [1, 5],
      [10, 4], [10, 5], [10, 6],
      [11, 3], [11, 7],
      [12, 2], [12, 8],
      [13, 2], [13, 8],
      [14, 5],
      [15, 3], [15, 7],
      [16, 4], [16, 5], [16, 6],
      [17, 5],
      [20, 2], [20, 3], [20, 4],
      [21, 2], [21, 3], [21, 4],
      [22, 1], [22, 5],
      [24, 0], [24, 1], [24, 5], [24, 6],
      [34, 2], [34, 3],
      [35, 2], [35, 3],
    ] as Array<[number, number]>,
  },
  // ── Methuselahs ──────────────────────────────────────────────────────────
  {
    label: "R-pentomino",
    category: "Methuselah",
    points: [
      [1, 0], [2, 0],
      [0, 1], [1, 1],
      [1, 2],
    ] as Array<[number, number]>,
  },
  {
    label: "Acorn",
    category: "Methuselah",
    points: [
      [1, 0],
      [3, 1],
      [0, 2], [1, 2], [4, 2], [5, 2], [6, 2],
    ] as Array<[number, number]>,
  },
  {
    label: "Diehard",
    category: "Methuselah",
    points: [
      [6, 0],
      [0, 1], [1, 1],
      [1, 2], [5, 2], [6, 2], [7, 2],
    ] as Array<[number, number]>,
  },
];

type Preset = typeof PRESETS[number];

export default function DemoLifeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const drawModeRef = useRef<"fill" | "erase" | null>(null);

  const [cols, setCols] = useState(80);
  const [rows, setRows] = useState(40);
  const [grid, setGrid] = useState(() => createGrid(80, 40));
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  // Placement mode - which preset is being placed, and cursor cell
  const [placing, setPlacing] = useState<Preset | null>(null);
  const [cursorCell, setCursorCell] = useState<{ x: number; y: number } | null>(null);

  // Size canvas to fill container
  const syncSize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    const newCols = Math.floor(w / CELL);
    const newRows = Math.floor(h / CELL);
    const ratio = window.devicePixelRatio || 1;
    canvas.width = newCols * CELL * ratio;
    canvas.height = newRows * CELL * ratio;
    canvas.style.width = `${newCols * CELL}px`;
    canvas.style.height = `${newRows * CELL}px`;
    setCols(newCols);
    setRows(newRows);
    setGrid(createGrid(newCols, newRows));
    setGeneration(0);
  }, []);

  useEffect(() => {
    syncSize();
    const ro = new ResizeObserver(syncSize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [syncSize]);

  // Simulation tick
  const step = useCallback(() => {
    setGrid((prev) => stepLife(prev, cols, rows));
    setGeneration((g) => g + 1);
  }, [cols, rows]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(step, 120);
    return () => window.clearInterval(id);
  }, [running, step]);

  // Cancel placement on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlacing(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    const W = cols * CELL;
    const H = rows * CELL;

    ctx.save();
    ctx.scale(ratio, ratio);

    // Background
    ctx.fillStyle = "#192A4F";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(148,163,184,0.1)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke();
    }

    // Live cells
    ctx.shadowColor = "rgba(99,102,241,0.6)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#a5b4fc";
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y * cols + x]) {
          ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 1, CELL - 1);
        }
      }
    }

    // Ghost preview for placement mode
    if (placing && cursorCell) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(165, 180, 252, 0.35)";
      ctx.strokeStyle = "rgba(165, 180, 252, 0.7)";
      ctx.lineWidth = 1;
      for (const [dx, dy] of placing.points) {
        const gx = cursorCell.x + dx;
        const gy = cursorCell.y + dy;
        if (gx >= 0 && gy >= 0 && gx < cols && gy < rows) {
          ctx.fillRect(gx * CELL + 1, gy * CELL + 1, CELL - 1, CELL - 1);
          ctx.strokeRect(gx * CELL + 1, gy * CELL + 1, CELL - 1, CELL - 1);
        }
      }
    }

    ctx.restore();
  }, [grid, cols, rows, placing, cursorCell]);

  // Get cell from mouse event
  const getCellFromEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / CELL);
      const y = Math.floor((e.clientY - rect.top) / CELL);
      if (x < 0 || y < 0 || x >= cols || y >= rows) return null;
      return { x, y, idx: y * cols + x };
    },
    [cols, rows]
  );

  const paintCell = useCallback((idx: number, mode: "fill" | "erase" | null) => {
    setGrid((prev) => {
      const next = prev.slice();
      if (mode === "fill") next[idx] = 1;
      else if (mode === "erase") next[idx] = 0;
      else next[idx] = next[idx] ? 0 : 1;
      return next;
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromEvent(e);
      if (placing) {
        setCursorCell(cell ? { x: cell.x, y: cell.y } : null);
        return;
      }
      if (!isDrawingRef.current) return;
      if (!cell) return;
      paintCell(cell.idx, drawModeRef.current);
    },
    [getCellFromEvent, placing, paintCell]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromEvent(e);
      if (!cell) return;

      // Placement mode - stamp and exit
      if (placing) {
        setGrid((prev) =>
          insertPattern(prev, cols, rows, placing.points, cell.x, cell.y)
        );
        setPlacing(null);
        setCursorCell(null);
        return;
      }

      // Normal draw
      isDrawingRef.current = true;
      drawModeRef.current = grid[cell.idx] ? "erase" : "fill";
      paintCell(cell.idx, drawModeRef.current);
    },
    [getCellFromEvent, placing, cols, rows, grid, paintCell]
  );

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    drawModeRef.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    stopDrawing();
    if (placing) setCursorCell(null);
  }, [stopDrawing, placing]);

  useEffect(() => {
    window.addEventListener("mouseup", stopDrawing);
    return () => window.removeEventListener("mouseup", stopDrawing);
  }, [stopDrawing]);

  const handleReset = useCallback(() => {
    setRunning(false);
    setPlacing(null);
    setGrid(createGrid(cols, rows));
    setGeneration(0);
  }, [cols, rows]);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Live Demo
        </div>
        <div className="text-base font-semibold text-white">
          Conway's Game of Life
        </div>
        <p className="text-xs text-slate-300">
          {placing
            ? `Move your cursor over the board and click to place the ${placing.label}. Press Esc to cancel.`
            : "Click or drag to draw cells. Select a pattern to place it, then press Start."}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2">
        {/* Primary controls row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className={[
              "rounded-full border px-5 py-1.5 text-xs font-medium transition",
              running
                ? "border-amber-400/60 bg-amber-500/20 text-amber-100 hover:bg-amber-500/30"
                : "border-indigo-400/60 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30",
            ].join(" ")}
          >
            {running ? "Pause" : "▶ Start"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-slate-700 bg-slate-800/60 px-4 py-1.5 text-xs text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Reset
          </button>
          <span className="ml-auto text-xs text-slate-500">Gen {generation}</span>
        </div>

        {/* Pattern presets grouped by category */}
        {(["Still Life", "Oscillator", "Spaceship", "Gun", "Methuselah"] as const).map((cat) => {
          const group = PRESETS.filter((p) => p.category === cat);
          if (!group.length) return null;
          return (
            <div key={cat} className="flex flex-wrap items-center gap-1.5">
              <span className="w-20 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {cat}
              </span>
              {group.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPlacing(placing?.label === preset.label ? null : preset)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs transition",
                    placing?.label === preset.label
                      ? "border-indigo-400/80 bg-indigo-500/30 text-indigo-100"
                      : "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-indigo-400/60 hover:bg-indigo-500/10 hover:text-indigo-100",
                  ].join(" ")}
                >
                  {placing?.label === preset.label ? `Placing…` : `+ ${preset.label}`}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 rounded-xl border border-slate-700/40 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={placing ? "cursor-crosshair" : "cursor-crosshair"}
        />
      </div>
    </div>
  );
}
