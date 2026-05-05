import { createHighlighter, type HighlighterGeneric } from 'shiki';

const SUPPORTED_LANGS = [
  'python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'go',
  'rust', 'bash', 'shell', 'json', 'yaml', 'xml', 'html', 'css',
  'sql', 'ruby', 'php', 'swift', 'kotlin', 'r', 'powershell',
  'dockerfile', 'markdown', 'plaintext',
] as const;

export class CodeHighlighter {
  private static instance: CodeHighlighter;
  private highlighter: HighlighterGeneric<any, any> | null = null;

  private constructor() {}

  static getInstance(): CodeHighlighter {
    if (!CodeHighlighter.instance) {
      CodeHighlighter.instance = new CodeHighlighter();
    }
    return CodeHighlighter.instance;
  }

  private async getHighlighter(): Promise<HighlighterGeneric<any, any>> {
    if (!this.highlighter) {
      this.highlighter = await createHighlighter({
        themes: ['dark-plus'],
        langs: [...SUPPORTED_LANGS],
      });
    }
    return this.highlighter;
  }

  async highlight(code: string, lang: string): Promise<Array<{ text: string; options: Record<string, any> }>> {
    const highlighter = await this.getHighlighter();
    const loadedLangs = highlighter.getLoadedLanguages();
    const resolvedLang = loadedLangs.includes(lang) ? lang : 'plaintext';

    const tokens = highlighter.codeToTokens(code, {
      lang: resolvedLang,
      theme: 'dark-plus',
    });

    const result: Array<{ text: string; options: Record<string, any> }> = [];

    tokens.tokens.forEach((line, lineIdx) => {
      line.forEach(token => {
        const color = (token.color || '#D4D4D4').replace('#', '');
        result.push({
          text: token.content,
          options: { color, fontFace: 'Consolas', fontSize: 10.5 },
        });
      });
      if (lineIdx < tokens.tokens.length - 1) {
        result.push({ text: '\n', options: { fontFace: 'Consolas', fontSize: 10.5 } });
      }
    });

    return result;
  }
}
