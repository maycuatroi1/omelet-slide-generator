import { ThemeConfig } from '../types';

const ORANGE = 'F26F21';
const ORANGE_DEEP = 'C24E12';
const ORANGE_TINT = 'FCEBDF';

const INK_900 = '14110F';
const INK_800 = '1C1815';
const INK_700 = '2B2724';
const INK_600 = '4A423C';
const INK_500 = '6E6660';
const INK_400 = '8C837B';
const INK_200 = 'DCD6CF';
const INK_150 = 'D3CCC4';
const INK_100 = 'EFEBE5';

export const fptMonoTheme: ThemeConfig = {
  name: 'fpt-mono',
  colors: {
    primary: ORANGE,
    primaryDark: INK_900,
    primaryLight: ORANGE_TINT,
    secondary: ORANGE,
    secondaryLight: ORANGE_TINT,
    accent: ORANGE,
    accentLight: ORANGE_TINT,
    danger: ORANGE_DEEP,
    dangerLight: ORANGE_TINT,
    success: INK_700,
    successLight: INK_100,
    dark: INK_800,
    medium: INK_500,
    textGray: INK_500,
    light: INK_100,
    surface: 'FFFFFF',
    white: 'FFFFFF',
    border: INK_200,
    boxBorder: INK_150,
    codeBg: INK_900,
    purple: INK_600,
    purpleLight: INK_100,
    orange: ORANGE,
    orangeLight: ORANGE_TINT,
    yellow: INK_400,
    yellowLight: INK_100,
    cyan: INK_600,
    lightGreen: INK_700,
  },
  fonts: {
    title: 'Segoe UI',
    body: 'Segoe UI',
    code: 'Consolas',
  },
  background: 'FAFAF9',
  slideWidth: 13.33,
  slideHeight: 7.5,
  header: {
    style: 'minimal',
    titlePosition: { x: 2.20, y: 0.22, w: 10.51, h: 0.58 },
    fontSize: 26,
  },
  footer: {
    style: 'line',
  },
  logo: {
    paths: [
      'assets/fpt_logo.png',
      '../assets/fpt_logo.png',
      '../../slides/assets/fpt_logo.png',
    ],
    small: { x: 0.62, y: 0.30, w: 1.30, h: 0.44 },
    large: { x: 0.62, y: 0.62, w: 2.6, h: 0.86 },
  },
  content: {
    x: 0.62,
    y: 1.02,
    w: 12.09,
    bottom: 6.82,
    takeawayY: 6.2,
  },
  boxStyle: 'bordered',
};
