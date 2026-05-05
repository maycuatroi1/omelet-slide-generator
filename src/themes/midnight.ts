import { ThemeConfig } from '../types';

export const midnightTheme: ThemeConfig = {
  name: 'midnight',
  colors: {
    primary: '1E2761',
    primaryDark: '141B45',
    secondary: 'CADCFC',
    accent: '0891B2',
    accentLight: '67E8F9',
    dark: '1A1A2E',
    medium: '6B7280',
    light: 'F8FAFC',
    white: 'FFFFFF',
    border: 'E2E8F0',
    textGray: 'E5E7EB',
  },
  fonts: {
    title: 'Trebuchet MS',
    body: 'Calibri',
    code: 'Consolas',
  },
  slideWidth: 13.33,
  slideHeight: 7.5,
  header: {
    style: 'banner',
    titlePosition: { x: 0.5, y: 0.1, w: 12.33, h: 0.8 },
    fontSize: 26,
  },
  footer: {
    style: 'text',
  },
  boxStyle: 'filled',
};
