import React, { FC } from 'react';
import { motion } from 'motion/react';
import { Expertise } from '../../types';
import ResponsiveImage from '../media/ResponsiveImage';

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
          <p className="text-sm font-bold tracking-[0.3em] text-[#0083C9] mb-4 uppercase">
            Our Expertise
          </p>
          <h2 className="text-4xl font-bold">Turf Installation & Construction Services</h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertiseList.map((exp, idx) => {
            const label = exp.displayName || exp.name;
            return (
            <motion.div
              key={exp.name}
              whileHover={{ y: -10 }}
              onClick={() => onSelectExpertise(exp)}
              className={`group relative h-[450px] overflow-hidden cursor-pointer rounded-2xl ${
                idx === 0 || idx === 4 ? 'lg:col-span-2' : ''
              }`}
            >
              {/* Background Image */}
              <ResponsiveImage
                src={exp.image}
                alt={label}
                sizes={idx === 0 || idx === 4 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-[#0083C9]/80 transition-all duration-500"></div>

              {/* Photo Count Badge */}
              <div className="absolute top-8 right-8">
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20">
                  {(Array.isArray(exp.gallery) ? exp.gallery.length : 0)} PHOTOS
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="flex items-center gap-3 mb-2">
                  {typeof exp.icon === 'function' ? (
                    <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 group-hover:bg-[#36B649] group-hover:border-[#36B649]/30 transition-all duration-300 shadow-sm">
                      {React.createElement(exp.icon, { size: 16, strokeWidth: 2.4 })}
                    </div>
                  ) : null}
                  <h3 className="text-white font-bold text-lg md:text-xl tracking-tight transition-all duration-300">
                    {label}
                  </h3>
                </div>
                <p className="text-white/80 text-sm mt-3 leading-snug">
                  {exp.desc}
                </p>
                <div className="w-0 group-hover:w-12 h-[2px] bg-white transition-all duration-500 mt-4"></div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
