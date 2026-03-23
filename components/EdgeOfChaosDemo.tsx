"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CW = 100;
const CH = 68;

type RuleKey = "order" | "life" | "chaos";

const RULES: Record<RuleKey, { B: number[]; S: number[] }> = {
  order: { B: [3],    S: [1, 2, 3, 4] },
  life:  { B: [3],    S: [2, 3] },
  chaos: { B: [3, 6], S: [] },
};

const DESCS: Record<RuleKey, string> = {
  order:
    "High stability: cells survive with many neighbors, grids solidify into stable dense blobs with little change.",
  life:
    "Edge of chaos: Life sits at the boundary between order and chaos; complex, persistent structures like gliders emerge.",
  chaos:
    "Total chaos: no survival rule, cells flicker randomly every generation, no structure persists.",
};

// Slider has 3 snap zones: 0–33 = order, 34–66 = life, 67–100 = chaos
function ruleFromSlider(v: number): RuleKey {
  if (v < 34) return "order";
  if (v < 67) return "life";
  return "chaos";
}

// Accent color for each zone
const ZONE_COLOR: Record<RuleKey, string> = {
  order: "#60a5fa",   // blue-400
  life:  "#a78bfa",   // violet-400
  chaos: "#f87171",   // red-400
};

function makeGrid(): Uint8Array {
  const g = new Uint8Array(CW * CH);
  for (let i = 0; i < g.length; i++) g[i] = Math.random() < 0.35 ? 1 : 0;
  return g;
}

function step(grid: Uint8Array, rule: { B: number[]; S: number[] }): Uint8Array {
  const next = new Uint8Array(CW * CH);
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          n += grid[((y + dy + CH) % CH) * CW + ((x + dx + CW) % CW)];
        }
      }
      const c = grid[y * CW + x];
      next[y * CW + x] =
        (c && rule.S.includes(n)) || (!c && rule.B.includes(n)) ? 1 : 0;
    }
  }
  return next;
}

function drawCanvas(canvas: HTMLCanvasElement, grid: Uint8Array, prev: Uint8Array) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 600;
  const h = canvas.clientHeight || 280;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  const cw = w / CW;
  const rh = h / CH;
  ctx.fillStyle = "#0b1120";
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < CH; y++) {
    for (let x = 0; x < CW; x++) {
      const c = grid[y * CW + x];
      const p = prev[y * CW + x];
      if      ( c &&  p) ctx.fillStyle = "#1D9E75";
      else if ( c && !p) ctx.fillStyle = "#9FE1CB";
      else if (!c &&  p) ctx.fillStyle = "#4a5568";
      else continue;
      ctx.fillRect(x * cw + 0.5, y * rh + 0.5, cw - 1, rh - 1);
    }
  }
}

export default function EdgeOfChaosDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef   = useRef<Uint8Array>(makeGrid());
  const prevRef   = useRef<Uint8Array>(new Uint8Array(CW * CH));
  const ruleRef   = useRef<RuleKey>("life");
  const rafRef    = useRef<number | null>(null);
  const frameRef  = useRef(0);
  const runningRef = useRef(false);

  const [sliderValue, setSliderValue] = useState(50); // start at edge of chaos
  const [activeRule, setActiveRule]   = useState<RuleKey>("life");
  const [running, setRunning]         = useState(false);

  const randomize = useCallback(() => {
    gridRef.current = makeGrid();
    prevRef.current = new Uint8Array(CW * CH);
    if (canvasRef.current) drawCanvas(canvasRef.current, gridRef.current, prevRef.current);
  }, []);

  const loop = useCallback(() => {
    frameRef.current++;
    if (frameRef.current % 2 === 0 && runningRef.current) {
      const next = step(gridRef.current, RULES[ruleRef.current]);
      prevRef.current = gridRef.current;
      gridRef.current = next;
      if (canvasRef.current) drawCanvas(canvasRef.current, gridRef.current, prevRef.current);
    }
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [loop]);

  const handleSlider = (v: number) => {
    const rule = ruleFromSlider(v);
    setSliderValue(v);
    if (rule !== activeRule) {
      setActiveRule(rule);
      ruleRef.current = rule;
      randomize();
    }
  };

  const toggleRunning = () => {
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  };

  const accentColor = ZONE_COLOR[activeRule];
  // Filled portion of track as percentage
  const fillPct = sliderValue;

  return (
    <div className="flex flex-col gap-4 h-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5 shadow-sm">

      {/* Spectrum meter */}
      <div className="space-y-2">
        <div className="relative h-3 w-full rounded-full overflow-hidden"
          style={{ background: "linear-gradient(to right, #60a5fa 0%, #a78bfa 50%, #f87171 100%)" }}>
          {/* Dark overlay that erases the right portion, creating a "fill from left" effect */}
          <div
            className="absolute inset-y-0 right-0 rounded-r-full transition-all duration-150"
            style={{ width: `${100 - fillPct}%`, background: "rgba(15,23,42,0.72)" }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          onChange={(e) => handleSlider(Number(e.target.value))}
          className="w-full h-1 appearance-none bg-transparent cursor-pointer"
          style={{ accentColor }}
        />

        <div className="flex justify-between text-xs select-none" style={{ color: "#94a3b8" }}>
          <span style={{ color: activeRule === "order" ? "#60a5fa" : undefined }}>Order</span>
          <span style={{ color: activeRule === "life"  ? "#a78bfa" : undefined }}>Edge of Chaos</span>
          <span style={{ color: activeRule === "chaos" ? "#f87171" : undefined }}>Chaos</span>
        </div>
      </div>

      {/* Active zone badge + buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-300"
          style={{ borderColor: accentColor, color: accentColor, background: `${accentColor}18` }}
        >
          {activeRule === "order" ? "Order: B3/S1234"
            : activeRule === "life" ? "Edge of Chaos: B3/S23"
            : "Chaos: B36/S"}
        </span>

        <button
          type="button"
          onClick={randomize}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={toggleRunning}
          className={[
            "rounded-full border px-5 py-1.5 text-xs font-medium transition",
            running
              ? "border-amber-400/60 bg-amber-500/20 text-amber-100 hover:bg-amber-500/30"
              : "border-indigo-400/60 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30",
          ].join(" ")}
        >
          {running ? "Pause" : "▶ Start"}
        </button>
      </div>

      {/* Canvas - grows to fill remaining height */}
      <div className="flex-1 min-h-0 rounded-xl border border-slate-700 bg-slate-950/50 p-1">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg"
          style={{ display: "block" }}
        />
      </div>

      {/* Description */}
      <p className="flex-none text-xs leading-relaxed transition-all duration-300" style={{ color: "#94a3b8" }}>
        {DESCS[activeRule]}
      </p>

      {/* Legend */}
      <div className="flex-none flex flex-wrap gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ background: "#1D9E75" }} />
          <span className="text-xs text-slate-400">alive (stable)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ background: "#9FE1CB" }} />
          <span className="text-xs text-slate-400">just born</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ background: "#4a5568" }} />
          <span className="text-xs text-slate-400">just died</span>
        </div>
      </div>
    </div>
  );
}
