
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
            // TIME (sec) -> MIN
            const isTimeMode = (ex.cardioMode === 'circuit' || ex.cardioMode === 'duration');
            const rawVal = isTimeMode ? safeFloat(set.time) : safeFloat(set.distance);

            // Normalized Value for Score (Minutes or Km)
            const scoreVal = isTimeMode ? (rawVal / 60) : rawVal;

            // Score = Val (or Target Reps if val is 0 but marked complete)
            const score = scoreVal > 0 ? scoreVal : tReps;

            actualVol += score;
            rawVol += scoreVal; // Normalized to Minutes or Km
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
            cMin: 0, cDist: 0, aRep: 0,
            cCircuitMin: 0, cDistMin: 0,
            aHold: 0
        };
    }

    // 2. Accumulators
    let totalActual = 0;
    let totalTarget = 0;

    let strengthVol = 0;
    let cMin = 0;
    let cDist = 0;
    let aRep = 0;
    let aHold = 0;

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
                    if (ex.cardioMode === 'circuit' || ex.cardioMode === 'duration') cMin += safeFloat(s.time);
                    else cDist += safeFloat(s.distance);
                }
            });
        }
        else if (isCore(load.type)) {
            hasCore = true;
            if (ex.coreMode === 'hold') {
                aHold += load.rawVol;
            } else {
                aRep += load.rawVol;
            }
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

    // --- PERFECT CARDIO DATA SCHEMA IMPLEMENTATION ---
    // Rule 8: todayCardioTime = sum(TIME.totalTimeMin) + sum(DIST.totalTimeMin)
    // Rule 8: todayDistance = sum(DIST.summary.totalDistanceKm)

    let schemaTimeMin = 0;
    let schemaCircuitMin = 0; // Pure Time-Mode Time
    let schemaDistTimeMin = 0; // Time associated with Distance
    let schemaDistKm = 0;

    // Helper to process a batch of sets for cardio stats
    const processCardioSets = (sets, mode) => {
        sets.forEach(s => {
            if (s && s.completed) {
                // TIME MODE (Circuit/Duration)
                if (mode === 'circuit' || mode === 'duration') {
                    const tSec = safeFloat(s.time);
                    const tMin = tSec / 60; // Convert Seconds to Minutes
                    schemaTimeMin += tMin;
                    schemaCircuitMin += tMin;
                }
                // DIST MODE (Distance)
                else {
                    schemaDistKm += safeFloat(s.distance);
                    // Critical: Add TIME from DIST mode if available (Pace calculation needs it)
                    if (s.time) {
                        const tMin = safeFloat(s.time); // Input is Minutes
                        schemaTimeMin += tMin;
                        schemaDistTimeMin += tMin;
                    }
                }
            }
        });
    }

    // Check Cardio Exercises again for Schema-Compliant Aggregation
    log.exercises.forEach(ex => {
        if (!ex || !isCardio(ex.type)) return;

        // 1. Process Active Sets
        if (Array.isArray(ex.sets)) {
            processCardioSets(ex.sets, ex.cardioMode);
        }

        // 2. Process Backpack (Stored Sets)
        // This ensures hidden data (e.g. from Time mode while in Dist mode) is retained in stats
        if (ex.storedSets) {
            Object.keys(ex.storedSets).forEach(modeKey => {
                // Skip the current mode to avoid double counting (since ex.sets IS current mode)
                if (modeKey === ex.cardioMode) return;

                const sets = ex.storedSets[modeKey];
                if (Array.isArray(sets)) {
                    processCardioSets(sets, modeKey);
                }
            });
        }
    });

    return {
        score,
        totalVol: strengthVol, // Total "Lifts" volume
        duration,

        hasStrength,
        hasCardio,
        hasCore,

        strengthVol,
        // cMin: Total Time (Rule 8 compliant) - Used for Graphs/Load
        cMin: schemaTimeMin,
        // cDist: Total Distance
        cDist: schemaDistKm,
        // Granular Splits for UI Cards
        cCircuitMin: schemaCircuitMin, // Time from TIME-mode
        cDistMin: schemaDistTimeMin,   // Time from DIST-mode
        aRep,
        aHold
    };
};
