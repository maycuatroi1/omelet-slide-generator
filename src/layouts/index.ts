import { ThemeConfig, LayoutName } from '../types';
import { ImageResolver } from '../services/ImageResolver';
import { BaseLayout } from './BaseLayout';
import { TitleLayout } from './TitleLayout';
import { ObjectivesLayout } from './ObjectivesLayout';
import { SectionDividerLayout } from './SectionDividerLayout';
import { BulletsLayout } from './BulletsLayout';
import { TwoColumnLayout } from './TwoColumnLayout';
import { IconGridLayout } from './IconGridLayout';
import { ProcessFlowLayout } from './ProcessFlowLayout';
import { TableLayout } from './TableLayout';
import { CodeBlockLayout } from './CodeBlockLayout';
import { SummaryLayout } from './SummaryLayout';
import { HighlightLayout } from './HighlightLayout';
import { NumberedCardsLayout } from './NumberedCardsLayout';
import { TimelineLayout } from './TimelineLayout';
import { ImageLayout } from './ImageLayout';
import { ImageTextLayout } from './ImageTextLayout';
import { ComparisonLayout } from './ComparisonLayout';
import { QuoteLayout } from './QuoteLayout';
import { StatsLayout } from './StatsLayout';
import { AgendaLayout } from './AgendaLayout';
import { LabExerciseLayout } from './LabExerciseLayout';
import { DemoLayout } from './DemoLayout';
import { ThreeColumnLayout } from './ThreeColumnLayout';
import { QnaLayout } from './QnaLayout';
import { MathLayout } from './MathLayout';
import { ImageTableLayout } from './ImageTableLayout';
import { RecapLayout } from './RecapLayout';
import { ImageProcessFlowLayout } from './ImageProcessFlowLayout';

type LayoutConstructor = new (theme: ThemeConfig, imageResolver: ImageResolver) => BaseLayout;

const LAYOUT_MAP: Record<LayoutName, LayoutConstructor> = {
  title: TitleLayout,
  objectives: ObjectivesLayout,
  sectionDivider: SectionDividerLayout,
  bullets: BulletsLayout,
  twoColumn: TwoColumnLayout,
  iconGrid: IconGridLayout,
  processFlow: ProcessFlowLayout,
  table: TableLayout,
  codeBlock: CodeBlockLayout,
  summary: SummaryLayout,
  highlight: HighlightLayout,
  numberedCards: NumberedCardsLayout,
  timeline: TimelineLayout,
  image: ImageLayout,
  imageText: ImageTextLayout,
  comparison: ComparisonLayout,
  quote: QuoteLayout,
  stats: StatsLayout,
  agenda: AgendaLayout,
  labExercise: LabExerciseLayout,
  demo: DemoLayout,
  threeColumn: ThreeColumnLayout,
  qna: QnaLayout,
  math: MathLayout,
  imageTable: ImageTableLayout,
  recap: RecapLayout,
  imageProcessFlow: ImageProcessFlowLayout,
};

export class LayoutRegistry {
  private instances = new Map<LayoutName, BaseLayout>();
  private theme: ThemeConfig;
  private imageResolver: ImageResolver;

  constructor(theme: ThemeConfig, imageResolver: ImageResolver) {
    this.theme = theme;
    this.imageResolver = imageResolver;
  }

  get(name: LayoutName): BaseLayout | undefined {
    if (!this.instances.has(name)) {
      const Ctor = LAYOUT_MAP[name];
      if (!Ctor) return undefined;
      this.instances.set(name, new Ctor(this.theme, this.imageResolver));
    }
    return this.instances.get(name);
  }

  has(name: string): name is LayoutName {
    return name in LAYOUT_MAP;
  }
}

export { BaseLayout };
export { TitleLayout } from './TitleLayout';
export { ObjectivesLayout } from './ObjectivesLayout';
export { SectionDividerLayout } from './SectionDividerLayout';
export { BulletsLayout } from './BulletsLayout';
export { TwoColumnLayout } from './TwoColumnLayout';
export { IconGridLayout } from './IconGridLayout';
export { ProcessFlowLayout } from './ProcessFlowLayout';
export { TableLayout } from './TableLayout';
export { CodeBlockLayout } from './CodeBlockLayout';
export { SummaryLayout } from './SummaryLayout';
export { HighlightLayout } from './HighlightLayout';
export { NumberedCardsLayout } from './NumberedCardsLayout';
export { TimelineLayout } from './TimelineLayout';
export { ImageLayout } from './ImageLayout';
export { ImageTextLayout } from './ImageTextLayout';
export { ComparisonLayout } from './ComparisonLayout';
export { QuoteLayout } from './QuoteLayout';
export { StatsLayout } from './StatsLayout';
export { AgendaLayout } from './AgendaLayout';
export { LabExerciseLayout } from './LabExerciseLayout';
export { DemoLayout } from './DemoLayout';
export { ThreeColumnLayout } from './ThreeColumnLayout';
export { QnaLayout } from './QnaLayout';
export { MathLayout } from './MathLayout';
export { ImageTableLayout } from './ImageTableLayout';
export { RecapLayout } from './RecapLayout';
export { ImageProcessFlowLayout } from './ImageProcessFlowLayout';
