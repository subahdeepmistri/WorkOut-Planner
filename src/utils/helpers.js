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
    if (!log) return { score: 0, volume: 0, duration: '0m' };

    let totalTargetVol = 0;
    let totalActualVol = 0;
    let strengthVol = 0;
    let cardioVol = 0;
    let absVol = 0;

    log.exercises.forEach(ex => {
        const tReps = ex.numericalTargetReps || 8;
        const tSets = ex.targetSets || 3;

        // Determine Reference Weight
        let refWeight = getPreviousBest(ex.name)?.weight || 0;
        if (!refWeight && ex.type !== 'cardio' && ex.type !== 'abs') {
            const usedWeights = ex.sets.map(s => parseFloat(s.weight)).filter(w => !isNaN(w) && w > 0);
            if (usedWeights.length > 0) refWeight = usedWeights.reduce((a, b) => a + b, 0) / usedWeights.length;
        }
        const calcRefWeight = (refWeight > 0) ? refWeight : 1;

        // --- Target Volume Logic ---
        if (ex.type === 'cardio') {
            // Cardio: Sets * Target Reps (used as minutes/distance placeholder)
            totalTargetVol += (tSets * tReps);
        } else if (ex.type === 'abs') {
            // Abs: Sets * Target Reps (or Hold Seconds)
            totalTargetVol += (tSets * tReps);
        } else {
            // Strength: Sets * Reps * Weight (Normalized)
            totalTargetVol += (tSets * tReps * calcRefWeight);
        }

        // --- Actual Volume Logic ---
        ex.sets.forEach(s => {
            if (s.completed) {
                if (ex.type === 'cardio') {
                    // Cardio: Use Distance or Time if available, else Target
                    let val = 0;
                    if (ex.cardioMode === 'circuit') val = parseFloat(s.time);
                    else val = parseFloat(s.distance);

                    if (isNaN(val) || val === 0) val = tReps;

                    totalActualVol += val; // For Adherence
                    cardioVol += val;      // For specific stat
                } else if (ex.type === 'abs') {
                    // Abs: Reps
                    let r = parseFloat(s.reps);
                    if (isNaN(r)) r = 0;
                    if (r === 0) r = tReps; // Fallback

                    totalActualVol += r;
                    absVol += r;
                } else {
                    // Strength: Weight * Reps
                    let r = parseFloat(s.reps);
                    if (isNaN(r) || r === 0) r = tReps;

                    let w = parseFloat(s.weight);
                    if (isNaN(w) || w === 0) w = calcRefWeight;

                    const vol = r * w;
                    totalActualVol += vol;
                    strengthVol += vol;
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
            // If less than a minute, show seconds or <1m? User asked for duration. 
            // "45m" style implies minutes. If 0 minutes, maybe show seconds?
            // Let's stick to minutes for now as "Perfect workout time" usually implies min/hours.
            if (totalMinutes === 0) {
                const seconds = Math.floor((diffMs % 60000) / 1000);
                duration = `${seconds}s`;
            }
        }
    }

    return {
        score,
        volume: Math.round(strengthVol), // Keep generic "Volume" as Strength Vol for backward compatibility if needed
        strengthVol: Math.round(strengthVol),
        cardioVol: parseFloat(cardioVol.toFixed(1)),
        absVol: Math.round(absVol),
        duration: duration
    };
};
