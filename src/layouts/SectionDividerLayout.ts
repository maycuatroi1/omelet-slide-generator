import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class SectionDividerLayout extends BaseLayout {
  protected addHeader(_slide: PptxGenJS.Slide, _data: SlideData): void {}

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const { header } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: this.H, fill: { color: this.C.primary } });
      this.roundedRect(slide, 0.5, 2.5, 12.33, 2.5, { fill: { color: this.C.primaryDark }, rectRadius: 0.1 });
      if (data.sectionNumber) {
        slide.addText(`Section ${data.sectionNumber}`, {
          x: 1.0, y: 1.5, w: 11.33, h: 0.8,
          fontSize: 18, color: this.C.secondary, align: 'center',
          fontFace: this.F.body,
        });
      }
      slide.addText(data.title || '', {
        x: 1.0, y: 2.8, w: 11.33, h: 1.5,
        fontSize: 36, color: this.C.white, bold: true, align: 'center',
        fontFace: this.F.title,
      });
      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1.5, y: 5.3, w: 10.33, h: 0.8,
          fontSize: 18, color: this.C.primaryLight || 'BFDBFE', align: 'center',
          fontFace: this.F.body,
        });
      }
    } else {
      this.addLogo(slide, true);
      if (data.sectionNumber) {
        slide.addText(`Section ${data.sectionNumber}`, {
          x: 1.0, y: 1.8, w: 11.33, h: 0.8,
          fontSize: 20, color: this.C.textGray || this.C.medium, align: 'center',
          fontFace: this.F.body,
        });
      }
      slide.addText(data.title || '', {
        x: 1.0, y: 2.5, w: 11.33, h: 1.2,
        fontSize: 40, color: this.C.primary, bold: true, align: 'center',
        fontFace: this.F.title,
      });
      slide.addShape('line', {
        x: 4.0, y: 3.85, w: 5.33, h: 0,
        line: { color: this.C.primary, width: 2 },
      });
      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1.5, y: 4.1, w: 10.33, h: 0.8,
          fontSize: 18, color: this.C.textGray || this.C.medium, align: 'center',
          fontFace: this.F.body,
        });
      }
    }
  }
}
