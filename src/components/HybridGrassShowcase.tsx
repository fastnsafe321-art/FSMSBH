import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, HelpCircle, CheckCircle2, ArrowRight, Layers, Maximize2, Sparkles, ExternalLink } from 'lucide-react';

interface HybridGrassShowcaseProps {
  getImgUrl?: (path: string | undefined) => string;
}

export default function HybridGrassShowcase({ getImgUrl = (path) => path || '' }: HybridGrassShowcaseProps) {
  // Hotspots for high tech soil-cutaway interaction
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const hotspots = [
    {
      id: 1,
      x: '50%',
      y: '18%',
      title: 'Optimum Natural Grass Reinforcement',
      desc: 'Symmetric integration of elite natural grass blades with resilient synthetic fibers, creating a highly durable playing surface.'
    },
    {
      id: 2,
      x: '45%',
      y: '55%',
      title: 'Patented >50% Voids Backing',
      desc: 'A uniquely engineered porous grid backing allowing unobstructed natural grass roots to pass through seamlessly.'
    },
    {
      id: 3,
      x: '52%',
      y: '78%',
      title: 'Extensive Root Anchorage',
      desc: 'Durable, deep-anchored root system expanding deep into the soil matrix for superior shear strength and turf stability.'
    }
  ];

  return (
    <section id="hybridgrass" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Brochure Cloned Header Bar */}
        <div className="border-b-2 border-gray-150 pb-6 mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Logo Brand Group */}
          <div className="flex items-center gap-3">
            {/* Logo Graphic Brand */}
            <div className="flex items-center gap-2">
              <svg className="w-10 h-10 text-[#36B649]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-3.5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1.45.45 1.45 1v4c0 .55-.45 1-1.45 1z" className="opacity-15" />
                <path d="M3 14c2-1 4.5-2 7-1.5s5 2 7.5.5 3.5-3.5 3.5-3.5S19 12 16.5 11s-4.5-2.5-7-2-5 3.5-6.5 5zm0 4.5c2-1 4.5-2 7-1.5s5 2.5 7.5 1.5 3.5-4 3.5-4S19 16 16.5 15s-4.5-3-7-2.5S4.5 17 3 18.5z" />
              </svg>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-[#36B649] tracking-tight font-sans">HYBRID</span>
                <span className="text-2xl font-black text-gray-900 tracking-tight font-sans">GRASS</span>
              </div>
            </div>

            {/* Cloned Diagonal Slash */}
            <div className="hidden sm:block text-4xl font-extralight text-[#36B649] px-2 select-none transform rotate-12 scale-y-125">
              /
            </div>
          </div>

          {/* Cloned Brochure Right Title */}
          <div>
            <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase block md:text-right">Product Standard</span>
            <h2 className="text-lg md:text-2xl font-bold text-gray-700 tracking-wide font-sans">
              What is HYBRIDGRASS System
            </h2>
          </div>
        </div>

        {/* Stunning Real-World Installation Visual Showcase */}
        <div className="mb-16 overflow-hidden rounded-[40px] relative h-[420px] md:h-[500px] shadow-2xl group border border-gray-100">
          <img
            src={getImgUrl('/src/assets/images/highly_visible_hybrid_grass_1781680138763.jpg')}
            alt="Advanced Hybrid Turf Brushing & Topdressing Detail with highly visible grass"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
          />
          {/* Elegant Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent flex flex-col justify-end p-8 md:p-12">
            <div className="max-w-3xl space-y-4">
              <span className="text-[10px] text-white bg-[#36B649] border border-[#36B649]/20 px-4 py-2 font-black tracking-[0.25em] uppercase rounded-full inline-flex items-center gap-2 font-mono shadow-md w-fit">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                ACTIVE MATRIX INTEGRATION
              </span>
              <h3 className="text-3.5xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight font-sans">
                Hybrid Grass Technology
              </h3>
              <p className="text-sm md:text-base text-gray-200 font-normal leading-relaxed font-sans">
                HYBRID GRASS carpet is installed on a carefully selected root zone layer and filled with a specifically defined root zone mixture before high quality sports field grass is seeded into the surface.
                <br /><br />
                The natural grass grows between the synthetic grass fibers creating a strong and vigorous playing surface. The ‘open’ texture of the backing ensures that the grass roots are not obstructed in their vertical movement downwards. FIFA Quality Program for Natural Pitches
              </p>
            </div>
          </div>
        </div>

        {/* Cloned Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Area (lg:col-span-6): Isometric Soil Cutaway with interactive hotspots */}
          <div className="lg:col-span-6 space-y-8">
            <div className="relative bg-gray-50 border border-gray-150 rounded-[40px] p-6 md:p-8 overflow-hidden shadow-2xl group">

              {/* Core 3D Cutaway Image */}
              <div className="relative aspect-square max-h-[500px] mx-auto flex items-center justify-center">
                <img
                  src={getImgUrl('/src/assets/images/hybrid_soil_block_clone_1781513567584.jpg')}
                  alt="Hybridgrass Soil Cutaway Blueprint"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-2xl select-none mix-blend-multiply group-hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Hotspot Indicators */}
                {hotspots.map((spot) => (
                  <div
                    key={spot.id}
                    className="absolute"
                    style={{ left: spot.x, top: spot.y }}
                  >
                    <button
                      onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                      onMouseEnter={() => setActiveHotspot(spot.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        activeHotspot === spot.id 
                          ? 'bg-[#36B649] text-white scale-110 shadow-lg shadow-[#36B649]/30' 
                          : 'bg-black/80 hover:bg-[#36B649] text-white border-2 border-white animate-pulse'
                      }`}
                      title={spot.title}
                    >
                      <HelpCircle size={14} />
                    </button>

                    {/* Popover Card */}
                    <AnimatePresence>
                      {activeHotspot === spot.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-64 bg-slate-900 text-white rounded-2xl p-4 border border-white/10 shadow-xl pointer-events-none"
                        >
                          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-white/10 transform rotate-45"></div>
                          <h4 className="text-xs font-black tracking-wider uppercase text-[#36B649] mb-1.5">{spot.title}</h4>
                          <p className="text-[11px] text-gray-300 leading-relaxed font-normal">{spot.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Magnifier glass instructions watermark */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <span className="inline-block bg-white/90 border border-gray-200/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] text-gray-500 font-mono tracking-wider shadow-sm select-none">
                  🔬 Hover / Click indicators for detailed layers
                </span>
              </div>
            </div>

            {/* Bottom Inset Box: Backing Detail Exhibit */}
            <div className="bg-gray-50 border border-gray-150 rounded-[32px] p-6 flex flex-col sm:flex-row gap-6 items-center shadow-md">
              <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-white group/backing relative">
                <img
                  src={getImgUrl('/src/assets/images/hybrid_backing_detail_1781513147278.jpg')}
                  alt="Patented open voids detail closeup"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/backing:scale-115 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/backing:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 size={14} className="text-white" />
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#36B649] uppercase block">PATENTED TECHNOLOGY</span>
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Macro-porous Tufting System Detail</h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  Our customized structural backing includes over 50% physical voids per square meter, promoting root breathing and enabling strong hydraulic filtration without pooling.
                </p>
              </div>
            </div>
          </div>

          {/* Right Area (lg:col-span-6): Brochure Copy blocks */}
          <div className="lg:col-span-6 space-y-12">
            
            {/* System Description Copy block */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#36B649] uppercase block font-mono">SPECIFICATION 01</span>
                <h3 className="text-2xl md:text-3.5xl font-black text-gray-900 tracking-tight leading-none uppercase">
                  Elite Hybridgrass System
                </h3>
                <div className="w-12 h-1 bg-[#36B649] rounded-full"></div>
              </div>

              {/* Bullet list with custom styled empty circles exactly like the brochure photo */}
              <ul className="space-y-4">
                {[
                  'is the optimum natural grass reinforcement system',
                  'consists of high-quality synthetic grass fibers, tufted in a special patented backing incorporating over 50% voids',
                  'enhances the growing conditions of the natural grass'
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    {/* Cloned empty circle bullet marker */}
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#36B649]/80 shrink-0 mt-1.5 focus:outline-none"></div>
                    <span className="text-sm md:text-base text-gray-600 leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* System Benefits block */}
            <div className="space-y-6 pt-6 border-t border-gray-150">
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#36B649] uppercase block font-mono">SPECIFICATION 02</span>
                <h3 className="text-2xl md:text-3.5xl font-black text-gray-900 tracking-tight leading-none uppercase flex items-baseline gap-1.5">
                  Elite Hybridgrass System <span className="text-base lowercase font-normal text-gray-500 font-sans">provides</span>
                </h3>
                <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
              </div>

              {/* Bullet list with custom styled empty circles */}
              <ul className="space-y-4">
                {[
                  'Optimum surface coverage',
                  'Great root development and anchorage',
                  'Ease of installation',
                  'Risk mitigation in the absence of natural grass blades',
                  'Superior tuft lock'
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    {/* Cloned empty circle bullet marker */}
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-[#36B649]/80 shrink-0 mt-1.5"></div>
                    <span className="text-sm md:text-base text-gray-600 font-medium tracking-wide">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Local Bahrain Project Application Highlight */}
            <div className="bg-gradient-to-br from-gray-50 to-emerald-50/20 rounded-[32px] p-6 border border-[#36B649]/15 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#36B649]/5 rounded-bl-[100px] pointer-events-none"></div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#36B649]/10 text-[#36B649] flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#36B649]">Bahrain Elite Arena Certified</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                As the leading certified partner of original global sports tech in the Kingdom of Bahrain, Fast & Safe Maintenance Services delivers premium Hybridgrass systems engineered precisely to FIFA Quality Pro tender guidelines. Perfect for national stadiums, school grounds, and custom residential compounds.
              </p>
              <div className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#36B649] hover:text-black transition-colors"
                >
                  <span>Request Technical Specifications Brochure</span>
                  <ArrowRight size={12} />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Brochure Footer Bar */}
        <div className="mt-20 pt-6 border-t border-gray-150 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Contact Link */}
          <div className="text-xs font-medium text-gray-400 flex items-center gap-1 font-mono">
            <span>Official Info:</span>
            <span className="text-gray-500 font-bold">FIFA Quality Pro Specifications</span>
          </div>

          {/* Right: Green Pattern Gradient diagonal banner */}
          <div className="w-full md:w-80 h-10 bg-gradient-to-r from-emerald-500 from-10% via-green-500 via-60% to-[#36B649] rounded-l-full relative overflow-hidden flex items-center justify-end px-6 shadow-inner hidden sm:flex">
            <span className="text-[10px] text-white font-mono tracking-widest font-black uppercase">
              FS-GRASS SPORTS SHIELD®
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
