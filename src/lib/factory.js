import { StrengthExercise, CardioExercise, AbsExercise } from './models';

export const ExerciseFactory = {
    create: (data) => {
        const safeData = data || {};
        switch (safeData.type) {
            case 'cardio': return new CardioExercise(safeData);
            case 'abs': return new AbsExercise(safeData);
            case 'strength':
            default: return new StrengthExercise(safeData);
        }
    }
};
