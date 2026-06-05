import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sprout, Wind, Droplet, Layers, Cpu, CheckCircle2, Waves, Thermometer, ShieldCheck, Zap, Power, Play, RotateCcw, Activity } from 'lucide-react';

interface NaturalGrassShowcaseProps {
  getImgUrl?: (path: string | undefined) => string;
}

export default function NaturalGrassShowcase({ getImgUrl = (path) => path || '' }: NaturalGrassShowcaseProps) {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  
  // Tactical Sub-Air System Simulation States
  const [simMode, setSimMode] = useState<'off' | 'aeration' | 'vacuum'>('off');
  const [soilO2, setSoilO2] = useState<number>(14.2);
  const [rootTemp, setRootTemp] = useState<number>(35.0);
  const [moisture, setMoisture] = useState<number>(45);
  const [airflow, setAirflow] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (simMode === 'off') {
        setSoilO2(prev => {
          const target = 14.2;
          const diff = target - prev;
          const step = diff * 0.15 + (Math.random() - 0.5) * 0.05;
          return Number(Math.max(10, Math.min(25, prev + step)).toFixed(1));
        });
        setRootTemp(prev => {
          const target = 35.0;
          const diff = target - prev;
          const step = diff * 0.15 + (Math.random() - 0.5) * 0.05;
          return Number(Math.max(20, Math.min(45, prev + step)).toFixed(1));
        });
        setMoisture(prev => {
          const target = 45;
          const diff = target - prev;
          const step = diff * 0.15;
          return Math.max(0, Math.min(100, Math.round(prev + step)));
        });
        setAirflow(prev => {
          const target = 0;
          const diff = target - prev;
          return Math.round(prev + diff * 0.3);
        });
      } else if (simMode === 'aeration') {
        setSoilO2(prev => {
          const target = 21.6;
          const diff = target - prev;
          const step = diff * 0.15 + (Math.random() - 0.5) * 0.05;
          return Number(Math.max(10, Math.min(25, prev + step)).toFixed(1));
        });
        setRootTemp(prev => {
          const target = 27.2;
          const diff = target - prev;
          const step = diff * 0.15 + (Math.random() - 0.5) * 0.05;
          return Number(Math.max(20, Math.min(45, prev + step)).toFixed(1));
        });
        setMoisture(prev => {
          const target = 22;
          const diff = target - prev;
          const step = diff * 0.12;
          return Math.max(0, Math.min(100, Math.round(prev + step)));
        });
        setAirflow(prev => {
          const target = 4850;
          const diff = target - prev;
          const noise = (Math.random() - 0.5) * 15;
          return Math.round(prev + diff * 0.25 + noise);
        });
      } else if (simMode === 'vacuum') {
        setSoilO2(prev => {
          const target = 15.1;
          const diff = target - prev;
          const step = diff * 0.15 + (Math.random() - 0.5) * 0.05;
          return Number(Math.max(10, Math.min(25, prev + step)).toFixed(1));
        });
        setRootTemp(prev => {
          const target = 31.8;
          const diff = target - prev;
          const step = diff * 0.15 + (Math.random() - 0.5) * 0.05;
          return Number(Math.max(20, Math.min(45, prev + step)).toFixed(1));
        });
        setMoisture(prev => {
          const target = 4;
          const diff = target - prev;
          const step = diff * 0.2;
          return Math.max(0, Math.min(100, Math.round(prev + step)));
        });
        setAirflow(prev => {
          const target = -5200;
          const diff = target - prev;
          const noise = (Math.random() - 0.5) * 20;
          return Math.round(prev + diff * 0.25 + noise);
        });
      }
    }, 150);

    return () => clearInterval(interval);
  }, [simMode]);

  const systemLayers = [
    {
      num: 1,
      name: 'Natural Grass',
      desc: 'Certified elite sports turf cultivars (such as Bermuda or Paspalum hybrid) giving premium tactile ball physics and superior player safety.'
    },
    {
      num: 2,
      name: 'Synthetic Fibres',
      desc: 'Custom-engineered UV-stable synthetic yarns stitched up to 20cm deep into the rootzone, forming an unbreakable anchor for roots.'
    },
    {
      num: 3,
      name: 'Infill (Sand & Organic)',
      desc: 'A tailored blend of angular quartz sand and premium organic matter to support upright fiber positioning and keep turf resilient.'
    },
    {
      num: 4,
      name: 'Rootzone (Sand-Based)',
      desc: 'A dense 100-150mm engineering sandy zone permitting optimal aeration and rapid deep root-system anchoring.'
    },
    {
      num: 5,
      name: 'Drainage Layer',
      desc: 'Active gravel network allowing moisture to pass through instantly, eliminating vertical water stagnation.'
    },
    {
      num: 6,
      name: 'Sub-Base & Sub-Air Grid',
      desc: 'Sub-base rock foundation containing integrated high-tech aeration drainage pipes connected to custom active blowers.'
    }
  ];

  const subAirFeatures = [
    {
      icon: Wind,
      title: 'Active Root Oxygenation',
      desc: 'Pumps fresh ambient oxygen directly into the stone sub-base. Maximizes aeration density, promoting rapid root respiration and preventing soil compaction.'
    },
    {
      icon: Thermometer,
      title: 'Under-Soil Heat Control',
      desc: 'Actively mitigates midday summer root bake. Circulates temperature-regulated air to cool the rootzone by up to 8°C in harsh Bahrain desert conditions.'
    },
    {
      icon: Droplet,
      title: 'Vacuum Water Extraction',
      desc: 'Creates high-volume negative suction pressure to draw standing moisture downwards. Can extract stormwater from the pitch surface within 12 minutes.'
    },
    {
      icon: Waves,
      title: 'Root Disease Mitigation',
      desc: 'Maintains ideal moisture balance under turf. Highly effective at preventing fungal decay, root suffocation, and grass heat stress.'
    }
  ];

  const [activeExplorerTab, setActiveExplorerTab] = useState<string>('summary');

  const explorerTabs = [
    {
      id: 'summary',
      label: 'System Summary',
      icon: Layers,
      caption: 'Sizing & Hydraulic Quantities',
      title: 'FIFA Size 105m x 68m Sizing System',
      description: 'The system contains exactly 14 lateral Ø160mm perforated pipes running the full width, connected to twin primary lateral collector manifolds and discharging to an end-point chamber.',
      specs: [
        { label: 'Pitch Area', value: '7,140 m²' },
        { label: 'Lateral Spacing', value: '5.0 m C/C' },
        { label: 'Total lateral lines', value: '14 Lines (1,470m)' },
        { label: 'Manifold Size', value: 'Ø450 mm HDPE' },
        { label: 'Collector Pipes', value: 'Ø250 mm (210m)' },
        { label: 'Inspection Risers', value: '56 Nos (Every 25m)' }
      ]
    },
    {
      id: 'airflow',
      label: 'Air Requirements',
      icon: Wind,
      caption: 'CFM Blower Fan Sizing',
      title: 'Active Force Ventilation - CFM Requirements',
      description: 'Active airflow calculations are based on drawing 4 to 6 CFM per square foot. Our engine layout employs dual heavy duty fans offering active duty-standby backup capabilities.',
      specs: [
        { label: 'Total Pitch Area', value: '76,854 ft²' },
        { label: 'Recommended Flow', value: '5 CFM/ft²' },
        { label: 'Required CFM', value: '385,000 CFM' },
        { label: 'Power Fans', value: '2 x 200k CFM' },
        { label: 'Fan Control', value: 'VFD & PLC Panels' },
        { label: 'Air Volume', value: '400,000 CFM Total' }
      ]
    },
    {
      id: 'dimensions',
      label: 'Piping & Materials',
      icon: Sprout,
      caption: 'Lateral & Manifold Diameters',
      title: 'Underground Pipes & Soil Specifications',
      description: 'Heavy duty HDPE SDR17 lines with customized perforation profiles are mapped. Dual butt-fusion joints prevent fluid leaks and maintain precise air suction levels below pressure lines.',
      specs: [
        { label: 'Rootzone Sandy Base', value: '300 to 350 mm' },
        { label: 'Gravel Filter', value: '100 to 150 mm' },
        { label: 'Laterals Perf.', value: '8 mm holes (120°)' },
        { label: 'Lateral Material', value: 'HDPE SDR17' },
        { label: 'Collector Joints', value: 'Butt Electrofusion' },
        { label: 'Installation Depth', value: '600 to 650 mm' }
      ]
    },
    {
      id: 'budget',
      label: 'BHD Investment Breakdown',
      icon: CheckCircle2,
      caption: 'Budget BOQ Estimations',
      title: 'Standard Package & FIFA Quality BOQ',
      description: 'Comprehensive site works, excavation, sub-base gravel laying, HDPE conduits fitting, automatic control chamber build, commissioning, and remote field telemetry integrations.',
      specs: [
        { label: 'Est Civil & Pipes', value: 'BHD 210K - 240K' },
        { label: 'Premium Package', value: 'BHD 450K - 650K' },
        { label: 'Pumps & Chambers', value: 'BHD 30,000' },
        { label: 'Fans & Control VFD', value: 'BHD 65,000' },
        { label: 'Heating & Cooling', value: 'Fully Integrated' },
        { label: 'Smart Sensors', value: 'Soil Moisture + Weather' }
      ]
    }
  ];

  return (
    <div className="space-y-24">
      {/* Overview Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[#0083C9] text-xs font-bold tracking-[0.3em] uppercase block">
          Hybrid Tech Showcase
        </span>
        <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none uppercase">
          FS-Grass® Hybrid & Sub-Air System
        </h3>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Our ultra-premium sports pitch system blends verified natural turf with high-strength stitched synthetic fibers, active soil oxygenation, and vacuum rainwater drainage. Engineered specifically for elite regional conditions in Bahrain.
        </p>
      </div>

      {/* Interactive Hybrid Grass Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-gray-50 p-6 md:p-12 rounded-[40px] border border-gray-100 shadow-sm">
        {/* Left Side: Interactive Hotspots list */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#0083C9]">
              Cross-Section Composition
            </span>
            <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-snug">
              THE HYBRID GRASS MATRIX
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Hover or click on the structural layers to explore how we construct standard hybrid turf zones for zero-divot soccer, golf, and multi-sport grounds.
            </p>
          </div>

          <div className="space-y-3">
            {systemLayers.map((layer) => (
              <div
                key={layer.num}
                className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                  activeLayer === layer.num
                    ? 'bg-white border-[#0083C9] shadow-md translate-x-1'
                    : 'bg-transparent border-transparent hover:bg-gray-100'
                }`}
                onMouseEnter={() => setActiveLayer(layer.num)}
                onMouseLeave={() => setActiveLayer(null)}
                onClick={() => setActiveLayer(layer.num)}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeLayer === layer.num ? 'bg-[#0083C9] text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {layer.num}
                  </span>
                  <span className="font-bold text-gray-900 text-sm uppercase tracking-wider">{layer.name}</span>
                </div>
                {activeLayer === layer.num && (
                  <p className="text-gray-500 text-xs mt-2 pl-9 leading-relaxed">
                    {layer.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Showcase image & interactive overlay representation */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-4 md:p-6 border border-gray-150 shadow-md group">
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img
                src={getImgUrl('/src/assets/images/hybrid_grass_system_1779106617630.png')}
                alt="FS-Grass Hybrid Grass System Diagram"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
              
              {/* Highlight Overlay state */}
              {activeLayer !== null && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-6 text-center transition-all">
                  <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-sm border border-[#0083C9]/30">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#0083C9] uppercase block mb-1">
                      Layer {activeLayer} Overview
                    </span>
                    <h5 className="text-md font-bold text-gray-900 uppercase tracking-widest mb-2">
                      {systemLayers[activeLayer - 1].name}
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {systemLayers[activeLayer - 1].desc}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap justify-between items-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              <span>FS-Grass® Hybrid Grass System Infographic</span>
              <span className="flex items-center gap-1.5 text-[#36B649]">
                <ShieldCheck size={14} /> FIFA Quality Compliant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sub Air Active System Showcase Section */}
      <section className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text and stats & Simulator Controls */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#0083C9] text-xs font-bold tracking-[0.2em] uppercase block">
              Sub-Surface Climate Control
            </span>
            <h4 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-none uppercase">
              ACTIVE SUB-AIR SYSTEM
            </h4>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Standard passive gravity drainage drains too slowly to save turf in Bahrain's extreme heat or occasional heavy tropical storms. Our integrated Sub-Air Aeration & Drainage network operates dynamically under mechanical pressure:
            </p>

            {/* Tactical Control SWITCH Panel */}
            <div className="p-6 bg-gray-900 rounded-3xl border border-gray-850 shadow-lg space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      simMode === 'aeration' ? 'bg-[#36B649]' : simMode === 'vacuum' ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${
                      simMode === 'aeration' ? 'bg-[#36B649]' : simMode === 'vacuum' ? 'bg-cyan-500' : 'bg-amber-500'
                    }`}></span>
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    Sub-Air Power Console
                  </span>
                </div>
                <div className="text-[10px] bg-gray-800 text-gray-300 font-mono px-2 py-0.5 rounded uppercase tracking-wider">
                  Status: {simMode === 'off' ? 'Standby' : simMode === 'aeration' ? 'Aerating' : 'Venting / Suction'}
                </div>
              </div>

              {/* Segmented Switch Dial */}
              <div className="grid grid-cols-3 gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-800">
                <button
                  onClick={() => setSimMode('off')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all ${
                    simMode === 'off'
                      ? 'bg-gray-800 text-white shadow-md border border-gray-700 font-bold'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/40 text-xs'
                  }`}
                >
                  <Power size={16} className="mb-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Standby</span>
                </button>

                <button
                  onClick={() => setSimMode('aeration')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all ${
                    simMode === 'aeration'
                      ? 'bg-[#36B649]/20 text-[#36B649] border border-[#36B649]/40 font-bold'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/40 text-xs'
                  }`}
                >
                  <Wind size={16} className={`mb-1 ${simMode === 'aeration' ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">AERATION</span>
                </button>

                <button
                  onClick={() => setSimMode('vacuum')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg transition-all ${
                    simMode === 'vacuum'
                      ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/40 font-bold'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/40 text-xs'
                  }`}
                >
                  <Droplet size={16} className={`mb-1 ${simMode === 'vacuum' ? 'animate-bounce' : ''}`} />
                  <span className="text-[10px] uppercase font-bold tracking-wider">VACUUM</span>
                </button>
              </div>

              {/* Real-time Telemetry Dashboard Gauges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 border-t border-gray-800">
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 text-center space-y-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Airflow</span>
                  <div className={`text-sm font-black font-mono transition-colors ${
                    airflow > 0 ? 'text-[#36B649]' : airflow < 0 ? 'text-cyan-400' : 'text-gray-400'
                  }`}>
                    {airflow > 0 ? `+${airflow}` : airflow} <span className="text-[8px] font-normal font-sans">CFM</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${airflow > 0 ? 'bg-[#36B649]' : 'bg-cyan-400'}`}
                      style={{ width: `${Math.min(100, (Math.abs(airflow) / 6000) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 text-center space-y-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Soil O2</span>
                  <div className="text-sm font-black text-gray-100 font-mono">
                    {soilO2}%
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[8px] text-gray-400 leading-none">Aeration</span>
                    <span className={`text-[8px] font-bold px-1 rounded-sm leading-none ${
                      soilO2 > 20 ? 'bg-[#36B649]/20 text-[#36B649]' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {soilO2 > 20 ? 'Optimum' : 'Low'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 text-center space-y-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Root Temp</span>
                  <div className={`text-sm font-black font-mono transition-colors ${
                    rootTemp < 30 ? 'text-[#36B649]' : 'text-orange-400'
                  }`}>
                    {rootTemp}°C
                  </div>
                  <div className="text-[8px] text-gray-400 uppercase tracking-widest">
                    {rootTemp < 30 ? 'Cooled' : 'High Heat'}
                  </div>
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-gray-850 text-center space-y-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Moisture</span>
                  <div className={`text-sm font-black font-mono transition-colors ${
                    moisture < 10 ? 'text-teal-400' : moisture > 40 ? 'text-[#0083C9]' : 'text-gray-300'
                  }`}>
                    {moisture}%
                  </div>
                  <div className="text-[8px] text-gray-400 uppercase tracking-widest">
                    {moisture < 10 ? 'Bone Dry' : 'Saturated'}
                  </div>
                </div>
              </div>

              {/* Technical feedback line */}
              <div className="text-[10px] text-gray-400 leading-normal text-center italic bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-850">
                {simMode === 'off' && "System idle. Heavy water retention or summer root suffocation can occur under direct Bahrain heat."}
                {simMode === 'aeration' && "Pressurized aeration active. Pushing oxygen high into soil zones, cooling roots -8°C."}
                {simMode === 'vacuum' && "High-volume negative vacuum enabled. Sucking standing surface water directly into aggregate subpipes."}
              </div>
            </div>
          </div>

          {/* Graphical illustration for sub-air with Dynamic SVG Flow Highlights */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[32px] overflow-hidden border border-gray-150 shadow-md aspect-video bg-gray-950 p-6 flex flex-col justify-between group">
              {/* Background image component */}
              <img
                src={getImgUrl('/src/assets/images/sub_pitch_aeration_1779789441283.png')}
                alt="Sub-Pitch Active Vacuum and Aeration Pipe Network"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"></div>

              {/* DYNAMIC SVG PIPING FLOW OVERLAYS representing physical pipes and active airflow direction */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 250" preserveAspectRatio="none">
                {/* Horizontal main collector vacuum/suction pipe at the lower layer */}
                <path
                  d="M40,195 L360,195"
                  stroke={simMode !== 'off' ? (simMode === 'aeration' ? '#36B649' : '#00c9db') : '#4B5563'}
                  strokeWidth="5"
                  strokeDasharray={simMode !== 'off' ? '8,6' : '0,0'}
                  className={`transition-all duration-300 ${simMode !== 'off' ? 'animate-[dash_1s_linear_infinite]' : ''}`}
                  strokeLinecap="round"
                  opacity="0.9"
                  style={{
                    animationDirection: simMode === 'vacuum' ? 'reverse' : 'normal',
                    filter: simMode !== 'off' ? 'drop-shadow(0px 0px 4px rgba(255,255,255,0.4))' : 'none'
                  }}
                />

                {/* Vertical secondary pipes linking turf root zone directly into collector base */}
                {[75, 140, 205, 270, 335].map((xVal, idx) => (
                  <g key={`pipe-${idx}`}>
                    {/* Visual pipe column layout */}
                    <line
                      x1={xVal}
                      y1="75"
                      x2={xVal}
                      y2="195"
                      stroke={simMode !== 'off' ? (simMode === 'aeration' ? '#36B649' : '#00c9db') : '#4B5563'}
                      strokeWidth="3.5"
                      opacity="0.8"
                      className="transition-all duration-300"
                    />

                    {/* Dynamic Aeration Mode: Blow oxygen circles UPWARD into turf rootzone */}
                    {simMode === 'aeration' && (
                      <>
                        <circle cx={xVal} cy="195" r="4" fill="#36B649" opacity="0.9">
                          <animate attributeName="cy" values="195;85" dur={`${1.2 + idx * 0.15}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="1;0" dur={`${1.2 + idx * 0.15}s`} repeatCount="indefinite" />
                        </circle>
                        <circle cx={xVal} cy="160" r="3" fill="#ffffff" opacity="0.8">
                          <animate attributeName="cy" values="160;75" dur={`${1.0 + idx * 0.15}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0" dur={`${1.0 + idx * 0.15}s`} repeatCount="indefinite" />
                        </circle>
                        {/* Radiant oxygen splash waves on grass roots */}
                        <circle cx={xVal} cy="75" r="1.5" fill="#36B649" opacity="0.9">
                          <animate attributeName="r" values="1.5;10" dur="0.8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0" dur="0.8s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}

                    {/* Dynamic Vacuum Mode: Draw water droplets/suction DOWNWARD into drainage pipes */}
                    {simMode === 'vacuum' && (
                      <>
                        <circle cx={xVal} cy="75" r="4.5" fill="#00c9db" opacity="0.8">
                          <animate attributeName="cy" values="75;195" dur={`${0.9 + idx * 0.12}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.2;1.0" dur={`${0.9 + idx * 0.12}s`} repeatCount="indefinite" />
                        </circle>
                        <circle cx={xVal} cy="110" r="3.5" fill="#0083C9" opacity="1">
                          <animate attributeName="cy" values="110;195" dur={`${0.7 + idx * 0.1}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;1.0" dur={`${0.7 + idx * 0.1}s`} repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                  </g>
                ))}
              </svg>

              {/* HUD Status Header overlay inside the diagram card */}
              <div className="relative z-15 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] text-white bg-[#0083C9] px-3 py-1 font-bold tracking-widest uppercase rounded-full inline-block shadow-md">
                  SUB-SURFACE SIMULATION
                </span>
                <span className={`text-[9px] font-mono px-2.5 py-1 rounded bg-black/80 text-white border ${
                  simMode === 'aeration' ? 'border-[#36B649] text-[#36B649]' : simMode === 'vacuum' ? 'border-cyan-400 text-cyan-400' : 'border-gray-600 text-gray-400'
                }`}>
                  {simMode === 'off' ? 'MODE: passive standby' : simMode === 'aeration' ? 'MODE: pressure oxygenate' : 'MODE: active vacuum'}
                </span>
              </div>
              
              {/* Bottom text description box inside the diagram card */}
              <div className="relative z-15 space-y-2 text-white bg-black/60 backdrop-blur-sm p-4 rounded-2xl border border-white/5 pointer-events-none mt-auto">
                <h5 className="text-sm md:text-base font-bold uppercase tracking-wide flex items-center gap-1.5 font-sans">
                  <Activity size={15} className={simMode !== 'off' ? 'animate-pulse text-[#0083C9]' : 'text-gray-400'} />
                  Active Sub-Air Pipe Conduit
                </h5>
                <p className="text-gray-300 text-[11px] leading-relaxed font-sans">
                  {simMode === 'off' && "System in quiet mode. Rainwater filters naturally through gravel base layers."}
                  {simMode === 'aeration' && "Mechanical blower forcing fresh ambient airflow upwards through pipes to satisfy oxygen respiration."}
                  {simMode === 'vacuum' && "Active extractor suction extracting storm standing moisture. Flow speeds optimized to clear pitches in 12 mins."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {subAirFeatures.map((feat, i) => (
            <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#0083C9]">
                <feat.icon size={24} />
              </div>
              <h5 className="font-bold text-gray-900 text-sm md:text-base uppercase tracking-wider">{feat.title}</h5>
              <p className="text-gray-500 text-xs leading-relaxed flex-grow">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Layout & Specifications Section */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[#36B649] text-xs font-bold tracking-[0.3em] uppercase block">
            System Layout & Specifications
          </span>
          <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none uppercase">
            FIFA Standard 105m x 68m Blueprint
          </h3>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Take a deep structural look into our certified municipal under-pitch design. This dynamic dashboard reveals pipe configurations, soil profile depths, air requirements, and investment breakdowns.
          </p>
        </div>

        {/* Blueprint Explorer */}
        <div className="bg-gray-900 rounded-[40px] border border-gray-800 p-6 md:p-10 shadow-2xl text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Interactive Tabbed Panel (Control Engine) */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#36B649] block">
                  Interactive Specifications
                </span>
                <h4 className="text-xl md:text-2xl font-black tracking-tight uppercase leading-tight">
                  Under-pitch Blueprint Specs
                </h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Select a category to inspect the underlying mechanical components, technical sizing, and estimated budget items shown in the engineering schema.
                </p>
              </div>

              {/* Navigation Action Sidebar */}
              <div className="space-y-3">
                {explorerTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveExplorerTab(tab.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 bg-gray-950/45 ${
                      activeExplorerTab === tab.id
                        ? 'border-[#36B649] bg-gray-950/90 shadow-md'
                        : 'border-gray-800 hover:border-[#36B649]/40 hover:bg-gray-950'
                    } group`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center transition-colors ${
                      activeExplorerTab === tab.id ? 'text-[#36B649] bg-[#36B649]/10 border-[#36B649]/20' : 'text-gray-400 group-hover:text-[#36B649]'
                    }`}>
                      <tab.icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold uppercase tracking-wider text-gray-200 group-hover:text-white">
                        {tab.label}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mt-1">
                        {tab.caption}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Note */}
              <div className="text-[10px] text-gray-500 border-t border-gray-850 pt-4 leading-relaxed">
                * Our drawings strictly adhere to FIFA Pitch Dimensions & quality standards for Elite regional Bahrain football field systems.
              </div>
            </div>

            {/* Middle/Right Column: Image Viewer with Blueprint overlays and specifications output */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              {/* Explorer Tab Consumer State */}
              <div className="relative bg-gray-950 rounded-3xl p-4 md:p-6 border border-gray-850 flex flex-col md:flex-row gap-6">
                
                {/* Information Details Side Box */}
                <div className="md:w-1/2 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono tracking-widest text-[#36B649] uppercase">
                      Engineering Sub-Base Spec Sheet
                    </span>
                    <h5 className="text-lg font-black text-gray-100 uppercase tracking-tight">
                      {explorerTabs.find(t => t.id === activeExplorerTab)?.title}
                    </h5>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {explorerTabs.find(t => t.id === activeExplorerTab)?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-3 bg-gray-900 border border-gray-850 p-4 rounded-2xl">
                    {explorerTabs.find(t => t.id === activeExplorerTab)?.specs.map((spec, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="text-[9px] text-gray-500 uppercase">{spec.label}</div>
                        <div className="text-sm font-bold text-white font-mono">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Area: Schematic Diagram container */}
                <div className="md:w-1/2 bg-gray-900 rounded-2xl border border-gray-850 overflow-hidden relative group p-2 min-h-[220px] flex items-center justify-center">
                  <img
                    src={getImgUrl('/src/assets/images/engineering_dashboard_1779714357362.png')}
                    alt="Sub-Air Layout Details Specifications Map"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain max-h-[280px] transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* High Tech Magnifier Glass Hint Overlay */}
                  <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="inline-block bg-black/95 text-[9px] text-gray-300 border border-gray-800 font-mono tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">
                      🔬 Click or Hover to enlarge document details
                    </div>
                  </div>
                </div>

              </div>

              {/* Technical Specifications Blueprint Image Row (Full Width detailed display) */}
              <div className="relative rounded-3xl overflow-hidden border border-gray-850 bg-gray-950 p-2 group shadow-inner">
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[9px] text-white bg-gray-900 border border-gray-800 px-3 py-1 font-bold tracking-widest uppercase rounded-full inline-block shadow-md font-mono">
                    Technical Drawing: FIFA-105x68-SA
                  </span>
                </div>
                
                <div className="overflow-hidden rounded-2xl aspect-video relative">
                  <img
                    src={getImgUrl('/src/assets/images/engineering_dashboard_1779714357362.png')}
                    alt="Active Sub-Air System Design Specifications Map"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 via-transparent to-transparent pointer-events-none"></div>
                </div>

                <div className="p-4 bg-gray-950 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest border-t border-t-gray-900 font-mono">
                  <span>© FS-Grass® Sports Turf Technologies. All engineering rights reserved.</span>
                  <span className="flex items-center gap-1.5 text-[#36B649] font-bold mt-2 sm:mt-0">
                    <span className="w-2 h-2 rounded-full bg-[#36B649] animate-ping"></span>
                    Ready for Bahrain Municipal Tenders
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

