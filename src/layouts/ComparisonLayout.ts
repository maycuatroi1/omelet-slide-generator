import PptxGenJS from 'pptxgenjs';
import { SlideData, ComparisonColumn } from '../types';
import { BaseLayout } from './BaseLayout';

export class ComparisonLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const columns = (data.columns || []) as ComparisonColumn[];
    const colCount = columns.length || 1;
    const isBanner = this.theme.header.style === 'banner';

    if (isBanner) {
      const colW = 11.33 / colCount;
      columns.forEach((col, i) => {
        const x = 1.0 + i * colW;
        const headerColor = col.color || this.C.primary;
        slide.addShape('rect', {
          x: x + 0.1, y: 1.3, w: colW - 0.2, h: 5.5,
          fill: { color: this.C.white }, line: { color: this.C.border, width: 1 },
        });
        slide.addShape('rect', { x: x + 0.1, y: 1.3, w: colW - 0.2, h: 0.7, fill: { color: headerColor } });
        slide.addText(col.heading || '', {
          x: x + 0.1, y: 1.3, w: colW - 0.2, h: 0.7,
          fontSize: 18, color: this.C.white, bold: true, align: 'center', valign: 'middle',
          fontFace: this.F.title,
        });
        slide.addText(this.makeBulletItems(col.items || []), {
          x: x + 0.2, y: 2.2, w: colW - 0.4, h: 4.4,
          fontSize: 15, color: this.C.dark, paraSpaceAfter: 7,
          fontFace: this.F.body, valign: 'top',
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

    const gap = 0.26;
    const colW = (this.CW - gap * (colCount - 1)) / colCount;
    const headH = 0.62;

    columns.forEach((col, i) => {
      const x = this.CX + i * (colW + gap);
      const headerColor = col.color || (i === 0 ? this.C.primary : this.C.accent);
      const items = col.items || [];

      this.addCard(slide, x, top, colW, availH);
      slide.addShape('rect', {
        x, y: top, w: colW, h: headH,
        fill: { color: headerColor }, line: { color: headerColor, width: 0 },
      });
      slide.addText(col.heading || '', {
        x: x + 0.2, y: top, w: colW - 0.4, h: headH,
        fontSize: 17, color: 'FFFFFF', bold: true, valign: 'middle',
        fontFace: this.F.title, margin: 0,
      });

      const listTop = top + headH + 0.14;
      const listH = availH - headH - 0.26;
      const rowH = listH / Math.max(items.length, 1);
      const fontSize = this.fitSize(items.length, 15, 12, 5);

      items.forEach((item, j) => {
        const y = listTop + j * rowH;
        slide.addShape('rect', {
          x: x + 0.2, y: y + rowH / 2 - 0.06, w: 0.12, h: 0.12,
          fill: { color: headerColor }, line: { color: headerColor, width: 0 },
        });
        slide.addText(this.rich(item, { fontSize, color: this.C.dark }, { color: this.C.primaryDark }), {
          x: x + 0.44, y, w: colW - 0.64, h: rowH,
          fontSize, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
        if (j < items.length - 1) {
          slide.addShape('line', {
            x: x + 0.2, y: y + rowH, w: colW - 0.4, h: 0,
            line: { color: this.C.border, width: 0.75 },
          });
        }
      });
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
