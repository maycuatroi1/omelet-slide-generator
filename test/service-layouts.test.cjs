const test = require('node:test');
const assert = require('node:assert/strict');
const JSZip = require('jszip');
const { PresentationBuilder, getTheme, LayoutRegistry, ImageResolver } = require('../dist');

const service = {
  outcome: 'Resolve a recurring issue with evidence', audience: 'Service owner and delivery team',
  problem: 'Requests arrive in several channels and lack a shared owner.',
  sources: ['Messages', 'Tickets', 'Change history'],
  steps: [
    { title: 'Collect', desc: 'Link evidence to the request.' },
    { title: 'Confirm', desc: 'Let the owner confirm priority.' },
    { title: 'Act', desc: 'Deliver an approved change.' },
    { title: 'Verify', desc: 'Check whether the issue recurs.' },
  ],
  deliverables: [
    { title: 'Evidence register', desc: 'Sources and unresolved questions.' },
    { title: 'Action backlog', desc: 'Owners and acceptance criteria.' },
    { title: 'Outcome report', desc: 'Baseline and actual results.' },
  ],
  metrics: [
    { label: 'Reopen rate', detail: 'Reopened / closed tickets' },
    { label: 'Handoff time', detail: 'P50 hours' },
    { label: 'Repeat incidents', detail: 'Per 100 tickets' },
  ],
  boundary: 'A bounded pilot, not a guaranteed result.',
};
const lanes = [
  { label: 'Inputs', subtitle: 'Authorized sources', items: [
    { title: 'Messages', desc: 'Requests and commitments' },
    { title: 'Records', desc: 'Tickets and invoices' },
    { title: 'Context', desc: 'Docs and changes' },
  ] },
  { label: 'Process', emphasis: true, items: [
    { title: 'Evidence', desc: 'Keep source and time' },
    { title: 'Decision', desc: 'Confirm with the owner' },
    { title: 'Execution', desc: 'Act within scope' },
  ] },
  { label: 'Outputs', items: [
    { title: 'Record', desc: 'Updated issue history' },
    { title: 'Result', desc: 'Verified acceptance' },
    { title: 'Measurement', desc: 'Cost and quality' },
  ] },
];

for (const name of ['n8n', 'minimalism', 'midnight', 'mono', 'fpt-mono']) {
  test(`native service and layered layouts fit ${name}`, async () => {
    const theme = structuredClone(getTheme(name));
    delete theme.logo;
    const deck = await new PresentationBuilder(theme).build({ slides: [
      { layout: 'serviceOffering', title: 'Service brief', service },
      { layout: 'layeredFlow', title: 'Layers', description: 'Evidence-driven work', lanes, takeaway: 'Review the outcome.' },
    ] });
    const zip = await JSZip.loadAsync(await deck.write({ outputType: 'nodebuffer' }));
    for (let i = 1; i <= 2; i++) {
      const xml = await zip.file(`ppt/slides/slide${i}.xml`).async('string');
      assert.equal(xml.includes('<p:pic>'), false, 'content stays editable, not rasterized');
      for (const match of xml.matchAll(/<a:off x="(-?\d+)" y="(-?\d+)"\s*\/>\s*<a:ext cx="(-?\d+)" cy="(-?\d+)"\s*\/>/g)) {
        const [x,y,w,h] = match.slice(1).map(Number);
        assert.ok(x >= 0 && y >= 0 && w >= 0 && h >= 0);
        assert.ok(x+w <= theme.slideWidth*914400+2);
        assert.ok(y+h <= theme.slideHeight*914400+2);
      }
      assert.ok(xml.includes('txBox="1"'));
    }
    const xml = await zip.file('ppt/slides/slide1.xml').async('string');
    for (const value of [...service.sources, ...service.steps.map(s=>s.title),
      ...service.deliverables.map(s=>s.title), ...service.metrics.map(s=>s.detail)]) assert.ok(xml.includes(value), value);
  });
}

test('rejects missing or oversized data instead of silently truncating', async () => {
  const theme = getTheme('fpt-mono');
  const registry = new LayoutRegistry(theme, new ImageResolver('.', theme));
  const PptxGenJS = require('pptxgenjs');
  const deck = new PptxGenJS();
  await assert.rejects(registry.get('serviceOffering').render(deck.addSlide(), { layout: 'serviceOffering' }, 1), /requires service/);
  await assert.rejects(registry.get('serviceOffering').render(deck.addSlide(), {
    layout: 'serviceOffering', service: {...service, sources: Array(5).fill('source')},
  }, 1), /sources needs/);
  await assert.rejects(registry.get('layeredFlow').render(deck.addSlide(), { layout: 'layeredFlow', lanes: [] }, 1), /2-4 lanes/);
  await assert.rejects(registry.get('layeredFlow').render(deck.addSlide(), {
    layout: 'layeredFlow', lanes: [{label:'bad',items:[]},lanes[0]],
  }, 1), /1-4 items/);
});
