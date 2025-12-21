import { useMemo } from 'react';
import { Sparkles, TrendingUp, Copy, Activity } from 'lucide-react';

/**
 * useAiCoach
 * Analyzes exercise history and context to provide intelligent, optional suggestions.
 * 
 * @param {Object} exercise - The current exercise object containing all sets.
 * @param {number} index - The index of the current set being edited.
 * @returns {Array} suggestions - Array of suggestion objects.
 */
export const useAiCoach = (exercise, index) => {
    return useMemo(() => {
        if (!exercise || index === 0) return []; // No history for first set

        const suggestions = [];
        const prevSet = exercise.sets[index - 1];

        // Guard: Only suggest if previous set was completed
        if (!prevSet || !prevSet.completed) return [];

        const type = exercise.type;
        const cardioMode = exercise.cardioMode;
        const coreMode = exercise.coreMode;



        // --- 2. Progressive Overload & Specifics ---

        if (type === 'cardio') {
            if (cardioMode === 'distance') {
                // Pace Coach
                if (prevSet.pace) {
                    suggestions.push({
                        id: 'match_pace',
                        label: `Match Pace`,
                        subLabel: `${prevSet.pace}`,
                        icon: Activity,
                        action: 'MATCH_PACE',
                        // Payload typically implies copying Time if Distance is set, or vice versa?
                        // For now, simple copy logic handled by receiver
                        payload: { pace: prevSet.pace, distance: prevSet.distance, time: prevSet.time },
                        style: 'blue'
                    });
                }

            } else {
                // Circuit / Time
                // No suggestions for now
            }
        }

        else if (type === 'abs') {
            if (coreMode === 'hold') {
                // Parse Hold Time (mm:ss or seconds)
                // Just simpler heuristic: Suggest +5s
                suggestions.push({
                    id: 'prog_hold',
                    label: '+5s',
                    icon: TrendingUp,
                    action: 'ADJUST_TIME', // Special handler for mm:ss
                    field: 'holdTime',
                    value: 5,
                    style: 'emerald'
                });
            } else {
                // Reps
                suggestions.push({
                    id: 'prog_reps',
                    label: '+2 Reps',
                    icon: TrendingUp,
                    action: 'ADJUST',
                    field: 'reps',
                    value: 2,
                    style: 'emerald'
                });
            }
        }

        else {
            // Strength
            // Suggest small weight bump
            const prevWeight = parseFloat(prevSet.weight) || 0;
            if (prevWeight > 0) {
                const inc = prevWeight < 20 ? 1.25 : 2.5;
                suggestions.push({
                    id: 'prog_weight',
                    label: `+${inc} kg`,
                    icon: TrendingUp,
                    action: 'ADJUST',
                    field: 'weight',
                    value: inc,
                    style: 'emerald'
                });
            }
        }

        return suggestions;

    }, [exercise, index]);
};
