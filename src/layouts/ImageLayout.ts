import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class ImageLayout extends BaseLayout {
  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const isBanner = this.theme.header.style === 'banner';
    const items = (data.items as string[] | undefined)?.filter((it) => typeof it === 'string');
    const hasText = !!(items && items.length) || !!data.description;

    const contentTop = isBanner ? 1.3 : 1.0;
    const contentBottom = 6.9;
    const boxX = 0.7;
    const boxW = 11.93;
    const imgH = hasText ? 3.6 : 5.4;
    const captionH = data.caption ? 0.35 : 0;
    const textTop = contentTop + imgH + captionH + 0.15;
    const textH = Math.max(0, contentBottom - textTop);

    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;

    if (imgPath) {
      await this.addContainedImage(slide, imgPath, boxX, contentTop, boxW, imgH);
    } else {
      this.addImagePlaceholder(slide, boxX, contentTop, boxW, imgH, data.imagePath);
    }

    if (data.caption) {
      slide.addText(data.caption, {
        x: boxX, y: contentTop + imgH + 0.05, w: boxW, h: captionH,
        fontSize: isBanner ? 12 : 11, color: this.C.textGray || this.C.medium,
        align: 'center', italic: true,
        fontFace: this.F.body, margin: 0,
      });
    }

    if (hasText && textH > 0.3) {
      if (items && items.length) {
        slide.addText(this.makeBulletItems(items), {
          x: boxX + 0.2, y: textTop, w: boxW - 0.4, h: textH,
          fontSize: items.length > 4 ? 13 : 14,
          color: this.C.dark, paraSpaceAfter: 6,
          fontFace: this.F.body, valign: 'top',
        });
      } else if (data.description) {
        slide.addText(data.description, {
          x: boxX + 0.2, y: textTop, w: boxW - 0.4, h: textH,
          fontSize: 14, color: this.C.dark,
          fontFace: this.F.body, valign: 'top',
        });
      }
    }
  }
}
