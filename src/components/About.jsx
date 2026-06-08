import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { BookOpen, Target, Palette, Cpu, CheckCircle } from 'lucide-react';

export default function About() {
  const { bio } = usePortfolio();

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Subtle Glow blobs */}
      <div className="absolute top-[30%] right-[-10%] w-[30vw] h-[30vw] max-w-[350px] rounded-full bg-accent/5 glow-blob animate-pulse-glow" />
      <div className="absolute bottom-0 left-[-10%] w-[35vw] h-[35vw] max-w-[380px] rounded-full bg-pink-400/5 glow-blob animate-pulse-glow" style={{ animationDelay: '-4s' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-main mb-3 relative inline-block">
            About Me
            <span className="absolute bottom-0 left-[20%] right-[20%] h-[3px] bg-gradient-to-r from-accent to-pink-500 rounded-full" />
          </h2>
          <p className="text-text-muted mt-2 text-sm sm:text-base max-w-lg mx-auto">
            My journey through tech, creative media design, and continuous learning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Narrative Sections */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            
            {/* Story Card */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-border-glass shadow-premium">
              <div className="flex items-center gap-3 mb-4 text-accent">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-lg text-text-main">Learning Journey</h3>
              </div>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-4">
                {bio.learning}
              </p>
            </div>

            {/* Goals Card */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-border-glass shadow-premium">
              <div className="flex items-center gap-3 mb-4 text-accent">
                <Target className="w-5 h-5" />
                <h3 className="font-bold text-lg text-text-main">Future Aspirations</h3>
              </div>
              <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                {bio.goals}
              </p>
            </div>

          </div>

          {/* Right Column: Tech Stack & Skills Badges */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            
            <h3 className="text-xl font-extrabold text-text-main tracking-tight flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5 text-accent" />
              <span>Skill Ecosystem</span>
            </h3>

            {/* Front-End Skills Card */}
            <div className="glass-panel rounded-2xl p-6 border border-border-glass shadow-md">
              <h4 className="font-bold text-sm text-accent tracking-wider uppercase mb-4">Front-End Development</h4>
              <div className="flex flex-wrap gap-2.5">
                {bio.techStack.frontend.map((skill) => (
                  <div
                    key={skill}
                    className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/40 text-text-main text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.05] hover:bg-accent/10 hover:shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Design Skills Card */}
            <div className="glass-panel rounded-2xl p-6 border border-border-glass shadow-md">
              <h4 className="font-bold text-sm text-accent tracking-wider uppercase mb-4">Design & Wireframing</h4>
              <div className="flex flex-wrap gap-2.5">
                {bio.techStack.design.map((skill) => (
                  <div
                    key={skill}
                    className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500/5 border border-pink-500/10 hover:border-pink-500/40 text-text-main text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.05] hover:bg-pink-500/10 hover:shadow-sm"
                  >
                    <Palette className="w-3.5 h-3.5 text-pink-500" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Skills Card */}
            <div className="glass-panel rounded-2xl p-6 border border-border-glass shadow-md">
              <h4 className="font-bold text-sm text-accent tracking-wider uppercase mb-4">Additional Languages</h4>
              <div className="flex flex-wrap gap-2.5">
                {bio.techStack.additional.map((skill) => (
                  <div
                    key={skill}
                    className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-text-main/5 border border-border-glass hover:border-accent/30 text-text-main text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.05] hover:bg-accent/5"
                  >
                    <CheckCircle className="w-3 h-3 text-text-muted/70 group-hover:text-accent" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
