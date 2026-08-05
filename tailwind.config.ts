import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#14213D",
        bg: "#F5F6F8",
        gold: {
          DEFAULT: "#F0A202",
          hover: "#D89202",
        },
        success: "#2E8B57",
        urgency: "#E85D4C",
        cardBorder: "#E8E8E8",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        card: "20px",
        btn: "16px",
        input: "16px",
        badge: "999px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(20, 33, 61, 0.06), 0 1px 2px rgba(20, 33, 61, 0.04)",
        elevated: "0 8px 24px rgba(20, 33, 61, 0.10), 0 2px 6px rgba(20, 33, 61, 0.06)",
      },
      transitionDuration: {
        DEFAULT: "180ms",
      },
      keyframes: {
        "fade-slide-in": {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(240,162,2,0.35)" },
          "50%": { boxShadow: "0 0 0 8px rgba(240,162,2,0)" },
        },
      },
      animation: {
        "fade-slide-in": "fade-slide-in 220ms ease-out",
        "gold-pulse": "gold-pulse 1.1s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
