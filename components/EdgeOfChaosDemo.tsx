"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ComplexityMeter from "@/components/ComplexityMeter";
import { createGrid, randomizeGrid } from "@/lib/ca/grid";

export default function EdgeOfChaosDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [control, setControl] = useState(50);
  const [running, setRunning] = useState(true);
  const [grid, setGrid] = useState(() => createGrid(100, 60));
  const [changeRate, setChangeRate] = useState(0);

  const cols = 100;
  const rows = 60;

  const density = useMemo(() => {
    let live = 0;
    for (let i = 0; i < grid.length; i += 1) live += grid[i];
    return grid.length ? live / grid.length : 0;
  }, [grid]);

  const statusLabel = useMemo(() => {
    if (control < 30) return "Mostly Ordered";
    if (control < 70) return "Complex / Edge Region";
    return "Mostly Chaotic";
  }, [control]);

  const seed = useCallback(() => {
    const densityValue = control < 35 ? 0.12 : control < 70 ? 0.28 : 0.45;
    setGrid(randomizeGrid(createGrid(cols, rows), densityValue));
  }, [cols, control, rows]);

  useEffect(() => {
    seed();
  }, [seed]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setGrid((prev) => {
        const next = new Uint8Array(prev.length);
        let changed = 0;
        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            let neighbors = 0;
            for (let dy = -1; dy <= 1; dy += 1) {
              for (let dx = -1; dx <= 1; dx += 1) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
                neighbors += prev[ny * cols + nx];
              }
            }
            const idx = y * cols + x;
            let value = 0;
            const chaosFactor = control / 100;
            const birth = chaosFactor < 0.4 ? 3 : chaosFactor < 0.7 ? 3 : 2;
            const surviveMin = chaosFactor < 0.4 ? 2 : chaosFactor < 0.7 ? 2 : 1;
            const surviveMax = chaosFactor < 0.4 ? 3 : chaosFactor < 0.7 ? 3 : 4;
            if (prev[idx]) {
              value =
                neighbors >= surviveMin && neighbors <= surviveMax ? 1 : 0;
            } else {
              value = neighbors === birth ? 1 : 0;
            }
            if (chaosFactor > 0.7 && Math.random() < (chaosFactor - 0.7) * 0.15) {
              value = Math.random() > 0.5 ? 1 : 0;
            }
            next[idx] = value;
            if (value !== prev[idx]) changed += 1;
          }
        }
        setChangeRate(changed / next.length);
        return next;
      });
    }, 180);
    return () => window.clearInterval(id);
  }, [cols, control, running, rows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = 720 * ratio;
    canvas.height = 420 * ratio;
    canvas.style.width = "100%";
    canvas.style.height = "420px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellW = (canvas.width / ratio) / cols;
    const cellH = (canvas.height / ratio) / rows;
    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.shadowColor = "rgba(139, 92, 246, 0.6)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "rgba(139, 92, 246, 0.9)";
    for (let i = 0; i < grid.length; i += 1) {
      if (!grid[i]) continue;
      const x = i % cols;
      const y = Math.floor(i / cols);
      ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
    }
    ctx.restore();
  }, [cols, grid, rows]);

  return (
    <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
      <div>
        <div className="text-lg font-semibold text-white">Edge of Chaos</div>
        <p className="mt-2 text-sm text-slate-400">
          Christopher Langton proposed that the most interesting computational
          behavior occurs at the boundary between order and chaos. In this
          region, systems can support structure, information flow, and
          persistent complexity.
        </p>
        <blockquote className="mt-3 border-l-2 border-indigo-400/60 pl-3 text-sm text-indigo-200">
          “Life exists at the edge of chaos.”
        </blockquote>
      </div>

      <div className="space-y-3">
        <label className="text-xs text-slate-400">Order → Edge → Chaos</label>
        <input
          type="range"
          min={0}
          max={100}
          value={control}
          onChange={(e) => setControl(Number(e.target.value))}
          className="w-full accent-indigo-400"
        />
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Order</span>
          <span>Edge of Chaos</span>
          <span>Chaos</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 px-2 py-1">
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={() => setRunning((prev) => !prev)}
            className="rounded-full border border-indigo-400/60 bg-indigo-500/20 px-3 py-1 text-indigo-100"
          >
            {running ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={seed}
            className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-slate-200"
          >
            Reseed
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2">
        <canvas ref={canvasRef} className="w-full rounded-lg" />
      </div>

      <ComplexityMeter
        density={density}
        changeRate={changeRate}
        entropyProxy={Math.abs(density - 0.5)}
      />
    </div>
  );
}
