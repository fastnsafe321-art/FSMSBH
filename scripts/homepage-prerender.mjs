/**
 * Build-time homepage prerender: SSR-bundle App, inject into dist/index.html #root.
 * Temporary renderer output lives in .prerender/ and is deleted after inject.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { heroPreloadTag } from './image-pipeline.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const prerenderDir = path.join(projectRoot, '.prerender');
const distHtmlPath = path.join(projectRoot, 'dist', 'index.html');
const ssrEntrySource = path.join(projectRoot, 'src', 'entry-server.tsx');
const REQUIRED_SNIPPETS = [
  'Football Pitch Construction',
  'Hybrid Grass Systems for Football Pitches',
  'Football Pitch Drainage',
  'Root-Zone Aeration',
  'Fast &amp; Safe Maintenance Services in Bahrain',
  'Natural &amp; Artificial Football Pitch',
  'Turf Installation &amp; Construction Services',
  'Football Pitch &amp; Construction Projects',
  'Quality &amp; Safety in Project Delivery',
  'Contact Fast &amp; Safe in',
  'Artificial Football Turf Installation',
  'Natural Grass Pitch Installation',
  'Artificial grass installation in Bahrain',
  'artificial football turf installation',
  'football turf replacement',
  'Natural grass pitch installation in Bahrain',
  'natural grass football pitches',
  'Fencing works in Bahrain',
  'perimeter fencing',
  'Building construction in Bahrain',
  'Horse walker installation in Bahrain',
  'Swimming pool construction in Bahrain',
  'Carpentry and wood works in Bahrain',
  'Sitra',
  'Fast &amp; Safe',
];
const REQUIRED_HEADINGS = [
  { tag: 'h1', text: 'Football Pitch Construction in Bahrain' },
  { tag: 'h2', text: 'Hybrid Grass Systems for Football Pitches' },
  { tag: 'h2', text: 'Football Pitch Drainage & Root-Zone Aeration' },
  { tag: 'h2', text: 'Fast & Safe Maintenance Services in Bahrain' },
  { tag: 'h2', text: 'Natural & Artificial Football Pitch Systems' },
  { tag: 'h2', text: 'Turf Installation & Construction Services' },
  { tag: 'h2', text: 'Football Pitch & Construction Projects' },
  { tag: 'h2', text: 'Quality & Safety in Project Delivery' },
  { tag: 'h2', text: 'Contact Fast & Safe in Sitra, Bahrain' },
];

function visibleHeadingText(innerHtml) {
  return innerHtml
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function collectHeadings(markup) {
  return [...markup.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((match) => ({
    tag: match[1].toLowerCase(),
    text: visibleHeadingText(match[2]),
  }));
}

function fail(message) {
  throw new Error(`[homepage-prerender] ${message}`);
}

function findSsrEntryFile() {
  const candidates = [
    path.join(prerenderDir, 'entry-server.js'),
    path.join(prerenderDir, 'entry-server.mjs'),
    path.join(prerenderDir, 'entry-server.cjs'),
  ];
  if (fs.existsSync(prerenderDir)) {
    for (const file of fs.readdirSync(prerenderDir)) {
      if (file.startsWith('entry-server') && /\.(m?js|cjs)$/.test(file)) {
        candidates.unshift(path.join(prerenderDir, file));
      }
    }
  }
  const found = candidates.find((file) => fs.existsSync(file));
  if (!found) {
    fail(`SSR bundle not found in ${prerenderDir}`);
  }
  return found;
}

function renderInIsolatedProcess(ssrEntry) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [path.join(projectRoot, 'scripts', 'render-homepage-once.mjs')],
      {
        cwd: projectRoot,
        env: {
          ...process.env,
          FSMS_SSR_BUILD: '1',
          FSMS_SSR_ENTRY: ssrEntry,
        },
        windowsHide: true,
      },
    );

    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('Isolated prerender process timed out after 45s (possible open network handle)'));
    }, 45000);

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`Isolated prerender exited ${code}: ${stderr || stdout}`));
        return;
      }
      resolve(stdout);
    });
  });
}

const HERO_IMAGE_ID = 'pristine_pitch_night_1781166845895';

function splitSsrMarkup(markup) {
  const preloads = [];
  let keptHeroImage = false;
  const rest = markup
    .replace(/<link\b[^>]*rel=["']preload["'][^>]*>/gi, (tag) => {
      const isImage = /as=["']image["']/i.test(tag);
      if (isImage) {
        const isHeroWebp = tag.includes(HERO_IMAGE_ID) && /\.webp/i.test(tag);
        if (isHeroWebp && !keptHeroImage) {
          keptHeroImage = true;
          preloads.push(tag.includes('imagesizes') ? tag : heroPreloadTag());
        }
        return '';
      }
      preloads.push(tag);
      return '';
    })
    .trim();
  if (!keptHeroImage) {
    preloads.push(heroPreloadTag());
  }
  return { preloads, rest };
}

function assertMeaningfulHomepage(markup) {
  if (!markup || !markup.trim()) {
    fail('Prerender produced an empty #root. Refusing to publish an empty homepage.');
  }
  if (markup.includes('id="root"')) {
    fail('Prerendered markup unexpectedly contains another #root.');
  }
  if (/^<link\b/i.test(markup.trim())) {
    fail('Homepage markup still starts with resource links; they must be hoisted out of #root.');
  }
  if (!markup.includes('<h1')) {
    fail('Prerendered markup is missing the homepage H1.');
  }
  const headings = collectHeadings(markup);
  const h1s = headings.filter((item) => item.tag === 'h1');
  if (h1s.length !== 1) {
    fail(`Expected exactly one prerendered H1, found ${h1s.length}.`);
  }
  for (const required of REQUIRED_HEADINGS) {
    if (!headings.some((item) => item.tag === required.tag && item.text === required.text)) {
      fail(`Prerendered markup is missing ${required.tag.toUpperCase()} "${required.text}".`);
    }
  }
  if (!markup.includes('<main')) {
    fail('Prerendered markup is missing the main landmark.');
  }
  if ((markup.match(/application\/ld\+json/g) || []).length !== 1) {
    fail('Prerendered markup must contain exactly one JSON-LD script.');
  }
  if (!markup.includes('https://www.fsmsbh.com/#organization')) {
    fail('Prerendered JSON-LD is missing the Organization id.');
  }
  const missing = REQUIRED_SNIPPETS.filter((snippet) => !markup.includes(snippet));
  if (missing.length > 0) {
    fail(`Prerendered markup is missing required copy: ${missing.join(', ')}`);
  }
  if (/loading[^\n]{0,40}fallback/i.test(markup) && markup.length < 2000) {
    fail('Prerendered markup looks like a loading fallback, not the homepage.');
  }
}

function injectIntoDistHtml(markup) {
  if (!fs.existsSync(distHtmlPath)) {
    fail(`Built template not found: ${distHtmlPath}`);
  }

  const { preloads, rest } = splitSsrMarkup(markup);
  assertMeaningfulHomepage(rest);

  const template = fs.readFileSync(distHtmlPath, 'utf8');
  const rootPattern = /<div id="root"><\/div>/;
  const matches = template.match(/<div id="root"><\/div>/g) || [];
  if (matches.length !== 1) {
    fail(`Expected exactly one empty <div id="root"></div> in dist/index.html, found ${matches.length}`);
  }
  if ((template.match(/<title>/g) || []).length !== 1) {
    fail('dist/index.html must keep exactly one <title>.');
  }
  if (!template.includes('G-SP37M5NYJ5')) {
    fail('dist/index.html lost the existing Google tag.');
  }
  if (!template.includes('Football Pitch Construction in Bahrain')) {
    fail('dist/index.html lost the Phase 2A title.');
  }

  const withHead = preloads.length
    ? template.replace('</head>', `    ${preloads.join('\n    ')}\n  </head>`)
    : template;
  const next = withHead.replace(rootPattern, `<div id="root">${rest}</div>`);
  if ((next.match(/id="root"/g) || []).length !== 1) {
    fail('Injection produced a duplicate or missing #root.');
  }
  if (next.includes('<div id="root"></div>')) {
    fail('Injection left an empty #root.');
  }
  fs.writeFileSync(distHtmlPath, next, 'utf8');
}

export async function prerenderHomepage() {
  if (process.env.FSMS_SSR_BUILD === '1') {
    return;
  }

  console.log('[homepage-prerender] Building isolated renderer to .prerender/');
  process.env.FSMS_SSR_BUILD = '1';

  try {
    await build({
      configFile: path.join(projectRoot, 'vite.config.ts'),
      root: projectRoot,
      build: {
        ssr: ssrEntrySource,
        outDir: prerenderDir,
        emptyOutDir: true,
        copyPublicDir: false,
        sourcemap: false,
      },
    });

    const ssrEntry = findSsrEntryFile();
    console.log('[homepage-prerender] Rendering homepage in two isolated Node processes');
    const first = await renderInIsolatedProcess(ssrEntry);
    const second = await renderInIsolatedProcess(ssrEntry);

    if (first !== second) {
      const evidenceDir = path.join(projectRoot, 'seo-audit-evidence', 'phase-2d');
      fs.mkdirSync(evidenceDir, { recursive: true });
      fs.writeFileSync(path.join(evidenceDir, 'prerender-run-a.html'), first, 'utf8');
      fs.writeFileSync(path.join(evidenceDir, 'prerender-run-b.html'), second, 'utf8');
      fail('Two isolated renderer runs produced different HTML. See seo-audit-evidence/phase-2d/prerender-run-*.html');
    }

    injectIntoDistHtml(first);
    const { rest } = splitSsrMarkup(first);
    console.log(`[homepage-prerender] Injected ${rest.length} characters into dist/index.html #root`);
  } finally {
    process.env.FSMS_SSR_BUILD = '';
    fs.rmSync(prerenderDir, { recursive: true, force: true });
  }
}

export function homepagePrerenderPlugin() {
  let skipped = false;
  return {
    name: 'homepage-prerender',
    apply: 'build',
    async closeBundle() {
      if (process.env.FSMS_SSR_BUILD === '1' || skipped) {
        return;
      }
      skipped = true;
      await prerenderHomepage();
    },
  };
}
