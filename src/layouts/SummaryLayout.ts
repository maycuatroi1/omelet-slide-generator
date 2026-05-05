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
      this.addLogo(slide, true);
      slide.addText(data.title || 'Key Takeaways', {
        ...header.titlePosition,
        fontSize: header.fontSize,
        color: colors.dark, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as string[];
    const isBanner = this.theme.header.style === 'banner';
    const count = items.length;

    const startY = isBanner ? 1.5 : 1.15;
    const endY = 6.7;
    const maxSpacing = isBanner ? 0.7 : 0.85;
    const spacing = Math.min(maxSpacing, (endY - startY) / count);
    const fontSize = count > 6 ? (isBanner ? 14 : 15) : (isBanner ? 16 : 18);
    const itemH = spacing - 0.05;

    if (!isBanner) {
      this.addBox(slide, 0.9, 1.0, 11.53, endY - 1.0 + 0.15);
    }

    items.forEach((item, i) => {
      const y = startY + i * spacing;
      const ellipseX = isBanner ? 0.9 : 1.1;
      const textX = isBanner ? 1.5 : 1.7;
      const ellipseSize = Math.min(0.4, itemH - 0.05);

      slide.addShape('ellipse', {
        x: ellipseX, y: y + (itemH - ellipseSize) / 2, w: ellipseSize, h: ellipseSize,
        fill: { color: isBanner ? this.C.secondary : this.C.primary },
      });
      slide.addText(`${i + 1}`, {
        x: ellipseX, y: y + (itemH - ellipseSize) / 2, w: ellipseSize, h: ellipseSize,
        fontSize: isBanner ? 12 : 14, color: this.C.white, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.body, margin: 0,
      });
      slide.addText(item, {
        x: textX, y, w: isBanner ? 11.0 : 10.5, h: itemH,
        fontSize, color: this.C.dark, valign: 'middle',
        fontFace: this.F.body,
      });
    });
  }
}
