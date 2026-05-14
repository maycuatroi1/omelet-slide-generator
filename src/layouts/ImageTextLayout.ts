import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class ImageTextLayout extends BaseLayout {
  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const isBanner = this.theme.header.style === 'banner';
    const isLeft = (data.imagePosition || 'left') === 'left';
    const imgX = isLeft ? 0.5 : 6.83;
    const textX = isLeft ? 6.83 : 0.5;
    const contentY = isBanner ? 1.3 : 1.0;
    const contentH = isBanner ? 5.5 : 5.6;

    const imgPath = data.imagePath ? this.imageResolver.resolveImage(data.imagePath) : null;

    if (imgPath) {
      await this.addContainedImage(slide, imgPath, imgX, contentY, 6.0, contentH);
    } else {
      this.addImagePlaceholder(slide, imgX, contentY, 6.0, contentH, data.imagePath);
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
