import * as path from 'path';
import * as fs from 'fs';
import sharp from 'sharp';
import { ThemeConfig } from '../types';

export interface ImageSize {
  width: number;
  height: number;
  ratio: number;
}

const sizeCache = new Map<string, ImageSize>();

export class ImageResolver {
  private contentDir: string;
  private theme: ThemeConfig;

  constructor(contentDir: string, theme: ThemeConfig) {
    this.contentDir = contentDir;
    this.theme = theme;
  }

  resolveLogo(): string | null {
    if (!this.theme.logo) return null;

    for (const p of this.theme.logo.paths) {
      const resolved = path.resolve(this.contentDir, p);
      if (fs.existsSync(resolved)) return resolved;
    }
    return null;
  }

  resolveImage(relativePath: string): string | null {
    const resolved = path.resolve(this.contentDir, relativePath);
    return fs.existsSync(resolved) ? resolved : null;
  }

  async getImageSize(filePath: string): Promise<ImageSize | null> {
    if (sizeCache.has(filePath)) return sizeCache.get(filePath)!;
    try {
      const meta = await sharp(filePath).metadata();
      if (!meta.width || !meta.height) return null;
      const size: ImageSize = {
        width: meta.width,
        height: meta.height,
        ratio: meta.width / meta.height,
      };
      sizeCache.set(filePath, size);
      return size;
    } catch {
      return null;
    }
  }

  getCachedSize(filePath: string): ImageSize | null {
    return sizeCache.get(filePath) || null;
  }

  static fitToBox(imgRatio: number, boxW: number, boxH: number): { w: number; h: number } {
    const boxRatio = boxW / boxH;
    if (imgRatio > boxRatio) {
      return { w: boxW, h: boxW / imgRatio };
    } else {
      return { w: boxH * imgRatio, h: boxH };
    }
  }
}
