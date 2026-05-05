import PptxGenJS from 'pptxgenjs';
import { ThemeConfig, ContentModule, LayoutName } from './types';
import { LayoutRegistry } from './layouts';
import { ImageResolver } from './services/ImageResolver';

export interface BuildOptions {
  noNotes?: boolean;
  contentDir?: string;
}

export class PresentationBuilder {
  private theme: ThemeConfig;
  private layoutRegistry: LayoutRegistry;

  constructor(theme: ThemeConfig, contentDir: string = '.') {
    this.theme = theme;
    const imageResolver = new ImageResolver(contentDir, theme);
    this.layoutRegistry = new LayoutRegistry(theme, imageResolver);
  }

  async build(content: ContentModule, options: BuildOptions = {}): Promise<PptxGenJS> {
    const pptx = new PptxGenJS();

    pptx.defineLayout({ name: 'WIDE', width: this.theme.slideWidth, height: this.theme.slideHeight });
    pptx.layout = 'WIDE';

    const meta = content.meta || {};
    pptx.author = meta.author || content.author || 'FPT University';
    pptx.title = meta.title || content.title || 'Presentation';
    pptx.subject = meta.subject || content.subject || '';

    if (content.courseLabel) {
      this.theme.footer.courseLabel = content.courseLabel;
    }

    const slides = content.slides || [];
    let slideNum = 0;
    let errors = 0;

    let logoPreloaded = false;

    for (const [i, data] of slides.entries()) {
      const layoutName = data.layout;

      if (!this.layoutRegistry.has(layoutName)) {
        console.error(`[WARN] Slide ${i + 1}: Unknown layout "${layoutName}", skipping`);
        errors++;
        continue;
      }

      const layout = this.layoutRegistry.get(layoutName as LayoutName)!;

      if (!logoPreloaded) {
        await layout.preloadLogo();
        logoPreloaded = true;
      }

      slideNum++;
      const slide = pptx.addSlide();

      try {
        await layout.render(slide, data, slideNum);
      } catch (err: any) {
        console.error(`[ERROR] Slide ${slideNum} (${layoutName}): ${err.message}`);
        errors++;
      }

      if (!options.noNotes && data.notes) {
        slide.addNotes(data.notes);
      }
    }

    console.log(`Built: ${slideNum} slides, ${errors} errors (theme: ${this.theme.name})`);
    return pptx;
  }
}
