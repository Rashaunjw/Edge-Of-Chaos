"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const COLS = 160;
const ROWS = 80;

const PRESETS = [
  { label: "Rule 30",  value: 30,  desc: "Chaotic: used in random number generation" },
  { label: "Rule 90",  value: 90,  desc: "Fractal: Sierpinski triangle" },
  { label: "Rule 110", value: 110, desc: "Complex: capable of universal computation" },
  { label: "Rule 184", value: 184, desc: "Ordered: models traffic flow" },
];

type InitMode = "center" | "left" | "right" | "rand25" | "rand50" | "rand75";

const INIT_OPTIONS: { mode: InitMode; label: string }[] = [
  { mode: "center",  label: "Center" },
  { mode: "left",    label: "Left"   },
  { mode: "right",   label: "Right"  },
  { mode: "rand25",  label: "25%"    },
  { mode: "rand50",  label: "50%"    },
  { mode: "rand75",  label: "75%"    },
];

function makeRow(mode: InitMode): Uint8Array {
  const row = new Uint8Array(COLS);
  if (mode === "center") {
    row[Math.floor(COLS / 2)] = 1;
  } else if (mode === "left") {
    row[1] = 1;
  } else if (mode === "right") {
    row[COLS - 2] = 1;
  } else {
    const p = mode === "rand25" ? 0.25 : mode === "rand50" ? 0.5 : 0.75;
    for (let i = 0; i < COLS; i++) row[i] = Math.random() < p ? 1 : 0;
  }
  return row;
}

function nextRow(prev: Uint8Array, rule: number): Uint8Array {
  const out = new Uint8Array(COLS);
  for (let x = 0; x < COLS; x++) {
    const l = prev[(x - 1 + COLS) % COLS];
    const c = prev[x];
    const r = prev[(x + 1) % COLS];
    out[x] = (rule >> ((l << 2) | (c << 1) | r)) & 1;
  }
  return out;
}

