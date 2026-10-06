import { resolveImageDelivery } from '../../utils/imageVariants';

type ResponsiveImageProps = {
  src: string | undefined;
  alt: string;
  className?: string;
  sizes: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'auto' | 'sync';
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
};

/**
 * Responsive image with WebP variants when a known mapping exists.
 * Unknown, custom, or stored URLs keep their original src.
 */
export default function ResponsiveImage({
  src,
  alt,
  className,
  sizes,
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  referrerPolicy,
}: ResponsiveImageProps) {
  const delivery = resolveImageDelivery(src);
  const img = (
    <img
      src={delivery.src}
      alt={alt}
      className={className}
      sizes={delivery.webpSrcSet ? sizes : undefined}
      width={delivery.width}
      height={delivery.height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      referrerPolicy={referrerPolicy}
    />
  );

  if (!delivery.webpSrcSet) {
    return img;
  }

  return (
    <picture className="contents">
      <source type="image/webp" srcSet={delivery.webpSrcSet} sizes={sizes} />
      {img}
    </picture>
  );
}
