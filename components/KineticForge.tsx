
import React, { useState, useEffect, useRef } from 'react';
/* Added missing Footprints and Moon icons to the lucide-react import */
import { 
  Play, Pause, RotateCcw, Dumbbell, Youtube, CheckCircle2, Zap, 
  Video, Activity, Info, Plus, Minus, Trophy, ListChecks, 
  History, Trash2, Calendar, ShieldCheck, Target, 
  ChevronDown, ChevronUp, BarChart3, BookOpen, XCircle, AlertCircle,
  Heart, Smartphone, RefreshCw, Link2, Settings, ListOrdered, ArrowRight, 
  PlayCircle, Layers, CloudSync, Share2, Info as InfoIcon,
  Footprints, Moon
} from 'lucide-react';
import { SyncedMetrics } from '../types';

type IntensityLevel = 'Low' | 'Medium' | 'High';
type SyncStatus = 'Disconnected' | 'Connecting' | 'Connected';

interface IntensityProfile {
  duration: string;
  sets: string;
  reps: string;
  insight: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  formProtocol: string[];
  profiles: Record<IntensityLevel, IntensityProfile>;
  type?: 'Base' | 'Regression' | 'Progression' | 'Alternative';
  modifications?: Exercise[];
}

interface WorkoutSession {
  id: string;
  exerciseName: string;
  date: string;
  totalSets: number;
  totalReps: number;
  durationPerSet: string;
  intensity: string;
  status: 'Completed' | 'Skipped';
  synced: boolean;
  avgHeartRate?: number;
  metabolicScore?: number;
  ecosystemId?: 'healthkit' | 'googlefit';
}

