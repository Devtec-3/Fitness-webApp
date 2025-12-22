
import React, { useState, useEffect } from 'react';
import { Search, Flame, Zap, Salad, Dumbbell, Globe, ExternalLink, Loader2, ArrowRight, TrendingUp } from 'lucide-react';
import { calculateCalories, getLatestHealthNews } from '../services/geminiService';
import { CalorieData, HealthNews } from '../types';

const HealthCore: React.FC = () => {
  const [foodInput, setFoodInput] = useState('');
  const [calorieResult, setCalorieResult] = useState<CalorieData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [news, setNews] = useState<HealthNews[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoadingNews(true);
    try {
      const updates = await getLatestHealthNews();
      setNews(updates);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleCalorieCalc = async () => {
    if (!foodInput.trim()) return;
    setIsCalculating(true);
    try {
      const data = await calculateCalories(foodInput);
      setCalorieResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      <header className="flex flex-col gap-4">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Nexus</h1>
        <p className="text-slate-500 dark:text-zinc-500 font-medium max-w-lg">Biological optimization portal driven by real-time neural grounding and metabolic science.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Calorie Forge */}
          <section className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800 shadow-2xl space-y-8 group transition-all">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-3xl group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-zinc-100">Calorie Forge</h2>
                <p className="text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Neural Macro Analysis</p>
              </div>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCalorieCalc()}
                placeholder="What did your biology consume? (e.g., Avocado toast with 2 poached eggs)"
                className="w-full pl-8 pr-24 py-7 bg-slate-50 dark:bg-zinc-800/50 rounded-[2.5rem] border-none outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-800 dark:text-zinc-100 font-bold transition-all text-lg placeholder-slate-400 dark:placeholder-zinc-600"
              />
              <button 
                onClick={handleCalorieCalc}
                disabled={isCalculating}
                className="absolute right-3 top-3 p-5 bg-orange-600 dark:bg-orange-500 text-white rounded-[2rem] hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
              >
                {isCalculating ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
              </button>
            </div>

            {calorieResult && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-top-6 duration-500">
                {[
                  { label: 'Calories', val: calorieResult.calories, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/5' },
                  { label: 'Protein', val: `${calorieResult.protein}g`, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/5' },
                  { label: 'Carbs', val: `${calorieResult.carbs}g`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/5' },
                  { label: 'Fats', val: `${calorieResult.fat}g`, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/5' },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-6 rounded-[2.5rem] text-center border border-transparent hover:border-current/10 transition-all`}>
                    <div className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500 tracking-widest mb-2">{stat.label}</div>
                    <div className={`text-3xl font-black ${stat.color}`}>{stat.val}</div>
                  </div>
                ))}
                <div className="col-span-full p-8 bg-slate-900 dark:bg-black rounded-[2.5rem] text-sm md:text-base font-bold text-indigo-200 italic shadow-2xl">
                   " {calorieResult.advice} "
                </div>
              </div>
            )}
          </section>

          {/* Education - The Dojo */}
          <section className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl">
                  <Dumbbell className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-zinc-100">The Dojo</h2>
                  <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Master Your Physical Architecture</p>
                </div>
              </div>
              <button className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline px-6 py-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl">All Intelligence</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Hypertrophy Foundations', desc: 'The architectural science of muscle synthesis and metabolic stress.', img: 'https://picsum.photos/seed/muscle/800/500', tag: 'Anatomy' },
                { title: 'Metabolic Nutrition', desc: 'Programming your nutrient intake for peak hormonal response.', img: 'https://picsum.photos/seed/food/800/500', tag: 'Biochemistry' },
              ].map((guide, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative h-60 rounded-[3rem] overflow-hidden mb-6 shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                    <img src={guide.img} alt={guide.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                      {guide.tag}
                    </div>
                  </div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">{guide.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 line-clamp-2 mt-2 leading-relaxed">{guide.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Live Health Updates Sidebar */}
        <aside className="space-y-8">
          <div className="bg-zinc-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
            <Globe className="absolute -bottom-10 -right-10 w-48 h-48 opacity-5" />
            <h2 className="text-xl font-black mb-10 flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              Neural Pulse
            </h2>
            
            <div className="space-y-8">
              {isLoadingNews ? (
                <div className="flex flex-col items-center py-12 gap-4 opacity-50">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Scanning World Nodes</span>
                </div>
              ) : (
                news.map((item, i) => (
                  <div key={i} className="group space-y-3 border-b border-white/5 pb-8 last:border-0 last:pb-0">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.timestamp}</div>
                    <h3 className="font-bold leading-tight text-lg group-hover:text-indigo-300 transition-colors tracking-tight">{item.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 font-medium leading-relaxed">{item.summary}</p>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-yellow-400 hover:text-white transition-all pt-2"
                    >
                      Grounding Source <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-xl space-y-6">
             <h3 className="font-black text-slate-900 dark:text-zinc-100 text-sm flex items-center gap-2 uppercase tracking-widest">
               <TrendingUp className="w-4 h-4 text-emerald-500" />
               Aura Insights
             </h3>
             <p className="text-sm text-slate-600 dark:text-zinc-500 italic leading-relaxed font-medium">
               "Recent global metadata indicates that a 20g protein bolus consumed within 45 minutes of ritual completion maximizes nitrogen balance optimization."
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HealthCore;
