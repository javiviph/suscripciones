import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, getFromStorage, saveToStorage, getUserKey } from '../utils/storage';

export const useSuscripciones = (userId) => {
    const [suscripciones, setSuscripciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setSuscripciones([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const key = getUserKey(STORAGE_KEYS.SUBSCRIPTIONS, userId);
        const stored = getFromStorage(key, []);
        setSuscripciones(stored);
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        if (!loading && userId) {
            const key = getUserKey(STORAGE_KEYS.SUBSCRIPTIONS, userId);
            saveToStorage(key, suscripciones);
        }
    }, [suscripciones, userId, loading]);

    const addSuscripcion = (data) => {
        const newSub = {
            ...data,
            id: uuidv4(),
            fechaCreacion: new Date().toISOString(),
            fechaUltimaModificacion: new Date().toISOString(),
            estado: data.estado || 'activa',
            historialPrecios: []
            // Additional fields should be handled by form before passing here or validated
        };
        setSuscripciones(prev => [...prev, newSub]);
        return newSub;
    };

    const updateSuscripcion = (id, data, guardarHistorial = false) => {
        setSuscripciones(prev => prev.map(sub => {
            if (sub.id !== id) return sub;

            let historial = [...(sub.historialPrecios || [])];

            // Logic for price history
            if (guardarHistorial && data.precio !== sub.precio) {
                historial.push({
                    fecha: new Date().toISOString(),
                    precioAnterior: sub.precio,
                    precioNuevo: data.precio
                });
            }

            return {
                ...sub,
                ...data,
                historialPrecios: historial,
                fechaUltimaModificacion: new Date().toISOString()
            };
        }));
    };

    const deleteSuscripcion = (id) => {
        setSuscripciones(prev => prev.filter(s => s.id !== id));
    };

    return {
        suscripciones,
        loading,
        addSuscripcion,
        updateSuscripcion,
        deleteSuscripcion
    };
};
