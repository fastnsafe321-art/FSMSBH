import { Menu, X, Search, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { NAV_LINKS } from '../data/constants';
import React from 'react';

interface NavbarProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  triggerConsultation: () => void;
}

export default function Navbar({ isScrolled, isMenuOpen, setIsMenuOpen, triggerConsultation }: NavbarProps) {

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (href === '#' || href === '#home') {
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } 
    else if (href === '#services') {
      // Scroll to Premium Pitches Tech section
      const target = document.getElementById('premium-pitches-tech');
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } 
    else if (href.startsWith('#')) {
      // Handle other sections (expertise, projects, safety, contact)
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }

    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo - Also scrolls to top */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer" 
          whileHover={{ scale: 1.05 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <motion.div className="w-10 h-10 bg-[#0083C9] rounded-sm flex items-center justify-center font-bold text-white text-xl italic" whileHover={{ rotate: 15 }}>F</motion.div>
          <div className="text-white font-bold tracking-tighter text-2xl flex flex-col leading-none">
            <span className="text-[#0083C9]">FAST & SAFE</span>
            <span className="text-[10px] tracking-[0.2em] font-medium opacity-80">CONSTRUCTION & ENGINEERING</span>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white font-medium text-sm hover:text-[#0083C9] transition-colors tracking-wide cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <button className="text-white hover:text-[#0083C9]"><Search size={20} /></button>
          <button className="text-white hover:text-[#0083C9] flex items-center gap-1">
            <Globe size={18} /> <span className="text-xs">EN</span>
          </button>
          <button 
            onClick={triggerConsultation} 
            className="bg-[#0083C9] hover:bg-[#36B649] text-white font-semibold text-xs tracking-wider px-5 py-2.5 transition-all"
          >
            REQUEST CONSULTATION
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, x: '100%' }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: '100%' }} 
          className="fixed inset-0 z-40 bg-black flex flex-col pt-24 px-8 justify-between pb-12 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white text-3xl font-bold py-4 border-b border-white/10"
            >
              {link.name}
            </a>
          ))}
          <button onClick={triggerConsultation} className="w-full bg-[#0083C9] hover:bg-[#36B649] text-white font-bold py-4 rounded-xl tracking-widest uppercase">
            REQUEST CONSULTATION
          </button>
        </motion.div>
      )}
    </nav>
  );
}