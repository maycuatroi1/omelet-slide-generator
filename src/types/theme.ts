export interface Colors {
  primary: string;
  primaryDark: string;
  primaryLight?: string;
  secondary: string;
  secondaryLight?: string;
  accent: string;
  accentLight?: string;
  dark: string;
  medium: string;
  light: string;
  white: string;
  border: string;
  purple?: string;
  purpleLight?: string;
  orange?: string;
  orangeLight?: string;
  yellow?: string;
  yellowLight?: string;
  cyan?: string;
  lightGreen?: string;
  textGray?: string;
  boxBorder?: string;
  danger?: string;
  dangerLight?: string;
  success?: string;
  successLight?: string;
  surface?: string;
  codeBg?: string;
}

export interface Fonts {
  title: string;
  body: string;
  code: string;
}

export type HeaderStyle = 'banner' | 'minimal';
export type FooterStyle = 'line' | 'text';
export type BoxStyle = 'filled' | 'semi-transparent' | 'bordered';

export interface ThemeConfig {
  name: string;
  colors: Colors;
  fonts: Fonts;
  background?: string;
  slideWidth: number;
  slideHeight: number;
  header: {
    style: HeaderStyle;
    titlePosition: { x: number; y: number; w: number; h: number };
    fontSize: number;
  };
  footer: {
    style: FooterStyle;
    courseLabel?: string;
  };
  logo?: {
    paths: string[];
    small: { x: number; y: number; w: number; h: number };
    large: { x: number; y: number; w: number; h: number };
  };
  cornerLogo?: {
    path: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  content?: {
    x?: number;
    y?: number;
    w?: number;
    bottom?: number;
    takeawayY?: number;
  };
  boxStyle: BoxStyle;
}
