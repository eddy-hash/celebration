export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  'bg-base': string;
  'bg-elevated': string;
  'bg-surface': string;
  'brand': string;
  'brand-dark': string;
  'brand-light': string;
  'gold': string;
  'text-primary': string;
  'text-secondary': string;
  'text-muted': string;
  'border-subtle': string;
}

/**
 * Colors stored as RGB channels (e.g. "233 30 99" not "#E91E63")
 * Improves contrast for secondary/muted text compared to earlier versions.
 */
export const THEMES: Record<ThemeMode, ThemeColors> = {
  dark: {
    'bg-base': '13 13 13',
    'bg-elevated': '26 26 26',
    'bg-surface': '36 36 36',
    'brand': '233 30 99',
    'brand-dark': '194 24 91',
    'brand-light': '244 143 177',
    'gold': '212 160 23',
    // ⭐ Brighter text for better readability
    'text-primary': '255 255 255',       // pure white
    'text-secondary': '209 213 219',      // was 176 176 176 — brighter
    'text-muted': '156 163 175',          // was 107 107 107 — much brighter
    'border-subtle': '55 55 55',          // was 46 46 46 — slightly brighter
  },
  light: {
    'bg-base': '255 255 255',
    'bg-elevated': '249 250 251',
    'bg-surface': '243 244 246',
    'brand': '233 30 99',
    'brand-dark': '194 24 91',
    'brand-light': '244 143 177',
    'gold': '161 118 8',
    // ⭐ Darker text for better readability
    'text-primary': '17 24 39',           // very dark gray (near black)
    'text-secondary': '55 65 81',         // was 75 85 99 — darker
    'text-muted': '107 114 128',          // was 156 163 175 — much darker
    'border-subtle': '209 213 219',       // slightly darker for definition
  },
};

export function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const colors = THEMES[mode];

  root.setAttribute('data-theme', mode);

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}

export function hexToRgbChannels(hex: string): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function applyBrandColor(hex: string) {
  if (typeof document === 'undefined') return;
  const rgb = hexToRgbChannels(hex);
  document.documentElement.style.setProperty('--color-brand', rgb);
}
