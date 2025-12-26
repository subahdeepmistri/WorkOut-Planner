/**
 * Safe LocalStorage Wrapper
 * Handles quota exceeded, invalid JSON, and other edge cases gracefully.
 */
export const safeStorage = {
    /**
     * Get a value from localStorage with safe JSON parsing
     * @param {string} key - Storage key
     * @param {*} fallback - Default value if key doesn't exist or parsing fails
     * @returns {*} Parsed value or fallback
     */
    get: (key, fallback = null) => {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return fallback;
            return JSON.parse(item);
        } catch {
            console.warn(`[safeStorage] Failed to parse key: ${key}`);
            return fallback;
        }
    },

    /**
     * Set a value in localStorage with safe JSON stringification
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
     * @returns {boolean} True if successful, false if failed
     */
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            // Handle QuotaExceededError and other storage failures
            console.warn(`[safeStorage] Failed to save key: ${key}`, error?.name);
            return false;
        }
    },

    /**
     * Remove a key from localStorage
     * @param {string} key - Storage key to remove
     * @returns {boolean} True if successful
     */
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    }
};
