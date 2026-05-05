import * as fs from 'fs';
import * as path from 'path';
import JSZip from 'jszip';
import { MathService } from './MathService';

const MC_NS = 'http://schemas.openxmlformats.org/markup-compatibility/2006';
const A14_NS = 'http://schemas.microsoft.com/office/drawing/2010/main';
const M_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/math';

export class MathPostProcessor {
  static async process(filePath: string): Promise<number> {
    const formulas = MathService.getFormulas();
    if (formulas.size === 0) return 0;

    const zipData = fs.readFileSync(filePath);
    const zip = await JSZip.loadAsync(zipData);

    let replacements = 0;

    for (const [filename, file] of Object.entries(zip.files)) {
      if (!filename.match(/ppt\/slides\/slide\d+\.xml$/)) continue;

      let xml = await file.async('string');
      let modified = false;

      for (const [placeholder, latex] of formulas) {
        if (!xml.includes(placeholder)) continue;

        const omml = MathService.latexToOmml(latex);
        const ommlContent = omml
          .replace(/ xmlns:m="[^"]*"/g, '')
          .replace(/ xmlns:w="[^"]*"/g, '')
          .replace(/<w:rPr\s*\/>/g, '')
          .replace(/<w:rPr>[\s\S]*?<\/w:rPr>/g, '')
          .replace(/<m:sty m:val="undefined"\/>/g, '')
          .replace(/<m:mcs>[\s\S]*?<\/m:mcs>/g, '');

        const mathParagraph =
          `<a:p><a14:m><m:oMathPara><m:oMathParaPr><m:jc m:val="center"/></m:oMathParaPr>${ommlContent}</m:oMathPara></a14:m></a:p>`;

        const esc = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const placeholderPattern = new RegExp(
          `<a:p(?=>|\\s)[^>]*>(?:(?!<\\/a:p>)[\\s\\S])*${esc}(?:(?!<\\/a:p>)[\\s\\S])*<\\/a:p>`,
        );

        if (placeholderPattern.test(xml)) {
          xml = xml.replace(placeholderPattern, mathParagraph);
          modified = true;
          replacements++;
        }
      }

      if (modified) {
        if (!xml.includes('xmlns:mc=')) {
          xml = xml.replace(
            /(<p:sld\b)/,
            `$1 xmlns:mc="${MC_NS}" mc:Ignorable="a14"`,
          );
        }
        if (!xml.includes('xmlns:a14=')) {
          xml = xml.replace(
            /(<p:sld\b)/,
            `$1 xmlns:a14="${A14_NS}"`,
          );
        }
        if (!xml.includes('xmlns:m=')) {
          xml = xml.replace(
            /(<p:sld\b)/,
            `$1 xmlns:m="${M_NS}"`,
          );
        }

        zip.file(filename, xml);
      }
    }

    if (replacements > 0) {
      const output = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      fs.writeFileSync(filePath, output);
    }

    return replacements;
  }
}
