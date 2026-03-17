const researchers = [
  {
    name: "John Conway",
    role: "Invented the Game of Life and demonstrated how simple rules can produce complex emergent behavior.",
  },
  {
    name: "Stephen Wolfram",
    role: "Classified cellular automata into four behavioral classes and showed that simple computational systems can generate extraordinary complexity.",
  },
  {
    name: "Christopher Langton",
    role: "Introduced the concept of the Edge of Chaos and helped establish the field of Artificial Life.",
  },
  {
    name: "Stuart Kauffman",
    role: "Explored self-organization and complexity in biological networks, linking cellular automata to life-like behavior.",
  },
  {
    name: "Alan Turing",
    role: "Proposed reaction-diffusion models that explain natural pattern formation, inspiring cellular automata research.",
  },
];

export default function ResearcherTimeline() {
  return (
    <div className="space-y-4">
      {researchers.map((researcher, index) => (
        <div key={researcher.name} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-indigo-400 shadow-glow" />
            {index !== researchers.length - 1 ? (
              <div className="h-full w-px bg-slate-800" />
            ) : null}
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-sm font-semibold text-white">
              {researcher.name}
            </div>
            <p className="mt-2 text-xs text-slate-400">{researcher.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
