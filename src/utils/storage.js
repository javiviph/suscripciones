export const STORAGE_KEYS = {
    SUBSCRIPTIONS: 'suscripciones_v1',
    CATEGORIES: 'categorias_v1',
};

export const getFromStorage = (key, defaultValue = null) => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

export const saveToStorage = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

export const removeFromStorage = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
    }
};
