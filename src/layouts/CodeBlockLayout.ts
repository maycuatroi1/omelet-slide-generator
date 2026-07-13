import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';
import { CodeHighlighter } from '../services/CodeHighlighter';

export class CodeBlockLayout extends BaseLayout {
  protected async renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): Promise<void> {
    const isBanner = this.theme.header.style === 'banner';

    if (isBanner) {
      if (data.description) {
        slide.addText(data.description, {
          x: 0.8, y: 1.1, w: 11.73, h: 0.5,
          fontSize: 15, color: this.C.textGray || this.C.medium, fontFace: this.F.body,
        });
      }
      const codeY = data.description ? 1.7 : 1.3;
      const codeH = 6.9 - codeY - 0.6;
      this.roundedRect(slide, 0.6, codeY, 12.13, codeH, { fill: { color: '1E1E1E' }, rectRadius: 0.1 });
      await this.renderCode(slide, data, 0.9, codeY + 0.2, 11.53, codeH - 0.35);
      return;
    }

    const notes = (data.items as string[] | undefined)?.filter(it => typeof it === 'string') || [];
    const takeaway = data.takeaway || data.caption;
    let top = this.CY;
    let availH = this.contentH(!!takeaway);

    if (data.description) {
      slide.addText(this.rich(data.description, { fontSize: 15, color: this.C.textGray || this.C.medium }), {
        x: this.CX, y: top, w: this.CW, h: 0.36,
        fontSize: 15, color: this.C.textGray || this.C.medium,
        fontFace: this.F.body, valign: 'middle', margin: 0,
      });
      top += 0.46;
      availH -= 0.46;
    }

    const hasNotes = notes.length > 0;
    const codeW = hasNotes ? 7.75 : this.CW;

    this.roundedRect(slide, this.CX, top, codeW, availH, {
      fill: { color: this.C.codeBg || '1E1E1E' }, rectRadius: 0.06,
    });

    let codeTop = top + 0.16;
    if (data.language) {
      slide.addText(data.language.toUpperCase(), {
        x: this.CX + 0.22, y: top + 0.1, w: 3.0, h: 0.26,
        fontSize: 10, color: '8FB8D6', bold: true, charSpacing: 1.2,
        fontFace: this.F.code, margin: 0, valign: 'middle',
      });
      codeTop = top + 0.44;
    }

    await this.renderCode(slide, data, this.CX + 0.22, codeTop, codeW - 0.44, top + availH - codeTop - 0.14);

    if (hasNotes) {
      const noteX = this.CX + codeW + 0.26;
      const noteW = this.CW - codeW - 0.26;
      this.addCard(slide, noteX, top, noteW, availH, this.C.accent);
      slide.addText('WHAT TO NOTICE', {
        x: noteX + 0.24, y: top + 0.16, w: noteW - 0.44, h: 0.3,
        fontSize: 11, bold: true, charSpacing: 1.2, color: this.C.accent,
        fontFace: this.F.body, margin: 0, valign: 'middle',
      });

      const listTop = top + 0.56;
      const listH = availH - 0.7;
      const rowH = listH / Math.max(notes.length, 1);
      const fontSize = this.fitSize(notes.length, 14, 11, 4);

      notes.forEach((note, i) => {
        const y = listTop + i * rowH;
        slide.addText(this.richLead(note, { fontSize, color: this.C.dark }, { color: this.C.primaryDark }), {
          x: noteX + 0.24, y, w: noteW - 0.44, h: rowH,
          fontSize, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body, margin: 0,
        });
        if (i < notes.length - 1) {
          slide.addShape('line', {
            x: noteX + 0.24, y: y + rowH, w: noteW - 0.44, h: 0,
            line: { color: this.C.border, width: 0.75 },
          });
        }
      });
    }

    if (takeaway) this.addTakeaway(slide, takeaway);
  }

  private async renderCode(
    slide: PptxGenJS.Slide, data: SlideData,
    x: number, y: number, w: number, h: number,
  ): Promise<void> {
    const lang = data.language ? data.language.toLowerCase().replace(/\s+/g, '') : 'plaintext';
    const valign = this.theme.header.style === 'banner' ? 'top' : 'middle';
    try {
      const highlighter = CodeHighlighter.getInstance();
      const richText = await highlighter.highlight(data.code || '', lang);
      slide.addText(richText, {
        x, y, w, h,
        valign, paraSpaceAfter: 2,
      });
    } catch {
      slide.addText(data.code || '', {
        x, y, w, h,
        fontSize: 11, color: 'D4D4D4', fontFace: this.F.code,
        valign, paraSpaceAfter: 2,
      });
    }
  }
}
