import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, Settings, Sparkles, ArrowUp } from 'lucide-react';

export default function Navbar({ onOpenAppearance, onOpenAdmin }) {
  const { activeSection, setActiveSection } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);

      // Section intersection observer fallback
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && scrollPosition >= section.offsetTop) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
      setActiveSection(id);
    }
  };

  const handleAppearanceClick = (e) => {
    onOpenAppearance(e);
    setIsOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'py-3 bg-bg-glass/85 glass-panel border-b border-border-glass shadow-premium' : 'py-5 bg-transparent border-b border-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div onClick={() => scrollTo('home')} className="cursor-pointer group flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-accent to-pink-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              M.C.F
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative py-1 text-sm font-medium tracking-wide transition-colors duration-300 cursor-pointer ${activeSection === item.id ? 'text-accent' : 'text-text-main/80 hover:text-accent'}`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded bg-gradient-to-r from-accent to-pink-500 animate-[pulse_2s_infinite]" />
                )}
              </button>
            ))}

            {/* Appearance Panel Trigger */}
            <button
              onClick={handleAppearanceClick}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Appearance
            </button>

            {/* Admin Settings Trigger */}
            <button
              onClick={() => { onOpenAdmin(); setIsOpen(false); }}
              className="p-2 rounded-full text-text-main/70 hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
              title="Portfolio CMS Dashboard"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </nav>

          {/* Mobile Hamburguer */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Direct Admin Access on Mobile */}
            <button
              onClick={() => onOpenAdmin()}
              className="p-2 rounded-full text-text-main/75"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-text-main hover:bg-accent/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 mx-4 p-5 rounded-2xl glass-panel border border-border-glass shadow-xl md:hidden animate-[fadeIn_0.3s_ease]">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`text-left py-2 px-3 rounded-lg text-base font-semibold transition-all duration-200 ${activeSection === item.id ? 'bg-accent/10 text-accent border-l-4 border-accent' : 'text-text-main/80 hover:bg-accent/5'}`}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={handleAppearanceClick}
                className="flex items-center justify-center gap-2 mt-2 w-full py-2.5 rounded-xl bg-accent text-white font-semibold shadow-md hover:bg-accent/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Customize Appearance
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-30 p-3 rounded-full bg-accent text-white shadow-lg border border-accent/20 hover:scale-110 transition-all duration-300 cursor-pointer ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
}
