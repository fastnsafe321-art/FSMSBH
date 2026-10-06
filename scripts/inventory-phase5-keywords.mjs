/**
 * Extract implemented homepage wording from built HTML only.
 * Does not invent volumes or treat unused components as content.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(projectRoot, 'dist', 'index.html'), 'utf8');

function decode(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
const description = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';

const headings = [...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((match) => ({
  tag: match[1].toLowerCase(),
  text: decode(match[2].replace(/<[^>]+>/g, ' ')),
}));

const alts = [...html.matchAll(/\balt="([^"]*)"/g)].map((match) => decode(match[1]));
const navLinks = [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)]
  .map((match) => ({
    href: match[1],
    text: decode(match[2].replace(/<[^>]+>/g, ' ')),
  }))
  .filter((item) => item.text && !item.href.startsWith('tel:') && !item.href.startsWith('mailto:'));

const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
const jsonLd = jsonLdMatch ? JSON.parse(jsonLdMatch[1]) : null;

const report = {
  title,
  description,
  canonical,
  headingCount: headings.length,
  headings,
  uniqueAlts: [...new Set(alts)],
  navAndInPageLinks: navLinks,
  jsonLd,
  h1Count: headings.filter((item) => item.tag === 'h1').length,
};

fs.mkdirSync(path.join(projectRoot, 'seo-audit-evidence', 'phase-5'), { recursive: true });
fs.writeFileSync(
  path.join(projectRoot, 'seo-audit-evidence', 'phase-5', 'keyword-extract.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify({
  title,
  description,
  canonical,
  headingCount: headings.length,
  h1Count: report.h1Count,
  uniqueAltCount: report.uniqueAlts.length,
  linkCount: navLinks.length,
}, null, 2));
