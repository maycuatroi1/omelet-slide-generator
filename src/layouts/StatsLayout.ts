import PptxGenJS from 'pptxgenjs';
import { SlideData, StatItem } from '../types';
import { BaseLayout } from './BaseLayout';

export class StatsLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as StatItem[];
    const cols = items.length;
    const isBanner = this.theme.header.style === 'banner';
    const totalW = isBanner ? 11.33 : 11.53;
    const baseX = isBanner ? 1.0 : 0.9;
    const cellW = totalW / cols;

    items.forEach((item, i) => {
      const x = baseX + i * cellW;

      if (isBanner) {
        slide.addShape('rect', {
          x: x + 0.15, y: 2.0, w: cellW - 0.3, h: 3.5,
          fill: { color: this.C.white },
          shadow: this.makeShadow(),
          line: { color: this.C.primaryLight || this.C.border, width: 2 },
        });
      } else {
        this.addBox(slide, x + 0.1, 1.5, cellW - 0.2, 4.5);
      }

      slide.addText(item.value || '', {
        x: x + (isBanner ? 0.15 : 0.1), y: isBanner ? 2.3 : 2.0,
        w: cellW - (isBanner ? 0.3 : 0.2), h: 1.5,
        fontSize: 42, color: this.C.primary, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.title, margin: 0,
      });

      slide.addText(item.label || '', {
        x: x + (isBanner ? 0.15 : 0.1), y: isBanner ? 3.9 : 3.6,
        w: cellW - (isBanner ? 0.3 : 0.2), h: 1.5,
        fontSize: 16, color: this.C.textGray || this.C.medium,
        align: 'center', valign: 'top',
        fontFace: this.F.body,
      });
    });
  }
}
