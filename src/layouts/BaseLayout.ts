import PptxGenJS from 'pptxgenjs';
import { ThemeConfig, SlideData } from '../types';
import { ImageResolver } from '../services/ImageResolver';

export interface TextRun {
  text: string;
  options: Record<string, any>;
}

export abstract class BaseLayout {
  protected theme: ThemeConfig;
  protected imageResolver: ImageResolver;

  constructor(theme: ThemeConfig, imageResolver: ImageResolver) {
    this.theme = theme;
    this.imageResolver = imageResolver;
  }

  async render(slide: PptxGenJS.Slide, data: SlideData, slideNum: number): Promise<void> {
    this.addBackground(slide);
    this.addHeader(slide, data);
    await this.renderContent(slide, data, slideNum);
    if (this.showFooter(data)) {
      this.addFooter(slide, slideNum);
    }
    await this.addCornerLogo(slide);
  }

  protected addBackground(slide: PptxGenJS.Slide): void {
    if (this.theme.background) {
      slide.background = { color: this.theme.background };
    }
  }

  protected async addCornerLogo(slide: PptxGenJS.Slide): Promise<void> {
    const cfg = this.theme.cornerLogo;
    if (!cfg) return;
    const resolved = this.imageResolver.resolveImage(cfg.path);
    if (!resolved) return;
    const size = await this.imageResolver.getImageSize(resolved);
    if (size) {
      const fitted = ImageResolver.fitToBox(size.ratio, cfg.w, cfg.h);
      slide.addImage({ path: resolved, x: cfg.x, y: cfg.y, w: fitted.w, h: fitted.h });
    } else {
      slide.addImage({ path: resolved, x: cfg.x, y: cfg.y, w: cfg.w, h: cfg.h });
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
      const title = data.title || '';
      const fontSize = title.length > 52 ? header.fontSize - 4 : header.fontSize;
      slide.addText(title, {
        ...header.titlePosition,
        fontSize,
        color: colors.primaryDark,
        bold: true,
        fontFace: fonts.title,
        margin: 0,
        valign: 'middle',
      });
      const ruleY = header.titlePosition.y + header.titlePosition.h + 0.04;
      const ruleX = this.theme.content?.x ?? header.titlePosition.x;
      const ruleW = this.theme.content?.w ?? this.theme.slideWidth - ruleX - 0.5;
      slide.addShape('line', {
        x: ruleX, y: ruleY, w: ruleW, h: 0,
        line: { color: colors.border, width: 1.25 },
      });
      slide.addShape('line', {
        x: ruleX, y: ruleY, w: 0.7, h: 0,
        line: { color: colors.accent, width: 3 },
      });
    }
  }

