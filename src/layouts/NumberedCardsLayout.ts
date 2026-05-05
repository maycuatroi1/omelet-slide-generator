import PptxGenJS from 'pptxgenjs';
import { SlideData, NumberedCardItem } from '../types';
import { BaseLayout } from './BaseLayout';

export class NumberedCardsLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as NumberedCardItem[];
    const cols = Math.min(items.length, 3);
    const rows = Math.ceil(items.length / cols);
    const isBanner = this.theme.header.style === 'banner';
    const baseX = isBanner ? 1.0 : 0.9;
    const totalW = isBanner ? 11.33 : 11.53;
    const cardW = totalW / cols;
    const cardH = Math.min(2.8, 5.5 / rows);

    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = baseX + col * cardW;
      const y = (isBanner ? 1.3 : 1.1) + row * (cardH + (isBanner ? 0 : 0.15));

      if (isBanner) {
        slide.addShape('rect', {
          x: x + 0.1, y, w: cardW - 0.2, h: cardH - 0.15,
          fill: { color: this.C.white },
          shadow: this.makeShadow(),
          line: { color: this.C.border, width: 0.5 },
        });
        slide.addShape('rect', {
          x: x + 0.1, y, w: cardW - 0.2, h: 0.5,
          fill: { color: this.C.primary },
        });
        slide.addText(`${i + 1}. ${(item as any).title || item}`, {
          x: x + 0.2, y, w: cardW - 0.4, h: 0.5,
          fontSize: 13, color: this.C.white, bold: true,
          fontFace: this.F.body, valign: 'middle',
        });
        if ((item as NumberedCardItem).desc) {
          slide.addText((item as NumberedCardItem).desc!, {
            x: x + 0.2, y: y + 0.6, w: cardW - 0.4, h: cardH - 0.85,
            fontSize: 11, color: this.C.medium,
            fontFace: this.F.body, valign: 'top',
          });
        }
      } else {
        this.addBox(slide, x + 0.1, y, cardW - 0.2, cardH - 0.1);
        slide.addShape('ellipse', {
          x: x + 0.25, y: y + 0.15, w: 0.4, h: 0.4,
          fill: { color: this.C.primary },
        });
        slide.addText(`${i + 1}`, {
          x: x + 0.25, y: y + 0.15, w: 0.4, h: 0.4,
          fontSize: 14, color: this.C.white, bold: true,
          align: 'center', valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
        slide.addText((item as any).title || item, {
          x: x + 0.75, y: y + 0.15, w: cardW - 1.1, h: 0.4,
          fontSize: 14, color: this.C.dark, bold: true, valign: 'middle',
          fontFace: this.F.body,
        });
        if ((item as NumberedCardItem).desc) {
          slide.addText((item as NumberedCardItem).desc!, {
            x: x + 0.3, y: y + 0.65, w: cardW - 0.6, h: cardH - 0.85,
            fontSize: 12, color: this.C.textGray || this.C.medium,
            fontFace: this.F.body, valign: 'top',
          });
        }
      }
    });
  }
}
