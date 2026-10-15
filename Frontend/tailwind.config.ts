import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0D0D0D',
        'bg-elevated': '#1A1A1A',
        'bg-surface': '#242424',
        brand: { DEFAULT: '#E91E63', dark: '#C2185B', light: '#F48FB1' },
        gold: '#D4A017',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'text-muted': '#6B6B6B',
        'border-subtle': '#2E2E2E',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.25)',
        'card-hover': '0 12px 40px rgba(233,30,99,0.25)',
        button: '0 4px 16px rgba(233,30,99,0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
