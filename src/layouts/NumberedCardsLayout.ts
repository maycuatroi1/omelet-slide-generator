import PptxGenJS from 'pptxgenjs';
import { SlideData, NumberedCardItem } from '../types';
import { BaseLayout } from './BaseLayout';

export class NumberedCardsLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as NumberedCardItem[];
    const isBanner = this.theme.header.style === 'banner';
    const cols = data.columnCount || Math.min(items.length, 3);
    const rows = Math.ceil(items.length / cols);

    if (isBanner) {
      const cardW = 11.33 / cols;
      const cardH = Math.min(2.8, 5.5 / rows);
      items.forEach((item, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 1.0 + col * cardW;
        const y = 1.3 + row * cardH;
        slide.addShape('rect', {
          x: x + 0.1, y, w: cardW - 0.2, h: cardH - 0.15,
          fill: { color: this.C.white }, shadow: this.makeShadow(),
          line: { color: this.C.border, width: 0.5 },
        });
        slide.addShape('rect', { x: x + 0.1, y, w: cardW - 0.2, h: 0.5, fill: { color: this.C.primary } });
        slide.addText(`${i + 1}. ${(item as any).title || item}`, {
          x: x + 0.2, y, w: cardW - 0.4, h: 0.5,
          fontSize: 13, color: this.C.white, bold: true,
          fontFace: this.F.body, valign: 'middle',
        });
        if (item.desc) {
          slide.addText(item.desc, {
            x: x + 0.2, y: y + 0.6, w: cardW - 0.4, h: cardH - 0.85,
            fontSize: 11, color: this.C.medium, fontFace: this.F.body, valign: 'top',
          });
        }
      });
      return;
    }

    const takeaway = data.takeaway || data.caption;
    let top = this.CY;
    let availH = this.contentH(!!takeaway);

    if (data.description) {
      slide.addText(this.rich(data.description, { fontSize: 15, color: this.C.textGray || this.C.medium }), {
        x: this.CX, y: top, w: this.CW, h: 0.36,
        fontSize: 15, color: this.C.textGray || this.C.medium,
        fontFace: this.F.body, valign: 'middle', margin: 0,
      });
      top += 0.5;
      availH -= 0.5;
    }

    const gap = 0.24;
    const cardW = (this.CW - gap * (cols - 1)) / cols;
    const cardH = (availH - gap * (rows - 1)) / rows;
    const palette = [this.C.primary, this.C.accent, this.C.secondary, this.C.primaryDark];

    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = this.CX + col * (cardW + gap);
      const y = top + row * (cardH + gap);
      const accent = palette[i % palette.length];

      this.addCard(slide, x, y, cardW, cardH);
      slide.addShape('rect', {
        x, y, w: cardW, h: 0.52,
        fill: { color: accent }, line: { color: accent, width: 0 },
      });
      slide.addText(`${String(i + 1).padStart(2, '0')}`, {
        x: x + 0.18, y, w: 0.52, h: 0.52,
        fontSize: 15, color: 'FFFFFF', bold: true,
        align: 'left', valign: 'middle', fontFace: this.F.title, margin: 0,
      });
      slide.addText((item as any).title || String(item), {
        x: x + 0.72, y, w: cardW - 0.9, h: 0.52,
        fontSize: 15, color: 'FFFFFF', bold: true, valign: 'middle',
        fontFace: this.F.body, margin: 0,
      });
      if (item.desc) {
        slide.addText(this.rich(item.desc, { fontSize: 14, color: this.C.dark }, { color: this.C.primaryDark }), {
          x: x + 0.24, y: y + 0.68, w: cardW - 0.46, h: cardH - 0.86,
          fontSize: 14, color: this.C.dark,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
