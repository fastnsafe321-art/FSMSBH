import { motion } from 'motion/react';
import { EXPERTISE } from '../data/expertise';

interface Props {
  getImgUrl: (path?: string) => string;
  setSelectedExpertise: (exp: any) => void;
}

export default function ExpertiseGrid({ getImgUrl, setSelectedExpertise }: Props) {
  return (
    <section id="expertise" className="bg-[#fcfcfc] py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.3em] text-[#0083C9] mb-4 uppercase">Our Expertise</h2>
          <h3 className="text-4xl font-bold">What We Deliver</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERTISE.map((exp, idx) => (
            <motion.div key={exp.name} whileHover={{ y: -10 }} onClick={() => setSelectedExpertise(exp)}
              className={`group relative h-[450px] overflow-hidden cursor-pointer rounded-2xl ${idx === 0 || idx === 4 ? 'lg:col-span-2' : ''}`}>
              <img src={getImgUrl(exp.image)} alt={exp.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-[#0083C9]/80" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-white"><exp.icon size={16} strokeWidth={2.4} /></div>
                  <h3 className="text-white font-bold text-lg md:text-xl tracking-tight">{exp.name}</h3>
                </div>
                <p className="text-white/0 group-hover:text-white/80 text-sm mt-4 transition-all">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}