/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1F4E79',
          'primary-hover': '#173C5E',
          secondary: '#2D7D6E',
          background: '#F6F7F9',
          surface: '#FFFFFF',
          'surface-alt': '#EEF1F5',
          text: '#16202B',
          'text-muted': '#5A6673',
          border: '#D7DDE4',
          success: '#2E7D52',
          warning: '#9A6512',
          error: '#A62C2C',
          focus: '#1F4E79',
        },
        intensity: {
          1: '#E3ECF4',
          2: '#B9CFE3',
          3: '#89AECD',
          4: '#5789B3',
          5: '#2D6193',
        },
        severity: {
          low: '#B9CFE3',
          medium: '#5789B3',
          high: '#2D6193',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Noto Sans', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        'narrow': '640px',
        'wide': '1440px',
      },
      width: {
        'panel': '420px',
      },
      boxShadow: {
        'level-1': '0 1px 2px rgba(22, 32, 43, 0.08)',
        'level-2': '0 8px 24px rgba(22, 32, 43, 0.16)',
      }
    },
  },
  plugins: [],
};
