/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-newsreader)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        newsreader: ['var(--font-newsreader)', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        archivo: ['Archivo', 'sans-serif'],
        'work-sans': ['Work Sans', 'sans-serif'],
        baskerville: ['Libre Baskerville', 'serif'],
        funnel: ['Funnel Display', 'sans-serif'],
        'newsreader-light': ['var(--font-newsreader-light)'],
      },
    },
  },
  plugins: [],
} 