
import React from 'react';
import { X, FileDown, Trophy, CheckCircle, Clock, ListTodo, FileText, Heart } from 'lucide-react';
import { Task } from '../types';

interface DashboardProps {
  onClose: () => void;
  tasks: Task[];
  pomodorosCompleted: number;
  notes: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onClose, tasks, pomodorosCompleted, notes }) => {
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);
  
  const handleExport = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 print:p-0 print:block print:static">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-pink-200/40 backdrop-blur-xl animate-in fade-in duration-300 print:hidden"
        onClick={onClose}
      />
      
      {/* Dashboard Container */}
      <div 
        id="printable-dashboard"
        className="relative w-full max-w-4xl bg-white/90 shadow-2xl shadow-pink-300/50 rounded-[48px] overflow-hidden flex flex-col border border-white/50 animate-in zoom-in-95 duration-300 print:shadow-none print:border-none print:rounded-none print:bg-white print:w-full print:max-w-none print:static print:flex-none print:overflow-visible"
      >
        {/* Header */}
        <div className="bg-pink-500 p-8 md:p-12 text-white flex justify-between items-start print:bg-pink-500 print:text-white print:p-12 print:mb-8 print:block print:relative">
          <div className="print:w-full">
            <div className="flex items-center gap-4 mb-2">
              <Heart className="fill-white text-white" size={32} />
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">Daily Summary</h2>
            </div>
            <p className="mt-2 text-pink-100 font-medium opacity-90">{today}</p>
          </div>
          <div className="flex gap-4 print:hidden">
            <button 
              onClick={handleExport}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all flex items-center gap-2 text-sm font-bold"
            >
              <FileDown size={20} /> <span className="hidden md:inline">Save PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area - Changed flex-1 and overflow to handle print better */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar print:overflow-visible print:p-0 print:space-y-12">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-6">
            <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 flex flex-col items-center text-center print:bg-pink-50 print:border-pink-100">
              <div className="w-12 h-12 bg-pink-400 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-200 print:shadow-none">
                <Trophy size={24} />
              </div>
              <span className="text-3xl font-black text-pink-600">{pomodorosCompleted}</span>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest mt-1">Pomodoros Done</span>
            </div>
            <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 flex flex-col items-center text-center print:bg-pink-50 print:border-pink-100">
              <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-200 print:shadow-none">
                <CheckCircle size={24} />
              </div>
              <span className="text-3xl font-black text-pink-600">{completedTasks.length}</span>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest mt-1">Goals Smashed</span>
            </div>
            <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 flex flex-col items-center text-center print:bg-pink-50 print:border-pink-100">
              <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-200 print:shadow-none">
                <Clock size={24} />
              </div>
              <span className="text-3xl font-black text-pink-600">{pomodorosCompleted * 25}m</span>
              <span className="text-xs font-bold text-pink-400 uppercase tracking-widest mt-1">Focused Time</span>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 print:grid-cols-2 print:gap-12 print:page-break-inside-avoid">
            <div>
              <h4 className="flex items-center gap-2 text-lg font-bold text-pink-600 mb-6 pb-2 border-b-2 border-pink-100">
                <CheckCircle size={18} /> Magic Done
              </h4>
              <div className="space-y-4">
                {completedTasks.length > 0 ? (
                  completedTasks.map(t => (
                    <div key={t.id} className="flex gap-3 print:page-break-inside-avoid">
                      <div className="w-5 h-5 rounded-full bg-pink-200 flex-shrink-0 mt-0.5 print:bg-pink-200" />
                      <div>
                        <p className="text-pink-700 font-medium text-sm">{t.text}</p>
                        {t.subtasks.filter(s => s.completed).map(s => (
                          <p key={s.id} className="text-pink-400 text-xs mt-1 ml-2">✓ {s.text}</p>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-pink-300 italic text-sm">No tasks completed yet. Keep going!</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-lg font-bold text-pink-600 mb-6 pb-2 border-b-2 border-pink-100">
                <ListTodo size={18} /> For Next Time
              </h4>
              <div className="space-y-4">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map(t => (
                    <div key={t.id} className="flex gap-3 print:page-break-inside-avoid">
                      <div className="w-5 h-5 rounded-full border-2 border-pink-200 flex-shrink-0 mt-0.5 print:border-pink-200" />
                      <div>
                        <p className="text-pink-500 font-medium text-sm">{t.text}</p>
                        {t.subtasks.filter(s => !s.completed).map(s => (
                          <p key={s.id} className="text-pink-300 text-xs mt-1 ml-2">○ {s.text}</p>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-pink-300 italic text-sm">Everything is clear! Great job! ✨</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="print:page-break-inside-avoid">
            <h4 className="flex items-center gap-2 text-lg font-bold text-pink-600 mb-6 pb-2 border-b-2 border-pink-100">
              <FileText size={18} /> Daily Reflections
            </h4>
            <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm print:shadow-none print:border print:border-pink-50">
              <p className="text-pink-700 text-sm whitespace-pre-wrap italic leading-relaxed">
                {notes || "No notes captured today... but your heart knows the progress you've made. 💖"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 text-center text-[10px] text-pink-300 font-bold uppercase tracking-widest border-t border-pink-50 flex items-center justify-center gap-2 print:border-t print:mt-12">
          Captured with Pomopink <Heart size={10} className="fill-pink-200" /> Keep Dreaming
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            margin: 1.5cm;
            size: auto;
          }
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide everything but the dashboard container */
          body > * {
            display: none !important;
          }
          #root {
            display: block !important;
          }
          #root > *:not(.fixed) {
             display: none !important;
          }
          .fixed {
            display: block !important;
            position: relative !important;
            inset: auto !important;
            padding: 0 !important;
            background: none !important;
          }
          #printable-dashboard {
            display: flex !important;
            flex-direction: column !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 0 !important;
            border: none !important;
          }
          .custom-scrollbar {
            overflow: visible !important;
            height: auto !important;
          }
          .print\\:page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
