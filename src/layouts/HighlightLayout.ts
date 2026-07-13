import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class HighlightLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const { header, colors, fonts } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.0, fill: { color: colors.accent } });
      slide.addText(data.title || 'Important', {
        x: 0.5, y: 0.1, w: 12.33, h: 0.8,
        fontSize: 26, color: colors.white, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    } else {
      this.addLogo(slide, true);
      slide.addText(data.title || 'Important', {
        ...header.titlePosition,
        fontSize: header.fontSize,
        color: colors.primaryDark, bold: true,
        fontFace: fonts.title, margin: 0, valign: 'middle',
      });
    }
  }

  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const isBanner = this.theme.header.style === 'banner';
    const details = data.details || [];
    const hasDetails = details.length > 0;

    if (isBanner) {
      this.roundedRect(slide, 0.8, 1.5, 11.73, 2.5, {
        fill: { color: this.C.accentLight || this.C.light }, rectRadius: 0.1,
        line: { color: this.C.accent, width: 2 },
      });
      slide.addText(data.highlight || '', {
        x: 1.2, y: 1.7, w: 10.93, h: 2.0,
        fontSize: 20, color: this.C.accent, bold: true,
        fontFace: this.F.body, valign: 'middle',
      });
      if (hasDetails) {
        slide.addText(this.makeBulletItems(details), {
          x: 1.0, y: 4.3, w: 11.33, h: 2.8,
          fontSize: 16, color: this.C.dark, paraSpaceAfter: 6,
          fontFace: this.F.body,
        });
      }
      return;
    }

    const top = this.CY;
    const bottom = this.CB;
    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;
    const quoteH = hasDetails ? 3.05 : bottom - top;
    const quoteW = imgPath ? 7.4 : this.CW;

    slide.addShape('rect', {
      x: this.CX, y: top, w: quoteW, h: quoteH,
      fill: { color: this.C.primaryDark },
      line: { color: this.C.primaryDark, width: 0 },
    });
    slide.addShape('rect', {
      x: this.CX, y: top, w: 0.14, h: quoteH,
      fill: { color: this.C.accent }, line: { color: this.C.accent, width: 0 },
    });

    if (data.eyebrow) {
      slide.addText(data.eyebrow.toUpperCase(), {
        x: this.CX + 0.5, y: top + 0.26, w: quoteW - 0.9, h: 0.3,
        fontSize: 12, bold: true, charSpacing: 1.6, color: 'E8A79E',
        fontFace: this.F.body, margin: 0, valign: 'middle',
      });
    }

    const quoteTop = data.eyebrow ? top + 0.66 : top + 0.3;
    slide.addText(this.rich(data.highlight || '', { fontSize: 24, color: 'FFFFFF' }, { color: 'F2C4BE' }), {
      x: this.CX + 0.5, y: quoteTop, w: quoteW - 0.9, h: quoteH - (quoteTop - top) - 0.3,
      fontSize: 24, color: 'FFFFFF', bold: false, lineSpacingMultiple: 1.15,
      fontFace: this.F.body, valign: 'middle', margin: 0,
    });

    if (imgPath) {
      const imgX = this.CX + quoteW + 0.26;
      const imgW = this.CW - quoteW - 0.26;
      await this.addCoverImage(slide, imgPath, imgX, top, imgW, quoteH);
    }

    if (hasDetails) {
      const cardTop = top + quoteH + 0.26;
      const cardH = bottom - cardTop;
      const gap = 0.26;
      const cardW = (this.CW - gap * (details.length - 1)) / details.length;

      details.forEach((d, i) => {
        const x = this.CX + i * (cardW + gap);
        const accent = i % 2 === 0 ? this.C.primary : this.C.accent;
        this.addCard(slide, x, cardTop, cardW, cardH, accent);

        const innerW = cardW - 0.56;
        const textH = Math.max(0.4, this.estimateTextH(d, innerW, 17));
        const contentH = 0.38 + 0.06 + textH;
        const start = cardTop + Math.max(0.2, (cardH - contentH) / 2);

        slide.addText(`${i + 1}`, {
          x: x + 0.32, y: start, w: 0.5, h: 0.38,
          fontSize: 18, bold: true, color: accent,
          fontFace: this.F.title, margin: 0, valign: 'middle',
        });
        slide.addText(this.rich(d, { fontSize: 17, color: this.C.dark }, { color: this.C.primaryDark }), {
          x: x + 0.32, y: start + 0.44, w: innerW, h: textH + 0.1,
          fontSize: 17, color: this.C.dark,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
      });
    }
  }
}
