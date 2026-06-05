import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Activity, Award, HelpCircle, Shield, ArrowRightLeft } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: '/src/assets/images/hero_stadium_turf_1779106585425.png',
    tag: 'THE ENTIRE PROJECT. FROM A SINGLE SOURCE.',
    titleFirstLine: 'POWERING MORE PLAY',
    titleSecondLine: 'WITH ELITE SPORTS TURF',
    description: 'Fast & Safe strictly manages the entire sports surface project lifecycle under one unified engineering framework—from initial soil test to manufacturing, construction, and certification.',
    bullets: [
      { label: 'DESIGN & CONSULT', value: 'Bespoke drafting' },
      { label: 'MANUFACTURE', value: 'Zero-heavy-metal fibers' },
      { label: 'CONSTRUCT', value: 'Laser-guided precision' },
      { label: 'SURFACING', value: 'Specialized geo-bonding' },
      { label: 'MAINTAIN', value: 'Extend turf limit' }
    ],
    primaryBtn: {
      text: 'EXPLORE OUR TECH',
      targetId: 'project-cycle'
    },
    secondaryBtn: {
      text: 'GET TURNKEY SOLUTION',
      service: 'Other / Turnkey Project',
      message: 'I am looking for a Turnkey sports field / general contracting engineering quote.'
    }
  },
  {
    id: 'slide-2',
    image: '/src/assets/images/bahrain_fifa_stadium_1779283699621.png',
    tag: 'WORLD-CLASS SPORTS SURFACES',
    titleFirstLine: 'ADVANCED ENGINEEERED',
    titleSecondLine: 'HYBRID TURF SYTEMS',
    description: 'Combining the beautiful tactile sensation and ball physics of natural grass with the structural integrity of synthetic turf. Designed and tailored to resist the intense heat of the Kingdom of Bahrain.',
    bullets: [
      { label: 'HYBRID STITCHING', value: '3x more playing hours' },
      { label: 'SUB-SOIL AIR', value: 'Vacuum active drainage' },
      { label: 'FIFA PRO SPECS', value: 'Standard ball bounce & roll' },
      { label: 'CLIMATE PROTECTION', value: 'Extreme UV defense' }
    ],
    primaryBtn: {
      text: 'VIEW EXPERTISE',
      targetId: 'expertise'
    },
    secondaryBtn: {
      text: 'INQUIRE HYBRID TURF',
      service: 'ARTIFICIAL GRASS INSTALLATION',
      message: 'I am interested in obtaining a quote and learning more about your FS-Grass® hybrid stitching sports pitch systems.'
    }
  },
  {
    id: 'slide-3',
    image: '/src/assets/images/turf_installation_workers_1779107984530.png',
    tag: 'TRUSTED BY THE SPORTS INDUSTRY',
    titleFirstLine: 'PURSUING THE POSSIBLE',
    titleSecondLine: 'THROUGH INTENSE HARDWORK',
    description: 'From concrete pool structures and securing palisade boundary fences to world-class sports arenas, we complete projects on-schedule, with pristine engineering, and rigorous focus on safety loops.',
    bullets: [
      { label: 'EST. 2010', value: '16 Years of Expertise' },
      { label: 'HEADQUARTERS', value: 'Manama, Bahrain' },
      { label: 'ZERO INCIDENT', value: 'OSHAS & ISO Compliance' },
      { label: '100% RELIABLE', value: 'Owner-operated heavy fleets' }
    ],
    primaryBtn: {
      text: 'SEE RECENT PROJECTS',
      targetId: 'portfolio'
    },
    secondaryBtn: {
      text: 'TALK TO AN ENGINEER',
      service: 'Engineering Consultation',
      message: 'I would like to arrange some technical sitework, custom drawings, or soil examination loops with your civil engineer.'
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
        <AnimatePresence mode="keepMounted">
          {HERO_SLIDES.map((slide, idx) => {
            if (idx !== currentSlideIdx) return null;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1.0, scale: 1.05 }}
                exit={{ opacity: 0, scale: 1.0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <img
                  src={getImgUrl(slide.image)}
                  alt={slide.tag}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Dynamic Multi-layered overlay for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 z-0" />
      </div>

      {/* Main Interactive Container */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Slide Text Content & Buttons (7 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            
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
                  className="text-gray-200 text-base md:text-lg leading-relaxed font-light"
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
                onClick={() => triggerConsultation(activeSlide.secondaryBtn.service, activeSlide.secondaryBtn.message)}
                className="bg-transparent border border-white/30 text-white px-9 py-4 font-black text-xs tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center gap-3"
              >
                <span>{activeSlide.secondaryBtn.text}</span>
              </button>
            </div>

          </div>

          {/* Quick Stats Grid Side-Rail (4 cols) - Hidden on mobile, beautiful on desktop */}
          <div className="lg:col-span-4 hidden lg:block overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 space-y-6"
              >
                <div className="border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black tracking-widest text-[#36B649] uppercase block mb-1">
                    ENGINEERING BENCHMARKS
                  </span>
                  <div className="text-white text-lg font-bold uppercase tracking-tight">Focus Standards</div>
                </div>

                <div className="space-y-4">
                  {activeSlide.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex justify-between items-center group/bullet border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                      <span className="text-[11px] font-bold text-gray-400 tracking-wider group-hover/bullet:text-[#0083C9] transition-colors uppercase">
                        {bullet.label}
                      </span>
                      <span className="text-xs font-mono font-medium text-white text-right">
                        {bullet.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
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