export default function ElementaryCARuleExplorer() {
  const canvasRef  = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<Uint8Array[]>([makeRow("center")]);
  const runningRef = useRef(false);
  const ruleRef    = useRef(30);
  const rafRef     = useRef<number | null>(null);
  const lastStepRef = useRef(0);

  const [rule,     setRule]     = useState(30);
  const [running,  setRunning]  = useState(false);
  const [initMode, setInitMode] = useState<InitMode>("center");
  const [speed,    setSpeed]    = useState(60); // ms between rows

  const resetHistory = useCallback((mode: InitMode) => {
    historyRef.current = [makeRow(mode)];
  }, []);

  // Sync rule to ref
  useEffect(() => { ruleRef.current = rule; }, [rule]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth  || 600;
    const h = canvas.clientHeight || 280;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, w, h);

    const history = historyRef.current;
    const visible = Math.min(history.length, ROWS);
    const startIdx = history.length - visible;
    const cw = w / COLS;
    const rh = h / ROWS;

    for (let r = 0; r < visible; r++) {
      const row = history[startIdx + r];
      for (let c = 0; c < COLS; c++) {
        if (!row[c]) continue;
        // Fade older rows slightly
        const age = r / visible;
        ctx.fillStyle = age > 0.7
          ? "#a78bfa"          // violet-400 - recent rows
          : age > 0.4
            ? "#7c3aed"        // violet-600 - mid rows
            : "#4c1d95";       // violet-900 - old rows
        ctx.fillRect(c * cw + 0.5, r * rh + 0.5, cw - 1, rh - 1);
      }
    }
  }, []);

  useEffect(() => {
    const loop = (time: number) => {
      if (runningRef.current && time - lastStepRef.current > speed) {
        const hist = historyRef.current;
        const last = hist[hist.length - 1];
        hist.push(nextRow(last, ruleRef.current));
        if (hist.length > ROWS * 3) historyRef.current = hist.slice(-ROWS);
        lastStepRef.current = time;
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [draw, speed]);

  const toggleRunning = () => {
    runningRef.current = !runningRef.current;
    setRunning(runningRef.current);
  };

  const handlePreset = (val: number) => {
    setRule(val);
    ruleRef.current = val;
    resetHistory(initMode);
  };

  const handleInitMode = (mode: InitMode) => {
    setInitMode(mode);
    resetHistory(mode);
  };

  const handleRuleSlider = (val: number) => {
    setRule(val);
    ruleRef.current = val;
    resetHistory(initMode);
  };

  // Build the 8-column rule table (patterns 7..0 = 111..000)
  const ruleTable = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const patIdx = 7 - i;
      const l = (patIdx >> 2) & 1;
      const c = (patIdx >> 1) & 1;
      const r = patIdx & 1;
      const out = (rule >> patIdx) & 1;
      return { patIdx, l, c, r, out };
    }), [rule]);

  const toggleBit = (patIdx: number) => {
    const newRule = ((rule >> patIdx) & 1)
      ? rule & ~(1 << patIdx)
      : rule |  (1 << patIdx);
    setRule(newRule);
    ruleRef.current = newRule;
    resetHistory(initMode);
  };

  return (
    <div className="flex flex-col gap-4 h-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5 shadow-sm">

      {/* Preset pills */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handlePreset(p.value)}
            title={p.desc}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              rule === p.value
                ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                : "border-slate-600 bg-slate-800 text-slate-300 hover:border-violet-400/40 hover:text-white",
            ].join(" ")}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Rule table - 8 clickable columns */}
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-widest text-slate-500">
          Rule table - click output cell to toggle
        </div>
        <div className="flex gap-1">
          {ruleTable.map(({ patIdx, l, c, r, out }) => (
            <button
              key={patIdx}
              type="button"
              onClick={() => toggleBit(patIdx)}
              className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 py-2 px-1 transition hover:border-violet-400/50"
            >
              {/* Input: 3 cells */}
              <div className="flex gap-0.5">
                {[l, c, r].map((v, i) => (
                  <div
                    key={i}
                    className={[
                      "h-3.5 w-3.5 rounded-[3px]",
                      v ? "bg-violet-400" : "bg-slate-700",
                    ].join(" ")}
                  />
                ))}
              </div>
              {/* Output cell */}
              <div
                className={[
                  "h-3.5 w-3.5 rounded-[3px] border",
                  out
                    ? "border-violet-300 bg-violet-400"
                    : "border-slate-500 bg-slate-900",
                ].join(" ")}
              />
              <div className="text-[8px] font-mono text-slate-500">
                {patIdx.toString(2).padStart(3, "0")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rule slider + starting condition */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-36 space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Rule number</span>
            <span className="font-mono text-violet-200">{rule}</span>
          </div>
          <input
            type="range"
            min={0}
            max={255}
            value={rule}
            onChange={(e) => handleRuleSlider(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate-400">Starting condition</div>
          <div className="flex flex-wrap gap-1">
            {INIT_OPTIONS.map(({ mode, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleInitMode(mode)}
                className={[
                  "rounded border px-2 py-0.5 text-[11px] transition",
                  initMode === mode
                    ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                    : "border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
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
        <button
          type="button"
          onClick={() => resetHistory(initMode)}
          className="rounded-full border border-slate-700 bg-slate-800/60 px-4 py-1.5 text-xs text-slate-200 transition hover:border-slate-500 hover:text-white"
        >
          Reset
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400">Speed</span>
          <input
            type="range"
            min={20}
            max={300}
            step={10}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-violet-400"
          />
        </div>
      </div>

      {/* Canvas - grows to fill remaining height */}
      <div className="flex-1 min-h-0 rounded-xl border border-slate-700 bg-slate-950/50 p-1">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg"
          style={{ display: "block" }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-400 flex-none">
        <span>Time flows <strong className="text-slate-300">top → bottom</strong></span>
        <span>Each row is computed from the row above using the rule table</span>
        <span>Edges wrap</span>
      </div>
    </div>
  );
}
