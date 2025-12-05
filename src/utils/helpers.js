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
