import PptxGenJS from 'pptxgenjs';
import { SlideData, ProcessStep } from '../types';
import { BaseLayout } from './BaseLayout';

export class ImageProcessFlowLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const isBanner = this.theme.header.style === 'banner';
    const imgY = isBanner ? 1.2 : 0.9;
    const imgH = 3.0;
    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;

    if (imgPath) {
      slide.addImage({
        path: imgPath,
        x: 1.0, y: imgY, w: 11.33, h: imgH,
        sizing: { type: 'contain', w: 11.33, h: imgH },
      });
    } else {
      this.addBox(slide, 1.0, imgY, 11.33, imgH);
      slide.addText(`[Image: ${data.imagePath || 'not specified'}]`, {
        x: 1.0, y: imgY + 1.0, w: 11.33, h: 1.0,
        fontSize: 14, color: this.C.medium, align: 'center',
        fontFace: this.F.body,
      });
    }

    const flows = (data.flows || []) as { label: string; steps: ProcessStep[] }[];
    const flowY = imgY + imgH + 0.2;
    const flowH = 1.3;

    flows.forEach((flow, fi) => {
      const y = flowY + fi * (flowH + 0.15);
      const steps = flow.steps || [];
      const labelW = 2.0;
      const stepsAreaW = 10.33;
      const stepW = steps.length > 0 ? stepsAreaW / steps.length : stepsAreaW;

      const labelColor = fi === 0 ? this.C.primary : this.C.secondary;
      this.roundedRect(slide, 0.5, y, labelW, flowH, {
        fill: { color: labelColor }, rectRadius: 0.08,
      });
      slide.addText(flow.label, {
        x: 0.5, y, w: labelW, h: flowH,
        fontSize: 12, bold: true, color: this.C.white, align: 'center', valign: 'middle',
        fontFace: this.F.body,
      });

      steps.forEach((step, si) => {
        const x = 0.5 + labelW + 0.15 + si * stepW;
        const boxW = stepW - 0.15;

        this.addBox(slide, x, y, boxW, flowH);

        slide.addText(`${si + 1}`, {
          x: x + 0.1, y: y + 0.08, w: 0.35, h: 0.35,
          fontSize: 11, bold: true, color: this.C.white, align: 'center', valign: 'middle',
          fontFace: this.F.body,
          shape: 'ellipse' as any,
          fill: { color: labelColor },
        } as any);

        slide.addText(step.title, {
          x: x + 0.5, y: y + 0.08, w: boxW - 0.6, h: 0.4,
          fontSize: 11, bold: true, color: this.C.dark, align: 'left', valign: 'middle',
          fontFace: this.F.body,
        });

        if (step.desc) {
          slide.addText(step.desc, {
            x: x + 0.15, y: y + 0.5, w: boxW - 0.3, h: flowH - 0.6,
            fontSize: 9, color: this.C.textGray || this.C.medium, align: 'left', valign: 'top',
            fontFace: this.F.body,
          });
        }

        if (si < steps.length - 1) {
          slide.addText('\u2192', {
            x: x + boxW - 0.05, y: y + 0.2, w: 0.3, h: 0.4,
            fontSize: 16, color: labelColor, align: 'center',
            fontFace: this.F.body, margin: 0,
          });
        }
      });
    });
  }
}
