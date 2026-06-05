import { motion } from 'motion/react';
import { PROJECTS } from '../data/projects';

interface Props {
  getImgUrl: (path?: string) => string;
  setSelectedProject: (proj: any) => void;
}

export default function ProjectsGrid({ getImgUrl, setSelectedProject }: Props) {
  return (
    <section id="projects" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#0083C9] mb-4 uppercase">Reference Projects</h2>
            <h3 className="text-4xl font-bold">Featured Portfolio</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map(project => (
            <motion.div key={project.id} onClick={() => setSelectedProject(project)} className="group bg-white rounded-2xl overflow-hidden cursor-pointer">
              <div className="relative aspect-video">
                <img src={getImgUrl(project.image)} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-8">
                <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{project.desc}</p>
                <div className="flex justify-between text-xs text-gray-400">
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
}