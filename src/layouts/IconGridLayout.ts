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
    const baseX = isBanner ? 1.0 : 0.9;
    const baseY = isBanner ? 1.4 : 1.1;
    const totalW = isBanner ? 11.33 : 11.53;
    const cellW = totalW / cols;
    const cellH = Math.min(isBanner ? 2.5 : 2.6, 5.5 / rows);
    const iconSize = Math.min(0.55, cellH * 0.22);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = baseX + col * cellW;
      const y = baseY + row * cellH;

      this.addBox(slide, x + 0.1, y, cellW - 0.2, cellH - 0.15);

      if (item.icon) {
        const iconX = x + (cellW - iconSize) / 2;
        const iconY = y + 0.15;
        await IconService.drawIcon(slide, item.icon, iconX, iconY, iconSize, this.C.primary);
      }

      const labelY = item.icon ? y + iconSize + 0.25 : y + 0.15;
      slide.addText(item.label || (item as any), {
        x: x + 0.2, y: labelY, w: cellW - 0.4, h: 0.45,
        fontSize: isBanner ? 13 : 14, align: 'center', bold: true, color: this.C.dark,
        fontFace: this.F.body,
      });
      if (item.desc) {
        slide.addText(item.desc, {
          x: x + 0.2, y: labelY + 0.45, w: cellW - 0.4, h: cellH - (labelY - y) - 0.6,
          fontSize: 11, align: 'center', color: this.C.textGray || this.C.medium,
          fontFace: this.F.body,
        });
      }
    }
  }
}
