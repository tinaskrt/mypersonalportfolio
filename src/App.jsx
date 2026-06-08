import React, { useState, useEffect } from 'react';
import { usePortfolio } from './context/PortfolioContext';

// Import components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import ProjectDetailModal from './components/ProjectDetailModal';
import AppearanceModal from './components/AppearanceModal';
import Dashboard from './components/Dashboard';

export default function App() {
  const { theme, themeRippleTrigger, bio } = usePortfolio();
  
  // Page states
  const [viewState, setViewState] = useState('home'); // 'home' or 'all-projects'
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Apply theme class to document body
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (theme === 'midnight-rose') {
      bodyClass.add('theme-midnight-rose');
    } else {
      bodyClass.remove('theme-midnight-rose');
    }
  }, [theme]);

  // Scroll to top on view state change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [viewState]);

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col justify-between">
      
      {/* Sticky Header Nav */}
      <Navbar 
        onOpenAppearance={() => setIsAppearanceOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Spreading Ripple Transition Overlay */}
      {themeRippleTrigger && (
        <div 
          className="theme-ripple active"
          style={{
            left: `${themeRippleTrigger.x}px`,
            top: `${themeRippleTrigger.y}px`,
            width: '260vmax',
            height: '260vmax',
            backgroundColor: themeRippleTrigger.targetTheme === 'midnight-rose' ? '#0B0A0D' : '#FFF5F7',
            transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease 0.6s'
          }}
        />
      )}

      {/* Main Content Layout */}
      <main className="flex-grow">
        {viewState === 'home' ? (
          <>
            <Hero />
            <About />
            <Projects 
              viewMode="featured"
              onViewAll={() => setViewState('all-projects')}
              onViewDetails={(project) => setSelectedProject(project)}
            />
            <Skills />
            <Contact />
          </>
        ) : (
          <div className="pt-20">
            <Projects 
              viewMode="all"
              onGoBack={() => setViewState('home')}
              onViewDetails={(project) => setSelectedProject(project)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-text-main/5 border-t border-border-glass text-center relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <p>© {new Date().getFullYear()} {bio.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-accent font-bold transition-colors cursor-pointer"
            >
              CMS Admin Settings
            </button>
            <a href={`mailto:${bio.contact.email}`} className="hover:text-accent transition-colors">
              Get in Touch
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {isAppearanceOpen && (
        <AppearanceModal onClose={() => setIsAppearanceOpen(false)} />
      )}

      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {isAdminOpen && (
        <Dashboard onClose={() => setIsAdminOpen(false)} />
      )}

    </div>
  );
}
