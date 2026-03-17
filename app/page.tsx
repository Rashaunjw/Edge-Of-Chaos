"use client";

import { useEffect, useMemo, useState } from "react";
import HeroBackground from "@/components/HeroBackground";
import Sidebar from "@/components/Sidebar";
import Section from "@/components/Section";
import GameOfLifeCanvas from "@/components/GameOfLifeCanvas";
import ElementaryCARuleExplorer from "@/components/ElementaryCARuleExplorer";
import EdgeOfChaosDemo from "@/components/EdgeOfChaosDemo";
import NatureCards from "@/components/NatureCards";
import ResearcherTimeline from "@/components/ResearcherTimeline";
import MiniLifeCanvas from "@/components/MiniLifeCanvas";
import NeighborDiagram from "@/components/NeighborDiagram";
import DemoLab from "@/components/DemoLab";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "cellular-automata", label: "Cellular Automata" },
  { id: "edge-of-chaos", label: "Edge of Chaos" },
  { id: "demos", label: "Demos" },
  { id: "applications", label: "Applications" },
  { id: "researchers", label: "Researchers" },
  { id: "conclusion", label: "Conclusion" },
];

export default function HomePage() {
  const [activeId, setActiveId] = useState("intro");
  const sectionIds = useMemo(() => sections.map((s) => s.id), []);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <div className="relative min-h-screen bg-slate-950">
      <Sidebar sections={sections} activeId={activeId} />

      <main className="md:ml-[260px]">
        <div className="snap-container grid-surface h-screen overflow-y-auto bg-grid-subtle px-6 py-6 md:px-10">
          <Section id="introduction" className="flex items-center">
            <div className="relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-10">
              <HeroBackground />
              <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/80">
                    Research Exhibit
                  </p>
                  <h1 className="text-4xl font-semibold text-white">
                    Emergence at the Edge of Chaos
                  </h1>
                  <p className="text-base text-slate-300">
                    Complex, life-like behavior can emerge from extremely simple
                    rules.
                  </p>
                  <p className="text-sm text-slate-400">
                    This project explores how cellular automata generate
                    structure, computation, and life-like patterns at the
                    boundary between order and chaos.
                  </p>
                  <a
                    href="#game-of-life"
                    className="inline-flex items-center rounded-full border border-indigo-400/60 bg-indigo-500/20 px-5 py-2 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/30"
                  >
                    Begin Exploration
                  </a>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-xs text-slate-300">
                  <div className="text-sm font-semibold text-white">
                    Exhibit Overview
                  </div>
                  <p className="mt-2 text-slate-400">
                    Scroll through the chapters to explore theory, simulation,
                    and researchers who shaped the field of complex systems.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                      <div className="text-indigo-200">Interactive Labs</div>
                      <div className="mt-1 text-slate-400">
                        Live Game of Life, rule explorer, and edge-of-chaos
                        demos.
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                      <div className="text-indigo-200">Theory Threads</div>
                      <div className="mt-1 text-slate-400">
                        Emergence, complexity, and natural pattern formation.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="cellular-automata" title="Cellular Automata">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  A cellular automaton is a discrete computational system
                  composed of a grid of cells.
                </p>
                <p>
                  Each cell exists in a specific state, and the state of each
                  cell evolves over time according to simple rules based on its
                  neighboring cells.
                </p>
                <ul className="list-disc space-y-1 pl-5 text-slate-400">
                  <li>discrete grid structure</li>
                  <li>local interaction rules</li>
                  <li>synchronous time updates</li>
                  <li>emergent global behavior</li>
                </ul>
                <p>
                  Although the rules are simple, the resulting patterns can
                  become extremely complex.
                </p>
              </div>
              <NeighborDiagram />
            </div>
          </Section>

          <Section id="edge-of-chaos" title="Edge of Chaos">
            <EdgeOfChaosDemo />
          </Section>

          <Section id="demos" title="Demos">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  In 1970, mathematician John Conway created a simple simulation
                  known as the Game of Life.
                </p>
                <p>
                  The system consists of a grid of cells that follow only a few
                  local rules based on their neighbors.
                </p>
                <p>
                  Despite the simplicity of these rules, the system produces
                  patterns that appear to move, interact, and reproduce.
                </p>
                <p>
                  These patterns include gliders, oscillators, and glider guns.
                </p>
                <p className="text-indigo-200">
                  How can something that appears alive emerge from such simple
                  rules?
                </p>
              </div>
              <GameOfLifeCanvas />
            </div>
            <div className="mt-10">
              <DemoLab />
            </div>
          </Section>

          <Section id="applications" title="Applications">
            <NatureCards />
          </Section>

          <Section id="researchers" title="Researchers">
            <ResearcherTimeline />
          </Section>

          <Section id="conclusion" title="Conclusion">
            <div className="space-y-4 text-sm text-slate-300">
              <p>
                Cellular automata demonstrate that complex behavior does not
                require complex rules.
              </p>
              <p>
                Instead, simple local interactions can generate systems that
                appear alive.
              </p>
              <p>
                The most fascinating forms of this behavior occur near the
                boundary between order and chaos.
              </p>
              <p>
                Understanding these systems may help explain how complexity
                emerges in nature, from biological life to large-scale physical
                systems.
              </p>
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}
