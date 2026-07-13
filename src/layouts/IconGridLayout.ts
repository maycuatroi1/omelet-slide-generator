import PptxGenJS from 'pptxgenjs';
import { SlideData, IconGridItem } from '../types';
import { BaseLayout } from './BaseLayout';
import { IconService } from '../services/IconService';

export class IconGridLayout extends BaseLayout {
  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const items = (data.items || []) as IconGridItem[];
    const cols = data.columnCount || Math.min(items.length, 4);
    const rows = Math.ceil(items.length / cols);
    const isBanner = this.theme.header.style === 'banner';

    if (isBanner) {
      const baseX = 1.0;
      const baseY = 1.4;
      const cellW = 11.33 / cols;
      const cellH = Math.min(2.5, 5.5 / rows);
      const iconSize = Math.min(0.55, cellH * 0.22);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = baseX + col * cellW;
        const y = baseY + row * cellH;
        this.addBox(slide, x + 0.1, y, cellW - 0.2, cellH - 0.15);
        if (item.icon) {
          await IconService.drawIcon(slide, item.icon, x + (cellW - iconSize) / 2, y + 0.15, iconSize, this.C.primary);
        }
        const labelY = item.icon ? y + iconSize + 0.25 : y + 0.15;
        slide.addText(item.label || '', {
          x: x + 0.2, y: labelY, w: cellW - 0.4, h: 0.45,
          fontSize: 13, align: 'center', bold: true, color: this.C.dark, fontFace: this.F.body,
        });
        if (item.desc) {
          slide.addText(item.desc, {
            x: x + 0.2, y: labelY + 0.45, w: cellW - 0.4, h: cellH - (labelY - y) - 0.6,
            fontSize: 11, align: 'center', color: this.C.textGray || this.C.medium, fontFace: this.F.body,
          });
        }
      }
      return;
    }

    const takeaway = data.takeaway || data.caption;
    let top = this.CY;
    let availH = this.contentH(!!takeaway);

    if (data.description) {
      slide.addText(this.rich(data.description, { fontSize: 15, color: this.C.textGray || this.C.medium }), {
        x: this.CX, y: top, w: this.CW, h: 0.36,
        fontSize: 15, color: this.C.textGray || this.C.medium,
        fontFace: this.F.body, valign: 'middle', margin: 0,
      });
      top += 0.46;
      availH -= 0.46;
    }

    const gap = 0.22;
    const cellW = (this.CW - gap * (cols - 1)) / cols;
    const cellH = (availH - gap * (rows - 1)) / rows;
    const iconSize = Math.min(0.6, cellH * 0.2);
    const palette = [this.C.primary, this.C.accent, this.C.secondary, this.C.primaryDark];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = this.CX + col * (cellW + gap);
      const y = top + row * (cellH + gap);
      const accent = palette[i % palette.length];

      this.addCard(slide, x, y, cellW, cellH);
      slide.addShape('rect', {
        x, y, w: cellW, h: 0.1,
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });

      const innerW = cellW - 0.5;
      const labelH = Math.max(0.42, this.estimateTextH(item.label || '', innerW, 17));
      const descH = item.desc ? this.estimateTextH(item.desc, innerW, 14) : 0;
      const contentH = (item.icon ? iconSize + 0.18 : 0) + labelH + (item.desc ? descH + 0.1 : 0);
      let cursor = y + 0.24 + Math.max(0, (cellH - 0.34 - contentH) / 2);

      if (item.icon) {
        await IconService.drawIcon(slide, item.icon, x + 0.28, cursor, iconSize, accent);
        cursor += iconSize + 0.18;
      }

      slide.addText(this.rich(item.label || '', { fontSize: 17, color: this.C.primaryDark, bold: true }), {
        x: x + 0.28, y: cursor, w: innerW, h: labelH,
        fontSize: 17, bold: true, color: this.C.primaryDark,
        fontFace: this.F.body, margin: 0, valign: 'middle',
      });
      cursor += labelH + 0.1;

      if (item.desc) {
        slide.addText(this.rich(item.desc, { fontSize: 14, color: this.C.textGray || this.C.medium }), {
          x: x + 0.28, y: cursor, w: innerW, h: Math.min(descH + 0.2, y + cellH - cursor - 0.16),
          fontSize: 14, color: this.C.textGray || this.C.medium,
          fontFace: this.F.body, valign: 'top', margin: 0,
        });
      }
    }

    if (takeaway) this.addTakeaway(slide, takeaway);
  }
}
