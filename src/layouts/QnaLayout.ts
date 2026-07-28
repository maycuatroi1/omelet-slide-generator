import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class QnaLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const qnaType = data.type || 'qna';
    const configs: Record<string, { accent: string; defaultTitle: string }> = {
      qna: { accent: this.C.primary, defaultTitle: 'Questions & Answers' },
      break: { accent: this.C.medium, defaultTitle: 'Break Time' },
      discussion: { accent: this.C.secondary, defaultTitle: 'Discussion' },
    };
    const cfg = configs[qnaType] || configs.qna;

    if (this.theme.header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.2, fill: { color: cfg.accent } });
      slide.addText(data.title || cfg.defaultTitle, {
        x: 0.5, y: 0.15, w: 12.33, h: 0.9,
        fontSize: 28, color: this.C.white, bold: true,
        fontFace: this.F.title, margin: 0,
      });
    } else {
      super.addHeader(slide, { ...data, title: data.title || cfg.defaultTitle });
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const qnaType = data.type || 'qna';
    const configs: Record<string, { accent: string; icon: string }> = {
      qna: { accent: this.C.primary, icon: '?' },
      break: { accent: this.C.medium, icon: '||' },
      discussion: { accent: this.C.secondary, icon: '!' },
    };
    const cfg = configs[qnaType] || configs.qna;
    const isBanner = this.theme.header.style === 'banner';
    const startY = isBanner ? 1.5 : this.CY;
    const items = (data.items || []) as string[];
    const hasItems = items.length > 0;

    if (hasItems) {
      const boxX = isBanner ? 0.5 : this.CX;
      const boxW = isBanner ? 12.33 : this.CW;
      const bottom = isBanner ? 6.7 : this.CB;
      let cursor = startY;

      if (data.subtitle) {
        slide.addShape('rect', {
          x: boxX, y: cursor, w: 0.5, h: 0.5,
          fill: { color: cfg.accent }, line: { color: cfg.accent, width: 0 },
        });
        slide.addText(cfg.icon, {
          x: boxX, y: cursor, w: 0.5, h: 0.5,
          fontSize: 20, color: this.C.white, bold: true,
          align: 'center', valign: 'middle', fontFace: this.F.title, margin: 0,
        });
        slide.addText(this.rich(data.subtitle, { fontSize: 18, color: this.C.primaryDark, bold: true }), {
          x: boxX + 0.72, y: cursor, w: boxW - 0.72, h: 0.5,
          fontSize: 18, color: this.C.primaryDark, valign: 'middle',
          fontFace: this.F.body, bold: true, margin: 0,
        });
        cursor += 0.72;
      }

      const innerW = boxW - 0.62;
      const { fontSize, descSize, rows } = this.fitRows(items, innerW, bottom - cursor, 18, 14);

      items.forEach((item, i) => {
        const { y: dy, h: rowH, leadH } = rows[i];
        const y = cursor + dy;
        const { lead, rest } = this.splitLead(item);
        slide.addText(String(i + 1).padStart(2, '0'), {
          x: boxX, y: y + 0.02, w: 0.5, h: 0.3,
          fontSize: 13, color: cfg.accent, bold: true,
          align: 'left', valign: 'top', fontFace: this.F.title, margin: 0,
        });
        if (rest) {
          slide.addText(this.rich(lead, { fontSize, color: this.C.primaryDark, bold: true }), {
            x: boxX + 0.52, y, w: innerW, h: leadH,
            fontSize, color: this.C.primaryDark, bold: true,
            fontFace: this.F.body, valign: 'top', margin: 0,
          });
          slide.addText(this.rich(rest, { fontSize: descSize, color: this.C.textGray || this.C.medium }), {
            x: boxX + 0.52, y: y + leadH, w: innerW, h: rowH - leadH - 0.08,
            fontSize: descSize, color: this.C.textGray || this.C.medium,
            fontFace: this.F.body, valign: 'top', margin: 0,
          });
        } else {
          slide.addText(this.rich(item, { fontSize, color: this.C.dark }, { color: this.C.accent }), {
            x: boxX + 0.52, y, w: innerW, h: rowH - 0.06,
            fontSize, color: this.C.dark, valign: 'top',
            fontFace: this.F.body, margin: 0,
          });
        }
        if (i < items.length - 1) {
          slide.addShape('line', {
            x: boxX, y: y + rowH - 0.04, w: boxW, h: 0,
            line: { color: this.C.border, width: 0.75 },
          });
        }
      });
    } else {
      this.addBox(slide, 0.5, startY, 12.33, 6.7 - startY);
      slide.addShape('ellipse', {
        x: 5.77, y: startY + 0.4, w: 1.8, h: 1.8,
        fill: { color: cfg.accent },
      });
      slide.addText(cfg.icon, {
        x: 5.77, y: startY + 0.4, w: 1.8, h: 1.8,
        fontSize: 48, color: this.C.white, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.title, margin: 0,
      });

      const subtitle = data.subtitle || '';
      const textY = startY + 2.5;
      slide.addText(subtitle, {
        x: 1.2, y: textY, w: 10.93, h: 6.7 - textY - 0.2,
        fontSize: subtitle.length > 150 ? 15 : 20,
        color: this.C.textGray, align: 'center', valign: 'top',
        fontFace: this.F.body, wrap: true,
      });
    }
  }
}
