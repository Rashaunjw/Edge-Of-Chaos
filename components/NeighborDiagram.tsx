"use client";

import { useEffect, useRef } from "react";

export default function NeighborDiagram() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = 300 * ratio;
    canvas.height = 300 * ratio;
    canvas.style.width = "100%";
    canvas.style.height = "300px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    const grid = new Uint8Array(9);
    let last = 0;

    const draw = (time: number) => {
      if (time - last > 800) {
        for (let i = 0; i < grid.length; i += 1) {
          grid[i] = Math.random() > 0.6 ? 1 : 0;
        }
        last = time;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const size = 90;
      const gap = 10;
      const totalW = 3 * size + 2 * gap;
      const totalH = 3 * size + 2 * gap;
      const offsetX = (300 - totalW) / 2;
      const offsetY = (300 - totalH) / 2;
      for (let y = 0; y < 3; y += 1) {
        for (let x = 0; x < 3; x += 1) {
          const idx = y * 3 + x;
          const isCenter = idx === 4;
          ctx.fillStyle = isCenter
            ? "rgba(139, 92, 246, 0.9)"
            : grid[idx]
              ? "rgba(59, 130, 246, 0.7)"
              : "rgba(30, 41, 59, 0.7)";
          ctx.fillRect(offsetX + x * (size + gap), offsetY + y * (size + gap), size, size);
        }
      }
      requestAnimationFrame(draw);
    };
    const frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2">
      <canvas ref={canvasRef} className="w-full rounded-lg" />
    </div>
  );
}
