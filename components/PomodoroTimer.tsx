
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Moon } from 'lucide-react';
import { TimerMode, TimerSettings } from '../types';

interface PomodoroTimerProps {
  onModeChange: (mode: TimerMode) => void;
  onPomodoroComplete: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onModeChange, onPomodoroComplete }) => {
  const settings: TimerSettings = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.work);
  const [isActive, setIsActive] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(settings[newMode]);
    setIsActive(false);
    onModeChange(newMode);
  }, [onModeChange]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      
      if (mode === 'work') {
        onPomodoroComplete();
        switchMode('shortBreak');
      } else {
        switchMode('work');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, switchMode, onPomodoroComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode]);
  };

  const size = 256;
  const center = size / 2;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white/60 backdrop-blur-md p-8 rounded-[40px] shadow-xl shadow-pink-100/50 flex flex-col items-center border border-white/40">
      <div className="flex gap-2 mb-8 bg-pink-50/50 p-2 rounded-full border border-pink-100">
        <button
          onClick={() => switchMode('work')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'work' ? 'bg-pink-400 text-white shadow-lg shadow-pink-200' : 'text-pink-400 hover:bg-pink-100'}`}
        >
          <Zap size={16} /> Work
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'shortBreak' ? 'bg-pink-400 text-white shadow-lg shadow-pink-200' : 'text-pink-400 hover:bg-pink-100'}`}
        >
          <Coffee size={16} /> Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'longBreak' ? 'bg-pink-400 text-white shadow-lg shadow-pink-200' : 'text-pink-400 hover:bg-pink-100'}`}
        >
          <Moon size={16} /> Rest
        </button>
      </div>

      <div className="relative mb-8 w-64 h-64 flex items-center justify-center">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="-rotate-90 block"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-pink-100"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - timeLeft / settings[mode])}
            strokeLinecap="round"
            className="text-pink-400 transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-6xl font-bold text-pink-600 tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-pink-300 font-semibold uppercase tracking-widest text-[10px] mt-2">
            {mode === 'work' ? 'stay focused' : 'take it easy'}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className="w-16 h-16 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-all shadow-lg shadow-pink-200 hover:scale-110 active:scale-95"
        >
          {isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        <button
          onClick={resetTimer}
          className="w-16 h-16 flex items-center justify-center bg-white text-pink-500 border-2 border-pink-100 hover:border-pink-300 rounded-full transition-all shadow-sm hover:scale-110 active:scale-95"
        >
          <RotateCcw size={28} />
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
