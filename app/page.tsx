"use client";

import { useEffect, useMemo, useState } from "react";
import HeroBackground from "@/components/HeroBackground";
import Sidebar from "@/components/Sidebar";
import Section from "@/components/Section";
import DemoLifeCanvas from "@/components/DemoLifeCanvas";
import NatureCards from "@/components/NatureCards";
import NeighborDiagram from "@/components/NeighborDiagram";

const navItems = [
  {
    id: "introduction",
    label: "Introduction",
    children: [
      { id: "introduction-demo", label: "Demo" },
    ],
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
  { id: "applications", label: "Real-World Applications" },
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
      "applications-biology",
      "applications-neuroscience",
      "applications-art-games",
      "applications-ai",
      "applications-computational-theory",
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
      { threshold: 0.4 }
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
        activeId={activeId}
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

                  <p className="text-base text-slate-200">
                    Complex, life-like behavior can arise from simple local
                    interactions.
                  </p>

                  <div className="rounded-xl border border-indigo-400/40 bg-indigo-500/10 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                      Thesis:
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-indigo-200">
                      Complex, life-like behavior can emerge from extremely simple
                      rules, and the most interesting forms of this complexity
                      occur at the boundary between order and chaos: the Edge of
                      Chaos.
                    </p>
                  </div>

                  <p className="text-sm text-slate-300">
                    This exhibit explores how cellular automata generate
                    structure, computation, and persistent complexity at the
                    edge between order and chaos.
                  </p>
                  <a
                    href="#introduction-demo"
                    className="inline-flex items-center rounded-full border border-indigo-400/60 bg-indigo-500/20 px-5 py-2 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/30"
                  >
                    Next →
                  </a>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-4 text-xs text-slate-200">
                  <div className="text-sm font-semibold text-white">
                    Exhibit Overview
                  </div>
                  <p className="mt-2 text-slate-300">
                    Scroll through the chapters to explore theory, simulation,
                    and researchers who shaped the field of complex systems.
                  </p>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                      <div className="text-indigo-200">Interactive Labs</div>
                      <div className="mt-1 text-slate-300">
                        Removed for this version: the focus is on the conceptual
                        foundation behind cellular automata and the edge of chaos.
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                      <div className="text-indigo-200">Theory Threads</div>
                      <div className="mt-1 text-slate-300">
                        Emergence, complexity, and cross-domain connections.
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                      <div className="text-indigo-200">Real-World Applications</div>
                      <div className="mt-1 text-slate-300">
                        Biology, neuroscience, economics, AI, and computational
                        theory examples showing where edge-of-chaos behavior appears
                        in real systems.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <section
            id="introduction-demo"
            data-section
            className="snap-section relative flex h-screen flex-col scroll-mt-12 border-b border-slate-700/60 px-6 py-8 md:px-10"
          >
            <DemoLifeCanvas />
          </section>

          <Section
            id="foundation"
            title="Foundation"
            subtitle="Local rules that scale into structure"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 text-sm text-slate-200">
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
                  surprising complexity—especially near the boundary between
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
          >
            <div className="space-y-6">
              <div className="space-y-3 text-sm text-slate-200">
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
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/30 p-4 text-xs text-slate-200">
                This section used to include an interactive 1D rule explorer.
                For now, it focuses on the conceptual rule-to-pattern connection.
              </div>
            </div>
          </Section>

          <Section
            id="foundation-2d"
            title="2D Cellular Automata"
            subtitle="Game of Life and emergent motion"
          >
            <div className="space-y-6">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-stretch">
                <div className="space-y-4 text-sm text-slate-200">
                  <p>
                    In 1970, mathematician John Conway created a famous two-dimensional
                    cellular automaton: the Game of Life.
                  </p>
                  <p>
                    It uses only a small set of local update rules, but the results can
                    look alive—gliders, oscillators, and long-lived “guns” that generate
                    moving patterns.
                  </p>
                  <p>
                    Watch for how interaction between local structures amplifies into global
                    motion and sustained activity.
                  </p>
                  <p className="text-indigo-200">
                    This chapter emphasizes interpretation: understand how local neighbor
                    interactions scale into persistent, life-like organization.
                  </p>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                    <div className="text-sm font-semibold text-white">
                      Researcher Spotlight: John Conway
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
                      <li>
                        Introduced the Game of Life (1970), showing complex
                        behavior can emerge from very simple local rules.
                      </li>
                      <li>
                        Demonstrated that rich motion and persistence do not
                        require central control or a designer.
                      </li>
                      <li>
                        His work helped popularize cellular automata as a serious
                        model for emergence and computation.
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col rounded-2xl border border-slate-700 bg-slate-800/30 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    John Conway
                  </div>
                  <img
                    src="/researchers/john-conway.png"
                    alt="John Conway"
                    className="mt-3 flex-1 w-full min-h-0 rounded-xl border border-slate-700/60 object-cover"
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="edge-of-chaos"
            title="Edge of Chaos"
            subtitle="Where order meets unpredictability"
          >
            <div className="space-y-5 rounded-2xl border border-slate-700 bg-slate-800/40 p-6 text-sm text-slate-200">
              <p>
                Christopher Langton proposed that the most interesting computational
                behavior occurs at the boundary between order and chaos. In this region,
                systems can maintain structure and information flow while still exploring
                new outcomes.
              </p>
              <blockquote className="border-l-2 border-indigo-400/60 pl-3 text-sm text-indigo-200">
                “Life exists at the edge of chaos.”
              </blockquote>
              <p className="text-indigo-200">
                The key idea: persistent complexity often emerges when a system is neither
                fully ordered nor fully random.
              </p>
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <div className="text-sm font-semibold text-white">
                  Researcher Spotlight: Christopher Langton
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-200">
                  <li>
                    Proposed the term <em>edge of chaos</em> to describe the
                    regime between rigid order and full randomness.
                  </li>
                  <li>
                    Argued that life-like complexity appears most strongly in
                    this boundary region.
                  </li>
                  <li>
                    Helped establish Artificial Life as a field, connecting
                    cellular automata, adaptation, and emergent behavior.
                  </li>
                </ul>
                <img
                  src="/researchers/christopher-langton.png"
                  alt="Christopher Langton"
                  className="mt-3 h-56 w-auto max-w-full rounded-xl border border-slate-700/60 object-contain"
                />
              </div>
            </div>
          </Section>

          <Section
            id="applications"
            title="Real-World Applications"
            subtitle="How cellular automata connect across disciplines"
            className="!py-0 scroll-mt-0"
          >
            <div className="flex flex-col gap-4 text-sm text-slate-200">
              <p>
                Cellular automata provide a compact “shared language” for studying
                complex systems: local rules, interaction, and emergence.
              </p>
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap gap-2 flex-1">
                  {applicationSubsections.map((id, idx) => {
                    const labelById: Record<string, string> = {
                      "applications-biology": "Biology/Nature",
                      "applications-neuroscience": "Neuroscience",
                      "applications-art-games": "Economics",
                      "applications-ai": "Artificial Intelligence",
                      "applications-computational-theory":
                        "Computational Theory",
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
                          "rounded-full border px-3 py-1 text-xs transition",
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
              </div>

              <div className="h-[calc(100vh-280px)] overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/40">
                <div
                  className="flex h-full w-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${applicationsIndex * 100}%)` }}
                >
                  <div
                    id="applications-biology"
                    className="w-full flex-none h-full flex flex-col px-6 py-6"
                  >
                    <div className="flex flex-col flex-1 min-h-0 gap-3 text-sm text-slate-200">
                      <h3 className="text-2xl font-semibold text-white">
                        Biology/Nature
                      </h3>
                      <div className="space-y-2">
                        <p>
                          Many natural patterns emerge from local interactions between components.
                          Cellular automata offer a clean way to model how “neighborhood rules”
                          can generate global structure in systems like crystals, animals, and
                          ecological spread.
                        </p>
                        <p>
                          Near the edge of chaos, the system can balance stability (enough structure
                          to persist) with flexibility (enough variability to adapt), which helps
                          make pattern formation robust under perturbations.
                        </p>
                      </div>
                      <div className="flex-1 min-h-0">
                        <NatureCards />
                      </div>
                    </div>
                  </div>

                  <div
                    id="applications-neuroscience"
                    className="w-full flex-none h-full overflow-y-auto px-6 py-10"
                  >
                    <div className="space-y-5 text-sm text-slate-200">
                      <h3 className="text-2xl font-semibold text-white">
                        Neuroscience
                      </h3>
                      <p>
                        Neural tissue can be modeled as an interacting network with local connectivity.
                        Cellular automata translate that intuition into discrete states (e.g., resting,
                        firing, refractory) updated by nearby activity.
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-slate-300">
                        <li>
                          Excitable-media-style propagation: activity can spread as traveling waves.
                        </li>
                        <li>
                          Criticality and edge behavior: networks can exhibit rich dynamics between
                          quiescence and runaway chaos.
                        </li>
                        <li>
                          Self-organization: local learning rules can produce global functional
                          organization over time.
                        </li>
                      </ul>
                      <p className="text-indigo-200">
                        In this context, the “edge of chaos” idea matches how brains may maintain a
                        balance between stability for perception and flexibility for adaptation.
                      </p>
                    </div>
                  </div>

                  <div
                    id="applications-art-games"
                    className="w-full flex-none h-full overflow-y-auto px-6 py-10"
                  >
                    <div className="space-y-5 text-sm text-slate-200">
                      <h3 className="text-2xl font-semibold text-white">
                        Economics 
                      </h3>
                      <p>
                        Markets behave like complex systems operating near the edge of
                        chaos.
                      </p>
                      <p>
                        In overly ordered conditions, markets may become rigid: low
                        change, low innovation, and long-term stagnation.
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-slate-300">
                        <li>Too ordered: no change, no innovation, stagnation</li>
                        <li>Too chaotic: crashes, instability, unpredictability</li>
                        <li>Edge of chaos: growth, adaptation, innovation</li>
                      </ul>
                      <p className="text-indigo-200">
                        Markets need structure to function, but also enough
                        unpredictability to evolve.
                      </p>
                    </div>
                  </div>

                  <div
                    id="applications-ai"
                    className="w-full flex-none h-full overflow-y-auto px-6 py-10"
                  >
                    <div className="space-y-5 text-sm text-slate-200">
                      <h3 className="text-2xl font-semibold text-white">
                        Artificial Intelligence
                      </h3>
                      <p>
                        Cellular automata are also tools for computation and machine learning. Because CA
                        dynamics are local and structured, they form a useful model for understanding how
                        complex behavior can be generated from constrained updates.
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-slate-300">
                        <li>
                          Learning rules: search or optimization can tune CA transition rules to match data.
                        </li>
                        <li>
                          Compact world models: CA can represent coarse dynamics efficiently.
                        </li>
                        <li>
                          Inductive bias: locality acts like a built-in prior for many problems.
                        </li>
                      </ul>
                      <p className="text-indigo-200">
                        The edge of chaos perspective is often relevant for AI because it highlights regimes
                        where systems can remain informative (not fully random) while still exploring new
                        outcomes.
                      </p>
                    </div>
                  </div>

                  <div
                    id="applications-computational-theory"
                    className="w-full flex-none h-full overflow-y-auto px-6 py-10"
                  >
                    <div className="space-y-5 text-sm text-slate-200">
                      <h3 className="text-2xl font-semibold text-white">
                        Computational Theory
                      </h3>
                      <p>
                        Theoretical computer science uses cellular automata as testbeds for universality,
                        complexity, and algorithmic behavior. They connect physics-like local interactions
                        to rigorous computation questions.
                      </p>
                      <ul className="list-disc space-y-1 pl-5 text-slate-300">
                        <li>Universality: some CA can simulate arbitrary computation</li>
                        <li>Complexity classes: rule behavior can correlate with computational power</li>
                        <li>
                          Computational irreducibility: predicting long-term behavior may require essentially
                          running the system
                        </li>
                      </ul>
                      <p>
                        In other words, CA let you study how “simple rules” produce not just patterns,
                        but computation itself.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <section
            id="conclusion"
            data-section
            className="snap-section relative flex min-h-screen flex-col scroll-mt-12 border-b border-slate-700/60 px-6 py-8 md:px-10"
          >
            {/* Title */}
            <div>
              <h2 className="text-3xl font-semibold text-white">Conclusion</h2>
            </div>

            {/* Content */}
            <div className="mt-6 flex flex-col gap-6 text-sm text-slate-200">
              <div className="space-y-4">
                <p>
                  Cellular automata demonstrate that complex, life-like behavior does not require
                  complex rules—only simple local update mechanisms.
                </p>
                <p>
                  The most compelling dynamics tend to appear near the boundary between order and
                  chaos, where persistent structure and adaptive variability can coexist.
                </p>
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

            {/* Spacer — adjust h-XX to move footer up or down */}
            <div className="h-96" />

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
                  From simple rules to living systems — a research presentation on cellular automata.
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
                  © 2026 Rashaun Williams · All rights reserved.
                </div>
              </div>
            </footer>
          </section>

        </div>
      </main>
    </div>
  );
}
