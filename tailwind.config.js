/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003527',
          container: '#064e3b',
        },
        secondary: {
          DEFAULT: '#C5A059',
          container: '#fed488',
        },
        surface: {
          DEFAULT: '#f7faf8',
          low: '#f1f4f2',
          lowest: '#ffffff',
          high: '#ebefed',
        },
        maqam: {
          emerald: '#003527',
          gold: '#C5A059',
          paper: '#f7faf8',
          text: '#181c1b',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif"', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'ambient': '0 10px 40px -10px rgba(24, 28, 27, 0.04)',
      }
    },
  },
  plugins: [],
}
