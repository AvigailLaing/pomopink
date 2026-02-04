
import React, { useState, useEffect } from 'react';
import { X, FileDown, Trophy, CheckCircle, Clock, ListTodo, FileText, Heart, Loader2, Sparkles, ShieldCheck, Hourglass } from 'lucide-react';
import { Task, HabitTracker } from '../types';
import html2canvas from 'https://esm.sh/html2canvas@1.4.1';
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1';

interface DashboardProps {
  onClose: () => void;
  tasks: Task[];
  pomodorosCompleted: number;
  totalFocusedTime: number;
  notes: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onClose, 
  tasks, 
  pomodorosCompleted, 
  totalFocusedTime,
  notes 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [habits, setHabits] = useState<HabitTracker[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('pomopink-habits');
    if (saved) setHabits(JSON.parse(saved));
  }, []);

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
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.overflow = 'visible';
            clonedElement.style.width = '1200px'; // Force a wider capture for PDF
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape', // Better for wide dashboard
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`pomopink-summary-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to export dashboard:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const formattedFocusedTime = () => {
    const totalSeconds = Math.floor(totalFocusedTime / 1000);
    const m = Math.floor(totalSeconds / 60);
    if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`;
    return `${m}m`;
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-pink-100/60 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />
      
      {/* Redesigned Wide Canvas Container */}
      <div id="printable-dashboard" className="relative w-full max-w-6xl max-h-[90vh] bg-white shadow-[0_32px_128px_-16px_rgba(255,182,193,0.4)] rounded-[48px] overflow-hidden flex flex-col border border-white animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="bg-pink-500 p-8 md:p-12 text-white flex justify-between items-center flex-shrink-0">
          <div>
            <div className="flex items-center gap-5 mb-2">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">Daily Summary</h2>
              <Heart className="fill-white text-white animate-pulse" size={36} />
            </div>
            <p className="text-pink-100 text-lg font-bold opacity-90">{todayStr}</p>
          </div>
          <div className="flex gap-3 export-action-button">
            <button onClick={handleExport} disabled={isExporting} className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all flex items-center gap-3 text-sm font-black disabled:opacity-50">
              {isExporting ? <Loader2 size={20} className="animate-spin" /> : <FileDown size={20} />}
              <span>{isExporting ? 'Generating...' : 'Export Canvas'}</span>
            </button>
            <button onClick={onClose} className="p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 md:p-14 space-y-14 custom-scrollbar scroll-smooth">
          
          {/* Top Tally Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-[40px] border border-pink-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 bg-pink-400 rounded-3xl flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-100">
                <Trophy size={24} />
              </div>
              <span className="text-5xl font-black text-pink-600 tracking-tighter">{pomodorosCompleted}</span>
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mt-3">Pomodoro Sprints</span>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-[40px] border border-pink-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 bg-pink-500 rounded-3xl flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-100">
                <CheckCircle size={24} />
              </div>
              <span className="text-5xl font-black text-pink-600 tracking-tighter">{completedTasks.length}</span>
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mt-3">Goals Smashed</span>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-white p-8 rounded-[40px] border border-pink-100 flex flex-col items-center text-center shadow-sm">
              <div className="w-14 h-14 bg-pink-600 rounded-3xl flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-100">
                <Clock size={24} />
              </div>
              <span className="text-5xl font-black text-pink-600 tracking-tighter">{formattedFocusedTime()}</span>
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mt-3">Total Flow Time</span>
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* LEFT COLUMN: Tasks */}
            <div className="space-y-12">
              {/* Section 1: Magic Done */}
              <div>
                <h4 className="flex items-center gap-3 text-xl font-black text-pink-600 mb-8 uppercase tracking-widest border-b-4 border-pink-50 pb-4">
                  <CheckCircle size={24} className="text-pink-400" /> Magic Done
                </h4>
                <div className="space-y-5">
                  {completedTasks.length > 0 ? completedTasks.map(t => (
                    <div key={t.id} className="group bg-white/50 p-4 rounded-3xl border border-pink-50 hover:border-pink-200 transition-all shadow-sm">
                      <p className="text-pink-700 font-bold text-base flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        {t.text}
                      </p>
                      {t.subtasks.length > 0 && (
                        <div className="mt-2 ml-5 space-y-1 border-l border-pink-100 pl-4">
                          {t.subtasks.map(s => (
                            <p key={s.id} className={`text-xs ${s.completed ? 'text-pink-300 line-through' : 'text-pink-400'}`}>
                              {s.completed ? '✓' : '•'} {s.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="bg-pink-50/50 p-8 rounded-[32px] text-center italic text-pink-500 text-sm">
                      No big wins yet... but they're coming! ✨
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: For Next Time */}
              <div>
                <h4 className="flex items-center gap-3 text-xl font-black text-pink-600 mb-8 uppercase tracking-widest border-b-4 border-pink-50 pb-4">
                  <Hourglass size={24} className="text-pink-400" /> For Next Time
                </h4>
                <div className="space-y-4">
                  {pendingTasks.length > 0 ? pendingTasks.map(t => (
                    <div key={t.id} className="flex gap-4 items-center bg-white border border-pink-50 p-4 rounded-2xl shadow-sm">
                      <div className="w-3 h-3 rounded-full border-2 border-pink-200" />
                      <p className="text-pink-600 font-bold text-sm">{t.text}</p>
                    </div>
                  )) : (
                    <div className="bg-pink-50/50 p-8 rounded-[32px] text-center italic text-pink-500 text-sm border border-pink-200">
                      All caught up! The board is clear. ✨
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Habits & Reflections */}
            <div className="space-y-12">
              {/* Section 3: Habit Report */}
              <div>
                <h4 className="flex items-center gap-3 text-xl font-black text-pink-600 mb-8 uppercase tracking-widest border-b-4 border-pink-50 pb-4">
                  <ShieldCheck size={24} className="text-pink-400" /> Habit Report
                </h4>
                <div className="space-y-8">
                  {habits.filter(h => h.history.length > 0).length > 0 ? habits.filter(h => h.history.length > 0).map(habit => (
                    <div key={habit.id} className="bg-pink-50/30 p-6 rounded-[32px] border border-pink-100/50 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 text-4xl group-hover:scale-125 transition-transform">{habit.emoji}</div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3 font-black text-pink-700 text-lg">
                          <span className="text-2xl">{habit.emoji}</span>
                          <span>{habit.name}</span>
                        </div>
                        <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-pink-100">
                          {habit.history.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {habit.history.slice(-3).reverse().map(log => (
                          <div key={log.id} className="bg-white/60 p-3 rounded-2xl text-xs flex gap-3 border border-pink-50">
                            <span className="text-pink-400 font-black uppercase tracking-tighter whitespace-nowrap">{formatTime(log.timestamp)}</span>
                            <span className="text-pink-600 font-medium italic">{log.note || 'Recorded a win ✨'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <div className="bg-pink-50/50 p-8 rounded-[32px] text-center italic text-pink-500 text-sm">
                      No habit logs today. Stay resilient! 🦁
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Daily Reflections */}
              <div>
                <h4 className="flex items-center gap-3 text-xl font-black text-pink-600 mb-8 uppercase tracking-widest border-b-4 border-pink-50 pb-4">
                  <FileText size={24} className="text-pink-400" /> Daily Reflections
                </h4>
                <div className="bg-white p-8 rounded-[40px] border-2 border-pink-50 shadow-inner relative">
                  <div className="absolute -top-4 -left-4 text-4xl text-pink-100/50 font-serif">"</div>
                  <p className="text-pink-700 text-base md:text-lg whitespace-pre-wrap italic leading-loose font-medium">
                    {notes || "No notes captured today... but your heart knows the progress you've made. 💖"}
                  </p>
                  <div className="absolute -bottom-4 -right-4 text-4xl text-pink-100/50 font-serif">"</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 text-center flex flex-col items-center gap-2 border-t border-pink-50 bg-pink-50/20">
          <div className="flex items-center gap-2 text-[11px] text-pink-400 font-black uppercase tracking-[0.4em]">
            Captured with Pomopink <Heart size={12} className="fill-pink-400/30" /> Romanticize Progress
          </div>
          <p className="text-[10px] text-pink-300 font-bold italic opacity-60">Every tiny step is a victory.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
