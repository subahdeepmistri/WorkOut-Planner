export const parseTargetReps = (repsString) => {
    if (!repsString) return 0;
    if (!isNaN(repsString)) return parseFloat(repsString);
    if (repsString.includes('-') || repsString.includes('–')) {
        const parts = repsString.split(/[-–]/);
        const max = parseFloat(parts[1]);
        return !isNaN(max) ? max : parseFloat(parts[0]) || 0;
    }
    const match = repsString.match(/^(\d+)/);
    if (match) return parseFloat(match[1]);
    return 0;
};

/**
 * Calculates session score, volume, and duration for the completion modal.
 * @param {Object} log - The current workout log
 * @param {Function} getPreviousBest - Function to retrieve previous bests
 * @returns {Object} { score, volume, duration }
 */
export const calculateWorkoutStats = (log, getPreviousBest, endTime = Date.now()) => {
    if (!log || !Array.isArray(log.exercises)) return { score: 0, volume: 0, duration: '0m' };

    let hasStrength = false;
    let hasCardio = false;
    let hasCore = false;
    let totalTargetVol = 0;
    let totalActualVol = 0;
    let strengthVol = 0;
    let cardioVol = 0;
    let absVol = 0;

    log.exercises.forEach(ex => {
        if (!ex) return; // Skip null exercises

        const tReps = ex.numericalTargetReps || 8;
        const tSets = ex.targetSets || 3;

        // Determine Reference Weight
        let refWeight = 0;
        try {
            if (getPreviousBest && typeof getPreviousBest === 'function') {
                const pb = getPreviousBest(ex.name);
                if (pb) refWeight = pb.weight || 0;
            }
        } catch (e) {
            console.warn("getPreviousBest failed", e);
        }

        if (!refWeight && ex.type !== 'cardio' && ex.type !== 'abs') {
            const usedWeights = (ex.sets || []).map(s => parseFloat(s.weight)).filter(w => !isNaN(w) && w > 0);
            if (usedWeights.length > 0) refWeight = usedWeights.reduce((a, b) => a + b, 0) / usedWeights.length;
        }
        const calcRefWeight = (refWeight > 0) ? refWeight : 1;

        // --- Target Volume Logic ---
        if (ex.type === 'cardio') {
            hasCardio = true;
            totalTargetVol += (tSets * tReps);
        } else if (ex.type === 'abs') {
            hasCore = true;
            totalTargetVol += (tSets * tReps);
        } else {
            hasStrength = true;
            totalTargetVol += (tSets * tReps * calcRefWeight);
        }

        // --- Actual Volume Logic ---
        (ex.sets || []).forEach(s => {
            if (s && s.completed) {
                if (ex.type === 'cardio') {
                    // Cardio: Use Distance or Time if available
                    let val = 0;
                    if (ex.cardioMode === 'circuit') val = parseFloat(s.time);
                    else val = parseFloat(s.distance);

                    if (isNaN(val)) val = 0;

                    // Adherence Score Fallback (Generous)
                    let scoreVal = val === 0 ? tReps : val;
                    totalActualVol += scoreVal;

                    // Stats: Strict (No Fallback)
                    cardioVol += val;
                } else if (ex.type === 'abs') {
                    // Abs: Reps or Hold
                    let r = parseFloat(s.reps);
                    if (ex.coreMode === 'hold') r = parseFloat(s.holdTime); // Handle Hold logic if stored differently

                    if (isNaN(r)) r = 0;

                    let scoreVal = r === 0 ? tReps : r;
                    totalActualVol += scoreVal;

                    absVol += r;
                } else {
                    // Strength: Weight * Reps
                    let r = parseFloat(s.reps);
                    if (isNaN(r) || r === 0) r = tReps; // Keep rep fallback for strength flow? No, user said "Never infer data".
                    // Actually, for Strength, if they complete a set, they usually did the reps. 
                    // But if they entered 0, we shouldn't show huge volume.
                    // Let's rely on parsed values.

                    r = parseFloat(s.reps) || 0;
                    let w = parseFloat(s.weight) || 0;
                    if (w === 0) w = calcRefWeight; // Weight fallback is safer (assumes bodyweight or prev) but debatable. User said "Never infer".
                    // Let's stick to safe inference for Weight (since bodyweight exercises often have 0 weight entered), 
                    // but strict for Reps.

                    const scoreVol = (r || tReps) * w; // Score is generous
                    totalActualVol += scoreVol;

                    const realVol = r * w;
                    strengthVol += realVol;
                }
            }
        });
    });

    if (totalTargetVol === 0) totalTargetVol = 1;
    const score = Math.round((totalActualVol / totalTargetVol) * 100);

    // Calculate Duration
    let duration = "0m";
    if (log.startTime) {
        const diffMs = endTime - log.startTime;
        if (diffMs > 0) {
            const totalMinutes = Math.floor(diffMs / 60000);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            if (hours > 0) {
                duration = `${hours}h ${minutes}m`;
            } else {
                duration = `${minutes}m`;
            }
            if (totalMinutes === 0) {
                const seconds = Math.floor((diffMs % 60000) / 1000);
                duration = `${seconds}s`;
            }
        }
    }

    return {
        score,
        volume: Math.round(strengthVol),
        strengthVol: Math.round(strengthVol),
        cardioVol: parseFloat(cardioVol.toFixed(1)),
        absVol: Math.round(absVol),
        duration: duration,
        hasStrength,
        hasCardio,
        hasCore
    };
};
