import { useState } from 'react';
import { MapPin, Navigation, Clock, Phone, Mail, ExternalLink } from 'lucide-react';

export default function SitraMap() {
  const [isHovered, setIsHovered] = useState(false);

  // Office Location Coordinates and address
  const address = "Sitra, Kingdom of Bahrain";
  const gmapsUrl = "https://maps.google.com/maps?q=Sitra,%20Kingdom%20of%20Bahrain&t=&z=13&ie=UTF8&iwloc=&output=embed";
  const navigationUrl = "https://www.google.com/maps/search/?api=1&query=Sitra+Kingdom+of+Bahrain";

  return (
    <section id="office-location" className="relative bg-[#181818] border-t border-white/5 py-16 overflow-hidden">
      {/* Visual background details */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,131,201,0.08),transparent_50%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#0083C9] block mb-2">
            PHYSICAL DEPLOYMENT CENTER
          </span>
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tight text-white uppercase">
            Sitra Regional <span className="text-[#36B649]">Office & Estimating</span> Depot
          </h2>
          <div className="w-20 h-1 bg-[#0083C9] mt-4" />
        </div>

        {/* Layout Wrapper: Sidebar + Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Informational Sidebar Details (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-zinc-900/80 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-md">
            <div className="space-y-8">
              {/* Header inside Card */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0083C9]/10 border border-[#0083C9]/30 flex items-center justify-center text-[#0083C9] shrink-0">
                  <MapPin size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Main Depot</h3>
                  <p className="text-xs text-gray-400 font-mono">CR No. 124032-1</p>
                </div>
              </div>

              {/* Exact Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Sitra Operations Depot</label>
                <p className="text-gray-300 text-sm leading-relaxed font-sans">
                  {address}
                </p>
              </div>

              {/* Working Hours */}
              <div className="flex gap-4 items-start pt-2">
                <Clock size={18} className="text-[#36B649] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-200 uppercase tracking-wider block">Office Operating Timings</span>
                  <span className="text-xs text-gray-400 block font-mono">Sunday to Thursday: 8:00 AM – 5:00 PM AST</span>
                  <span className="text-xs text-[#0083C9] font-bold block uppercase tracking-wide">Estimating units remain on standby</span>
                </div>
              </div>

              {/* Urgent Communications */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Telecommunications</label>
                <div className="space-y-2">
                  <a href="tel:+97377912500" className="flex items-center gap-3 text-xs text-gray-300 hover:text-[#0083C9] transition-colors font-mono">
                    <Phone size={14} className="text-[#0083C9]" />
                    <span>+973 77912500</span>
                  </a>
                  <a href="mailto:fastsafecontracting@gmail.com" className="flex items-center gap-3 text-xs text-gray-300 hover:text-[#0083C9] transition-colors font-mono">
                    <Mail size={14} className="text-[#0083C9]" />
                    <span>fastsafecontracting@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Anchor to External Google Maps */}
            <div className="pt-8 mt-8 border-t border-white/5">
              <a
                href={navigationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-[#0083C9] hover:bg-[#36B649] text-white flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg"
              >
                <Navigation size={14} className={isHovered ? 'animate-bounce' : ''} />
                <span>Open in Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Interactive Google Map iframe (8 cols) */}
          <div className="lg:col-span-8 bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px] lg:min-h-full">
            <iframe
              title="Sitra Office Map"
              src={gmapsUrl}
              className="w-full h-full border-0 absolute inset-0"
              style={{ filter: 'grayscale(0.1) contrast(1.1)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
