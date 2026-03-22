"use client";

import { useEffect, useRef, useState } from "react";

type NavChild = {
  id: string;
  label: string;
};

type NavItem = {
  id: string;
  label: string;
  children?: NavChild[];
};

interface SidebarProps {
  sections: NavItem[];
  activeId: string;
  handledIds?: string[];
  onNavigate?: (id: string) => void;
}

export default function Sidebar({
  sections,
  activeId,
  handledIds = [],
  onNavigate,
}: SidebarProps) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = 22;
    const rows = 28;
    const cellSize = 6;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    let grid = new Uint8Array(cols * rows);
    for (let i = 0; i < grid.length; i += 1) {
      grid[i] = Math.random() > 0.82 ? 1 : 0;
    }

    let lastStep = 0;
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

    const draw = (time: number) => {
      if (time - lastStep > 600) {
        step();
        lastStep = time;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
      for (let i = 0; i < grid.length; i += 1) {
        if (!grid[i]) continue;
        const x = i % cols;
        const y = Math.floor(i / cols);
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
      requestAnimationFrame(draw);
    };
    const frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  const navLinks = (
    <nav className="mt-4 flex flex-col gap-2 text-sm">
      {sections.map((section, index) => {
        const isChildActive = section.children?.some((c) => c.id === activeId);
        const isActive = activeId === section.id || isChildActive;
        const handleThis =
          handledIds.includes(section.id) && typeof onNavigate === "function";

        return (
          <div key={section.id} className="space-y-1">
            <a
              href={`#${section.id}`}
              onClick={(e) => {
                if (handleThis) {
                  e.preventDefault();
                  onNavigate?.(section.id);
                }
                setOpen(false);
              }}
              className={[
                "group flex items-center gap-3 rounded-lg px-3 py-2 transition",
                "border border-transparent",
                isActive
                  ? "bg-slate-800/60 text-white"
                  : "text-slate-300 hover:bg-slate-800/40 hover:text-slate-100",
              ].join(" ")}
            >
              <span className="text-[10px] font-semibold text-slate-400 group-hover:text-slate-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm">{section.label}</span>
            </a>

            {section.children?.length ? (
              <div className="ml-6 flex flex-col gap-1">
                {section.children.map((child) => {
                  const childActive = activeId === child.id;
                  const childHandle =
                    handledIds.includes(child.id) &&
                    typeof onNavigate === "function";
                  return (
                    <a
                      key={child.id}
                      href={`#${child.id}`}
                      onClick={(e) => {
                        if (childHandle) {
                          e.preventDefault();
                          onNavigate?.(child.id);
                        }
                        setOpen(false);
                      }}
                      className={[
                        "rounded-lg px-3 py-2 text-xs transition",
                        "border border-transparent",
                        childActive
                          ? "bg-slate-800/50 text-indigo-200"
                          : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-100",
                      ].join(" ")}
                    >
                      {child.label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs text-slate-200 backdrop-blur md:hidden"
      >
        Menu
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] border-r border-slate-700/60 bg-slate-800/80 px-6 pt-16 pb-6 backdrop-blur md:block">
        <div className="relative flex h-full flex-col">
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute right-0 top-6 opacity-30"
          />
          <div className="relative z-10 flex-shrink-0">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-300">
              Research Site
            </div>
            <div className="mt-2 text-base font-semibold text-white">
              Cellular Automata and the
              Edge of Chaos
            </div>
          </div>
          <div className="relative z-10 mt-10 border-t border-slate-700/50 flex-1 overflow-y-auto">
            {navLinks}
          </div>
        </div>
      </aside>

      {open ? (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-slate-700/60 bg-slate-800/95 px-6 pt-4 pb-6 backdrop-blur md:hidden">
          <div className="flex-shrink-0">
            <div className="text-xs uppercase tracking-[0.3em] text-slate-300">
              Research Site
            </div>
            <div className="mt-2 text-base font-semibold text-white">
              Cellular Automata and the Edge of Chaos
            </div>
          </div>
          <div className="mt-8 border-t border-slate-700/50 flex-1 overflow-y-auto">
            {navLinks}
          </div>
        </aside>
      ) : null}
    </>
  );
}
