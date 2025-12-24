import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Activity, BarChart3, Info, Trash2, CheckCircle, Plus, Home, PlayCircle, Trophy, Timer, Sun, Moon, Zap, Terminal, Heart, Code, Mail, Phone } from 'lucide-react';
// import MilesSticker from './assets/miles_sticker.gif';
const MilesSticker = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYm1lZGtsNzduem10bTE5ZXdudTJuenZmOXZ6MHM2NXdiaHV6N2Z3ZSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/uctvenxww01iIanyvT/giphy.gif";
import GwenSticker from './assets/gwen_sticker.gif';
import LoadingSticker from './assets/loading_sticker.gif';
// import LoadRoutineSticker from './assets/load_btn_sticker.gif';

// Hooks
import { useWorkoutData, WORKOUT_PLANS } from './hooks/useWorkoutData';
import { useRestTimer } from './hooks/useRestTimer';
import { useTheme } from './context/ThemeContext';

// Helpers
import { calculateSessionStats } from './utils/statsEngine';

// Components
import { BackgroundController } from './components/Layout/BackgroundController';
import { Button } from './components/ui/Button';
import { DeleteConfirmationModal } from './components/ui/DeleteConfirmationModal';
import { CalendarModal } from './components/ui/CalendarModal';
import { AboutModal } from './components/ui/AboutModal';
import { ExerciseCard } from './components/workout/ExerciseCard';
import { RoutineBuilder } from './components/workout/RoutineBuilder';
import { CreateRoutineWizard } from './components/workout/CreateRoutineWizard';
import { useCustomRoutines } from './hooks/useCustomRoutines';
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
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'stats' | 'about'
  const [showCalendar, setShowCalendar] = useState(false);

  // --- Handlers ---
  const toggleBuilder = () => setIsBuilderOpen(!isBuilderOpen);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loadingGif, setLoadingGif] = useState(null); // 'miles' | 'gwen' | null
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutPressed, setIsAboutPressed] = useState(false);

  // Responsive Check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Force Start on Workout Tab (Fix for persisted browser state)
  useEffect(() => {
    setActiveTab('workout');
  }, []);

  // Fix: Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [activeTab]);

  // Scroll Listener for Header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Core Logic Hook
  const {
    workoutData, savedPlans, activePlanId, setActivePlanId,
    currentLog, isLocked, pendingSuperset,
    initializeDailyLog, updateSet, updateCardioMode, updateCoreMode, addSet, removeSet,
    addExercise, removeExercise, updateExerciseName, handleLinkAction,
    saveCustomRoutine, toggleLock, deleteRoutine, discardWorkout, finishSession,
    getPreviousBest, userProfile, setUserProfile, availablePlans,
    saveAsNewPlan, startTimer, workoutStartTime, toggleExerciseLock, isHoliday,
    lastDeletedSet, undoDelete
  } = useWorkoutData(selectedDate);

  // Fix: Auto-minimize finished/locked workouts on reload
  const hasCheckedAutoMinimize = React.useRef(false);
  useEffect(() => {
    // Only run this check once per session load (when log is first detected)
    if (!hasCheckedAutoMinimize.current && currentLog) {
      if (currentLog.endTime || currentLog.isLocked) {
        setIsMinimized(true);
      }
      hasCheckedAutoMinimize.current = true;
    }
    // Reset check if log is cleared (allows re-check on next creation)
    if (!currentLog) {
      hasCheckedAutoMinimize.current = false;
    }
  }, [currentLog]);

  // Global Rest Timer Hook

  const handleTimerComplete = (context) => {
    if (context && context.type === 'set') {
      updateSet(context.exIndex, context.setIndex, 'completed', true);
    }
  };

  const { isActive: isTimerActive, timeLeft, totalDuration, startRest, addTime, subtractTime, stopRest, activeContext } = useRestTimer({ onComplete: handleTimerComplete });

  // Wrapper to intercept set completion for Auto-Rest
  const handleUpdateSet = (exIndex, setIndex, field, value) => {
    updateSet(exIndex, setIndex, field, value);

    // Auto-Start Rest Logic
    if (field === 'completed' && value === true) {
      if (!currentLog || !currentLog.exercises || !currentLog.exercises[exIndex]) return;
      const exercise = currentLog.exercises[exIndex];
      let restDuration = 90; // Default Strength
      if (exercise.type === 'cardio') restDuration = 30; // Short rest for cardio
      if (exercise.type === 'abs') restDuration = 60; // Medium rest for core

      // Start the rest timer
      startRest(restDuration, { type: 'rest', exIndex, setIndex });
    }
  };
  // --- Reward System Logic ---
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStats, setCompletionStats] = useState({ score: 0, volume: 0, duration: '0m' });

  // Logic: Calculate Score & Finish
  const handleFinishWorkout = () => {
    if (!currentLog) return;
    const endTime = Date.now();
    finishSession(endTime);
    // Explicitly inject endTime for immediate calculation (state update is async)
    const completedLog = { ...currentLog, endTime };
    const stats = calculateSessionStats(completedLog, getPreviousBest);
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

  // Custom routines hook for AI-generated routines
  const customRoutines = useCustomRoutines();

  const handleCustomSave = (newPlan) => {
    // Handle both legacy RoutineBuilder format and new CreateRoutineWizard format
    if (newPlan.exercises && newPlan.exercises.length > 0 && newPlan.isAIGenerated) {
      // New AI-generated routine format - save to customRoutines
      const result = customRoutines.saveRoutine(newPlan);
      if (result.success) {
        // Combine main exercises with finishers for legacy format
        const allExercises = [
          // Main strength exercises
          ...newPlan.exercises.map(ex => ({
            name: ex.name,
            targetSets: ex.sets,
            targetReps: ex.reps,
            type: ex.primaryMuscle === 'cardio' ? 'cardio'
              : ex.primaryMuscle === 'core' ? 'abs'
                : 'strength',
            restSeconds: ex.rest
          })),
          // Finishers (cardio/core) - add them if they exist
          ...(newPlan.finishers || []).map(finisher => ({
            name: finisher.name,
            targetSets: finisher.sets || 3,
            targetReps: finisher.reps || '12-15',
            type: finisher.type === 'cardio' ? 'cardio' : 'abs',
            restSeconds: 60
          }))
        ];

        const legacyPlan = {
          id: result.data.id,
          name: newPlan.routineName,
          exercises: allExercises
        };
        saveCustomRoutine(legacyPlan);
        setIsBuilderOpen(false);
        setActivePlanId(result.data.id);
      }
    } else {
      // Legacy RoutineBuilder format
      saveCustomRoutine(newPlan);
      setIsBuilderOpen(false);
      setActivePlanId(newPlan.id);
    }
  };

  const handleStartNow = (newPlan) => {
    handleCustomSave(newPlan);
    // Start the workout immediately after saving
    if (!currentLog) {
      initializeDailyLog(newPlan.id);
    }
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
      <div className={`fixed inset-0 z-[5] pointer-events-none transition-opacity duration-500 ${isMobile ? 'opacity-40' : 'opacity-100'}`}>
        <Snowfall
          snowflakeCount={isMobile ? 40 : 150} // Significantly reduced for mobile focus
          radius={isMobile ? [0.5, 1.5] : [0.5, 3.0]} // Smaller particles on mobile
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

      {/* --- Undo Toast --- */}
      {lastDeletedSet && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-zinc-900 dark:bg-zinc-800 text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-4 border border-zinc-700">
            <span className="text-sm font-medium">Set deleted</span>
            <button onClick={undoDelete} className="text-sm font-bold text-amber-500 hover:text-amber-400 uppercase tracking-wider">Undo</button>
          </div>
        </div>
      )}

      {showCalendar && (
        <CalendarModal
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onClose={() => setShowCalendar(false)}
          workoutData={workoutData}
          getPreviousBest={getPreviousBest}
        />
      )}



      {/* --- Main Content --- */}
      <div className="relative z-10 min-h-[100dvh] text-zinc-900 dark:text-zinc-100 pb-24 w-full max-w-[800px] mx-auto px-3 sm:px-4">

        {/* Tab: Workout */}
        {activeTab === 'workout' ? (
          <>
            {/* Header - Mobile Adaptation: Transparent on local, sticky/glazed on scroll or desktop */}
            <header className={`sticky top-0 z-40 p-3 px-3 transition-colors duration-500 ${isMobile && activeTab === 'workout' && !isScrolled
              ? 'bg-transparent border-transparent backdrop-blur-none'
              : `backdrop-blur-md border-b ${userProfile === 'gwen' ? 'bg-white/80 dark:bg-zinc-950/70 border-pink-500/30' : 'bg-white/80 dark:bg-zinc-950/70 border-zinc-200 dark:border-zinc-800'}`
              }`}>

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
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className="flex flex-col items-center gap-0.5 group"
                    title="Toggle Focus Mode"
                  >
                    <div className={`p-2 rounded-full border transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm ${isFocusMode ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 group-hover:bg-amber-50 dark:group-hover:bg-zinc-700'}`}>
                      <Zap size={20} className={`transition-colors ${isFocusMode ? 'text-amber-600 dark:text-amber-500 fill-amber-600 dark:fill-amber-500' : 'text-zinc-400 group-hover:text-amber-500'}`} />
                    </div>
                    <span className={`text-[10px] font-black tracking-widest transition-colors uppercase ${isFocusMode ? 'text-amber-600 dark:text-amber-500' : 'text-zinc-800 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white'}`}>
                      Focus
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

              {/* Date Nav - Command Center Style */}
              {activeTab === 'workout' ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    {/* Left Arrow - Circular */}
                    <button
                      onClick={() => changeDate(-1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* Center Pill - Calendar + Today + Dropdown */}
                    <button
                      onClick={() => setShowCalendar(true)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all ${userProfile === 'gwen'
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
                        }`}
                    >
                      <Calendar size={18} className={userProfile === 'gwen' ? 'text-pink-500 dark:text-pink-400' : 'text-emerald-500 dark:text-emerald-400'} />
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {(() => {
                          const today = new Date();
                          const s = new Date(selectedDate);
                          today.setHours(0, 0, 0, 0);
                          s.setHours(0, 0, 0, 0);
                          const diff = Math.floor((today.getTime() - s.getTime()) / 86400000);
                          if (diff === 0) return 'Today';
                          if (diff === 1) return 'Yesterday';
                          return selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        })()}
                      </span>
                      <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-500 rotate-90" />
                    </button>

                    {/* Right Arrow - Circular */}
                    <button
                      onClick={() => changeDate(1)}
                      disabled={(() => {
                        const s = new Date(selectedDate); s.setHours(0, 0, 0, 0);
                        const t = new Date(); t.setHours(0, 0, 0, 0);
                        return s.getTime() >= t.getTime();
                      })()}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${(() => {
                        const s = new Date(selectedDate); s.setHours(0, 0, 0, 0);
                        const t = new Date(); t.setHours(0, 0, 0, 0);
                        return s.getTime() >= t.getTime()
                          ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white';
                      })()}`}
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Workout Timer */}
                    {currentLog && !isMinimized && (
                      <>
                        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1 hidden sm:block" />
                        <WorkoutTimer startTime={currentLog.startTime} endTime={currentLog.endTime} className="text-xs sm:text-sm" />
                      </>
                    )}
                  </div>
                  {/* Full Date Display Below Navigation */}
                  <p className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-2">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-2">
                    {/* Left Arrow - Circular */}
                    <button
                      onClick={() => changeDate(-1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* Center Pill - Calendar + Today + Dropdown */}
                    <button
                      onClick={() => setShowCalendar(true)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all ${userProfile === 'gwen'
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
                        : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'
                        }`}
                    >
                      <Calendar size={18} className={userProfile === 'gwen' ? 'text-pink-500 dark:text-pink-400' : 'text-emerald-500 dark:text-emerald-400'} />
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {(() => {
                          const today = new Date();
                          const s = new Date(selectedDate);
                          today.setHours(0, 0, 0, 0);
                          s.setHours(0, 0, 0, 0);
                          const diff = Math.floor((today.getTime() - s.getTime()) / 86400000);
                          if (diff === 0) return 'Today';
                          if (diff === 1) return 'Yesterday';
                          return selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        })()}
                      </span>
                      <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-500 rotate-90" />
                    </button>

                    {/* Right Arrow - Circular */}
                    <button
                      onClick={() => changeDate(1)}
                      disabled={(() => {
                        const s = new Date(selectedDate); s.setHours(0, 0, 0, 0);
                        const t = new Date(); t.setHours(0, 0, 0, 0);
                        return s.getTime() >= t.getTime();
                      })()}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 ${(() => {
                        const s = new Date(selectedDate); s.setHours(0, 0, 0, 0);
                        const t = new Date(); t.setHours(0, 0, 0, 0);
                        return s.getTime() >= t.getTime()
                          ? 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white';
                      })()}`}
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Workout Timer */}
                    {currentLog && !isMinimized && (
                      <>
                        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1 hidden sm:block" />
                        <WorkoutTimer startTime={currentLog.startTime} endTime={currentLog.endTime} className="text-xs sm:text-sm" />
                      </>
                    )}
                  </div>
                  {/* Full Date Display Below Navigation */}
                  <p className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-2">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                </>
              )}

              {/* Stats Toggle (Mobile Friendly) */}
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

                {/* Right: Focus Toggle & Big Rest Button */}
                {/* Right: Big Rest Button */}
                {currentLog && !isMinimized && (
                  <HeaderRest
                    isActive={!!isTimerActive}
                    timeLeft={timeLeft || 0}
                    totalDuration={totalDuration || 0}
                    onStart={startRest ? (duration) => startRest(duration, null) : () => { }}
                    onAdd={addTime ? addTime : () => { }}
                    onSubtract={subtractTime ? subtractTime : () => { }}
                    onStop={stopRest ? stopRest : () => { }}
                    userProfile={userProfile}
                  />
                )}
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
                <div className="flex flex-col gap-6 py-10 px-6 bg-zinc-50/50 dark:bg-black/40 backdrop-blur-md rounded-3xl mt-4 border border-zinc-200/50 dark:border-white/5">

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
                    <div className="mx-auto w-28 h-28 flex items-center justify-center mb-2 animate-float hover:scale-110 transition-transform duration-300">
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
                      <CreateRoutineWizard
                        onSave={handleCustomSave}
                        onCancel={() => setIsBuilderOpen(false)}
                        onStartNow={handleStartNow}
                        onManualCreate={() => {
                          // Close wizard and let user create routine with manual exercise addition
                          // The main app already has +Strength, +Cardio, +Abs buttons
                          const emptyPlan = {
                            id: `custom_${Date.now()}`,
                            name: 'New Routine',
                            exercises: []
                          };
                          saveCustomRoutine(emptyPlan);
                          setIsBuilderOpen(false);
                          setActivePlanId(emptyPlan.id);
                          // Initialize daily log so user can add exercises
                          initializeDailyLog(emptyPlan.id);
                        }}
                      />
                    ) : (

                      <div className="relative flex flex-col min-h-0 pb-0 sm:block py-4 sm:py-12 px-2 max-w-xl mx-auto gap-6 sm:gap-0">

                        {/* 1. Routine Focus (Moved to Top) */}
                        <div className="text-center mt-8 sm:mt-0 relative group">
                          <div className="inline-flex items-center justify-center gap-2 mb-2 w-full">
                            <select
                              value={activePlanId}
                              onChange={(e) => setActivePlanId(e.target.value)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <optgroup label="My Routines">
                                {savedPlans.map(plan => (
                                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                                ))}
                              </optgroup>
                              <optgroup label="Default Routines">
                                {availablePlans.map(plan => (
                                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                                ))}
                              </optgroup>
                            </select>
                            <h2
                              className="text-2xl sm:text-6xl font-black italic tracking-tighter text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors leading-tight px-2 break-words"
                              style={{ textWrap: 'balance' }}
                            >
                              {savedPlans.find(p => p.id === activePlanId)?.name || availablePlans.find(p => p.id === activePlanId)?.name || "Select Routine"}
                            </h2>
                            <ChevronRight size={20} className="text-zinc-300 dark:text-zinc-700 rotate-90 flex-shrink-0" />
                          </div>
                          <p className="text-zinc-400 dark:text-zinc-500 text-xs sm:text-sm font-bold tracking-widest uppercase">
                            Week A · Day 1
                          </p>
                        </div>

                        {/* 2. System Status (Below Routine) */}
                        <div className="flex justify-center">
                          {!!currentLog ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Workout in progress</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Ready to start</span>
                            </div>
                          )}
                        </div>

                        {/* Spacer for bottom pinned content */}


                        {/* Bottom Action Area */}
                        <div className="mt-12 w-full z-10">
                          {/* 3. Primary CTA */}
                          <div className="mb-4">
                            <Button
                              onClick={loadRoutine}
                              disabled={!!currentLog}
                              className={`w-full h-14 text-lg font-black tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-[0.98] rounded-lg border-0 ${!!currentLog
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                                : userProfile === 'gwen'
                                  ? 'bg-zinc-900 dark:bg-pink-600 !text-white'
                                  : 'bg-zinc-900 dark:bg-red-600 !text-white'
                                }`}
                            >
                              {!!currentLog ? 'SESSION ACTIVE' : (
                                <div className="flex items-center justify-center gap-2">
                                  <span>START SESSION</span>
                                  <span className="text-xl">→</span>
                                </div>
                              )}
                            </Button>
                          </div>

                          {/* 4. Trust Copy */}
                          {!currentLog && (
                            <p className="text-center mb-2 text-[10px] font-medium text-zinc-400 dark:text-zinc-600 opacity-80">
                              Exercises can be changed anytime · Progress is saved automatically
                            </p>
                          )}

                          {/* 5. Secondary Actions */}
                          <div className="flex justify-center gap-3 mt-0">
                            <button
                              onClick={() => setIsBuilderOpen(true)}
                              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                              <Plus size={18} strokeWidth={2.5} />
                              <span className="text-sm font-bold tracking-wide">Create Custom Routine</span>
                            </button>

                            {/* Delete button - only show for custom routines */}
                            {savedPlans.some(p => p.id === activePlanId) && (
                              <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={!!currentLog}
                                className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-200 ${!!currentLog
                                  ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 cursor-not-allowed'
                                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-700'
                                  }`}
                                title="Delete this routine"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    )
                  )}
                </div>
              ) : (<>
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-y-3">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight drop-shadow-md">{currentLog.templateName}</h2>
                  </div>


                  {currentLog.exercises && (() => {
                    const activeExerciseIndex = currentLog.exercises.findIndex(ex => ex.sets.some(s => !s.completed));
                    return currentLog.exercises.map((exercise, i) => (
                      <ExerciseCard
                        key={i}
                        exercise={exercise}
                        index={i}
                        isActiveExercise={i === (activeExerciseIndex === -1 ? currentLog.exercises.length - 1 : activeExerciseIndex)} // Default to last if all complete
                        onUpdateSet={handleUpdateSet}
                        onAddSet={addSet}
                        onRemoveSet={removeSet}
                        onLink={handleLinkAction}
                        previousBest={getPreviousBest ? getPreviousBest(exercise.name) : null}
                        onRemove={removeExercise}
                        onCardioMode={updateCardioMode}
                        onCoreMode={updateCoreMode}
                        onUpdateName={updateExerciseName}
                        pendingSuperset={pendingSuperset}
                        disabled={isLocked}
                        onStartRest={startRest}
                        activeTimer={{ isActive: isTimerActive, timeLeft, activeContext }}
                        timerControls={{ onAdd: addTime, onStop: stopRest }}
                        onToggleLock={() => toggleExerciseLock(i)}
                        isFocusMode={isFocusMode}
                        onStartSetTimer={(duration, setIndex) => startRest(duration, { type: 'set', exIndex: i, setIndex })}
                      />
                    ))
                  })()}

                  <div className="mt-8 space-y-4">
                    {!isLocked && !isFocusMode && (
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

                {/* Sticky Complete Button */}
                {(() => {
                  let fabExIndex = -1;
                  let fabSetIndex = -1;
                  if (!isLocked && currentLog && currentLog.exercises) {
                    for (let i = 0; i < currentLog.exercises.length; i++) {
                      const idx = currentLog.exercises[i].sets.findIndex(s => !s.completed);
                      if (idx !== -1) {
                        fabExIndex = i;
                        fabSetIndex = idx;
                        break;
                      }
                    }
                  }

                  if (fabExIndex !== -1) {
                    const ex = currentLog.exercises[fabExIndex];
                    const setNum = fabSetIndex + 1;
                    return (
                      <button
                        onClick={() => {
                          handleUpdateSet(fabExIndex, fabSetIndex, 'completed', true);
                          // Provide haptic feedback via useRestTimer's integrated logic? 
                          // Or direct call here if not handled by handleUpdateSet. 
                          // handleTimerComplete handles vibration on *timer* complete. 
                          // We might want tactile click here.
                          if (navigator.vibrate) navigator.vibrate(50);
                        }}
                        className="fixed bottom-24 right-4 z-50 bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.5)] w-14 h-14 rounded-full flex items-center justify-center animate-in zoom-in duration-300 active:scale-90 active:bg-emerald-600 transition-all"
                      >
                        <CheckCircle size={28} />
                        <div className="absolute -top-2 -right-2 bg-white dark:bg-zinc-800 text-[10px] font-bold text-zinc-900 dark:text-white px-1.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
                          #{setNum}
                        </div>
                      </button>
                    )
                  }
                  return null;
                })()}
              </>)}
            </main>

            <CompletionModal
              isOpen={showCompletionModal}
              onClose={closeCompletionModal}
              score={completionStats.score}
              stats={completionStats}
            />
          </>
        ) : activeTab === 'stats' ? (
          /* Tab: Stats */
          <main className="max-w-[800px] mx-auto p-4 relative pt-10">
            <StatsView workoutData={workoutData} getPreviousBest={getPreviousBest} theme={theme} />
          </main>
        ) : (
          /* Tab: About */
          <main className="max-w-[800px] mx-auto p-4 relative pt-10 pb-32">
            {/* Refactored Modern UI Container */}
            <div className="relative w-full max-w-md mx-auto">

              {/* Main Content Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] shadow-sm overflow-hidden">

                {/* 1. Header Section */}
                <div className="p-8 pb-6 text-center border-b border-zinc-100 dark:border-zinc-800/50">
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                    <Activity size={24} strokeWidth={2.5} />
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-red-500 uppercase transform -skew-x-6 drop-shadow-lg mb-2">
                    DUO-FIT
                  </h1>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Training System v1.0 <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-wide ml-2">Beta</span>
                  </p>
                </div>

                {/* 2. Story Section */}
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      <Terminal size={16} className="text-emerald-500" />
                      <h3>Behind the Code</h3>
                    </div>
                    {/* Restored Origin Story Header with Heart Icon */}
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mt-6 mb-2">
                      <Heart size={14} className="text-pink-500 fill-pink-500/20" />
                      <h3>The Origin Story</h3>
                    </div>
                    <div className="prose prose-sm dark:prose-invert text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                      <p>
                        We built <strong className="text-zinc-900 dark:text-zinc-200">DUO-FIT</strong> to solve "gym amnesia." Forgetting weights and losing track of progress was our bottleneck.
                      </p>
                      <p className="mt-3">
                        This isn't just an app—it's a tool for discipline, designed by <span className="font-medium text-zinc-900 dark:text-zinc-200">Subhadeep Mistri</span> to help us stay consistent.
                      </p>
                    </div>
                  </div>

                  {/* 3. Developer Profile */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                        <Code size={18} className="text-zinc-600 dark:text-zinc-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-white leading-tight">Subhadeep Mistri</h4>
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Lead Developer & Designer</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href="mailto:subhadeepmistri1990@gmail.com"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-sm font-semibold"
                      >
                        <Mail size={14} strokeWidth={2.5} />
                        Email
                      </a>
                      <a
                        href="tel:8250518317"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-semibold"
                      >
                        <Phone size={14} strokeWidth={2.5} />
                        Call
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4. Footer Credits - Restored Colors */}
                <div className="px-8 pb-8 pt-0 text-center">
                  <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest drop-shadow-sm">
                    CRAFTED BY <span className="text-pink-500">SEXIE</span> & <span className="text-red-500">SPIDEY</span>
                  </p>
                </div>

              </div>
            </div>
          </main>
        )}
      </div>


      {/* Bottom Navigation - Floating Glassmorphism Design */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50">
        <div className="flex items-center justify-between gap-1.5 px-3 py-3 rounded-[24px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] border border-zinc-200/50 dark:border-zinc-700/50 transition-all duration-300">

          {/* Workout Tab */}
          <button
            onClick={() => setActiveTab('workout')}
            className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-[16px] transition-all duration-300 ${activeTab === 'workout' ? 'flex-1 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            <Activity size={20} className={`transition-transform duration-300 ${activeTab === 'workout' ? 'scale-110' : 'scale-100'}`} strokeWidth={activeTab === 'workout' ? 2.5 : 2} />
            <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${activeTab === 'workout' ? 'opacity-100' : 'opacity-70'}`}>
              Workout
            </span>
          </button>

          {/* Home Button (Contextual) */}
          {currentLog && !isMinimized && (
            <button
              onClick={() => { setIsMinimized(true); setActiveTab('workout'); }}
              className="relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-[16px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
            >
              <Home size={20} />
              <span className="text-[10px] font-bold tracking-wide opacity-70">Home</span>
            </button>
          )}

          {/* Stats Tab */}
          <button
            onClick={() => setActiveTab('stats')}
            className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-[16px] transition-all duration-300 ${activeTab === 'stats' ? 'flex-1 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            <BarChart3 size={20} className={`transition-transform duration-300 ${activeTab === 'stats' ? 'scale-110' : 'scale-100'}`} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
            <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${activeTab === 'stats' ? 'opacity-100' : 'opacity-70'}`}>
              Stats
            </span>
          </button>

          {/* About Tab */}
          <button
            onClick={() => setActiveTab('about')}
            onTouchStart={() => setIsAboutPressed(true)}
            onTouchEnd={() => setIsAboutPressed(false)}
            onMouseDown={() => setIsAboutPressed(true)}
            onMouseUp={() => setIsAboutPressed(false)}
            onMouseLeave={() => setIsAboutPressed(false)}
            className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-[16px] transition-all duration-200 ${isAboutPressed
              ? 'bg-emerald-500 text-white scale-95 shadow-lg shadow-emerald-500/30'
              : activeTab === 'about'
                ? 'flex-1 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
              }`}
          >
            <Info size={20} className={`transition-transform duration-200 ${isAboutPressed || activeTab === 'about' ? 'scale-110' : 'scale-100'}`} strokeWidth={activeTab === 'about' ? 2.5 : 2} />
            <span className={`text-[10px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 ${isAboutPressed || activeTab === 'about' ? 'opacity-100' : 'opacity-70'}`}>About</span>
          </button>

        </div>
      </div>
    </div >
  );
}

export default App;
