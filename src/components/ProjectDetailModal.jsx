import React from 'react';
import { X, Calendar, User, AlertOctagon, Award, Compass, Layers, CheckCircle } from 'lucide-react';

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;

  // Custom gradient generator for visual backdrop matching Project Cards
  const getGradientForProject = (id) => {
    const gradients = [
      'from-rose-500 via-pink-600 to-accent',
      'from-accent via-purple-600 to-pink-500',
      'from-pink-500 via-rose-600 to-amber-500',
      'from-purple-600 via-pink-600 to-accent',
      'from-rose-600 via-accent to-indigo-600'
    ];
    const idx = id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length : 0;
    return gradients[idx];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl overflow-hidden border border-border-glass shadow-2xl z-10 my-8 max-h-[90vh] flex flex-col animate-[zoomIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-glass bg-bg-glass/80 backdrop-blur-md">
          <div className="text-left">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
              {project.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-text-main tracking-tight mt-2">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full border border-border-glass text-text-main hover:text-accent hover:bg-accent/10 transition-colors shadow-sm cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-grow">
          
          {/* Banner cover */}
          <div className="relative rounded-2xl aspect-video max-h-[350px] w-full overflow-hidden bg-zinc-950 mb-8 border border-border-glass/40 shadow-inner">
            {project.coverImage || (project.images && project.images[0]) ? (
              <img 
                src={project.coverImage || project.images[0]} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-tr ${getGradientForProject(project.id)} opacity-90 flex items-center justify-center p-8 select-none relative`}>
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ 
                    backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%)',
                    backgroundSize: '24px 24px'
                  }} 
                />
                <div className="text-center z-10 text-white">
                  <span className="text-sm font-mono tracking-widest uppercase opacity-75">{project.category}</span>
                  <h3 className="text-3xl font-extrabold tracking-tight mt-1">{project.title}</h3>
                </div>
              </div>
            )}
          </div>

          {/* Quick Specifications Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl border border-border-glass bg-accent/5 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Year</p>
                <p className="text-sm font-bold text-text-main">{project.year}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-border-glass bg-accent/5 flex items-center gap-3 col-span-1">
              <User className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">My Role</p>
                <p className="text-sm font-bold text-text-main truncate max-w-[120px]" title={project.myRole}>{project.myRole || 'Developer'}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-border-glass bg-accent/5 flex items-center gap-3 col-span-2">
              <Layers className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Technologies Used</p>
                <p className="text-xs font-bold text-text-main mt-0.5 leading-tight">
                  {project.tags && project.tags.length > 0 ? project.tags.join(', ') : 'Creative Media Tools'}
                </p>
              </div>
            </div>
          </div>

          {/* Core Storytelling Content Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
            
            {/* Left Detailed Column (Overview + Implementation) */}
            <div className="md:col-span-8 flex flex-col gap-8">
              
              {/* Overview */}
              <div>
                <h3 className="text-lg font-extrabold text-text-main tracking-tight flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Project Overview</span>
                </h3>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Process & Design Timeline */}
              {project.process && (
                <div>
                  <h3 className="text-lg font-extrabold text-text-main tracking-tight flex items-center gap-2 mb-3">
                    <Compass className="w-5 h-5 text-accent" />
                    <span>Process & Execution</span>
                  </h3>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {project.process}
                  </p>
                </div>
              )}

            </div>

            {/* Right Detailed Column (Objectives, Challenges, Outcomes) */}
            <div className="md:col-span-4 flex flex-col gap-6">
              
              {/* Objectives */}
              {project.objectives && (
                <div className="p-5 rounded-2xl border border-border-glass bg-text-main/5">
                  <h4 className="font-extrabold text-xs text-accent uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Objectives
                  </h4>
                  <p className="text-text-muted text-xs leading-relaxed">
                    {project.objectives}
                  </p>
                </div>
              )}

              {/* Challenges */}
              {project.challenges && (
                <div className="p-5 rounded-2xl border border-border-glass bg-text-main/5">
                  <h4 className="font-extrabold text-xs text-pink-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4" />
                    Challenges
                  </h4>
                  <p className="text-text-muted text-xs leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              )}

              {/* Outcomes */}
              {project.outcomes && (
                <div className="p-5 rounded-2xl border border-border-glass bg-text-main/5">
                  <h4 className="font-extrabold text-xs text-green-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Outcomes
                  </h4>
                  <p className="text-text-muted text-xs leading-relaxed">
                    {project.outcomes}
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Project Additional Image Gallery Layout */}
          {project.images && project.images.length > 1 && (
            <div className="mt-12 text-left">
              <h3 className="text-lg font-extrabold text-text-main tracking-tight mb-4">Project Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project.images.slice(1).map((img, index) => (
                  <div key={index} className="aspect-video rounded-xl overflow-hidden border border-border-glass shadow-sm bg-zinc-950">
                    <img src={img} alt={`${project.title} gallery ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border-glass bg-text-main/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-accent text-white font-bold text-sm tracking-wide shadow-md hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Close Project Details
          </button>
        </div>

      </div>
    </div>
  );
}
