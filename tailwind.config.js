/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./views/**/*.{hbs,js}'], // Pointing to the views directory
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
        textColor: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        accent: 'var(--color-accent)',
        cardBackground: 'var(--color-card-background)',
        borderColor: 'var(--color-border)',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
} 