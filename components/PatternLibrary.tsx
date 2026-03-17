interface Pattern {
  name: string;
  points: Array<[number, number]>;
}

interface PatternLibraryProps {
  onSelect: (pattern: Pattern) => void;
}

const patterns: Pattern[] = [
  {
    name: "Glider",
    points: [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  },
  {
    name: "Blinker",
    points: [
      [-1, 0],
      [0, 0],
      [1, 0],
    ],
  },
  {
    name: "Toad",
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ],
  },
  {
    name: "Spaceship",
    points: [
      [0, 0],
      [3, 0],
      [4, 1],
      [0, 2],
      [4, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3],
    ],
  },
  {
    name: "Glider Gun",
    points: [
      [0, 4],
      [1, 4],
      [0, 5],
      [1, 5],
      [10, 4],
      [10, 5],
      [10, 6],
      [11, 3],
      [11, 7],
      [12, 2],
      [12, 8],
      [13, 2],
      [13, 8],
      [14, 5],
      [15, 3],
      [15, 7],
      [16, 4],
      [16, 5],
      [16, 6],
      [17, 5],
      [20, 2],
      [20, 3],
      [20, 4],
      [21, 2],
      [21, 3],
      [21, 4],
      [22, 1],
      [22, 5],
      [24, 0],
      [24, 1],
      [24, 5],
      [24, 6],
      [34, 2],
      [34, 3],
      [35, 2],
      [35, 3],
    ],
  },
];

export default function PatternLibrary({ onSelect }: PatternLibraryProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {patterns.map((pattern) => (
        <button
          key={pattern.name}
          type="button"
          onClick={() => onSelect(pattern)}
          className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-200 transition hover:border-indigo-400 hover:text-white"
        >
          {pattern.name}
        </button>
      ))}
    </div>
  );
}
