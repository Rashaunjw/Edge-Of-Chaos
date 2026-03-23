import Link from "next/link";

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-slate-800 px-6 py-16 md:px-14">

      {/* Back button - top right */}
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

          {/* Left - Image Credits */}
          <div className="space-y-5 md:pr-10">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
              Image Credits
            </div>

            <ul className="space-y-5">
              {[
                { label: "John Conway", note: "Photographer / Source · URL · License", href: undefined },
                { label: "Christopher Langton", note: "Photographer / Source · URL · License", href: undefined },
                { label: "Snowflake", note: "Photographer / Source · URL · License", href: undefined },
                { label: "Animal Skin Patterns (Zebra)", note: "Photographer / Source · URL · License", href: undefined },
                { label: "Wildfire", note: "Photographer / Source · URL · License", href: undefined },
                { label: "Brain Section Render (Neuroscience)", note: "Shutterstock · Standard License", href: "https://www.shutterstock.com/search/brain-section-render" },
              ].map((item) => (
                <li key={item.label} className="border-b border-slate-700/40 pb-4">
                  <div className="font-medium text-white">{item.label}</div>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-indigo-300 hover:text-indigo-100 transition italic">{item.note} ↗</a>
                  ) : (
                    <div className="mt-1 text-xs text-slate-400 italic">{item.note}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Right - References */}
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
                  label: "Turing / Reaction-Diffusion Patterns",
                  note: "Turing, A. M. (1952). The Chemical Basis of Morphogenesis. Philosophical Transactions of the Royal Society B, 237(641), 37–72.",
                },
                {
                  label: "Cellular Automata: General Theory",
                  note: "Wolfram, S. (2002). A New Kind of Science. Wolfram Media.",
                },
              ].map((item) => (
                <li key={item.label} className="border-b border-slate-700/40 pb-4">
                  <div className="font-medium text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.note}</div>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
              Papers Cited
            </div>

            <ul className="space-y-5">
              {[
                {
                  label: "Computation at the Edge of Chaos",
                  note: "Langton, C. G. (1990). Computation at the Edge of Chaos: Phase Transitions and Emergent Computation. Physica D, 42(1–3), 12–37.",
                },
                {
                  label: "Revisiting the Edge of Chaos",
                  note: 'Mitchell, M., Hraber, P. T., & Crutchfield, J. P. (1993). Revisiting the Edge of Chaos: Evolving Cellular Automata to Perform Computations. Santa Fe Institute Working Paper 93-03-014. Complex Systems, 7(2), 89–130.',
                },
                {
                  label: '"Edge of Chaos" in 1D Cellular Automata',
                  note: '"Edge of Chaos" in 1D Cellular Automata.',
                },
                {
                  label: "Hidden Complexity in Life-like Rules",
                  note: "Melgarejo, M., Alzate, M., & Obregon, N. (2019). Hidden Complexity in Life-like Rules. Physical Review E, 100, 052133.",
                },
                {
                  label: "Damage Spreading and μ-sensitivity on Cellular Automata",
                  note: "Martin, B. (2007). Damage Spreading and μ-sensitivity on Cellular Automata. Ergodic Theory and Dynamical Systems, 27, 545–565.",
                },
                {
                  label: "Models of Cell Processes are Far from the Edge of Chaos",
                  note: "Park, K. H., Costa, F. X., Rocha, L. M., Albert, R., & Rozum, J. C. (2023). Models of Cell Processes are Far from the Edge of Chaos. PRX Life.",
                },
                {
                  label: "Implementation of Logical Functions in the Game of Life",
                  note: "Rennard, J.-P. Implementation of Logical Functions in the Game of Life. In A. Adamatzky (Ed.), Collision-Based Computing. Springer.",
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

        {/* Full-width - Web Resources */}
        <div className="border-t border-slate-700/40 pt-10 space-y-5">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
            Web Resources
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {[
              {
                label: "Cellular Automata: Stanford Encyclopedia of Philosophy",
                note: "Rohrlich, F. & Eck, D. Cellular Automata. Stanford Encyclopedia of Philosophy.",
                href: "https://plato.stanford.edu/entries/cellular-automata/#EdgeChao",
              },
              {
                label: "The Nature of Code: Cellular Automata",
                note: "Shiffman, D. The Nature of Code, Chapter 7: Cellular Automata. natureofcode.com.",
                href: "https://natureofcode.com/cellular-automata/#what-is-a-cellular-automaton",
              },
              {
                label: "Edge of Chaos Interactive Demo",
                note: "Eck, D. J. Edge of Chaos: Elementary Cellular Automata Explorer. math.hws.edu.",
                href: "https://math.hws.edu/xJava/CA/EdgeOfChaos.html",
              },
              {
                label: "Play Conway's Game of Life",
                note: "Martin, E. Play John Conway's Game of Life. playgameoflife.com.",
                href: "https://playgameoflife.com/",
              },
            ].map((item) => (
              <li key={item.label} className="border-b border-slate-700/40 pb-4">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-300 hover:text-indigo-100 transition"
                >
                  {item.label} ↗
                </a>
                <div className="mt-1 text-xs text-slate-400">{item.note}</div>
                <div className="mt-1 text-[10px] text-slate-500 break-all">{item.href}</div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
