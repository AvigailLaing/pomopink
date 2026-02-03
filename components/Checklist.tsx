
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

const Checklist: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pomodoro-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border border-white/40 h-full flex flex-col shadow-xl shadow-pink-100/30">
      <h3 className="text-xl font-bold text-pink-600 mb-4 flex items-center gap-2">
        ✨ Today's Tasks
      </h3>
      
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-2xl bg-white/80 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-700 placeholder:text-pink-200"
        />
        <button
          type="submit"
          className="p-2 bg-pink-400 text-white rounded-2xl hover:bg-pink-500 transition-colors shadow-md shadow-pink-100"
        >
          <Plus size={24} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-pink-300 italic text-sm">
            No tasks yet! Time to plan your magic ✨
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center gap-3 p-3 rounded-2xl transition-all ${task.completed ? 'bg-pink-50/50' : 'bg-white/50 hover:bg-white/80'}`}
            >
              <button onClick={() => toggleTask(task.id)} className="text-pink-400 hover:text-pink-600 transition-colors">
                {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <span className={`flex-1 text-sm font-medium transition-all ${task.completed ? 'line-through text-pink-300' : 'text-pink-700'}`}>
                {task.text}
              </span>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-pink-200 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-pink-50 text-xs text-pink-400 font-medium">
        {tasks.filter(t => t.completed).length}/{tasks.length} tasks completed
      </div>
    </div>
  );
};

export default Checklist;
