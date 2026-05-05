import * as temml from 'temml';

let mml2ommlFn: ((mml: string) => string) | null = null;

function getMml2omml(): (mml: string) => string {
  if (!mml2ommlFn) {
    const mod = require('mathml2omml');
    mml2ommlFn = mod.mml2omml || mod.default || mod;
  }
  return mml2ommlFn!;
}

export class MathService {
  private static formulas: Map<string, string> = new Map();
  private static counter = 0;

  static reset(): void {
    MathService.formulas.clear();
    MathService.counter = 0;
  }

  static registerFormula(latex: string): string {
    const id = `__OMML_${MathService.counter++}__`;
    MathService.formulas.set(id, latex);
    return id;
  }

  static getFormulas(): Map<string, string> {
    return MathService.formulas;
  }

  static latexToOmml(latex: string): string {
    const mathml = temml.renderToString(latex);
    const convert = getMml2omml();
    return convert(mathml);
  }
}
