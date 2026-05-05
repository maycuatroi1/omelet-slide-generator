import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class ImageTextLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const isBanner = this.theme.header.style === 'banner';
    const isLeft = (data.imagePosition || 'left') === 'left';
    const imgX = isLeft ? 0.5 : 6.83;
    const textX = isLeft ? 6.83 : 0.5;
    const contentY = isBanner ? 1.3 : 1.0;
    const contentH = isBanner ? 5.5 : 5.6;

    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;

    if (imgPath) {
      slide.addImage({
        path: imgPath,
        x: imgX, y: contentY, w: 6.0, h: contentH,
        sizing: { type: 'contain', w: 6.0, h: contentH },
      });
    } else {
      if (isBanner) {
        this.roundedRect(slide, imgX, contentY, 6.0, contentH, {
          fill: { color: this.C.light }, rectRadius: 0.1,
          line: { color: this.C.border, width: 1, dashType: 'dash' },
        });
      } else {
        this.addBox(slide, imgX, contentY, 6.0, contentH);
      }
      slide.addText(`[Image: ${data.imagePath || 'not specified'}]`, {
        x: imgX, y: 3.5, w: 6.0, h: 1.0,
        fontSize: 14, color: this.C.medium, align: 'center',
        fontFace: this.F.body,
      });
    }

    if (!isBanner) {
      this.addBox(slide, textX, contentY, 6.0, contentH);
    }

    slide.addText(this.makeBulletItems(data.items as string[] || []), {
      x: isBanner ? textX : textX + 0.15,
      y: isBanner ? 1.5 : 1.2,
      w: isBanner ? 5.8 : 5.7,
      h: isBanner ? 5.0 : 5.2,
      fontSize: isBanner ? 16 : 14, color: this.C.dark, paraSpaceAfter: 8,
      fontFace: this.F.body, valign: 'top',
    });
  }
}
