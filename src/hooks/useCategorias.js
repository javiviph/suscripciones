import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, getFromStorage, saveToStorage, getUserKey } from '../utils/storage';
import { CATEGORIAS_DEFAULT } from '../constants/categorias';

export const useCategorias = (userId) => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load from storage or set defaults
    useEffect(() => {
        if (!userId) {
            setCategorias([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const key = getUserKey(STORAGE_KEYS.CATEGORIES, userId);
        const stored = getFromStorage(key);
        if (stored && stored.length > 0) {
            setCategorias(stored);
        } else {
            setCategorias(CATEGORIAS_DEFAULT);
            saveToStorage(key, CATEGORIAS_DEFAULT);
        }
        setLoading(false);
    }, [userId]);

    // Save whenever it changes
    useEffect(() => {
        if (!loading && userId) {
            const key = getUserKey(STORAGE_KEYS.CATEGORIES, userId);
            saveToStorage(key, categorias);
        }
    }, [categorias, userId, loading]);

    const addCategoria = (categoria) => {
        const newCat = {
            ...categoria,
            id: uuidv4(),
            esPersonalizada: true,
            fechaCreacion: new Date().toISOString()
        };
        setCategorias([...categorias, newCat]);
        return newCat;
    };

    const updateCategoria = (id, data) => {
        setCategorias(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    };

    const deleteCategoria = (id) => {
        // Note: Caller should check if used in subscriptions first
        setCategorias(prev => prev.filter(c => c.id !== id));
    };

    const resetCategorias = () => {
        setCategorias(CATEGORIAS_DEFAULT);
    };

    return {
        categorias,
        loading,
        addCategoria,
        updateCategoria,
        deleteCategoria,
        resetCategorias
    };
};
