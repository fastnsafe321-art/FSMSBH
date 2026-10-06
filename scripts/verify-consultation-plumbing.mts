/**
 * Mocked consultation write verification. Does not send email or write Firestore.
 */
import { getApps } from 'firebase/app';
import { writeConsultation } from '../src/firebase.ts';

if (getApps().length !== 0) {
  throw new Error('Firebase initialized at import time');
}

const writes: Array<{ path: string; payload: Record<string, unknown> }> = [];

const ticket = 'FS-Q-2026-0000';
const payload: Record<string, unknown> = {
  name: 'Mock Client',
  phone: '+973 00000000',
  location: 'Sitra',
  timeline: 'Immediately',
  contactMethod: 'WhatsApp',
  service: 'Artificial Grass Installation',
  status: 'pending',
  ticket,
};

await writeConsultation(payload, {
  getDb: () => ({ mock: true }),
  collection: (_database, path) => ({ path }),
  addDoc: async (reference, data) => {
    const path = typeof reference === 'object' && reference && 'path' in reference
      ? String((reference as { path: string }).path)
      : '';
    writes.push({ path, payload: data });
    return { id: 'mock-doc' };
  },
});

if (getApps().length !== 0) {
  throw new Error('Firebase initialized during mocked writeConsultation');
}
if (writes.length !== 1) {
  throw new Error(`Expected one mocked write, got ${writes.length}`);
}
if (writes[0].path !== 'consultations') {
  throw new Error(`Expected consultations collection, got ${writes[0].path}`);
}
if (writes[0].payload.ticket !== ticket || writes[0].payload.name !== 'Mock Client') {
  throw new Error('Mocked payload was not preserved');
}

console.log(JSON.stringify({
  ok: true,
  firebaseAppsAfterImportAndMockWrite: getApps().length,
  collection: writes[0].path,
  payloadKeys: Object.keys(writes[0].payload),
}, null, 2));
