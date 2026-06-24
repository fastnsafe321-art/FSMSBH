/**
 * ConsultationModal.tsx — self-contained single file
 *
 * Inlines:
 *  • Firebase initialisation  (was firebase.ts)
 *  • BAHRAIN_LOCATIONS / ACTIVITIES constants  (was constants.ts)
 *  • The modal component itself  (was ConsultationModal.tsx)
 *
 * The only external dependency that cannot be inlined is the Firebase
 * project config JSON (firebase-applet-config.json). That file stays
 * where it is; we import it at the top just like before.
 */

// ─── 1. FIREBASE SETUP ────────────────────────────────────────────────────────

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

// Guard against double-initialisation in strict-mode / hot-reload
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST   = 'list',
  GET    = 'get',
  WRITE  = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: { providerId?: string | null; email?: string | null }[];
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Dry-run connection check on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.warn('Firestore client is offline. Please check active networks.');
    }
  }
}
testConnection();


// ─── 2. CONSTANTS ─────────────────────────────────────────────────────────────

const BAHRAIN_LOCATIONS = [
  'Manama',
  'Riffa',
  'Amwaj Islands',
  'Sitra',
  'Muharraq',
  'Saar / Janabiya',
  'Seef District',
  'Hamad Town / Isa Town',
  'Zallaq',
  'Hidd',
  'Other Region (Bahrain)',
];

const ACTIVITIES = [
  'Artificial Grass Installation',
  'Natural Grass Installation',
  'Fencing Works',
  'Building Construction',
  'Horse Walker Installation',
  'Swimming Pool Construction',
  'Other / Turnkey Project',
];


// ─── 3. COMPONENT ─────────────────────────────────────────────────────────────

import { useState, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Loader2, Check } from 'lucide-react';

// Internal form-data shape
interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  timeline: string;
  contactMethod: string;
  message: string;
}

const DEFAULT_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  location: 'Manama',
  timeline: 'Immediately',
  contactMethod: 'WhatsApp',
  message: '',
};

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export default function ConsultationModal({
  isOpen,
  setIsOpen,
  selectedService,
  setSelectedService,
  formData,
  setFormData,
}: Props) {
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [submitSuccess, setSubmitSuccess]   = useState(false);
  const [consultationRef, setConsultationRef] = useState('');

  const resetForm = () => {
    setFormData({ ...DEFAULT_FORM_DATA });
    setSubmitSuccess(false);
    setConsultationRef('');
  };

  const handleSubmitConsultation = async (e: FormEvent) => {
    e.preventDefault();

    // ── Validation ──────────────────────────────────────────────────────────
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required for follow-up.';
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (e.g. +973 XXXXXXXX).';
    }

    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors)[0]);
      return;
    }

    setIsSubmitting(true);

    // ── Build ticket reference ───────────────────────────────────────────────
    const randomTicket = Math.floor(1000 + Math.random() * 9000);
    const ticketCode   = `FS-Q-2026-${randomTicket}`;

    try {
      /**
       * WHAT IS SENT TO FIREBASE
       * ─────────────────────────────────────────────────────────────────────
       * Collection : "consultations"
       * Document ID: auto-generated by Firestore (addDoc)
       *
       * Always-present fields:
       *   name          – client's full name (string, trimmed)
       *   phone         – contact phone number (string, trimmed)
       *   location      – selected Bahrain location (string)
       *   timeline      – project urgency (string)
       *   contactMethod – preferred channel: WhatsApp | Phone Call | Email Channel
       *   service       – selected activity / scope (string)
       *   status        – always "pending" on creation (string)
       *   ticket        – reference code e.g. "FS-Q-2026-4821" (string)
       *   createdAt     – Firestore server timestamp (Timestamp)
       *
       * Optional fields (only added when the user fills them in):
       *   email         – client email address (string)
       *   company       – company or club name (string)
       *   message       – free-text project details / scope (string)
       */
      const payload: Record<string, unknown> = {
        name:          formData.name.trim(),
        phone:         formData.phone.trim(),
        location:      formData.location,
        timeline:      formData.timeline,
        contactMethod: formData.contactMethod,
        service:       typeof selectedService === 'string'
                         ? selectedService
                         : 'Technical Consultation',
        status:    'pending',
        ticket:    ticketCode,
        createdAt: serverTimestamp(),
      };

      if (formData.email?.trim())   payload.email   = formData.email.trim();
      if (formData.company?.trim()) payload.company = formData.company.trim();
      if (formData.message?.trim()) payload.message = formData.message.trim();

      await addDoc(collection(db, 'consultations'), payload);

      setConsultationRef(ticketCode);
      setSubmitSuccess(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'consultations');
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
          >
            {/* ── Header ── */}
            <div className="bg-[#0083C9] text-white p-8 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-white/70 uppercase">
                  Kingdom of Bahrain Specialist
                </span>
                <h3 className="text-2xl font-bold mt-1">Request Technical Consultation</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="overflow-y-auto p-8 no-scrollbar bg-gray-50 flex-grow">

              {/* Success screen */}
              {submitSuccess ? (
                <motion.div className="text-center py-12 px-4 flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <h4 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Request Lodged Successfully
                  </h4>
                  <span className="text-xs text-gray-400 font-mono tracking-wide mb-6 uppercase">
                    REFERENCE TICKET: {consultationRef}
                  </span>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs max-w-md w-full mb-8 text-left space-y-4 text-sm text-gray-600">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-800">Client:</span>
                      <span>{formData.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-800">Service:</span>
                      <span>{selectedService}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-800">Location:</span>
                      <span>{formData.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setIsOpen(false); resetForm(); }}
                    className="bg-black hover:bg-[#0083C9] text-white font-bold text-xs tracking-widest px-8 py-4 transition-colors uppercase w-full max-w-xs rounded-xl"
                  >
                    Return to Website
                  </button>
                </motion.div>

              ) : (

                /* ── Form ── */
                <form onSubmit={handleSubmitConsultation} className="space-y-6">

                  {/* Activity / scope */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Required Activity / Scope
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0083C9]"
                    >
                      {ACTIVITIES.map((act) => (
                        <option key={act} value={act}>{act}</option>
                      ))}
                    </select>
                  </div>

                  {/* Name & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9]"
                        placeholder="e.g. Salim Al-Khalifa"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Company / Club (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9]"
                        placeholder="e.g. Royal Equestrian Club"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9]"
                        placeholder="+973 39912345"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9]"
                        placeholder="client@domain.bh"
                      />
                    </div>
                  </div>

                  {/* Location & Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Project Location
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9]"
                      >
                        {BAHRAIN_LOCATIONS.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9]"
                      >
                        <option value="Immediately">Immediately</option>
                        <option value="Within 1 Month">Within 1 Month</option>
                        <option value="1-3 Months">1 to 3 Months</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Method */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['WhatsApp', 'Phone Call', 'Email Channel'] as const).map((way) => (
                        <button
                          key={way}
                          type="button"
                          onClick={() => setFormData({ ...formData, contactMethod: way })}
                          className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                            formData.contactMethod === way
                              ? 'border-[#0083C9] bg-[#0083C9]/5 text-[#0083C9]'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {way}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Project Details / Scope
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9] resize-none"
                      placeholder="Site dimensions, special requirements, etc..."
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0083C9] hover:bg-[#36B649] text-white py-4 rounded-xl font-bold tracking-widest text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      'SUBMIT CONSULTATION REQUEST'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}