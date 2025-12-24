/**
 * Routine Generator
 * AI-powered routine generation algorithm
 * Generates complete workout routines based on user preferences
 */

import { EXERCISE_DATABASE, getFilteredExercises, getLowImpactCardio } from './exerciseDatabase';
import {
    MUSCLE_GROUPS,
    EXPERIENCE_LEVELS,
    EXERCISE_TYPES,
    TIME_CONSTANTS,
    MOVEMENT_PATTERNS
} from './fitnessConstants';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a complete workout routine based on user preferences
 * @param {Object} config - Generation configuration
 * @param {string[]} config.muscleGroups - Selected muscle groups (max 2 primary)
 * @param {string} config.level - Experience level (beginner/moderate/advanced)
 * @param {string} config.preference - Exercise preference (compound/balanced/isolation)
 * @param {string} config.movementPattern - Push/Pull/Mixed
 * @param {boolean} config.includeCardio - Include cardio finisher
 * @param {boolean} config.includeCore - Include core finisher
 * @param {number} config.timeLimit - Max workout time in minutes (default 65)
 * @returns {Object} Generated routine
 */
export function generateRoutine(config) {
    const {
        muscleGroups = [],
        level = 'moderate',
        preference = 'balanced',
        movementPattern = 'mixed',
        includeCardio = false,
        includeCore = false,
        timeLimit = 65,
        isBrutal = false // For brutal leg days
    } = config;

    // Separate primary and finisher muscle groups
    const primaryGroups = muscleGroups.filter(g => !['cardio', 'core'].includes(g));
    const hasCardioGroup = muscleGroups.includes('cardio') || includeCardio;
    const hasCoreGroup = muscleGroups.includes('core') || includeCore;

    // Get level constraints
    const levelConstraints = { ...EXPERIENCE_LEVELS[level].constraints };

    // ═══════════════════════════════════════════════════════════════════════════
    // EXERCISE COUNT RULES - Based on workout type
    // ═══════════════════════════════════════════════════════════════════════════

    // Detect workout type
    const isLegDay = primaryGroups.length === 1 && primaryGroups[0] === 'legs';
    const isPushPullLeg = ['push', 'pull'].includes(movementPattern) || isLegDay;
    const isFullBody = primaryGroups.length >= 4;
    const isSingleMuscle = primaryGroups.length === 1;
    const isDoubleMuscle = primaryGroups.length === 2;

    // Set target exercise counts
    let minExercises, targetExercises;

    if (isFullBody) {
        // Full Body: 10 exercises (2 per body part × 5 body parts)
        minExercises = 10;
        targetExercises = 10;
        levelConstraints.maxExercisesPerMuscle = 2; // 2 exercises per muscle group
        // For Full Body, compress sets to fit more exercises
        levelConstraints.compressedSets = true;
        levelConstraints.maxSetsPerExercise = 3; // Limit sets to fit 10 exercises
        levelConstraints.maxTotalSets = 35; // 10 exercises × 3-4 sets = 30-40 sets
    } else if (isPushPullLeg) {
        // Push Day / Pull Day / Leg Day: 6-8 exercises
        minExercises = 6;
        targetExercises = 8;
        levelConstraints.maxExercisesPerMuscle = level === 'beginner' ? 4 : 5;
    } else if (isSingleMuscle) {
        // Custom single body part: 6 exercises
        minExercises = 6;
        targetExercises = 6;
        levelConstraints.maxExercisesPerMuscle = 6; // All 6 exercises go to one muscle
    } else if (isDoubleMuscle) {
        // Custom 2 body parts: 8 exercises (4 each)
        minExercises = 8;
        targetExercises = 8;
        levelConstraints.maxExercisesPerMuscle = 4; // 4 exercises per muscle
    } else {
        // Custom 3+ body parts: 8 exercises distributed
        minExercises = 6;
        targetExercises = 8;
        levelConstraints.maxExercisesPerMuscle = Math.ceil(8 / primaryGroups.length);
    }

    // Store in constraints for selectExercises
    levelConstraints.minExercises = minExercises;
    levelConstraints.targetExercises = targetExercises;
    levelConstraints.isFullBody = isFullBody;

    // ═══════════════════════════════════════════════════════════════════════════
    // BRUTAL LEG DAY - Extra volume and intensity
    // ═══════════════════════════════════════════════════════════════════════════

    if (isLegDay || isBrutal) {
        // Leg day is ALWAYS brutal - more sets, more volume
        targetExercises = 8; // Push to 8 exercises for legs
        levelConstraints.targetExercises = 8;
        levelConstraints.maxExercisesPerMuscle = level === 'beginner' ? 6 : 8;
        levelConstraints.maxTotalSets = Math.min(levelConstraints.maxTotalSets + 10, 40);
        // Prioritize compound leg movements for brutality
    }

    // Calculate available time budget
    let availableTime = timeLimit;
    // Full Body gets significantly more time to fit 10 exercises
    if (isFullBody) availableTime += 30;
    // Leg day gets extra time
    if (isLegDay) availableTime += 10;
    if (hasCardioGroup) availableTime -= (level === 'beginner' ? 12 : 10);
    if (hasCoreGroup) availableTime -= 5;

    // Build priority queue of exercises
    const priorityQueue = buildPriorityQueue(primaryGroups, level, preference, movementPattern);

    // Select exercises within time budget
    const selectedExercises = selectExercises(priorityQueue, levelConstraints, availableTime, level, isFullBody);

    // Sort by exercise type priority (compounds first)
    selectedExercises.sort((a, b) => {
        const priorityA = EXERCISE_TYPES[a.type]?.priority || 99;
        const priorityB = EXERCISE_TYPES[b.type]?.priority || 99;
        return priorityA - priorityB;
    });

    // Generate warm-up block
    const warmup = generateWarmup(primaryGroups, level);

    // Generate finishers
    const finishers = [];
    if (hasCoreGroup) {
        finishers.push(...generateCoreBlock(level));
    }
    if (hasCardioGroup) {
        finishers.push(generateCardioFinisher(primaryGroups, level));
    }

    // Generate cool-down block
    const cooldown = generateCooldown(primaryGroups);

    // Calculate total time
    const exerciseTime = calculateTotalExerciseTime(selectedExercises, level);
    const finisherTime = finishers.reduce((sum, f) => sum + (f.estimatedTime || 5), 0);
    const totalTime = warmup.duration + exerciseTime + finisherTime + cooldown.duration;

    // Generate routine name
    const routineName = generateRoutineName(primaryGroups, movementPattern, level);

    return {
        id: null, // Will be set when saving
        routineName,
        muscleGroups,
        level,
        pushPullType: movementPattern,
        exercisePreference: preference,

        warmup,
        exercises: selectedExercises.map((ex, index) => ({
            ...ex,
            order: index
        })),
        finishers,
        cooldown,

        totalTime: Math.round(totalTime),
        totalSets: selectedExercises.reduce((sum, ex) => sum + ex.sets, 0),
        totalExercises: selectedExercises.length,

        isAIGenerated: true
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIORITY QUEUE BUILDER
// ═══════════════════════════════════════════════════════════════════════════

function buildPriorityQueue(muscleGroups, level, preference, movementPattern) {
    const queue = [];

    for (const muscleGroup of muscleGroups) {
        // Get exercises for this muscle group filtered by level
        const exercises = getFilteredExercises(muscleGroup, level);

        for (const exercise of exercises) {
            // For push/pull specific workouts, EXCLUDE exercises with opposing pattern
            // This ensures Push Day only gets triceps (push), Pull Day only gets biceps (pull)
            if (movementPattern === 'push' && exercise.movementPattern === 'pull') {
                continue; // Skip pull exercises on push day
            }
            if (movementPattern === 'pull' && exercise.movementPattern === 'push') {
                continue; // Skip push exercises on pull day
            }

            let score = 0;

            // Base score from exercise type
            const typeConfig = EXERCISE_TYPES[exercise.type];
            if (typeConfig) {
                score += (6 - typeConfig.priority) * 20; // Higher priority = higher score
            }

            // STRONG preference enforcement
            if (preference === 'compound') {
                // Compound focus: big bonus for compounds, penalty for isolation
                if (typeConfig?.tag === 'COMPOUND') {
                    score += 50;
                } else if (typeConfig?.tag === 'ISOLATION') {
                    score -= 30; // Reduce isolation priority
                }
            } else if (preference === 'isolation') {
                // Isolation focus: big bonus for isolation, penalty for compounds
                if (typeConfig?.tag === 'ISOLATION') {
                    score += 60; // Strong bonus for isolation
                } else if (typeConfig?.tag === 'COMPOUND') {
                    score -= 40; // Significant penalty for compounds
                }
            } else if (preference === 'balanced') {
                // Balanced: Give isolation a boost to counter their lower base priority
                // Compounds have priority 1-2 (base 100-80), Isolation has priority 3-4 (base 60-40)
                // To balance: boost isolation by ~30 to bring them to similar scoring range
                if (typeConfig?.tag === 'ISOLATION') {
                    score += 30; // Boost isolation to match compound scoring
                }
                // Small bonus for variety
                score += 5;
            }

            // Movement pattern bonus (for mixed workouts, matching patterns get bonus)
            if (exercise.movementPattern === movementPattern) {
                score += 15;
            }

            // Randomization factor (small variance to avoid same routines)
            score += Math.random() * 10;

            queue.push({
                exercise,
                score,
                muscleGroup
            });
        }
    }

    // Sort by score descending
    return queue.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE SELECTOR
// ═══════════════════════════════════════════════════════════════════════════

function selectExercises(priorityQueue, constraints, availableTime, level, isFullBody = false) {
    const selected = [];
    let timeRemaining = availableTime;
    let setsRemaining = constraints.maxTotalSets;
    const muscleExerciseCount = {}; // Track exercises per muscle
    const muscleSetCount = {}; // Track sets per muscle

    // Use target exercises from constraints, default to 8
    const targetExercises = constraints.targetExercises || 8;
    const minExercises = constraints.minExercises || 6;

    for (const item of priorityQueue) {
        const { exercise, muscleGroup } = item;

        // Check muscle group exercise limit
        const currentExerciseCount = muscleExerciseCount[muscleGroup] || 0;
        if (currentExerciseCount >= constraints.maxExercisesPerMuscle) {
            continue;
        }

        // Check if we've already selected this exact exercise
        if (selected.some(s => s.id === exercise.id)) {
            continue;
        }

        // Get default sets/reps for this exercise type and level
        const typeConfig = EXERCISE_TYPES[exercise.type];
        let sets = typeConfig?.defaultSets?.[level] || 3;
        const reps = typeConfig?.defaultReps?.[level] || '10-12';
        const restSeconds = TIME_CONSTANTS.REST_TIMES[exercise.type]?.[level] || 90;

        // For Full Body workouts, compress sets to fit more exercises
        if (constraints.compressedSets && constraints.maxSetsPerExercise) {
            sets = Math.min(sets, constraints.maxSetsPerExercise);
        }

        // Calculate time cost
        let timeCost = calculateExerciseTime({ ...exercise, sets }, level);

        // Try to fit exercise
        if (timeCost <= timeRemaining && sets <= setsRemaining) {
            // Fits perfectly
            selected.push({
                id: exercise.id,
                name: exercise.name,
                type: exercise.type,
                tag: typeConfig?.tag || 'COMPOUND',
                primaryMuscle: exercise.primaryMuscle,
                secondaryMuscle: exercise.secondaryMuscle,
                sets,
                reps,
                rest: restSeconds,
                equipment: exercise.equipment
            });

            timeRemaining -= timeCost;
            setsRemaining -= sets;
            muscleExerciseCount[muscleGroup] = currentExerciseCount + 1;
            muscleSetCount[muscleGroup] = (muscleSetCount[muscleGroup] || 0) + sets;

        } else if (timeRemaining > 5 && selected.length < minExercises) {
            // Try with reduced sets if we haven't hit minimum exercises
            while (sets > 2 && timeCost > timeRemaining) {
                sets--;
                timeCost = calculateExerciseTime({ ...exercise, sets }, level);
            }

            if (sets >= 2 && timeCost <= timeRemaining && sets <= setsRemaining) {
                selected.push({
                    id: exercise.id,
                    name: exercise.name,
                    type: exercise.type,
                    tag: typeConfig?.tag || 'COMPOUND',
                    primaryMuscle: exercise.primaryMuscle,
                    secondaryMuscle: exercise.secondaryMuscle,
                    sets,
                    reps,
                    rest: restSeconds,
                    equipment: exercise.equipment
                });

                timeRemaining -= timeCost;
                setsRemaining -= sets;
                muscleExerciseCount[muscleGroup] = currentExerciseCount + 1;
                muscleSetCount[muscleGroup] = (muscleSetCount[muscleGroup] || 0) + sets;
            }
        }

        // Stop if we've reached target exercises
        if (selected.length >= targetExercises) break;

        // Stop if no time or sets remaining (but only after hitting minimum)
        if ((timeRemaining <= 0 || setsRemaining <= 0) && selected.length >= minExercises) break;
    }

    return selected;
}

// ═══════════════════════════════════════════════════════════════════════════
// TIME CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

function calculateExerciseTime(exercise, level) {
    const timePerSet = TIME_CONSTANTS.TIME_PER_SET[exercise.type] || 40;
    const restTime = TIME_CONSTANTS.REST_TIMES[exercise.type]?.[level] || 90;

    // Time = (sets × work time) + ((sets - 1) × rest) + transition
    const workTime = exercise.sets * timePerSet;
    const restTotal = (exercise.sets - 1) * restTime;
    const transitionTime = 30; // 30 seconds to move between exercises

    return (workTime + restTotal + transitionTime) / 60; // Convert to minutes
}

function calculateTotalExerciseTime(exercises, level) {
    return exercises.reduce((total, ex) => total + calculateExerciseTime(ex, level), 0);
}

// ═══════════════════════════════════════════════════════════════════════════
// WARM-UP GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateWarmup(muscleGroups, level) {
    const duration = level === 'beginner' ? 15 : 12;
    const exercises = [];

    // General cardio
    exercises.push({
        name: 'Light Cardio (Treadmill/Bike)',
        duration: '5 min',
        notes: 'Low intensity, gradually increase heart rate'
    });

    // Dynamic stretches based on muscle groups
    const dynamicStretches = {
        chest: ['Arm Circles', 'Chest Opener Stretch'],
        back: ['Cat-Cow Stretch', 'Thoracic Rotations'],
        legs: ['Leg Swings', 'Walking Lunges', 'Bodyweight Squats'],
        shoulders: ['Arm Circles', 'Wall Slides'],
        arms: ['Wrist Circles', 'Arm Swings']
    };

    for (const group of muscleGroups) {
        const stretches = dynamicStretches[group];
        if (stretches && stretches.length > 0) {
            exercises.push({
                name: stretches[0],
                duration: '1-2 min',
                notes: `Prepare ${group} for movement`
            });
        }
    }

    // Warm-up sets
    exercises.push({
        name: 'Light Warm-up Sets',
        duration: '3-5 min',
        notes: '2-3 sets at 50% working weight of first exercise'
    });

    return {
        duration,
        exercises
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// COOL-DOWN GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateCooldown(muscleGroups) {
    const exercises = [];

    const stretches = {
        chest: { name: 'Chest Doorway Stretch', duration: '1-2 min' },
        back: { name: 'Child\'s Pose', duration: '1-2 min' },
        legs: { name: 'Quad & Hamstring Stretch', duration: '2-3 min' },
        shoulders: { name: 'Cross-Body Shoulder Stretch', duration: '1 min' },
        arms: { name: 'Bicep & Tricep Stretch', duration: '1 min' }
    };

    for (const group of muscleGroups) {
        if (stretches[group]) {
            exercises.push(stretches[group]);
        }
    }

    exercises.push({
        name: 'Deep Breathing & Relaxation',
        duration: '2 min'
    });

    return {
        duration: 10,
        exercises
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// FINISHER GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

function generateCoreBlock(level) {
    const coreExercises = getFilteredExercises('core', level);
    const selected = [];

    // Pick 2-3 core exercises
    const shuffled = [...coreExercises].sort(() => Math.random() - 0.5);
    const count = level === 'beginner' ? 2 : 3;

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
        const exercise = shuffled[i];
        const typeConfig = EXERCISE_TYPES[exercise.type];

        selected.push({
            name: exercise.name,
            sets: typeConfig?.defaultSets?.[level] || 3,
            reps: typeConfig?.defaultReps?.[level] || '12-15',
            type: 'core',
            estimatedTime: 3
        });
    }

    return selected;
}

function generateCardioFinisher(muscleGroups, level) {
    // Special rule: Legs + Cardio = Low Impact
    const isLegsDay = muscleGroups.includes('legs');

    let options;
    if (isLegsDay) {
        // Low impact for leg day
        options = getLowImpactCardio();
    } else {
        // Normal cardio based on level
        options = EXERCISE_DATABASE.filter(ex =>
            ex.primaryMuscle === 'cardio' &&
            ex.allowedLevels.includes(level) &&
            (level !== 'beginner' || ex.isSafeForBeginners)
        );
    }

    if (options.length === 0) {
        // Fallback
        return {
            name: 'Incline Walking',
            sets: 1,
            reps: '10-12 min',
            type: 'cardio',
            estimatedTime: 10
        };
    }

    const selected = options[Math.floor(Math.random() * options.length)];
    const typeConfig = EXERCISE_TYPES[selected.type];

    return {
        name: selected.name,
        sets: typeConfig?.defaultSets?.[level] || 1,
        reps: typeConfig?.defaultReps?.[level] || '10 min',
        type: 'cardio',
        estimatedTime: level === 'beginner' ? 12 : 10
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// ROUTINE NAME GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateRoutineName(muscleGroups, movementPattern, level) {
    const muscleNames = muscleGroups
        .map(g => MUSCLE_GROUPS[g]?.name || g)
        .join(' & ');

    const patternName = MOVEMENT_PATTERNS[movementPattern]?.name || '';

    const levelPrefixes = {
        beginner: 'Foundation',
        moderate: 'Power',
        advanced: 'Elite'
    };

    const prefix = levelPrefixes[level] || '';

    if (muscleGroups.length === 1) {
        return `${prefix} ${muscleNames} Day`;
    }

    return `${prefix} ${patternName} ${muscleNames}`.trim();
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION REGENERATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Regenerate only the main workout exercises (keeps finishers, warmup, cooldown)
 * @param {Object} currentRoutine - The current routine to regenerate from
 * @returns {Object} New exercises array
 */
export function regenerateMainWorkout(currentRoutine) {
    const {
        muscleGroups = [],
        level = 'moderate',
        exercisePreference = 'balanced',
        pushPullType = 'mixed'
    } = currentRoutine;

    // Filter to only strength muscle groups
    const primaryGroups = muscleGroups.filter(g => !['cardio', 'core'].includes(g));

    // Get level constraints
    const levelConstraints = { ...EXPERIENCE_LEVELS[level].constraints };

    // FULL BODY MODE handling
    const isFullBody = primaryGroups.length >= 4;
    if (isFullBody) {
        levelConstraints.maxExercisesPerMuscle = primaryGroups.length >= 5 ? 1 : 2;
        levelConstraints.maxTotalSets = Math.min(levelConstraints.maxTotalSets + 5, 30);
    }

    // Calculate available time (estimate from current)
    const availableTime = 45;

    // Build NEW priority queue (shuffled differently)
    const priorityQueue = buildPriorityQueue(primaryGroups, level, exercisePreference, pushPullType);

    // Add random factor to reshuffle results
    priorityQueue.sort((a, b) => (b.score + Math.random() * 20) - (a.score + Math.random() * 20));

    // Select exercises
    const selectedExercises = selectExercises(priorityQueue, levelConstraints, availableTime, level, isFullBody);

    // Sort by type priority
    selectedExercises.sort((a, b) => {
        const priorityA = EXERCISE_TYPES[a.type]?.priority || 99;
        const priorityB = EXERCISE_TYPES[b.type]?.priority || 99;
        return priorityA - priorityB;
    });

    return selectedExercises.map((ex, index) => ({
        ...ex,
        order: index
    }));
}

/**
 * Regenerate only the core/abs finisher section
 * @param {string} level - Experience level
 * @returns {Array} New core finishers array
 */
export function regenerateCoreSection(level = 'moderate') {
    return generateCoreBlock(level);
}

/**
 * Regenerate only the cardio finisher section
 * @param {string[]} muscleGroups - Current muscle groups
 * @param {string} level - Experience level
 * @returns {Object} New cardio finisher
 */
export function regenerateCardioSection(muscleGroups = [], level = 'moderate') {
    const primaryGroups = muscleGroups.filter(g => !['cardio', 'core'].includes(g));
    return generateCardioFinisher(primaryGroups, level);
}

export default generateRoutine;
