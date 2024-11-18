/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        arabic: ["Noto-Kufi-Arabic", "serif"],
        english: ["Public-Sans", "sans-serif"],
        quran: ["Noto-Naskh-Arabic", "serif"],
        verses: ["Quran-verse", "sans-serif"],
      },
      colors: {
        primary: "#339933",
        secondary: "#f69002",
      },
    },
  },
  plugins: [],
};
