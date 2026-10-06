import React, { FC } from 'react';
import { motion } from 'motion/react';
import { Project } from '../../types';
import ResponsiveImage from '../media/ResponsiveImage';

interface ProjectsSectionProps {
  projectsList: Project[];
  onSelectProject: (project: Project) => void;
}

/**
 * Projects Portfolio Section
 * Displays project cards in a grid layout
 */
export const ProjectsSection: FC<ProjectsSectionProps> = ({
  projectsList,
  onSelectProject,
}) => {
  return (
    <section id="projects" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-bold tracking-[0.3em] text-[#0083C9] mb-4 uppercase">
            Reference Projects
          </p>
          <h2 className="text-4xl font-bold">Football Pitch & Construction Projects</h2>
          <p className="text-gray-500 mt-4 leading-relaxed">
            Explore our track record of excellence across professional sports grounds, educational
            facilities, and turnkey engineering solutions in the Kingdom of Bahrain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList.map((project) => (
            <motion.div
              key={project.id}
              layoutId={`project-${project.id}`}
              onClick={() => onSelectProject(project)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full border border-gray-100 relative"
            >
              <div className="relative aspect-video overflow-hidden">
                <ResponsiveImage
                  src={project.image}
                  alt={project.title}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold tracking-wider text-[#0083C9] uppercase shadow-sm">
                    {project.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold tracking-widest bg-[#0083C9] px-6 py-2 rounded shadow-lg uppercase">
                    View Details
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#0083C9] transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                  {project.desc}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  <span>{project.client}</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
