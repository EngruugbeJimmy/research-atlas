import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bluewater Basin survey-chart palette — deliberately not the
        // warm-cream/terracotta or near-black/acid-green AI defaults.
        ink: {
          DEFAULT: "#0E1B1F", // deep tidal ink — dark mode background
          800: "#132428",
          700: "#1A2F33",
        },
        paper: {
          DEFAULT: "#F1EDE4", // field-notebook paper — light mode background
          dim: "#E7E1D3",
        },
        basin: {
          50: "#EAF4F3",
          100: "#CFE6E4",
          300: "#7DB6B3",
          500: "#1D6E73", // lagoon teal — primary accent
          600: "#175A5E",
          700: "#124648",
        },
        silt: {
          300: "#D9B497",
          500: "#A97452", // clay/soil — secondary accent, sparing use
          600: "#8A5C3F",
        },
        contour: {
          400: "#6E9B8C",
          500: "#4C7A6B", // topographic line color
        },
        signal: {
          400: "#E3BE55",
          500: "#D4A72C", // brass instrument-dial amber — highlights, achievements
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "contour-lines":
          "radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, currentColor 41px, transparent 42px)",
      },
      animation: {
        "contour-breathe": "contour-breathe 8s ease-in-out infinite",
        "drift-slow": "drift 40s linear infinite",
      },
      keyframes: {
        "contour-breathe": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.02)", opacity: "0.75" },
        },
        drift: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
