
import React, { useState, useEffect } from 'react';
import { PenLine } from 'lucide-react';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('pomodoro-notes') || '';
  });

  useEffect(() => {
    localStorage.setItem('pomodoro-notes', notes);
  }, [notes]);

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border border-white/40 min-h-[600px] flex flex-col shadow-xl shadow-pink-100/30">
      <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
        <PenLine size={20} /> Cozy Notes
      </h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Pour your heart out here..."
        className="flex-1 bg-pink-50/30 p-4 rounded-2xl border border-pink-100/50 text-pink-700 placeholder:text-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none text-sm leading-relaxed"
      />
      <p className="mt-4 text-[10px] text-pink-300 uppercase tracking-widest text-center">
        Saved automatically with love
      </p>
    </div>
  );
};

export default Notes;
