
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoutineView from './components/RoutineView';
import AICoach from './components/AICoach';
import HealthCore from './components/HealthCore';
import GrowthNexus from './components/GrowthNexus';
import KineticForge from './components/KineticForge';
import { Task, TaskStatus, TaskCategory, UserProfile, HealthNews } from './types';
import { Search, Bell, Moon, Sun, X, ExternalLink, Zap, Globe, Loader2, Clock } from 'lucide-react';
import { getLatestHealthNews } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [energy, setEnergy] = useState(7);
  const [notifications, setNotifications] = useState<HealthNews[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);
  const [hasNewNotifs, setHasNewNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(true); 
  const [liveClock, setLiveClock] = useState(new Date());
  const notifRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Neo',
    energyLevel: 7,
    goals: ['Improve focus', 'Exercise daily', 'Learn AI architecture'],
    preferences: 'Morning person, likes deep work blocks.'
  });

  useEffect(() => {
    const clockTimer = setInterval(() => setLiveClock(new Date()), 1000);
    const savedTasks = localStorage.getItem('aura-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const initialTasks: Task[] = [
        { id: '1', title: 'Wake up & Sunlight', startTime: '07:00', durationMinutes: 30, category: TaskCategory.HEALTH, status: TaskStatus.COMPLETED },
        { id: '2', title: 'Deep Work Block: Architecture', startTime: '08:30', durationMinutes: 120, category: TaskCategory.WORK, status: TaskStatus.IN_PROGRESS },
        { id: '3', title: 'Nutrient Refuel', startTime: '12:00', durationMinutes: 45, category: TaskCategory.HEALTH, status: TaskStatus.TODO },
      ];
      setTasks(initialTasks);
    }
    refreshHealthUpdates();
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    localStorage.setItem('aura-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const refreshHealthUpdates = async () => {
    setIsLoadingNotifs(true);
    try {
      const updates = await getLatestHealthNews();
      setNotifications(updates);
      if (updates.length > 0) setHasNewNotifs(true);
    } catch (e) {
      console.error("Failed to fetch live updates", e);
    } finally {
      setIsLoadingNotifs(false);
    }
  };

  const addTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks(prev => [...prev, task]);
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const toggleNotifs = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) setHasNewNotifs(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tasks={tasks} energy={energy} onUpdateStatus={updateTaskStatus} />;
      case 'routine':
        return <RoutineView tasks={tasks} onAddTask={addTask} onRemoveTask={removeTask} onUpdateStatus={updateTaskStatus} />;
      case 'health':
        return <HealthCore />;
      case 'kinetic':
        return <KineticForge />;
      case 'botany':
        return <GrowthNexus />;
      case 'ai':
        return <AICoach tasks={tasks} energy={energy} />;
      default:
        return <Dashboard tasks={tasks} energy={energy} onUpdateStatus={updateTaskStatus} />;
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-500 overflow-hidden font-inter">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-500">
            <div className="flex-1 max-w-xl flex items-center gap-6">
              <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find a ritual, habit, or instruction..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-zinc-800/50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-sm dark:placeholder-zinc-600"
                />
              </div>

              {/* Architectural Chronometer */}
              <div className="hidden md:flex items-center gap-3 px-6 py-2 bg-slate-100 dark:bg-zinc-800/80 rounded-2xl border border-slate-200 dark:border-zinc-700">
                 <Clock className="w-4 h-4 text-indigo-500 animate-pulse" />
                 <span className="text-sm font-black tracking-tighter tabular-nums">
                   {liveClock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                 </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-6 relative" ref={notifRef}>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>

              <button 
                onClick={toggleNotifs}
                className={`p-2.5 rounded-xl transition-all relative ${isNotifOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 dark:text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
              >
                <Bell className="w-5 h-5" />
                {hasNewNotifs && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-4 w-[28rem] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-slate-200 dark:border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-6 bg-slate-900 dark:bg-black text-white flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                        <Globe className="w-4 h-4 text-indigo-400" />
                        Live Health Alerts
                      </h3>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">Grounded by World Intelligence</p>
                    </div>
                    <button onClick={refreshHealthUpdates} className="p-2 hover:bg-white/10 rounded-full transition-all">
                      {isLoadingNotifs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-yellow-400" />}
                    </button>
                  </div>
                  
                  <div className="max-h-[32rem] overflow-y-auto custom-scrollbar">
                    {isLoadingNotifs && notifications.length === 0 ? (
                      <div className="p-16 text-center flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        <p className="text-sm font-bold text-slate-400 animate-pulse">Scanning Global Neural Feeds...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {notifications.map((notif, i) => (
                          <div key={i} className="p-6 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{notif.timestamp}</span>
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-zinc-100 text-[15px] leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                              {notif.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-3 mb-4 leading-relaxed">
                              {notif.summary}
                            </p>
                            <a 
                              href={notif.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                              Explore Grounding <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-16 text-center text-slate-400 dark:text-zinc-600">
                        <Globe className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-bold">World Neural Sync is Optimal</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>
              
              <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{userProfile.name}</span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.15em]">Lvl 4 Architect</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-0.5 overflow-hidden ring-0 group-hover:ring-2 ring-indigo-500/20 transition-all">
                  <img src="https://picsum.photos/seed/aura-user/80/80" alt="Profile" className="w-full h-full object-cover rounded-[0.8rem]" />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-zinc-950 transition-colors duration-500 custom-scrollbar">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
