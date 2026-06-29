import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Activity, Award, HelpCircle, Shield, ArrowRightLeft, Layers, Sliders, RotateCw, Compass, Maximize2, Minimize2, Sparkles } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: '/src/assets/images/pristine_pitch_night_1781166845895.png',
    tag: 'KINGDOM OF BAHRAIN • ESTABLISHED 2010',
    titleFirstLine: 'WE BUILD THE GROUND',
    titleSecondLine: 'NATURAL GRASS PLAYS THE GAME',
    description: 'Fast & Safe Maintenance Services delivers elite sports facility construction across Bahrain — natural grass pitches, artificial turf, sports flooring and irrigation — built to specification and handed over match-ready.',
    bullets: [
      { label: 'NATIONWIDE', value: '40+ Pitches Serviced' },
      { label: 'FIELD DIMENSION', value: '105m × 68m Delivered' },
      { label: 'EXPERIENCE', value: '16 Years in Bahrain' },
      { label: 'APPROVED AGENCY', value: 'GSA Project Partner' }
    ],
    primaryBtn: {
      text: 'DISCUSS YOUR PROJECT',
      targetId: 'contact'
    },
    secondaryBtn: {
      text: 'FROM EXPERTISE',
      targetId: 'expertise'
    }
  },
  {
    id: 'slide-2',
    image: '/src/assets/images/stadium_turf_night_pro_1781167905540.png',
    tag: 'SURFACE ENGINEERING STANDARD',
    titleFirstLine: 'HIGH-PERFORMANCE',
    titleSecondLine: 'ARTIFICIAL TURF SYSTEMS',
    description: 'Combining ultimate safety, realistic ball roll, and extreme durability against Bahrain’s marine atmospheric salinity and heavy summer peak temperatures.',
    bullets: [
      { label: 'PITCH DESIGN', value: 'FIFA Quality standards' },
      { label: 'DRAINAGE', value: 'Sub-soil active runoff' },
      { label: 'STRETCH STABILITY', value: 'Advanced backing grid' },
      { label: 'CLIMATE PROTECTION', value: 'Extreme UV defense' }
    ],
    primaryBtn: {
      text: 'GET ESTIMATE',
      targetId: 'contact'
    },
    secondaryBtn: {
      text: 'VIEW SERVICES',
      targetId: 'expertise'
    }
  },
  {
    id: 'slide-3',
    image: '/src/assets/images/natural_sod_clean_blurred_workers_installation_1781170765388.png',
    tag: 'SPECIFICATION-LED PROCUREMENT',
    titleFirstLine: 'FROM ROOTZONE',
    titleSecondLine: 'TO FINAL LINE MARKING',
    description: 'Premium certified sports turf installations. Sand-based rootzones, organic soil conditioning, and automated irrigation with water-conserving smart controllers.',
    bullets: [
      { label: 'ROOTZONE', value: '350mm USGA Silica/Marine Sand' },
      { label: 'AMENDMENT', value: '20% Peat Moss Moisture retention' },
      { label: 'TOLERANCE', value: '±10mm laser-graded flatness' },
      { label: 'MAINTENANCE', value: 'Full 12-Month Grow-In care' }
    ],
    primaryBtn: {
      text: 'INQUIRE NATURAL GRASS',
      targetId: 'contact'
    },
    secondaryBtn: {
      text: 'DISCOVER METHODOLOGY',
      targetId: 'projects'
    }
  }
];


interface HeroCarouselProps {
  getImgUrl: (path: string | undefined) => string;
  triggerConsultation: (serviceName?: string, customMessage?: string) => void;
}

