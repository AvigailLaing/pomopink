
import React, { useState, useEffect, useCallback } from 'react';
import AuraHeart from './components/AuraHeart';
import PomodoroTimer from './components/PomodoroTimer';
import Checklist from './components/Checklist';
import Notes from './components/Notes';
import Dashboard from './components/Dashboard';
import { getMotivationalCheer, getCooldownRemaining } from './services/geminiService';
import { audioService } from './services/audioService';
import { TimerMode, Task } from './types';
import { Heart, Sparkles, Clock, LayoutDashboard, Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [cheer, setCheer] = useState("Let's make today wonderful! ✨");
  const [isCheerLoading, setIsCheerLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('pomopink-muted') === 'true');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState("");
  const [pomodorosCompleted, setPomodorosCompleted] = useState(() => {
    const saved = localStorage.getItem('pomopink-stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      const lastDate = new Date(parsed.lastUpdated).toDateString();
      const today = new Date().toDateString();
      if (lastDate === today) return parsed.pomodorosCompleted;
    }
    return 0;
  });

  useEffect(() => {
    audioService.setMuted(isMuted);
    localStorage.setItem('pomopink-muted', String(isMuted));
  }, [isMuted]);

  const refreshCheer = async () => {
    if (getCooldownRemaining() > 0) return;
    audioService.playPop();
    setIsCheerLoading(true);
    // Get fresh task state from storage just for the AI cheer
    const currentTasks = JSON.parse(localStorage.getItem('pomodoro-tasks') || '[]');
    const pendingCount = currentTasks.filter((t: any) => !t.completed).length;
    const newCheer = await getMotivationalCheer(pendingCount);
    setCheer(newCheer);
    setIsCheerLoading(false);
    setCooldown(getCooldownRemaining());
  };

  useEffect(() => {
    // Initial sync
    const savedTasks = JSON.parse(localStorage.getItem('pomodoro-tasks') || '[]');
    const savedNotes = localStorage.getItem('pomodoro-notes') || "";
    setTasks(savedTasks);
    setNotes(savedNotes);

    if (getCooldownRemaining() === 0) {
      refreshCheer();
    }
    
    // Low frequency ticker only for AI cooldown UI
    const ticker = setInterval(() => {
      setCooldown(getCooldownRemaining());
    }, 1000);
    
    return () => clearInterval(ticker);
  }, []);

  // Sync dashboard state only when opening
  useEffect(() => {
    if (showDashboard) {
      const savedTasks = JSON.parse(localStorage.getItem('pomodoro-tasks') || '[]');
      const savedNotes = localStorage.getItem('pomodoro-notes') || "";
      setTasks(savedTasks);
      setNotes(savedNotes);
    }
  }, [showDashboard]);

  useEffect(() => {
    localStorage.setItem('pomopink-stats', JSON.stringify({
      pomodorosCompleted,
      lastUpdated: new Date().toISOString()
    }));
  }, [pomodorosCompleted]);

  const handlePomodoroComplete = useCallback(() => {
    setPomodorosCompleted(prev => prev + 1);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted === false) { // Logic for auditory feedback on unmute
      setTimeout(() => audioService.playPop(), 50);
    }
  };

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

        <div className="flex items-center gap-4">
          <button 
            onClick={refreshCheer}
            disabled={isCheerLoading || cooldown > 0}
            className={`relative group transition-all ${cooldown > 0 ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            <div className="px-8 py-3 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full text-pink-600 text-sm font-bold shadow-lg shadow-pink-200/50 flex items-center gap-2">
              {isCheerLoading ? "Brewing magic..." : cooldown > 0 ? (
                <span className="flex items-center gap-2 italic text-pink-300">
                  <Clock size={14} /> Recharging ({Math.ceil(cooldown/1000)}s)
                </span>
              ) : cheer}
            </div>
            <div className={`absolute -top-3 -right-3 bg-white p-1.5 rounded-full shadow-md ${cooldown > 0 ? 'text-pink-200' : 'text-pink-400'}`}>
              <Sparkles size={14} fill="currentColor" />
            </div>
          </button>

          <button 
            onClick={toggleMute}
            className="p-3 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full text-pink-400 hover:text-pink-600 transition-all hover:scale-110 shadow-lg shadow-pink-100"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-3 min-h-[500px] order-2 lg:order-1">
          <Checklist />
        </div>

        <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
          <PomodoroTimer 
            onModeChange={setMode} 
            onPomodoroComplete={handlePomodoroComplete} 
          />
        </div>

        <div className="lg:col-span-3 min-h-[500px] order-3">
          <Notes />
        </div>
      </main>

      <button 
        onClick={() => { audioService.playPop(); setShowDashboard(true); }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-pink-600 text-white rounded-full shadow-2xl shadow-pink-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 print:hidden"
        title="Daily Summary"
      >
        <LayoutDashboard size={28} />
      </button>

      {showDashboard && (
        <Dashboard 
          tasks={tasks}
          notes={notes}
          pomodorosCompleted={pomodorosCompleted}
          onClose={() => setShowDashboard(false)}
        />
      )}

      <footer className="mt-16 text-pink-400/80 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2 pb-8">
        Built with <Heart size={10} className="fill-pink-400/50" /> by avigail laing
      </footer>
    </div>
  );
};

export default App;
