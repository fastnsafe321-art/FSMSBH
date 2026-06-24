import React, { FC } from 'react';
import { Menu, X, Globe, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NAV_LINKS, COLORS, COMPANY_INFO } from '../../constants';
import { useScroll } from '../../hooks';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onConsultation: () => void;
}

/**
 * Main Navigation Bar Component
 * Sticky header with responsive menu and consultation CTA
 */
export const Navbar: FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen, onConsultation }) => {
  const isScrolled = useScroll(50);

  return (
    <>
      {/* Desktop/Tablet Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/90 backdrop-blur-md py-3 shadow-lg'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer select-none"
            whileHover="hover"
            initial="initial"
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 }
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <motion.div
              className="w-10 h-10 bg-[#0083C9] rounded-sm flex items-center justify-center font-bold text-white text-xl italic leading-none"
              variants={{
                initial: { rotate: 0, scale: 1 },
                hover: {
                  rotate: 15,
                  scale: [1.0, 1.1, 1.02, 1.1, 1.0]
                }
              }}
              transition={{
                rotate: { type: "spring", stiffness: 400, damping: 12 },
                scale: { repeat: Infinity, duration: 1.0, ease: "easeInOut" }
              }}
            >
              F
            </motion.div>
            <div className="text-white font-bold tracking-tighter text-2xl flex flex-col leading-none">
              <span className="text-[#0083C9]">{COMPANY_INFO.name}</span>
              <span className="text-[10px] tracking-[0.2em] font-medium opacity-80">
                {COMPANY_INFO.subtitle}
              </span>
            </div>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white font-medium text-sm hover:text-[#0083C9] transition-colors tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <div className="h-4 w-px bg-white/20"></div>
            <button
              onClick={onConsultation}
              className="bg-[#0083C9] hover:bg-[#36B649] text-white font-semibold text-xs tracking-wider px-5 py-2.5 transition-all duration-300 shadow-sm"
            >
              REQUEST CONSULTATION
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-black flex flex-col pt-24 px-8 justify-between pb-12"
          >
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white text-3xl font-bold py-4 border-b border-white/10 hover:text-[#0083C9]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div>
              <button
                onClick={() => {
                  onConsultation();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-[#0083C9] hover:bg-[#36B649] text-white font-bold py-4 rounded-xl tracking-widest text-sm transition-colors text-center shadow-lg uppercase"
              >
                REQUEST CONSULTATION
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
