import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { pickVariantHrefForDisplay, resolveImageDelivery } from '../src/utils/imageVariants.ts';

const local = '/src/assets/images/pristine_pitch_night_1781166845895.png';
const publicLocal = '/assets/images/pristine_pitch_night_1781166845895.png';
const knownName = 'pristine_pitch_night_1781166845895.png';

const cases = {
  localSrcHasWebp: Boolean(resolveImageDelivery(local).webpSrcSet),
  publicLocalHasWebp: Boolean(resolveImageDelivery(publicLocal).webpSrcSet),
  externalSameBasename: (() => {
    const url = `https://cdn.example.com/assets/images/${knownName}`;
    const delivery = resolveImageDelivery(url);
    return delivery.src === url && !delivery.webpSrcSet;
  })(),
  absoluteSameOriginLookalike: (() => {
    const url = `https://www.fsmsbh.com/assets/images/${knownName}`;
    const delivery = resolveImageDelivery(url);
    return delivery.src === url && !delivery.webpSrcSet;
  })(),
  dataUrl: resolveImageDelivery('data:image/png;base64,xxx').src === 'data:image/png;base64,xxx' &&
    !resolveImageDelivery('data:image/png;base64,xxx').webpSrcSet,
  blobUrl: !resolveImageDelivery('blob:https://example.com/1').webpSrcSet,
  unknownLocal: !resolveImageDelivery('/assets/images/not-a-real-file-xyz.png').webpSrcSet,
  queryString: !resolveImageDelivery(`${publicLocal}?v=2`).webpSrcSet,
  viewport1440picks1408: pickVariantHrefForDisplay(local, 1440, 1).includes('__w1408.webp'),
  viewport390x2picks1280: pickVariantHrefForDisplay(local, 390, 2).includes('__w1280.webp'),
};

const report = {
  cases,
  allPassed: Object.values(cases).every(Boolean),
};

mkdirSync(path.join('seo-audit-evidence', 'phase-3a'), { recursive: true });
writeFileSync(
  path.join('seo-audit-evidence', 'phase-3a', 'delivery-rules.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
if (!report.allPassed) process.exit(1);
