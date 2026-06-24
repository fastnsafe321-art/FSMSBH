import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Compass, Factory, Hammer, Layers, Cpu, Wind, Droplet, Flame, ArrowRight, ShieldAlert, Shield, Sprout } from 'lucide-react';

interface PremiumPitchesTechProps {
  getImgUrl?: (path: string | undefined) => string;
}

// Specialized Natural / Hybrid Systems
const NATURAL_SYSTEMS = [
  {
    id: 'hybrid',
    name: 'Natural Grass - Hybrid Stitching',
    tagline: 'FS-Grass® Hybrid Stitching & Sub-Air Sub-base',
    icon: Cpu,
    color: '#36B649',
    image: '/src/assets/images/hybrid_soil_block_clone_1781513567584.jpg',
    techSpecs: 'Combines elite certified natural grass with precision synthetic yarn stitching, fully integrated with Sub-Air active aeration.',
    description: 'Our premium Hybrid Stitching System pairs natural grass with custom-engineered vertical synthetic fiber reinforcement, built atop an active Sub-Air ventilation grid. This ensures perfect traction, extreme durability, and advanced moisture management.',
    benefits: [
      'Allows up to 3x more playing hours than 100% natural grass pitches',
      'Synthetic strands hold grass roots firmly, preventing divots and tears',
      'Fully integrated with lower Sub-Air aeration layers and stone sub-base',
      'Designed to endure regional Bahrain climate stress under professional use'
    ],
    cases: 'Used at premier municipal sports grounds and stadium installations.'
  },
  {
    id: 'air',
    name: 'Natural Grass - Sub-Air Aeration System',
    tagline: 'Under-Soil Active Climate & Suction Tech',
    icon: Wind,
    color: '#36B649',
    image: '/src/assets/images/sub_pitch_aeration_1779789441283.png',
    techSpecs: 'Active pressure and vacuum induction blower running high-rate root aeration cycles.',
    description: 'An advanced vacuum and blower network embedded in the aggregate sub-base. The Sub-Air system injects fresh oxygen, regulates soil rootzone temperatures in hot desert climates, and extracts water rapidly from the surface.',
    benefits: [
      'Forcibly feeds rich ambient oxygen directly to grass rootzones',
      'Draws down surface water rapidly during high-density precipitation',
      'Maintains cooler root levels during hot midday summer seasons',
      'Drastically increases turf lifespan and recovery rate after intense play'
    ],
    cases: 'The ultimate under-soil active system for premium natural pitches in Bahrain.'
  },
  {
    id: 'drainage',
    name: 'Natural Grass - DrainTalent™ Vacuum System',
    tagline: 'Active Vacuum Water Extraction',
    icon: Droplet,
    color: '#36B649',
    image: '/src/assets/images/drainage_trench_blurred_1779790511693.png',
    techSpecs: 'High-volume vacuum extractors removing up to 40 liters per square meter per minute.',
    description: 'Continuous smart-monitored vacuum extraction that pulls gravity water out of the playing surface faster than typical gravity drainage. Ideal for tackling sudden rainfall, preventing surface water accumulation, and recycling water into irrigation loops.',
    benefits: [
      'Eliminates playing delays caused by ponding or surface water logging',
      'Re-oxygenates saturated turf instantly, preventing root suffocation',
      'Controls ground moisture level with custom smart telemetry presets',
      'Recovers and filters water for reuse in automatic irrigation systems'
    ],
    cases: 'Perfect for elite training facilities requiring 24/7 pitch availability.'
  },
  {
    id: 'heating',
    name: 'Natural Grass - Geothermal Control',
    tagline: 'Root-Zone Microclimatic Warming',
    icon: Flame,
    color: '#36B649',
    image: '/src/assets/images/geothermal_heating_pipes_1779790335777.png',
    techSpecs: 'High-density under-turf pipe network circulating hydronic heating fluid at 15-22°C.',
    description: 'An advanced underground piping grid that circulates warm water directly beneath the turf. This maintains stable geothermal warmth, prevents dew condensation on synthetic fibers, and stimulates natural grass growth during cold regional winter seasons.',
    benefits: [
      'Maintains perfect soil spring-like temperatures of 15°C across cold winter months',
      'Accelerates seed germination and shortens installation turnaround loops',
      'Minimizes regional early-morning humidity dew on synthetic grass materials',
      'Shields delicate hybrid natural turf from frost shock and root decay'
    ],
    cases: 'Available on-demand for stadium sports pitches and luxury racecourses.'
  }
];

