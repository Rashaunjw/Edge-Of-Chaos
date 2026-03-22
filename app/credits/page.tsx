import Link from "next/link";

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-slate-800 px-6 py-16 md:px-14">

      {/* Back button — top right */}
      <div className="fixed top-5 right-6 z-50">
        <Link
          href="/"
          className="inline-block rounded-full border border-slate-600 bg-slate-800 px-5 py-2 text-xs text-slate-300 shadow-md transition hover:border-slate-400 hover:text-slate-100"
        >
          ← Back to Presentation
        </Link>
      </div>

      <div className="mx-auto max-w-5xl space-y-10">

        {/* Header */}
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Research Site
          </div>
          <h1 className="text-3xl font-semibold text-white">Credits</h1>
          <p className="text-sm text-slate-300">
            Image credits and academic references for this presentation.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-10 md:grid-cols-2 md:divide-x md:divide-slate-700/60">

          {/* Left — Image Credits */}
          <div className="space-y-5 md:pr-10">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
              Image Credits
            </div>

            <ul className="space-y-5">
              {[
                { label: "John Conway", note: "Photographer / Source · URL · License" },
                { label: "Christopher Langton", note: "Photographer / Source · URL · License" },
                { label: "Snowflake", note: "Photographer / Source · URL · License" },
                { label: "Animal Skin Patterns (Zebra)", note: "Photographer / Source · URL · License" },
                { label: "Wildfire", note: "Photographer / Source · URL · License" },
              ].map((item) => (
                <li key={item.label} className="border-b border-slate-700/40 pb-4">
                  <div className="font-medium text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-400 italic">{item.note}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — References */}
          <div className="space-y-5 md:pl-10">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
              References
            </div>

            <ul className="space-y-5">
              {[
                {
                  label: "Conway's Game of Life",
                  note: "Gardner, M. (1970). Mathematical Games. Scientific American, 223(4), 120–123.",
                },
                {
                  label: "Edge of Chaos",
                  note: "Langton, C. G. (1990). Computation at the Edge of Chaos: Phase Transitions and Emergent Computation. Physica D, 42(1–3), 12–37.",
                },
                {
                  label: "Turing / Reaction-Diffusion Patterns",
                  note: "Turing, A. M. (1952). The Chemical Basis of Morphogenesis. Philosophical Transactions of the Royal Society B, 237(641), 37–72.",
                },
                {
                  label: "Cellular Automata — General Theory",
                  note: "Wolfram, S. (2002). A New Kind of Science. Wolfram Media.",
                },
                {
                  label: "Wildfire Spread Modeling",
                  note: "Add source — author, year, title, journal/publisher.",
                },
                {
                  label: "Neural / Excitable Media Models",
                  note: "Add source — author, year, title, journal/publisher.",
                },
                {
                  label: "Complexity Economics",
                  note: "Arthur, W. B. (1999). Complexity and the Economy. Science, 284(5411), 107–109.",
                },
              ].map((item) => (
                <li key={item.label} className="border-b border-slate-700/40 pb-4">
                  <div className="font-medium text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.note}</div>
                </li>
              ))}
            </ul>
          </div>

        </div>


      </div>
    </div>
  );
}
