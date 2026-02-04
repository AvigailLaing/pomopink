
import React, { useState } from 'react';
import { X, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { HabitTracker, HabitLog } from '../types';

interface HabitHistoryModalProps {
  habit: HabitTracker;
  onClose: () => void;
  onUpdateNote: (logId: string, newNote: string) => void;
  onDeleteLog: (logId: string) => void;
}

const HabitHistoryModal: React.FC<HabitHistoryModalProps> = ({ habit, onClose, onUpdateNote, onDeleteLog }) => {
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editNoteValue, setEditNoteValue] = useState('');

  const handleStartEdit = (log: HabitLog) => {
    setEditingLogId(log.id);
    setEditNoteValue(log.note || '');
  };

  const handleSaveEdit = (logId: string) => {
    onUpdateNote(logId, editNoteValue);
    setEditingLogId(null);
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pink-100/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-pink-100 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="bg-pink-500 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{habit.emoji}</span>
            <div>
              <h3 className="font-bold text-xl leading-tight">{habit.name}</h3>
              <p className="text-pink-100 text-xs font-bold uppercase tracking-widest">{habit.history.length} Total Wins</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {habit.history.length === 0 ? (
            <div className="text-center py-10 text-pink-300 italic">No entries yet. Start your streak! 🌷</div>
          ) : (
            [...habit.history].reverse().map((log) => (
              <div key={log.id} className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/50 space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-tighter">
                    <Clock size={12} />
                    {formatTime(log.timestamp)}
                    <span className="opacity-50">•</span>
                    <span className="text-pink-300">{log.mode} mode</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleStartEdit(log)} className="p-1.5 text-pink-300 hover:text-pink-600 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDeleteLog(log.id)} className="p-1.5 text-pink-200 hover:text-rose-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {editingLogId === log.id ? (
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      className="flex-1 bg-white border border-pink-200 rounded-xl px-3 py-1.5 text-sm text-pink-700 outline-none focus:ring-1 focus:ring-pink-300"
                      value={editNoteValue}
                      onChange={(e) => setEditNoteValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(log.id)}
                    />
                    <button 
                      onClick={() => handleSaveEdit(log.id)}
                      className="bg-pink-500 text-white px-3 py-1 rounded-xl text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-pink-700 text-sm font-medium leading-relaxed">
                    {log.note || <span className="opacity-30 italic">No note recorded</span>}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitHistoryModal;
