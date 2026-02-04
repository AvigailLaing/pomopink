
import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';

interface HabitToastProps {
  onClose: () => void;
  onSaveNote: (note: string) => void;
  trackerName: string;
  emoji: string;
}

const HabitToast: React.FC<HabitToastProps> = ({ onClose, onSaveNote, trackerName, emoji }) => {
  const [note, setNote] = useState('');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Auto-close after 5 seconds of inactivity
    timeoutRef.current = window.setTimeout(onClose, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onSaveNote(note.trim());
    }
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote(e.target.value);
    // Refresh timeout when user is actively typing
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(onClose, 8000);
  };

  return (
    <div 
      className="absolute left-0 bottom-full mb-2 z-50 w-full max-w-sm animate-in zoom-in-95 slide-in-from-bottom-2 duration-200 origin-bottom"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="bg-white p-3 rounded-2xl shadow-xl border border-pink-100">
        {/* Header Row */}
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
            Resisted urge to {trackerName}
          </span>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 hover:bg-pink-50 rounded-full transition-colors"
          >
            <X size={14} className="text-pink-300" />
          </button>
        </div>

        {/* Input Row */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input 
            autoFocus
            type="text"
            value={note}
            onChange={handleInputChange}
            placeholder="What happened? ✨"
            className="flex-1 bg-white border border-pink-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all"
          />
          <button 
            type="submit"
            className="bg-pink-500 text-white p-2 rounded-xl hover:bg-pink-600 active:scale-95 transition-all shadow-md shadow-pink-100 flex-shrink-0"
            title="Save note"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
      
      {/* Subtle pointer arrow */}
      <div className="absolute left-6 -bottom-1 w-2 h-2 bg-white border-r border-b border-pink-100 rotate-45" />
    </div>
  );
};

export default HabitToast;
