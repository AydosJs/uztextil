/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  css: {
    "@import": {
      "tailwindcss": {},
    },
  },
  theme: {
    extend: {
      spacing: {
        "safe-top": "var(--safe-area-inset-top)",
        "safe-bottom": "var(--safe-area-inset-bottom)",
      },
    },
  },
}
