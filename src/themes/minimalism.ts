import { ThemeConfig } from '../types';

export const minimalismTheme: ThemeConfig = {
  name: 'minimalism',
  colors: {
    primary: '156082',
    primaryDark: '0E2841',
    secondary: '196B24',
    accent: 'E97132',
    cyan: '0F9ED5',
    purple: 'A02B93',
    lightGreen: '4EA72E',
    dark: '3B3B3B',
    textGray: '64748B',
    medium: '6B7280',
    light: 'F3F4F6',
    white: 'FFFFFF',
    border: 'E8E8E8',
    boxBorder: 'BFBFBF',
  },
  fonts: {
    title: 'Arial',
    body: 'Arial',
    code: 'Consolas',
  },
  slideWidth: 13.33,
  slideHeight: 7.5,
  header: {
    style: 'minimal',
    titlePosition: { x: 1.83, y: 0.18, w: 11.31, h: 0.56 },
    fontSize: 28,
  },
  footer: {
    style: 'line',
  },
  logo: {
    paths: [
      '../assets/fpt_logo.png',
      '../../slides/assets/fpt_logo.png',
      'assets/fpt_logo.png',
    ],
    small: { x: 0.2, y: 0.15, w: 1.57, h: 0.61 },
    large: { x: 0.4, y: 0.3, w: 2.36, h: 0.92 },
  },
  boxStyle: 'semi-transparent',
};
