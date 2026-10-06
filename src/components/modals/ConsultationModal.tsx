/**
 * ConsultationModal.tsx
 *
 * Inlines:
 *  • Firebase initialisation  (was firebase.ts)
 *  • BAHRAIN_LOCATIONS / ACTIVITIES constants
 *  • EmailJS notification to fastnsafe321@gmail.com on every successful submission
 *
 * External dependencies that stay outside this file:
 *  • firebase-applet-config.json  (Firebase project config)
 *
 * EmailJS one-time setup (free tier is plenty):
 *  1. Sign up at https://www.emailjs.com
 *  2. Add Service  → connect your Gmail account (fastnsafe321@gmail.com)
 *  3. Create Template → paste the body from the comment below
 *  4. Fill in the three constants at the top of this file:
 *       EMAILJS_SERVICE_ID   – e.g. "service_abc123"
 *       EMAILJS_TEMPLATE_ID  – e.g. "template_xyz789"
 *       EMAILJS_PUBLIC_KEY   – e.g. "A1b2C3d4E5f6G7h8"
 *
 * ─── RECOMMENDED EMAIL TEMPLATE BODY (paste into EmailJS template editor) ────
 *
 *  Subject : New Consultation Request — {{ticket}} — {{service}}
 *
 *  A new consultation has been submitted on the Fast & Safe website.
 *
 *  TICKET       : {{ticket}}
 *  SERVICE      : {{service}}
 *  ─────────────────────────────────
 *  CLIENT NAME  : {{client_name}}
 *  PHONE        : {{phone}}
 *  EMAIL        : {{client_email}}
 *  COMPANY      : {{company}}
 *  ─────────────────────────────────
 *  LOCATION     : {{location}}
 *  TIMELINE     : {{timeline}}
 *  CONTACT VIA  : {{contact_method}}
 *  ─────────────────────────────────
 *  PROJECT DETAILS:
 *  {{message}}
 *
 *  Set the "To Email" field in the template to:  fastnsafe321@gmail.com
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── YOUR EMAILJS CREDENTIALS (fill these in) ─────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_zrbhuxk';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_xil9rb2';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'NYxz7kHn0sMp0ntIy';   // e.g. 'A1b2C3d4E5f6G7h8'
// ─────────────────────────────────────────────────────────────────────────────


// ─── 1. FIREBASE (on-demand via shared module; no import-time network) ─────────

import { serverTimestamp } from 'firebase/firestore';
import { writeConsultation, handleFirestoreError, OperationType } from '../../firebase';


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


// ─── 3. EMAILJS HELPER ────────────────────────────────────────────────────────

/**
 * Sends a notification email via EmailJS using the browser fetch API.
 * We call the EmailJS REST endpoint directly — no npm package needed.
 * This keeps the bundle small and avoids any import issues.
 */
async function sendEmailNotification(params: {
  ticket:         string;
  service:        string;
  client_name:    string;
  phone:          string;
  client_email:   string;
  company:        string;
  location:       string;
  timeline:       string;
  contact_method: string;
  message:        string;
}): Promise<void> {
  const payload = {
    service_id:  EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id:     EMAILJS_PUBLIC_KEY,
    template_params: {
      ...params,
      // Fallback display values for optional fields left blank by the user
      client_email: params.client_email || '—',
      company:      params.company      || '—',
      message:      params.message      || '—',
    },
  };

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!response.ok) {
    // Non-blocking: log the failure but do not surface it to the user.
    // The Firestore record is the source of truth; the email is a bonus notification.
    console.error(
      `EmailJS send failed: ${response.status} ${response.statusText}`,
      await response.text(),
    );
  }
}


// ─── 4. COMPONENT ─────────────────────────────────────────────────────────────

import { Dispatch, SetStateAction, useState, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Loader2, Check, ChevronRight, Calendar } from 'lucide-react';
import { ConsultationFormState } from '../../types';

const DEFAULT_FORM_DATA: ConsultationFormState = {
  name:          '',
  email:         '',
  phone:         '',
  company:       '',
  location:      'Manama',
  timeline:      'Immediately',
  contactMethod: 'WhatsApp',
  message:       '',
};

interface Props {
  isOpen:            boolean;
  setIsOpen:         (open: boolean) => void;
  selectedService:   string;
  setSelectedService:(service: string) => void;
  formData:          ConsultationFormState;
  setFormData:       Dispatch<SetStateAction<ConsultationFormState>>;
}

