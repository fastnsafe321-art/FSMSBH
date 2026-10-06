import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';
import { homepagePrerenderPlugin } from './scripts/homepage-prerender.mjs';
import { ensureOptimizedImages } from './scripts/image-pipeline.mjs';

// Automatically sync images to public assets so they build correctly for GitHub Pages and Vercel
function syncAssets() {
  const srcDir = path.resolve(__dirname, 'src/assets/images');
  const destDir = path.resolve(__dirname, 'public/assets/images');

  if (fs.existsSync(srcDir)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const files = fs.readdirSync(srcDir);
    let copiedCount = 0;
    for (const file of files) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      const stat = fs.statSync(srcFile);
      if (stat.isFile()) {
        fs.copyFileSync(srcFile, destFile);
        copiedCount++;
      }
    }
    console.log(`[Asset Setup] Synchronized ${copiedCount} active asset images to /public/assets/images/ for production builds.`);
  }
}

try {
  syncAssets();
} catch (e) {
  console.error('[Asset Setup] Error syncing assets:', e);
}

if (process.env.FSMS_SSR_BUILD === '1') {
  console.log('[Asset Setup] Skipping image generation during isolated SSR build');
} else {
  const summary = ensureOptimizedImages();
  console.log('[Asset Setup] Image pipeline', JSON.stringify({
    created: summary.created,
    reused: summary.reused,
    mapped: summary.mapped,
    writtenManifest: summary.writtenManifest,
  }));
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), { ...homepagePrerenderPlugin(), apply: 'build' }],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true'
        ? null
        : { ignored: ['**/seo-audit-evidence/**', '**/.prerender/**'] },
    },
  };
});
