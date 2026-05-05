import { ThemeConfig } from '../types';

export const n8nTheme: ThemeConfig = {
  name: 'n8n',
  colors: {
    primary: '1E40AF',
    primaryDark: '1E3A8A',
    primaryLight: 'DBEAFE',
    secondary: '059669',
    secondaryLight: 'D1FAE5',
    accent: 'DC2626',
    accentLight: 'FEE2E2',
    dark: '1F2937',
    medium: '6B7280',
    light: 'F3F4F6',
    white: 'FFFFFF',
    border: 'E5E7EB',
    purple: '6D28D9',
    purpleLight: 'EDE9FE',
    orange: 'EA580C',
    orangeLight: 'FFF7ED',
    yellow: 'D97706',
    yellowLight: 'FFFBEB',
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
