export interface ChildThemePalette {
  name: string;
  hex: string;
  primary: string;
  primaryHover: string;
  accent: string;
  lightBg: string;
  border: string;
  gradient: string;
}

export const CHILD_THEMES: Record<string, ChildThemePalette> = {
  '#38bdf8': {
    name: 'Sky Blue',
    hex: '#38bdf8',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    accent: '#38bdf8',
    lightBg: '#f0f9ff',
    border: '#bae6fd',
    gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fef3c7 100%)',
  },
  '#ec4899': {
    name: 'Rose Pink',
    hex: '#ec4899',
    primary: '#db2777',
    primaryHover: '#be185d',
    accent: '#ec4899',
    lightBg: '#fff1f2',
    border: '#fbcfe8',
    gradient: 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #fef3c7 100%)',
  },
  '#10b981': {
    name: 'Emerald Mint',
    hex: '#10b981',
    primary: '#059669',
    primaryHover: '#047857',
    accent: '#10b981',
    lightBg: '#ecfdf5',
    border: '#a7f3d0',
    gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #fef3c7 100%)',
  },
  '#f59e0b': {
    name: 'Warm Amber',
    hex: '#f59e0b',
    primary: '#d97706',
    primaryHover: '#b45309',
    accent: '#f59e0b',
    lightBg: '#fffbeb',
    border: '#fde68a',
    gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fed7aa 100%)',
  },
  '#8b5cf6': {
    name: 'Royal Purple',
    hex: '#8b5cf6',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    accent: '#8b5cf6',
    lightBg: '#faf5ff',
    border: '#e9d5ff',
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #fef3c7 100%)',
  },
  '#f97316': {
    name: 'Sunset Orange',
    hex: '#f97316',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    accent: '#f97316',
    lightBg: '#fff7ed',
    border: '#fed7aa',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)',
  },
};

export function getChildTheme(hexColor?: string): ChildThemePalette {
  if (!hexColor) return CHILD_THEMES['#38bdf8'];
  return CHILD_THEMES[hexColor.toLowerCase()] || CHILD_THEMES['#38bdf8'];
}

export function applyChildTheme(hexColor?: string) {
  if (typeof document === 'undefined') return;
  const theme = getChildTheme(hexColor);
  const root = document.documentElement;

  root.style.setProperty('--child-theme-hex', theme.hex);
  root.style.setProperty('--child-theme-primary', theme.primary);
  root.style.setProperty('--child-theme-hover', theme.primaryHover);
  root.style.setProperty('--child-theme-accent', theme.accent);
  root.style.setProperty('--child-theme-light', theme.lightBg);
  root.style.setProperty('--child-theme-border', theme.border);
  document.body.style.background = theme.gradient;
}

