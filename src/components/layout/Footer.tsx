import React, { FC } from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { COMPANY_INFO, ISO_CERTIFICATIONS } from '../../constants';

/**
 * Footer Component
 * Contains company info, certifications, contact details, and social links
 */
export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-[#111111] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-8 uppercase leading-tight">
              <div className="w-8 h-8 bg-[#0083C9] rounded-sm flex items-center justify-center font-bold text-white text-lg italic">
                F
              </div>
              <div className="text-white font-bold tracking-tighter text-xl">
                {COMPANY_INFO.name}
                <br />
                <span className="text-[#0083C9] text-[10px] tracking-[0.2em]">
                  {COMPANY_INFO.subtitle}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building projects and making dreams a reality. Headquartered in {COMPANY_INFO.location}, serving the entire region with excellence since {COMPANY_INFO.founded}.
            </p>
          </div>

          {/* Activities */}
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#0083C9] mb-8 uppercase">
              Key Activities
            </h2>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>Natural Grass Sports Field Construction</li>
              <li>Artificial Grass Sports Field Construction</li>
              <li>Hybrid Turf System Installation</li>
              <li>SubAir System Installation & Integration</li>
              <li>Geothermal Sports Turf Systems</li>
              <li>Landscape & Irrigation</li>
              <li>Fencing Solutions</li>
              <li>Civil & Structural Works</li>
              <li>Interior Fit Out Works</li>
              <li>Swimming Pool Construction</li>
              <li>Horse Walker Installation</li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#0083C9] mb-8 uppercase">
              ISO Certifications
            </h2>
            <ul className="space-y-4 text-gray-400 text-sm">
              {ISO_CERTIFICATIONS.map((cert) => (
                <li key={cert.code}>
                  <span className="font-semibold">{cert.code}</span> ({cert.title})
                </li>
              ))}
              <li>Commercial Licenses & CR Laws</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#0083C9] mb-8 uppercase">
              Locations & Contact
            </h2>
            <ul className="space-y-5 text-gray-400 text-sm">

              {/* Address */}
              <li className="flex gap-3">
                <MapPin size={18} className="text-[#0083C9] shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.location}</span>
              </li>

              {/* Telecom / Phone numbers */}
              <li className="flex gap-3">
                <Phone size={18} className="text-[#0083C9] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <a
                    href="tel:+97377912500"
                    className="block hover:text-[#0083C9] transition-colors"
                  >
                    +973 7791 2500
                  </a>
                  <a
                    href="tel:+97339354111"
                    className="block hover:text-[#0083C9] transition-colors"
                  >
                    +973 3935 4111
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex gap-3">
                <Mail size={18} className="text-[#0083C9] shrink-0 mt-0.5" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="hover:text-[#0083C9] transition-colors break-all"
                >
                  {COMPANY_INFO.email}
                </a>
              </li>

              {/* Website */}
              <li className="flex gap-3">
                <Globe size={18} className="text-[#0083C9] shrink-0 mt-0.5" />
                <a
                  href="https://www.fsmsbh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0083C9] transition-colors"
                >
                  www.fsmsbh.com
                </a>
              </li>

            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[2px] text-gray-500 font-bold">
          <div>
            © {currentYear} {COMPANY_INFO.fullName.toUpperCase()} — {COMPANY_INFO.location}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <span>CR: 33626-6 — ACTIVE</span>
            <span>ISO 9001 • 14001 • 45001 CERTIFIED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;