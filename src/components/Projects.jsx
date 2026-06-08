import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, ArrowRight, ArrowLeft, Calendar, FileText } from 'lucide-react';

export default function Projects({ viewMode = 'featured', onViewAll, onGoBack, onViewDetails }) {
  const { projects } = usePortfolio();

  // Filter projects based on viewMode
  const displayedProjects = viewMode === 'featured' 
    ? projects.filter(p => p.featured).slice(0, 3) 
    : projects;

  // Modern abstract gradient generator for cover fallbacks
  const getGradientForProject = (id) => {
    const gradients = [
      'from-rose-500 via-pink-600 to-accent',
      'from-accent via-purple-600 to-pink-500',
      'from-pink-500 via-rose-600 to-amber-500',
      'from-purple-600 via-pink-600 to-accent',
      'from-rose-600 via-accent to-indigo-600'
    ];
    // Simple hash to persist gradient per project id
    const idx = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length : 0;
    return gradients[idx];
  };

  return (
    <section id="projects" className="relative py-24 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-[20%] left-[-15%] w-[40vw] h-[40vw] max-w-[450px] rounded-full bg-accent/5 glow-blob animate-pulse-glow" style={{ animationDelay: '-1s' }} />
      <div className="absolute bottom-[20%] right-[-15%] w-[40vw] h-[40vw] max-w-[450px] rounded-full bg-pink-400/5 glow-blob animate-pulse-glow" style={{ animationDelay: '-3s' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left">
            {viewMode === 'all' && (
              <button 
                onClick={onGoBack}
                className="inline-flex items-center gap-2 text-sm font-bold text-accent mb-4 hover:translate-x-[-4px] transition-transform cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            )}
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-main relative inline-block">
              {viewMode === 'featured' ? 'Featured Work' : 'All Projects'}
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-pink-500 rounded-full" />
            </h2>
            <p className="text-text-muted mt-3 text-sm sm:text-base max-w-xl">
              {viewMode === 'featured' 
                ? "A handpicked selection of creative short films, MTV spoofs, and architectural photography showcases."
                : "The complete archive of my creative developments, design projects, and collaborative ventures."}
            </p>
          </div>

          {viewMode === 'featured' && (
            <button
              onClick={onViewAll}
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl glass-panel border border-border-glass text-text-main font-bold text-sm tracking-wide hover:border-accent/40 hover:bg-accent/5 hover:scale-[1.03] transition-all duration-300 self-start md:self-end cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 text-accent" />
            </button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <article 
              key={project.id} 
              className="group glass-panel rounded-2xl overflow-hidden border border-border-glass shadow-premium flex flex-col h-full glass-panel-hover"
            >
              {/* Image banner / Gradient block */}
              <div className="relative aspect-video overflow-hidden bg-zinc-950">
                {project.coverImage || (project.images && project.images[0]) ? (
                  <img 
                    src={project.coverImage || project.images[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  // Deep pink-infused glass gradient background
                  <div className={`w-full h-full bg-gradient-to-tr ${getGradientForProject(project.id)} opacity-85 group-hover:opacity-95 transition-opacity duration-500 flex flex-col justify-between p-5 text-white text-left select-none relative`}>
                    {/* Abstract decorative wireframe lines */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                      style={{ 
                        backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%)',
                        backgroundSize: '20px 20px'
                      }} 
                    />
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        {project.category}
                      </span>
                      <span className="text-xs font-mono font-bold">{project.year}</span>
                    </div>
                    <div className="z-10">
                      <h4 className="font-extrabold text-lg sm:text-xl tracking-tight leading-tight">{project.title}</h4>
                    </div>
                  </div>
                )}
              </div>

              {/* Description & Tags */}
              <div className="p-6 flex flex-col flex-grow text-left">
                <div className="flex items-center gap-4 text-xs font-mono text-text-muted mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    {project.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    {project.category}
                  </span>
                </div>

                <h3 className="font-extrabold text-xl text-text-main tracking-tight mb-2 group-hover:text-accent transition-colors duration-200">
                  {project.title}
                </h3>
                
                <p className="text-text-muted text-sm leading-relaxed mb-5 flex-grow line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/5 text-accent border border-accent/10">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-text-main/5 text-text-muted">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Card Action */}
                <button
                  onClick={() => onViewDetails(project)}
                  className="w-full text-center py-3 rounded-xl bg-accent/10 hover:bg-accent hover:text-white border border-accent/20 text-accent font-bold text-sm tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Centered back button inside list view */}
        {viewMode === 'all' && (
          <div className="mt-16 text-center">
            <button
              onClick={onGoBack}
              className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-accent text-white font-bold tracking-wide shadow-md hover:bg-accent/90 hover:scale-[1.03] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
