import * as fs from 'fs';
import JSZip from 'jszip';
import { SlideTransition, ThemeConfig } from '../types';

const EMU = 914400;
const ROW_TOLERANCE = 0.12 * EMU;
const CONTAIN_TOLERANCE = 0.03 * EMU;
const MAX_STEPS = 6;
const STEP_DELAY_MS = 280;
const FADE_MS = 450;

export interface SlideMotion {
  transition: SlideTransition;
  animate: boolean;
}

interface ShapeBox {
  id: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  hasText: boolean;
}

const TRANSITIONS: Record<Exclude<SlideTransition, 'none'>, string> = {
  fade: '<p:fade/>',
  push: '<p:push dir="u"/>',
  wipe: '<p:wipe dir="r"/>',
};

export class MotionPostProcessor {
  static async process(filePath: string, motion: SlideMotion[], theme: ThemeConfig): Promise<{ transitions: number; animated: number }> {
    const result = { transitions: 0, animated: 0 };
    if (!motion.some(m => m.transition !== 'none' || m.animate)) return result;

    const zip = await JSZip.loadAsync(fs.readFileSync(filePath));
    const top = (theme.content?.y ?? 1.0) * EMU - CONTAIN_TOLERANCE;
    const bottom = (theme.content?.bottom ?? theme.slideHeight - 0.6) * EMU;
    const fullW = theme.slideWidth * EMU * 0.95;
    const fullH = theme.slideHeight * EMU * 0.9;

    for (const [i, m] of motion.entries()) {
      const name = `ppt/slides/slide${i + 1}.xml`;
      const file = zip.file(name);
      if (!file) continue;
      let xml = await file.async('string');
      let modified = false;

      if (m.animate && !xml.includes('<p:timing')) {
        const shapes = this.readShapes(xml).filter(s =>
          s.y >= top && s.y < bottom && !(s.cx >= fullW && s.cy >= fullH));
        if (shapes.length > 0) {
          xml = this.insertBeforeExt(xml, this.timingXml(this.group(shapes)));
          modified = true;
          result.animated++;
        }
      }

      if (m.transition !== 'none' && !xml.includes('<p:transition')) {
        const transition = `<p:transition spd="med">${TRANSITIONS[m.transition]}</p:transition>`;
        xml = xml.includes('<p:timing')
          ? xml.replace('<p:timing', `${transition}<p:timing`)
          : this.insertBeforeExt(xml, transition);
        modified = true;
        result.transitions++;
      }

      if (modified) zip.file(name, xml);
    }

    if (result.transitions > 0 || result.animated > 0) {
      fs.writeFileSync(filePath, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
    }
    return result;
  }

  private static insertBeforeExt(xml: string, fragment: string): string {
    if (xml.includes('<p:extLst>') && xml.lastIndexOf('<p:extLst>') > xml.lastIndexOf('</p:cSld>')) {
      const at = xml.lastIndexOf('<p:extLst>');
      return xml.slice(0, at) + fragment + xml.slice(at);
    }
    return xml.replace('</p:sld>', `${fragment}</p:sld>`);
  }

  private static readShapes(xml: string): ShapeBox[] {
    const tree = xml.match(/<p:spTree>([\s\S]*)<\/p:spTree>/);
    if (!tree) return [];
    const shapes: ShapeBox[] = [];
    const pattern = /<p:(sp|pic)>([\s\S]*?)<\/p:\1>/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(tree[1])) !== null) {
      const body = match[2];
      const id = body.match(/<p:cNvPr[^>]*\bid="(\d+)"/);
      const off = body.match(/<a:off x="(-?\d+)" y="(-?\d+)"\s*\/>/);
      const ext = body.match(/<a:ext cx="(\d+)" cy="(\d+)"\s*\/>/);
      if (!id || !off || !ext) continue;
      shapes.push({
        id: Number(id[1]),
        x: Number(off[1]),
        y: Number(off[2]),
        cx: Number(ext[1]),
        cy: Number(ext[2]),
        hasText: match[1] === 'sp' && /<a:t>[^<]/.test(body),
      });
    }
    return shapes;
  }

  private static group(shapes: ShapeBox[]): ShapeBox[][] {
    const sorted = [...shapes].sort((a, b) => a.y - b.y || b.cx * b.cy - a.cx * a.cy || a.x - b.x);
    const groups: ShapeBox[][] = [];
    for (const s of sorted) {
      const inside = groups.find(g => g.some(o =>
        s.x >= o.x - CONTAIN_TOLERANCE && s.y >= o.y - CONTAIN_TOLERANCE &&
        s.x + s.cx <= o.x + o.cx + CONTAIN_TOLERANCE && s.y + s.cy <= o.y + o.cy + CONTAIN_TOLERANCE));
      const row = inside ?? groups.find(g => Math.abs(g[0].y - s.y) <= ROW_TOLERANCE);
      if (row) row.push(s);
      else groups.push([s]);
    }
    while (groups.length > MAX_STEPS) {
      const last = groups.pop()!;
      groups[groups.length - 1].push(...last);
    }
    return groups;
  }

  private static timingXml(groups: ShapeBox[][]): string {
    let id = 5;
    const effects: string[] = [];
    const builds: string[] = [];
    groups.forEach((group, step) => {
      for (const s of group) {
        const node = effects.length === 0 ? 'afterEffect' : 'withEffect';
        effects.push(
          `<p:par><p:cTn id="${id++}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" grpId="0" nodeType="${node}">` +
          `<p:stCondLst><p:cond delay="${step * STEP_DELAY_MS}"/></p:stCondLst><p:childTnLst>` +
          `<p:set><p:cBhvr><p:cTn id="${id++}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>` +
          `<p:tgtEl><p:spTgt spid="${s.id}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>` +
          `<p:to><p:strVal val="visible"/></p:to></p:set>` +
          `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${id++}" dur="${FADE_MS}"/>` +
          `<p:tgtEl><p:spTgt spid="${s.id}"/></p:tgtEl></p:cBhvr></p:animEffect>` +
          `</p:childTnLst></p:cTn></p:par>`);
        if (s.hasText) builds.push(`<p:bldP spid="${s.id}" grpId="0" animBg="1"/>`);
      }
    });
    const bldLst = builds.length > 0 ? `<p:bldLst>${builds.join('')}</p:bldLst>` : '';
    return '<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>' +
      '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>' +
      '<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>' +
      '<p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>' +
      effects.join('') +
      '</p:childTnLst></p:cTn></p:par>' +
      '</p:childTnLst></p:cTn></p:par>' +
      '</p:childTnLst></p:cTn>' +
      '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>' +
      '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>' +
      '</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>' +
      bldLst +
      '</p:timing>';
  }
}
