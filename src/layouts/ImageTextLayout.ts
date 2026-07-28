import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class ImageTextLayout extends BaseLayout {
  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const isBanner = this.theme.header.style === 'banner';
    const isLeft = (data.imagePosition || 'left') === 'left';
    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;

    if (isBanner) {
      const imgX = isLeft ? 0.5 : 6.83;
      const textX = isLeft ? 6.83 : 0.5;
      if (imgPath) await this.addContainedImage(slide, imgPath, imgX, 1.3, 6.0, 5.5);
      else this.addImagePlaceholder(slide, imgX, 1.3, 6.0, 5.5, data.imagePath);
      slide.addText(this.makeBulletItems((data.items as string[]) || []), {
        x: textX, y: 1.5, w: 5.8, h: 5.0,
        fontSize: 16, color: this.C.dark, paraSpaceAfter: 10,
        fontFace: this.F.body, valign: 'top',
      });
      return;
    }

    const takeaway = data.takeaway || data.caption;
    const top = this.CY;
    const availH = this.contentH(!!takeaway);
    const imgW = Math.min(5.55, this.CW * 0.4);
    const textW = this.CW - imgW - 0.3;
    const imgX = isLeft ? this.CX : this.CX + textW + 0.3;
    const textX = isLeft ? this.CX + imgW + 0.3 : this.CX;

    slide.addShape('rect', {
      x: imgX, y: top, w: imgW, h: availH,
      fill: { color: this.C.light },
      line: { color: this.C.boxBorder || this.C.border, width: 0.75 },
    });
    if (imgPath) {
      await this.addCoverImage(slide, imgPath, imgX + 0.07, top + 0.07, imgW - 0.14, availH - 0.14);
    } else {
      this.addImagePlaceholder(slide, imgX + 0.07, top + 0.07, imgW - 0.14, availH - 0.14, data.imagePath);
    }

    const items = ((data.items as string[]) || []);
    let cursor = top;

    if (data.description) {
      slide.addText(this.rich(data.description, { fontSize: 15, color: this.C.textGray || this.C.medium }), {
        x: textX, y: cursor, w: textW, h: 0.44,
        fontSize: 15, color: this.C.textGray || this.C.medium,
        fontFace: this.F.body, valign: 'top', margin: 0,
      });
      cursor += 0.52;
    }

    const listH = top + availH - cursor;
    const count = items.length || 1;
    const innerW = textW - 0.38;
    const { fontSize, descSize, rows } = this.fitRows(items, innerW, listH, 18, 12);

    items.forEach((item, i) => {
      const { y: dy, h: rowH, leadH } = rows[i];
      const y = cursor + dy;
      const accent = i % 2 === 0 ? this.C.primary : this.C.accent;
      const { lead, rest } = this.splitLead(item);
      slide.addShape('rect', {
        x: textX, y: rest ? y + 0.14 : y + rowH / 2 - 0.08, w: 0.16, h: 0.16,
        fill: { color: accent }, line: { color: accent, width: 0 },
      });
      if (rest) {
        slide.addText(this.rich(lead, { fontSize, color: this.C.primaryDark, bold: true }), {
          x: textX + 0.34, y: y + 0.03, w: innerW, h: leadH,
          fontSize, color: this.C.primaryDark, bold: true,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
        slide.addText(this.rich(rest, { fontSize: descSize, color: this.C.textGray || this.C.medium }), {
          x: textX + 0.34, y: y + 0.03 + leadH, w: innerW, h: rowH - leadH - 0.09,
          fontSize: descSize, color: this.C.textGray || this.C.medium,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
      } else {
        slide.addText(this.rich(item, { fontSize, color: this.C.dark }, { color: this.C.primaryDark }), {
          x: textX + 0.34, y, w: innerW, h: rowH - 0.06,
          fontSize, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
      }
      if (i < count - 1) {
        slide.addShape('line', {
          x: textX, y: y + rowH, w: textW, h: 0,
          line: { color: this.C.border, width: 0.75 },
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
