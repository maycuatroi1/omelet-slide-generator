import PptxGenJS from 'pptxgenjs';
import { SlideData, ProcessStep } from '../types';
import { BaseLayout } from './BaseLayout';

export class ProcessFlowLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const steps = (data.steps || []) as ProcessStep[];
    const maxSteps = Math.min(steps.length, 6);
    const isBanner = this.theme.header.style === 'banner';

    if (isBanner) {
      const stepW = 11.0 / maxSteps;
      steps.slice(0, maxSteps).forEach((step, i) => {
        const x = 1.0 + i * stepW;
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
        slide.addText((step as any).title || step, {
          x: x + 0.2, y: 2.7, w: stepW - 0.5, h: 0.6,
          fontSize: 14, bold: true, align: 'center', color: this.C.dark, fontFace: this.F.body,
        });
        if ((step as ProcessStep).desc) {
          slide.addText((step as ProcessStep).desc!, {
            x: x + 0.2, y: 3.3, w: stepW - 0.5, h: 1.5,
            fontSize: 11, align: 'center', color: this.C.textGray || this.C.medium,
            fontFace: this.F.body,
          });
        }
        if (i < maxSteps - 1) {
          slide.addText('→', {
            x: x + stepW - 0.25, y: 3.0, w: 0.4, h: 0.5,
            fontSize: 24, color: this.C.primary, align: 'center',
            fontFace: this.F.body, margin: 0,
          });
        }
      });
      return;
    }

    const takeaway = data.takeaway || data.caption;
    let top = this.CY;
    let availH = this.contentH(!!takeaway);

    if (data.description) {
      slide.addText(this.rich(data.description, { fontSize: 15, color: this.C.textGray || this.C.medium }), {
        x: this.CX, y: top, w: this.CW, h: 0.4,
        fontSize: 15, color: this.C.textGray || this.C.medium,
        fontFace: this.F.body, valign: 'top', margin: 0,
      });
      top += 0.5;
      availH -= 0.5;
    }

    const gap = 0.26;
    const stepW = (this.CW - gap * (maxSteps - 1)) / maxSteps;
    const innerW = stepW - 0.56;

    steps.slice(0, maxSteps).forEach((step, i) => {
      const x = this.CX + i * (stepW + gap);
      const title = (step as any).title || String(step);
      const desc = (step as ProcessStep).desc;
      const accent = i % 2 === 0 ? this.C.primary : this.C.accent;

      this.addCard(slide, x, top, stepW, availH, accent);

      slide.addShape('rect', {
        x: x + 0.28, y: top + 0.3, w: 0.42, h: 0.42,
        fill: { color: accent }, line: { color: accent, width: 0 },
      });
      slide.addText(`${i + 1}`, {
        x: x + 0.28, y: top + 0.3, w: 0.42, h: 0.42,
        fontSize: 15, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle',
        fontFace: this.F.title, margin: 0,
      });

      let titleSize = 18;
      while (titleSize > 12 && this.estimateBoldH(title, innerW, titleSize) > 0.92) titleSize -= 1;
      const titleH = Math.max(0.34, this.estimateBoldH(title, innerW, titleSize)) + 0.06;

      slide.addText(this.rich(title, { fontSize: titleSize, color: this.C.primaryDark, bold: true }), {
        x: x + 0.28, y: top + 0.86, w: innerW, h: titleH,
        fontSize: titleSize, color: this.C.primaryDark, bold: true,
        fontFace: this.F.body, valign: 'top', margin: 0,
      });

      if (desc) {
        const descTop = top + 0.86 + titleH + 0.18;
        slide.addShape('line', {
          x: x + 0.28, y: descTop - 0.1, w: innerW, h: 0,
          line: { color: this.C.border, width: 0.75 },
        });
        const descH = top + availH - descTop - 0.24;
        let descSize = 14;
        while (descSize > 10 && this.estimateTextH(desc, innerW, descSize, 1.3) > descH) descSize -= 1;
        slide.addText(this.rich(desc, { fontSize: descSize, color: this.C.textGray || this.C.medium }), {
          x: x + 0.28, y: descTop, w: innerW, h: descH,
          fontSize: descSize, color: this.C.textGray || this.C.medium,
          fontFace: this.F.body, valign: 'top', margin: 0, lineSpacingMultiple: 1.1,
        });
      }

      if (i < maxSteps - 1) {
        slide.addText('→', {
          x: x + stepW - 0.02, y: top + availH / 2 - 0.25, w: gap + 0.04, h: 0.5,
          fontSize: 20, color: this.C.accent, align: 'center', valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
      }
    });

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
