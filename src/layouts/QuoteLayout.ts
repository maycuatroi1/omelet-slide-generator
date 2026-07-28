import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class QuoteLayout extends BaseLayout {
  protected addHeader(_slide: PptxGenJS.Slide, _data: SlideData): void {}

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const isBanner = this.theme.header.style === 'banner';

    if (isBanner) {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: this.H, fill: { color: this.C.light } });
      slide.addShape('rect', { x: 0, y: 0, w: 0.3, h: this.H, fill: { color: this.C.primary } });
      slide.addText('“', {
        x: 1.0, y: 0.8, w: 2.0, h: 2.0,
        fontSize: 120, color: this.C.primaryLight || this.C.light, fontFace: 'Georgia',
      });
      slide.addText(data.quote || '', {
        x: 1.5, y: 2.0, w: 10.33, h: 3.5,
        fontSize: 24, color: this.C.dark, italic: true,
        align: 'center', valign: 'middle', fontFace: 'Georgia',
      });
      if (data.attribution) {
        slide.addText(`— ${data.attribution}`, {
          x: 1.5, y: 5.5, w: 10.33, h: 0.6,
          fontSize: 16, color: this.C.textGray || this.C.medium,
          align: 'center', fontFace: this.F.body,
        });
      }
      return;
    }

    this.addLogo(slide, true);
    slide.addShape('rect', { x: 0, y: 0, w: 0.2, h: this.H, fill: { color: this.C.primary } });

    const quote = data.quote || '';
    const x = this.CX + 0.3;
    const w = this.CW - 0.5;
    const top = 1.35;
    const attrH = data.attribution ? 0.72 : 0;
    const availH = this.CB - top - attrH;

    slide.addText('“', {
      x: x - 0.1, y: top - 0.72, w: 1.6, h: 1.0,
      fontSize: 72, color: this.C.border, fontFace: 'Georgia', margin: 0, valign: 'top',
    });

    let size = 40;
    while (size > 18 && this.estimateTextH(quote, w, size, 1.34) > availH - 0.24) size -= 1;

    slide.addText(this.rich(quote, { fontSize: size, color: this.C.primaryDark }, { color: this.C.accent }), {
      x, y: top, w, h: availH,
      fontSize: size, color: this.C.primaryDark, italic: false,
      align: 'left', valign: 'middle', lineSpacingMultiple: 1.16,
      fontFace: this.F.title, margin: 0,
    });

    if (data.attribution) {
      slide.addShape('line', {
        x, y: this.CB - attrH + 0.1, w: 1.6, h: 0,
        line: { color: this.C.accent, width: 3 },
      });
      slide.addText(data.attribution, {
        x, y: this.CB - attrH + 0.24, w, h: 0.44,
        fontSize: 16, color: this.C.textGray || this.C.medium,
        align: 'left', valign: 'middle', fontFace: this.F.body, margin: 0,
      });
    }
  }
}
