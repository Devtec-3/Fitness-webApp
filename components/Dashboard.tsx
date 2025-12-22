
import React, { useEffect, useState } from 'react';
import { Task, TaskStatus } from '../types';
import { CheckCircle2, Clock, Flame, Zap, Brain, Globe, Sparkles, TrendingUp, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getGlobalInspiration } from '../services/geminiService';

interface DashboardProps {
  tasks: Task[];
  energy: number;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
}

const performanceData = [
  { name: '00', value: 400 },
  { name: '04', value: 300 },
  { name: '08', value: 600 },
  { name: '12', value: 800 },
  { name: '16', value: 500 },
  { name: '20', value: 900 },
  { name: '24', value: 700 },
];

const Dashboard: React.FC<DashboardProps> = ({ tasks, energy, onUpdateStatus }) => {
  const [inspiration, setInspiration] = useState<string>("Synchronizing with World Intel...");
  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.TODO).slice(0, 3);
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  useEffect(() => {
    getGlobalInspiration().then(setInspiration);
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Portal</h1>
          <p className="text-slate-500 dark:text-zinc-500 mt-4 font-medium max-w-sm leading-relaxed">
            Harnessing planetary rituals and local flow to architect your optimal existence.
          </p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl dark:shadow-black/50 flex items-center gap-6 group transition-all hover:-translate-y-1">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Metabolic Potential</span>
            <span className="text-3xl font-black text-orange-500 dark:text-orange-400">{energy * 10}%</span>
          </div>
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 ${energy > 7 ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-[0_0_30px_rgba(251,146,60,0.3)]' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]'}`}>
            <Zap className="w-8 h-8 fill-current" />
          </div>
        </div>
      </header>

      {/* Hero Pulse Section */}
      <section className="bg-slate-900 dark:bg-black p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-10 transition-transform group-hover:scale-125 duration-[3000ms]">
          <Globe className="w-48 h-48 text-indigo-400 animate-spin-slow" />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3 text-indigo-400">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Neural Inspiration Feed</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white leading-tight italic tracking-tight">
              "{inspiration}"
            </p>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <Globe className="w-3 h-3" />
              Grounded Real-Time
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[1.8rem] font-black text-sm tracking-widest uppercase transition-all shadow-xl shadow-indigo-600/20 active:scale-95 whitespace-nowrap">
            Implement Routine
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-xl flex flex-col justify-between transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50">
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-800 dark:text-zinc-200 uppercase tracking-widest text-xs">Peak Mastery</h3>
              <Flame className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <div className="relative h-44 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{progress.toFixed(0)}<span className="text-xl text-indigo-500">%</span></div>
              </div>
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-zinc-800" />
                <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={452} strokeDashoffset={452 - (452 * progress) / 100} className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out shadow-lg" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 text-center mt-6 uppercase tracking-widest">
            {completedCount} Rituals Decoded
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-xl col-span-2 transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 dark:text-zinc-200 uppercase tracking-widest text-xs">Cognitive Load Trend</h3>
            <Brain className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        <section className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-800 dark:text-zinc-200 uppercase tracking-widest text-xs flex items-center gap-3">
              <Clock className="w-5 h-5 text-indigo-600" />
              Primary Blocks
            </h3>
            <button className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline">Full Blueprint</button>
          </div>
          <div className="space-y-4">
            {pendingTasks.length > 0 ? pendingTasks.map((task) => (
              <div key={task.id} className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-[2rem] hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 cursor-pointer">
                <div className="flex items-center gap-5">
                  <button onClick={() => onUpdateStatus(task.id, TaskStatus.COMPLETED)} className="w-10 h-10 rounded-2xl border-2 border-slate-200 dark:border-zinc-700 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 group-hover:border-indigo-500 transition-all shadow-sm">
                    <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 text-white transition-opacity" />
                  </button>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-zinc-100 group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors">{task.title}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-black uppercase tracking-widest">{task.startTime} • {task.durationMinutes}m Flow</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-16">
                <Sparkles className="w-12 h-12 text-slate-200 dark:text-zinc-800 mx-auto mb-6" />
                <p className="text-slate-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-xs">Architectural Nirvana Reached</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-indigo-900 dark:bg-zinc-950 p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Activity className="w-40 h-40 text-white" />
          </div>
          <div className="space-y-6 relative z-10">
            <h3 className="font-black text-indigo-200 dark:text-zinc-400 uppercase tracking-widest text-xs">Strategic Instruction</h3>
            <p className="text-white text-xl font-bold leading-relaxed tracking-tight">
              Aura identifies a peak cognitive window between <span className="text-indigo-400">14:00 — 16:30</span>. We recommend allocating high-intensity coding tasks to this block. 
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-indigo-300 font-medium">
              Grounding: Recent neurobiological studies suggest task-switching costs are lowest in your late-afternoon metabolic dip.
            </div>
          </div>
          <button className="mt-10 w-full py-5 bg-white text-indigo-900 dark:bg-zinc-900 dark:text-zinc-100 font-black rounded-3xl hover:bg-indigo-100 dark:hover:bg-black transition-all shadow-xl text-sm tracking-widest uppercase active:scale-[0.98]">
            Optimize Calendar
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
