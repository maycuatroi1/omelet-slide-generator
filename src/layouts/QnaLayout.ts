import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class QnaLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const qnaType = data.type || 'qna';
    const configs: Record<string, { accent: string; defaultTitle: string }> = {
      qna: { accent: this.C.primary, defaultTitle: 'Questions & Answers' },
      break: { accent: this.C.medium, defaultTitle: 'Break Time' },
      discussion: { accent: this.C.secondary, defaultTitle: 'Discussion' },
    };
    const cfg = configs[qnaType] || configs.qna;

    if (this.theme.header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.2, fill: { color: cfg.accent } });
      slide.addText(data.title || cfg.defaultTitle, {
        x: 0.5, y: 0.15, w: 12.33, h: 0.9,
        fontSize: 28, color: this.C.white, bold: true,
        fontFace: this.F.title, margin: 0,
      });
    } else {
      super.addHeader(slide, { ...data, title: data.title || cfg.defaultTitle });
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const qnaType = data.type || 'qna';
    const configs: Record<string, { accent: string; icon: string }> = {
      qna: { accent: this.C.primary, icon: '?' },
      break: { accent: this.C.medium, icon: '||' },
      discussion: { accent: this.C.secondary, icon: '!' },
    };
    const cfg = configs[qnaType] || configs.qna;
    const isBanner = this.theme.header.style === 'banner';
    const startY = isBanner ? 1.5 : 1.2;
    const items = (data.items || []) as string[];
    const hasItems = items.length > 0;

    this.addBox(slide, 0.5, startY, 12.33, 6.7 - startY);

    if (hasItems) {
      slide.addShape('ellipse', {
        x: 0.8, y: startY + 0.25, w: 0.7, h: 0.7,
        fill: { color: cfg.accent },
      });
      slide.addText(cfg.icon, {
        x: 0.8, y: startY + 0.25, w: 0.7, h: 0.7,
        fontSize: 24, color: this.C.white, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.title, margin: 0,
      });

      slide.addText(this.rich(data.subtitle || '', { fontSize: 16, color: this.C.primaryDark, bold: true }), {
        x: 1.7, y: startY + 0.25, w: 10.8, h: 0.7,
        fontSize: 16, color: this.C.primaryDark, valign: 'middle',
        fontFace: this.F.body, bold: true,
      });

      const bulletY = startY + 1.2;
      const listH = 6.6 - bulletY;
      const spacing = listH / Math.max(items.length, 1);

      items.forEach((item, i) => {
        const y = bulletY + i * spacing;
        slide.addShape('ellipse', {
          x: 1.2, y: y + spacing / 2 - 0.14, w: 0.28, h: 0.28,
          fill: { color: cfg.accent },
        });
        slide.addText(`${i + 1}`, {
          x: 1.2, y: y + spacing / 2 - 0.14, w: 0.28, h: 0.28,
          fontSize: 11, color: this.C.white, bold: true,
          align: 'center', valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
        slide.addText(this.rich(item, { fontSize: 15, color: this.C.dark }, { color: this.C.primaryDark }), {
          x: 1.65, y, w: 10.85, h: spacing,
          fontSize: 15, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
      });
    } else {
      slide.addShape('ellipse', {
        x: 5.77, y: startY + 0.4, w: 1.8, h: 1.8,
        fill: { color: cfg.accent },
      });
      slide.addText(cfg.icon, {
        x: 5.77, y: startY + 0.4, w: 1.8, h: 1.8,
        fontSize: 48, color: this.C.white, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.title, margin: 0,
      });

      const subtitle = data.subtitle || '';
      const textY = startY + 2.5;
      slide.addText(subtitle, {
        x: 1.2, y: textY, w: 10.93, h: 6.7 - textY - 0.2,
        fontSize: subtitle.length > 150 ? 15 : 20,
        color: this.C.textGray, align: 'center', valign: 'top',
        fontFace: this.F.body, wrap: true,
      });
    }
  }
}
