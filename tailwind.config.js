/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0F0F0F",
        "dark-surface": "#1A1A1A",
        "dark-border": "#383838",
        "dark-hover": "#2A3A4A",
        "dark-text": "#F2F2F2",
        "dark-text-secondary": "#BBBBBB",
        "dark-button": "#1A7FDB",
        "dark-button-hover": "#2A8FEB",
        "twitter-blue": "#1D9BF0",
        "twitter-blue-hover": "#1A91DA",
        "twitter-red": "#F4245E",
        "twitter-green": "#00BA7C",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      screens: {
        xs: "480px",
      },
      animation: {
        "heart-beat": "heart-beat 0.3s ease-in-out",
      },
      keyframes: {
        "heart-beat": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [
    // @ts-ignore
    require("@tailwindcss/forms"),
  ],
};
