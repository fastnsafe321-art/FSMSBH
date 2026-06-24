import React, { FC } from 'react';
import { motion } from 'motion/react';
import { Expertise } from '../../types';
import { getImgUrl } from '../../utils';

interface ExpertiseSectionProps {
  expertiseList: Expertise[];
  onSelectExpertise: (expertise: Expertise) => void;
}

/**
 * Expertise Services Grid Section
 * Displays all service categories in an interactive grid
 */
export const ExpertiseSection: FC<ExpertiseSectionProps> = ({
  expertiseList,
  onSelectExpertise,
}) => {
  return (
    <section id="expertise" className="bg-[#fcfcfc] py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.3em] text-[#0083C9] mb-4 uppercase">
            Our Expertise
          </h2>
          <h3 className="text-4xl font-bold">What We Deliver</h3>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertiseList.map((exp, idx) => (
            <motion.div
              key={exp.name}
              whileHover={{ y: -10 }}
              onClick={() => onSelectExpertise(exp)}
              className={`group relative h-[450px] overflow-hidden cursor-pointer rounded-2xl ${
                idx === 0 || idx === 4 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Background Image */}
              <img
                src={getImgUrl(exp.image)}
                alt={exp.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-[#0083C9]/80 transition-all duration-500"></div>

              {/* Photo Count Badge */}
              <div className="absolute top-8 right-8">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20">
                  {exp.gallery.length} PHOTOS
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const IconComponent = exp.icon;
                    return (
                      <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 group-hover:bg-[#36B649] group-hover:border-[#36B649]/30 transition-all duration-300 shadow-sm">
                        <IconComponent size={16} strokeWidth={2.4} />
                      </div>
                    );
                  })()}
                  <h3 className="text-white font-bold text-lg md:text-xl tracking-tight transition-all duration-300">
                    {exp.name}
                  </h3>
                </div>
                <p className="text-white/0 group-hover:text-white/80 text-sm mt-4 transition-all duration-300 leading-snug">
                  {exp.desc}
                </p>
                <div className="w-0 group-hover:w-12 h-[2px] bg-white transition-all duration-500 mt-4"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
