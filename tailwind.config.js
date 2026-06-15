/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0eeff',
          100: '#e0ddff',
          300: '#a89cf5',
          400: '#8b7ff5',
          500: '#6c5ce7',
          600: '#5a4ad1',
          700: '#4538a8',
          900: '#1a1540',
        },
        gold: {
          400: '#f6c90e',
          500: '#e8b800',
        },
        teal: {
          400: '#00cec9',
          500: '#00b5b1',
        },
        navy: {
          950: '#05050f',
          900: '#0a0a1f',
          800: '#0f0f2e',
          700: '#16163d',
          600: '#1e1e50',
          500: '#2a2a6a',
        },
        surface: {
          border: 'rgba(108,92,231,0.18)',
          subtle: 'rgba(255,255,255,0.06)',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
        'slide-in':   'slideIn 0.3s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
