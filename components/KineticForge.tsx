
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Dumbbell, Youtube, CheckCircle2, Zap, 
  Video, Activity, Info, Plus, Minus, Trophy, ListChecks, 
  History, Trash2, Calendar, ShieldCheck, Target, 
  ChevronDown, ChevronUp, BarChart3, BookOpen, XCircle, AlertCircle,
  Heart, Smartphone, RefreshCw, Link2, Settings, ListOrdered, ArrowRight, PlayCircle,
  Footprints, Flame, Moon, BarChart, Music, Volume2, VolumeX, Waves, Layers
} from 'lucide-react';

type IntensityLevel = 'Low' | 'Medium' | 'High';
type SyncStatus = 'Disconnected' | 'Connecting' | 'Connected';

interface IntensityProfile {
  duration: string;
  sets: string;
  reps: string;
  insight: string;
}

interface AmbientTrack {
  id: string;
  name: string;
  url: string;
  category: 'Nature' | 'Focus' | 'Pulse';
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
}

const KineticForge: React.FC = () => {
  const ambientTracks: AmbientTrack[] = [
    { id: 't1', name: 'Alpha Wave Focus', category: 'Focus', url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_730e70a25f.mp3' },
    { id: 't2', name: 'Amazonian Rain', category: 'Nature', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 't3', name: 'Deep Sea Resonance', category: 'Nature', url: 'https://cdn.pixabay.com/audio/2021/08/09/audio_8231327170.mp3' },
    { id: 't4', name: 'Kinetic Pulse', category: 'Pulse', url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3' },
  ];

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
      id: 'ex-1b',
      name: "Diamond Geometry", 
      description: "A triceps-dominant pressing variation requiring high levels of shoulder stability and elbow integrity.",
      videoUrl: "https://youtube.com/results?search_query=diamond+pushups+tutorial",
      formProtocol: [
        "Form a diamond shape with thumbs and forefingers directly under the sternum.",
        "Keep elbows tucked tightly to the ribs during the eccentric phase.",
        "Avoid internal shoulder rotation at the bottom of the movement."
      ],
      profiles: {
        Low: { duration: "25s", sets: "2", reps: "6-10", insight: "Prioritize wrist and elbow alignment over rep count." },
        Medium: { duration: "45s", sets: "4", reps: "12-15", insight: "Focus on terminal elbow extension for peak triceps contraction." },
        High: { duration: "60s", sets: "5", reps: "18-22", insight: "Sustain continuous tension without locking out at the top." }
      },
      modifications: [
        {
          id: 'ex-1b-reg',
          name: "Narrow Grip Pushups",
          type: 'Regression',
          description: "Wider hand placement than diamond but still narrow. Reduces wrist torque while maintaining triceps focus.",
          videoUrl: "https://youtube.com/results?search_query=close+grip+pushups+tutorial",
          formProtocol: ["Hands slightly narrower than shoulder width.", "Elbows brush the ribcage.", "Full lockout at the top."],
          profiles: {
            Low: { duration: "30s", sets: "3", reps: "10-12", insight: "Joint health focus." },
            Medium: { duration: "45s", sets: "3", reps: "15-18", insight: "Standard hypertrophy." },
            High: { duration: "60s", sets: "4", reps: "20+", insight: "High-tension duration." }
          }
        }
      ]
    },
    // --- SQUAT PATTERNS ---
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
    },
    { 
      id: 'ex-3',
      name: "Kinetic Lunges", 
      description: "Unilateral stability and functional gait optimization for balanced kinetic output.",
      videoUrl: "https://youtube.com/results?search_query=bodyweight+lunges+tutorial",
      formProtocol: [
        "Ensure the front knee tracks directly over the second toe throughout the movement.",
        "Maintain a vertical shin on the lead leg at the bottom of the movement.",
        "Keep the core braced to prevent lateral pelvic tilt and maintain center of mass."
      ],
      profiles: {
        Low: { duration: "35s", sets: "3", reps: "10/leg", insight: "Priority on lateral stability and knee-ankle alignment." },
        Medium: { duration: "50s", sets: "4", reps: "15/leg", insight: "Continuous movement flow; minimize rest between legs." },
        High: { duration: "75s", sets: "5", reps: "20/leg", insight: "Plyometric switch lunges; maximum power output per rep." }
      },
      modifications: [
        {
          id: 'ex-3-reg',
          name: "Static Split Squats",
          type: 'Regression',
          description: "Removes the dynamic step to focus purely on unilateral leg drive and balance.",
          videoUrl: "https://youtube.com/results?search_query=split+squat+tutorial",
          formProtocol: ["Maintain a staggered stance.", "Lower the back knee towards the ground without moving feet.", "Keep torso upright."],
          profiles: {
            Low: { duration: "30s", sets: "2", reps: "10/leg", insight: "Perfect form and balance focus." },
            Medium: { duration: "45s", sets: "3", reps: "15/leg", insight: "Build base unilateral strength." },
            High: { duration: "60s", sets: "4", reps: "20/leg", insight: "High-volume tension hold." }
          }
        }
      ]
    }
  ];

  const [selectedExIndex, setSelectedExIndex] = useState(0);
  const [workoutQueue, setWorkoutQueue] = useState<string[]>([]);
  const [activeModId, setActiveModId] = useState<string | null>(null);
  const [exerciseIntensities, setExerciseIntensities] = useState<Record<string, IntensityLevel>>(() => {
    const initial: Record<string, IntensityLevel> = {};
    bodyweightExercises.forEach(ex => {
      initial[ex.id] = 'Medium';
      ex.modifications?.forEach(mod => { initial[mod.id] = 'Medium'; });
    });
    return initial;
  });

  const [expandedExerciseIds, setExpandedExerciseIds] = useState<Set<string>>(new Set());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('Disconnected');
  const [liveHeartRate, setLiveHeartRate] = useState(72);
  
  // Acoustic Engine state
  const [activeAmbientId, setActiveAmbientId] = useState<string | null>(null);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Holistic Stats
  const [holisticStats, setHolisticStats] = useState({
    steps: 8422,
    calories: 1840,
    sleep: 7.2,
    restingBPM: 64
  });

  // Active exercise determination
  const activeBaseEx = bodyweightExercises[selectedExIndex];
  
  // Check if current exercise has an active modification
  const currentEx = (activeModId && activeBaseEx.modifications?.find(m => m.id === activeModId)) 
                    ? activeBaseEx.modifications.find(m => m.id === activeModId)! 
                    : activeBaseEx;

  const currentIntensity = exerciseIntensities[currentEx.id] || 'Medium';
  const currentProfile = currentEx.profiles[currentIntensity];

  const parseDuration = (d: string) => parseInt(d.replace('s', '')) || 60;
  const maxDuration = parseDuration(currentProfile.duration);
  const maxSets = parseInt(currentProfile.sets) || 4;

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(maxDuration);
  const [activeSet, setActiveSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(0);
  const [setHistory, setSetHistory] = useState<number[]>([]);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [workoutArchives, setWorkoutArchives] = useState<WorkoutSession[]>([]);
  const [showProtocolInSession, setShowProtocolInSession] = useState(true);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aura-kinetic-archives');
    if (saved) {
      try {
        setWorkoutArchives(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aura-kinetic-archives', JSON.stringify(workoutArchives));
  }, [workoutArchives]);

  useEffect(() => {
    if (audioRef.current) {
      if (isAmbientPlaying && activeAmbientId) {
        audioRef.current.play().catch(e => console.error(e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAmbientPlaying, activeAmbientId]);

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

  // Fix: Implemented toggleAmbient to manage acoustic engine states.
  const toggleAmbient = (id: string) => {
    if (activeAmbientId === id) {
      setIsAmbientPlaying(!isAmbientPlaying);
    } else {
      setActiveAmbientId(id);
      setIsAmbientPlaying(true);
    }
  };

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => { setTimeLeft(maxDuration); setIsTimerRunning(false); };

  const saveWorkoutToArchives = (finalHistory: number[], status: 'Completed' | 'Skipped') => {
    const totalReps = finalHistory.reduce((acc, curr) => acc + curr, 0);
    const metabolicMultiplier = currentIntensity === 'High' ? 1.5 : currentIntensity === 'Medium' ? 1.1 : 0.8;
    const score = Math.floor(totalReps * metabolicMultiplier * (activeSet / maxSets) * 10);

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
      metabolicScore: score
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

  const resetExercise = () => {
    setActiveSet(1);
    setCurrentReps(0);
    setSetHistory([]);
    setTimeLeft(maxDuration);
    setSessionFinished(false);
    setIsTimerRunning(false);
  };

  const updateIntensity = (exId: string, level: IntensityLevel) => {
    setExerciseIntensities(prev => ({ ...prev, [exId]: level }));
  };

  const toggleExpand = (id: string) => {
    setExpandedExerciseIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <audio ref={audioRef} src={ambientTracks.find(t => t.id === activeAmbientId)?.url} loop />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-4">
            Kinetic Forge
            <Activity className="w-10 h-10 text-indigo-500 animate-pulse" />
          </h1>
          <p className="text-slate-500 dark:text-zinc-500 font-medium italic mt-2">
            Biological output optimization via bodyweight structural engineering.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-8">
           {/* Acoustic & Holistic Widgets combined for brevity in this iteration */}
           <section className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Music className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight">Focus Atmosphere</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {ambientTracks.map(track => (
                <button 
                  key={track.id} 
                  onClick={() => toggleAmbient(track.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    activeAmbientId === track.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-zinc-800 text-slate-500 border-transparent'
                  }`}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </section>

          {/* Active Session Hub */}
          <section className="bg-zinc-950 dark:bg-black p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-start border border-white/5 h-fit min-h-[600px]">
            {sessionFinished ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full flex items-center justify-center border border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <Trophy className="w-12 h-12 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2">Protocol Finalized</h2>
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 inline-block">
                    <div className="text-[10px] font-black uppercase text-indigo-400 mb-1">Metabolic Impact</div>
                    <div className="text-4xl font-black">+{workoutArchives[0]?.metabolicScore} <span className="text-sm text-zinc-500">SCORE</span></div>
                  </div>
                </div>
                <button onClick={resetExercise} className="w-full py-5 bg-white text-black font-black rounded-3xl hover:bg-zinc-200 transition-all text-[10px] uppercase tracking-widest">Restart Ritual</button>
              </div>
            ) : (
              <>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8 mt-4">
                  {currentEx.name} • Set {activeSet}
                </div>
                
                <div className="relative mb-8">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={552} 
                      strokeDashoffset={552 - (552 * timeLeft) / maxDuration} className="text-indigo-500 transition-all duration-1000 ease-linear" strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
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
                      {isTimerRunning ? 'Pause' : 'Resume Pulse'}
                    </button>
                    <button onClick={resetTimer} className="p-6 bg-zinc-900 text-zinc-500 rounded-3xl hover:text-white border border-white/5"><RotateCcw className="w-6 h-6" /></button>
                  </div>
                  <button onClick={handleCompleteSet} className="w-full py-6 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/20 active:scale-[0.98]">
                    {activeSet < maxSets ? 'Complete Set' : 'Finish Exercise'}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Right Column: Library & Modifications */}
        <section className="lg:col-span-8 space-y-12">
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h3 className="font-black text-slate-800 dark:text-zinc-100 text-2xl tracking-tight mb-1">Bio-Movement Library</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select movement pattern and engineer modifications</p>
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
                    className={`group relative p-10 rounded-[3rem] border-2 transition-all cursor-pointer ${
                      isSelected ? 'border-indigo-500 bg-indigo-50/10' : 'bg-slate-50 dark:bg-zinc-800/40 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-4 rounded-2xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-zinc-800 text-indigo-500 shadow-sm'}`}>
                            <Zap className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 dark:text-zinc-100 text-2xl tracking-tight leading-none mb-1">{ex.name}</h4>
                            <span className="text-[10px] font-black uppercase text-slate-400">{ex.profiles[level].duration} Block • {ex.profiles[level].sets} Sets</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium">{ex.description}</p>

                        {/* Modification Engine UI */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <Layers className="w-3 h-3" />
                            Bio-Modifications Available
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedExIndex(i); setActiveModId(null); }}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${!activeModId && isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-700 text-slate-500 border-slate-200 dark:border-zinc-600'}`}
                            >
                              Standard
                            </button>
                            {ex.modifications?.map(mod => (
                              <button 
                                key={mod.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedExIndex(i); setActiveModId(mod.id); }}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${activeModId === mod.id && isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-zinc-700 text-slate-500 border-slate-200 dark:border-zinc-600'}`}
                              >
                                {mod.name}
                                <span className={`px-1.5 py-0.5 rounded text-[8px] ${mod.type === 'Regression' ? 'bg-emerald-100 text-emerald-600' : mod.type === 'Progression' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {mod.type}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Dynamic Content based on Modification */}
                        <div className="p-6 bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-slate-100 dark:border-zinc-800/60 shadow-inner">
                           <div className="flex items-center gap-2 mb-3 text-indigo-500">
                             <ShieldCheck className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Current Protocol Detail</span>
                           </div>
                           <p className="text-xs text-slate-500 leading-relaxed italic mb-4">
                             {activeModId && isSelected ? ex.modifications?.find(m => m.id === activeModId)?.description : "Primary structural pattern for this movement class."}
                           </p>
                           <button 
                              onClick={(e) => { e.stopPropagation(); toggleExpand(ex.id); }}
                              className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                           >
                             View Biomechanical Form {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                           </button>

                           {isExpanded && (
                             <ul className="mt-4 space-y-2 animate-in slide-in-from-top-2">
                               {currentEx.formProtocol.map((p, idx) => (
                                 <li key={idx} className="text-xs text-slate-500 flex gap-2">
                                   <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                                   {p}
                                 </li>
                               ))}
                             </ul>
                           )}
                        </div>
                      </div>

                      <div className="lg:w-48 space-y-4">
                        <div className="bg-white dark:bg-zinc-800/60 p-5 rounded-2xl text-center border border-slate-100 dark:border-zinc-700 shadow-sm">
                            <div className="text-[9px] font-black uppercase text-slate-400 mb-1">Intensity</div>
                            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{currentProfile.reps}</div>
                            <div className="text-[8px] text-zinc-500 uppercase tracking-tighter">Target Reps</div>
                        </div>
                        <a href={currentEx.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-[10px] uppercase bg-slate-900 dark:bg-black text-white shadow-xl">
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
        </section>
      </div>
    </div>
  );
};

export default KineticForge;
