/**
 * Progress Calculation Engine
 * 
 * Contains logic for:
 * 1. Volume Load Calculation
 * 2. Estimated 1RM (Epley Formula)
 * 3. Progress Delta Comparison
 */

/**
 * Calculates Total Volume Load for an exercise.
 * Formula: Sum(Reps * Weight).
 * 
 * @param {Array<{weight: number, reps: number}>} sets - Array of set objects
 * @param {number} [userBodyweight=0] - Optional bodyweight to add for 0kg loaded exercises
 * @returns {number} Total volume in kg
 */
export const calculateVolumeLoad = (sets, userBodyweight = 0) => {
    return sets.reduce((total, set) => {
        // Ensure values are numbers
        const weight = parseFloat(set.weight) || 0;
        const reps = parseFloat(set.reps) || 0;

        // Determine effective weight: If weight is 0 (bodyweight), use userBodyweight if provided.
        // Otherwise, assume it's just reps (0 volume load in strict terms, but let's stick to the prompt's hybrid approach)
        const effectiveWeight = weight > 0 ? weight : (userBodyweight > 0 ? userBodyweight : 0);

        // If effective weight is still 0, volume is technically 0.
        return total + (reps * effectiveWeight);
    }, 0);
};

/**
 * Calculates the highest estimated 1RM from the session sets using Epley Formula.
 * Formula: Weight * (1 + Reps/30).
 * Constraint: Valid only for 1 <= Reps <= 15.
 * 
 * @param {Array<{weight: number, reps: number}>} sets 
 * @returns {number|null} Max estimated 1RM or null if no valid sets
 */
export const calculateMax1RM = (sets) => {
    const estimatedMaxes = sets.map(set => {
        const weight = parseFloat(set.weight) || 0;
        const reps = parseFloat(set.reps) || 0;

        // Constraint Check
        if (reps < 1 || reps > 15) return null; // Endurance or invalid range
        if (weight <= 0) return null; // Cannot calc 1RM for 0 weight

        // Epley Formula
        return weight * (1 + (reps / 30));
    }).filter(val => val !== null);

    if (estimatedMaxes.length === 0) return null;

    // Return the maximum 1RM achieved
    return Math.max(...estimatedMaxes);
};

/**
 * Generates the comparison verdict and deltas between current and previous sessions.
 * 
 * @param {{volume: number, max1RM: number|null}} current 
 * @param {{volume: number, max1RM: number|null}|null} previous 
 * @returns {{volumeDeltaPercent: number|null, strengthDeltaKg: number|null, verdict: string}}
 */
export const compareProgress = (current, previous) => {
    if (!previous) {
        return {
            volumeDeltaPercent: null,
            strengthDeltaKg: null,
            verdict: "Baseline Established"
        };
    }

    // Volume Delta (%)
    let volumeDeltaPercent = null;
    if (previous.volume > 0) {
        volumeDeltaPercent = ((current.volume - previous.volume) / previous.volume) * 100;
    } else if (current.volume > 0) {
        volumeDeltaPercent = 100; // 0 to something is 100% "increase" roughly speaking
    } else {
        volumeDeltaPercent = 0;
    }

    // Strength Delta (Absolute Kg)
    let strengthDeltaKg = null;
    if (current.max1RM !== null && previous.max1RM !== null) {
        strengthDeltaKg = current.max1RM - previous.max1RM;
    }

    // Verdict Logic
    let verdict = "Maintenance";

    // Priority to Strength gains for "Progressive Overload"
    if (strengthDeltaKg !== null && strengthDeltaKg > 0) {
        verdict = "Progressive Overload Achieved";
    } else if (volumeDeltaPercent > 2.5) {
        // If strength didn't go up but volume did significantly (>2.5%)
        verdict = "Volume Progression";
    } else if (strengthDeltaKg !== null && strengthDeltaKg < -5) {
        verdict = "Regression / Fatigue";
    } else if (volumeDeltaPercent < -10) {
        verdict = "Deload";
    }

    return {
        volumeDeltaPercent: parseFloat(volumeDeltaPercent.toFixed(1)),
        strengthDeltaKg: strengthDeltaKg !== null ? parseFloat(strengthDeltaKg.toFixed(1)) : null,
        verdict
    };
};
