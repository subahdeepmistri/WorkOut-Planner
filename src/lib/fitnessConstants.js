/**
 * Fitness Constants
 * Core configuration for workout generation and validation
 */

// ═══════════════════════════════════════════════════════════════════════════
// MUSCLE GROUPS
// ═══════════════════════════════════════════════════════════════════════════

export const MUSCLE_GROUPS = {
    legs: {
        id: 'legs',
        name: 'Legs',
        icon: '🦵',
        color: 'violet',
        colorClasses: {
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/30',
            text: 'text-violet-400',
            accent: 'violet-500'
        },
        movementPattern: 'mixed',
        subgroups: ['quads', 'hamstrings', 'glutes', 'calves']
    },
    chest: {
        id: 'chest',
        name: 'Chest',
        icon: '💪',
        color: 'blue',
        colorClasses: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/30',
            text: 'text-blue-400',
            accent: 'blue-500'
        },
        movementPattern: 'push',
        subgroups: ['upper chest', 'mid chest', 'lower chest']
    },
    back: {
        id: 'back',
        name: 'Back',
        icon: '🔙',
        color: 'emerald',
        colorClasses: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            accent: 'emerald-500'
        },
        movementPattern: 'pull',
        subgroups: ['lats', 'traps', 'rhomboids', 'erectors']
    },
    shoulders: {
        id: 'shoulders',
        name: 'Shoulders',
        icon: '🔺',
        color: 'amber',
        colorClasses: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
            text: 'text-amber-400',
            accent: 'amber-500'
        },
        movementPattern: 'push',
        subgroups: ['front delts', 'side delts', 'rear delts']
    },
    arms: {
        id: 'arms',
        name: 'Arms',
        icon: '💪',
        color: 'red',
        colorClasses: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            text: 'text-red-400',
            accent: 'red-500'
        },
        movementPattern: 'mixed',
        subgroups: ['biceps', 'triceps', 'forearms']
    },
    cardio: {
        id: 'cardio',
        name: 'Cardio',
        icon: '❤️‍🔥',
        color: 'pink',
        colorClasses: {
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/30',
            text: 'text-pink-400',
            accent: 'pink-500'
        },
        movementPattern: 'neutral',
        isFinisher: true,
        subgroups: ['hiit', 'steady-state', 'circuits']
    },
    core: {
        id: 'core',
        name: 'Core',
        icon: '🎯',
        color: 'cyan',
        colorClasses: {
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/30',
            text: 'text-cyan-400',
            accent: 'cyan-500'
        },
        movementPattern: 'neutral',
        isFinisher: true,
        subgroups: ['abs', 'obliques', 'lower back']
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIENCE LEVELS
// ═══════════════════════════════════════════════════════════════════════════

export const EXPERIENCE_LEVELS = {
    beginner: {
        id: 'beginner',
        name: 'Beginner',
        description: '0–6 months training',
        subtext: 'Safe exercises, more rest',
        dots: 1,
        color: 'emerald',
        colorClasses: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/30',
            text: 'text-emerald-400'
        },
        constraints: {
            maxExercisesPerMuscle: 3,
            maxSetsPerExercise: 3,
            maxTotalSets: 18,
            restBetweenSets: { min: 90, max: 180 },
            compoundRatio: 0.8
        }
    },
    moderate: {
        id: 'moderate',
        name: 'Moderate',
        description: '6–18 months training',
        subtext: 'Balanced compound/isolation',
        dots: 2,
        color: 'amber',
        colorClasses: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/30',
            text: 'text-amber-400'
        },
        constraints: {
            maxExercisesPerMuscle: 4,
            maxSetsPerExercise: 4,
            maxTotalSets: 24,
            restBetweenSets: { min: 60, max: 150 },
            compoundRatio: 0.6
        }
    },
    advanced: {
        id: 'advanced',
        name: 'Advanced',
        description: '18+ months training',
        subtext: 'High volume, short rest',
        dots: 3,
        color: 'red',
        colorClasses: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            text: 'text-red-400'
        },
        constraints: {
            maxExercisesPerMuscle: 5,
            maxSetsPerExercise: 5,
            maxTotalSets: 30,
            restBetweenSets: { min: 45, max: 180 },
            compoundRatio: 0.5
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// MOVEMENT PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

export const MOVEMENT_PATTERNS = {
    push: {
        id: 'push',
        name: 'Push',
        icon: '→',
        description: 'Chest, Shoulders, Triceps',
        color: 'blue'
    },
    pull: {
        id: 'pull',
        name: 'Pull',
        icon: '←',
        description: 'Back, Biceps, Rear Delts',
        color: 'emerald'
    },
    mixed: {
        id: 'mixed',
        name: 'Mixed',
        icon: '↔',
        description: 'Antagonist pairing',
        color: 'violet'
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE PREFERENCES
// ═══════════════════════════════════════════════════════════════════════════

export const EXERCISE_PREFERENCES = {
    compound: {
        id: 'compound',
        name: 'Compound Focus',
        icon: '🏋️',
        description: 'Multi-joint movements',
        subtext: 'Best for strength & efficiency'
    },
    balanced: {
        id: 'balanced',
        name: 'Balanced',
        icon: '⚖️',
        description: 'Mix of compound + isolation',
        subtext: 'Recommended for most goals'
    },
    isolation: {
        id: 'isolation',
        name: 'Isolation Focus',
        icon: '🎯',
        description: 'Single-joint movements',
        subtext: 'Best for targeting weak points'
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// TIME CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const TIME_CONSTANTS = {
    // Maximum session time (hard limit)
    MAX_TOTAL_TIME: 90,

    // Time allocations (in minutes)
    WARMUP_TIME: { min: 10, max: 15, default: 12 },
    WORKOUT_TIME: { min: 45, max: 65, default: 60 },
    COOLDOWN_TIME: { min: 5, max: 15, default: 10 },

    // Time per set by exercise type (in seconds)
    TIME_PER_SET: {
        primaryCompound: 55,
        secondaryCompound: 45,
        heavyIsolation: 40,
        lightIsolation: 30,
        hiit: 30,
        dynamicCore: 25,
        isometricCore: 45
    },

    // Rest times by exercise type and level (in seconds)
    REST_TIMES: {
        primaryCompound: { beginner: 180, moderate: 150, advanced: 120 },
        secondaryCompound: { beginner: 150, moderate: 120, advanced: 90 },
        heavyIsolation: { beginner: 90, moderate: 75, advanced: 60 },
        lightIsolation: { beginner: 60, moderate: 45, advanced: 45 },
        hiit: { beginner: 60, moderate: 45, advanced: 30 },
        dynamicCore: { beginner: 45, moderate: 30, advanced: 30 },
        isometricCore: { beginner: 45, moderate: 30, advanced: 30 }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export const EXERCISE_TYPES = {
    primaryCompound: {
        id: 'primaryCompound',
        name: 'Primary Compound',
        tag: 'COMPOUND',
        priority: 1,
        defaultSets: { beginner: 3, moderate: 4, advanced: 5 },
        defaultReps: { beginner: '8-10', moderate: '6-8', advanced: '5' }
    },
    secondaryCompound: {
        id: 'secondaryCompound',
        name: 'Secondary Compound',
        tag: 'COMPOUND',
        priority: 2,
        defaultSets: { beginner: 3, moderate: 4, advanced: 4 },
        defaultReps: { beginner: '10-12', moderate: '8-10', advanced: '8-10' }
    },
    heavyIsolation: {
        id: 'heavyIsolation',
        name: 'Heavy Isolation',
        tag: 'ISOLATION',
        priority: 3,
        defaultSets: { beginner: 3, moderate: 3, advanced: 4 },
        defaultReps: { beginner: '12-15', moderate: '10-12', advanced: '10-12' }
    },
    lightIsolation: {
        id: 'lightIsolation',
        name: 'Light Isolation',
        tag: 'ISOLATION',
        priority: 4,
        defaultSets: { beginner: 2, moderate: 3, advanced: 3 },
        defaultReps: { beginner: '15-20', moderate: '12-15', advanced: '12-15' }
    },
    hiit: {
        id: 'hiit',
        name: 'HIIT',
        tag: 'CARDIO',
        priority: 5,
        defaultSets: { beginner: 8, moderate: 10, advanced: 12 },
        defaultReps: { beginner: '20s/40s', moderate: '30s/30s', advanced: '30s/20s' }
    },
    steadyState: {
        id: 'steadyState',
        name: 'Steady State',
        tag: 'CARDIO',
        priority: 5,
        defaultSets: { beginner: 1, moderate: 1, advanced: 1 },
        defaultReps: { beginner: '15 min', moderate: '12 min', advanced: '10 min' }
    },
    dynamicCore: {
        id: 'dynamicCore',
        name: 'Dynamic Core',
        tag: 'CORE',
        priority: 6,
        defaultSets: { beginner: 3, moderate: 3, advanced: 4 },
        defaultReps: { beginner: '12-15', moderate: '15-20', advanced: '15-20' }
    },
    isometricCore: {
        id: 'isometricCore',
        name: 'Isometric Core',
        tag: 'CORE',
        priority: 6,
        defaultSets: { beginner: 3, moderate: 3, advanced: 4 },
        defaultReps: { beginner: '30s', moderate: '45s', advanced: '60s' }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// WIZARD STEPS
// ═══════════════════════════════════════════════════════════════════════════

export const WIZARD_STEPS = [
    { id: 1, name: 'Muscles', icon: '💪', title: 'Choose Your Focus' },
    { id: 2, name: 'Pattern', icon: '↔️', title: 'Movement Pattern' },
    { id: 3, name: 'Level', icon: '📊', title: 'Your Experience' },
    { id: 4, name: 'Type', icon: '🎯', title: 'Exercise Preference' },
    { id: 5, name: 'Generate', icon: '🤖', title: 'Generate Routine' },
    { id: 6, name: 'Preview', icon: '👁️', title: 'Preview Routine' },
    { id: 7, name: 'Save', icon: '💾', title: 'Save Routine' }
];

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION RULES
// ═══════════════════════════════════════════════════════════════════════════

export const VALIDATION_RULES = {
    maxPrimaryMuscleGroups: 2,
    minExercises: 1,
    maxExercises: 12,
    minRoutineNameLength: 2,
    maxRoutineNameLength: 50,
    maxRoutineTime: 90
};
