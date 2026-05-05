import PptxGenJS from 'pptxgenjs';
import { SlideData, ComparisonColumn } from '../types';
import { BaseLayout } from './BaseLayout';

export class ComparisonLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const columns = (data.columns || []) as ComparisonColumn[];
    const colCount = columns.length || 1;
    const isBanner = this.theme.header.style === 'banner';
    const totalW = isBanner ? 11.33 : 11.53;
    const baseX = isBanner ? 1.0 : 0.9;
    const gap = isBanner ? 0 : 0.3;
    const colW = (totalW - gap * (colCount - 1)) / colCount;
    const topY = isBanner ? 1.3 : 1.0;
    const colH = isBanner ? 5.5 : 5.7;

    columns.forEach((col, i) => {
      const x = baseX + i * (colW + gap);
      const headerColor = col.color || this.C.primary;

      if (isBanner) {
        slide.addShape('rect', {
          x: x + 0.1, y: topY, w: colW - 0.2, h: colH,
          fill: { color: this.C.white },
          line: { color: this.C.border, width: 1 },
        });
        slide.addShape('rect', {
          x: x + 0.1, y: topY, w: colW - 0.2, h: 0.7,
          fill: { color: headerColor },
        });
        slide.addText(col.heading || '', {
          x: x + 0.1, y: topY, w: colW - 0.2, h: 0.7,
          fontSize: 18, color: this.C.white, bold: true, align: 'center', valign: 'middle',
          fontFace: this.F.title,
        });
        slide.addText(this.makeBulletItems(col.items || []), {
          x: x + 0.2, y: topY + 0.9, w: colW - 0.4, h: colH - 1.1,
          fontSize: 14, color: this.C.dark, paraSpaceAfter: 6,
          fontFace: this.F.body, valign: 'top',
        });
      } else {
        this.addBox(slide, x, topY, colW, colH);
        slide.addShape('rect', {
          x, y: topY, w: colW, h: 0.55,
          fill: { color: headerColor },
        });
        slide.addText(col.heading || '', {
          x, y: topY, w: colW, h: 0.55,
          fontSize: 16, color: this.C.white, bold: true, align: 'center', valign: 'middle',
          fontFace: this.F.title,
        });
        slide.addText(this.makeBulletItems(col.items || []), {
          x: x + 0.15, y: topY + 0.7, w: colW - 0.3, h: colH - 0.9,
          fontSize: 14, color: this.C.dark, paraSpaceAfter: 6,
          fontFace: this.F.body, valign: 'top',
        });
      }
    });
  }
}
