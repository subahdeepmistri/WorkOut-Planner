import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Dumbbell, TrendingUp, Activity, Trash2, CheckCircle, Plus } from 'lucide-react';

// Hooks
import { useWorkoutData, WORKOUT_PLANS } from './hooks/useWorkoutData';
import { useRestTimer } from './hooks/useRestTimer';

// Components
import { BackgroundController } from './components/layout/BackgroundController';
import { Button } from './components/ui/Button';
import { DeleteConfirmationModal } from './components/ui/DeleteConfirmationModal';
import { CalendarModal } from './components/ui/CalendarModal';
import { ExerciseCard } from './components/workout/ExerciseCard';
import { RestTimer } from './components/workout/RestTimer';
import { RoutineBuilder } from './components/workout/RoutineBuilder';
import { StatsView } from './components/stats/StatsView';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'stats'
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  // Core Logic Hook
  const {
    workoutData, savedPlans, activePlanId, setActivePlanId,
    currentLog, isLocked, pendingSuperset,
    initializeDailyLog, updateSet, updateCardioMode, addSet,
    addExercise, removeExercise, updateExerciseName, handleLinkAction,
    saveCustomRoutine, toggleLock, deleteRoutine, discardWorkout,
    getPreviousBest, userProfile, setUserProfile, availablePlans
  } = useWorkoutData(selectedDate);

  // Timer Hook
  const {
    isActive: isTimerActive, timeLeft: timerTimeLeft, startTimer, stopTimer, adjustTime
  } = useRestTimer();

  // Helper State
  const isCustomSelected = savedPlans.some(p => p.id === activePlanId);

  // Handlers
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const loadRoutine = () => {
    initializeDailyLog(); // Hook handles logic
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

      {isTimerActive && (
        <RestTimer
          timeLeft={timerTimeLeft}
          onAdd={adjustTime}
          onSubtract={(amount) => adjustTime(-amount)}
          onStop={stopTimer}
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
              <div className="flex items-center justify-between mb-4 pt-1">
                <div className="text-left">
                  <h1 className={`text-4xl font-black italic tracking-tighter transition-colors duration-500 pr-6 ${userProfile === 'gwen' ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 drop-shadow-[0_2px_10px_rgba(236,72,153,0.5)]' : 'text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]'}`} style={{ transform: 'skew(-10deg)' }}>
                    {userProfile === 'gwen' ? 'GHOST-SPIDER' : 'MILES'}
                  </h1>
                  <div className={`text-[10px] font-bold tracking-[0.3em] mt-1 uppercase transition-colors duration-500 ${userProfile === 'gwen' ? 'text-cyan-400' : 'text-zinc-400'}`}>
                    {userProfile === 'gwen' ? 'Multiverse-Training' : 'Ghost-Rider Protocol'}
                  </div>
                </div>

                {/* Switcher */}
                <button
                  onClick={() => !currentLog && setUserProfile(p => p === 'miles' ? 'gwen' : 'miles')}
                  disabled={!!currentLog}
                  className={`relative w-14 h-8 rounded-full transition-all duration-500 border ${currentLog ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 cursor-pointer'
                    } ${userProfile === 'gwen' ? 'bg-pink-900/20 border-pink-500/50' : 'bg-red-900/20 border-red-500/50'
                    }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 rounded-full shadow-md transition-transform duration-500 flex items-center justify-center text-[10px] font-bold ${userProfile === 'gwen' ? 'translate-x-6 bg-cyan-400 text-black' : 'translate-x-0 bg-red-600 text-white'}`}>
                    {userProfile === 'gwen' ? 'G' : 'M'}
                  </div>
                </button>
              </div>

              {/* Date Nav */}
              <div className={`flex items-center gap-4 backdrop-blur-md p-2 pl-4 pr-2 rounded-full border transition-colors duration-500 ${userProfile === 'gwen' ? 'bg-black/40 border-pink-500/30' : 'bg-red-950/30 border-red-500/30'}`}>
                <button onClick={() => changeDate(-1)} className="text-zinc-400 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
                <div className="flex flex-col items-center min-w-[120px]">
                  <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-500 ${userProfile === 'gwen' ? 'text-pink-400' : 'text-red-500'}`}>Today's Workout</span>
                  <span className="text-sm font-bold text-zinc-200">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <button onClick={() => changeDate(1)} className="text-zinc-400 hover:text-white transition-colors"><ChevronRight size={20} /></button>
                <div className="w-px h-6 bg-zinc-800 mx-1"></div>
                <button onClick={() => setShowCalendar(true)} className={`p-2 rounded-full transition-all ${userProfile === 'gwen' ? 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}><Calendar size={18} /></button>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800/50">
                {currentLog ? (
                  <button onClick={() => setShowDiscardConfirm(true)} className="text-xs text-red-500/70 hover:text-red-400 flex items-center gap-1 transition-colors bg-red-500/10 px-3 py-1.5 rounded-full"><Trash2 size={12} /> Discard</button>
                ) : <div></div>}
                <div></div>
              </div>
            </header>

            <main className="py-6">
              {!currentLog ? (
                /* Empty State / Routine Selection */
                <div className="flex flex-col gap-6 py-10 px-2">
                  <div className="text-center space-y-2 mb-2">
                    <Dumbbell size={48} className="mx-auto text-zinc-400" />
                    <h2 className="text-xl font-bold text-zinc-200">Start Workout</h2>
                    <p className="text-zinc-400 text-sm">Routine vs. Reality Tracker</p>
                  </div>

                  {isBuilderOpen ? (
                    <RoutineBuilder onSave={handleCustomSave} onCancel={() => setIsBuilderOpen(false)} />
                  ) : (
                    <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-6 shadow-lg backdrop-blur-md">
                      <label className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-3 block">Select Your Plan</label>
                      <div className="flex gap-2 mb-4">
                        <div className="relative flex-grow">
                          <select
                            value={activePlanId}
                            onChange={(e) => setActivePlanId(e.target.value)}
                            className="w-full appearance-none bg-zinc-950/80 border border-zinc-700 text-zinc-100 py-3 px-4 rounded-lg focus:outline-none focus:border-zinc-500 font-medium"
                          >
                            <optgroup label="Default Plans">
                              {availablePlans.map(plan => (<option key={plan.id} value={plan.id}>{plan.name}</option>))}
                            </optgroup>
                            {savedPlans.length > 0 && (
                              <optgroup label="My Custom Routines">
                                {savedPlans.map(plan => (<option key={plan.id} value={plan.id}>{plan.name}</option>))}
                              </optgroup>
                            )}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"><Activity size={16} /></div>
                        </div>
                        {isCustomSelected && (
                          <button onClick={() => setShowDeleteConfirm(true)} className="px-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center" title="Delete this routine">
                            <Trash2 size={20} />
                          </button>
                        )}
                      </div>

                      <Button onClick={loadRoutine} className="w-full bg-zinc-100 text-black hover:bg-zinc-200 py-3">Load Routine</Button>

                      <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-zinc-800"></div>
                        <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs">OR</span>
                        <div className="flex-grow border-t border-zinc-800"></div>
                      </div>

                      <Button variant="secondary" onClick={() => setIsBuilderOpen(true)} className="w-full py-3 border border-zinc-700 border-dashed bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white">
                        <Plus size={16} /> Create Custom Routine
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
                      onLink={handleLinkAction}
                      previousBest={getPreviousBest(exercise.name)}
                      onRemove={removeExercise}
                      onCardioMode={updateCardioMode}
                      onUpdateName={updateExerciseName}
                      pendingSuperset={pendingSuperset}
                      disabled={isLocked}
                      onStartRest={startTimer}
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
                          <Button onClick={toggleLock} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg border-none shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                            Finish & Save Workout
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </main>
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
        <div className="max-w-[800px] mx-auto flex justify-around">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${activeTab === 'workout' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Dumbbell size={24} />
            <span className="text-[10px] uppercase font-bold mt-1">Workout</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${activeTab === 'stats' ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <TrendingUp size={24} />
            <span className="text-[10px] uppercase font-bold mt-1">Stats</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
