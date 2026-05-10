/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#0a0e0a',
        surface: '#141a14',
        'surface-2': '#1c241c',
        text: '#e8efe8',
        muted: '#7a857a',
        accent: '#4ade80',
        warn: '#fbbf24',
        danger: '#ef4444',
        info: '#60a5fa',
        border: '#2a332a',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
      gridTemplateColumns: {
        24: 'repeat(24, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
