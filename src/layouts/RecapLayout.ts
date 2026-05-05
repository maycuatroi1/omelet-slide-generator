import PptxGenJS from 'pptxgenjs';
import { SlideData, IconGridItem } from '../types';
import { BaseLayout } from './BaseLayout';

export class RecapLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as IconGridItem[];
    const summary = data.description || '';
    const hasSummary = summary.length > 0;

    const topY = 1.26;
    const boxH = hasSummary ? 3.46 : 5.44;
    const baseX = 0.22;
    const totalW = 12.9;
    const gap = 0.23;
    const colCount = items.length || 3;
    const colW = (totalW - gap * (colCount - 1)) / colCount;

    items.forEach((item, i) => {
      const x = baseX + i * (colW + gap);

      this.addBox(slide, x, topY, colW, boxH);

      slide.addText(item.label || '', {
        x: x + 0.1, y: topY + 0.05, w: colW - 0.2, h: 0.37,
        fontSize: 16, color: this.C.dark, bold: true,
        fontFace: this.F.body, valign: 'top', margin: 0,
      });

      if (item.desc) {
        slide.addText(item.desc, {
          x: x + 0.14, y: topY + 0.34, w: colW - 0.28, h: boxH - 0.44,
          fontSize: 14, color: this.C.dark,
          fontFace: this.F.body, valign: 'top', align: 'justify',
          lineSpacingMultiple: 1.15,
        });
      }
    });

    if (hasSummary) {
      const sumY = topY + boxH + 0.4;
      const sumH = 1.18;
      this.addBox(slide, baseX, sumY, totalW, sumH);

      slide.addText('Summary', {
        x: baseX + 0.1, y: sumY + 0.05, w: 6.0, h: 0.37,
        fontSize: 16, color: this.C.dark, bold: true,
        fontFace: this.F.body, valign: 'top', margin: 0,
      });

      slide.addText(summary, {
        x: baseX + 0.14, y: sumY + 0.34, w: totalW - 0.3, h: sumH - 0.44,
        fontSize: 14, color: this.C.dark,
        fontFace: this.F.body, valign: 'top', align: 'justify',
        lineSpacingMultiple: 1.15,
      });
    }
  }
}
