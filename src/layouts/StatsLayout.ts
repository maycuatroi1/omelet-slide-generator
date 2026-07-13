import PptxGenJS from 'pptxgenjs';
import { SlideData, StatItem } from '../types';
import { BaseLayout } from './BaseLayout';

export class StatsLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as StatItem[];
    const cols = items.length || 1;
    const isBanner = this.theme.header.style === 'banner';

    if (isBanner) {
      const cellW = 11.33 / cols;
      items.forEach((item, i) => {
        const x = 1.0 + i * cellW;
        slide.addShape('rect', {
          x: x + 0.15, y: 2.0, w: cellW - 0.3, h: 3.5,
          fill: { color: this.C.white },
          shadow: this.makeShadow(),
          line: { color: this.C.primaryLight || this.C.border, width: 2 },
        });
        slide.addText(item.value || '', {
          x: x + 0.15, y: 2.3, w: cellW - 0.3, h: 1.5,
          fontSize: 42, color: this.C.primary, bold: true,
          align: 'center', valign: 'middle', fontFace: this.F.title, margin: 0,
        });
        slide.addText(item.label || '', {
          x: x + 0.15, y: 3.9, w: cellW - 0.3, h: 1.5,
          fontSize: 16, color: this.C.textGray || this.C.medium,
          align: 'center', valign: 'top', fontFace: this.F.body,
        });
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
    const cellW = (this.CW - gap * (cols - 1)) / cols;
    const palette = [this.C.primary, this.C.accent, this.C.secondary, this.C.primaryDark];

    items.forEach((item, i) => {
      const x = this.CX + i * (cellW + gap);
      const accent = item.color || palette[i % palette.length];
      const innerW = cellW - 0.44;

      this.addCard(slide, x, top, cellW, availH);
      slide.addShape('rect', {
        x, y: top, w: cellW, h: 0.1,
        fill: { color: accent }, line: { color: accent, width: 0 },
      });

      const valueSize = Math.round(Math.max(38, Math.min(58, availH * 11)));
      const labelSize = 18;
      const descSize = 14;
      const valueH = (valueSize * 1.35) / 72;
      const labelH = Math.max(0.44, this.estimateTextH(item.label || '', innerW, labelSize));
      const descH = item.desc ? this.estimateTextH(item.desc, innerW, descSize) : 0;
      const contentH = valueH + 0.14 + labelH + (item.desc ? descH + 0.18 : 0);
      let cursor = top + 0.24 + Math.max(0, (availH - 0.34 - contentH) / 2);

      slide.addText(item.value || '', {
        x: x + 0.22, y: cursor, w: innerW, h: valueH,
        fontSize: valueSize, color: accent, bold: true,
        align: 'center', valign: 'middle', fontFace: this.F.title, margin: 0,
      });
      cursor += valueH + 0.14;

      slide.addText(this.rich(item.label || '', { fontSize: labelSize, color: this.C.primaryDark, bold: true }), {
        x: x + 0.22, y: cursor, w: innerW, h: labelH,
        fontSize: labelSize, color: this.C.primaryDark, bold: true,
        align: 'center', valign: 'middle', fontFace: this.F.body, margin: 0,
      });
      cursor += labelH + 0.18;

      if (item.desc) {
        slide.addText(this.rich(item.desc, { fontSize: descSize, color: this.C.textGray || this.C.medium }), {
          x: x + 0.22, y: cursor, w: innerW, h: Math.min(descH + 0.24, top + availH - cursor - 0.16),
          fontSize: descSize, color: this.C.textGray || this.C.medium,
          align: 'center', valign: 'top', fontFace: this.F.body, margin: 0,
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
