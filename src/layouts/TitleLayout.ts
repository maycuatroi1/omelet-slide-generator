import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class TitleLayout extends BaseLayout {
  protected addHeader(_slide: PptxGenJS.Slide, _data: SlideData): void {}
  protected showFooter(): boolean { return false; }

  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const { header } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: this.H, fill: { color: this.C.primary } });
      slide.addShape('rect', { x: 0, y: 5.5, w: this.W, h: 2.0, fill: { color: this.C.primaryDark } });
      slide.addText(data.title || '', {
        x: 1.0, y: 1.5, w: 11.33, h: 2.0,
        fontSize: 40, color: this.C.white, bold: true, align: 'center',
        fontFace: this.F.title, margin: 0,
      });
      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1.5, y: 3.6, w: 10.33, h: 1.0,
          fontSize: 22, color: this.C.primaryLight || 'BFDBFE', align: 'center',
          fontFace: this.F.body,
        });
      }
      if (data.author) {
        slide.addText(data.author, {
          x: 1.5, y: 5.8, w: 10.33, h: 0.5,
          fontSize: 16, color: this.C.primaryLight || 'BFDBFE', align: 'center',
          fontFace: this.F.body,
        });
      }
      if (data.date) {
        slide.addText(data.date, {
          x: 1.5, y: 6.3, w: 10.33, h: 0.5,
          fontSize: 14, color: this.C.secondary, align: 'center',
          fontFace: this.F.body,
        });
      }
      return;
    }

    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;
    const textW = imgPath ? 7.4 : this.W;

    if (imgPath) {
      await this.addCoverImage(slide, imgPath, textW, 0, this.W - textW, this.H);
      slide.addShape('rect', {
        x: textW, y: 0, w: 0.06, h: this.H,
        fill: { color: this.C.accent }, line: { color: this.C.accent, width: 0 },
      });
    }

    this.addLogo(slide, true);

    const x = 0.9;
    const w = textW - 1.6;

    const label = this.theme.footer.courseLabel;
    if (label) {
      slide.addText(label.toUpperCase(), {
        x, y: 1.55, w, h: 0.3,
        fontSize: 12, bold: true, charSpacing: 1.6, color: this.C.accent,
        fontFace: this.F.body, margin: 0, valign: 'middle',
      });
    }

    slide.addText(data.title || '', {
      x, y: 2.0, w, h: 1.7,
      fontSize: imgPath ? 38 : 44, color: this.C.primaryDark, bold: true,
      align: 'left', valign: 'middle', fontFace: this.F.title, margin: 0,
      lineSpacingMultiple: 1.0,
    });

    slide.addShape('line', {
      x, y: 3.85, w: 1.2, h: 0,
      line: { color: this.C.accent, width: 3 },
    });

    if (data.subtitle) {
      slide.addText(this.rich(data.subtitle, { fontSize: 17, color: this.C.textGray || this.C.medium }, { color: this.C.primaryDark }), {
        x, y: 4.1, w, h: 1.5,
        fontSize: 17, color: this.C.textGray || this.C.medium,
        align: 'left', valign: 'top', fontFace: this.F.body, margin: 0,
        lineSpacingMultiple: 1.2,
      });
    }

    const meta = [data.author, data.date].filter(Boolean).join('  |  ');
    if (meta) {
      slide.addText(meta, {
        x, y: 6.3, w, h: 0.4,
        fontSize: 13, color: this.C.medium, align: 'left',
        fontFace: this.F.body, margin: 0, valign: 'middle',
      });
    }
  }
}
