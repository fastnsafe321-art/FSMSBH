import manifest from '../data/image-variants.json';
import { isKnownLocalImageRef } from '../../scripts/image-path-rules.mjs';

type Variant = {
  width: number;
  href: string;
  bytes: number;
};

type ManifestEntry = {
  file: string;
  role: string;
  original: string;
  width: number;
  height: number;
  variants: Variant[];
};

const images = (manifest as { images: Record<string, ManifestEntry> }).images;

function fallbackSrc(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith('//')) return path;
  const ref = isKnownLocalImageRef(path);
  if (ref) return encodeURI(ref.publicPath);
  return path;
}

export function lookupImageVariant(path: string | undefined): ManifestEntry | null {
  const ref = isKnownLocalImageRef(path);
  if (!ref) return null;
  return images[ref.file] || null;
}

export function resolveImageDelivery(path: string | undefined) {
  const src = fallbackSrc(path);
  const entry = lookupImageVariant(path);
  if (!entry || !entry.variants?.length) {
    return {
      src,
      webpSrcSet: undefined,
      width: undefined,
      height: undefined,
      variants: [] as Variant[],
    };
  }
  return {
    src,
    webpSrcSet: entry.variants
      .map((variant) => `${encodeURI(variant.href)} ${variant.width}w`)
      .join(', '),
    width: entry.width,
    height: entry.height,
    variants: entry.variants,
  };
}

export function pickVariantHrefForDisplay(
  path: string | undefined,
  cssPixels: number,
  dpr = 1,
): string {
  const delivery = resolveImageDelivery(path);
  if (!delivery.variants.length) return delivery.src;
  const needed = Math.max(1, Math.round(cssPixels * dpr));
  const match =
    delivery.variants.find((variant) => variant.width >= needed) ||
    delivery.variants[delivery.variants.length - 1];
  return match.href;
}

export function prefetchResponsiveImage(path: string | undefined, sizes = '100vw') {
  if (typeof window === 'undefined') return;
  const cssPixels = sizes.trim() === '100vw' ? window.innerWidth : window.innerWidth;
  const href = pickVariantHrefForDisplay(path, cssPixels, window.devicePixelRatio || 1);
  if (!href) return;
  const prefetch = new Image();
  prefetch.src = href;
}

export function backdropImageSet(path: string): string {
  const delivery = resolveImageDelivery(path);
  if (!delivery.variants.length) {
    return `url(${delivery.src})`;
  }
  const largest = delivery.variants[delivery.variants.length - 1];
  return `image-set(url("${encodeURI(largest.href)}") type("image/webp"), url("${delivery.src}") type("image/png"))`;
}
