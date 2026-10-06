import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudRain, 
  Droplet, 
  Droplets,
  Wind, 
  Filter, 
  ArrowDown, 
  ArrowDownCircle,
  ShieldCheck, 
  Sprout, 
  RefreshCw, 
  Thermometer, 
  Cpu, 
  ArrowRight,
  Sparkles,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';
import ResponsiveImage from './media/ResponsiveImage';

interface SubAirVentShowcaseProps {
  getImgUrl?: (path: string | undefined) => string;
  triggerConsultation?: (serviceName?: string, customMessage?: string) => void;
}

/** Deterministic 0..1 from stable integer inputs. Does not call Math.random. */
function particleUnit(bucket: number, index: number): number {
  let n = (Math.imul(bucket, 374761393) + Math.imul(index + 1, 668265263)) >>> 0;
  n = Math.imul(n ^ (n >>> 16), 2246822507) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 3266489909) >>> 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

export default function SubAirVentShowcase({ 
  getImgUrl = (path) => path || '', 
  triggerConsultation 
}: SubAirVentShowcaseProps) {
  const [simMode, setSimMode] = useState<'vacuum' | 'standby' | 'pressure'>('vacuum');
  const [activeDrainagePhase, setActiveDrainagePhase] = useState<'all' | 'precipitation' | 'filtration' | 'suction' | 'discharge'>('all');
  const [isPlayingFlow, setIsPlayingFlow] = useState<boolean>(true);
  const [viewType, setViewType] = useState<'3d' | 'schematic'>('3d');

  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<{
    sourceNodes: (AudioScheduledSourceNode | OscillatorNode | AudioNode)[];
    gainNode: GainNode | null;
    intervalId?: any;
  }>({ sourceNodes: [], gainNode: null });
  const currentPlayingStageRef = useRef<{ mode: string; phase: string } | null>(null);

  // Auto-cycle drainage steps when playing
  useEffect(() => {
    if (!isPlayingFlow || simMode !== 'vacuum') return;
    const interval = setInterval(() => {
      setActiveDrainagePhase((prev) => {
        if (prev === 'all') return 'precipitation';
        if (prev === 'precipitation') return 'filtration';
        if (prev === 'filtration') return 'suction';
        if (prev === 'suction') return 'discharge';
        return 'all';
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlayingFlow, simMode]);

  // --- WEB AUDIO API SYNTHESIZER ENGINE ---

  const resumeAudioContextIfNeeded = async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopAllSounds = () => {
    if (activeNodesRef.current.intervalId) {
      clearInterval(activeNodesRef.current.intervalId);
      activeNodesRef.current.intervalId = undefined;
    }

    const gainNode = activeNodesRef.current.gainNode;
    const sourceNodes = [...activeNodesRef.current.sourceNodes];

    activeNodesRef.current.sourceNodes = [];
    activeNodesRef.current.gainNode = null;

    if (audioCtxRef.current && gainNode) {
      try {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtxRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.08);
      } catch (e) {}
    }

    setTimeout(() => {
      sourceNodes.forEach((node) => {
        try {
          (node as any).stop?.();
          (node as any).disconnect?.();
        } catch (e) {}
      });
      try { gainNode?.disconnect?.(); } catch (e) {}
    }, 90);
  };

  const createNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  // ─── RAIN: exact v1 synthesis ───────────────────────────────────────────────
  // Dual-path: lowpass-filtered noise body (0.32 gain) + LFO gain modulation
  // (0.08 depth) + separate bandpass splatter branch (3200 Hz, 0.06 gain).
  const startRainSound = (ctx: AudioContext, targetGain: GainNode) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    noise.loop = true;

    // Main body: lowpass at 1100 Hz (matches v1 exactly)
    const lowpassFilter = ctx.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.setValueAtTime(1100, ctx.currentTime);

    // LFO that modulates the main gain at 0.4 Hz with ±0.08 depth (v1 values)
    const modulator = ctx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(0.4, ctx.currentTime);
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(0.08, ctx.currentTime);

    // Main gain: ramp up to 0.32 (v1 value)
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.2);

    modulator.connect(modGain);
    modGain.connect(mainGain.gain);   // LFO drives the gain parameter

    noise.connect(lowpassFilter);
    lowpassFilter.connect(mainGain);
    mainGain.connect(targetGain);

    // Splatter branch: bandpass at 3200 Hz, Q=1.5, gain=0.06 (v1 values)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(3200, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

    const splatterGain = ctx.createGain();
    splatterGain.gain.setValueAtTime(0.06, ctx.currentTime);

    noise.connect(bandpass);
    bandpass.connect(splatterGain);
    splatterGain.connect(targetGain);

    noise.start();
    modulator.start();

    activeNodesRef.current.sourceNodes.push(noise, modulator, lowpassFilter, modGain, bandpass, splatterGain);
  };

  // ─── FILTRATION: exact v1 drip synthesis ────────────────────────────────────
  // Oscillators (sine or triangle) at 1200–2600 Hz, duration 0.04–0.10 s,
  // peak gain 0.12–0.27, freq ramp down to 45 %, interval 70–220 ms.
  const startFiltrationSound = (ctx: AudioContext, targetGain: GainNode) => {
    const scheduleDrip = () => {
      if (!audioCtxRef.current || !soundEnabled) return;

      const osc = ctx.createOscillator();
      const dripGain = ctx.createGain();

      const freq = 1200 + Math.random() * 1400;          // 1200–2600 Hz (v1)
      const duration = 0.04 + Math.random() * 0.06;      // 40–100 ms (v1)

      osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';  // v1 ratio
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.45, ctx.currentTime + duration); // v1 pitch drop

      dripGain.gain.setValueAtTime(0, ctx.currentTime);
      dripGain.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.15, ctx.currentTime + 0.01); // 0.12–0.27 (v1)
      dripGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(dripGain);
      dripGain.connect(targetGain);

      osc.start();
      setTimeout(() => { try { osc.stop(); } catch (e) {} }, duration * 1000 + 100);
    };

    const triggerNext = () => {
      scheduleDrip();
      const delay = 70 + Math.random() * 150;            // 70–220 ms (v1)
      activeNodesRef.current.intervalId = setTimeout(triggerNext, delay);
    };

    triggerNext();
  };

  // ─── SUCTION: v2 implementation (unchanged) ──────────────────────────────────
  const startSuctionSound = (ctx: AudioContext, targetGain: GainNode) => {
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(58, ctx.currentTime);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(62, ctx.currentTime);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(150, ctx.currentTime);

    const localGain1 = ctx.createGain();
    localGain1.gain.setValueAtTime(0.15, ctx.currentTime);
    const localGain2 = ctx.createGain();
    localGain2.gain.setValueAtTime(0.15, ctx.currentTime);

    osc1.connect(localGain1);
    osc2.connect(localGain2);
    localGain1.connect(lowpass);
    localGain2.connect(lowpass);
    lowpass.connect(targetGain);

    osc1.start();
    osc2.start();
    activeNodesRef.current.sourceNodes.push(osc1, osc2, localGain1, localGain2, lowpass);
  };

  // ─── DISCHARGE: v2 implementation (unchanged) ────────────────────────────────
  const startDischargeSound = (ctx: AudioContext, targetGain: GainNode) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, ctx.currentTime);

    const modulator = ctx.createOscillator();
    modulator.frequency.setValueAtTime(0.4, ctx.currentTime);
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(100, ctx.currentTime);

    modulator.connect(modGain);
    modGain.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(targetGain);

    modulator.start();
    noise.start();
    activeNodesRef.current.sourceNodes.push(noise, filter, modulator, modGain);
  };

  // ─── PRESSURE: v2 implementation (unchanged) ─────────────────────────────────
  const startPressureSound = (ctx: AudioContext, targetGain: GainNode) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    noise.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(450, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

    const sweep = ctx.createOscillator();
    sweep.frequency.setValueAtTime(0.15, ctx.currentTime);
    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(200, ctx.currentTime);

    sweep.connect(sweepGain);
    sweepGain.connect(bandpass.frequency);
    noise.connect(bandpass);
    bandpass.connect(targetGain);

    sweep.start();
    noise.start();
    activeNodesRef.current.sourceNodes.push(noise, bandpass, sweep, sweepGain);
  };

  // ─── SOUND ENGINE EFFECT ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!soundEnabled) {
      stopAllSounds();
      currentPlayingStageRef.current = null;
      return;
    }

    if (
      currentPlayingStageRef.current &&
      currentPlayingStageRef.current.mode === simMode &&
      currentPlayingStageRef.current.phase === activeDrainagePhase
    ) {
      return;
    }

    let isCancelled = false;

    const initSoundStage = async () => {
      const ctx = await resumeAudioContextIfNeeded();
      if (isCancelled) return;

      stopAllSounds();
      if (isCancelled) return;

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.001, ctx.currentTime);
      mainGain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.15);
      mainGain.connect(ctx.destination);
      activeNodesRef.current.gainNode = mainGain;

      if (simMode === 'pressure') {
        startPressureSound(ctx, mainGain);
      } else if (simMode === 'vacuum') {
        if (activeDrainagePhase === 'precipitation') {
          startRainSound(ctx, mainGain);
        } else if (activeDrainagePhase === 'filtration') {
          startFiltrationSound(ctx, mainGain);
        } else if (activeDrainagePhase === 'suction') {
          startSuctionSound(ctx, mainGain);
        } else if (activeDrainagePhase === 'discharge') {
          startDischargeSound(ctx, mainGain);
        } else if (activeDrainagePhase === 'all') {
          startRainSound(ctx, mainGain);
          startSuctionSound(ctx, mainGain);
        }
      }

      currentPlayingStageRef.current = { mode: simMode, phase: activeDrainagePhase };
    };

    initSoundStage().catch(console.error);

    return () => {
      isCancelled = true;
    };
  }, [soundEnabled, simMode, activeDrainagePhase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllSounds();
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
      }
    };
  }, []);

  const benefits = [
    {
      icon: Droplet,
      title: 'Prevents Waterlogging',
      desc: 'Keeps the surface dry and playable even after heavy rain.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: ShieldCheck,
      title: 'Keeps Pitch Stable & Safe',
      desc: 'Maintains a firm, even surface for consistent ball bounce and player safety.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Thermometer,
      title: 'Ensures Optimal Conditions',
      desc: 'Regulates temperature for year-round play and root activity.',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      icon: Sprout,
      title: 'Healthier Roots, Better Turf',
      desc: 'Improved root growth creates stronger turf and better performance.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: RefreshCw,
      title: 'Saves Water for Reuse',
      desc: 'Collected water can be reused for irrigation and maintenance.',
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
    },
  ];

  return (
    <section id="sub-air-system" className="py-24 bg-gradient-to-b from-slate-50 to-white text-slate-900 overflow-hidden scroll-mt-20 border-t border-slate-150">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        
        {/* Title & Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-12 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full mb-4 border border-green-200">
            <Sparkles size={13} className="animate-pulse" />
            <span className="tracking-wider uppercase">Advanced Drainage Technology</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Football Pitch Drainage & <span className="text-emerald-500 italic block sm:inline">Root-Zone Aeration</span>
          </h2>
          
          <p className="mt-4 text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            SubAir is an advanced underground system that manages air, water, and temperature to create the best conditions for strong, healthy soil and plants.
          </p>
        </div>

        {/* Dynamic Mode Switcher Bar */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner flex gap-1">
            <button
              type="button"
              onClick={() => setSimMode('vacuum')}
              className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider transition-all duration-300 flex items-center gap-1.5 uppercase ${
                simMode === 'vacuum' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Droplet size={14} className={simMode === 'vacuum' ? 'animate-bounce' : ''} />
              Vacuum ModeActive
            </button>
            <button
              type="button"
              onClick={() => setSimMode('standby')}
              className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider transition-all duration-300 flex items-center gap-1.5 uppercase ${
                simMode === 'standby' 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Cpu size={14} />
              Passive Standby
            </button>
            <button
              type="button"
              onClick={() => setSimMode('pressure')}
              className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider transition-all duration-300 flex items-center gap-1.5 uppercase ${
                simMode === 'pressure' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Wind size={14} className={simMode === 'pressure' ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
              Pressure ModeActive
            </button>
          </div>
        </div>

        {/* 3-Column main diagram grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* LEFT COLUMN: VACUUM MODE */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div className={`p-6 md:p-8 rounded-[24px] border transition-all duration-500 h-full flex flex-col justify-between ${
              simMode === 'vacuum'
                ? 'bg-blue-50/70 border-blue-200 shadow-xl ring-2 ring-blue-500/20'
                : 'bg-white border-slate-100 opacity-60 grayscale-[40%]'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    simMode === 'vacuum' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Droplet size={22} className={simMode === 'vacuum' ? 'animate-bounce' : ''} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-600 tracking-wider uppercase block">Vacuum Mode</span>
                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">Rapid Water Removal</h3>
                  </div>
                </div>
                <p className="text-slate-650 text-xs leading-relaxed mb-6">
                  Removes excess water from the pitch surface quickly.
                </p>

                <div className="border-t border-slate-150/80 pt-5">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-4">How It Works</span>
                  
                  <div className="space-y-4 relative">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        simMode === 'vacuum' ? 'bg-blue-100 text-blue-700 font-mono border border-blue-300' : 'bg-slate-100 text-slate-500'
                      }`}>1</div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <CloudRain size={13} className="text-blue-500" /> Rain or Excess Water
                        </span>
                        <p className="text-[11px] text-slate-500 leading-snug">Precipitation pools on surface</p>
                      </div>
                    </div>

                    <div className="pl-3 py-1">
                      <ArrowDown size={14} className={`text-slate-300 animate-bounce ${simMode === 'vacuum' ? 'text-blue-400 font-bold' : ''}`} />
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        simMode === 'vacuum' ? 'bg-blue-100 text-blue-700 font-mono border border-blue-300' : 'bg-slate-100 text-slate-500'
                      }`}>2</div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Droplets size={13} className="text-blue-500" /> Collected on Surface
                        </span>
                        <p className="text-[11px] text-slate-500 leading-snug">Water enters vertical root pores</p>
                      </div>
                    </div>

                    <div className="pl-3 py-1">
                      <ArrowDown size={14} className={`text-slate-300 animate-bounce ${simMode === 'vacuum' ? 'text-blue-400 font-bold' : ''}`} style={{ animationDelay: '0.2s' }} />
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        simMode === 'vacuum' ? 'bg-blue-100 text-blue-700 font-mono border border-blue-300' : 'bg-slate-100 text-slate-500'
                      }`}>3</div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <Cpu size={13} className="text-blue-500" /> Suction Pumps Activate
                        </span>
                        <p className="text-[11px] text-slate-500 leading-snug">Negative atmospheric pull applies</p>
                      </div>
                    </div>

                    <div className="pl-3 py-1">
                      <ArrowDown size={14} className={`text-slate-300 animate-bounce ${simMode === 'vacuum' ? 'text-blue-400 font-bold' : ''}`} style={{ animationDelay: '0.4s' }} />
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        simMode === 'vacuum' ? 'bg-blue-600 text-white font-mono border border-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>4</div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          <ArrowDownCircle size={13} className="text-blue-600" /> Drained Safely Away
                        </span>
                        <p className="text-[11px] text-slate-500 leading-snug">Evacuated into holding basins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: VIEWPORT SIMULATION & GRAPHICS */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 shadow-sm">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-3 font-mono">Viewport Simulation</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewType('3d')}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 leading-none ${
                    viewType === '3d'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  3D Render View
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('schematic')}
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 leading-none ${
                    viewType === 'schematic'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                      : 'text-slate-600 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <Sparkles size={11} className={viewType === 'schematic' ? 'animate-pulse text-sky-200' : 'text-slate-400'} />
                  2D Fluid Dynamics
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {viewType === 'schematic' ? (
                <motion.div
                  key="schematic-view"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="relative rounded-[28px] overflow-hidden bg-slate-950 p-1.5 border border-slate-200/80 shadow-2xl flex-1 flex flex-col justify-center min-h-[360px]"
                >
                  <div className="relative aspect-video rounded-[24px] overflow-hidden bg-slate-900 h-full flex flex-col">
                    
                    <div className="h-[15%] bg-gradient-to-b from-slate-950 to-slate-900 relative flex items-center justify-between px-4 overflow-hidden border-b border-white/5">
                      <div className="text-[9px] font-black tracking-widest text-[#94a3b8] uppercase font-mono">RAIN LEVEL CLOUD BANK</div>
                      {simMode === 'vacuum' && (activeDrainagePhase === 'all' || activeDrainagePhase === 'precipitation') && (
                        <div className="flex items-center gap-2">
                          <CloudRain size={14} className="text-sky-400 animate-bounce" />
                          <div className="text-[9px] font-black text-sky-400 uppercase tracking-wider animate-pulse">Heavy Rain Event (90mm/hr)</div>
                        </div>
                      )}
                    </div>

                    <div className="h-[12%] bg-gradient-to-r from-emerald-800 to-green-700 relative border-b border-green-500/30">
                      <div className="absolute -top-1.5 inset-x-0 h-2 flex justify-around select-none pointer-events-none opacity-85">
                        {[...Array(45)].map((_, i) => (
                          <div 
                            key={`blade-${i}`} 
                            className="w-[1.5px] h-2 bg-emerald-400 rounded-full" 
                            style={{ transform: `rotate(${(i % 3 === 0 ? 12 : i % 2 === 0 ? -9 : 4)}deg)` }} 
                          />
                        ))}
                      </div>
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <span className="px-2.5 py-0.5 bg-black/60 text-[8px] font-extrabold tracking-widest text-emerald-300 uppercase rounded-md border border-emerald-500/20 font-mono">
                          1. HYBRID TURF SURFACE (Pitch)
                        </span>
                      </div>
                      {simMode === 'vacuum' && (activeDrainagePhase === 'all' || activeDrainagePhase === 'precipitation') && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(24)].map((_, i) => {
                            const left = (i * 4.2) + particleUnit(1, i) * 2;
                            return (
                              <motion.div
                                key={`rain-v-2d-${i}`}
                                initial={{ top: -20 }}
                                animate={{ top: '100%', opacity: [0, 1, 0] }}
                                transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.05, ease: 'linear' }}
                                className="absolute w-[1px] h-3 bg-sky-300"
                                style={{ left: `${left}%` }}
                              />
                            );
                          })}
                          {[...Array(10)].map((_, i) => (
                            <motion.div
                              key={`splash-2d-${i}`}
                              initial={{ scale: 0.2, opacity: 0 }}
                              animate={{ scale: [0.2, 1.4, 0.2], opacity: [0, 0.9, 0] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                              className="absolute w-3 h-1.5 border border-sky-300 rounded-full bottom-0"
                              style={{ left: `${10 + (i * 9)}%` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="h-[33%] bg-gradient-to-b from-stone-100 to-amber-50/20 relative border-b border-amber-900/10">
                      <svg className="absolute inset-0 w-full h-full opacity-[0.22] stroke-emerald-600" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {[...Array(18)].map((_, i) => {
                          const sx = i * 5.6;
                          return (
                            <path
                              key={`root2d-${i}`}
                              d={`M ${sx} 0 Q ${sx + (i % 2 === 0 ? 3 : -3)} 45 ${sx + (i % 3 === 0 ? 6 : -3)} 100`}
                              fill="none"
                              strokeWidth="1.2"
                            />
                          );
                        })}
                      </svg>
                      <div className="absolute left-4 top-4 z-10">
                        <span className="px-2.5 py-0.5 bg-black/60 text-[8px] font-extrabold tracking-widest text-[#fed7aa] uppercase rounded-md border border-amber-500/20 font-mono">
                          2. USGA SPEC SAND ZONE
                        </span>
                      </div>
                      {simMode === 'vacuum' && (activeDrainagePhase === 'all' || activeDrainagePhase === 'filtration') && (
                        <div className="absolute inset-0 overflow-hidden">
                          {[...Array(16)].map((_, i) => {
                            const left = (i * 6.2) + particleUnit(2, i) * 2;
                            const delay = particleUnit(3, i) * 1.6;
                            return (
                              <motion.div
                                key={`percolate-2d-${i}`}
                                initial={{ top: '0%' }}
                                animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: delay }}
                                className="absolute w-[2px] h-3.5 bg-sky-400 rounded-full shadow-[0_0_4px_rgba(56,189,248,0.5)]"
                                style={{ left: `${left}%` }}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="h-[40%] bg-gradient-to-b from-stone-800 to-zinc-900 relative p-3 overflow-hidden">
                      <div className="absolute inset-0 grid grid-cols-12 gap-1.5 p-3 opacity-[0.14] pointer-events-none">
                        {[...Array(60)].map((_, i) => (
                          <div key={`stone-${i}`} className="w-4 h-4 rounded-full border border-zinc-200 bg-zinc-400" />
                        ))}
                      </div>
                      <div className="absolute left-4 top-2 z-10 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 bg-black/60 text-[8px] font-extrabold tracking-widest text-slate-300 uppercase rounded-md border border-yellow-500/20 font-mono">
                          3. CHOKED GRAVEL LAYER (10mm Aggregate Bed)
                        </span>
                      </div>
                      <div className="flex justify-around items-center w-full mt-4 relative z-20 h-full pb-4">
                        {[1, 2].map((id) => (
                          <div 
                            key={`pipe-cross-${id}`} 
                            className="relative w-24 h-24 rounded-full border-[6px] border-slate-700 bg-slate-950 flex flex-col items-center justify-center shadow-xl overflow-hidden border-dashed"
                          >
                            <div className="absolute inset-2 border-2 border-slate-800/80 rounded-full" />
                            <div className="absolute -top-1 h-3 flex gap-2 justify-center w-full z-20">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee] animate-pulse" />
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee] animate-pulse" />
                            </div>
                            {simMode === 'vacuum' && (activeDrainagePhase === 'all' || activeDrainagePhase === 'suction' || activeDrainagePhase === 'discharge') && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2.0, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-3 border-2 border-dashed border-[#22d3ee]/40 rounded-full"
                              />
                            )}
                            <div className="absolute bottom-0 inset-x-0 h-[45%] bg-gradient-to-t from-blue-700/80 to-sky-500/70">
                              <motion.div
                                animate={{ y: [-1, 1.5, -1] }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-1 inset-x-0 h-1.5 bg-[#7dd3fc] opacity-80 border-t border-sky-300"
                              />
                            </div>
                            {simMode === 'vacuum' && (activeDrainagePhase === 'all' || activeDrainagePhase === 'discharge') && (
                              <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                                {[...Array(6)].map((_, i) => (
                                  <motion.div
                                    key={`flow-lines-${id}-${i}`}
                                    animate={{ x: [-25, 25], opacity: [0, 0.95, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                                    className="absolute w-3.5 h-[1.5px] bg-[#38bdf8] rounded-full"
                                    style={{ top: `${52 + (i * 7)}%` }}
                                  />
                                ))}
                              </div>
                            )}
                            {simMode === 'vacuum' && (activeDrainagePhase === 'all' || activeDrainagePhase === 'suction') && (
                              <div className="absolute inset-0 pointer-events-none">
                                {[1, 2].map((dr) => (
                                  <motion.div
                                    key={`inlet-dr-${id}-${dr}`}
                                    animate={{ y: [-4, 30], opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.75, repeat: Infinity, delay: dr * 0.3 }}
                                    className="absolute bg-sky-300 w-1.5 h-3 rounded-full"
                                    style={{ left: `${30 + (dr * 20)}%`, top: '10%' }}
                                  />
                                ))}
                              </div>
                            )}
                            <span className="text-[7px] font-extrabold tracking-widest text-[#94a3b8] uppercase mt-2 select-none relative z-10 font-mono">
                              PIPE {id === 1 ? 'WEST' : 'EAST'}
                            </span>
                          </div>
                        ))}
                      </div>
                      {simMode === 'vacuum' && (activeDrainagePhase === 'all' || activeDrainagePhase === 'filtration' || activeDrainagePhase === 'suction') && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(14)].map((_, i) => {
                            const left = 6 + (i * 7.4) + particleUnit(4, i) * 2;
                            const delay = particleUnit(5, i) * 1.4;
                            return (
                              <motion.div
                                key={`gravel-percolation-dr-2d-${i}`}
                                animate={{ y: [0, 36], opacity: [0, 0.85, 0] }}
                                transition={{ duration: 0.95, repeat: Infinity, delay: delay }}
                                className="absolute w-[2px] h-2.5 bg-sky-300 rounded-full"
                                style={{ left: `${left}%`, top: '15%' }}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 z-30">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-2 border shadow-lg backdrop-blur-md ${
                      simMode === 'vacuum'
                        ? 'bg-blue-600/95 text-white border-blue-500'
                        : simMode === 'pressure'
                        ? 'bg-emerald-600/90 text-white border-emerald-500'
                        : 'bg-slate-900/95 text-slate-300 border-slate-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full inline-block ${
                        simMode === 'standby' ? 'bg-amber-400 animate-pulse' : simMode === 'vacuum' ? 'bg-blue-400 animate-ping' : 'bg-emerald-400 animate-ping'
                      }`} />
                      {simMode === 'standby' ? 'Passive Gravity Air Mode' : simMode === 'vacuum' ? `Vacuum Drainage Active: ${activeDrainagePhase === 'all' ? 'All Hydrologic Steps' : activeDrainagePhase.toUpperCase()}` : 'Roots Air Injected'}
                    </span>
                  </div>

                  {simMode === 'vacuum' && (
                    <div className="absolute bottom-2 inset-x-2 flex justify-between px-3 text-[8px] font-black text-sky-300 tracking-wider uppercase font-mono z-20 pointer-events-none bg-slate-950/85 p-1.5 rounded-lg border border-slate-800">
                      <span>Gravity percolation →</span>
                      <span>Silt filtration →</span>
                      <span>Vacuum draw suction →</span>
                      <span>Discharge evacuation</span>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="3d-render-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="relative rounded-[28px] overflow-hidden bg-slate-950 p-1 border border-slate-200/80 shadow-2xl flex-1 flex flex-col justify-center min-h-[360px]"
                >
                  <div className="relative aspect-video rounded-[24px] overflow-hidden bg-zinc-900 h-full">
                    <ResponsiveImage
                      src="/src/assets/images/sub_air_clean_system_1781693372407.jpg"
                      alt="High Tech SubAir Under-Soil Ventilation Architecture"
                      sizes="(min-width: 1024px) 566px, calc(100vw - 48px)"
                      className="w-full h-full object-cover opacity-95 transition-transform duration-[1200ms] hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 pointer-events-none z-10">
                      <AnimatePresence>
                        {simMode === 'pressure' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.9 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-emerald-500/10 mix-blend-screen"
                          >
                            <div className="absolute inset-0 flex justify-around items-end px-10 py-12">
                              {[...Array(6)].map((_, i) => (
                                <motion.div
                                  key={`air-${i}`}
                                  animate={{ y: [-40, -180], opacity: [0, 1, 0] }}
                                  transition={{
                                    duration: 1.6 + particleUnit(6, i) * 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                  }}
                                  className="flex flex-col items-center"
                                >
                                  <Wind size={15} className="text-emerald-400 rotate-180 animate-pulse" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {simMode === 'vacuum' && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-blue-950/20"
                          >
                            <div className="absolute inset-0 overflow-hidden">
                              {(activeDrainagePhase === 'all' || activeDrainagePhase === 'precipitation') && (
                                <>
                                  {[...Array(45)].map((_, i) => {
                                    const left = (i * 2.2) + (particleUnit(7, i) * 1.5);
                                    const duration = 0.35 + particleUnit(8, i) * 0.25;
                                    const delay = particleUnit(9, i) * 1.2;
                                    const height = 25 + particleUnit(10, i) * 35;
                                    return (
                                      <motion.div
                                        key={`rain-p1-${i}`}
                                        initial={{ top: -60, left: `${left}%`, opacity: 0 }}
                                        animate={{ top: ['0%', '42%'], opacity: [0, 0.9, 0.9, 0] }}
                                        transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
                                        className="absolute bg-sky-350 shadow-[0_0_8px_rgba(56,189,248,0.6)] w-[1.5px] rounded-full"
                                        style={{ height: `${height}px`, transform: 'rotate(8deg)' }}
                                      />
                                    );
                                  })}
                                  {[...Array(12)].map((_, i) => {
                                    const left = 8 + particleUnit(11, i) * 84;
                                    const top = 34 + particleUnit(12, i) * 8;
                                    const delay = particleUnit(13, i) * 1.4;
                                    return (
                                      <motion.div
                                        key={`splash-p1-${i}`}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0.1, 1.6, 0], opacity: [0, 0.95, 0] }}
                                        transition={{ duration: 0.45, repeat: Infinity, delay }}
                                        className="absolute border-2 border-sky-300 rounded-full w-4 h-2"
                                        style={{ left: `${left}%`, top: `${top}%` }}
                                      />
                                    );
                                  })}
                                </>
                              )}

                              {(activeDrainagePhase === 'all' || activeDrainagePhase === 'filtration') && (
                                <div className="absolute inset-0">
                                  {[...Array(18)].map((_, i) => {
                                    const left = 10 + (i * 4.6) + particleUnit(14, i) * 2;
                                    const duration = 1.4 + particleUnit(15, i) * 0.8;
                                    const delay = particleUnit(16, i) * 0.8;
                                    return (
                                      <motion.div
                                        key={`filter-drop-${i}`}
                                        initial={{ top: '38%', left: `${left}%`, opacity: 0, scale: 0.6 }}
                                        animate={{ top: ['38%', '62%'], opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.6] }}
                                        transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
                                        className="absolute flex flex-col items-center"
                                      >
                                        <div className="w-1.5 h-3 bg-sky-400 rounded-b-full opacity-80" />
                                        <div className="w-1 h-1 bg-sky-200 rounded-full animate-ping mt-1" />
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              )}

                              {(activeDrainagePhase === 'all' || activeDrainagePhase === 'suction') && (
                                <div className="absolute inset-0 pointer-events-none">
                                  <div className="absolute left-[45%] top-[55%] -translate-x-1/2 -translate-y-1/2">
                                    <span className="absolute inline-flex h-24 w-24 rounded-full border-2 border-blue-400/30 animate-ping" />
                                    <span className="absolute inline-flex h-12 w-12 rounded-full border-2 border-blue-400/50 animate-pulse" />
                                  </div>
                                  <div className="absolute left-[58%] top-[58%] -translate-x-1/2 -translate-y-1/2">
                                    <span className="absolute inline-flex h-24 w-24 rounded-full border-2 border-blue-400/30 animate-ping" style={{ animationDelay: '0.4s' }} />
                                    <span className="absolute inline-flex h-12 w-12 rounded-full border-2 border-blue-400/50 animate-pulse" />
                                  </div>
                                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {[...Array(8)].map((_, i) => {
                                      const startX = 25 + (i * 6);
                                      const endX = 45 + (i % 2 === 0 ? 0 : 13);
                                      return (
                                        <path
                                          key={`suction-path-${i}`}
                                          d={`M ${startX} 58 Q ${(startX + endX)/2} 54 ${endX} 58`}
                                          fill="none"
                                          stroke="rgba(14, 165, 233, 0.45)"
                                          strokeWidth="0.5"
                                          strokeDasharray="1, 3"
                                        />
                                      );
                                    })}
                                  </svg>
                                  {[...Array(15)].map((_, i) => {
                                    const startLeft = 20 + particleUnit(17, i) * 50;
                                    const targetLeft = startLeft < 48 ? 44 : 57;
                                    const startTop = 46 + particleUnit(18, i) * 8;
                                    const targetTop = 53 + particleUnit(19, i) * 5;
                                    const duration = 0.7 + particleUnit(20, i) * 0.4;
                                    const delay = particleUnit(21, i) * 1.2;
                                    return (
                                      <motion.div
                                        key={`suction-particle-${i}`}
                                        initial={{ left: `${startLeft}%`, top: `${startTop}%`, opacity: 0, scale: 0.5 }}
                                        animate={{
                                          left: [`${startLeft}%`, `${targetLeft}%`],
                                          top: [`${startTop}%`, `${targetTop}%`],
                                          opacity: [0, 0.95, 0],
                                          scale: [0.5, 1, 0.3]
                                        }}
                                        transition={{ duration, repeat: Infinity, ease: 'circIn', delay }}
                                        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-sky-400 rounded-full shadow-[0_0_6px_rgba(56,189,248,0.85)]"
                                      />
                                    );
                                  })}
                                </div>
                              )}

                              {(activeDrainagePhase === 'all' || activeDrainagePhase === 'discharge') && (
                                <div className="absolute inset-0">
                                  {[...Array(12)].map((_, i) => {
                                    const top = 54 + (i * 2) + 1;
                                    const duration = 0.5 + particleUnit(23, i) * 0.3;
                                    const delay = particleUnit(24, i) * 0.9;
                                    return (
                                      <motion.div
                                        key={`discharge-stream-${i}`}
                                        initial={{ left: '50%', top: `${top}%`, width: 0, opacity: 0 }}
                                        animate={{ left: ['50%', '82%'], width: ['0px', '40px', '0px'], opacity: [0, 1, 1, 0] }}
                                        transition={{ duration, repeat: Infinity, ease: 'easeOut', delay }}
                                        className="absolute bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 h-[3px] rounded-full shadow-[0_0_8px_rgba(14,165,233,0.9)]"
                                      />
                                    );
                                  })}
                                  <div className="absolute right-[19%] bottom-[20%]">
                                    <motion.div
                                      animate={{ rotate: -360 }}
                                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                      className="w-10 h-10 rounded-full border border-sky-400/50 bg-blue-950/40 flex items-center justify-center"
                                    >
                                      <RefreshCw size={18} className="text-sky-300" />
                                    </motion.div>
                                    <span className="absolute -inset-2 rounded-full border border-sky-400/20 animate-ping pointer-events-none" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="absolute top-4 left-4 z-20">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 border shadow-lg backdrop-blur-md ${
                        simMode === 'vacuum'
                          ? 'bg-blue-600/95 text-white border-blue-500'
                          : simMode === 'pressure'
                          ? 'bg-emerald-600/90 text-white border-emerald-500'
                          : 'bg-slate-900/95 text-slate-300 border-slate-700'
                      }`}>
                        <span className={`w-2 h-2 rounded-full inline-block ${
                          simMode === 'standby' ? 'bg-amber-400 animate-pulse' : simMode === 'vacuum' ? 'bg-blue-400 animate-ping' : 'bg-emerald-400 animate-ping'
                        }`} />
                        {simMode === 'standby' ? 'Passive Gravity Air' : simMode === 'vacuum' ? `Vacuum Drainage: ${activeDrainagePhase === 'all' ? 'All Stages' : activeDrainagePhase.toUpperCase()}` : 'Roots Air Injected'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* INTERACTIVE DRAINAGE STEP CONTROLLER */}
            <div className="bg-white p-5 rounded-[24px] border border-slate-150 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase block">Interactive Technical Walkthrough</span>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                    <Droplet size={15} className="text-blue-500 animate-bounce" /> How the Advanced Drainage Animation Cycles
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    if (!soundEnabled) {
                      await resumeAudioContextIfNeeded();
                    }
                    setSoundEnabled(!soundEnabled);
                  }}
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all duration-300 border ${
                    soundEnabled
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                      : 'bg-white text-emerald-600 border-emerald-400 hover:bg-emerald-50'
                  }`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 size={13} className="animate-bounce" />
                      <span>Sound: ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX size={13} />
                      <span>Sound: OFF (Click to Enable)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setIsPlayingFlow(!isPlayingFlow);
                    if (simMode !== 'vacuum') setSimMode('vacuum');
                    if (!soundEnabled) {
                      await resumeAudioContextIfNeeded();
                      setSoundEnabled(true);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 border ${
                    isPlayingFlow 
                      ? 'bg-blue-100 border-blue-200 text-blue-700 font-bold' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Play size={10} className={isPlayingFlow ? 'animate-ping' : ''} />
                  {isPlayingFlow ? 'Auto-Cycle Active' : 'Auto-Cycle Paused'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'precipitation', label: 'Phase 1', title: 'Heavy Rain',     desc: 'Precipitation falls',    icon: CloudRain,  colorClass: 'hover:border-blue-300 text-blue-600',    activeClass: 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/10' },
                  { id: 'filtration',    label: 'Phase 2', title: 'Percolation',    desc: 'Filters down layers',    icon: Sprout,     colorClass: 'hover:border-amber-300 text-amber-600',  activeClass: 'bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-600/10' },
                  { id: 'suction',       label: 'Phase 3', title: 'Suction Extract',desc: 'Airtight pressure pull', icon: Wind,       colorClass: 'hover:border-cyan-300 text-cyan-600',    activeClass: 'bg-cyan-600 text-white border-cyan-600 shadow-lg shadow-cyan-600/10' },
                  { id: 'discharge',     label: 'Phase 4', title: 'Outflow Drain',  desc: 'Evacuated out',          icon: RefreshCw,  colorClass: 'hover:border-emerald-300 text-emerald-600', activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/10' },
                ].map((phase) => {
                  const Icon = phase.icon;
                  const isActive = activeDrainagePhase === phase.id && simMode === 'vacuum';
                  return (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={async () => {
                        if (!soundEnabled) {
                          await resumeAudioContextIfNeeded();
                          setSoundEnabled(true);
                        }
                        setSimMode('vacuum');
                        setActiveDrainagePhase(phase.id as any);
                        setIsPlayingFlow(false);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all duration-300 group flex flex-col justify-between ${
                        isActive ? phase.activeClass : 'bg-slate-50 border-slate-100 text-slate-700 ' + phase.colorClass
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full mb-1">
                        <span className={`text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                          {phase.label}
                        </span>
                        <Icon size={12} className={isActive ? 'animate-pulse' : 'text-slate-400 group-hover:scale-110 transition-transform'} />
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold tracking-tight uppercase leading-none mb-0.5">{phase.title}</span>
                        <p className={`text-[10px] leading-tight font-sans ${isActive ? 'text-white/70' : 'text-slate-500'}`}>{phase.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSimMode('vacuum');
                    setActiveDrainagePhase('all');
                  }}
                  className={`text-[10px] font-extrabold tracking-wider uppercase transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                    activeDrainagePhase === 'all' && simMode === 'vacuum'
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-900 bg-slate-50'
                  }`}
                >
                  <Filter size={11} />
                  Show Combined Flow Cycles
                </button>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[24px] border border-slate-800 text-white shadow-xl relative overflow-hidden flex items-center gap-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-[120px] pointer-events-none" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                <ShieldCheck size={30} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-wider text-emerald-400 uppercase block">Automatic Automation</span>
                <h3 className="text-base font-extrabold text-white uppercase tracking-wide">Smart System Optimization</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Automatically switches between vacuum and pressure modes based on pitch conditions to maintain ideal air, water, and temperature.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PRESSURE MODE */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div className={`p-6 md:p-8 rounded-[24px] border transition-all duration-500 h-full flex flex-col justify-between ${
              simMode === 'pressure'
                ? 'bg-emerald-50/70 border-emerald-200 shadow-xl ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-100 opacity-60 grayscale-[40%]'
            }`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    simMode === 'pressure' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Wind size={22} className={simMode === 'pressure' ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-600 tracking-wider uppercase block">Pressure Mode</span>
                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">Air Injected to Roots</h3>
                  </div>
                </div>
                <p className="text-slate-650 text-xs leading-relaxed mb-6">
                  Filtered air is gently pushed into the soil to encourage deep, strong roots.
                </p>

                <div className="border-t border-slate-150/80 pt-5">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-4">How It Works</span>
                  <div className="space-y-4">
                    {[
                      { n: 1, label: 'Air Drawn in Vent',        sub: 'Air drawn through intake ports',              Icon: Wind,     last: false },
                      { n: 2, label: 'Air Premium Filtered',     sub: 'Dust, debris & micro-contaminants removed',   Icon: Filter,   last: false },
                      { n: 3, label: 'Injected Into Soil',       sub: 'Air pushed directly under turf blanket',      Icon: ArrowDown, last: false },
                      { n: 4, label: 'Stronger Roots, Healthy Turf', sub: 'Fosters massive capillary root growth',  Icon: Sprout,   last: true  },
                    ].map(({ n, label, sub, Icon, last }, idx) => (
                      <div key={n}>
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            simMode === 'pressure'
                              ? last
                                ? 'bg-emerald-600 text-white font-mono border border-emerald-700'
                                : 'bg-emerald-100 text-emerald-700 font-mono border border-emerald-300'
                              : 'bg-slate-100 text-slate-500'
                          }`}>{n}</div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                              <Icon size={13} className={simMode === 'pressure' ? (last ? 'text-emerald-600' : 'text-emerald-500') : 'text-slate-400'} />
                              {label}
                            </span>
                            <p className="text-[11px] text-slate-500 leading-snug">{sub}</p>
                          </div>
                        </div>
                        {!last && (
                          <div className="pl-3 py-1">
                            <ArrowDown size={14} className={`text-slate-300 animate-bounce ${simMode === 'pressure' ? 'text-emerald-400 font-bold' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: KEY BENEFITS */}
        <div className="bg-white border border-slate-150 p-8 rounded-[32px] shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-xs font-black tracking-[0.25em] text-slate-400 uppercase">Key Benefits of SubAir Technology</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefits.map((b, i) => {
              const IconComp = b.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100">
                  <div className={`w-12 h-12 rounded-full ${b.bgColor} ${b.color} flex items-center justify-center mb-3 shadow-inner`}>
                    <IconComp size={22} className="stroke-[2.5]" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-1 leading-tight">{b.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => triggerConsultation?.('Sub-Air Ventilation Technology', 'I would like to obtain a comprehensive tech proposal and price quotes regarding your cloned premium Sub-Air Ventilation and Drainage network.')}
            className="inline-flex items-center gap-3 bg-slate-900 hover:bg-green-600 active:scale-95 text-white font-black text-xs tracking-[0.2em] px-8 py-5 rounded-2xl uppercase transition-all shadow-xl shadow-slate-950/15"
          >
            Request Sub-Air Engineering Consultation
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </section>
  );
}