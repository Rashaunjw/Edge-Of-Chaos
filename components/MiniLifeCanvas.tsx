"use client";

import { useEffect, useRef } from "react";
import { createGrid, randomizeGrid, stepLife } from "@/lib/ca/grid";

interface MiniLifeCanvasProps {
  density?: number;
  speed?: number;
}

export default function MiniLifeCanvas({
  density = 0.35,
  speed = 220,
}: MiniLifeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = 420 * ratio;
    canvas.height = 240 * ratio;
    canvas.style.width = "100%";
    canvas.style.height = "240px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    const cols = 80;
    const rows = 45;
    let grid = randomizeGrid(createGrid(cols, rows), density);
    let last = 0;

    const draw = (time: number) => {
      if (time - last > speed) {
        grid = stepLife(grid, cols, rows);
        last = time;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cellW = (canvas.width / ratio) / cols;
      const cellH = (canvas.height / ratio) / rows;
      ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
      for (let i = 0; i < grid.length; i += 1) {
        if (!grid[i]) continue;
        const x = i % cols;
        const y = Math.floor(i / cols);
        ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
      }
      requestAnimationFrame(draw);
    };
    const frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [density, speed]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2">
      <canvas ref={canvasRef} className="w-full rounded-lg" />
    </div>
  );
}
