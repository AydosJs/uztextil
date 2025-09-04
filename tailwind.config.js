/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'max(var(--safe-area-bottom), 8px)',
      },
      padding: {
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'max(var(--safe-area-bottom), 8px)',
      },
      margin: {
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'max(var(--safe-area-bottom), 8px)',
      },
    },
  },
  plugins: [],
}
