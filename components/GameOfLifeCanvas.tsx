"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ComplexityMeter from "@/components/ComplexityMeter";
import PatternLibrary from "@/components/PatternLibrary";
import {
  createGrid,
  gridStats,
  insertPattern,
  randomizeGrid,
  stepLife,
} from "@/lib/ca/grid";

interface GameOfLifeCanvasProps {
  title?: string;
  description?: string;
  initialRows?: number;
  initialCols?: number;
}

export default function GameOfLifeCanvas({
  title = "Game of Life Simulation",
  description = "Explore Conway's Game of Life with interactive patterns.",
  initialRows = 60,
  initialCols = 90,
}: GameOfLifeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const drawModeRef = useRef<"fill" | "erase" | null>(null);
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [cellSize, setCellSize] = useState(8);
  const [speed, setSpeed] = useState(140);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [grid, setGrid] = useState(() =>
    createGrid(initialCols, initialRows)
  );
  const [changeRate, setChangeRate] = useState(0);

  const stats = useMemo(() => gridStats(grid), [grid]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    const height = Math.floor(width * 0.6);
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const step = useCallback(() => {
    setGrid((prev) => {
      const next = stepLife(prev, cols, rows);
      let diff = 0;
      for (let i = 0; i < next.length; i += 1) {
        if (next[i] !== prev[i]) diff += 1;
      }
      setChangeRate(diff / next.length);
      return next;
    });
    setGeneration((prev) => prev + 1);
  }, [cols, rows]);

  useEffect(() => {
    setGrid(createGrid(cols, rows));
    setGeneration(0);
  }, [cols, rows]);

  useEffect(() => {
    setGrid(randomizeGrid(createGrid(cols, rows), 0.25));
    setGeneration(0);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(step, speed);
    return () => window.clearInterval(id);
  }, [running, speed, step]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.width / ratio;
    const height = canvas.height / ratio;
    const cellW = cellSize;
    const cellH = cellSize;
    const drawCols = Math.min(cols, Math.floor(width / cellW));
    const drawRows = Math.min(rows, Math.floor(height / cellH));
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.shadowColor = "rgba(99, 102, 241, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#a5b4fc";
    for (let y = 0; y < drawRows; y += 1) {
      for (let x = 0; x < drawCols; x += 1) {
        const i = y * cols + x;
        if (!grid[i]) continue;
        ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
      }
    }
    ctx.restore();

    ctx.strokeStyle = "rgba(148, 163, 184, 0.16)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= drawCols; x += 1) {
      const px = x * cellW + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, drawRows * cellH);
      ctx.stroke();
    }
    for (let y = 0; y <= drawRows; y += 1) {
      const py = y * cellH + 0.5;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(drawCols * cellW, py);
      ctx.stroke();
    }
  }, [cellSize, cols, grid, rows]);

  const handleReset = useCallback(() => {
    setGrid(createGrid(cols, rows));
    setGeneration(0);
  }, [cols, rows]);

  const handleRandomize = useCallback(() => {
    setGrid(randomizeGrid(createGrid(cols, rows), 0.3));
    setGeneration(0);
  }, [cols, rows]);

  const handlePattern = useCallback(
    (pattern: { points: Array<[number, number]> }) => {
      const offsetX = Math.floor(cols / 2);
      const offsetY = Math.floor(rows / 2);
      setGrid((prev) => insertPattern(prev, cols, rows, pattern.points, offsetX, offsetY));
    },
    [cols, rows]
  );

  const getCellFromEvent = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cellSize);
      const y = Math.floor((event.clientY - rect.top) / cellSize);
      if (x < 0 || y < 0 || x >= cols || y >= rows) return null;
      return { x, y, idx: y * cols + x };
    },
    [cellSize, cols, rows]
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

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromEvent(event);
      if (!cell) return;
      paintCell(cell.idx, null);
    },
    [getCellFromEvent, paintCell]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromEvent(event);
      if (!cell) return;
      isDrawingRef.current = true;
      drawModeRef.current = grid[cell.idx] ? "erase" : "fill";
      paintCell(cell.idx, drawModeRef.current);
    },
    [getCellFromEvent, grid, paintCell]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      const cell = getCellFromEvent(event);
      if (!cell) return;
      paintCell(cell.idx, drawModeRef.current);
    },
    [getCellFromEvent, paintCell]
  );

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    drawModeRef.current = null;
  }, []);

  useEffect(() => {
    const onMouseUp = () => stopDrawing();
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [stopDrawing]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-4 shadow-sm">
      <div>
        <div className="text-sm font-semibold text-white">{title}</div>
        <p className="mt-1 text-xs text-slate-300">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setRunning(true)}
          className="rounded-full border border-indigo-400/60 bg-indigo-500/20 px-3 py-1 text-indigo-100"
        >
          Start
        </button>
        <button
          type="button"
          onClick={() => setRunning(false)}
          className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-slate-200"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-slate-200"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleRandomize}
          className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-slate-200"
        >
          Randomize
        </button>
        <button
          type="button"
          onClick={step}
          className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-slate-200"
        >
          Step
        </button>
      </div>

      <div className="grid gap-3 text-xs text-slate-200 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-slate-300">Speed</span>
          <input
            type="range"
            min={60}
            max={400}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-indigo-400"
          />
        </label>
        <label className="space-y-1">
          <span className="text-slate-300">Rows</span>
          <input
            type="number"
            min={20}
            max={120}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value) || rows)}
            className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-slate-200"
          />
        </label>
        <label className="space-y-1">
          <span className="text-slate-300">Columns</span>
          <input
            type="number"
            min={20}
            max={160}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value) || cols)}
            className="w-full rounded-md border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-slate-200"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200">
        <label className="flex items-center gap-2">
          <span className="text-slate-300">Cell size</span>
          <input
            type="range"
            min={4}
            max={14}
            value={cellSize}
            onChange={(e) => setCellSize(Number(e.target.value))}
            className="accent-indigo-400"
          />
        </label>
        <span>Gen {generation}</span>
        <span>Live {stats.live}</span>
      </div>

      <PatternLibrary onSelect={handlePattern} />

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-2">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={stopDrawing}
          className="h-full w-full cursor-crosshair rounded-lg"
        />
      </div>

      <ComplexityMeter
        density={stats.density}
        changeRate={changeRate}
        entropyProxy={Math.abs(stats.density - 0.5) * 0.8}
      />
    </div>
  );
}
