
import { useMemo, useState } from 'react';
import { calculateSessionStats } from '../utils/statsEngine';

/**
 * useStats HOOK
 * 
 * Bridges the gap between raw data (localStorage) and the View.
 * Handles:
 * 1. Memoization of expensive calculations.
 * 2. Date selection state.
 * 3. History aggregation.
 */
export const useStats = (workoutData, getPreviousBest) => {

    // --- State ---
    const getTodayStr = () => new Date().toLocaleDateString('en-CA');
    const [selectedDayKey, setSelectedDayKey] = useState(getTodayStr());

    // --- 1. Daily Stats (Selected Day) ---
    const dayStats = useMemo(() => {
        if (!workoutData || !selectedDayKey) return null;

        const log = workoutData[selectedDayKey];
        if (!log) return null;

        // Use Engine
        return calculateSessionStats(log, getPreviousBest);
    }, [workoutData, selectedDayKey, getPreviousBest]);

    // --- 2. Historical Aggregation (Linear Scan) ---
    const history = useMemo(() => {
        if (!workoutData) return { labels: [], datasets: {}, totalWorkouts: 0, currentStreak: 0, discipline: 0 };

        const dates = Object.keys(workoutData).sort();

        // Arrays for Charts
        const labels = [];
        const sVol = [];
        const cMin = [];
        const cDist = [];
        const aRep = [];

        // Counters
        let sCount = 0, cCount = 0, aCount = 0;
        let totalVol = 0;
        let globalScoreSum = 0;

        dates.forEach(date => {
            const log = workoutData[date];
            // Safe Calculate
            const stats = calculateSessionStats(log, getPreviousBest);

            // Valid Session Check (Must have done *something*)
            if (stats.hasStrength || stats.hasCardio || stats.hasCore) {
                // Formatting Date
                // We use UTC split to avoid timezone shifts on labels
                const [y, m, d] = date.split('-').map(Number);
                const localDate = new Date(y, m - 1, d); // Construct 00:00 local
                labels.push(localDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

                sVol.push(stats.strengthVol);
                cMin.push(stats.cMin);
                cDist.push(stats.cDist);
                aRep.push(stats.aRep);

                if (stats.hasStrength) sCount++;
                if (stats.hasCardio) cCount++;
                if (stats.hasCore) aCount++;

                totalVol += stats.strengthVol;
                globalScoreSum += stats.score;
            }
        });

        // Streak Calculation
        let currentStreak = 0;
        if (dates.length > 0) {
            const todayStr = getTodayStr();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toLocaleDateString('en-CA');

            const lastDate = dates[dates.length - 1];

            // Streak only alive if worked out Today OR Yesterday
            if (lastDate === todayStr || lastDate === yesterdayStr) {
                currentStreak = 1;
                // Backwards scan
                for (let i = dates.length - 2; i >= 0; i--) {
                    const curr = new Date(dates[i]);
                    const next = new Date(dates[i + 1]);
                    const diffTime = Math.abs(next - curr);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 1) currentStreak++;
                    else break;
                }
            }
        }

        // Global Discipline (Avg Score)
        const discipline = labels.length > 0 ? Math.round(globalScoreSum / labels.length) : 0;

        return {
            labels,
            datasets: { sVol, cMin, cDist, aRep },
            distribution: [sCount, cCount, aCount],
            totalWorkouts: labels.length, // Only valid ones
            currentStreak,
            totalVol,
            discipline
        };
    }, [workoutData, getPreviousBest]);

    return {
        selectedDayKey,
        dayStats,
        history,
        selectDate: setSelectedDayKey
    };
};
