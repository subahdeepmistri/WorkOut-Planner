/**
 * CreateRoutineWizard
 * Main wizard container for creating custom routines
 * Uses ReactDOM.createPortal for true fullscreen modal
 * 6-step wizard (removed redundant Movement Pattern step)
 */

import React, { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { RoutineCreationChoice } from './RoutineCreationChoice';
import { MuscleSelector, workoutFormats } from './MuscleSelector';
import { LevelSelector } from './LevelSelector';
import { ExercisePreferenceSelector } from './ExercisePreferenceSelector';
import { GenerateScreen } from './GenerateScreen';
import { RoutinePreview } from './RoutinePreview';
import { SaveRoutineScreen } from './SaveRoutineScreen';
import { WizardHeader } from './WizardHeader';
import { generateRoutine, regenerateMainWorkout, regenerateCoreSection, regenerateCardioSection } from '../../lib/routineGenerator';
import { MUSCLE_GROUPS } from '../../lib/fitnessConstants';
import {
    Dumbbell,
    BarChart3,
    Target,
    Sparkles,
    Eye,
    Save
} from 'lucide-react';

// Updated wizard steps with modern icons
const WIZARD_STEPS_CONFIG = [
    { id: 'focus', name: 'Focus', title: 'Choose Your Focus', Icon: Dumbbell },
    { id: 'level', name: 'Level', title: 'Experience Level', Icon: BarChart3 },
    { id: 'preference', name: 'Style', title: 'Exercise Style', Icon: Target },
    { id: 'generate', name: 'Generate', title: 'Generate Routine', Icon: Sparkles },
    { id: 'preview', name: 'Preview', title: 'Routine Preview', Icon: Eye },
    { id: 'save', name: 'Save', title: 'Save Routine', Icon: Save }
];

export function CreateRoutineWizard({ onSave, onCancel, onStartNow, onManualCreate }) {
    // Step 0 = choice screen, Steps 1-6 = AI wizard
    const [currentStep, setCurrentStep] = useState(0);

    // Wizard state - Quick Select and Custom are INDEPENDENT
    const [customMuscles, setCustomMuscles] = useState([]); // Custom tab: individual muscle selection
    const [selectedFormat, setSelectedFormat] = useState(null); // Quick Select tab: push/pull/legs/fullbody
    const [movementPattern, setMovementPattern] = useState(null);
    const [experienceLevel, setExperienceLevel] = useState(null);
    const [exercisePreference, setExercisePreference] = useState('balanced');
    const [includeCardio, setIncludeCardio] = useState(false);
    const [includeCore, setIncludeCore] = useState(false);

    // Generated routine
    const [generatedRoutine, setGeneratedRoutine] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // ─────────────────────────────────────────────────────────────────────────
    // CHOICE HANDLERS
    // ─────────────────────────────────────────────────────────────────────────

    const handleChooseAI = useCallback(() => {
        setCurrentStep(1);
    }, []);

    const handleChooseManual = useCallback(() => {
        if (onManualCreate) {
            onManualCreate();
        } else {
            onSave({
                id: `routine_${Date.now()}`,
                routineName: 'New Routine',
                exercises: [],
                totalTime: 0,
                totalSets: 0,
                totalExercises: 0,
                isAIGenerated: false
            });
        }
    }, [onManualCreate, onSave]);

    // ─────────────────────────────────────────────────────────────────────────
    // GET EFFECTIVE MUSCLE GROUPS (from Quick Select OR Custom)
    // ─────────────────────────────────────────────────────────────────────────

    const effectiveMuscles = useMemo(() => {
        // If format is selected, use preset muscles from that format
        if (selectedFormat && workoutFormats[selectedFormat]) {
            return workoutFormats[selectedFormat].presetMuscles;
        }
        // Otherwise use custom muscle selection
        return customMuscles;
    }, [selectedFormat, customMuscles]);

    const detectedPattern = useMemo(() => {
        if (movementPattern) return movementPattern; // Already set by user
        if (effectiveMuscles.length === 0) return 'mixed';
        const patterns = effectiveMuscles
            .filter(m => !['cardio', 'core'].includes(m))
            .map(m => MUSCLE_GROUPS[m]?.movementPattern);
        if (patterns.every(p => p === 'push')) return 'push';
        if (patterns.every(p => p === 'pull')) return 'pull';
        return 'mixed';
    }, [effectiveMuscles, movementPattern]);

    // ─────────────────────────────────────────────────────────────────────────
    // VALIDATION
    // ─────────────────────────────────────────────────────────────────────────

    const canProceed = useMemo(() => {
        switch (currentStep) {
            case 0: return true;
            case 1: {
                // Valid if Quick Select has a format OR Custom has muscles selected
                return selectedFormat !== null || customMuscles.length > 0;
            }
            case 2: return experienceLevel !== null;
            case 3: return exercisePreference !== null;
            case 4: return true;
            case 5: return generatedRoutine !== null;
            case 6: return generatedRoutine !== null;
            default: return false;
        }
    }, [currentStep, customMuscles, selectedFormat, experienceLevel, exercisePreference, generatedRoutine]);

    // ─────────────────────────────────────────────────────────────────────────
    // NAVIGATION
    // ─────────────────────────────────────────────────────────────────────────

    const goNext = useCallback(() => {
        if (currentStep === 4) {
            handleGenerate();
        } else if (currentStep < 6) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep]);

    const goBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const goToStep = useCallback((step) => {
        if (step >= 1 && step <= 6) {
            setCurrentStep(step);
        }
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    // GENERATE ROUTINE
    // ─────────────────────────────────────────────────────────────────────────

    const handleGenerate = useCallback(async () => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 1200));

        try {
            const routine = generateRoutine({
                muscleGroups: effectiveMuscles,
                level: experienceLevel,
                preference: exercisePreference,
                movementPattern: detectedPattern,
                includeCardio,
                includeCore,
                timeLimit: 65
            });
            setGeneratedRoutine(routine);
            setCurrentStep(5);
        } catch (error) {
            console.error('[Wizard] Generation failed:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [effectiveMuscles, experienceLevel, exercisePreference, detectedPattern, includeCardio, includeCore]);


    // ─────────────────────────────────────────────────────────────────────────
    // SECTION REGENERATION HANDLERS
    // ─────────────────────────────────────────────────────────────────────────

    const handleRegenerateMain = useCallback(() => {
        if (!generatedRoutine) return;

        const newExercises = regenerateMainWorkout(generatedRoutine);
        const newTotalSets = newExercises.reduce((sum, ex) => sum + ex.sets, 0);

        setGeneratedRoutine(prev => ({
            ...prev,
            exercises: newExercises,
            totalSets: newTotalSets,
            totalExercises: newExercises.length
        }));
    }, [generatedRoutine]);

    const handleRegenerateCore = useCallback(() => {
        if (!generatedRoutine) return;

        const newCoreFinishers = regenerateCoreSection(generatedRoutine.level);

        // Replace only core finishers, keep cardio
        const cardioFinishers = generatedRoutine.finishers?.filter(f => f.type === 'cardio') || [];

        setGeneratedRoutine(prev => ({
            ...prev,
            finishers: [...newCoreFinishers, ...cardioFinishers]
        }));
    }, [generatedRoutine]);

    const handleRegenerateCardio = useCallback(() => {
        if (!generatedRoutine) return;

        const newCardioFinisher = regenerateCardioSection(
            generatedRoutine.muscleGroups,
            generatedRoutine.level
        );

        // Replace only cardio finisher, keep core
        const coreFinishers = generatedRoutine.finishers?.filter(f => f.type === 'abs' || f.type === 'core') || [];

        setGeneratedRoutine(prev => ({
            ...prev,
            finishers: [...coreFinishers, newCardioFinisher]
        }));
    }, [generatedRoutine]);

    // ─────────────────────────────────────────────────────────────────────────
    // SAVE ROUTINE
    // ─────────────────────────────────────────────────────────────────────────

    const handleSave = useCallback((routineName) => {
        if (!generatedRoutine) return;
        onSave({ ...generatedRoutine, routineName });
    }, [generatedRoutine, onSave]);

    const handleStartNow = useCallback((routineName) => {
        if (!generatedRoutine) return;
        const routineToSave = { ...generatedRoutine, routineName };
        if (onStartNow) {
            onStartNow(routineToSave);
        } else {
            onSave(routineToSave);
        }
    }, [generatedRoutine, onSave, onStartNow]);

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER CURRENT STEP
    // ─────────────────────────────────────────────────────────────────────────

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <RoutineCreationChoice
                        onChooseAI={handleChooseAI}
                        onChooseManual={handleChooseManual}
                        onCancel={onCancel}
                    />
                );
            case 1:
                return (
                    <MuscleSelector
                        customMuscles={customMuscles}
                        onCustomMusclesChange={setCustomMuscles}
                        selectedFormat={selectedFormat}
                        onFormatChange={setSelectedFormat}
                        includeCardio={includeCardio}
                        onCardioChange={setIncludeCardio}
                        includeCore={includeCore}
                        onCoreChange={setIncludeCore}
                        onPatternChange={setMovementPattern}
                    />
                );
            case 2:
                return (
                    <LevelSelector
                        selected={experienceLevel}
                        onChange={setExperienceLevel}
                    />
                );
            case 3:
                return (
                    <ExercisePreferenceSelector
                        selected={exercisePreference}
                        onChange={setExercisePreference}
                    />
                );
            case 4:
                return (
                    <GenerateScreen
                        config={{
                            muscleGroups: effectiveMuscles,
                            movementPattern: detectedPattern,
                            level: experienceLevel,
                            preference: exercisePreference,
                            includeCardio,
                            includeCore,
                            formatName: selectedFormat ? workoutFormats[selectedFormat]?.name : null
                        }}
                        isGenerating={isGenerating}
                        onGenerate={handleGenerate}
                        onEdit={() => setCurrentStep(1)}
                    />
                );
            case 5:
                return (
                    <RoutinePreview
                        routine={generatedRoutine}
                        onContinue={() => setCurrentStep(6)}
                        onRegenerateMain={handleRegenerateMain}
                        onRegenerateCore={handleRegenerateCore}
                        onRegenerateCardio={handleRegenerateCardio}
                    />
                );
            case 6:
                return (
                    <SaveRoutineScreen
                        routine={generatedRoutine}
                        onSave={handleSave}
                        onStartNow={handleStartNow}
                        onCancel={onCancel}
                    />
                );
            default:
                return null;
        }
    };

    const getHeaderTitle = () => {
        if (currentStep === 0) return 'Create Routine';
        return WIZARD_STEPS_CONFIG[currentStep - 1]?.title || '';
    };

    // ─────────────────────────────────────────────────────────────────────────
    // PORTAL RENDER
    // ─────────────────────────────────────────────────────────────────────────

    const wizardContent = (
        <div
            className="fixed inset-0 z-[9999] flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-900 to-black"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                minHeight: '-webkit-fill-available'
            }}
        >
            {/* Header */}
            {currentStep === 0 ? (
                <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800/50 bg-zinc-900/95 backdrop-blur-xl">
                    <button
                        onClick={onCancel}
                        className="w-10 h-10 rounded-full flex items-center justify-center
                       bg-zinc-800/60 text-zinc-400 
                       hover:bg-zinc-700 hover:text-white 
                       active:scale-95 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-base font-bold text-white tracking-wide uppercase">
                        Create Routine
                    </h2>
                    <div className="w-10" />
                </div>
            ) : (
                <WizardHeader
                    currentStep={currentStep}
                    totalSteps={6}
                    title={getHeaderTitle()}
                    onClose={onCancel}
                    onStepClick={goToStep}
                    steps={WIZARD_STEPS_CONFIG}
                />
            )}

            {/* Scrollable content */}
            <div
                className="flex-1 overflow-y-auto overscroll-contain"
                style={{
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    paddingTop: '24px',
                    paddingBottom: currentStep > 0 && currentStep < 4 ? '120px' : '24px'
                }}
            >
                <div className="max-w-md mx-auto">
                    {renderStep()}
                </div>
            </div>

            {/* Footer navigation (steps 1-3) */}
            {currentStep > 0 && currentStep < 4 && (
                <div
                    className="bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800/50"
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '16px',
                        paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
                    }}
                >
                    <div className="flex items-center justify-between max-w-md mx-auto gap-4">
                        <button
                            onClick={goBack}
                            className="px-5 py-3 rounded-xl font-semibold text-zinc-300 
                         bg-zinc-800/60 hover:bg-zinc-700 
                         active:scale-95 transition-all duration-200"
                        >
                            ← Back
                        </button>

                        <div className="flex-1 text-center">
                            <span className="text-zinc-500 text-sm font-medium">
                                Step {currentStep} of 6
                            </span>
                        </div>

                        <button
                            onClick={goNext}
                            disabled={!canProceed}
                            className={`
                px-6 py-3 rounded-xl font-bold transition-all duration-200
                ${canProceed
                                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-emerald-400 active:scale-95'
                                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                }
              `}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return ReactDOM.createPortal(wizardContent, document.body);
}

export default CreateRoutineWizard;