const KineticForge: React.FC = () => {
  const bodyweightExercises: Exercise[] = [
    // --- PUSH PATTERNS ---
    { 
      id: 'ex-1',
      name: "Architectural Pushups", 
      description: "A fundamental upper-body structural integrity protocol focusing on horizontal pressing power.",
      videoUrl: "https://youtube.com/results?search_query=perfect+pushups+tutorial",
      formProtocol: [
        "Maintain a hollow body position with posterior pelvic tilt to protect the spine.",
        "Elbows should track at a 45-degree angle to the torso to minimize shoulder stress.",
        "Full protraction of the scapula at the apex to engage the serratus anterior."
      ],
      profiles: {
        Low: { duration: "30s", sets: "2", reps: "8-12", insight: "Focus on scapular control and isometric tension at the bottom." },
        Medium: { duration: "45s", sets: "3", reps: "15-20", insight: "Standard hypertrophy protocol with controlled 2-sec eccentrics." },
        High: { duration: "60s", sets: "5", reps: "25-30", insight: "Explosive concentric phase for maximum fast-twitch recruitment." }
      },
      modifications: [
        {
          id: 'ex-1-reg',
          name: "Incline Structural Pushups",
          type: 'Regression',
          description: "Reduced vertical load via elevated hand placement. Ideal for neural adaptation and high-volume endurance.",
          videoUrl: "https://youtube.com/results?search_query=incline+pushups+tutorial",
          formProtocol: ["Hands on a bench or elevated surface.", "Maintain the same rigid core as standard pushups.", "Lower chest all the way to the edge of the surface."],
          profiles: {
            Low: { duration: "30s", sets: "2", reps: "12-15", insight: "Emphasis on rhythmic breathing and volume accumulation." },
            Medium: { duration: "45s", sets: "3", reps: "20-25", insight: "Build endurance without overwhelming shoulder joints." },
            High: { duration: "60s", sets: "4", reps: "30+", insight: "High-metabolic conditioning block." }
          }
        },
        {
          id: 'ex-1-prog',
          name: "Plyometric Blast Pushups",
          type: 'Progression',
          description: "High-velocity explosive variation requiring maximum peak power and reactive strength.",
          videoUrl: "https://youtube.com/results?search_query=plyometric+pushups+tutorial",
          formProtocol: ["Explode off the floor with enough force for hands to leave the ground.", "Land with 'soft' elbows to absorb the kinetic energy.", "Reset instantly for the next rep to maintain neural drive."],
          profiles: {
            Low: { duration: "20s", sets: "3", reps: "5-8", insight: "Focus on maximum vertical height per rep." },
            Medium: { duration: "30s", sets: "4", reps: "10-12", insight: "Sustain power output across the entire set." },
            High: { duration: "45s", sets: "5", reps: "15+", insight: "Extreme metabolic and power endurance challenge." }
          }
        }
      ]
    },
    { 
      id: 'ex-2',
      name: "Neural Squats", 
      description: "Lower-limb power synthesis and pelvic stability training for athletic base development.",
      videoUrl: "https://youtube.com/results?search_query=air+squats+tutorial",
      formProtocol: [
        "Drive weight through the mid-foot/heels while maintaining three points of contact.",
        "Maintain an upright thoracic spine to prevent lumbar rounding under load.",
        "Initiate with a slight hip hinge before knee flexion to engage the posterior chain."
      ],
      profiles: {
        Low: { duration: "45s", sets: "3", reps: "15-20", insight: "Deep range of motion focus to optimize joint lubrication." },
        Medium: { duration: "60s", sets: "4", reps: "25-30", insight: "Metabolic conditioning pace; maintain rhythmic breathing." },
        High: { duration: "90s", sets: "5", reps: "40-50", insight: "High-volume structural load; embrace the metabolic burn." }
      },
      modifications: [
        {
          id: 'ex-2-prog',
          name: "Cossack Flow",
          type: 'Progression',
          description: "Lateral plane squatting that builds extreme adductor flexibility and hip mobility.",
          videoUrl: "https://youtube.com/results?search_query=cossack+squats+tutorial",
          formProtocol: ["Wide stance, squat to one side while keeping the other leg fully straight.", "Working heel must stay on the floor.", "Switch sides with a low transition."],
          profiles: {
            Low: { duration: "40s", sets: "2", reps: "5/side", insight: "Mobility and range of motion priority." },
            Medium: { duration: "60s", sets: "3", reps: "8/side", insight: "Controlled strength through the lateral range." },
            High: { duration: "90s", sets: "4", reps: "12/side", insight: "Explosive lateral drive out of the bottom." }
          }
        }
      ]
    }
  ];

  const [selectedExIndex, setSelectedExIndex] = useState(0);
  const [activeModId, setActiveModId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('Disconnected');
  const [linkedEcosystem, setLinkedEcosystem] = useState<'healthkit' | 'googlefit' | null>(null);
  const [syncedMetrics, setSyncedMetrics] = useState<SyncedMetrics>({
    steps: 7420,
    activeCalories: 450,
    sleepHours: 7.2,
    hrv: 64,
    rhr: 58,
    lastSync: 'Never'
  });

  const [exerciseIntensities, setExerciseIntensities] = useState<Record<string, IntensityLevel>>(() => {
    const initial: Record<string, IntensityLevel> = {};
    bodyweightExercises.forEach(ex => {
      initial[ex.id] = 'Medium';
      ex.modifications?.forEach(mod => { initial[mod.id] = 'Medium'; });
    });
    return initial;
  });

  const [expandedExerciseIds, setExpandedExerciseIds] = useState<Set<string>>(new Set());
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeSet, setActiveSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(0);
  const [setHistory, setSetHistory] = useState<number[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [workoutArchives, setWorkoutArchives] = useState<WorkoutSession[]>([]);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aura-kinetic-archives');
    const savedLink = localStorage.getItem('aura-health-link');
    if (saved) setWorkoutArchives(JSON.parse(saved));
    if (savedLink) {
      setSyncStatus('Connected');
      setLinkedEcosystem(savedLink as any);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aura-kinetic-archives', JSON.stringify(workoutArchives));
  }, [workoutArchives]);

  const activeBaseEx = bodyweightExercises[selectedExIndex];
  const currentEx = (activeModId && activeBaseEx.modifications?.find(m => m.id === activeModId)) 
                    ? activeBaseEx.modifications.find(m => m.id === activeModId)! 
                    : activeBaseEx;

  const currentIntensity = exerciseIntensities[currentEx.id] || 'Medium';
  const currentProfile = currentEx.profiles[currentIntensity];
  const maxDuration = parseInt(currentProfile.duration.replace('s', '')) || 60;
  const maxSets = parseInt(currentProfile.sets) || 4;

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeLeft === 0) setIsTimerRunning(false);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    resetExercise();
  }, [currentEx.id, currentIntensity]);

  const resetExercise = () => {
    setActiveSet(1);
    setCurrentReps(0);
    setSetHistory([]);
    setTimeLeft(maxDuration);
    setSessionFinished(false);
    setIsTimerRunning(false);
  };

  /* Added toggleTimer to handle workout playback */
  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  /* Added resetTimer to allow restarting the current set's clock */
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(maxDuration);
  };

  const handleConnect = (ecosystem: 'healthkit' | 'googlefit') => {
    setSyncStatus('Connecting');
    setTimeout(() => {
      setSyncStatus('Connected');
      setLinkedEcosystem(ecosystem);
      localStorage.setItem('aura-health-link', ecosystem);
      setSyncedMetrics({
        ...syncedMetrics,
        lastSync: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 2000);
  };

  const disconnectSync = () => {
    setSyncStatus('Disconnected');
    setLinkedEcosystem(null);
    localStorage.removeItem('aura-health-link');
  };

  const saveWorkoutToArchives = (finalHistory: number[], status: 'Completed' | 'Skipped') => {
    const totalReps = finalHistory.reduce((acc, curr) => acc + curr, 0);
    const score = Math.floor(totalReps * (currentIntensity === 'High' ? 1.5 : 1.1) * 10);

    const newSession: WorkoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseName: currentEx.name,
      date: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      totalSets: finalHistory.length,
      totalReps,
      durationPerSet: currentProfile.duration,
      intensity: currentIntensity,
      status,
      synced: syncStatus === 'Connected',
      metabolicScore: score,
      ecosystemId: linkedEcosystem || undefined
    };
    setWorkoutArchives(prev => [newSession, ...prev]);
  };

  const handleCompleteSet = () => {
    const newHistory = [...setHistory, currentReps];
    setSetHistory(newHistory);
    if (activeSet < maxSets) {
      setActiveSet(prev => prev + 1);
      setCurrentReps(0);
      setTimeLeft(maxDuration);
      setIsTimerRunning(false);
    } else {
      saveWorkoutToArchives(newHistory, 'Completed');
      setSessionFinished(true);
      setIsTimerRunning(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            Kinetic Forge
            <Activity className="w-10 h-10 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 font-medium italic mt-2">
            Automated biometric sync for optimized structural output.
          </p>
        </div>

        {/* Sync Status Pill */}
        <div className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-500 ${
          syncStatus === 'Connected' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
            : 'bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400'
        }`}>
          {syncStatus === 'Connected' ? (
            <CloudSync className="w-5 h-5 animate-pulse" />
          ) : (
            <Smartphone className="w-5 h-5" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {syncStatus === 'Connected' ? `Synced with ${linkedEcosystem === 'healthkit' ? 'HealthKit' : 'Google Fit'}` : 'Health Sync Offline'}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sync Management & Holistic Data */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Health Ecosystem Management */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Link2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight">Ecosystem Link</h2>
                <p className="text-[9px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Auto-Sync Protocol</p>
              </div>
            </div>

            {syncStatus === 'Disconnected' ? (
              <div className="space-y-3">
                <button 
                  onClick={() => handleConnect('healthkit')}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all border border-transparent hover:border-indigo-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center shadow-sm">
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-bold text-sm text-slate-700 dark:text-zinc-300">Apple HealthKit</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                </button>
                <button 
                   onClick={() => handleConnect('googlefit')}
                   className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all border border-transparent hover:border-emerald-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center shadow-sm">
                      <Zap className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="font-bold text-sm text-slate-700 dark:text-zinc-300">Google Fit</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in zoom-in duration-300">
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Connection</span>
                     <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin-slow" />
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-lg">
                       {linkedEcosystem === 'healthkit' ? <Heart className="w-6 h-6 text-red-500" /> : <Zap className="w-6 h-6 text-emerald-500" />}
                     </div>
                     <div>
                       <div className="font-black text-slate-900 dark:text-white capitalize">{linkedEcosystem} Link</div>
                       <div className="text-[10px] text-slate-400 font-bold uppercase">Last Sync: {syncedMetrics.lastSync}</div>
                     </div>
                   </div>
                </div>
                <button 
                  onClick={disconnectSync}
                  className="w-full py-3 text-slate-400 dark:text-zinc-600 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  Terminate Ecosystem Link
                </button>
              </div>
            )}
          </section>

          {/* Holistic Biometric Snapshot */}
          <section className="bg-slate-950 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 p-8 opacity-5">
               <Activity className="w-24 h-24" />
             </div>
             <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
               <BarChart3 className="w-4 h-4" />
               Neural Load Analysis
             </h2>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-white/5 p-5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">HRV Potential</div>
                  <div className="text-2xl font-black text-emerald-400 tabular-nums">{syncedMetrics.hrv}<span className="text-[10px] ml-1">ms</span></div>
               </div>
               <div className="bg-white/5 p-5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Resting Heart</div>
                  <div className="text-2xl font-black text-indigo-400 tabular-nums">{syncedMetrics.rhr}<span className="text-[10px] ml-1">BPM</span></div>
               </div>
             </div>

             <div className="space-y-5">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Footprints className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-300">Daily Steps</span>
                  </div>
                  <span className="text-xs font-black tabular-nums">{syncedMetrics.steps.toLocaleString()} / 10,000</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${(syncedMetrics.steps / 10000) * 100}%` }}></div>
                </div>

                <div className="flex items-center justify-between mt-6 group">
                  <div className="flex items-center gap-3">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-zinc-300">Neural Recovery</span>
                  </div>
                  <span className="text-xs font-black tabular-nums">{syncedMetrics.sleepHours}h Depth</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${(syncedMetrics.sleepHours / 8) * 100}%` }}></div>
                </div>
             </div>
          </section>

          {/* Active Session Portal (Integrated with Sync) */}
          <section className="bg-zinc-950 dark:bg-black p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-start border border-white/5 h-fit min-h-[550px]">
            {sessionFinished ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full flex items-center justify-center border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <Trophy className="w-12 h-12 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Synthesis Optimal</h2>
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 inline-block">
                    <div className="text-[10px] font-black uppercase text-indigo-400 mb-1">Biological Load Score</div>
                    <div className="text-4xl font-black">+{workoutArchives[0]?.metabolicScore} <span className="text-sm text-zinc-500">KINETIC</span></div>
                  </div>
                </div>
                
                {syncStatus === 'Connected' && (
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                    <CloudSync className="w-4 h-4" />
                    Automatically Synced to {linkedEcosystem === 'healthkit' ? 'HealthKit' : 'Google Fit'}
                  </div>
                )}

                <button onClick={resetExercise} className="w-full py-5 bg-white text-black font-black rounded-3xl hover:bg-zinc-200 transition-all text-[10px] uppercase tracking-widest shadow-xl">Restart Protocol</button>
              </div>
            ) : (
              <>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8 mt-4 flex items-center gap-2">
                  <Smartphone className="w-3 h-3" />
                  Set {activeSet} Pulse
                </div>
                
                <div className="relative mb-8 group">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-[40px] rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
                  <svg className="w-48 h-48 transform -rotate-90 relative z-10">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={552} 
                      strokeDashoffset={552 - (552 * timeLeft) / maxDuration} className="text-indigo-500 transition-all duration-1000 ease-linear" strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-6xl font-black tracking-tighter tabular-nums">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="w-full bg-white/5 p-8 rounded-[2.5rem] border border-white/5 mb-8 text-center">
                  <div className="flex items-center justify-between gap-6 px-4">
                      <button onClick={() => setCurrentReps(Math.max(0, currentReps - 1))} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 active:scale-90 transition-all"><Minus className="w-6 h-6" /></button>
                      <div className="flex flex-col items-center">
                        <span className="text-6xl font-black text-white tabular-nums">{currentReps}</span>
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Target: {currentProfile.reps}</span>
                      </div>
                      <button onClick={() => setCurrentReps(currentReps + 1)} className="p-4 bg-white/10 rounded-2xl hover:bg-indigo-500 active:scale-90 transition-all"><Plus className="w-6 h-6" /></button>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-4 relative z-10">
                  <div className="flex gap-4">
                    <button onClick={toggleTimer} className={`flex-1 py-6 rounded-3xl transition-all font-black text-xs uppercase tracking-widest ${isTimerRunning ? 'bg-zinc-800 text-white' : 'bg-white text-black shadow-xl'}`}>
                      {isTimerRunning ? 'Pause Pulse' : 'Initiate Phase'}
                    </button>
                    <button onClick={resetTimer} className="p-6 bg-zinc-900 text-zinc-500 rounded-3xl hover:text-white border border-white/5"><RotateCcw className="w-6 h-6" /></button>
                  </div>
                  <button onClick={handleCompleteSet} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/20 active:scale-[0.98]">
                    {activeSet < maxSets ? 'Complete Set' : 'Log Synthesis'}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Right Column: Bio-Movement Library & Archives */}
        <section className="lg:col-span-8 space-y-12">
          
          {/* Movement Patterns with modifications */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
              <div>
                <h3 className="font-black text-slate-800 dark:text-zinc-100 text-2xl tracking-tight mb-1">Biokinetic Blueprint</h3>
                <p className="text-xs font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Select structural pattern for sync</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl">
                 <button className="px-6 py-2 bg-white dark:bg-zinc-700 shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest">Ritual Feed</button>
                 <button className="px-6 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-50 cursor-not-allowed">Load Map</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 relative z-10">
              {bodyweightExercises.map((ex, i) => {
                const isSelected = selectedExIndex === i;
                const isExpanded = expandedExerciseIds.has(ex.id);
                const level = exerciseIntensities[ex.id] || 'Medium';

                return (
                  <div key={ex.id} 
                    onClick={() => { setSelectedExIndex(i); setActiveModId(null); }}
                    className={`group relative p-10 rounded-[3rem] border-2 transition-all cursor-pointer hover:shadow-2xl ${
                      isSelected ? 'border-indigo-500 bg-indigo-50/5 shadow-indigo-500/5' : 'bg-slate-50 dark:bg-zinc-800/40 border-transparent hover:border-slate-200 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-2xl transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-zinc-800 text-indigo-500 shadow-sm'}`}>
                            <Zap className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 dark:text-zinc-100 text-2xl tracking-tight leading-none mb-1">{ex.name}</h4>
                            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-zinc-500">{ex.profiles[level].duration} Phase • {ex.profiles[level].sets} Vol</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">{ex.description}</p>

                        {/* Modification Selection */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 dark:text-zinc-600 tracking-widest">
                            <Layers className="w-3 h-3" />
                            Kinetic Variations
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedExIndex(i); setActiveModId(null); }}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${!activeModId && isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-700 text-slate-500 border-slate-200 dark:border-zinc-600'}`}
                            >
                              Base Protocol
                            </button>
                            {ex.modifications?.map(mod => (
                              <button 
                                key={mod.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedExIndex(i); setActiveModId(mod.id); }}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${activeModId === mod.id && isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-700 text-slate-500 border-slate-200 dark:border-zinc-600'}`}
                              >
                                {mod.name}
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${mod.type === 'Regression' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400'}`}>
                                  {mod.type === 'Regression' ? 'REG' : 'PROG'}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-48 space-y-4">
                        <div className="bg-white dark:bg-zinc-800/60 p-5 rounded-2xl text-center border border-slate-100 dark:border-zinc-700 shadow-sm">
                            <div className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Metabolic Target</div>
                            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{currentProfile.reps} <span className="text-[10px] text-zinc-500">R</span></div>
                        </div>
                        <a href={currentEx.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-[10px] uppercase bg-slate-900 dark:bg-black text-white shadow-xl hover:bg-slate-800 transition-colors">
                          <Youtube className="w-4 h-4 text-red-500" />
                          Protocol Clip
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sync-Aware Archives */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-zinc-100 text-xl tracking-tight">Kinetic Archives</h3>
                  <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Ecosystem-Verified Logs</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
              {workoutArchives.length === 0 ? (
                <div className="py-20 text-center opacity-40">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">No synthesis data found</p>
                </div>
              ) : (
                workoutArchives.map((log) => (
                  <div key={log.id} className="group bg-slate-50 dark:bg-zinc-800/40 p-6 rounded-[2rem] border border-slate-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-indigo-200 dark:hover:border-indigo-900/40">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-indigo-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-black text-slate-900 dark:text-zinc-100 leading-tight">{log.exerciseName}</h4>
                           {log.synced && (
                             <div className={`flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                               log.ecosystemId === 'healthkit' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                             }`}>
                               <ShieldCheck className="w-2.5 h-2.5" />
                               {log.ecosystemId === 'healthkit' ? 'HealthKit Verified' : 'Fit Verified'}
                             </div>
                           )}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{log.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="text-center">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact</div>
                          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">+{log.metabolicScore}</div>
                       </div>
                       <div className="text-center">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume</div>
                          <div className="text-xl font-black text-slate-900 dark:text-zinc-100 tabular-nums">{log.totalReps} <span className="text-[10px] text-zinc-500 uppercase">R</span></div>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Internal components for clean icons
const ChevronRight = ({ className }: { className: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const Footprints = ({ className }: { className: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16v-2.38C4 11.5 5.88 9 8 9a4 4 0 0 1 4 4v1a4 4 0 0 0 4 4 4 4 0 0 0 4-4v-1.1c0-2.2-1.9-4.9-4-4.9-2.2 0-4 1.8-4 4v1.1c0 2.2 1.8 4 4 4a4 4 0 0 0 4-4v-2.1c0-2.2-1.8-4-4-4-2.1 0-3.9 2.4-4 4.4V14.5c.1 2 1.9 4.5 4 4.5 2.2 0 4-1.8 4-4V13" />
  </svg>
);

export default KineticForge;
