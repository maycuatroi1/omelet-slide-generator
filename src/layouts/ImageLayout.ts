import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class ImageLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const isBanner = this.theme.header.style === 'banner';
    const imgY = isBanner ? 1.3 : 1.0;
    const imgH = isBanner ? 5.2 : 5.6;
    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;

    if (imgPath) {
      slide.addImage({
        path: imgPath,
        x: 1.0, y: imgY, w: 11.33, h: imgH,
        sizing: { type: 'contain', w: 11.33, h: imgH },
      });
    } else {
      if (isBanner) {
        this.roundedRect(slide, 1.0, imgY, 11.33, imgH, {
          fill: { color: this.C.light }, rectRadius: 0.1,
          line: { color: this.C.border, width: 1, dashType: 'dash' },
        });
      } else {
        this.addBox(slide, 1.0, imgY, 11.33, imgH);
      }
      slide.addText(`[Image: ${data.imagePath || 'not specified'}]`, {
        x: 1.0, y: 3.2, w: 11.33, h: 1.0,
        fontSize: isBanner ? 16 : 14, color: this.C.medium, align: 'center',
        fontFace: this.F.body,
      });
    }

    if (data.caption) {
      slide.addText(data.caption, {
        x: 1.0, y: 6.6, w: 11.33, h: isBanner ? 0.4 : 0.3,
        fontSize: isBanner ? 12 : 11, color: this.C.textGray || this.C.medium,
        align: 'center', italic: true,
        fontFace: this.F.body,
      });
    }
  }
}
