/**
 * CLI for homepage image variants. Prefer `ensureOptimizedImages()` from image-pipeline.mjs.
 */
import { ensureOptimizedImages } from './image-pipeline.mjs';

const summary = ensureOptimizedImages();
console.log(JSON.stringify(summary, null, 2));
