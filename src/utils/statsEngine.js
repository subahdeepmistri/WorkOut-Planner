
/**
 * STATS ENGINE v1.0
 * 
 * A pure-logic module for transforming raw workout data into safe, consumed metrics.
 * 
 * PRINCIPLES:
 * 1. DEFENSIVE: Never assumes data exists. Always defaults to 0/[]/false.
 * 2. STRICT: Distinguishes between 0 (performed) and null/undefined (missing).
 * 3. ISOLATED: No external dependencies (like React or localStorage).
 */

// --- Constants ---
const DEFAULT_TARGET_REPS = 8;
const DEFAULT_TARGET_SETS = 3;

// --- Flag Helpers ---
const isCardio = (type) => type === 'cardio';
const isCore = (type) => type === 'abs';
const isStrength = (type) => !isCardio(type) && !isCore(type);

/**
 * Normalizes a potentially messy number input.
 * Returns 0 if invalid, NaN, or <=0 (unless allowZero is true).
 */
const safeFloat = (val, fallback = 0) => {
    const num = parseFloat(val);
    if (isNaN(num)) return fallback;
    return num;
};

/**
 * Calculates metrics for a single exercise sessions.
 * @param {Object} ex - The raw exercise object
 * @param {Function|null} getPreviousBest - Optional callback for reference weights
 */
const calculateExerciseLoad = (ex, getPreviousBest) => {
    if (!ex || !Array.isArray(ex.sets)) return { actualVol: 0, targetVol: 0, rawVol: 0, type: 'unknown' };

    const tReps = ex.numericalTargetReps || DEFAULT_TARGET_REPS;
    const tSets = ex.targetSets || DEFAULT_TARGET_SETS;

    // Determine Type
    const type = ex.type || 'strength';

    // Determine Reference Weight (for Score Calculation)
    let refWeight = 0;
    try {
        if (typeof getPreviousBest === 'function') {
            const pb = getPreviousBest(ex.name);
            if (pb && pb.weight) refWeight = safeFloat(pb.weight, 0);
        }
    } catch (err) {
        // Silently fail external call
    }

    // Auto-calculate refWeight if missing (average of used weights)
    if (refWeight === 0 && isStrength(type)) {
        const validWeights = ex.sets
            .map(s => safeFloat(s.weight))
            .filter(w => w > 0);

        if (validWeights.length > 0) {
            refWeight = validWeights.reduce((a, b) => a + b, 0) / validWeights.length;
        }
    }
    const calcEffectiveWeight = refWeight > 0 ? refWeight : 1; // Prevent div by zero in scoring

    // Accumulators
    let actualVol = 0; // The "Score" volume (reps * weight)
    let rawVol = 0;    // The "Real" volume (kg, distance, etc)

    // Target Volume (Score Denominator)
    let targetVol = 0;
    if (isCardio(type) || isCore(type)) {
        targetVol = tSets * tReps;
    } else {
        targetVol = tSets * tReps * calcEffectiveWeight;
    }

    // --- Process Sets ---
    ex.sets.forEach(set => {
        if (!set || !set.completed) return;

        if (isCardio(type)) {
            // Cardio: Distance OR Time
            const val = ex.cardioMode === 'circuit'
                ? safeFloat(set.time)
                : safeFloat(set.distance);

            // Score = Val (or Target Reps if val is 0 but marked complete)
            const score = val > 0 ? val : tReps;

            actualVol += score;
            rawVol += val; // Strict raw
        }
        else if (isCore(type)) {
            // Core: Reps OR Hold
            let val = safeFloat(set.reps);
            if (ex.coreMode === 'hold') val = safeFloat(set.holdTime);

            const score = val > 0 ? val : tReps;

            actualVol += score;
            rawVol += val; // Strict raw
        }
        else {
            // Strength: Reps * Weight
            let r = safeFloat(set.reps);
            let w = safeFloat(set.weight);

            // Fallbacks for Score
            const effR = r > 0 ? r : tReps;
            const effW = w > 0 ? w : calcEffectiveWeight;

            actualVol += (effR * effW);
            rawVol += (r * w); // Strict raw (mass moved)
        }
    });

    return { actualVol, targetVol, rawVol, type };
};

/**
 * Calculates the score (0-100) for a given session.
 */
export const calculateSessionStats = (log, getPreviousBest) => {
    // 1. Armor Plate
    if (!log || !Array.isArray(log.exercises)) {
        return {
            score: 0,
            totalVol: 0,
            duration: '0m',

            // Classification Flags
            hasStrength: false,
            hasCardio: false,
            hasCore: false,

            // Raw Aggregates
            strengthVol: 0,
            cardioVol: 0, // distance + time mixed (deprecated)

            // Granular Aggregates
            cMin: 0, cDist: 0, aRep: 0
        };
    }

    // 2. Accumulators
    let totalActual = 0;
    let totalTarget = 0;

    let strengthVol = 0;
    let cMin = 0;
    let cDist = 0;
    let aRep = 0;

    let hasStrength = false;
    let hasCardio = false;
    let hasCore = false;

    // 3. Iterate
    log.exercises.forEach(ex => {
        if (!ex) return; // Skip bad data

        const load = calculateExerciseLoad(ex, getPreviousBest);

        // Update Globals
        totalActual += load.actualVol;
        totalTarget += load.targetVol;

        // Update Specifics
        if (isStrength(load.type)) {
            hasStrength = true;
            strengthVol += load.rawVol;
        }
        else if (isCardio(load.type)) {
            hasCardio = true;
            // For cardio, we need to inspect mode again for granular stats
            // (Engine re-loop for strictness)
            ex.sets.forEach(s => {
                if (s && s.completed) {
                    if (ex.cardioMode === 'circuit') cMin += safeFloat(s.time);
                    else cDist += safeFloat(s.distance);
                }
            });
        }
        else if (isCore(load.type)) {
            hasCore = true;
            aRep += load.rawVol;
        }
    });

    // 4. Score Calculation
    const div = totalTarget > 0 ? totalTarget : 1;
    let score = Math.round((totalActual / div) * 100);
    if (score > 100) score = 100; // Cap at 100%

    // 5. Duration
    let duration = "0m";
    if (log.startTime && log.endTime) {
        const diff = safeFloat(log.endTime) - safeFloat(log.startTime);
        if (diff > 0) {
            const mins = Math.floor(diff / 60000);
            duration = `${mins}m`;
        }
    }

    return {
        score,
        totalVol: strengthVol, // Total "Lifts" volume
        duration,

        hasStrength,
        hasCardio,
        hasCore,

        strengthVol,
        cMin,
        cDist,
        aRep
    };
};
