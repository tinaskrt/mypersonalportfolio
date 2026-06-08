import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sparkles, Terminal, Code, Layout, ArrowRight } from 'lucide-react';

export default function Hero() {
  const { bio, setActiveSection } = usePortfolio();

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <section id="home" className="relative min-h-[95vh] flex items-center justify-center pt-24 overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] max-w-[400px] rounded-full bg-accent/10 glow-blob animate-pulse-glow" />
      <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[450px] rounded-full bg-pink-400/10 glow-blob animate-pulse-glow" style={{ animationDelay: '-3s' }} />

      {/* Wireframe Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] theme-midnight-rose:opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--accent-color) 1px, transparent 0), radial-gradient(var(--accent-color) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }} 
      />

      <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Heading & Text */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-border-glass text-xs font-semibold tracking-wider text-accent mb-6 animate-[fadeIn_0.5s_ease] shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AVAILABLE FOR CREATIVE ROLES</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-text-main mb-4">
            Hi, I'm <br />
            <span className="bg-gradient-to-r from-accent via-pink-500 to-rose-400 bg-clip-text text-transparent drop-shadow-sm font-black tracking-tight">
              {bio.name}
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-accent/90 mb-6 flex items-center gap-2">
            <span>{bio.subtitle}</span>
          </h2>

          {/* Intro Description */}
          <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-8 max-w-xl">
            {bio.intro}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => handleScrollTo('projects')}
              className="group flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-white font-bold tracking-wide shadow-[0_15px_30px_-5px_rgba(255,46,147,0.35)] hover:bg-accent/90 hover:shadow-[0_15px_30px_-2px_rgba(255,46,147,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => handleScrollTo('contact')}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl glass-panel border border-border-glass text-text-main hover:bg-accent/5 hover:border-accent/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold tracking-wide cursor-pointer"
            >
              <span>Contact Me</span>
            </button>
          </div>
        </div>

        {/* Right Column: Abstract Premium UI Graphics */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end min-h-[380px] lg:min-h-[480px]">
          
          {/* Visual Container */}
          <div className="relative w-full max-w-[380px] h-[380px] lg:max-w-[420px] lg:h-[420px]">
            
            {/* Background glowing circle rotating slowly */}
            <div className="absolute inset-4 rounded-full border border-dashed border-accent/25 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-12 rounded-full border border-dotted border-pink-400/30 animate-[spin_30s_linear_infinite_reverse] pointer-events-none" />
            
            {/* Center abstract geometric shapes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-tr from-accent/20 to-pink-500/10 blur-xl animate-pulse-glow" />
            </div>

            {/* Floating Glass Card 1: Code Snippet (HTML/React-like) */}
            <div className="absolute top-[5%] left-[2%] w-[85%] glass-panel rounded-xl p-5 border border-border-glass shadow-premium animate-float-slow select-none">
              <div className="flex items-center gap-1.5 border-b border-border-glass/40 pb-2.5 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <span className="text-[10px] font-mono text-text-muted/60 ml-2">Developer.js</span>
              </div>
              <pre className="font-mono text-[11px] sm:text-xs text-left text-text-main/90 overflow-x-hidden leading-relaxed">
                <div>
                  <span className="text-pink-500">const</span> developer = &#123;
                </div>
                <div className="pl-4">
                  name: <span className="text-accent">"Maria Cristina"</span>,
                </div>
                <div className="pl-4">
                  role: <span className="text-accent">"UI/UX Dev"</span>,
                </div>
                <div className="pl-4">
                  passion: <span className="text-pink-500">true</span>,
                </div>
                <div className="pl-4">
                  skills: [<span className="text-accent">"HTML"</span>, <span className="text-accent">"Tailwind"</span>, <span className="text-accent">"Figma"</span>]
                </div>
                <div>&#125;;</div>
              </pre>
            </div>

            {/* Floating Glass Card 2: Interactive UX Widget */}
            <div className="absolute bottom-[8%] right-[0%] w-[68%] glass-panel rounded-xl p-4 border border-border-glass shadow-premium animate-float-medium select-none" style={{ animationDelay: '-2s' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                  <Layout className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-wider">UI/UX Design</p>
                  <p className="text-xs font-bold text-text-main">Figma Wireframing</p>
                </div>
              </div>
              
              {/* Dummy slider element for premium look */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-mono text-text-muted">Scale</span>
                <div className="h-1.5 flex-1 rounded-full bg-accent/10 overflow-hidden relative border border-border-glass/40">
                  <div className="absolute left-0 top-0 bottom-0 w-[80%] bg-gradient-to-r from-accent to-pink-500 rounded-full" />
                </div>
                <span className="text-[9px] font-mono font-bold text-accent">80%</span>
              </div>
            </div>

            {/* Floating Pill: Technology Badges */}
            <div className="absolute top-[52%] right-[5%] glass-panel px-3.5 py-2 rounded-full border border-border-glass shadow-lg flex items-center gap-2 animate-float-fast select-none" style={{ animationDelay: '-4s' }}>
              <Code className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-text-main">Front-End Developer</span>
            </div>

            {/* Floating Pill 2: Figma Icon representation */}
            <div className="absolute top-[48%] left-[-2%] glass-panel px-3.5 py-2 rounded-full border border-border-glass shadow-lg flex items-center gap-2 animate-float-slow select-none" style={{ animationDelay: '-1.5s' }}>
              <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F24E1E]" />
                Figma Prototyping
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
