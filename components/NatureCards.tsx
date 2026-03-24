const cards = [
  {
    title: "Snowflakes",
    bullets: [
      { label: "Ordered:", text: "uniform ice sheets with no branching structure" },
      { label: "Chaotic:", text: "random irregular crystals with no recognizable form" },
      { label: "Edge of chaos:", text: "intricate fractal branching patterns unique to each snowflake" },
    ],
    imageSrc: "/nature/snowflake.png",
    objectFit: "object-contain",
  },
  {
    title: "Animal Skin Patterns",
    bullets: [
      { label: "Ordered:", text: "solid uniform color across the entire skin surface" },
      { label: "Chaotic:", text: "random noise with no coherent pattern" },
      { label: "Edge of chaos:", text: "stripes and spots that repeat with local variation" },
    ],
    imageSrc: "/nature/animal-patterns.png",
    objectFit: "object-cover",
  },
  {
    title: "Wildfires",
    bullets: [
      { label: "Ordered:", text: "when vegetation is too sparse for fire to spread at all" },
      { label: "Chaotic:", text: "uniform burning that consumes everything instantly" },
      { label: "Edge of chaos:", text: "complex branching fire fronts that resemble real wildfire behavior" },
    ],
    imageSrc: "/nature/wildfires.png",
    objectFit: "object-contain",
  },
];

export default function NatureCards() {
  return (
    <div className="grid h-full gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex flex-col rounded-2xl border border-slate-700 bg-slate-800/60 p-4 shadow-sm"
        >
          <div className="text-lg font-semibold text-white">{card.title}</div>
          <ul className="mt-2 space-y-1.5 text-base">
            {card.bullets.map((b) => (
              <li key={b.label} className="text-slate-300">
                <span className="font-medium text-white">{b.label}</span> {b.text}
              </li>
            ))}
          </ul>
          <img
            src={card.imageSrc}
            alt={card.title}
            className={`mt-3 w-full h-auto rounded-lg border border-slate-700/60 ${card.objectFit}`}
          />
        </div>
      ))}
    </div>
  );
}
