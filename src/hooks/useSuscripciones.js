import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage';

export const useSuscripciones = () => {
    const [suscripciones, setSuscripciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = getFromStorage(STORAGE_KEYS.SUBSCRIPTIONS, []);
        setSuscripciones(stored);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            saveToStorage(STORAGE_KEYS.SUBSCRIPTIONS, suscripciones);
        }
    }, [suscripciones, loading]);

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
