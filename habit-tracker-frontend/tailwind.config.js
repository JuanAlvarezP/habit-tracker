/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "foreground-light": "#0f172a",
        "foreground-dark": "#f8fafc",
        "card-light": "#ffffff",
        "card-dark": "#1a2734",
        "input-light": "#e2e8f0",
        "input-dark": "#2d3748",
        "input-focus-light": "#a0aec0",
        "input-focus-dark": "#4a5568",
        "subtle-light": "#64748b",
        "subtle-dark": "#94a3b8",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        full: "9999px",
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [require("@tailwindcss/forms")],
};
