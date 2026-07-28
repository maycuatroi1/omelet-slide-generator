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
          fontSize: 18, color: this.C.secondary, align: 'center', fontFace: this.F.body,
        });
      }
      slide.addText(data.title || '', {
        x: 1.0, y: 2.8, w: 11.33, h: 1.5,
        fontSize: 36, color: this.C.white, bold: true, align: 'center', fontFace: this.F.title,
      });
      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1.5, y: 5.3, w: 10.33, h: 0.8,
          fontSize: 18, color: this.C.primaryLight || 'BFDBFE', align: 'center', fontFace: this.F.body,
        });
      }
      return;
    }

    this.addLogo(slide, true);

    const items = ((data.items as string[]) || []).filter(i => typeof i === 'string');
    const listTopEdge = 1.25;
    const bottom = this.CB;
    const hasList = items.length > 0;
    const leftW = hasList ? this.CW * 0.5 : this.CW;

    const titleSize = hasList ? 38 : 46;
    const titleH = this.estimateBoldH(data.title || '', leftW, titleSize, 1.05);
    const headOffset = data.sectionNumber ? 1.74 : 0.4;
    const top = data.subtitle
      ? listTopEdge
      : Math.max(listTopEdge, (bottom + listTopEdge - 0.12 - headOffset - titleH) / 2);

    if (data.sectionNumber) {
      slide.addText(String(data.sectionNumber).padStart(2, '0'), {
        x: this.CX, y: top - 0.18, w: 2.4, h: 1.5,
        fontSize: 108, color: this.C.light, bold: true,
        fontFace: this.F.title, margin: 0, valign: 'top',
      });
      slide.addText(`SECTION ${data.sectionNumber}`, {
        x: this.CX, y: top + 1.34, w: leftW, h: 0.3,
        fontSize: 12, bold: true, charSpacing: 1.8, color: this.C.accent,
        fontFace: this.F.body, margin: 0, valign: 'middle',
      });
    }

    const titleY = top + headOffset;
    slide.addText(data.title || '', {
      x: this.CX, y: titleY, w: leftW, h: 1.9,
      fontSize: titleSize, color: this.C.primaryDark, bold: true,
      align: 'left', valign: 'top', lineSpacingMultiple: 1.05,
      fontFace: this.F.title, margin: 0,
    });

    const ruleY = data.subtitle
      ? bottom - 0.62
      : Math.min(bottom - 0.62, titleY + titleH + 0.3);
    slide.addShape('line', {
      x: this.CX, y: ruleY, w: leftW - 0.4, h: 0,
      line: { color: this.C.border, width: 1 },
    });
    slide.addShape('line', {
      x: this.CX, y: ruleY, w: 1.1, h: 0,
      line: { color: this.C.accent, width: 3 },
    });
    if (data.subtitle) {
      slide.addText(data.subtitle, {
        x: this.CX, y: bottom - 0.5, w: leftW - 0.4, h: 0.42,
        fontSize: 16, color: this.C.textGray || this.C.medium,
        align: 'left', valign: 'middle', fontFace: this.F.body, margin: 0,
      });
    }

    if (!hasList) return;

    const listX = this.CX + this.CW * 0.54;
    const listW = this.CW * 0.46;
    slide.addShape('line', {
      x: listX - 0.34, y: listTopEdge, w: 0, h: bottom - listTopEdge,
      line: { color: this.C.border, width: 1 },
    });
    slide.addText('IN THIS SECTION', {
      x: listX, y: listTopEdge, w: listW, h: 0.3,
      fontSize: 12, bold: true, charSpacing: 1.8, color: this.C.accent,
      fontFace: this.F.body, margin: 0, valign: 'middle',
    });

    const listTop = listTopEdge + 0.5;
    const { fontSize, descSize, rows } = this.fitRows(items, listW - 0.42, bottom - listTop, 17, 13);
    items.forEach((item, i) => {
      const { y: dy, h: rowH, leadH } = rows[i];
      const y = listTop + dy;
      const { lead, rest } = this.splitLead(item);
      slide.addText(String(i + 1).padStart(2, '0'), {
        x: listX, y: y + 0.02, w: 0.4, h: 0.3,
        fontSize: 12, bold: true, color: this.C.accent,
        fontFace: this.F.title, margin: 0, valign: 'top',
      });
      if (rest) {
        slide.addText(this.rich(lead, { fontSize, color: this.C.primaryDark, bold: true }), {
          x: listX + 0.42, y, w: listW - 0.42, h: leadH,
          fontSize, color: this.C.primaryDark, bold: true,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
        slide.addText(this.rich(rest, { fontSize: descSize, color: this.C.textGray || this.C.medium }), {
          x: listX + 0.42, y: y + leadH, w: listW - 0.42, h: rowH - leadH - 0.08,
          fontSize: descSize, color: this.C.textGray || this.C.medium,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
      } else {
        slide.addText(this.rich(item, { fontSize, color: this.C.dark }), {
          x: listX + 0.42, y, w: listW - 0.42, h: rowH - 0.06,
          fontSize, color: this.C.dark,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
      }
    });
  }
}
