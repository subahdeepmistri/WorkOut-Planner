
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
        const cLoad = [];
        const aRep = [];
        const aHold = [];

        // Counters
        let sCount = 0, cCount = 0, aCount = 0;
        let totalVol = 0;
        let totalCardioMin = 0;
        let totalCardioDist = 0;
        let totalCoreReps = 0;
        let totalCoreHold = 0;
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

                const sLoad = stats.strengthVol;

                // Cardio Load Calculation:
                // If cMin (Total Time) exists, use it.
                // If cDist exist but Time is 0 (user didn't enter time), approximate effort (1km ~ 5min).
                const calculatedLoad = stats.cMin > 0
                    ? stats.cMin
                    : (stats.cDist * 5);

                sVol.push(sLoad);
                cMin.push(stats.cMin);
                cDist.push(stats.cDist);
                cLoad.push(calculatedLoad);
                aRep.push(stats.aRep);
                aHold.push(stats.aHold);

                if (stats.hasStrength) sCount++;
                if (stats.hasCardio) cCount++;
                if (stats.hasCore) aCount++;

                totalVol += stats.strengthVol;
                totalCardioMin += stats.cMin;
                totalCardioDist += stats.cDist;
                totalCoreReps += stats.aRep;
                totalCoreHold += stats.aHold;
                globalScoreSum += stats.score;
            }
        });

        // Streak Calculation
        let currentStreak = 0;
        if (dates.length > 0) {
            const parseLocal = (s) => {
                const [y, m, d] = s.split('-').map(Number);
                return new Date(y, m - 1, d);
            };

            const lastDateStr = dates[dates.length - 1];
            const lastDateObj = parseLocal(lastDateStr);
            const todayObj = new Date();
            todayObj.setHours(0, 0, 0, 0);

            const msPerDay = 1000 * 60 * 60 * 24;
            const daysSinceLast = Math.round((todayObj - lastDateObj) / msPerDay);

            let isAlive = false;

            if (daysSinceLast === 0) isAlive = true; // Today
            else if (daysSinceLast === 1) isAlive = true; // Yesterday
            else if (daysSinceLast === 2) {
                // Check if yesterday was Tuesday (Gym Closed)
                const yesterday = new Date(todayObj);
                yesterday.setDate(yesterday.getDate() - 1);
                if (yesterday.getDay() === 2) isAlive = true;
            }

            if (isAlive) {
                currentStreak = 1;
                // Backwards scan
                for (let i = dates.length - 2; i >= 0; i--) {
                    const curr = parseLocal(dates[i]);
                    const next = parseLocal(dates[i + 1]);
                    const diff = Math.round((next - curr) / msPerDay);

                    if (diff === 1) {
                        currentStreak++;
                    } else if (diff === 2) {
                        // Check if the gap day was Tuesday
                        const gapDay = new Date(curr);
                        gapDay.setDate(gapDay.getDate() + 1);

                        if (gapDay.getDay() === 2) {
                            currentStreak++; // Bridge the gap
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        // Global Discipline (Avg Score)
        const discipline = labels.length > 0 ? Math.round(globalScoreSum / labels.length) : 0;

        // User Journey Stage Calculation
        // Stage 0: 0 workouts (Day 0-1)
        // Stage 1: 1 workout (Day 1-2)
        // Stage 2: 2-4 workouts (Day 3-4)
        // Stage 3: 5-7 workouts (Day 5-7)
        // Stage 4: 8-14 workouts (Day 8-14)
        // Stage 5: 15+ workouts (Day 15+)
        let userStage = 0;
        const total = labels.length;
        if (total >= 15) userStage = 5;
        else if (total >= 8) userStage = 4;
        else if (total >= 5) userStage = 3;
        else if (total >= 2) userStage = 2;
        else if (total === 1) userStage = 1;

        // Monthly Stats Calculation (Current Month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let monthSessions = 0;
        let monthFocus = { Strength: 0, Cardio: 0, Core: 0 };

        // We need to re-scan for monthly specific stats or filter 'dates'
        // Since 'dates' are sorted strings YYYY-MM-DD
        dates.forEach(date => {
            const [y, m, d] = date.split('-').map(Number);
            const localDate = new Date(y, m - 1, d);
            if (localDate.getMonth() === currentMonth && localDate.getFullYear() === currentYear) {
                monthSessions++;
                const log = workoutData[date];
                const stats = calculateSessionStats(log, getPreviousBest);
                if (stats.hasStrength) monthFocus.Strength++;
                if (stats.hasCardio) monthFocus.Cardio++;
                if (stats.hasCore) monthFocus.Core++;
            }
        });

        const topFocus = Object.entries(monthFocus).reduce((a, b) => a[1] > b[1] ? a : b)[0];

        return {
            labels,
            datasets: { sVol, cMin, cDist, cLoad, aRep, aHold },
            distribution: [sCount, cCount, aCount],
            totalWorkouts: total, // Only valid ones
            currentStreak,
            totalVol,
            discipline,
            userStage,
            monthlyStats: {
                sessions: monthSessions,
                topFocus: monthFocus[topFocus] > 0 ? topFocus : "Mixed"
            },
            lifetimeStats: {
                strengthVol: totalVol,
                cardioDist: totalCardioDist,
                cardioMin: totalCardioMin,
                coreReps: totalCoreReps,
                coreHold: totalCoreHold
            }
        };
    }, [workoutData, getPreviousBest]);

    return {
        selectedDayKey,
        dayStats,
        history,
        selectDate: setSelectedDayKey
    };
};
