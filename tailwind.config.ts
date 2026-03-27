import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark marine palette
        navy: {
          950: '#040d1a',
          900: '#0a1628',
          800: '#0f2038',
          700: '#162d4d',
          600: '#1e3a5f',
          500: '#2a4a73',
        },
        // Cyan accents
        marine: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Semantic colors for maritime signs
        port: '#dc2626',        // Red — IALA port side
        starboard: '#16a34a',   // Green — IALA starboard side
        cardinal: '#eab308',    // Yellow — cardinal marks
        danger: '#ef4444',      // Red — danger marks
        safewater: '#dc2626',   // Red/white — safe water
        special: '#eab308',     // Yellow — special marks
        lighthouse: '#f59e0b',  // Amber — lighthouses
        lock: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        marker: {
          green: '#10b981',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-route': '0 0 12px rgba(34, 211, 238, 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config
