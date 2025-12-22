
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Brain, Compass, HelpCircle, Loader2, Globe, MapPin, ExternalLink } from 'lucide-react';
import { getAuraIntelligence } from '../services/geminiService';
import { Task, ChatMessage, GroundingChunk } from '../types';

interface AICoachProps {
  tasks: Task[];
  energy: number;
}

const AICoach: React.FC<AICoachProps> = ({ tasks, energy }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Aura is online. I have access to global intelligence and local maps. How shall we architect your life today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    let location = undefined;
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => 
        navigator.geolocation.getCurrentPosition(res, rej)
      );
      location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch (e) {
      console.log("Location access denied or unavailable.");
    }

    try {
      const result = await getAuraIntelligence(tasks, input, location);
      setMessages(prev => [...prev, { role: 'model', text: result.text, sources: result.sources }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "The architectural link is unstable. Retrying synchronization..." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-8 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl tracking-tight">Aura Intelligence</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="text-[10px] uppercase font-bold text-indigo-100 tracking-widest opacity-80">Global Link Active</span>
              </div>
            </div>
          </div>
          <Globe className="w-6 h-6 text-indigo-200 animate-spin-slow" />
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] space-y-3`}>
              <div className={`px-6 py-4 rounded-[2rem] ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-200' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
              }`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
              
              {/* Sources Rendering */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2">
                  {msg.sources.map((src, idx) => {
                    const uri = src.web?.uri || src.maps?.uri;
                    const title = src.web?.title || src.maps?.title || "Source";
                    const isMap = !!src.maps;
                    if (!uri) return null;
                    return (
                      <a 
                        key={idx} 
                        href={uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-full text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-all"
                      >
                        {isMap ? <MapPin className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        <span className="truncate max-w-[150px]">{title}</span>
                        <ExternalLink className="w-2 h-2 opacity-50" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-6 py-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              <span className="text-sm text-slate-400 font-medium italic">Scanning global trends...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your routine, local spots, or global trends..."
            className="w-full pl-8 pr-16 py-5 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-indigo-500/20 focus:bg-white outline-none text-slate-700 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-3 p-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 hover:scale-105 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
          Secured by Aura Neural Grounding
        </p>
      </div>
    </div>
  );
};

export default AICoach;
