"use client";

import GameOfLifeCanvas from "@/components/GameOfLifeCanvas";
import ElementaryCARuleExplorer from "@/components/ElementaryCARuleExplorer";

export default function DemoLab() {
  return (
    <div className="space-y-6">
      <GameOfLifeCanvas
        title="Game of Life Sandbox"
        description="Adjust parameters, paint cells, and inject patterns to explore emergent behavior."
      />
      <ElementaryCARuleExplorer />
    </div>
  );
}
