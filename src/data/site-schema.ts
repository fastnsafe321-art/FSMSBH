/**
 * Homepage JSON-LD graph. Stable public facts only.
 * Name is the selected public name, not a verified legalName.
 * Strings match index.html metadata and visible footer/map contact.
 */
export const SITE_ORIGIN = 'https://www.fsmsbh.com/';

export const PUBLIC_ORGANIZATION_NAME = 'Fast & Safe Maintenance Services';

export const APPROVED_DOCUMENT_TITLE =
  'Football Pitch Construction in Bahrain | Fast & Safe Maintenance Services';

export const APPROVED_META_DESCRIPTION =
  'Fast & Safe Maintenance Services installs artificial turf and natural grass sports pitches in Bahrain. Based in Sitra. Request a consultation.';

export const VISIBLE_EMAIL = 'info@fsmsbh.com';

export const VISIBLE_TELEPHONES = ['+97377912500', '+97339354111'] as const;

export const ORGANIZATION_ID = `${SITE_ORIGIN}#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}#website`;
export const WEBPAGE_ID = `${SITE_ORIGIN}#webpage`;

export const HOMEPAGE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: PUBLIC_ORGANIZATION_NAME,
      url: SITE_ORIGIN,
      email: VISIBLE_EMAIL,
      telephone: [...VISIBLE_TELEPHONES],
      image: `${SITE_ORIGIN}og.jpg`,
      description: APPROVED_META_DESCRIPTION,
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_ORIGIN,
      name: PUBLIC_ORGANIZATION_NAME,
      inLanguage: 'en',
      description: APPROVED_META_DESCRIPTION,
      publisher: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'WebPage',
      '@id': WEBPAGE_ID,
      url: SITE_ORIGIN,
      name: APPROVED_DOCUMENT_TITLE,
      inLanguage: 'en',
      description: APPROVED_META_DESCRIPTION,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
    },
  ],
} as const;

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