// Specialized Artificial / Synthetic Systems
const ARTIFICIAL_SYSTEMS = [
  {
    id: 'synthetic-turf',
    name: 'Artificial Grass - Resilience Pro',
    tagline: 'Triple-Spine Synthetic Grass Carpet',
    icon: Layers,
    color: '#0083C9',
    image: '/src/assets/images/artificial_turf_macro_1779106602495.png',
    techSpecs: '100% Polyethylene fiber extrusion, 12,000 Dtex density, verified for 150,000 cycles on Lisport wear tester.',
    description: 'Our flagship elite synthetic grass system. Built using a unique diamond triple-spine blade shape that stands naturally upright under extreme sports traffic. Engineered with high-level thermal stabilizers and customized pigments to withstand intense solar heat cycles without structural decay.',
    benefits: [
      'High-grade polymer formula prevents fiber splitting and premature matting',
      'Advanced double polyurethane backing guarantees exceptional fiber lock values',
      'Superior texture treatment significantly reduces surface temperature matching friction skin protection',
      'Permeability rated over 2,200mm/hour to easily shed sudden rainfall blocks'
    ],
    cases: 'The premier artificial grass choice for top-tier councils and school sports compounds.'
  },
  {
    id: 'shockpad',
    name: 'Artificial Grass - Performance Shockpad',
    tagline: 'Elite G-Max Attenuation Layer',
    icon: Shield,
    color: '#0083C9',
    image: '/src/assets/images/turf_installation_detail_1779112799699.png',
    techSpecs: '12mm cross-linked closed-cell polyolefin elastic foam with dual-sided expansion vectors.',
    description: 'An engineered elastic cushion layer placed directly underneath the artificial grass rolls. It maintains persistent sports surface leveling and absorbs up to 60% of player terminal fall impact, ensuring a constant, predictable athletic match standard year-round.',
    benefits: [
      'Delivers certified G-Max shock reduction that shields knees, ankles, and delicate joints',
      'Maintains perfect and consistent ball bounce/roll standard under FIFA Quality Pro specifications',
      'Hydro-engineered drainage channels direct water instantly to underground drains',
      'Guarantees artificial turf longevity by preventing direct subbase stone friction'
    ],
    cases: 'Highly recommended for 3G rugby, football, and academic multi-use activity grounds.'
  },
  {
    id: 'infill',
    name: 'Artificial Grass - Performance Organic Infill',
    tagline: 'Eco-performance Sorb & Sand Matrix',
    icon: Sprout,
    color: '#0083C9',
    image: '/src/assets/images/artificial_turf_brushing_1779108281366.png',
    techSpecs: 'Kiln-dried high-purity sub-angular quartz sand paired with premium clean EPDM organic infill.',
    description: 'Clean, heavy-metal-free granule infill matrix engineered for superior traction control, maximum heat mitigation, and odor resistance. Delivers natural grass running resistance under extreme foot friction conditions.',
    benefits: [
      'Exceptional structural support for yarn fibers keeping them standing straight',
      'Provides excellent rotational resistance conforming to professional sport parameters',
      'Nontoxic, heavy-metal-free, and 100% safe for school field setups',
      'Provides cool-deck style heat mitigation keeping overall turf temperature optimized'
    ],
    cases: 'Standard install parameter for high-traffic multi-sport campuses in Sitra & Riffa.'
  },
  {
    id: 'drainflow',
    name: 'Artificial Grass - Elastic Sub-Base',
    tagline: 'Synthetic Dynamic Water Drainage',
    icon: Wind,
    color: '#0083C9',
    image: '/src/assets/images/elastic_sub_base_1781172457822.png',
    techSpecs: 'Sub-surface high-flow dynamic water transmission with geotextile filtration layers.',
    description: 'A dedicated gravel and dynamic base structure engineered for high-performance artificial grass. Combines specific sub-base slope grading with geonetted filtration grids so water never accumulates or creates low-level pooling on synthetic fibers.',
    benefits: [
      'Allows 100% horizontal and vertical drainage flow across the whole field',
      'Includes premium civil geogrid nets preventing soil shifting or sliding',
      'Shields against sand-infill erosion during sudden winter rains in Manama',
      'Reduces total structural maintenance cycles for school sports facilities'
    ],
    cases: 'Standard layout for municipal community turf fields and club padel courts.'
  }
];

