import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class BulletsLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as string[];
    const { header } = this.theme;

    if (header.style === 'banner') {
      slide.addText(this.makeBulletItems(items), {
        x: 0.8, y: 1.3, w: 11.73, h: 5.5,
        fontSize: 18, color: this.C.dark, paraSpaceAfter: 8,
        fontFace: this.F.body, valign: 'top',
      });
    } else {
      this.addBox(slide, 0.9, 1.0, 11.53, 5.7);
      slide.addText(this.makeBulletItems(items), {
        x: 1.2, y: 1.2, w: 10.93, h: 5.3,
        fontSize: 20, color: this.C.dark, paraSpaceAfter: 10,
        fontFace: this.F.body, valign: 'top',
      });
    }
  }
}
