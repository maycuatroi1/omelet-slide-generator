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
    } else {
      this.addBox(slide, 0.5, 1.0, 5.95, 5.7);
      this.addBox(slide, 6.88, 1.0, 5.95, 5.7);
      if (data.leftTitle) {
        slide.addText(data.leftTitle, {
          x: 0.7, y: 1.05, w: 5.55, h: 0.4,
          fontSize: 16, color: this.C.dark, bold: true,
          fontFace: this.F.title, margin: 0,
        });
      }
      if (data.rightTitle) {
        slide.addText(data.rightTitle, {
          x: 7.08, y: 1.05, w: 5.55, h: 0.4,
          fontSize: 16, color: this.C.dark, bold: true,
          fontFace: this.F.title, margin: 0,
        });
      }
      const topOffset = (data.leftTitle || data.rightTitle) ? 1.5 : 1.15;
      slide.addText(this.makeBulletItems(data.leftItems || []), {
        x: 0.7, y: topOffset, w: 5.55, h: 5.7 - (topOffset - 1.0),
        fontSize: 14, color: this.C.dark, paraSpaceAfter: 6,
        fontFace: this.F.body, valign: 'top',
      });
      slide.addText(this.makeBulletItems(data.rightItems || []), {
        x: 7.08, y: topOffset, w: 5.55, h: 5.7 - (topOffset - 1.0),
        fontSize: 14, color: this.C.dark, paraSpaceAfter: 6,
        fontFace: this.F.body, valign: 'top',
      });
    }
  }
}
