#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import { PresentationBuilder } from './PresentationBuilder';
import { getTheme } from './themes';
import { MathService } from './services/MathService';
import { MathPostProcessor } from './services/MathPostProcessor';

const USAGE = `omelet-slide — generate .pptx from a TypeScript/JavaScript content file

Usage:
  omelet-slide <content-file> <output.pptx> [options]

Options:
  --theme=<name>     Theme: n8n | minimalism | midnight (default: n8n)
  --no-notes         Build student variant (omit speaker notes)
  -h, --help         Show this help

Examples:
  omelet-slide slides/index.ts deck.pptx
  omelet-slide slides/index.ts deck.pptx --theme=minimalism
  omelet-slide slides/index.ts student.pptx --theme=midnight --no-notes
`;

function loadContent(contentPath: string): any {
  const ext = path.extname(contentPath).toLowerCase();
  if (ext === '.ts' || ext === '.tsx' || ext === '.mts' || ext === '.cts') {
    const { createJiti } = require('jiti');
    const jiti = createJiti(__filename, { interopDefault: true });
    return jiti(contentPath);
  }
  const mod = require(contentPath);
  return mod.default || mod;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    console.log(USAGE);
    process.exit(args.length === 0 ? 1 : 0);
  }

  const flags = args.filter(a => a.startsWith('--'));
  const positional = args.filter(a => !a.startsWith('--'));

  const noNotes = flags.includes('--no-notes');
  const themeName = flags.find(f => f.startsWith('--theme='))?.split('=')[1] || 'n8n';

  if (positional.length < 2) {
    console.error(USAGE);
    process.exit(1);
  }

  const contentPath = path.resolve(positional[0]);
  const outputPath = path.resolve(positional[1]);

  if (!fs.existsSync(contentPath)) {
    console.error(`Content file not found: ${contentPath}`);
    process.exit(1);
  }

  let content;
  try {
    content = loadContent(contentPath);
  } catch (err: any) {
    console.error(`Failed to load content file: ${contentPath}`);
    console.error(err.message);
    process.exit(1);
  }

  const contentDir = path.dirname(contentPath);
  process.env.CONTENT_DIR = contentDir;

  MathService.reset();

  const theme = getTheme(themeName);
  const builder = new PresentationBuilder(theme, contentDir);
  const pptx = await builder.build(content, { noNotes, contentDir });

  await pptx.writeFile({ fileName: outputPath });

  const mathCount = await MathPostProcessor.process(outputPath);
  if (mathCount > 0) {
    console.log(`Injected ${mathCount} native OMML formula(s)`);
  }

  const variant = noNotes ? 'student' : 'instructor';
  console.log(`Generated [${variant}]: ${outputPath}`);
}

main().catch(err => {
  console.error(`Failed: ${err.message}`);
  process.exit(1);
});
