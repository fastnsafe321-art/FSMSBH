import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  let files = 0;
  let bytes = 0;
  if (!fs.existsSync(dir)) return { files, bytes };
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = walk(full);
      files += nested.files;
      bytes += nested.bytes;
    } else {
      files += 1;
      bytes += fs.statSync(full).size;
    }
  }
  return { files, bytes };
}

const html = fs.readFileSync('dist/index.html', 'utf8');
const js = html.match(/assets\/index-[^.]+\.js/)?.[0] || null;
const root = html.match(/<div id="root"[^>]*>([\s\S]*)<\/div>\s*<script/);
const report = {
  dist: walk('dist'),
  optPublic: walk('public/assets/images/opt'),
  optDist: walk('dist/assets/images/opt'),
  distMB: Number((walk('dist').bytes / 1048576).toFixed(2)),
  optPublicMB: Number((walk('public/assets/images/opt').bytes / 1048576).toFixed(2)),
  js,
  injectedRootChars: root?.[1]?.length || 0,
};
fs.mkdirSync('seo-audit-evidence/phase-3', { recursive: true });
fs.writeFileSync('seo-audit-evidence/phase-3/disk-size.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
