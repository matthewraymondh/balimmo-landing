/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Balimmo brand tokens (from the original landing page)
        primary: {
          DEFAULT: '#003538', // dark teal used for headings
          dark: '#063436',
          deep: '#0c3b35',
          muted: '#4b645f',
        },
        accent: {
          DEFAULT: '#eba859', // gold used for backgrounds / highlights
          alt: '#FFA00A',
          strong: '#b8722c', // darker gold for text on white (≥3:1 contrast)
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}
