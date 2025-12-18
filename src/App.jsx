import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Dumbbell, TrendingUp, Activity, Trash2, CheckCircle, Plus, Home, PlayCircle, Trophy, Code, Timer, Sun, Moon } from 'lucide-react';
import MilesSticker from './assets/miles_sticker.gif';
import GwenSticker from './assets/gwen_sticker.gif';
import LoadingSticker from './assets/loading_sticker.gif';
import LoadRoutineSticker from './assets/load_btn_sticker.gif';

// Hooks
import { useWorkoutData, WORKOUT_PLANS } from './hooks/useWorkoutData';
import { useRestTimer } from './hooks/useRestTimer';
import { useTheme } from './context/ThemeContext';

// Helpers
import { calculateWorkoutStats } from './utils/helpers';

// Components
import { BackgroundController } from './components/layout/BackgroundController';
import { Button } from './components/ui/Button';
import { DeleteConfirmationModal } from './components/ui/DeleteConfirmationModal';
import { CalendarModal } from './components/ui/CalendarModal';
import { AboutModal } from './components/ui/AboutModal';
import { ExerciseCard } from './components/workout/ExerciseCard';
import { RoutineBuilder } from './components/workout/RoutineBuilder';
import { StatsView } from './components/stats/StatsView';
import { AdherenceBar } from './components/workout/AdherenceBar';
import { CompletionModal } from './components/ui/CompletionModal';
import { WorkoutTimer } from './components/workout/WorkoutTimer';
import { RestTimer } from './components/workout/RestTimer';
import { HeaderRest } from './components/workout/HeaderRest';

