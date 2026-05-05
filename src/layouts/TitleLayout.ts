import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';

export class TitleLayout extends BaseLayout {
  protected addHeader(_slide: PptxGenJS.Slide, _data: SlideData): void {}
  protected showFooter(): boolean { return false; }

  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const { header } = this.theme;

    if (header.style === 'banner') {
      slide.addShape('rect', { x: 0, y: 0, w: this.W, h: this.H, fill: { color: this.C.primary } });
      slide.addShape('rect', { x: 0, y: 5.5, w: this.W, h: 2.0, fill: { color: this.C.primaryDark } });
      slide.addText(data.title || '', {
        x: 1.0, y: 1.5, w: 11.33, h: 2.0,
        fontSize: 40, color: this.C.white, bold: true, align: 'center',
        fontFace: this.F.title, margin: 0,
      });
      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1.5, y: 3.6, w: 10.33, h: 1.0,
          fontSize: 22, color: this.C.primaryLight || 'BFDBFE', align: 'center',
          fontFace: this.F.body,
        });
      }
      if (data.author) {
        slide.addText(data.author, {
          x: 1.5, y: 5.8, w: 10.33, h: 0.5,
          fontSize: 16, color: this.C.primaryLight || 'BFDBFE', align: 'center',
          fontFace: this.F.body,
        });
      }
      if (data.date) {
        slide.addText(data.date, {
          x: 1.5, y: 6.3, w: 10.33, h: 0.5,
          fontSize: 14, color: this.C.secondary, align: 'center',
          fontFace: this.F.body,
        });
      }
    } else {
      slide.addText(data.title || '', {
        x: 1.67, y: 1.23, w: 10.0, h: 2.61,
        fontSize: 44, color: '000000', bold: false, align: 'center', valign: 'bottom',
        fontFace: this.F.title, margin: 0,
      });
      if (data.subtitle) {
        slide.addText(data.subtitle, {
          x: 1.67, y: 3.94, w: 10.0, h: 1.81,
          fontSize: 24, color: '000000', align: 'center', valign: 'top',
          fontFace: this.F.body,
        });
      }
      if (data.author) {
        slide.addText(data.author, {
          x: 1.67, y: 5.5, w: 10.0, h: 0.5,
          fontSize: 16, color: this.C.medium, align: 'center',
          fontFace: this.F.body,
        });
      }
      if (data.date) {
        slide.addText(data.date, {
          x: 1.67, y: 6.0, w: 10.0, h: 0.5,
          fontSize: 14, color: this.C.medium, align: 'center',
          fontFace: this.F.body,
        });
      }
      this.addFooter(slide, 1);
    }
  }
}
