import type { Config } from "tailwindcss";

/**
 * Macklemore Fashion (macklemorefashions.com) — Tailwind CSS Configuration
 * Synthesizes the editorial minimalism of The Collective with the drop-model energy of Home Apparel 254.
 * Brand hex tokens extracted directly from macklemorefashions.com and the official M+M+African print logo sheet.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0B0B0C",
          surface: "#121214",
          elevated: "#18181B",
          border: "#272523",
        },
        bone: {
          DEFAULT: "#F6F5F1",
          warm: "#FFF8ED",
          muted: "#E8E6DF",
          border: "#D6D3CD",
        },
        macklemore: {
          crimson: "#E31E24",    // Swatch 2 & MACKLEMORE wordmark primary red
          gold: "#D4860B",       // Root --gold frame & diamond accent
          terracotta: "#E05C1A", // Root --orange & Ankara geometric accent
          bronze: "#7A491D",     // Swatch 3 & M monogram inner chevron rail
          rust: "#B03A10",       // Root --rust deep heritage tone
          teal: "#1A7A6E",       // Root --teal logistics & corridor accent
          green: "#2E6B35",      // Root --green secondary pattern accent
          charcoal: "#222222",   // Swatch 1 charcoal
        },
      },
      borderWidth: {
        DEFAULT: "1px",
        px: "1px",
      },
      fontFamily: {
        display: ["var(--font-syne)", "var(--font-cinzel)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "var(--font-geist-mono)", "monospace"],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "700": "700ms",
        "900": "900ms",
        "1200": "1200ms",
      },
      letterSpacing: {
        editorial: "-0.03em",
        technical: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;

