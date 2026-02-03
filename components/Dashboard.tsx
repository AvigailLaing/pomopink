
import React, { useState } from 'react';
import { X, FileDown, Trophy, CheckCircle, Clock, ListTodo, FileText, Heart, Loader2 } from 'lucide-react';
import { Task } from '../types';
import html2canvas from 'https://esm.sh/html2canvas@1.4.1';
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1';

interface DashboardProps {
  onClose: () => void;
  tasks: Task[];
  pomodorosCompleted: number;
  notes: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onClose, tasks, pomodorosCompleted, notes }) => {
  const [isExporting, setIsExporting] = useState(false);
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);
  
  const handleExport = async () => {
    const element = document.getElementById('printable-dashboard');
    if (!element || isExporting) return;

    try {
      setIsExporting(true);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const actionButtons = clonedDoc.querySelectorAll('.export-action-button');
          actionButtons.forEach(btn => (btn as HTMLElement).style.display = 'none');
          
          const clonedElement = clonedDoc.getElementById('printable-dashboard');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.animation = 'none';
            clonedElement.style.transition = 'none';
            clonedElement.style.maxHeight = 'none'; // Ensure full height for capture
            clonedElement.style.overflow = 'visible';
          }
          const scrollArea = clonedDoc.querySelector('.custom-scrollbar');
          if (scrollArea) {
            (scrollArea as HTMLElement).style.maxHeight = 'none';
            (scrollArea as HTMLElement).style.overflow = 'visible';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`pomopink-summary-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Failed to export dashboard:', error);
      alert('Oops! Something went wrong while saving your summary. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div 
        className="absolute inset-0 bg-pink-200/40 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div 
        id="printable-dashboard"
        className="relative w-full max-w-4xl max-h-[90vh] bg-white shadow-2xl shadow-pink-300/50 rounded-[40px] md:rounded-[48px] overflow-hidden flex flex-col border border-white/50 animate-in zoom-in-95 duration-300"
      >
        {/* Fixed Header within the Modal */}
        <div className="bg-pink-500 p-6 md:p-10 text-white flex justify-between items-start flex-shrink-0">
          <div>
            <div className="flex items-center gap-4 mb-1 h-10 md:h-12">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic leading-none flex items-center h-full">
                Daily Summary
              </h2>
              <Heart className="fill-white text-white flex-shrink-0 animate-pulse" size={28} />
            </div>
            <p className="text-pink-100 text-sm md:text-base font-medium opacity-90">{today}</p>
          </div>
          <div className="flex gap-2 md:gap-4 export-action-button">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="p-2 md:p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all flex items-center gap-2 text-xs md:text-sm font-bold disabled:opacity-50"
            >
              {isExporting ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
              <span className="hidden sm:inline">{isExporting ? 'Saving...' : 'Save PDF'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 md:p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 md:space-y-12 custom-scrollbar scroll-smooth">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-400 rounded-2xl flex items-center justify-center text-white mb-3 md:mb-4 shadow-lg shadow-pink-200">
                <Trophy size={20} />
              </div>
              <span className="text-3xl md:text-4xl font-black text-pink-600 leading-none">
                {pomodorosCompleted}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-pink-400 uppercase tracking-widest mt-2">Pomodoros Done</span>
            </div>
            <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white mb-3 md:mb-4 shadow-lg shadow-pink-200">
                <CheckCircle size={20} />
              </div>
              <span className="text-3xl md:text-4xl font-black text-pink-600 leading-none">
                {completedTasks.length}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-pink-400 uppercase tracking-widest mt-2">Goals Smashed</span>
            </div>
            <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white mb-3 md:mb-4 shadow-lg shadow-pink-200">
                <Clock size={20} />
              </div>
              <span className="text-3xl md:text-4xl font-black text-pink-600 leading-none">
                {pomodorosCompleted * 25}m
              </span>
              <span className="text-[10px] md:text-xs font-bold text-pink-400 uppercase tracking-widest mt-2">Focused Time</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h4 className="flex items-center gap-2 text-base md:text-lg font-bold text-pink-600 mb-6 pb-2 border-b-2 border-pink-100">
                <CheckCircle size={18} className="text-pink-400" /> Magic Done
              </h4>
              <div className="space-y-4">
                {completedTasks.length > 0 ? (
                  completedTasks.map(t => (
                    <div key={t.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="w-5 h-5 rounded-full bg-pink-200 flex-shrink-0 mt-0.5 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-pink-500" />
                      </div>
                      <div>
                        <p className="text-pink-700 font-bold text-sm leading-snug">{t.text}</p>
                        {t.subtasks.filter(s => s.completed).map(s => (
                          <p key={s.id} className="text-pink-400 text-xs mt-1 ml-2 font-medium">✓ {s.text}</p>
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
              <h4 className="flex items-center gap-2 text-base md:text-lg font-bold text-pink-600 mb-6 pb-2 border-b-2 border-pink-100">
                <ListTodo size={18} className="text-pink-400" /> For Next Time
              </h4>
              <div className="space-y-4">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map(t => (
                    <div key={t.id} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full border-2 border-pink-200 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-pink-500 font-bold text-sm leading-snug">{t.text}</p>
                        {t.subtasks.filter(s => !s.completed).map(s => (
                          <p key={s.id} className="text-pink-300 text-xs mt-1 ml-2 font-medium">○ {s.text}</p>
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

          <div>
            <h4 className="flex items-center gap-2 text-base md:text-lg font-bold text-pink-600 mb-6 pb-2 border-b-2 border-pink-100">
              <FileText size={18} className="text-pink-400" /> Daily Reflections
            </h4>
            <div className="bg-pink-50/50 p-6 md:p-8 rounded-3xl border border-pink-100 shadow-inner">
              <p className="text-pink-700 text-sm md:text-base whitespace-pre-wrap italic leading-relaxed font-medium">
                {notes || "No notes captured today... but your heart knows the progress you've made. 💖"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 text-center text-[10px] text-pink-300 font-black uppercase tracking-[0.3em] border-t border-pink-50 flex items-center justify-center gap-2 flex-shrink-0">
          Captured with Pomopink <Heart size={10} className="fill-pink-200" /> Keep Dreaming
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
