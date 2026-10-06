/**
 * Local-asset guards for image delivery.
 * External, data, blob, query, and unknown paths must not use a basename match.
 */

export const LOCAL_IMAGE_PREFIXES = ['/src/assets/images/', '/assets/images/'];

export function isKnownLocalImageRef(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return null;
  if (trimmed.startsWith('//')) return null;
  if (/^https?:\/\//i.test(trimmed)) return null;

  let pathname = trimmed;
  try {
    pathname = decodeURI(pathname);
  } catch {
    // keep raw
  }

  if (pathname.includes('?') || pathname.includes('#')) return null;
  if (pathname.includes('\\') || pathname.includes('..')) return null;

  const prefix = LOCAL_IMAGE_PREFIXES.find((item) => pathname.startsWith(item));
  if (!prefix) return null;

  const rest = pathname.slice(prefix.length);
  if (!rest || rest.includes('/')) return null;
  if (!rest.includes('.')) return null;

  return {
    file: rest,
    publicPath: `/assets/images/${rest}`,
    sourceKey: `/src/assets/images/${rest}`,
  };
}
