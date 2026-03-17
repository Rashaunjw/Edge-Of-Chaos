"use client";

import { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = 120;
    const rows = 70;
    let grid = new Uint8Array(cols * rows);
    for (let i = 0; i < grid.length; i += 1) {
      grid[i] = Math.random() > 0.86 ? 1 : 0;
    }

    const step = () => {
      const next = new Uint8Array(cols * rows);
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          let neighbors = 0;
          for (let dy = -1; dy <= 1; dy += 1) {
            for (let dx = -1; dx <= 1; dx += 1) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              const ny = y + dy;
              if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
              neighbors += grid[ny * cols + nx];
            }
          }
          const idx = y * cols + x;
          if (grid[idx]) {
            next[idx] = neighbors === 2 || neighbors === 3 ? 1 : 0;
          } else {
            next[idx] = neighbors === 3 ? 1 : 0;
          }
        }
      }
      grid = next;
    };

    let lastTime = 0;
    const draw = (time: number) => {
      if (time - lastTime > 200) {
        step();
        lastTime = time;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const cellW = width / cols;
      const cellH = height / rows;
      ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
      for (let i = 0; i < grid.length; i += 1) {
        if (!grid[i]) continue;
        const x = i % cols;
        const y = Math.floor(i / cols);
        ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
      }
      requestAnimationFrame(draw);
    };
    const frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-70"
    />
  );
}
