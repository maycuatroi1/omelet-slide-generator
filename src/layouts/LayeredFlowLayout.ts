import PptxGenJS from 'pptxgenjs';
import { SlideData, FlowLane } from '../types';
import { BaseLayout } from './BaseLayout';

/** Editable horizontal layers for source, decision and delivery diagrams. */
export class LayeredFlowLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData): void {
    const lanes = data.lanes || [];
    if (lanes.length < 2 || lanes.length > 4) throw new Error('layeredFlow needs 2-4 lanes');
    for (const lane of lanes) {
      if (lane.items.length < 1 || lane.items.length > 4) throw new Error('layeredFlow lanes need 1-4 items');
    }
    const top = (this.theme.header.style === 'banner' ? 1.2 : this.CY) + (data.description ? 0.55 : 0);
    if (data.description) slide.addText(this.rich(data.description), {
      x: this.CX, y: top - 0.55, w: this.CW, h: 0.38, fontSize: 15,
      color: this.C.medium, fontFace: this.F.body, margin: 0, isTextBox: true,
    });
    const bottom = this.CB - (data.takeaway ? 0.36 : 0);
    const gap = 0.36;
    const laneH = (bottom - top - gap * (lanes.length - 1)) / lanes.length;
    const labelW = 1.65;
    lanes.forEach((lane, i) => {
      const y = top + i * (laneH + gap);
      this.lane(slide, lane, y, laneH, labelW);
      if (i < lanes.length - 1) {
        const cx = this.CX + labelW + (this.CW - labelW) / 2;
        slide.addShape('line', { x: cx, y: y + laneH + 0.06, w: 0, h: gap - 0.12,
          line: { color: this.C.medium, width: 1.2, beginArrowType: 'none', endArrowType: 'triangle' } });
      }
    });
    if (data.takeaway) slide.addText(data.takeaway, {
      x: this.CX, y: this.CB - 0.23, w: this.CW, h: 0.22, fontSize: 11,
      color: this.C.medium, fontFace: this.F.body, margin: 0, isTextBox: true,
    });
  }

  private lane(slide: PptxGenJS.Slide, lane: FlowLane, y: number, h: number, labelW: number): void {
    slide.addText(lane.label, { x: this.CX, y: y + 0.12, w: labelW - 0.22, h: 0.52,
      fontSize: 15, bold: true, color: this.C.primaryDark, fontFace: this.F.body,
      margin: 0, valign: 'top', isTextBox: true });
    if (lane.subtitle) slide.addText(lane.subtitle, {
      x: this.CX, y: y + 0.71, w: labelW - 0.22, h: Math.max(0.25, h - 0.75),
      fontSize: 11.5, color: this.C.medium, fontFace: this.F.body, margin: 0, isTextBox: true,
    });
    const gap = 0.2;
    const width = (this.CW - labelW - gap * (lane.items.length - 1)) / lane.items.length;
    lane.items.forEach((item, j) => {
      const x = this.CX + labelW + j * (width + gap);
      const fill = lane.emphasis ? this.C.primaryDark : this.C.light;
      const color = lane.emphasis ? this.C.white : this.C.dark;
      slide.addShape('rect', { x, y, w: width, h, fill: { color: fill },
        line: { color: fill, transparency: 100 } });
      slide.addText(item.title, { x: x + 0.18, y: y + 0.16, w: width - 0.36, h: 0.36,
        fontSize: 16, bold: true, color, fontFace: this.F.body, margin: 0, isTextBox: true });
      if (item.desc) slide.addText(this.rich(item.desc, { color }), {
        x: x + 0.18, y: y + 0.63, w: width - 0.36, h: h - 0.76,
        fontSize: 12.5, color, fontFace: this.F.body, margin: 0, valign: 'top', isTextBox: true,
      });
    });
  }
}
