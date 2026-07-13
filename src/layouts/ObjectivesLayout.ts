import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class ObjectivesLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const { header, colors, fonts } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.2, fill: { color: colors.secondary } });
      slide.addText(data.title || 'Learning Objectives', {
        x: 0.5, y: 0.15, w: 12.33, h: 0.9,
        fontSize: 28, color: colors.white, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    } else {
      super.addHeader(slide, { ...data, title: data.title || 'Objective & Learning Outcome' });
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as string[];
    const details = data.details || [];
    const { header } = this.theme;

    if (header.style === 'banner') {
      const count = items.length;
      const startY = 1.6;
      const endY = 6.7;
      const spacing = Math.min(0.75, (endY - startY) / count);
      const itemH = spacing - 0.1;

      items.forEach((item, i) => {
        const y = startY + i * spacing;
        this.roundedRect(slide, 0.8, y, 11.73, itemH, {
          fill: { color: i % 2 === 0 ? (this.C.secondaryLight || this.C.light) : this.C.white },
          rectRadius: 0.05,
        });
        slide.addText(`${i + 1}`, {
          x: 0.9, y, w: 0.5, h: itemH,
          fontSize: 16, color: this.C.secondary, bold: true, align: 'center',
          fontFace: this.F.body, margin: 0,
        });
        slide.addText(item, {
          x: 1.5, y, w: 10.9, h: itemH,
          fontSize: count > 5 ? 14 : 16, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body,
        });
      });
      return;
    }

    const takeaway = data.takeaway || data.caption;
    const top = this.CY;
    const availH = this.contentH(!!takeaway);
    const count = items.length || 1;
    const cols = count > 4 ? 3 : 2;
    const rows = Math.ceil(count / cols);
    const gap = 0.22;
    const cardW = (this.CW - gap * (cols - 1)) / cols;
    const cardH = (availH - gap * (rows - 1)) / rows;

    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = this.CX + col * (cardW + gap);
      const y = top + row * (cardH + gap);
      const accent = i % 2 === 0 ? this.C.primary : this.C.accent;

      this.addCard(slide, x, y, cardW, cardH, accent);

      const innerW = cardW - 0.52;
      const numH = 0.34;
      const titleH = Math.max(0.4, this.estimateTextH(item, innerW, 17));
      const descH = details[i] ? this.estimateTextH(details[i], innerW, 14) : 0;
      const contentH = numH + 0.08 + titleH + (details[i] ? descH + 0.16 : 0);
      let cursor = y + 0.2 + Math.max(0, (cardH - 0.4 - contentH) / 2);

      slide.addText(`0${i + 1}`, {
        x: x + 0.3, y: cursor, w: 0.8, h: numH,
        fontSize: 17, color: accent, bold: true,
        fontFace: this.F.title, margin: 0, valign: 'middle',
      });
      cursor += numH + 0.08;

      slide.addText(this.rich(item, { fontSize: 17, color: this.C.primaryDark, bold: true }), {
        x: x + 0.3, y: cursor, w: innerW, h: titleH,
        fontSize: 17, color: this.C.primaryDark, bold: true,
        fontFace: this.F.body, valign: 'top', margin: 0,
      });
      cursor += titleH + 0.16;

      if (details[i]) {
        slide.addText(this.rich(details[i], { fontSize: 14, color: this.C.textGray || this.C.medium }), {
          x: x + 0.3, y: cursor, w: innerW, h: Math.min(descH + 0.2, y + cardH - cursor - 0.16),
          fontSize: 14, color: this.C.textGray || this.C.medium,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
