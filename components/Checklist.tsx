
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ChevronUp, ChevronDown, ListPlus } from 'lucide-react';
import { Task, SubTask } from '../types';
import { audioService } from '../services/audioService';

const Checklist: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.map((t: any) => ({
      ...t,
      subtasks: t.subtasks || []
    }));
  });
  const [inputValue, setInputValue] = useState('');
  const [activeSubtaskInput, setActiveSubtaskInput] = useState<string | null>(null);
  const [subtaskValue, setSubtaskValue] = useState('');

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    audioService.playPop();
    const newTask: Task = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const addSubtask = (taskId: string) => {
    if (!subtaskValue.trim()) return;
    audioService.playPop();
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...t.subtasks, { id: Date.now().toString(), text: subtaskValue, completed: false }]
        };
      }
      return t;
    }));
    setSubtaskValue('');
    setActiveSubtaskInput(null);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) audioService.playSuccess();
        else audioService.playPop();
        return { 
          ...t, 
          completed: nextState,
          subtasks: t.subtasks.map(st => ({ ...st, completed: nextState }))
        };
      }
      return t;
    }));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newSubtasks = t.subtasks.map(st => {
          if (st.id === subtaskId) {
            const next = !st.completed;
            if (next) audioService.playSuccess();
            else audioService.playPop();
            return { ...st, completed: next };
          }
          return st;
        });
        return { ...t, subtasks: newSubtasks };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    audioService.playPop();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    audioService.playPop();
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, subtasks: t.subtasks.filter(st => st.id !== subtaskId) };
      }
      return t;
    }));
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    audioService.playTick();
    const newTasks = [...tasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;
    [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
    setTasks(newTasks);
  };

  const totalItems = tasks.reduce((acc, t) => acc + 1 + t.subtasks.length, 0);
  const completedItems = tasks.reduce((acc, t) => {
    const mainWeight = t.completed ? 1 : 0;
    const subWeight = t.subtasks.filter(st => st.completed).length;
    return acc + mainWeight + subWeight;
  }, 0);
  const progress = totalItems === 0 ? 0 : (completedItems / totalItems) * 100;

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border border-white/40 h-full flex flex-col shadow-xl shadow-pink-100/30 overflow-hidden">
      <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2 flex-shrink-0">
        ✨ Today's Tasks
      </h3>
      
      <form onSubmit={addTask} className="flex gap-2 mb-4 flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-2xl bg-white/80 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-700 placeholder:text-pink-200 text-sm"
        />
        <button
          type="submit"
          className="p-2 bg-pink-400 text-white rounded-2xl hover:bg-pink-500 transition-colors shadow-md shadow-pink-100"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-pink-300 italic text-sm">
            No tasks yet! Time to plan your magic ✨
          </div>
        ) : (
          tasks.map((task, index) => (
            <div key={task.id} className="space-y-1">
              <div 
                className={`group relative flex items-center gap-2 p-2.5 rounded-2xl transition-all ${task.completed ? 'bg-pink-50/50' : 'bg-white/50 hover:bg-white/80 border border-transparent hover:border-pink-100'}`}
              >
                <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity absolute -left-1">
                  <button onClick={() => moveTask(index, 'up')} disabled={index === 0} className="p-0.5 text-pink-200 hover:text-pink-500 disabled:invisible">
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => moveTask(index, 'down')} disabled={index === tasks.length - 1} className="p-0.5 text-pink-200 hover:text-pink-500 disabled:invisible">
                    <ChevronDown size={14} />
                  </button>
                </div>

                <button onClick={() => toggleTask(task.id)} className="text-pink-400 hover:text-pink-600 transition-colors ml-4">
                  {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                
                <span className={`flex-1 text-sm font-medium transition-all ${task.completed ? 'line-through text-pink-300' : 'text-pink-700'}`}>
                  {task.text}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => { audioService.playTick(); setActiveSubtaskInput(activeSubtaskInput === task.id ? null : task.id); }}
                    className="p-1.5 text-pink-300 hover:text-pink-500 hover:bg-pink-50 rounded-lg"
                    title="Add subtask"
                  >
                    <ListPlus size={16} />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="p-1.5 text-pink-200 hover:text-rose-400 hover:bg-rose-50 rounded-lg" title="Delete task">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="ml-10 space-y-1">
                {task.subtasks.map(st => (
                  <div key={st.id} className="group/sub flex items-center gap-2 p-1.5 rounded-xl bg-pink-50/20 hover:bg-white/40 transition-all border border-transparent hover:border-pink-50">
                    <button onClick={() => toggleSubtask(task.id, st.id)} className="text-pink-300 hover:text-pink-500 transition-colors">
                      {st.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                    </button>
                    <span className={`flex-1 text-[13px] transition-all ${st.completed ? 'line-through text-pink-200' : 'text-pink-600 font-medium'}`}>
                      {st.text}
                    </span>
                    <button onClick={() => deleteSubtask(task.id, st.id)} className="p-1 text-pink-100 hover:text-rose-300 opacity-0 group-hover/sub:opacity-100 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                
                {activeSubtaskInput === task.id && (
                  <div className="flex gap-2 p-1 animate-in slide-in-from-top-1 duration-200">
                    <input
                      autoFocus
                      type="text"
                      value={subtaskValue}
                      onChange={(e) => setSubtaskValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSubtask(task.id)}
                      placeholder="Subtask name..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-pink-100 focus:outline-none focus:ring-1 focus:ring-pink-300 text-xs text-pink-600"
                    />
                    <button onClick={() => addSubtask(task.id)} className="px-3 bg-pink-300 text-white rounded-xl hover:bg-pink-400 text-xs font-bold">
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-pink-100/50 flex-shrink-0">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
            {Math.round(progress)}% Completed
          </span>
          <span className="text-[10px] text-pink-300 font-medium">
            {completedItems} of {totalItems} goals
          </span>
        </div>
        <div className="h-2 w-full bg-pink-100/50 rounded-full overflow-hidden">
          <div className="h-full bg-pink-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default Checklist;
