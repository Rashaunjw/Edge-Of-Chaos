import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "order-blue": "#3b82f6",
        "edge-purple": "#8b5cf6",
        "chaos-red": "#ef4444",
      },
      boxShadow: {
        glow: "0 0 20px rgba(99, 102, 241, 0.35)",
      },
      backgroundImage: {
        "grid-subtle":
          "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
