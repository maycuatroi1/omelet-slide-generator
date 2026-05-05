import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class HighlightLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const { header, colors, fonts } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.0, fill: { color: colors.accent } });
      slide.addText(data.title || 'Important', {
        x: 0.5, y: 0.1, w: 12.33, h: 0.8,
        fontSize: 26, color: colors.white, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    } else {
      this.addLogo(slide, true);
      slide.addText(data.title || 'Important', {
        ...header.titlePosition,
        fontSize: header.fontSize,
        color: colors.dark, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const isBanner = this.theme.header.style === 'banner';
    const hasDetails = data.details && data.details.length > 0;

    if (isBanner) {
      this.roundedRect(slide, 0.8, 1.5, 11.73, 2.5, {
        fill: { color: this.C.accentLight || this.C.light }, rectRadius: 0.1,
        line: { color: this.C.accent, width: 2 },
      });
      slide.addText(data.highlight || '', {
        x: 1.2, y: 1.7, w: 10.93, h: 2.0,
        fontSize: 20, color: this.C.accent, bold: true,
        fontFace: this.F.body, valign: 'middle',
      });
      if (hasDetails) {
        slide.addText(this.makeBulletItems(data.details!), {
          x: 1.0, y: 4.3, w: 11.33, h: 2.8,
          fontSize: 16, color: this.C.dark, paraSpaceAfter: 6,
          fontFace: this.F.body,
        });
      }
    } else {
      const highlightH = hasDetails ? 1.8 : 5.5;
      this.addBox(slide, 0.9, 1.0, 11.53, highlightH);
      slide.addShape('rect', {
        x: 0.9, y: 1.0, w: 0.15, h: highlightH,
        fill: { color: this.C.accent },
      });
      slide.addText(data.highlight || '', {
        x: 1.3, y: 1.05, w: 10.9, h: highlightH - 0.1,
        fontSize: 18, color: this.C.dark, bold: true,
        fontFace: this.F.body, valign: 'middle',
      });
      if (hasDetails) {
        const detailsY = 1.0 + highlightH + 0.2;
        const detailsH = 6.7 - detailsY;
        this.addBox(slide, 0.9, detailsY, 11.53, detailsH);
        slide.addText(this.makeBulletItems(data.details!), {
          x: 1.2, y: detailsY + 0.15, w: 10.93, h: detailsH - 0.3,
          fontSize: 14, color: this.C.dark, paraSpaceAfter: 6,
          fontFace: this.F.body, valign: 'top',
        });
      }
    }
  }
}
