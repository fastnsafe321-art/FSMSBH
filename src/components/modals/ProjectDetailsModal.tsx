import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ChevronRight, Building2, Calendar, User, Images } from 'lucide-react';
import { Project } from '../../types';
import { getImgUrl } from '../../utils';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'details',  label: 'Project Details' },
  { id: 'gallery',  label: 'Gallery' },
];

const ProjectDetailsModal: FC<Props> = ({ project, onClose }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    if (project) setActiveSection('overview');
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project) return null;

  const visibleSections = SECTIONS.filter(s => {
    if (s.id === 'gallery') return project.gallery && project.gallery.length > 0;
    return true;
  });

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(`project-section-${id}`);
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
            <div>
              {/* Logo mark */}
              <div className="w-10 h-10 bg-[#0083C9] rounded-sm flex items-center justify-center font-bold text-white text-xl italic mb-8">
                F+S
              </div>

              {/* Section nav */}
              <nav className="flex flex-col gap-1">
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

              {/* Meta info */}
              <div className="mt-8 space-y-4">
                <div className="h-px bg-gray-100" />
                <div className="flex items-start gap-2">
                  <User size={11} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">Client</p>
                    <p className="text-[11px] font-semibold text-gray-700 leading-snug">{project.client}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={11} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">Year</p>
                    <p className="text-[11px] font-semibold text-gray-700">{project.year}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 size={11} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">Category</p>
                    <p className="text-[11px] font-semibold text-gray-700 leading-snug">{project.category}</p>
                  </div>
                </div>
                {project.gallery && project.gallery.length > 0 && (
                  <div className="flex items-start gap-2">
                    <Images size={11} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">Photos</p>
                      <p className="text-[11px] font-semibold text-gray-700">{project.gallery.length} images</p>
                    </div>
                  </div>
                )}
              </div>
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
          <div
            className="flex-1 overflow-y-auto scroll-smooth"
            onScroll={(e) => {
              const container = e.currentTarget;
              visibleSections.forEach(s => {
                const el = document.getElementById(`project-section-${s.id}`);
                if (el) {
                  const top = el.offsetTop - container.scrollTop;
                  if (top <= 120) setActiveSection(s.id);
                }
              });
            }}
          >
            {/* ── HERO ── */}
            <div id="project-section-overview" className="relative h-[420px] shrink-0">
              <img
                src={getImgUrl(project.image)}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X size={18} className="text-gray-800" />
              </button>

              {/* Category badge */}
              <div className="absolute top-6 left-6">
                <span className="bg-[#0083C9] text-white text-[10px] font-extrabold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
                  {project.category}
                </span>
              </div>

              {/* Title block */}
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <p className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase mb-2">
                  {project.client} · {project.year}
                </p>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3 uppercase tracking-tight">
                  {project.title}
                </h2>
                <p className="text-white/80 text-sm md:text-base italic leading-relaxed max-w-2xl">
                  "{project.desc}"
                </p>
              </div>

              {/* Enlarge */}
              <button
                onClick={() => setEnlargedImage(project.image)}
                className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-full transition-colors border border-white/20"
              >
                <ZoomIn size={14} />
                ENLARGE VIEW
              </button>
            </div>

            {/* ── PROJECT DETAILS ── */}
            <div id="project-section-details" className="px-10 py-12 border-b border-gray-100">
              <p className="text-xs font-extrabold tracking-[0.25em] text-[#0083C9] uppercase mb-8 text-center">
                Project Details
              </p>

              {/* Detail paragraph */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 mb-8">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {project.details}
                </p>
              </div>

              {/* Key info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Client', value: project.client, icon: User },
                  { label: 'Completed', value: project.year, icon: Calendar },
                  { label: 'Sector', value: project.category, icon: Building2 },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#0083C9]/30 hover:bg-[#0083C9]/5 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-[#0083C9]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">{label}</p>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── GALLERY ── */}
            {project.gallery && project.gallery.length > 0 && (
              <div id="project-section-gallery" className="px-10 py-12">
                <p className="text-xs font-extrabold tracking-[0.25em] text-[#0083C9] uppercase mb-8 text-center">
                  Project Gallery
                </p>

                {/* Featured first image large */}
                <div
                  className="w-full aspect-video rounded-2xl overflow-hidden mb-4 cursor-pointer group border border-gray-100"
                  onClick={() => setEnlargedImage(project.gallery[0])}
                >
                  <img
                    src={getImgUrl(project.gallery[0])}
                    alt={`${project.title} featured`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Remaining thumbnails */}
                {project.gallery.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {project.gallery.slice(1).map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setEnlargedImage(img)}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer group border border-gray-100"
                      >
                        <img
                          src={getImgUrl(img)}
                          alt={`${project.title} ${idx + 2}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={getImgUrl(enlargedImage)}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

export default ProjectDetailsModal;