  protected addFooter(slide: PptxGenJS.Slide, slideNum: number): void {
    const { footer, colors, fonts, slideWidth, slideHeight } = this.theme;
    const ruleY = slideHeight - 0.52;
    const textY = slideHeight - 0.5;

    if (footer.style === 'line') {
      const x = this.theme.content?.x ?? 0.2;
      slide.addShape('line', {
        x, y: ruleY, w: (this.theme.content?.w ?? slideWidth - 1.0), h: 0,
        line: { color: colors.border, width: 0.75 },
      });
      if (footer.courseLabel) {
        slide.addText(footer.courseLabel, {
          x, y: textY, w: 7.0, h: 0.32,
          fontSize: 10, color: colors.medium, align: 'left',
          fontFace: fonts.body, margin: 0,
        });
      }
      const numRight = this.theme.content ? x + this.CW : slideWidth - 0.33;
      slide.addText(`${slideNum}`, {
        x: numRight - 1.0, y: textY, w: 1.0, h: 0.32,
        fontSize: 11, color: colors.medium, align: 'right',
        fontFace: fonts.body, margin: 0,
      });
    } else {
      if (footer.courseLabel) {
        slide.addText(footer.courseLabel, {
          x: 0.6, y: textY, w: 5.0, h: 0.3,
          fontSize: 9, color: colors.medium, align: 'left',
          fontFace: fonts.body, margin: 0,
        });
      }
      slide.addText(`${slideNum}`, {
        x: slideWidth - 2.33, y: textY, w: 1.73, h: 0.3,
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

  protected async addCoverImage(
    slide: PptxGenJS.Slide,
    imgPath: string,
    boxX: number, boxY: number, boxW: number, boxH: number,
  ): Promise<void> {
    slide.addImage({
      path: imgPath, x: boxX, y: boxY, w: boxW, h: boxH,
      sizing: { type: 'cover', w: boxW, h: boxH } as any,
    });
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
        fill: { color: colors.surface || colors.white },
        line: { color: colors.boxBorder || colors.border, width: 0.75 },
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

  protected addCard(
    slide: PptxGenJS.Slide,
    x: number, y: number, w: number, h: number,
    accent?: string,
    fill?: string,
  ): void {
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: fill || this.C.surface || this.C.white },
      line: { color: this.C.boxBorder || this.C.border, width: 0.75 },
    });
    if (accent) {
      slide.addShape('rect', {
        x, y, w: 0.09, h,
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });
    }
  }

  protected addEyebrow(
    slide: PptxGenJS.Slide,
    text: string,
    x: number, y: number, w: number,
    color?: string,
  ): void {
    slide.addText(text.toUpperCase(), {
      x, y, w, h: 0.26,
      fontSize: 11, bold: true, charSpacing: 1.4,
      color: color || this.C.primary,
      fontFace: this.F.body, margin: 0, valign: 'middle',
    });
  }

  protected addTakeaway(slide: PptxGenJS.Slide, text: string, y = this.TY): void {
    const x = this.CX;
    const w = this.CW;
    const h = 0.56;
    slide.addShape('rect', {
      x, y, w, h,
      fill: { color: this.C.primaryDark },
      line: { color: this.C.primaryDark, width: 0 },
    });
    slide.addShape('rect', {
      x, y, w: 0.09, h,
      fill: { color: this.C.accent },
      line: { color: this.C.accent, width: 0 },
    });
    slide.addText(this.rich(text, { fontSize: 14, color: 'FFFFFF' }, { color: 'F2C4BE' }), {
      x: x + 0.28, y, w: w - 0.5, h,
      fontSize: 14, color: 'FFFFFF', fontFace: this.F.body,
      valign: 'middle', margin: 0,
    });
  }

  protected parseInline(text: string): Array<{ text: string; kind: 'plain' | 'bold' | 'code' }> {
    const out: Array<{ text: string; kind: 'plain' | 'bold' | 'code' }> = [];
    const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) out.push({ text: text.slice(last, m.index), kind: 'plain' });
      const tok = m[0];
      if (tok.startsWith('**')) out.push({ text: tok.slice(2, -2), kind: 'bold' });
      else out.push({ text: tok.slice(1, -1), kind: 'code' });
      last = m.index + tok.length;
    }
    if (last < text.length) out.push({ text: text.slice(last), kind: 'plain' });
    if (!out.length) out.push({ text, kind: 'plain' });
    return out;
  }

  protected rich(
    text: string,
    base: Record<string, any> = {},
    boldStyle: Record<string, any> = {},
  ): TextRun[] {
    return this.parseInline(text).map(seg => {
      if (seg.kind === 'bold') {
        return { text: seg.text, options: { ...base, bold: true, color: boldStyle.color || base.color, ...boldStyle } };
      }
      if (seg.kind === 'code') {
        return {
          text: seg.text,
          options: { ...base, fontFace: this.F.code, color: this.C.primary, bold: false },
        };
      }
      return { text: seg.text, options: { ...base } };
    });
  }

  protected makeBulletItems(items: string[]): TextRun[] {
    const runs: TextRun[] = [];
    items.forEach((item, i) => {
      const segs = this.parseInline(item);
      segs.forEach((seg, j) => {
        const first = j === 0;
        const lastSeg = j === segs.length - 1;
        const opts: Record<string, any> = {
          breakLine: lastSeg && i < items.length - 1,
        };
        if (first) opts.bullet = true;
        if (seg.kind === 'bold') {
          opts.bold = true;
          opts.color = this.C.primaryDark;
        } else if (seg.kind === 'code') {
          opts.fontFace = this.F.code;
          opts.color = this.C.primary;
        }
        runs.push({ text: seg.text, options: opts });
      });
    });
    return runs;
  }

