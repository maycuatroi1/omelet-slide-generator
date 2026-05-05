import { ThemeConfig } from '../types';
import { n8nTheme } from './n8n';
import { minimalismTheme } from './minimalism';
import { midnightTheme } from './midnight';

const themes: Record<string, ThemeConfig> = {
  n8n: n8nTheme,
  minimalism: minimalismTheme,
  midnight: midnightTheme,
};

export function getTheme(name: string): ThemeConfig {
  const theme = themes[name];
  if (!theme) {
    throw new Error(`Theme "${name}" not found. Available: ${Object.keys(themes).join(', ')}`);
  }
  return theme;
}

export function registerTheme(theme: ThemeConfig): void {
  themes[theme.name] = theme;
}

export { n8nTheme, minimalismTheme, midnightTheme };
