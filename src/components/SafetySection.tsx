export default function SafetySection() {
  return (
    <section id="safety" className="bg-[#0083C9] text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-sm font-bold tracking-[0.3em] opacity-80 mb-4 uppercase">Commitment to Standards</h2>
            <h3 className="text-4xl font-bold mb-8">Integrated ISO Quality & Safety Loop</h3>
            <p className="text-white/80 leading-relaxed mb-8">
              We understand that safety, quality, and environmental compliance are deeply interconnected. In addition to our strict baseline OSHAS 18001:2007 structural compliance, our fully audited ISO 9001:2015 and ISO 45001:2018 corporate guidelines mandate absolute rigour across our entire operational chain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Certified Scaffolding Dept.',
                'Advanced Laser Metrology Tools',
                'Daily Site Safety briefings (TBM)',
                '3rd Party Audit Inspections'
              ].map(point => (
                <div key={point} className="flex items-center gap-3 bg-white/15 p-4 rounded-xl">
                  <span className="text-lg">→</span>
                  <span className="text-sm font-bold">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative w-full">
            <div className="bg-white/10 p-12 rounded-3xl backdrop-blur-md border border-white/20">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70 font-bold mb-2 block">Enterprise Quality Audit</span>
              <div className="flex items-center gap-3 mb-6">
                <h4 className="text-2xl font-black italic text-[#0083C9] bg-white w-fit px-4 py-1 rounded">ISO 9001:2015</h4>
                <span className="text-xs font-bold text-white/95">Certified Policy</span>
              </div>
              <p className="text-lg italic leading-relaxed mb-8">
                "Our drive for improvement stems from our uncompromising commitment to global quality standards..."
              </p>
              <div className="flex gap-4 items-center">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold border border-[#0083C9]">Q</span>
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold border border-[#0083C9]">E</span>
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold border border-[#0083C9]">S</span>
                </div>
                <span className="text-xs uppercase tracking-widest font-bold text-white/90">Integrated Quality, Environmental & Safety Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}