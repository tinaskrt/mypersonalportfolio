import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Code, Laptop2, Palette, Grid3X3, Layers, Smartphone, Map, PenLine } from 'lucide-react';

export default function Skills() {
  const { bio } = usePortfolio();

  // Mapping string identifiers/names to premium icons
  const getIconForService = (title) => {
    const t = title.toLowerCase();
    if (t.includes('front-end') || t.includes('development')) return <Code className="w-6 h-6" />;
    if (t.includes('responsive') || t.includes('website design')) return <Laptop2 className="w-6 h-6" />;
    if (t.includes('ui/ux')) return <Palette className="w-6 h-6" />;
    if (t.includes('wireframing')) return <Grid3X3 className="w-6 h-6" />;
    if (t.includes('figma')) return <PenLine className="w-6 h-6" />;
    if (t.includes('flutter')) return <Smartphone className="w-6 h-6" />;
    if (t.includes('planning')) return <Map className="w-6 h-6" />;
    return <Layers className="w-6 h-6" />;
  };

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[40%] right-[-10%] w-[30vw] h-[30vw] max-w-[350px] rounded-full bg-accent/5 glow-blob animate-pulse-glow" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-[20%] left-[-10%] w-[30vw] h-[30vw] max-w-[350px] rounded-full bg-pink-400/5 glow-blob animate-pulse-glow" style={{ animationDelay: '-4s' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-main mb-3 relative inline-block">
            Services & Expertise
            <span className="absolute bottom-0 left-[20%] right-[20%] h-[3px] bg-gradient-to-r from-accent to-pink-500 rounded-full" />
          </h2>
          <p className="text-text-muted mt-2 text-sm sm:text-base max-w-lg mx-auto">
            Professional capabilities in front-end development, visual interface architecture, and user experience planning.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bio.services.map((service) => (
            <div 
              key={service.id} 
              className="group glass-panel rounded-2xl p-8 border border-border-glass shadow-premium flex flex-col justify-between items-start text-left glass-panel-hover"
            >
              {/* Icon Container */}
              <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/15 text-accent mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                {getIconForService(service.title)}
              </div>

              {/* Title & Description */}
              <div className="w-full">
                <h3 className="font-extrabold text-lg sm:text-xl text-text-main tracking-tight mb-3 group-hover:text-accent transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Subtle visual indicator inside the card */}
              <div className="w-8 h-1 bg-accent/20 rounded-full mt-6 group-hover:w-16 group-hover:bg-accent transition-all duration-300" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