import Snowfall from 'react-snowfall';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'stats'
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loadingGif, setLoadingGif] = useState(null); // 'miles' | 'gwen' | null

  // Core Logic Hook
  const {
    workoutData, savedPlans, activePlanId, setActivePlanId,
    currentLog, isLocked, pendingSuperset,
    initializeDailyLog, updateSet, updateCardioMode, addSet, removeSet,
    addExercise, removeExercise, updateExerciseName, handleLinkAction,
    saveCustomRoutine, toggleLock, deleteRoutine, discardWorkout, finishSession,
    getPreviousBest, userProfile, setUserProfile, availablePlans,
    saveAsNewPlan, startTimer, workoutStartTime, toggleExerciseLock, isHoliday
  } = useWorkoutData(selectedDate);

  // Global Rest Timer Hook
  const { isActive: isTimerActive, timeLeft, startRest, addTime, subtractTime, stopRest, activeContext } = useRestTimer();




  // --- Reward System Logic ---
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStats, setCompletionStats] = useState({ score: 0, volume: 0, duration: '0m' });

  // Logic: Calculate Score & Finish
  const handleFinishWorkout = () => {
    if (!currentLog) return;
    const endTime = Date.now();
    finishSession(endTime);
    const stats = calculateWorkoutStats(currentLog, getPreviousBest, endTime);
    setCompletionStats(stats);
    setShowCompletionModal(true);
  };

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    toggleLock();
  };
  // ---------------------------

  // Helper State
  const isCustomSelected = savedPlans.some(p => p.id === activePlanId);

  // Handlers
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);

    // Prevent future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const n = new Date(newDate);
    n.setHours(0, 0, 0, 0);

    if (n.getTime() > today.getTime()) return;

    setSelectedDate(newDate);
  };

  const loadRoutine = () => {
    // 1. Trigger Loading GIF state
    setLoadingGif(userProfile);

    // 2. Initialize Logic Immediately (or wait? usually safer to init so it's ready)
    initializeDailyLog();
    setIsMinimized(false);

    // 3. Vanish after 2.3s
    setTimeout(() => {
      setLoadingGif(null);
    }, 2300);
  };

  const handleCustomSave = (newPlan) => {
    saveCustomRoutine(newPlan);
    setIsBuilderOpen(false);
    setActivePlanId(newPlan.id);
  };

  const confirmDelete = () => {
    deleteRoutine(activePlanId);
    setShowDeleteConfirm(false);
  };

  const confirmDiscard = () => {
    discardWorkout();
    setShowDiscardConfirm(false);
  };

  return (
    <div className="relative min-h-screen font-sans pb-24 transition-colors duration-300 bg-zinc-50 dark:bg-black">
      <div className="fixed inset-0 z-[5] pointer-events-none">
        <Snowfall
          snowflakeCount={150}
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
          }}
        />
      </div>
      <BackgroundController profile={userProfile} />

      {/* --- GIF Loading Overlay --- */}
      {loadingGif && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col gap-4 items-center justify-center animate-in fade-in duration-300">
          <img
            src={LoadingSticker}
            alt="Loading..."
            className="w-56 h-56 object-contain animate-in zoom-in-50 duration-300 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          />
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDMxYzdlcGhkdWQzOW96NGxnZTk4YmZ4Z3U1MHZrYnJhYTRuYnlmYyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/17mNCcKU1mJlrbXodo/giphy.gif"
            alt="Please wait..."
            className="h-12 object-contain animate-pulse"
          />
        </div>
      )}

      {/* --- Modals & Overlays --- */}
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          routineName={savedPlans.find(p => p.id === activePlanId)?.name}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showDiscardConfirm && (
        <DeleteConfirmationModal
          title="Discard Workout?"
          message="This will remove all progress for today."
          onConfirm={confirmDiscard}
          onCancel={() => setShowDiscardConfirm(false)}
        />
      )}

      {showCalendar && (
        <CalendarModal
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onClose={() => setShowCalendar(false)}
          workoutData={workoutData}
        />
      )}



      {/* --- Main Content --- */}
      <div className="relative z-10 min-h-screen text-zinc-900 dark:text-zinc-100 pb-24 w-full max-w-[800px] mx-auto px-[10px]">

        {/* Tab: Workout */}
        {activeTab === 'workout' ? (
          <>
            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-md border-b p-3 px-3 transition-colors duration-500 ${userProfile === 'gwen' ? 'bg-white/80 dark:bg-zinc-950/70 border-pink-500/30' : 'bg-white/80 dark:bg-zinc-950/70 border-zinc-200 dark:border-zinc-800'}`}>

              {/* Profile Toggle & Branding */}
              <div className="flex flex-nowrap items-center justify-between mb-4 pt-1 gap-2">
                <div className="text-left">
                  <h1 className={`text-2xl sm:text-5xl font-black italic tracking-tighter transition-all duration-500 pr-2 sm:pr-6 whitespace-nowrap ${userProfile === 'gwen'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-red-500'
                    }`} style={{ transform: 'skew(-10deg)' }}>
                    {userProfile === 'gwen' ? 'GHOST-SPIDER' : 'MILES MORALES'}
                  </h1>
                  <div className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] mt-1 uppercase transition-colors duration-500 ${userProfile === 'gwen' ? 'text-cyan-600 dark:text-cyan-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {userProfile === 'gwen' ? 'Multiverse-Training' : 'Ghost-Rider Protocol'}
                  </div>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-start gap-3">

                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="flex flex-col items-center gap-0.5 group"
                    title="Toggle Theme"
                  >
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-zinc-800 border border-orange-300 dark:border-zinc-700 group-hover:bg-orange-200 dark:group-hover:bg-zinc-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm">
                      {theme === 'dark' ? (
                        <Moon size={20} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                      ) : (
                        <Sun size={20} className="text-orange-600 group-hover:text-orange-700 transition-colors" />
                      )}
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-zinc-800 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors uppercase">
                      {theme === 'dark' ? 'Light' : 'Dark'}
                    </span>
                  </button>

                  <button
                    onClick={() => setShowAboutModal(true)}
                    className="flex flex-col items-center gap-0.5 group"
                    title="About Developer"
                  >
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-zinc-800 border border-emerald-300 dark:border-zinc-700 group-hover:bg-emerald-200 dark:group-hover:bg-zinc-700 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm">
                      <Code size={20} className="text-emerald-700 dark:text-emerald-500 group-hover:text-emerald-900 dark:group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-zinc-800 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors uppercase">
                      About
                    </span>
                  </button>

                  {/* Switcher - Increased Touch Target */}
                  <button
                    onClick={() => (!currentLog || isMinimized) && setUserProfile(p => p === 'miles' ? 'gwen' : 'miles')}
                    disabled={!!currentLog && !isMinimized}
                    className={`relative w-16 h-10 mt-[2px] rounded-full transition-all duration-500 border ${!!currentLog && !isMinimized ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 cursor-pointer'
                      } ${userProfile === 'gwen' ? 'bg-pink-100 dark:bg-pink-900/20 border-pink-300 dark:border-pink-500/50' : 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-500/50'
                      }`}
                  >
                    <div className={`absolute top-1 left-1 w-8 h-8 rounded-full shadow-md transition-transform duration-500 flex items-center justify-center text-xs font-bold ${userProfile === 'gwen' ? 'translate-x-6 bg-cyan-400 text-black' : 'translate-x-0 bg-red-600 text-white'}`}>
                      {userProfile === 'gwen' ? 'G' : 'M'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Nav */}
              <div className={`flex items-center justify-between sm:justify-start gap-0.5 sm:gap-4 backdrop-blur-md p-0.5 sm:p-2 sm:pl-4 sm:pr-2 rounded-full border-2 transition-colors duration-500 max-w-full shadow-sm ${userProfile === 'gwen' ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700/50' : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700/50'}`}>
                <button onClick={() => changeDate(-1)} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex-shrink-0 p-1"><ChevronLeft size={20} /></button>
                <div className="flex flex-col items-center flex-shrink-0 px-1">
                  <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors duration-500 hidden sm:block ${userProfile === 'gwen' ? 'text-pink-600 dark:text-pink-400' : 'text-red-600 dark:text-red-500'}`}>Today</span>
                  <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <button
                  onClick={() => changeDate(1)}
                  disabled={(() => {
                    const s = new Date(selectedDate); s.setHours(0, 0, 0, 0);
                    const t = new Date(); t.setHours(0, 0, 0, 0);
                    return s.getTime() >= t.getTime();
                  })()}
                  className={`transition-colors flex-shrink-0 p-1 ${(() => {
                    const s = new Date(selectedDate); s.setHours(0, 0, 0, 0);
                    const t = new Date(); t.setHours(0, 0, 0, 0);
                    return s.getTime() >= t.getTime() ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white';
                  })()}`}
                >
                  <ChevronRight size={20} />
                </button>
                <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-0.5 flex-shrink-0 hidden sm:block"></div>
                <button onClick={() => setShowCalendar(true)} className={`p-1.5 rounded-full transition-all flex-shrink-0 ${userProfile === 'gwen' ? 'bg-zinc-100 dark:bg-zinc-800 text-pink-600 dark:text-pink-400 hover:bg-zinc-200 dark:hover:bg-zinc-700' : 'bg-zinc-100 dark:bg-zinc-800 text-red-600 dark:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}><Calendar size={18} /></button>



                {/* Workout Timer in Header */}
                {currentLog && !isMinimized && (
                  <>
                    <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-0.5 flex-shrink-0 hidden sm:block"></div>
                    <WorkoutTimer startTime={currentLog.startTime} endTime={currentLog.endTime} className="text-xs sm:text-sm flex-shrink-0 ml-1" />
                  </>
                )}
              </div>

              {/* Stats Toggle (Mobile Friendly) */}
              <div className="flex justify-between items-center mt-2 px-1"></div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 min-h-[52px]">
                {/* HEADER CONTROLS: Discard & Big Rest Button */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 min-h-[60px] w-full">

                  {/* Left: Discard Button */}
                  {currentLog && !isMinimized && (
                    <button
                      onClick={() => setShowDiscardConfirm(true)}
                      disabled={isLocked}
                      className={`text-sm font-bold flex items-center gap-1.5 transition-colors px-4 py-2 rounded-full ${isLocked
                        ? 'text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800/50 cursor-not-allowed opacity-50'
                        : 'text-red-600/90 dark:text-red-500/80 hover:text-red-600 dark:hover:text-red-400 bg-red-100 dark:bg-red-500/10'
                        }`}
                    >
                      <Trash2 size={16} /> Discard
                    </button>
                  )}

                  {/* Right: Big Rest Button */}
                  {currentLog && !isMinimized && (
                    <HeaderRest
                      isActive={isTimerActive && !activeContext}
                      timeLeft={timeLeft}
                      onStart={startRest}
                      onAdd={addTime}
                      onSubtract={subtractTime}
                      onStop={stopRest}
                      userProfile={userProfile}
                    />
                  )}
                </div>
              </div>
            </header>

            {/* Session Adherence Bar (Volume Based) */}
            {currentLog && !isMinimized && (() => {
              let totalTargetReps = 0;
              let totalActualReps = 0;
              let totalStrengthVolume = 0;

              currentLog.exercises.forEach(ex => {
                const tReps = ex.numericalTargetReps || 8;
                const tSets = ex.targetSets || 3;

                if (ex.type === 'cardio') {
                  // Cardio: Treat minutes/distance as units
                  totalTargetReps += (tSets * tReps);
                  ex.sets.forEach(s => {
                    if (s.completed) {
                      totalActualReps += tReps; // Simplified for cardio progress
                    }
                  });
                } else if (ex.type === 'abs') {
                  // Abs: Sets * Reps
                  totalTargetReps += (tSets * tReps);
                  ex.sets.forEach(s => {
                    if (s.completed) {
                      let val = (parseFloat(s.reps) || parseFloat(s.holdTime) || 0);
                      if (val === 0) val = tReps;
                      totalActualReps += val;
                    }
                  });
                } else {
                  // Strength: Volume Load (Sets * Reps * Weight)
                  let refWeight = getPreviousBest(ex.name)?.weight || 0;
                  if (!refWeight) {
                    const validWeights = ex.sets.map(s => parseFloat(s.weight)).filter(w => !isNaN(w) && w > 0);
                    if (validWeights.length > 0) refWeight = Math.max(...validWeights);
                  }
                  const targetWeight = refWeight || 1;
                  totalTargetReps += (tSets * tReps * targetWeight);

                  ex.sets.forEach(s => {
                    if (s.completed) {
                      let r = (parseFloat(s.reps) || 0);
                      if (r === 0) r = tReps;

                      let w = parseFloat(s.weight);
                      if (isNaN(w) || w === 0) w = 0;

                      const vol = r * w;
                      totalActualReps += vol;
                      totalStrengthVolume += vol;
                    }
                  });
                }
              });

              // Avoid visual glitches if target is 0
              if (totalTargetReps === 0) totalTargetReps = 1;

              return (
                <div className="sticky top-16 z-30 mb-6 -mx-4 px-4 py-2 bg-white/90 dark:bg-black/60 backdrop-blur-xl border-y-2 border-zinc-300 dark:border-zinc-800/50 shadow-sm">
                  <AdherenceBar
                    targetVolume={totalTargetReps}
                    actualVolume={totalActualReps}
                    label={totalStrengthVolume > 0 ? `Total Volume: ${Math.round(totalStrengthVolume).toLocaleString()} kg` : "Session Intensity"}
                    height="h-3"
                  />
                </div>
              );
            })()}

            <main className="py-6">
              {!currentLog || isMinimized ? (
                /* Empty State / Routine Selection */
                <div className="flex flex-col gap-6 py-10 px-2">

                  {/* Resume Banner - Redesigned (Compact) */}
                  {currentLog && isMinimized && (
                    <div className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)] animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl rounded-[15px] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 overflow-hidden">

                        {/* Animated Icon BG */}
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10 flex-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 dark:text-emerald-400 uppercase">Session Active</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black italic text-zinc-900 dark:text-white tracking-tight mb-1">{currentLog.templateName}</h3>
                          <p className="text-zinc-500 dark:text-zinc-400 text-xs">Resuming will take you back to your active sets.</p>
                        </div>

                        <Button
                          onClick={() => setIsMinimized(false)}
                          className="relative z-10 w-full sm:w-auto bg-emerald-500 text-black text-sm font-bold hover:bg-emerald-400 hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)] border-0 py-3 px-6 rounded-lg transition-all duration-300"
                        >
                          RESUME WORKOUT
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="text-center space-y-3 mb-4 pt-4">
                    <div className="mx-auto w-28 h-28 flex items-center justify-center mb-2 animate-bounce hover:scale-110 transition-transform duration-300">
                      <img
                        src={userProfile === 'gwen' ? GwenSticker : MilesSticker}
                        alt="Character Logo"
                        className={`w-full h-full object-contain ${userProfile === 'gwen' ? 'drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]'}`}
                      />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black italic tracking-normal sm:tracking-tighter text-zinc-900 dark:text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transform -skew-x-6">
                      START <span className={`text-transparent bg-clip-text bg-gradient-to-r pr-2 ${userProfile === 'gwen' ? 'from-pink-500 via-purple-500 to-cyan-500 dark:from-white dark:via-pink-400 dark:to-cyan-400' : 'from-red-600 via-orange-500 to-yellow-500 dark:from-white dark:via-red-500 dark:to-red-600'}`}>WORKOUT</span>
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-500 font-bold tracking-[0.2em] text-[10px] uppercase mt-1">Choose your protocol</p>
                  </div>

                  {isHoliday ? (
                    /* --- Holiday / Rest Day View --- */
                    <div className="relative p-8 rounded-2xl bg-white/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg flex flex-col items-center justify-center text-center space-y-4">

                      {/* Bouncing Coffee/Rest Icon */}
                      <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-2 animate-pulse">
                        <span className="text-4xl">☕</span>
                      </div>

                      <h3 className="text-2xl font-black italic uppercase text-zinc-800 dark:text-white tracking-tight">
                        Gym Closed
                      </h3>

                      <div className="space-y-1">
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">
                          Tuesdays are Rest Days
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                          Take a break, recover, and come back stronger tomorrow. No workouts can be logged today.
                        </p>
                      </div>

                      <div className="pt-4 opacity-50 grayscale pointer-events-none select-none filter blur-[1px]">
                        <Button className="w-full bg-zinc-200 text-zinc-400">Locked</Button>
                      </div>
                    </div>
                  ) : (
                    /* --- Normal Routine Selector --- */
                    isBuilderOpen ? (
                      <RoutineBuilder onSave={handleCustomSave} onCancel={() => setIsBuilderOpen(false)} />
                    ) : (
                      <div className="relative p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg">

                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 block ml-1">Select Routine</label>

                        <div className="flex gap-3 mb-6">
                          <div className="relative flex-grow group">
                            <select
                              value={activePlanId}
                              onChange={(e) => setActivePlanId(e.target.value)}
                              className="w-full appearance-none bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-white text-lg font-bold py-4 px-6 rounded-xl focus:outline-none focus:border-zinc-400 dark:focus:border-white/20 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-white/20 transition-all shadow-inner"
                            >
                              <optgroup label="Default Plans" className="bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                                {availablePlans.map(plan => (<option key={plan.id} value={plan.id} className="text-zinc-900 dark:text-white bg-white dark:bg-zinc-900">{plan.name}</option>))}
                              </optgroup>
                              {savedPlans.length > 0 && (
                                <optgroup label="My Custom Routines" className="bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
                                  {savedPlans.map(plan => (<option key={plan.id} value={plan.id} className="text-zinc-900 dark:text-white bg-white dark:bg-zinc-900">{plan.name}</option>))}
                                </optgroup>
                              )}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors">
                              <ChevronRight size={20} className="rotate-90" />
                            </div>
                          </div>

                          {isCustomSelected && (
                            <button
                              onClick={() => setShowDeleteConfirm(true)}
                              className="px-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all flex items-center justify-center"
                              title="Delete this routine"
                            >
                              <Trash2 size={22} />
                            </button>
                          )}
                        </div>

                        <Button
                          onClick={loadRoutine}
                          disabled={!!currentLog}
                          className={`w-full py-4 text-lg font-black italic tracking-wider shadow-xl transition-all duration-300 ${!!currentLog
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed border border-zinc-200 dark:border-zinc-700'
                            : userProfile === 'gwen'
                              ? 'bg-pink-500/10 dark:bg-pink-500/20 backdrop-blur-md border border-pink-500/50 text-pink-600 dark:text-pink-300 hover:bg-pink-500/20 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.02]'
                              : 'bg-red-600/10 dark:bg-red-600/20 backdrop-blur-md border border-red-600/50 text-red-600 dark:text-red-400 hover:bg-red-600/20 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-[1.02]'
                            }`}
                        >
                          {!!currentLog ? 'SESSION ACTIVE' : (
                            <div className="flex items-center justify-center gap-6 w-full overflow-hidden">
                              <img src={LoadRoutineSticker} alt="Decoration" className="h-10 object-contain opacity-60 grayscale-[0.3] scale-90" />
                              <div className="flex flex-col items-center justify-center -mt-1">
                                <img src={LoadRoutineSticker} alt="Load Routine" className="h-12 object-contain z-10 drop-shadow-md" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mt-1">Click</span>
                              </div>
                              <img src={LoadRoutineSticker} alt="Decoration" className="h-10 object-contain opacity-60 grayscale-[0.3] scale-90" />
                            </div>
                          )}
                        </Button>

                        <div className="relative flex py-6 items-center">
                          <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800/50"></div>
                          <span className="flex-shrink-0 mx-4 text-zinc-400 dark:text-zinc-600 text-[10px] font-bold tracking-[0.2em] uppercase">OR</span>
                          <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800/50"></div>
                        </div>

                        <Button
                          variant="secondary"
                          onClick={() => setIsBuilderOpen(true)}
                          className={`w-full py-4 relative group overflow-hidden border border-zinc-200/60 dark:border-white/10 bg-zinc-50/80 dark:bg-zinc-800/20 backdrop-blur-xl ${userProfile === 'gwen' ? 'hover:bg-pink-500/10 hover:border-pink-500/30' : 'hover:bg-red-500/10 hover:border-red-500/30'} transition-all duration-300 shadow-sm`}
                        >
                          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${userProfile === 'gwen' ? 'from-pink-500/5 via-transparent to-cyan-500/5' : 'from-red-500/5 via-transparent to-orange-500/5'}`} />
                          <div className={`absolute inset-0 border border-dashed opacity-20 group-hover:opacity-40 transition-all ${userProfile === 'gwen' ? 'border-pink-400' : 'border-red-400'} rounded-xl`} />

                          <span className={`relative z-10 flex items-center justify-center gap-2 font-bold tracking-widest text-sm group-hover:tracking-[0.2em] transition-all duration-300 ${userProfile === 'gwen' ? 'text-zinc-600 dark:text-pink-300' : 'text-zinc-600 dark:text-red-300'}`}>
                            <Plus size={18} />
                            CREATE CUSTOM
                          </span>
                        </Button>
                      </div>

                    )
                  )}
                </div>
              ) : (
                /* Active Workout View */
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-y-3">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight drop-shadow-md">{currentLog.templateName}</h2>
                  </div>

                  {currentLog.exercises.map((exercise, i) => (
                    <ExerciseCard
                      key={i}
                      exercise={exercise}
                      index={i}
                      onUpdateSet={updateSet}
                      onAddSet={addSet}
                      onRemoveSet={removeSet}
                      onLink={handleLinkAction}
                      previousBest={getPreviousBest(exercise.name)}
                      onRemove={removeExercise}
                      onCardioMode={updateCardioMode}
                      onUpdateName={updateExerciseName}
                      pendingSuperset={pendingSuperset}
                      disabled={isLocked}
                      onStartRest={startRest}
                      activeTimer={{ isActive: isTimerActive, timeLeft, activeContext }}
                      timerControls={{ onAdd: addTime, onStop: stopRest }}
                      onToggleLock={() => toggleExerciseLock(i)}
                    />
                  ))}

                  <div className="mt-8 space-y-4">
                    {!isLocked && (
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <Button variant="strength" onClick={() => addExercise('strength')} className="h-12 border-dashed border-2">+ Strength</Button>
                        <Button variant="cardio" onClick={() => addExercise('cardio')} className="h-12 border-dashed border-2">+ Cardio</Button>
                        <Button variant="abs" onClick={() => addExercise('abs')} className="h-12 border-dashed border-2 col-span-2">+ Abs & Core</Button>
                      </div>
                    )}

                    <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border-2 border-zinc-300 dark:border-zinc-800 flex flex-col items-center gap-4 text-center shadow-sm">
                      {isLocked ? (
                        <>
                          <div className="text-emerald-500 flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-green-500/20 flex items-center justify-center text-emerald-600 dark:text-green-500"><CheckCircle size={24} /></div>
                            <h3 className="text-xl font-bold">Workout Complete!</h3>
                          </div>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Great job! This workout is locked and saved.</p>
                          <Button onClick={toggleLock} className="w-full bg-white/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] text-zinc-800 dark:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800/60 rounded-2xl transition-all duration-300 font-bold tracking-wide">Unlock to Edit</Button>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Finished Training?</h3>
                          <p className="text-zinc-500 text-sm">Lock your workout to save progress and prevent accidental edits.</p>
                          <Button
                            onClick={handleFinishWorkout}
                            variant="ghost"
                            className="group w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-zinc-900 dark:to-zinc-950 border border-emerald-500/50 shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 rounded-2xl relative overflow-hidden"
                          >
                            {/* Scanline/Grid Effect Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                            <div className="flex items-center justify-center gap-4 relative z-10">
                              <Trophy size={24} className="text-yellow-300 group-hover:text-yellow-200 transition-colors drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]" />
                              <span className="font-black text-xl tracking-[0.15em] uppercase text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">Finish Session</span>
                            </div>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </main>

            <CompletionModal
              isOpen={showCompletionModal}
              onClose={closeCompletionModal}
              score={completionStats.score}
              stats={completionStats}
            />
          </>
        ) : (
          /* Tab: Stats */
          <main className="max-w-[800px] mx-auto p-4 relative pt-10">
            <StatsView workoutData={workoutData} getPreviousBest={getPreviousBest} />
          </main>
        )}
      </div>


      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 p-2 z-50">
        <div className="max-w-[800px] mx-auto flex justify-around items-end relative">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${activeTab === 'workout' ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            <Dumbbell size={24} />
            <span className="text-[10px] uppercase font-bold mt-1">Workout</span>
          </button>

          {/* Home Button in Bottom Bar */}
          {currentLog && !isMinimized && <button
            onClick={() => setIsMinimized(true)}
            className="flex flex-col items-center p-3 rounded-lg transition-colors text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
          >
            <Home size={24} />
            <span className="text-[10px] uppercase font-bold mt-1">Home</span>
          </button>
          }

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${activeTab === 'stats' ? 'text-emerald-600 dark:text-emerald-500' : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
          >
            <TrendingUp size={24} />
            <span className="text-[10px] uppercase font-bold mt-1">Stats</span>
          </button>
        </div>
      </div>
    </div >
  );
}

export default App;
