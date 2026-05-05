import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class TableLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const headers = data.headers || [];
    const rows = data.rows || [];
    const tableRows: any[][] = [];
    const totalRows = rows.length + (headers.length ? 1 : 0);

    const isBanner = this.theme.header.style === 'banner';
    const tableY = isBanner ? 1.3 : 1.1;
    const maxH = 6.7 - tableY;
    const rowH = Math.min(0.5, maxH / totalRows);
    const fontSize = totalRows > 8 ? 11 : 13;
    const headerFontSize = totalRows > 8 ? 12 : 14;

    if (headers.length) {
      tableRows.push(headers.map(h => ({
        text: h,
        options: {
          bold: true,
          color: this.C.dark,
          fill: { color: 'D9D9D9' },
          fontSize: headerFontSize,
          fontFace: this.F.body,
          align: 'center',
        },
      })));
    }

    rows.forEach((row, i) => {
      tableRows.push(row.map(cell => ({
        text: String(cell),
        options: {
          fontSize,
          color: this.C.dark,
          fill: { color: i % 2 === 0 ? this.C.white : this.C.light },
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
        border: { type: 'solid', pt: 1, color: '000000' },
        rowH,
        autoPage: false,
      });
    }
  }
}
