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
    } else {
      this.addLogo(slide, true);
      slide.addShape('rect', { x: 0, y: 0, w: 0.2, h: this.H, fill: { color: this.C.primary } });
    }

    slide.addText('\u201C', {
      x: 1.0, y: isBanner ? 0.8 : 1.0, w: 2.0, h: 2.0,
      fontSize: isBanner ? 120 : 100,
      color: isBanner ? (this.C.primaryLight || this.C.light) : this.C.border,
      fontFace: 'Georgia',
    });

    slide.addText(data.quote || '', {
      x: 1.5, y: isBanner ? 2.0 : 2.2, w: 10.33, h: isBanner ? 3.5 : 3.0,
      fontSize: isBanner ? 24 : 22, color: this.C.dark, italic: true,
      align: 'center', valign: 'middle',
      fontFace: 'Georgia',
    });

    if (data.attribution) {
      slide.addText(`\u2014 ${data.attribution}`, {
        x: 1.5, y: isBanner ? 5.5 : 5.3, w: 10.33, h: 0.6,
        fontSize: 16, color: this.C.textGray || this.C.medium, align: 'center',
        fontFace: this.F.body,
      });
    }
  }
}
