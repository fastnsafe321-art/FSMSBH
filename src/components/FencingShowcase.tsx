import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Target, 
  Sparkles, 
  Baby, 
  Factory, 
  Home, 
  Trees, 
  Lock, 
  CheckCircle2, 
  Wrench, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  Truck, 
  HeartHandshake,
  Menu,
  Maximize2,
  Camera,
  RefreshCw
} from 'lucide-react';

interface FencingShowcaseProps {
  getImgUrl?: (path: string | undefined) => string;
}

// Compress Base64 Photo under target limits to ensure perfect performance & database payload size
const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 600): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.55));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

const APPLICATIONS = [
  {
    id: 'football',
    name: 'Football Pitch',
    icon: Target,
    subtitle: 'High-Impact Perimeter Containment',
    image: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200',
    desc: 'Heavy-duty panel systems optimized for athletic ball bounce containment. Built with double-wire rigid mesh elements up to 6.0 meters high, with reinforced bottom rebound panels and noise-dampening mounting clips.',
    specs: [
      { label: 'Standard Height', value: '3.0m to 6.0m tailored sections' },
      { label: 'Mesh Aperture', value: '50mm x 200mm double-wire configuration' },
      { label: 'Anti-Vibration', value: 'Synthetic EPDM isolation buffers' },
      { label: 'Structural Wind Load', value: 'Wind-tunnel tested up to 50 m/s' }
    ]
  },
  {
    id: 'training',
    name: 'Training Area',
    icon: Shield,
    subtitle: 'Sub-Divided Practice Zones',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200',
    desc: 'Modular court dividers designed to partition football training zones. Minimizes stray balls, organizes training drills, and guarantees complete safety for players in adjacent zones.',
    specs: [
      { label: 'Standard Height', value: '2.0m to 4.0m flexible sections' },
      { label: 'Mesh Profile', value: 'Standard flat weld mesh' },
      { label: 'Portability', value: 'Fixed anchors under synthetic turf base' },
      { label: 'Top Profile', value: 'Flush safety post caps' }
    ]
  },
  {
    id: 'multisport',
    name: 'Multi-Sport Court',
    icon: Sparkles,
    subtitle: 'Integrated Basketball & Tennis Limits',
    image: 'https://images.unsplash.com/photo-1595150531594-3592a5ee41de?q=80&w=1200',
    desc: 'Extremely resilient sports fencing suited for tennis, basketball, and handball courts. Integrates high-tension netting, customized heavy chain-link or rigid double-wire panels with ultra-smooth anti-snag coating.',
    specs: [
      { label: 'Impact Durability', value: 'High elastic recovery steel' },
      { label: 'Mesh Opening', value: '45mm x 45mm compact sizing' },
      { label: 'Corrosion Shield', value: 'Premium thermo-bonded polymer' },
      { label: 'Gate Interlocks', value: 'Dual-access self-locking levers' }
    ]
  },
  {
    id: 'school',
    name: 'School & Playground',
    icon: Baby,
    subtitle: 'Under-Age Safety Barriers',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200',
    desc: 'Child-safe boundary panels with completely rounded joints, flush bolts, and anti-trap vertical spacing. Colors are optimized in vibrant palettes to create friendly, safe, and positive playground environments.',
    specs: [
      { label: 'Trap Prevention', value: 'Under-89mm vertical pale clearance' },
      { label: 'Aesthetic finishes', value: 'Anti-peel high durability polyester powder' },
      { label: 'Safety standard', value: 'Complies strictly with EN 1176 standards' },
      { label: 'Gate Locks', value: 'Secure magnetic hydraulic latching' }
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial Area',
    icon: Factory,
    subtitle: 'Asset Protection & Anti-Intrusion',
    image: '/src/assets/images/palisade_security_fence_1779108020060.png',
    desc: 'Ultra-tough physical security boundaries. Features anti-climb corrugated palisade pales, razor-wire overhangs, and thick high-tensile twin wire meshes designed to delay and deny unauthorized mechanical entries.',
    specs: [
      { label: 'Intrusion Resistance', value: 'Anti-cut triple point sharp pales' },
      { label: 'Panel Fixing', value: 'Un-backable cup square carriage bolts' },
      { label: 'Steel Gauge', value: '3.0mm structural galvanized steel profile' },
      { label: 'Underhang Security', value: 'Concrete sill footing embedded' }
    ]
  },
  {
    id: 'residential',
    name: 'Residential Compound',
    icon: Home,
    subtitle: 'Elegant Boundary Framing',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1200',
    desc: 'Blends state-of-the-art physical security with sleek domestic architecture. Minimalist clean-line horizontal posts, matte anthracite finishes, integrated video-intercom pedestrian gates, and decorative privacy leaf slats.',
    specs: [
      { label: 'Privacy System', value: 'Optional wood-grain ALU-slat slide-ins' },
      { label: 'Coating', value: 'Premium architectural grade structural powder' },
      { label: 'Foundation Type', value: 'Core drilled or reinforced anchor baseplate' },
      { label: 'Gate Automation', value: 'Fully integrated underground motor slots' }
    ]
  },
  {
    id: 'park',
    name: 'Park & Public Area',
    icon: Trees,
    subtitle: 'Eco-Friendly Visual Barriers',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=1200',
    desc: 'Warm, low-maintenance protective panels designed to merge seamlessly with urban landscape planting beds, running tracks, and botanical park walks.',
    specs: [
      { label: 'Aesthetic Line', value: 'Low profile single beam fencing' },
      { label: 'Protective Finish', value: 'Salt-spray proof zinc electroplating' },
      { label: 'Ground Anchor', value: 'Root concrete poured sockets' },
      { label: 'Eco Profile', value: '100% recyclable premium steel alloy' }
    ]
  },
  {
    id: 'temporary',
    name: 'Temporary Fencing',
    icon: Lock,
    subtitle: 'Rapid Deployment Security Barriers',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200',
    desc: 'Self-standing modular construction fences with concrete counter-weight block bases. Rapid to assemble, lock, and dismount, ensuring public pathways are safely cordoned off.',
    specs: [
      { label: 'Setup Speed', value: '100 linear meters per hour rate' },
      { label: 'Panel Weight', value: '18.5kg high maneuverability panels' },
      { label: 'Base Block', value: '30kg high-density thermoplastic compound' },
      { label: 'Safety Joints', value: 'Double heavy-gauge anti-lift steel couplers' }
    ]
  }
];

const TYPES = [
  {
    name: 'Chain Link Fence',
    desc: 'Highly flexible, cost-efficient, classic woven diamond patterns. Fully galvanized wire with PVC coating, heavily resistant to corrosion. Best for perimeter security, tennis courts, and school backdrops.'
  },
  {
    name: 'Welded Mesh Fence',
    desc: 'Extremely rigid panels created by high-frequency electrical cross-wire welding. Vertical V-bends add exceptional structural beam stiffness. Beautiful high-class modern aesthetics.'
  },
  {
    name: 'Twin Wire Fence',
    desc: 'Features heavy double horizontal wires clamped across single vertical wire nodes. Completely flat profile with immense anti-collision strength, specifically engineered for soccer rebound actions.'
  },
  {
    name: 'Palisade Fence',
    desc: 'High-security boundary featuring corrugated vertical hot-dip steel pales. Features anti-climb pointed fork tips and concealed bolt-on sleeves. The premium Choice for high-value industrial utilities.'
  },
  {
    name: 'Decorative Fence',
    desc: 'Architecturally stylized fences incorporating elegant circular rings, vertical spears, spearheads or custom metal motifs. Provides high visual prestige for grand housing communities.'
  },
  {
    name: 'Net Fencing',
    desc: 'Ultra-high high-altitude soft-net netting assemblies mounted on heavy structural steel support posts. Defends from stray ball escape at soccer arenas and multi-sport activity centers.'
  }
];

const STEPS = [
  {
    step: '01',
    title: 'Site Marking',
    desc: 'Meticulous site survey checking boundary angles, laser aligning fence lines, marking correct post centers, and ensuring ideal structural clearances.',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200'
  },
  {
    step: '02',
    title: 'Post Installation',
    desc: 'Core-drilling concrete base beams or digging post holes, plumb-aligning heavy steel posts, and pouring high-grade reinforced concrete footings.',
    image: '/src/assets/images/fencing_work_installation_1779107563771.png'
  },
  {
    step: '03',
    title: 'Mesh Panel Installation',
    desc: 'Mounting heavy-duty galvanized rigid mesh panels systematically onto structural steel posts using precision calibrated horizontal brackets.',
    image: '/src/assets/images/fence_security_detail_1779107792940.png'
  },
  {
    step: '04',
    title: 'Fixing & Alignment',
    desc: 'Securing panels with heavy-gauge clamp brackets, anti-vibration rubber isolation seals, and drilling anti-tamper shear safety nuts.',
    image: '/src/assets/images/fence_security_detail_1779107792940.png'
  },
  {
    step: '05',
    title: 'Gate Installation',
    desc: 'Fitting heavy double-leaf vehicle access swing gates or cantilever automated sliding gates complete with industrial-duty drop bolts and locks.',
    image: '/src/assets/images/fencing_heavy_gate_1779108334518.png'
  },
  {
    step: '06',
    title: 'Final Checking',
    desc: 'Validating panel plumbness and line laser accuracy, checking gate swing clearance, testing absolute lock mechanics, and applying matching zinc touch-ups.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200'
  },
  {
    step: '07',
    title: 'Completed Fencing',
    desc: 'Final site polish and hand-over of a pristine, high-contrast sports or security boundary engineered specifically to withstand Bahrain wind-loads.',
    image: '/src/assets/images/fencing_sports_netting_1779108316007.png'
  }
];

const SPECS = [
  { name: 'Material', value: 'GI / MS / PVC Coated Heavy Steel' },
  { name: 'Height', value: '2.0m to 6.0m (customizable as per engineering designs)' },
  { name: 'Mesh Sizing', value: '50x50mm, 50x100mm, 75x75mm standard patterns' },
  { name: 'Wire Diameter', value: '2.5mm to 5.0mm thick high-diameter cores' },
  { name: 'Post Size Options', value: '60x60mm, 75x75mm, 100x100mm heavy wall tube' },
  { name: 'Coating Protection', value: 'Hot-Dip Galvanized & High-Adhesion Powder Coated' },
  { name: 'Color Palette', value: 'Classic Moss Green, Charcoal Black, Dark Grey, or Custom RAL' },
  { name: 'Standards Compliance', value: 'BS EN 10223, ASTM A121, & Local Bahrain Municipal Demands' }
];

const SPEC_DETAILS = [
  { name: 'Post Base Plate', desc: 'Thick steel plates anchor-bolted onto concrete curbs with high-tensile steel chemical anchors.' },
  { name: 'Mesh Panel Detail', desc: 'Symmetrical wire grids featuring deep V-bends that dramatically multiply horizontal rigidity.' },
  { name: 'Corner Detail', desc: 'Specialized 90-degree heavy bracket clips to anchor wire tensioners and main posts together beautifully.' },
  { name: 'Top Bending Detail', desc: 'Overhanging protective curved brackets or bent wire configurations for added safety or intrusion denial.' },
  { name: 'Fixing Clip Detail', desc: 'High-strength steel clamp brackets featuring interior synthetic rubber pads to eliminate vibration rattling.' },
  { name: 'Gate Lock Detail', desc: 'Anti-corrosion solid brass mechanical cylinders and heavy locks with high-impact strike receptors.' }
];

const REASONS = [
  { icon: Users, title: 'Experienced Team', desc: 'Our qualified engineering team has laid out kilometers of high-security and stadium fencing in Bahrain.' },
  { icon: Sparkles, title: 'Premium Materials', desc: 'We utilize premium first-grade steel with thick, weather-proof powder-coat finishes.' },
  { icon: Wrench, title: 'Expert Installation', desc: 'We utilize laser boundary alignment and chemical base anchors for sub-degree post verticality.' },
  { icon: TrendingUp, title: 'Competitive Prices', desc: 'Direct sourcing networks keep physical panel costs highly competitive across commercial margins.' },
  { icon: Truck, title: 'On-Time Delivery', desc: 'Structured heavy logistical support fleet avoids common project critical path delays.' },
  { icon: HeartHandshake, title: 'After Sales Support', desc: 'Our dedicated care cell handles gate alignments and swift post-collision repairs.' }
];

export default function FencingShowcase({ getImgUrl = (p) => p || '' }: FencingShowcaseProps) {
  const [activeTab, setActiveTab] = useState('football');
  
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('fencing_custom_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return APPLICATIONS.map(app => {
            const savedApp = parsed.find((item: any) => item.id === app.id);
            return savedApp ? { ...app, image: savedApp.image } : app;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return APPLICATIONS;
  });

  const [steps, setSteps] = useState(() => {
    try {
      const saved = localStorage.getItem('fencing_custom_steps');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return STEPS.map(step => {
            const savedStep = parsed.find((item: any) => item.step === step.step);
            return savedStep ? { ...step, image: savedStep.image } : step;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return STEPS;
  });

  const handleAppImageUpload = async (appId: string, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const compressed = await compressImage(reader.result, 800, 600);
          const updated = applications.map(app => {
            if (app.id === appId) {
              return { ...app, image: compressed };
            }
            return app;
          });
          setApplications(updated);
          // Save a light version stripping JSX Icon function
          const dataToSave = updated.map(({ icon, ...rest }) => ({ ...rest }));
          localStorage.setItem('fencing_custom_applications', JSON.stringify(dataToSave));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStepImageUpload = async (stepNum: string, event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          const compressed = await compressImage(reader.result, 800, 600);
          const updated = steps.map(step => {
            if (step.step === stepNum) {
              return { ...step, image: compressed };
            }
            return step;
          });
          setSteps(updated);
          localStorage.setItem('fencing_custom_steps', JSON.stringify(updated));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCustomImages = () => {
    if (window.confirm("Are you sure you want to reset all custom fencing photos back to standard?")) {
      localStorage.removeItem('fencing_custom_applications');
      localStorage.removeItem('fencing_custom_steps');
      setApplications(APPLICATIONS);
      setSteps(STEPS);
    }
  };

  const currentApp = applications.find(a => a.id === activeTab) || applications[0];

  return (
    <div className="space-y-24 bg-white rounded-3xl mt-12 p-1 border border-gray-100">
      
      {/* SECTION 1: HEADER & APPLICATIONS TAB SYSTEM */}
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#0083C9] bg-[#0083C9]/5 px-4 py-1.5 rounded-full inline-block">
            FENCING APPLICATIONS
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug uppercase">
            Professional Sports & Security Fencing
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed font-medium">
            Certified perimeter solutions built to withstand Bahrain’s severe marine environments. From FIFA-standard stadium containment nets to anti-intrusion industrial security fencing.
          </p>
          {(localStorage.getItem('fencing_custom_applications') || localStorage.getItem('fencing_custom_steps')) && (
            <div className="pt-2">
              <button
                onClick={resetCustomImages}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-bold tracking-widest text-red-600 bg-red-50 hover:bg-red-100 transition-colors uppercase border border-red-200"
              >
                <RefreshCw size={10} className="animate-spin-slow" />
                <span>Reset Custom Fencing Photos</span>
              </button>
            </div>
          )}
        </div>

        {/* Categories Tabs Selector */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {applications.map((app) => {
            const Icon = app.icon;
            const isActive = app.id === activeTab;
            
            return (
              <button
                key={app.id}
                onClick={() => setActiveTab(app.id)}
                id={`tab-fencing-${app.id}`}
                className={`flex items-center gap-2.5 px-4 md:px-5 py-3 rounded-full text-[10px] font-extrabold tracking-widest uppercase transition-all duration-300 border shadow-sm ${
                  isActive 
                    ? 'bg-[#0083C9] border-[#0083C9] text-white' 
                    : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:text-gray-900'
                }`}
              >
                <Icon size={13} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{app.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Application Presentation Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentApp.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-gray-50/50 rounded-[36px] p-6 md:p-10 border border-gray-100 shadow-sm"
          >
            {/* Visual Aspect Spot */}
            <div className="lg:col-span-5 relative group overflow-hidden rounded-[24px] bg-white border border-gray-100 shadow-md h-[340px] md:h-[400px]">
              <img
                src={getImgUrl(currentApp.image)}
                alt={currentApp.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"></div>

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-gray-100 shadow-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B649]"></span>
                <span className="text-[9px] font-bold text-gray-800 tracking-wider uppercase">Active Site Portfolio</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-bold text-[#0083C9] tracking-widest uppercase block">{currentApp.subtitle}</span>
                <h4 className="text-xl font-bold uppercase tracking-wide leading-tight">{currentApp.name} Fencing</h4>
              </div>
            </div>

            {/* Application Information & Spec Table */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 tracking-[0.34em] uppercase">Security Level & Geometry</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  {currentApp.desc}
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <span className="bg-[#36B649]/5 text-[#36B649] border border-[#36B649]/20 font-bold px-3.5 py-1.5 rounded-full text-[9px] tracking-wider uppercase flex items-center gap-1.5">
                    <CheckCircle2 size={12} strokeWidth={2.5} />
                    ASTM/BS Certified Steel Core
                  </span>
                  <span className="bg-[#0083C9]/5 text-[#0083C9] border border-[#0083C9]/20 font-bold px-3.5 py-1.5 rounded-full text-[9px] tracking-wider uppercase flex items-center gap-1.5">
                    <CheckCircle2 size={12} strokeWidth={2.5} />
                    High Wind-Load Calibrated
                  </span>
                </div>
              </div>

              {/* Technical Performance Grid */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-inner space-y-4">
                <h5 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase flex items-center gap-1.5">
                  <Wrench size={11} className="text-[#0083C9]" />
                  Structural Engineering Profile
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentApp.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="border-b border-gray-50 pb-2 space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{spec.label}</span>
                      <span className="text-xs font-bold text-gray-800 uppercase block">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SECTION 2: TYPES OF FENCING WE PROVIDE */}
      <div className="space-y-12 border-t border-gray-100 pt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold tracking-[0.34em] uppercase text-[#36B649] bg-[#36B649]/5 px-4 py-1.5 rounded-full inline-block">
            TYPES WE PROVIDE
          </span>
          <h4 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight uppercase">
            Types of Fencing
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed max-w-lg mx-auto">
            From flexible woven security chain-links to heavy engineered double-mesh structural steel fencing products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TYPES.map((type, tIdx) => (
            <div 
              key={type.name}
              id={`fence-type-card-${type.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-gray-50 hover:bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-[#0083C9] tracking-wider uppercase bg-[#0083C9]/5 px-2 py-0.5 rounded">
                    Fenced Profile {String(tIdx + 1).padStart(2, '0')}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0083C9]/30 group-hover:bg-[#36B649] transition-colors"></span>
                </div>
                <h5 className="text-base font-bold text-gray-900 group-hover:text-[#0083C9] transition-colors uppercase tracking-wider">
                  {type.name}
                </h5>
                <p className="text-gray-500 text-xs font-medium leading-relaxed">
                  {type.desc}
                </p>
              </div>
              <div className="border-t border-gray-150/10 mt-6 pt-3 flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[#36B649] transition-colors">
                <span>Heavy Duty Guarantee</span>
                <CheckCircle2 size={12} className="text-[#36B649]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: FENCING WORK IN PROGRESS PROCESS */}
      <div className="space-y-12 border-t border-gray-100 pt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold tracking-[0.34em] uppercase text-[#0083C9] bg-[#0083C9]/5 px-4 py-1.5 rounded-full inline-block">
            WORK PROCESS
          </span>
          <h4 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight uppercase">
            7-Stage Fencing Installation Flow
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed max-w-lg mx-auto">
            Our systematic project layout process guarantees precise structural alignment, concrete depth integrity, and secure structural clamps.
          </p>
        </div>

        {/* Step Cards Horizontal Scrolling or Wrap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {steps.map((stepUnit, sIdx) => (
            <div 
              key={stepUnit.step}
              id={`fence-step-${stepUnit.step}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Image header */}
                <div className="h-44 relative overflow-hidden bg-gray-100">
                  <img
                    src={getImgUrl(stepUnit.image)}
                    alt={stepUnit.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                  {/* Step Code Badge */}
                  <div className="absolute top-3 left-3 bg-[#0083C9] text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md tracking-widest">
                    STAGE {stepUnit.step}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h5 className="text-xs font-bold uppercase tracking-wider">{stepUnit.title}</h5>
                  </div>
                </div>

                {/* Description details */}
                <div className="px-5 pb-5 space-y-2">
                  <p className="text-gray-500 text-xs font-medium leading-relaxed">
                    {stepUnit.desc}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-50 px-5 py-3 flex items-center justify-between text-[9px] font-bold text-gray-400 capitalize">
                <span>Plumb Checked</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B649]"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: TECHNICAL SPECIFICATIONS & DETAIL BLOCKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-gray-100 pt-16">
        
        {/* Specifications Matrix list side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold tracking-[0.34em] uppercase text-[#36B649] bg-[#36B649]/5 px-4 py-1.5 rounded-full inline-block">
              TECHNICAL DATASHEET
            </span>
            <h4 className="text-xl font-bold text-gray-900 uppercase">
              Fencing Specifications
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our steel units are fabricated, galvanized, and powder-coated to meet rigorous international ASTM standards.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
            {SPECS.map((spec) => (
              <div key={spec.name} className="border-b border-gray-150/45 pb-3 last:border-0 last:pb-0 space-y-1">
                <span className="text-[10px] font-bold text-[#0083C9] uppercase tracking-wider block">{spec.name}</span>
                <p className="text-xs font-extrabold text-gray-800 uppercase leading-snug">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Detail blocks side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold tracking-[0.34em] uppercase text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full inline-block">
              ENGINEERED DETAILS
            </span>
            <h4 className="text-xl font-bold text-gray-900 uppercase">
              Bespoke Fixing Details
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every interface connection and anchor bolt is calculated by our in-house engineers to guarantee complete, maintenance-free wind stability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPEC_DETAILS.map((det) => (
              <div 
                key={det.name}
                id={`spec-detail-box-${det.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:border-[#0083C9]/30 hover:shadow-md transition-all duration-300 space-y-2 group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0083C9] group-hover:bg-[#36B649] transition-colors"></span>
                  <h5 className="text-xs font-bold text-gray-800 uppercase tracking-widest group-hover:text-[#0083C9] transition-colors">
                    {det.name}
                  </h5>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed font-medium">
                  {det.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 5: WHY CHOOSE US IN BAHRAIN */}
      <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 space-y-10 border border-gray-800">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#36B649] bg-[#36B649]/10 px-4 py-1 rounded-full inline-block">
            WHY TRUST FAST & SAFE SOLUTIONS?
          </span>
          <h4 className="text-xl md:text-2xl font-bold tracking-wide uppercase">
            Fencing Champions in Bahrain
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            With hundreds of high-load containment installations built from Sitra to Amwaj, our division is Bahrain’s core partner for professional sports enclosures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((re) => {
            const Icon = re.icon;
            return (
              <div key={re.title} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#0083C9]/20 flex items-center justify-center text-[#0083C9]">
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <h5 className="text-sm font-bold uppercase tracking-wider text-white">{re.title}</h5>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">{re.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="space-y-1">
            <h6 className="text-[10px] font-bold text-[#36B649] uppercase tracking-widest">COMMITMENT SLOGAN</h6>
            <p className="text-sm font-extrabold uppercase tracking-widest text-white">STRONG. SECURE. DURABLE. BUILT FOR BAHRAIN</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['Sports Enclosures', 'Industrial Sites', 'Schools & Parks', 'Residential Area'].map((p) => (
              <span key={p} className="bg-white/15 text-[9px] font-bold text-gray-300 uppercase tracking-wider px-3 py-1 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
