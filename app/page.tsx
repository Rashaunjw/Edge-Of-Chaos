"use client";

import { useEffect, useMemo, useState } from "react";
import HeroBackground from "@/components/HeroBackground";
import Sidebar from "@/components/Sidebar";
import Section from "@/components/Section";
import DemoLifeCanvas from "@/components/DemoLifeCanvas";
import NatureCards from "@/components/NatureCards";
import NeighborDiagram from "@/components/NeighborDiagram";
import EdgeOfChaosDemo from "@/components/EdgeOfChaosDemo";
import ElementaryCARuleExplorer from "@/components/ElementaryCARuleExplorer";

const navItems = [
  {
    id: "introduction",
    label: "Introduction",
  },
  {
    id: "foundation",
    label: "Foundation",
    children: [
      { id: "foundation-1d", label: "1D Cellular Automata" },
      { id: "foundation-2d", label: "2D Cellular Automata" },
    ],
  },
  { id: "edge-of-chaos", label: "Edge of Chaos" },
  { id: "applications", label: "Applications" },
  { id: "conclusion", label: "Conclusion" },
];

export default function HomePage() {
  const [activeId, setActiveId] = useState("introduction");
  const [applicationsIndex, setApplicationsIndex] = useState(0);
  const sectionIds = useMemo(
    () =>
      navItems.flatMap((item) => [
        item.id,
        ...(item.children?.map((c) => c.id) ?? []),
      ]),
    []
  );

  const applicationSubsections = useMemo(
    () => [
      "applications-nature",
      "applications-economics",
      "applications-networks",
    ],
    []
  );

  const handledNavIds = useMemo(
    () => ["applications", ...applicationSubsections],
    [applicationSubsections]
  );

  const handleNavigate = (id: string) => {
    const idx = applicationSubsections.indexOf(id);
    if (id === "applications") {
      setApplicationsIndex(0);
      setActiveId("applications");
    } else if (idx >= 0) {
      setApplicationsIndex(idx);
      setActiveId(id);
    } else {
      setActiveId(id);
    }

    // Only scroll when entering Applications from another section.
    const isCurrentlyInApps =
      activeId === "applications" || applicationSubsections.includes(activeId);
    if (!isCurrentlyInApps) {
      document.getElementById("applications")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (!intersecting.length) return;

        // Don't let intersection events pick a random `applications-*` panel.
        // Those panels are moved with `transform`, and multiple can appear
        // "intersecting" at once, causing index jumps.
        const nonAppIntersecting = intersecting.filter(
          (e) =>
            e.target.id !== "applications" && !e.target.id.startsWith("applications-")
        );
        const parentApps = intersecting.find((e) => e.target.id === "applications");

        if (parentApps) {
          setActiveId("applications");
          return;
        }

        if (!nonAppIntersecting.length) return;

        const best = nonAppIntersecting.reduce((acc, e) =>
          e.intersectionRatio > acc.intersectionRatio ? e : acc
        );
        setActiveId(best.target.id);
      },
      { threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, applicationSubsections]);

  useEffect(() => {
    // Only update `applicationsIndex` when we explicitly target a subsection.
    // (We don't want intersection observer to fight with the carousel index.)
    const idx = applicationSubsections.indexOf(activeId);
    if (idx >= 0) setApplicationsIndex(idx);
  }, [activeId, applicationSubsections]);

  useEffect(() => {
    // Intentionally not syncing from `window.location.hash`.
    // Clicking subheaders should not trigger browser scroll-jumps.
  }, []);

  useEffect(() => {
    // When the user is in the Applications chapter, keep sidebar state aligned
    // with the carousel panel.
    const isInApps = activeId === "applications" || applicationSubsections.includes(activeId);
    if (!isInApps) return;
    const nextActiveId = applicationSubsections[applicationsIndex];
    if (nextActiveId && nextActiveId !== activeId) setActiveId(nextActiveId);
  }, [applicationsIndex, activeId, applicationSubsections]);

  return (
    <div className="relative min-h-screen bg-slate-800">
      <Sidebar
        sections={navItems}
        activeId={applicationSubsections.includes(activeId) ? "applications" : activeId}
        handledIds={handledNavIds}
        onNavigate={handleNavigate}
      />

      <main className="md:ml-[260px]">
        <div className="snap-container grid-surface h-screen overflow-y-auto bg-grid-subtle px-6 py-3 md:px-10 md:py-4">
          <Section id="introduction" className="!items-center !py-12">
            <div className="relative w-full overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/70 p-10">
              <HeroBackground />
              <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/80">
                    Research Exhibit
                  </p>
                  <h1 className="text-4xl font-semibold text-white">
                    From Simple Rules to Living Systems: Cellular Automata and
                    the Edge of Chaos
                  </h1>
                  <br />
                  <br />

                  <div className="rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-4">
                    <div className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">
                      Thesis:
                    </div>
                    <p className="mt-2 text-base leading-relaxed text-indigo-200">
                      Complex, life-like behavior can emerge from extremely simple
                      rules, and the most interesting forms of this complexity
                      occur at the boundary between order and chaos: the Edge of
                      Chaos.
                    </p>
                  </div>

                  <p className="text-base text-slate-300">
                    This exhibit explores how cellular automata generate
                    structure, computation, and persistent complexity at the
                    edge between order and chaos.
                  </p>
                  <a
                    href="#foundation"
                    className="inline-flex items-center rounded-full border border-indigo-400/60 bg-indigo-500/20 px-8 py-3 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/30"
                  >
                    Next →
                  </a>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4 text-xs text-slate-200">
                  <div className="text-lg font-semibold text-white">
                    Exhibit Overview
                  </div>
                  <p className="mt-2 text-base text-slate-300">
                    Scroll through the chapters to explore theory, simulation,
                    and researchers who shaped the field of complex systems.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                      <div className="text-lg font-semibold text-indigo-200">Interactive Labs</div>
                      <div className="mt-1 text-base text-slate-300">
                        Removed for this version: the focus is on the conceptual
                        foundation behind cellular automata and the edge of chaos.
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                      <div className="text-lg font-semibold text-indigo-200">Theory Threads</div>
                      <div className="mt-1 text-base text-slate-300">
                        Emergence, complexity, and cross-domain connections.
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                      <div className="text-lg font-semibold text-indigo-200">Applications</div>
                      <div className="mt-1 text-base text-slate-300">
                        Nature, economics, and distributed systems are examples showing where edge-of-chaos behavior appears
                        in real systems.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="foundation"
            title="Foundation"
            subtitle="Local rules that scale into structure"
            titleClassName="!text-4xl"
            subtitleClassName="!text-lg"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div className="space-y-8 text-lg text-slate-200">
                <p>
                  A cellular automaton is a discrete computational system
                  composed of a grid of cells, updated over discrete time steps.
                </p>
                <p>
                  Each cell’s next state is determined only by its neighborhood
                  (the local neighbors within a fixed radius), using a simple
                  deterministic rule.
                </p>
                <ul className="list-disc space-y-1 pl-5 text-slate-300">
                  <li>discrete grid structure</li>
                  <li>local interaction rules</li>
                  <li>synchronous time updates</li>
                  <li>emergent global behavior</li>
                </ul>
                <p>
                  Even with these constraints, cellular automata can exhibit
                  surprising complexity, especially near the boundary between
                  order and chaos.
                </p>
              </div>
              <NeighborDiagram />
            </div>
          </Section>

          <Section
            id="foundation-1d"
            title="1D Cellular Automata"
            subtitle="Elementary rules and evolving patterns"
            titleClassName="!text-4xl"
            subtitleClassName="!text-lg"
          >
            <div className="grid gap-6 lg:grid-cols-2 items-stretch">
              {/* Researcher card - LEFT column, image on the left side of card */}
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <div className="flex gap-4 items-start">
                  {/* Image - left side */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <img
                      src="/wolfram2.jpg"
                      alt="Stephen Wolfram"
                      className="h-80 w-64 rounded-xl border border-slate-700/60 object-cover object-center"
                    />
                                    <div className="text-lg font-semibold text-white">Stephen Wolfram</div>
                  </div>

                  {/* Who / What / Why - right side of card */}
                  <div className="flex-1 space-y-3">
                    <div className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">Who</div>
                      <ul className="mt-1 space-y-1 pl-1 text-slate-200 text-base">
                        <li>- Physicist and mathematician</li>
                        <li>- Founder of Wolfram Research and Mathematica</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">What</div>
                      <ul className="mt-1 space-y-1 pl-1 text-slate-200 text-base">
                        <li>- Catalogued all 256 elementary 1D cellular automaton rules</li>
                        <li>- Classified them into four behavioral classes</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-indigo-500/30 bg-indigo-600/10 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">Why</div>
                      <p className="mt-1 text-base text-indigo-100">
                        - Proved that the simplest possible rule systems can generate
                        irreducible complexity, laying the groundwork for understanding
                        where the edge of chaos lives in 1D automata.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text - RIGHT column */}
              <div className="flex flex-col justify-evenly text-lg text-slate-200 self-stretch">
                <p>
                  In one dimension, the “neighborhood” is especially clear:
                  each cell depends on itself and its immediate left/right
                  neighbors.
                </p>
                <p>
                  A single rule number encodes the outcome for all possible
                  neighborhood configurations. As the rule changes, behavior can
                  shift from periodic order to randomness and computation-like
                  complexity.
                </p>
                <p className="text-indigo-200">
                  Stephen Wolfram catalogued all 256 elementary
                  rules and found that a handfulproduce
                  behavior complex enough to support universal computation.
                </p>
              </div>
            </div>
            <div className="h-24" />
            <div className="flex flex-col gap-3 h-screen">
              <div className="flex flex-col gap-1 flex-none">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Live Demo
                </div>
                <div className="text-xl font-semibold text-white">
                  Elementary Rule Explorer
                </div>
                <p className="text-base text-slate-300">
                  Select a preset or drag the slider to change the rule. Click any output cell in the rule table to build a custom rule. Choose a starting condition and press Start.
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <ElementaryCARuleExplorer />
              </div>
            </div>
          </Section>

          <Section
            id="foundation-2d"
            title="2D Cellular Automata"
            subtitle="Game of Life and emergent motion"
            titleClassName="!text-4xl"
            subtitleClassName="!text-lg"
          >
            <div className="grid gap-6 lg:grid-cols-2 items-stretch">
              {/* Researcher card - LEFT column, image on the left side of card */}
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <div className="flex gap-4 items-start">
                  {/* Image - left side */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <img
                      src="/researchers/john-conway.png"
                      alt="John Conway"
                      className="h-80 w-64 rounded-xl border border-slate-700/60 object-cover"
                    />
                    <div className="text-lg font-semibold text-white">John Conway</div>
                  </div>

                  {/* Who / What / Why - right side of card */}
                  <div className="flex-1 space-y-3">
                    <div className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">Who</div>
                      <ul className="mt-1 space-y-1 pl-1 text-slate-200 text-base">
                        <li>- Mathematician at Cambridge</li>
                        <li>- Created the Game of Life (1970)</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">What</div>
                      <ul className="mt-1 space-y-1 pl-1 text-slate-200 text-base">
                        <li>- Developed a 2D cellular automaton with simple rules</li>
                        <li>- Demonstrated emergence of complex patterns</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-indigo-500/30 bg-indigo-600/10 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">Why</div>
                      <p className="mt-1 text-base text-indigo-100">
                        - Showed that simple rules can produce lifelike complexity and even universal computation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text - RIGHT column */}
              <div className="flex flex-col justify-evenly text-xl text-slate-200 self-stretch">
                <p>
                  In 1970, mathematician John Conway created a famous two-dimensional
                  cellular automaton: the Game of Life.
                </p>

                <p>
                  Watch for how interaction between local structures amplifies into global
                  motion and sustained activity.
                </p>
                <p className="text-indigo-200">
                  This chapter emphasizes interpretation: understand how local neighbor
                  interactions scale into persistent, life-like organization.
                </p>
              </div>
            </div>
            <div className="h-16" />
            <div className="h-screen">
              <DemoLifeCanvas />
            </div>
          </Section>

          <Section
            id="edge-of-chaos"
            title="Edge of Chaos"
            subtitle="Where order meets unpredictability"
            titleClassName="!text-4xl"
            subtitleClassName="!text-lg"
          >
            <div className="grid gap-6 lg:grid-cols-2 items-stretch">
              {/* Researcher card - LEFT column, image on the left side of card */}
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <div className="flex gap-4 items-start">
                  {/* Image - left side */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <img
                      src="/researchers/christopher-langton.png"
                      alt="Christopher Langton"
                      className="h-80 w-64 rounded-xl border border-slate-700/60 object-cover"
                    />
                    <div className="text-base font-semibold text-white">Christopher Langton</div>
                  </div>

                  {/* Who / What / Why - right side of card */}
                  <div className="flex-1 space-y-3">
                    <div className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">Who</div>
                      <ul className="mt-1 space-y-1 pl-1 text-slate-200 text-base">
                        <li>- Computer scientist</li>
                        <li>- Founder of Artificial Life</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">What</div>
                      <ul className="mt-1 space-y-1 pl-1 text-slate-200 text-base">
                        <li>- Introduced the "Edge of Chaos" concept</li>
                        <li>- Studied phase transitions in cellular automata</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border border-indigo-500/30 bg-indigo-600/10 p-3 space-y-1">
                      <div className="text-base font-semibold uppercase tracking-widest text-indigo-300">Why</div>
                      <p className="mt-1 text-base text-indigo-100">
                        - Proposed that complexity and computation emerge at the boundary between order and chaos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text - RIGHT column */}
              <div className="flex flex-col justify-evenly text-xl text-slate-200 self-stretch">
                <p>
                  Artificial Life → Cellular Automata → Lambda Parameter → Edge of Chaos
                </p>

                <blockquote className="border-l-2 border-indigo-400/60 pl-3 text-lg text-indigo-200">
                  "Life exists at the edge of chaos."
                </blockquote>
                <p className="text-indigo-200">
                  The key idea: persistent complexity often emerges when a system is neither
                  fully ordered nor fully random.
                </p>
              </div>
            </div>
            <div className="h-16" />
            <div className="flex flex-col gap-3 h-screen">
              {/* Demo header - edit the text below */}
              <div className="flex flex-col gap-1">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Live Demo
                </div>
                <div className="text-xl font-semibold text-white">
                  Lambda Parameter Explorer
                </div>
                <p className="text-base text-slate-300">
                  Drag the slider to move between order, the edge of chaos, and full randomness. Watch how the cellular automaton behavior changes.
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <EdgeOfChaosDemo />
              </div>
            </div>
          </Section>

          <Section
            id="applications"
            title="Edge of Chaos in the Real World"
            subtitle="How cellular automata connect across disciplines"
            className="!py-0 !pt-10 scroll-mt-0"
            titleClassName="!text-4xl"
            subtitleClassName="!text-lg"
          >
            <div className="flex flex-col gap-4 text-sm text-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={applicationsIndex <= 0}
                    onClick={() => {
                      const prevIndex = Math.max(applicationsIndex - 1, 0);
                      const prevId = applicationSubsections[prevIndex];
                      setApplicationsIndex(prevIndex);
                      setActiveId(prevId);
                    }}
                    className={[
                      "rounded-full border px-5 py-2 text-xs transition whitespace-nowrap",
                      applicationsIndex <= 0
                        ? "border-slate-700 bg-slate-800/60 text-slate-400"
                        : "border-indigo-400/60 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30",
                    ].join(" ")}
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    disabled={applicationsIndex >= applicationSubsections.length - 1}
                    onClick={() => {
                      const nextIndex = Math.min(
                        applicationsIndex + 1,
                        applicationSubsections.length - 1
                      );
                      const nextId = applicationSubsections[nextIndex];
                      setApplicationsIndex(nextIndex);
                      setActiveId(nextId);
                    }}
                    className={[
                      "rounded-full border px-5 py-2 text-xs transition whitespace-nowrap",
                      applicationsIndex >= applicationSubsections.length - 1
                        ? "border-slate-700 bg-slate-800/60 text-slate-400"
                        : "border-indigo-400/60 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30",
                    ].join(" ")}
                  >
                    Next →
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  {applicationSubsections.map((id, idx) => {
                    const labelById: Record<string, string> = {
                      "applications-nature": "Nature",
                      "applications-economics": "Economics",
                      "applications-networks": "Networks & Distributed Systems",
                    };

                    const isActive = applicationsIndex === idx;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setApplicationsIndex(idx);
                          setActiveId(id);
                        }}
                        className={[
                          "rounded-full border px-5 py-2 text-sm transition whitespace-nowrap",
                          isActive
                            ? "border-indigo-400/60 bg-indigo-500/20 text-indigo-100"
                            : "border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800/80 hover:text-white",
                        ].join(" ")}
                      >
                        {labelById[id] ?? id}
                      </button>
                    );
                  })}
                </div>

              </div>

              <div className="h-[calc(100vh-210px)] overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/40">
                <div
                  className="flex h-full w-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${applicationsIndex * 100}%)` }}
                >
                  <div
                    id="applications-nature"
                    className="w-full flex-none h-full flex flex-col px-6 pt-8"
                  >
                    <div className="flex flex-col flex-1 min-h-0 gap-3 text-sm text-slate-200">
                      <h3 className="text-2xl font-semibold text-white">Nature</h3>
                      <p className="text-base text-slate-400">How edge-of-chaos dynamics appear in natural systems</p>
                      <div className="flex-1 min-h-0">
                        <NatureCards />
                      </div>
                    </div>
                  </div>

                  <div
                    id="applications-economics"
                    className="w-full flex-none h-full overflow-y-auto px-6 pt-8"
                  >
                    <div className="space-y-5 text-lg text-slate-200">
                      <h3 className="text-3xl font-semibold text-white">Economics</h3>
                      <p>
                        Markets are complex adaptive systems, and like living systems,
                        they are healthiest when operating near the edge of chaos.
                        Too much regulation locks markets into rigidity; too little regulation
                        leads to crashes and unpredictability.
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-slate-300">
                        <li><span className="text-white font-medium">Ordered:</span> no innovation, stagnation, no price discovery</li>
                        <li><span className="text-white font-medium">Chaotic:</span> crashes, bank runs, systemic collapse</li>
                        <li><span className="text-white font-medium">Edge of chaos:</span> adaptive growth, competition, resilience</li>
                      </ul>
                      <p className="text-indigo-200">
                        The 2008 financial crisis is a case study in what happens when a system
                        tips from the edge into full disorder; local risk decisions cascaded
                        into global collapse.
                      </p>
                      <img
                        src="/econ.avif"
                        alt="Economics visualization"
                        className="w-full rounded-xl border border-slate-600/60 object-cover object-[center_30%] max-h-[500px]"
                      />
                    </div>
                  </div>

                  <div
                    id="applications-networks"
                    className="w-full flex-none h-full overflow-y-auto px-6 pt-8"
                  >
                    <div className="flex gap-6 h-full">
                      {/* Image - left */}
                      <div className="w-2/5 shrink-0 self-stretch overflow-hidden rounded-2xl border border-slate-700/60">
                        <img
                          src="/systems.jpeg"
                          alt="Distributed systems network"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      {/* Copy - right */}
                      <div className="flex-1 space-y-5 text-lg text-slate-200 gap-4 flex flex-col text-right">
                        <h3 className="text-3xl font-semibold text-white">Networks and Distributed Systems</h3>
                        <p>
                          Distributed systems like the internet or cloud infrastructure need to balance
                          stability and flexibility. Too much structure makes them fragile, while too
                          much randomness makes them unstable.
                        </p>
                        <ul className="space-y-1 text-slate-300 list-none">
                          <li><span className="text-white font-medium">Ordered:</span> the system becomes fragile, unable to adapt to traffic spikes or failures</li>
                          <li><span className="text-white font-medium">Chaotic:</span> no consistency, no reliability, no coordination between components</li>
                          <li><span className="text-white font-medium">Edge of chaos:</span> scalable and resilient, stable enough to be reliable, flexible enough to adapt</li>
                        </ul>
                        <p className="text-indigo-200">
                          The most effective distributed systems operate near the edge of chaos, where
                          stability and adaptability coexist, handling millions of users and unpredictable
                          demand without collapse.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <section
            id="conclusion"
            data-section
            className="snap-section relative flex h-screen flex-col scroll-mt-0 border-b border-slate-700/60 px-6 pt-12 pb-0 md:px-10 overflow-hidden"
          >
            {/* Title */}
            <div>
              <h2 className="text-4xl font-semibold text-white">Conclusion</h2>
            </div>

            {/* Content */}
            <div className="mt-6 flex flex-col gap-6 text-xl text-slate-200">
              <div className="space-y-4">
                <p>
                  Cellular automata demonstrate that complex, life-like behavior does not require
                  complex rules, only simple local update mechanisms.
                </p>
                <br />
                <p>
                  The most compelling dynamics tend to appear near the boundary between order and
                  chaos, where persistent structure and adaptive variability can coexist.
                </p>
                <br />
                <p>
                  By combining interactive simulations with theoretical context, this exhibit shows a
                  pathway from simple rules to living systems.
                </p>
              </div>

              <div>
                <a
                  href="/credits"
                  className="inline-block rounded-full border border-indigo-400/50 bg-indigo-500/10 px-6 py-2 text-xs text-indigo-200 transition hover:bg-indigo-500/20 hover:text-white"
                >
                  View Credits →
                </a>
              </div>
            </div>

            <div className="flex-1" />

            {/* Footer */}
            <footer className="border-t border-slate-700/40 pt-5 pb-4">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-indigo-400">
                    <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.9"/>
                    <rect x="7" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="13" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                    <rect x="1" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="1"/>
                    <rect x="13" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="1" y="13" width="4" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                    <rect x="7" y="13" width="4" height="4" rx="1" fill="currentColor" opacity="0.6"/>
                    <rect x="13" y="13" width="4" height="4" rx="1" fill="currentColor" opacity="0.9"/>
                  </svg>
                  <span className="text-sm font-semibold text-white">Edge of Chaos</span>
                </div>
                <p className="text-xs text-slate-400">
                  From simple rules to living systems, a research presentation on cellular automata and the edge of chaos theory.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
                  <a href="#introduction" className="hover:text-slate-200 transition">Introduction</a>
                  <a href="#foundation-1d" className="hover:text-slate-200 transition">Foundation</a>
                  <a href="#edge-of-chaos" className="hover:text-slate-200 transition">Edge of Chaos</a>
                  <a href="#applications" className="hover:text-slate-200 transition">Applications</a>
                  <a href="#conclusion" className="hover:text-slate-200 transition">Conclusion</a>
                  <a href="/credits" className="hover:text-slate-200 transition">Credits</a>
                </div>
                <div className="text-[11px] text-slate-500">
                  © 2026 Rashaun Williams & Sawyer Robinson · All rights reserved.
                </div>
              </div>
            </footer>
          </section>

        </div>
      </main>
    </div>
  );
}
