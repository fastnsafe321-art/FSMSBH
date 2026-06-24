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
      desc: 'Certified elite warm-season sports turf cultivars engineered for exceptional heat resilience, superior turf density, and fast recovery.'
    },
    {
      num: 2,
      name: 'Hybrid Reinforcement',
      desc: 'Specialized high-strength vertical synthetic fibers stitched up to 200mm deep, physically anchoring the grass roots for a zero-divot athletic field.'
    },
    {
      num: 3,
      name: 'USGA Sand Root Zone (150 mm)',
      desc: 'An engineered 150mm premium athletic sand zone conforming strictly to USGA physical criteria to guarantee optimal permeability and continuous root respiration.'
    },
    {
      num: 4,
      name: 'Sub-Air Ventilation System',
      desc: 'Under-soil forced-air blowers and vacuum network managing sub-surface root moisture, ambient oxygen flow, and extreme soil temperature cooling.'
    },
    {
      num: 5,
      name: 'Automatic Irrigation with Moisture Sensors',
      desc: 'Smart moisture-balanced multi-depth monitoring decoders controlling highly localized, high-efficiency automatic pop-up sprinkler networks.'
    },
    {
      num: 6,
      name: 'Gravel Drainage Blanket and Perforated Pipes',
      desc: 'A structural porous aggregate stone blanket housing highly responsive lateral and main HDPE perforated water collector loops.'
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
                src={getImgUrl('/src/assets/images/hybrid_soil_block_clone_1781513567584.jpg')}
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


    </div>
  );
}

