import PptxGenJS from 'pptxgenjs';
import { SlideData, TimelineItem } from '../types';
import { BaseLayout } from './BaseLayout';

export class TimelineLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as TimelineItem[];
    const stepW = 11.0 / items.length;

    slide.addShape('line', {
      x: 1.5, y: 2.5, w: 10.33, h: 0,
      line: { color: this.C.primary, width: 3 },
    });

    items.forEach((item, i) => {
      const x = 1.2 + i * stepW;
      slide.addShape('ellipse', {
        x: x + stepW / 2 - 0.2, y: 2.3, w: 0.4, h: 0.4,
        fill: { color: this.C.primary },
      });
      slide.addText(item.label || `Step ${i + 1}`, {
        x, y: this.theme.header.style === 'banner' ? 1.5 : 1.4, w: stepW, h: 0.7,
        fontSize: 13, bold: true, align: 'center', color: this.C.primary,
        fontFace: this.F.body,
      });
      if (item.desc) {
        slide.addText(item.desc, {
          x, y: 2.9, w: stepW, h: this.theme.header.style === 'banner' ? 2.5 : 3.5,
          fontSize: 11, align: 'center', color: this.C.dark,
          fontFace: this.F.body, valign: 'top',
        });
      }
    });
  }
}
