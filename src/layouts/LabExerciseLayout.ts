import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class LabExerciseLayout extends BaseLayout {
  protected addHeader(slide: PptxGenJS.Slide, data: SlideData): void {
    const { header, colors, fonts } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: 1.2, fill: { color: colors.purple || colors.primary } });
      slide.addText('HANDS-ON LAB', {
        x: 0.5, y: 0.0, w: 4.0, h: 0.5,
        fontSize: 12, color: colors.purpleLight || colors.light, bold: true,
        fontFace: fonts.body, margin: 0,
      });
      slide.addText(data.title || '', {
        x: 0.5, y: 0.35, w: 10.0, h: 0.7,
        fontSize: 24, color: colors.white, bold: true,
        fontFace: fonts.title, margin: 0,
      });
      if (data.duration) {
        slide.addText(data.duration, {
          x: 10.5, y: 0.35, w: 2.5, h: 0.7,
          fontSize: 16, color: colors.purpleLight || colors.light, align: 'right', valign: 'middle',
          fontFace: fonts.body,
        });
      }
    } else {
      this.addLogo(slide, true);
      slide.addText(data.title || '', {
        ...header.titlePosition,
        fontSize: header.fontSize,
        color: colors.dark, bold: true,
        fontFace: fonts.title, margin: 0,
      });
      if (data.duration) {
        slide.addText(data.duration, {
          x: 10.5, y: 0.18, w: 2.5, h: 0.56,
          fontSize: 16, color: colors.textGray || colors.medium, align: 'right', valign: 'middle',
          fontFace: fonts.body,
        });
      }
    }
  }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const steps = (data.steps || []) as string[];
    const verify = data.verify || [];
    const isBanner = this.theme.header.style === 'banner';
    const labColor = this.C.purple || this.C.primary;

    const contentTop = isBanner ? 1.4 : 1.0;
    const footerBottom = 6.85;
    const availableH = footerBottom - contentTop;
    const labelH = 0.3;
    const gapBetweenSections = 0.15;
    const boxPadTop = 0.05;
    const boxPadBot = 0.1;

    const totalItems = steps.length + verify.length;
    const fixedSpace = labelH * 2 + gapBetweenSections + boxPadTop * 2 + boxPadBot * 2;
    const itemH = Math.min(0.5, (availableH - fixedSpace) / totalItems);
    const fontSize = itemH < 0.4 ? 12 : 14;
    const checkFontSize = itemH < 0.4 ? 11 : 13;

    const stepsBoxY = contentTop;
    const stepsBoxH = boxPadTop + labelH + steps.length * itemH + boxPadBot;

    if (!isBanner) {
      this.addBox(slide, this.CX, stepsBoxY, this.CW, stepsBoxH);
    }

    const stepsLabelY = stepsBoxY + boxPadTop;
    slide.addText('Steps:', {
      x: isBanner ? 0.8 : 1.1, y: stepsLabelY, w: 3.0, h: labelH,
      fontSize: 14, color: labColor, bold: true,
      fontFace: this.F.body, margin: 0,
    });

    steps.forEach((step, i) => {
      const y = stepsLabelY + labelH + i * itemH;
      const circleSize = Math.min(0.3, itemH * 0.65);
      const circleX = isBanner ? 0.9 : 1.1;
      const circleOffsetY = (itemH - circleSize) / 2;

      slide.addShape('ellipse', {
        x: circleX, y: y + circleOffsetY, w: circleSize, h: circleSize,
        fill: { color: labColor },
      });
      slide.addText(`${i + 1}`, {
        x: circleX, y: y + circleOffsetY, w: circleSize, h: circleSize,
        fontSize: Math.min(10, circleSize * 30), color: this.C.white, bold: true,
        align: 'center', valign: 'middle',
        fontFace: this.F.body, margin: 0,
      });
      slide.addText(step, {
        x: isBanner ? 1.4 : 1.55, y, w: isBanner ? 7.5 : 10.5, h: itemH,
        fontSize, color: this.C.dark, valign: 'middle',
        fontFace: this.F.body,
      });
    });

    if (verify.length) {
      const verifyBoxY = stepsBoxY + stepsBoxH + gapBetweenSections;
      const verifyBoxH = boxPadTop + labelH + verify.length * itemH + boxPadBot;

      if (!isBanner) {
        this.addBox(slide, this.CX, verifyBoxY, this.CW, verifyBoxH);
      }

      const verifyLabelY = verifyBoxY + boxPadTop;
      slide.addText('Verify:', {
        x: isBanner ? 0.8 : 1.1, y: verifyLabelY, w: 3.0, h: labelH,
        fontSize: 14, color: this.C.secondary, bold: true,
        fontFace: this.F.body, margin: 0,
      });

      verify.forEach((v, i) => {
        const y = verifyLabelY + labelH + i * itemH;
        slide.addText([
          { text: '\u2610  ', options: { fontSize: checkFontSize + 2 } },
          { text: v, options: { fontSize: checkFontSize } },
        ], {
          x: isBanner ? 1.0 : 1.2, y, w: isBanner ? 8.0 : 10.5, h: itemH,
          color: this.C.dark, fontFace: this.F.body, valign: 'middle',
        });
      });
    }
  }
}
