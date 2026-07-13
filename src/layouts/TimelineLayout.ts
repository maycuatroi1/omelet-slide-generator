import PptxGenJS from 'pptxgenjs';
import { SlideData, TimelineItem } from '../types';
import { BaseLayout } from './BaseLayout';

export class TimelineLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as TimelineItem[];
    const isBanner = this.theme.header.style === 'banner';

    if (isBanner) {
      const stepW = 11.0 / items.length;
      slide.addShape('line', { x: 1.5, y: 2.5, w: 10.33, h: 0, line: { color: this.C.primary, width: 3 } });
      items.forEach((item, i) => {
        const x = 1.2 + i * stepW;
        slide.addShape('ellipse', {
          x: x + stepW / 2 - 0.2, y: 2.3, w: 0.4, h: 0.4, fill: { color: this.C.primary },
        });
        slide.addText(item.label || `Step ${i + 1}`, {
          x, y: 1.5, w: stepW, h: 0.7,
          fontSize: 13, bold: true, align: 'center', color: this.C.primary, fontFace: this.F.body,
        });
        if (item.desc) {
          slide.addText(item.desc, {
            x, y: 2.9, w: stepW, h: 2.5,
            fontSize: 11, align: 'center', color: this.C.dark, fontFace: this.F.body, valign: 'top',
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

    const count = items.length || 1;
    const rowH = availH / count;
    const railX = this.CX + 1.85;
    const fontSize = this.fitSize(count, 15, 12, 5);

    slide.addShape('line', {
      x: railX, y: top + 0.1, w: 0, h: availH - 0.2,
      line: { color: this.C.border, width: 2 },
    });

    items.forEach((item, i) => {
      const y = top + i * rowH;
      const accent = i % 2 === 0 ? this.C.primary : this.C.accent;

      slide.addText(item.label || '', {
        x: this.CX, y, w: 1.7, h: rowH,
        fontSize: fontSize + 1, bold: true, color: accent, align: 'right', valign: 'middle',
        fontFace: this.F.title, margin: 0,
      });
      slide.addShape('ellipse', {
        x: railX - 0.11, y: y + rowH / 2 - 0.11, w: 0.22, h: 0.22,
        fill: { color: accent }, line: { color: this.theme.background || 'FFFFFF', width: 2 },
      });
      if (item.desc) {
        slide.addText(this.rich(item.desc, { fontSize, color: this.C.dark }, { color: this.C.primaryDark }), {
          x: railX + 0.28, y, w: this.CX + this.CW - railX - 0.32, h: rowH,
          fontSize, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
      }
      if (i < count - 1) {
        slide.addShape('line', {
          x: railX + 0.28, y: y + rowH, w: this.CX + this.CW - railX - 0.32, h: 0,
          line: { color: this.C.border, width: 0.75 },
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
