/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        arabic: ["Noto-Naskh-Arabic", "serif"],
        english: ["Public-Sans", "sans-serif"],
        verses: ["Quran-verse", "sans-serif"],
      },
    },
  },
  plugins: [],
};
