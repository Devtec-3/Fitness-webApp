
import React from 'react';
import { LayoutDashboard, Calendar, BarChart2, Settings, User, Sparkles, HeartPulse, Sprout, Dumbbell } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'routine', icon: Calendar, label: 'Blueprint' },
    { id: 'kinetic', icon: Dumbbell, label: 'Kinetic Forge' },
    { id: 'health', icon: HeartPulse, label: 'Health Nexus' },
    { id: 'botany', icon: Sprout, label: 'Botanical' },
    { id: 'ai', icon: Sparkles, label: 'Aura AI' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col h-full transition-colors duration-500">
      <div className="p-8 border-b border-slate-100 dark:border-zinc-900">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black text-2xl tracking-tighter">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <span>AURA</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-zinc-600 mt-2 uppercase tracking-[0.25em] font-black">Architect Suite</p>
      </div>
      
      <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                : 'text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110 opacity-70'}`} />
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-5 border-t border-slate-100 dark:border-zinc-900">
        <button className="w-full flex items-center gap-4 px-5 py-4 text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100 rounded-2xl transition-all">
          <Settings className="w-5 h-5 opacity-70" />
          <span className="font-bold text-sm">Preferences</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
