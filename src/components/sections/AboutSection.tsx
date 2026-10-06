import React, { FC } from 'react';
import { COMPANY_INFO, ISO_CERTIFICATIONS } from '../../constants';

/**
 * About Section Component
 * Displays company stats, ISO certifications, and key differentiators
 */
export const AboutSection: FC = () => {
  return (
    <section id="about" className="py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <p className="text-sm font-bold tracking-[0.3em] text-[#0083C9] mb-4">
              WHO WE ARE
            </p>
            <h2 className="text-4xl font-bold mb-6">Fast & Safe Maintenance Services in Bahrain</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Headquartered in {COMPANY_INFO.location}, {COMPANY_INFO.fullName} offers a elite
              complement of construction and engineering services—specializing in premium sports turf
              installations, high-security fencing, and state-of-the-art structural swimming pool construction.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold text-[#0083C9] mb-2">
                  {COMPANY_INFO.yearsExperience}
                </div>
                <div className="text-xs tracking-widest text-gray-400 uppercase font-bold">
                  Years Experience
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#0083C9] mb-2">
                  {COMPANY_INFO.repeatCustomerRate}
                </div>
                <div className="text-xs tracking-widest text-gray-400 uppercase font-bold">
                  Repeat Customers
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - ISO Certifications */}
          <div className="lg:w-1/2 space-y-6">
            {/* IMS Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 border border-[#0083C9]/10 p-8 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0083C9] text-white rounded-lg flex items-center justify-center font-black text-xs">
                  IMS
                </div>
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#0083C9]">
                    Integrated Management System
                  </span>
                  <h3 className="text-lg font-bold">ISO Certified Excellence</h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Our operations are globally certified and rigorously audited. We maintain full certification
                across three distinct ISO platforms, ensuring every project is delivered safely, sustainably,
                and to elite engineering specs.
              </p>

              {/* ISO Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ISO_CERTIFICATIONS.map((cert) => (
                  <div
                    key={cert.code}
                    className="border border-[#0083C9]/15 bg-white p-4 rounded-xl shadow-xs hover:border-[#0083C9]/40 transition-colors"
                  >
                    <div
                      className="font-black text-sm tracking-wide mb-1"
                      style={{ color: cert.color }}
                    >
                      {cert.code}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-2">
                      {cert.title}
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      {cert.code === 'ISO 9001:2015'
                        ? 'Ensuring strict material tolerances, dimensional control, and premium finishing.'
                        : cert.code === 'ISO 14001:2015'
                        ? 'Sustainable supply chain evaluation, water reuse, and ecological site compliance.'
                        : 'Robust hazard assessments, structural scaffolding safety systems, and zero-injury targets.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-2xl flex flex-col justify-between border border-gray-100">
                <div>
                  <span className="text-[9px] font-extrabold tracking-widest text-[#0083C9] uppercase">
                    Regulatory Baseline
                  </span>
                  <h3 className="font-bold text-gray-800 text-sm mt-1">HSE Site Safety</h3>
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Continuous structural checks & certified safety-rigging supervision.
                </p>
              </div>
              <div className="bg-[#0083C9] p-6 rounded-2xl text-white flex flex-col justify-between shadow-md">
                <div>
                  <span className="text-[9px] font-extrabold tracking-widest text-white/60 uppercase">
                    Operational Record
                  </span>
                  <h3 className="font-bold text-sm mt-1">ZERO ACCIDENTS</h3>
                </div>
                <p className="text-xs text-white/80 mt-2 leading-relaxed">
                  Our proud track record across elite youth centres, sports hubs, and industrial sites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