// Single source steps
const SINGLE_SOURCE_STEPS = [
  {
    number: '01',
    title: 'DESIGN & CONSULT',
    icon: Compass,
    desc: 'Bespoke design services, CAD drafting, and soil structure testing from our Sitra & Manama engineering divisions to construct custom drainage maps.',
    detail: 'We carry out exhaustive site topography mapping, local wind analyses, and soil chemical indexing. This allows our civil engineers to create a tailor-made sub-base schematic perfectly suited to Bahrain climates.'
  },
  {
    number: '02',
    title: 'CONSTRUCT & BASE',
    icon: Hammer,
    desc: 'Heavyduty site preparation, laser-guided grading, concrete works, and subbase civil engineering with OSHAS and ISO 45001 safety control.',
    detail: 'Our heavy excavation fleets perform multi-layer subbase packing, installing exact grading slopes, geosynthetic membranes, and premium porous stone layers for robust water disposal.'
  },
  {
    number: '03',
    title: 'SURFACING & INSTALL',
    icon: Layers,
    desc: 'Expert unrolling, laser-guided carpet seam fusion, infill spreading, and FS-Grass® hybrid stitching machinery deployed on site.',
    detail: 'Our technical teams join seams with exact geo-bonded adhesive matrices. Specialized infill machines distribute kiln-dried quartz sand and elastic EPDM rubber granules within 1mm tolerances.'
  },
  {
    number: '04',
    title: 'FASTSAFE MAINTAIN',
    icon: Hammer,
    desc: 'Comprehensive post-delivery support, premium custom laser-brushing, infill depth auditing, and structural field deep cleaning.',
    detail: 'We provide specialized turf grooming, deep cleaning, and compaction-release aeration services to extend the field life loop beyond 12+ years and maintain elite FIFA-grade certification.'
  }
];

