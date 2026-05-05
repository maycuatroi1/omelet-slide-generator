import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';
import { CodeHighlighter } from '../services/CodeHighlighter';

export class CodeBlockLayout extends BaseLayout {
  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const isBanner = this.theme.header.style === 'banner';

    if (data.description) {
      const descY = isBanner ? 1.1 : 0.85;
      slide.addText(data.description, {
        x: isBanner ? 0.8 : 0.9, y: descY, w: 11.73, h: isBanner ? 0.5 : 0.4,
        fontSize: isBanner ? 15 : 14, color: this.C.textGray || this.C.medium, fontFace: this.F.body,
      });
    }

    const codeY = data.description ? (isBanner ? 1.7 : 1.35) : (isBanner ? 1.3 : 0.95);
    const codeH = (isBanner ? 6.9 : 6.95) - codeY - 0.6;

    this.roundedRect(slide, isBanner ? 0.6 : 0.46, codeY, 12.13, codeH, {
      fill: { color: '1E1E1E' }, rectRadius: isBanner ? 0.1 : 0.08,
    });

    if (data.language) {
      if (!isBanner) {
        this.roundedRect(slide, 0.46, codeY, 2.2, 0.37, {
          fill: { color: '2D2D2D' }, rectRadius: 0.05,
        });
        slide.addText(data.language, {
          x: 0.46, y: codeY, w: 2.2, h: 0.37,
          fontSize: 12, color: '9CDCFE', bold: true,
          fontFace: this.F.code, margin: [0, 0, 0, 8] as any, align: 'center',
        });
      } else {
        slide.addText(data.language, {
          x: 0.8, y: codeY + 0.1, w: 2.0, h: 0.35,
          fontSize: 10, color: '9CA3AF', fontFace: this.F.code, margin: 0,
        });
      }
    }

    const codeTop = data.language ? codeY + (isBanner ? 0.4 : 0.5) : codeY + 0.15;
    const codeContentH = codeH - (codeTop - codeY) - 0.15;
    const lang = data.language ? data.language.toLowerCase().replace(/\s+/g, '') : 'plaintext';

    try {
      const highlighter = CodeHighlighter.getInstance();
      const richText = await highlighter.highlight(data.code || '', lang);
      slide.addText(richText, {
        x: 0.63, y: codeTop, w: 11.73, h: codeContentH,
        valign: 'top', paraSpaceAfter: 2,
      });
    } catch {
      slide.addText(data.code || '', {
        x: isBanner ? 0.9 : 0.63, y: codeTop, w: isBanner ? 11.53 : 11.73, h: codeContentH,
        fontSize: 10.5, color: 'D4D4D4', fontFace: this.F.code,
        valign: 'top', paraSpaceAfter: 2,
      });
    }
  }
}
