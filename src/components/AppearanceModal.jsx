import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, Sparkles, Check } from 'lucide-react';

export default function AppearanceModal({ onClose }) {
  const { theme, selectTheme } = usePortfolio();

  const handleSelect = (selectedTheme, e) => {
    selectTheme(selectedTheme, e);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-border-glass shadow-2xl z-10 animate-[zoomIn_0.25s_cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-glass mb-6">
          <div className="flex items-center gap-2 text-accent text-left">
            <Sparkles className="w-5 h-5 animate-pulse-glow" />
            <h3 className="font-extrabold text-xl text-text-main tracking-tight">Appearance Systems</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full border border-border-glass text-text-main hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-text-muted text-left mb-6 leading-relaxed">
          Select a bespoke digital environment. The color values, glows, shadows, and card layouts will adapt dynamically.
        </p>

        {/* Theme Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
          
          {/* Theme 1: Blush Bloom */}
          <button
            onClick={(e) => handleSelect('blush-bloom', e)}
            className={`group text-left p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer overflow-hidden ${theme === 'blush-bloom' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border-glass bg-white/20 hover:border-accent/40'}`}
          >
            {/* Miniature Preview representation */}
            <div className="w-full h-24 rounded-lg bg-[#FFF5F7] border border-pink-100 p-2.5 flex flex-col justify-between mb-4 shadow-inner relative">
              <div className="flex justify-between items-center">
                <span className="w-6 h-1.5 rounded-full bg-[#FF2E93]/60" />
                <span className="w-3 h-3 rounded-full bg-[#FF2E93]" />
              </div>
              <div className="p-2 rounded bg-white/80 border border-[#FF2E93]/10 flex flex-col gap-1 shadow-sm">
                <span className="w-8 h-1 rounded bg-[#2D1A22]/30" />
                <span className="w-12 h-1 rounded bg-[#705461]/20" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-text-main group-hover:text-accent transition-colors">Blush Bloom</h4>
                <p className="text-[10px] text-text-muted font-semibold mt-0.5">Luminous Light Theme</p>
              </div>
              {theme === 'blush-bloom' && (
                <div className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center p-0.5 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </button>

          {/* Theme 2: Midnight Rose */}
          <button
            onClick={(e) => handleSelect('midnight-rose', e)}
            className={`group text-left p-4 rounded-2xl border transition-all duration-300 relative cursor-pointer overflow-hidden ${theme === 'midnight-rose' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border-glass bg-zinc-950/20 hover:border-accent/40'}`}
          >
            {/* Miniature Preview representation */}
            <div className="w-full h-24 rounded-lg bg-[#0B0A0D] border border-zinc-800 p-2.5 flex flex-col justify-between mb-4 shadow-inner relative">
              <div className="flex justify-between items-center">
                <span className="w-6 h-1.5 rounded-full bg-[#FF2E93]/60" />
                <span className="w-3 h-3 rounded-full bg-[#FF2E93] animate-pulse" />
              </div>
              <div className="p-2 rounded bg-[#141016]/80 border border-[#FF2E93]/20 flex flex-col gap-1 shadow-sm">
                <span className="w-8 h-1 rounded bg-[#F8F5F7]/30" />
                <span className="w-12 h-1 rounded bg-[#B09AA5]/20" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-text-main group-hover:text-accent transition-colors">Midnight Rose</h4>
                <p className="text-[10px] text-text-muted font-semibold mt-0.5">Sophisticated Dark Theme</p>
              </div>
              {theme === 'midnight-rose' && (
                <div className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center p-0.5 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </button>

        </div>

        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-accent text-white font-bold text-xs tracking-wide shadow-md hover:bg-accent/90 transition-all cursor-pointer"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
}
