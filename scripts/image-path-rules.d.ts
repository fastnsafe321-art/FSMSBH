export function isKnownLocalImageRef(input: string | undefined): {
  file: string;
  publicPath: string;
  sourceKey: string;
} | null;
