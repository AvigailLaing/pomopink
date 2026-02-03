
import React, { useState, useEffect } from 'react';
import AuraHeart from './components/AuraHeart';
import PomodoroTimer from './components/PomodoroTimer';
import Checklist from './components/Checklist';
import Notes from './components/Notes';
import { getMotivationalCheer, getCooldownRemaining } from './services/geminiService';
import { TimerMode } from './types';
import { Heart, Sparkles, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [cheer, setCheer] = useState("Let's make today wonderful! ✨");
  const [isCheerLoading, setIsCheerLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const refreshCheer = async () => {
    if (getCooldownRemaining() > 0) return;

    setIsCheerLoading(true);
    const savedTasks = JSON.parse(localStorage.getItem('pomodoro-tasks') || '[]');
    const pendingCount = savedTasks.filter((t: any) => !t.completed).length;
    const newCheer = await getMotivationalCheer(pendingCount);
    setCheer(newCheer);
    setIsCheerLoading(false);
    setCooldown(getCooldownRemaining());
  };

  useEffect(() => {
    // Initial load
    const savedTasks = JSON.parse(localStorage.getItem('pomodoro-tasks') || '[]');
    const pendingCount = savedTasks.filter((t: any) => !t.completed).length;
    // Don't call API on mount if cooldown is active to save tokens
    if (getCooldownRemaining() === 0) {
      refreshCheer();
    }
    
    // Cooldown ticker
    const timer = setInterval(() => {
      setCooldown(getCooldownRemaining());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full relative p-4 md:p-8 flex flex-col items-center">
      <AuraHeart />
      
      {/* Header */}
      <header className="mb-12 text-center flex flex-col items-center relative">
        <div className="absolute inset-0 bg-white/40 blur-[40px] -z-10 scale-125 rounded-full" />
        
        <div className="flex items-center gap-3 mb-4">
          <Heart className="text-pink-400 fill-pink-400/30 animate-bounce" size={24} />
          <h1 className="text-5xl md:text-6xl font-extrabold text-pink-500 tracking-tighter drop-shadow-sm italic">
            pomopink
          </h1>
          <Heart className="text-pink-400 fill-pink-400/30 animate-bounce" size={24} />
        </div>
        
        <button 
          onClick={refreshCheer}
          disabled={isCheerLoading || cooldown > 0}
          className={`relative group transition-all ${cooldown > 0 ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        >
          <div className="px-8 py-3 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full text-pink-600 text-sm font-bold shadow-lg shadow-pink-200/50 flex items-center gap-2">
            {isCheerLoading ? (
              "Brewing magic..."
            ) : cooldown > 0 ? (
              <span className="flex items-center gap-2 italic text-pink-300">
                <Clock size={14} /> Recharging ({Math.ceil(cooldown/1000)}s)
              </span>
            ) : (
              cheer
            )}
          </div>
          <div className={`absolute -top-3 -right-3 bg-white p-1.5 rounded-full shadow-md ${cooldown > 0 ? 'text-pink-200' : 'text-pink-400'}`}>
            <Sparkles size={14} fill="currentColor" />
          </div>
        </button>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-3 min-h-[500px] order-2 lg:order-1">
          <Checklist />
        </div>

        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <PomodoroTimer onModeChange={setMode} />
        </div>

        <div className="lg:col-span-3 min-h-[500px] order-3">
          <Notes />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-16 text-pink-400/80 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2 pb-8">
        Built with <Heart size={10} className="fill-pink-400/50" /> for your cozy focus
      </footer>
    </div>
  );
};

export default App;
