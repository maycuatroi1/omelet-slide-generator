import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class ObjectivesLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const { header, colors, fonts } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.2, fill: { color: colors.secondary } });
      slide.addText(data.title || 'Learning Objectives', {
        x: 0.5, y: 0.15, w: 12.33, h: 0.9,
        fontSize: 28, color: colors.white, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    } else {
      this.addLogo(slide, true);
      slide.addText(data.title || 'Objective & Learning Outcome', {
        ...header.titlePosition,
        fontSize: header.fontSize,
        color: colors.dark, bold: true,
        fontFace: fonts.title, margin: 0,
      });
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const items = (data.items || []) as string[];
    const details = data.details || [];
    const { header } = this.theme;

    if (header.style === 'banner') {
      const count = items.length;
      const startY = 1.6;
      const endY = 6.7;
      const spacing = Math.min(0.75, (endY - startY) / count);
      const itemH = spacing - 0.1;

      items.forEach((item, i) => {
        const y = startY + i * spacing;
        this.roundedRect(slide, 0.8, y, 11.73, itemH, {
          fill: { color: i % 2 === 0 ? (this.C.secondaryLight || this.C.light) : this.C.white },
          rectRadius: 0.05,
        });
        slide.addText(`${i + 1}`, {
          x: 0.9, y, w: 0.5, h: itemH,
          fontSize: 16, color: this.C.secondary, bold: true, align: 'center',
          fontFace: this.F.body, margin: 0,
        });
        slide.addText(item, {
          x: 1.5, y, w: 10.9, h: itemH,
          fontSize: count > 5 ? 14 : 16, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body,
        });
      });
    } else if (details.length > 0) {
      const objCount = items.length;
      const outCount = details.length;
      const gap = 0.25;

      const objItemH = 0.55;
      const objContentH = objCount * objItemH;
      const objBoxH = objContentH + 0.6;
      const objY = 1.0;

      this.addBox(slide, 0.9, objY, 11.53, objBoxH);
      slide.addText(data.leftTitle || 'Objective', {
        x: 1.1, y: objY + 0.1, w: 3.0, h: 0.35,
        fontSize: 16, color: this.C.dark, bold: true,
        fontFace: this.F.body, valign: 'top',
      });
      items.forEach((item, i) => {
        const y = objY + 0.45 + i * objItemH;
        slide.addText(item, {
          x: 1.4, y, w: 10.7, h: objItemH,
          fontSize: 16, color: this.C.dark,
          fontFace: this.F.body, valign: 'middle',
          bullet: true,
        });
      });

      const outY = objY + objBoxH + gap;
      const outItemH = 0.55;
      const outContentH = outCount * outItemH;
      const outBoxH = outContentH + 0.6;

      this.addBox(slide, 0.9, outY, 11.53, outBoxH);
      slide.addText(data.rightTitle || 'Outcome', {
        x: 1.1, y: outY + 0.1, w: 3.0, h: 0.35,
        fontSize: 16, color: this.C.dark, bold: true,
        fontFace: this.F.body, valign: 'top',
      });
      details.forEach((item, i) => {
        const y = outY + 0.45 + i * outItemH;
        slide.addText(item, {
          x: 1.4, y, w: 10.7, h: outItemH,
          fontSize: 16, color: this.C.dark,
          fontFace: this.F.body, valign: 'middle',
          bullet: true,
        });
      });
    } else {
      const count = items.length;
      const boxY = 1.0;
      const endY = 6.7;
      const boxH = endY - boxY;
      this.addBox(slide, 0.9, boxY, 11.32, boxH);

      const contentStart = boxY + 0.25;
      const contentEnd = endY - 0.15;
      const spacing = (contentEnd - contentStart) / count;
      const fontSize = count > 5 ? 16 : (count > 4 ? 18 : 20);

      items.forEach((item, i) => {
        const y = contentStart + i * spacing;
        slide.addText(item, {
          x: 1.4, y, w: 10.5, h: spacing - 0.05,
          fontSize, color: this.C.dark,
          fontFace: this.F.body, valign: 'middle',
          bullet: true,
        });
      });
    }
  }
}
