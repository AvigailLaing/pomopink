
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Moon, Clock, RefreshCw } from 'lucide-react';
import { TimerMode, TimerSettings } from '../types';
import { audioService } from '../services/audioService';

interface PomodoroTimerProps {
  onModeChange: (mode: TimerMode) => void;
  onPomodoroComplete: () => void;
  onFocusTick: (ms: number) => void;
  onResetFocusTime: () => void;
  totalFocusedTime: number;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  onModeChange, 
  onPomodoroComplete, 
  onFocusTick,
  onResetFocusTime,
  totalFocusedTime 
}) => {
  const settings: TimerSettings = {
    work: 25 * 60 * 1000,
    shortBreak: 5 * 60 * 1000,
    longBreak: 15 * 60 * 1000,
  };

  const [mode, setMode] = useState<TimerMode>('work');
  const [msLeft, setMsLeft] = useState(settings.work);
  const [isActive, setIsActive] = useState(false);
  
  const endTimeRef = useRef<number | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const switchMode = useCallback((newMode: TimerMode, shouldPlaySound = true) => {
    if (shouldPlaySound) audioService.playPop();
    setMode(newMode);
    setMsLeft(settings[newMode]);
    setIsActive(false);
    endTimeRef.current = null;
    onModeChange(newMode);
  }, [onModeChange]);

  useEffect(() => {
    if (isActive) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + msLeft;
      }
      
      lastTickRef.current = Date.now();

      timerIdRef.current = window.setInterval(() => {
        const now = Date.now();
        const delta = now - lastTickRef.current;
        lastTickRef.current = now;

        const remaining = Math.max(0, endTimeRef.current! - now);
        setMsLeft(remaining);

        // Report focus time if in work mode
        if (mode === 'work') {
          onFocusTick(delta);
        }

        if (remaining <= 0) {
          setIsActive(false);
          clearInterval(timerIdRef.current!);
          endTimeRef.current = null;
          audioService.playChime();
          if (mode === 'work') {
            onPomodoroComplete();
            switchMode('shortBreak', false);
          } else {
            switchMode('work', false);
          }
        }
      }, 100);
    } else {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    }

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
    };
  }, [isActive, mode, onPomodoroComplete, onFocusTick, switchMode]);

  const toggleTimer = () => {
    audioService.playTick();
    if (!isActive) {
      endTimeRef.current = Date.now() + msLeft;
    }
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    audioService.playPop();
    setIsActive(false);
    endTimeRef.current = null;
    setMsLeft(settings[mode]);
  };

  const handleResetClick = () => {
    audioService.playPop();
    onResetFocusTime();
  };

  const size = 256;
  const center = size / 2;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = msLeft / settings[mode];

  return (
    <div className="bg-white/60 backdrop-blur-md p-8 rounded-[40px] shadow-xl shadow-pink-100/50 flex flex-col items-center border border-white/40 transform-gpu">
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
          className="-rotate-90 block overflow-visible"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-pink-200/20"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-pink-50"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            className="text-pink-400"
            style={{ willChange: 'stroke-dashoffset' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-6xl font-bold text-pink-600 tracking-tighter drop-shadow-sm">
            {formatTime(msLeft)}
          </span>
          <span className="text-pink-300 font-bold uppercase tracking-widest text-[10px] mt-2">
            {mode === 'work' ? 'stay focused' : 'take it easy'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
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

        <div className="flex flex-col items-center gap-1.5 opacity-80 group">
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Clock size={10} className="text-pink-300" /> Total Focus Today
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-pink-600 tracking-tight ml-4">
              {formatTotalTime(totalFocusedTime)}
            </span>
            <button
              onClick={handleResetClick}
              className="p-1.5 text-pink-200 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
              title="Reset focus time"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