export default function HeroCarousel({ getImgUrl, triggerConsultation }: HeroCarouselProps) {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-play interval triggers
  useEffect(() => {
    setProgress(0);
    const intervalTime = 8000; // 8 seconds per slide
    const tickTime = 100; // update scale indicator every 100ms
    
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlideIdx((prevIdx) => (prevIdx + 1) % HERO_SLIDES.length);
          return 0;
        }
        return prev + (tickTime / intervalTime) * 100;
      });
    }, tickTime);

    return () => clearInterval(progressTimer);
  }, [currentSlideIdx]);

  const handlePrev = () => {
    setProgress(0);
    setCurrentSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentSlideIdx];

  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-black select-none">
      
      {/* Slide Image Background Layer with Zoom-Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1.0, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute inset-0 animate-fade-in"
          >
            <img
              src={getImgUrl(activeSlide.image)}
              alt={activeSlide.tag}
              className="w-full h-full object-cover select-none pointer-events-none opacity-100 brightness-[1.08] contrast-[1.10] saturate-[1.15] filter-gpu"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Dynamic Multi-layered overlay for optimal contrast - Lightened for absolute clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/15 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />
      </div>

      {/* Main Interactive Container */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Slide Text Content & Buttons (Expanded beautifully after removing benchmarks side-rail) */}
          <div className="lg:col-span-10 xl:col-span-9 flex flex-col justify-center">
            
            {/* Top Indicator / Slide Category Tag */}
            <div className="overflow-hidden mb-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -25, opacity: 0 }}
                  transition={{ duration: 0.50, ease: 'easeOut' }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2.5 h-2.5 bg-[#36B649] rounded-full animate-pulse shrink-0" />
                  <span className="text-xs md:text-sm font-black tracking-[0.25em] text-[#0083C9] uppercase">
                    {activeSlide.tag}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Huge Display Heading with slanted style */}
            <div className="overflow-hidden mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.65, delay: 0.05, ease: 'easeOut' }}
                >
                  <h1 className="text-white text-4.5xl sm:text-5xl md:text-7xl font-black leading-none uppercase tracking-tight italic">
                    {activeSlide.titleFirstLine} <br />
                    <span className="text-[#0083C9] not-italic font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0083C9] to-blue-400">
                      {activeSlide.titleSecondLine}
                    </span>
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Description Text with fine margins */}
            <div className="mb-10 max-w-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeSlide.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -45, opacity: 0 }}
                  transition={{ duration: 0.65, delay: 0.12, ease: 'easeOut' }}
                  className="text-gray-200 text-base md:text-lg leading-relaxed font-light shadow-sm"
                >
                  {activeSlide.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={() => {
                  const el = document.getElementById(activeSlide.primaryBtn.targetId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#0083C9] hover:bg-[#36B649] text-white px-9 py-4 font-black text-xs tracking-[0.2em] transition-all duration-300 shadow-xl shadow-[#0083C9]/15 flex items-center gap-3 group"
              >
                <span>{activeSlide.primaryBtn.text}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById(activeSlide.secondaryBtn.targetId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-transparent border border-white/30 text-white px-9 py-4 font-black text-xs tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center gap-3"
              >
                <span>{activeSlide.secondaryBtn.text}</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Control Navigation - Absolute Bottom Positioning */}
      <div className="absolute bottom-12 left-0 right-0 z-20 px-6 lg:px-12 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left/Right controls + slide count */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/15 bg-black/40 hover:bg-[#0083C9] hover:border-[#0083C9] hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/15 bg-black/40 hover:bg-[#36B649] hover:border-[#36B649] hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all duration-300"
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="text-xs font-mono font-bold text-white/50 tracking-widest flex items-center gap-1.5">
              <span className="text-white text-base">0{currentSlideIdx + 1}</span>
              <span>/</span>
              <span>0{HERO_SLIDES.length}</span>
            </div>
          </div>

          {/* Indicator Dot & Slide Progress Bars */}
          <div className="flex items-center gap-4 shrink-0">
            {HERO_SLIDES.map((slide, idx) => {
              const isSelected = idx === currentSlideIdx;
              return (
                <button
                  key={slide.id}
                  onClick={() => {
                    setProgress(0);
                    setCurrentSlideIdx(idx);
                  }}
                  className="flex flex-col items-start gap-1 p-2 group"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold font-mono tracking-tighter transition-colors ${
                      isSelected ? 'text-[#36B649]' : 'text-zinc-600 group-hover:text-zinc-400'
                    }`}>
                      0{idx + 1}
                    </span>
                  </div>
                  {/* Dynamic animated progress slider line bar */}
                  <div className="w-12 md:w-20 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
                    {isSelected && (
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: 'linear', duration: 0.1 }}
                        className="absolute inset-y-0 left-0 bg-[#0083C9]"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>

    </section>
  );
}
