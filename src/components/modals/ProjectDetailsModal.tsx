import React, { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Project } from '../../types';
import ResponsiveImage from '../media/ResponsiveImage';

interface Props {
  project: Project | null;
  onClose: () => void;
  onInquire?: (projectTitle: string) => void;
}

const ProjectDetailsModal: FC<Props> = ({ project, onClose, onInquire }) => {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    if (project) setEnlargedImage(null);
  }, [project]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* ── HERO IMAGE ── */}
          <div className="relative h-56 shrink-0 overflow-hidden">
            <ResponsiveImage
              src={project.image}
              alt={project.title}
              sizes="(min-width: 768px) 896px, 100vw"
              className="w-full h-full object-cover"
            />
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="text-gray-800" />
            </button>
          </div>

          {/* ── SCROLLABLE BODY ── */}
          <div className="overflow-y-auto flex-1">
            <div className="p-8 pb-10">

              {/* Category + Year pills */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#0083C9] text-white text-[10px] font-extrabold tracking-[0.15em] uppercase px-4 py-1.5 rounded">
                  {project.category}
                </span>
                <span className="text-[#0083C9] text-[11px] font-bold tracking-widest uppercase">
                  Completed {project.year}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
                {project.title}
              </h2>

              {/* Divider */}
              <div className="h-px bg-gray-200 mb-8" />

              {/* ── TWO COLUMN LAYOUT ── */}
              <div className="flex flex-col md:flex-row gap-10">

                {/* LEFT — overview + gallery */}
                <div className="flex-1 min-w-0">
                  {/* Overview */}
                  <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#0083C9] uppercase mb-3">
                    Project Overview
                  </p>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                    {project.details}
                  </p>

                  {/* Gallery */}
                  {project.gallery && project.gallery.length > 0 && (
                    <>
                      <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#0083C9] uppercase mb-4">
                        Project Visual Archives
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {project.gallery.map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setEnlargedImage(img)}
                            className="overflow-hidden rounded-lg cursor-pointer group"
                          >
                            <ResponsiveImage
                              src={img}
                              alt={`${project.title} Exhibit ${idx + 1}`}
                              sizes="(min-width: 768px) 400px, 50vw"
                              className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <p className="text-xs text-gray-400 mt-1.5 font-medium truncate">
                              {project.title} Exhibit {idx + 1}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* RIGHT — meta + CTA */}
                <div className="w-full md:w-56 shrink-0 flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-extrabold tracking-[0.2em] text-gray-400 uppercase mb-1">
                      Client
                    </p>
                    <p className="text-gray-900 font-bold text-sm leading-snug">
                      {project.client}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold tracking-[0.2em] text-gray-400 uppercase mb-1">
                      Location
                    </p>
                    <p className="text-gray-900 font-bold text-sm leading-snug">
                      Manama, Kingdom of Bahrain
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold tracking-[0.2em] text-gray-400 uppercase mb-1">
                      Year
                    </p>
                    <p className="text-gray-900 font-bold text-sm">{project.year}</p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onInquire?.(project.title);
                    }}
                    className="mt-2 bg-gray-900 hover:bg-[#0083C9] text-white text-[10px] font-extrabold tracking-[0.15em] uppercase px-6 py-4 rounded-xl transition-all duration-300 text-center"
                  >
                    Inquire About Similar
                  </button>
                </div>
              </div>
            </div>
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

export default ProjectDetailsModal;