import { HOMEPAGE_JSON_LD, serializeJsonLd } from '../../data/site-schema';

/**
 * Single homepage JSON-LD graph. Rendered with the App so prerender includes it.
 */
export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      data-fsms-jsonld="homepage"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(HOMEPAGE_JSON_LD) }}
    />
  );
}