  protected splitLead(item: string): { lead: string; rest: string } {
    const parts = item.split(' -- ');
    if (parts.length < 2) return { lead: item, rest: '' };
    return { lead: parts[0], rest: parts.slice(1).join(' -- ') };
  }

  protected richLead(
    text: string,
    base: Record<string, any> = {},
    boldStyle: Record<string, any> = {},
  ): TextRun[] {
    const { lead, rest } = this.splitLead(text);
    if (!rest) return this.rich(text, base, boldStyle);
    return [
      ...this.rich(lead, { ...base, bold: true, color: this.C.primaryDark }, { color: this.C.primaryDark }),
      { text: ' - ', options: { ...base, color: this.C.textGray || this.C.medium } },
      ...this.rich(rest, base, boldStyle),
    ];
  }

  protected estimateTextH(text: string, widthIn: number, fontSize: number, lineFactor = 1.3): number {
    const charW = (fontSize * 0.5) / 72;
    const cpl = Math.max(8, Math.floor(widthIn / charW));
    const lines = text.split('\n').reduce((acc, l) => acc + Math.max(1, Math.ceil(l.length / cpl)), 0);
    return (lines * fontSize * lineFactor) / 72;
  }

  protected estimateBoldH(text: string, widthIn: number, fontSize: number, lineFactor = 1.26): number {
    return this.estimateTextH(text, widthIn * 0.86, fontSize, lineFactor);
  }

  protected fitRows(
    items: string[],
    widthIn: number,
    availH: number,
    baseSize: number,
    minSize: number,
  ): { fontSize: number; descSize: number; rows: { y: number; h: number; leadH: number }[] } {
    const safeW = widthIn * 0.94;
    const measure = (size: number) => {
      const dSize = Math.max(minSize, size - 3);
      return items.map(it => {
        const { lead, rest } = this.splitLead(it);
        if (!rest) {
          return { leadH: 0, h: this.estimateTextH(it, safeW, size, 1.32) + 0.2 };
        }
        const leadH = this.estimateBoldH(lead, safeW, size) + 0.07;
        return { leadH, h: leadH + this.estimateTextH(rest, safeW, dSize, 1.28) + 0.22 };
      });
    };

    let fontSize = baseSize;
    let parts = measure(fontSize);
    while (fontSize > minSize && parts.reduce((a, p) => a + p.h, 0) > availH) {
      fontSize -= 1;
      parts = measure(fontSize);
    }

    const total = parts.reduce((a, p) => a + p.h, 0) || 1;
    const scale = Math.max(1, availH / total);
    let y = 0;
    const rows = parts.map(p => {
      const row = { y, h: p.h * scale, leadH: p.leadH };
      y += row.h;
      return row;
    });
    return { fontSize, descSize: Math.max(minSize, fontSize - 3), rows };
  }

  protected fitSize(count: number, base: number, min: number, comfortable: number): number {
    if (count <= comfortable) return base;
    const step = Math.ceil((count - comfortable) / 1);
    return Math.max(min, base - step);
  }

  protected makeShadow(): PptxGenJS.ShadowProps {
    return { type: 'outer', blur: 6, offset: 2, angle: 135, color: '000000', opacity: 0.15 };
  }

  protected get W(): number { return this.theme.slideWidth; }
  protected get H(): number { return this.theme.slideHeight; }
  protected get C(): ThemeConfig['colors'] { return this.theme.colors; }
  protected get F(): ThemeConfig['fonts'] { return this.theme.fonts; }

  protected get CX(): number { return this.theme.content?.x ?? 0.9; }
  protected get CY(): number { return this.theme.content?.y ?? 0.95; }
  protected get CW(): number { return this.theme.content?.w ?? 11.53; }
  protected get CB(): number { return this.theme.content?.bottom ?? 6.85; }
  protected get TY(): number { return this.theme.content?.takeawayY ?? 6.24; }
  protected contentH(hasTakeaway: boolean): number {
    return (hasTakeaway ? this.TY - 0.1 : this.CB) - this.CY;
  }
}
