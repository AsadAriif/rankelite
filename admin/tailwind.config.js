/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: '#080808',
        darkcard: '#121212',
        gold: {
          500: '#D4AF37',
          300: '#FFD700',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
