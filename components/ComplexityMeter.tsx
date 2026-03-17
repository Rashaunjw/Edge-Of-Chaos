interface ComplexityMeterProps {
  density: number;
  changeRate: number;
  entropyProxy: number;
}

function classify(density: number, changeRate: number, entropy: number) {
  const score = density * 0.4 + changeRate * 0.4 + entropy * 0.2;
  if (score < 0.25) return { label: "Ordered", color: "bg-order-blue" };
  if (score < 0.6) return { label: "Complex", color: "bg-edge-purple" };
  return { label: "Chaotic", color: "bg-chaos-red" };
}

export default function ComplexityMeter({
  density,
  changeRate,
  entropyProxy,
}: ComplexityMeterProps) {
  const result = classify(density, changeRate, entropyProxy);
  const width = Math.min(100, Math.max(8, Math.round((density + changeRate) * 50)));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <div className="text-xs text-slate-400">Complexity meter</div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-200">
        <span>{result.label}</span>
        <span className="text-slate-400">
          density {(density * 100).toFixed(1)}%
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-800/70">
        <div
          className={`h-2 rounded-full ${result.color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
