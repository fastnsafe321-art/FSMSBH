import { AnimatePresence, motion } from 'motion/react';
import { X, Search, ChevronRight, Check } from 'lucide-react';
import NaturalGrassShowcase from '../components/NaturalGrassShowcase';
import FencingShowcase from '../components/FencingShowcase';

interface Props {
  selectedExpertise: any;
  setSelectedExpertise: (exp: any) => void;
  triggerConsultation: (service?: string, message?: string) => void;
}

const getImgUrl = (path: string | undefined): string => {
  if (!path) return '';
  return path.replace(/^\/src\/assets\/images\//, '/assets/images/');
};

export default function ExpertiseDetail({ selectedExpertise, setSelectedExpertise, triggerConsultation }: Props) {
  if (!selectedExpertise) return null;

  return (
    <AnimatePresence>
      {selectedExpertise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedExpertise(null)}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="bg-white w-full max-w-7xl h-full md:h-[95vh] md:rounded-[40px] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row"
          >
            {/* Sidebar */}
            <div className="hidden lg:flex w-72 bg-gray-50 border-r border-gray-100 flex-col p-10">
              <div className="w-12 h-12 bg-[#0083C9] rounded-xl flex items-center justify-center text-white font-bold mb-12">F+S</div>
              <div className="flex-grow space-y-2">
                <a href="#overview" className="block text-sm font-bold text-[#0083C9] py-2">01. Overview</a>
                <a href="#technical" className="block text-sm font-bold text-gray-300 py-2 hover:text-[#0083C9]">02. Tech Specs</a>
                {selectedExpertise.installationSteps && <a href="#steps" className="block text-sm font-bold text-gray-300 py-2 hover:text-[#0083C9]">03. Installation Flow</a>}
                <a href="#gallery" className="block text-sm font-bold text-gray-300 py-2 hover:text-[#0083C9]">Gallery</a>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col overflow-y-auto no-scrollbar relative">
              <button onClick={() => setSelectedExpertise(null)} className="hidden lg:flex absolute top-10 right-10 w-12 h-12 bg-gray-100 hover:bg-[#0083C9] hover:text-white rounded-full items-center justify-center z-60 transition-all">
                <X size={24} />
              </button>

              {/* Header */}
              <section id="overview" className="relative h-[500px] shrink-0 bg-black overflow-hidden flex flex-col justify-end p-12 md:p-20">
                <img src={getImgUrl(selectedExpertise.image)} className="absolute inset-0 w-full h-full object-cover opacity-90" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                <div className="relative z-10 max-w-3xl">
                  <span className="bg-[#0083C9] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase mb-6 inline-block">Premium Engineering</span>
                  <h3 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-6">{selectedExpertise.name}</h3>
                  <p className="text-white/80 text-lg md:text-xl leading-relaxed font-light italic">{selectedExpertise.detailedDesc}</p>
                </div>
              </section>

              <div className="p-8 md:p-20 space-y-24 bg-white">
                {/* Features */}
                <section id="technical">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="h-px bg-gray-100 flex-grow"></div>
                    <h4 className="text-sm font-bold tracking-[0.4em] text-[#0083C9] uppercase">Detailed Specifications</h4>
                    <div className="h-px bg-gray-100 flex-grow"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedExpertise.features?.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-[#0083C9]/5 transition-colors">
                        <ChevronRight size={18} className="text-[#0083C9] mt-1" />
                        <span className="text-sm font-bold text-gray-700 mt-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Installation Steps */}
                {selectedExpertise.installationSteps && (
                  <section id="steps">
                    <div className="flex items-center gap-6 mb-12">
                      <div className="h-px bg-gray-100 flex-grow"></div>
                      <h4 className="text-sm font-bold tracking-[0.4em] text-[#0083C9] uppercase">{selectedExpertise.installationSteps.length}-Stage Installation</h4>
                      <div className="h-px bg-gray-100 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {selectedExpertise.installationSteps.map((step: any, i: number) => (
                        <div key={i} className="bg-gray-50 rounded-[28px] overflow-hidden border border-gray-100">
                          <img src={getImgUrl(step.image)} alt={step.title} className="w-full h-48 object-cover" />
                          <div className="p-6">
                            <h5 className="font-bold text-lg mb-2">{step.title}</h5>
                            <p className="text-sm text-gray-600">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Showcases */}
                {selectedExpertise.name === 'NATURAL GRASS INSTALLATION' && <NaturalGrassShowcase getImgUrl={getImgUrl} />}
                {selectedExpertise.name === 'FENCING WORKS' && <FencingShowcase getImgUrl={getImgUrl} />}

                {/* Gallery */}
                <section id="gallery">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="h-px bg-gray-100 flex-grow"></div>
                    <h4 className="text-sm font-bold tracking-[0.4em] text-[#0083C9] uppercase">Project Archive</h4>
                    <div className="h-px bg-gray-100 flex-grow"></div>
                  </div>
                  <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {selectedExpertise.gallery.map((img: string, i: number) => (
                      <div key={i} className="break-inside-avoid rounded-3xl overflow-hidden">
                        <img src={getImgUrl(img)} alt="" className="w-full h-auto" />
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* CTA */}
              <div className="p-8 md:p-12 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-10">
                <button 
                  onClick={() => triggerConsultation(selectedExpertise.name, `I would like a technical quote for: ${selectedExpertise.name}`)}
                  className="w-full md:w-auto bg-[#0083C9] text-white px-16 py-6 rounded-2xl font-bold text-sm tracking-[0.3em] hover:bg-black transition-all uppercase"
                >
                  REQUEST TECHNICAL QUOTE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}