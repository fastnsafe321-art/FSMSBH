import { motion } from 'motion/react';
import { EXPERTISE } from '../data/expertise';

const getImgUrl = (path?: string) => path ? path.replace(/^\/src\/assets\/images\//, '/assets/images/') : '';

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.3em] text-[#0083C9] mb-4 uppercase">OUR SERVICES</h2>
          <h3 className="text-4xl font-bold mb-4">What We Specialize In</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From premium sports surfaces to complete construction solutions — we deliver excellence across multiple domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERTISE.map((service) => (
            <motion.div
              key={service.name}
              whileHover={{ y: -8 }}
              className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              onClick={() => document.querySelector('#expertise')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={getImgUrl(service.image)} 
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h4 className="font-bold text-xl mb-3 group-hover:text-[#0083C9] transition-colors">{service.name}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                <div className="mt-6 text-[#0083C9] text-sm font-medium flex items-center gap-2">
                  Learn More <span>→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}