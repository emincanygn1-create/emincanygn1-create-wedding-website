import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#F5F7F1",
          100: "#E8ECDF",
          200: "#D1D9C0",
          300: "#AEBB93",
          400: "#8A9A6C",
          500: "#6B7D4E",
          600: "#556339",
          700: "#3F4E32", // primary dark olive
          800: "#333F28",
          900: "#2C3823",
        },
        cream: {
          DEFAULT: "#FAF6EC",
          soft: "#F3EDDD",
        },
        gold: {
          DEFAULT: "#C9A227",
          dark: "#A8841E",
          light: "#E3C766",
        },
        rust: {
          DEFAULT: "#B5533C",
          dark: "#93402D",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-jost)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0", visibility: "hidden" },
        },
        curtainUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.9s ease-out forwards",
        fadeIn: "fadeIn 1.4s ease-out forwards",
        fadeOut: "fadeOut 0.9s ease-in forwards",
        curtainUp: "curtainUp 1.1s cubic-bezier(0.76, 0, 0.24, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
