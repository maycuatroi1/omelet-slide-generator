import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class BulletsLayout extends BaseLayout {
  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const items = (data.items || []) as string[];
    const { header } = this.theme;

    if (header.style === 'banner') {
      slide.addText(this.makeBulletItems(items), {
        x: 0.8, y: 1.3, w: 11.73, h: 5.5,
        fontSize: 18, color: this.C.dark, paraSpaceAfter: 8,
        fontFace: this.F.body, valign: 'top',
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
      top += 0.46;
      availH -= 0.46;
    }

    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;
    const hasImage = !!imgPath;
    const textW = hasImage ? 7.05 : this.CW;

    if (hasImage) {
      const imgX = this.CX + textW + 0.28;
      const imgW = this.CW - textW - 0.28;
      slide.addShape('rect', {
        x: imgX, y: top, w: imgW, h: availH,
        fill: { color: this.C.light },
        line: { color: this.C.boxBorder || this.C.border, width: 0.75 },
      });
      await this.addCoverImage(slide, imgPath!, imgX + 0.06, top + 0.06, imgW - 0.12, availH - 0.12);
    }

    const count = items.length || 1;
    const rowH = Math.min(1.15, availH / count);
    const usedH = rowH * count;
    const startY = top + (availH - usedH) / 2;
    const fontSize = this.fitSize(count, 19, 14, 5);
    const descSize = fontSize - 3;

    items.forEach((item, i) => {
      const y = startY + i * rowH;
      const [lead, ...restParts] = item.split(' -- ');
      const rest = restParts.join(' -- ');

      slide.addShape('rect', {
        x: this.CX, y: y + rowH / 2 - 0.09, w: 0.18, h: 0.18,
        fill: { color: i % 2 === 0 ? this.C.primary : this.C.accent },
        line: { color: i % 2 === 0 ? this.C.primary : this.C.accent, width: 0 },
      });

      if (rest) {
        slide.addText(this.rich(lead, { fontSize, color: this.C.primaryDark, bold: true }), {
          x: this.CX + 0.36, y: y + 0.04, w: textW - 0.4, h: rowH * 0.48,
          fontSize, color: this.C.primaryDark, bold: true,
          fontFace: this.F.body, valign: 'middle', margin: 0,
        });
        slide.addText(this.rich(rest, { fontSize: descSize, color: this.C.textGray || this.C.medium }), {
          x: this.CX + 0.36, y: y + rowH * 0.46, w: textW - 0.4, h: rowH * 0.5,
          fontSize: descSize, color: this.C.textGray || this.C.medium,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
      } else {
        slide.addText(this.rich(item, { fontSize, color: this.C.dark }), {
          x: this.CX + 0.36, y, w: textW - 0.4, h: rowH,
          fontSize, color: this.C.dark,
          fontFace: this.F.body, valign: 'middle', margin: 0,
        });
      }

      if (i < count - 1) {
        slide.addShape('line', {
          x: this.CX, y: y + rowH, w: textW - 0.1, h: 0,
          line: { color: this.C.border, width: 0.75 },
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
