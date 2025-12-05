export class Exercise {
    constructor(data) {
        this.id = data.id || Date.now() + Math.random();
        this.name = data.name || 'New Exercise';
        this.type = data.type || 'strength';
        this.restSeconds = data.restSeconds || 30;

        if (Array.isArray(data.sets)) {
            this.sets = data.sets;
        } else if (typeof data.sets === 'number') {
            this.sets = Array(data.sets).fill(null).map(() => ({
                weight: data.weight || 0,
                reps: data.reps || 0,
                targetReps: data.reps || 10,
                done: false
            }));
        } else {
            this.sets = [];
        }
    }

    addSet() { return this; }
    removeSet(index) {
        this.sets = this.sets.filter((_, i) => i !== index);
        return this;
    }
    updateSet(index, field, value) {
        if (this.sets[index]) {
            this.sets[index] = { ...this.sets[index], [field]: value };
        }
        return this;
    }
}

export class StrengthExercise extends Exercise {
    constructor(data) {
        super({ ...data, type: 'strength' });
        if (this.sets.length === 0) this.addSet();
    }

    addSet() {
        const lastSet = this.sets[this.sets.length - 1] || { weight: 0, reps: 0, targetReps: 10 };
        this.sets.push({ ...lastSet, done: false });
        return this;
    }
}

export class CardioExercise extends Exercise {
    constructor(data) {
        super({ ...data, type: 'cardio' });
        this.cardioType = data.cardioType || 'distance';
        if (this.sets.length === 0) this.addSet();
    }

    addSet() {
        this.sets.push({ time: 0, distance: 0, reps: 0, rest: 30, done: false });
        return this;
    }
}

export class AbsExercise extends Exercise {
    constructor(data) {
        super({ ...data, type: 'abs' });
        if (this.sets.length === 0) this.addSet();
    }

    addSet() {
        this.sets.push({ reps: 0, holdTime: 0, rest: 30, done: false });
        return this;
    }
}
