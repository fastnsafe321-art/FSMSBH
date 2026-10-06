/**
 * Local Phase 4 checks: JSON-LD parse, graph IDs, metadata, heading outline.
 * Does not upload HTML or call Google Rich Results Test.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = path.join(projectRoot, 'dist', 'index.html');
const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-4');

const ALLOWED_TYPES = new Set(['Organization', 'WebSite', 'WebPage']);
const FORBIDDEN_TYPES = [
  'LocalBusiness',
  'Service',
  'OfferCatalog',
  'FAQPage',
  'BreadcrumbList',
  'SearchAction',
];
const ALLOWED_PROPS = {
  Organization: new Set(['@type', '@id', 'name', 'url', 'email', 'telephone', 'description']),
  WebSite: new Set(['@type', '@id', 'url', 'name', 'inLanguage', 'description', 'publisher']),
  WebPage: new Set([
    '@type',
    '@id',
    'url',
    'name',
    'inLanguage',
    'description',
    'isPartOf',
    'about',
  ]),
};

function fail(message) {
  throw new Error(`[verify-phase4] ${message}`);
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

const html = fs.readFileSync(htmlPath, 'utf8');
const scriptMatches = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
const jsonLdScripts = scriptMatches.filter((match) =>
  /type=["']application\/ld\+json["']/.test(match[1] || ''),
);

if (jsonLdScripts.length !== 1) {
  fail(`Expected exactly 1 JSON-LD script in dist/index.html, found ${jsonLdScripts.length}`);
}

const jsonLdRaw = jsonLdScripts[0][2];
if (jsonLdRaw.includes('</script>') || jsonLdRaw.includes('</SCRIPT>')) {
  fail('JSON-LD script text contains a raw </script> sequence');
}

let graph;
try {
  graph = JSON.parse(jsonLdRaw);
} catch (error) {
  fail(`JSON-LD did not parse: ${error.message}`);
}

const expectedSerialized = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.fsmsbh.com/#organization',
      name: 'Fast & Safe Maintenance Services',
      url: 'https://www.fsmsbh.com/',
      email: 'info@fsmsbh.com',
      telephone: ['+97377912500', '+97339354111'],
      description:
        'Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Based in Sitra. Request a consultation.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.fsmsbh.com/#website',
      url: 'https://www.fsmsbh.com/',
      name: 'Fast & Safe Maintenance Services',
      inLanguage: 'en',
      description:
        'Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Based in Sitra. Request a consultation.',
      publisher: { '@id': 'https://www.fsmsbh.com/#organization' },
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.fsmsbh.com/#webpage',
      url: 'https://www.fsmsbh.com/',
      name: 'Football Pitch Construction in Bahrain | Fast & Safe Maintenance Services',
      inLanguage: 'en',
      description:
        'Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Based in Sitra. Request a consultation.',
      isPartOf: { '@id': 'https://www.fsmsbh.com/#website' },
      about: { '@id': 'https://www.fsmsbh.com/#organization' },
    },
  ],
}).replace(/</g, '\\u003c');

if (expectedSerialized !== jsonLdRaw) {
  fail('Built JSON-LD text does not match the Phase 4 source graph serialization');
}

if (graph['@context'] !== 'https://schema.org' || !Array.isArray(graph['@graph'])) {
  fail('JSON-LD must be a schema.org @graph');
}

if (graph['@graph'].length !== 3) {
  fail(`Expected 3 graph nodes, found ${graph['@graph'].length}`);
}

const byId = new Map(graph['@graph'].map((node) => [node['@id'], node]));
const organization = byId.get('https://www.fsmsbh.com/#organization');
const website = byId.get('https://www.fsmsbh.com/#website');
const webpage = byId.get('https://www.fsmsbh.com/#webpage');

if (!organization || organization['@type'] !== 'Organization') {
  fail('Organization node missing or wrong type');
}
if (!website || website['@type'] !== 'WebSite') {
  fail('WebSite node missing or wrong type');
}
if (!webpage || webpage['@type'] !== 'WebPage') {
  fail('WebPage node missing or wrong type');
}

const vocabIssues = [];
for (const node of graph['@graph']) {
  if (!ALLOWED_TYPES.has(node['@type'])) {
    vocabIssues.push(`Unexpected @type ${node['@type']}`);
  }
  const allowed = ALLOWED_PROPS[node['@type']];
  for (const key of Object.keys(node)) {
    if (allowed && !allowed.has(key)) {
      vocabIssues.push(`${node['@type']} has unexpected property ${key}`);
    }
  }
}
const presentTypes = new Set();
const walkTypes = (value) => {
  if (!value || typeof value !== 'object') return;
  if (typeof value['@type'] === 'string') presentTypes.add(value['@type']);
  if (Array.isArray(value['@type'])) {
    for (const item of value['@type']) presentTypes.add(item);
  }
  for (const child of Object.values(value)) walkTypes(child);
};
walkTypes(graph);
for (const forbidden of FORBIDDEN_TYPES) {
  if (presentTypes.has(forbidden)) {
    vocabIssues.push(`Forbidden type present: ${forbidden}`);
  }
}
if (vocabIssues.length) {
  fail(`Schema vocabulary/property check failed: ${vocabIssues.join('; ')}`);
}

if (website.publisher?.['@id'] !== organization['@id']) {
  fail('WebSite.publisher does not reference Organization');
}
if (webpage.isPartOf?.['@id'] !== website['@id']) {
  fail('WebPage.isPartOf does not reference WebSite');
}
if (webpage.about?.['@id'] !== organization['@id']) {
  fail('WebPage.about does not reference Organization');
}

if (organization.name !== 'Fast & Safe Maintenance Services') {
  fail('Organization.name mismatch');
}
if (organization.email !== 'info@fsmsbh.com') {
  fail('Organization.email mismatch');
}
if (
  !Array.isArray(organization.telephone) ||
  organization.telephone.join(',') !== '+97377912500,+97339354111'
) {
  fail('Organization.telephone mismatch');
}

const titleMatch = html.match(/<title>([^<]*)<\/title>/);
const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
const robots = fs.readFileSync(path.join(projectRoot, 'public', 'robots.txt'), 'utf8');
const sitemap = fs.readFileSync(path.join(projectRoot, 'public', 'sitemap.xml'), 'utf8');

if (decodeEntities(titleMatch?.[1] || '') !== webpage.name) {
  fail('Document title / WebPage.name mismatch');
}
if (decodeEntities(descMatch?.[1] || '') !== organization.description) {
  fail('Meta description / Organization.description mismatch');
}
if (canonicalMatch?.[1] !== 'https://www.fsmsbh.com/') {
  fail('Canonical changed');
}
if (!html.includes('G-SP37M5NYJ5')) {
  fail('Google tag missing');
}
if (!html.includes('google-site-verification')) {
  fail('Site verification meta missing');
}
if (!html.includes('<main')) {
  fail('main landmark missing from prerender');
}
if (!html.includes('aria-label="Primary"')) {
  fail('Primary navigation name missing from prerender');
}
if (!robots.includes('Sitemap: https://www.fsmsbh.com/sitemap.xml')) {
  fail('robots.txt sitemap line unexpected');
}
if (!sitemap.includes('https://www.fsmsbh.com/')) {
  fail('sitemap.xml homepage URL unexpected');
}

const headingMatches = [...html.matchAll(/<(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi)];
const outline = headingMatches.map((match, index) => ({
  index,
  tag: match[1].toLowerCase(),
  text: match[3]
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim(),
}));

const landmarks = {
  main: (html.match(/<main\b/gi) || []).length,
  nav: (html.match(/<nav\b/gi) || []).length,
  header: (html.match(/<header\b/gi) || []).length,
  footer: (html.match(/<footer\b/gi) || []).length,
  jsonLd: jsonLdScripts.length,
};

const h1s = outline.filter((item) => item.tag === 'h1');
if (h1s.length !== 1) {
  fail(`Expected one H1, found ${h1s.length}`);
}

fs.mkdirSync(evidenceDir, { recursive: true });
fs.writeFileSync(
  path.join(evidenceDir, 'heading-outline-after.json'),
  JSON.stringify({ file: 'dist/index.html', landmarks, outline }, null, 2),
);
fs.writeFileSync(path.join(evidenceDir, 'json-ld-parsed.json'), JSON.stringify(graph, null, 2));

const report = {
  jsonSyntax: 'pass',
  schemaVocabulary: 'pass',
  googleRichResultsTest: 'not run; HTML was not uploaded',
  graphNodeCount: graph['@graph'].length,
  landmarks,
  h1Count: h1s.length,
  jsonLdCharLength: jsonLdRaw.length,
};

console.log(JSON.stringify(report, null, 2));
