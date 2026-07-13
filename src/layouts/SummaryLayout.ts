import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class SummaryLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const { header, colors, fonts } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.2, fill: { color: colors.secondary } });
      slide.addText(data.title || 'Key Takeaways', {
        x: 0.5, y: 0.15, w: 12.33, h: 0.9,
        fontSize: 28, color: colors.white, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    } else {
      super.addHeader(slide, { ...data, title: data.title || 'Key Takeaways' });
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as string[];
    const isBanner = this.theme.header.style === 'banner';
    const count = items.length || 1;

    if (isBanner) {
      const startY = 1.5;
      const spacing = Math.min(0.7, (6.7 - startY) / count);
      items.forEach((item, i) => {
        const y = startY + i * spacing;
        slide.addShape('ellipse', {
          x: 0.9, y: y + 0.05, w: 0.4, h: 0.4,
          fill: { color: this.C.secondary },
        });
        slide.addText(`${i + 1}`, {
          x: 0.9, y: y + 0.05, w: 0.4, h: 0.4,
          fontSize: 12, color: this.C.white, bold: true,
          align: 'center', valign: 'middle', fontFace: this.F.body, margin: 0,
        });
        slide.addText(item, {
          x: 1.5, y, w: 11.0, h: spacing - 0.05,
          fontSize: count > 6 ? 14 : 16, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body,
        });
      });
      return;
    }

    const takeaway = data.takeaway || data.caption;
    const top = this.CY;
    const availH = this.contentH(!!takeaway);
    const rowH = availH / count;
    const fontSize = this.fitSize(count, 17, 12, 5);

    items.forEach((item, i) => {
      const y = top + i * rowH;
      const accent = i % 2 === 0 ? this.C.primary : this.C.accent;

      slide.addShape('rect', {
        x: this.CX, y: y + 0.04, w: 0.42, h: rowH - 0.16,
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });
      slide.addText(`${i + 1}`, {
        x: this.CX, y: y + 0.04, w: 0.42, h: rowH - 0.16,
        fontSize: 14, color: 'FFFFFF', bold: true,
        align: 'center', valign: 'middle', fontFace: this.F.title, margin: 0,
      });
      slide.addText(this.rich(item, { fontSize, color: this.C.dark }, { color: this.C.primaryDark }), {
        x: this.CX + 0.58, y, w: this.CW - 0.62, h: rowH - 0.1,
        fontSize, color: this.C.dark, valign: 'middle',
        fontFace: this.F.body, margin: 0,
      });
      if (i < count - 1) {
        slide.addShape('line', {
          x: this.CX, y: y + rowH - 0.05, w: this.CW, h: 0,
          line: { color: this.C.border, width: 0.75 },
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
