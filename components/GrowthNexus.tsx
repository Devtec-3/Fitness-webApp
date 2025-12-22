
import React, { useState } from 'react';
import { Search, Sprout, Play, Globe, ExternalLink, Loader2, Leaf, Sun, Droplets, BookOpen } from 'lucide-react';
import { getBotanicalAdvice } from '../services/geminiService';

const GrowthNexus: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const data = await getBotanicalAdvice(query);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-emerald-900 tracking-tight flex items-center gap-4">
          Botanical Nexus
          <Sprout className="w-10 h-10 text-emerald-600" />
        </h1>
        <p className="text-emerald-700/70 font-medium italic">
          Organic growth intelligence for a chemical-free existence.
        </p>
      </header>

      {/* Search Interface */}
      <section className="bg-white p-10 rounded-[3rem] border border-emerald-100 shadow-2xl shadow-emerald-900/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Leaf className="w-32 h-32 text-emerald-900" />
        </div>
        
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800">What do you wish to cultivate?</h2>
          <p className="text-slate-500 text-sm">Ask about any fruit, vegetable, or herb to learn organic planting steps and source the best nutrients.</p>
          
          <div className="relative group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., How to grow organic avocados from seed?"
              className="w-full pl-8 pr-20 py-6 bg-emerald-50 rounded-[2.5rem] border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none text-emerald-900 font-bold transition-all shadow-inner"
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="absolute right-3 top-3 p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </section>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-500">
          {/* Main Advice */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl prose prose-emerald max-w-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 m-0">Cultivation Guide</h3>
              </div>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                {result.text}
              </div>
            </section>
          </div>

          {/* Sources and Videos */}
          <aside className="space-y-6">
            <section className="bg-emerald-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
               <Play className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <Globe className="w-5 h-5 text-emerald-400" />
                 Source Grounding
               </h3>
               <div className="space-y-4">
                 {result.sources.length > 0 ? result.sources.map((src, i) => {
                   const uri = src.web?.uri || src.maps?.uri;
                   const title = src.web?.title || src.maps?.title || "Botanical Resource";
                   if (!uri) return null;
                   return (
                     <a 
                       key={i}
                       href={uri}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="block group p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all"
                     >
                       <div className="text-[10px] font-black uppercase text-emerald-300 mb-1 tracking-widest">Resource {i+1}</div>
                       <div className="font-bold text-sm leading-tight group-hover:text-emerald-200">{title}</div>
                       <div className="mt-2 flex items-center gap-2 text-[10px] text-white/50">
                         <ExternalLink className="w-3 h-3" />
                         <span>Visit Source</span>
                       </div>
                     </a>
                   );
                 }) : (
                   <p className="text-xs text-emerald-300 italic">No external grounding links found for this specific query.</p>
                 )}
               </div>
            </section>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                Optimal Flow
              </h3>
              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl">
                <Droplets className="w-6 h-6 text-blue-500" />
                <div className="text-xs font-medium text-slate-600">
                  Most organic crops thrive when watered before sunrise to prevent evaporation and fungal growth.
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default GrowthNexus;
