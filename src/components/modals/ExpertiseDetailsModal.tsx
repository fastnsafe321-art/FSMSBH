import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Expertise } from '../../types';
import ResponsiveImage from '../media/ResponsiveImage';

interface Props {
  expertise: Expertise | null;
  onClose: () => void;
}

const SECTIONS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'specs',         label: 'Tech Specs' },
  { id: 'installation',  label: 'Installation Flow' },
  { id: 'gallery',       label: 'Gallery' },
  { id: 'cases',         label: 'Success Stories' },
];

const ExpertiseDetailsModal: FC<Props> = ({ expertise, onClose }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Reset to overview whenever a new card is opened
  useEffect(() => {
    if (expertise) setActiveSection('overview');
  }, [expertise]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!expertise) return null;

  const IconComponent = expertise.icon;

  const visibleSections = SECTIONS.filter(s => {
    if (s.id === 'installation') return expertise.installationSteps && expertise.installationSteps.length > 0;
    if (s.id === 'cases')        return expertise.caseStudies && expertise.caseStudies.length > 0;
    return true;
  });

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`expertise-section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 24 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="relative z-10 m-auto w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex"
        >
          {/* ── LEFT SIDEBAR ── */}
          <aside className="w-44 shrink-0 bg-white border-r border-gray-100 flex flex-col justify-between py-8 px-5">
            {/* Logo mark */}
            <div>
              <div className="w-10 h-10 bg-[#0083C9] rounded-sm flex items-center justify-center font-bold text-white text-xl italic mb-8">
                F+S
              </div>

              {/* Section nav */}
              <nav aria-label="Expertise sections" className="flex flex-col gap-1">
                {visibleSections.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`text-left transition-all duration-200 py-1 ${
                      activeSection === s.id
                        ? 'text-[#0083C9] font-bold'
                        : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <span className={`block text-[10px] font-bold tracking-widest mb-0.5 ${
                      activeSection === s.id ? 'text-[#0083C9]' : 'text-gray-300'
                    }`}>
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="text-xs font-semibold leading-tight">{s.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Footer stamp */}
            <div>
              <div className="h-px bg-gray-100 mb-4" />
              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Bahrain</p>
              <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">Established</p>
              <p className="text-xl font-black text-gray-900 mt-1">Since<br />2010</p>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 overflow-y-auto scroll-smooth" onScroll={(e) => {
            // Update active nav based on scroll position
            const container = e.currentTarget;
            visibleSections.forEach(s => {
              const el = document.getElementById(`expertise-section-${s.id}`);
              if (el) {
                const top = el.offsetTop - container.scrollTop;
                if (top <= 120) setActiveSection(s.id);
              }
            });
          }}>

            {/* ── HERO ── */}
            <div id="expertise-section-overview" className="relative h-[420px] shrink-0">
              <ResponsiveImage
                src={expertise.image}
                alt={expertise.displayName || expertise.name}
                sizes="100vw"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/75" />

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X size={18} className="text-gray-800" />
              </button>

              {/* Badge */}
              <div className="absolute top-6 left-6">
                <span className="bg-[#0083C9] text-white text-[10px] font-extrabold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
                  Premium Engineering
                </span>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4 uppercase tracking-tight">
                  {expertise.displayName || expertise.name}
                </h2>
                {expertise.detailedDesc && (
                  <p className="text-white/85 text-sm md:text-base italic leading-relaxed max-w-2xl">
                    "{expertise.detailedDesc}"
                  </p>
                )}
              </div>

              {/* Enlarge button */}
              <button
                onClick={() => setEnlargedImage(expertise.image)}
                className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-full transition-colors border border-white/20"
              >
                <ZoomIn size={14} />
                ENLARGE VIEW
              </button>
            </div>

            {/* ── TECH SPECS ── */}
            {expertise.features && expertise.features.length > 0 && (
              <div id="expertise-section-specs" className="px-10 py-12 border-b border-gray-100">
                <p className="text-xs font-extrabold tracking-[0.25em] text-[#0083C9] uppercase mb-8 text-center">
                  Detailed Specifications
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {expertise.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:border-[#0083C9]/30 hover:bg-[#0083C9]/5 transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        <ChevronRight size={14} className="text-[#0083C9]" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 leading-snug pt-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── INSTALLATION FLOW ── */}
            {expertise.installationSteps && expertise.installationSteps.length > 0 && (
              <div id="expertise-section-installation" className="px-10 py-12 border-b border-gray-100">
                <p className="text-xs font-extrabold tracking-[0.25em] text-[#0083C9] uppercase mb-8 text-center">
                  Installation Flow
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {expertise.installationSteps.map((step) => (
                    <div key={step.step} className="flex gap-4 items-start group">
                      {/* Step image */}
                      {step.image && (
                        <div
                          className="w-24 h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer border border-gray-100"
                          onClick={() => setEnlargedImage(step.image!)}
                        >
                          <ResponsiveImage
                            src={step.image}
                            alt={step.title}
                            sizes="96px"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black tracking-widest text-[#0083C9]">{step.step}</span>
                          <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── GALLERY ── */}
            {expertise.gallery && expertise.gallery.length > 0 && (
              <div id="expertise-section-gallery" className="px-10 py-12 border-b border-gray-100">
                <p className="text-xs font-extrabold tracking-[0.25em] text-[#0083C9] uppercase mb-8 text-center">
                  Project Gallery
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {expertise.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setEnlargedImage(img)}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer group border border-gray-100"
                    >
                      <ResponsiveImage
                        src={img}
                        alt={`${expertise.displayName || expertise.name} gallery ${idx + 1}`}
                        sizes="(min-width: 1024px) 20vw, 50vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CASE STUDIES ── */}
            {expertise.caseStudies && expertise.caseStudies.length > 0 && (
              <div id="expertise-section-cases" className="px-10 py-12">
                <p className="text-xs font-extrabold tracking-[0.25em] text-[#0083C9] uppercase mb-8 text-center">
                  Success Stories
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {expertise.caseStudies.map((cs, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">{cs.title}</h4>
                      {cs.desc && <p className="text-sm text-gray-500 mb-3">{cs.desc}</p>}
                      <div className="flex items-start gap-2 bg-[#0083C9]/10 rounded-xl px-4 py-3">
                        <ChevronRight size={14} className="text-[#0083C9] mt-0.5 shrink-0" />
                        <p className="text-sm font-semibold text-[#0083C9]">{cs.result}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>

        {/* ── LIGHTBOX ── */}
        <AnimatePresence>
          {enlargedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[130] flex items-center justify-center bg-black/95 p-6"
              onClick={() => setEnlargedImage(null)}
            >
              <button
                onClick={() => setEnlargedImage(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <ResponsiveImage
                  src={enlargedImage}
                  alt="Enlarged view"
                  sizes="90vw"
                  className="max-w-full max-h-full object-contain rounded-2xl"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default ExpertiseDetailsModal;