const cards = [
  {
    title: "Snowflakes",
    text: "Snowflake growth emerges from local interactions between water molecules during crystallization. These interactions produce branching fractal structures that resemble cellular automata simulations.",
  },
  {
    title: "Animal Skin Patterns",
    text: "Patterns such as zebra stripes and leopard spots emerge from reaction-diffusion processes first described by Alan Turing. Local chemical interactions generate large-scale patterns across animal skin.",
  },
  {
    title: "Wildfires",
    text: "Wildfire spread is often modeled using cellular automata. Each cell represents a tree, burning tree, or empty space. At certain densities of vegetation, fires spread in complex branching patterns resembling critical systems near the edge of chaos.",
  },
];

export default function NatureCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm"
        >
          <div className="text-sm font-semibold text-white">{card.title}</div>
          <p className="mt-2 text-xs text-slate-400">{card.text}</p>
        </div>
      ))}
    </div>
  );
}
