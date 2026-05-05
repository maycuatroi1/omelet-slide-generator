import PptxGenJS from 'pptxgenjs';
import { SlideData, AgendaItem } from '../types';
import { BaseLayout } from './BaseLayout';

export class AgendaLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const { header, colors, fonts } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.2, fill: { color: colors.primary } });
      slide.addText(data.title || 'Agenda', {
        x: 0.5, y: 0.15, w: 12.33, h: 0.9,
        fontSize: 28, color: colors.white, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    } else {
      this.addLogo(slide, true);
      slide.addText(data.title || 'Agenda', {
        ...header.titlePosition,
        fontSize: header.fontSize,
        color: colors.dark, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const typeColors: Record<string, string> = {
      lecture: this.C.primary,
      demo: this.C.secondary,
      lab: this.C.purple || this.C.primary,
      break: this.C.medium,
      discussion: this.C.orange || this.C.accent,
    };

    const items = (data.items || []) as AgendaItem[];
    const isBanner = this.theme.header.style === 'banner';
    const baseY = isBanner ? 1.5 : 1.1;

    items.forEach((item, i) => {
      const y = baseY + i * 0.85;
      const color = typeColors[item.type || ''] || this.C.primary;

      if (isBanner) {
        slide.addShape('rect', {
          x: 0.8, y, w: 11.73, h: 0.7,
          fill: { color: i % 2 === 0 ? this.C.light : this.C.white },
        });
        slide.addShape('rect', { x: 0.8, y, w: 0.15, h: 0.7, fill: { color } });
      } else {
        this.addBox(slide, 0.9, y, 11.53, 0.7);
        slide.addShape('rect', { x: 0.9, y, w: 0.12, h: 0.7, fill: { color } });
      }

      slide.addText(item.time || '', {
        x: isBanner ? 1.1 : 1.2, y, w: 2.0, h: 0.7,
        fontSize: 14, color: this.C.dark, bold: true, valign: 'middle',
        fontFace: this.F.code, margin: 0,
      });

      slide.addText(item.label || '', {
        x: 3.3, y, w: 7.0, h: 0.7,
        fontSize: 16, color: this.C.dark, valign: 'middle',
        fontFace: this.F.body,
      });

      this.roundedRect(slide, 10.5, y + 0.15, 1.8, 0.4, {
        fill: { color }, rectRadius: 0.2,
      });
      slide.addText((item.type || '').toUpperCase(), {
        x: 10.5, y: y + 0.15, w: 1.8, h: 0.4,
        fontSize: 10, color: this.C.white, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.body, margin: 0,
      });
    });
  }
}
