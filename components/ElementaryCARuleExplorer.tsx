"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PRESETS = [30, 90, 110, 184];

export default function ElementaryCARuleExplorer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rule, setRule] = useState(30);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(80);

  const cols = 120;
  const rows = 90;
  const historyRef = useRef<Uint8Array>(
    new Uint8Array(cols * rows)
  );
  const currentRowRef = useRef(0);

  const reset = useCallback(() => {
    historyRef.current = new Uint8Array(cols * rows);
    historyRef.current[Math.floor(cols / 2)] = 1;
    currentRowRef.current = 0;
  }, [cols, rows]);

  useEffect(() => {
    reset();
  }, [reset, rule]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = 520 * ratio;
    canvas.height = 360 * ratio;
    canvas.style.width = "100%";
    canvas.style.height = "360px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    let lastStep = 0;
    const draw = (time: number) => {
      if (running && time - lastStep > speed) {
        step();
        lastStep = time;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0b1120";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cellW = (canvas.width / ratio) / cols;
      const cellH = (canvas.height / ratio) / rows;
      ctx.fillStyle = "rgba(249, 115, 22, 0.9)";
      const history = historyRef.current;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          if (!history[r * cols + c]) continue;
          ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        }
      }
      requestAnimationFrame(draw);
    };
    const frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [cols, rows, running, speed]);

  const step = useCallback(() => {
    const history = historyRef.current;
    const row = currentRowRef.current;
    if (row >= rows - 1) {
      reset();
      return;
    }
    const nextRow = row + 1;
    for (let x = 0; x < cols; x += 1) {
      const left = x > 0 ? history[row * cols + x - 1] : 0;
      const center = history[row * cols + x];
      const right = x < cols - 1 ? history[row * cols + x + 1] : 0;
      const pattern = (left << 2) | (center << 1) | right;
      history[nextRow * cols + x] = (rule >> pattern) & 1;
    }
    currentRowRef.current = nextRow;
  }, [cols, reset, rows, rule]);

  const ruleBits = useMemo(
    () => rule.toString(2).padStart(8, "0"),
    [rule]
  );

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
      <div>
        <div className="text-sm font-semibold text-white">
          Elementary Rule Explorer
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Stephen Wolfram showed that even simple one-dimensional cellular
          automata can produce very different behaviors, from order to
          randomness to computation.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setRule(preset)}
            className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-slate-200 transition hover:border-indigo-400"
          >
            Rule {preset}
          </button>
        ))}
      </div>

      <div className="grid gap-3 text-xs text-slate-300 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-slate-400">Rule number</span>
          <input
            type="range"
            min={0}
            max={255}
            value={rule}
            onChange={(e) => setRule(Number(e.target.value))}
            className="w-full accent-indigo-400"
          />
        </label>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2">
          <div className="text-xs text-slate-400">Rule bits</div>
          <div className="mt-1 font-mono text-sm text-indigo-200">
            {ruleBits}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => setRunning((prev) => !prev)}
          className="rounded-full border border-indigo-400/60 bg-indigo-500/20 px-3 py-1 text-indigo-100"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-slate-200"
        >
          Reset
        </button>
        <label className="flex items-center gap-2">
          <span className="text-slate-400">Speed</span>
          <input
            type="range"
            min={40}
            max={200}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-indigo-400"
          />
        </label>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2">
        <canvas ref={canvasRef} className="w-full rounded-lg" />
      </div>
    </div>
  );
}