export default function ConsultationModal({
  isOpen,
  setIsOpen,
  selectedService,
  setSelectedService,
  formData,
  setFormData,
}: Props) {
  const [formErrors,      setFormErrors]      = useState<Record<string, string>>({});
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [submitSuccess,   setSubmitSuccess]   = useState(false);
  const [consultationRef, setConsultationRef] = useState('');

  const resetForm = () => {
    setFormData({ ...DEFAULT_FORM_DATA });
    setFormErrors({});
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
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // ── Ticket reference ─────────────────────────────────────────────────────
    const randomTicket = Math.floor(1000 + Math.random() * 9000);
    const ticketCode   = `FS-Q-2026-${randomTicket}`;

    try {
      // ── 1. Write to Firestore (source of truth) ──────────────────────────
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

      await writeConsultation(payload);

      // ── 2. Send email notification via EmailJS (non-blocking) ─────────────
      // We deliberately do NOT await this with a try/catch that surfaces errors
      // to the user — a failed email must never block or undo the Firestore write.
      sendEmailNotification({
        ticket:         ticketCode,
        service:        payload.service as string,
        client_name:    formData.name.trim(),
        phone:          formData.phone.trim(),
        client_email:   formData.email?.trim()   ?? '',
        company:        formData.company?.trim()  ?? '',
        location:       formData.location,
        timeline:       formData.timeline,
        contact_method: formData.contactMethod,
        message:        formData.message?.trim()  ?? '',
      }).catch((err) =>
        console.error('EmailJS notification failed (non-fatal):', err),
      );

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
                className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors shadow-inner"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="overflow-y-auto p-8 no-scrollbar bg-gray-50 flex-grow">

              {/* ── Success screen ── */}
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 px-4 flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-inner border border-emerald-100 animate-bounce">
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
                      <span className="font-bold text-gray-800">Client Info:</span>
                      <span>{formData.name}{formData.company ? ` (${formData.company})` : ''}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-800">Business Activity:</span>
                      <span>{selectedService}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-800">Site Location:</span>
                      <span>{formData.location}, BH</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="font-bold text-gray-800">Preferred Channel:</span>
                      <span className="bg-[#0083C9]/10 text-[#0083C9] px-2.5 py-0.5 rounded font-bold text-xs uppercase">
                        {formData.contactMethod}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm max-w-md mb-8 leading-relaxed">
                    Thank you for choosing{' '}
                    <span className="font-semibold text-gray-800">Fast & Safe Construction</span>.
                    Our Sitra estimating department will contact you via{' '}
                    <span className="font-semibold text-gray-800">{formData.contactMethod}</span>{' '}
                    within 2 business hours.
                  </p>

                  <button
                    onClick={() => { setIsOpen(false); resetForm(); }}
                    className="bg-black hover:bg-[#0083C9] text-white font-bold text-xs tracking-widest px-8 py-4 transition-colors uppercase w-full max-w-xs rounded-xl shadow-lg"
                  >
                    Return to Website
                  </button>
                </motion.div>

              ) : (

                /* ── Form ── */
                <form onSubmit={handleSubmitConsultation} className="space-y-6">

                  {/* Activity / scope */}
                  <div>
                    <label
                      htmlFor="cm-service"
                      className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2"
                    >
                      Required Activity / Scope
                    </label>
                    <select
                      id="cm-service"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0083C9] focus:border-transparent"
                    >
                      {ACTIVITIES.map((act) => (
                        <option key={act} value={act}>{act}</option>
                      ))}
                    </select>
                  </div>

                  {/* Name & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="cm-name"
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2"
                      >
                        Your Name *
                      </label>
                      <input
                        id="cm-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9] focus:border-transparent transition-all ${
                          formErrors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="e.g. Salim Al-Khalifa"
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-[11px] font-semibold mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="cm-company"
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2"
                      >
                        Company / Club (Optional)
                      </label>
                      <input
                        id="cm-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9] focus:border-transparent"
                        placeholder="e.g. Royal Equestrian Club"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="cm-phone"
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="cm-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9] focus:border-transparent transition-all ${
                          formErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="+973 39912345"
                        required
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-[11px] font-semibold mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="cm-email"
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2"
                      >
                        Email (Optional)
                      </label>
                      <input
                        id="cm-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9] focus:border-transparent"
                        placeholder="client@domain.bh"
                      />
                    </div>
                  </div>

                  {/* Location & Timeline */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="cm-location"
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2"
                      >
                        Project Location
                      </label>
                      <select
                        id="cm-location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9] focus:border-transparent"
                      >
                        {BAHRAIN_LOCATIONS.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="cm-timeline"
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2"
                      >
                        Timeline
                      </label>
                      <select
                        id="cm-timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9] focus:border-transparent"
                      >
                        <option value="Immediately">Immediately</option>
                        <option value="Within 1 Month">Within 1 Month</option>
                        <option value="1-3 Months">1 to 3 Months</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact method */}
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
                              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {way}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="cm-message"
                      className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2"
                    >
                      Project Details / Scope
                    </label>
                    <textarea
                      id="cm-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0083C9] focus:border-transparent resize-none"
                      placeholder="Site dimensions, special requirements, etc..."
                    />
                  </div>

                  {/* Footer + Submit */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-6">
                    <div className="hidden sm:flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                      <Calendar size={14} className="text-[#0083C9]" />
                      <span>Sitra Estimating Unit Active</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#0083C9] hover:bg-[#36B649] disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-4 font-bold tracking-widest text-xs transition-all uppercase flex items-center gap-3 shadow-lg h-12 w-full sm:w-auto justify-center rounded-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>SUBMITTING BRIEF...</span>
                        </>
                      ) : (
                        <>
                          <span>SUBMIT REQUEST</span>
                          <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}