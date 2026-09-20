/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0a0c0f',
          card: '#13171f',
          'card-hover': '#1c222e',
          border: '#2b3345',
          text: '#f0f3f8',
          muted: '#8a96a8',
        },
        team: {
          primary: 'var(--team-primary, #007A33)',
          secondary: 'var(--team-secondary, #BA9653)',
          contrast: 'var(--team-contrast, #FFFFFF)',
          glow: 'var(--team-glow, rgba(0, 122, 51, 0.25))',
        }
      },
      fontFamily: {
        condensed: ['"Barlow Condensed"', 'Oswald', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Roboto Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'team-glow': '0 0 20px -3px var(--team-glow, rgba(0, 122, 51, 0.25))',
        'team-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px -3px var(--team-glow, rgba(0, 122, 51, 0.15))',
      }
    },
  },
  plugins: [],
}
