import fs from 'node:fs';

const html = fs.readFileSync('dist/index.html', 'utf8');
const checks = {
  length: html.length,
  titles: (html.match(/<title>/g) || []).length,
  descriptions: (html.match(/name="description"/g) || []).length,
  canonicals: (html.match(/rel="canonical"/g) || []).length,
  gtag: (html.match(/G-SP37M5NYJ5/g) || []).length,
  roots: (html.match(/id="root"/g) || []).length,
  h1: (html.match(/<h1/g) || []).length,
  h2: (html.match(/<h2/g) || []).length,
  imgs: (html.match(/<img /g) || []).length,
  emptyRoot: html.includes('<div id="root"></div>'),
  hasH1Copy: html.includes('WE BUILD THE GROUND'),
  hasHybrid: html.includes('What is HYBRIDGRASS'),
  hasArtificial: html.includes('ARTIFICIAL GRASS INSTALLATION'),
  hasNatural: html.includes('NATURAL GRASS INSTALLATION'),
  hasHoora: html.includes('Hoora Youth Centre'),
  hasSitra: html.includes('Sitra'),
  nojs: html.includes('class="no-js"'),
  clientJs: html.includes('index-Dk84IzYK.js'),
  clientCss: html.includes('index-DLN9kDHt.css'),
  prerenderLeak: html.includes('renderHomepage') || html.includes('entry-server'),
};

fs.mkdirSync('seo-audit-evidence/phase-2d', { recursive: true });
fs.writeFileSync(
  'seo-audit-evidence/phase-2d/dist-html-inspection.json',
  JSON.stringify(checks, null, 2),
);
console.log(JSON.stringify(checks, null, 2));
