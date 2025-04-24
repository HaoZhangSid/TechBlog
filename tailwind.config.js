/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{hbs,js}'], // Pointing to the views directory
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22d3ee',
          50: '#ecfdff',
          100: '#d5f9ff',
          200: '#b3f5ff',
          300: '#7feeff',
          400: '#30e1fa',
          500: '#06c6e0',
          600: '#059db4',
          700: '#0a7d90',
          800: '#0f6674',
          900: '#155664',
          950: '#083c48'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
} 