import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  addDoc,
  collection,
  type Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const existing = getApps();
    app = existing.length > 0 ? existing[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(
      getFirebaseApp(),
      (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId,
    );
  }
  return db;
}

export type ConsultationTransport = {
  getDb: () => unknown;
  collection: (database: unknown, path: string) => unknown;
  addDoc: (reference: unknown, data: Record<string, unknown>) => Promise<unknown>;
};

/**
 * Shared consultation write. Production uses Firestore; tests may pass a mock transport.
 * Does not initialize Firebase until called without a transport.
 */
export async function writeConsultation(
  payload: Record<string, unknown>,
  transport?: ConsultationTransport,
): Promise<unknown> {
  if (transport) {
    return transport.addDoc(
      transport.collection(transport.getDb(), 'consultations'),
      payload,
    );
  }
  return addDoc(collection(getDb(), 'consultations'), payload);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
