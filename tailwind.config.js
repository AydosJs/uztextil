/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          primary: 'var(--color-brand-primary)',
          'primary-foreground': 'var(--color-brand-primary-foreground)',
          secondary: 'var(--color-brand-secondary)',
          'secondary-foreground': 'var(--color-brand-secondary-foreground)',
        },
        // Background colors
        background: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
          card: 'var(--color-background-card)',
          'card-hover': 'var(--color-background-card-hover)',
        },
        // Text colors
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
        },
        // Border colors
        border: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
          tertiary: 'var(--color-border-tertiary)',
          focus: 'var(--color-border-focus)',
        },
        // Status colors
        status: {
          success: 'var(--color-status-success)',
          'success-foreground': 'var(--color-status-success-foreground)',
          error: 'var(--color-status-error)',
          'error-foreground': 'var(--color-status-error-foreground)',
          warning: 'var(--color-status-warning)',
          'warning-foreground': 'var(--color-status-warning-foreground)',
          info: 'var(--color-status-info)',
          'info-foreground': 'var(--color-status-info-foreground)',
        },
        // Shadow colors
        shadow: {
          primary: 'var(--color-shadow-primary)',
          secondary: 'var(--color-shadow-secondary)',
        },
      },
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
      boxShadow: {
        'brand': 'var(--shadow-brand)',
        'brand-lg': 'var(--shadow-brand-lg)',
        'card': 'var(--shadow-card)',
        'card-inset': 'var(--shadow-card-inset)',
      },
    },
  },
  plugins: [],
}
