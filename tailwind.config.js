/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // 🔥 dark mode support
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#009efb", // dashboard blue
      },
    },
  },
  plugins: [],
};
