import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#111111] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-8 uppercase leading-tight">
              <div className="w-8 h-8 bg-[#0083C9] rounded-sm flex items-center justify-center font-bold text-white text-lg italic">F</div>
              <div className="text-white font-bold tracking-tighter text-xl">
                FAST & SAFE<br/><span className="text-[#0083C9] text-[10px] tracking-[0.2em]">CONSTRUCTION</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Building projects and making dreams a reality. Headquartered in Manama, serving the entire region with excellence since 2010.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#0083C9] transition-colors cursor-pointer"><Instagram size={18} /></div>
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#0083C9] transition-colors cursor-pointer"><Facebook size={18} /></div>
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#0083C9] transition-colors cursor-pointer"><Linkedin size={18} /></div>
              <div className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#0083C9] transition-colors cursor-pointer"><Youtube size={18} /></div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-[#0083C9] mb-8 uppercase">Key Activities</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>Civil & Structural Works</li>
              <li>Athletic Construction</li>
              <li>Landscape & Irrigation</li>
              <li>Interior Fit Out</li>
              <li>Fencing Solutions</li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-[#0083C9] mb-8 uppercase">ISO Certifications</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>ISO 9001:2015 (Quality System)</li>
              <li>ISO 14001:2015 (Environmental Safeguard)</li>
              <li>ISO 45001:2018 (Safety & Hazard)</li>
              <li>OSHAS 18001:2007 (Structural Baseline)</li>
              <li>Commercial Licenses & CR Laws</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold tracking-widest text-[#0083C9] mb-8 uppercase">Locations</h4>
            <ul className="space-y-6 text-gray-400 text-sm">
              <li className="flex gap-3">
                <MapPin size={18} className="text-[#0083C9] shrink-0" />
                <span>Sitra Office: Sitra, Kingdom of Bahrain</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-[#0083C9] shrink-0" />
                <span>+973 77912500</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-[#0083C9] shrink-0" />
                <span>fastsafecontracting@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[2px] text-gray-500 font-bold">
          <div>© {new Date().getFullYear()} FAST AND SAFE MAINTENANCE SERVICES - Manama, Kingdom of Bahrain</div>
          <div className="flex gap-4">
            <span>CR: ACTIVE</span>
            <span>ISO 9001 • 14001 • 45001 CERTIFIED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}