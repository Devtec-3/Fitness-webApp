
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskCategory } from '../types';
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle, Calendar as CalendarIcon, MapPin, Search } from 'lucide-react';

interface RoutineViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onRemoveTask: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

const RoutineView: React.FC<RoutineViewProps> = ({ tasks, onAddTask, onRemoveTask, onUpdateStatus }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    startTime: '09:00',
    durationMinutes: 30,
    category: TaskCategory.WORK
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = Object.values(TaskCategory);
  const sortedTasks = [...tasks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const getCurrentPositionInDay = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = (hours * 60) + minutes;
    const startOfDay = 6 * 60; // 6 AM
    const endOfDay = 22 * 60; // 10 PM
    const percentage = ((totalMinutes - startOfDay) / (endOfDay - startOfDay)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title && newTask.startTime) {
      onAddTask({
        title: newTask.title as string,
        startTime: newTask.startTime as string,
        durationMinutes: newTask.durationMinutes || 30,
        category: (newTask.category as TaskCategory) || TaskCategory.PERSONAL,
        status: TaskStatus.TODO
      });
      setIsAdding(false);
      setNewTask({ title: '', startTime: '09:00', durationMinutes: 30, category: TaskCategory.WORK });
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Live Blueprint</h2>
          <p className="text-slate-500 dark:text-zinc-500 font-medium mt-2">Active chronological mapping of your neural rituals.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-2xl shadow-indigo-500/30 hover:bg-indigo-500 transition-all active:scale-95 uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5" />
          <span>New Block</span>
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-indigo-200 dark:border-indigo-900/50 shadow-2xl space-y-6 animate-in fade-in slide-in-from-top-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Ritual Name</label>
              <input 
                type="text" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Category</label>
              <select 
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value as TaskCategory})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Start Time</label>
              <input 
                type="time" 
                value={newTask.startTime}
                onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Mins</label>
              <input 
                type="number" 
                value={newTask.durationMinutes}
                onChange={(e) => setNewTask({...newTask, durationMinutes: parseInt(e.target.value)})}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 font-bold text-slate-400">Discard</button>
            <button type="submit" className="px-10 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 shadow-lg">Confirm</button>
          </div>
        </form>
      )}

      {/* Timeline View */}
      <div className="relative pl-12 md:pl-24 pb-20">
        {/* The Timeline Line */}
        <div className="absolute left-6 md:left-12 top-0 bottom-0 w-1 bg-slate-200 dark:bg-zinc-800 rounded-full"></div>
        
        {/* Live Indicator */}
        <div 
          className="absolute left-4 md:left-10 w-5 md:w-5 h-5 bg-red-500 rounded-full border-4 border-white dark:border-zinc-950 z-10 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-1000"
          style={{ top: `${getCurrentPositionInDay()}%` }}
        >
          <div className="absolute left-8 md:left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Current Pulse: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="space-y-12">
          {sortedTasks.map((task) => (
            <div key={task.id} className="relative group">
              {/* Dot on timeline */}
              <div className={`absolute -left-7 md:-left-13 top-6 w-3 h-3 rounded-full border-2 bg-white dark:bg-zinc-900 transition-all ${
                task.status === TaskStatus.COMPLETED ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-zinc-700'
              }`}></div>
              
              <div className={`bg-white dark:bg-zinc-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all flex flex-col md:flex-row md:items-center gap-8 ${task.status === TaskStatus.COMPLETED ? 'opacity-50 grayscale bg-slate-50' : ''}`}>
                <div className="flex flex-col items-start min-w-[80px]">
                  <span className="text-2xl font-black text-slate-900 dark:text-zinc-100">{task.startTime}</span>
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">{task.durationMinutes}m Flow</span>
                </div>

                <div className="flex-1 space-y-2">
                   <div className="flex items-center gap-3">
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                       task.category === TaskCategory.WORK ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/40' :
                       task.category === TaskCategory.HEALTH ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40' :
                       'bg-slate-100 text-slate-600 dark:bg-zinc-800'
                     }`}>
                       {task.category}
                     </span>
                     {task.status === TaskStatus.COMPLETED && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                   </div>
                   <h4 className="text-xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">{task.title}</h4>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onUpdateStatus(task.id, task.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED)}
                    className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      task.status === TaskStatus.COMPLETED 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {task.status === TaskStatus.COMPLETED ? 'Ritual Done' : 'Complete'}
                  </button>
                  <button onClick={() => onRemoveTask(task.id)} className="p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutineView;
