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
        'safe-bottom': 'var(--safe-area-bottom)',
      },
      padding: {
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'var(--safe-area-bottom)',
      },
      margin: {
        'safe-top': 'var(--safe-area-top)',
        'safe-bottom': 'var(--safe-area-bottom)',
      },
    },
  },
  plugins: [],
}
