export type LayoutName =
  | 'title'
  | 'objectives'
  | 'sectionDivider'
  | 'bullets'
  | 'twoColumn'
  | 'iconGrid'
  | 'processFlow'
  | 'table'
  | 'codeBlock'
  | 'summary'
  | 'highlight'
  | 'numberedCards'
  | 'timeline'
  | 'image'
  | 'imageText'
  | 'comparison'
  | 'quote'
  | 'stats'
  | 'agenda'
  | 'labExercise'
  | 'demo'
  | 'threeColumn'
  | 'qna'
  | 'math'
  | 'imageTable'
  | 'recap'
  | 'imageProcessFlow';

export interface IconGridItem {
  icon?: string;
  label: string;
  desc?: string;
}

export interface ProcessStep {
  title: string;
  desc?: string;
}

export interface NumberedCardItem {
  title: string;
  desc?: string;
}

export interface TimelineItem {
  label: string;
  desc?: string;
}

export interface StatItem {
  value: string;
  label: string;
  desc?: string;
  color?: string;
}

export interface AgendaItem {
  time: string;
  label: string;
  type?: 'lecture' | 'demo' | 'lab' | 'break' | 'discussion';
}

export interface ComparisonColumn {
  heading: string;
  items: string[];
  color?: string;
}

export interface SlideData {
  layout: LayoutName;
  title?: string;
  subtitle?: string;
  notes?: string;

  author?: string;
  date?: string;

  items?: (string | IconGridItem | NumberedCardItem | TimelineItem | StatItem | AgendaItem)[];
  columns?: (ComparisonColumn | { heading: string; items: string[] })[];
  steps?: (string | ProcessStep)[];

  sectionNumber?: number;
  columnCount?: number;

  leftTitle?: string;
  rightTitle?: string;
  leftItems?: string[];
  rightItems?: string[];

  headers?: string[];
  rows?: string[][];
  colWidths?: number[];
  takeaway?: string;
  eyebrow?: string;

  code?: string;
  language?: string;
  description?: string;

  formulas?: { label?: string; latex: string }[];
  variables?: string[];

  highlight?: string;
  details?: string[];

  imagePath?: string;
  imagePosition?: 'left' | 'right';
  caption?: string;

  quote?: string;
  attribution?: string;

  type?: 'qna' | 'break' | 'discussion';

  duration?: string;
  verify?: string[];

  flows?: { label: string; steps: ProcessStep[] }[];
}

export interface ContentModule {
  title?: string;
  author?: string;
  subject?: string;
  courseLabel?: string;
  slides: SlideData[];
  meta?: {
    title?: string;
    author?: string;
    subject?: string;
  };
  notes?: Record<string, string>;
}
