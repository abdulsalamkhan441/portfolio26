/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#060606",
        forest: "#111111",
        olive: "#2b2b2b",
        slate: "#8b8b8b",
        amber: "#f2efe8",
      },
      fontFamily: {
        display: ["Avapore", "Syne", "sans-serif"],
        heading:  ["Syne", "sans-serif"],
        body:     ["Inter", "sans-serif"],
        mono:     ["Space Mono", "monospace"],
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in-out": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      keyframes: {
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};