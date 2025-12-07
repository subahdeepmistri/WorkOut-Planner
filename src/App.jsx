import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Dumbbell, TrendingUp, Activity, Trash2, CheckCircle, Plus, Home, PlayCircle, Trophy, Code, Timer } from 'lucide-react';
import MilesSticker from './assets/miles_sticker.png';
import GwenSticker from './assets/gwen_sticker.png';

// Hooks
import { useWorkoutData, WORKOUT_PLANS } from './hooks/useWorkoutData';
import { useRestTimer } from './hooks/useRestTimer';

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

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'stats'
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Core Logic Hook
  const {
    workoutData, savedPlans, activePlanId, setActivePlanId,
    currentLog, isLocked, pendingSuperset,
    initializeDailyLog, updateSet, updateCardioMode, addSet, removeSet,
    addExercise, removeExercise, updateExerciseName, handleLinkAction,
    saveCustomRoutine, toggleLock, deleteRoutine, discardWorkout, finishSession,
    getPreviousBest, userProfile, setUserProfile, availablePlans,
    changePlan, saveAsNewPlan, startTimer, workoutStartTime, toggleExerciseLock
  } = useWorkoutData(selectedDate);

  // Global Rest Timer Hook
  const { isActive: isTimerActive, timeLeft, startRest, addTime, stopRest, activeContext } = useRestTimer();




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
    initializeDailyLog(); // Hook handles logic
    setIsMinimized(false);
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
    <div className="relative min-h-screen font-sans pb-24">
      <BackgroundController profile={userProfile} />

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
      <div className="relative z-10 min-h-screen text-zinc-100 pb-24 w-full max-w-[800px] mx-auto px-3">

        {/* Tab: Workout */}
        {activeTab === 'workout' ? (
          <>
            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-md border-b p-4 -mx-3 px-6 transition-colors duration-500 ${userProfile === 'gwen' ? 'bg-zinc-950/70 border-pink-500/30' : 'bg-zinc-950/70 border-zinc-800'}`}>

              {/* Profile Toggle & Branding */}
              {/* Profile Toggle & Branding */}
              <div className="flex flex-wrap items-center justify-between mb-4 pt-1 gap-2">
                <div className="text-left">
                  <h1 className={`text-2xl sm:text-4xl font-black italic tracking-tighter transition-colors duration-500 pr-2 sm:pr-6 ${userProfile === 'gwen' ? 'text-transparent bg-clip-text bg-gradient-to-br from-white via-pink-500 to-cyan-400 drop-shadow-[3px_3px_0px_#000000]' : 'text-transparent bg-clip-text bg-gradient-to-b from-[#ff3333] to-[#cc0000] drop-shadow-[3px_3px_0px_#000000]'}`} style={{ transform: 'skew(-10deg)' }}>
                    {userProfile === 'gwen' ? 'GHOST-SPIDER' : 'MILES MORALES'}
                  </h1>
                  <div className={`text-[9px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.3em] mt-1 uppercase transition-colors duration-500 ${userProfile === 'gwen' ? 'text-cyan-400' : 'text-zinc-400'}`}>
                    {userProfile === 'gwen' ? 'Multiverse-Training' : 'Ghost-Rider Protocol'}
                  </div>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setShowAboutModal(true)}
                    className="flex flex-col items-center gap-0.5 group"
                    title="About Developer"
                  >
                    <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-emerald-500/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                      <Code size={18} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-[0.15em] text-zinc-600 group-hover:text-emerald-500/80 transition-colors">About</span>
                  </button>

                  {/* Switcher - Increased Touch Target */}
                  <button
                    onClick={() => (!currentLog || isMinimized) && setUserProfile(p => p === 'miles' ? 'gwen' : 'miles')}
                    disabled={!!currentLog && !isMinimized}
                    className={`relative w-16 h-10 mt-[2px] rounded-full transition-all duration-500 border ${!!currentLog && !isMinimized ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 cursor-pointer'
                      } ${userProfile === 'gwen' ? 'bg-pink-900/20 border-pink-500/50' : 'bg-red-900/20 border-red-500/50'
                      }`}
                  >
                    <div className={`absolute top-1 left-1 w-8 h-8 rounded-full shadow-md transition-transform duration-500 flex items-center justify-center text-xs font-bold ${userProfile === 'gwen' ? 'translate-x-6 bg-cyan-400 text-black' : 'translate-x-0 bg-red-600 text-white'}`}>
                      {userProfile === 'gwen' ? 'G' : 'M'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Nav */}
              <div className={`flex items-center justify-between sm:justify-start gap-0.5 sm:gap-4 backdrop-blur-md p-0.5 sm:p-2 sm:pl-4 sm:pr-2 rounded-full border transition-colors duration-500 max-w-full ${userProfile === 'gwen' ? 'bg-black/40 border-pink-500/30' : 'bg-red-950/30 border-red-500/30'}`}>
                <button onClick={() => changeDate(-1)} className="text-zinc-400 hover:text-white transition-colors flex-shrink-0 p-1"><ChevronLeft size={20} /></button>
                <div className="flex flex-col items-center flex-shrink-0 px-1">
                  <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors duration-500 hidden sm:block ${userProfile === 'gwen' ? 'text-pink-400' : 'text-red-500'}`}>Today</span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-200 whitespace-nowrap">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
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
                    return s.getTime() >= t.getTime() ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:text-white';
                  })()}`}
                >
                  <ChevronRight size={20} />
                </button>
                <div className="w-px h-6 bg-zinc-800 mx-0.5 flex-shrink-0 hidden sm:block"></div>
                <button onClick={() => setShowCalendar(true)} className={`p-1.5 rounded-full transition-all flex-shrink-0 ${userProfile === 'gwen' ? 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}><Calendar size={18} /></button>



                {/* Workout Timer in Header */}
                {currentLog && !isMinimized && (
                  <>
                    <div className="w-px h-6 bg-zinc-800 mx-0.5 flex-shrink-0 hidden sm:block"></div>
                    <WorkoutTimer startTime={currentLog.startTime} endTime={currentLog.endTime} className="text-xs sm:text-sm flex-shrink-0 ml-1" />
                  </>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800/50 min-h-[52px]">
                {isTimerActive && !activeContext ? (
                  /* --- Active Rest Timer Display --- */
                  <div className="w-full">
                    <RestTimer
                      timeLeft={timeLeft}
                      onAdd={addTime}
                      onStop={stopRest}
                    />
                  </div>
                ) : (
                  /* --- Normal Controls --- */
                  <>
                    {currentLog && !isMinimized ? (
                      <button
                        onClick={() => setShowDiscardConfirm(true)}
                        disabled={isLocked}
                        className={`text-xs flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full ${isLocked
                          ? 'text-zinc-600 bg-zinc-800/50 cursor-not-allowed opacity-50'
                          : 'text-red-500/70 hover:text-red-400 bg-red-500/10'
                          }`}
                      >
                        <Trash2 size={12} /> Discard
                      </button>
                    ) : <div></div>}
                    {currentLog && !isMinimized ? (
                      <button
                        onClick={() => startRest(60)}
                        className="text-xs flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full text-cyan-500/70 hover:text-cyan-400 bg-cyan-900/20"
                      >
                        <Timer size={12} /> Rest 60s
                      </button>
                    ) : <div></div>}
                  </>
                )}
              </div>
            </header>

            {/* Session Adherence Bar (Volume Based) */}
            {currentLog && !isMinimized && (() => {
              let totalTargetReps = 0;
              let totalActualReps = 0;

              currentLog.exercises.forEach(ex => {
                // Target: Sets * Reps
                const tReps = ex.numericalTargetReps || 8;
                const tSets = ex.targetSets || 3;
                totalTargetReps += (tSets * tReps);

                // Actual: Sum of completed reps
                ex.sets.forEach(s => {
                  if (s.completed) {
                    if (ex.type === 'cardio') {
                      totalActualReps += tReps;
                    } else if (ex.type === 'abs') {
                      let val = (parseFloat(s.reps) || parseFloat(s.holdTime) || 0);
                      if (val === 0) val = tReps;
                      totalActualReps += val;
                    } else {
                      let val = (parseFloat(s.reps) || 0);
                      if (val === 0) val = tReps; // Auto-fill if checked but empty
                      totalActualReps += val;
                    }
                  }
                });
              });

              // Avoid visual glitches if target is 0
              if (totalTargetReps === 0) totalTargetReps = 1;

              return (
                <div className="sticky top-16 z-30 mb-6 -mx-4 px-4 py-2 bg-black/60 backdrop-blur-xl border-y border-zinc-800/50">
                  <AdherenceBar
                    targetVolume={totalTargetReps}
                    actualVolume={totalActualReps}
                    label="Session Intensity"
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
                      <div className="relative bg-zinc-950/90 backdrop-blur-xl rounded-[15px] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 overflow-hidden">

                        {/* Animated Icon BG */}
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10 flex-1 text-center sm:text-left">
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase">Session Active</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black italic text-white tracking-tight mb-1">{currentLog.templateName}</h3>
                          <p className="text-zinc-400 text-xs">Resuming will take you back to your active sets.</p>
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
                    <h2 className="text-3xl sm:text-4xl font-black italic tracking-normal sm:tracking-tighter text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transform -skew-x-6 pr-2">
                      START <span className={`text-transparent bg-clip-text bg-gradient-to-r ${userProfile === 'gwen' ? 'from-white via-pink-400 to-cyan-400 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]' : 'from-white via-red-500 to-red-600 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]'}`}>WORKOUT</span>
                    </h2>
                    <p className="text-zinc-500 font-bold tracking-[0.2em] text-[10px] uppercase mt-1">Choose your protocol</p>
                  </div>

                  {isBuilderOpen ? (
                    <RoutineBuilder onSave={handleCustomSave} onCancel={() => setIsBuilderOpen(false)} />
                  ) : (
                    <div className="relative p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">

                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 block ml-1">Select Routine</label>

                      <div className="flex gap-3 mb-6">
                        <div className="relative flex-grow group">
                          <select
                            value={activePlanId}
                            onChange={(e) => setActivePlanId(e.target.value)}
                            className="w-full appearance-none bg-zinc-900/80 border border-zinc-700/50 text-white text-lg font-bold py-4 px-6 rounded-xl focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
                          >
                            <optgroup label="Default Plans" className="bg-zinc-900 text-zinc-400">
                              {availablePlans.map(plan => (<option key={plan.id} value={plan.id} className="text-white bg-zinc-900">{plan.name}</option>))}
                            </optgroup>
                            {savedPlans.length > 0 && (
                              <optgroup label="My Custom Routines" className="bg-zinc-900 text-zinc-400">
                                {savedPlans.map(plan => (<option key={plan.id} value={plan.id} className="text-white bg-zinc-900">{plan.name}</option>))}
                              </optgroup>
                            )}
                          </select>
                          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-white transition-colors">
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
                          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
                          : userProfile === 'gwen'
                            ? 'bg-gradient-to-r from-pink-500 to-cyan-400 text-black hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] border-0'
                            : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] border-0'
                          }`}
                      >
                        {!!currentLog ? 'SESSION ACTIVE' : 'LOAD ROUTINE'}
                      </Button>

                      <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-zinc-800/50"></div>
                        <span className="flex-shrink-0 mx-4 text-zinc-600 text-[10px] font-bold tracking-[0.2em] uppercase">OR</span>
                        <div className="flex-grow border-t border-zinc-800/50"></div>
                      </div>

                      <Button
                        variant="secondary"
                        onClick={() => setIsBuilderOpen(true)}
                        className={`w-full py-4 relative group overflow-hidden border-0 bg-zinc-900/50 ${userProfile === 'gwen' ? 'hover:bg-pink-900/10' : 'hover:bg-red-900/10'} transition-all duration-300`}
                      >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${userProfile === 'gwen' ? 'from-pink-500/10 via-transparent to-cyan-500/10' : 'from-red-500/10 via-transparent to-orange-500/10'}`} />
                        <div className={`absolute inset-0 border border-dashed opacity-30 group-hover:opacity-60 transition-all ${userProfile === 'gwen' ? 'border-pink-500' : 'border-red-500'} rounded-xl`} />

                        <span className={`relative z-10 flex items-center justify-center gap-2 font-bold tracking-wide group-hover:tracking-[0.2em] transition-all duration-300 ${userProfile === 'gwen' ? 'text-pink-400 group-hover:text-pink-300' : 'text-red-500 group-hover:text-red-400'}`}>
                          <Plus size={18} />
                          CREATE CUSTOM
                        </span>
                      </Button>
                    </div>

                  )}
                </div>
              ) : (
                /* Active Workout View */
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-y-3">
                    <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-md">{currentLog.templateName}</h2>
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

                    <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 flex flex-col items-center gap-4 text-center">
                      {isLocked ? (
                        <>
                          <div className="text-green-500 flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><CheckCircle size={24} /></div>
                            <h3 className="text-xl font-bold">Workout Complete!</h3>
                          </div>
                          <p className="text-zinc-400 text-sm">Great job! This workout is locked and saved.</p>
                          <Button onClick={toggleLock} className="w-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700">Unlock to Edit</Button>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-white">Finished Training?</h3>
                          <p className="text-zinc-500 text-sm">Lock your workout to save progress and prevent accidental edits.</p>
                          <Button
                            onClick={handleFinishWorkout}
                            variant="ghost"
                            className="group w-full py-5 bg-zinc-950 border border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:border-emerald-400 active:scale-[0.98] active:bg-zinc-950 transition-all duration-300 rounded-xl relative overflow-hidden"
                          >
                            {/* Scanline/Grid Effect Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                            <div className="flex items-center justify-center gap-4 relative z-10">
                              <Trophy size={24} className="text-emerald-400 group-hover:text-emerald-300 transition-colors drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
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
            <StatsView workoutData={workoutData} />
          </main>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-800 p-2 z-50">
        <div className="max-w-[800px] mx-auto flex justify-around items-end relative">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${activeTab === 'workout' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Dumbbell size={24} />
            <span className="text-[10px] uppercase font-bold mt-1">Workout</span>
          </button>

          {/* Home Button in Bottom Bar */}
          {currentLog && !isMinimized && <button
            onClick={() => setIsMinimized(true)}
            className="flex flex-col items-center p-3 rounded-lg transition-colors text-zinc-500 hover:text-zinc-300"
          >
            <Home size={24} />
            <span className="text-[10px] uppercase font-bold mt-1">Home</span>
          </button>
          }

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${activeTab === 'stats' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
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
