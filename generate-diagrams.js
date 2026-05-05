const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.resolve(__dirname, '../../teaching-n8n/slides/diagrams');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 700;

function box(x, y, w, h, fill, stroke, text, fontSize = 16, textColor = '#fff') {
  const rx = 8;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + h / 2 + fontSize / 3}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${fontSize}" fill="${textColor}" font-weight="bold">${text}</text>
  `;
}

function arrow(x1, y1, x2, y2, color = '#6B7280') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.5" marker-end="url(#arrowhead-${color.replace('#', '')})"/>`;
}

function arrowDef(color = '#6B7280') {
  const id = color.replace('#', '');
  return `<marker id="arrowhead-${id}" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${color}"/></marker>`;
}

function label(x, y, text, size = 14, color = '#374151') {
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" fill="${color}">${text}</text>`;
}

function titleBar(text) {
  return `
    <rect x="0" y="0" width="${W}" height="50" fill="#1E40AF"/>
    <text x="20" y="33" font-family="Arial,sans-serif" font-size="22" fill="#fff" font-weight="bold">${text}</text>
  `;
}

function wrap(content, extraDefs = '') {
  const defaultDefs = [arrowDef('#6B7280'), arrowDef('#1E40AF'), arrowDef('#059669'), arrowDef('#DC2626'), arrowDef('#6D28D9')];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>${defaultDefs.join('')}${extraDefs}</defs>
    <rect width="${W}" height="${H}" fill="#FFFFFF"/>
    ${content}
  </svg>`;
}

async function saveSvg(name, svgContent) {
  const outPath = path.join(OUT, name);
  await sharp(Buffer.from(svgContent)).png().toFile(outPath);
  console.log(`  Created: ${name}`);
}

async function generate() {
  console.log('Generating diagrams...\n');

  // 1. n8n-architecture.png
  await saveSvg('n8n-architecture.png', wrap(`
    ${titleBar('n8n Basic Architecture')}
    ${box(450, 75, 300, 55, '#1E40AF', '#1E3A8A', 'Editor UI (Browser)', 16)}
    ${arrow(600, 130, 600, 165, '#1E40AF')}

    ${box(200, 165, 200, 50, '#059669', '#047857', 'REST API', 15)}
    ${box(500, 165, 200, 50, '#059669', '#047857', 'Webhooks', 15)}
    ${box(800, 165, 200, 50, '#059669', '#047857', 'Triggers', 15)}

    ${arrow(300, 215, 300, 275, '#059669')}
    ${arrow(600, 215, 600, 275, '#059669')}
    ${arrow(900, 215, 900, 275, '#059669')}

    ${box(200, 275, 800, 120, '#6D28D9', '#5B21B6', '', 20)}
    <text x="600" y="300" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#fff" font-weight="bold">Workflow Engine</text>

    ${box(230, 315, 200, 50, '#7C3AED', '#6D28D9', 'Trigger Handler', 13)}
    ${arrow(430, 340, 490, 340, '#DBEAFE')}
    ${box(490, 315, 200, 50, '#7C3AED', '#6D28D9', 'Node Executor', 13)}
    ${arrow(690, 340, 750, 340, '#DBEAFE')}
    ${box(750, 315, 220, 50, '#7C3AED', '#6D28D9', 'Data Transformer', 13)}

    ${arrow(600, 395, 600, 450, '#6D28D9')}
    ${box(380, 450, 440, 60, '#DC2626', '#B91C1C', 'Database (PostgreSQL / SQLite)', 16)}
    ${label(600, 600, 'SQLite for development | PostgreSQL for production', 13, '#6B7280')}
    ${label(600, 630, 'All components run in a single Node.js process', 12, '#9CA3AF')}
  `));

  // 2. n8n-components.png
  await saveSvg('n8n-components.png', wrap(`
    ${titleBar('n8n Component Details')}
    ${box(50, 80, 220, 140, '#DBEAFE', '#1E40AF', '', 14, '#1E40AF')}
    <text x="160" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#1E40AF" font-weight="bold">Editor UI</text>
    <text x="160" y="145" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Drag &amp; drop interface</text>
    <text x="160" y="165" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Runs in browser</text>
    <text x="160" y="185" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Vue.js frontend</text>

    ${box(310, 80, 220, 140, '#D1FAE5', '#059669', '', 14, '#059669')}
    <text x="420" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#059669" font-weight="bold">REST API</text>
    <text x="420" y="145" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Manage workflows</text>
    <text x="420" y="165" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Programmatic access</text>
    <text x="420" y="185" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">CRUD operations</text>

    ${box(570, 80, 220, 140, '#EDE9FE', '#6D28D9', '', 14, '#6D28D9')}
    <text x="680" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#6D28D9" font-weight="bold">Webhooks</text>
    <text x="680" y="145" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Receive external data</text>
    <text x="680" y="165" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">HTTP endpoints</text>
    <text x="680" y="185" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Event-driven triggers</text>

    ${box(830, 80, 220, 140, '#FEE2E2', '#DC2626', '', 14, '#DC2626')}
    <text x="940" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#DC2626" font-weight="bold">Triggers</text>
    <text x="940" y="145" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Schedule (cron)</text>
    <text x="940" y="165" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">MQTT, Email, etc.</text>
    <text x="940" y="185" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Polling &amp; push</text>

    ${arrow(160, 220, 400, 280, '#1E40AF')}
    ${arrow(420, 220, 500, 280, '#059669')}
    ${arrow(680, 220, 600, 280, '#6D28D9')}
    ${arrow(940, 220, 700, 280, '#DC2626')}

    ${box(300, 280, 500, 80, '#1F2937', '#111827', 'Workflow Engine', 22)}
    <text x="550" y="340" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#9CA3AF">Trigger → Execute → Transform → Output</text>

    ${arrow(550, 360, 550, 420, '#1E40AF')}

    ${box(50, 420, 300, 80, '#FFF7ED', '#EA580C', '', 14, '#EA580C')}
    <text x="200" y="455" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#EA580C" font-weight="bold">Credential Store</text>
    <text x="200" y="478" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">AES-256 encrypted (with key)</text>

    ${box(400, 420, 300, 80, '#DBEAFE', '#1E40AF', '', 14, '#1E40AF')}
    <text x="550" y="455" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#1E40AF" font-weight="bold">PostgreSQL</text>
    <text x="550" y="478" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Workflows, executions, credentials</text>

    ${box(750, 420, 300, 80, '#D1FAE5', '#059669', '', 14, '#059669')}
    <text x="900" y="455" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#059669" font-weight="bold">Redis (Queue Mode)</text>
    <text x="900" y="478" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#374151">Job queue for workers</text>

    ${arrow(550, 360, 200, 420, '#1E40AF')}
    ${arrow(550, 360, 900, 420, '#059669')}
  `));

  // 3. queue-mode.png
  await saveSvg('queue-mode.png', wrap(`
    ${titleBar('Queue Mode Architecture')}
    ${box(50, 100, 200, 60, '#DBEAFE', '#1E40AF', 'Webhooks / UI', 16, '#1E40AF')}
    ${arrow(250, 130, 330, 130, '#1E40AF')}
    ${box(330, 85, 250, 90, '#1E40AF', '#1E3A8A', 'Main Process', 18)}
    <text x="455" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#93C5FD">Handles routing only</text>
    ${arrow(580, 130, 670, 130, '#059669')}
    ${box(670, 85, 200, 90, '#DC2626', '#B91C1C', 'Redis Queue', 18)}
    <text x="770" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#FCA5A5">Message broker</text>

    ${arrow(870, 105, 960, 105, '#6D28D9')}
    ${arrow(870, 130, 960, 170, '#6D28D9')}
    ${arrow(870, 155, 960, 235, '#6D28D9')}

    ${box(960, 80, 200, 50, '#059669', '#047857', 'Worker 1', 16)}
    ${box(960, 150, 200, 50, '#059669', '#047857', 'Worker 2', 16)}
    ${box(960, 220, 200, 50, '#059669', '#047857', 'Worker N', 16)}

    ${arrow(455, 175, 455, 320, '#1E40AF')}
    ${arrow(1060, 130, 1060, 320, '#059669')}
    ${arrow(1060, 200, 1060, 320, '#059669')}

    ${box(350, 320, 350, 60, '#6D28D9', '#5B21B6', 'PostgreSQL Database', 16)}
    ${box(750, 320, 350, 60, '#6D28D9', '#5B21B6', 'Execution Results', 16)}
    ${arrow(700, 350, 750, 350, '#6D28D9')}

    ${label(600, 440, 'Scale by adding more workers', 16, '#059669')}
    ${label(600, 470, 'Recommended: 5+ concurrency per worker', 14, '#6B7280')}

    ${box(100, 500, 250, 55, '#D1FAE5', '#059669', '', 12, '#059669')}
    <text x="225" y="520" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#059669" font-weight="bold">Horizontal Scaling</text>
    <text x="225" y="540" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#374151">Add workers as needed</text>

    ${box(400, 500, 250, 55, '#DBEAFE', '#1E40AF', '', 12, '#1E40AF')}
    <text x="525" y="520" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#1E40AF" font-weight="bold">High Availability</text>
    <text x="525" y="540" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#374151">Multi-main with leader election</text>

    ${box(700, 500, 250, 55, '#EDE9FE', '#6D28D9', '', 12, '#6D28D9')}
    <text x="825" y="520" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#6D28D9" font-weight="bold">Monitoring</text>
    <text x="825" y="540" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#374151">Prometheus + Grafana</text>
  `));

  // 4. n8n-scaling.png
  await saveSvg('n8n-scaling.png', wrap(`
    ${titleBar('n8n Scaling Architecture')}
    ${box(50, 90, 180, 50, '#1E40AF', '#1E3A8A', 'Load Balancer', 14)}
    ${arrow(230, 115, 300, 95, '#1E40AF')}
    ${arrow(230, 115, 300, 155, '#1E40AF')}
    ${box(300, 70, 200, 50, '#059669', '#047857', 'Main Instance 1', 13)}
    ${box(300, 140, 200, 50, '#059669', '#047857', 'Main Instance 2', 13)}
    ${label(400, 210, '(Leader Election)', 12, '#6B7280')}
    ${arrow(500, 95, 580, 160, '#059669')}
    ${arrow(500, 165, 580, 160, '#059669')}
    ${box(580, 130, 180, 60, '#DC2626', '#B91C1C', 'Redis', 18)}
    <text x="670" y="175" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FCA5A5">Job Queue</text>
    ${arrow(760, 140, 860, 100, '#DC2626')}
    ${arrow(760, 160, 860, 180, '#DC2626')}
    ${arrow(760, 175, 860, 260, '#DC2626')}
    ${arrow(760, 185, 860, 340, '#DC2626')}
    ${box(860, 75, 180, 50, '#6D28D9', '#5B21B6', 'Worker 1', 14)}
    ${box(860, 155, 180, 50, '#6D28D9', '#5B21B6', 'Worker 2', 14)}
    ${box(860, 235, 180, 50, '#6D28D9', '#5B21B6', 'Worker 3', 14)}
    ${box(860, 315, 180, 50, '#6D28D9', '#5B21B6', 'Worker N', 14)}
    ${arrow(400, 190, 400, 420, '#1E40AF')}
    ${arrow(950, 365, 950, 420, '#6D28D9')}
    ${box(300, 420, 400, 60, '#1F2937', '#111827', 'PostgreSQL (Shared)', 16)}
    ${arrow(700, 450, 750, 450, '#1E40AF')}
    ${box(750, 420, 300, 60, '#FFF7ED', '#EA580C', '', 14)}
    <text x="900" y="445" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#EA580C" font-weight="bold">Prometheus + Grafana</text>
    <text x="900" y="465" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#374151">Metrics &amp; Monitoring</text>
    ${label(600, 540, 'All instances share PostgreSQL for state | Redis for job distribution', 13, '#6B7280')}
    ${label(600, 565, 'Scale workers independently based on workload', 13, '#9CA3AF')}
  `));

  // 5. data-flow.png
  await saveSvg('data-flow.png', wrap(`
    ${titleBar('Data Flow Between Nodes')}
    ${box(50, 100, 180, 70, '#059669', '#047857', 'Trigger Node', 15)}
    <text x="140" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#D1FAE5">Starts workflow</text>
    ${arrow(230, 135, 300, 135, '#059669')}

    <text x="265" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#6B7280">[items]</text>

    ${box(300, 100, 180, 70, '#1E40AF', '#1E3A8A', 'HTTP Request', 15)}
    <text x="390" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#93C5FD">Fetch data</text>
    ${arrow(480, 135, 550, 135, '#1E40AF')}

    <text x="515" y="120" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#6B7280">[items]</text>

    ${box(550, 100, 180, 70, '#6D28D9', '#5B21B6', 'IF Node', 15)}
    <text x="640" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#EDE9FE">Branch logic</text>

    ${arrow(730, 110, 810, 90, '#059669')}
    ${arrow(730, 155, 810, 190, '#DC2626')}

    <text x="770" y="85" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#059669">TRUE</text>
    <text x="770" y="200" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#DC2626">FALSE</text>

    ${box(810, 65, 180, 55, '#059669', '#047857', 'Slack Alert', 14)}
    ${box(810, 170, 180, 55, '#1E40AF', '#1E3A8A', 'PostgreSQL Log', 14)}

    <rect x="50" y="280" width="950" height="150" rx="8" fill="#F3F4F6" stroke="#E5E7EB" stroke-width="1"/>
    <text x="70" y="310" font-family="Arial,sans-serif" font-size="15" fill="#1E40AF" font-weight="bold">Data Structure: Array of Items</text>
    <rect x="70" y="325" width="900" height="90" rx="5" fill="#1E1E1E"/>
    <text x="85" y="348" font-family="Courier New,monospace" font-size="12" fill="#D4D4D4">[</text>
    <text x="95" y="368" font-family="Courier New,monospace" font-size="12" fill="#D4D4D4">  { "json": { "name": "Machine A", "temp": 72 }, "binary": {} },</text>
    <text x="95" y="388" font-family="Courier New,monospace" font-size="12" fill="#D4D4D4">  { "json": { "name": "Machine B", "temp": 45 }, "binary": {} }</text>
    <text x="85" y="408" font-family="Courier New,monospace" font-size="12" fill="#D4D4D4">]</text>

    ${label(525, 480, 'Each node receives items → processes → outputs items', 14, '#6B7280')}
    ${label(525, 505, 'Execution order: top to bottom, left to right (since n8n 1.0+)', 13, '#9CA3AF')}
  `));

  // 6. mqtt-architecture.png
  await saveSvg('mqtt-architecture.png', wrap(`
    ${titleBar('MQTT Industrial Architecture')}
    ${box(30, 90, 150, 60, '#1F2937', '#111827', 'Machine 1', 14)}
    ${box(30, 170, 150, 60, '#1F2937', '#111827', 'Machine 2', 14)}
    ${box(30, 250, 150, 60, '#1F2937', '#111827', 'Machine N', 14)}
    <text x="105" y="140" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#9CA3AF">CNC-001</text>
    <text x="105" y="220" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#9CA3AF">CNC-002</text>
    <text x="105" y="300" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#9CA3AF">Sensor N</text>

    ${arrow(180, 120, 300, 190, '#059669')}
    ${arrow(180, 200, 300, 200, '#059669')}
    ${arrow(180, 280, 300, 210, '#059669')}
    <text x="240" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#059669">MQTT Publish</text>

    ${box(300, 150, 200, 100, '#DC2626', '#B91C1C', 'MQTT Broker', 18)}
    <text x="400" y="230" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FCA5A5">Mosquitto / EMQX</text>

    ${arrow(500, 200, 600, 200, '#1E40AF')}
    <text x="550" y="185" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#1E40AF">Subscribe</text>

    ${box(600, 140, 220, 120, '#1E40AF', '#1E3A8A', '', 18)}
    <text x="710" y="180" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#fff" font-weight="bold">n8n</text>
    <text x="710" y="205" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#93C5FD">MQTT Trigger</text>
    <text x="710" y="225" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#93C5FD">Process &amp; Route</text>
    <text x="710" y="245" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#93C5FD">AI Analysis</text>

    ${arrow(820, 160, 920, 110, '#6D28D9')}
    ${arrow(820, 200, 920, 200, '#6D28D9')}
    ${arrow(820, 240, 920, 290, '#6D28D9')}

    ${box(920, 80, 230, 60, '#6D28D9', '#5B21B6', 'PostgreSQL', 15)}
    <text x="1035" y="130" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#EDE9FE">Store sensor data</text>

    ${box(920, 170, 230, 60, '#059669', '#047857', 'Slack / Email', 15)}
    <text x="1035" y="220" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#D1FAE5">Alert notifications</text>

    ${box(920, 260, 230, 60, '#EA580C', '#C2410C', 'Dashboard', 15)}
    <text x="1035" y="310" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FFF7ED">Grafana / Custom UI</text>

    <rect x="30" y="380" width="1120" height="70" rx="8" fill="#F3F4F6" stroke="#E5E7EB"/>
    <text x="590" y="410" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#374151" font-weight="bold">MQTT Topics: factory/line1/machine001/temperature | factory/+/+/alerts | factory/#</text>
    <text x="590" y="435" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#6B7280">QoS 0: fire &amp; forget | QoS 1: at least once | QoS 2: exactly once</text>
  `));

  // 7. ai-agent.png
  await saveSvg('ai-agent.png', wrap(`
    ${titleBar('AI Agent Architecture')}
    ${box(100, 90, 200, 60, '#DBEAFE', '#1E40AF', 'User Input', 16, '#1E40AF')}
    ${arrow(200, 150, 200, 200, '#1E40AF')}

    ${box(50, 200, 300, 200, '#1E40AF', '#1E3A8A', '', 18)}
    <text x="200" y="235" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#fff" font-weight="bold">AI Agent</text>
    <rect x="70" y="250" width="260" height="45" rx="5" fill="#2563EB"/>
    <text x="200" y="280" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#fff">Reasoning Loop</text>
    <rect x="70" y="305" width="260" height="35" rx="5" fill="#3B82F6"/>
    <text x="200" y="328" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#fff">Plan → Execute → Observe → Repeat</text>
    <rect x="70" y="350" width="260" height="35" rx="5" fill="#60A5FA"/>
    <text x="200" y="373" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#1E3A8A">Until task complete</text>

    ${arrow(350, 250, 500, 130, '#059669')}
    ${arrow(350, 300, 500, 300, '#DC2626')}
    ${arrow(350, 350, 500, 450, '#6D28D9')}

    ${box(500, 80, 280, 100, '#059669', '#047857', '', 16)}
    <text x="640" y="115" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#fff" font-weight="bold">Brain (LLM)</text>
    <text x="640" y="140" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#D1FAE5">GPT-4o / Claude / Ollama</text>
    <text x="640" y="160" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#D1FAE5">Reasoning &amp; decisions</text>

    ${box(500, 240, 280, 120, '#DC2626', '#B91C1C', '', 16)}
    <text x="640" y="275" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#fff" font-weight="bold">Tools (Abilities)</text>
    <text x="640" y="300" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#FCA5A5">HTTP Request Tool</text>
    <text x="640" y="320" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#FCA5A5">Code Tool / Calculator</text>
    <text x="640" y="340" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#FCA5A5">Vector Store Tool (RAG)</text>

    ${box(500, 410, 280, 90, '#6D28D9', '#5B21B6', '', 16)}
    <text x="640" y="445" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#fff" font-weight="bold">Memory (Context)</text>
    <text x="640" y="470" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#EDE9FE">Window Buffer / Vector Store</text>
    <text x="640" y="490" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#EDE9FE">Conversation history</text>

    ${arrow(200, 400, 200, 540, '#1E40AF')}
    ${box(100, 540, 200, 50, '#D1FAE5', '#059669', 'Response', 16, '#059669')}

    ${label(600, 570, 'Agent = Brain + Tools + Memory', 16, '#374151')}
    ${label(600, 595, 'Tools Agent (n8n v1.82.0+): unified agent architecture', 13, '#6B7280')}
  `));

  // 8. ai-agent-flow.png
  await saveSvg('ai-agent-flow.png', wrap(`
    ${titleBar('AI Agent Reasoning Flow')}
    ${box(500, 80, 200, 50, '#DBEAFE', '#1E40AF', 'User Input', 16, '#1E40AF')}
    ${arrow(600, 130, 600, 180, '#1E40AF')}

    ${box(450, 180, 300, 60, '#1E40AF', '#1E3A8A', 'LLM Reasoning', 18)}
    <text x="600" y="225" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#93C5FD">Analyze input + context</text>

    ${arrow(600, 240, 600, 290, '#1E40AF')}

    ${box(420, 290, 360, 50, '#6D28D9', '#5B21B6', 'Select Tool (or respond)', 16)}

    ${arrow(500, 340, 300, 390, '#DC2626')}
    ${arrow(700, 340, 900, 390, '#059669')}

    <text x="380" y="375" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#DC2626">Need tool</text>
    <text x="820" y="375" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#059669">Ready to respond</text>

    ${box(150, 390, 300, 60, '#DC2626', '#B91C1C', 'Execute Tool', 18)}
    <text x="300" y="435" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FCA5A5">HTTP, Code, DB, etc.</text>

    ${arrow(300, 450, 300, 500, '#DC2626')}

    ${box(150, 500, 300, 50, '#FEE2E2', '#DC2626', 'Get Tool Result', 16, '#DC2626')}

    <path d="M 150,525 L 80,525 L 80,210 L 450,210" stroke="#6D28D9" stroke-width="2.5" fill="none" marker-end="url(#arrowhead-6D28D9)"/>
    <text x="80" y="375" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#6D28D9" transform="rotate(-90, 80, 375)">Loop back with result</text>

    ${box(800, 390, 250, 60, '#059669', '#047857', 'Generate Response', 16)}
    ${arrow(925, 450, 925, 510, '#059669')}
    ${box(800, 510, 250, 50, '#D1FAE5', '#059669', 'Return to User', 16, '#059669')}

    ${label(600, 620, 'Agent loops: Reason → Tool → Observe → Reason until task complete', 14, '#6B7280')}
  `));

  // 9. rag-architecture.png
  await saveSvg('rag-architecture.png', wrap(`
    ${titleBar('RAG (Retrieval-Augmented Generation) Architecture')}

    <text x="300" y="90" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#1E40AF" font-weight="bold">Phase 1: INGEST</text>
    ${box(50, 110, 150, 50, '#DBEAFE', '#1E40AF', 'Documents', 14, '#1E40AF')}
    <text x="125" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#6B7280">PDFs, docs, KB</text>
    ${arrow(200, 135, 260, 135, '#1E40AF')}
    ${box(260, 110, 150, 50, '#1E40AF', '#1E3A8A', 'Chunk', 14)}
    <text x="335" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#93C5FD">500 tokens each</text>
    ${arrow(410, 135, 470, 135, '#1E40AF')}
    ${box(470, 110, 150, 50, '#6D28D9', '#5B21B6', 'Embed', 14)}
    <text x="545" y="150" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#EDE9FE">Text → Vectors</text>
    ${arrow(620, 135, 680, 135, '#6D28D9')}

    ${box(680, 90, 200, 90, '#DC2626', '#B91C1C', 'Vector Store', 16)}
    <text x="780" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FCA5A5">Qdrant / Pinecone</text>
    <text x="780" y="173" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FCA5A5">pgvector</text>

    <line x1="50" y1="230" x2="950" y2="230" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="8,4"/>

    <text x="300" y="270" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#059669" font-weight="bold">Phase 2: QUERY</text>

    ${box(50, 290, 150, 50, '#D1FAE5', '#059669', 'Question', 14, '#059669')}
    <text x="125" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#6B7280">User query</text>
    ${arrow(200, 315, 260, 315, '#059669')}
    ${box(260, 290, 150, 50, '#6D28D9', '#5B21B6', 'Embed', 14)}
    <text x="335" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#EDE9FE">Query → Vector</text>
    ${arrow(410, 315, 470, 315, '#6D28D9')}
    ${box(470, 290, 150, 50, '#DC2626', '#B91C1C', 'Search', 14)}
    <text x="545" y="330" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#FCA5A5">Top-K similar</text>
    ${arrow(620, 315, 680, 315, '#DC2626')}

    ${arrow(780, 180, 780, 290, '#DC2626')}

    ${box(680, 290, 200, 50, '#059669', '#047857', 'Relevant Docs', 14)}

    ${arrow(780, 340, 780, 390, '#059669')}
    ${arrow(125, 340, 125, 420, '#059669')}
    ${arrow(125, 420, 600, 420, '#059669')}

    ${box(600, 390, 360, 70, '#1E40AF', '#1E3A8A', '', 16)}
    <text x="780" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#fff" font-weight="bold">LLM</text>
    <text x="780" y="445" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#93C5FD">Context (docs) + Question → Answer</text>

    ${arrow(780, 460, 780, 510, '#1E40AF')}
    ${box(650, 510, 260, 50, '#D1FAE5', '#059669', 'Grounded Answer', 16, '#059669')}

    ${label(480, 610, 'RAG solves: LLM does not know your private data → give it relevant context before answering', 13, '#6B7280')}
  `));

  // 10. agentic-rag.png
  await saveSvg('agentic-rag.png', wrap(`
    ${titleBar('Agentic RAG: Multi-Source Intelligence')}
    ${box(450, 80, 300, 60, '#DBEAFE', '#1E40AF', 'User Question', 18, '#1E40AF')}
    ${arrow(600, 140, 600, 200, '#1E40AF')}

    ${box(400, 200, 400, 80, '#1E40AF', '#1E3A8A', 'AI Agent (Router)', 20)}
    <text x="600" y="260" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#93C5FD">Decides which sources to query</text>

    ${arrow(500, 280, 150, 350, '#DC2626')}
    ${arrow(600, 280, 600, 350, '#6D28D9')}
    ${arrow(700, 280, 1050, 350, '#059669')}

    ${box(50, 350, 200, 100, '#DC2626', '#B91C1C', '', 14)}
    <text x="150" y="385" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#fff" font-weight="bold">SQL Database</text>
    <text x="150" y="410" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FCA5A5">Structured data</text>
    <text x="150" y="430" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FCA5A5">Tables, metrics, KPIs</text>

    ${box(500, 350, 200, 100, '#6D28D9', '#5B21B6', '', 14)}
    <text x="600" y="385" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#fff" font-weight="bold">Vector Store</text>
    <text x="600" y="410" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#EDE9FE">Documents, manuals</text>
    <text x="600" y="430" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#EDE9FE">Semantic search</text>

    ${box(950, 350, 200, 100, '#059669', '#047857', '', 14)}
    <text x="1050" y="385" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#fff" font-weight="bold">Web Search</text>
    <text x="1050" y="410" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#D1FAE5">Real-time info</text>
    <text x="1050" y="430" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#D1FAE5">Latest updates</text>

    ${arrow(150, 450, 500, 520, '#DC2626')}
    ${arrow(600, 450, 600, 510, '#6D28D9')}
    ${arrow(1050, 450, 700, 520, '#059669')}

    ${box(400, 510, 400, 70, '#1E40AF', '#1E3A8A', '', 16)}
    <text x="600" y="540" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#fff" font-weight="bold">LLM Synthesis</text>
    <text x="600" y="565" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#93C5FD">Combine all sources → comprehensive answer</text>

    ${arrow(600, 580, 600, 620, '#1E40AF')}
    ${box(450, 620, 300, 45, '#D1FAE5', '#059669', 'Comprehensive Answer', 16, '#059669')}
  `));

  // 11. mcp-integration.png
  await saveSvg('mcp-integration.png', wrap(`
    ${titleBar('MCP (Model Context Protocol) Integration')}

    <text x="300" y="95" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#6D28D9" font-weight="bold">n8n as MCP Server</text>
    ${box(50, 110, 180, 55, '#DBEAFE', '#1E40AF', 'Claude Desktop', 13, '#1E40AF')}
    ${box(50, 185, 180, 55, '#DBEAFE', '#1E40AF', 'Cursor IDE', 13, '#1E40AF')}
    ${box(50, 260, 180, 55, '#DBEAFE', '#1E40AF', 'Other AI Tools', 13, '#1E40AF')}

    ${arrow(230, 137, 380, 180, '#6D28D9')}
    ${arrow(230, 212, 380, 200, '#6D28D9')}
    ${arrow(230, 287, 380, 220, '#6D28D9')}

    <text x="300" y="180" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#6D28D9">MCP Protocol</text>

    ${box(380, 140, 240, 120, '#6D28D9', '#5B21B6', '', 14)}
    <text x="500" y="175" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#fff" font-weight="bold">n8n</text>
    <text x="500" y="200" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#EDE9FE">MCP Server Trigger</text>
    <text x="500" y="220" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#EDE9FE">Exposes workflows</text>
    <text x="500" y="240" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#EDE9FE">as AI tools</text>

    <line x1="30" y1="350" x2="650" y2="350" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="8,4"/>

    <text x="300" y="385" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#059669" font-weight="bold">n8n as MCP Client</text>

    ${box(380, 400, 240, 120, '#059669', '#047857', '', 14)}
    <text x="500" y="435" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#fff" font-weight="bold">n8n</text>
    <text x="500" y="460" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#D1FAE5">MCP Client Tool</text>
    <text x="500" y="480" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#D1FAE5">Consumes external</text>
    <text x="500" y="500" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#D1FAE5">MCP servers</text>

    ${arrow(620, 440, 740, 410, '#059669')}
    ${arrow(620, 460, 740, 470, '#059669')}
    ${arrow(620, 480, 740, 530, '#059669')}

    ${box(740, 390, 200, 40, '#1E40AF', '#1E3A8A', 'GitHub MCP', 12)}
    ${box(740, 450, 200, 40, '#DC2626', '#B91C1C', 'Slack MCP', 12)}
    ${box(740, 510, 200, 40, '#6D28D9', '#5B21B6', 'Database MCP', 12)}

    ${box(730, 100, 380, 100, '#F3F4F6', '#E5E7EB', '', 12)}
    <text x="920" y="130" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#374151" font-weight="bold">MCP = USB-C for AI</text>
    <text x="920" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#6B7280">One standard protocol</text>
    <text x="920" y="175" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#6B7280">connects any AI to any tool</text>
    <text x="920" y="195" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#9CA3AF">By Anthropic</text>
  `));

  // 12. webhook-security.png
  await saveSvg('webhook-security.png', wrap(`
    ${titleBar('Webhook Security Architecture')}
    ${box(50, 100, 180, 60, '#1F2937', '#111827', 'External Client', 14)}
    ${arrow(230, 130, 310, 130, '#DC2626')}

    ${box(310, 80, 160, 100, '#059669', '#047857', '', 14)}
    <text x="390" y="115" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#fff" font-weight="bold">Layer 1</text>
    <text x="390" y="135" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#D1FAE5">SSL/TLS</text>
    <text x="390" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#D1FAE5">HTTPS encryption</text>
    ${arrow(470, 130, 530, 130, '#059669')}

    ${box(530, 80, 160, 100, '#1E40AF', '#1E3A8A', '', 14)}
    <text x="610" y="115" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#fff" font-weight="bold">Layer 2</text>
    <text x="610" y="135" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#93C5FD">Rate Limiting</text>
    <text x="610" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#93C5FD">10 req/s per IP</text>
    ${arrow(690, 130, 750, 130, '#1E40AF')}

    ${box(750, 80, 160, 100, '#DC2626', '#B91C1C', '', 14)}
    <text x="830" y="115" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#fff" font-weight="bold">Layer 3</text>
    <text x="830" y="135" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#FCA5A5">Authentication</text>
    <text x="830" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#FCA5A5">Header/HMAC/JWT</text>
    ${arrow(910, 130, 970, 130, '#DC2626')}

    ${box(970, 80, 160, 100, '#6D28D9', '#5B21B6', '', 14)}
    <text x="1050" y="115" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" fill="#fff" font-weight="bold">Layer 4</text>
    <text x="1050" y="135" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#EDE9FE">Validation</text>
    <text x="1050" y="155" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#EDE9FE">Input sanitize</text>

    ${arrow(1050, 180, 1050, 240, '#6D28D9')}
    ${box(920, 240, 280, 60, '#059669', '#047857', 'n8n Workflow Processing', 15)}

    <rect x="50" y="340" width="500" height="200" rx="8" fill="#F3F4F6" stroke="#E5E7EB"/>
    <text x="70" y="370" font-family="Arial,sans-serif" font-size="15" fill="#DC2626" font-weight="bold">Authentication Methods</text>
    <text x="70" y="400" font-family="Arial,sans-serif" font-size="13" fill="#374151">● Header Auth — custom token in X-Webhook-Secret</text>
    <text x="70" y="425" font-family="Arial,sans-serif" font-size="13" fill="#374151">● Basic Auth — username:password (legacy)</text>
    <text x="70" y="450" font-family="Arial,sans-serif" font-size="13" fill="#374151">● JWT — signed token from identity provider</text>
    <text x="70" y="475" font-family="Arial,sans-serif" font-size="13" fill="#374151">● HMAC — cryptographic signature (Stripe, GitHub)</text>
    <text x="70" y="505" font-family="Arial,sans-serif" font-size="12" fill="#DC2626" font-weight="bold">HMAC = strongest for payment webhooks</text>

    <rect x="600" y="340" width="500" height="200" rx="8" fill="#F3F4F6" stroke="#E5E7EB"/>
    <text x="620" y="370" font-family="Arial,sans-serif" font-size="15" fill="#1E40AF" font-weight="bold">Network Security</text>
    <text x="620" y="400" font-family="Arial,sans-serif" font-size="13" fill="#374151">● Separate admin from webhook domains</text>
    <text x="620" y="425" font-family="Arial,sans-serif" font-size="13" fill="#374151">● Admin: VPN only (internal network)</text>
    <text x="620" y="450" font-family="Arial,sans-serif" font-size="13" fill="#374151">● Webhooks: public but rate-limited</text>
    <text x="620" y="475" font-family="Arial,sans-serif" font-size="13" fill="#374151">● Nginx rate_limit_zone: 10r/s burst=20</text>
    <text x="620" y="505" font-family="Arial,sans-serif" font-size="12" fill="#1E40AF" font-weight="bold">Never expose n8n dashboard to public</text>
  `));

  // 13. monitoring-stack.png
  await saveSvg('monitoring-stack.png', wrap(`
    ${titleBar('Monitoring Stack Architecture')}
    ${box(50, 100, 200, 100, '#1E40AF', '#1E3A8A', '', 14)}
    <text x="150" y="135" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#fff" font-weight="bold">n8n Instance</text>
    <text x="150" y="160" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#93C5FD">:5678/metrics</text>
    <text x="150" y="180" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#93C5FD">Prometheus format</text>

    ${box(50, 230, 200, 80, '#059669', '#047857', '', 14)}
    <text x="150" y="260" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#fff" font-weight="bold">PostgreSQL</text>
    <text x="150" y="285" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#D1FAE5">pg_stat + queries</text>

    ${box(50, 340, 200, 80, '#DC2626', '#B91C1C', '', 14)}
    <text x="150" y="370" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#fff" font-weight="bold">Redis</text>
    <text x="150" y="395" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#FCA5A5">Queue metrics</text>

    ${arrow(250, 150, 380, 240, '#1E40AF')}
    ${arrow(250, 270, 380, 260, '#059669')}
    ${arrow(250, 380, 380, 280, '#DC2626')}

    ${box(380, 190, 240, 140, '#6D28D9', '#5B21B6', '', 16)}
    <text x="500" y="230" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#fff" font-weight="bold">Prometheus</text>
    <text x="500" y="260" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#EDE9FE">Scrapes metrics</text>
    <text x="500" y="280" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#EDE9FE">Time-series DB</text>
    <text x="500" y="300" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#EDE9FE">Alert rules</text>

    ${arrow(620, 260, 720, 200, '#6D28D9')}
    ${arrow(620, 260, 720, 340, '#6D28D9')}

    ${box(720, 150, 280, 100, '#EA580C', '#C2410C', '', 16)}
    <text x="860" y="190" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#fff" font-weight="bold">Grafana</text>
    <text x="860" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#FFF7ED">Dashboards</text>
    <text x="860" y="235" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#FFF7ED">Visualizations</text>

    ${box(720, 290, 280, 100, '#1F2937', '#111827', '', 16)}
    <text x="860" y="325" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#fff" font-weight="bold">Alertmanager</text>
    <text x="860" y="355" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#9CA3AF">Route alerts to channels</text>
    <text x="860" y="375" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#9CA3AF">Slack / PagerDuty / Email</text>

    ${arrow(1000, 200, 1060, 200, '#EA580C')}
    ${arrow(1000, 340, 1060, 340, '#1E40AF')}

    ${box(1060, 175, 100, 50, '#DBEAFE', '#1E40AF', 'Team', 14, '#1E40AF')}
    ${box(1060, 315, 100, 50, '#FEE2E2', '#DC2626', 'Oncall', 14, '#DC2626')}

    <rect x="50" y="460" width="1060" height="70" rx="8" fill="#F3F4F6" stroke="#E5E7EB"/>
    <text x="580" y="490" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#374151" font-weight="bold">Key Metrics: workflow_executions_total | execution_duration | active_workflows | queue_depth | error_rate</text>
    <text x="580" y="515" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="#6B7280">Set alerts for: error_rate > 5% | queue_depth > 100 | execution_duration > 30s | disk_usage > 80%</text>
  `));

  console.log(`\nDone! Generated ${13} diagrams to ${OUT}`);
}

generate().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
