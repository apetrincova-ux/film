
import React, { useState, useRef, useEffect } from 'react';

interface ComparisonSliderProps {
  before: string;
  after: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ before, after }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const relativeX = Math.max(0, Math.min(x - rect.left, rect.width));
    setPosition((relativeX / rect.width) * 100);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden cursor-col-resize select-none border border-white/10"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Bottom) */}
      <img src={after} className="absolute inset-0 w-full h-full object-cover" alt="After" />
      
      {/* Before Image (Top, Clipped) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={before} className="w-full h-full object-cover grayscale brightness-75 contrast-75 blur-[1px]" alt="Before" />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute inset-y-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500 border-4 border-slate-900 flex items-center justify-center shadow-xl">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7l-4 4m0 0l4 4m-4-4h18" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white/50 z-20">Original</div>
      <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-cyan-400 z-20">AI Remastered</div>
    </div>
  );
};

export default ComparisonSlider;
