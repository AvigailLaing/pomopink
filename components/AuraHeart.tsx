
import React from 'react';

const AuraHeart: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#FFD1DC]">
      {/* Soft gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #FFF0F5, #FFD1DC, #FFF0F5)'
        }}
      />
      
      {/* Central Soft Baby Pink Aura */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] max-w-[1200px] max-h-[1200px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,182,193,0.8) 0%, rgba(255,209,220,0.4) 40%, rgba(255,240,245,0) 70%)',
          filter: 'blur(100px)',
          opacity: 0.8
        }}
      />

      {/* Dreamy floating highlights */}
      <div 
        className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-white opacity-30 rounded-full blur-[120px] animate-pulse"
        style={{ animationDuration: '6s' }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-white opacity-20 rounded-full blur-[100px] animate-pulse"
        style={{ animationDuration: '8s' }}
      />

      {/* Subtle vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/20 pointer-events-none" />
    </div>
  );
};

export default AuraHeart;
