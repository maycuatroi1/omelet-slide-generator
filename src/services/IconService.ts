import PptxGenJS from 'pptxgenjs';
import * as lucide from 'lucide-static';
import sharp from 'sharp';

const ICON_MAP: Record<string, string> = {
  check: 'Check',
  shield: 'Shield',
  lock: 'Lock',
  data: 'Database',
  database: 'Database',
  code: 'Code',
  search: 'Search',
  eye: 'Eye',
  car: 'Car',
  email: 'Mail',
  mail: 'Mail',
  package: 'Package',
  home: 'Home',
  medical: 'HeartPulse',
  finance: 'BarChart3',
  monitor: 'Monitor',
  hand: 'Hand',
  globe: 'Globe',
  cpu: 'Cpu',
  brain: 'Brain',
  bug: 'Bug',
  target: 'Target',
  alert: 'AlertTriangle',
  warning: 'AlertTriangle',
  clock: 'Clock',
  time: 'Clock',
  zap: 'Zap',
  lightning: 'Zap',
  file: 'FileText',
  document: 'FileText',
  users: 'Users',
  people: 'Users',
  server: 'Server',
  key: 'Key',
  fingerprint: 'Fingerprint',
  scan: 'Scan',
  network: 'Network',
  bot: 'Bot',
  robot: 'Bot',
  workflow: 'Workflow',
  book: 'BookOpen',
  chart: 'BarChart3',
  star: 'Star',
  settings: 'Settings',
  tool: 'Wrench',
  link: 'Link',
  cloud: 'Cloud',
  download: 'Download',
  upload: 'Upload',
  play: 'Play',
  pause: 'Pause',
  refresh: 'RefreshCw',
  trash: 'Trash2',
  plus: 'Plus',
  minus: 'Minus',
  info: 'Info',
  help: 'HelpCircle',
  layers: 'Layers',
  filter: 'Filter',
  terminal: 'Terminal',
  shield_check: 'ShieldCheck',
  lock_open: 'LockOpen',
  clipboard: 'ClipboardList',
  list: 'List',
  activity: 'Activity',
};

const pngCache = new Map<string, string>();

async function getIconPng(iconName: string, color: string): Promise<string | null> {
  const cacheKey = `${iconName}:${color}`;
  if (pngCache.has(cacheKey)) return pngCache.get(cacheKey)!;

  const lucideName = ICON_MAP[iconName] || iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const svg = (lucide as any)[lucideName] as string | undefined;
  if (!svg) return null;

  const colored = svg
    .replace(/stroke="currentColor"/g, `stroke="#${color}"`)
    .replace(/width="24"/, 'width="96"')
    .replace(/height="24"/, 'height="96"');

  const pngBuffer = await sharp(Buffer.from(colored)).resize(96, 96).png().toBuffer();
  const base64 = `image/png;base64,${pngBuffer.toString('base64')}`;
  pngCache.set(cacheKey, base64);
  return base64;
}

export class IconService {
  static async drawIcon(
    slide: PptxGenJS.Slide,
    name: string,
    x: number,
    y: number,
    size: number,
    bgColor: string,
  ): Promise<void> {
    slide.addShape('ellipse', {
      x, y, w: size, h: size,
      fill: { color: bgColor },
    });

    const key = name.replace(/[\[\]]/g, '').toLowerCase().trim();
    const padding = size * 0.22;
    const iconSize = size - 2 * padding;
    const data = await getIconPng(key, 'FFFFFF');

    if (data) {
      slide.addImage({
        data,
        x: x + padding,
        y: y + padding,
        w: iconSize,
        h: iconSize,
      });
    } else {
      const letter = key.charAt(0).toUpperCase();
      slide.addText(letter, {
        x, y, w: size, h: size,
        fontSize: Math.round(size * 28), color: 'FFFFFF', bold: true,
        align: 'center', valign: 'middle', fontFace: 'Arial', margin: 0,
      });
    }
  }
}
