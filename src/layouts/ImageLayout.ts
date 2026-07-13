import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';
import { ImageResolver } from '../services/ImageResolver';

export class ImageLayout extends BaseLayout {
  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const isBanner = this.theme.header.style === 'banner';
    const items = (data.items as string[] | undefined)?.filter((it) => typeof it === 'string') || [];
    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;

    if (isBanner) {
      const imgH = items.length ? 3.6 : 5.4;
      if (imgPath) await this.addContainedImage(slide, imgPath, 0.7, 1.3, 11.93, imgH);
      else this.addImagePlaceholder(slide, 0.7, 1.3, 11.93, imgH, data.imagePath);
      if (data.caption) {
        slide.addText(data.caption, {
          x: 0.7, y: 1.3 + imgH + 0.05, w: 11.93, h: 0.35,
          fontSize: 12, color: this.C.textGray || this.C.medium,
          align: 'center', italic: true, fontFace: this.F.body, margin: 0,
        });
      }
      if (items.length) {
        slide.addText(this.makeBulletItems(items), {
          x: 0.9, y: 1.3 + imgH + 0.55, w: 11.53, h: 6.9 - (1.3 + imgH + 0.55),
          fontSize: 13, color: this.C.dark, paraSpaceAfter: 6,
          fontFace: this.F.body, valign: 'top',
        });
      }
      return;
    }

    const takeaway = data.takeaway;
    const top = this.CY;
    const availH = this.contentH(!!takeaway);
    const hasNotes = items.length > 0;
    const captionH = data.caption ? 0.32 : 0;
    const pad = 0.1;

    const size = imgPath ? await this.imageResolver.getImageSize(imgPath) : null;
    const ratio = size ? size.ratio : 1.6;
    const stacked = hasNotes && ratio > 2.4;

    const imgColW = !hasNotes || stacked ? this.CW : 7.9;
    const imgColH = stacked
      ? Math.min(availH * 0.52, imgColW / ratio + pad * 2 + captionH)
      : availH;
    const boxH = imgColH - captionH;

    let cardW = imgColW;
    let cardH = boxH;
    let cardX = this.CX;
    let cardY = top;
    if (size) {
      const fitted = ImageResolver.fitToBox(ratio, imgColW - pad * 2, boxH - pad * 2);
      cardW = fitted.w + pad * 2;
      cardH = fitted.h + pad * 2;
      cardX = this.CX + (imgColW - cardW) / 2;
      cardY = top + (boxH - cardH) / 2;
    }

    slide.addShape('rect', {
      x: cardX, y: cardY, w: cardW, h: cardH,
      fill: { color: this.theme.background || this.C.white },
      line: { color: this.C.boxBorder || this.C.border, width: 0.75 },
    });

    if (imgPath) {
      await this.addContainedImage(slide, imgPath, cardX + pad, cardY + pad, cardW - pad * 2, cardH - pad * 2);
    } else {
      this.addImagePlaceholder(slide, cardX + pad, cardY + pad, cardW - pad * 2, cardH - pad * 2, data.imagePath);
    }

    if (data.caption) {
      slide.addText(this.rich(data.caption, { fontSize: 12, color: this.C.textGray || this.C.medium }), {
        x: this.CX, y: top + boxH + 0.02, w: imgColW, h: captionH,
        fontSize: 12, color: this.C.textGray || this.C.medium,
        align: 'center', italic: true, fontFace: this.F.body, margin: 0,
      });
    }

    if (!hasNotes) {
      if (takeaway) this.addTakeaway(slide, takeaway);
      return;
    }

    const label = (data.description || 'Read the diagram').toUpperCase();

    if (stacked) {
      const noteTop = top + imgColH + 0.22;
      const noteH = top + availH - noteTop;
      const cols = 2;
      const gap = 0.26;
      const colW = (this.CW - gap) / cols;
      const perCol = Math.ceil(items.length / cols);
      const fontSize = this.fitSize(perCol, 14, 11, 3);

      slide.addShape('line', {
        x: this.CX, y: noteTop - 0.1, w: this.CW, h: 0,
        line: { color: this.C.border, width: 0.75 },
      });

      items.forEach((item, i) => {
        const col = Math.floor(i / perCol);
        const row = i % perCol;
        const rowH = noteH / perCol;
        const x = this.CX + col * (colW + gap);
        const y = noteTop + row * rowH;
        const accent = i % 2 === 0 ? this.C.primary : this.C.accent;
        slide.addShape('rect', {
          x, y: y + rowH / 2 - 0.07, w: 0.14, h: 0.14,
          fill: { color: accent }, line: { color: accent, width: 0 },
        });
        slide.addText(this.richLead(item, { fontSize, color: this.C.dark }, { color: this.C.primaryDark }), {
          x: x + 0.3, y, w: colW - 0.34, h: rowH,
          fontSize, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
      });
      void label;
      if (takeaway) this.addTakeaway(slide, takeaway);
      return;
    }

    const noteX = this.CX + imgColW + 0.26;
    const noteW = this.CW - imgColW - 0.26;
    this.addCard(slide, noteX, top, noteW, availH, this.C.accent);

    slide.addText(label, {
      x: noteX + 0.24, y: top + 0.18, w: noteW - 0.44, h: 0.3,
      fontSize: 11, bold: true, charSpacing: 1.2, color: this.C.accent,
      fontFace: this.F.body, margin: 0, valign: 'middle',
    });

    const listTop = top + 0.58;
    const listH = availH - 0.72;
    const rowH = listH / Math.max(items.length, 1);
    const fontSize = this.fitSize(items.length, 14, 11, 4);

    items.forEach((item, i) => {
      const y = listTop + i * rowH;
      slide.addText(this.richLead(item, { fontSize, color: this.C.dark }, { color: this.C.primaryDark }), {
        x: noteX + 0.24, y, w: noteW - 0.44, h: rowH,
        fontSize, color: this.C.dark, valign: 'middle',
        fontFace: this.F.body, margin: 0,
      });
      if (i < items.length - 1) {
        slide.addShape('line', {
          x: noteX + 0.24, y: y + rowH, w: noteW - 0.44, h: 0,
          line: { color: this.C.border, width: 0.75 },
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
