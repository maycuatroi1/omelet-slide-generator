import PptxGenJS from 'pptxgenjs';
import { SlideData } from '../types';
import { BaseLayout } from './BaseLayout';
import { MathService } from '../services/MathService';

interface FormulaItem {
  label?: string;
  latex: string;
}

export class MathLayout extends BaseLayout {
  protected renderContent(slide: PptxGenJS.Slide, data: SlideData, _slideNum: number): void {
    const isBanner = this.theme.header.style === 'banner';
    const startY = isBanner ? 1.4 : 1.1;
    const formulas = (data.formulas || []) as FormulaItem[];
    const description = data.description as string | undefined;
    const variables = (data.variables || []) as string[];

    let currentY = startY + 0.1;

    const hasVars = variables.length > 0;
    const hasDesc = !!description;
    const formulaEndY = hasVars ? 4.0 : (hasDesc ? 5.0 : 6.0);
    const formulaH = Math.min(1.0, (formulaEndY - currentY) / formulas.length - 0.3);

    const latexNotes: string[] = [];

    for (const item of formulas) {
      if (item.label) {
        slide.addText(item.label, {
          x: 1.0, y: currentY, w: 11.33, h: 0.4,
          fontSize: 14, color: this.C.primary, bold: true,
          fontFace: this.F.body, margin: 0,
        });
        currentY += 0.4;
        latexNotes.push(`${item.label}:`);
      }

      const placeholder = MathService.registerFormula(item.latex);
      latexNotes.push(`$${item.latex}$`);
      latexNotes.push('');

      slide.addShape('rect', {
        x: 1.5, y: currentY, w: 10.33, h: formulaH,
        fill: { color: this.C.white },
        line: { color: this.C.border, width: 0.75 },
      });

      slide.addText(placeholder, {
        x: 1.5, y: currentY, w: 10.33, h: formulaH,
        fontSize: 18, color: this.C.dark, align: 'center', valign: 'middle',
        fontFace: 'Cambria Math', margin: 0,
      });

      currentY += formulaH + 0.2;
    }

    if (latexNotes.length > 0) {
      slide.addNotes(latexNotes.join('\n'));
    }

    if (hasVars) {
      const varStartY = Math.max(currentY + 0.1, formulaEndY);
      const varBoxH = hasDesc ? 2.0 : 6.7 - varStartY;

      this.addBox(slide, 0.9, varStartY, 11.53, varBoxH);

      slide.addText('Where:', {
        x: 1.2, y: varStartY + 0.1, w: 2.0, h: 0.35,
        fontSize: 13, color: this.C.primary, bold: true,
        fontFace: this.F.body, margin: 0,
      });

      const cols = variables.length > 4 ? 2 : 1;
      const colW = cols === 2 ? 5.5 : 11.0;
      const perCol = Math.ceil(variables.length / cols);
      const spacing = Math.min(0.4, (varBoxH - 0.5) / perCol);

      variables.forEach((v, i) => {
        const col = Math.floor(i / perCol);
        const row = i % perCol;
        const vx = 1.3 + col * colW;
        const vy = varStartY + 0.45 + row * spacing;
        slide.addText(v, {
          x: vx, y: vy, w: colW - 0.2, h: spacing,
          fontSize: 12, color: this.C.dark, valign: 'middle',
          fontFace: this.F.body, bullet: true,
        });
      });

      if (hasDesc) {
        const descY = varStartY + varBoxH + 0.15;
        slide.addText(description!, {
          x: 1.0, y: descY, w: 11.33, h: 6.7 - descY,
          fontSize: 14, color: this.C.textGray || this.C.medium,
          fontFace: this.F.body, italic: true,
        });
      }
    } else if (hasDesc) {
      slide.addText(description!, {
        x: 1.0, y: currentY + 0.1, w: 11.33, h: 6.7 - currentY - 0.2,
        fontSize: 14, color: this.C.textGray || this.C.medium,
        fontFace: this.F.body, italic: true,
      });
    }
  }
}
