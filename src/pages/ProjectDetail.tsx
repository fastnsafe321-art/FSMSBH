import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface Props {
  selectedProject: any;
  setSelectedProject: (proj: any) => void;
  triggerConsultation: (service?: string, message?: string) => void;
}

export default function ProjectDetail({ selectedProject, setSelectedProject, triggerConsultation }: Props) {
  if (!selectedProject) return null;

  return (
    <AnimatePresence>
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            layoutId={`project-${selectedProject.id}`}
            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center z-20 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="overflow-y-auto no-scrollbar">
              <div className="aspect-[21/9] w-full overflow-hidden">
                <img src={selectedProject.image.replace(/^\/src\/assets\/images\//, '/assets/images/')} alt={selectedProject.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="bg-[#0083C9] text-white px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                    {selectedProject.category}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-[#0083C9] uppercase">
                    Completed {selectedProject.year}
                  </span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold mb-8">{selectedProject.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-100 pt-12">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h4 className="text-xs font-bold text-[#0083C9] tracking-[0.2em] mb-4 uppercase">Project Overview</h4>
                      <p className="text-gray-600 leading-relaxed text-lg">{selectedProject.details}</p>
                    </div>

                    {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                      <div>
                        <h4 className="text-xs font-bold text-[#0083C9] tracking-[0.2em] mb-4 uppercase">Project Visual Archives</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedProject.gallery.map((imgUrl: string, i: number) => (
                            <div key={i} className="rounded-2xl overflow-hidden aspect-video relative group border border-gray-100 shadow-sm bg-gray-50">
                              <img src={imgUrl.replace(/^\/src\/assets\/images\//, '/assets/images/')} alt={`${selectedProject.title} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-2 uppercase">Client</h4>
                      <div className="font-bold text-gray-900">{selectedProject.client}</div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-2 uppercase">Location</h4>
                      <div className="font-bold text-gray-900">Manama, Kingdom of Bahrain</div>
                    </div>
                    <button 
                      onClick={() => triggerConsultation(selectedProject.category, `I am interested in exploring contracting solutions similar to the "${selectedProject.title}" project.`)}
                      className="w-full bg-black text-white py-4 font-bold text-xs tracking-widest hover:bg-[#0083C9] transition-colors rounded-xl"
                    >
                      INQUIRE ABOUT SIMILAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}