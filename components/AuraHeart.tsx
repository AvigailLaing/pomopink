
import React from 'react';

const AuraHeart: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FFD1DC]">
      {/* Soft gradient base - optimized without heavy blur filter */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(255,182,193,0.5) 0%, rgba(255,209,220,0.2) 50%, transparent 100%),
            linear-gradient(to bottom, #FFF0F5, #FFD1DC, #FFF0F5)
          `
        }}
      />
      
      {/* Central Heart-like Glow - using multiple gradients instead of CSS blur for performance */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] max-w-[1200px] max-h-[1200px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,182,193,0.6) 0%, rgba(255,209,220,0.3) 30%, transparent 70%)',
          opacity: 0.8
        }}
      />

      {/* Dreamy floating highlights - optimized blur values */}
      <div 
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-white opacity-20 rounded-full blur-[60px] animate-pulse"
        style={{ animationDuration: '6s' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] bg-white opacity-15 rounded-full blur-[50px] animate-pulse"
        style={{ animationDuration: '8s' }}
      />

      {/* Subtle vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
};

export default AuraHeart;
