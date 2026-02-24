import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "surface-1": "var(--surface-1)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        border: "var(--border)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        // Topic colors
        "topic-client": "#3B82F6",
        "topic-project": "#8B5CF6",
        "topic-goal": "#10B981",
        // Status colors
        "status-draft": "#6B7280",
        "status-pending": "#F59E0B",
        "status-approved": "#3B82F6",
        "status-executed": "#10B981",
        // Signal colors
        "signal-info": "#3B82F6",
        "signal-warning": "#F97316",
        "signal-critical": "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        interactive: "var(--shadow-interactive)",
        "interactive-hover": "var(--shadow-interactive-hover)",
      },
      keyframes: {
        "aurora-drift-1": {
          "0%, 100%": { transform: "translate(0%, 0%)" },
          "50%": { transform: "translate(3%, -4%)" },
        },
        "aurora-drift-2": {
          "0%, 100%": { transform: "translate(0%, 0%)" },
          "50%": { transform: "translate(-4%, 3%)" },
        },
        "aurora-drift-3": {
          "0%, 100%": { transform: "translate(0%, 0%)" },
          "50%": { transform: "translate(2%, 5%)" },
        },
      },
      animation: {
        "aurora-1": "aurora-drift-1 20s ease-in-out infinite",
        "aurora-2": "aurora-drift-2 25s ease-in-out infinite",
        "aurora-3": "aurora-drift-3 22s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
