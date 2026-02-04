
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Send, X } from 'lucide-react';

interface WillpowerToastProps {
  onClose: () => void;
  onSaveNote: (note: string) => void;
  trackerName: string;
}

const WillpowerToast: React.FC<WillpowerToastProps> = ({ onClose, onSaveNote, trackerName }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [note, setNote] = useState('');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isExpanding) {
      timeoutRef.current = window.setTimeout(onClose, 3000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isExpanding, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onSaveNote(note.trim());
    }
    onClose();
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className={`bg-white shadow-2xl shadow-pink-200/50 border border-pink-100 rounded-2xl overflow-hidden transition-all duration-300 ${isExpanding ? 'w-64 md:w-80' : 'w-auto'}`}>
        {!isExpanding ? (
          <div className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
            <div className="bg-pink-100 p-1.5 rounded-lg text-pink-500">
              <Shield size={16} fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-pink-700">Willpower +1! 🛡️</span>
            <button 
              onClick={() => setIsExpanding(true)}
              className="text-[10px] font-black uppercase tracking-wider text-pink-400 hover:text-pink-600 transition-colors bg-pink-50 px-2 py-1 rounded-md"
            >
              Add Note?
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-3 space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase text-pink-300 tracking-widest">Resisting {trackerName}</span>
              <button type="button" onClick={onClose} className="text-pink-200 hover:text-pink-400">
                <X size={14} />
              </button>
            </div>
            <div className="flex gap-2">
              <input 
                autoFocus
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Why did you block this?"
                className="flex-1 bg-pink-50 border-none rounded-xl px-3 py-2 text-xs text-pink-700 focus:ring-1 focus:ring-pink-300 outline-none"
              />
              <button 
                type="submit"
                className="bg-pink-500 text-white p-2 rounded-xl hover:bg-pink-600 transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WillpowerToast;
