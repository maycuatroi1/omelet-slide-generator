import PptxGenJS from 'pptxgenjs';
import { SlideData, ProcessStep } from '../types';
import { BaseLayout } from './BaseLayout';

export class ProcessFlowLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const steps = (data.steps || []) as ProcessStep[];
    const maxSteps = Math.min(steps.length, 6);
    const stepW = 11.0 / maxSteps;
    const isBanner = this.theme.header.style === 'banner';

    steps.slice(0, maxSteps).forEach((step, i) => {
      const x = 1.0 + i * stepW;

      if (isBanner) {
        const bgColor = i % 2 === 0
          ? (this.C.primaryLight || this.C.light)
          : (this.C.secondaryLight || this.C.light);
        this.roundedRect(slide, x + 0.1, 2.0, stepW - 0.3, 3.0, {
          fill: { color: bgColor }, rectRadius: 0.1,
        });
        slide.addText(`${i + 1}`, {
          x: x + 0.1, y: 2.1, w: stepW - 0.3, h: 0.6,
          fontSize: 22, bold: true, align: 'center', color: this.C.primary,
          fontFace: this.F.body, margin: 0,
        });
      } else {
        this.addBox(slide, x + 0.1, 1.8, stepW - 0.3, 4.5);
        slide.addShape('ellipse', {
          x: x + stepW / 2 - 0.25, y: 2.0, w: 0.5, h: 0.5,
          fill: { color: this.C.primary },
        });
        slide.addText(`${i + 1}`, {
          x: x + stepW / 2 - 0.25, y: 2.0, w: 0.5, h: 0.5,
          fontSize: 16, color: this.C.white, bold: true, align: 'center', valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
      }

      const titleY = isBanner ? 2.7 : 2.6;
      slide.addText((step as any).title || step, {
        x: x + 0.2, y: titleY, w: stepW - 0.5, h: 0.6,
        fontSize: 14, bold: true, align: 'center', color: this.C.dark,
        fontFace: this.F.body,
      });

      if ((step as ProcessStep).desc) {
        slide.addText((step as ProcessStep).desc!, {
          x: x + 0.2, y: isBanner ? 3.3 : 3.2, w: stepW - 0.5, h: isBanner ? 1.5 : 2.8,
          fontSize: 11, align: 'center', color: this.C.textGray || this.C.medium,
          fontFace: this.F.body,
        });
      }

      if (i < maxSteps - 1) {
        slide.addText('\u2192', {
          x: x + stepW - 0.25, y: isBanner ? 3.0 : 3.5, w: 0.4, h: 0.5,
          fontSize: 24, color: this.C.primary, align: 'center',
          fontFace: this.F.body, margin: 0,
        });
      }
    });
  }
}
