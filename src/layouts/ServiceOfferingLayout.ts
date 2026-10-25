import PptxGenJS from 'pptxgenjs';
import { SlideData, ServiceOfferingData } from '../types';
import { BaseLayout } from './BaseLayout';

/** A service brief with a situation, execution steps, deliverables and measurement strip. */
export class ServiceOfferingLayout extends BaseLayout {
  private text(slide: PptxGenJS.Slide, value: string, x: number, y: number, w: number, h: number,
    size = 13, color = this.C.dark, bold = false): void {
    slide.addText(this.rich(value, { fontSize: size, color, bold }), {
      x, y, w, h, fontFace: this.F.body, fontSize: size, color, bold,
      margin: 0, valign: 'top', breakLine: false, isTextBox: true,
    });
  }

  private validate(service: ServiceOfferingData): void {
    const limits = { sources: 4, steps: 5, deliverables: 4, metrics: 4 } as const;
    for (const [key, max] of Object.entries(limits)) {
      const values = service[key as keyof typeof limits];
      if (!Array.isArray(values) || values.length < 1 || values.length > max) {
        throw new Error(`serviceOffering.service.${key} needs 1-${max} items`);
      }
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData): void {
    const service = data.service;
    if (!service) throw new Error('serviceOffering requires service data');
    this.validate(service);
    const top = this.theme.header.style === 'banner' ? 1.2 : this.CY;
    const bodyTop = top + 0.88;
    const bodyBottom = this.CB - 1.0;
    const bodyH = bodyBottom - bodyTop;
    const gap = 0.28;
    const leftW = this.CW * 0.245;
    const middleW = this.CW * 0.355;
    const rightW = this.CW - leftW - middleW - 2 * gap;
    const middleX = this.CX + leftW + gap;
    const rightX = middleX + middleW + gap;

    this.text(slide, service.outcome, this.CX, top, this.CW, 0.44, 21, this.C.primaryDark, true);
    this.text(slide, service.audience, this.CX, top + 0.51, this.CW, 0.27, 12.5, this.C.medium);
    this.situation(slide, service, this.CX, bodyTop, leftW, bodyH);
    this.workflow(slide, service, middleX, bodyTop, middleW, bodyH);
    this.deliverables(slide, service, rightX, bodyTop, rightW, bodyH);
    this.metrics(slide, service, bodyBottom + 0.18);
  }

  private situation(slide: PptxGenJS.Slide, data: ServiceOfferingData,
    x: number, y: number, w: number, h: number): void {
    slide.addShape('rect', { x, y, w, h, fill: { color: this.C.primaryDark },
      line: { color: this.C.primaryDark, transparency: 100 } });
    this.text(slide, data.labels?.problem || 'Situation', x + 0.22, y + 0.18, w - 0.44, 0.26,
      12, this.C.white, true);
    this.text(slide, data.problem, x + 0.22, y + 0.58, w - 0.44, h * 0.38,
      14, this.C.white);
    const sourceTop = y + h * 0.54;
    this.text(slide, data.labels?.sources || 'Inputs', x + 0.22, sourceTop, w - 0.44, 0.26,
      12, this.C.white, true);
    const rowH = (y + h - sourceTop - 0.64) / data.sources.length;
    data.sources.forEach((source, i) => {
      this.text(slide, `${String(i + 1).padStart(2, '0')}  ${source}`,
        x + 0.22, sourceTop + 0.43 + i * rowH, w - 0.44, rowH - 0.06, 12.5, this.C.white);
    });
  }

  private workflow(slide: PptxGenJS.Slide, data: ServiceOfferingData,
    x: number, y: number, w: number, h: number): void {
    this.text(slide, data.labels?.workflow || 'Execution', x, y + 0.16, w, 0.3,
      14, this.C.primaryDark, true);
    const rowH = (h - 0.65) / data.steps.length;
    data.steps.forEach((step, i) => {
      const top = y + 0.64 + i * rowH;
      slide.addShape('ellipse', { x, y: top + 0.015, w: 0.29, h: 0.29,
        fill: { color: this.C.primary }, line: { color: this.C.primary, transparency: 100 } });
      slide.addText(String(i + 1), { x, y: top + 0.015, w: 0.29, h: 0.29,
        fontFace: this.F.body, fontSize: 10, bold: true, color: this.C.white,
        align: 'center', valign: 'middle', margin: 0, isTextBox: true });
      this.text(slide, step.title, x + 0.42, top, w - 0.42, 0.3, 14, this.C.primaryDark, true);
      if (step.desc) this.text(slide, step.desc, x + 0.42, top + 0.34,
        w - 0.42, rowH - 0.4, 12.5);
      if (i < data.steps.length - 1) slide.addShape('line', {
        x: x + 0.145, y: top + 0.34, w: 0, h: rowH - 0.38,
        line: { color: this.C.border, width: 1 },
      });
    });
  }

  private deliverables(slide: PptxGenJS.Slide, data: ServiceOfferingData,
    x: number, y: number, w: number, h: number): void {
    this.text(slide, data.labels?.deliverables || 'Deliverables', x, y + 0.16, w, 0.3,
      14, this.C.primaryDark, true);
    const rowH = (h - 0.65) / data.deliverables.length;
    data.deliverables.forEach((item, i) => {
      const top = y + 0.64 + i * rowH;
      this.text(slide, item.title, x, top, w, 0.3, 14, this.C.primaryDark, true);
      if (item.desc) this.text(slide, item.desc, x, top + 0.35, w, rowH - 0.46, 12.5);
      if (i < data.deliverables.length - 1) slide.addShape('line', {
        x, y: top + rowH - 0.12, w, h: 0, line: { color: this.C.border, width: 0.6 },
      });
    });
  }

  private metrics(slide: PptxGenJS.Slide, data: ServiceOfferingData, y: number): void {
    const gap = 0.18;
    const width = (this.CW - (data.metrics.length - 1) * gap) / data.metrics.length;
    data.metrics.forEach((metric, i) => {
      const x = this.CX + i * (width + gap);
      slide.addShape('rect', { x, y, w: width, h: 0.6,
        fill: { color: this.C.light }, line: { color: this.C.light, transparency: 100 } });
      this.text(slide, metric.label, x + 0.16, y + 0.07, width - 0.32, 0.23,
        11.5, this.C.primaryDark, true);
      this.text(slide, metric.detail, x + 0.16, y + 0.33, width - 0.32, 0.22, 11, this.C.medium);
    });
    if (data.boundary) this.text(slide, data.boundary, this.CX, y + 0.7, this.CW, 0.21, 10.5, this.C.medium);
  }
}
