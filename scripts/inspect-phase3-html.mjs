import fs from 'node:fs';

const html = fs.readFileSync('dist/index.html', 'utf8');
const preloads = [...html.matchAll(/<link\b[^>]*rel=["']preload["'][^>]*>/gi)].map((m) => m[0]);
const report = {
  preloadCount: preloads.length,
  imagePreloads: preloads.filter((tag) => /as=["']image["']/i.test(tag)),
  webpSources: (html.match(/type="image\/webp"/g) || []).length,
  lazy: (html.match(/loading="lazy"/g) || []).length,
  eager: (html.match(/loading="eager"/g) || []).length,
  imgTags: (html.match(/<img /g) || []).length,
  pictures: (html.match(/<picture/g) || []).length,
  gtag: html.includes('G-SP37M5NYJ5'),
  verification: html.includes('google-site-verification'),
  h1: html.includes('WE BUILD THE GROUND'),
  belowFoldPngPreloads: preloads.filter(
    (tag) => /as=["']image["']/i.test(tag) && !tag.includes('pristine_pitch'),
  ),
};
fs.mkdirSync('seo-audit-evidence/phase-3', { recursive: true });
fs.writeFileSync('seo-audit-evidence/phase-3/dist-html-images.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
