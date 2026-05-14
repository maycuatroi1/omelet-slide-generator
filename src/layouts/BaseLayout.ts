import PptxGenJS from 'pptxgenjs';
import { ThemeConfig, SlideData } from '../types';
import { ImageResolver } from '../services/ImageResolver';

export abstract class BaseLayout {
  protected theme: ThemeConfig;
  protected imageResolver: ImageResolver;

  constructor(theme: ThemeConfig, imageResolver: ImageResolver) {
    this.theme = theme;
    this.imageResolver = imageResolver;
  }

  async render(slide: PptxGenJS.Slide, data: SlideData, slideNum: number): Promise<void> {
    this.addHeader(slide, data);
    await this.renderContent(slide, data, slideNum);
    if (this.showFooter(data)) {
      this.addFooter(slide, slideNum);
    }
  }

  protected abstract renderContent(slide: PptxGenJS.Slide, data: SlideData, slideNum: number): Promise<void> | void;

  protected showFooter(_data: SlideData): boolean {
    return true;
  }

  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const { header, colors, fonts } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', {
        x: 0, y: 0, w: this.theme.slideWidth, h: 1.0,
        fill: { color: colors.primary },
      });
      slide.addText(data.title || '', {
        ...header.titlePosition,
        fontSize: header.fontSize,
        color: colors.white,
        bold: true,
        fontFace: fonts.title,
        margin: 0,
      });
    } else {
      this.addLogo(slide, true);
      slide.addText(data.title || '', {
        ...header.titlePosition,
        fontSize: header.fontSize,
        color: colors.dark,
        bold: true,
        fontFace: fonts.title,
        margin: 0,
      });
    }
  }

  protected addFooter(slide: PptxGenJS.Slide, slideNum: number): void {
    const { footer, colors, fonts, slideWidth } = this.theme;

    if (footer.style === 'line') {
      slide.addShape('line', {
        x: 0.2, y: 6.95, w: slideWidth - 1.0, h: 0,
        line: { color: colors.border, width: 0.75 },
      });
      slide.addText(`${slideNum}`, {
        x: slideWidth - 1.33, y: 6.95, w: 1.0, h: 0.4,
        fontSize: 12, color: colors.medium, align: 'right',
        fontFace: fonts.body, margin: 0,
      });
    } else {
      if (footer.courseLabel) {
        slide.addText(footer.courseLabel, {
          x: 0.6, y: 7.0, w: 5.0, h: 0.3,
          fontSize: 9, color: colors.medium, align: 'left',
          fontFace: fonts.body, margin: 0,
        });
      }
      slide.addText(`${slideNum}`, {
        x: 11.0, y: 7.0, w: 1.73, h: 0.3,
        fontSize: 9, color: colors.medium, align: 'right',
        fontFace: fonts.body, margin: 0,
      });
    }
  }

  protected addLogo(slide: PptxGenJS.Slide, small: boolean): void {
    const logo = this.imageResolver.resolveLogo();
    if (!logo || !this.theme.logo) return;

    const dims = small ? this.theme.logo.small : this.theme.logo.large;
    const logoSize = this.imageResolver.getCachedSize(logo);
    if (logoSize) {
      const fitted = ImageResolver.fitToBox(logoSize.ratio, dims.w, dims.h);
      slide.addImage({ path: logo, x: dims.x, y: dims.y, w: fitted.w, h: fitted.h });
    } else {
      slide.addImage({ path: logo, ...dims });
    }
  }

  async preloadLogo(): Promise<void> {
    const logo = this.imageResolver.resolveLogo();
    if (logo) await this.imageResolver.getImageSize(logo);
  }

  protected async addContainedImage(
    slide: PptxGenJS.Slide,
    imgPath: string,
    boxX: number, boxY: number, boxW: number, boxH: number,
  ): Promise<void> {
    const size = await this.imageResolver.getImageSize(imgPath);
    if (!size) {
      slide.addImage({ path: imgPath, x: boxX, y: boxY, w: boxW, h: boxH });
      return;
    }
    const fitted = ImageResolver.fitToBox(size.ratio, boxW, boxH);
    const x = boxX + (boxW - fitted.w) / 2;
    const y = boxY + (boxH - fitted.h) / 2;
    slide.addImage({ path: imgPath, x, y, w: fitted.w, h: fitted.h });
  }

  protected addImagePlaceholder(
    slide: PptxGenJS.Slide,
    x: number, y: number, w: number, h: number,
    imagePath?: string,
    fontSize = 14,
  ): void {
    const isBanner = this.theme.header.style === 'banner';
    if (isBanner) {
      this.roundedRect(slide, x, y, w, h, {
        fill: { color: this.C.light }, rectRadius: 0.1,
        line: { color: this.C.border, width: 1, dashType: 'dash' },
      });
    } else {
      this.addBox(slide, x, y, w, h);
    }
    slide.addText(`[Image: ${imagePath || 'not specified'}]`, {
      x, y: y + h / 2 - 0.3, w, h: 0.6,
      fontSize: isBanner ? fontSize + 2 : fontSize,
      color: this.C.medium, align: 'center',
      fontFace: this.F.body,
    });
  }

  protected roundedRect(
    slide: PptxGenJS.Slide,
    x: number, y: number, w: number, h: number,
    opts: Record<string, any> = {},
  ): void {
    const { rectRadius, ...rest } = opts;
    if (rectRadius) {
      slide.addShape('roundRect' as any, { x, y, w, h, rectRadius, ...rest });
    } else {
      slide.addShape('rect', { x, y, w, h, ...rest });
    }
  }

  protected addBox(
    slide: PptxGenJS.Slide,
    x: number, y: number, w: number, h: number,
  ): void {
    const { colors, boxStyle } = this.theme;

    if (boxStyle === 'semi-transparent') {
      slide.addShape('rect', {
        x, y, w, h,
        fill: { color: colors.white, transparency: 63 },
        line: { color: colors.boxBorder || colors.border, width: 0.5 },
      });
    } else if (boxStyle === 'bordered') {
      slide.addShape('rect', {
        x, y, w, h,
        fill: { type: 'none' },
        line: { color: colors.boxBorder || colors.border, width: 0.75 },
      });
    } else {
      slide.addShape('rect', {
        x, y, w, h,
        fill: { color: colors.light },
      });
    }
  }

  protected makeBulletItems(items: string[]): Array<{ text: string; options: { bullet: boolean; breakLine: boolean } }> {
    return items.map((item, i) => ({
      text: item,
      options: { bullet: true, breakLine: i < items.length - 1 },
    }));
  }

  protected makeShadow(): PptxGenJS.ShadowProps {
    return { type: 'outer', blur: 6, offset: 2, angle: 135, color: '000000', opacity: 0.15 };
  }

  protected get W(): number { return this.theme.slideWidth; }
  protected get H(): number { return this.theme.slideHeight; }
  protected get C(): ThemeConfig['colors'] { return this.theme.colors; }
  protected get F(): ThemeConfig['fonts'] { return this.theme.fonts; }
}
