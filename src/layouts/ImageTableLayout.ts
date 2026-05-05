import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class ImageTableLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const isBanner = this.theme.header.style === 'banner';
    const startY = isBanner ? 1.2 : 1.0;

    const headers = data.headers || [];
    const rows = data.rows || [];
    const totalRows = rows.length + (headers.length ? 1 : 0);

    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;
    const imgH = 2.8;
    const tableY = startY + imgH + 0.15;
    const maxTableH = 6.7 - tableY;
    const rowH = Math.min(0.45, maxTableH / totalRows);
    const fontSize = totalRows > 6 ? 11 : 12;
    const headerFontSize = totalRows > 6 ? 12 : 13;

    if (imgPath) {
      slide.addImage({
        path: imgPath,
        x: 1.0, y: startY, w: 11.33, h: imgH,
        sizing: { type: 'contain', w: 11.33, h: imgH },
      });
    } else {
      if (isBanner) {
        this.roundedRect(slide, 1.0, startY, 11.33, imgH, {
          fill: { color: this.C.light }, rectRadius: 0.1,
          line: { color: this.C.border, width: 1, dashType: 'dash' },
        });
      } else {
        this.addBox(slide, 1.0, startY, 11.33, imgH);
      }
      slide.addText(`[Image: ${data.imagePath || 'not specified'}]`, {
        x: 1.0, y: startY + imgH / 2 - 0.3, w: 11.33, h: 0.6,
        fontSize: 14, color: this.C.medium, align: 'center',
        fontFace: this.F.body,
      });
    }

    const tableRows: any[][] = [];

    if (headers.length) {
      tableRows.push(headers.map(h => ({
        text: h,
        options: {
          bold: true,
          color: this.C.white,
          fill: { color: this.C.primary },
          fontSize: headerFontSize,
          fontFace: this.F.body,
        },
      })));
    }

    rows.forEach((row, i) => {
      tableRows.push(row.map(cell => ({
        text: String(cell),
        options: {
          fontSize,
          color: this.C.dark,
          fill: { color: i % 2 === 0 ? this.C.light : this.C.white },
          fontFace: this.F.body,
        },
      })));
    });

    if (tableRows.length) {
      const numCols = headers.length || rows[0]?.length || 1;
      const colW = 11.33 / numCols;
      slide.addTable(tableRows, {
        x: 1.0, y: tableY, w: 11.33,
        colW: Array(numCols).fill(colW),
        border: { type: 'solid', pt: 0.5, color: this.C.border },
        rowH,
        autoPage: false,
      });
    }
  }
}
