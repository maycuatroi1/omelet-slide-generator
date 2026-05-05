import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class DemoLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const isBanner = this.theme.header.style === 'banner';

    if (isBanner) {
      return;
    }

    this.addLogo(slide, true);
    slide.addText(data.title || '', {
      ...this.theme.header.titlePosition,
      fontSize: this.theme.header.fontSize,
      color: this.C.dark, bold: true,
      fontFace: this.F.title, margin: 0,
    });
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const isBanner = this.theme.header.style === 'banner';
    const items = (data.items || []) as string[];

    if (isBanner) {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: this.H, fill: { color: '0F172A' } });

      this.roundedRect(slide, 4.0, 0.8, 5.33, 1.2, {
        fill: { color: this.C.secondary }, rectRadius: 0.3,
      });
      slide.addText('LIVE DEMO', {
        x: 4.0, y: 0.8, w: 5.33, h: 1.2,
        fontSize: 30, color: this.C.white, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.title, margin: 0,
      });

      slide.addText(data.title || '', {
        x: 1.0, y: 2.3, w: 11.33, h: 1.0,
        fontSize: 24, color: this.C.white, align: 'center',
        fontFace: this.F.title,
      });

      items.forEach((item, i) => {
        const y = 3.5 + i * 0.65;
        slide.addText(`${i + 1}.`, {
          x: 3.0, y, w: 0.5, h: 0.5,
          fontSize: 16, color: this.C.secondary, bold: true,
          fontFace: this.F.body, margin: 0,
        });
        slide.addText(item, {
          x: 3.5, y, w: 7.0, h: 0.5,
          fontSize: 16, color: this.C.border,
          fontFace: this.F.body,
        });
      });
    } else {
      this.roundedRect(slide, 9.5, 0.12, 3.5, 0.5, {
        fill: { color: this.C.secondary }, rectRadius: 0.15,
      });
      slide.addText('LIVE DEMO', {
        x: 9.5, y: 0.12, w: 3.5, h: 0.5,
        fontSize: 14, color: this.C.white, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.body, margin: 0,
      });

      const startY = 1.1;
      const availableH = 6.7 - startY;
      const itemH = Math.min(0.6, availableH / items.length);
      const fontSize = itemH < 0.5 ? 13 : 15;

      items.forEach((item, i) => {
        const y = startY + i * itemH;
        const circleSize = 0.3;
        const circleX = 1.1;

        slide.addShape('ellipse', {
          x: circleX, y: y + (itemH - circleSize) / 2, w: circleSize, h: circleSize,
          fill: { color: this.C.secondary },
        });
        slide.addText(`${i + 1}`, {
          x: circleX, y: y + (itemH - circleSize) / 2, w: circleSize, h: circleSize,
          fontSize: 10, color: this.C.white, bold: true,
          align: 'center', valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
        slide.addText(item, {
          x: 1.6, y, w: 10.5, h: itemH,
          fontSize, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body,
        });
      });
    }
  }
}
