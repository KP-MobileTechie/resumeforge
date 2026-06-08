export interface ThemeTokens {
  id: string;
  label: string;
  headingFont: 'sans' | 'serif';
  bodyFont: 'sans' | 'serif';
  accent: string;
  density: 'normal' | 'compact';
  skillsLayout: 'list' | 'two-col';
}

export const THEMES: Record<string, ThemeTokens> = {
  classic: { id: 'classic', label: 'Classic', headingFont: 'serif', bodyFont: 'serif', accent: '#111827', density: 'normal', skillsLayout: 'list' },
  modern:  { id: 'modern',  label: 'Modern',  headingFont: 'sans',  bodyFont: 'sans',  accent: '#2563eb', density: 'normal', skillsLayout: 'list' },
  compact: { id: 'compact', label: 'Compact', headingFont: 'sans',  bodyFont: 'sans',  accent: '#0f766e', density: 'compact', skillsLayout: 'two-col' },
  minimal: { id: 'minimal', label: 'Minimal', headingFont: 'sans',  bodyFont: 'sans',  accent: '#374151', density: 'normal', skillsLayout: 'list' },
};

export const THEME_LIST = Object.values(THEMES);

export function getTheme(id: string): ThemeTokens {
  return THEMES[id] ?? THEMES.modern;
}