export default function PremiumPitchesTech({ getImgUrl }: PremiumPitchesTechProps) {
  const resolveImg = (path: string | undefined): string => {
    if (!path) return '';
    if (getImgUrl) {
      return getImgUrl(path);
    }
    return path.replace(/^\/src\/assets\/images\//, '/assets/images/');
  };

  const [activeCategory, setActiveCategory] = useState<'natural' | 'artificial'>('natural');
  const [activeSystemId, setActiveSystemId] = useState<string>('hybrid');
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const systems = activeCategory === 'natural' ? NATURAL_SYSTEMS : ARTIFICIAL_SYSTEMS;
  const activeSystem = systems.find(s => s.id === activeSystemId) || systems[0];

  const handleCategoryChange = (category: 'natural' | 'artificial') => {
    setActiveCategory(category);
    const targetSystems = category === 'natural' ? NATURAL_SYSTEMS : ARTIFICIAL_SYSTEMS;
    setActiveSystemId(targetSystems[0].id);
  };

  return (
    <section className="bg-zinc-950 text-white py-24 border-t border-b border-zinc-900 overflow-hidden relative">
      {/* Background Visual Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-[0.22]"
        style={{ backgroundImage: `url(${resolveImg('/src/assets/images/sports_engineering_backdrop_1781171108769.png')})` }}
      />
      {/* Subtle vignettes and glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-zinc-950 opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,131,201,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(54,182,73,0.05),transparent_60%)]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 block">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[#0083C9] block mb-3">
            TECHNICAL SPECIFICATIONS GRID
          </span>
          <h2 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase">
            Advanced Engineered Sports Surface <span className="text-[#36B649]">Technologies</span>
          </h2>
          <p className="text-gray-400 mt-4 text-sm md:text-base leading-relaxed">
            By adapting award-winning field patterns from elite international arenas, we deliver custom high-performance pitch technology engineered specifically for the Kingdom of Bahrain. Discover our interactive technology suite and single-source delivery pipeline.
          </p>
          <div className="w-24 h-1 bg-[#0083C9] mt-6" />
        </div>

        {/* Dynamic Segregation Tab Selector with Natural Grass & Hybrid and Artificial Grass & Synthetic labels */}
        <div className="flex flex-col sm:flex-row gap-4 border-b border-white/5 pb-8 mb-16 justify-between items-start sm:items-center">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase block mb-1">
              CHOOSE FIELD CATEGORY TYPE
            </span>
            <span className="text-xs text-zinc-400 font-sans">
              Filter elite turf systems built to withstand specialized athletic use.
            </span>
          </div>

          <div className="flex p-1 bg-zinc-900/60 rounded-2xl border border-white/5 w-full sm:w-auto">
            <button
              onClick={() => handleCategoryChange('natural')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 ${
                activeCategory === 'natural'
                  ? 'bg-[#36B649] text-white shadow-lg shadow-[#36B649]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Sprout size={14} className={activeCategory === 'natural' ? 'animate-bounce' : ''} />
              <span>Natural Grass & Hybrid</span>
            </button>
            <button
              onClick={() => handleCategoryChange('artificial')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all duration-300 ${
                activeCategory === 'artificial'
                  ? 'bg-[#0083C9] text-white shadow-lg shadow-[#0083C9]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Layers size={14} className={activeCategory === 'artificial' ? 'animate-pulse' : ''} />
              <span>Artificial Grass & Synthetic</span>
            </button>
          </div>
        </div>

        {/* Part 1: Interactive Pitch Systems Section (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-28">
          
          {/* System Selection List (5 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold tracking-widest text-zinc-500 uppercase block mb-2">
                ACTIVE ENGINEERING MODULES
              </span>
              <div className="space-y-3">
                {systems.map((sys) => {
                  const Icon = sys.icon;
                  const isSelected = activeSystemId === sys.id;
                  const activeBgStyle = activeCategory === 'natural' 
                    ? 'bg-[#36B649]/10 border-[#36B649] shadow-[0_4px_20px_rgba(54,182,73,0.15)]' 
                    : 'bg-[#0083C9]/10 border-[#0083C9] shadow-[0_4px_20px_rgba(0,131,201,0.15)]';
                  
                  const activeIconStyle = activeCategory === 'natural' ? 'bg-[#36B649]' : 'bg-[#0083C9]';

                  return (
                    <button
                      key={sys.id}
                      onClick={() => setActiveSystemId(sys.id)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                        isSelected 
                          ? activeBgStyle 
                          : 'bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/80'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isSelected ? `${activeIconStyle} text-white` : 'bg-zinc-800 text-gray-400 group-hover:text-white'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm tracking-wide transition-colors truncate ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                          {sys.name}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1 truncate">
                          {sys.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 hidden lg:block mt-6">
              <div className="flex items-start gap-3">
                <ShieldAlert size={18} className="text-[#36B649] shrink-0 mt-0.5" />
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  All systems conform strictly to FIFA Quality Pro, World Rugby, and FIH international certification criteria.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Dynamic Display Panel (8 cols) - Dual Column Layout inside containing rich specifications and illustrations */}
          <div className="lg:col-span-8 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-[32px] p-8 md:p-11 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              activeCategory === 'natural' ? 'bg-[#36B649]/5' : 'bg-[#0083C9]/5'
            }`} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSystem.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Header Tag */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className={`text-[9px] font-extrabold tracking-[0.2em] px-3.5 py-1 rounded-full uppercase border ${
                    activeCategory === 'natural'
                      ? 'bg-[#36B649]/10 border-[#36B649]/30 text-[#36B649]'
                      : 'bg-[#0083C9]/10 border-[#0083C9]/30 text-[#0083C9]'
                  }`}>
                    Elite Base System &bull; {activeCategory === 'natural' ? 'Natural Grass & Hybrid' : 'Artificial Grass & Synthetic'}
                  </span>
                  <div className="text-[10px] text-zinc-500 font-mono uppercase bg-zinc-950 border border-white/5 px-3 py-1 rounded-lg">
                    Tech ID: {activeSystem.id.toUpperCase()}-CY-2026
                  </div>
                </div>

                {/* Main Titles */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                    {activeSystem.name}
                  </h3>
                  <div className={`text-xs font-bold mt-2 font-mono uppercase tracking-widest ${
                    activeCategory === 'natural' ? 'text-[#36B649]' : 'text-[#0083C9]'
                  }`}>
                    {activeSystem.tagline}
                  </div>
                </div>

                {/* Inside Grid: Left Content (7 Cols) and Right Image Preview (5 Cols) on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Specs Narrative (7 cols) */}
                  <div className="md:col-span-7 space-y-6">
                    {/* Calibration Spec Box */}
                    <div className="bg-zinc-950/80 border border-white/5 p-4 rounded-xl">
                      <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                        Engineering Spec Benchmark
                      </div>
                      <p className="text-xs text-gray-300 font-mono leading-relaxed">
                        {activeSystem.techSpecs}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-450 text-xs md:text-sm leading-relaxed font-sans">
                      {activeSystem.description}
                    </p>

                    {/* Bullet list of advantages */}
                    <div className="space-y-2.5 pt-2">
                      {activeSystem.benefits.map((benefit, bIdx) => {
                        const ringColorStyle = activeCategory === 'natural'
                          ? 'bg-[#36B649]/10 border-[#36B649]/30 text-[#36B649]'
                          : 'bg-[#0083C9]/10 border-[#0083C9]/30 text-[#0083C9]';
                        return (
                          <div key={bIdx} className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${ringColorStyle}`}>
                              <Check size={9} strokeWidth={3} />
                            </div>
                            <span className="text-[11px] text-gray-300 font-medium leading-relaxed">{benefit}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Premium Illustration/Image Preview (5 cols) */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full border border-white/10 group-hover:border-white/20 shadow-xl bg-zinc-900 group">
                      <img
                        src={resolveImg(activeSystem.image)}
                        alt={activeSystem.name}
                        className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-3 left-3 text-[8px] font-mono font-bold tracking-widest text-[#36B649] block uppercase p-1.5 rounded bg-black/75 backdrop-blur-sm border border-[#36B649]/20">
                        System deployment sight
                      </span>
                    </div>

                    <div className="bg-zinc-950/50 rounded-xl p-3 border border-white/5">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">
                        Installation Site Control
                      </span>
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                        Precision-matched to Bahrain temperature levels, high UV indices, and moisture loads.
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Panel Actions */}
            <div className="pt-6 mt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-zinc-500 font-mono">
                {activeSystem.cases}
              </span>
              <button
                onClick={() => {
                  const targetSelect = document.getElementById('expertise');
                  if (targetSelect) {
                    targetSelect.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-colors border-b pb-0.5 ${
                  activeCategory === 'natural' 
                    ? 'text-[#36B649] hover:text-[#0083C9] border-[#36B649]/30' 
                    : 'text-[#0083C9] hover:text-[#36B649] border-[#0083C9]/30'
                }`}
              >
                <span>Inquire About This Turf System</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* Part 2: Single Source Project Cycle Section */}
        <div id="project-cycle" className="rounded-[40px] bg-gradient-to-b from-zinc-900/50 to-zinc-950 border border-white/5 p-8 md:p-14 relative z-10">
          <div className="max-w-xl mb-12">
            <span className="text-[#36B649] font-extrabold text-xs tracking-widest uppercase block mb-2">
              THE FULL VALUE PIPELINE
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight italic">
              The Entire Project, <span className="text-[#0083C9]">From A Single Source</span>
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm mt-3 leading-relaxed">
              Fast & Safe strictly manages and integrates the entire sports surface project lifecycle under one unified engineering framework—from initial soil test and draft design files to construction, installation, and long-term certified deep cleans. No external contractors, complete OSHAS accountability.
            </p>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {SINGLE_SOURCE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActiveStep = activeStepIdx === idx;
              return (
                <div
                  key={step.number}
                  onMouseEnter={() => setActiveStepIdx(idx)}
                  className={`bg-zinc-900/40 border p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between group cursor-pointer relative ${
                    isActiveStep 
                        ? 'border-[#0083C9] bg-zinc-900/80 shadow-[0_8px_30px_rgba(0,131,201,0.15)]' 
                        : 'border-white/5 hover:border-white/10 hover:bg-zinc-900/60'
                  }`}
                >
                  <div>
                    {/* Header: step number + icon */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="text-2xl font-black font-mono tracking-tighter text-zinc-700 group-hover:text-[#0083C9] transition-colors">
                        {step.number}
                      </span>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActiveStep ? 'bg-[#0083C9] text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-white'
                      }`}>
                        <Icon size={18} />
                      </div>
                    </div>

                    {/* Titles */}
                    <h4 className="font-bold text-sm text-white tracking-wide uppercase mb-3">
                      {step.title}
                    </h4>
                    
                    {/* Desc text */}
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Dynamic indicator bar */}
                  <div className={`w-full h-1 rounded-full mt-6 transition-all duration-300 ${
                    isActiveStep ? 'bg-[#0083C9]' : 'bg-zinc-800 group-hover:bg-zinc-700'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Interactive full text view of current hover step */}
          <div className="bg-zinc-950/60 border border-white/5 rounded-2xl p-6 mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-[#0083C9] uppercase tracking-widest block">
                Deep Dive: Step {SINGLE_SOURCE_STEPS[activeStepIdx].number} Breakdown
              </span>
              <p className="text-xs text-zinc-300 max-w-4xl leading-relaxed">
                {SINGLE_SOURCE_STEPS[activeStepIdx].detail}
              </p>
            </div>
            
            <button
              onClick={() => {
                const contactSec = document.getElementById('contact');
                if (contactSec) {
                  contactSec.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-zinc-90 w-full md:w-auto hover:bg-[#0083C9] border border-white/10 rounded-xl px-5 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-all shrink-0"
            >
              Discuss This Stage
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
