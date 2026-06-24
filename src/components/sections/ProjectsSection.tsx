import React, { FC, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';
import { Project } from '../../types';
import { getImgUrl } from '../../utils';

interface ProjectsSectionProps {
  projectsList: Project[];
  onAddProject: () => void;
  onSelectProject: (project: Project) => void;
  onDeleteProject: (id: number) => void;
}

/**
 * Projects Portfolio Section
 * Displays project cards in a grid layout
 */
export const ProjectsSection: FC<ProjectsSectionProps> = ({
  projectsList,
  onAddProject,
  onSelectProject,
  onDeleteProject,
}) => {
  const [projectToDeleteConfirm, setProjectToDeleteConfirm] = useState<number | null>(null);

  return (
    <section id="projects" className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#0083C9] mb-4 uppercase">
              Reference Projects
            </h2>
            <h3 className="text-4xl font-bold">Featured Portfolio</h3>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Explore our track record of excellence across professional sports grounds, educational
              facilities, and turnkey engineering solutions in the Kingdom of Bahrain.
            </p>
          </div>
          <button
            onClick={onAddProject}
            className="bg-[#0083C9] hover:bg-black text-white px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md flex items-center gap-2 shrink-0 border border-[#0083C9]/10"
          >
            <Plus size={16} />
            <span>Add Portfolio Project</span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList.map((project) => (
            <motion.div
              key={project.id}
              layoutId={`project-${project.id}`}
              onClick={() => onSelectProject(project)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full border border-gray-100 relative"
            >
              {/* Delete Button */}
              <div className="absolute top-4 right-4 z-25 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (projectToDeleteConfirm === project.id) {
                      onDeleteProject(project.id);
                      setProjectToDeleteConfirm(null);
                    } else {
                      setProjectToDeleteConfirm(project.id);
                      setTimeout(() => {
                        setProjectToDeleteConfirm(prev =>
                          prev === project.id ? null : prev
                        );
                      }, 4000);
                    }
                  }}
                  className={`p-2 rounded-lg text-white shadow-xl backdrop-blur-md transition-all flex items-center gap-1 ${
                    projectToDeleteConfirm === project.id
                      ? 'bg-red-600 hover:bg-red-700 text-[10px] font-bold uppercase tracking-widest px-3 py-2'
                      : 'bg-black/60 hover:bg-red-650'
                  }`}
                  title={projectToDeleteConfirm === project.id ? 'Confirm Deletion' : 'Delete Project'}
                >
                  <Trash2 size={13} />
                  {projectToDeleteConfirm === project.id && <span>Confirm Delete</span>}
                </button>
              </div>

              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={getImgUrl(project.image)}
                  alt={project.title}
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

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-xl font-bold mb-2 group-hover:text-[#0083C9] transition-colors">
                  {project.title}
                </h4>
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
