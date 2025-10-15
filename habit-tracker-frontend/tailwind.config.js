/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        "background-dark": "#0f172a",
        "foreground-dark": "#f8fafc",
        "card-dark": "#1e293b",
        "input-dark": "#334155",
        "input-focus-dark": "#475569",
        "subtle-dark": "#94a3b8",
        "border-dark": "#334155",
        "content-dark": "#cbd5e1",
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
