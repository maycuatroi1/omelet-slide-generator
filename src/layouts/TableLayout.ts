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

    let tableY = isBanner ? 1.3 : this.CY;
    const takeaway = data.takeaway || data.caption;

    if (!isBanner && data.description) {
      slide.addText(this.rich(data.description, { fontSize: 15, color: this.C.textGray || this.C.medium }), {
        x: this.CX, y: tableY, w: this.CW, h: 0.36,
        fontSize: 15, color: this.C.textGray || this.C.medium,
        fontFace: this.F.body, valign: 'middle', margin: 0,
      });
      tableY += 0.46;
    }

    const bottom = takeaway && !isBanner ? this.TY - 0.1 : this.CB;
    const maxH = bottom - tableY;
    const rowH = Math.max(0.36, Math.min(0.95, maxH / Math.max(totalRows, 1)));
    const fontSize = totalRows > 8 ? 12 : totalRows > 6 ? 13 : 15;
    const headerFontSize = fontSize + 1;

    if (headers.length) {
      tableRows.push(headers.map(h => ({
        text: h,
        options: {
          bold: true,
          color: 'FFFFFF',
          fill: { color: this.C.primaryDark },
          fontSize: headerFontSize,
          fontFace: this.F.body,
          align: 'left',
          valign: 'middle',
          margin: [4, 8, 4, 8],
        },
      })));
    }

    rows.forEach((row, i) => {
      tableRows.push(row.map((cell, c) => {
        const segs = this.parseInline(String(cell));
        const text = segs.map(s => ({
          text: s.text,
          options: s.kind === 'code'
            ? { fontFace: this.F.code, color: this.C.primary }
            : s.kind === 'bold'
              ? { bold: true, color: this.C.accent }
              : {},
        }));
        return {
          text: text as any,
          options: {
            fontSize,
            bold: c === 0,
            color: c === 0 ? this.C.primaryDark : this.C.dark,
            fill: { color: i % 2 === 0 ? (this.C.surface || this.C.white) : this.C.light },
            fontFace: this.F.body,
            valign: 'middle',
            margin: [4, 8, 4, 8],
          },
        };
      }));
    });

    if (tableRows.length) {
      const numCols = headers.length || rows[0]?.length || 1;
      const totalW = isBanner ? 11.33 : this.CW;
      let colW: number[];
      if (data.colWidths && data.colWidths.length === numCols) {
        const sum = data.colWidths.reduce((a, b) => a + b, 0);
        colW = data.colWidths.map(v => (v / sum) * totalW);
      } else {
        colW = Array(numCols).fill(totalW / numCols);
      }
      slide.addTable(tableRows, {
        x: isBanner ? 1.0 : this.CX, y: tableY, w: totalW,
        colW,
        border: { type: 'solid', pt: 0.75, color: this.C.border },
        rowH,
        autoPage: false,
      });
    }

    if (takeaway && !isBanner) this.addTakeaway(slide, takeaway);
  }
}
