import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class TwoColumnLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const { header } = this.theme;

    if (header.style === 'banner') {
      if (data.leftTitle) {
        slide.addText(data.leftTitle, {
          x: 0.5, y: 1.2, w: 5.8, h: 0.5,
          fontSize: 18, color: this.C.primary, bold: true,
          fontFace: this.F.title, margin: 0,
        });
      }
      if (data.rightTitle) {
        slide.addText(data.rightTitle, {
          x: 7.0, y: 1.2, w: 5.8, h: 0.5,
          fontSize: 18, color: this.C.primary, bold: true,
          fontFace: this.F.title, margin: 0,
        });
      }
      slide.addText(this.makeBulletItems(data.leftItems || []), {
        x: 0.5, y: 1.8, w: 5.8, h: 5.0,
        fontSize: 16, color: this.C.dark, paraSpaceAfter: 6,
        fontFace: this.F.body, valign: 'top',
      });
      slide.addShape('line', { x: 6.5, y: 1.2, w: 0, h: 5.5, line: { color: this.C.border, width: 1 } });
      slide.addText(this.makeBulletItems(data.rightItems || []), {
        x: 7.0, y: 1.8, w: 5.8, h: 5.0,
        fontSize: 16, color: this.C.dark, paraSpaceAfter: 6,
        fontFace: this.F.body, valign: 'top',
      });
      return;
    }

    const takeaway = data.takeaway || data.caption;
    let top = this.CY;
    let availH = this.contentH(!!takeaway);

    if (data.description) {
      slide.addText(this.rich(data.description, { fontSize: 15, color: this.C.textGray || this.C.medium }), {
        x: this.CX, y: top, w: this.CW, h: 0.4,
        fontSize: 15, color: this.C.textGray || this.C.medium,
        fontFace: this.F.body, valign: 'top', margin: 0,
      });
      top += 0.5;
      availH -= 0.5;
    }

    const gap = 0.3;
    const colW = (this.CW - gap) / 2;
    const cols: Array<{ heading?: string; items: string[]; x: number; accent: string }> = [
      { heading: data.leftTitle, items: data.leftItems || [], x: this.CX, accent: this.C.primary },
      { heading: data.rightTitle, items: data.rightItems || [], x: this.CX + colW + gap, accent: this.C.accent },
    ];

    cols.forEach(col => {
      this.addCard(slide, col.x, top, colW, availH, col.accent);
      let cursor = top + 0.28;
      const innerX = col.x + 0.34;
      const innerW = colW - 0.64;

      if (col.heading) {
        slide.addText(col.heading.toUpperCase(), {
          x: innerX, y: cursor, w: innerW, h: 0.3,
          fontSize: 12, bold: true, charSpacing: 1.6, color: col.accent,
          fontFace: this.F.body, margin: 0, valign: 'middle',
        });
        cursor += 0.38;
        slide.addShape('line', {
          x: innerX, y: cursor - 0.06, w: innerW, h: 0,
          line: { color: this.C.border, width: 0.75 },
        });
        cursor += 0.1;
      }

      const listH = top + availH - cursor - 0.24;
      const { fontSize, descSize, rows } = this.fitRows(col.items, innerW - 0.3, listH, 18, 13);

      col.items.forEach((item, i) => {
        const { y: dy, h: rowH, leadH } = rows[i];
        const y = cursor + dy;
        const { lead, rest } = this.splitLead(item);
        slide.addShape('rect', {
          x: innerX, y: y + 0.14, w: 0.14, h: 0.14,
          fill: { color: col.accent }, line: { color: col.accent, width: 0 },
        });
        if (rest) {
          slide.addText(this.rich(lead, { fontSize, color: this.C.primaryDark, bold: true }), {
            x: innerX + 0.3, y, w: innerW - 0.3, h: leadH,
            fontSize, color: this.C.primaryDark, bold: true,
            fontFace: this.F.body, valign: 'top', margin: 0,
          });
          slide.addText(this.rich(rest, { fontSize: descSize, color: this.C.textGray || this.C.medium }), {
            x: innerX + 0.3, y: y + leadH, w: innerW - 0.3, h: rowH - leadH - 0.08,
            fontSize: descSize, color: this.C.textGray || this.C.medium,
            fontFace: this.F.body, valign: 'top', margin: 0,
          });
        } else {
          slide.addText(this.rich(item, { fontSize, color: this.C.dark }, { color: this.C.primaryDark }), {
            x: innerX + 0.3, y, w: innerW - 0.3, h: rowH - 0.06,
            fontSize, color: this.C.dark,
            fontFace: this.F.body, valign: 'top', margin: 0,
          });
        }
      });
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
