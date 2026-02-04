
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Moon, Clock, RefreshCw, Plus, X, Check, MoreVertical } from 'lucide-react';
import { TimerMode, TimerSettings, HabitTracker, HabitLog } from '../types';
import { audioService } from '../services/audioService';
import HabitToast from './HabitToast';
import HabitHistoryModal from './HabitHistoryModal';

interface PomodoroTimerProps {
  onModeChange: (mode: TimerMode) => void;
  onPomodoroComplete: () => void;
  onFocusTick: (ms: number) => void;
  onResetFocusTime: () => void;
  totalFocusedTime: number;
}

const EMOJIS = ['🌷', '🍓', '✨', '💖', '☁️', '🎀', '🧸', '🍰', '🌸', '🏹', '🦁', '🌿', '💎'];

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
  const [habits, setHabits] = useState<HabitTracker[]>(() => {
    const saved = localStorage.getItem('pomopink-habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [activeToast, setActiveToast] = useState<{ habitId: string; logId: string } | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);
  
  const endTimeRef = useRef<number | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    localStorage.setItem('pomopink-habits', JSON.stringify(habits));
  }, [habits]);

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
    audioService.playPop();
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
        if (mode === 'work') onFocusTick(delta);
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
    return () => { if (timerIdRef.current) clearInterval(timerIdRef.current); };
  }, [isActive, mode, onPomodoroComplete, onFocusTick, switchMode]);

  const toggleTimer = () => {
    audioService.playTick();
    if (!isActive) endTimeRef.current = Date.now() + msLeft;
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

  const addHabit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newHabitName.trim()) return;
    audioService.playPop();
    const newHabit: HabitTracker = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      emoji: '🌷',
      history: []
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setIsAddingHabit(false);
  };

  const deleteHabit = (id: string) => {
    if (confirm('Are you sure you want to delete this habit tracker and all its history? 🌸')) {
      audioService.playPop();
      setHabits(prev => prev.filter(h => h.id !== id));
      setSelectedHabitId(null);
    }
  };

  const incrementHabit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    audioService.playSuccess();
    const logId = Date.now().toString();
    const log: HabitLog = { id: logId, timestamp: Date.now(), mode };
    setHabits(prev => prev.map(h => h.id === id ? { ...h, history: [...h.history, log] } : h));
    setActiveToast({ habitId: id, logId });
  };

  const handleSaveNote = (note: string) => {
    if (!activeToast) return;
    setHabits(prev => prev.map(h => h.id === activeToast.habitId ? {
      ...h,
      history: h.history.map(l => l.id === activeToast.logId ? { ...l, note } : l)
    } : h));
  };

  const updateHabitEmoji = (id: string, emoji: string) => {
    audioService.playPop();
    setHabits(prev => prev.map(h => h.id === id ? { ...h, emoji } : h));
    setShowEmojiPickerFor(null);
  };

  const updateLogNote = (habitId: string, logId: string, note: string) => {
    audioService.playPop();
    setHabits(prev => prev.map(h => h.id === habitId ? {
      ...h,
      history: h.history.map(l => l.id === logId ? { ...l, note } : l)
    } : h));
  };

  const deleteLog = (habitId: string, logId: string) => {
    audioService.playPop();
    setHabits(prev => prev.map(h => h.id === habitId ? {
      ...h,
      history: h.history.filter(l => l.id !== logId)
    } : h));
  };

  const size = 256;
  const center = size / 2;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = msLeft / settings[mode];

  return (
    <div className="bg-white/60 backdrop-blur-md p-8 rounded-[40px] shadow-xl shadow-pink-100/50 flex flex-col items-center border border-white/40 transform-gpu relative min-h-[600px] w-full">
      <div className="flex gap-2 mb-8 bg-pink-50/50 p-2 rounded-full border border-pink-100">
        <button onClick={() => switchMode('work')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'work' ? 'bg-pink-400 text-white shadow-lg shadow-pink-200' : 'text-pink-400 hover:bg-pink-100'}`}><Zap size={16} /> Work</button>
        <button onClick={() => switchMode('shortBreak')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'shortBreak' ? 'bg-pink-400 text-white shadow-lg shadow-pink-200' : 'text-pink-400 hover:bg-pink-100'}`}><Coffee size={16} /> Break</button>
        <button onClick={() => switchMode('longBreak')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${mode === 'longBreak' ? 'bg-pink-400 text-white shadow-lg shadow-pink-200' : 'text-pink-400 hover:bg-pink-100'}`}><Moon size={16} /> Rest</button>
      </div>

      <div className="relative mb-8 w-64 h-64 flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 block overflow-visible">
          <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-pink-200/20" />
          <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-pink-50" />
          <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} strokeLinecap="round" className="text-pink-400" style={{ willChange: 'stroke-dashoffset' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-6xl font-bold text-pink-600 tracking-tighter drop-shadow-sm">{formatTime(msLeft)}</span>
          <span className="text-pink-300 font-bold uppercase tracking-widest text-[10px] mt-2">{mode === 'work' ? 'stay focused' : 'take it easy'}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full mb-8">
        <div className="flex gap-4">
          <button onClick={toggleTimer} className="w-16 h-16 flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-all shadow-lg shadow-pink-200 hover:scale-110 active:scale-95">{isActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}</button>
          <button onClick={resetTimer} className="w-16 h-16 flex items-center justify-center bg-white text-pink-500 border-2 border-pink-100 hover:border-pink-300 rounded-full transition-all shadow-sm hover:scale-110 active:scale-95"><RotateCcw size={28} /></button>
        </div>
        <div className="flex flex-col items-center gap-1.5 opacity-80 group">
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] flex items-center gap-1.5"><Clock size={10} className="text-pink-300" /> Total Focus Today</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-pink-600 tracking-tight ml-4">{formatTotalTime(totalFocusedTime)}</span>
            <button onClick={handleResetClick} className="p-1.5 text-pink-200 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all" title="Reset focus time"><RefreshCw size={12} /></button>
          </div>
        </div>
      </div>

      <div className="w-full pt-6 border-t border-pink-100 flex flex-col items-center gap-4">
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {habits.map(habit => (
            <div key={habit.id} className="relative flex items-center w-full animate-in zoom-in-95 group/habit h-auto min-h-[3rem]">
              {/* Contextual Toast Positioning */}
              {activeToast?.habitId === habit.id && (
                <HabitToast 
                  emoji={habit.emoji}
                  trackerName={habit.name}
                  onClose={() => setActiveToast(null)}
                  onSaveNote={handleSaveNote}
                />
              )}

              {/* Split Control Layout */}
              <div className="flex items-center w-full bg-white/40 border border-pink-100 rounded-[28px] transition-all group-hover/habit:bg-white group-hover/habit:shadow-md group-hover/habit:shadow-pink-100 overflow-hidden h-auto min-h-[3rem] py-2">
                {/* 1. Emoji (Left) */}
                <button 
                  onClick={() => setShowEmojiPickerFor(showEmojiPickerFor === habit.id ? null : habit.id)}
                  className="px-4 self-stretch flex items-center text-xl hover:bg-pink-50 transition-colors border-r border-pink-50"
                >
                  {habit.emoji}
                </button>

                {/* 2. Name (Center) */}
                <div className="flex-1 px-4 flex items-center text-left select-none overflow-hidden py-1">
                  <span className="text-base font-bold text-pink-700 whitespace-normal break-words leading-tight">
                    {habit.name}
                  </span>
                </div>

                {/* 3. Right Group (Count, +, Dots) */}
                <div className="flex items-center gap-1.5 px-3 self-stretch bg-pink-50/30">
                  <div className="bg-pink-500 text-white min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm">
                    {habit.history.length}
                  </div>
                  
                  <button 
                    onClick={(e) => incrementHabit(e, habit.id)}
                    className="w-8 h-8 flex items-center justify-center bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 active:scale-90 transition-all"
                    title="Log a win"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>

                  <button 
                    onClick={() => setSelectedHabitId(habit.id)}
                    className="p-1.5 text-pink-300 hover:text-pink-600 transition-colors"
                    title="View history & settings"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {showEmojiPickerFor === habit.id && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-2xl shadow-xl border border-pink-100 z-50 flex flex-wrap gap-1 animate-in slide-in-from-top-2 max-w-[200px]">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => updateHabitEmoji(habit.id, e)} className="p-1.5 hover:bg-pink-50 rounded-lg text-lg transition-all hover:scale-125">{e}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isAddingHabit ? (
            <form onSubmit={addHabit} className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-pink-200 shadow-sm animate-in slide-in-from-top-2 h-12">
              <input 
                autoFocus
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Name your new habit..."
                className="bg-transparent border-none outline-none text-sm text-pink-700 px-2 w-full placeholder:text-pink-200 font-bold"
              />
              <button type="submit" className="text-pink-500 hover:text-pink-700 p-1"><Check size={20} /></button>
              <button type="button" onClick={() => setIsAddingHabit(false)} className="text-pink-200 hover:text-pink-400 p-1"><X size={20} /></button>
            </form>
          ) : (
            <button 
              onClick={() => setIsAddingHabit(true)}
              className="text-sm font-bold text-pink-600 hover:text-pink-800 flex items-center justify-center gap-1.5 transition-all p-3 bg-pink-50 rounded-2xl hover:bg-pink-100 mt-2"
            >
              <Plus size={16} /> Add Habit Tracker
            </button>
          )}
        </div>
      </div>

      {selectedHabitId && (
        <HabitHistoryModal 
          habit={habits.find(h => h.id === selectedHabitId)!}
          onClose={() => setSelectedHabitId(null)}
          onUpdateNote={(logId, note) => updateLogNote(selectedHabitId, logId, note)}
          onDeleteLog={(logId) => deleteLog(selectedHabitId, logId)}
          onDeleteHabit={() => deleteHabit(selectedHabitId)}
        />
      )}
    </div>
  );
};

export default PomodoroTimer;
