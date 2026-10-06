import fs from 'node:fs';

const html = fs.readFileSync(process.argv[2] || 'dist/index.html', 'utf8');
const matches = [...html.matchAll(/<(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi)];
const outline = matches.map((match, index) => {
  const text = match[3]
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return { index, tag: match[1].toLowerCase(), text };
});
const landmarks = {
  main: (html.match(/<main\b/gi) || []).length,
  nav: (html.match(/<nav\b/gi) || []).length,
  header: (html.match(/<header\b/gi) || []).length,
  footer: (html.match(/<footer\b/gi) || []).length,
  jsonLd: (html.match(/application\/ld\+json/g) || []).length,
};
const report = { file: process.argv[2] || 'dist/index.html', landmarks, outline };
console.log(JSON.stringify(report, null, 2));
